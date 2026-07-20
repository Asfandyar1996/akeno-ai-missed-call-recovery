import type { Metadata } from "next";
import { Bot, Database, FileText, LockKeyhole, Mail, MessageSquareText, PhoneCall, ShieldCheck } from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";

export const metadata: Metadata = {
  title: "Privacy Policy | Akeno",
  description: "Privacy policy for Akeno, an AI missed-call recovery platform for roofing companies."
};

const sections = [
  {
    id: "information",
    title: "Information we collect",
    body: [
      "Business setup details, including company name, contact details, service area, and notification preferences.",
      "Lead and customer intake details, including a phone number, name, property address, roofing issue, active-leak or storm context, shared photos or links, appointment preferences, and conversation history.",
      "Connection details required to route leads to the destinations selected by a roofing business, such as SMS routing, a CRM, Google Sheets, notification tools, and workflow settings.",
      "Basic product and website activity, including page views, setup activity, delivery status, device and browser information, timestamps, and error logs."
    ]
  },
  {
    id: "use",
    title: "How we use information",
    body: [
      "To send missed-call follow-up messages and continue a customer intake conversation.",
      "To organize a roofing inquiry into a useful handoff, including the issue, urgency, address, and preferred follow-up time.",
      "To notify the roofing business, deliver a lead to approved destinations, and maintain product, setup, and delivery status.",
      "To improve reliability, troubleshoot problems, prevent abuse, and protect the service."
    ]
  },
  {
    id: "ai",
    title: "AI-assisted intake",
    body: [
      "Akeno may use AI services to classify roofing inquiries, summarize conversations, identify missing intake details, and draft concise SMS replies.",
      "The intake experience is designed for accepted roofing topics. It should not provide final pricing, legal advice, structural-safety diagnoses, or insurance outcome guarantees.",
      "Akeno supports lead intake and routing. The roofing business remains responsible for reviewing leads, confirming appointments, and making all service decisions."
    ]
  },
  {
    id: "sms",
    title: "SMS communications",
    body: [
      "A customer may receive an SMS after calling a roofing business that uses Akeno, including missed-call follow-up, intake questions, and appointment-related messages.",
      "Message frequency depends on the conversation. Message and data rates may apply.",
      "A customer can reply STOP to opt out of SMS messages. They can reply HELP or contact the roofing business for assistance."
    ]
  },
  {
    id: "sharing",
    title: "Sharing and service providers",
    body: [
      "We share information only as needed to operate the service, including with SMS, AI, hosting, database, workflow, CRM, spreadsheet, and notification providers selected or approved by the roofing business.",
      "Akeno does not sell personal information.",
      "Information may be disclosed when required by law or when necessary to protect the service, prevent fraud or abuse, or respond to a security incident."
    ]
  },
  {
    id: "retention",
    title: "Data retention and choices",
    body: [
      "We retain business setup information, lead records, message history, logs, and delivery metadata for as long as needed to operate and support the service, meet obligations, resolve disputes, and improve reliability.",
      "A roofing business can request deletion or export of its account and lead data, subject to legal, security, backup, and operational requirements.",
      "To request access, correction, deletion, or export of information, contact the roofing business using Akeno or contact Akeno directly."
    ]
  },
  {
    id: "security",
    title: "Security",
    body: [
      "Akeno uses reasonable technical and organizational measures designed to protect information from unauthorized access, loss, misuse, and alteration.",
      "No internet-connected service can be guaranteed completely secure. Businesses should avoid sending unnecessary sensitive information through SMS or intake forms."
    ]
  }
];

const principles = [
  [PhoneCall, "Customer choice", "SMS recipients can reply STOP to opt out."],
  [Bot, "Human ownership", "Your team confirms appointments and service decisions."],
  [Database, "Business-controlled routing", "Leads go only to the destinations your business approves."],
  [LockKeyhole, "Practical security", "Information is used to operate and protect the service."]
] as const;

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 text-slate-950">
      <LandingHeader variant="light" />

      <section className="tech-hero border-b border-slate-800 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-cyan-100">Akeno privacy</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal sm:text-5xl">Clear handling for every recovered lead.</h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              This policy explains how Akeno handles information across its website, setup experience, dashboard, and
              AI-assisted roofing lead intake.
            </p>
            <p className="mt-5 text-sm text-slate-400">Last updated: July 8, 2026</p>
          </div>

          <div className="border border-white/12 bg-slate-950/45 p-5 shadow-2xl shadow-slate-950/25">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-cyan-300 text-slate-950">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-white">Privacy at a glance</p>
                <p className="mt-0.5 text-sm text-slate-300">The parts that matter in day-to-day use.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {principles.map(([Icon, title, text]) => (
                <div key={title} className="border border-white/10 bg-white/6 p-3">
                  <Icon className="h-4 w-4 text-cyan-200" />
                  <p className="mt-2 text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-cyan-800">Plain-English summary</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Akeno uses business and lead information to recover missed roofing calls, organize the conversation,
              alert the right person, and send the lead to the business destinations you choose.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-700">
            <span>We do not sell personal information.</span>
            <span>Customers can opt out by replying STOP.</span>
            <span>People make the final service decision.</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-cyan-700" />
              <h2 className="font-semibold">On this page</h2>
            </div>
            <nav className="mt-4 space-y-1" aria-label="Privacy policy sections">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-900"
                >
                  <span className="text-xs font-bold text-cyan-700">0{index + 1}</span>
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-4 border border-cyan-200 bg-cyan-50 p-5">
            <MessageSquareText className="h-5 w-5 text-cyan-800" />
            <p className="mt-3 text-sm font-semibold text-cyan-950">Questions about your data?</p>
            <a aria-label="Email Akeno privacy team" href="mailto:contact@akenobuilds.com" className="mt-2 inline-flex text-sm font-semibold text-cyan-800 hover:text-cyan-950">
              contact@akenobuilds.com
            </a>
          </div>
        </aside>

        <article className="min-w-0 border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-cyan-50 text-cyan-700">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-cyan-800">Full policy</p>
              <p className="mt-0.5 text-sm text-slate-500">For visitors, roofing businesses, and customers contacted through Akeno.</p>
            </div>
          </div>

          <div className="mt-7 space-y-9">
            {sections.map((section) => (
              <section id={section.id} key={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                  {section.body.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="border border-cyan-200 bg-cyan-50 p-5">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-cyan-800" />
                <h2 className="font-semibold text-cyan-950">Contact Akeno</h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-cyan-950/80">
                Questions about this policy can be sent to contact@akenobuilds.com or info@akenobuilds.com. Customers
                of a roofing business using Akeno can also contact that roofing business about their lead or message history.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {["contact@akenobuilds.com", "info@akenobuilds.com"].map((email) => (
                  <a key={email} href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-md border border-cyan-200 bg-white px-3 py-2 text-sm font-semibold text-cyan-900 hover:bg-cyan-100">
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
