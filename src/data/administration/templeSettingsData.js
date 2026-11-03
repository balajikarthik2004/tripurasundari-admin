// Master Temple Configuration Settings Data Model

export const INITIAL_TEMPLE_SETTINGS = {
  general: {
    templeName: 'Mata Tripura Sundari Temple',
    alternativeName: 'Matabari / Kurmapitha Shrine',
    trustTitle: 'Mata Tripura Sundari Temple Administration Board',
    location: 'Matabari, Udaipur, Gomati District, Tripura – 799114',
    helplineContact: '+91 3821 222340',
    officialEmail: 'trust@matabari-temple.gov.in',
    websiteUrl: 'https://matabari.tripura.gov.in',
    timeZone: 'Asia/Kolkata (IST +05:30)',
    dateFormat: 'DD MMM YYYY',
    currency: 'INR (₹)',
    officialLanguages: ['English', 'Bengali', 'Kokborok', 'Hindi'],
  },
  bookingRules: {
    darshanAdvanceDays: 30,
    maxPersonsPerBooking: 6,
    vipPassApprovalRequired: true,
    cancellationAllowedHoursBefore: 24,
    cancellationRefundPercentage: 80,
    cancellationPolicyText:
      'Cancellations initiated at least 24 hours prior to the allocated time slot are eligible for an 80% refund. Same-day cancellations or slot no-shows are non-refundable as per Temple Trust bylaws.',
    autoConfirmGeneralPasses: true,
  },
  financialPreferences: {
    receiptNumberPrefix: 'MTR-2026-',
    currencySymbol: '₹',
    defaultPaymentMode: 'UPI (QR Terminal)',
    enableDonation80GExemptionNotice: true,
    exemptionNoticeText: 'Contributions made to Mata Tripura Sundari Temple Trust are eligible for 80G tax exemption under Indian Income Tax Act.',
    autoGenerateVoucherPDF: true,
  },
  notifications: {
    channels: {
      inAppAlerts: true,
      emailNotifications: true,
      smsGateway: true,
      whatsAppCirculars: false,
    },
    triggers: {
      newOnlineBooking: true,
      bookingCancellation: true,
      donationAbove10000: true,
      criticalCrowdAlert: true,
      newGrievanceCase: true,
      melaTaskOverdue: true,
    },
    recipients: {
      financeAlertsTo: 'finance@matabari-temple.gov.in',
      operationsAlertsTo: 'controlhub@matabari-temple.gov.in',
      grievanceAlertsTo: 'grievance@matabari-temple.gov.in',
    },
  },
  operationalDefaults: {
    crowdWarningThresholdPct: 80,
    crowdCriticalThresholdPct: 92,
    cctvHeartbeatPingSeconds: 60,
    defaultShiftDurationHours: 8,
    maxQueueHoldingCapacity: 800,
    emergencyMusterZone: 'West Open Parking Pavilion (Zone G)',
  },
  systemDemoState: {
    environment: 'Demo Prototype / Local State Sandbox',
    prototypeVersion: 'v2.4.0 (Phase 6 Build)',
    lastSyncTimestamp: '31 Oct 2026 10:28 AM',
    connectedDataStores: 'Devotee Services, Operations, CMS, Insights',
  },
};

