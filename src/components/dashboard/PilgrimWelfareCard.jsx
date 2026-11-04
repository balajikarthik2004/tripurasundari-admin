import React from 'react';
import { HeartHandshake, Droplets, ShieldCheck, Accessibility, HeartPulse, UtensilsCrossed } from 'lucide-react';
import { PILGRIM_WELFARE_DATA } from '../../data/dashboardData';
import AnimatedCounter from '../common/AnimatedCounter';

const AMENITY_ICONS = {
  water: { icon: Droplets, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100' },
  lockers: { icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  care: { icon: Accessibility, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
  medical: { icon: HeartPulse, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
};

export default function PilgrimWelfareCard() {
  const { mealsServed, mealsTarget, mealProgress, mealStatus, facilities } = PILGRIM_WELFARE_DATA;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xs p-5 flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
            Pilgrim Welfare
          </h3>
        </div>
      </div>

      {/* Annadanam Section */}
      <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-xs font-bold text-stone-800">
              Nitya Annadanam Seva
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100/80 text-amber-900 border border-amber-300/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {mealStatus}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-0.5">
          <div>
            <span className="text-xl font-bold font-number text-stone-900">
              <AnimatedCounter value={mealsServed} />
            </span>
            <span className="text-xs text-stone-500 ml-1">
              / {mealsTarget.toLocaleString()} meals
            </span>
          </div>
          <span className="text-xs font-bold font-number text-amber-800">
            <AnimatedCounter value={`${mealProgress}%`} /> target
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-700"
            style={{ width: `${mealProgress}%` }}
          />
        </div>
      </div>

      {/* Campus Facilities 2x2 Clean Micro-Tiles */}
      <div className="pt-3 border-t border-[#E8E2D8]">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
          <span>Campus Amenities Status</span>
          <span className="text-emerald-700 font-semibold lowercase">live telemetry</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {facilities.map((fac) => {
            const meta = AMENITY_ICONS[fac.id] || { icon: Droplets, color: 'text-stone-600', bg: 'bg-stone-50' };
            const Icon = meta.icon;
            return (
              <div
                key={fac.id}
                className="p-2.5 rounded-xl bg-stone-50 hover:bg-white border border-[#E8E2D8]/80 hover:border-[#55132D]/30 transition-all flex items-center gap-2.5 shadow-2xs"
              >
                <div className={`w-7 h-7 rounded-lg ${meta.bg} ${meta.color} flex items-center justify-center shrink-0 border`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-stone-400 font-semibold truncate uppercase">
                    {fac.label}
                  </div>
                  <div className="text-[11px] font-bold text-stone-800 truncate font-mono mt-0.5">
                    {fac.value}
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
