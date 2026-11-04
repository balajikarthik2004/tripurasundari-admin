import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Landmark,
  Bell,
  Flame,
  ChevronDown,
  Info,
} from 'lucide-react';

// Sacred Golden Lotus Motif for card and bottom flourish
function WhiskerLotusMotif({ className = 'w-32 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 120 20" fill="none">
      <line x1="5" y1="10" x2="45" y2="10" stroke="#C88728" strokeWidth="0.8" opacity="0.6" />
      <circle cx="45" cy="10" r="1.5" fill="#C88728" opacity="0.8" />
      <path
        d="M 60 2 C 57 6, 57 14, 60 18 C 63 14, 63 6, 60 2 Z"
        stroke="#C88728"
        strokeWidth="1.2"
        fill="#C88728"
        fillOpacity="0.25"
      />
      <path
        d="M 52 7 C 49 10, 52 14, 60 17 C 55 13, 53 9, 52 7 Z"
        stroke="#C88728"
        strokeWidth="0.9"
        fill="none"
      />
      <path
        d="M 68 7 C 71 10, 68 14, 60 17 C 65 13, 67 9, 68 7 Z"
        stroke="#C88728"
        strokeWidth="0.9"
        fill="none"
      />
      <circle cx="75" cy="10" r="1.5" fill="#C88728" opacity="0.8" />
      <line x1="75" y1="10" x2="115" y2="10" stroke="#C88728" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

// Kalash Vessel SVG for Abhishekam
function KalashIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L14 5H10L12 2Z"
        fill="#8C3220"
        stroke="#8C3220"
        strokeWidth="1.2"
      />
      <ellipse cx="12" cy="7" rx="3" ry="1.5" fill="#8C3220" />
      <path
        d="M8 8.5C6 11 6 15 8 18C10 20 14 20 16 18C18 15 18 11 16 8.5H8Z"
        stroke="#8C3220"
        strokeWidth="1.5"
        fill="#8C3220"
        fillOpacity="0.15"
      />
      <path d="M9 19.5H15" stroke="#8C3220" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Sacred Flower SVG for Special Pooja
function LotusFlowerIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4C10.5 7.5 10.5 12 12 15C13.5 12 13.5 7.5 12 4Z"
        stroke="#8C3220"
        strokeWidth="1.5"
        fill="#8C3220"
        fillOpacity="0.2"
      />
      <path
        d="M8 9C6.5 11.5 7.5 14 12 15C10 13 8.5 11 8 9Z"
        stroke="#8C3220"
        strokeWidth="1.3"
      />
      <path
        d="M16 9C17.5 11.5 16.5 14 12 15C14 13 15.5 11 16 9Z"
        stroke="#8C3220"
        strokeWidth="1.3"
      />
      <path d="M6 18C10 20 14 20 18 18" stroke="#8C3220" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function BookingDemandMatrix({ onCellClick }) {
  const [selectedPeriod, setSelectedPeriod] = useState('7 Days'); // 'Today' | '7 Days' | '30 Days'
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [hoveredCell, setHoveredCell] = useState(null);

  // Exact 6 Time Slot Columns matching Reference Image
  const timeSlotColumns = [
    {
      id: 'slot-1',
      time: '05–07 AM',
      period: 'Early Morning',
      icon: <span className="text-amber-500 text-xs">🌅</span>,
      border: 'border-t-amber-400',
    },
    {
      id: 'slot-2',
      time: '07–10 AM',
      period: 'Morning',
      icon: <span className="text-amber-500 text-xs">☀️</span>,
      border: 'border-t-amber-500',
    },
    {
      id: 'slot-3',
      time: '10–01 PM',
      period: 'Forenoon',
      icon: <span className="text-[#8C3220] text-xs">🛕</span>,
      border: 'border-t-[#8C3220]',
    },
    {
      id: 'slot-4',
      time: '01–04 PM',
      period: 'Afternoon',
      icon: <span className="text-amber-600 text-xs">🌤️</span>,
      border: 'border-t-amber-600',
    },
    {
      id: 'slot-5',
      time: '04–06 PM',
      period: 'Evening',
      icon: <span className="text-orange-600 text-xs">🌇</span>,
      border: 'border-t-orange-600',
    },
    {
      id: 'slot-6',
      time: '06–09 PM',
      period: 'Night',
      icon: <span className="text-indigo-900 text-xs">🌙</span>,
      border: 'border-t-indigo-900',
    },
  ];

  // Configured Capacities and Booking Counts across 5 offerings
  // Sum for 7 Days: 24,169 + 5,447 + 4,117 + 2,212 + 2,949 = 38,894 bookings.
  const serviceRowsData = [
    {
      id: 'darshan',
      name: 'Darshan',
      icon: <Landmark className="w-4 h-4 text-[#8C3220]" />,
      baseCounts7d: [2180, 3920, 5264, 3715, 4830, 4260],
      baseCapacities7d: [4000, 4800, 5600, 4800, 5600, 5200],
    },
    {
      id: 'archana',
      name: 'Archana',
      icon: <Bell className="w-4 h-4 text-[#8C3220]" />,
      baseCounts7d: [365, 820, 1246, 980, 1164, 872],
      baseCapacities7d: [900, 1200, 1500, 1250, 1450, 1200],
    },
    {
      id: 'abhishekam',
      name: 'Abhishekam',
      icon: <KalashIcon className="w-4 h-4 text-[#8C3220]" />,
      baseCounts7d: [276, 610, 940, 748, 902, 641],
      baseCapacities7d: [600, 1000, 1300, 1200, 1300, 1000],
    },
    {
      id: 'havan',
      name: 'Havan',
      icon: <Flame className="w-4 h-4 text-[#8C3220]" />,
      baseCounts7d: [112, 346, 528, 420, 496, 310],
      baseCapacities7d: [300, 750, 750, 750, 750, 750],
    },
    {
      id: 'special-pooja',
      name: 'Special Pooja',
      icon: <LotusFlowerIcon className="w-4 h-4 text-[#8C3220]" />,
      baseCounts7d: [156, 402, 690, 582, 648, 471],
      baseCapacities7d: [400, 900, 1000, 1000, 1000, 1000],
    },
  ];

  // Scale multiplier for date period
  const multiplier = selectedPeriod === 'Today' ? 1 / 7 : selectedPeriod === '30 Days' ? 30 / 7 : 1;
  const numDays = selectedPeriod === 'Today' ? 1 : selectedPeriod === '7 Days' ? 7 : 30;

  // Process rows with actual scaled values
  const processedRows = useMemo(() => {
    return serviceRowsData.map((row) => {
      const counts = row.baseCounts7d.map((val) =>
        selectedPeriod === '7 Days' ? val : Math.round(val * multiplier)
      );
      const capacities = row.baseCapacities7d.map((cap) =>
        selectedPeriod === '7 Days' ? cap : Math.round(cap * multiplier)
      );
      const utilizations = counts.map((c, i) => {
        const cap = capacities[i] || 1;
        return Math.min(100, Math.round((c / cap) * 100));
      });

      return {
        ...row,
        counts,
        capacities,
        utilizations,
      };
    });
  }, [selectedPeriod, multiplier]);

  // Filter rows if individual service selected
  const visibleRows = useMemo(() => {
    if (serviceFilter === 'All Services') return processedRows;
    return processedRows.filter((r) => r.name.toLowerCase() === serviceFilter.toLowerCase());
  }, [processedRows, serviceFilter]);

  // DYNAMIC SUMMARY: Strictly equals the sum of displayed matrix cells
  const summary = useMemo(() => {
    let total = 0;
    const colTotals = [0, 0, 0, 0, 0, 0];
    const rowTotals = {};

    visibleRows.forEach((row) => {
      let rowSum = 0;
      row.counts.forEach((cnt, colIdx) => {
        total += cnt;
        rowSum += cnt;
        colTotals[colIdx] += cnt;
      });
      rowTotals[row.name] = rowSum;
    });

    const avgDaily = Math.round(total / numDays);

    let maxColVal = -1;
    let peakColIdx = 2; // Default to Forenoon 10-01 PM
    colTotals.forEach((val, idx) => {
      if (val > maxColVal) {
        maxColVal = val;
        peakColIdx = idx;
      }
    });
    const peakSlotName = timeSlotColumns[peakColIdx]?.time || '10–01 PM';

    let peakServiceName = visibleRows[0]?.name || 'Darshan';
    let maxRowVal = -1;
    Object.entries(rowTotals).forEach(([name, sum]) => {
      if (sum > maxRowVal) {
        maxRowVal = sum;
        peakServiceName = name;
      }
    });

    const dateRangeLabel =
      selectedPeriod === 'Today'
        ? 'Today: 31 Oct 2026'
        : selectedPeriod === '7 Days'
        ? 'Last 7 Days: 24 Oct – 30 Oct 2026'
        : 'Last 30 Days: 01 Oct – 30 Oct 2026';

    const title =
      selectedPeriod === 'Today'
        ? "Today's Summary"
        : selectedPeriod === '7 Days'
        ? '7-Day Summary'
        : '30-Day Summary';

    return {
      title,
      dateRangeLabel,
      totalBookings: total.toLocaleString(),
      avgDaily: avgDaily.toLocaleString(),
      peakSlot: peakSlotName,
      peakService: peakServiceName,
    };
  }, [visibleRows, selectedPeriod, numDays]);

  // Precise Utilization Styling:
  // >=90%: High (Deep Burgundy #751838)
  // 75-89%: Busy (Vibrant Orange #EA580C)
  // 50-74%: Moderate (Amber #FACC15)
  // <50%: Low (Pale Cream #FEF9C3)
  const getCapsuleStyle = (utilization) => {
    if (utilization >= 90) {
      return 'bg-[#751838] text-white font-bold shadow-xs';
    }
    if (utilization >= 75) {
      return 'bg-[#EA580C] text-white font-bold shadow-xs';
    }
    if (utilization >= 50) {
      return 'bg-[#FACC15] text-stone-900 font-bold border border-[#CA8A04]/60 shadow-2xs';
    }
    return 'bg-[#FEF9C3] text-stone-800 font-medium border border-[#FDE047]/60 shadow-2xs';
  };

  return (
    <div className="bg-[#FFFDF9] rounded-2xl sm:rounded-3xl border border-[#EFE5D5] shadow-xs p-4 sm:p-5 relative">
      {/* 1. Header with Controls and Filter Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EFE5D5]/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#55132D] font-serif tracking-tight leading-snug">
              Booking Demand Matrix
            </h2>
            <p className="text-[11.5px] text-stone-500 font-sans">
              Service-wise demand across time slots <span className="font-semibold text-stone-700">({summary.title})</span>
            </p>
          </div>
        </div>

        {/* Right Toolbar: Period Badge + Toggle Buttons + Service Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Explicit Demand Reporting Period Badge */}
          <div className="px-2.5 py-1 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#9F1239] text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>{summary.dateRangeLabel}</span>
          </div>

          {/* Date Period Filter Toggle */}
          <div className="inline-flex rounded-xl bg-[#F5EBE1] p-0.5 border border-[#EFE5D5]">
            {['Today', '7 Days', '30 Days'].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-[#751838] text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Service Filter Dropdown */}
          <div className="relative inline-block">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="appearance-none bg-white border border-[#EFE5D5] rounded-xl pl-3 pr-8 py-1 text-xs font-semibold text-stone-700 shadow-2xs cursor-pointer focus:outline-none focus:border-[#751838]"
            >
              <option value="All Services">All Services</option>
              <option value="Darshan">Darshan</option>
              <option value="Archana">Archana</option>
              <option value="Abhishekam">Abhishekam</option>
              <option value="Havan">Havan</option>
              <option value="Special Pooja">Special Pooja</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Main Content: Grid of Matrix Table + Dual-Column Side Panel */}
      <div className="flex flex-col xl:flex-row items-start gap-4">
        {/* Left: 6-Slot Demand Matrix Table (Fluid and responsive, no horizontal scroll) */}
        <div className="flex-1 w-full overflow-x-auto custom-scrollbar">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                {/* Offering Title Header */}
                <th className="w-[15%] pb-2.5 text-left text-[11px] font-bold text-stone-500 uppercase tracking-wider pl-1">
                  Offering
                </th>

                {/* 6 Time Slot Columns */}
                {timeSlotColumns.map((slot) => (
                  <th key={slot.id} className="w-[14.16%] pb-2.5 px-0.5 text-center">
                    <div
                      className={`mx-auto w-full max-w-[94px] py-1.5 px-1 rounded-xl bg-[#FFFDF7] border border-[#FDE68A]/70 border-t-2 ${slot.border} shadow-2xs flex flex-col items-center justify-center`}
                    >
                      <div className="flex items-center gap-1 text-[11px] font-bold text-stone-900 leading-tight">
                        {slot.icon}
                        <span className="whitespace-nowrap">{slot.time}</span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium mt-0.5 truncate">
                        {slot.period}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id} className="hover:bg-[#FFF9F2]/50 transition-colors">
                  {/* Row Service Header */}
                  <td className="py-2 pl-1 pr-2 whitespace-nowrap align-middle">
                    <div className="flex items-center gap-2 font-bold text-stone-900 font-sans text-xs">
                      <div className="w-6 h-6 rounded-lg bg-[#FAF5EE] border border-[#EFE5D5] flex items-center justify-center shrink-0">
                        {row.icon}
                      </div>
                      <span className="truncate">{row.name}</span>
                    </div>
                  </td>

                  {/* 6 Time Slot Capsule Cells */}
                  {timeSlotColumns.map((col, colIndex) => {
                    const count = row.counts[colIndex];
                    const capacity = row.capacities[colIndex];
                    const utilization = row.utilizations[colIndex];
                    const capsuleStyle = getCapsuleStyle(utilization);

                    return (
                      <td key={col.id} className="py-1.5 px-0.5 text-center align-middle">
                        <button
                          type="button"
                          onMouseEnter={() =>
                            setHoveredCell({
                              service: row.name,
                              time: col.time,
                              period: col.period,
                              count,
                              capacity,
                              utilization,
                              dateRange: summary.dateRangeLabel,
                            })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() =>
                            onCellClick &&
                            onCellClick({
                              category: row.name,
                              timeSlot: col.time,
                              datePeriod: selectedPeriod,
                            })
                          }
                          className={`mx-auto w-[62px] sm:w-[68px] h-[32px] rounded-full flex items-center justify-center text-xs tracking-tight transition-transform hover:scale-105 cursor-pointer focus:outline-none ${capsuleStyle}`}
                          title={`${row.name} at ${col.time}: ${count.toLocaleString()} bookings (${utilization}% capacity utilization)`}
                        >
                          {count.toLocaleString()}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Side: Dual-Column Summary & Utilization Card (Directly matches Reference Image) */}
        <div className="w-full xl:w-[325px] 2xl:w-[340px] shrink-0 bg-white rounded-2xl border border-[#EFE5D5] p-3 shadow-2xs">
          <div className="grid grid-cols-2 gap-3 divide-x divide-stone-150">
            {/* Column 1: Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 pb-1 border-b border-stone-150">
                <span className="text-[#55132D] text-xs">📊</span>
                <h3 className="font-bold text-[#55132D] font-serif text-xs">
                  {summary.title}
                </h3>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div>
                  <div className="text-stone-500 text-[10px]">Total Bookings</div>
                  <div className="font-bold text-stone-900 font-sans text-xs">
                    {summary.totalBookings}
                  </div>
                </div>
                <div>
                  <div className="text-stone-500 text-[10px]">Avg. Daily Bookings</div>
                  <div className="font-bold text-stone-900 font-sans text-xs">
                    {summary.avgDaily}
                  </div>
                </div>
                <div>
                  <div className="text-stone-500 text-[10px]">Peak Slot</div>
                  <div className="font-bold text-stone-900 font-sans text-xs">
                    {summary.peakSlot}
                  </div>
                </div>
                <div>
                  <div className="text-stone-500 text-[10px]">Peak Service</div>
                  <div className="font-bold text-stone-900 font-sans text-xs">
                    {summary.peakService}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Utilization Legend */}
            <div className="pl-3 space-y-2">
              <h3 className="font-bold text-stone-900 text-[11px] tracking-wider uppercase pb-1 border-b border-stone-150">
                Utilization
              </h3>

              <div className="space-y-2 text-[10.5px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#751838] shrink-0" />
                  <span className="font-bold text-stone-800">≥ 90%</span>
                  <span className="text-stone-500 text-[10px] ml-auto">(High)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#EA580C] shrink-0" />
                  <span className="font-bold text-stone-800">75%–89%</span>
                  <span className="text-stone-500 text-[10px] ml-auto">(Busy)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FACC15] border border-[#CA8A04] shrink-0" />
                  <span className="font-bold text-stone-800">50%–74%</span>
                  <span className="text-stone-500 text-[10px] ml-auto">(Moderate)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FEF9C3] border border-[#FDE047] shrink-0" />
                  <span className="font-bold text-stone-800">&lt; 50%</span>
                  <span className="text-stone-500 text-[10px] ml-auto">(Low)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dynamic Cell Hover Telemetry & Whisker Lotus Motif */}
      <div className="mt-3 pt-2.5 border-t border-[#EFE5D5]/80 flex flex-wrap items-center justify-between text-xs min-h-[26px]">
        {hoveredCell ? (
          <div className="flex flex-wrap items-center gap-2 text-stone-700 animate-in fade-in">
            <span className="font-bold text-[#751838]">{hoveredCell.service}</span>
            <span className="text-stone-300">•</span>
            <span className="font-semibold text-stone-800">{hoveredCell.time} ({hoveredCell.period})</span>
            <span className="text-stone-300">•</span>
            <span>
              Bookings: <strong className="text-stone-900">{hoveredCell.count.toLocaleString()}</strong>
            </span>
            <span className="text-stone-300">•</span>
            <span>
              Capacity: <strong className="text-stone-900">{hoveredCell.capacity.toLocaleString()}</strong>
            </span>
            <span className="text-stone-300">•</span>
            <span>
              Utilization: <strong className="text-[#751838]">{hoveredCell.utilization}%</strong>
            </span>
          </div>
        ) : (
          <div className="text-[11px] text-stone-400 italic flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Hover on any cell for detailed capacity analysis; click to open filtered bookings.</span>
          </div>
        )}

        {/* Bottom Ornamental Golden Lotus Divider */}
        <div className="mx-auto hidden md:block">
          <WhiskerLotusMotif className="w-36 h-4" />
        </div>
      </div>
    </div>
  );
}
