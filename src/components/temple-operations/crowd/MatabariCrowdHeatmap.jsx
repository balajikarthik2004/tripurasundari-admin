import React, { useState, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Users,
  Clock,
  CheckCircle2,
  Zap,
  Building,
  Navigation,
  Compass,
  Waves,
  UtensilsCrossed,
  PackageCheck,
  Flame,
} from 'lucide-react';

export default function MatabariCrowdHeatmap({
  onSelectZone,
  selectedZoneId = null,
  onTriggerAction,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState('all'); // 'all' | 'routes' | 'facilities'
  const [activeRouteId, setActiveRouteId] = useState('route-west');
  const [throttleSuccessMessage, setThrottleSuccessMessage] = useState(null);

  // Master Route Telemetry Data
  const routesData = useMemo(() => [
    {
      id: 'route-west',
      name: 'West Main Gopuram',
      shortName: 'West Gopuram',
      type: 'General Queue',
      color: '#DC2626', // Red
      status: 'High Load',
      waitTime: '35 min',
      inflowRate: '+38/m',
      currentDevotees: 1420,
      capacity: 1800,
      occupancy: 79,
      pathD: 'M 140 370 Q 240 370 320 350 T 440 310 Q 510 270 560 310 T 630 330',
      returnPathD: 'M 640 350 Q 560 410 470 410 T 310 410 Q 220 410 140 400',
    },
    {
      id: 'route-special',
      name: 'Special Pass Corridor',
      shortName: 'Special Pass',
      type: 'Express Darshan',
      color: '#D97706', // Amber
      status: 'Moderate',
      waitTime: '15 min',
      inflowRate: '+18/m',
      currentDevotees: 580,
      capacity: 900,
      occupancy: 64,
      pathD: 'M 180 260 Q 300 240 410 250 T 540 280 Q 590 300 625 325',
    },
    {
      id: 'route-north',
      name: 'North Assisted Ramp',
      shortName: 'North Ramp',
      type: 'Senior & Divyangjan',
      color: '#059669', // Emerald
      status: 'Smooth',
      waitTime: '8 min',
      inflowRate: '+8/m',
      currentDevotees: 240,
      capacity: 600,
      occupancy: 40,
      pathD: 'M 510 120 Q 520 180 540 230 T 610 300 Q 625 315 635 325',
    },
    {
      id: 'route-lake',
      name: 'Kalyansagar Ghat Route',
      shortName: 'Lake Ghat',
      type: 'Lakeside Promenade',
      color: '#0284C7', // Sky
      status: 'Normal',
      waitTime: '10 min',
      inflowRate: '+14/m',
      currentDevotees: 415,
      capacity: 800,
      occupancy: 52,
      pathD: 'M 650 365 Q 710 400 760 450 T 820 540 Q 820 600 750 600 T 620 580',
    },
  ], []);

  // Spatial POIs (X, Y in 1000x680 coordinate space)
  const mapPOIs = useMemo(() => [
    {
      id: 'poi-sanctum',
      x: 640,
      y: 335,
      title: 'Main Sanctum',
      tag: 'Wait 35m',
      color: '#DC2626',
    },
    {
      id: 'poi-west-gate',
      x: 135,
      y: 385,
      title: 'West Gopuram',
      tag: 'Holding 420',
      color: '#D97706',
    },
    {
      id: 'poi-north-ramp',
      x: 505,
      y: 110,
      title: 'North Ramp',
      tag: 'Wait 8m',
      color: '#059669',
    },
    {
      id: 'poi-lake',
      x: 820,
      y: 470,
      title: 'Kalyansagar Lake',
      tag: 'Normal',
      color: '#0284C7',
    },
    {
      id: 'poi-annadanam',
      x: 570,
      y: 590,
      title: 'Annadanam Hall',
      tag: '520 / 600',
      color: '#059669',
    },
    {
      id: 'poi-shoes',
      x: 230,
      y: 470,
      title: 'Footwear & Cloakroom',
      tag: 'Available',
      color: '#7C3AED',
    },
  ], []);

  const activeRoute = routesData.find((r) => r.id === activeRouteId) || routesData[0];

  const handleApplyThrottle = (actionName) => {
    setThrottleSuccessMessage(`Dispatched: ${actionName}`);
    if (onTriggerAction) onTriggerAction(actionName);
    setTimeout(() => {
      setThrottleSuccessMessage(null);
    }, 3500);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-4 select-none">
      {/* Keyframe animation for heat lines */}
      <style>{`
        @keyframes flowDash {
          0% { stroke-dashoffset: 64; }
          100% { stroke-dashoffset: 0; }
        }
        .heat-flow-animated {
          animation: flowDash 2.4s linear infinite;
        }
      `}</style>

      {/* TOP HEADER: Clean Title, Live Indicator, View Filters & Zoom */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#55132D] flex items-center justify-center text-[#E2BC6B] shadow-xs flex-shrink-0">
            <Compass className="w-5 h-5 text-[#E2BC6B]" />
          </div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-stone-900 font-serif font-bold text-lg tracking-tight">
              Premises Crowd Heatmap
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
        </div>

        {/* View Layers & Zoom Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs font-medium">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeLayer === 'all'
                  ? 'bg-[#55132D] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveLayer('routes')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeLayer === 'routes'
                  ? 'bg-[#55132D] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Corridors
            </button>
            <button
              onClick={() => setActiveLayer('facilities')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeLayer === 'facilities'
                  ? 'bg-[#55132D] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sanctum & POIs
            </button>
          </div>

          {/* Zoom Tools */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-stone-600">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.4))}
              className="p-1 hover:text-stone-900 hover:bg-white rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.95))}
              className="p-1 hover:text-stone-900 hover:bg-white rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-stone-900 hover:bg-white rounded-lg transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN BALANCED LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN: 2D ARCHITECTURAL BLUEPRINT + CLEAN LEGEND */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-3">
          <div className="relative w-full aspect-[1000/680] rounded-xl overflow-hidden border border-stone-200/90 shadow-xs bg-[#FAF7F2]">
            <div
              className="relative w-full h-full transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            >
              {/* Architectural 2D Aerial Drawing Blueprint Image */}
              <img
                src="/matabari-aerial-blueprint.jpg"
                alt="Tripura Sundari Temple Architectural Blueprint"
                className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-multiply filter contrast-125 brightness-100 pointer-events-none"
              />

              {/* Subtle Parchment Vignette */}
              <div className="absolute inset-0 bg-radial from-transparent via-[#FAF7F2]/10 to-[#FAF7F2]/40 pointer-events-none" />

              {/* SVG INTERACTIVE HEAT LINES & CORRIDORS LAYER */}
              <svg
                viewBox="0 0 1000 680"
                className="absolute inset-0 w-full h-full pointer-events-auto"
              >
                <defs>
                  {/* Subtle Glow Filters */}
                  <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-sky" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Sanctum Glow Circle */}
                  <radialGradient id="sanctumGlowLight" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="#D97706" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Inner Sanctum Central Aura */}
                <circle cx="640" cy="335" r="75" fill="url(#sanctumGlowLight)" className="animate-pulse" />

                {/* HEAT LINES & QUEUE CORRIDORS */}
                {(activeLayer === 'all' || activeLayer === 'routes') && (
                  <g id="heat-lines">
                    {/* 1. ROUTE WEST (General Queue - RED) */}
                    <g
                      onClick={() => setActiveRouteId('route-west')}
                      className="cursor-pointer group"
                    >
                      <path
                        d={routesData[0].pathD}
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth={activeRouteId === 'route-west' ? '14' : '10'}
                        strokeOpacity="0.3"
                        strokeLinecap="round"
                        filter="url(#glow-red)"
                      />
                      <path
                        d={routesData[0].pathD}
                        fill="none"
                        stroke="#DC2626"
                        strokeWidth={activeRouteId === 'route-west' ? '5.5' : '4'}
                        strokeOpacity="0.95"
                        strokeLinecap="round"
                      />
                      <path
                        d={routesData[0].pathD}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeDasharray="6 12"
                        strokeLinecap="round"
                        className="heat-flow-animated"
                      />
                      <path
                        d={routesData[0].returnPathD}
                        fill="none"
                        stroke="#DC2626"
                        strokeWidth="3"
                        strokeOpacity="0.6"
                        strokeDasharray="4 8"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* 2. ROUTE SPECIAL (Expedited - AMBER) */}
                    <g
                      onClick={() => setActiveRouteId('route-special')}
                      className="cursor-pointer group"
                    >
                      <path
                        d={routesData[1].pathD}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth={activeRouteId === 'route-special' ? '12' : '8'}
                        strokeOpacity="0.3"
                        strokeLinecap="round"
                        filter="url(#glow-amber)"
                      />
                      <path
                        d={routesData[1].pathD}
                        fill="none"
                        stroke="#D97706"
                        strokeWidth={activeRouteId === 'route-special' ? '4.5' : '3.5'}
                        strokeOpacity="0.95"
                        strokeLinecap="round"
                      />
                      <path
                        d={routesData[1].pathD}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeDasharray="6 10"
                        strokeLinecap="round"
                        className="heat-flow-animated"
                      />
                    </g>

                    {/* 3. ROUTE NORTH (Assisted Ramp - EMERALD GREEN) */}
                    <g
                      onClick={() => setActiveRouteId('route-north')}
                      className="cursor-pointer group"
                    >
                      <path
                        d={routesData[2].pathD}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth={activeRouteId === 'route-north' ? '12' : '8'}
                        strokeOpacity="0.3"
                        strokeLinecap="round"
                        filter="url(#glow-emerald)"
                      />
                      <path
                        d={routesData[2].pathD}
                        fill="none"
                        stroke="#059669"
                        strokeWidth={activeRouteId === 'route-north' ? '4.5' : '3.5'}
                        strokeOpacity="0.95"
                        strokeLinecap="round"
                      />
                      <path
                        d={routesData[2].pathD}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeDasharray="6 10"
                        strokeLinecap="round"
                        className="heat-flow-animated"
                      />
                    </g>

                    {/* 4. ROUTE LAKE (Kalyansagar Ghat - SKY BLUE) */}
                    <g
                      onClick={() => setActiveRouteId('route-lake')}
                      className="cursor-pointer group"
                    >
                      <path
                        d={routesData[3].pathD}
                        fill="none"
                        stroke="#0EA5E9"
                        strokeWidth={activeRouteId === 'route-lake' ? '12' : '8'}
                        strokeOpacity="0.3"
                        strokeLinecap="round"
                        filter="url(#glow-sky)"
                      />
                      <path
                        d={routesData[3].pathD}
                        fill="none"
                        stroke="#0284C7"
                        strokeWidth={activeRouteId === 'route-lake' ? '4.5' : '3.5'}
                        strokeOpacity="0.95"
                        strokeLinecap="round"
                      />
                      <path
                        d={routesData[3].pathD}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeDasharray="6 10"
                        strokeLinecap="round"
                        className="heat-flow-animated"
                      />
                    </g>
                  </g>
                )}

                {/* CLEAN, MINIMAL MAP MARKERS (No oversized clunky text boxes) */}
                {(activeLayer === 'all' || activeLayer === 'facilities') && (
                  <g id="poi-markers">
                    {mapPOIs.map((poi) => (
                      <g
                        key={poi.id}
                        transform={`translate(${poi.x}, ${poi.y})`}
                        className="cursor-pointer transition-transform duration-150 hover:scale-110"
                        onClick={() => {
                          if (onSelectZone) onSelectZone(poi);
                        }}
                      >
                        {/* Outer Pulse Ring */}
                        <circle
                          cx="0"
                          cy="0"
                          r="14"
                          fill="none"
                          stroke={poi.color}
                          strokeWidth="1.5"
                          strokeOpacity="0.35"
                          className="animate-ping"
                        />

                        {/* Pin Disc */}
                        <circle
                          cx="0"
                          cy="0"
                          r="7.5"
                          fill="#FFFFFF"
                          stroke={poi.color}
                          strokeWidth="2.5"
                          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                        />
                        <circle cx="0" cy="0" r="3" fill={poi.color} />

                        {/* Floating Clean Pill Tag */}
                        <g transform="translate(12, -12)">
                          <rect
                            x="0"
                            y="0"
                            width={poi.title.length * 6 + 46}
                            height="20"
                            rx="10"
                            fill="#FFFFFF"
                            stroke={poi.color}
                            strokeWidth="1.2"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                          />
                          <text
                            x="8"
                            y="13"
                            fontSize="9"
                            fontWeight="bold"
                            fill="#1C1917"
                            fontFamily="sans-serif"
                          >
                            {poi.title}
                          </text>
                          <text
                            x={poi.title.length * 6 + 14}
                            y="13"
                            fontSize="8"
                            fontWeight="bold"
                            fill={poi.color}
                            fontFamily="monospace"
                          >
                            {poi.tag}
                          </text>
                        </g>
                      </g>
                    ))}
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* STREAMLINED HEATMAP LEGEND */}
          <div className="bg-[#FAF7F2] px-4 py-2.5 rounded-xl border border-stone-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold text-stone-600 text-[11px] uppercase tracking-wider">
                Corridor Flow:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span className="text-stone-700 font-medium text-xs">High (&gt;75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-stone-700 font-medium text-xs">Moderate (50–75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-stone-700 font-medium text-xs">Smooth (&lt;50%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span className="text-stone-700 font-medium text-xs">Lake Ghat</span>
              </div>
            </div>

            <span className="text-[11px] text-stone-400 font-medium">
              Click route or pin to inspect
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: COHESIVE TELEMETRY & TACTICAL CONTROL PANEL */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-3.5">
          {/* Card 1: Live Darshan Flow Metrics */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif">
                  Live Darshan Flow
                </span>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#B68A36]" />
                  <span>Peak Wait</span>
                </div>
                <div className="text-xl font-bold font-number text-rose-700 mt-1">
                  35 MIN
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">West Gate</div>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Inflow Rate</span>
                </div>
                <div className="text-xl font-bold font-number text-stone-900 mt-1">
                  +48/min
                </div>
                <div className="text-[11px] text-amber-700 font-semibold mt-0.5">High Volume</div>
              </div>
            </div>

            {/* Total Campus Footfall Meter */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-stone-600">Total Devotees:</span>
                <span className="font-bold font-number text-stone-900">
                  2,655 <span className="text-stone-500 font-normal">/ 5,500</span>
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200/60">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 w-[48%]" />
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Corridors List & Telemetry */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/90 shadow-xs space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif">
                  Corridor Telemetry
                </span>
                <span className="text-[11px] text-stone-400">Select to focus</span>
              </div>

              {/* 4 Interactive Corridors */}
              <div className="space-y-2">
                {routesData.map((route) => {
                  const isSelected = activeRouteId === route.id;
                  return (
                    <div
                      key={route.id}
                      onClick={() => setActiveRouteId(route.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#55132D]/5 border-[#55132D] shadow-xs'
                          : 'bg-stone-50/70 border-stone-200/70 hover:bg-stone-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: route.color }}
                          />
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#55132D]' : 'text-stone-800'}`}>
                            {route.shortName}
                          </span>
                        </div>
                        <span className="text-xs font-bold font-number text-stone-900">
                          {route.waitTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5 pl-4.5">
                        <span>{route.currentDevotees.toLocaleString('en-IN')} / {route.capacity} devotees</span>
                        <span className={`font-semibold ${route.occupancy > 75 ? 'text-rose-600' : route.occupancy > 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {route.occupancy}% load
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tactical Flow Controls */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleApplyThrottle(`Intake held by 3m for ${activeRoute.shortName}`)}
                  className="flex-1 px-3 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-[#E2BC6B]" />
                  <span>Hold Intake 3m</span>
                </button>

                <button
                  onClick={() => handleApplyThrottle(`Dispatched 4 relief sevadal to ${activeRoute.shortName}`)}
                  className="flex-1 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-stone-600" />
                  <span>Deploy Sevadal</span>
                </button>
              </div>

              {throttleSuccessMessage && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium text-[11px]">{throttleSuccessMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
