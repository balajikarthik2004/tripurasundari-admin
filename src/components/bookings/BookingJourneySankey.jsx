import React, { useState } from 'react';
import {
  Sun,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';

// Sacred Golden Lotus Motif Icon
function LotusIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3C10.5 7 10.5 12 12 16C13.5 12 13.5 7 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M11 8C7 7.5 4 10 5 14C8 15 11 14 11 12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M13 8C17 7.5 20 10 19 14C16 15 13 14 13 12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 15Q12 18 17 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Temple Gopuram Dome Silhouette Icon
function TempleDomeIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <path d="M16 3L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="7" r="1.5" fill="currentColor" />
      <path
        d="M16 8C12 11 11 15 10 18L22 18C21 15 20 11 16 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8 18H24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 18V26M23 18V26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M13 26V21C13 19.5 14.5 18.5 16 18.5C17.5 18.5 19 19.5 19 21V26"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M6 26H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function BookingJourneySankey({ onNavigateWithFilter }) {
  // 100% Mathematically Reconciled Dataset (Total: 3,750 Devotees)
  // Stage 1 Total: 3,750
  // Stage 2 Categories: Darshan (2,480) + Pooja & Seva (980) + Other Bookable Services (290) = 3,750
  // Stage 3 Outcomes: Completed (2,670) + Confirmed/Active (680) + Pending (290) + Cancelled (110) = 3,750
  const totalBookings = 3750;

  const categories = [
    {
      id: 'darshan',
      label: 'Darshan',
      count: 2480,
      percent: '66.1%',
      bg: 'bg-[#FFF7ED]',
      border: 'border-[#FCD5B5]',
      textColor: 'text-[#8C3220]',
      icon: <TempleDomeIcon className="w-5 h-5 text-[#B45309]" />,
      iconBg: 'bg-[#FEEAD9]',
      top: 'top-[14px]',
      flows: { completed: 1820, confirmed: 450, pending: 150, cancelled: 60 },
    },
    {
      id: 'pooja',
      label: 'Pooja & Seva',
      count: 980,
      percent: '26.1%',
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FDE68A]',
      textColor: 'text-[#92400E]',
      icon: <LotusIcon className="w-5 h-5 text-[#D97706]" />,
      iconBg: 'bg-[#FEF3C7]',
      top: 'top-[85px]',
      flows: { completed: 660, confirmed: 180, pending: 100, cancelled: 40 },
    },
    {
      id: 'other',
      label: 'Other Bookable Services',
      count: 290,
      percent: '7.8%',
      bg: 'bg-[#FAF5FF]',
      border: 'border-[#E9D5FF]',
      textColor: 'text-[#6B21A8]',
      icon: <Sparkles className="w-5 h-5 text-[#7E22CE]" />,
      iconBg: 'bg-[#F3E8FF]',
      top: 'top-[156px]',
      flows: { completed: 190, confirmed: 50, pending: 40, cancelled: 10 },
    },
  ];

  const outcomes = [
    {
      id: 'completed',
      label: 'Completed',
      count: 2670,
      percent: '71.2%',
      bg: 'bg-[#F0FDF4]',
      border: 'border-[#BBF7D0]',
      badgeColor: 'text-[#15803D]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />,
      top: 'top-[12px]',
    },
    {
      id: 'confirmed',
      label: 'Confirmed / Active',
      count: 680,
      percent: '18.1%',
      bg: 'bg-[#EFF6FF]',
      border: 'border-[#BFDBFE]',
      badgeColor: 'text-[#1D4ED8]',
      icon: <Calendar className="w-4 h-4 text-[#2563EB]" />,
      top: 'top-[66px]',
    },
    {
      id: 'pending',
      label: 'Pending',
      count: 290,
      percent: '7.7%',
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FDE68A]',
      badgeColor: 'text-[#B45309]',
      icon: <Clock className="w-4 h-4 text-[#D97706]" />,
      top: 'top-[120px]',
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: 110,
      percent: '3.0%',
      bg: 'bg-[#FFF1F2]',
      border: 'border-[#FECDD3]',
      badgeColor: 'text-[#BE123C]',
      icon: <XCircle className="w-4 h-4 text-[#E11D48]" />,
      top: 'top-[174px]',
    },
  ];

  const handleClickCategory = (catLabel) => {
    if (onNavigateWithFilter) {
      onNavigateWithFilter({ category: catLabel, status: 'All' });
    }
  };

  const handleClickOutcome = (outLabel) => {
    if (onNavigateWithFilter) {
      const statusMap = {
        Completed: 'Completed',
        'Confirmed / Active': 'Confirmed',
        Pending: 'Pending',
        Cancelled: 'Cancelled',
      };
      onNavigateWithFilter({ status: statusMap[outLabel] || outLabel, category: 'All' });
    }
  };

  return (
    <div className="bg-[#FFFDF9] rounded-2xl sm:rounded-3xl border border-[#EFE5D5] shadow-xs p-4 sm:p-5 relative overflow-hidden">
      {/* 1. Header with explicit reporting-period badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#55132D] font-serif tracking-tight leading-snug">
              Booking Journey Flow
            </h2>
            <p className="text-[11.5px] text-stone-500 font-sans">
              How devotees' bookings move through different stages <span className="text-stone-400">(All Services)</span>
            </p>
          </div>
        </div>

        {/* Distinct reporting cycle badge */}
        <div className="px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#EFE5D5] text-[#751838] text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#B45309]" />
          <span>Active Devotee Cohort: 31 Oct 2026 (3,750 Bookings)</span>
        </div>
      </div>

      {/* 2. Coordinated Canvas: EXACT 960px width with Zero-Gap flowing ribbons */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-1">
        <div className="relative w-[960px] h-[224px] mx-auto select-none">
          {/* Continuous Bézier Ribbons SVG Canvas: Touches nodes at the exact pixel */}
          <svg
            className="absolute inset-0 w-[960px] h-[224px] pointer-events-none"
            viewBox="0 0 960 224"
            fill="none"
          >
            <defs>
              {/* Stage 1 -> Stage 2 Gradients */}
              <linearGradient id="ribbonToDarshan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.5" />
                <stop offset="40%" stopColor="#D97706" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.65" />
              </linearGradient>
              <linearGradient id="ribbonToPooja" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#D97706" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="ribbonToOther" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#9333EA" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0.6" />
              </linearGradient>

              {/* Stage 2 -> Stage 3 Flow Gradients */}
              <linearGradient id="flowCompleted" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="flowConfirmed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="flowPending" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="flowCancelled" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#FB7185" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* =========================================================
                STAGE 1 -> STAGE 2 FLOW RIBBONS
                Source node ends at x=148; Category nodes start at x=284.
                Total height on Hero card = 120px (y: 52 to 172).
               ========================================================= */}
            {/* 1. Ribbon to Darshan: 2,480 bookings (66.1% -> 79px) */}
            <path
              d="M 148 52 C 216 52, 216 22, 284 22 L 284 60 C 216 60, 216 131, 148 131 Z"
              fill="url(#ribbonToDarshan)"
            />

            {/* 2. Ribbon to Pooja & Seva: 980 bookings (26.1% -> 31px) */}
            <path
              d="M 148 131 C 216 131, 216 93, 284 93 L 284 131 C 216 131, 216 162, 148 162 Z"
              fill="url(#ribbonToPooja)"
            />

            {/* 3. Ribbon to Other Services: 290 bookings (7.8% -> 10px) */}
            <path
              d="M 148 162 C 216 162, 216 166, 284 166 L 284 200 C 216 200, 216 172, 148 172 Z"
              fill="url(#ribbonToOther)"
            />

            {/* =========================================================
                STAGE 2 -> STAGE 3 FLOW RIBBONS
                Category nodes end at x=479; Outcome nodes start at x=686.
               ========================================================= */}
            {/* 1. Green Flow into Completed (x=686, y=18..48, Total: 2,670) */}
            <path
              d="M 479 20 C 572 20, 593 18, 686 18 L 686 48 C 593 48, 572 44, 479 44 Z"
              fill="url(#flowCompleted)"
            />
            {/* Branch from Pooja & Seva to Completed */}
            <path
              d="M 479 92 C 555 92, 595 36, 686 36 L 686 48 C 595 48, 555 106, 479 106 Z"
              fill="url(#flowCompleted)"
              opacity="0.85"
            />

            {/* 2. Blue Flow into Confirmed / Active (x=686, y=72..102, Total: 680) */}
            <path
              d="M 479 44 C 560 44, 595 72, 686 72 L 686 102 C 595 102, 560 120, 479 120 Z"
              fill="url(#flowConfirmed)"
            />

            {/* 3. Amber Flow into Pending (x=686, y=126..156, Total: 290) */}
            <path
              d="M 479 120 C 565 120, 595 126, 686 126 L 686 156 C 595 156, 565 174, 479 174 Z"
              fill="url(#flowPending)"
            />

            {/* 4. Rose Flow into Cancelled (x=686, y=180..210, Total: 110) */}
            <path
              d="M 479 56 C 570 70, 595 180, 686 180 L 686 210 C 595 210, 570 202, 479 202 Z"
              fill="url(#flowCancelled)"
            />
          </svg>

          {/* =========================================================
              STAGE 1: TOTAL BOOKINGS HERO BLOCK
              Fixed: left: 8px, top: 46px, width: 140px, height: 132px
             ========================================================= */}
          <div
            className="absolute left-[8px] top-[46px] w-[140px] h-[132px] rounded-2xl bg-gradient-to-br from-[#751838] via-[#55132D] to-[#3D0A1E] text-white p-3 flex flex-col items-center justify-center shadow-md border border-[#E2BC6B]/40 select-none transition-transform hover:scale-102 cursor-pointer"
            onClick={() => onNavigateWithFilter && onNavigateWithFilter({ category: 'All', status: 'All' })}
            title="Click to view all 3,750 bookings in Bookings table"
          >
            <div className="text-[#E2BC6B] mb-1">
              <TempleDomeIcon className="w-7 h-7" />
            </div>
            <div className="text-2xl font-bold font-serif tracking-tight leading-none text-white">
              {totalBookings.toLocaleString()}
            </div>
            <div className="text-[11.5px] font-sans font-medium text-[#F5EBE1] mt-1.5 opacity-90 tracking-wide">
              Total Bookings
            </div>
          </div>

          {/* =========================================================
              STAGE 2: SERVICE CATEGORIES PILLS (3 ITEMS)
              Fixed: left: 284px, width: 195px
             ========================================================= */}
          <div className="absolute left-[284px] top-0 w-[195px] h-full pointer-events-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleClickCategory(cat.label)}
                className={`absolute ${cat.top} left-0 w-full h-[54px] px-3 rounded-2xl ${cat.bg} ${cat.border} border shadow-2xs flex items-center gap-2.5 transition-all hover:scale-102 cursor-pointer text-left focus:outline-none`}
                title={`Click to filter Bookings for ${cat.label}`}
              >
                <div className={`w-8 h-8 rounded-xl ${cat.iconBg} flex items-center justify-center shrink-0 border border-black/5`}>
                  {cat.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 font-sans leading-tight">
                    {cat.label}
                  </div>
                  <div className={`text-xs font-bold ${cat.textColor} font-sans mt-0.5`}>
                    {cat.count.toLocaleString()} <span className="font-normal opacity-90">({cat.percent})</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* =========================================================
              STAGE 3: BOOKING OUTCOMES PILLS (4 ITEMS)
              Fixed: left: 686px, width: 266px
             ========================================================= */}
          <div className="absolute left-[686px] top-0 w-[266px] h-full pointer-events-auto">
            {outcomes.map((out) => (
              <button
                key={out.id}
                type="button"
                onClick={() => handleClickOutcome(out.label)}
                className={`absolute ${out.top} left-0 w-full h-[42px] px-3 rounded-2xl ${out.bg} ${out.border} border shadow-2xs flex items-center justify-between transition-all hover:scale-102 cursor-pointer text-left focus:outline-none`}
                title={`Click to filter Bookings with outcome "${out.label}"`}
              >
                <div className="flex items-center gap-2">
                  <div className="shrink-0">{out.icon}</div>
                  <span className="text-xs font-bold text-stone-900 font-sans">
                    {out.label}
                  </span>
                </div>

                <span className={`text-xs font-bold ${out.badgeColor} font-sans`}>
                  {out.count.toLocaleString()} <span className="font-semibold text-stone-500 text-[11px]">({out.percent})</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
