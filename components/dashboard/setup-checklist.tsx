import { setupChecklist } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function SetupChecklist() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {setupChecklist.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-md border p-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <span>{item.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
