// Directions & Travel Information Data Model
// Streamlined, clear, and breathable format

export const INITIAL_TRAVEL_INFORMATION = {
  id: 'TRV-001',
  destinationName: 'Mata Tripura Sundari Temple (Matabari)',
  locationOverview: 'Matabari, 3 km south of Udaipur town, Gomati District, Tripura.',
  coordinates: '23.5321° N, 91.4921° E',
  transportModes: [
    {
      mode: 'Air Travel',
      title: 'MBB Airport, Agartala (IXA)',
      tag: '55 km · ~1.5 hrs via NH-8',
      icon: 'Plane',
      description: 'Major hub connected to Kolkata, Guwahati, Delhi & Bengaluru. TRTC buses, prepaid airport taxis and rental cars run directly to Udaipur.',
      verificationStatus: 'Verified',
    },
    {
      mode: 'Rail Travel',
      title: 'Udaipur Tripura Station (UDPU)',
      tag: '3 km · 10–15 mins',
      icon: 'Train',
      description: 'Connected via North East Frontier broad-gauge network to Agartala and Silchar. Shared E-Rickshaws (Tom-Toms) available outside.',
      verificationStatus: 'Verified',
    },
    {
      mode: 'Road & Highway',
      title: 'National Highway 8 (NH-8)',
      tag: 'Direct Highway Access',
      icon: 'Bus',
      description: 'Direct highway connectivity from Agartala, Sabroom, Belonia and Santirbazar. Frequent TRTC state buses stop at Udaipur Central.',
      verificationStatus: 'Verified',
    },
    {
      mode: 'Local Transit',
      title: 'Local E-Rickshaws & Taxis',
      tag: 'Available 24/7 at West Gate',
      icon: 'Car',
      description: 'Green battery-operated Tom-Toms and auto-rickshaws connect Udaipur city center, heritage sites and Matabari shrine at fixed fares.',
      verificationStatus: 'Verified',
    },
  ],
  travelAdvisory: 'During Diwali Mela and major festival days, heavy vehicular traffic is redirected via the Kakraban bypass. Dedicated yatri shuttles operate from Udaipur Central.',
  status: 'Published',
  verificationStatus: 'Verified',
  lastUpdated: '30 Oct 2026',
};
