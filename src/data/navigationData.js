export const NAVIGATION_GROUPS = [
  {
    id: 'overview',
    title: 'OVERVIEW',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'LayoutDashboard',
        description: 'Executive temple operations overview, real-time metrics, visitor statistics, and operational shortcuts.',
        badge: null,
      },
      {
        id: 'approvals-alerts',
        label: 'Approvals',
        path: '/approvals-alerts',
        icon: 'FileCheck',
        description: 'Administrative clearance desk for VIP passes and live operational incident command dispatch.',
        badge: '18',
      },
    ],
  },
  {
    id: 'devotee-services',
    title: 'DEVOTEE SERVICES',
    items: [
      {
        id: 'sacred-services',
        label: 'Bookings',
        path: '/sacred-services',
        icon: 'CalendarCheck',
        description: 'Darshan quota booking, gate turnstile access, sacred puja catalogue, and daily ritual timetable.',
      },
      {
        id: 'annadanam',
        label: 'Annadanam',
        path: '/annadanam',
        icon: 'Utensils',
        description: 'Daily Maha Annadanam meal preparation, dining hall service schedules, and food distribution records.',
      },
      {
        id: 'devotees-grievances',
        label: 'Devotees',
        path: '/devotees-grievances',
        icon: 'Users',
        description: 'Devotee directory, patron tiers, pilgrim complaint ticketing, resolution SLAs, and feedback feed.',
      },
      {
        id: 'donations',
        label: 'Donations',
        path: '/donations',
        icon: 'HeartHandshake',
        description: 'Online & hundi collections, earmarked trust funds, 80G tax certificates, and sponsorship programs.',
      },
      {
        id: 'prasad-store',
        label: 'Prasad Store',
        path: '/prasad-store',
        icon: 'ShoppingBag',
        description: 'Bhog & prasad inventory, computerized POS store billing, and souvenir distributions.',
      },
      {
        id: 'facilities',
        label: 'Accommodation',
        path: '/facilities',
        icon: 'Hotel',
        description: 'Yatri Niwas guest rooms, pilgrim shelters, cloakrooms, locker allotments, and maintenance work orders.',
      },
    ],
  },
  {
    id: 'temple-operations',
    title: 'TEMPLE OPERATIONS',
    items: [
      {
        id: 'crowd-control',
        label: 'AI Heatmap',
        path: '/crowd-control',
        icon: 'Flame',
        description: 'Real-time AI campus crowd heatmap, queue holding corridors, and peak inflow simulation.',
      },
      {
        id: 'cctv-monitoring',
        label: 'CCTV Monitor',
        path: '/cctv-monitoring',
        icon: 'Video',
        description: 'Live surveillance feeds across sanctum, parikrama, lake ghats, and AI face recognition search.',
      },
      {
        id: 'staff-management',
        label: 'Volunteer Staff',
        path: '/staff-management',
        icon: 'Users',
        description: 'Sevadal roster, interactive campus deployment map, shift attendance, and emergency muster.',
      },
      {
        id: 'temple-calendar',
        label: 'Calendar',
        path: '/temple-calendar',
        icon: 'CalendarDays',
        description: 'Master temple duty roster, daily shift planning, ritual timelines, and preparation tasks.',
      },
    ],
  },
  {
    id: 'content-management',
    title: 'CONTENT MANAGEMENT',
    items: [
      {
        id: 'temple-content',
        label: 'Temple Content',
        path: '/temple-content',
        icon: 'Landmark',
        description: 'Historical archives, deity chronicles, temple profile, gallery media, and public pages.',
      },
      {
        id: 'visitors-info',
        label: 'Visitors Info',
        path: '/visitors-info',
        icon: 'MapPin',
        description: 'Interactive campus map, public facilities directory, pilgrim guidelines, and FAQs.',
      },
    ],
  },
  {
    id: 'insights-admin',
    title: 'INSIGHTS & ADMINISTRATION',
    items: [
      {
        id: 'reports-admin',
        label: 'Reports',
        path: '/reports-admin',
        icon: 'BarChart3',
        description: 'Financial audits, bank reconciliation, and RBAC user permissions matrix.',
      },
      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: 'Settings',
        description: 'Temple identity, booking rules, financial preferences, and operational defaults.',
      },
    ],
  },
];

// Helper to look up any item by path
export const ALL_NAVIGATION_ITEMS = NAVIGATION_GROUPS.flatMap((group) => group.items);

export const ROUTE_ALIASES = {
  '/dashboard': ['/dashboard', '/'],
  '/approvals-alerts': ['/approvals-alerts', '/approvals', '/alerts'],
  '/sacred-services': ['/sacred-services', '/bookings', '/pooja-seva', '/gate-management', '/ritual-schedule'],
  '/annadanam': ['/annadanam'],
  '/devotees-grievances': ['/devotees-grievances', '/devotees', '/grievances'],
  '/donations': ['/donations'],
  '/prasad-store': ['/prasad-store'],
  '/facilities': ['/facilities', '/accommodation'],
  '/crowd-control': ['/crowd-control'],
  '/cctv-monitoring': ['/cctv-monitoring'],
  '/staff-management': ['/staff-management', '/volunteer-staff'],
  '/temple-calendar': ['/temple-calendar'],
  '/campus-logistics': ['/campus-logistics', '/parking', '/vendors'],
  '/mela-festival': ['/mela-festival', '/events', '/events-festivals', '/mela-management'],
  '/temple-content': ['/temple-content', '/temple-information', '/announcements', '/content-guide'],
  '/visitors-info': ['/visitors-info', '/visit-guide'],
  '/reports-admin': ['/reports-admin', '/reports'],
  '/settings': ['/settings', '/temple-settings', '/users', '/users-roles'],
};

export const isRouteActive = (itemPath, currentPath) => {
  if (!itemPath || !currentPath) return false;
  if (currentPath === itemPath) return true;
  const aliases = ROUTE_ALIASES[itemPath];
  if (aliases && aliases.includes(currentPath)) return true;
  if (itemPath !== '/' && currentPath.startsWith(itemPath + '/')) return true;
  return false;
};

export const getNavItemByPath = (path) => {
  return ALL_NAVIGATION_ITEMS.find((item) => isRouteActive(item.path, path)) || ALL_NAVIGATION_ITEMS[0];
};
