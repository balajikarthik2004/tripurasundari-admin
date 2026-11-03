/**
 * Financial collections and donation breakdown data
 */

export const COLLECTIONS_SUMMARY = {
  totalRecorded: 1872850, // ₹18.7L
  targetProgressPercent: 88,
  comparedToYesterdayPercent: 14.8,
  breakdown: [
    {
      id: 'general',
      name: 'General Donations',
      amount: 824500,
      percentage: 44,
      color: '#55132D', // Primary Burgundy
    },
    {
      id: 'pooja',
      name: 'Pooja & Offerings',
      amount: 512300,
      percentage: 27,
      color: '#B68A36', // Antique Gold
    },
    {
      id: 'prasad',
      name: 'Prasad Store',
      amount: 245800,
      percentage: 13,
      color: '#E2BC6B', // Gold Highlight
    },
    {
      id: 'sponsorships',
      name: 'Sponsorships & Sevas',
      amount: 162000,
      percentage: 9,
      color: '#681B37', // Secondary Maroon
    },
    {
      id: 'other',
      name: 'Other Contributions',
      amount: 128250,
      percentage: 7,
      color: '#28212A', // Primary Charcoal
    },
  ],
  hourlyComparison: [
    { time: '6 AM', today: 18000, yesterday: 14000 },
    { time: '8 AM', today: 54000, yesterday: 42000 },
    { time: '10 AM', today: 125000, yesterday: 98000 },
    { time: '12 PM', today: 210000, yesterday: 175000 },
    { time: '2 PM', today: 145000, yesterday: 130000 },
    { time: '4 PM', today: 185000, yesterday: 160000 },
    { time: '6 PM', today: 230000, yesterday: 195000 },
    { time: '8 PM', today: 110000, yesterday: 95000 },
  ],
};

