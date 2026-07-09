import type { Metadata } from "next";
import { Bot, Database, FileText, LockKeyhole, Mail, MessageSquareText, PhoneCall, ShieldCheck } from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";

export const metadata: Metadata = {
  title: "Privacy Policy | Akeno",
  description: "Privacy policy for Akeno, an AI missed-call recovery platform for roofing companies."
};

const sections = [
  {
    title: "Information we collect",
    body: [
      "Business contact details, such as company name, owner or manager name, email address, phone number, service area, and preferred notification settings.",
      "Lead and customer intake details that a caller or texter provides, such as phone number, name, property address, roofing issue, leak or storm-damage context, photos or links shared by the customer, appointment preferences, and conversation history.",
      "Integration details needed to operate the service, such as Twilio routing information, Google Sheets or CRM destinations, n8n workflow configuration, and delivery status metadata.",
      "Basic website and product usage data, such as page views, form submissions, sandbox lead activity, setup progress, browser type, device type, timestamps, and error logs."
    ]
  },
  {
    title: "How we use information",
    body: [
      "To recover missed calls by sending timely SMS follow-up messages and continuing the intake conversation.",
      "To qualify roofing leads, identify urgent situations such as active leaks or storm damage, and prepare structured lead summaries for the roofing company.",
      "To send notifications to the roofing business, deliver leads into approved destinations, and maintain setup, dashboard, and integration status.",
      "To improve reliability, troubleshoot issues, prevent abuse, and keep the service secure."
    ]
  },
  {
    title: "AI processing",
    body: [
      "Akeno may use AI services to classify roofing inquiries, summarize conversations, identify missing intake details, and draft short SMS replies.",
      "The AI is configured to stay within roofing intake topics and should not provide final pricing, legal advice, structural-safety diagnoses, or insurance outcome guarantees.",
      "Akeno is designed to support lead intake and routing. Roofing businesses remain responsible for reviewing leads, confirming appointments, and making service decisions."
    ]
  },
  {
    title: "SMS communications",
    body: [
      "Customers may receive SMS messages after placing a call to a roofing business that uses Akeno, including missed-call follow-up, intake questions, and scheduling-related messages.",
      "Message frequency depends on the conversation. Message and data rates may apply.",
      "Customers can reply STOP to opt out of SMS messages. They can reply HELP or contact the roofing business for assistance."
    ]
  },
  {
    title: "Sharing and subprocessors",
    body: [
      "We share information only as needed to operate the service, such as with SMS providers, AI providers, hosting providers, database providers, workflow tools, Google Sheets, CRM systems, and notification services selected or approved by the roofing business.",
      "We do not sell personal information.",
      "Akeno may disclose information if required by law, to protect the service, or to prevent fraud, abuse, or security incidents."
    ]
  },
  {
    title: "Data retention",
    body: [
      "We keep business setup information, lead records, message history, logs, and integration metadata for as long as needed to provide the service, comply with obligations, resolve disputes, and improve reliability.",
      "A roofing business can request deletion or export of its account and lead data, subject to legal, security, backup, and operational requirements."
    ]
  },
  {
    title: "Security",
    body: [
      "Akeno uses reasonable technical and organizational measures designed to protect information from unauthorized access, loss, misuse, and alteration.",
      "No internet-connected service can be guaranteed to be completely secure, so businesses should avoid sending unnecessary sensitive information through SMS or intake forms."
    ]
  },
  {
    title: "Your choices",
    body: [
      "Customers can opt out of SMS messages by replying STOP.",
      "Roofing businesses can update their setup information, notification rules, and integration destinations.",
      "To request access, correction, deletion, or export of information, contact the roofing business using Akeno or contact Akeno at contact@akenobuilds.com."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f7f5f0] text-slate-950">
      <LandingHeader variant="light" />

      <section className="border-b bg-[#101927] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-cyan-200">Akeno policy</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal sm:text-5xl">Privacy Policy</h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              This policy explains how Akeno collects, uses, and protects information for its AI missed-call recovery
              website, onboarding flow, dashboard, and roofing lead intake automation.
            </p>
            <p className="mt-4 text-sm text-slate-400">Last updated: July 8, 2026</p>
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/7 p-5 shadow-2xl shadow-slate-950/35">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [PhoneCall, "SMS consent", "STOP opt-out language and messaging boundaries."],
                [Bot, "AI guardrails", "Roofing-only intake with no pricing or insurance promises."],
                [Database, "Data routing", "Lead records go only to approved business destinations."],
                [LockKeyhole, "Access control", "Production credentials are connected only during activation."]
              ].map(([Icon, title, text]) => (
                <div key={String(title)} className="rounded-lg border border-white/10 bg-white/8 p-4">
                  <Icon className="h-5 w-5 text-cyan-300" />
                  <p className="mt-3 text-sm font-semibold text-white">{title as string}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-300">{text as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-white py-6">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["No data sale", "Akeno does not sell personal information."],
            ["Human confirmation", "AI captures intake details; people confirm schedules and service decisions."],
            ["Business destinations", "Leads are delivered to the CRM, sheet, or inbox selected by the roofing company."]
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border bg-[#fbfaf7] p-4">
              <p className="font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <aside className="space-y-4">
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-cyan-700" />
            <h2 className="mt-4 text-lg font-semibold">Plain-English summary</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Akeno uses business and lead information to recover missed roofing calls, qualify leads, send alerts,
              and deliver structured records to the destinations a roofing company chooses.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              [MessageSquareText, "SMS opt-out", "Customers can reply STOP."],
              [Database, "No data sale", "Akeno does not sell personal information."],
              [LockKeyhole, "Controlled use", "Data is used to operate and secure the service."]
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="rounded-lg border bg-white p-4">
                <Icon className="h-5 w-5 text-cyan-700" />
                <p className="mt-3 text-sm font-semibold">{title as string}</p>
                <p className="mt-1 text-sm text-muted-foreground">{text as string}</p>
              </div>
            ))}
          </div>
        </aside>

        <article className="rounded-lg border bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3 border-b pb-5">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-cyan-50 text-cyan-700">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">Full policy</h2>
              <p className="text-sm text-muted-foreground">For website visitors, roofing businesses, and contacted customers.</p>
            </div>
          </div>

          <div className="mt-6 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <ul className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
                  {section.body.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
              <h3 className="text-lg font-semibold text-cyan-950">Contact</h3>
              <p className="mt-2 text-sm leading-7 text-cyan-950/80">
                Questions about this Privacy Policy can be sent to contact@akenobuilds.com or info@akenobuilds.com.
                If you are a customer of a roofing business using Akeno, you may also contact that roofing business
                directly about your lead or message history.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {["contact@akenobuilds.com", "info@akenobuilds.com"].map((email) => (
                  <a key={email} href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-cyan-950 hover:bg-cyan-100">
                    <Mail className="h-4 w-4" />
                    {email}
                  </a>
                ))}
              </div>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
