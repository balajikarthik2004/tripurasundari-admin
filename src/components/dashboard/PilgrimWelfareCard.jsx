import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Utensils,
  Droplets,
  Lock,
  Accessibility,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function PilgrimWelfareCard() {
  // Dynamic live meals counter (Simulating active lunchtime Nitya Annadanam distribution)
  const [mealsServed, setMealsServed] = useState(4854);
  const targetMeals = 6000;

  // Live digital locker occupancy
  const [lockersInUse, setLockersInUse] = useState(412);
  const totalLockers = 600;

  useEffect(() => {
    const interval = setInterval(() => {
      // Natural meal distribution increments (+1 to +2 every 4 seconds)
      setMealsServed((prev) => (prev < 5900 ? prev + Math.floor(Math.random() * 2) + 1 : prev));

      // Locker fluctuations (+/- 1)
      setLockersInUse((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(380, Math.min(480, prev + delta));
      });
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  const mealProgress = Math.min(100, Math.round((mealsServed / targetMeals) * 100));
  const lockerPercent = Math.round((lockersInUse / totalLockers) * 100);

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle p-4 sm:p-5 flex flex-col justify-between h-full gap-3.5 sm:gap-4">
      {/* 1. Card Header */}
      <div className="flex items-center gap-2 pb-2.5 border-b border-[#E8E2D8] flex-shrink-0">
        <span className="p-1 rounded-md bg-temple-burgundy/10 text-temple-burgundy flex-shrink-0">
          <HeartHandshake className="w-4 h-4" />
        </span>
        <h3 className="font-heading text-sm font-bold text-temple-burgundy uppercase tracking-wider">
          Pilgrim Welfare
        </h3>
      </div>

      {/* 2. Top Prominent Section: Nitya Annadanam Serving Tracker */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col justify-between flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              Nitya Annadanam Seva
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            Batch 3 Active
          </span>
        </div>

        {/* Big Counter & Target */}
        <div className="flex items-baseline justify-between my-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-number font-bold text-[#55132D] tracking-tight">
              {mealsServed.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500 font-sans">
              / <span className="font-number font-medium">{targetMeals.toLocaleString()}</span> meals served
            </span>
          </div>
          <span className="text-xs font-number font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {mealProgress}% target
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden my-1">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-700"
            style={{ width: `${mealProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10.5px] text-stone-600 mt-1">
          <span>Daily Seva: 11:30 AM – 03:30 PM</span>
          <span className="font-semibold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Hygiene Grade A+
          </span>
        </div>
      </div>

      {/* 3. Amenities 4-Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 flex-1">
        {/* RO Purified Drinking Water */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-bold text-stone-800">
              <Droplets className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              RO Water
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-base sm:text-lg font-number font-bold text-stone-900">
            4 / 4 Active
          </div>
        </div>

        {/* Digital Footwear & Cloakroom Lockers */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-bold text-stone-800">
              <Lock className="w-3.5 h-3.5 text-stone-700 flex-shrink-0" />
              Free Lockers
            </span>
            <span className="text-[10px] font-bold text-stone-600 font-number">
              {lockerPercent}%
            </span>
          </div>
          <div className="text-base sm:text-lg font-number font-bold text-stone-900">
            {lockersInUse} / {totalLockers}
          </div>
        </div>

        {/* Senior & Divyangjan Assistance */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-bold text-stone-800">
              <Accessibility className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              Special Care
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-base sm:text-lg font-number font-bold text-stone-900">
            58 Assisted
          </div>
        </div>

        {/* Emergency First-Aid Post */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-bold text-stone-800 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
              First-Aid Post
            </span>
            <span className="px-1 py-0.2 rounded text-[8.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              READY
            </span>
          </div>
          <div className="text-sm sm:text-base font-bold text-stone-900 truncate leading-tight">
            Doctor On Duty
          </div>
        </div>
      </div>
    </div>
  );
}
