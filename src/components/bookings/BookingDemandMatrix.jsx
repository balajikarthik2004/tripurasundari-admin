import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Sun,
  Sunset,
  Moon,
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
        strokeWidth="1"
        fill="#FEF3C7"
        fillOpacity="0.5"
      />
      <path
        d="M 58 7 C 52 6, 48 9, 50 14 C 54 15, 57 14, 58 11"
        stroke="#C88728"
        strokeWidth="0.9"
        fill="none"
      />
      <path
        d="M 62 7 C 68 6, 72 9, 70 14 C 66 15, 63 14, 62 11"
        stroke="#C88728"
        strokeWidth="0.9"
        fill="none"
      />
      <circle cx="75" cy="10" r="1.5" fill="#C88728" opacity="0.8" />
      <line x1="75" y1="10" x2="115" y2="10" stroke="#C88728" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

// Kalash Sacred Pot Icon
function KalashIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2L15 6H9L12 2Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M7 8H17L19 14C19 18 16 21 12 21C8 21 5 18 5 14L7 8Z" />
      <circle cx="12" cy="14" r="2" />
    </svg>
  );
}

// Sacred Lotus Flower Icon
function LotusFlowerIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 4C10.5 8 10.5 13 12 17C13.5 13 13.5 8 12 4Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M11 9C7 8.5 4 11 5 15C8 16 11 15 11 13" />
      <path d="M13 9C17 8.5 20 11 19 15C16 16 13 15 13 13" />
    </svg>
  );
}

export default function BookingDemandMatrix({ onCellClick }) {
  const [selectedPeriod, setSelectedPeriod] = useState('7 Days'); // 'Today' | '7 Days' | '30 Days'
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [hoveredCell, setHoveredCell] = useState(null);

  // Exact 6 Time Slot Columns from Reference Image
  const timeSlotColumns = [
    {
      id: 'ts1',
      time: '05–07 AM',
      period: 'Early Morning',
      icon: <Sun className="w-3.5 h-3.5 text-[#D97706]" />,
      border: 'border-t-[#D97706]',
    },
    {
      id: 'ts2',
      time: '07–10 AM',
      period: 'Morning',
      icon: <Sun className="w-3.5 h-3.5 text-[#EA580C]" />,
      border: 'border-t-[#EA580C]',
    },
    {
      id: 'ts3',
      time: '10–01 PM',
      period: 'Forenoon',
      icon: <Landmark className="w-3.5 h-3.5 text-[#55132D]" />,
      border: 'border-t-[#55132D]',
    },
    {
      id: 'ts4',
      time: '01–04 PM',
      period: 'Afternoon',
      icon: <Sun className="w-3.5 h-3.5 text-[#D97706]" />,
      border: 'border-t-[#D97706]',
    },
    {
      id: 'ts5',
      time: '04–06 PM',
      period: 'Evening',
      icon: <Sunset className="w-3.5 h-3.5 text-[#EA580C]" />,
      border: 'border-t-[#EA580C]',
    },
    {
      id: 'ts6',
      time: '06–09 PM',
      period: 'Night',
      icon: <Moon className="w-3.5 h-3.5 text-[#4A0B22]" />,
      border: 'border-t-[#4A0B22]',
    },
  ];

  // Configured Capacities (per slot for 7 days; scale for Today / 30 Days)
  // Ensures exact utilization mathematically matches tiers in the image:
  // >=90% (High Maroon), 75-89% (Busy Orange), 50-74% (Moderate Yellow), <50% (Low Mint/Pale)
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

  // DYNAMIC SUMMARY: Strictly equals the sum of displayed matrix cells!
  const summary = useMemo(() => {
    // 1. Total bookings = sum of all visible cells
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

    // 2. Average daily bookings
    const avgDaily = Math.round(total / numDays);

    // 3. Peak slot
    let maxColVal = -1;
    let peakColIdx = 2; // Default to Forenoon 10-01 PM
    colTotals.forEach((val, idx) => {
      if (val > maxColVal) {
        maxColVal = val;
        peakColIdx = idx;
      }
    });
    const peakSlotName = timeSlotColumns[peakColIdx]?.time || '10–01 PM';

    // 4. Peak Service
    let peakServiceName = visibleRows[0]?.name || 'Darshan';
    let maxRowVal = -1;
    Object.entries(rowTotals).forEach(([name, sum]) => {
      if (sum > maxRowVal) {
        maxRowVal = sum;
        peakServiceName = name;
      }
    });

    // Date range label
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
  }, [visibleRows, numDays, selectedPeriod, timeSlotColumns]);

  // Capsule Styling based on Utilization Tier:
  // Tier 1: >= 90% (High) -> Maroon gradient
  // Tier 2: 75%–89% (Busy) -> Orange gradient
  // Tier 3: 50%–74% (Moderate) -> Warm Yellow pill
  // Tier 4: < 50% (Low) -> Light Mint/Pale Cream pill
  const getCapsuleStyle = (utilization) => {
    if (utilization >= 90) {
      return 'bg-gradient-to-r from-[#751838] to-[#55132D] text-white shadow-xs font-bold';
    }
    if (utilization >= 75) {
      return 'bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white shadow-xs font-bold';
    }
    if (utilization >= 50) {
      return 'bg-[#FDE047] text-[#78350F] font-bold shadow-2xs';
    }
    return 'bg-[#FEF9C3] text-[#78350F] font-semibold';
  };

  return (
    <div className="bg-[#FFFDF9] rounded-2xl sm:rounded-3xl border border-[#EFE5D5] shadow-xs p-4 sm:p-5 relative overflow-hidden">
      {/* 1. Header with Title & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-[#EFE5D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#55132D] font-serif tracking-tight leading-snug">
              Booking Demand Matrix
            </h2>
            <p className="text-[11.5px] text-stone-500 font-sans">
              Service-wise demand across time slots{' '}
              <strong className="text-stone-700 font-semibold">({summary.title})</strong>
            </p>
          </div>
        </div>

        {/* Right Filter Controls (Responsive, no wrap breaking) */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Date Range Badge Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FDF2F4] border border-[#FCE7F3] text-xs font-semibold text-[#881337]">
            <Calendar className="w-3.5 h-3.5 text-[#881337]" />
            <span>{summary.dateRangeLabel}</span>
          </div>

          {/* Segmented Control */}
          <div className="flex items-center p-0.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold shadow-2xs">
            {['Today', '7 Days', '30 Days'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedPeriod === p
                    ? 'bg-[#55132D] text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Service Dropdown */}
          <div className="relative">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="appearance-none bg-white border border-stone-200 rounded-xl px-2.5 py-1 pr-7 text-xs font-medium text-stone-700 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="All Services">All Services</option>
              <option value="Darshan">Darshan</option>
              <option value="Archana">Archana</option>
              <option value="Abhishekam">Abhishekam</option>
              <option value="Havan">Havan</option>
              <option value="Special Pooja">Special Pooja</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Main Matrix Layout: Fluid Grid without horizontal overflow on 14" desktop */}
      <div className="mt-3.5 flex flex-col lg:flex-row gap-4 items-start">
        {/* Table Container: Fits cleanly into width */}
        <div className="w-full flex-1 overflow-visible">
          <table className="w-full table-fixed border-separate border-spacing-y-2 text-xs">
            <thead>
              <tr>
                <th className="w-[105px] sm:w-[115px] p-1 text-left"></th>
                {timeSlotColumns.map((slot) => (
                  <th key={slot.id} className="p-1 text-center">
                    <div
                      className={`mx-auto w-full max-w-[90px] py-1.5 px-0.5 rounded-xl bg-[#FFFBF0] border border-[#FDE68A]/80 border-t-2 ${slot.border} shadow-2xs flex flex-col items-center justify-center`}
                    >
                      <div className="flex items-center gap-1 text-[10.5px] font-bold text-stone-900 leading-tight">
                        {slot.icon}
                        <span className="whitespace-nowrap">{slot.time}</span>
                      </div>
                      <div className="text-[9.5px] text-stone-500 font-normal mt-0.5 truncate">
                        {slot.period}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id} className="group">
                  {/* Row Service Header */}
                  <td className="p-1 whitespace-nowrap align-middle">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900 font-sans text-xs">
                      <div className="w-5 h-5 rounded-md bg-[#FAF5EE] border border-[#EFE5D5] flex items-center justify-center shrink-0">
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
                      <td key={col.id} className="p-1 text-center align-middle">
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
                          className={`mx-auto w-[56px] sm:w-[62px] h-[30px] rounded-full flex items-center justify-center text-[11px] sm:text-xs tracking-tight transition-transform hover:scale-105 cursor-pointer focus:outline-none ${capsuleStyle}`}
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

        {/* Right Side Panels: Summary & Utilization Legend (230px, compact) */}
        <div className="w-full lg:w-[225px] shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
          {/* Summary Card */}
          <div className="flex-1 bg-white rounded-2xl border border-[#EFE5D5] p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 pb-1.5 border-b border-stone-150">
              <span className="text-[#55132D] text-xs font-bold">📊</span>
              <h3 className="font-bold text-[#55132D] font-serif text-xs">
                {summary.title}
              </h3>
            </div>

            <div className="space-y-1.5 text-[11.5px]">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-normal">Total Bookings</span>
                <span className="font-bold text-stone-900 font-sans">
                  {summary.totalBookings}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-normal">Avg. Daily Bookings</span>
                <span className="font-bold text-stone-900 font-sans">
                  {summary.avgDaily}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-normal">Peak Slot</span>
                <span className="font-bold text-stone-900 font-sans">
                  {summary.peakSlot}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-normal">Peak Service</span>
                <span className="font-bold text-stone-900 font-sans">
                  {summary.peakService}
                </span>
              </div>
            </div>
          </div>

          {/* Utilization Legend Card */}
          <div className="flex-1 bg-white rounded-2xl border border-[#EFE5D5] p-3.5 shadow-2xs space-y-2">
            <h3 className="font-bold text-stone-900 text-[11px] tracking-wider uppercase">
              Utilization
            </h3>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#55132D] shrink-0" />
                <span className="font-semibold text-stone-800">≥ 90%</span>
                <span className="text-stone-500 font-normal ml-auto">(High)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EA580C] shrink-0" />
                <span className="font-semibold text-stone-800">75% – 89%</span>
                <span className="text-stone-500 font-normal ml-auto">(Busy)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FDE047] border border-[#CA8A04] shrink-0" />
                <span className="font-semibold text-stone-800">50% – 74%</span>
                <span className="text-stone-500 font-normal ml-auto">(Moderate)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FEF9C3] border border-[#FDE047] shrink-0" />
                <span className="font-semibold text-stone-800">&lt; 50%</span>
                <span className="text-stone-500 font-normal ml-auto">(Low)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dynamic Cell Tooltip Bar when hovering over any cell */}
      <div className="mt-3 pt-2 border-t border-[#EFE5D5]/80 flex flex-wrap items-center justify-between text-xs min-h-[26px]">
        {hoveredCell ? (
          <div className="flex flex-wrap items-center gap-2 text-stone-700 animate-in fade-in">
            <span className="font-bold text-[#55132D]">{hoveredCell.service}</span>
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
              Utilization: <strong className="text-[#55132D]">{hoveredCell.utilization}%</strong>
            </span>
          </div>
        ) : (
          <div className="text-[11px] text-stone-400 italic flex items-center gap-1">
            <Info className="w-3 h-3 text-stone-400" />
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
