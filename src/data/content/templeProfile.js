// Temple Public Profile Data Model
// Public-facing website core identity for Mata Tripura Sundari Temple (Matabari)

export const INITIAL_TEMPLE_PROFILE = {
  id: 'PROF-001',
  templeName: 'Mata Tripura Sundari Temple',
  localName: 'Matabari / Kurmapitha Shrine',
  shaktiPeethaStatus: 'One of the 51 Sacred Shakti Peethas (Right Foot / Dakshina Pada of Sati)',
  shortDescription:
    'Ancient 16th-century Shakti Peetha established by Maharaja Dhanya Manikya in 1501 CE, venerated as one of the holiest shrines in Northeast India.',
  fullDescription:
    'Perched gracefully upon a tortoise-shaped hillock (Kurmapitha) in Udaipur, Tripura, Mata Tripura Sundari Temple stands as an eternal beacon of Shakta devotion. Built in 1501 CE by the devout Manikya monarch Maharaja Dhanya Manikya, the temple features classic Bengali "Char-chala" vaulted architecture fused with indigenous Tripura craftsmanship. Adjoining the shrine is the sacred Kalyan Sagar lake, home to venerable freshwater Bostami turtles revered by visiting pilgrims.',
  location: 'Matabari, Udaipur, Gomati District, Tripura, India',
  address: {
    line1: 'Matabari Temple Complex',
    line2: 'National Highway 8 (NH-8) Approach',
    city: 'Udaipur',
    district: 'Gomati District',
    state: 'Tripura',
    pinCode: '799114',
    country: 'India',
  },
  contactDetails: {
    officialPhone: '+91 3821 222340',
    helplinePhone: '+91 3821 222345',
    officialEmail: 'trust@matabari-temple.gov.in',
    mediaContact: 'pr@matabari-temple.gov.in',
    emergencyHotline: '112 / 1077',
  },
  officialWebsite: 'https://matabari.tripura.gov.in',
  openingInformation: {
    morningDarshan: '05:00 AM – 12:30 PM',
    eveningDarshan: '03:00 PM – 09:00 PM',
    mangalaAarti: '05:00 AM',
    madhyahnaBhog: '12:00 PM',
    sandhyaAarti: '06:30 PM (Winter) / 07:00 PM (Summer)',
    notes: 'Darshan timings subject to slight variations during solar/lunar eclipses and major festivals.',
  },
  historicalReference: 'Consecrated 1501 CE (Tripura Era 911) by Maharaja Dhanya Manikya',
  mainImage: '/src/assets/images/temple.jpg',
  coverImage: '/src/assets/images/temple.jpg',
  status: 'Published', // Draft, Published, Scheduled, Archived, Unpublished
  verificationStatus: 'Verified', // Verified, Requires Review, Draft
  lastUpdated: '31 Oct 2026',
  updatedBy: 'Chief Administrative Officer',
};

