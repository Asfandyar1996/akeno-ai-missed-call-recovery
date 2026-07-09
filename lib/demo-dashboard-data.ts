function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function getDemoLeads() {
  const client = {
    id: "demo-client",
    companyName: "RidgeLine Roofing",
    ownerName: "Megan Carter",
    email: "owner@ridgelineroofing.com",
    phone: "(214) 555-0188",
    website: "https://ridgelineroofing.example",
    logoDataUrl: null,
    address: "1200 Commerce Street",
    city: "Dallas",
    state: "TX",
    zip: "75202",
    timeZone: "America/Chicago",
    createdAt: daysAgo(12),
    updatedAt: daysAgo(0)
  };

  return [
    {
      id: "demo-lead-1",
      clientId: client.id,
      client,
      customerName: "Sarah Mitchell",
      phone: "(214) 555-0138",
      propertyAddress: "1842 Cedar Grove Dr",
      zip: "75230",
      city: "Dallas",
      state: "TX",
      serviceRequested: "Active roof leak",
      urgency: "Urgent",
      status: "Qualified",
      assignedPerson: "Owner",
      activeLeak: true,
      propertyType: "Residential",
      roofType: "Architectural shingle",
      roofAge: "14 years",
      stormDamage: true,
      insuranceStatus: "Likely filing claim",
      preferredAppointment: "Tonight after 8:30 PM",
      photosJson: JSON.stringify(["Kitchen ceiling leak photo requested", "Roof photo requested"]),
      conversationJson: JSON.stringify([
        { from: "Akeno", text: "Sorry we missed your call. Are you dealing with a leak, storm damage, repair, replacement, or inspection?" },
        { from: "Customer", text: "Leak. Water is coming through the kitchen ceiling after the storm." },
        { from: "Akeno", text: "I marked this urgent, collected the address, and alerted the owner for confirmation." }
      ]),
      notificationsJson: JSON.stringify([
        { channel: "SMS", status: "sent", detail: "Urgent alert sent to owner." },
        { channel: "Google Sheets", status: "ready", detail: "Lead row prepared without changing existing columns." }
      ]),
      crmSyncStatus: "Sheet ready",
      leadSummary: "Active water intrusion after storm. Customer prefers tonight after 8:30 PM. Human confirmation needed.",
      estimatedValue: 9200,
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0)
    },
    {
      id: "demo-lead-2",
      clientId: client.id,
      client,
      customerName: "Derrick Wilson",
      phone: "(972) 555-0172",
      propertyAddress: "901 Commerce Street",
      zip: "75202",
      city: "Dallas",
      state: "TX",
      serviceRequested: "Commercial roof inspection",
      urgency: "Standard",
      status: "Qualified",
      assignedPerson: "Dispatcher",
      activeLeak: false,
      propertyType: "Commercial",
      roofType: "TPO",
      roofAge: "Unknown",
      stormDamage: false,
      insuranceStatus: "Not discussed",
      preferredAppointment: "Thursday morning",
      photosJson: JSON.stringify(["Tenant ceiling photo requested"]),
      conversationJson: JSON.stringify([
        { from: "Akeno", text: "What roofing issue are you seeing?" },
        { from: "Customer", text: "Tenant reported ponding water and ceiling stains." }
      ]),
      notificationsJson: JSON.stringify([{ channel: "Email", status: "sent", detail: "Summary sent to dispatch inbox." }]),
      crmSyncStatus: "Sandbox synced",
      leadSummary: "Property manager needs inspection after tenant reported ponding water.",
      estimatedValue: 14500,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1)
    },
    {
      id: "demo-lead-3",
      clientId: client.id,
      client,
      customerName: "Melissa Tran",
      phone: "(469) 555-0121",
      propertyAddress: "118 Meadowbrook Lane",
      zip: "75093",
      city: "Plano",
      state: "TX",
      serviceRequested: "Roof replacement estimate",
      urgency: "Standard",
      status: "Contacted",
      assignedPerson: "Estimator",
      activeLeak: false,
      propertyType: "Residential",
      roofType: "Composition shingle",
      roofAge: "22 years",
      stormDamage: true,
      insuranceStatus: "Claim already opened",
      preferredAppointment: "Friday afternoon",
      photosJson: JSON.stringify(["Exterior roof photo requested"]),
      conversationJson: JSON.stringify([{ from: "Akeno", text: "A replacement estimate request was captured from a missed call." }]),
      notificationsJson: JSON.stringify([{ channel: "Email", status: "sent", detail: "Lead summary delivered to estimator." }]),
      crmSyncStatus: "Sandbox synced",
      leadSummary: "Homeowner wants replacement estimate after adjuster visit.",
      estimatedValue: 17800,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2)
    }
  ];
}

export function getDemoActivity() {
  return [
    {
      id: "demo-activity-1",
      clientId: "demo-client",
      type: "lead",
      message: "Urgent active leak captured from missed call and owner alerted.",
      metadataJson: JSON.stringify({ urgency: "Urgent" }),
      createdAt: daysAgo(0)
    },
    {
      id: "demo-activity-2",
      clientId: "demo-client",
      type: "integration",
      message: "Google Sheets handoff is ready in column-safe mode.",
      metadataJson: JSON.stringify({ provider: "Google Sheets" }),
      createdAt: daysAgo(1)
    },
    {
      id: "demo-activity-3",
      clientId: "demo-client",
      type: "setup",
      message: "Dashboard loaded with realistic recovery data.",
      metadataJson: JSON.stringify({ mode: "sandbox_fallback" }),
      createdAt: daysAgo(2)
    }
  ];
}
