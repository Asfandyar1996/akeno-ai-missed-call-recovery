import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Clock, Mail, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";

export const metadata: Metadata = {
  title: "Contact | Akeno",
  description: "Contact Akeno about AI missed-call recovery for roofing and home-service businesses."
};

const contactRoutes = [
  {
    title: "Product and demos",
    email: "info@akenobuilds.com",
    text: "Use this for product questions, partnership discussions, and walkthroughs of the missed-call recovery system.",
    icon: MessageSquareText
  },
  {
    title: "Setup and implementation",
    email: "contact@akenobuilds.com",
    text: "Use this for onboarding, workflow setup, integration planning, and production activation questions.",
    icon: Building2
  }
];

export default function ContactPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f7f5f0] text-slate-950">
      <LandingHeader variant="light" />

      <section className="border-b bg-[#101927] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Akeno Builds
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-normal sm:text-6xl">Contact Akeno</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Talk to us about AI missed-call recovery, roofing lead intake, n8n workflow setup, Twilio-style SMS routing,
              and CRM or Google Sheets handoff.
            </p>
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/7 p-5 shadow-2xl shadow-slate-950/35">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["24/7", "missed-call capture design"],
                ["AI", "roofing intake guardrails"],
                ["CRM", "Sheets and pipeline handoff"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/8 p-4">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-300">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
              Akeno is built for practical home-service automation: fast response, clear guardrails, human confirmation,
              and clean lead delivery.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {contactRoutes.map((route) => (
            <div key={route.email} className="rounded-lg border bg-white p-6 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-cyan-50 text-cyan-700">
                <route.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl font-semibold">{route.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{route.text}</p>
              <a
                href={`mailto:${route.email}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-900"
              >
                <Mail className="h-4 w-4" />
                {route.email}
              </a>
            </div>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <Clock className="h-6 w-6 text-cyan-700" />
            <h2 className="mt-4 text-xl font-semibold">What to include</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Company type and service area.</li>
              <li>Current phone, CRM, or Google Sheets workflow.</li>
              <li>Whether you want a demo, setup help, or production planning.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-6 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-cyan-800" />
            <h2 className="mt-4 text-xl font-semibold text-cyan-950">Demo-ready links</h2>
            <p className="mt-3 text-sm leading-6 text-cyan-950/80">
              You can also review the product flow before contacting us.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link href="/demo-chat" className="inline-flex items-center justify-between rounded-md bg-white px-4 py-3 text-sm font-semibold text-cyan-950 hover:bg-cyan-100">
                View recovery demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/onboarding?start=1" className="inline-flex items-center justify-between rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Start setup <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
