/**
 * Core Dashboard data consolidating KPIs, notifications, and operational summaries
 */

export const SYSTEM_BADGE = {
  badge: 'TEMPLE TRUST PORTAL',
  description: 'Official Administration System for Mata Tripura Sundari Temple.',
};

export const DASHBOARD_KPIS = [
  {
    id: 'kpi-visits',
    title: "Today's Visits",
    value: '24,680',
    icon: 'Users',
    trend: '+12%',
    trendPositive: true,
    subtext: 'vs. yesterday baseline',
    path: '/gate-management',
  },
  {
    id: 'kpi-bookings',
    title: 'Service Bookings',
    value: '3,245',
    icon: 'CalendarCheck',
    trend: '+18%',
    trendPositive: true,
    subtext: '142 pending review',
    path: '/bookings',
  },
  {
    id: 'kpi-wait',
    title: 'Current Queue Wait',
    value: '26 mins',
    icon: 'Clock',
    trend: 'Normal Flow',
    trendPositive: true,
    subtext: 'West: ~26m • North: ~16m',
    path: '/crowd-control',
  },
  {
    id: 'kpi-approvals',
    title: 'Pending Approvals',
    value: '18',
    icon: 'FileCheck',
    trend: null,
    trendPositive: false,
    subtext: 'VIP passes & seva slots',
    path: '/approvals',
  },
  {
    id: 'kpi-alerts',
    title: 'Active Alerts',
    value: '5',
    icon: 'AlertTriangle',
    trend: '1 Critical',
    trendPositive: false,
    subtext: 'Zone A queue density',
    path: '/alerts',
  },
];

export const NOTIFICATIONS_LIST = [
  {
    id: 'notif-1',
    title: 'Crowd density alert at Zone A',
    time: '10 mins ago',
    unread: true,
    type: 'critical',
  },
  {
    id: 'notif-2',
    title: 'VIP Darshan pass submitted by SDM office',
    time: '24 mins ago',
    unread: true,
    type: 'warning',
  },
  {
    id: 'notif-3',
    title: 'Daily Mahaprasad preparation complete',
    time: '1 hr ago',
    unread: false,
    type: 'info',
  },
];

export const CURRENT_ADMIN_USER = {
  name: 'Admin User',
  role: 'Super Administrator',
  department: 'Mata Tripura Sundari Temple Trust',
  location: 'Matabari, Udaipur, Tripura',
  avatarInitials: 'AU',
  email: 'admin.trust@matabari.tripura.gov.in',
};

export const OPERATIONAL_STATUS_STRIP = [
  {
    id: 'op-staff',
    label: 'Staff & Volunteers',
    metric: '86 / 94 On Duty',
    status: 'Adequate Coverage',
    subtext: 'All checkpoints active',
    path: '/staff-management',
    icon: 'UserCheck',
    color: 'emerald',
  },
  {
    id: 'op-facilities',
    label: 'Facility Readiness',
    metric: '96% Operational',
    status: 'Normal Status',
    subtext: 'Yatri Niwas & water stations',
    path: '/facilities',
    icon: 'Building2',
    color: 'blue',
  },
  {
    id: 'op-parking',
    label: 'Parking Bays',
    metric: '68% (340/500)',
    status: 'Normal Inflow',
    subtext: 'North & West lots open',
    path: '/parking',
    icon: 'Car',
    color: 'amber',
  },
  {
    id: 'op-grievance',
    label: 'Devotee Helpdesk',
    metric: '3 Open Tickets',
    status: 'Avg. 18m Resolution',
    subtext: 'Locker & queue inquiries',
    path: '/grievances',
    icon: 'HelpCircle',
    color: 'purple',
  },
];
