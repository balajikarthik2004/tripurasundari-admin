import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Compass,
  Layers,
  Info,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';

function getShortMarkerName(name = '') {
  if (name.includes('Sanctum') || name.includes('Garbhagriha')) return 'Garbhagriha';
  if (name.includes('Singh Dwar') || name.includes('West Gate')) return 'Singh Dwar (Gate 1)';
  if (name.includes('Purva Dwar') || name.includes('East Lake Gate')) return 'Purva Dwar (Gate 2)';
  if (name.includes('Parking')) return 'Parking (Lot B)';
  if (name.includes('Drinking Water') || name.includes('RO Water')) return 'RO Water';
  if (name.includes('Sanitation') || name.includes('Restrooms') || name.includes('Washrooms')) return 'Restrooms';
  if (name.includes('Help Desk') || name.includes('First Aid') || name.includes('Information')) return 'Help Desk';
  if (name.includes('Annapurna') || name.includes('Annadanam')) return 'Annapurna Hall';
  if (name.includes('Prasad') || name.includes('Peda')) return 'Prasad Stalls';
  if (name.includes('Yatri Nivas')) return 'Yatri Niwas';
  if (name.includes('Bathing Ghats')) return 'Bathing Ghats';
  if (name.includes('Turtle') || name.includes('Observation')) return 'Turtle Deck';
  return name.split('(')[0].trim().slice(0, 16);
}

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

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 1.8));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.8));
  const handleResetZoom = () => setZoom(1);

  // Category palette with clean, professional dot markers
  const getCategoryDotStyle = (category) => {
    switch (category) {
      case 'Temple':
        return { color: '#55132D', ring: '#E2BC6B', label: 'Sanctum' };
      case 'Entry Point':
        return { color: '#059669', ring: '#A7F3D0', label: 'Entrance' };
      case 'Exit Point':
        return { color: '#0D9488', ring: '#99F6E4', label: 'Exit' };
      case 'Parking':
        return { color: '#2563EB', ring: '#BFDBFE', label: 'Parking' };
      case 'Drinking Water':
        return { color: '#0891B2', ring: '#A5F3FC', label: 'Water' };
      case 'Toilets':
        return { color: '#4F46E5', ring: '#C7D2FE', label: 'Restrooms' };
      case 'Help Desk':
        return { color: '#D97706', ring: '#FDE68A', label: 'Help Desk' };
      case 'Prasad Area':
        return { color: '#E11D48', ring: '#FECDD3', label: 'Prasad' };
      case 'Annadanam Area':
        return { color: '#EA580C', ring: '#FED7AA', label: 'Annadanam' };
      case 'Accommodation':
        return { color: '#7C3AED', ring: '#DDD6FE', label: 'Yatri Niwas' };
      case 'Other Facility':
        return { color: '#0284C7', ring: '#BAE6FD', label: 'Lake & Ghat' };
      default:
        return { color: '#4B5563', ring: '#E5E7EB', label: 'Facility' };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
      {/* 1. Header Bar: Map Title & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-150">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55132D]" />
            <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base tracking-tight">
              Mata Tripura Sundari Campus Architectural Site Plan
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 block mt-0.5 font-medium">
            Widescreen architectural blueprint (West NH-8 to East Kalyan Sagar) · Click any dot to inspect facility details
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Zoom Controls */}
          <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200 text-xs shadow-2xs">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white text-stone-700 rounded-lg transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white text-stone-700 rounded-lg transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-white text-stone-700 rounded-lg transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter Category Pills (Consolidated to avoid scrollbars) */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs py-0.5">
          <span className="font-bold text-stone-400 text-[10.5px] uppercase tracking-wider shrink-0 mr-1">
            Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#55132D] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* 2b. Map Category Color Legend (Instantly understandable for first-time users and admins) */}
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 px-3 py-2 bg-stone-50/90 rounded-xl border border-stone-200/80 text-[11px] text-stone-700">
        <span className="font-bold text-stone-500 text-[10px] uppercase tracking-wider shrink-0 mr-0.5">
          Campus Legend:
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#55132D] ring-2 ring-[#E2BC6B]/60" />
          <span className="font-semibold text-stone-800">Sanctum</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669] ring-2 ring-[#A7F3D0]" />
          <span className="font-semibold text-stone-800">Gates (Entry/Exit)</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] ring-2 ring-[#BFDBFE]" />
          <span className="font-semibold text-stone-800">Parking</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0891B2] ring-2 ring-[#A5F3FC]" />
          <span className="font-semibold text-stone-800">Drinking Water</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5] ring-2 ring-[#C7D2FE]" />
          <span className="font-semibold text-stone-800">Restrooms</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] ring-2 ring-[#FDE68A]" />
          <span className="font-semibold text-stone-800">Help Desk</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] ring-2 ring-[#FED7AA]" />
          <span className="font-semibold text-stone-800">Annadanam Hall</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] ring-2 ring-[#FECDD3]" />
          <span className="font-semibold text-stone-800">Prasad Stalls</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] ring-2 ring-[#DDD6FE]" />
          <span className="font-semibold text-stone-800">Yatri Niwas</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] ring-2 ring-[#BAE6FD]" />
          <span className="font-semibold text-stone-800">Kalyan Sagar Lake</span>
        </div>
      </div>

      {/* 3. Full-Width Rectangular Architectural Canvas (2:1 Widescreen Ratio) */}
      <div className="bg-[#FAF7F0] border-2 border-stone-300 rounded-2xl overflow-hidden shadow-inner relative w-full aspect-[2/1] min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center justify-center">
        {/* Adding Marker Notification */}
        {isAddingMarkerMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#55132D] text-white text-xs px-4 py-1.5 rounded-full font-bold shadow-xl border border-amber-300 animate-bounce flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E2BC6B]" />
            <span>Click anywhere on the architectural map to place pin</span>
          </div>
        )}

        {/* Top-Left Floating Instructions Pill */}
        <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-xs border border-stone-300 px-3 py-1.5 rounded-xl shadow-xs text-xs flex items-center gap-2 select-none pointer-events-none max-w-sm hidden sm:flex">
          <div className="w-5 h-5 rounded-md bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <Info className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] text-stone-700 font-medium leading-tight">
            Click any facility marker to inspect timings, amenities, and pilgrim rules.
          </span>
        </div>

        {/* Vintage Drafting Compass Rose */}
        <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-xs border border-stone-300 px-3 py-2 rounded-xl shadow-2xs flex flex-col items-center select-none pointer-events-none">
          <div className="w-8 h-8 rounded-full border border-stone-400 flex items-center justify-center relative">
            <span className="text-[10px] font-black text-[#55132D] absolute -top-1 font-serif">N</span>
            <div className="w-0.5 h-4.5 bg-[#55132D] rounded-full" />
            <div className="w-4.5 h-0.5 bg-stone-400 rounded-full absolute" />
          </div>
          <span className="text-[9px] font-mono font-bold text-stone-600 mt-1">Scale 1:500m</span>
        </div>

        {/* Architectural Legend Badge */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-xs border border-stone-300 px-3 py-1.5 rounded-xl shadow-2xs text-[10.5px] text-stone-700 font-serif hidden sm:flex items-center gap-2 select-none pointer-events-none">
          <span className="font-bold text-stone-900">Udaipur, Tripura</span>
          <span>•</span>
          <span className="italic text-stone-600">Kurmapitha Hillock · Elevation 32m MSL</span>
          <span>•</span>
          <span className="text-[#55132D] font-semibold">Bengali Ek-Ratna Char-chala Style (1501 CE)</span>
        </div>

        {/* Scalable Drafting SVG - 200x100 Widescreen Rectangular ViewBox */}
        <div
          className="w-full h-full p-2 sm:p-4 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <svg
            viewBox="0 0 200 100"
            className={`w-full h-full select-none ${
              isAddingMarkerMode ? 'cursor-crosshair' : 'cursor-default'
            }`}
            onClick={onMapClick}
          >
            <defs>
              {/* Subtle Drafting Grid */}
              <pattern id="rectPencilGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#EAE4D7" strokeWidth="0.15" />
              </pattern>

              {/* Architectural Masonry Hatching */}
              <pattern id="hatchPencil" width="2" height="2" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="2" stroke="#66594C" strokeWidth="0.25" opacity="0.35" />
              </pattern>

              {/* Paved Flagstone Pathway */}
              <pattern id="pathwayPencil" width="3" height="3" patternUnits="userSpaceOnUse">
                <rect width="3" height="3" fill="#F4EFE6" />
                <path d="M 0 1.5 L 3 1.5 M 1.5 0 L 1.5 3" stroke="#D8CEBD" strokeWidth="0.15" />
              </pattern>

              {/* Road Dash Pattern */}
              <pattern id="roadStripes" width="4" height="2" patternUnits="userSpaceOnUse">
                <rect width="4" height="2" fill="#EAE5DC" />
                <line x1="0" y1="1" x2="2" y2="1" stroke="#D1C7B7" strokeWidth="0.3" />
              </pattern>
            </defs>

            {/* Canvas Ground Fill with Drafting Grid */}
            <rect x="2" y="2" width="196" height="96" fill="#FBF9F4" stroke="#8A7C6D" strokeWidth="0.5" />
            <rect x="2" y="2" width="196" height="96" fill="url(#rectPencilGrid)" />

            {/* Outer Campus Border (Double Drafted Line) */}
            <rect x="4" y="4" width="192" height="92" fill="none" stroke="#6B5E52" strokeWidth="0.6" strokeDasharray="4 1.5" />
            <rect x="5" y="5" width="190" height="90" fill="none" stroke="#8C7D70" strokeWidth="0.25" />

            {/* ========================================================
                1. WEST CORRIDOR: NATIONAL HIGHWAY 8 (NH-8) & ENTRANCES
               ======================================================== */}
            {/* NH-8 Road Strip */}
            <rect x="6" y="5" width="8" height="90" fill="url(#roadStripes)" stroke="#7A6D5E" strokeWidth="0.4" />
            <line x1="10" y1="5" x2="10" y2="95" stroke="#C4A86A" strokeWidth="0.35" strokeDasharray="2 1" />
            <text x="7.5" y="52" fontSize="2.2" fontFamily="sans-serif" fontWeight="bold" fill="#7A6D5E" transform="rotate(-90 7.5 52)" textAnchor="middle" letterSpacing="0.8">
              NATIONAL HIGHWAY 8 (NH-8) · UDAIPUR HIGHWAY
            </text>

            {/* West Parking Terminal (Lot B) */}
            <rect x="16" y="66" width="22" height="26" fill="#F0F4FA" stroke="#3B5998" strokeWidth="0.4" strokeDasharray="2 1" />
            <line x1="18" y1="72" x2="36" y2="72" stroke="#7A93BD" strokeWidth="0.2" />
            <line x1="18" y1="78" x2="36" y2="78" stroke="#7A93BD" strokeWidth="0.2" />
            <line x1="18" y1="84" x2="36" y2="84" stroke="#7A93BD" strokeWidth="0.2" />
            <text x="27" y="70" fontSize="1.6" fontFamily="sans-serif" fontWeight="bold" fill="#2B4978" textAnchor="middle">
              West Parking Terminal (Lot B)
            </text>
            <text x="27" y="88.5" fontSize="1.1" fontFamily="sans-serif" fill="#5A739C" textAnchor="middle">
              4-Wheelers · Two-Wheelers · Tourist Coaches
            </text>

            {/* West Gate Plaza & Singh Dwar (Gate 1) */}
            <rect x="14" y="42" width="18" height="12" fill="#F4EFE6" stroke="#2D5A43" strokeWidth="0.6" />
            <path d="M 14 48 L 32 48" stroke="#2D5A43" strokeWidth="0.3" strokeDasharray="1 0.5" />
            <text x="23" y="46.5" fontSize="1.8" fontFamily="serif" fontWeight="bold" fill="#2D5A43" textAnchor="middle">
              Singh Dwar (West Gate 1)
            </text>
            <text x="23" y="51" fontSize="1.1" fontFamily="sans-serif" fill="#4B7A63" textAnchor="middle">
              Security · Baggage Check · Footwear Counter
            </text>

            {/* ========================================================
                2. CENTRAL PILGRIM APPROACH & AMENITIES CORRIDOR
               ======================================================== */}
            {/* Ceremonial Paved Flagstone Pathway connecting West to Hillock */}
            <rect x="32" y="44" width="48" height="8" fill="url(#pathwayPencil)" stroke="#8A7B6B" strokeWidth="0.3" />
            <line x1="32" y1="48" x2="80" y2="48" stroke="#B8A794" strokeWidth="0.2" strokeDasharray="1 1" />

            {/* Yatri Niwas Pilgrim Complex (North-West) */}
            <rect x="22" y="12" width="28" height="18" fill="#F7F2FA" stroke="#5B3E7A" strokeWidth="0.45" />
            <text x="36" y="19" fontSize="1.7" fontFamily="serif" fontWeight="bold" fill="#5B3E7A" textAnchor="middle">
              Yatri Niwas Pilgrim Complex
            </text>
            <text x="36" y="23" fontSize="1.1" fontFamily="sans-serif" fill="#6B597A" textAnchor="middle">
              Pilgrim Dormitories &amp; Guest Cottages
            </text>
            <line x1="26" y1="26" x2="46" y2="26" stroke="#9E8BAE" strokeWidth="0.2" />

            {/* Purified RO Drinking Water Pavilion */}
            <rect x="56" y="30" width="16" height="10" fill="#EBF8FA" stroke="#0891B2" strokeWidth="0.4" />
            <text x="64" y="35" fontSize="1.5" fontFamily="sans-serif" fontWeight="bold" fill="#0E7490" textAnchor="middle">
              Purified RO Water Kiosk
            </text>
            <text x="64" y="38" fontSize="1.0" fontFamily="sans-serif" fill="#155E75" textAnchor="middle">
              24/7 Chilled Drinking Water
            </text>

            {/* Central Information & Help Desk */}
            <circle cx="52" cy="48" r="4.5" fill="#FFFBEB" stroke="#D97706" strokeWidth="0.5" />
            <text x="52" y="47.5" fontSize="1.3" fontFamily="sans-serif" fontWeight="bold" fill="#B45309" textAnchor="middle">
              Help Desk
            </text>
            <text x="52" y="50" fontSize="0.9" fontFamily="sans-serif" fill="#92400E" textAnchor="middle">
              Wheelchairs
            </text>

            {/* Sanitation & Restrooms Block */}
            <rect x="56" y="56" width="16" height="11" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="0.4" />
            <text x="64" y="62" fontSize="1.5" fontFamily="sans-serif" fontWeight="bold" fill="#4338CA" textAnchor="middle">
              Pilgrim Sanitation
            </text>
            <text x="64" y="65" fontSize="1.0" fontFamily="sans-serif" fill="#3730A3" textAnchor="middle">
              Modern Restrooms · Divyangjan
            </text>

            {/* ========================================================
                3. KURMAPITHA HILLOCK & MAIN TEMPLE SANCTUM
               ======================================================== */}
            {/* Concentric Tortoise-Shaped Contours (Kurmapṛṣṭhākṛti) */}
            <ellipse cx="106" cy="48" rx="34" ry="26" fill="#FAF5E8" stroke="#D1C3B0" strokeWidth="0.4" strokeDasharray="3 1" />
            <ellipse cx="106" cy="48" rx="27" ry="20" fill="#F7EEDC" stroke="#C4B49F" strokeWidth="0.4" strokeDasharray="2.5 1" />
            <ellipse cx="106" cy="48" rx="20" ry="15" fill="#F4E6CB" stroke="#B8A48B" strokeWidth="0.3" strokeDasharray="2 0.8" />
            <text x="106" y="27" fontSize="1.6" fontFamily="serif" letterSpacing="0.8" fill="#8C7B68" textAnchor="middle" fontWeight="bold">
              KURMAPITHA HILLOCK (SANCTUM MOUND · ELEVATION 32M)
            </text>

            {/* Parikrama Ambulatory Court */}
            <rect x="92" y="34" width="28" height="28" rx="2" fill="url(#pathwayPencil)" stroke="#66594C" strokeWidth="0.5" />

            {/* Inner Sanctum Plinth */}
            <rect x="97" y="39" width="18" height="18" fill="#EFE8DC" stroke="#3A2E26" strokeWidth="0.8" />
            <rect x="97" y="39" width="18" height="18" fill="url(#hatchPencil)" />

            {/* Char-Chala Vault Curved Roof (Ek-Ratna Bengal Style) */}
            <path
              d="M 97 39 Q 106 35 115 39 Q 118 48 115 57 Q 106 61 97 57 Q 94 48 97 39 Z"
              fill="#E8DFC8"
              stroke="#3A2E26"
              strokeWidth="0.7"
            />
            {/* Central Sacred Shikhara Kalasha Finial */}
            <circle cx="106" cy="48" r="3.2" fill="#B68A36" stroke="#3A2E26" strokeWidth="0.5" />
            <circle cx="106" cy="48" r="1.2" fill="#55132D" />

            <text x="106" y="44" fontSize="2.0" fontFamily="serif" fontWeight="bold" fill="#3A2E26" textAnchor="middle">
              Garbhagriha
            </text>
            <text x="106" y="53" fontSize="1.3" fontFamily="sans-serif" fontWeight="bold" fill="#55132D" textAnchor="middle">
              Maa Tripura Sundari (1501 CE)
            </text>

            {/* Natmandir (Pillared Assembly Hall to the West of Sanctum) */}
            <rect x="83" y="42" width="9" height="12" fill="#F4EFE6" stroke="#3A2E26" strokeWidth="0.5" />
            {/* Natmandir pillars */}
            <circle cx="85" cy="44" r="0.4" fill="#3A2E26" />
            <circle cx="90" cy="44" r="0.4" fill="#3A2E26" />
            <circle cx="85" cy="48" r="0.4" fill="#3A2E26" />
            <circle cx="90" cy="48" r="0.4" fill="#3A2E26" />
            <circle cx="85" cy="52" r="0.4" fill="#3A2E26" />
            <circle cx="90" cy="52" r="0.4" fill="#3A2E26" />
            <text x="87.5" y="47.5" fontSize="1.1" fontFamily="serif" fill="#55132D" textAnchor="middle" fontWeight="bold" transform="rotate(-90 87.5 47.5)">
              Natmandir
            </text>

            {/* Chandi Mandap / Yajna Shala (North of Sanctum) */}
            <rect x="100" y="16" width="16" height="8" fill="#FDF6EB" stroke="#B45309" strokeWidth="0.4" />
            <circle cx="108" cy="20" r="1.5" fill="none" stroke="#D97706" strokeWidth="0.3" strokeDasharray="0.8 0.4" />
            <text x="108" y="21" fontSize="1.2" fontFamily="serif" fill="#92400E" textAnchor="middle" fontWeight="bold">
              Chandi Mandap &amp; Yajna Shala
            </text>

            {/* Sri Annapurna Annadanam Free Bhog Hall (North-East) */}
            <rect x="122" y="14" width="22" height="14" fill="#FFF7ED" stroke="#EA580C" strokeWidth="0.4" />
            <text x="133" y="20" fontSize="1.5" fontFamily="serif" fontWeight="bold" fill="#C2410C" textAnchor="middle">
              Sri Annapurna Hall
            </text>
            <text x="133" y="24" fontSize="1.0" fontFamily="sans-serif" fill="#9A3412" textAnchor="middle">
              Free Mahaprasad Dining (12:30–2:30 PM)
            </text>

            {/* Matabari Peda & Prasadam Cooperative Stalls (South) */}
            <rect x="94" y="70" width="26" height="12" fill="#FFF1F2" stroke="#E11D48" strokeWidth="0.4" />
            <text x="107" y="76" fontSize="1.6" fontFamily="serif" fontWeight="bold" fill="#BE123C" textAnchor="middle">
              Matabari Peda &amp; Prasad Stalls
            </text>
            <text x="107" y="80" fontSize="1.0" fontFamily="sans-serif" fill="#9F1239" textAnchor="middle">
              Pure Condensed Milk Peda · Consecrated Offerings
            </text>

            {/* East Gate 2 / Purva Dwar */}
            <rect x="138" y="43" width="10" height="10" fill="#F4EFE6" stroke="#0D9488" strokeWidth="0.5" />
            <line x1="143" y1="43" x2="143" y2="53" stroke="#0D9488" strokeWidth="0.3" strokeDasharray="1 0.5" />
            <text x="143" y="47.5" fontSize="1.4" fontFamily="serif" fontWeight="bold" fill="#0F766E" textAnchor="middle">
              Purva Dwar
            </text>
            <text x="143" y="50.5" fontSize="0.9" fontFamily="sans-serif" fill="#115E59" textAnchor="middle">
              (East Gate 2)
            </text>

            {/* ========================================================
                4. EAST SECTOR: SACRED KALYAN SAGAR LAKE (6.4 ACRES)
               ======================================================== */}
            {/* Kalyan Sagar Water Reservoir */}
            <path
              d="M 152 8 C 165 7, 185 10, 192 18 C 196 28, 196 68, 192 82 C 185 91, 164 94, 152 91 C 146 76, 146 22, 152 8 Z"
              fill="#EBF3F5"
              stroke="#3D687A"
              strokeWidth="0.7"
            />
            {/* Water Ripple Ink Contours */}
            <path
              d="M 156 18 C 166 16, 178 18, 184 25 M 158 30 C 168 28, 182 31, 186 38 M 158 45 C 168 44, 180 47, 186 54 M 158 60 C 168 59, 182 63, 186 70 M 156 75 C 166 76, 178 78, 184 83"
              fill="none"
              stroke="#6B8D9E"
              strokeWidth="0.3"
              strokeDasharray="2 1"
            />

            {/* Kalyan Sagar Lake Name Title */}
            <text x="172" y="32" fontSize="2.8" fontFamily="serif" fontStyle="italic" fill="#204050" textAnchor="middle" fontWeight="bold">
              Kalyan Sagar Lake
            </text>
            <text x="172" y="36.5" fontSize="1.3" fontFamily="sans-serif" fill="#42697D" textAnchor="middle">
              6.4 Acres Sacred Holy Reservoir
            </text>

            {/* Bostami Turtle Sanctuary Annotation */}
            <ellipse cx="172" cy="46" rx="14" ry="7" fill="#E2EDF0" stroke="#3D687A" strokeWidth="0.3" strokeDasharray="1.5 0.8" />
            <text x="172" y="45.5" fontSize="1.3" fontFamily="serif" fontWeight="bold" fill="#204050" textAnchor="middle">
              Bostami Turtle Sanctuary
            </text>
            <text x="172" y="48.5" fontSize="1.0" fontFamily="sans-serif" fill="#4B7285" textAnchor="middle">
              (Nilssonia nigricans habitat)
            </text>

            {/* Stepped Bathing Ghats (Kalvansagar Ghat) */}
            <rect x="146" y="52" width="8" height="18" fill="#F4EFE6" stroke="#5C4E43" strokeWidth="0.4" />
            <line x1="148" y1="55" x2="152" y2="55" stroke="#5C4E43" strokeWidth="0.3" />
            <line x1="148" y1="58" x2="152" y2="58" stroke="#5C4E43" strokeWidth="0.3" />
            <line x1="148" y1="61" x2="152" y2="61" stroke="#5C4E43" strokeWidth="0.3" />
            <line x1="148" y1="64" x2="152" y2="64" stroke="#5C4E43" strokeWidth="0.3" />
            <line x1="148" y1="67" x2="152" y2="67" stroke="#5C4E43" strokeWidth="0.3" />
            <text x="150" y="73" fontSize="1.1" fontFamily="sans-serif" fontWeight="bold" fill="#5C4E43" textAnchor="middle">
              Ghat Steps
            </text>

            {/* Turtle Feeding Observation Deck */}
            <rect x="162" y="60" width="18" height="8" rx="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.4" />
            <text x="171" y="64.5" fontSize="1.2" fontFamily="sans-serif" fontWeight="bold" fill="#92400E" textAnchor="middle">
              Feeding Platform
            </text>
            <text x="171" y="67" fontSize="0.9" fontFamily="sans-serif" fill="#B45309" textAnchor="middle">
              Approved Puffed Rice Only
            </text>

            {/* ========================================================
                5. CONNECTING HERITAGE CORRIDORS & PATHWAYS
               ======================================================== */}
            <path
              d="M 32 48 L 83 48 M 120 48 L 138 48 M 148 48 L 152 48 M 106 62 L 106 70 M 106 34 L 106 24 M 64 40 L 64 44 M 64 52 L 64 56 M 36 30 L 36 44 M 27 66 L 27 54"
              fill="none"
              stroke="#B3A28F"
              strokeWidth="1.2"
              strokeDasharray="1 0.8"
            />

            {/* ========================================================
                6. INTERACTIVE PINPOINT MARKERS (Dots)
               ======================================================== */}
            {markers.map((marker) => {
              const isSelected = selectedMarker?.id === marker.id;
              const isHovered = hoveredMarker?.id === marker.id;
              const theme = getCategoryDotStyle(marker.category);
              const shortName = getShortMarkerName(marker.name);

              // Calculate positions for 200x100 rectangular layout
              // If marker.x is percentage (0-100), map to 0-200. If already > 100, use as-is.
              const posX = marker.x <= 100 ? (marker.x / 100) * 200 : marker.x;
              const posY = marker.y;

              return (
                <g
                  key={marker.id}
                  transform={`translate(${posX}, ${posY})`}
                  className="cursor-pointer transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMarker(marker);
                  }}
                  onMouseEnter={() => setHoveredMarker(marker)}
                  onMouseLeave={() => setHoveredMarker(null)}
                >
                  {/* Subtle Pulse Halo when Selected or Hovered */}
                  {(isSelected || isHovered) && (
                    <circle
                      r="4.5"
                      fill={theme.color}
                      opacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer Ring */}
                  <circle
                    r={isSelected ? '3.0' : '2.3'}
                    fill="#FFFFFF"
                    stroke={theme.color}
                    strokeWidth={isSelected ? '0.8' : '0.55'}
                    filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.3))"
                  />

                  {/* Core Pin Dot */}
                  <circle
                    r={isSelected ? '2.0' : '1.4'}
                    fill={theme.color}
                  />

                  {/* Center Accent White Dot */}
                  <circle
                    r="0.5"
                    fill="#FFFFFF"
                  />

                  {/* Always-Visible Concise Facility Label Badge */}
                  <g transform="translate(0, 4.0)" className="pointer-events-none select-none">
                    <rect
                      x={-((shortName.length * 1.35 + 4.2) / 2)}
                      y="-1.9"
                      width={shortName.length * 1.35 + 4.2}
                      height="3.8"
                      rx="0.9"
                      fill="#FFFFFF"
                      fillOpacity="0.96"
                      stroke={theme.color}
                      strokeWidth="0.3"
                      filter="drop-shadow(0px 0.8px 1.5px rgba(0,0,0,0.18))"
                    />
                    <text
                      x="0"
                      y="0.8"
                      fontSize="1.7"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fontWeight="bold"
                      fill={theme.color}
                      textAnchor="middle"
                    >
                      {shortName}
                    </text>
                  </g>

                  {/* On-Map Floating Name Tooltip */}
                  {(isHovered || isSelected) && (
                    <g transform="translate(0, -5)" className="pointer-events-none z-40">
                      <rect
                        x="-23"
                        y="-5.5"
                        width="46"
                        height="6.4"
                        rx="1.2"
                        fill="#55132D"
                        stroke="#E2BC6B"
                        strokeWidth="0.25"
                        filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.45))"
                      />
                      <text
                        x="0"
                        y="-1.4"
                        fontSize="1.7"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        fill="#FFFFFF"
                        textAnchor="middle"
                      >
                        {marker.name.length > 24 ? marker.name.slice(0, 22) + '...' : marker.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
