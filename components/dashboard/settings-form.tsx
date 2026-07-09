"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Send } from "lucide-react";
import { defaultOnboarding } from "@/lib/defaults";
import { onboardingSchema, type OnboardingInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";

export function SettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const form = useForm<OnboardingInput>({ defaultValues: defaultOnboarding });

  useEffect(() => {
    fetch("/api/onboarding")
      .then((response) => response.json())
      .then((data: OnboardingInput) => form.reset(data))
      .finally(() => setLoading(false));
  }, [form]);

  const save = async () => {
    setSaving(true);
    const parsed = onboardingSchema.safeParse(form.getValues());
    if (!parsed.success) {
      setSaving(false);
      toast({ title: "Settings not saved", description: parsed.error.issues[0]?.message ?? "Review required fields." });
      return;
    }
    const response = await fetch("/api/onboarding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data)
    });
    setSaving(false);
    toast({
      title: response.ok ? "Settings saved" : "Settings failed",
      description: response.ok ? "Agent and routing settings were updated." : "Check the API response and try again."
    });
  };

  const testNotification = async () => {
    await fetch("/api/test-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "settings page" })
    });
    toast({ title: "Notification route verified", description: "A sandbox activity log entry was created." });
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={testNotification}><Send className="h-4 w-4" /> Test notification</Button>
        <Button onClick={save} disabled={saving}><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save settings"}</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Company information</CardTitle>
          <CardDescription>Update business identity and service location details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Company name"><Input {...form.register("company.roofingCompanyName")} /></Field>
          <Field label="Owner or manager"><Input {...form.register("company.ownerName")} /></Field>
          <Field label="Email"><Input {...form.register("company.email")} /></Field>
          <Field label="Website"><Input {...form.register("company.website")} /></Field>
          <Field label="Business phone"><Input {...form.register("company.businessPhone")} /></Field>
          <Field label="Booking link"><Input {...form.register("agentConfig.bookingLink")} /></Field>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Roofing services and service area</CardTitle>
          <CardDescription>Keep the agent focused on work your crew actually accepts.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Services"><Textarea {...form.register("services.otherServices")} /></Field>
          <Field label="Roof types"><Textarea {...form.register("services.roofTypes")} /></Field>
          <Field label="Cities"><Textarea {...form.register("serviceArea.cities")} /></Field>
          <Field label="Counties"><Textarea {...form.register("serviceArea.counties")} /></Field>
          <Field label="Maximum travel radius"><Input type="number" {...form.register("serviceArea.maxRadius", { valueAsNumber: true })} /></Field>
          <Field label="Services the agent should reject"><Textarea {...form.register("services.rejectedServices")} /></Field>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Agent message and emergency rules</CardTitle>
          <CardDescription>These instructions shape the roofing-only missed-call conversation.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Greeting message"><Textarea {...form.register("agentConfig.greetingMessage")} /></Field>
          <Field label="Emergency keywords"><Textarea {...form.register("agentConfig.emergencyKeywords")} /></Field>
          <Field label="Qualification questions"><Textarea {...form.register("agentConfig.qualificationQuestions")} /></Field>
          <Field label="Custom instructions"><Textarea {...form.register("agentConfig.customInstructions")} /></Field>
          <Field label="Tone">
            <Select {...form.register("agentConfig.tone")}>
              {["Professional", "Friendly", "Direct"].map((tone) => <option key={tone}>{tone}</option>)}
            </Select>
          </Field>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Business hours and notifications</CardTitle>
          <CardDescription>Control when alerts fire and who receives recovered lead details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Business hours"><Textarea {...form.register("phoneConfig.businessHours")} /></Field>
          <Field label="After-hours behavior"><Textarea {...form.register("phoneConfig.afterHoursBehavior")} /></Field>
          <Field label="Notification email"><Input {...form.register("notifications.notificationEmail")} /></Field>
          <Field label="Owner SMS"><Input {...form.register("notifications.ownerSmsNumber")} /></Field>
          <Field label="Dispatcher SMS"><Input {...form.register("notifications.dispatcherSmsNumber")} /></Field>
          <label className="flex items-center gap-3 rounded-md border p-3 text-sm">
            <Checkbox {...form.register("notifications.dailySummary")} />
            Daily summary
          </label>
          <label className="flex items-center gap-3 rounded-md border p-3 text-sm">
            <Checkbox {...form.register("notifications.weeklyReport")} />
            Weekly report
          </label>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
