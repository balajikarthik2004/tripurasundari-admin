/**
 * Operational Alerts data
 */

export const INITIAL_ALERTS = [
  {
    id: 'alt-01',
    severity: 'Critical',
    title: 'High crowd density at Zone A (Main Entrance)',
    description: 'Holding line approaching 72% capacity. Consider deploying 4 standby sevadal volunteers.',
    time: '10:25 AM',
    category: 'Crowd Control',
    actionText: 'Review Queue',
    actionPath: '/crowd-control',
  },
  {
    id: 'alt-02',
    severity: 'Warning',
    title: 'VIP Darshan Pass approval pending',
    description: 'Protocol clearance requested for 6 delegates visiting at 02:30 PM.',
    time: '10:14 AM',
    category: 'Bookings',
    actionText: 'Approve Pass',
    actionPath: '/bookings',
  },
  {
    id: 'alt-03',
    severity: 'Warning',
    title: 'Kalyansagar Ghat railing maintenance requested',
    description: 'Inspection team flagged wet pavement and caution barrier on eastern steps.',
    time: '09:48 AM',
    category: 'Facilities',
    actionText: 'Inspect Log',
    actionPath: '/facilities',
  },
  {
    id: 'alt-04',
    severity: 'Information',
    title: 'Evening Sevadal shift roster assignment open',
    description: '14 out of 18 volunteer spots confirmed for evening Sandhya Aarti crowd management.',
    time: '09:15 AM',
    category: 'Staffing',
    actionText: 'View Roster',
    actionPath: '/staff-management',
  },
  {
    id: 'alt-05',
    severity: 'Information',
    title: 'New devotee feedback recorded at Helpdesk',
    description: 'Request for additional footwear rack near Gate 2 enclosure.',
    time: '08:50 AM',
    category: 'Grievances',
    actionText: 'Open Ticket',
    actionPath: '/grievances',
  },
];

