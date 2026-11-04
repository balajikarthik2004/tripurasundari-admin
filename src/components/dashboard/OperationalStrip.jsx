import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Building2, Car, HelpCircle } from 'lucide-react';

const OPERATIONAL_ITEMS = [
  {
    id: 'op-staff',
    label: 'Staff on Duty',
    value: '86 / 94',
    statusDot: 'bg-emerald-500',
    path: '/staff-management',
    icon: UserCheck,
  },
  {
    id: 'op-facilities',
    label: 'Facilities',
    value: '96% Ready',
    statusDot: 'bg-emerald-500',
    path: '/facilities',
    icon: Building2,
  },
  {
    id: 'op-parking',
    label: 'Parking',
    value: '68% Occupied',
    statusDot: 'bg-emerald-500',
    path: '/parking',
    icon: Car,
  },
  {
    id: 'op-grievance',
    label: 'Helpdesk',
    value: '3 Open Tickets',
    statusDot: 'bg-amber-500',
    path: '/grievances',
    icon: HelpCircle,
  },
];

export default function OperationalStrip() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle px-4 sm:px-5 py-2.5 sm:py-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E2D8]">
        {OPERATIONAL_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 p-1 rounded-xl cursor-pointer group transition-all ${
                idx > 0 ? 'sm:pl-4 lg:pl-5' : ''
              } ${idx >= 2 ? 'pt-2.5 sm:pt-1' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200/80 text-stone-700 flex items-center justify-center flex-shrink-0 group-hover:bg-[#55132D] group-hover:text-white group-hover:border-[#55132D] transition-colors shadow-2xs">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10.5px] font-semibold text-stone-500 uppercase tracking-wider leading-none">
                  {item.label}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-bold text-stone-900 text-sm sm:text-[15px] tracking-tight leading-none">
                    {item.value}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.statusDot} flex-shrink-0`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
