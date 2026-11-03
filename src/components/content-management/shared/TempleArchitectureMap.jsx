import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Compass,
  Layers,
  Info,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Navigation,
} from 'lucide-react';

export default function TempleArchitectureMap({
  markers = [],
  selectedMarker = null,
  onSelectMarker,
  isAddingMarkerMode = false,
  onMapClick,
  selectedCategory = 'ALL',
  onSelectCategory,
  categories = [],
}) {
  const [zoom, setZoom] = useState(1);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [showContours, setShowContours] = useState(true);
  const [showTrees, setShowTrees] = useState(true);

  // Category badge styling & color palettes
  const getCategoryTheme = (category) => {
    switch (category) {
      case 'Temple':
        return {
          pinBg: '#800000',
          pinBorder: '#F59E0B',
          glow: 'rgba(128, 0, 0, 0.4)',
          text: 'Sanctum',
          iconColor: '#FDE68A',
        };
      case 'Entry Point':
        return {
          pinBg: '#059669',
          pinBorder: '#A7F3D0',
          glow: 'rgba(5, 150, 105, 0.4)',
          text: 'Gate',
          iconColor: '#FFFFFF',
        };
      case 'Exit Point':
        return {
          pinBg: '#0D9488',
          pinBorder: '#99F6E4',
          glow: 'rgba(13, 148, 136, 0.4)',
          text: 'Exit',
          iconColor: '#FFFFFF',
        };
      case 'Parking':
        return {
          pinBg: '#2563EB',
          pinBorder: '#BFDBFE',
          glow: 'rgba(37, 99, 235, 0.4)',
          text: 'Parking',
          iconColor: '#FFFFFF',
        };
      case 'Drinking Water':
        return {
          pinBg: '#0891B2',
          pinBorder: '#A5F3FC',
          glow: 'rgba(8, 145, 178, 0.4)',
          text: 'RO Water',
          iconColor: '#FFFFFF',
        };
      case 'Toilets':
        return {
          pinBg: '#4F46E5',
          pinBorder: '#C7D2FE',
          glow: 'rgba(79, 70, 229, 0.4)',
          text: 'Restrooms',
          iconColor: '#FFFFFF',
        };
      case 'Help Desk':
        return {
          pinBg: '#D97706',
          pinBorder: '#FDE68A',
          glow: 'rgba(217, 119, 6, 0.4)',
          text: 'Help Desk',
          iconColor: '#FFFFFF',
        };
      case 'Prasad Area':
        return {
          pinBg: '#E11D48',
          pinBorder: '#FECDD3',
          glow: 'rgba(225, 29, 72, 0.4)',
          text: 'Prasad',
          iconColor: '#FFFFFF',
        };
      case 'Annadanam Area':
        return {
          pinBg: '#EA580C',
          pinBorder: '#FED7AA',
          glow: 'rgba(234, 88, 12, 0.4)',
          text: 'Annadanam',
          iconColor: '#FFFFFF',
        };
      case 'Accommodation':
        return {
          pinBg: '#7C3AED',
          pinBorder: '#DDD6FE',
          glow: 'rgba(124, 58, 237, 0.4)',
          text: 'Lodging',
          iconColor: '#FFFFFF',
        };
      case 'Other Facility':
      default:
        return {
          pinBg: '#0284C7',
          pinBorder: '#BAE6FD',
          glow: 'rgba(2, 132, 199, 0.4)',
          text: 'Facility',
          iconColor: '#FFFFFF',
        };
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.0));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="space-y-4">
      {/* 1. Interactive Control Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#55132D]/10 text-[#55132D] flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold font-serif text-stone-900 text-sm sm:text-base leading-tight">
              Mata Tripura Sundari Campus 2D Architectural Site Plan
            </h3>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              Historical Kurmapitha hillock topography, Kalyan Sagar lake & pilgrim amenities layout
            </p>
          </div>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2">
          {/* Layer toggles */}
          <div className="hidden sm:flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200 text-xs">
            <button
              onClick={() => setShowContours((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                showContours ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Toggle elevation contour layers"
            >
              Contours
            </button>
            <button
              onClick={() => setShowTrees((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                showTrees ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Toggle tree canopy and landscape"
            >
              Greenery
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white text-stone-700 rounded-lg transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white text-stone-700 rounded-lg transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-white text-stone-700 rounded-lg transition-colors"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter Category Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 text-xs">
          <span className="font-semibold text-stone-400 text-[11px] uppercase tracking-wider shrink-0 mr-1">
            Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#55132D] text-white shadow-xs'
                    : 'bg-white border border-stone-200/90 text-stone-600 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Main 2D Architectural Map Viewport */}
      <div className="bg-[#FAF7F2] border-2 border-stone-300/80 rounded-2xl overflow-hidden shadow-sm relative min-h-[520px] lg:min-h-[580px] flex items-center justify-center">
        {/* Adding Marker Mode Indicator Banner */}
        {isAddingMarkerMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#55132D] text-white text-xs px-5 py-2 rounded-full font-bold shadow-xl border border-[#B68A36]/60 animate-bounce flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#E2BC6B]" />
            <span>Click anywhere on the campus canvas to drop a marker pin</span>
          </div>
        )}

        {/* Compass Rose Widget in Top Right */}
        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-xs border border-stone-200/90 p-2.5 rounded-2xl shadow-xs flex flex-col items-center select-none pointer-events-none">
          <div className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center relative">
            <span className="text-[10px] font-black text-rose-800 absolute -top-1 font-serif">N</span>
            <div className="w-0.5 h-4 bg-rose-700 rounded-full" />
            <div className="w-4 h-0.5 bg-stone-300 rounded-full absolute" />
          </div>
          <span className="text-[9px] font-mono font-bold text-stone-500 mt-1">1:500</span>
        </div>

        {/* Map Canvas Scale Wrapper */}
        <div
          className="w-full h-full p-4 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <svg
            viewBox="0 0 100 100"
            className={`w-full max-w-2xl aspect-square select-none ${
              isAddingMarkerMode ? 'cursor-crosshair' : 'cursor-default'
            }`}
            onClick={onMapClick}
          >
            <defs>
              {/* Architectural Campus Grid */}
              <pattern id="archGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#E9E2D5" strokeWidth="0.25" />
              </pattern>
              <pattern id="flagstonePaving" width="3" height="3" patternUnits="userSpaceOnUse">
                <rect width="3" height="3" fill="#F4EFE6" />
                <path d="M 0 1.5 L 3 1.5 M 1.5 0 L 1.5 3" stroke="#E2D7C5" strokeWidth="0.2" />
              </pattern>

              {/* Lake Gradient & Ripple Filter */}
              <linearGradient id="lakeWaterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#0284C7" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0369A1" stopOpacity="0.95" />
              </linearGradient>

              {/* Kurmapitha Hillock Terracotta Gradient */}
              <radialGradient id="kurmaHillGradient" cx="50%" cy="46%" r="50%">
                <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#FDE68A" stopOpacity="0.75" />
                <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.05" />
              </radialGradient>

              {/* Sanctum Roof Gradient (Char-Chala Bengal Dome) */}
              <radialGradient id="sanctumRoofGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#B68A36" />
                <stop offset="35%" stopColor="#800000" />
                <stop offset="100%" stopColor="#4A0012" />
              </radialGradient>

              {/* Drop Shadow for Buildings & Pins */}
              <filter id="buildingShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.6" dy="0.8" stdDeviation="0.6" floodColor="#78350F" floodOpacity="0.2" />
              </filter>
              <filter id="pinShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0.4" dy="0.6" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Base Background Ground */}
            <rect width="100" height="100" fill="#FAF6EE" />
            <rect width="100" height="100" fill="url(#archGrid)" />

            {/* Outer Compound Wall with Corner Bastions */}
            <rect
              x="6"
              y="6"
              width="88"
              height="88"
              rx="4"
              fill="none"
              stroke="#B45309"
              strokeWidth="1.2"
              strokeDasharray="4,1.5"
            />
            {/* Corner Towers / Bastions */}
            <circle cx="6" cy="6" r="2.2" fill="#D97706" stroke="#92400E" strokeWidth="0.5" />
            <circle cx="94" cy="6" r="2.2" fill="#D97706" stroke="#92400E" strokeWidth="0.5" />
            <circle cx="6" cy="94" r="2.2" fill="#D97706" stroke="#92400E" strokeWidth="0.5" />
            <circle cx="94" cy="94" r="2.2" fill="#D97706" stroke="#92400E" strokeWidth="0.5" />

            {/* ========================================================= */}
            {/* 1. KALYAN SAGAR LAKE (North-West Quadrant)                */}
            {/* ========================================================= */}
            <g id="kalyanSagarZone">
              {/* Lake Basin Water Body */}
              <path
                d="M 6,6 L 36,6 C 36,18 34,32 24,36 C 16,39 6,36 6,36 Z"
                fill="url(#lakeWaterGradient)"
                stroke="#0284C7"
                strokeWidth="1"
              />

              {/* Water Wave Ripple Lines */}
              <path
                d="M 10,12 Q 15,10 20,12 M 16,18 Q 21,16 26,18 M 12,24 Q 17,22 22,24"
                fill="none"
                stroke="#BAE6FD"
                strokeWidth="0.5"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* Masonry Ghat Steps descending to water */}
              <path
                d="M 12,28 C 16,29 20,29 23,27"
                fill="none"
                stroke="#FDE68A"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M 13,29.5 C 16,30.5 19,30.5 22,28.5"
                fill="none"
                stroke="#D97706"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Sacred Bostami Turtle Motif in Lake */}
              <g transform="translate(18, 14)">
                <ellipse cx="0" cy="0" rx="2" ry="1.4" fill="#065F46" />
                <circle cx="-2.3" cy="0" r="0.7" fill="#047857" />
                <circle cx="1.5" cy="-1.3" r="0.5" fill="#047857" />
                <circle cx="1.5" cy="1.3" r="0.5" fill="#047857" />
                <circle cx="-1.5" cy="-1.3" r="0.5" fill="#047857" />
                <circle cx="-1.5" cy="1.3" r="0.5" fill="#047857" />
              </g>

              {/* Lake Label */}
              <text x="10" y="9" fontSize="2.2" fill="#FFFFFF" fontWeight="bold" fontStyle="italic">
                Kalyan Sagar Lake
              </text>
              <text x="10" y="11.5" fontSize="1.4" fill="#E0F2FE" fontWeight="medium">
                Sacred Bostami Turtle Sanctuary
              </text>
            </g>

            {/* ========================================================= */}
            {/* 2. KURMAPITHA HILLOCK (Tortoise Shape Mound Contours)     */}
            {/* ========================================================= */}
            {showContours && (
              <g id="kurmapithaContours">
                {/* Elevation Contour 1 (Outer Mound - 5m) */}
                <ellipse
                  cx="50"
                  cy="46"
                  rx="30"
                  ry="24"
                  fill="url(#kurmaHillGradient)"
                  stroke="#F59E0B"
                  strokeWidth="0.5"
                  strokeDasharray="2,1"
                />

                {/* Elevation Contour 2 (Mid Terrace - 10m) */}
                <ellipse
                  cx="50"
                  cy="45"
                  rx="22"
                  ry="18"
                  fill="#FEF3C7"
                  fillOpacity="0.4"
                  stroke="#D97706"
                  strokeWidth="0.6"
                />

                {/* Elevation Contour 3 (Sanctum Plinth Hillock - 15m) */}
                <ellipse
                  cx="50"
                  cy="44"
                  rx="15"
                  ry="13"
                  fill="#FDE68A"
                  fillOpacity="0.5"
                  stroke="#B45309"
                  strokeWidth="0.7"
                />

                <text x="50" y="27" fontSize="1.8" fill="#92400E" fontWeight="bold" textAnchor="middle">
                  KURMAPITHA HILLOCK (SANCTUM MOUND)
                </text>
              </g>
            )}

            {/* ========================================================= */}
            {/* 3. PARIKRAMA AMBULATORY STONE PATH                       */}
            {/* ========================================================= */}
            <ellipse
              cx="50"
              cy="44"
              rx="18"
              ry="15"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeDasharray="1.5,0.5"
            />
            <text x="50" y="60.5" fontSize="1.4" fill="#B45309" fontWeight="bold" textAnchor="middle">
              CIRCUMAMBULATION CORRIDOR (PARIKRAMA)
            </text>

            {/* Pathways linking Gates to Sanctum */}
            {/* East Gate Pathway */}
            <path d="M 24,48 L 40,48" stroke="#E2BC6B" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 24,48 L 40,48" stroke="#92400E" strokeWidth="0.4" strokeDasharray="1,1" />

            {/* West Exit Pathway */}
            <path d="M 60,48 L 76,48" stroke="#E2BC6B" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 60,48 L 76,48" stroke="#92400E" strokeWidth="0.4" strokeDasharray="1,1" />

            {/* South Annadanam Pathway */}
            <path d="M 50,54 L 50,66 L 58,66 L 58,70" stroke="#E2BC6B" strokeWidth="2.2" strokeLinecap="round" fill="none" />

            {/* North Lake Ghat Pathway */}
            <path d="M 38,40 L 26,30 L 20,26" stroke="#E2BC6B" strokeWidth="2.2" strokeLinecap="round" fill="none" />

            {/* ========================================================= */}
            {/* 4. MAIN TEMPLE ARCHITECTURAL FOOTPRINT                    */}
            {/* ========================================================= */}
            <g id="mainSanctumArchitecture" filter="url(#buildingShadow)">
              {/* Outer Stone Jagati (Plinth) */}
              <rect x="42" y="36" width="16" height="16" rx="2" fill="#FAF5EF" stroke="#800000" strokeWidth="1" />

              {/* Garbhagriha Inner Sanctum Walls (Bengal Char-Chala Dome) */}
              <rect x="44" y="38" width="12" height="12" rx="1.5" fill="url(#sanctumRoofGradient)" stroke="#F59E0B" strokeWidth="0.8" />

              {/* Central Shikhar / Golden Kalasha */}
              <circle cx="50" cy="44" r="2.2" fill="#E2BC6B" stroke="#800000" strokeWidth="0.6" />
              <circle cx="50" cy="44" r="0.8" fill="#FFFFFF" />

              {/* Sanctum Entrance Doorway (facing South) */}
              <rect x="48.5" y="49.2" width="3" height="1.2" fill="#F59E0B" />

              {/* Adjoining Nat Mandir (Pillared Hall) */}
              <rect x="45" y="50" width="10" height="6.5" rx="1" fill="#FEF3C7" stroke="#92400E" strokeWidth="0.6" />
              {/* Pillar Grid Points */}
              <circle cx="46.5" cy="51.5" r="0.5" fill="#78350F" />
              <circle cx="53.5" cy="51.5" r="0.5" fill="#78350F" />
              <circle cx="46.5" cy="55" r="0.5" fill="#78350F" />
              <circle cx="53.5" cy="55" r="0.5" fill="#78350F" />
              <text x="50" y="54" fontSize="1.2" fill="#78350F" fontWeight="bold" textAnchor="middle">
                NAT MANDIR
              </text>
            </g>

            {/* ========================================================= */}
            {/* 5. AUXILIARY CAMPUS BUILDINGS                             */}
            {/* ========================================================= */}
            {/* Sri Annapurna Annadanam Hall (South) */}
            <g id="annadanamHall" filter="url(#buildingShadow)">
              <rect x="52" y="68" width="16" height="11" rx="1.5" fill="#FFEDD5" stroke="#EA580C" strokeWidth="0.7" />
              <rect x="54" y="70" width="12" height="7" rx="0.8" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="0.4" />
              <text x="60" y="74.5" fontSize="1.4" fill="#C2410C" fontWeight="bold" textAnchor="middle">
                ANNADANAM HALL
              </text>
            </g>

            {/* Matabari Mahaprasad & Peda Counter */}
            <g id="pedaCounter" filter="url(#buildingShadow)">
              <rect x="34" y="58" width="10" height="7" rx="1" fill="#FFE4E6" stroke="#E11D48" strokeWidth="0.6" />
              <text x="39" y="62.5" fontSize="1.2" fill="#BE123C" fontWeight="bold" textAnchor="middle">
                PEDA BHAWAN
              </text>
            </g>

            {/* Yatri Niwas Pilgrim Accommodation (South-West) */}
            <g id="yatriNiwas" filter="url(#buildingShadow)">
              <rect x="14" y="74" width="16" height="13" rx="2" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="0.7" />
              {/* Inner Courtyard */}
              <rect x="18" y="78" width="8" height="5" rx="0.5" fill="#FAF5FF" stroke="#C4B5FD" strokeWidth="0.4" />
              <text x="22" y="81" fontSize="1.3" fill="#6D28D9" fontWeight="bold" textAnchor="middle">
                YATRI NIWAS
              </text>
            </g>

            {/* Pilgrim Sanitation Block (North-East) */}
            <g id="restroomBlock" filter="url(#buildingShadow)">
              <rect x="70" y="24" width="12" height="8" rx="1.5" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="0.6" />
              <text x="76" y="28.5" fontSize="1.2" fill="#3730A3" fontWeight="bold" textAnchor="middle">
                RESTROOMS
              </text>
            </g>

            {/* West Main Car & Scooter Parking (Lot B) */}
            <g id="parkingGrounds">
              <rect x="74" y="70" width="16" height="14" rx="2" fill="#EFF6FF" stroke="#2563EB" strokeWidth="0.8" strokeDasharray="1.5,1" />
              {/* Parking bays line markings */}
              <line x1="77" y1="73" x2="87" y2="73" stroke="#93C5FD" strokeWidth="0.5" />
              <line x1="77" y1="76" x2="87" y2="76" stroke="#93C5FD" strokeWidth="0.5" />
              <line x1="77" y1="79" x2="87" y2="79" stroke="#93C5FD" strokeWidth="0.5" />
              <text x="82" y="82.5" fontSize="1.4" fill="#1D4ED8" fontWeight="bold" textAnchor="middle">
                PARKING LOT B
              </text>
            </g>

            {/* ========================================================= */}
            {/* 6. GREENERY, SACRED TREES & LANDSCAPING                  */}
            {/* ========================================================= */}
            {showTrees && (
              <g id="landscapeGreenery">
                {/* Ancient Sacred Banyan / Bel Tree near Kalyan Sagar */}
                <circle cx="12" cy="40" r="3" fill="#15803D" fillOpacity="0.4" />
                <circle cx="12" cy="40" r="2" fill="#16A34A" />
                <circle cx="12" cy="40" r="0.6" fill="#14532D" />

                {/* Garden Lawn South of Lake */}
                <circle cx="30" cy="24" r="2.2" fill="#22C55E" fillOpacity="0.6" />
                <circle cx="34" cy="26" r="1.8" fill="#16A34A" fillOpacity="0.6" />

                {/* Courtyard trees near Parikrama */}
                <circle cx="32" cy="42" r="1.8" fill="#16A34A" fillOpacity="0.7" />
                <circle cx="68" cy="40" r="2" fill="#16A34A" fillOpacity="0.7" />
                <circle cx="66" cy="62" r="2.2" fill="#16A34A" fillOpacity="0.7" />
                <circle cx="28" cy="70" r="2.4" fill="#16A34A" fillOpacity="0.7" />
              </g>
            )}

            {/* Gate Arch Symbols on Walls */}
            {/* East Gate 1 (Singhadwar) */}
            <g transform="translate(6, 48)">
              <rect x="-1" y="-3" width="2" height="6" fill="#800000" rx="0.5" />
              <text x="2" y="-4" fontSize="1.4" fill="#800000" fontWeight="bold">
                EAST GATE 1 (LION TORANA)
              </text>
            </g>
            {/* West Gate 4 */}
            <g transform="translate(94, 48)">
              <rect x="-1" y="-3" width="2" height="6" fill="#800000" rx="0.5" />
              <text x="-2" y="-4" fontSize="1.4" fill="#800000" fontWeight="bold" textAnchor="end">
                WEST GATE 4 (RAMP EXIT)
              </text>
            </g>

            {/* ========================================================= */}
            {/* 7. INTERACTIVE FACILITY MARKER PINS                       */}
            {/* ========================================================= */}
            {markers.map((m) => {
              if (!m.isVisible) return null;
              if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return null;

              const theme = getCategoryTheme(m.category);
              const isSelected = selectedMarker?.id === m.id;
              const isHovered = hoveredMarker?.id === m.id;

              return (
                <g
                  key={m.id}
                  transform={`translate(${m.x}, ${m.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMarker(m);
                  }}
                  onMouseEnter={() => setHoveredMarker(m)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  className="cursor-pointer transition-transform duration-200"
                  filter="url(#pinShadow)"
                >
                  {/* Selection Pulsing Ring */}
                  {isSelected && (
                    <>
                      <circle r="4.5" fill="none" stroke="#55132D" strokeWidth="0.8" opacity="0.4" className="animate-ping" />
                      <circle r="3.8" fill="none" stroke="#E2BC6B" strokeWidth="0.8" />
                    </>
                  )}

                  {/* Pin Body: Clean, High-Contrast Themed Circle */}
                  <circle
                    r={isSelected || isHovered ? 3.2 : 2.5}
                    fill={theme.pinBg}
                    stroke={isSelected ? '#F59E0B' : '#FFFFFF'}
                    strokeWidth={isSelected ? 0.9 : 0.6}
                    className="transition-all duration-200"
                  />

                  {/* Inner Category Dot/Symbol */}
                  <circle r={isSelected || isHovered ? 1.2 : 0.9} fill={theme.pinBorder} />

                  {/* Floating Clean Tooltip Badge on Hover OR Selection (No Clutter!) */}
                  {(isHovered || isSelected) && (
                    <g transform="translate(0, -5)" className="pointer-events-none select-none">
                      {/* Tooltip Background Pill */}
                      <rect
                        x="-16"
                        y="-4.5"
                        width="32"
                        height="4.8"
                        rx="1.5"
                        fill="#1C1917"
                        fillOpacity="0.95"
                        stroke="#F59E0B"
                        strokeWidth="0.3"
                      />
                      {/* Tooltip Arrow Pointer */}
                      <polygon points="0,0.5 -1.2,-0.5 1.2,-0.5" fill="#1C1917" />
                      {/* Tooltip Text */}
                      <text
                        x="0"
                        y="-1.5"
                        fontSize="1.8"
                        fill="#FFFFFF"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {m.name.length > 22 ? m.name.substring(0, 21) + '…' : m.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Map Scale Footnote */}
            <text x="6" y="97.5" fontSize="1.4" fill="#A8A29E" fontMono="true">
              MATABARI TRUST PREMISES MASTERPLAN • COORDINATE GRID SYSTEM 100x100
            </text>
          </svg>
        </div>

        {/* Legend Overlay at Bottom Right */}
        <div className="absolute bottom-3 right-4 z-20 bg-white/90 backdrop-blur-xs border border-stone-200/90 py-1.5 px-3 rounded-xl shadow-xs text-[10px] text-stone-600 hidden md:flex items-center gap-3 select-none">
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#800000]" />
            <span>Sanctum</span>
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
            <span>Kalyan Sagar</span>
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
            <span>Gates</span>
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
            <span>Annadanam</span>
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
            <span>Parking</span>
          </span>
        </div>
      </div>
    </div>
  );
}

