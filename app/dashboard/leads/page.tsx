import { getLeads } from "@/lib/services/lead-service";
import { LeadTable } from "@/components/leads/lead-table";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getLeads();
  const serialized = leads.map((lead) => ({ ...lead, createdAt: lead.createdAt.toISOString(), updatedAt: lead.updatedAt.toISOString() }));
  return (
    <div className="soft-enter space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Roofing leads</h1>
        <p className="mt-1 text-muted-foreground">Search, filter and inspect missed-call recovery leads from the Akeno database.</p>
      </div>
      <LeadTable leads={serialized} />
    </div>
  );
}
