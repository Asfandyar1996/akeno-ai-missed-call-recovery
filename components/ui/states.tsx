import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingSkeleton({ label = "Loading roofing data..." }: { label?: string }) {
  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </div>
      <div className="h-24 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <Inbox className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-3 font-semibold">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <div className="flex gap-2">
        <AlertTriangle className="h-4 w-4" />
        {message}
      </div>
    </div>
  );
}
