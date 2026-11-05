/**
 * Core Dashboard Single-Source-of-Truth Data Model
 * Mata Tripura Sundari Temple Administration
 */

// Compute festival days left dynamically from today's date
function getFestivalDaysLeft() {
  const today = new Date();
  const festivalDate = new Date(today.getFullYear(), 10, 10); // Nov 10
  if (festivalDate < today) {
    festivalDate.setFullYear(today.getFullYear() + 1);
  }
  const diffTime = festivalDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

export const FESTIVAL_INFO = {
  name: 'Diwali Mela',
  dates: '10–12 Nov',
  daysLeft: getFestivalDaysLeft(),
  path: '/mela-festival',
};

// Exactly 4 Equal KPI Cards with standardized trend format
export const DASHBOARD_KPIS = [
  {
    id: 'kpi-visits',
    title: "Today's Visits",
    value: '24,680',
    icon: 'Users',
    trend: '↑ 12% vs yesterday',
    trendPositive: true,
    path: '/sacred-services',
  },
  {
    id: 'kpi-bookings',
    title: 'Service Bookings',
    value: '3,245',
    icon: 'CalendarCheck',
    trend: '↑ 18% vs yesterday',
    trendPositive: true,
    path: '/sacred-services?tab=bookings',
  },
  {
    id: 'kpi-wait',
    title: 'Queue Wait',
    value: '26 mins',
    icon: 'Clock',
    trend: '↓ 4m vs yesterday',
    trendPositive: true,
    path: '/crowd-control',
  },
  {
    id: 'kpi-approvals',
    title: 'Pending Approvals',
    value: '18',
    icon: 'FileCheck',
    trend: '↑ 3 new today',
    trendPositive: false,
    path: '/approvals-alerts',
  },
];

// Consistent Live Operation Telemetry
export const DEVOTEE_FLOW_DATA = {
  currentInside: 1110,
  maxCapacity: 2000,
  occupancyPercent: 56, // 1110 / 2000 = 55.5% -> 56%
  status: 'Moderate',
  entrances: [
    {
      id: 'west',
      name: 'West Entrance',
      current: 725,
      capacity: 1200,
      percent: 60,
      wait: '~26 min wait',
    },
    {
      id: 'north',
      name: 'North Entrance',
      current: 385,
      capacity: 800,
      percent: 48,
      wait: '~16 min wait',
    },
  ],
};

// Camera Feeds (Structured id, name, label, status)
export const CAMERA_FEEDS = [
  { id: 'CAM-01', name: 'Main Courtyard', label: 'CAM-01 · Main Courtyard', status: 'Online', videoUrl: '/matabari-cam01.mp4' },
  { id: 'CAM-02', name: 'Temple Approach', label: 'CAM-02 · Temple Approach', status: 'Online', videoUrl: '/matabari-cam01.mp4' },
  { id: 'CAM-03', name: 'Peripheral Area', label: 'CAM-03 · Peripheral Area', status: 'Online', videoUrl: '/matabari-cam01.mp4' },
  { id: 'CAM-04', name: 'Facility Area', label: 'CAM-04 · Facility Area', status: 'Online', videoUrl: '/matabari-cam01.mp4' },
];

// Pilgrim Welfare Single-Source Data
export const PILGRIM_WELFARE_DATA = {
  mealsServed: 4885,
  mealsTarget: 6000,
  mealProgress: 81,
  mealStatus: 'Batch 3 Active',
  facilities: [
    { id: 'water', label: 'RO Water', value: '4 / 4 Active', status: 'Normal' },
    { id: 'lockers', label: 'Free Lockers', value: '412 / 600 (68%)', status: 'Normal' },
    { id: 'care', label: 'Special Care', value: '58 Assisted', status: 'Active' },
    { id: 'medical', label: 'First-Aid', value: 'Doctor on Duty', status: 'Ready' },
  ],
};

// AI Operations Forecast (Exact telemetry and color accents)
export const AI_FORECAST_DATA = [
  {
    id: 'fc-crowd',
    title: 'Crowd Forecast',
    value: '4,450',
    caption: 'Peak at 6:30 PM Aarti',
    icon: 'Users',
    iconBg: 'bg-rose-50 border border-rose-100',
    iconColor: 'text-rose-700',
    accentColor: 'bg-[#55132D]',
    path: '/crowd-control',
  },
  {
    id: 'fc-staff',
    title: 'Staff Volunteers',
    value: '+14 Needed',
    caption: '47 on duty · 61 projected',
    icon: 'UserCheck',
    iconBg: 'bg-amber-50 border border-amber-100',
    iconColor: 'text-amber-700',
    accentColor: 'bg-[#D97706]',
    path: '/volunteer-staff',
  },
  {
    id: 'fc-parking',
    title: 'Parking Demand',
    value: '94% Peak',
    caption: '68% current · 78/hr inflow',
    icon: 'Car',
    iconBg: 'bg-purple-50 border border-purple-100',
    iconColor: 'text-purple-600',
    accentColor: 'bg-purple-400',
    path: '/ai-heatmap',
  },
  {
    id: 'fc-bookings',
    title: 'Darshan Bookings',
    value: '+34% Demand',
    caption: 'Evening VIP slots at 92%',
    icon: 'CalendarCheck',
    iconBg: 'bg-rose-50 border border-rose-100',
    iconColor: 'text-rose-700',
    accentColor: 'bg-[#55132D]',
    path: '/sacred-services?tab=bookings',
  },
];

// Quick Action Shortcuts (Consistent 2x3 Matrix)
export const QUICK_ACTIONS_DATA = [
  {
    id: 'act-1',
    label: 'Create Darshan',
    subtitle: 'Issue VIP / Special pass',
    icon: 'CalendarCheck',
    colorTheme: 'text-amber-700 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white border-amber-200',
    path: '/sacred-services?tab=bookings',
  },
  {
    id: 'act-2',
    label: 'Record Donation',
    subtitle: 'Hundi & seva receipt',
    icon: 'HandHeart',
    colorTheme: 'text-emerald-700 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white border-emerald-200',
    path: '/donations',
  },
  {
    id: 'act-3',
    label: 'Add Grievance',
    subtitle: 'Fast-track pilgrim redressal',
    icon: 'MessageSquareMore',
    colorTheme: 'text-rose-700 bg-rose-50 group-hover:bg-rose-600 group-hover:text-white border-rose-200',
    path: '/grievances',
  },
  {
    id: 'act-4',
    label: 'View Reports',
    subtitle: 'Audit & footfall analytics',
    icon: 'BarChart3',
    colorTheme: 'text-indigo-700 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white border-indigo-200',
    path: '/reports',
  },
  {
    id: 'act-5',
    label: 'Assign Staff',
    subtitle: 'Duty shifts & rosters',
    icon: 'UserCheck',
    colorTheme: 'text-purple-700 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white border-purple-200',
    path: '/volunteer-staff',
  },
  {
    id: 'act-6',
    label: 'Temple Settings',
    subtitle: 'Pooja timings & config',
    icon: 'Settings',
    colorTheme: 'text-stone-700 bg-stone-100 group-hover:bg-stone-800 group-hover:text-white border-stone-200',
    path: '/settings',
  },
];

// Short Ritual Names (Zero text truncation)
export const DASHBOARD_RITUALS = [
  { id: 'rit-1', time: '05:00 AM', name: 'Mangala Aarti', status: 'Completed' },
  { id: 'rit-2', time: '07:00 AM', name: 'Alankara Darshan', status: 'Completed' },
  { id: 'rit-3', time: '12:00 PM', name: 'Madhyahna Aarti', status: 'Active' },
  { id: 'rit-4', time: '06:30 PM', name: 'Sandhya Aarti', status: 'Upcoming' },
  { id: 'rit-5', time: '08:30 PM', name: 'Shayana Aarti', status: 'Upcoming' },
];

// Clean Recent Activity
export const DASHBOARD_RECENT_ACTIVITIES = [
  { id: 'ACT-1', devotee: 'Priya Sharma', time: '10:24 AM', service: 'VIP Darshan Pass', amount: 1500, status: 'Verified' },
  { id: 'ACT-2', devotee: 'Rajesh Debbarma', time: '10:18 AM', service: 'Nitya Annadanam', amount: 5001, status: 'Verified' },
  { id: 'ACT-3', devotee: 'Amitava Roy', time: '10:12 AM', service: 'Maha Archana Seva', amount: 750, status: 'Verified' },
  { id: 'ACT-4', devotee: 'Subhashini Sen', time: '09:55 AM', service: 'Kalyansagar Seva', amount: 1100, status: 'Verified' },
  { id: 'ACT-5', devotee: 'Debabrata Das', time: '09:42 AM', service: 'Temple Renovation', amount: 10000, status: 'Verified' },
];

export const NOTIFICATIONS_LIST = [
  { id: 'notif-1', title: 'Crowd density alert at Zone A', time: '10 mins ago', unread: true },
  { id: 'notif-2', title: 'VIP pass submitted by SDM office', time: '24 mins ago', unread: true },
  { id: 'notif-3', title: 'Daily Mahaprasad prepared', time: '1 hr ago', unread: false },
];

export const SYSTEM_BADGE = {
  badge: 'TEMPLE TRUST PORTAL',
  description: 'Official Administration System for Mata Tripura Sundari Temple.',
};

export const CURRENT_ADMIN_USER = {
  name: 'Admin User',
  role: 'Super Administrator',
  avatarInitials: 'AU',
  email: 'admin.trust@matabari.tripura.gov.in',
};
