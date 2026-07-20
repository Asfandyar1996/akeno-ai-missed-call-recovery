import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Clock, Mail, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";

export const metadata: Metadata = {
  title: "Contact | Akeno",
  description: "Contact Akeno about AI missed-call recovery for roofing and home-service businesses."
};

const contactRoutes = [
  {
    title: "Explore the product",
    email: "info@akenobuilds.com",
    text: "Ask about the product, a client walkthrough, or whether missed-call recovery fits your roofing workflow.",
    icon: MessageSquareText,
    label: "Product and demo questions"
  },
  {
    title: "Plan implementation",
    email: "contact@akenobuilds.com",
    text: "Use this for onboarding, message routing, CRM or Google Sheets delivery, and production setup planning.",
    icon: Building2,
    label: "Setup and implementation"
  }
];

const nextSteps = [
  ["1", "Share your current workflow", "Tell us how missed calls, text messages, and leads are handled today."],
  ["2", "Review the right setup", "We map the recovery conversation, team alerts, and lead destination around your process."],
  ["3", "Keep people in control", "Your team reviews each lead and confirms the appointment or dispatch directly with the customer."]
];

export default function ContactPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 text-slate-950">
      <LandingHeader variant="light" />

      <section className="tech-hero border-b border-slate-800 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Akeno Builds
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-normal sm:text-6xl">Talk through your missed-call workflow.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              We help roofing and home-service teams turn missed calls into a clear, human-owned lead follow-up process.
            </p>
          </div>

          <div className="border border-white/12 bg-slate-950/45 p-5 shadow-2xl shadow-slate-950/25">
            <p className="text-sm font-semibold text-cyan-100">A practical first conversation</p>
            <div className="mt-4 space-y-3">
              {[
                "How missed calls are handled today",
                "What your team needs to know before calling back",
                "Where a finished lead should arrive"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 border border-white/10 bg-white/6 px-3 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-200" />
                  <span className="text-sm font-medium text-slate-100">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Akeno is designed for fast response, clear lead context, and human confirmation before any job is scheduled or dispatched.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-cyan-800">Choose the right conversation</p>
          <h2 className="mt-2 text-3xl font-bold">Two direct ways to reach us.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Use the email that best matches what you need. Both routes reach the Akeno team.</p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {contactRoutes.map((route) => (
            <section key={route.email} className="border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-cyan-50 text-cyan-700">
                <route.icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-sm font-semibold text-cyan-800">{route.label}</p>
              <h3 className="mt-1 text-2xl font-semibold">{route.title}</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">{route.text}</p>
              <a
                href={`mailto:${route.email}`}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Mail className="h-4 w-4" />
                Email {route.email}
              </a>
            </section>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-cyan-800">What happens next</p>
            <h2 className="mt-2 text-3xl font-bold">A straightforward path to a working setup.</h2>
            <div className="mt-7 space-y-5">
              {nextSteps.map(([number, title, text]) => (
                <div key={number} className="grid grid-cols-[40px_1fr] gap-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-sm font-bold text-white">{number}</span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="border border-cyan-200 bg-cyan-50 p-6">
            <Clock className="h-6 w-6 text-cyan-800" />
            <h2 className="mt-4 text-xl font-semibold text-cyan-950">A useful first email</h2>
            <p className="mt-3 text-sm leading-6 text-cyan-950/80">
              Include these details so the conversation can start with the right context.
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-cyan-950/80">
              {[
                "Your business type and service area.",
                "How your team currently handles missed calls.",
                "Your preferred lead destination: CRM, spreadsheet, inbox, or another system.",
                "Whether you want a demo, setup help, or production planning."
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-700" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-slate-950 text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Want to see the experience first?</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Walk through the customer journey before starting a conversation with the team.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/demo" className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">
            View interactive demo <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/demo-chat" className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            View recovery story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
