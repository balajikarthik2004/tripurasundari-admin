import React, { useState, useEffect } from 'react';
import { UsersRound } from 'lucide-react';

export default function CrowdStatusCard() {
  // Entrance Capacities
  const westCapacity = 1200;
  const northCapacity = 800;
  const totalCapacity = westCapacity + northCapacity; // 2,000

  // Dynamic Entrance Devotee Counts (Fluctuating Dummy Data)
  const [westDevotees, setWestDevotees] = useState(748);
  const [northDevotees, setNorthDevotees] = useState(384);
  const [westRate, setWestRate] = useState(42);
  const [northRate, setNorthRate] = useState(24);

  // Controlled, realistic natural random-walk simulation every 3.5s
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate West Entrance count (+/- 2 to 4)
      setWestDevotees((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(620, Math.min(940, prev + delta));
      });

      // Fluctuate North Entrance count (+/- 1 to 3) - NOT EMPTY!
      setNorthDevotees((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(280, Math.min(520, prev + delta));
      });

      // Fluctuate arrival rates
      setWestRate((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(34, Math.min(52, prev + delta));
      });
      setNorthRate((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(18, Math.min(30, prev + delta));
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Derived Totals & Percentages
  const totalDevotees = westDevotees + northDevotees;
  const totalOccupancyPercent = Math.round((totalDevotees / totalCapacity) * 100);
  const westOccupancyPercent = Math.round((westDevotees / westCapacity) * 100);
  const northOccupancyPercent = Math.round((northDevotees / northCapacity) * 100);

  // Estimated wait times
  const westWaitMinutes = Math.max(10, Math.round(westDevotees / 28));
  const northWaitMinutes = Math.max(8, Math.round(northDevotees / 24));

  // Overall Crowd Condition
  let crowdCondition = 'Normal Flow';
  let conditionBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let donutGradientStart = '#10B981';
  let donutGradientEnd = '#059669';

  if (totalOccupancyPercent >= 75) {
    crowdCondition = 'Heavy Crowd';
    conditionBadge = 'bg-rose-50 text-rose-800 border-rose-200';
    donutGradientStart = '#F43F5E';
    donutGradientEnd = '#BE123C';
  } else if (totalOccupancyPercent >= 50) {
    crowdCondition = 'Moderate Crowd';
    conditionBadge = 'bg-amber-50 text-amber-800 border-amber-200';
    donutGradientStart = '#F59E0B';
    donutGradientEnd = '#D97706';
  }

  // West Bar color
  const westBarColor =
    westOccupancyPercent >= 75 ? 'bg-rose-500' : westOccupancyPercent >= 50 ? 'bg-amber-500' : 'bg-emerald-500';

  // North Bar color
  const northBarColor =
    northOccupancyPercent >= 75 ? 'bg-rose-500' : northOccupancyPercent >= 50 ? 'bg-teal-500' : 'bg-emerald-500';

  // SVG Circular Donut geometry
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.33
  const strokeDashoffset = circumference - (totalOccupancyPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle p-4 sm:p-5 flex flex-col justify-between h-full gap-3.5 sm:gap-4">
      {/* 1. Full Component Heading */}
      <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#E8E2D8] flex-shrink-0">
        <span className="p-1.5 rounded-lg bg-temple-burgundy/10 text-temple-burgundy flex-shrink-0">
          <UsersRound className="w-4 h-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-bold text-temple-burgundy uppercase tracking-wider">
            Devotee Flow &amp; Queue Status
          </h3>
        </div>
      </div>

      {/* 2. Donut Total Crowd Section (Expanded & Centered to fill vertical space) */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-between gap-5 flex-1">
        {/* Circular Donut Progress Ring */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="crowdDonutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={donutGradientStart} />
                <stop offset="100%" stopColor={donutGradientEnd} />
              </linearGradient>
            </defs>
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#E7E5E4"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Active Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#crowdDonutGrad)"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl sm:text-2xl font-bold font-number text-stone-900 leading-none">
              {totalOccupancyPercent}%
            </span>
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider mt-1">
              CAPACITY
            </span>
          </div>
        </div>

        {/* Devotees Count & Status Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-number font-bold text-[#55132D] tracking-tight transition-all duration-300">
              {totalDevotees.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500 font-sans">
              / <span className="font-number">{totalCapacity.toLocaleString()}</span> max
            </span>
          </div>
          <div className="text-xs sm:text-sm font-medium text-stone-700 mt-1">
            Devotees currently inside
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded text-[10.5px] font-bold border transition-colors ${conditionBadge}`}>
              {crowdCondition}
            </span>
            <span className="text-[11px] text-stone-500">
              Across 2 gates
            </span>
          </div>
        </div>
      </div>

      {/* 3. Temple Entrances – Two Active Fluctuating Bars (West & North) with generous spacing */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col justify-between flex-1 gap-3">
        <div className="flex items-center justify-between text-[10.5px] font-bold text-stone-500 uppercase tracking-wider">
          <span>Temple Entrances</span>
          <span className="text-[10px] font-medium text-stone-400 normal-case">
            Live Gateway Flow
          </span>
        </div>

        {/* West Entrance */}
        <div className="p-3 rounded-lg bg-white border border-[#E8E2D8] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="font-bold text-stone-900">West Entrance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-900 text-xs sm:text-sm">{westOccupancyPercent}%</span>
              <span className="text-[11px] text-stone-500 font-mono">
                ({westDevotees.toLocaleString()} / {westCapacity.toLocaleString()})
              </span>
            </div>
          </div>

          {/* West Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${westBarColor}`}
              style={{ width: `${Math.min(100, westOccupancyPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-600">
            <span>Arrival: ~+{westRate} devotees/min</span>
            <span>Wait: ~{westWaitMinutes} mins</span>
          </div>
        </div>

        {/* North Entrance */}
        <div className="p-3 rounded-lg bg-white border border-[#E8E2D8] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse flex-shrink-0" />
              <span className="font-bold text-stone-900">North Entrance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-900 text-xs sm:text-sm">{northOccupancyPercent}%</span>
              <span className="text-[11px] text-stone-500 font-mono">
                ({northDevotees.toLocaleString()} / {northCapacity.toLocaleString()})
              </span>
            </div>
          </div>

          {/* North Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${northBarColor}`}
              style={{ width: `${Math.min(100, northOccupancyPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-600">
            <span>Arrival: ~+{northRate} devotees/min</span>
            <span>Wait: ~{northWaitMinutes} mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
