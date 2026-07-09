import { prisma } from "@/lib/db";
import { getDemoLeads } from "@/lib/demo-dashboard-data";
import { leadSchema, type LeadInput } from "@/lib/schemas";
import { hasPostgresDatabaseUrl } from "@/lib/services/database-availability";

export async function getLeads() {
  try {
    if (!hasPostgresDatabaseUrl()) {
      return getDemoLeads();
    }
    return await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true }
    });
  } catch (error) {
    console.warn("Using demo leads because the database is unavailable.", error instanceof Error ? error.message : error);
    return getDemoLeads();
  }
}

export async function createLead(input: LeadInput) {
  const data = leadSchema.parse(input);
  if (!hasPostgresDatabaseUrl()) {
    return {
      id: `sandbox-lead-${Date.now()}`,
      clientId: "sandbox-client",
      ...data,
      photosJson: JSON.stringify(["Front slope photo requested", "Interior ceiling stain photo requested"]),
      conversationJson: JSON.stringify([
        { from: "AI", text: "Sorry we missed your call. Are you contacting us about a roofing issue?" },
        { from: "Customer", text: data.leadSummary }
      ]),
      notificationsJson: JSON.stringify([
        { channel: "SMS", status: "sent", detail: `Alert sent to ${data.assignedPerson}` },
        { channel: "Email", status: "queued", detail: "Lead summary queued for dispatcher." }
      ]),
      crmSyncStatus: "Sandbox synced",
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  const client = await prisma.client.findFirst({ orderBy: { createdAt: "asc" } });
  if (!client) throw new Error("Create an onboarding profile before adding leads.");

  const lead = await prisma.lead.create({
    data: {
      clientId: client.id,
      ...data,
      photosJson: JSON.stringify(["Front slope photo requested", "Interior ceiling stain photo requested"]),
      conversationJson: JSON.stringify([
        { from: "AI", text: "Sorry we missed your call. Are you contacting us about a roofing issue?" },
        { from: "Customer", text: data.leadSummary }
      ]),
      notificationsJson: JSON.stringify([
        { channel: "SMS", status: "sent", detail: `Alert sent to ${data.assignedPerson}` },
        { channel: "Email", status: "queued", detail: "Lead summary queued for dispatcher." }
      ]),
      crmSyncStatus: "Sandbox synced"
    }
  });

  await prisma.activityLog.create({
    data: {
      clientId: client.id,
      type: "lead",
      message: `Lead intake route verified for ${lead.customerName}.`,
      metadataJson: JSON.stringify({ leadId: lead.id, urgency: lead.urgency })
    }
  });

  return lead;
}

export async function createTestLead() {
  return createLead({
    customerName: "Jordan Miller",
    phone: "(972) 555-0146",
    propertyAddress: "1821 Cedar Springs Road",
    zip: "75201",
    city: "Dallas",
    state: "TX",
    serviceRequested: "Active roof leak",
    urgency: "Urgent",
    status: "Qualified",
    assignedPerson: "Megan Carter",
    activeLeak: true,
    propertyType: "Residential",
    roofType: "Architectural shingle",
    roofAge: "12 years",
    stormDamage: true,
    insuranceStatus: "Homeowner plans to file claim",
    preferredAppointment: "Today after 3 PM",
    leadSummary: "Homeowner reports water entering near the kitchen light after overnight storms.",
    estimatedValue: 6800
  });
}
