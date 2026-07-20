import type { ReactNode } from "react";
import {
  BellRing,
  CalendarCheck,
  CheckCheck,
  ClipboardCheck,
  Clock,
  CloudRain,
  Droplets,
  Home,
  MessageCircle,
  Mic,
  MoreVertical,
  Phone,
  PhoneMissed,
  Send,
  ShieldCheck,
  Sparkles,
  Video,
  Zap
} from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";

const chapters = [
  ["01", "Leak", "A homeowner spots water coming through the ceiling after a storm."],
  ["02", "Missed call", "The roofing company is busy, closed, or already on another job."],
  ["03", "Akeno texts", "The homeowner gets a human-feeling reply before calling a competitor."],
  ["04", "Ready for dispatch", "Urgency, address, preferred window, and summary are sent to the team."]
];

const chatMessages = [
  {
    side: "akeno",
    time: "7:42 PM",
    text: "Hi Sarah, this is Akeno for RidgeLine Roofing. Sorry we missed your call. Are you dealing with a leak, storm damage, repair, replacement, or an inspection?"
  },
  {
    side: "customer",
    time: "7:43 PM",
    text: "Leak. Water is coming through the kitchen ceiling after the storm."
  },
  {
    side: "akeno",
    time: "7:43 PM",
    text: "Is water actively coming in right now? If yes, please send the property address."
  },
  {
    side: "customer",
    time: "7:44 PM",
    text: "Yes, dripping into a bucket. 1842 Cedar Grove Dr, Dallas."
  },
  {
    side: "akeno",
    time: "7:44 PM",
    text: "Got it. I marked this urgent and alerted the owner. What time windows work best tonight or tomorrow morning?"
  },
  {
    side: "customer",
    time: "7:45 PM",
    text: "Tonight after 8:30 if possible. Tomorrow morning also works."
  },
  {
    side: "akeno",
    time: "7:45 PM",
    text: "Got it. I sent this to the roofing team as urgent. They’ll confirm the exact arrival time."
  }
];

const leadPacket = [
  ["Customer", "Sarah Mitchell"],
  ["Phone", "(214) 555-0138"],
  ["Issue", "Active kitchen ceiling leak"],
  ["Address", "1842 Cedar Grove Dr, Dallas"],
  ["Urgency", "Water actively entering"],
  ["Preferred window", "Tonight after 8:30 PM"]
];

export function RecoveryStoryDemo() {
  return (
    <main id="main-content" className="min-h-screen bg-[#07111f] text-white">
      <LandingHeader />
      <section className="demo-story-grid">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <section className="grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
                <Sparkles className="h-4 w-4" />
                Akeno recovery story
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-normal text-white sm:text-6xl">
                A roof leak, one missed call, and an urgent lead ready for dispatch.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                This demo shows the exact sales story: a homeowner has a leak, calls the roofer, gets no answer,
                then Akeno captures the lead, confirms urgency, collects the address, and alerts the team to confirm the job.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {chapters.map(([number, title, description]) => (
                <div key={number} className="rounded-lg border border-white/12 bg-white/8 p-4 shadow-xl backdrop-blur">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-300 text-sm font-bold text-slate-950">
                      {number}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-5 pb-10 lg:grid-cols-2">
            <LeakScene />
            <MissedCallScene />
            <ChatScene />
            <LeadPacketScene />
          </section>
        </div>
      </section>
    </main>
  );
}

export default RecoveryStoryDemo;

function SceneShell({
  children,
  className = "",
  number,
  title,
  text
}: {
  children: ReactNode;
  className?: string;
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className={`demo-panel rounded-2xl border border-white/12 bg-white/8 p-4 shadow-2xl backdrop-blur ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-300 text-sm font-bold text-slate-950">
            {number}
          </span>
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{text}</p>
          </div>
        </div>
      </div>
      {children}
    </article>
  );
}

function LeakScene() {
  return (
    <SceneShell
      number="1"
      title="The homeowner has an active leak"
      text="This is the situation every roofer cares about: water is entering the home and the customer needs a response now."
    >
      <div className="cartoon-room relative h-[390px] overflow-hidden rounded-xl border border-amber-900/15 bg-gradient-to-b from-[#ffe9b5] to-[#f7d38c] text-slate-950">
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[#b97945]" />
        <div className="absolute left-7 top-7 flex items-center gap-2 rounded-full bg-slate-900/85 px-3 py-2 text-xs font-semibold text-white">
          <CloudRain className="h-4 w-4 text-cyan-200" />
          Storm passed 20 minutes ago
        </div>
        <div className="absolute left-9 top-24 h-24 w-36 rounded-lg bg-[#7fc0e8] shadow-inner">
          <div className="grid h-full grid-cols-2 gap-1 p-2">
            <span className="rounded bg-white/45" />
            <span className="rounded bg-white/45" />
            <span className="rounded bg-white/45" />
            <span className="rounded bg-white/45" />
          </div>
        </div>
        <div className="absolute right-10 top-12">
          <div className="h-16 w-32 rounded-full bg-[#8b5a3c]" />
          <div className="-mt-3 h-9 w-40 rounded-full bg-[#6f472f]" />
        </div>
        <div className="absolute left-[51%] top-0 h-24 w-32 rounded-b-full bg-[#8a6a49]/30" />
        <Droplets className="leak-drop absolute left-[55%] top-24 h-7 w-7 text-cyan-600" />
        <Droplets className="leak-drop absolute left-[60%] top-28 h-5 w-5 text-cyan-600" style={{ animationDelay: "0.35s" }} />
        <div className="bucket absolute bottom-9 left-[52%] h-14 w-20 rounded-b-2xl border-4 border-slate-500 bg-cyan-100" />

        <div className="person-panicked absolute bottom-16 left-16">
          <span className="absolute -right-5 -top-5 text-3xl font-black text-orange-600">!</span>
          <span className="absolute -left-4 top-6 h-6 w-2 -rotate-12 rounded-full bg-cyan-500" />
          <div className="relative h-20 w-20 rounded-full bg-[#f6c48f]">
            <div className="absolute -top-3 left-2 h-8 w-16 rounded-t-full bg-[#3b2b24]" />
            <span className="absolute left-4 top-6 h-1.5 w-4 -rotate-12 rounded-full bg-slate-900" />
            <span className="absolute right-4 top-6 h-1.5 w-4 rotate-12 rounded-full bg-slate-900" />
            <span className="absolute left-5 top-8 h-2 w-2 rounded-full bg-slate-900" />
            <span className="absolute right-5 top-8 h-2 w-2 rounded-full bg-slate-900" />
            <span className="absolute left-8 top-12 h-5 w-5 rounded-full bg-slate-900" />
          </div>
          <div className="mx-auto h-24 w-24 rounded-t-3xl bg-[#24a6c8]" />
          <div className="absolute left-[-22px] top-24 h-8 w-16 -rotate-12 rounded-full bg-[#f6c48f]" />
          <div className="absolute right-[-18px] top-24 h-8 w-16 rotate-12 rounded-full bg-[#f6c48f]" />
        </div>

        <div className="absolute bottom-7 right-7 w-64 rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Home className="h-4 w-4 text-cyan-700" />
            “Water is coming through my kitchen ceiling.”
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            This is not a casual lead. It should be routed urgently and captured immediately.
          </p>
        </div>
      </div>
    </SceneShell>
  );
}

function MissedCallScene() {
  return (
    <SceneShell
      number="2"
      title="The roofer misses the call"
      text="The moment of loss is simple: the homeowner calls, nobody answers, and the next contractor is one search away."
    >
      <div className="grid min-h-[390px] gap-4 rounded-xl border border-white/10 bg-slate-950/70 p-5 md:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-xl bg-white p-5 text-slate-950 shadow-xl">
          <p className="text-xs font-semibold uppercase text-slate-500">Homeowner phone</p>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">Calling</p>
            <h3 className="mt-1 text-2xl font-bold">RidgeLine Roofing</h3>
            <p className="mt-1 text-sm text-slate-500">(214) 555-0188</p>
            <div className="mt-8 flex justify-center">
              <div className="ringing-phone grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-900/30">
                <Phone className="h-9 w-9" />
              </div>
            </div>
            <p className="mt-6 text-sm font-semibold text-orange-600">Ringing... no answer</p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-orange-300/25 bg-orange-500/12 p-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-orange-500 text-white">
                <PhoneMissed className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase text-orange-100/80">Missed call detected</p>
                <h3 className="text-2xl font-bold text-white">Akeno starts recovery</h3>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-orange-50/85">
              Instead of leaving the homeowner at voicemail, Akeno sends a fast text that feels like the roofing
              company is still responsive.
            </p>
          </div>
          <div className="mt-5 rounded-lg bg-white/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Zap className="h-4 w-4 text-cyan-300" />
              Recovery text sent in under 60 seconds
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}

function ChatScene() {
  return (
    <SceneShell
      className="lg:col-span-2"
      number="3"
      title="Akeno qualifies the emergency by text"
      text="The chat keeps it simple for the homeowner and useful for the roofer: issue, urgency, address, preferred time, and owner alert."
    >
      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-3">
          {[
            ["Detects urgency", "Active water entering means owner alert, not normal follow-up."],
            ["Collects dispatch info", "Name, phone, address, issue, preferred time, and summary."],
            ["Avoids bad promises", "No structural diagnosis and no insurance outcome promises."]
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-white/10 bg-slate-950/55 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                {title}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
            </div>
          ))}
          <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
            <p className="text-sm font-semibold text-cyan-100">What the roofer gets</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
              <span className="rounded-md bg-white/8 px-3 py-2">Active leak</span>
              <span className="rounded-md bg-white/8 px-3 py-2">Full address</span>
              <span className="rounded-md bg-white/8 px-3 py-2">Preferred time</span>
              <span className="rounded-md bg-white/8 px-3 py-2">Owner alert</span>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[450px] rounded-[30px] border border-white/16 bg-[#101821] p-2.5 shadow-2xl shadow-cyan-950/30">
          <div className="rounded-[28px] border border-black/50 bg-[#0b141a] p-2">
            <div className="overflow-hidden rounded-[22px] bg-[#efe6d8] shadow-inner">
              <div className="h-7 bg-[#075e55]" />
              <div className="flex items-center justify-between bg-[#075e55] px-4 pb-3 text-white">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-200 to-teal-400 text-sm font-bold text-slate-950">
                    A
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold leading-tight">Akeno Roofing Assistant</p>
                    <p className="text-xs text-emerald-100/80">online now</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-emerald-50/90">
                  <Video className="h-4 w-4" />
                  <Phone className="h-4 w-4" />
                  <MoreVertical className="h-4 w-4" />
                </div>
              </div>

              <div className="chat-wall px-3 py-3">
                <div className="mx-auto mb-3 w-fit rounded-md bg-[#fff7cf] px-3 py-2 text-center text-[11px] leading-4 text-[#66542a] shadow-sm">
                  Missed-call recovery starts automatically
                </div>
                <div className="space-y-2">
                  {chatMessages.map((message, index) => (
                    <div
                      key={`${message.time}-${message.text}`}
                      className={`chat-pop flex ${message.side === "customer" ? "justify-end" : "justify-start"}`}
                      style={{ animationDelay: `${0.25 + index * 0.35}s` }}
                    >
                      <div
                        className={`max-w-[84%] rounded-lg px-3 py-2 text-[11px] leading-4 shadow-sm ${
                          message.side === "customer"
                            ? "rounded-tr-sm bg-[#d8ffc8] text-[#102216]"
                            : "rounded-tl-sm bg-white text-[#111b21]"
                        }`}
                      >
                        <p>{message.text}</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-black/45">
                          <span>{message.time}</span>
                          {message.side === "akeno" ? <CheckCheck className="h-3 w-3 text-[#53bdeb]" /> : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#f0f2f5] px-3 py-3">
                <div className="flex h-10 flex-1 items-center rounded-full bg-white px-4 text-sm text-slate-400">
                  Message
                </div>
                <button className="grid h-10 w-10 place-items-center rounded-full bg-[#00a884] text-white" aria-label="Voice message">
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}

function LeadPacketScene() {
  return (
    <SceneShell
      className="lg:col-span-2"
      number="4"
      title="The roofing team gets a lead ready to confirm"
      text="The demo ends with the business outcome: the urgent lead is captured, organized, and sent to a human who controls the schedule."
    >
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-xl border border-emerald-300/25 bg-slate-950/80 p-5 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
                <BellRing className="h-4 w-4" />
                Owner alert sent
              </div>
              <h3 className="mt-2 text-2xl font-bold text-white">Urgent lead ready for dispatch</h3>
            </div>
            <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-slate-950">URGENT</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {leadPacket.map(([label, value]) => (
              <div key={label} className="rounded-md bg-white/8 p-3">
                <p className="text-[11px] font-semibold uppercase text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-lg bg-emerald-300/10 px-3 py-3 text-sm text-emerald-50">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Human confirmation needed
            </span>
            <Send className="h-4 w-4" />
          </div>
        </div>

        <div className="grid gap-3">
          {[
            [ClipboardCheck, "Google Sheet row appended", "No column changes. The lead is added to the client’s existing sheet."],
            [MessageCircle, "SMS alert to owner", "Urgent jobs reach the owner immediately, even after-hours."],
            [CalendarCheck, "Preferred window captured", "The homeowner gives a workable time window. The team confirms the exact appointment."]
          ].map(([Icon, title, text]) => (
            <div key={String(title)} className="rounded-lg border border-white/10 bg-white/8 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-cyan-300 text-slate-950">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">{title as string}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{text as string}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}
