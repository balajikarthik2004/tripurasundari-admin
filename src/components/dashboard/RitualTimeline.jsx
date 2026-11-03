import React from 'react';
import { CalendarClock, Flame } from 'lucide-react';
import { DAILY_RITUALS } from '../../data/ritualData';

export default function RitualTimeline() {
  // 5 primary daily rituals for clean spacing and larger, readable typography
  const rituals = DAILY_RITUALS.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle p-4 sm:p-5 flex flex-col justify-between h-full gap-3">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 pb-2.5 border-b border-[#E8E2D8] flex-shrink-0">
          <span className="p-1 rounded-md bg-temple-burgundy/10 text-temple-burgundy">
            <CalendarClock className="w-4 h-4" />
          </span>
          <h3 className="font-heading text-sm font-bold text-temple-burgundy uppercase tracking-wider">
            Today&apos;s Ritual Schedule
          </h3>
        </div>

        {/* Vertical Timeline with larger, clean typography */}
        <div className="mt-3 relative pl-4 flex-1 flex flex-col justify-between gap-2.5 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E2D8]">
          {rituals.map((ritual) => {
            const isCompleted = ritual.status === 'Completed';
            const isInProgress = ritual.status === 'In Progress';

            return (
              <div key={ritual.id} className="relative">
                {/* Timeline node */}
                <span
                  className={`absolute -left-4 top-3.5 w-2.5 h-2.5 rounded-full border transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-200'
                      : isInProgress
                      ? 'bg-[#E2BC6B] border-[#55132D] ring-2 ring-[#E2BC6B]/40 animate-pulse'
                      : 'bg-white border-slate-300'
                  }`}
                />

                <div
                  className={`p-2.5 sm:p-3 px-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isInProgress
                      ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                      : 'bg-[#FAF8F5] border-[#EFEBE4]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs sm:text-[13px] font-mono font-bold text-temple-burgundy flex-shrink-0">
                      {ritual.time}
                    </span>
                    <span className="text-xs sm:text-[13.5px] font-bold text-stone-900 truncate">
                      {ritual.name}
                    </span>
                  </div>

                  <div className="flex-shrink-0">
                    {isInProgress ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] sm:text-xs font-bold bg-[#55132D] text-white">
                        <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>Active</span>
                      </span>
                    ) : isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-md text-[10.5px] sm:text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Done
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md text-[10.5px] sm:text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
