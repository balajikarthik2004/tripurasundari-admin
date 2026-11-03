import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, ArrowRight, Flame } from 'lucide-react';
import { UPCOMING_FESTIVAL } from '../../data/festivalData';

export default function FestivalOverview() {
  const navigate = useNavigate();
  const { name, dates, daysLeft, checklist, managementPath } = UPCOMING_FESTIVAL;

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle p-3.5 sm:p-4 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="p-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700">
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
          </span>
          <div>
            <div className="text-[10px] font-bold text-temple-text-muted uppercase tracking-wider">
              Upcoming Festival
            </div>
            <h3 className="font-heading text-sm font-bold text-temple-burgundy leading-tight">
              {name}
            </h3>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex-shrink-0">
          {daysLeft} Days Left
        </span>
      </div>

      {/* Date & Note */}
      <div className="flex items-center justify-between text-[11px] text-temple-text-secondary mt-1">
        <span className="font-medium text-temple-text-primary flex items-center gap-1">
          <Calendar className="w-3 h-3 text-temple-gold" />
          {dates}
        </span>
        <span className="text-[9px] text-amber-800 font-medium">
          Annual Mahotsav
        </span>
      </div>

      {/* Compact Checklist (2x2 grid for clean vertical budget) */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 my-2 pt-2 border-t border-[#E8E2D8]/60 text-[11px]">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-1.5 truncate">
            {item.status === 'completed' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            ) : item.status === 'in-progress' ? (
              <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0" />
            )}
            <span className="truncate text-temple-text-secondary text-[10.5px]">
              {item.task}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Navigation Link */}
      <div className="pt-2 border-t border-[#E8E2D8]/60 flex items-center justify-between text-xs">
        <span className="text-[10px] text-temple-text-muted">
          Fairground Readiness Desk
        </span>
        <button
          type="button"
          onClick={() => navigate(managementPath)}
          className="text-xs font-semibold text-temple-burgundy hover:text-temple-maroon flex items-center gap-1 group"
        >
          <span>Mela Portal</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
