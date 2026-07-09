"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, type Path, useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Home, Save, Upload } from "lucide-react";
import { AkenoLogo } from "@/components/brand/akeno-logo";
import { crmOptions, roofingServices } from "@/lib/constants";
import { defaultGreeting, defaultOnboarding } from "@/lib/defaults";
import {
  companySchema,
  complianceSchema,
  leadDestinationSchema,
  notificationSchema,
  onboardingSchema,
  phoneConfigSchema,
  serviceAreaSchema,
  servicesSchema,
  type OnboardingInput
} from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { ErrorState, LoadingSkeleton } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { FormSection } from "@/components/onboarding/form-section";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { ZipTagInput } from "@/components/onboarding/zip-tag-input";
import { BusinessHoursEditor } from "@/components/onboarding/business-hours-editor";
import { PhoneSmsPreview } from "@/components/onboarding/phone-sms-preview";
import { FieldMappingInterface } from "@/components/onboarding/field-mapping-interface";

const stepSchemas: Record<number, z.ZodType<unknown>> = {
  1: companySchema,
  2: servicesSchema,
  3: serviceAreaSchema,
  4: phoneConfigSchema,
  6: leadDestinationSchema,
  7: notificationSchema,
  8: complianceSchema
};

const stepKeys = {
  1: "company",
  2: "services",
  3: "serviceArea",
  4: "phoneConfig",
  5: "agentConfig",
  6: "leadDestination",
  7: "notifications",
  8: "compliance"
} as const;

function buildGeneratedAgentConfig(values: OnboardingInput): OnboardingInput["agentConfig"] {
  const companyName = values.company.roofingCompanyName || "[Company Name]";
  const serviceList = values.services.selectedServices.length > 0 ? values.services.selectedServices.join(", ") : "roofing services";
  const rejected = values.services.rejectedServices?.trim();
  const cities = values.serviceArea.cities?.trim();
  const bookingLink = values.agentConfig.bookingLink || values.company.website || "";
  const emergencyKeywords = [
    "active leak",
    "water coming in",
    "ceiling stain",
    "tarp",
    "hail",
    "storm damage",
    "tree limb",
    ...values.services.selectedServices.filter((service) => /leak|storm|emergency|tarp/i.test(service))
  ];

  return {
    messageCompanyName: companyName,
    greetingMessage: defaultGreeting.replace("[Company Name]", companyName),
    tone: values.agentConfig.tone || "Professional",
    bookingLink,
    emergencyKeywords: Array.from(new Set(emergencyKeywords)).join(", "),
    qualificationQuestions:
      "Ask what roofing issue they are seeing, whether water is actively entering, the property address, property type, roof age if known, insurance context, photos if available, and preferred appointment time.",
    enablePhotoRequests: true,
    enableInsuranceQuestions: true,
    enableRoofAgeQuestions: true,
    enablePreferredAppointmentQuestions: true,
    customInstructions: [
      `Discuss only accepted roofing work: ${serviceList}.`,
      cities ? `Prioritize leads in these service areas: ${cities}.` : "",
      rejected ? `Politely reject or flag these requests for manual review: ${rejected}.` : "",
      values.services.minimumJobRequirements ? `Respect minimum job guidance: ${values.services.minimumJobRequirements}.` : "",
      "Treat active leaks, storm damage, water intrusion and tarp requests as urgent. Do not diagnose structural safety or promise insurance outcomes."
    ].filter(Boolean).join(" ")
  };
}

export function OnboardingWizard() {
  const searchParams = useSearchParams();
  const startFromBeginning = searchParams.get("start") === "1";
  const [step, setStepState] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<OnboardingInput>({ defaultValues: defaultOnboarding, mode: "onChange" });
  const values = form.watch();

  useEffect(() => {
    let active = true;
    fetch("/api/onboarding")
      .then((response) => response.json())
      .then((data: OnboardingInput) => {
        if (!active) return;
        if (startFromBeginning) {
          form.reset(defaultOnboarding);
          setStepState(1);
          return;
        }
        const initialStep = startFromBeginning ? 1 : data.currentStep || 1;
        form.reset({ ...data, currentStep: initialStep });
        setStepState(initialStep);
      })
      .catch(() => setError("Could not load local onboarding data."))
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, [form, startFromBeginning]);

  const setStep = (nextStep: number) => {
    const bounded = Math.max(1, Math.min(8, nextStep));
    form.setValue("currentStep", bounded);
    setStepState(bounded);
  };

  const selectedServices = form.watch("services.selectedServices");
  const destination = form.watch("leadDestination.destination");
  const logoDataUrl = form.watch("company.logoDataUrl");

  const generatedAgentConfig = buildGeneratedAgentConfig(values);
  const smsCompany = generatedAgentConfig.messageCompanyName;
  const smsGreeting = generatedAgentConfig.greetingMessage;

  const currentStepIssues = (() => {
    const key = stepKeys[step as keyof typeof stepKeys];
    const schema = stepSchemas[step];
    if (!schema || step === 5) return [];
    const parsed = schema.safeParse(form.getValues(key));
    if (parsed.success) return [];
    return parsed.error.issues.slice(0, 4).map((issue) => issue.message);
  })();

  const validateCurrentStep = () => {
    const key = stepKeys[step as keyof typeof stepKeys];
    const schema = stepSchemas[step];
    if (step === 5) return true;
    const parsed = schema.safeParse(form.getValues(key));
    if (!parsed.success) {
      toast({ title: "Check this step", description: parsed.error.issues[0]?.message ?? "Some fields need attention." });
      return false;
    }
    if (step === 8) {
      const compliance = form.getValues("compliance");
      if (!compliance.termsAccepted || !compliance.consentConfirmed || !compliance.messagingAcknowledged) {
        toast({ title: "Acknowledgements required", description: "Confirm the terms, consent and US messaging-compliance acknowledgement." });
        return false;
      }
    }
    return true;
  };

  const saveDraft = async (nextStep = step) => {
    if (!validateCurrentStep()) return false;
    setSaving(true);
    setSaveState("saving");
    setError("");
    const payload = { ...form.getValues(), currentStep: nextStep };
    const response = await fetch("/api/onboarding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setSaving(false);
    if (!response.ok) {
      setSaveState("error");
      setError("Draft save failed. Check required fields and try again.");
      return false;
    }
    setLastSavedAt(new Date());
    setSaveState("saved");
    toast({ title: "Draft saved", description: "Your onboarding progress is stored in the Akeno database." });
    return true;
  };

  const next = async () => {
    const nextStep = Math.min(8, step + 1);
    const ok = await saveDraft(nextStep);
    if (ok) setStep(nextStep);
  };

  const submit = async () => {
    if (!validateCurrentStep()) return;
    setSubmitting(true);
    const payload = {
      ...form.getValues(),
      phoneConfig: {
        ...form.getValues("phoneConfig"),
        afterHoursBehavior: "Text missed callers immediately. Mark active leaks and storm damage as urgent, then alert the owner."
      },
      agentConfig: generatedAgentConfig,
      currentStep: 8
    };
    const parsed = onboardingSchema.safeParse(payload);
    if (!parsed.success) {
      setSubmitting(false);
      toast({ title: "Setup not ready", description: parsed.error.issues[0]?.message ?? "Review required fields." });
      return;
    }
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data)
    });
    if (!response.ok) {
      setSubmitting(false);
      setError("Final onboarding submission failed.");
      return;
    }
    const setup = await fetch("/api/n8n/setup", { method: "POST" });
    setSubmitting(false);
    if (!setup.ok) {
      setError("Onboarding saved, but workflow staging failed.");
      return;
    }
    toast({ title: "Setup complete", description: "Workflow staging and dashboard activity were created." });
    window.location.href = "/dashboard";
  };

  const serviceSummary = useMemo(() => selectedServices.join(", "), [selectedServices]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <LoadingSkeleton label="Loading onboarding setup..." />
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-muted/35">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold text-secondary">
            <AkenoLogo markClassName="h-9 w-9 rounded-lg shadow-none" textClassName="text-secondary" />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-semibold text-slate-800 hover:bg-muted">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/privacy" className="inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-slate-950">
                Privacy
              </Link>
              <Link href="/contact" className="inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-slate-950">
                Contact
              </Link>
            </div>
            <Button variant="outline" onClick={() => saveDraft()} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving" : "Save draft"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="sr-only">Akeno client onboarding setup</h1>
        <div className="flex flex-col gap-2 rounded-lg border bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Client setup workspace</p>
            <p className="text-sm text-muted-foreground">Complete each section, review the generated AI setup, then stage the workflow.</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${saveState === "error" ? "bg-red-500" : saveState === "saving" ? "bg-orange-500" : saveState === "saved" ? "bg-emerald-500" : "bg-slate-300"}`} />
            <span className="text-muted-foreground">
              {saveState === "saving" ? "Saving draft..." : saveState === "error" ? "Draft save failed" : lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Not saved yet"}
            </span>
          </div>
        </div>
        <OnboardingProgress step={step} setStep={setStep} />
        {error ? <ErrorState message={error} /> : null}
        {currentStepIssues.length > 0 ? (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-950">Step needs attention</p>
            <ul className="mt-2 grid gap-1 text-sm text-orange-950/80 sm:grid-cols-2">
              {currentStepIssues.map((issue) => <li key={issue}>- {issue}</li>)}
            </ul>
          </div>
        ) : null}

        <form className="grid gap-6 lg:grid-cols-[1fr_22rem]" onSubmit={(event) => event.preventDefault()}>
          <div className="space-y-6">
            {step === 1 ? (
              <FormSection title="Company details" description="This information powers setup records, message previews and dashboard identity.">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Roofing company name"><Input {...form.register("company.roofingCompanyName")} /></Field>
                  <Field label="Owner or manager name"><Input {...form.register("company.ownerName")} /></Field>
                  <Field label="Email"><Input type="email" {...form.register("company.email")} /></Field>
                  <Field label="Website"><Input placeholder="https://example.com" {...form.register("company.website")} /></Field>
                  <Field label="Existing business phone number"><Input {...form.register("company.businessPhone")} /></Field>
                  <Field label="Time zone">
                    <Select {...form.register("company.timeZone")}>
                      <option value="">Select time zone</option>
                      {["Eastern Time", "Central Time", "Mountain Time", "Pacific Time", "Arizona Time", "Alaska Time", "Hawaii Time"].map((zone) => <option key={zone}>{zone}</option>)}
                    </Select>
                  </Field>
                </div>
                <Field label="Company logo upload">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      Choose logo
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => form.setValue("company.logoDataUrl", String(reader.result), { shouldDirty: true });
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    {logoDataUrl ? (
                      <Image
                        src={logoDataUrl}
                        alt="Company logo preview"
                        width={56}
                        height={56}
                        unoptimized
                        className="h-14 w-14 rounded-md border object-cover"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">No logo selected</span>
                    )}
                  </div>
                </Field>
                <div className="grid gap-4 md:grid-cols-4">
                  <Field label="Business address"><Input {...form.register("company.address")} /></Field>
                  <Field label="City"><Input {...form.register("company.city")} /></Field>
                  <Field label="State"><Input {...form.register("company.state")} /></Field>
                  <Field label="ZIP code"><Input {...form.register("company.zip")} /></Field>
                </div>
              </FormSection>
            ) : null}

            {step === 2 ? (
              <FormSection title="Roofing services" description="Choose the services the agent may discuss and the work it should reject.">
                <div className="grid gap-3 md:grid-cols-2">
                  {roofingServices.map((service) => (
                    <label key={service} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                      <Checkbox
                        checked={selectedServices.includes(service)}
                        onChange={(event) => {
                          const checked = event.currentTarget.checked;
                          form.setValue(
                            "services.selectedServices",
                            checked ? [...selectedServices, service] : selectedServices.filter((item) => item !== service),
                            { shouldDirty: true }
                          );
                        }}
                      />
                      {service}
                    </label>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Other services"><Input {...form.register("services.otherServices")} /></Field>
                  <Field label="Residential, commercial or both">
                    <Select {...form.register("services.propertyType")}>
                      <option value="">Select property type</option>
                      {["Residential", "Commercial", "Both"].map((item) => <option key={item}>{item}</option>)}
                    </Select>
                  </Field>
                  <Field label="Roof types handled"><Textarea {...form.register("services.roofTypes")} /></Field>
                  <Field label="Minimum job requirements"><Textarea {...form.register("services.minimumJobRequirements")} /></Field>
                  <Field label="Services the agent should reject"><Textarea {...form.register("services.rejectedServices")} /></Field>
                </div>
              </FormSection>
            ) : null}

            {step === 3 ? (
              <FormSection title="Service area" description="ZIP codes are removable tags. Manual review can keep borderline leads visible.">
                <Controller control={form.control} name="serviceArea.zipCodes" render={({ field }) => <Field label="ZIP codes"><ZipTagInput value={field.value} onChange={field.onChange} /></Field>} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Cities"><Textarea {...form.register("serviceArea.cities")} /></Field>
                  <Field label="Counties"><Textarea {...form.register("serviceArea.counties")} /></Field>
                  <Field label="Maximum travel radius"><Input type="number" {...form.register("serviceArea.maxRadius", { valueAsNumber: true })} /></Field>
                  <label className="flex items-center gap-3 rounded-md border p-3 text-sm">
                    <Checkbox {...form.register("serviceArea.acceptManualReview")} />
                    Accept all leads for manual review
                  </label>
                </div>
              </FormSection>
            ) : null}

            {step === 4 ? (
              <FormSection title="Phone configuration" description="A Twilio number will be connected later. Do not enter Twilio credentials yet.">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Current business number"><Input {...form.register("phoneConfig.currentBusinessNumber")} /></Field>
                  <Field label="Number calls should forward to"><Input {...form.register("phoneConfig.forwardToNumber")} /></Field>
                  <Field label="Number that should receive urgent alerts"><Input {...form.register("phoneConfig.urgentAlertNumber")} /></Field>
                  <Field label="Backup notification number"><Input {...form.register("phoneConfig.backupNotificationNumber")} /></Field>
                  <Field label="Business hours"><Controller control={form.control} name="phoneConfig.businessHours" render={({ field }) => <BusinessHoursEditor value={field.value} onChange={field.onChange} />} /></Field>
                </div>
                <div className="rounded-lg border bg-cyan-50/60 p-4 text-sm leading-6 text-cyan-950/80">
                  Akeno will automatically text missed callers after-hours, classify active leaks and storm damage as urgent,
                  and route alerts based on the numbers below.
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    ["phoneConfig.options.forwardOffice", "Forward call to the office"],
                    ["phoneConfig.options.forwardOwner", "Forward call to the owner"],
                    ["phoneConfig.options.missedCallSms", "Send missed-call SMS"],
                    ["phoneConfig.options.urgentLeadSms", "Send urgent lead SMS"],
                    ["phoneConfig.options.emailNotification", "Send email notification"]
                  ].map(([name, label]) => (
                    <label key={name} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                      <Checkbox {...form.register(name as Path<OnboardingInput>)} />
                      {label}
                    </label>
                  ))}
                </div>
              </FormSection>
            ) : null}

            {step === 5 ? (
              <div className="grid gap-6 xl:grid-cols-[1fr_21rem]">
                <FormSection title="Akeno AI setup" description="Akeno handles the conversation design and workflow rules for you.">
                  <div className="rounded-lg border bg-cyan-50/60 p-4">
                    <p className="text-sm font-semibold text-cyan-950">Nothing technical to configure here.</p>
                    <p className="mt-2 text-sm leading-6 text-cyan-950/78">
                      We use the business details you already entered to build the missed-call workflow in the background.
                      Your team only needs to confirm the customer-facing tone and add a booking link if you have one.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Booking link, if you use one"><Input placeholder="https://yourroofingcompany.com/schedule" {...form.register("agentConfig.bookingLink")} /></Field>
                    <Field label="Conversation tone">
                      <Select {...form.register("agentConfig.tone")}>
                        {["Professional", "Friendly", "Direct"].map((tone) => <option key={tone}>{tone}</option>)}
                      </Select>
                    </Field>
                  </div>
                  <div className="rounded-lg border p-4 text-sm leading-6 text-muted-foreground">
                    Akeno will configure roofing intake, urgency detection, photo requests, insurance context, lead summaries,
                    and routing rules during setup.
                  </div>
                </FormSection>
                <PhoneSmsPreview companyName={smsCompany} greeting={smsGreeting} />
              </div>
            ) : null}

            {step === 6 ? (
              <FormSection title="Lead destination" description="Choose where qualified leads should be delivered when production credentials are connected.">
                <Field label="Destination">
                  <Select {...form.register("leadDestination.destination")}>
                    {crmOptions.map((option) => <option key={option}>{option}</option>)}
                  </Select>
                </Field>
                {destination === "Google Sheets" ? (
                  <div className="space-y-5 rounded-lg border bg-cyan-50/60 p-4">
                    <p className="text-sm font-semibold text-cyan-950">This setup will not rename, delete, reorder or modify existing Google Sheet columns.</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Spreadsheet URL"><Input {...form.register("leadDestination.spreadsheetUrl")} /></Field>
                      <Field label="Sheet tab"><Input {...form.register("leadDestination.sheetTab")} /></Field>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {[
                        ["leadDestination.matchExistingRowsByPhone", "Match existing rows by phone number"],
                        ["leadDestination.appendNewLeads", "Append new leads"],
                        ["leadDestination.updateExistingLeads", "Update existing leads"]
                      ].map(([name, label]) => (
                        <label key={name} className="flex items-center gap-3 rounded-md border bg-white p-3 text-sm">
                          <Checkbox {...form.register(name as Path<OnboardingInput>)} />
                          {label}
                        </label>
                      ))}
                    </div>
                    <Controller control={form.control} name="leadDestination.fieldMappings" render={({ field }) => <FieldMappingInterface value={field.value} onChange={field.onChange} />} />
                  </div>
                ) : (
                  <div className="space-y-4 rounded-lg border p-4">
                    <Button type="button" variant="outline">Prepare {destination} route</Button>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="Pipeline"><Input {...form.register("leadDestination.crmPipeline")} /></Field>
                      <Field label="Pipeline stage"><Input {...form.register("leadDestination.crmPipelineStage")} /></Field>
                      <Field label="Assigned user"><Input {...form.register("leadDestination.assignedUser")} /></Field>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {[
                        ["leadDestination.createContact", "Create contact"],
                        ["leadDestination.createOpportunity", "Create opportunity"],
                        ["leadDestination.addConversationNotes", "Add conversation notes"]
                      ].map(([name, label]) => (
                        <label key={name} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                          <Checkbox {...form.register(name as Path<OnboardingInput>)} />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </FormSection>
            ) : null}

            {step === 7 ? (
              <FormSection title="Notifications" description="Choose how the roofing team is alerted after missed-call recovery.">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Notification email"><Input type="email" {...form.register("notifications.notificationEmail")} /></Field>
                  <Field label="Owner SMS number"><Input {...form.register("notifications.ownerSmsNumber")} /></Field>
                  <Field label="Dispatcher SMS number"><Input {...form.register("notifications.dispatcherSmsNumber")} /></Field>
                  <Field label="Send notifications for">
                    <Select {...form.register("notifications.sendFor")}>
                      {["Every lead", "Urgent leads only", "Completed leads only"].map((item) => <option key={item}>{item}</option>)}
                    </Select>
                  </Field>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-md border p-3 text-sm"><Checkbox {...form.register("notifications.dailySummary")} /> Daily summary</label>
                  <label className="flex items-center gap-3 rounded-md border p-3 text-sm"><Checkbox {...form.register("notifications.weeklyReport")} /> Weekly report</label>
                </div>
              </FormSection>
            ) : null}

            {step === 8 ? (
              <FormSection title="Review and submit" description="Confirm the configuration before staging the missed-call recovery workflow.">
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    ["Client identity", values.company.roofingCompanyName ? "Ready" : "Missing company details"],
                    ["AI guardrails", generatedAgentConfig.customInstructions ? "Generated" : "Pending"],
                    ["Human confirmation", "Required for appointment, pricing and service decisions"]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border bg-cyan-50/60 p-4">
                      <p className="text-xs font-semibold uppercase text-cyan-900/70">{label}</p>
                      <p className="mt-2 text-sm font-semibold text-cyan-950">{value}</p>
                    </div>
                  ))}
                </div>
                <Review title="Company" step={1} setStep={setStep} items={[values.company.roofingCompanyName, values.company.ownerName, values.company.email, `${values.company.city}, ${values.company.state} ${values.company.zip}`]} />
                <Review title="Roofing services" step={2} setStep={setStep} items={[serviceSummary, values.services.roofTypes, values.services.rejectedServices || "No rejected services listed"]} />
                <Review title="Service area" step={3} setStep={setStep} items={[values.serviceArea.zipCodes.join(", "), values.serviceArea.cities, `${values.serviceArea.maxRadius} mile radius`]} />
                <Review title="Phone" step={4} setStep={setStep} items={[values.phoneConfig.forwardToNumber, values.phoneConfig.urgentAlertNumber, "Akeno handles after-hours recovery automatically"]} />
                <Review title="Akeno AI" step={5} setStep={setStep} items={[`${generatedAgentConfig.tone} tone`, generatedAgentConfig.bookingLink || "No booking link", "Intake logic generated from services, service area and hours"]} />
                <Review title="Destination and notifications" step={6} setStep={setStep} items={[values.leadDestination.destination, values.notifications.notificationEmail, values.notifications.sendFor]} />
                <div className="space-y-3 rounded-lg border p-4">
                  {[
                    ["compliance.termsAccepted", "I agree to the setup terms."],
                    ["compliance.consentConfirmed", "I confirm this company has permission to send follow-up messages to missed callers."],
                    ["compliance.messagingAcknowledged", "I acknowledge US messaging compliance requirements including STOP opt-out language."]
                  ].map(([name, label]) => (
                    <label key={name} className="flex items-start gap-3 text-sm">
                      <Checkbox {...form.register(name as Path<OnboardingInput>)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </FormSection>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {step < 8 ? (
                <Button type="button" onClick={next}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={() => setConfirmOpen(true)} disabled={submitting}>
                  <CheckCircle2 className="h-4 w-4" />
                  Submit Setup
                </Button>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Home className="h-4 w-4 text-primary" /> Activation status</CardTitle>
                <CardDescription>Drafts save through Akeno API routes. Production accounts can be connected after review.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span>Twilio</span><Badge variant="muted">Credentials pending</Badge></div>
                <div className="flex items-center justify-between"><span>OpenAI</span><Badge variant="muted">Credentials pending</Badge></div>
                <div className="flex items-center justify-between"><span>n8n</span><Badge variant="muted">Ready to stage</Badge></div>
                <div className="flex items-center justify-between"><span>{destination}</span><Badge variant="warning">Authorization pending</Badge></div>
              </CardContent>
            </Card>
          </aside>
        </form>
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Submit setup?" description="This saves the onboarding profile and stages the missed-call recovery workflow.">
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={submitting}>{submitting ? "Submitting..." : "Confirm setup"}</Button>
        </div>
      </Dialog>
    </main>
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

function Review({ title, items, step, setStep }: { title: string; items: unknown[]; step: number; setStep: (step: number) => void }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={() => setStep(step)}>Edit</Button>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        {items.filter(Boolean).map((item) => <li key={String(item)}>{String(item)}</li>)}
      </ul>
    </div>
  );
}
