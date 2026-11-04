import React from 'react';
import { CalendarClock } from 'lucide-react';
import { DASHBOARD_RITUALS } from '../../data/dashboardData';

export default function RitualTimeline() {
  return (
    <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-xs p-5 flex flex-col justify-between h-full min-h-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8] flex-shrink-0">
        <h3 className="text-sm font-semibold text-stone-900">
          Today&apos;s rituals
        </h3>
        <div className="w-9 h-9 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center flex-shrink-0">
          <CalendarClock className="w-5 h-5" />
        </div>
      </div>

      {/* Rituals List with Left Timeline Track Line (Completed -> Active -> Upcoming) */}
      <div className="my-2 relative pl-5 space-y-2.5 overflow-y-auto flex-1 before:absolute before:left-[7px] before:top-4 before:bottom-4 before:w-[2px] before:bg-[#E8E2D8]">
        {DASHBOARD_RITUALS.map((ritual) => {
          const isCompleted = ritual.status === 'Completed';
          const isActive = ritual.status === 'Active';

          return (
            <div key={ritual.id} className="relative">
              {/* Timeline Track Node */}
              <span
                className={`absolute -left-5 top-1/2 -translate-y-1/2 rounded-full border-2 transition-all z-10 ${
                  isActive
                    ? 'w-3.5 h-3.5 -ml-[3px] bg-amber-500 border-white ring-4 ring-amber-300/80 animate-pulse'
                    : isCompleted
                    ? 'w-3 h-3 -ml-[2px] bg-emerald-500 border-white ring-2 ring-emerald-200'
                    : 'w-3 h-3 -ml-[2px] bg-white border-stone-300'
                }`}
              />

              <div
                className={`px-3 py-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs transition-colors ${
                  isActive
                    ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                    : 'bg-[#FAF8F5] border-[#E8E2D8]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono font-medium text-stone-500 shrink-0 text-[11px]">
                    {ritual.time}
                  </span>
                  <span className="font-semibold text-stone-900 truncate">
                    {ritual.name}
                  </span>
                </div>

                {/* Status Chip (Standardized pill) */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#55132D] text-white shadow-2xs'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                  {ritual.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
