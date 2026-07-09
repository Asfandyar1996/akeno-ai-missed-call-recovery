import type { OnboardingInput } from "@/lib/schemas";

export const defaultGreeting =
  "Hi, this is [Company Name]. Sorry we missed your call. Are you contacting us about an active leak, storm damage, roof repair, roof replacement, or an inspection? Reply STOP to opt out.";

export const defaultOnboarding: OnboardingInput = {
  currentStep: 1,
  company: {
    roofingCompanyName: "",
    ownerName: "",
    email: "",
    website: "",
    businessPhone: "",
    logoDataUrl: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    timeZone: ""
  },
  services: {
    selectedServices: [],
    otherServices: "",
    propertyType: "",
    roofTypes: "",
    minimumJobRequirements: "",
    rejectedServices: ""
  },
  serviceArea: {
    zipCodes: [],
    cities: "",
    counties: "",
    maxRadius: 25,
    acceptManualReview: true
  },
  phoneConfig: {
    currentBusinessNumber: "",
    forwardToNumber: "",
    urgentAlertNumber: "",
    backupNotificationNumber: "",
    businessHours: "",
    afterHoursBehavior: "",
    options: {
      forwardOffice: true,
      forwardOwner: false,
      missedCallSms: true,
      urgentLeadSms: true,
      emailNotification: true
    }
  },
  agentConfig: {
    messageCompanyName: "",
    greetingMessage: "",
    tone: "Professional",
    bookingLink: "",
    emergencyKeywords: "",
    qualificationQuestions: "",
    enablePhotoRequests: true,
    enableInsuranceQuestions: true,
    enableRoofAgeQuestions: true,
    enablePreferredAppointmentQuestions: true,
    customInstructions: ""
  },
  leadDestination: {
    destination: "Google Sheets",
    spreadsheetUrl: "",
    sheetTab: "",
    matchExistingRowsByPhone: true,
    appendNewLeads: true,
    updateExistingLeads: true,
    fieldMappings: {
      "Customer name": "Homeowner Name",
      "Customer phone": "Phone",
      "Property address": "Property Address",
      "ZIP code": "ZIP",
      "Service requested": "Roofing Need",
      "Active leak": "Active Leak",
      "Property type": "Property Type",
      "Roof type": "Roof Type",
      "Roof age": "Roof Age",
      "Storm damage": "Storm Damage",
      "Insurance status": "Insurance",
      "Preferred appointment": "Preferred Appointment",
      Photos: "Photo Links",
      "Lead summary": "Summary",
      "Lead status": "Status",
      "Created date": "Created Date"
    },
    crmPipeline: "",
    crmPipelineStage: "",
    assignedUser: "",
    createContact: true,
    createOpportunity: true,
    addConversationNotes: true
  },
  notifications: {
    notificationEmail: "",
    ownerSmsNumber: "",
    dispatcherSmsNumber: "",
    sendFor: "Every lead",
    dailySummary: true,
    weeklyReport: true
  },
  compliance: {
    termsAccepted: false,
    consentConfirmed: false,
    messagingAcknowledged: false
  }
};

export const demoOnboarding: OnboardingInput = {
  currentStep: 8,
  company: {
    roofingCompanyName: "Summit Ridge Roofing",
    ownerName: "Megan Carter",
    email: "megan@summitridgeroofing.com",
    website: "https://summitridgeroofing.com",
    businessPhone: "(214) 555-0188",
    logoDataUrl: "",
    address: "4108 Maple Avenue",
    city: "Dallas",
    state: "TX",
    zip: "75219",
    timeZone: "Central Time"
  },
  services: {
    selectedServices: ["Active roof leak", "Roof repair", "Roof replacement", "Storm damage"],
    otherServices: "Gutter inspection after storm damage",
    propertyType: "Both",
    roofTypes: "Asphalt shingles, standing seam metal, TPO, modified bitumen",
    minimumJobRequirements: "Prefer jobs over $750 unless active water intrusion is reported.",
    rejectedServices: "Solar panel removal, chimney masonry, interior drywall repair"
  },
  serviceArea: {
    zipCodes: ["75219", "75205", "75230"],
    cities: "Dallas, Highland Park, University Park, Richardson, Plano",
    counties: "Dallas County, Collin County",
    maxRadius: 35,
    acceptManualReview: true
  },
  phoneConfig: {
    currentBusinessNumber: "(214) 555-0188",
    forwardToNumber: "(214) 555-0114",
    urgentAlertNumber: "(214) 555-0199",
    backupNotificationNumber: "(214) 555-0151",
    businessHours: "Monday-Friday 7:30 AM-5:30 PM, Saturday 8:00 AM-12:00 PM",
    afterHoursBehavior: "Send SMS immediately, mark active leaks as urgent, alert owner.",
    options: {
      forwardOffice: true,
      forwardOwner: false,
      missedCallSms: true,
      urgentLeadSms: true,
      emailNotification: true
    }
  },
  agentConfig: {
    messageCompanyName: "Summit Ridge Roofing",
    greetingMessage: defaultGreeting,
    tone: "Professional",
    bookingLink: "https://summitridgeroofing.com/schedule",
    emergencyKeywords: "active leak, water coming in, ceiling stain, tarp, hail, tree limb, storm damage",
    qualificationQuestions:
      "What issue are you seeing? Is water actively entering? What is the property address? Residential or commercial? Do you know the roof age? Are insurance photos available?",
    enablePhotoRequests: true,
    enableInsuranceQuestions: true,
    enableRoofAgeQuestions: true,
    enablePreferredAppointmentQuestions: true,
    customInstructions:
      "Discuss roofing only. Do not diagnose structural damage. For active leaks, ask if temporary tarping is needed and notify the owner immediately."
  },
  leadDestination: {
    destination: "Google Sheets",
    spreadsheetUrl: "https://docs.google.com/spreadsheets/d/sandbox-akeno",
    sheetTab: "Missed Call Leads",
    matchExistingRowsByPhone: true,
    appendNewLeads: true,
    updateExistingLeads: true,
    fieldMappings: defaultOnboarding.leadDestination.fieldMappings,
    crmPipeline: "Residential Roofing",
    crmPipelineStage: "New Qualified Lead",
    assignedUser: "Dispatcher",
    createContact: true,
    createOpportunity: true,
    addConversationNotes: true
  },
  notifications: {
    notificationEmail: "dispatch@summitridgeroofing.com",
    ownerSmsNumber: "(214) 555-0199",
    dispatcherSmsNumber: "(214) 555-0130",
    sendFor: "Every lead",
    dailySummary: true,
    weeklyReport: true
  },
  compliance: {
    termsAccepted: true,
    consentConfirmed: true,
    messagingAcknowledged: true
  }
};
