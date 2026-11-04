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
import { QUICK_ACTIONS_DATA } from '../../data/dashboardData';

const ICON_MAP = {
  CalendarCheck,
  HandHeart,
  MessageSquareMore,
  BarChart3,
  UserCheck,
  Settings,
};

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
            Quick Actions
          </h3>
        </div>
        <span className="text-xs text-stone-400 font-medium hidden sm:inline">
          Administrative shortcuts & rapid workflows
        </span>
      </div>

      {/* 6 Spacious Action Shortcut Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {QUICK_ACTIONS_DATA.map((act) => {
          const Icon = ICON_MAP[act.icon] || CalendarCheck;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => navigate(act.path)}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-stone-50/70 hover:bg-white border border-[#E8E2D8] hover:border-[#55132D]/50 hover:shadow-sm transition-all cursor-pointer text-center group min-h-[110px]"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all shadow-2xs mb-2 shrink-0 ${act.colorTheme || 'bg-white border-[#E8E2D8] text-[#55132D]'}`}>
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-xs sm:text-[13px] font-bold text-stone-800 group-hover:text-[#55132D] transition-colors leading-tight">
                {act.label}
              </span>
              {act.subtitle && (
                <span className="text-[10px] text-stone-400 group-hover:text-stone-500 font-medium mt-0.5 leading-tight">
                  {act.subtitle}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
