"use client";

import { AlertTriangle, CalendarClock, Camera, CheckCircle2, ClipboardList, MessageSquareText, PhoneCall, Send } from "lucide-react";
import { Drawer } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currency } from "@/lib/utils";
import type { LeadView } from "@/components/leads/lead-types";

type Conversation = { from: string; text: string };
type Notification = { channel: string; status: string; detail: string };

function parseList<T>(value: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(value) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function LeadDetailDrawer({ lead, onClose }: { lead: LeadView | null; onClose: () => void }) {
  if (!lead) return null;
  const conversation = parseList<Conversation>(lead.conversationJson, []);
  const notifications = parseList<Notification>(lead.notificationsJson, []);
  const photos = parseList<string>(lead.photosJson, []);

  return (
    <Drawer open={Boolean(lead)} onClose={onClose} title={`${lead.customerName} roofing lead`}>
      <div className="space-y-4">
        <div className="rounded-lg border bg-slate-950 p-4 text-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">AI lead summary</p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{lead.leadSummary}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Badge variant={lead.urgency === "Urgent" ? "warning" : "muted"}>{lead.urgency}</Badge>
              <Badge variant="success">{lead.status}</Badge>
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-md bg-white/8 p-3">
              <p className="text-xs uppercase text-slate-400">Estimated value</p>
              <p className="mt-1 font-semibold">{currency(lead.estimatedValue)}</p>
            </div>
            <div className="rounded-md bg-white/8 p-3">
              <p className="text-xs uppercase text-slate-400">Preferred window</p>
              <p className="mt-1 font-semibold">{lead.preferredAppointment ?? "Not provided"}</p>
            </div>
            <div className="rounded-md bg-white/8 p-3">
              <p className="text-xs uppercase text-slate-400">Handoff</p>
              <p className="mt-1 font-semibold">{lead.crmSyncStatus}</p>
            </div>
          </div>
        </div>

        <Card className={lead.urgency === "Urgent" ? "border-orange-200 bg-orange-50" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {lead.urgency === "Urgent" ? <AlertTriangle className="h-4 w-4 text-orange-600" /> : <CalendarClock className="h-4 w-4 text-primary" />}
              Recommended next action
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              {lead.urgency === "Urgent"
                ? "Call the homeowner and confirm whether temporary mitigation or a same-day inspection is possible."
                : "Review the intake details, confirm availability, and assign the lead to dispatch or estimating."}
            </p>
            <p className="rounded-md bg-white p-3 font-medium text-slate-900">
              Akeno captures preferred timing and context. A human should confirm the appointment, pricing, and service commitment.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" /> Full roofing information</CardTitle></CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <Info label="Phone" value={lead.phone} />
            <Info label="Location" value={`${lead.city}, ${lead.state} ${lead.zip}`} />
            <Info label="Property address" value={lead.propertyAddress} />
            <Info label="Service" value={lead.serviceRequested} />
            <Info label="Active leak" value={lead.activeLeak ? "Yes" : "No"} />
            <Info label="Property type" value={lead.propertyType} />
            <Info label="Roof type" value={lead.roofType ?? "Not provided"} />
            <Info label="Roof age" value={lead.roofAge ?? "Not provided"} />
            <Info label="Storm damage" value={lead.stormDamage ? "Yes" : "No"} />
            <Info label="Insurance status" value={lead.insuranceStatus ?? "Not provided"} />
            <Info label="Preferred appointment" value={lead.preferredAppointment ?? "Not provided"} />
            <Info label="Estimated value" value={currency(lead.estimatedValue)} />
          </CardContent>
        </Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">
            <PhoneCall className="h-4 w-4" />
            Call homeowner
          </a>
          <a href={`sms:${lead.phone.replace(/[^\d+]/g, "")}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border bg-white px-4 text-sm font-semibold hover:bg-muted">
            <MessageSquareText className="h-4 w-4" />
            Text homeowner
          </a>
        </div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquareText className="h-4 w-4 text-primary" /> Conversation history</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {conversation.length > 0 ? conversation.map((item, index) => (
              <div key={`${item.from}-${index}`} className="rounded-md border bg-white p-3 text-sm">
                <p className="font-semibold">{item.from}</p>
                <p className="mt-1 text-muted-foreground">{item.text}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">No conversation transcript is attached yet.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="h-4 w-4 text-primary" /> Roof photos</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {photos.length > 0 ? photos.map((photo) => (
              <div key={photo} className="grid min-h-28 place-items-center rounded-md border bg-muted text-center text-sm text-muted-foreground">{photo}</div>
            )) : <p className="text-sm text-muted-foreground">Photos have not been provided yet.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Send className="h-4 w-4 text-primary" /> Notification history</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((item, index) => (
              <div key={`${item.channel}-${index}`} className="flex items-start gap-3 rounded-md border p-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <div>
                  <p className="font-semibold">{item.channel}: {item.status}</p>
                  <p className="text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Drawer>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
