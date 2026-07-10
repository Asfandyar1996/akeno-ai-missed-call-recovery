"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  Bot,
  CheckCircle2,
  ClipboardList,
  CloudRain,
  Database,
  Home,
  MessageSquareText,
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
type Stage = 0 | 1 | 2 | 3 | 4 | 5;
type Message = { from: "homeowner" | "akeno"; text: string; label?: string };
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

const emptyLead: LeadState = {
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
};

const scenarios: Record<
  ScenarioId,
  {
    title: string;
    icon: typeof CloudRain;
    description: string;
    firstReply: string;
    followUps: string[];
    lead: LeadState;
  }
> = {
  "active-leak": {
    title: "Active leak",
    icon: CloudRain,
    description: "Water is entering the home now. This should become an urgent lead.",
    firstReply: "Yes, water is actively coming in. 1842 Cedar Grove Dr, Dallas. Tonight after 8 works.",
    followUps: [
      "Residential shingle roof, about 12 years old.",
      "I can send photos of the ceiling and roof.",
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
    firstReply: "Address is 9308 Lake Hollow Ct, Plano. Residential. No active leak.",
    followUps: [
      "The roof is about 9 years old.",
      "I have photos of shingles in the yard.",
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
    firstReply: "It is a residential roof in Frisco, about 22 years old.",
    followUps: [
      "No leak, but the inspection report says it is near end of life.",
      "Weekday mornings work best.",
      "Address is 411 Sycamore Bend."
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
    firstReply: "No active leak. Address is 7620 Ridge Creek Ln, Fort Worth.",
    followUps: [
      "It is residential, roof age unknown.",
      "Tuesday or Wednesday works.",
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

const checklist = [
  { stage: 0, key: "scenario", label: "Choose lead type", detail: "Pick the roofing situation." },
  { stage: 1, key: "missed", label: "Missed call detected", detail: "Akeno sends the recovery SMS." },
  { stage: 2, key: "reply", label: "Homeowner replies", detail: "Send the homeowner context." },
  { stage: 3, key: "ai", label: "AI qualifies lead", detail: "Urgency, address and intent are extracted." },
  { stage: 4, key: "packet", label: "Lead packet ready", detail: "CRM preview and alert are shown." },
  { stage: 5, key: "review", label: "Human confirms", detail: "The roofing team owns final dispatch." }
];

const starterMessage =
  "Hi, this is Akeno for RidgeLine Roofing. Sorry we missed your call. Are you dealing with a leak, storm damage, repair, replacement, or an inspection?";

export function MissedCallSimulator() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("active-leak");
  const [stage, setStage] = useState<Stage>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(scenarios["active-leak"].firstReply);
  const [lead, setLead] = useState<LeadState>(emptyLead);
  const [typing, setTyping] = useState(false);
  const [ownerAlerted, setOwnerAlerted] = useState(false);

  const scenario = scenarios[scenarioId];
  const progress = Math.round((stage / (checklist.length - 1)) * 100);
  const completeKeys = checklist.slice(0, stage).map((item) => item.key);

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

  useEffect(() => {
    if (stage !== 1) return;
    const timer = window.setTimeout(() => setStage(2), 850);
    return () => window.clearTimeout(timer);
  }, [stage]);

  const chooseScenario = (next: ScenarioId) => {
    setScenarioId(next);
    setInput(scenarios[next].firstReply);
    setStage(0);
    setMessages([]);
    setLead(emptyLead);
    setOwnerAlerted(false);
    setTyping(false);
  };

  const triggerMissedCall = () => {
    setMessages([{ from: "akeno", text: starterMessage, label: "Instant missed-call text" }]);
    setLead({ ...emptyLead, phone: scenario.lead.phone, summary: "Missed call recovered. Waiting for homeowner details.", confidence: 22 });
    setOwnerAlerted(false);
    setStage(1);
  };

  const sendMessage = (text = input) => {
    const clean = text.trim();
    if (!clean) return;

    setMessages((current) => [...current, { from: "homeowner", text: clean }]);
    setInput("");
    setTyping(true);
    setStage(3);

    window.setTimeout(() => {
      setTyping(false);
      setLead(scenario.lead);
      setOwnerAlerted(scenario.lead.urgency !== "Routine");
      setMessages((current) => [
        ...current,
        {
          from: "akeno",
          label: "AI intake response",
          text: buildReply(scenarioId, clean)
        }
      ]);
      setStage(4);
    }, 900);
  };

  const markHumanReview = () => {
    setLead((current) => ({
      ...current,
      nextAction: "Human reviewer has confirmed this lead is ready for dispatch follow-up."
    }));
    setStage(5);
  };

  const resetDemo = () => chooseScenario(scenarioId);

  return (
    <main id="main-content" className="flex h-screen flex-col overflow-hidden bg-[#07111f] text-white">
      <LandingHeader />

      <div className="demo-simulator-grid min-h-0 flex-1 overflow-hidden">
        <div className="mx-auto flex h-full max-w-7xl flex-col gap-2 px-4 py-2 sm:px-6 lg:px-8">
          <section className="shrink-0 rounded-lg border border-white/10 bg-white/7 p-2.5 shadow-2xl backdrop-blur lg:flex lg:items-center lg:justify-between lg:gap-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                <Sparkles className="h-3.5 w-3.5" />
                Guided simulator
              </div>
              <h1 className="mt-1.5 text-2xl font-bold tracking-normal text-white sm:text-3xl">Missed Call Recovery Simulator</h1>
              <p className="mt-1.5 max-w-3xl text-sm leading-5 text-slate-300">
                Choose a roofing scenario, trigger the missed call, send the homeowner reply, then watch Akeno build the lead packet.
              </p>
            </div>
            <div className="mt-2 flex shrink-0 flex-wrap gap-2 lg:mt-0">
              <Badge className="bg-cyan-300/15 text-cyan-100">Everything stays on screen</Badge>
              <Badge className="bg-white/10 text-white">Step {stage + 1} of 6</Badge>
            </div>
          </section>

          <section className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[310px_1fr]">
            <ChecklistPanel
              completeKeys={completeKeys}
              ownerAlerted={ownerAlerted}
              progress={progress}
              scenarioTitle={scenario.title}
              stage={stage}
              onReset={resetDemo}
            />

            <section className="h-full min-h-0 overflow-hidden rounded-lg border border-white/12 bg-white/8 p-3 shadow-2xl backdrop-blur">
              {stage === 0 ? (
                <ScenarioStep scenarioId={scenarioId} onChoose={chooseScenario} onTrigger={triggerMissedCall} />
              ) : null}

              {stage === 1 ? (
                <MissedCallStep messages={messages} />
              ) : null}

              {stage === 2 ? (
                <ReplyStep
                  input={input}
                  messages={messages}
                  onInput={setInput}
                  onSend={sendMessage}
                  scenario={scenario}
                />
              ) : null}

              {stage === 3 ? (
                <ProcessingStep messages={messages} typing={typing} />
              ) : null}

              {stage === 4 ? (
                <LeadPacketStep lead={lead} leadRows={leadRows} messages={messages} ownerAlerted={ownerAlerted} onReview={markHumanReview} />
              ) : null}

              {stage === 5 ? (
                <ReviewStep lead={lead} leadRows={leadRows} messages={messages} ownerAlerted={ownerAlerted} onReset={resetDemo} />
              ) : null}
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

function ChecklistPanel({
  completeKeys,
  onReset,
  ownerAlerted,
  progress,
  scenarioTitle,
  stage
}: {
  completeKeys: string[];
  onReset: () => void;
  ownerAlerted: boolean;
  progress: number;
  scenarioTitle: string;
  stage: Stage;
}) {
  return (
    <aside className="min-h-0 overflow-hidden rounded-lg border border-white/12 bg-white/8 p-3 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-100">Demo checklist</p>
          <h2 className="mt-1 text-xl font-bold">Step-by-step</h2>
        </div>
        <Badge className="bg-cyan-300/15 text-cyan-100">{progress}%</Badge>
      </div>
      <Progress value={progress} className="mt-3 bg-white/10" />

      <div className="mt-3 rounded-lg border border-white/10 bg-white/7 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Selected scenario</p>
        <p className="mt-1 font-semibold text-white">{scenarioTitle}</p>
      </div>

      <div className="mt-2 space-y-1.5">
        {checklist.map((item, index) => {
          const done = completeKeys.includes(item.key);
          const active = stage === item.stage;
          return (
            <div key={item.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border text-sm font-bold",
                    done
                      ? "border-emerald-300 bg-emerald-400 text-slate-950"
                      : active
                        ? "border-cyan-300 bg-cyan-300/16 text-cyan-100"
                        : "border-white/14 bg-white/8 text-white/48"
                  )}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </span>
                {index < checklist.length - 1 ? <span className={cn("h-4 w-px", done ? "bg-emerald-300/70" : "bg-white/12")} /> : null}
              </div>
              <div className="pt-1">
                <p className={cn("text-sm font-semibold", done ? "text-white" : active ? "text-cyan-100" : "text-white/54")}>{item.label}</p>
                <p className="mt-0.5 text-xs leading-4 text-slate-400">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={cn("mt-3 rounded-lg border p-3", ownerAlerted ? "border-orange-300/40 bg-orange-500/14" : "border-white/10 bg-white/7")}>
        <div className="flex items-center gap-2 text-sm font-semibold">
          {ownerAlerted ? <AlertTriangle className="h-4 w-4 text-orange-300" /> : <ShieldCheck className="h-4 w-4 text-cyan-200" />}
          {ownerAlerted ? "Owner alert queued" : "No escalation yet"}
        </div>
        <p className="mt-1 text-xs leading-4 text-slate-300">
          {ownerAlerted ? "Urgent or elevated leads are routed before they go cold." : "Routine leads stay in normal dispatch."}
        </p>
      </div>

      <Button variant="outline" className="mt-2 w-full border-white/16 bg-white/8 text-white hover:bg-white/12" onClick={onReset}>
        <RefreshCcw className="h-4 w-4" />
        Reset demo
      </Button>
    </aside>
  );
}

function ScenarioStep({
  onChoose,
  onTrigger,
  scenarioId
}: {
  onChoose: (value: ScenarioId) => void;
  onTrigger: () => void;
  scenarioId: ScenarioId;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 1"
        icon={Workflow}
        title="Choose the missed-call scenario"
        text="This controls what the homeowner says and how Akeno classifies urgency."
      />

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {(Object.entries(scenarios) as Array<[ScenarioId, (typeof scenarios)[ScenarioId]]>).map(([id, scenario]) => {
          const Icon = scenario.icon;
          const active = id === scenarioId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChoose(id)}
              className={cn(
                "rounded-lg border p-3 text-left transition",
                active ? "border-cyan-300/60 bg-cyan-300/14 shadow-lg shadow-cyan-950/20" : "border-white/12 bg-white/8 hover:border-white/30 hover:bg-white/12"
              )}
            >
              <div className="flex items-start gap-3">
                <span className={cn("grid h-11 w-11 place-items-center rounded-md", active ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-cyan-200")}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">{scenario.title}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-300">{scenario.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3">
        <p className="text-sm font-semibold text-cyan-100">What happens next</p>
        <p className="mt-1.5 text-sm leading-5 text-slate-300">
          Click the button below. The simulator will show the missed call, automatically send Akeno&apos;s recovery SMS,
          then move you to the homeowner reply step.
        </p>
        <Button size="lg" className="next-action-pulse mt-3 bg-cyan-400 text-slate-950 hover:bg-cyan-300" onClick={onTrigger}>
          <PhoneMissed className="h-4 w-4" />
          Trigger missed call
        </Button>
      </div>
    </div>
  );
}

function MissedCallStep({ messages }: { messages: Message[] }) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 2"
        icon={PhoneMissed}
        title="Akeno detects the missed call"
        text="The roofing company missed the call, so Akeno immediately sends a recovery text. The next step appears automatically."
      />
      <div className="mt-3 grid gap-3 lg:grid-cols-[0.8fr_1fr]">
        <div className="rounded-lg border border-orange-300/30 bg-orange-500/12 p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-orange-500 text-white">
              <PhoneMissed className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase text-orange-100/80">Call status</p>
              <h3 className="text-2xl font-bold text-white">Missed call</h3>
            </div>
          </div>
          <p className="mt-3 text-sm leading-5 text-orange-50/85">Akeno starts recovery before the homeowner calls another contractor.</p>
        </div>
        <PhoneThread messages={messages} typing={false} />
      </div>
    </div>
  );
}

function ReplyStep({
  input,
  messages,
  onInput,
  onSend,
  scenario
}: {
  input: string;
  messages: Message[];
  onInput: (value: string) => void;
  onSend: (value?: string) => void;
  scenario: (typeof scenarios)[ScenarioId];
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 3"
        icon={MessageSquareText}
        title="Send the homeowner reply"
        text="Use one suggested reply or type your own. After you send it, Akeno automatically qualifies the lead."
      />
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_0.9fr]">
        <PhoneThread messages={messages} typing={false} />
        <div className="rounded-lg border border-white/12 bg-white/8 p-3">
          <p className="text-sm font-semibold text-cyan-100">Homeowner reply</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[scenario.firstReply, ...scenario.followUps].map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => onInput(reply)}
                className="rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-white/12"
              >
                {reply}
              </button>
            ))}
          </div>
          <Textarea
            value={input}
            onChange={(event) => onInput(event.target.value)}
            className="mt-3 min-h-[78px] border-white/14 bg-white/95 text-slate-950"
            placeholder="Type as the homeowner..."
          />
          <Button className="next-action-pulse mt-3 w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300" onClick={() => onSend()}>
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProcessingStep({ messages, typing }: { messages: Message[]; typing: boolean }) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 4"
        icon={Bot}
        title="Akeno qualifies the lead"
        text="The simulator is extracting urgency, address, job type, insurance context, and appointment intent."
      />
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_0.85fr]">
        <PhoneThread messages={messages} typing={typing} />
        <div className="rounded-lg border border-white/12 bg-white/8 p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-cyan-300 text-slate-950">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-white">AI intake running</p>
              <p className="mt-1 text-sm text-slate-300">Moving to lead packet automatically...</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {["Classify issue", "Check urgency", "Extract address", "Prepare handoff"].map((label, index) => (
              <div key={label} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/7 p-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-400 text-slate-950 text-xs font-bold">{index + 1}</span>
                <span className="text-sm font-semibold text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadPacketStep({
  lead,
  leadRows,
  messages,
  onReview,
  ownerAlerted
}: {
  lead: LeadState;
  leadRows: string[][];
  messages: Message[];
  onReview: () => void;
  ownerAlerted: boolean;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 5"
        icon={Database}
        title="Lead packet is ready"
        text="The right data is now ready for a dispatcher, CRM, or Google Sheet handoff."
      />
      <div className="mt-3 grid gap-3 xl:grid-cols-[0.9fr_1fr]">
        <PhoneThread messages={messages} typing={false} />
        <LeadCard lead={lead} leadRows={leadRows} ownerAlerted={ownerAlerted} onReview={onReview} />
      </div>
    </div>
  );
}

function ReviewStep({
  lead,
  leadRows,
  messages,
  onReset,
  ownerAlerted
}: {
  lead: LeadState;
  leadRows: string[][];
  messages: Message[];
  onReset: () => void;
  ownerAlerted: boolean;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 6"
        icon={UserCheck}
        title="Human review completed"
        text="The AI has captured and prepared the lead. A human still confirms dispatch, pricing, insurance, and service commitments."
      />
      <div className="mt-3 rounded-lg border border-emerald-300/30 bg-emerald-400/12 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-400 text-slate-950">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-white">Ready for roofing team follow-up</p>
              <p className="mt-0.5 text-sm leading-5 text-slate-300">Qualified, summarized, routed, and marked for human confirmation.</p>
            </div>
          </div>
          <Button className="next-action-pulse bg-white text-slate-950 hover:bg-cyan-100" onClick={onReset}>
            <RefreshCcw className="h-4 w-4" />
            Run another scenario
          </Button>
        </div>
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-[0.9fr_1fr]">
        <PhoneThread messages={messages} typing={false} />
        <LeadCard lead={lead} leadRows={leadRows} ownerAlerted={ownerAlerted} />
      </div>
    </div>
  );
}

function StepHeader({
  eyebrow,
  icon: Icon,
  text,
  title
}: {
  eyebrow: string;
  icon: typeof Bot;
  text: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-cyan-100">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-normal text-white">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-5 text-slate-300">{text}</p>
      </div>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cyan-300 text-slate-950">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}

function PhoneThread({ messages, typing }: { messages: Message[]; typing: boolean }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#e9ded0] p-2.5 text-slate-950 shadow-2xl">
      <div className="mb-2 flex items-center justify-between border-b border-slate-300 pb-2">
        <div>
          <p className="text-sm font-bold">RidgeLine Roofing</p>
          <p className="text-xs text-slate-500">SMS recovery thread</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">Live</span>
      </div>
      <div className="h-[272px] space-y-2 overflow-hidden">
        {messages.map((message, index) => (
          <div key={`${message.from}-${index}-${message.text.slice(0, 12)}`} className={cn("flex", message.from === "akeno" ? "justify-start" : "justify-end")}>
            <div
              className={cn(
                "max-w-[88%] rounded-lg px-3 py-2 text-xs leading-4 shadow",
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
    </div>
  );
}

function LeadCard({
  lead,
  leadRows,
  onReview,
  ownerAlerted
}: {
  lead: LeadState;
  leadRows: string[][];
  onReview?: () => void;
  ownerAlerted: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/12 bg-white/8 p-3 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-100">Live CRM preview</p>
          <h3 className="mt-1 text-xl font-bold">Lead packet</h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <UrgencyBadge urgency={lead.urgency} />
          {onReview ? (
            <Button size="sm" className="next-action-pulse bg-white text-slate-950 hover:bg-cyan-100" onClick={onReview}>
              <UserCheck className="h-4 w-4" />
              Mark human reviewed
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {leadRows.map(([label, value]) => (
          <div key={label} className="rounded-md border border-white/10 bg-white/7 px-3 py-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3">
        <p className="text-sm font-semibold text-cyan-100">AI summary</p>
        <p className="mt-1.5 text-sm leading-5 text-slate-200">{lead.summary}</p>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-white">Qualification confidence</span>
          <span className="text-cyan-100">{lead.confidence}%</span>
        </div>
        <Progress value={lead.confidence} className="mt-2 bg-white/10" />
      </div>

      <div className={cn("mt-3 rounded-lg border p-3", ownerAlerted ? "border-orange-300/30 bg-orange-500/12" : "border-white/10 bg-white/7")}>
        <div className="flex items-start gap-3">
          <span className={cn("grid h-10 w-10 place-items-center rounded-md", ownerAlerted ? "bg-orange-400 text-slate-950" : "bg-white/10 text-cyan-200")}>
            {ownerAlerted ? <BellRing className="h-5 w-5" /> : <Workflow className="h-5 w-5" />}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{ownerAlerted ? "Owner alert queued" : "Normal dispatch path"}</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">{lead.nextAction}</p>
          </div>
        </div>
      </div>

    </div>
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
