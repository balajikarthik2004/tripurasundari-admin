import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  CalendarCheck,
  HandHeart,
  MessageSquareMore,
  BarChart3,
  UserCheck,
  Settings,
} from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();

  // 6 primary actions arranged in 2 columns x 3 rows with clean, prominent typography
  const actions = [
    {
      id: 'create-darshan',
      label: 'Create Darshan',
      icon: CalendarCheck,
      path: '/bookings',
      ariaLabel: 'Navigate to Darshan & Bookings Desk',
    },
    {
      id: 'record-donation',
      label: 'Record Donation',
      icon: HandHeart,
      path: '/donations',
      ariaLabel: 'Navigate to Donations & Offerings',
    },
    {
      id: 'add-grievance',
      label: 'Add Grievance',
      icon: MessageSquareMore,
      path: '/grievances',
      ariaLabel: 'Navigate to Grievances & Feedback',
    },
    {
      id: 'view-reports',
      label: 'View Reports',
      icon: BarChart3,
      path: '/reports',
      ariaLabel: 'Navigate to Reports & Reconciliation',
    },
    {
      id: 'assign-staff',
      label: 'Assign Staff',
      icon: UserCheck,
      path: '/staff-management',
      ariaLabel: 'Navigate to Staff Management & Deployment',
    },
    {
      id: 'temple-settings',
      label: 'Temple Settings',
      icon: Settings,
      path: '/temple-settings',
      ariaLabel: 'Navigate to Temple Settings & Configuration',
    },
  ];

  return (
    <div
      id="quick-actions"
      className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle p-4 sm:p-5 flex flex-col justify-between h-full gap-3"
    >
      <div className="flex-1 flex flex-col">
        {/* Header matching Recent Activity and Ritual Schedule */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E2D8] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-temple-burgundy/10 text-temple-burgundy">
              <LayoutGrid className="w-4 h-4" />
            </span>
            <h3 className="font-heading text-sm font-bold text-temple-burgundy uppercase tracking-wider">
              Quick Actions
            </h3>
          </div>
        </div>

        {/* 2 Columns x 3 Rows Grid Filling Height Naturally with larger icons and bold labels */}
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3 flex-1">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => navigate(action.path)}
                aria-label={action.ariaLabel}
                className="group flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-white border border-[#E8E2D8] hover:border-temple-burgundy/40 shadow-2xs hover:shadow-subtle transition-all duration-200 active:scale-98 cursor-pointer text-center"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white border border-[#E8E2D8] shadow-2xs flex items-center justify-center text-temple-burgundy group-hover:bg-temple-burgundy group-hover:text-white group-hover:scale-105 transition-all duration-200 mb-1.5">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-stone-800 group-hover:text-temple-burgundy leading-snug transition-colors">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
