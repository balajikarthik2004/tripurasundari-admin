import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Car,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';

const FORECAST_CARDS = [
  {
    title: 'Crowd Forecast',
    icon: Users,
    value: '4,450 Devotees',
    supporting: 'Peak at 6:30 PM Aarti • Current: 2,655',
    path: '/crowd-control',
  },
  {
    title: 'Staff Requirement',
    icon: UserCheck,
    value: '+14 Volunteers',
    supporting: '47 on duty • Projected need: 61',
    path: '/staff-management',
  },
  {
    title: 'Parking Demand',
    icon: Car,
    value: '94% Occupancy',
    supporting: 'Current: 64% • ~78 vehicles / hr',
    path: '/parking',
  },
  {
    title: 'Darshan Bookings',
    icon: CalendarCheck,
    value: '+34% Demand',
    supporting: 'Evening VIP & Aarti at 92% capacity',
    path: '/bookings',
  },
];

export default function AIOperationsForecast() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle p-4 sm:p-5 flex flex-col gap-3.5">
      {/* Section Header */}
      <div className="pb-2.5 border-b border-[#E8E2D8]">
        <h2 className="font-heading text-sm sm:text-base font-bold text-temple-burgundy tracking-wide uppercase">
          AI Operations Forecast
        </h2>
      </div>

      {/* Four Equal-Width Minimal Prediction Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 items-stretch">
        {FORECAST_CARDS.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              className="bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] p-3.5 sm:p-4 flex flex-col justify-between hover:bg-white hover:border-temple-burgundy/40 hover:shadow-card transition-all duration-200 cursor-pointer group min-h-[118px]"
            >
              {/* Header: Icon & Category Title */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E8E2D8] text-stone-700 flex items-center justify-center group-hover:bg-temple-burgundy group-hover:text-white group-hover:border-temple-burgundy transition-colors flex-shrink-0 shadow-2xs">
                  <IconComponent className="w-4 h-4 text-current" />
                </div>
                <h3 className="font-heading text-xs font-bold text-stone-600 uppercase tracking-wider group-hover:text-temple-burgundy transition-colors truncate">
                  {item.title}
                </h3>
              </div>

              {/* Main Prediction Value */}
              <div className="my-1.5">
                <div className="text-xl sm:text-2xl font-number font-bold text-temple-burgundy tracking-tight leading-tight">
                  {item.value}
                </div>
              </div>

              {/* Supporting Telemetry & Hover Arrow Indicator */}
              <div className="pt-2 border-t border-[#E8E2D8]/70 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                <span className="truncate">{item.supporting}</span>
                <ArrowRight className="w-3.5 h-3.5 text-temple-burgundy opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
