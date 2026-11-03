import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Users, ShieldAlert, CheckCircle2, User } from 'lucide-react';

export default function IllustrativeTempleMap({
  mode = 'crowd', // 'crowd' | 'staff'
  zones = [],
  staff = [],
  selectedZoneId = null,
  onSelectZone,
  selectedStaffId = null,
  onSelectStaff,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

  const getDensityColor = (densityStatus) => {
    switch (densityStatus) {
      case 'Critical':
        return { fill: 'rgba(225, 29, 72, 0.25)', stroke: '#E11D48', text: '#BE123C', badge: 'bg-rose-600' };
      case 'High':
        return { fill: 'rgba(234, 88, 12, 0.22)', stroke: '#EA580C', text: '#C2410C', badge: 'bg-orange-600' };
      case 'Moderate':
        return { fill: 'rgba(217, 119, 6, 0.20)', stroke: '#D97706', text: '#B45309', badge: 'bg-amber-500' };
      case 'Normal':
      default:
        return { fill: 'rgba(16, 185, 129, 0.16)', stroke: '#10B981', text: '#047857', badge: 'bg-emerald-600' };
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Security Supervisor':
        return 'bg-purple-600 text-white';
      case 'Crowd Coordinator':
        return 'bg-[#55132D] text-white';
      case 'Safety Marshal':
        return 'bg-rose-600 text-white';
      case 'Parking Coordinator':
        return 'bg-blue-600 text-white';
      case 'Help Desk Staff':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-stone-700 text-white';
    }
  };

  return (
    <div className="relative bg-[#F8F5EF] rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden select-none">
      {/* Top Map Header & Controls */}
      <div className="absolute top-3 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#55132D] animate-ping" />
          <span className="text-[10px] font-bold tracking-wider text-stone-700 uppercase">
            {mode === 'crowd'
              ? 'TEMPLE PREMISES OPERATIONS MAP · LIVE INCIDENTS'
              : 'STAFF & SECURITY DEPLOYMENT MAP · ACTIVE SECTORS'}
          </span>
        </div>

        {/* Map Zoom Tools */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur-xs p-1 rounded-xl border border-stone-200 shadow-2xs flex items-center gap-1">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            title="Fit to View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full h-[520px] overflow-hidden flex items-center justify-center p-4">
        <div
          className="w-full h-full max-w-4xl transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            {/* Background Map Grid & Compass Watermark */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e7e5e4" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" rx="4" />

            {/* Sacred Lake Feature: Kalyan Sagar (Water Area Graphic) */}
            <path
              d="M 4 64 Q 20 62 38 64 Q 40 85 36 94 Q 15 96 4 94 Z"
              fill="#E0F2FE"
              stroke="#7DD3FC"
              strokeWidth="0.8"
            />
            <text x="18" y="82" fontSize="2.8" fontWeight="bold" fill="#0369A1" opacity="0.8" textAnchor="middle">
              KALYAN SAGAR LAKE
            </text>
            <text x="18" y="86" fontSize="1.8" fill="#0284C7" opacity="0.8" textAnchor="middle">
              (Sacred Turtle Habitat)
            </text>

            {/* Zones Render */}
            {zones.map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              const { fill, stroke, text } = getDensityColor(zone.densityStatus);
              const { x, y, width, height } = zone.mapCoords;
              const occPercent = Math.min(100, Math.round((zone.currentOccupancy / zone.capacity) * 100));

              return (
                <g
                  key={zone.id}
                  onClick={() => onSelectZone && onSelectZone(zone)}
                  className="cursor-pointer transition-all duration-150 group"
                >
                  {/* Zone Polygon / Rect */}
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx="2"
                    fill={fill}
                    stroke={isSelected ? '#55132D' : stroke}
                    strokeWidth={isSelected ? '1.2' : '0.7'}
                    strokeDasharray={zone.type.includes('Sanctuary') ? 'none' : '1.5 0.8'}
                    className="group-hover:opacity-90"
                  />

                  {/* Zone Label Pin & Text */}
                  <rect
                    x={x + 1}
                    y={y + 1}
                    width={width - 2}
                    height="4.5"
                    rx="1"
                    fill="#FFFFFF"
                    opacity="0.9"
                  />
                  <text
                    x={x + width / 2}
                    y={y + 3.8}
                    fontSize="2.1"
                    fontWeight="bold"
                    fill="#1C1917"
                    textAnchor="middle"
                  >
                    {zone.name.split('&')[0].trim()}
                  </text>

                  {/* Mode = Crowd: Density status & occupancy */}
                  {mode === 'crowd' && (
                    <>
                      <rect
                        x={x + width / 2 - 8}
                        y={y + height - 5}
                        width="16"
                        height="3.6"
                        rx="1"
                        fill="#FFFFFF"
                        stroke={stroke}
                        strokeWidth="0.3"
                      />
                      <text
                        x={x + width / 2}
                        y={y + height - 2.5}
                        fontSize="1.9"
                        fontWeight="bold"
                        fill={text}
                        textAnchor="middle"
                      >
                        {zone.currentOccupancy}/{zone.capacity} ({occPercent}%)
                      </text>
                    </>
                  )}

                  {/* Mode = Staff: Assigned staff badge count */}
                  {mode === 'staff' && (
                    <g transform={`translate(${x + width - 5.5}, ${y + height - 5.5})`}>
                      <circle cx="2.5" cy="2.5" r="2.5" fill="#55132D" />
                      <text x="2.5" y="3.4" fontSize="2" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                        {staff.filter((s) => s.assignedZoneId === zone.id).length}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Mode = Staff: Plot Individual Staff Markers */}
            {mode === 'staff' &&
              staff.map((member) => {
                if (!member.mapCoords) return null;
                const isSelected = selectedStaffId === member.id;
                const { x, y } = member.mapCoords;
                const initials = member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2);

                return (
                  <g
                    key={member.id}
                    transform={`translate(${x}, ${y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStaff && onSelectStaff(member);
                    }}
                    className="cursor-pointer transition-transform hover:scale-125"
                  >
                    {/* Ring highlight if selected */}
                    {isSelected && (
                      <circle cx="0" cy="0" r="4.2" fill="none" stroke="#E2BC6B" strokeWidth="0.8" />
                    )}

                    {/* Member marker circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r="3.2"
                      fill={member.status === 'On Break' ? '#D97706' : '#55132D'}
                      stroke="#FFFFFF"
                      strokeWidth="0.6"
                    />
                    <text x="0" y="1" fontSize="1.8" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                      {initials}
                    </text>

                    {/* Mini Role Tooltip on hover */}
                    <title>{`${member.name} (${member.role}) • ${member.assignedZoneName}`}</title>
                  </g>
                );
              })}
          </svg>
        </div>
      </div>

      {/* Bottom Map Legend */}
      <div className="px-5 py-3 bg-white/95 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {mode === 'crowd' ? (
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-600">
            <span className="font-semibold text-stone-800">Crowd Density Tiers:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Normal (&lt;50%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Moderate (50-70%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <span>High (70-85%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
              <span>Critical (&gt;85%)</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-600">
            <span className="font-semibold text-stone-800">Staff Status:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#55132D]" />
              <span>On Duty Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>On Break</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
              <span>Unassigned / Off Duty</span>
            </div>
          </div>
        )}

        <div className="text-[10px] text-stone-400">
          Click any zone or marker to inspect details, queues, and duty personnel
        </div>
      </div>
    </div>
  );
}

