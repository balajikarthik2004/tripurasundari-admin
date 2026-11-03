// Directions & Travel Information Data Model

export const INITIAL_TRAVEL_INFORMATION = {
  id: 'TRV-001',
  destinationName: 'Mata Tripura Sundari Temple (Matabari)',
  locationOverview: 'Situated in Matabari, approximately 3 kilometers south of the historic city of Udaipur in Gomati District, Tripura.',
  coordinates: 'Latitude: 23.5321° N, Longitude: 91.4921° E',
  transportModes: [
    {
      mode: 'Air Travel',
      title: 'Nearest Airport: Maharaja Bir Bikram (MBB) Airport, Agartala',
      icon: 'Plane',
      description:
        'Located in Agartala, connecting major metropolitan hubs including Kolkata, Guwahati, Delhi, and Bengaluru. Direct state transport buses, prepaid taxis, and private car rentals are available outside the terminal towards Udaipur via National Highway 8 (NH-8).',
      notes: 'Road travel from Agartala airport to Udaipur typically takes approximately 1.5 to 2 hours depending on highway conditions.',
      verificationStatus: 'Verified',
    },
    {
      mode: 'Rail Travel',
      title: 'Nearest Railway Station: Udaipur Tripura (UDPU)',
      icon: 'Train',
      description:
        'Udaipur Tripura railway station is well-connected to Agartala, Silchar, and Lumding via the North East Frontier Railway broad-gauge network. Regular passenger trains and express services operate daily. Auto-rickshaws and shared e-rickshaws connect the station to Matabari temple in about 10–15 minutes.',
      notes: 'Check official railway passenger reservation portals for real-time train timings.',
      verificationStatus: 'Verified',
    },
    {
      mode: 'Road & Highway',
      title: 'National Highway 8 (NH-8) Access',
      icon: 'Bus',
      description:
        'The temple is directly situated along National Highway 8 (NH-8), ensuring seamless road connectivity from Agartala, Sabroom, Belonia, and Santirbazar. Both Tripura Road Transport Corporation (TRTC) buses and private coaches operate frequent shuttle services to Udaipur Central Bus Stand.',
      notes: 'Designated temple bus terminal (Lot A) accommodates long-distance luxury coaches and pilgrim group buses.',
      verificationStatus: 'Verified',
    },
    {
      mode: 'Local Transit in Udaipur',
      title: 'Local E-Rickshaws & Taxis',
      icon: 'Car',
      description:
        'Shared green battery-operated e-rickshaws (Tom-Toms), autorickshaws, and metered taxis connect Udaipur town center, Rajbari ruins, and Matabari shrine seamlessly.',
      notes: 'Standard local fare applies. Help desk coordinates registered auto associations during festival rush.',
      verificationStatus: 'Verified',
    },
  ],
  parkingReference: 'Large designated vehicle parking bays available at West Gate (Lot B) and North Bus Terminal (Lot A).',
  travelAdvisory: 'During Diwali Mela and major festival weekends, heavy vehicles may be redirected via Kakraban bypass by traffic authorities.',
  status: 'Published',
  verificationStatus: 'Verified',
  lastUpdated: '30 Oct 2026',
};

