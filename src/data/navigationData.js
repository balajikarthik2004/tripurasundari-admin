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
        description: 'Comprehensive temple operations overview, real-time metrics, visitor statistics, and operational alerts.',
        badge: null,
      },
      {
        id: 'approvals',
        label: 'Pending Approvals',
        path: '/approvals',
        icon: 'FileCheck',
        description: 'Administrative clearance desk for VIP passes, seva sankalpam, and devotee cancellations.',
        badge: '18',
      },
      {
        id: 'alerts',
        label: 'Operational Alerts',
        path: '/alerts',
        icon: 'AlertTriangle',
        description: 'Live incident response, crowd warnings, and campus security dispatch.',
        badge: '5',
      },
    ],
  },
  {
    id: 'devotee-services',
    title: 'DEVOTEE SERVICES',
    items: [
      {
        id: 'bookings',
        label: 'Darshan & Bookings',
        path: '/bookings',
        icon: 'CalendarCheck',
        description: 'Manage special darshan slots, VIP access passes, online booking verification, and time-slot allocations.',
        hasSubmenu: true,
      },
      {
        id: 'pooja-seva',
        label: 'Pooja, Seva & Annadanam',
        path: '/pooja-seva',
        icon: 'Flame',
        description: 'Configure sacred rituals, special pujas, archana bookings, sankalpam details, and daily Annadanam sponsorship.',
        hasSubmenu: true,
      },
      {
        id: 'devotees',
        label: 'Devotees',
        path: '/devotees',
        icon: 'Users',
        description: 'Devotee directory, patron history, recurring donors, pilgrimage records, and communication profiles.',
      },
      {
        id: 'donations',
        label: 'Donations & Sponsorships',
        path: '/donations',
        icon: 'HeartHandshake',
        description: 'Online & hundi collections, earmarked trust funds, gold/silver offerings, 80G tax receipts, and donor felicitations.',
        hasSubmenu: true,
      },
      {
        id: 'prasad-store',
        label: 'Prasad & Store',
        path: '/prasad-store',
        icon: 'ShoppingBag',
        description: 'Bhog & prasad inventory, packet distributions, religious publications, souvenirs, and temple store billing.',
      },
      {
        id: 'facilities',
        label: 'Facilities & Accommodation',
        path: '/facilities',
        icon: 'Building2',
        description: 'Yatri Niwas guest rooms, pilgrim shelters, cloakrooms, locker allotments, and sanitation facilities management.',
      },
    ],
  },
  {
    id: 'temple-operations',
    title: 'TEMPLE OPERATIONS',
    items: [
      {
        id: 'crowd-control',
        label: 'Crowd & Queue Control',
        path: '/crowd-control',
        icon: 'UsersRound',
        description: 'Real-time queue velocity tracking, bottleneck mitigation, holding area capacities, and barricade route adjustments.',
        hasSubmenu: true,
      },
      {
        id: 'gate-management',
        label: 'Gate & Ticket Management',
        path: '/gate-management',
        icon: 'QrCode',
        description: 'Turnstile access points, QR ticket scanners, security checkpoint logs, and entry/exit throughput metrics.',
      },
      {
        id: 'temple-calendar',
        label: 'Temple Calendar',
        path: '/temple-calendar',
        icon: 'CalendarDays',
        description: 'Master temple duty roster, daily shift planning, ritual timelines, festivals, and preparation tasks.',
      },
      {
        id: 'staff-management',
        label: 'Volunteer & Staff Management',
        path: '/staff-management',
        icon: 'UserCog',
        description: 'Sevadal roster, priest duties, security personnel shifts, attendance tracking, and duty sector allocations.',
      },
      {
        id: 'cctv-monitoring',
        label: 'CCTV & Premises Monitoring',
        path: '/cctv-monitoring',
        icon: 'Video',
        description: 'Live surveillance feeds across sanctum sanctorum, parikrama, Kalyansagar lake, entry gates, and periphery.',
      },
      {
        id: 'vendors',
        label: 'Vendors & Stalls',
        path: '/vendors',
        icon: 'Store',
        description: 'Flower vendors, puja samagri stalls, licensed shop permits, lease renewals, and designated perimeter zones.',
      },
      {
        id: 'parking',
        label: 'Parking Management',
        path: '/parking',
        icon: 'Car',
        description: 'Vehicle parking lots (North & West zones), parking bay occupancy, bus/coach bays, and fast-tag toll logging.',
      },
      {
        id: 'mela-management',
        label: 'Mela Management',
        path: '/mela-management',
        icon: 'Tent',
        description: 'Annual Diwali Mela operations, special disaster preparedness, emergency clinics, fire safety, and fairground infrastructure.',
        hasSubmenu: true,
      },
      {
        id: 'ritual-schedule',
        label: 'Daily Ritual Schedule',
        path: '/ritual-schedule',
        icon: 'Clock',
        description: 'Mangala Aarti, Abhishekam, Bhog timings, Sandhya Aarti, and seasonal temple darshan schedules.',
      },
    ],
  },
  {
    id: 'content-management',
    title: 'CONTENT MANAGEMENT',
    items: [
      {
        id: 'temple-information',
        label: 'Temple Information',
        path: '/temple-information',
        icon: 'Landmark',
        description: 'Historical chronicles of King Dhanya Manikya (1501 CE), architectural archives, legends of Matabari, and official public portal content.',
      },
      {
        id: 'events',
        label: 'Events & Festivals',
        path: '/events',
        icon: 'CalendarDays',
        description: 'Calendar of Navratri, Kali Puja, Diwali Mahotsav, sacred processions, and special religious observances.',
      },
      {
        id: 'announcements',
        label: 'Announcements',
        path: '/announcements',
        icon: 'Megaphone',
        description: 'Public notifications, VIP visit circulars, weather advisories, ritual timing adjustments, and press releases.',
      },
      {
        id: 'visit-guide',
        label: 'Visit Guide & Facilities Map',
        path: '/visit-guide',
        icon: 'MapPin',
        description: 'Interactive map of Matabari, Kalyansagar tortoise pond guidelines, dress code notices, and pilgrim transit guides.',
      },
    ],
  },
  {
    id: 'insights-admin',
    title: 'INSIGHTS & ADMINISTRATION',
    items: [
      {
        id: 'reports',
        label: 'Reports & Reconciliation',
        path: '/reports',
        icon: 'BarChart3',
        description: 'Financial audits, footfall trend analysis, donation reconciliation, sevas breakdown, and exportable ledgers.',
      },
      {
        id: 'grievances',
        label: 'Grievances & Feedback',
        path: '/grievances',
        icon: 'MessageSquareText',
        description: 'Devotee assistance desk, lost & found logs, facility complaint ticketing, and resolution escalations.',
      },
      {
        id: 'users',
        label: 'Users & Roles',
        path: '/users',
        icon: 'ShieldCheck',
        description: 'Role-based access control (RBAC) for Temple Trust board, Head Priest, Finance Officers, and Security Supervisors.',
      },
      {
        id: 'settings',
        label: 'Temple Settings',
        path: '/settings',
        icon: 'Settings',
        description: 'Master configurations, payment gateway keys, SMS/WhatsApp alert dispatchers, and system audit logs.',
      },
    ],
  },
];

// Helper to look up any item by path
export const ALL_NAVIGATION_ITEMS = NAVIGATION_GROUPS.flatMap((group) => group.items);

export const getNavItemByPath = (path) => {
  return ALL_NAVIGATION_ITEMS.find((item) => item.path === path) || ALL_NAVIGATION_ITEMS[0];
};

