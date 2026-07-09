import { PrismaClient } from "@prisma/client";
import { demoOnboarding } from "../lib/defaults";

const prisma = new PrismaClient();

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.serviceArea.deleteMany();
  await prisma.onboardingProfile.deleteMany();
  await prisma.client.deleteMany();

  const client = await prisma.client.create({
    data: {
      companyName: demoOnboarding.company.roofingCompanyName,
      ownerName: demoOnboarding.company.ownerName,
      email: demoOnboarding.company.email,
      phone: demoOnboarding.company.businessPhone,
      website: demoOnboarding.company.website,
      address: demoOnboarding.company.address,
      city: demoOnboarding.company.city,
      state: demoOnboarding.company.state,
      zip: demoOnboarding.company.zip,
      timeZone: demoOnboarding.company.timeZone
    }
  });

  await prisma.onboardingProfile.create({
    data: {
      clientId: client.id,
      step: 8,
      status: "setup_complete",
      servicesJson: JSON.stringify(demoOnboarding.services),
      serviceAreaJson: JSON.stringify(demoOnboarding.serviceArea),
      phoneConfigJson: JSON.stringify(demoOnboarding.phoneConfig),
      agentConfigJson: JSON.stringify(demoOnboarding.agentConfig),
      leadDestinationJson: JSON.stringify(demoOnboarding.leadDestination),
      notificationPreferenceJson: JSON.stringify(demoOnboarding.notifications),
      complianceJson: JSON.stringify({
        termsAccepted: true,
        consentConfirmed: true,
        messagingAcknowledged: true
      }),
      mockClientId: "akeno_summit_ridge_demo",
      workflowStatus: "mock_workflow_ready"
    }
  });

  await prisma.serviceArea.createMany({
    data: [
      ...demoOnboarding.serviceArea.zipCodes.map((zip) => ({ clientId: client.id, type: "zip", value: zip })),
      { clientId: client.id, type: "city", value: "Dallas" },
      { clientId: client.id, type: "city", value: "Plano" },
      { clientId: client.id, type: "county", value: "Dallas County" }
    ]
  });

  await prisma.notificationPreference.create({
    data: {
      clientId: client.id,
      email: demoOnboarding.notifications.notificationEmail,
      ownerSms: demoOnboarding.notifications.ownerSmsNumber,
      dispatcherSms: demoOnboarding.notifications.dispatcherSmsNumber,
      sendFor: demoOnboarding.notifications.sendFor,
      dailySummary: true,
      weeklyReport: true
    }
  });

  await prisma.integration.createMany({
    data: ["Google Sheets", "Twilio", "OpenAI", "n8n"].map((provider) => ({
      clientId: client.id,
      provider,
      status: provider === "Google Sheets" ? "mock_connected" : "not_connected",
      configJson: JSON.stringify({ mode: "local_mock", provider })
    }))
  });

  const leads = [
    {
      customerName: "Karen Blake",
      phone: "(214) 555-0138",
      propertyAddress: "6422 Preston Haven Drive",
      zip: "75230",
      city: "Dallas",
      state: "TX",
      serviceRequested: "Active roof leak",
      urgency: "Urgent",
      status: "Booked",
      assignedPerson: "Megan Carter",
      activeLeak: true,
      propertyType: "Residential",
      roofType: "Architectural shingle",
      roofAge: "14 years",
      stormDamage: true,
      insuranceStatus: "Likely filing claim",
      preferredAppointment: "Today after 4 PM",
      leadSummary: "Water stain forming around kitchen ceiling light after hailstorm.",
      estimatedValue: 9200
    },
    {
      customerName: "Derrick Wilson",
      phone: "(972) 555-0172",
      propertyAddress: "901 Commerce Street",
      zip: "75202",
      city: "Dallas",
      state: "TX",
      serviceRequested: "Commercial roofing inspection",
      urgency: "Standard",
      status: "Qualified",
      assignedPerson: "Dispatcher",
      activeLeak: false,
      propertyType: "Commercial",
      roofType: "TPO",
      roofAge: "Unknown",
      stormDamage: false,
      insuranceStatus: "Not discussed",
      preferredAppointment: "Thursday morning",
      leadSummary: "Property manager needs inspection after tenant reported ponding water.",
      estimatedValue: 14500
    },
    {
      customerName: "Melissa Tran",
      phone: "(469) 555-0121",
      propertyAddress: "118 Meadowbrook Lane",
      zip: "75093",
      city: "Plano",
      state: "TX",
      serviceRequested: "Roof replacement",
      urgency: "Standard",
      status: "Contacted",
      assignedPerson: "Megan Carter",
      activeLeak: false,
      propertyType: "Residential",
      roofType: "Composition shingle",
      roofAge: "22 years",
      stormDamage: true,
      insuranceStatus: "Claim already opened",
      preferredAppointment: "Friday afternoon",
      leadSummary: "Homeowner missed call was recovered; wants replacement estimate after adjuster visit.",
      estimatedValue: 17800
    },
    {
      customerName: "Anthony Reed",
      phone: "(214) 555-0190",
      propertyAddress: "324 North Bishop Avenue",
      zip: "75208",
      city: "Dallas",
      state: "TX",
      serviceRequested: "Emergency tarp",
      urgency: "Urgent",
      status: "New",
      assignedPerson: "Owner",
      activeLeak: true,
      propertyType: "Residential",
      roofType: "Metal",
      roofAge: "9 years",
      stormDamage: true,
      insuranceStatus: "Needs guidance",
      preferredAppointment: "As soon as possible",
      leadSummary: "Tree limb punctured rear slope; AI requested photos and alerted owner.",
      estimatedValue: 4200
    },
    {
      customerName: "Grace Kim",
      phone: "(214) 555-0165",
      propertyAddress: "7301 La Vista Drive",
      zip: "75214",
      city: "Dallas",
      state: "TX",
      serviceRequested: "Roof inspection",
      urgency: "Low",
      status: "Closed",
      assignedPerson: "Estimator",
      activeLeak: false,
      propertyType: "Residential",
      roofType: "Asphalt shingle",
      roofAge: "8 years",
      stormDamage: false,
      insuranceStatus: "No claim",
      preferredAppointment: "Next Tuesday",
      leadSummary: "Seller inspection request captured from missed weekend call.",
      estimatedValue: 650
    }
  ];

  for (const [index, lead] of leads.entries()) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - index);
    await prisma.lead.create({
      data: {
        clientId: client.id,
        ...lead,
        photosJson: JSON.stringify(["Exterior roof photo requested", "Interior damage photo requested"]),
        conversationJson: JSON.stringify([
          { from: "AI", text: "Sorry we missed your call. Are you contacting us about a roofing issue?" },
          { from: "Customer", text: lead.leadSummary },
          { from: "AI", text: "Thanks. I collected the property details and sent this to the roofing team." }
        ]),
        notificationsJson: JSON.stringify([
          { channel: "SMS", status: "sent", detail: `Alert sent to ${lead.assignedPerson}` },
          { channel: "Email", status: "sent", detail: "Lead summary delivered to dispatch inbox." }
        ]),
        crmSyncStatus: "Mock synced",
        createdAt
      }
    });
  }

  await prisma.activityLog.createMany({
    data: [
      {
        clientId: client.id,
        type: "setup",
        message: "Demo onboarding profile seeded and marked setup complete.",
        metadataJson: JSON.stringify({ mode: "seed" })
      },
      {
        clientId: client.id,
        type: "integration",
        message: "Google Sheets mock connector is ready and column-safe.",
        metadataJson: JSON.stringify({ provider: "Google Sheets" })
      },
      {
        clientId: client.id,
        type: "lead",
        message: "Urgent active leak lead recovered from missed call.",
        metadataJson: JSON.stringify({ urgency: "Urgent" })
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
