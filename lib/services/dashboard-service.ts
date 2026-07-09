import { prisma } from "@/lib/db";
import { getDemoActivity, getDemoLeads } from "@/lib/demo-dashboard-data";
import { safeJsonParse } from "@/lib/utils";
import { hasPostgresDatabaseUrl } from "@/lib/services/database-availability";

export async function getDashboardStats() {
  let leads;
  let activities;
  let profile: { status: string; workflowStatus: string | null } | null = null;

  try {
    if (!hasPostgresDatabaseUrl()) {
      throw new Error("DATABASE_URL is not configured for Postgres.");
    }
    leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    activities = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8
    });
    profile = await prisma.onboardingProfile.findFirst({ orderBy: { updatedAt: "desc" } });
  } catch (error) {
    console.warn("Using demo dashboard stats because the database is unavailable.", error instanceof Error ? error.message : error);
    leads = getDemoLeads();
    activities = getDemoActivity();
    profile = { status: "sandbox_ready", workflowStatus: "sandbox_workflow_ready" };
  }

  const qualified = leads.filter((lead) => ["Qualified", "Booked", "Closed"].includes(lead.status));
  const urgent = leads.filter((lead) => lead.urgency === "Urgent");
  const booked = leads.filter((lead) => lead.status === "Booked" || lead.status === "Closed");
  const contacted = leads.filter((lead) => lead.status !== "New");
  const estimatedRecoveredValue = qualified.reduce((sum, lead) => sum + lead.estimatedValue, 0);

  const dayBuckets = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const label = date.toLocaleDateString("en-US", { weekday: "short" });
    return {
      day: label,
      leads: leads.filter((lead) => lead.createdAt.toDateString() === date.toDateString()).length
    };
  });

  const statusChart = ["New", "Contacted", "Qualified", "Booked", "Closed", "Lost"].map((status) => ({
    name: status,
    value: leads.filter((lead) => lead.status === status).length
  }));

  return {
    setupStatus: profile?.status ?? "draft",
    workflowStatus: profile?.workflowStatus ?? "not_started",
    counts: {
      missedCalls: leads.length,
      customersContacted: contacted.length,
      qualifiedLeads: qualified.length,
      urgentLeads: urgent.length,
      inspectionsBooked: booked.length,
      replyRate: leads.length ? Math.round((contacted.length / leads.length) * 100) : 0,
      estimatedRecoveredValue
    },
    sevenDayLeads: dayBuckets,
    statusChart,
    recentActivity: activities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      message: activity.message,
      metadata: safeJsonParse<Record<string, unknown>>(activity.metadataJson, {}),
      createdAt: activity.createdAt
    })),
    recentLeads: leads.slice(0, 5)
  };
}

export async function testIntegration(provider: string) {
  if (!hasPostgresDatabaseUrl()) {
    return { ok: true, provider, status: "sandbox_connected", checkedAt: new Date().toISOString() };
  }

  const client = await prisma.client.findFirst({ orderBy: { createdAt: "asc" } });
  if (!client) throw new Error("No client profile found.");
  await prisma.integration.upsert({
    where: { id: `${client.id}-${provider}` },
    create: {
      id: `${client.id}-${provider}`,
      clientId: client.id,
      provider,
      status: "sandbox_connected",
      configJson: JSON.stringify({ provider, mode: "sandbox" }),
      lastTestAt: new Date()
    },
    update: {
      status: "sandbox_connected",
      lastTestAt: new Date()
    }
  });
  await prisma.activityLog.create({
    data: {
      clientId: client.id,
      type: "integration",
      message: `${provider} sandbox connection verified.`,
      metadataJson: JSON.stringify({ provider, mode: "sandbox" })
    }
  });
  return { ok: true, provider, status: "sandbox_connected", checkedAt: new Date().toISOString() };
}

export async function testNotification(channel: string) {
  if (!hasPostgresDatabaseUrl()) {
    return { ok: true, channel, status: "sandbox_notification_verified" };
  }

  const client = await prisma.client.findFirst({ orderBy: { createdAt: "asc" } });
  if (!client) throw new Error("No client profile found.");
  await prisma.activityLog.create({
    data: {
      clientId: client.id,
      type: "notification",
      message: `${channel} notification route verified for the configured roofing team.`,
      metadataJson: JSON.stringify({ channel, mode: "sandbox" })
    }
  });
  return { ok: true, channel, status: "sandbox_notification_verified" };
}
