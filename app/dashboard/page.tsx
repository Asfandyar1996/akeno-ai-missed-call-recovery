import { Activity, ClipboardCheck, MessageCircle, PhoneMissed, ShieldCheck, Siren, TrendingUp, UsersRound, WalletCards, type LucideIcon } from "lucide-react";
import { getDashboardStats } from "@/lib/services/dashboard-service";
import { currency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { SetupChecklist } from "@/components/dashboard/setup-checklist";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const cards: Array<{ label: string; value: string | number; icon: LucideIcon }> = [
    { label: "Missed calls", value: stats.counts.missedCalls, icon: PhoneMissed },
    { label: "Customers contacted", value: stats.counts.customersContacted, icon: MessageCircle },
    { label: "Qualified roofing leads", value: stats.counts.qualifiedLeads, icon: UsersRound },
    { label: "Urgent leads", value: stats.counts.urgentLeads, icon: Siren },
    { label: "Ready for human review", value: stats.counts.qualifiedLeads, icon: ClipboardCheck },
    { label: "Reply rate", value: `${stats.counts.replyRate}%`, icon: TrendingUp },
    { label: "Estimated recovered value", value: currency(stats.counts.estimatedRecoveredValue), icon: WalletCards }
  ];

  return (
    <div className="soft-enter space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recovery operations dashboard</h1>
          <p className="mt-1 text-muted-foreground">Monitor missed-call recovery, AI qualification, urgent routing and lead handoff quality.</p>
        </div>
        <DashboardActions />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Setup status</CardTitle></CardHeader>
          <CardContent><StatusBadge status={stats.setupStatus} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Twilio status</CardTitle></CardHeader>
          <CardContent><StatusBadge status="production credentials pending" /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">CRM or Google Sheets status</CardTitle></CardHeader>
          <CardContent><StatusBadge status={stats.workflowStatus} /></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DashboardCharts leads={stats.sevenDayLeads} statuses={stats.statusChart} />

      <div className="grid gap-4 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Recent roofing leads</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {stats.recentLeads.map((lead) => (
                <div key={lead.id} className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{lead.customerName}</p>
                    <p className="text-sm text-muted-foreground">{lead.serviceRequested} in {lead.city}, {lead.state}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                AI operating controls
              </CardTitle>
              <CardDescription>Guardrails that keep the assistant useful for roofing intake without overstepping.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm md:grid-cols-3">
              {[
                ["Scope", "Roofing services only: leaks, storm damage, repair, replacement, inspection, tarps and service area."],
                ["Escalation", "Active leaks, water intrusion, storm damage and tarp requests are marked urgent and routed to the owner."],
                ["Human control", "The agent captures preferred times and lead context. A person confirms schedule, pricing and service decisions."]
              ].map(([title, text]) => (
                <div key={title} className="rounded-md border bg-muted/35 p-3">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-2 leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <SetupChecklist />
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Recent activity</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
