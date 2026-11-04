import React from 'react';
import { Users } from 'lucide-react';
import { DEVOTEE_FLOW_DATA } from '../../data/dashboardData';
import AnimatedCounter from '../common/AnimatedCounter';

// Sacred Golden Lotus Motif for Donut Center
function GoldenLotus({ className = 'w-6 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 26 16" fill="none">
      {/* Center upright petal */}
      <path
        d="M 13 1 C 11.2 5.5, 11.2 10, 13 13 C 14.8 10, 14.8 5.5, 13 1 Z"
        stroke="#D97706"
        strokeWidth="1.2"
        fill="#FDE68A"
        fillOpacity="0.3"
      />
      {/* Left inner petal */}
      <path
        d="M 11.5 6 C 8 5, 4 8, 4.5 12 C 7.5 13.5, 10.5 12.5, 12 10.5"
        stroke="#D97706"
        strokeWidth="1.2"
        fill="none"
      />
      {/* Right inner petal */}
      <path
        d="M 14.5 6 C 18 5, 22 8, 21.5 12 C 18.5 13.5, 15.5 12.5, 14 10.5"
        stroke="#D97706"
        strokeWidth="1.2"
        fill="none"
      />
      {/* Base calyx curve */}
      <path
        d="M 7 13 Q 13 15.5 19 13"
        stroke="#B45309"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Golden Temple Bell (Ghanta) Icon for Campus Occupancy Telemetry
function GoldenTempleBell({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="bellGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="45%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      {/* Top hanger ring */}
      <circle cx="12" cy="3" r="1.8" stroke="#D97706" strokeWidth="1.4" fill="none" />
      {/* Bell body */}
      <path
        d="M12 5 C8.5 5, 7.2 8.5, 6.8 12.5 C 6.3 16.5, 4 17.5, 4 18.5 L 20 18.5 C 20 17.5, 17.7 16.5, 17.2 12.5 C 16.8 8.5, 15.5 5, 12 5 Z"
        fill="url(#bellGoldGrad)"
        stroke="#92400E"
        strokeWidth="1.1"
      />
      {/* Clapper */}
      <ellipse cx="12" cy="19.5" rx="1.8" ry="1.2" fill="#78350F" />
      {/* Highlight curvature */}
      <path d="M6 16.5 Q 12 15 18 16.5" stroke="#FEF3C7" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function CrowdStatusCard() {
  const { currentInside, maxCapacity, occupancyPercent, status, entrances } = DEVOTEE_FLOW_DATA;

  // Donut geometry in 140x140 viewBox: radius 41.5 -> circumference = 2 * Math.PI * 41.5 ≈ 260.75
  const radius = 41.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (occupancyPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xs p-5 flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
            Devotee Flow
          </h3>
        </div>
      </div>

      {/* Center Section: Temple Mandala Donut Chart + Telemetry Overview */}
      <div className="py-2.5 flex items-center gap-4 sm:gap-6">
        {/* Sacred Temple Mandala Donut with Outer Lotus Petals */}
        <div className="relative w-36 h-36 sm:w-[152px] sm:h-[152px] shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 140 140">
            <defs>
              {/* Golden Arc Gradient */}
              <linearGradient id="goldMandalaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Deep Maroon Track Gradient */}
              <linearGradient id="maroonTrackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6E163B" />
                <stop offset="50%" stopColor="#55132D" />
                <stop offset="100%" stopColor="#430C23" />
              </linearGradient>

              {/* Subtle Drop Shadow for 3D Feel */}
              <filter id="mandalaGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#B45309" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* A. 16 Ornate Temple Lotus Mandala Petals Halo */}
            <g filter="url(#mandalaGlow)">
              {Array.from({ length: 16 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 22.5} 70 70)`}>
                  {/* Outer pointed petal arch */}
                  <path
                    d="M 63.8 21.5 C 62 13.5, 66 6.5, 70 3 C 74 6.5, 78 13.5, 76.2 21.5"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  {/* Inner decorative petal arch */}
                  <path
                    d="M 65.5 21.5 C 64.5 16, 67.5 10, 70 7.5 C 72.5 10, 75.5 16, 74.5 21.5"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="0.85"
                    opacity="0.9"
                  />
                  {/* Little golden sacred dot */}
                  <circle cx="70" cy="12.5" r="0.9" fill="#D97706" />
                  {/* Scallop arch connecting adjacent petals */}
                  <path
                    d="M 63.8 21.5 Q 70 23.2 76.2 21.5"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="0.8"
                    opacity="0.8"
                  />
                </g>
              ))}
            </g>

            {/* B. Outer Gold Hairline Boundary Ring */}
            <circle
              cx="70"
              cy="70"
              r="47.5"
              stroke="#D97706"
              strokeWidth="1"
              fill="none"
              opacity="0.95"
            />

            {/* C. Deep Temple Maroon Full Base Track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="url(#maroonTrackGradient)"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
            />

            {/* D. Golden Active Capacity Arc (Starting from 12 o'clock, sweeping clockwise) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="url(#goldMandalaGradient)"
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />

            {/* E. Inner Gold Hairline Boundary Ring */}
            <circle
              cx="70"
              cy="70"
              r="35.5"
              stroke="#D97706"
              strokeWidth="1"
              fill="none"
              opacity="0.95"
            />
          </svg>

          {/* F. Center Reading with Sacred Golden Lotus */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[26px] sm:text-[28px] font-bold font-number text-[#55132D] leading-none drop-shadow-2xs">
              <AnimatedCounter value={`${occupancyPercent}%`} />
            </span>
            <span className="text-[11px] font-semibold text-stone-600 tracking-wide mt-0.5">
              Capacity
            </span>
            <div className="mt-1">
              <GoldenLotus />
            </div>
          </div>
        </div>

        {/* Count & Status Chip: Matching Attached Image Exactly */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <GoldenTempleBell className="w-5 h-5 shrink-0" />
            <span className="text-xs sm:text-[13px] font-bold text-stone-900 font-serif">
              Campus Occupancy
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-[28px] font-bold font-number text-[#55132D] leading-none">
              <AnimatedCounter value={currentInside} />{' '}
              <span className="text-xs sm:text-sm font-normal text-stone-400">
                / {maxCapacity.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-stone-500 font-medium mt-0.5">
              inside
            </div>
          </div>

          <div className="pt-0.5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              {status} Flow
            </span>
          </div>
        </div>
      </div>

      {/* Entrances: Clean Gate Telemetry rows */}
      <div className="pt-3 border-t border-[#E8E2D8] space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400">
          <span>Gate Telemetry</span>
          <span>Inflow & Wait</span>
        </div>
        {entrances.map((ent) => (
          <div key={ent.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800">{ent.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-stone-600 font-mono text-[11px]">
                  <strong className="text-stone-900 font-semibold">{ent.current}</strong> / {ent.capacity}
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-amber-800 font-semibold text-[11px] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60 font-mono">
                  {ent.wait}
                </span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 border border-stone-200/40 overflow-hidden">
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
