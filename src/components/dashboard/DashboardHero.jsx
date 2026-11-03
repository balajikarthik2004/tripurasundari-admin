import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import { UPCOMING_FESTIVAL } from '../../data/festivalData';

export default function DashboardHero() {
  const navigate = useNavigate();
  const { name, dates, daysLeft, managementPath } = UPCOMING_FESTIVAL;

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle px-5 py-3 sm:py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 relative overflow-hidden">
      {/* Left: Clean Greeting */}
      <div className="min-w-0">
        <h2 className="font-heading text-lg sm:text-xl font-bold text-[#55132D] tracking-tight leading-none">
          Good Morning, Admin
        </h2>
      </div>

      {/* Right: Upcoming Festival Notice */}
      <div
        onClick={() => navigate(managementPath)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] hover:border-[#55132D]/30 transition-all cursor-pointer group flex-shrink-0 self-start md:self-auto"
      >
        <span className="p-1 rounded-md bg-amber-50 text-amber-700 flex-shrink-0">
          <Flame className="w-3.5 h-3.5 fill-amber-500" />
        </span>
        <div className="text-xs">
          <span className="font-bold text-[#55132D]">{name}</span>
          <span className="text-stone-500 ml-1.5 font-medium">({dates})</span>
        </div>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 ml-1">
          {daysLeft}d left
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#55132D] group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}
