// Public-Facing Events & Festivals Data Model
// Note: Interconnected with Mela Management internal records where applicable

export const INITIAL_EVENTS = [
  {
    id: 'EVT-2026-001',
    internalMelaId: 'MELA-2026-01', // Linked to internal Mela Management preparation
    title: 'Diwali Mahotsav & Kalyan Sagar Dipavali Mela 2026',
    slug: 'diwali-mahotsav-2026',
    category: 'Major Festivals',
    startDate: '10 Nov 2026',
    endDate: '12 Nov 2026',
    startTime: '05:00 AM (Continuous 24h Darshan)',
    endTime: '11:00 PM',
    venue: 'Matabari Temple Complex & Kalyan Sagar Lake Banks',
    shortDescription:
      'The grandest annual festival at Mata Tripura Sundari Temple, illuminating the sacred lake with thousands of earthen lamps and midnight Kali puja.',
    detailedDescription:
      'Experience the celestial splendor of Diwali at one of India’s most sacred Shakti Peethas. Devotees from across the globe gather along the ancient steps of Kalyan Sagar to offer oil lamps (deepams). Continuous darshan channels will remain active day and night. Special prasadam distribution and cultural Shakta devotional music will accompany the holy celebrations.',
    highlights: [
      'Lighting of 1,00,000 sacred earthen lamps along Kalyan Sagar banks',
      'Midnight Kali & Shodashi Maha Nisha Puja on Amavasya',
      'Continuous 24-hour darshan corridors with queue shelters',
      'Special complimentary Annadanam for all visiting pilgrims',
    ],
    visitorInstructions:
      'Expect high visitor influx between 05:00 PM and 10:00 PM. Please utilize designated highway parking lots at North Terminal. Heavy bags must be deposited at East Gate cloakrooms.',
    featured: true,
    coverImage: '/src/assets/images/temple.jpg',
    status: 'Published', // Draft, Scheduled, Published, Archived
    verificationStatus: 'Verified',
    createdAt: '15 Oct 2026',
    lastUpdated: '31 Oct 2026',
    author: 'Temple Trust Media Desk',
  },
  {
    id: 'EVT-2026-002',
    internalMelaId: null,
    title: 'Kartik Purnima Rasotsav & Maha Deeparadhana',
    slug: 'kartik-purnima-2026',
    category: 'Religious Celebrations',
    startDate: '15 Nov 2026',
    endDate: '15 Nov 2026',
    startTime: '04:00 PM',
    endTime: '09:30 PM',
    venue: 'Main Sanctum & Parikrama Corridor',
    shortDescription:
      'Auspicious full moon ritual featuring divine floral adornment (Maha Alankara) and evening devotional recitations.',
    detailedDescription:
      'On the sacred occasion of Kartik Purnima, the Divine Mother will be attired in golden silks and fragrant white lotus garlands. Priests will chant Sri Chandi and Sri Lalita Sahasranama followed by ceremonial 108-wick brass lamp arati.',
    highlights: [
      'Special 108-flame brass deeparadhana at 06:30 PM',
      'Chandi Path recitation by Vedic scholars',
      'Distribution of sacred Kheer Mahaprasad to attendees',
    ],
    visitorInstructions:
      'Seating in the forecourt is on a first-come basis. Please maintain silence during Vedic recitations.',
    featured: true,
    coverImage: '/src/assets/images/temple.jpg',
    status: 'Published',
    verificationStatus: 'Verified',
    createdAt: '20 Oct 2026',
    lastUpdated: '28 Oct 2026',
    author: 'Administrator',
  },
  {
    id: 'EVT-2027-003',
    internalMelaId: 'MELA-2026-03',
    title: 'Maha Shivratri Jagaran & Akhanda Kirtan 2027',
    slug: 'maha-shivratri-2027',
    category: 'Religious Celebrations',
    startDate: '06 Mar 2027',
    endDate: '07 Mar 2027',
    startTime: '06:00 PM (Overnight)',
    endTime: '06:00 AM',
    venue: 'Sanctum Altar & Shiva Shrine Precinct',
    shortDescription:
      'Overnight vigil with four-prahar abhishekam ceremonies celebrating Shiva-Shakti union.',
    detailedDescription:
      'All-night prayer vigil with 4 ceremonial pujas at 09:00 PM, 12:00 Midnight, 03:00 AM, and dawn 05:30 AM with sacred Panchamrita snana.',
    highlights: [
      'Four-prahar Rudrabhishekam throughout the night',
      'Overnight devotional singing and Harinaam Sankirtan',
      'Bel-patra and milk offering counters for yatris',
    ],
    visitorInstructions:
      'Devotees intending to observe night fast are advised to carry warm shawls. Overnight rest shelters open at Yatri Niwas.',
    featured: false,
    coverImage: '/src/assets/images/temple.jpg',
    status: 'Scheduled',
    verificationStatus: 'Requires Review',
    createdAt: '22 Oct 2026',
    lastUpdated: '30 Oct 2026',
    author: 'Head Priest Council',
  },
  {
    id: 'EVT-2027-004',
    internalMelaId: 'MELA-2026-02',
    title: 'Ambuvachi Mela & Annual Sanctum Reopening 2027',
    slug: 'ambuvachi-mela-2027',
    category: 'Major Festivals',
    startDate: '22 Jun 2027',
    endDate: '25 Jun 2027',
    startTime: '06:00 AM',
    endTime: '08:00 PM',
    venue: 'Matabari Temple Grounds',
    shortDescription:
      'Sacred annual festival observing Mother Earth’s fertility cycle, followed by grand door reopening and Raktambari darshan.',
    detailedDescription:
      'Temple sanctum doors remain closed for three auspicious days of ritual repose and reopen on the fourth morning accompanied by Vedic conches and special red cloth prasad distribution.',
    highlights: [
      'Sacred door reopening ceremony on 25 June at dawn',
      'Distribution of sacred Raktambari cloth prasad',
      'Special pilgrim reception tents across Gomati district',
    ],
    visitorInstructions:
      'Temple sanctum closed from 22 to 24 June. Parikrama and Kalyan Sagar ghats remain accessible for prayers.',
    featured: false,
    coverImage: '/src/assets/images/temple.jpg',
    status: 'Draft',
    verificationStatus: 'Draft',
    createdAt: '25 Oct 2026',
    lastUpdated: '25 Oct 2026',
    author: 'Administrator',
  },
];

