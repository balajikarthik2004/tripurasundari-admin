import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Clock,
  FileCheck,
} from 'lucide-react';
import AnimatedCounter from '../common/AnimatedCounter';

const ICON_MAP = {
  Users,
  CalendarCheck,
  Clock,
  FileCheck,
};

export default function DashboardKpiCard({ kpi }) {
  const navigate = useNavigate();
  const {
    title,
    value,
    icon,
    trend,
    trendPositive,
    subtext,
    path,
  } = kpi;
  const IconComponent = ICON_MAP[icon] || Users;

  return (
    <div
      onClick={() => navigate(path)}
      className="bg-white rounded-2xl border border-[#E8E2D8] border-b-4 border-b-[#55132D] shadow-xs p-5 flex flex-col justify-between hover:border-[#55132D]/40 hover:border-b-[#55132D] hover:shadow-sm transition-all cursor-pointer group min-h-[148px]"
    >
      {/* Top Header: Title & Icon */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold text-stone-500 group-hover:text-stone-800 transition-colors uppercase tracking-wider">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] group-hover:bg-[#55132D] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      {/* Metric Value */}
      <div className="my-2">
        <div className="text-[28px] sm:text-[30px] font-bold font-number text-stone-900 tracking-tight leading-none group-hover:text-[#55132D] transition-colors">
          <AnimatedCounter value={value} />
        </div>
      </div>

      {/* Clean, Simple Trend Line */}
      <div className="pt-2 border-t border-[#E8E2D8]/60 flex items-center text-xs">
        <span className={trendPositive ? 'font-medium text-emerald-700' : 'font-medium text-stone-500'}>
          {trend}
        </span>
      </div>
    </div>
  );
}
