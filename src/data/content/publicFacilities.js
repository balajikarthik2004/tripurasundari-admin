// Public-Facing Facilities Directory Data Model
// Note: Distinct from internal operations; references internal facility records where appropriate

export const INITIAL_PUBLIC_FACILITIES = [
  {
    id: 'PUB-FAC-01',
    internalFacilityId: 'FAC-001', // Linked to internal Pilgrim Dormitory
    name: 'Yatri Niwas Pilgrim Accommodation & Dormitory',
    category: 'Accommodation',
    icon: 'Building2',
    location: 'East Gate Perimeter (Lake Approach)',
    publicDescription:
      'Clean, comfortable overnight lodging for visiting yatris and families. Features individual cots with fresh linens, secure lockers, and clean separate washrooms for male and female pilgrims.',
    operatingHours: '24 Hours Reception Desk',
    visitorInstructions:
      'Advance booking available via temple admin office or official portal. Government photo identification (Aadhaar / Voter ID) mandatory upon check-in.',
    contactInfo: 'Desk Ext. 102 / Helpline: +91 3821 222340',
    publicationStatus: 'Published',
    verificationStatus: 'Verified',
    displayOrder: 1,
  },
  {
    id: 'PUB-FAC-02',
    internalFacilityId: 'FAC-002', // Linked to internal Guest Cottages
    name: 'Yatri Niwas Guest Cottages',
    category: 'Accommodation',
    icon: 'Home',
    location: 'North Garden Perimeter',
    publicDescription:
      'Peaceful family cottages with twin beds, hot water geysers, and serene garden verandahs for elderly pilgrims and long-distance travelers.',
    operatingHours: 'Check-in: 12:00 PM | Check-out: 11:00 AM',
    visitorInstructions:
      'Subject to availability. Priority given to senior citizens and registered seva sponsors.',
    contactInfo: 'Desk Ext. 103',
    publicationStatus: 'Published',
    verificationStatus: 'Verified',
    displayOrder: 2,
  },
  {
    id: 'PUB-FAC-03',
    internalFacilityId: 'FAC-003', // Linked to internal Waiting Pavilion
    name: 'Pilgrim Rest & Covered Queue Waiting Pavilion',
    category: 'Waiting Area',
    icon: 'Users',
    location: 'Main Sanctum Forecourt Approach',
    publicDescription:
      'Spacious shaded seating pavilion equipped with high-capacity ceiling fans, continuous drinking water dispensers, and live LED darshan broadcast displays.',
    operatingHours: '05:00 AM – 09:30 PM (Daily)',
    visitorInstructions:
      'Open to all devotees free of charge. Please keep the seating benches clean and do not leave personal bags unattended.',
    contactInfo: 'On-duty Sevadal Volunteers Available',
    publicationStatus: 'Published',
    verificationStatus: 'Verified',
    displayOrder: 3,
  },
  {
    id: 'PUB-FAC-04',
    internalFacilityId: 'FAC-004', // Linked to Bathing Ghat
    name: 'Kalyansagar Holy Lake Ghat & Turtle Viewing Steps',
    category: 'Bathing & Viewing Ghat',
    icon: 'Waves',
    location: 'Eastern Lake Bank',
    publicDescription:
      'Ancient stepped masonry ghats for sacred ritual ablutions before entering sanctum. Features protective stainless steel safety handrails and designated turtle viewing points.',
    operatingHours: '05:30 AM – 07:00 PM',
    visitorInstructions:
      'Children must be supervised near water steps. Swimming or diving into the lake is prohibited. Only approved turtle feed permitted.',
    contactInfo: 'Ghat Supervisor Desk',
    publicationStatus: 'Published',
    verificationStatus: 'Verified',
    displayOrder: 4,
  },
  {
    id: 'PUB-FAC-05',
    internalFacilityId: null,
    name: 'Purified Cold Drinking Water Kiosks (RO Plants)',
    category: 'Drinking Water',
    icon: 'Droplets',
    location: 'Available at East Gate, West Gate & Parikrama Path',
    publicDescription:
      'Multiple stainless steel reverse-osmosis (RO) UV-sterilized cold drinking water taps accessible throughout the day.',
    operatingHours: 'Continuous 24 Hours',
    visitorInstructions:
      'Devotees may refill clean personal water bottles. Please avoid water wastage.',
    contactInfo: 'Maintained by Public Health Engineering Dept (PHED)',
    publicationStatus: 'Published',
    verificationStatus: 'Verified',
    displayOrder: 5,
  },
  {
    id: 'PUB-FAC-06',
    internalFacilityId: null,
    name: 'Sanitation Complex & Clean Washrooms',
    category: 'Toilets',
    icon: 'Sparkles',
    location: 'West Gate Plaza & North Parking Terminal',
    publicDescription:
      'Modern, well-maintained sanitary toilet blocks with dedicated western commodes for senior citizens and divyangjan accessibility.',
    operatingHours: '05:00 AM – 10:00 PM',
    visitorInstructions:
      'Complimentary sanitation service maintained by temple housekeeping staff.',
    contactInfo: 'Sanitation Helpline Desk',
    publicationStatus: 'Published',
    verificationStatus: 'Verified',
    displayOrder: 6,
  },
  {
    id: 'PUB-FAC-07',
    internalFacilityId: null,
    name: 'Central Pilgrim Help Desk & Divyangjan Assistance',
    category: 'Help Desk',
    icon: 'HelpCircle',
    location: 'Immediately inside West Entrance Torana',
    publicDescription:
      'One-stop inquiry counter providing information on darshan timings, special passes, lost & found assistance, and complimentary wheelchair checkout.',
    operatingHours: '05:30 AM – 09:00 PM',
    visitorInstructions:
      'Available in Bengali, Kokborok, Hindi, and English languages.',
    contactInfo: 'Ext. 101 / Intercom 22',
    publicationStatus: 'Published',
    verificationStatus: 'Verified',
    displayOrder: 7,
  },
  {
    id: 'PUB-FAC-08',
    internalFacilityId: null,
    name: 'Temple Mahaprasad & Traditional Peda Counter',
    category: 'Prasad',
    icon: 'ShoppingBag',
    location: 'East Plaza Forecourt Counter',
    publicDescription:
      'Authorized trust distribution center offering freshly packed pure cow milk peda packets, consecrated dry fruits, and Anna Bhog coupons.',
    operatingHours: '07:00 AM – 08:30 PM',
    visitorInstructions:
      'Computerized trust receipts issued for all prasad packets. Digital UPI & cash payments accepted.',
    contactInfo: 'Store In-charge Shri P. Sen',
    publicationStatus: 'Published',
    verificationStatus: 'Verified',
    displayOrder: 8,
  },
];

