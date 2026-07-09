import { integrationCards } from "@/lib/constants";
import { IntegrationCard } from "@/components/integrations/integration-card";

export const dynamic = "force-dynamic";

export default function IntegrationsPage() {
  return (
    <div className="soft-enter space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="mt-1 text-muted-foreground">Review staged connectors and verify routing before production credentials are attached.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrationCards.map((card) => (
          <IntegrationCard key={card.name} name={card.name} description={card.description} status={card.status} />
        ))}
      </div>
    </div>
  );
}
