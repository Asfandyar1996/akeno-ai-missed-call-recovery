"use client";

import { useState } from "react";
import { Bot, Cable, Cloud, Database, FileSpreadsheet, MessageSquareText, PhoneCall, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useToast } from "@/components/ui/toast";

type IntegrationCardProps = {
  name: string;
  description: string;
  status: string;
};

const iconMap = {
  Twilio: PhoneCall,
  OpenAI: Bot,
  n8n: Cloud,
  "Google Sheets": FileSpreadsheet,
  JobNimbus: Cable,
  AccuLynx: ShieldCheck,
  Roofr: Wrench,
  GoHighLevel: MessageSquareText,
  HubSpot: Database
};

export function IntegrationCard({ name, description, status }: IntegrationCardProps) {
  const Icon = iconMap[name as keyof typeof iconMap] ?? Cable;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [localStatus, setLocalStatus] = useState(status);
  const { toast } = useToast();

  const test = async () => {
    setTesting(true);
    const response = await fetch("/api/test-integration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: name })
    });
    setTesting(false);
    if (response.ok) {
      setLocalStatus("sandbox_connected");
      toast({ title: `${name} verified`, description: "Sandbox route responded successfully." });
    } else {
      toast({ title: `${name} verification failed`, description: "Check the database profile and try again." });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <StatusBadge status={localStatus} />
          </div>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>Configure</Button>
          <Button onClick={test} disabled={testing}>{testing ? "Verifying..." : "Verify route"}</Button>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={`Configure ${name}`} description="Save the intended route before live credentials are connected.">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Connection label</Label>
            <Input defaultValue={`${name} sandbox route`} />
          </div>
          <div className="space-y-2">
            <Label>Pipeline or destination</Label>
            <Input defaultValue={name === "Google Sheets" ? "Missed Call Leads" : "Residential Roofing"} />
          </div>
          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            No API keys, OAuth tokens or paid service credentials are required until production activation.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setLocalStatus("sandbox_ready");
              setDialogOpen(false);
              toast({ title: `${name} configuration saved`, description: "Sandbox route settings were saved." });
            }}>Save route</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
