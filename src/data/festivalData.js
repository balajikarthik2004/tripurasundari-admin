/**
 * Festival and event operational schedule
 */

export const UPCOMING_FESTIVAL = {
  id: 'fest-diwali-2026',
  name: 'Diwali Mela',
  subtitle: 'Annual Traditional Mahotsav',
  dates: '10 – 12 Nov 2026',
  daysLeft: 35,
  isUnconfirmed: false,
  statusLabel: 'Annual Mahotsav',
  description: 'Preparation checklist for the annual congregation at Matabari premises and Kalyansagar banks.',
  checklist: [
    { id: 1, task: 'Security planning review', status: 'completed' },
    { id: 2, task: 'Facility readiness check', status: 'in-progress' },
    { id: 3, task: 'Volunteer allocation', status: 'pending' },
    { id: 4, task: 'Public announcements', status: 'pending' },
  ],
  managementPath: '/mela-management',
};
