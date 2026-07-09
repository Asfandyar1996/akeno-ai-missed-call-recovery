import { Badge } from "@/components/ui/badge";

const statusLabels: Record<string, string> = {
  mock_ready: "Sandbox ready",
  mock_connected: "Sandbox verified",
  mock_workflow_ready: "Workflow staged",
  demo_ready: "Sandbox ready",
  demo_workflow_ready: "Workflow staged",
  sandbox_ready: "Staged",
  sandbox_connected: "Verified",
  sandbox_workflow_ready: "Workflow staged",
  setup_complete: "Setup complete",
  review_ready: "Ready for review",
  not_started: "Not started",
  not_connected: "Not connected"
};

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const variant =
    normalized.includes("urgent") || normalized.includes("not") ? "warning" :
    normalized.includes("lost") ? "danger" :
    normalized.includes("ready") || normalized.includes("connected") || normalized.includes("complete") || normalized.includes("qualified") || normalized.includes("booked") || normalized.includes("staged") ? "success" :
    "muted";
  return <Badge variant={variant}>{statusLabels[normalized] ?? status.replace(/_/g, " ")}</Badge>;
}
