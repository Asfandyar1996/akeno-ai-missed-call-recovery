"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  Bot,
  CheckCircle2,
  ClipboardList,
  CloudRain,
  Database,
  Home,
  MessageSquareText,
  PhoneCall,
  PhoneMissed,
  RefreshCcw,
  Send,
  ShieldCheck,
  Siren,
  Sparkles,
  UserCheck,
  Workflow
} from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ScenarioId = "active-leak" | "storm-damage" | "replacement" | "inspection";
type Message = { id: number; from: "homeowner" | "akeno"; text: string; label?: string };
type LeadState = {
  customer: string;
  phone: string;
  issue: string;
  urgency: "Not started" | "Routine" | "Elevated" | "Urgent";
  address: string;
  propertyType: string;
  insurance: string;
  appointment: string;
  summary: string;
  nextAction: string;
  confidence: number;
};

const scenarios: Record<
  ScenarioId,
  {
    title: string;
    icon: typeof CloudRain;
    description: string;
    initial: string;
    quickReplies: string[];
    lead: LeadState;
  }
> = {
  "active-leak": {
    title: "Active leak",
    icon: CloudRain,
    description: "Water is entering the home now. This should become an urgent lead.",
    initial: "Water is coming through my kitchen ceiling after the storm. It is dripping into a bucket.",
    quickReplies: [
      "Yes, water is actively coming in. 1842 Cedar Grove Dr, Dallas. Tonight after 8 works.",
      "It is a residential shingle roof, about 12 years old. I can send photos.",
      "I may file insurance, but I need someone to stop the leak first."
    ],
    lead: {
      customer: "Sarah Mitchell",
      phone: "(214) 555-0138",
      issue: "Active kitchen ceiling leak",
      urgency: "Urgent",
      address: "1842 Cedar Grove Dr, Dallas, TX",
      propertyType: "Residential",
      insurance: "Likely storm-related claim",
      appointment: "Tonight after 8:00 PM",
      summary: "Homeowner reports active water intrusion in kitchen after a storm.",
      nextAction: "Owner should call to confirm emergency tarp or inspection window.",
      confidence: 94
    }
  },
  "storm-damage": {
    title: "Storm damage",
    icon: Siren,
    description: "A hail/wind lead needs qualification, photos, and insurance context.",
    initial: "We had hail last night and I see shingles in the yard. I want someone to inspect it.",
    quickReplies: [
      "Address is 9308 Lake Hollow Ct, Plano. Residential. No active leak.",
      "The roof is about 9 years old and I have photos of the shingles.",
      "Insurance has not been opened yet. Tomorrow afternoon is best."
    ],
    lead: {
      customer: "Marcus Reed",
      phone: "(972) 555-0164",
      issue: "Possible hail and wind damage",
      urgency: "Elevated",
      address: "9308 Lake Hollow Ct, Plano, TX",
      propertyType: "Residential",
      insurance: "Potential claim, not opened",
      appointment: "Tomorrow afternoon",
      summary: "Homeowner reports hail event and loose shingles in yard, no active water entry.",
      nextAction: "Dispatcher should confirm inspection slot and request exterior photos.",
      confidence: 86
    }
  },
  replacement: {
    title: "Roof replacement",
    icon: Home,
    description: "A non-urgent high-value quote request should still be captured cleanly.",
    initial: "I need a roof replacement quote for an older house before listing it for sale.",
    quickReplies: [
      "It is a residential roof in Frisco, about 22 years old.",
      "No leak, but the inspection report says it is near end of life.",
      "Weekday mornings work best. Address is 411 Sycamore Bend."
    ],
    lead: {
      customer: "Dana Collins",
      phone: "(469) 555-0192",
      issue: "Replacement quote",
      urgency: "Routine",
      address: "411 Sycamore Bend, Frisco, TX",
      propertyType: "Residential",
      insurance: "Not insurance-related",
      appointment: "Weekday morning",
      summary: "Homeowner wants replacement quote before listing property for sale.",
      nextAction: "Sales rep should schedule estimate and request inspection report.",
      confidence: 79
    }
  },
  inspection: {
    title: "Routine inspection",
    icon: ClipboardList,
    description: "A normal inspection request should be routed without emergency escalation.",
    initial: "I just bought a house and want a roof inspection sometime next week.",
    quickReplies: [
      "No active leak. Address is 7620 Ridge Creek Ln, Fort Worth.",
      "It is residential, roof age unknown, and Tuesday or Wednesday works.",
      "I only need a condition report and repair recommendations."
    ],
    lead: {
      customer: "Evan Parker",
      phone: "(817) 555-0119",
      issue: "Buyer roof inspection",
      urgency: "Routine",
      address: "7620 Ridge Creek Ln, Fort Worth, TX",
      propertyType: "Residential",
      insurance: "No insurance context",
      appointment: "Tuesday or Wednesday next week",
      summary: "New homeowner requests routine roof condition inspection.",
      nextAction: "Office should offer normal inspection appointment windows.",
      confidence: 74
    }
  }
};

const workflowSteps = [
  { key: "missed", label: "Missed call", icon: PhoneMissed },
  { key: "sms", label: "Instant SMS", icon: MessageSquareText },
  { key: "intake", label: "AI intake", icon: Bot },
  { key: "memory", label: "Lead memory", icon: Database },
  { key: "alert", label: "Team alert", icon: BellRing },
  { key: "review", label: "Human review", icon: UserCheck }
];

const starterMessage =
  "Hi, this is Akeno for RidgeLine Roofing. Sorry we missed your call. Are you dealing with a leak, storm damage, repair, replacement, or an inspection?";

export function MissedCallSimulator() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("active-leak");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(scenarios["active-leak"].initial);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [lead, setLead] = useState<LeadState>({
    customer: "Unknown homeowner",
    phone: "(214) 555-0138",
    issue: "Waiting for missed call",
    urgency: "Not started",
    address: "Not collected",
    propertyType: "Unknown",
    insurance: "Unknown",
    appointment: "Not collected",
    summary: "No homeowner context captured yet.",
    nextAction: "Trigger the missed-call recovery flow.",
    confidence: 0
  });
  const [typing, setTyping] = useState(false);
  const [ownerAlerted, setOwnerAlerted] = useState(false);

  const scenario = scenarios[scenarioId];
  const progress = Math.round((completedSteps.length / workflowSteps.length) * 100);
  const currentStep = workflowSteps.find((step) => !completedSteps.includes(step.key))?.key ?? "done";

  const leadRows = useMemo(
    () => [
      ["Customer", lead.customer],
      ["Phone", lead.phone],
      ["Issue", lead.issue],
      ["Urgency", lead.urgency],
      ["Address", lead.address],
      ["Property type", lead.propertyType],
      ["Insurance", lead.insurance],
      ["Appointment", lead.appointment]
    ],
    [lead]
  );

  const chooseScenario = (next: ScenarioId) => {
    setScenarioId(next);
    setInput(scenarios[next].initial);
    setMessages([]);
    setCompletedSteps([]);
    setOwnerAlerted(false);
    setTyping(false);
    setLead({
      customer: "Unknown homeowner",
      phone: "(214) 555-0138",
      issue: "Waiting for missed call",
      urgency: "Not started",
      address: "Not collected",
      propertyType: "Unknown",
      insurance: "Unknown",
      appointment: "Not collected",
      summary: "No homeowner context captured yet.",
      nextAction: "Trigger the missed-call recovery flow.",
      confidence: 0
    });
  };

  const triggerMissedCall = () => {
    setCompletedSteps(["missed", "sms"]);
    setOwnerAlerted(false);
    setMessages([{ id: Date.now(), from: "akeno", text: starterMessage, label: "Instant missed-call text" }]);
    setLead((current) => ({
      ...current,
      phone: scenario.lead.phone,
      summary: "Missed call recovered. Waiting for homeowner details.",
      nextAction: "Ask intake questions and classify urgency.",
      confidence: 28
    }));
  };

  const sendMessage = (text = input) => {
    const clean = text.trim();
    if (!clean) return;

    const now = Date.now();
    setMessages((current) => [...current, { id: now, from: "homeowner", text: clean }]);
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      setTyping(false);
      setCompletedSteps((current) => Array.from(new Set([...current, "missed", "sms", "intake", "memory", "alert"])));
      setOwnerAlerted(scenario.lead.urgency !== "Routine");
      setLead(scenario.lead);
      setMessages((current) => [
        ...current,
        {
          id: now + 1,
          from: "akeno",
          label: "AI intake response",
          text: buildReply(scenarioId, clean)
        }
      ]);
    }, 520);
  };

  const markHumanReview = () => {
    setCompletedSteps((current) => Array.from(new Set([...current, "missed", "sms", "intake", "memory", "alert", "review"])));
    setLead((current) => ({
      ...current,
      nextAction: "Human reviewer has confirmed this lead is ready for dispatch follow-up."
    }));
  };

  const resetDemo = () => chooseScenario(scenarioId);

  return (
    <main id="main-content" className="min-h-screen bg-[#07111f] text-white">
      <LandingHeader />

      <section className="demo-simulator-grid border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <div className="soft-enter">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Live simulator
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-normal text-white sm:text-6xl">
              Missed Call Recovery Simulator
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Trigger a missed roofing call, send homeowner replies, and watch Akeno update the SMS thread,
              workflow state, lead packet, urgency classification, and owner alert in real time.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="bg-cyan-400 text-slate-950 hover:bg-cyan-300" onClick={triggerMissedCall}>
                <PhoneMissed className="h-4 w-4" />
                Trigger missed call
              </Button>
              <Button size="lg" variant="outline" className="border-white/16 bg-white/8 text-white hover:bg-white/12" onClick={resetDemo}>
                <RefreshCcw className="h-4 w-4" />
                Reset simulator
              </Button>
              <Link
                href="/demo-chat"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/16 bg-white/8 px-5 text-sm font-semibold text-white hover:bg-white/12"
              >
                View storyboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.entries(scenarios) as Array<[ScenarioId, typeof scenario]>).map(([id, item]) => {
              const Icon = item.icon;
              const active = id === scenarioId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => chooseScenario(id)}
                  className={cn(
                    "rounded-lg border p-4 text-left transition",
                    active
                      ? "border-cyan-300/60 bg-cyan-300/14 shadow-lg shadow-cyan-950/20"
                      : "border-white/12 bg-white/8 hover:border-white/30 hover:bg-white/12"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("grid h-10 w-10 place-items-center rounded-md", active ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-cyan-200")}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">{item.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[0.72fr_1.08fr_0.82fr] lg:px-8">
        <WorkflowPanel completedSteps={completedSteps} currentStep={currentStep} progress={progress} ownerAlerted={ownerAlerted} />
        <ChatPanel
          input={input}
          messages={messages}
          quickReplies={scenario.quickReplies}
          scenarioInitial={scenario.initial}
          typing={typing}
          onInput={setInput}
          onSend={sendMessage}
        />
        <LeadPanel lead={lead} leadRows={leadRows} ownerAlerted={ownerAlerted} onReview={markHumanReview} />
      </section>
    </main>
  );
}

function WorkflowPanel({
  completedSteps,
  currentStep,
  ownerAlerted,
  progress
}: {
  completedSteps: string[];
  currentStep: string;
  ownerAlerted: boolean;
  progress: number;
}) {
  return (
    <aside className="rounded-lg border border-white/12 bg-white/8 p-4 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-100">Workflow execution</p>
          <h2 className="mt-1 text-2xl font-bold">Recovery pipeline</h2>
        </div>
        <Badge className="bg-cyan-300/15 text-cyan-100">{progress}%</Badge>
      </div>
      <Progress value={progress} className="mt-4 bg-white/10" />

      <div className="mt-5 space-y-3">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;
          const done = completedSteps.includes(step.key);
          const active = currentStep === step.key;
          return (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border",
                    done
                      ? "border-emerald-300 bg-emerald-400 text-slate-950"
                      : active
                        ? "border-cyan-300 bg-cyan-300/16 text-cyan-100"
                        : "border-white/14 bg-white/8 text-white/48"
                  )}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                {index < workflowSteps.length - 1 ? <span className={cn("h-7 w-px", done ? "bg-emerald-300/70" : "bg-white/12")} /> : null}
              </div>
              <div className="pt-1">
                <p className={cn("text-sm font-semibold", done ? "text-white" : active ? "text-cyan-100" : "text-white/54")}>{step.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{workflowCopy(step.key, done, active)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={cn("mt-5 rounded-lg border p-4", ownerAlerted ? "border-orange-300/40 bg-orange-500/14" : "border-white/10 bg-white/7")}>
        <div className="flex items-center gap-2 text-sm font-semibold">
          {ownerAlerted ? <AlertTriangle className="h-4 w-4 text-orange-300" /> : <ShieldCheck className="h-4 w-4 text-cyan-200" />}
          {ownerAlerted ? "Owner alert queued" : "Waiting for urgency signal"}
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-300">
          {ownerAlerted
            ? "The workflow would notify the owner or dispatcher before the lead goes cold."
            : "Routine leads stay in dispatch; urgent leaks and storm events escalate."}
        </p>
      </div>
    </aside>
  );
}

function ChatPanel({
  input,
  messages,
  onInput,
  onSend,
  quickReplies,
  scenarioInitial,
  typing
}: {
  input: string;
  messages: Message[];
  onInput: (value: string) => void;
  onSend: (value?: string) => void;
  quickReplies: string[];
  scenarioInitial: string;
  typing: boolean;
}) {
  return (
    <section className="rounded-lg border border-white/12 bg-white/8 p-4 shadow-2xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-100">Homeowner SMS</p>
          <h2 className="mt-1 text-2xl font-bold">Live intake thread</h2>
        </div>
        <Badge className="bg-white/10 text-white">Simulator</Badge>
      </div>

      <div className="mt-4 h-[430px] overflow-y-auto rounded-lg border border-slate-800 bg-[#e9ded0] p-4 text-slate-950">
        {messages.length === 0 ? (
          <div className="grid h-full place-items-center text-center">
            <div>
              <PhoneCall className="mx-auto h-10 w-10 text-slate-400" />
              <p className="mt-3 font-semibold">Trigger a missed call to start the recovery thread.</p>
              <p className="mt-2 text-sm text-slate-600">Akeno will send the first text, then you can reply as the homeowner.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.from === "akeno" ? "justify-start" : "justify-end")}>
                <div
                  className={cn(
                    "max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow",
                    message.from === "akeno" ? "bg-white text-slate-800" : "bg-[#d9fdd3] text-slate-900"
                  )}
                >
                  {message.label ? <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-cyan-700">{message.label}</p> : null}
                  {message.text}
                </div>
              </div>
            ))}
            {typing ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-lg bg-white px-4 py-3 shadow">
                  <span className="typing-dot" />
                  <span className="typing-dot" style={{ animationDelay: "0.14s" }} />
                  <span className="typing-dot" style={{ animationDelay: "0.28s" }} />
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3">
        <div className="flex flex-wrap gap-2">
          {[scenarioInitial, ...quickReplies].map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => onInput(reply)}
              className="rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-white/12"
            >
              {reply.length > 52 ? `${reply.slice(0, 52)}...` : reply}
            </button>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Textarea
            value={input}
            onChange={(event) => onInput(event.target.value)}
            placeholder="Type as the homeowner..."
            className="min-h-[76px] border-white/14 bg-white/95 text-slate-950"
          />
          <Button className="h-full min-h-[76px] bg-cyan-400 text-slate-950 hover:bg-cyan-300" onClick={() => onSend()}>
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </section>
  );
}

function LeadPanel({
  lead,
  leadRows,
  onReview,
  ownerAlerted
}: {
  lead: LeadState;
  leadRows: string[][];
  ownerAlerted: boolean;
  onReview: () => void;
}) {
  return (
    <aside className="space-y-5">
      <section className="rounded-lg border border-white/12 bg-white/8 p-4 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-cyan-100">Lead packet</p>
            <h2 className="mt-1 text-2xl font-bold">Live CRM preview</h2>
          </div>
          <UrgencyBadge urgency={lead.urgency} />
        </div>

        <div className="mt-5 space-y-2">
          {leadRows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[112px_1fr] gap-3 rounded-md border border-white/10 bg-white/7 px-3 py-2 text-sm">
              <span className="text-slate-400">{label}</span>
              <span className="font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
          <p className="text-sm font-semibold text-cyan-100">AI summary</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{lead.summary}</p>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-white">Qualification confidence</span>
            <span className="text-cyan-100">{lead.confidence}%</span>
          </div>
          <Progress value={lead.confidence} className="mt-2 bg-white/10" />
        </div>
      </section>

      <section className={cn("rounded-lg border p-4 shadow-2xl backdrop-blur", ownerAlerted ? "border-orange-300/30 bg-orange-500/12" : "border-white/12 bg-white/8")}>
        <div className="flex items-center gap-3">
          <span className={cn("grid h-10 w-10 place-items-center rounded-md", ownerAlerted ? "bg-orange-400 text-slate-950" : "bg-white/10 text-cyan-200")}>
            {ownerAlerted ? <BellRing className="h-5 w-5" /> : <Workflow className="h-5 w-5" />}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Recommended next action</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">{lead.nextAction}</p>
          </div>
        </div>
        <Button className="mt-4 w-full bg-white text-slate-950 hover:bg-cyan-100" onClick={onReview}>
          <UserCheck className="h-4 w-4" />
          Mark human reviewed
        </Button>
        <p className="mt-3 text-xs leading-5 text-slate-400">
          Akeno can capture and classify the lead. A person still confirms dispatch, pricing, safety-sensitive guidance, and insurance commitments.
        </p>
      </section>
    </aside>
  );
}

function UrgencyBadge({ urgency }: { urgency: LeadState["urgency"] }) {
  const classes = {
    "Not started": "bg-white/10 text-slate-200",
    Routine: "bg-emerald-300/16 text-emerald-100",
    Elevated: "bg-amber-300/16 text-amber-100",
    Urgent: "bg-orange-400 text-slate-950"
  };
  return <span className={cn("rounded-full px-3 py-1 text-xs font-bold", classes[urgency])}>{urgency}</span>;
}

function buildReply(scenarioId: ScenarioId, text: string) {
  if (scenarioId === "active-leak") {
    return "I marked this urgent because water is actively entering. I have the address and preferred window. The roofing team will confirm the exact arrival time before dispatch.";
  }
  if (scenarioId === "storm-damage") {
    return "Thanks. I captured this as storm damage with no active leak. Please send any roof or shingle photos, and the team will confirm an inspection window.";
  }
  if (scenarioId === "replacement") {
    return "Got it. I captured this as a replacement estimate request. The team will confirm an estimate window and can review the inspection report before the visit.";
  }
  if (text.toLowerCase().includes("leak")) {
    return "I captured the leak detail and flagged it for review. The team will confirm whether this should be routed as urgent.";
  }
  return "Thanks. I captured the inspection request, address, and preferred appointment timing. The office will confirm an available slot.";
}

function workflowCopy(key: string, done: boolean, active: boolean) {
  if (done) {
    const doneCopy: Record<string, string> = {
      missed: "Inbound call status was classified as missed.",
      sms: "Recovery text was sent before the lead went cold.",
      intake: "AI intake extracted issue, urgency, address, and timing.",
      memory: "Lead memory was updated for handoff.",
      alert: "Team notification path was selected.",
      review: "Human reviewer confirms final next step."
    };
    return doneCopy[key];
  }
  if (active) return "Waiting for the next simulator action.";
  return "Pending";
}
