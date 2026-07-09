import { z } from "zod";
import { crmOptions, roofingServices } from "@/lib/constants";

const phoneSchema = z
  .string()
  .min(10, "Enter a US phone number")
  .refine((value) => value.replace(/\D/g, "").length >= 10, "Enter a US phone number");

const zipSchema = z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code");

export const companySchema = z.object({
  roofingCompanyName: z.string().min(2, "Company name is required"),
  ownerName: z.string().min(2, "Owner or manager name is required"),
  email: z.string().email("Enter a valid email"),
  website: z.string().url("Enter a valid URL").or(z.literal("")),
  businessPhone: phoneSchema,
  logoDataUrl: z.string().optional(),
  address: z.string().min(3, "Business address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: zipSchema,
  timeZone: z.string().min(2, "Time zone is required")
});

export const servicesSchema = z.object({
  selectedServices: z.array(z.enum(roofingServices)).min(1, "Select at least one service"),
  otherServices: z.string().optional(),
  propertyType: z.enum(["", "Residential", "Commercial", "Both"]).refine(Boolean, "Select property type"),
  roofTypes: z.string().min(2, "Describe roof types handled"),
  minimumJobRequirements: z.string().optional(),
  rejectedServices: z.string().optional()
});

export const serviceAreaSchema = z.object({
  zipCodes: z.array(zipSchema).default([]),
  cities: z.string().min(2, "Enter at least one city"),
  counties: z.string().optional(),
  maxRadius: z.coerce.number().min(0).max(250),
  acceptManualReview: z.boolean().default(true)
});

export const phoneConfigSchema = z.object({
  currentBusinessNumber: phoneSchema,
  forwardToNumber: phoneSchema,
  urgentAlertNumber: phoneSchema,
  backupNotificationNumber: z.string().optional(),
  businessHours: z.string().min(2, "Business hours are required"),
  afterHoursBehavior: z.string().optional(),
  options: z.object({
    forwardOffice: z.boolean(),
    forwardOwner: z.boolean(),
    missedCallSms: z.boolean(),
    urgentLeadSms: z.boolean(),
    emailNotification: z.boolean()
  })
});

export const agentConfigSchema = z.object({
  messageCompanyName: z.string().min(2, "Company name is required"),
  greetingMessage: z.string().min(20, "Greeting is too short"),
  tone: z.enum(["Professional", "Friendly", "Direct"]),
  bookingLink: z.string().url("Enter a valid URL").or(z.literal("")),
  emergencyKeywords: z.string().min(2, "Add emergency keywords"),
  qualificationQuestions: z.string().min(10, "Add qualification questions"),
  enablePhotoRequests: z.boolean(),
  enableInsuranceQuestions: z.boolean(),
  enableRoofAgeQuestions: z.boolean(),
  enablePreferredAppointmentQuestions: z.boolean(),
  customInstructions: z.string().optional()
});

export const leadDestinationSchema = z.object({
  destination: z.enum(crmOptions),
  spreadsheetUrl: z.string().url("Enter a valid spreadsheet URL").or(z.literal("")),
  sheetTab: z.string().optional(),
  matchExistingRowsByPhone: z.boolean(),
  appendNewLeads: z.boolean(),
  updateExistingLeads: z.boolean(),
  fieldMappings: z.record(z.string()).default({}),
  crmPipeline: z.string().optional(),
  crmPipelineStage: z.string().optional(),
  assignedUser: z.string().optional(),
  createContact: z.boolean(),
  createOpportunity: z.boolean(),
  addConversationNotes: z.boolean()
});

export const notificationSchema = z.object({
  notificationEmail: z.string().email("Enter a valid email"),
  ownerSmsNumber: phoneSchema,
  dispatcherSmsNumber: z.string().optional(),
  sendFor: z.enum(["Every lead", "Urgent leads only", "Completed leads only"]),
  dailySummary: z.boolean(),
  weeklyReport: z.boolean()
});

export const complianceSchema = z.object({
  termsAccepted: z.boolean(),
  consentConfirmed: z.boolean(),
  messagingAcknowledged: z.boolean()
});

export const onboardingSchema = z.object({
  currentStep: z.number().min(1).max(8),
  company: companySchema,
  services: servicesSchema,
  serviceArea: serviceAreaSchema,
  phoneConfig: phoneConfigSchema,
  agentConfig: agentConfigSchema,
  leadDestination: leadDestinationSchema,
  notifications: notificationSchema,
  compliance: complianceSchema
});

export const leadSchema = z.object({
  customerName: z.string().min(2),
  phone: phoneSchema,
  propertyAddress: z.string().min(3),
  zip: zipSchema,
  city: z.string().min(2),
  state: z.string().min(2),
  serviceRequested: z.string().min(2),
  urgency: z.enum(["Urgent", "Standard", "Low"]),
  status: z.enum(["New", "Contacted", "Qualified", "Booked", "Closed", "Lost"]),
  assignedPerson: z.string().min(2),
  activeLeak: z.boolean(),
  propertyType: z.string().min(2),
  roofType: z.string().optional(),
  roofAge: z.string().optional(),
  stormDamage: z.boolean(),
  insuranceStatus: z.string().optional(),
  preferredAppointment: z.string().optional(),
  leadSummary: z.string().min(5),
  estimatedValue: z.coerce.number().min(0)
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
