import React from 'react';
import { Users } from 'lucide-react';
import { DEVOTEE_FLOW_DATA } from '../../data/dashboardData';
import AnimatedCounter from '../common/AnimatedCounter';

export default function CrowdStatusCard() {
  const { currentInside, maxCapacity, occupancyPercent, status, entrances } = DEVOTEE_FLOW_DATA;

  // Donut geometry: radius 38 -> circumference = 2 * Math.PI * 38 = 238.76
  const radius = 38;
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

      {/* Center Section: 3D Embossed Donut Chart + Telemetry Overview */}
      <div className="py-3 flex items-center gap-5">
        {/* 3D Realistic Donut Ring with Beveled Extrusion and Drop Shadow */}
        <div className="relative w-34 h-34 sm:w-[138px] sm:h-[138px] flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 100 100">
            <defs>
              {/* 3D Volumetric Amber Lighting Gradient */}
              <linearGradient id="amber3dGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="20%" stopColor="#F59E0B" />
                <stop offset="65%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>

              {/* Specular Edge Light Reflection */}
              <linearGradient id="specularHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              {/* 3D Arc Realistic Drop Shadow */}
              <filter id="donut3dDrop" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#78350F" floodOpacity="0.35" />
              </filter>

              {/* Recessed Track Shadow */}
              <filter id="recessedTrack" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#78716C" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* 1. Recessed Channel Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#E8E2D8"
              strokeWidth="9.5"
              fill="transparent"
              filter="url(#recessedTrack)"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#F7F4EE"
              strokeWidth="8"
              fill="transparent"
            />

            {/* 2. 3D Under-Extrusion Layer (Cylinder Depth) */}
            <circle
              cx="50"
              cy="52"
              r={radius}
              stroke="#78350F"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              opacity="0.3"
            />

            {/* 3. Primary 3D Embossed Arc with Lighting */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#amber3dGradient)"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              filter="url(#donut3dDrop)"
            />

            {/* 4. Fine Specular Highlight Ridge */}
            <circle
              cx="50"
              cy="50"
              r={radius + 1.8}
              stroke="url(#specularHighlight)"
              strokeWidth="1.2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              opacity="0.5"
            />
          </svg>

          {/* 3D Elevated Embossed Center Disc */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-b from-white via-[#FCFBF9] to-[#F5F2EA] shadow-[inset_0_1px_2px_rgba(255,255,255,1),_0_2px_5px_rgba(0,0,0,0.06),_0_1px_2px_rgba(0,0,0,0.04)] border border-[#E8E2D8]/80 flex flex-col items-center justify-center">
              <span className="text-[25px] font-bold font-number text-stone-900 leading-none">
                <AnimatedCounter value={`${occupancyPercent}%`} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-1">
                Capacity
              </span>
            </div>
          </div>
        </div>

        {/* Count & Status Chip: Balanced, un-congested layout */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="text-xs font-semibold text-stone-500">
            Campus Occupancy
          </div>
          <div className="text-2xl font-bold font-number text-stone-900 leading-none">
            <AnimatedCounter value={currentInside} />{' '}
            <span className="text-xs font-normal text-stone-400">/ {maxCapacity.toLocaleString()} inside</span>
          </div>
          <div className="pt-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
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
