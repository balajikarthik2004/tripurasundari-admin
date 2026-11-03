import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Coins,
  FileCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP = {
  Users,
  CalendarCheck,
  Coins,
  FileCheck,
  AlertTriangle,
  Clock,
};

export default function DashboardKpiCard({ kpi }) {
  const navigate = useNavigate();
  const { title, value, icon, trend, trendPositive, subtext, path } = kpi;
  const IconComponent = ICON_MAP[icon] || Users;

  const handleClick = () => {
    if (path.startsWith('#')) {
      const el = document.getElementById(path.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle p-3.5 sm:p-4 flex flex-col justify-between hover:border-[#55132D]/40 hover:shadow-card transition-all duration-200 cursor-pointer group min-h-[110px]"
    >
      {/* Top Header: Icon & Trend Pill */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center group-hover:bg-[#55132D] group-hover:text-white group-hover:border-[#55132D] transition-colors flex-shrink-0 shadow-2xs">
          <IconComponent className="w-4 h-4 text-current" />
        </div>

        {trend && (
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              trendPositive
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            {trendPositive && <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />}
            <span>{trend}</span>
          </span>
        )}
      </div>

      {/* Title & Prominent Value */}
      <div className="my-0.5">
        <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
          {title}
        </div>
        <div className="text-xl sm:text-2xl font-number font-bold text-stone-900 tracking-tight leading-tight mt-0.5">
          {value}
        </div>
      </div>

      {/* Subtext and hover indicator */}
      <div className="pt-1.5 border-t border-[#E8E2D8]/60 flex items-center justify-between text-[10.5px] text-stone-500">
        <span className="truncate">{subtext}</span>
        <ArrowRight className="w-3 h-3 text-[#55132D] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </div>
    </div>
  );
}
