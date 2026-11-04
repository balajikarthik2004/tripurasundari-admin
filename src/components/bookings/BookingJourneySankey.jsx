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
  const [hoveredCard, setHoveredCard] = useState(null);

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
      top: 'top-[18px]',
      summary: '1,766 Completed, 450 Confirmed, 192 Pending, 72 Cancelled',
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
      top: 'top-[122px]',
      summary: '698 Completed, 178 Confirmed, 76 Pending, 28 Cancelled',
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
      top: 'top-[226px]',
      summary: '206 Completed, 52 Confirmed, 22 Pending, 10 Cancelled',
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
      top: 'top-[14px]',
      summary: '1,766 from Darshan, 698 from Pooja & Seva, 206 from Other Services',
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
      top: 'top-[88px]',
      summary: '450 from Darshan, 178 from Pooja & Seva, 52 from Other Services',
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
      top: 'top-[162px]',
      summary: '192 from Darshan, 76 from Pooja & Seva, 22 from Other Services',
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
      top: 'top-[236px]',
      summary: '72 from Darshan, 28 from Pooja & Seva, 10 from Other Services',
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

  // =========================================================================
  // ZERO-GAP SEAMLESS GEOMETRY (Canvas: 960px x 300px)
  // Ribbons start 10px INSIDE source cards and terminate 18px INSIDE destination cards.
  // The rounded corners of the cards sit on top (z-10) with solid backgrounds,
  // completely eliminating any corner notches or disconnected gaps!
  // =========================================================================

  // Stage 1 -> Stage 2 (Tucked from x1=146 [under Hero at x=156] to x2=302 [under Category at x=290])
  const stage1Links = [
    {
      id: 's1-darshan',
      catId: 'darshan',
      from: 'Total Bookings',
      to: 'Darshan',
      count: 2480,
      percent: '66.1%',
      y1_0: 86,
      y1_1: 170.6,
      y2_0: 26,
      y2_1: 66,
      gradient: 'url(#ribbonToDarshan)',
    },
    {
      id: 's1-pooja',
      catId: 'pooja',
      from: 'Total Bookings',
      to: 'Pooja & Seva',
      count: 980,
      percent: '26.1%',
      y1_0: 170.6,
      y1_1: 204.1,
      y2_0: 134,
      y2_1: 166,
      gradient: 'url(#ribbonToPooja)',
    },
    {
      id: 's1-other',
      catId: 'other',
      from: 'Total Bookings',
      to: 'Other Bookable Services',
      count: 290,
      percent: '7.8%',
      y1_0: 204.1,
      y1_1: 214,
      y2_0: 238,
      y2_1: 270,
      gradient: 'url(#ribbonToOther)',
    },
  ];

  // Stage 2 -> Stage 3 (Tucked from x1=475 [under Category at x=485] to x2=708 [under Outcome at x=690])
  const stage2Links = [
    // --- FROM DARSHAN ---
    {
      id: 'flow-darshan-completed',
      catId: 'darshan',
      outId: 'completed',
      from: 'Darshan',
      to: 'Completed',
      count: 1766,
      percent: '71.2%',
      y1_0: 26,
      y1_1: 54.48,
      y2_0: 20,
      y2_1: 41.17,
      gradient: 'url(#gradDarshanCompleted)',
    },
    {
      id: 'flow-darshan-confirmed',
      catId: 'darshan',
      outId: 'confirmed',
      from: 'Darshan',
      to: 'Confirmed / Active',
      count: 450,
      percent: '18.1%',
      y1_0: 54.48,
      y1_1: 61.74,
      y2_0: 94,
      y2_1: 115.18,
      gradient: 'url(#gradDarshanConfirmed)',
    },
    {
      id: 'flow-darshan-pending',
      catId: 'darshan',
      outId: 'pending',
      from: 'Darshan',
      to: 'Pending',
      count: 192,
      percent: '7.7%',
      y1_0: 61.74,
      y1_1: 64.84,
      y2_0: 168,
      y2_1: 189.19,
      gradient: 'url(#gradDarshanPending)',
    },
    {
      id: 'flow-darshan-cancelled',
      catId: 'darshan',
      outId: 'cancelled',
      from: 'Darshan',
      to: 'Cancelled',
      count: 72,
      percent: '2.9%',
      y1_0: 64.84,
      y1_1: 66,
      y2_0: 242,
      y2_1: 262.95,
      gradient: 'url(#gradDarshanCancelled)',
    },

    // --- FROM POOJA & SEVA ---
    {
      id: 'flow-pooja-completed',
      catId: 'pooja',
      outId: 'completed',
      from: 'Pooja & Seva',
      to: 'Completed',
      count: 698,
      percent: '71.2%',
      y1_0: 134,
      y1_1: 156.79,
      y2_0: 41.17,
      y2_1: 49.53,
      gradient: 'url(#gradPoojaCompleted)',
    },
    {
      id: 'flow-pooja-confirmed',
      catId: 'pooja',
      outId: 'confirmed',
      from: 'Pooja & Seva',
      to: 'Confirmed / Active',
      count: 178,
      percent: '18.2%',
      y1_0: 156.79,
      y1_1: 162.6,
      y2_0: 115.18,
      y2_1: 123.55,
      gradient: 'url(#gradPoojaConfirmed)',
    },
    {
      id: 'flow-pooja-pending',
      catId: 'pooja',
      outId: 'pending',
      from: 'Pooja & Seva',
      to: 'Pending',
      count: 76,
      percent: '7.8%',
      y1_0: 162.6,
      y1_1: 165.09,
      y2_0: 189.19,
      y2_1: 197.57,
      gradient: 'url(#gradPoojaPending)',
    },
    {
      id: 'flow-pooja-cancelled',
      catId: 'pooja',
      outId: 'cancelled',
      from: 'Pooja & Seva',
      to: 'Cancelled',
      count: 28,
      percent: '2.9%',
      y1_0: 165.09,
      y1_1: 166,
      y2_0: 262.95,
      y2_1: 271.09,
      gradient: 'url(#gradPoojaCancelled)',
    },

    // --- FROM OTHER SERVICES ---
    {
      id: 'flow-other-completed',
      catId: 'other',
      outId: 'completed',
      from: 'Other Bookable Services',
      to: 'Completed',
      count: 206,
      percent: '71.0%',
      y1_0: 238,
      y1_1: 260.73,
      y2_0: 49.53,
      y2_1: 52,
      gradient: 'url(#gradOtherCompleted)',
    },
    {
      id: 'flow-other-confirmed',
      catId: 'other',
      outId: 'confirmed',
      from: 'Other Bookable Services',
      to: 'Confirmed / Active',
      count: 52,
      percent: '17.9%',
      y1_0: 260.73,
      y1_1: 266.47,
      y2_0: 123.55,
      y2_1: 126,
      gradient: 'url(#gradOtherConfirmed)',
    },
    {
      id: 'flow-other-pending',
      catId: 'other',
      outId: 'pending',
      from: 'Other Bookable Services',
      to: 'Pending',
      count: 22,
      percent: '7.6%',
      y1_0: 266.47,
      y1_1: 268.9,
      y2_0: 197.57,
      y2_1: 200,
      gradient: 'url(#gradOtherPending)',
    },
    {
      id: 'flow-other-cancelled',
      catId: 'other',
      outId: 'cancelled',
      from: 'Other Bookable Services',
      to: 'Cancelled',
      count: 10,
      percent: '3.4%',
      y1_0: 268.9,
      y1_1: 270,
      y2_0: 271.09,
      y2_1: 274,
      gradient: 'url(#gradOtherCancelled)',
    },
  ];

  const makeRibbonPath = (x1, y1_0, y1_1, x2, y2_0, y2_1) => {
    const cx = (x1 + x2) / 2;
    return `M ${x1} ${y1_0} C ${cx} ${y1_0}, ${cx} ${y2_0}, ${x2} ${y2_0} L ${x2} ${y2_1} C ${cx} ${y2_1}, ${cx} ${y1_1}, ${x1} ${y1_1} Z`;
  };

  // Compute active highlighting when user hovers a card or a flow ribbon
  const isLinkActive = (link, isStage1 = false) => {
    if (hoveredFlow) {
      return hoveredFlow.id === link.id;
    }
    if (hoveredCard) {
      if (hoveredCard.type === 'total') return true;
      if (hoveredCard.type === 'category') {
        if (isStage1) return link.catId === hoveredCard.id;
        return link.catId === hoveredCard.id;
      }
      if (hoveredCard.type === 'outcome') {
        if (isStage1) return true; // subtle link
        return link.outId === hoveredCard.id;
      }
    }
    return null; // default neutral state
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
              Interactive devotee journey from service intake to final booking outcomes
            </p>
          </div>
        </div>

        {/* Distinct reporting cycle badge */}
        <div className="px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#EFE5D5] text-[#751838] text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#B45309]" />
          <span>Active Devotee Cohort: 31 Oct 2026 (3,750 Bookings)</span>
        </div>
      </div>

      {/* 2. Spacious 300px High Coordinated Canvas: Seamless Tucked Ribbons with Card Masks */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-1">
        <div className="relative w-[960px] h-[300px] mx-auto select-none">
          {/* =========================================================
              LAYER 0 (BEHIND CARDS): Continuous Bézier Ribbons Canvas
              Tucked under card boundaries so rounded corners mask seamlessly!
             ========================================================= */}
          <svg
            className="absolute inset-0 w-[960px] h-[300px] z-0"
            viewBox="0 0 960 300"
            fill="none"
          >
            <defs>
              {/* Stage 1 -> Stage 2 Gradients */}
              <linearGradient id="ribbonToDarshan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#D97706" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="ribbonToPooja" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#D97706" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="ribbonToOther" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#751838" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#9333EA" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0.8" />
              </linearGradient>

              {/* Stage 2 -> Stage 3 (12 High-Clarity Gradients) */}
              <linearGradient id="gradDarshanCompleted" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="gradDarshanConfirmed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="gradDarshanPending" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="gradDarshanCancelled" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#FB7185" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="gradPoojaCompleted" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="gradPoojaConfirmed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="gradPoojaPending" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="gradPoojaCancelled" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#FB7185" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="gradOtherCompleted" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="gradOtherConfirmed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="gradOtherPending" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="gradOtherCancelled" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#FB7185" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* STAGE 1 -> STAGE 2 FLOW RIBBONS (Tucked: x1=146 to x2=302) */}
            {stage1Links.map((link) => {
              const active = isLinkActive(link, true);
              const opacity = active === true ? 1 : active === false ? 0.18 : 0.9;
              return (
                <path
                  key={link.id}
                  d={makeRibbonPath(146, link.y1_0, link.y1_1, 302, link.y2_0, link.y2_1)}
                  fill={link.gradient}
                  className="transition-all duration-200 cursor-pointer"
                  opacity={opacity}
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
              );
            })}

            {/* STAGE 2 -> STAGE 3 FLOW RIBBONS (Tucked: x1=475 to x2=708, Zero-Gap) */}
            {stage2Links.map((link) => {
              const active = isLinkActive(link, false);
              const isHovered = (hoveredFlow && hoveredFlow.id === link.id) || active === true;
              const opacity = active === false ? 0.14 : isHovered ? 1 : 0.88;
              return (
                <path
                  key={link.id}
                  d={makeRibbonPath(475, link.y1_0, link.y1_1, 708, link.y2_0, link.y2_1)}
                  fill={link.gradient}
                  stroke={isHovered ? '#751838' : 'rgba(255,255,255,0.75)'}
                  strokeWidth={isHovered ? 1.5 : 0.6}
                  opacity={opacity}
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
              LAYER 1 (IN FRONT OF SVG): Nodes with Solid Backgrounds
              The rounded borders naturally mask the tucked ribbon edges!
             ========================================================= */}

          {/* STAGE 1: TOTAL BOOKINGS HERO BLOCK */}
          <div
            className={`absolute left-[8px] top-[76px] w-[148px] h-[148px] rounded-2xl bg-gradient-to-br from-[#751838] via-[#55132D] to-[#3D0A1E] text-white p-3 flex flex-col items-center justify-center shadow-lg border border-[#E2BC6B]/40 select-none transition-all z-10 cursor-pointer ${
              hoveredCard && hoveredCard.type === 'total'
                ? 'scale-105 ring-2 ring-[#E2BC6B] shadow-xl'
                : 'hover:scale-102'
            }`}
            onMouseEnter={() => setHoveredCard({ type: 'total' })}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onNavigateWithFilter && onNavigateWithFilter({ category: 'All', status: 'All' })}
            title="Click to view all 3,750 bookings in Bookings table"
          >
            <div className="text-[#E2BC6B] mb-1.5">
              <TempleDomeIcon className="w-8 h-8" />
            </div>
            <div className="text-3xl font-bold font-serif tracking-tight leading-none text-white">
              {totalBookings.toLocaleString()}
            </div>
            <div className="text-xs font-sans font-medium text-[#F5EBE1] mt-2 opacity-90 tracking-wide">
              Total Bookings
            </div>
          </div>

          {/* STAGE 2: SERVICE CATEGORIES PILLS (3 ITEMS) */}
          <div className="absolute left-[290px] top-0 w-[195px] h-full pointer-events-auto z-10">
            {categories.map((cat) => {
              const isCardHovered = hoveredCard && hoveredCard.type === 'category' && hoveredCard.id === cat.id;
              const isConnected = hoveredCard && hoveredCard.type === 'total';
              return (
                <button
                  key={cat.id}
                  type="button"
                  onMouseEnter={() =>
                    setHoveredCard({
                      type: 'category',
                      id: cat.id,
                      label: cat.label,
                      count: cat.count,
                      percent: cat.percent,
                      summary: cat.summary,
                    })
                  }
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleClickCategory(cat.label)}
                  className={`absolute ${cat.top} left-0 w-full h-[56px] px-3.5 rounded-2xl ${cat.bg} ${cat.border} border shadow-xs flex items-center gap-2.5 transition-all cursor-pointer text-left focus:outline-none ${
                    isCardHovered
                      ? 'scale-105 ring-2 ring-[#751838] shadow-md'
                      : isConnected
                      ? 'ring-1.5 ring-[#751838]/40'
                      : 'hover:scale-102'
                  }`}
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
              );
            })}
          </div>

          {/* STAGE 3: BOOKING OUTCOMES PILLS (4 ITEMS) */}
          <div className="absolute left-[690px] top-0 w-[262px] h-full pointer-events-auto z-10">
            {outcomes.map((out) => {
              const isCardHovered = hoveredCard && hoveredCard.type === 'outcome' && hoveredCard.id === out.id;
              return (
                <button
                  key={out.id}
                  type="button"
                  onMouseEnter={() =>
                    setHoveredCard({
                      type: 'outcome',
                      id: out.id,
                      label: out.label,
                      count: out.count,
                      percent: out.percent,
                      summary: out.summary,
                    })
                  }
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleClickOutcome(out.label)}
                  className={`absolute ${out.top} left-0 w-full h-[44px] px-3.5 rounded-2xl ${out.bg} ${out.border} border shadow-xs flex items-center justify-between transition-all cursor-pointer text-left focus:outline-none ${
                    isCardHovered
                      ? 'scale-105 ring-2 ring-[#751838] shadow-md'
                      : 'hover:scale-102'
                  }`}
                  title={`Click to filter Bookings with outcome "${out.label}"`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="shrink-0">{out.icon}</div>
                    <span className="text-xs font-bold text-stone-900 font-sans">
                      {out.label}
                    </span>
                  </div>

                  <span className={`text-xs font-bold ${out.badgeColor} font-sans`}>
                    {out.count.toLocaleString()} <span className="font-semibold text-stone-500 text-[11px]">({out.percent})</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Interactive Ribbon & Node Hover Telemetry Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#EFE5D5]/80 flex items-center justify-between text-xs min-h-[24px]">
        {hoveredCard ? (
          <div className="flex items-center gap-2 text-stone-800 animate-in fade-in">
            <span className="font-bold text-[#751838] bg-[#751838]/10 px-2 py-0.5 rounded-md">
              {hoveredCard.type === 'total' ? 'Total Intake' : hoveredCard.label}
            </span>
            <span className="text-stone-400">•</span>
            {hoveredCard.type === 'total' ? (
              <span>
                <strong>3,750 devotees</strong> active across Darshan (2,480), Pooja & Seva (980), and Other Services (290)
              </span>
            ) : (
              <span>
                <strong>{hoveredCard.count.toLocaleString()} devotees</strong> ({hoveredCard.percent}):{' '}
                <span className="text-stone-600">{hoveredCard.summary}</span>
              </span>
            )}
          </div>
        ) : hoveredFlow ? (
          <div className="flex items-center gap-2 text-stone-700 animate-in fade-in">
            <span className="font-bold text-[#751838]">{hoveredFlow.from}</span>
            <span className="text-stone-400">➔</span>
            <span className="font-bold text-stone-900">{hoveredFlow.to}:</span>
            <strong className="text-[#751838] font-sans text-sm">{hoveredFlow.count.toLocaleString()} devotees</strong>
            <span className="text-stone-500 font-medium">({hoveredFlow.percent})</span>
          </div>
        ) : (
          <div className="text-[11.5px] text-stone-400 italic flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Hover on any card or flow ribbon to highlight its connected paths; click to filter bookings.</span>
          </div>
        )}
      </div>
    </div>
  );
}
