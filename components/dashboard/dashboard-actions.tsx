"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquareText, PauseCircle, PlayCircle, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function DashboardActions() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Link href="/demo-chat" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">
        <MessageSquareText className="h-4 w-4" />
        View Recovery Demo
      </Link>
      <Link href="/dashboard/settings" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold hover:bg-muted">
        <Settings className="h-4 w-4" />
        Edit Agent Settings
      </Link>
      <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2">
        {paused ? <PauseCircle className="h-4 w-4 text-orange-600" /> : <PlayCircle className="h-4 w-4 text-emerald-600" />}
        <span className="text-sm font-medium">Pause Agent</span>
        <Switch checked={paused} onCheckedChange={setPaused} label="Pause agent" />
      </div>
    </div>
  );
}
