import React, { useState } from 'react';
import {
  Sun,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  XCircle,
  Landmark,
} from 'lucide-react';

// Sacred Golden Lotus Motif for card icons
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
      {/* Top Kalash Kalasa spire */}
      <path d="M16 3L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="7" r="1.5" fill="currentColor" />
      {/* Main Dome Tier */}
      <path
        d="M16 8C12 11 11 15 10 18L22 18C21 15 20 11 16 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Middle Base Band */}
      <path d="M8 18H24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* Sanctum Base Pillars & Entrance Arch */}
      <path d="M9 18V26M23 18V26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M13 26V21C13 19.5 14.5 18.5 16 18.5C17.5 18.5 19 19.5 19 21V26"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {/* Pedestal plinth */}
      <path d="M6 26H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function BookingJourneySankey({ onNavigateWithFilter }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  // Exact figures from the approved reference design
  const totalBookings = 3750;

  const categories = [
    {
      id: 'darshan',
      label: 'Darshan',
      count: 2480,
      percent: '66%',
      bg: 'bg-[#FFF7ED]',
      border: 'border-[#FCD5B5]',
      textColor: 'text-[#8C3220]',
      icon: <TempleDomeIcon className="w-5 h-5 text-[#B45309]" />,
      iconBg: 'bg-[#FEEAD9]',
    },
    {
      id: 'pooja',
      label: 'Pooja & Seva',
      count: 885,
      percent: '24%',
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FDE68A]',
      textColor: 'text-[#92400E]',
      icon: <LotusIcon className="w-5 h-5 text-[#D97706]" />,
      iconBg: 'bg-[#FEF3C7]',
    },
    {
      id: 'rituals',
      label: 'Ritual Services',
      count: 385,
      percent: '10%',
      bg: 'bg-[#FAF5FF]',
      border: 'border-[#E9D5FF]',
      textColor: 'text-[#6B21A8]',
      icon: <Flame className="w-5 h-5 text-[#7E22CE]" />,
      iconBg: 'bg-[#F3E8FF]',
    },
  ];

  const outcomes = [
    {
      id: 'completed',
      label: 'Completed',
      count: 2680,
      percent: '71%',
      bg: 'bg-[#F0FDF4]',
      border: 'border-[#BBF7D0]',
      badgeColor: 'text-[#15803D]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />,
    },
    {
      id: 'confirmed',
      label: 'Confirmed / Active',
      count: 680,
      percent: '18%',
      bg: 'bg-[#EFF6FF]',
      border: 'border-[#BFDBFE]',
      badgeColor: 'text-[#1D4ED8]',
      icon: <Calendar className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      id: 'pending',
      label: 'Pending',
      count: 290,
      percent: '8%',
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FDE68A]',
      badgeColor: 'text-[#B45309]',
      icon: <Clock className="w-5 h-5 text-[#D97706]" />,
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: 110,
      percent: '3%',
      bg: 'bg-[#FFF1F2]',
      border: 'border-[#FECDD3]',
      badgeColor: 'text-[#BE123C]',
      icon: <XCircle className="w-5 h-5 text-[#E11D48]" />,
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
    <div className="bg-[#FFFDF9] rounded-2xl sm:rounded-3xl border border-[#EFE5D5] shadow-xs p-4 sm:p-6 relative overflow-hidden">
      {/* 1. Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] shrink-0">
          <Sun className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#55132D] font-serif tracking-tight leading-snug">
            Booking Journey Flow
          </h2>
          <p className="text-xs text-stone-500 font-sans">
            How devotees' bookings move through different stages <span className="text-stone-400">(All Services)</span>
          </p>
        </div>
      </div>

      {/* 2. Main Visual Canvas */}
      <div className="relative min-h-[260px] w-full flex items-center overflow-x-auto custom-scrollbar py-2">
        {/* Full Interactive SVG Canvas with Exact Flowing Ribbons */}
        <div className="relative w-full min-w-[920px] h-[250px]">
          {/* BACKGROUND FLOWING RIBBONS SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 940 250"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Left to Middle Ribbons */}
              <linearGradient id="ribbonToDarshan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8C3220" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#FB923C" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="ribbonToPooja" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B45309" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="ribbonToRituals" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6B21A8" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.42" />
              </linearGradient>

              {/* Middle to Right Ribbons */}
              <linearGradient id="flowToCompleted" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="flowToConfirmed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#60A5FA" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="flowToPending" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="flowToCancelled" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#F43F5E" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0.45" />
              </linearGradient>
            </defs>

            {/* =========================================================
                RIBON BATCH 1: Left Node (x=160) to Middle Pills (x=270)
               ========================================================= */}
            {/* Top Ribbon -> Darshan (h=22) */}
            <path
              d="M 160 90 C 210 90, 220 38, 270 38 L 270 56 C 220 56, 210 108, 160 108 Z"
              fill="url(#ribbonToDarshan)"
            />

            {/* Mid Ribbon -> Pooja & Seva (h=16) */}
            <path
              d="M 160 114 C 210 114, 220 120, 270 120 L 270 134 C 220 134, 210 128, 160 128 Z"
              fill="url(#ribbonToPooja)"
            />

            {/* Bottom Ribbon -> Ritual Services (h=14) */}
            <path
              d="M 160 132 C 210 132, 220 200, 270 200 L 270 212 C 220 212, 210 144, 160 144 Z"
              fill="url(#ribbonToRituals)"
            />

            {/* =========================================================
                RIBON BATCH 2: Middle Pills (x=430) to Right Pills (x=630)
               ========================================================= */}
            {/* 1. Green Ribbon flowing into Completed */}
            <path
              d="M 430 38 C 520 38, 540 28, 630 28 L 630 44 C 540 44, 520 54, 430 54 Z"
              fill="url(#flowToCompleted)"
            />

            {/* 2. Blue Ribbon flowing into Confirmed / Active */}
            <path
              d="M 430 112 C 510 112, 540 92, 630 92 L 630 106 C 540 106, 510 124, 430 124 Z"
              fill="url(#flowToConfirmed)"
            />

            {/* 3. Amber Ribbon flowing into Pending */}
            <path
              d="M 430 132 C 510 132, 550 156, 630 156 L 630 168 C 550 168, 510 142, 430 142 Z"
              fill="url(#flowToPending)"
            />

            {/* 4. Soft Rose Ribbon flowing down into Cancelled */}
            <path
              d="M 430 48 C 520 70, 530 215, 630 215 L 630 228 C 530 228, 520 86, 430 64 Z"
              fill="url(#flowToCancelled)"
            />
          </svg>

          {/* HTML OVERLAY PILL CONTAINERS (Exact Coordinates & Layout) */}
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
            {/* =========================================================
                COLUMN 1: TOTAL BOOKINGS HERO BLOCK
               ========================================================= */}
            <div className="pointer-events-auto shrink-0 w-[150px] sm:w-[160px] h-[135px] sm:h-[145px] rounded-2xl bg-gradient-to-br from-[#751838] via-[#55132D] to-[#3D0A1E] text-white p-3.5 flex flex-col items-center justify-center shadow-lg border border-[#E2BC6B]/30 select-none">
              <div className="text-[#E2BC6B] mb-1">
                <TempleDomeIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-serif tracking-tight leading-none text-white">
                {totalBookings.toLocaleString()}
              </div>
              <div className="text-xs font-sans font-medium text-[#F5EBE1] mt-1.5 opacity-90 tracking-wide">
                Total Bookings
              </div>
            </div>

            {/* =========================================================
                COLUMN 2: SERVICE CATEGORIES PILLS (3 ITEMS)
               ========================================================= */}
            <div className="pointer-events-auto flex flex-col justify-between h-[235px] w-[180px] sm:w-[195px] shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleClickCategory(cat.label)}
                  className={`w-full py-2.5 px-3 rounded-2xl ${cat.bg} ${cat.border} border shadow-2xs flex items-center gap-2.5 transition-transform hover:scale-[1.02] cursor-pointer text-left focus:outline-none`}
                  title={`Filter bookings for ${cat.label}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl ${cat.iconBg} flex items-center justify-center shrink-0 border border-black/5`}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 font-sans leading-tight">
                      {cat.label}
                    </div>
                    <div className={`text-xs font-bold ${cat.textColor} font-sans mt-0.5`}>
                      {cat.count.toLocaleString()} ({cat.percent})
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* =========================================================
                COLUMN 3: BOOKING OUTCOMES PILLS (4 ITEMS)
               ========================================================= */}
            <div className="pointer-events-auto flex flex-col justify-between h-[245px] w-[270px] sm:w-[300px] shrink-0">
              {outcomes.map((out) => (
                <button
                  key={out.id}
                  type="button"
                  onClick={() => handleClickOutcome(out.label)}
                  className={`w-full py-2 px-3.5 rounded-2xl ${out.bg} ${out.border} border shadow-2xs flex items-center justify-between transition-transform hover:scale-[1.01] cursor-pointer text-left focus:outline-none`}
                  title={`Filter bookings by status "${out.label}"`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="shrink-0">{out.icon}</div>
                    <span className="text-xs font-bold text-stone-900 font-sans">
                      {out.label}
                    </span>
                  </div>

                  <span className={`text-xs sm:text-sm font-bold ${out.badgeColor} font-sans`}>
                    {out.count.toLocaleString()} ({out.percent})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
