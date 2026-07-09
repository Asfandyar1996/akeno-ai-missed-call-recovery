import { prisma } from "@/lib/db";
import { defaultOnboarding } from "@/lib/defaults";
import { safeJsonParse } from "@/lib/utils";
import { onboardingSchema, type OnboardingInput } from "@/lib/schemas";
import { hasPostgresDatabaseUrl } from "@/lib/services/database-availability";

export async function getLatestOnboarding() {
  if (!hasPostgresDatabaseUrl()) {
    return defaultOnboarding;
  }

  let profile;
  try {
    profile = await prisma.onboardingProfile.findFirst({
      orderBy: { updatedAt: "desc" },
      include: { client: true }
    });
  } catch (error) {
    console.warn("Using blank onboarding defaults because the database is unavailable.", error instanceof Error ? error.message : error);
    return defaultOnboarding;
  }

  if (!profile) return defaultOnboarding;

  return {
    currentStep: profile.step,
    company: {
      roofingCompanyName: profile.client.companyName,
      ownerName: profile.client.ownerName,
      email: profile.client.email,
      website: profile.client.website ?? "",
      businessPhone: profile.client.phone,
      logoDataUrl: profile.client.logoDataUrl ?? "",
      address: profile.client.address ?? "",
      city: profile.client.city ?? "",
      state: profile.client.state ?? "",
      zip: profile.client.zip ?? "",
      timeZone: profile.client.timeZone ?? ""
    },
    services: safeJsonParse(profile.servicesJson, defaultOnboarding.services),
    serviceArea: safeJsonParse(profile.serviceAreaJson, defaultOnboarding.serviceArea),
    phoneConfig: safeJsonParse(profile.phoneConfigJson, defaultOnboarding.phoneConfig),
    agentConfig: safeJsonParse(profile.agentConfigJson, defaultOnboarding.agentConfig),
    leadDestination: safeJsonParse(profile.leadDestinationJson, defaultOnboarding.leadDestination),
    notifications: safeJsonParse(profile.notificationPreferenceJson, defaultOnboarding.notifications),
    compliance: safeJsonParse(profile.complianceJson, defaultOnboarding.compliance)
  } satisfies OnboardingInput;
}

export async function upsertOnboarding(input: OnboardingInput, status = "draft") {
  const data = status === "submitted" ? onboardingSchema.parse(input) : input;
  if (!hasPostgresDatabaseUrl()) {
    return {
      client: {
        id: "sandbox-client",
        companyName: data.company.roofingCompanyName || "Akeno demo roofing company"
      },
      profile: {
        id: "sandbox-profile",
        status,
        step: data.currentStep
      }
    };
  }

  const existing = await prisma.onboardingProfile.findFirst({
    orderBy: { updatedAt: "desc" },
    include: { client: true }
  });

  const clientData = {
    companyName: data.company.roofingCompanyName,
    ownerName: data.company.ownerName,
    email: data.company.email,
    phone: data.company.businessPhone,
    website: data.company.website || null,
    logoDataUrl: data.company.logoDataUrl || null,
    address: data.company.address,
    city: data.company.city,
    state: data.company.state,
    zip: data.company.zip,
    timeZone: data.company.timeZone
  };

  const jsonData = {
    step: data.currentStep,
    status,
    servicesJson: JSON.stringify(data.services),
    serviceAreaJson: JSON.stringify(data.serviceArea),
    phoneConfigJson: JSON.stringify(data.phoneConfig),
    agentConfigJson: JSON.stringify(data.agentConfig),
    leadDestinationJson: JSON.stringify(data.leadDestination),
    notificationPreferenceJson: JSON.stringify(data.notifications),
    complianceJson: JSON.stringify(data.compliance)
  };

  if (existing) {
    const client = await prisma.client.update({
      where: { id: existing.clientId },
      data: clientData
    });
    const profile = await prisma.onboardingProfile.update({
      where: { id: existing.id },
      data: jsonData
    });
    await syncDerivedRecords(client.id, data);
    return { client, profile };
  }

  const client = await prisma.client.create({ data: clientData });
  const profile = await prisma.onboardingProfile.create({
    data: { clientId: client.id, ...jsonData }
  });
  await syncDerivedRecords(client.id, data);
  return { client, profile };
}

async function syncDerivedRecords(clientId: string, data: OnboardingInput) {
  await prisma.serviceArea.deleteMany({ where: { clientId } });
  await prisma.serviceArea.createMany({
    data: [
      ...data.serviceArea.zipCodes.map((value) => ({ clientId, type: "zip", value })),
      ...data.serviceArea.cities
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => ({ clientId, type: "city", value })),
      ...(data.serviceArea.counties ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => ({ clientId, type: "county", value }))
    ]
  });

  await prisma.notificationPreference.deleteMany({ where: { clientId } });
  await prisma.notificationPreference.create({
    data: {
      clientId,
      email: data.notifications.notificationEmail,
      ownerSms: data.notifications.ownerSmsNumber,
      dispatcherSms: data.notifications.dispatcherSmsNumber,
      sendFor: data.notifications.sendFor,
      dailySummary: data.notifications.dailySummary,
      weeklyReport: data.notifications.weeklyReport
    }
  });

  await prisma.integration.upsert({
    where: { id: `${clientId}-${data.leadDestination.destination}` },
    create: {
      id: `${clientId}-${data.leadDestination.destination}`,
      clientId,
      provider: data.leadDestination.destination,
      status: "sandbox_ready",
      configJson: JSON.stringify(data.leadDestination)
    },
    update: {
      provider: data.leadDestination.destination,
      status: "sandbox_ready",
      configJson: JSON.stringify(data.leadDestination)
    }
  });
}

export async function runSandboxWorkflowSetup() {
  const profileData = await getLatestOnboarding();
  const parsed = onboardingSchema.parse({
    ...profileData,
    compliance: {
      termsAccepted: true,
      consentConfirmed: true,
      messagingAcknowledged: true
    }
  });
  if (!hasPostgresDatabaseUrl()) {
    const sandboxClientId = `akeno_sandbox_${Date.now().toString().slice(-5)}`;
    return {
      ok: true,
      clientId: sandboxClientId,
      workflowStatus: "sandbox_workflow_ready",
      nextSteps: [
        "Connect the approved Twilio number and webhook URLs.",
        "Attach production OpenAI credentials to the roofing-only intake prompt.",
        `Authorize the ${parsed.leadDestination.destination} connector before live traffic.`
      ]
    };
  }

  const { client, profile } = await upsertOnboarding(parsed, "submitted");
  const sandboxClientId = `akeno_${client.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}_${Date.now()
    .toString()
    .slice(-5)}`;
  const workflowStatus = "sandbox_workflow_ready";

  await prisma.onboardingProfile.update({
    where: { id: profile.id },
    data: { mockClientId: sandboxClientId, workflowStatus, status: "setup_complete", step: 8 }
  });

  await prisma.activityLog.create({
    data: {
      clientId: client.id,
      type: "setup",
      message: "Akeno missed-call workflow staged for sandbox review.",
      metadataJson: JSON.stringify({
        sandboxClientId,
        workflowStatus,
        integrations: ["Twilio production credentials pending", "OpenAI production credentials pending", parsed.leadDestination.destination]
      })
    }
  });

  return {
    ok: true,
    clientId: sandboxClientId,
    workflowStatus,
    nextSteps: [
      "Connect the approved Twilio number and webhook URLs.",
      "Attach production OpenAI credentials to the roofing-only intake prompt.",
      `Authorize the ${parsed.leadDestination.destination} connector before live traffic.`
    ]
  };
}
