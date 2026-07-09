import Link from "next/link";
import {
  ArrowRight,
  Bot,
  ClipboardCheck,
  Cloud,
  Database,
  FileSpreadsheet,
  Gauge,
  Headphones,
  MessageSquareText,
  PhoneCall,
  PhoneMissed,
  Radar,
  ShieldCheck,
  Siren,
  Sparkles,
  Zap
} from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const workflow = [
  { icon: PhoneMissed, title: "Missed call detected", text: "A roofing caller hits voicemail, after-hours, or a busy office line." },
  { icon: MessageSquareText, title: "SMS fires instantly", text: "A compliant text starts the conversation before another contractor answers." },
  { icon: Bot, title: "AI qualifies the job", text: "Leak status, storm damage, roof age, address, photos, and appointment intent." },
  { icon: Siren, title: "Urgency is routed", text: "Active leaks and tarps alert the owner. Routine inspections go to dispatch." },
  { icon: Database, title: "Lead lands cleanly", text: "Google Sheets or CRM receives a structured roofing lead with the summary." }
];

const features = [
  ["Roofing-only AI", "The agent stays inside roofing intake: leaks, storm damage, repair, replacement, inspections, tarps, insurance and service area."],
  ["Column-safe Sheets sync", "Map lead fields to existing Google Sheet columns without renaming, deleting, reordering or modifying the sheet structure."],
  ["Owner-grade alerts", "Urgent leads can trigger SMS and email alerts while normal leads flow quietly into dispatch and reporting."],
  ["Sandbox-first setup", "Onboarding, lead routing and integration checks can be reviewed before production credentials are connected."]
];

const pricing = [
  ["Launch", "$299/mo", "75 recovered conversations", "SMS follow-up, email alerts and Google Sheets delivery."],
  ["Growth", "$599/mo", "250 recovered conversations", "Urgent lead routing, CRM sync and weekly performance reports."],
  ["Market Leader", "$999/mo", "Higher-volume recovery", "Multi-location routing, priority setup and advanced reporting."]
];

const faqs = [
  ["Is this using paid services right now?", "No. The current build uses sandbox connectors so you can review setup safely before adding production accounts."],
  ["What does the client see after setup?", "They see their own setup status, chosen destination, notification rules and lead activity, not an unmarked demo account."],
  ["Can Google Sheets be used without breaking their sheet?", "Yes. The setup maps fields to existing column names and explicitly avoids renaming, deleting, reordering or modifying columns."]
];

export default function LandingPage() {
  return (
    <main id="main-content" className="bg-[#f7f5f0] text-slate-950">
      <section className="tech-hero overflow-hidden bg-[#101927] text-white">
        <LandingHeader />

        <div className="mx-auto grid min-h-[660px] max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:px-8">
          <div className="max-w-3xl">
            <Badge className="w-fit border border-cyan-300/30 bg-cyan-400/12 text-cyan-100">
              Akeno AI missed-call recovery for roofing crews
            </Badge>
            <h1 className="mt-6 text-4xl font-bold tracking-normal text-white sm:text-6xl lg:text-7xl">
              Sign in to every roofing call you almost lost.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Akeno turns missed calls into qualified roofing leads with instant SMS, roofing-only AI intake,
              urgent owner alerts, and clean delivery to Google Sheets or your CRM.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/onboarding?start=1"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-cyan-400 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 hover:bg-cyan-300"
              >
                Start client setup <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#workflow"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/18 bg-white/8 px-5 text-sm font-semibold text-white hover:bg-white/12"
              >
                See the workflow <Radar className="h-4 w-4" />
              </a>
              <Link
                href="/demo-chat"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-cyan-300/35 bg-cyan-300/10 px-5 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/15"
              >
                View demo chat <MessageSquareText className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["3 min", "missed-call recovery"],
                ["24/7", "after-hours capture"],
                ["Sheet-safe", "columns stay unchanged"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/12 bg-white/7 p-4">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="mt-1 text-sm text-slate-300">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <HeroConsole />
        </div>
      </section>

      <section id="workflow" className="border-y border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-cyan-700">Live recovery sequence</p>
              <h2 className="mt-2 text-3xl font-bold">A missed call becomes a dispatch-ready lead.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Built around the same pattern modern AI agent platforms emphasize: clear control, real-time routing,
              integrations, and measurable outcomes.
            </p>
          </div>
          <div className="mt-8 grid gap-3 lg:grid-cols-5">
            {workflow.map((step, index) => (
              <div key={step.title} className="rounded-lg border bg-[#fbfaf7] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-white">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-5 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase text-cyan-700">Why roofers care</p>
          <h2 className="mt-2 text-4xl font-bold">More signal than a voicemail. Less work than another hire.</h2>
          <p className="mt-4 text-muted-foreground">
            The system gives owners a sharp view of what happened, what the homeowner needs, and where the lead went.
          </p>
          <div className="mt-8 rounded-lg border bg-slate-950 p-5 text-white shadow-soft">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="font-semibold">Recovered lead packet</p>
                <p className="text-sm text-slate-400">Dallas, TX · active leak · insurance likely</p>
              </div>
              <Badge variant="warning">Owner alerted</Badge>
            </div>
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Service", "Emergency tarp + leak inspection"],
                ["Roof", "14-year architectural shingle"],
                ["Preferred time", "Today after 4 PM"],
                ["Destination", "Google Sheets · Missed Call Leads"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-white/8 p-3">
                  <p className="text-xs uppercase text-slate-400">{label}</p>
                  <p className="mt-1 font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(([title, text]) => (
            <Card key={title} className="bg-white">
              <CardHeader>
                <ShieldCheck className="h-6 w-6 text-cyan-700" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-[#162235] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-4">
            {[
              [PhoneCall, "Twilio-ready routing", "Connect a production number later without changing the onboarding flow."],
              [Bot, "OpenAI agent config", "Greeting, tone, questions, emergency rules and roofing-only instructions."],
              [Cloud, "n8n workflow handoff", "Workflow staging today, production provisioning when credentials are added."],
              [FileSpreadsheet, "Google Sheets safe mode", "Append or update leads while preserving the client’s existing sheet columns."]
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="rounded-lg border border-white/12 bg-white/7 p-5">
                <Icon className="h-6 w-6 text-cyan-300" />
                <h3 className="mt-4 font-semibold">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Pricing that matches lead volume</CardTitle>
            <CardDescription>Concrete plans for roofing companies that want missed-call recovery without another dispatcher seat.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {pricing.map(([plan, price, allowance, description]) => (
              <div key={plan} className="rounded-lg border p-5">
                <h3 className="font-semibold">{plan}</h3>
                <div className="mt-3 text-3xl font-bold">{price}</div>
                <p className="mt-2 text-sm font-semibold text-cyan-700">{allowance}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5 md:col-span-3">
              <p className="font-semibold text-cyan-950">$750 one-time onboarding</p>
              <p className="mt-1 text-sm text-cyan-950/80">Covers workflow setup, message configuration, routing rules and CRM or Google Sheets mapping.</p>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {faqs.map(([question, answer]) => (
            <Card key={question} className="bg-white">
              <CardHeader>
                <CardTitle className="text-base">{question}</CardTitle>
                <CardDescription>{answer}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Akeno · Missed-call recovery for roofing companies.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="font-semibold text-slate-800">Privacy</Link>
            <Link href="/contact" className="font-semibold text-slate-800">Contact</Link>
            <Link href="/dashboard" className="font-semibold text-slate-800">Client console</Link>
            <Link href="/onboarding?start=1" className="font-semibold text-cyan-700">Start setup</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function HeroConsole() {
  return (
    <div className="relative min-w-0 rounded-2xl border border-white/12 bg-slate-950/88 p-4 shadow-2xl shadow-slate-950/50">
      <div className="absolute inset-x-6 top-0 h-px bg-white/30" />
      <div className="rounded-xl border border-white/10 bg-[#0b1220]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="text-xs font-medium text-slate-400">akeno.ai/recovery-console</div>
        </div>
        <div className="grid min-w-0 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="space-y-4">
            <div className="rounded-lg border border-orange-300/20 bg-orange-400/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-orange-500 text-white">
                    <PhoneMissed className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Missed call recovered</p>
                    <p className="text-xs text-slate-400">(214) 555-0138 · Dallas 75230</p>
                  </div>
                </div>
                <Badge variant="warning">Urgent</Badge>
              </div>
              <div className="mt-4 rounded-md bg-white p-4 text-slate-950">
                <p className="text-sm font-semibold">AI summary</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Homeowner has active water intrusion near kitchen ceiling after hail. Wants inspection today after 4 PM.
                  Roof is 14 years old. Insurance claim likely.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [Gauge, "Recovery", "100%"],
                [Zap, "Owner alert", "sent"],
                [ClipboardCheck, "Lead status", "review"]
              ].map(([Icon, label, value]) => (
                <div key={String(label)} className="rounded-lg border border-white/10 bg-white/7 p-3">
                  <Icon className="h-4 w-4 text-orange-300" />
                  <p className="mt-3 text-xs text-slate-400">{label as string}</p>
                  <p className="text-lg font-bold text-white">{value as string}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/7 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">SMS thread</p>
                <Sparkles className="h-4 w-4 text-orange-300" />
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl rounded-tl-sm bg-white/12 p-3 text-slate-200">
                  Sorry we missed your call. Is this about a leak, storm damage, repair, replacement or inspection?
                </div>
                <div className="ml-8 rounded-2xl rounded-tr-sm bg-orange-500 p-3 text-white">
                  Active leak. Water is coming through the kitchen ceiling.
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white/12 p-3 text-slate-200">
                  Thanks. Please send the property address and any photos. I’m alerting the roofing team now.
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
                <Headphones className="h-4 w-4" />
                Dispatcher-ready packet
              </div>
              <p className="mt-2 text-sm leading-6 text-emerald-50/78">
                Name, phone, address, ZIP, service, urgency, insurance context, summary and next step are ready to sync.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
