import {
  Bell,
  Bot,
  ClipboardCheck,
  Cloud,
  Database,
  FileSpreadsheet,
  Headphones,
  MessageSquareText,
  PhoneCall,
  Settings,
  ShieldCheck,
  Wrench
} from "lucide-react";

export const roofingServices = [
  "Active roof leak",
  "Roof repair",
  "Roof replacement",
  "Storm damage",
  "Hail damage",
  "Wind damage",
  "Roof inspection",
  "Emergency tarp",
  "Commercial roofing",
  "Residential roofing",
  "Insurance-related roofing work"
] as const;

export const standardLeadFields = [
  "Customer name",
  "Customer phone",
  "Property address",
  "ZIP code",
  "Service requested",
  "Active leak",
  "Property type",
  "Roof type",
  "Roof age",
  "Storm damage",
  "Insurance status",
  "Preferred appointment",
  "Photos",
  "Lead summary",
  "Lead status",
  "Created date"
] as const;

export const crmOptions = [
  "Google Sheets",
  "JobNimbus",
  "AccuLynx",
  "Roofr",
  "GoHighLevel",
  "HubSpot",
  "Other CRM",
  "No CRM"
] as const;

export const integrationCards = [
  { name: "Twilio", icon: PhoneCall, status: "not_connected", description: "Missed-call SMS, forwarding, urgent lead alerts and call routing." },
  { name: "OpenAI", icon: Bot, status: "not_connected", description: "Roofing-only qualification assistant and SMS conversation logic." },
  { name: "n8n", icon: Cloud, status: "not_connected", description: "Backend orchestration for lead intake, enrichment and delivery." },
  { name: "Google Sheets", icon: FileSpreadsheet, status: "sandbox_ready", description: "Append or update roofing leads without changing existing columns." },
  { name: "JobNimbus", icon: ClipboardCheck, status: "sandbox_ready", description: "Create contacts, opportunities and conversation notes." },
  { name: "AccuLynx", icon: ShieldCheck, status: "sandbox_ready", description: "Sync qualified roofing opportunities into production boards." },
  { name: "Roofr", icon: Wrench, status: "sandbox_ready", description: "Push inspection and estimate-ready lead details." },
  { name: "GoHighLevel", icon: MessageSquareText, status: "sandbox_ready", description: "Create contacts and opportunities in a selected pipeline." },
  { name: "HubSpot", icon: Database, status: "sandbox_ready", description: "Create contacts, deals and activity notes for missed-call leads." }
] as const;

export const setupChecklist = [
  { label: "Company profile completed", icon: Settings },
  { label: "Roofing services selected", icon: Wrench },
  { label: "Service area configured", icon: ShieldCheck },
  { label: "Missed-call SMS approved", icon: MessageSquareText },
  { label: "Lead destination selected", icon: Database },
  { label: "Notification routing verified", icon: Bell },
  { label: "Agent ready for sandbox review", icon: Headphones }
];
