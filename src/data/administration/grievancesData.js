// Devotee Grievances & Case Management Data Model

export const INITIAL_GRIEVANCE_CATEGORIES = [
  'Darshan Experience',
  'Pooja & Seva',
  'Annadanam',
  'Prasad & Store',
  'Accommodation',
  'Parking',
  'Facilities',
  'Staff Conduct',
  'General Feedback',
];

export const INITIAL_GRIEVANCES = [
  {
    id: 'GRV-2026-001',
    subject: 'Senior citizen wheelchair ramp blocked by barricade at West Gate',
    devoteeName: 'Smt. Anjali Sengupta',
    devoteePhone: '+91 98623 44012',
    devoteeEmail: 'anjali.sengupta@example.com',
    category: 'Facilities',
    priority: 'Critical', // Low, Normal, High, Critical
    status: 'In Progress', // New, Open, Assigned, In Progress, Awaiting Response, Resolved, Closed
    assignedTo: 'Officer S. Bhattacharya (Administrative Officer)',
    submittedDate: '31 Oct 2026 09:15 AM',
    relatedBookingId: 'DRSN-2026-1004',
    description:
      'My 78-year-old mother requires wheelchair transit. When entering through West Gate, an iron crowd barrier was wedged directly across the accessibility ramp, forcing us to wait 25 minutes until security marshals could clear the passage.',
    internalNotes: [
      { date: '31 Oct 10:00 AM', author: 'S. Bhattacharya', text: 'Dispatched Gate Marshal N. Das to remove temporary barricade and permanently demarcate wheelchair clearway.' },
    ],
    responses: [
      { date: '31 Oct 10:30 AM', author: 'Temple Help Desk', text: 'Respected devotee, we sincerely apologize for the inconvenience. The ramp obstruction has been cleared and security personnel briefed.' },
    ],
  },
  {
    id: 'GRV-2026-002',
    subject: 'Delay in collecting pre-booked Cow Milk Peda at East Counter',
    devoteeName: 'Shri Bikash Roy',
    devoteePhone: '+91 98623 11849',
    devoteeEmail: 'bikash.roy@example.com',
    category: 'Prasad & Store',
    priority: 'Normal',
    status: 'Resolved',
    assignedTo: 'Store In-charge Shri P. Sen',
    submittedDate: '30 Oct 2026 02:30 PM',
    relatedBookingId: 'PRSD-0876',
    description:
      'Had booked 4 boxes of Special Mahaprasad Peda online. The counter staff could not locate the printed order receipt on their system for 20 minutes due to scanner misconfiguration.',
    internalNotes: [
      { date: '30 Oct 03:00 PM', author: 'P. Sen', text: 'Scanner connection reset. Devotee handed packets with additional complimentary sacred chunri as courtesy.' },
    ],
    responses: [
      { date: '30 Oct 03:15 PM', author: 'P. Sen', text: 'Order was successfully delivered to devotee in person. System barcode scanner firmware updated.' },
    ],
  },
  {
    id: 'GRV-2026-003',
    subject: 'Water pressure low in Room 204 at Yatri Niwas Guest Cottages',
    devoteeName: 'Shri Debabrata Debbarma',
    devoteePhone: '+91 98623 99214',
    devoteeEmail: 'debabrata.d@example.com',
    category: 'Accommodation',
    priority: 'High',
    status: 'Assigned',
    assignedTo: 'Facility Manager B. Roy',
    submittedDate: '31 Oct 2026 07:45 AM',
    relatedBookingId: 'ACCM-0450',
    description:
      'Checked in late evening for family pilgrimage. Morning bathroom water flow was barely a trickle. Kindly inspect overhead tank booster pump.',
    internalNotes: [
      { date: '31 Oct 08:30 AM', author: 'B. Roy', text: 'Plumber notified to inspect line valve connecting Cottage Block B.' },
    ],
    responses: [],
  },
  {
    id: 'GRV-2026-004',
    subject: 'Incorrect date printed on Navagraha Pooja token slip',
    devoteeName: 'Smt. Priya Sharma',
    devoteePhone: '+91 98623 88102',
    devoteeEmail: 'priya.sharma@example.com',
    category: 'Pooja & Seva',
    priority: 'Normal',
    status: 'Resolved',
    assignedTo: 'Pooja Clerk K. Chakraborty',
    submittedDate: '29 Oct 2026 11:10 AM',
    relatedBookingId: 'POOJ-1022',
    description:
      'The booking was made for 31 Oct 12:00 PM, but the printed physical slip listed 30 Oct. Please update priest register to avoid slot collision.',
    internalNotes: [
      { date: '29 Oct 11:30 AM', author: 'K. Chakraborty', text: 'Corrected in daily ritual roster. Sankalpa slip reissued.' },
    ],
    responses: [
      { date: '29 Oct 11:45 AM', author: 'Help Desk', text: 'Fresh token slip re-sent via SMS and verified with head priest pandit.' },
    ],
  },
  {
    id: 'GRV-2026-005',
    subject: 'Unregulated vendor harassment near Kalyan Sagar lake steps',
    devoteeName: 'Shri Subhashree Roy',
    devoteePhone: '+91 98623 55214',
    devoteeEmail: 'subhashree.r@example.com',
    category: 'Staff Conduct',
    priority: 'High',
    status: 'New',
    assignedTo: 'Pending Assignment',
    submittedDate: '31 Oct 2026 10:10 AM',
    relatedBookingId: null,
    description:
      'Unlicensed hawkers without badges were aggressively pressing pilgrims to buy unapproved puffed rice bags near the lower ghat steps. Please increase volunteer presence.',
    internalNotes: [],
    responses: [],
  },
];

export const INITIAL_FEEDBACK = [
  {
    id: 'FDB-2026-101',
    devoteeName: 'Shri Ramesh Kumar',
    category: 'Darshan Experience',
    rating: 5,
    message: 'Exceptionally orderly darshan today! The barricade arrangement and smiling sevadal volunteers made our temple visit peaceful and auspicious.',
    submittedDate: '31 Oct 2026 10:45 AM',
    reviewStatus: 'Reviewed',
    internalRemarks: 'Positive feedback shared with Morning Shift Sevadal team.',
  },
  {
    id: 'FDB-2026-102',
    devoteeName: 'Smt. Mita Das',
    category: 'Annadanam',
    rating: 5,
    message: 'The Anna Bhog khichuri and payesh served at Sri Annapurna hall was divinely delicious. Extremely hygienic dining tables and warm hospitality.',
    submittedDate: '30 Oct 2026 02:00 PM',
    reviewStatus: 'Reviewed',
    internalRemarks: 'Kitchen supervisor commended.',
  },
  {
    id: 'FDB-2026-103',
    devoteeName: 'Shri Alok Deb',
    category: 'Parking',
    rating: 3,
    message: 'Lot B was clean and guarded, but highway signage near the Kakraban bypass was poorly lit at night. Difficult to locate entrance in the dark.',
    submittedDate: '29 Oct 2026 08:30 PM',
    reviewStatus: 'Under Review',
    internalRemarks: 'Passed recommendation to PWD road lighting team for Mela preparation.',
  },
  {
    id: 'FDB-2026-104',
    devoteeName: 'Smt. Rekha Choudhury',
    category: 'Facilities',
    rating: 4,
    message: 'RO drinking water points are very clean and refreshing. Would appreciate if more benches are added along the southern lake promenade.',
    submittedDate: '28 Oct 2026 11:15 AM',
    reviewStatus: 'Reviewed',
    internalRemarks: 'Bench additions included in Phase 5 visitor guide review.',
  },
];

