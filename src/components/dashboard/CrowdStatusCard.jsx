import React from 'react';
import { Users } from 'lucide-react';
import { DEVOTEE_FLOW_DATA } from '../../data/dashboardData';
import AnimatedCounter from '../common/AnimatedCounter';

// Sacred Golden Lotus Motif with Whisker Lines (matches reference image under Capacity)
function WhiskerGoldenLotus({ className = 'w-9 h-2.5' }) {
  return (
    <svg className={className} viewBox="0 0 54 14" fill="none">
      {/* Left hairline whisker */}
      <line x1="2" y1="7" x2="18" y2="7" stroke="#C88728" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
      {/* Center upright petal */}
      <path
        d="M 27 1.5 C 25.5 4.5, 25.5 8.5, 27 11.5 C 28.5 8.5, 28.5 4.5, 27 1.5 Z"
        stroke="#C88728"
        strokeWidth="0.9"
        fill="#FEF3C7"
        fillOpacity="0.35"
      />
      {/* Left petal */}
      <path
        d="M 26 5.5 C 22.5 4.5, 19.5 7, 20 10.5 C 22.5 11.5, 25 10.5, 26 8.5"
        stroke="#C88728"
        strokeWidth="0.85"
        fill="none"
      />
      {/* Right petal */}
      <path
        d="M 28 5.5 C 31.5 4.5, 34.5 7, 34 10.5 C 31.5 11.5, 29 10.5, 28 8.5"
        stroke="#C88728"
        strokeWidth="0.85"
        fill="none"
      />
      {/* Base arch */}
      <path
        d="M 22 11 Q 27 13 32 11"
        stroke="#C88728"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      {/* Right hairline whisker */}
      <line x1="36" y1="7" x2="52" y2="7" stroke="#C88728" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export default function CrowdStatusCard() {
  const { currentInside, maxCapacity, occupancyPercent, status, entrances } = DEVOTEE_FLOW_DATA;

  // Prominent circular gauge geometry: increased radius 68 in 200x200 viewBox (outer ring at r=74.5)
  // Circumference = 2 * Math.PI * 68 ≈ 427.26
  const radius = 68;
  const circumference = 2 * Math.PI * radius;

  // Smooth loading animation from top (0%) to target capacity (56%)
  const [progressPercent, setProgressPercent] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgressPercent(occupancyPercent);
    }, 150);
    return () => clearTimeout(timer);
  }, [occupancyPercent]);

  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full overflow-hidden">
      {/* 1. Card Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
            Devotee Flow
          </h3>
        </div>
      </div>

      {/* 2. Top Section: 2-Column CSS Grid - Larger Gauge + Compact Hugging Petals */}
      <div className="grid grid-cols-[165px_minmax(0,1fr)] sm:grid-cols-[170px_minmax(0,1fr)] gap-2 sm:gap-2.5 items-center py-1">
        {/* Left Column: Enlarged Capacity Gauge with Compact Floral Petal Collar */}
        <div className="relative w-[165px] h-[165px] sm:w-[170px] sm:h-[170px] shrink-0 flex items-center justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
            <defs>
              {/* Vibrant Amber-to-Saffron Capacity Arc Gradient */}
              <linearGradient id="saffronArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C3220" />
                <stop offset="25%" stopColor="#B45309" />
                <stop offset="55%" stopColor="#D97706" />
                <stop offset="85%" stopColor="#E69A1C" />
                <stop offset="100%" stopColor="#F5B82A" />
              </linearGradient>

              {/* Deep Sacred Burgundy Base Track Gradient */}
              <linearGradient id="burgundyTrackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#751838" />
                <stop offset="50%" stopColor="#5A0F2B" />
                <stop offset="100%" stopColor="#4A0B22" />
              </linearGradient>
            </defs>

            {/* LAYER 1: Compact, Delicate Temple Petals (Tight Collar Hugging the Larger Gauge) */}
            <g id="mandala-petals" opacity="0.75">
              {Array.from({ length: 20 }).map((_, i) => (
                <g key={`petal-${i}`} transform={`rotate(${i * 18} 100 100)`}>
                  {/* Compact Outer Petal Accolade Contour */}
                  <path
                    d="M 88.5 25.5 C 87 19.5, 93 14.5, 100 10 C 107 14.5, 113 19.5, 111.5 25.5"
                    fill="#FFFDF7"
                    fillOpacity="0.45"
                    stroke="#C88728"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Inner Parallel Arch */}
                  <path
                    d="M 91.5 25.5 C 90.5 20.5, 94.5 16.5, 100 13.5 C 105.5 16.5, 109.5 20.5, 108.5 25.5"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="0.75"
                    opacity="0.9"
                  />
                  {/* Base Inner Trefoil Scallop */}
                  <path
                    d="M 94.5 25.5 C 95.5 22, 97.5 20.5, 100 20.5 C 102.5 20.5, 104.5 22, 105.5 25.5"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="0.7"
                    opacity="0.8"
                  />
                  {/* Center Vein & Teardrop Bindu */}
                  <line x1="100" y1="14.5" x2="100" y2="19" stroke="#D97706" strokeWidth="0.7" strokeLinecap="round" />
                  <circle cx="100" cy="16.5" r="0.7" fill="#D97706" />
                  {/* Base Connecting Scallop */}
                  <path d="M 88.5 25.5 Q 100 27.5 111.5 25.5" fill="none" stroke="#C88728" strokeWidth="0.8" />
                  <circle cx="88.5" cy="25.5" r="0.75" fill="#D97706" />
                </g>
              ))}
              {/* Outer Boundary Hairline Rim */}
              <circle cx="100" cy="100" r="74.5" stroke="#C88728" strokeWidth="0.9" fill="none" />
            </g>

            {/* LAYER 2 & 3: PROMINENT ENLARGED GAUGE (radius = 68) */}
            <g transform="rotate(-90 100 100)">
              {/* Deep Burgundy Base Track */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="url(#burgundyTrackGradient)"
                strokeWidth="13"
                strokeLinecap="round"
                fill="none"
              />

              {/* Animated Amber-to-Saffron Capacity Progress Arc (Starts from top to 56%) */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="url(#saffronArcGradient)"
                strokeWidth="13"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{
                  transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </g>

            {/* Inner Concentric Hairline Rim */}
            <circle
              cx="100"
              cy="100"
              r="61.5"
              stroke="#C88728"
              strokeWidth="0.8"
              fill="none"
              opacity="0.4"
            />
          </svg>

          {/* LAYER 4: 56% / Capacity / Whisker Lotus in Spacious Ivory Centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[28px] sm:text-[30px] font-bold font-number text-[#55132D] tracking-tight leading-none">
              <AnimatedCounter value={`${occupancyPercent}%`} />
            </span>
            <span className="text-[11px] sm:text-[11.5px] font-serif font-medium text-stone-700 tracking-tight mt-0.5">
              Capacity
            </span>
            <div className="mt-1">
              <WhiskerGoldenLotus className="w-9 h-2.5" />
            </div>
          </div>
        </div>

        {/* Right Column: Clean Occupancy Numbers & Status (Properly padded, no overflow) */}
        <div className="min-w-0 flex flex-col justify-center space-y-2 pl-2.5 sm:pl-3 border-l border-[#E8E2D8]">
          {/* Metric Count: Tabular numbers on single line */}
          <div>
            <div className="text-[25px] sm:text-[27px] font-bold font-number text-[#55132D] leading-none whitespace-nowrap flex items-baseline">
              <AnimatedCounter value={currentInside} />
              <span className="text-stone-400 font-normal text-[13px] sm:text-[14px] ml-1.5 tabular-nums whitespace-nowrap">
                / {maxCapacity.toLocaleString()}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-0.5">
              inside
            </div>
          </div>

          {/* Flow Status Pill: Compact single-line pill */}
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#FEF6E4] text-[#854D0E] border border-[#FDE68A] whitespace-nowrap shadow-2xs">
              {status} Flow
            </span>
          </div>
        </div>
      </div>

      {/* 3. Subtle Horizontal Divider */}
      <div className="w-full border-t border-[#E8E2D8] my-2" />

      {/* 4. Gate Telemetry Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400">
          <span>Gate Telemetry</span>
          <span>Inflow & Wait</span>
        </div>
        {entrances.map((ent) => (
          <div key={ent.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800">{ent.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-stone-600 font-mono text-[11px] tabular-nums">
                  <strong className="text-stone-900 font-semibold">{ent.current.toLocaleString()}</strong> / {ent.capacity.toLocaleString()}
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-[#854D0E] font-medium text-[10px] bg-[#FEF6E4] px-2 py-0.5 rounded-full border border-[#FDE68A] font-mono whitespace-nowrap">
                  {ent.wait}
                </span>
              </div>
            </div>
            {/* Burgundy Progress Fill with Clean Warm-Grey Track */}
            <div className="w-full h-1.5 rounded-full bg-[#EAE5DD] overflow-hidden">
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
