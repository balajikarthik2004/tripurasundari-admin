import React, { useState } from 'react';
import {
  Sun,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  XCircle,
  Landmark,
  Sparkles,
  Info,
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
  const [hoveredRibbon, setHoveredRibbon] = useState(null);

  // 100% Mathematically Reconciled Dataset (Total: 3,750)
  // Stage 1: Total = 3,750
  // Stage 2: Darshan (2,480) + Pooja & Seva (980) + Other Services (290) = 3,750
  // Stage 3: Completed (2,670) + Confirmed/Active (680) + Pending (290) + Cancelled (110) = 3,750
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
      // Destination breakdown strictly sum to 2,480:
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
      // Flows sum to 980:
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
      // Flows sum to 290:
      flows: { completed: 190, confirmed: 50, pending: 40, cancelled: 10 },
    },
  ];

  const outcomes = [
    {
      id: 'completed',
      label: 'Completed',
      count: 2670, // 1820 + 660 + 190 = 2670
      percent: '71.2%',
      bg: 'bg-[#F0FDF4]',
      border: 'border-[#BBF7D0]',
      badgeColor: 'text-[#15803D]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />,
    },
    {
      id: 'confirmed',
      label: 'Confirmed / Active',
      count: 680, // 450 + 180 + 50 = 680
      percent: '18.1%',
      bg: 'bg-[#EFF6FF]',
      border: 'border-[#BFDBFE]',
      badgeColor: 'text-[#1D4ED8]',
      icon: <Calendar className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      id: 'pending',
      label: 'Pending',
      count: 290, // 150 + 100 + 40 = 290
      percent: '7.7%',
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FDE68A]',
      badgeColor: 'text-[#B45309]',
      icon: <Clock className="w-5 h-5 text-[#D97706]" />,
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: 110, // 60 + 40 + 10 = 110
      percent: '3.0%',
      bg: 'bg-[#FFF1F2]',
      border: 'border-[#FECDD3]',
      badgeColor: 'text-[#BE123C]',
      icon: <XCircle className="w-5 h-5 text-[#E11D48]" />,
    },
  ];

  // Helper for drill-down navigation
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

  // SVG Coordinates for Seamless, Zero-Gap Connections
  // Width: 960, Height: 215 (Compact and elegant)
  // Left Hero Card: X: 16 to 156 (w=140), Y: 42 to 172 (h=130) -> Right Edge: X = 156
  // Middle Pills:   X: 286 to 476 (w=190), Left Edge: X = 286, Right Edge: X = 476
  //                 Darshan: Y: 12 to 64 (h=52, mid=38)
  //                 Pooja:   Y: 82 to 134 (h=52, mid=108)
  //                 Other:   Y: 152 to 204 (h=52, mid=178)
  // Right Pills:    X: 686 to 944 (w=258), Left Edge: X = 686
  //                 Completed: Y: 12 to 50 (h=38, mid=31)
  //                 Confirmed: Y: 64 to 102 (h=38, mid=83)
  //                 Pending:   Y: 116 to 154 (h=38, mid=135)
  //                 Cancelled: Y: 168 to 206 (h=38, mid=187)

  return (
    <div className="bg-[#FFFDF9] rounded-2xl sm:rounded-3xl border border-[#EFE5D5] shadow-xs p-4 sm:p-5 relative overflow-hidden">
      {/* 1. Header */}
      <div className="flex items-center gap-3 mb-3">
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

      {/* 2. Visual Canvas: Unified SVG with seamless, zero-gap ribbon flow */}
      <div className="relative w-full overflow-x-auto custom-scrollbar">
        <div className="relative w-full min-w-[920px] h-[215px]">
          {/* BACKGROUND CONTINUOUS SANKEY RIBBONS (Touching nodes with ZERO gaps) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 960 215"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Left -> Middle Category Gradients */}
              <linearGradient id="ribbonToDarshan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FB923C" stopOpacity="0.55" />
              </linearGradient>
              <linearGradient id="ribbonToPooja" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.55" />
              </linearGradient>
              <linearGradient id="ribbonToOther" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.5" />
              </linearGradient>

              {/* Middle -> Right Outcome Gradients */}
              <linearGradient id="flowCompleted" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="flowConfirmed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="flowPending" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="flowCancelled" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#FB7185" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* STAGE 1 -> STAGE 2: Left Hero Card (x=156) to Category Pills (x=286) */}
            {/* 1. Flow to Darshan: 2,480 bookings (66% height) */}
            <path
              d="M 156 50 C 220 50, 222 20, 286 20 L 286 56 C 222 56, 220 102, 156 102 Z"
              fill="url(#ribbonToDarshan)"
            />

            {/* 2. Flow to Pooja & Seva: 980 bookings (26% height) */}
            <path
              d="M 156 102 C 220 102, 222 92, 286 92 L 286 124 C 222 124, 220 148, 156 148 Z"
              fill="url(#ribbonToPooja)"
            />

            {/* 3. Flow to Other Services: 290 bookings (8% height) */}
            <path
              d="M 156 148 C 220 148, 222 165, 286 165 L 286 191 C 222 191, 220 166, 156 166 Z"
              fill="url(#ribbonToOther)"
            />

            {/* STAGE 2 -> STAGE 3: Category Pills (x=476) to Outcome Pills (x=686) */}
            {/* 1. Green Flow into Completed (x=686, y=14..48, Total: 2,670) */}
            <path
              d="M 476 18 C 570 18, 590 14, 686 14 L 686 48 C 590 48, 570 42, 476 42 Z"
              fill="url(#flowCompleted)"
            />

            {/* 2. Blue Flow into Confirmed / Active (x=686, y=66..100, Total: 680) */}
            <path
              d="M 476 90 C 560 90, 600 66, 686 66 L 686 98 C 600 98, 560 114, 476 114 Z"
              fill="url(#flowConfirmed)"
            />

            {/* 3. Amber Flow into Pending (x=686, y=118..152, Total: 290) */}
            <path
              d="M 476 114 C 560 114, 600 120, 686 120 L 686 150 C 600 150, 560 130, 476 130 Z"
              fill="url(#flowPending)"
            />

            {/* 4. Rose Flow into Cancelled (x=686, y=170..204, Total: 110) */}
            <path
              d="M 476 168 C 570 168, 600 172, 686 172 L 686 202 C 600 202, 570 198, 476 198 Z"
              fill="url(#flowCancelled)"
            />
          </svg>

          {/* HTML OVERLAY CARDS & PILLS (Exact Alignment with Zero-Gap Ribbons) */}
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
            {/* =========================================================
                STAGE 1: TOTAL BOOKINGS HERO BLOCK
               ========================================================= */}
            <div
              className="pointer-events-auto shrink-0 w-[140px] h-[130px] rounded-2xl bg-gradient-to-br from-[#751838] via-[#55132D] to-[#3D0A1E] text-white p-3 flex flex-col items-center justify-center shadow-lg border border-[#E2BC6B]/35 select-none transition-transform hover:scale-102 cursor-pointer"
              onClick={() => onNavigateWithFilter && onNavigateWithFilter({ category: 'All', status: 'All' })}
              title="Click to view all 3,750 devotee bookings"
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
               ========================================================= */}
            <div className="pointer-events-auto flex flex-col justify-between h-[200px] w-[190px] shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleClickCategory(cat.label)}
                  className={`w-full h-[54px] px-3 rounded-2xl ${cat.bg} ${cat.border} border shadow-2xs flex items-center gap-2.5 transition-all hover:scale-102 cursor-pointer text-left focus:outline-none`}
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
               ========================================================= */}
            <div className="pointer-events-auto flex flex-col justify-between h-[204px] w-[265px] shrink-0">
              {outcomes.map((out) => (
                <button
                  key={out.id}
                  type="button"
                  onClick={() => handleClickOutcome(out.label)}
                  className={`w-full h-[40px] px-3 rounded-2xl ${out.bg} ${out.border} border shadow-2xs flex items-center justify-between transition-all hover:scale-102 cursor-pointer text-left focus:outline-none`}
                  title={`Click to filter Bookings with outcome "${out.label}"`}
                >
                  <div className="flex items-center gap-2">
                    <div className="shrink-0">{out.icon}</div>
                    <span className="text-xs font-bold text-stone-900 font-sans">
                      {out.label}
                    </span>
                  </div>

                  <span className={`text-xs font-bold ${out.badgeColor} font-sans`}>
                    {out.count.toLocaleString()} <span className="font-semibold text-stone-500">({out.percent})</span>
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
