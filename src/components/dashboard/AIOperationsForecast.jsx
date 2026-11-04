import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Car,
  CalendarCheck,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { AI_FORECAST_DATA } from '../../data/dashboardData';
import AnimatedCounter from '../common/AnimatedCounter';

const ICON_MAP = {
  Users,
  UserCheck,
  Car,
  CalendarCheck,
};

export default function AIOperationsForecast() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xs p-5 flex flex-col justify-between h-full min-h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 2L4.8 3.8L6.6 4.6L4.8 5.4L4 7.2L3.2 5.4L1.4 4.6L3.2 3.8L4 2Z"
                fill="#E2BC6B"
              />
              <rect x="7" y="13" width="3" height="8" rx="1" fill="currentColor" />
              <rect x="12" y="9" width="3" height="12" rx="1" fill="currentColor" />
              <rect x="17" y="5" width="3" height="16" rx="1" fill="currentColor" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
              AI Insights & Forecast
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Shield className="w-3 h-3 text-amber-700" />
              <span>94% confidence</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>Next 4–8 hrs</span>
        </div>
      </div>

      {/* 2 Column x 2 Row Grid: Clean, Spacious & Uncongested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3 flex-1">
        {AI_FORECAST_DATA.map((item) => {
          const IconComponent = ICON_MAP[item.icon] || Users;
          return (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className="p-4 rounded-xl bg-stone-50/70 hover:bg-white border border-stone-200/80 hover:border-[#55132D]/40 transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                  <IconComponent className={`w-4 h-4 ${item.iconColor}`} />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-stone-800 group-hover:text-[#55132D] transition-colors whitespace-nowrap">
                  {item.title}
                </span>
              </div>

              <div className="my-2.5">
                <div className="text-2xl sm:text-[26px] font-bold font-number text-[#55132D] tracking-tight leading-none">
                  <AnimatedCounter value={item.value} />
                </div>
                <div className="text-xs text-stone-500 mt-1.5 leading-snug">
                  {item.caption}
                </div>
              </div>

              <div className={`h-1 w-full rounded-full ${item.accentColor}`} />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-xs flex-shrink-0">
        <span className="text-[11px] text-stone-400">
          Refreshed automatically via queue & sensor telemetry
        </span>
        <button
          type="button"
          onClick={() => navigate('/crowd-control')}
          className="font-bold text-[#55132D] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View full forecast</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
