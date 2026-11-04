import React, { useState } from 'react';
import {
  Sun,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
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
  const [hoveredFlow, setHoveredFlow] = useState(null);

  // =========================================================
  // 100% RECONCILED MASTER DATASET (3,750 BOOKINGS)
  // Cross-Tabulation Matrix (3 Categories x 4 Outcomes):
  //               Completed   Confirmed   Pending   Cancelled   Row Total
  // Darshan           1,766         450       192          72       2,480
  // Pooja & Seva        698         178        76          28         980
  // Other Services      206          52        22          10         290
  // Col Total         2,670         680       290         110       3,750
  // =========================================================
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

  // =========================================================================
  // EXACT SANKEY GEOMETRY CALCULATION (Canvas: 960px x 224px)
  // Stage 1 Source: [8, 148] (w=140, h=132, centered at y=112)
  // Stage 2 Categories: [284, 479] (w=195, h=54 each)
  // Stage 3 Outcomes: [686, 952] (w=266, h=42 each)
  // =========================================================================

  // Stage 1 -> Stage 2 (3 Links)
  const stage1Links = [
    {
      id: 's1-darshan',
      from: 'Total Bookings',
      to: 'Darshan',
      count: 2480,
      percent: '66.1%',
      y1_0: 52,
      y1_1: 126,
      y2_0: 18,
      y2_1: 60,
      gradient: 'url(#ribbonToDarshan)',
    },
    {
      id: 's1-pooja',
      from: 'Total Bookings',
      to: 'Pooja & Seva',
      count: 980,
      percent: '26.1%',
      y1_0: 126,
      y1_1: 158,
      y2_0: 96,
      y2_1: 128,
      gradient: 'url(#ribbonToPooja)',
    },
    {
      id: 's1-other',
      from: 'Total Bookings',
      to: 'Other Bookable Services',
      count: 290,
      percent: '7.8%',
      y1_0: 158,
      y1_1: 170,
      y2_0: 171,
      y2_1: 195,
      gradient: 'url(#ribbonToOther)',
    },
  ];

  // Stage 2 -> Stage 3: Exactly 12 Data-Driven Non-Zero Sankey Links
  // x1 = 479 (right edge of Stage 2), x2 = 686 (left edge of Stage 3)
  const stage2Links = [
    // --- FROM DARSHAN (2,480 total: y span 18 -> 60) ---
    {
      id: 'flow-darshan-completed',
      from: 'Darshan',
      to: 'Completed',
      count: 1766,
      percent: '71.2%',
      y1_0: 18,
      y1_1: 47.91,
      y2_0: 16,
      y2_1: 38.49,
      gradient: 'url(#gradDarshanCompleted)',
    },
    {
      id: 'flow-darshan-confirmed',
      from: 'Darshan',
      to: 'Confirmed / Active',
      count: 450,
      percent: '18.1%',
      y1_0: 47.91,
      y1_1: 55.53,
      y2_0: 72,
      y2_1: 91.85,
      gradient: 'url(#gradDarshanConfirmed)',
    },
    {
      id: 'flow-darshan-pending',
      from: 'Darshan',
      to: 'Pending',
      count: 192,
      percent: '7.7%',
      y1_0: 55.53,
      y1_1: 58.78,
      y2_0: 128,
      y2_1: 145.21,
      gradient: 'url(#gradDarshanPending)',
    },
    {
      id: 'flow-darshan-cancelled',
      from: 'Darshan',
      to: 'Cancelled',
      count: 72,
      percent: '2.9%',
      y1_0: 58.78,
      y1_1: 60,
      y2_0: 184,
      y2_1: 198.40,
      gradient: 'url(#gradDarshanCancelled)',
    },

    // --- FROM POOJA & SEVA (980 total: y span 96 -> 128) ---
    {
      id: 'flow-pooja-completed',
      from: 'Pooja & Seva',
      to: 'Completed',
      count: 698,
      percent: '71.2%',
      y1_0: 96,
      y1_1: 118.79,
      y2_0: 38.49,
      y2_1: 47.38,
      gradient: 'url(#gradPoojaCompleted)',
    },
    {
      id: 'flow-pooja-confirmed',
      from: 'Pooja & Seva',
      to: 'Confirmed / Active',
      count: 178,
      percent: '18.2%',
      y1_0: 118.79,
      y1_1: 124.60,
      y2_0: 91.85,
      y2_1: 99.70,
      gradient: 'url(#gradPoojaConfirmed)',
    },
    {
      id: 'flow-pooja-pending',
      from: 'Pooja & Seva',
      to: 'Pending',
      count: 76,
      percent: '7.8%',
      y1_0: 124.60,
      y1_1: 127.08,
      y2_0: 145.21,
      y2_1: 152.02,
      gradient: 'url(#gradPoojaPending)',
    },
    {
      id: 'flow-pooja-cancelled',
      from: 'Pooja & Seva',
      to: 'Cancelled',
      count: 28,
      percent: '2.9%',
      y1_0: 127.08,
      y1_1: 128,
      y2_0: 198.40,
      y2_1: 204.00,
      gradient: 'url(#gradPoojaCancelled)',
    },

    // --- FROM OTHER SERVICES (290 total: y span 171 -> 195) ---
    {
      id: 'flow-other-completed',
      from: 'Other Bookable Services',
      to: 'Completed',
      count: 206,
      percent: '71.0%',
      y1_0: 171,
      y1_1: 188.05,
      y2_0: 47.38,
      y2_1: 50,
      gradient: 'url(#gradOtherCompleted)',
    },
    {
      id: 'flow-other-confirmed',
      from: 'Other Bookable Services',
      to: 'Confirmed / Active',
      count: 52,
      percent: '17.9%',
      y1_0: 188.05,
      y1_1: 192.35,
      y2_0: 99.70,
      y2_1: 102,
      gradient: 'url(#gradOtherConfirmed)',
    },
    {
      id: 'flow-other-pending',
      from: 'Other Bookable Services',
      to: 'Pending',
      count: 22,
      percent: '7.6%',
      y1_0: 192.35,
      y1_1: 194.17,
      y2_0: 152.02,
      y2_1: 154,
      gradient: 'url(#gradOtherPending)',
    },
    {
      id: 'flow-other-cancelled',
      from: 'Other Bookable Services',
      to: 'Cancelled',
      count: 10,
      percent: '3.4%',
      y1_0: 194.17,
      y1_1: 195,
      y2_0: 204.00,
      y2_1: 206,
      gradient: 'url(#gradOtherCancelled)',
    },
  ];

  // Helper for generating standard smooth cubic Bézier ribbon path
  const makeRibbonPath = (x1, y1_0, y1_1, x2, y2_0, y2_1) => {
    const cx = (x1 + x2) / 2;
    return `M ${x1} ${y1_0} C ${cx} ${y1_0}, ${cx} ${y2_0}, ${x2} ${y2_0} L ${x2} ${y2_1} C ${cx} ${y2_1}, ${cx} ${y1_1}, ${x1} ${y1_1} Z`;
  };

  return (
    <div className="bg-[#FFFDF9] rounded-2xl sm:rounded-3xl border border-[#EFE5D5] shadow-xs p-4 sm:p-5 relative overflow-hidden">
      {/* 1. Header with explicit reporting-period badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#55132D] font-serif tracking-tight leading-snug">
              Booking Journey Flow
            </h2>
            <p className="text-[11.5px] text-stone-500 font-sans">
              Three-stage devotee flow from service intake to final booking outcomes
            </p>
          </div>
        </div>

        {/* Distinct reporting cycle badge */}
        <div className="px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#EFE5D5] text-[#751838] text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#B45309]" />
          <span>Active Devotee Cohort: 31 Oct 2026 (3,750 Bookings)</span>
        </div>
      </div>

      {/* 2. Coordinated Canvas: EXACT 960px width with Zero-Gap Flowing Sankey Ribbons */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-1">
        <div className="relative w-[960px] h-[224px] mx-auto select-none">
          {/* Continuous Bézier Ribbons SVG Canvas: Touches nodes at the exact pixel */}
          <svg
            className="absolute inset-0 w-[960px] h-[224px]"
            viewBox="0 0 960 224"
            fill="none"
          >
            <defs>
              {/* Stage 1 -> Stage 2 Gradients */}
              <linearGradient id="ribbonToDarshan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#D97706" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.65" />
              </linearGradient>
              <linearGradient id="ribbonToPooja" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#D97706" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="ribbonToOther" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#9333EA" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0.6" />
              </linearGradient>

              {/* Stage 2 -> Stage 3 (12 Unique Gradients) */}
              {/* From Darshan */}
              <linearGradient id="gradDarshanCompleted" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.65" />
              </linearGradient>
              <linearGradient id="gradDarshanConfirmed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="gradDarshanPending" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="gradDarshanCancelled" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#FB7185" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0.65" />
              </linearGradient>

              {/* From Pooja & Seva */}
              <linearGradient id="gradPoojaCompleted" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.65" />
              </linearGradient>
              <linearGradient id="gradPoojaConfirmed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="gradPoojaPending" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="gradPoojaCancelled" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#FB7185" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0.65" />
              </linearGradient>

              {/* From Other Services */}
              <linearGradient id="gradOtherCompleted" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.65" />
              </linearGradient>
              <linearGradient id="gradOtherConfirmed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="gradOtherPending" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="gradOtherCancelled" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#FB7185" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0.65" />
              </linearGradient>
            </defs>

            {/* =========================================================
                STAGE 1 -> STAGE 2 FLOW RIBBONS (x1=148 to x2=284)
               ========================================================= */}
            {stage1Links.map((link) => (
              <path
                key={link.id}
                d={makeRibbonPath(148, link.y1_0, link.y1_1, 284, link.y2_0, link.y2_1)}
                fill={link.gradient}
                className="transition-opacity duration-200 cursor-pointer"
                opacity={hoveredFlow && hoveredFlow.id !== link.id ? 0.35 : 1}
                onMouseEnter={() =>
                  setHoveredFlow({
                    id: link.id,
                    from: link.from,
                    to: link.to,
                    count: link.count,
                    percent: link.percent,
                  })
                }
                onMouseLeave={() => setHoveredFlow(null)}
              />
            ))}

            {/* =========================================================
                STAGE 2 -> STAGE 3 FLOW RIBBONS (x1=479 to x2=686)
                12 Distinct, Continuous Category-to-Outcome Connections
               ========================================================= */}
            {stage2Links.map((link) => {
              const isHovered = hoveredFlow && hoveredFlow.id === link.id;
              const isFaded = hoveredFlow && hoveredFlow.id !== link.id;
              return (
                <path
                  key={link.id}
                  d={makeRibbonPath(479, link.y1_0, link.y1_1, 686, link.y2_0, link.y2_1)}
                  fill={link.gradient}
                  stroke={isHovered ? '#751838' : 'none'}
                  strokeWidth={isHovered ? 1.2 : 0}
                  opacity={isFaded ? 0.25 : isHovered ? 1 : 0.85}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredFlow({
                      id: link.id,
                      from: link.from,
                      to: link.to,
                      count: link.count,
                      percent: `${link.percent} of ${link.from}`,
                    })
                  }
                  onMouseLeave={() => setHoveredFlow(null)}
                />
              );
            })}
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

      {/* 3. Interactive Ribbon Hover Telemetry Footer */}
      <div className="mt-2 pt-2 border-t border-[#EFE5D5]/80 flex items-center justify-between text-xs min-h-[22px]">
        {hoveredFlow ? (
          <div className="flex items-center gap-2 text-stone-700 animate-in fade-in">
            <span className="font-bold text-[#751838]">{hoveredFlow.from}</span>
            <span className="text-stone-400">➔</span>
            <span className="font-bold text-stone-900">{hoveredFlow.to}:</span>
            <strong className="text-[#751838] font-sans">{hoveredFlow.count.toLocaleString()} devotees</strong>
            <span className="text-stone-400">({hoveredFlow.percent})</span>
          </div>
        ) : (
          <div className="text-[11px] text-stone-400 italic flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Hover on any flow ribbon to inspect category-to-outcome breakdown; click nodes to filter bookings.</span>
          </div>
        )}
      </div>
    </div>
  );
}
