import React from 'react';
import { Users } from 'lucide-react';
import { DEVOTEE_FLOW_DATA } from '../../data/dashboardData';
import AnimatedCounter from '../common/AnimatedCounter';

export default function CrowdStatusCard() {
  const { currentInside, maxCapacity, occupancyPercent, status, entrances } = DEVOTEE_FLOW_DATA;

  // Donut geometry: radius 39 -> circumference = 2 * Math.PI * 39 = 245.04
  const radius = 39;
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

      {/* Center Section: Prominent Donut Chart + Telemetry Overview */}
      <div className="py-3 flex items-center gap-5">
        {/* Prominent Donut Ring with dual-color track and centered stats */}
        <div className="relative w-34 h-34 sm:w-[138px] sm:h-[138px] flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="amberFlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#F3EFEA"
              strokeWidth="9"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#amberFlowGradient)"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold font-number text-stone-900 leading-none">
              <AnimatedCounter value={`${occupancyPercent}%`} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-1">
              Capacity
            </span>
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
