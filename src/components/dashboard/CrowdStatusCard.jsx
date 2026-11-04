import React from 'react';
import { Users } from 'lucide-react';
import { DEVOTEE_FLOW_DATA } from '../../data/dashboardData';
import AnimatedCounter from '../common/AnimatedCounter';

export default function CrowdStatusCard() {
  const { currentInside, maxCapacity, occupancyPercent, status, entrances } = DEVOTEE_FLOW_DATA;

  // Circular gauge geometry in 200x200 viewBox: radius 58 -> circumference ≈ 364.42
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (occupancyPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full overflow-hidden">
      {/* 1. Card Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
            Devotee Flow
          </h3>
        </div>
      </div>

      {/* 2. Top Section: 2-Column CSS Grid - Gauge + Occupancy Info */}
      <div className="grid grid-cols-[160px_minmax(0,1fr)] sm:grid-cols-[165px_minmax(0,1fr)] gap-2 sm:gap-2.5 items-center py-1">
        {/* Left Column: Circular Capacity Gauge with 75% Opacity Mandala Halo */}
        <div className="relative w-[160px] h-[160px] sm:w-[165px] sm:h-[165px] shrink-0 flex items-center justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
            <defs>
              {/* Vibrant Amber-to-Saffron Capacity Arc Gradient */}
              <linearGradient id="saffronArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C3220" />
                <stop offset="25%" stopColor="#B45309" />
                <stop offset="55%" stopColor="#D97706" />
                <stop offset="85%" stopColor="#E69A1C" />
                <stop offset="100%" stopColor="#F5B82A" />
              </linearGradient>

              {/* Deep Sacred Burgundy Base Track Gradient */}
              <linearGradient id="burgundyTrackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#751838" />
                <stop offset="50%" stopColor="#5A0F2B" />
                <stop offset="100%" stopColor="#4A0B22" />
              </linearGradient>
            </defs>

            {/* LAYER 1: Temple Mandala Halo (75% Opacity - Crisp & Defined) */}
            <g id="mandala-petals" opacity="0.75">
              {Array.from({ length: 20 }).map((_, i) => (
                <g key={`petal-${i}`} transform={`rotate(${i * 18} 100 100)`}>
                  {/* Outer Petal Accolade Contour with crisp antique gold stroke */}
                  <path
                    d="M 90 35 C 87.5 25, 93 16, 100 9 C 107 16, 112.5 25, 110 35"
                    fill="#FFFDF7"
                    fillOpacity="0.4"
                    stroke="#C88728"
                    strokeWidth="1.0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Inner Delicate Filigree Arch */}
                  <path
                    d="M 93 35 C 91.5 27, 95.5 19, 100 14 C 104.5 19, 108.5 27, 107 35"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="0.8"
                    opacity="0.9"
                  />
                  {/* Base Connecting Scallop */}
                  <path d="M 90 35 Q 100 37.5 110 35" fill="none" stroke="#C88728" strokeWidth="0.85" />
                  <circle cx="90" cy="35" r="0.75" fill="#D97706" />
                </g>
              ))}
              {/* Outer Boundary Hairline Rim */}
              <circle cx="100" cy="100" r="65" stroke="#C88728" strokeWidth="1.0" fill="none" />
            </g>

            {/* LAYER 2 & 3: PROMINENT GAUGE */}
            <g transform="rotate(-90 100 100)">
              {/* Clean Deep Burgundy Base Track */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="url(#burgundyTrackGradient)"
                strokeWidth="13"
                strokeLinecap="round"
                fill="none"
              />

              {/* Bold Amber-to-Saffron Capacity Progress Arc (56%) */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="url(#saffronArcGradient)"
                strokeWidth="13"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Inner Concentric Hairline Rim */}
            <circle
              cx="100"
              cy="100"
              r="51.5"
              stroke="#D97706"
              strokeWidth="0.8"
              fill="none"
              opacity="0.4"
            />
          </svg>

          {/* LAYER 4: 56% and CAPACITY Focal Point in Clean Ivory Centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[25px] sm:text-[27px] font-bold font-number text-[#55132D] tracking-tight leading-none">
              <AnimatedCounter value={`${occupancyPercent}%`} />
            </span>
            <span className="text-[9.5px] sm:text-[10px] font-bold text-stone-500 tracking-wider uppercase mt-1">
              Capacity
            </span>
          </div>
        </div>

        {/* Right Column: Clean Occupancy Numbers & Status (No Campus Occupancy text, zero overflow) */}
        <div className="min-w-0 flex flex-col justify-center space-y-2 pl-2.5 sm:pl-3 border-l border-[#E8E2D8]">
          {/* Metric Count: Tabular numbers on single line */}
          <div>
            <div className="text-[25px] sm:text-[27px] font-bold font-number text-[#55132D] leading-none whitespace-nowrap flex items-baseline">
              <AnimatedCounter value={currentInside} />
              <span className="text-stone-400 font-normal text-[13px] sm:text-[14px] ml-1.5 tabular-nums whitespace-nowrap">
                / {maxCapacity.toLocaleString()}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-0.5">
              inside
            </div>
          </div>

          {/* Flow Status Pill: Compact single-line pill */}
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#FEF6E4] text-[#854D0E] border border-[#FDE68A] whitespace-nowrap shadow-2xs">
              {status} Flow
            </span>
          </div>
        </div>
      </div>

      {/* 3. Subtle Horizontal Divider */}
      <div className="w-full border-t border-[#E8E2D8] my-2" />

      {/* 4. Gate Telemetry Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400">
          <span>Gate Telemetry</span>
          <span>Inflow & Wait</span>
        </div>
        {entrances.map((ent) => (
          <div key={ent.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800">{ent.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-stone-600 font-mono text-[11px] tabular-nums">
                  <strong className="text-stone-900 font-semibold">{ent.current.toLocaleString()}</strong> / {ent.capacity.toLocaleString()}
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-[#854D0E] font-medium text-[10px] bg-[#FEF6E4] px-2 py-0.5 rounded-full border border-[#FDE68A] font-mono whitespace-nowrap">
                  {ent.wait}
                </span>
              </div>
            </div>
            {/* Burgundy Progress Fill with Clean Warm-Grey Track */}
            <div className="w-full h-1.5 rounded-full bg-[#EAE5DD] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#55132D] transition-all duration-500"
                style={{ width: `${ent.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
