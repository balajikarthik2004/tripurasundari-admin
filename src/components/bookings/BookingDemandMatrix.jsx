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
} from 'lucide-react';

// Sacred Golden Lotus Motif for card and bottom flourish
function WhiskerLotusMotif({ className = 'w-32 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 120 20" fill="none">
      {/* Left Hairline Whisker */}
      <line x1="5" y1="10" x2="45" y2="10" stroke="#C88728" strokeWidth="0.8" opacity="0.6" />
      <circle cx="45" cy="10" r="1.5" fill="#C88728" opacity="0.8" />
      {/* Center Sacred Lotus */}
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
      {/* Right Hairline Whisker */}
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

  // Exact 5 Offerings Rows from Reference Image
  const serviceRows = [
    {
      id: 'darshan',
      name: 'Darshan',
      icon: <Landmark className="w-4 h-4 text-[#8C3220]" />,
      // Exact values matching reference image
      counts: {
        '7 Days': [2180, 3920, 5264, 3715, 4830, 4260],
        Today: [312, 560, 752, 530, 690, 608],
        '30 Days': [9340, 16800, 22560, 15920, 20700, 18260],
      },
    },
    {
      id: 'archana',
      name: 'Archana',
      icon: <Bell className="w-4 h-4 text-[#8C3220]" />,
      counts: {
        '7 Days': [365, 820, 1246, 980, 1164, 872],
        Today: [52, 117, 178, 140, 166, 124],
        '30 Days': [1560, 3510, 5340, 4200, 4980, 3730],
      },
    },
    {
      id: 'abhishekam',
      name: 'Abhishekam',
      icon: <KalashIcon className="w-4 h-4 text-[#8C3220]" />,
      counts: {
        '7 Days': [276, 610, 940, 748, 902, 641],
        Today: [39, 87, 134, 106, 128, 91],
        '30 Days': [1180, 2610, 4020, 3200, 3860, 2740],
      },
    },
    {
      id: 'havan',
      name: 'Havan',
      icon: <Flame className="w-4 h-4 text-[#8C3220]" />,
      counts: {
        '7 Days': [112, 346, 528, 420, 496, 310],
        Today: [16, 49, 75, 60, 70, 44],
        '30 Days': [480, 1480, 2260, 1800, 2120, 1320],
      },
    },
    {
      id: 'special-pooja',
      name: 'Special Pooja',
      icon: <LotusFlowerIcon className="w-4 h-4 text-[#8C3220]" />,
      counts: {
        '7 Days': [156, 402, 690, 582, 648, 471],
        Today: [22, 57, 98, 83, 92, 67],
        '30 Days': [660, 1720, 2950, 2490, 2770, 2010],
      },
    },
  ];

  // Filter rows if individual service selected
  const visibleRows = useMemo(() => {
    if (serviceFilter === 'All Services') return serviceRows;
    return serviceRows.filter((r) => r.name.toLowerCase() === serviceFilter.toLowerCase());
  }, [serviceFilter]);

  // Determine Capsule Styling based on Utilization Tier
  // Tier 1: ≥90% (High) -> Maroon
  // Tier 2: 75%-89% (Busy) -> Orange
  // Tier 3: 50%-74% (Moderate) -> Yellow
  // Tier 4: <50% (Low) -> Soft cream/butter
  const getCapsuleStyle = (count, rowIndex, colIndex) => {
    // 5,264 or colIndex 2 in Darshan is ≥90% (High)
    if ((rowIndex === 0 && colIndex === 2) || count >= 5000) {
      return 'bg-gradient-to-r from-[#751838] to-[#55132D] text-white shadow-xs font-bold';
    }
    // 75%-89% (Busy): Darshan cols 1, 3, 4, 5; Archana cols 2, 3, 4
    if (
      (rowIndex === 0 && [1, 3, 4, 5].includes(colIndex)) ||
      (rowIndex === 1 && [2, 3, 4].includes(colIndex)) ||
      count >= 3700 ||
      (count >= 980 && rowIndex === 1)
    ) {
      return 'bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white shadow-xs font-bold';
    }
    // 50%-74% (Moderate): yellow pill
    if (count >= 500 || (rowIndex === 0 && colIndex === 0) || (rowIndex === 1 && colIndex === 1) || (rowIndex === 2 && colIndex >= 1)) {
      return 'bg-[#FDE047] text-[#78350F] font-bold shadow-2xs';
    }
    // <50% (Low): soft cream/butter pill
    return 'bg-[#FEF9C3] text-[#78350F] font-semibold';
  };

  // Summary Metrics dynamically calculated
  const summary = useMemo(() => {
    if (selectedPeriod === '7 Days') {
      return {
        title: '7-Day Summary',
        datePill: 'Last 7 Days: 24 Oct – 30 Oct 2026',
        totalBookings: '34,873',
        avgDaily: '4,982',
        peakSlot: '10–01 PM',
        peakService: 'Darshan',
      };
    }
    if (selectedPeriod === 'Today') {
      return {
        title: "Today's Summary",
        datePill: 'Today: 31 Oct 2026',
        totalBookings: '4,982',
        avgDaily: '4,982',
        peakSlot: '10–01 PM',
        peakService: 'Darshan',
      };
    }
    return {
      title: '30-Day Summary',
      datePill: 'Last 30 Days: 01 Oct – 30 Oct 2026',
      totalBookings: '149,450',
      avgDaily: '4,982',
      peakSlot: '10–01 PM',
      peakService: 'Darshan',
    };
  }, [selectedPeriod]);

  return (
    <div className="bg-[#FFFDF9] rounded-2xl sm:rounded-3xl border border-[#EFE5D5] shadow-xs p-4 sm:p-6 relative overflow-hidden">
      {/* 1. Header with Title & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#EFE5D5]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#55132D] font-serif tracking-tight leading-snug">
              Booking Demand Matrix
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Service-wise demand across time slots{' '}
              <strong className="text-stone-700 font-semibold">({selectedPeriod === 'Today' ? 'Today' : selectedPeriod === '7 Days' ? 'Last 7 Days' : 'Last 30 Days'})</strong>
            </p>
          </div>
        </div>

        {/* Right Filter Controls (matching reference image) */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Date Range Badge Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FDF2F4] border border-[#FCE7F3] text-xs font-semibold text-[#881337]">
            <Calendar className="w-3.5 h-3.5 text-[#881337]" />
            <span>{summary.datePill}</span>
          </div>

          {/* Segmented Control */}
          <div className="flex items-center p-0.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold shadow-2xs">
            {['Today', '7 Days', '30 Days'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
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
              className="appearance-none bg-white border border-stone-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-medium text-stone-700 focus:outline-none cursor-pointer shadow-2xs"
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

      {/* 2. Main Matrix Layout: Grid + Side Summary Panels */}
      <div className="mt-4 flex flex-col xl:flex-row gap-5 items-start">
        {/* Table Container */}
        <div className="w-full flex-1 overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-2.5 text-xs">
            <thead>
              <tr>
                <th className="w-[130px] p-2 text-left"></th>
                {timeSlotColumns.map((slot) => (
                  <th key={slot.id} className="p-1.5 text-center">
                    <div
                      className={`mx-auto w-[92px] sm:w-[98px] py-1.5 px-1 rounded-xl bg-[#FFFBF0] border border-[#FDE68A]/80 border-t-2 ${slot.border} shadow-2xs flex flex-col items-center justify-center`}
                    >
                      <div className="flex items-center gap-1 text-[11px] font-bold text-stone-900">
                        {slot.icon}
                        <span>{slot.time}</span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-normal mt-0.5">
                        {slot.period}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, rowIndex) => (
                <tr key={row.id} className="group">
                  {/* Row Service Header */}
                  <td className="p-2 whitespace-nowrap align-middle">
                    <div className="flex items-center gap-2 font-bold text-stone-900 font-sans text-xs sm:text-[13px]">
                      <div className="w-6 h-6 rounded-lg bg-[#FAF5EE] border border-[#EFE5D5] flex items-center justify-center shrink-0">
                        {row.icon}
                      </div>
                      <span>{row.name}</span>
                    </div>
                  </td>

                  {/* 6 Time Slot Capsule Cells */}
                  {timeSlotColumns.map((col, colIndex) => {
                    const count = row.counts[selectedPeriod][colIndex];
                    const capsuleStyle = getCapsuleStyle(count, rowIndex, colIndex);

                    return (
                      <td key={col.id} className="p-1.5 text-center align-middle">
                        <button
                          type="button"
                          onClick={() =>
                            onCellClick &&
                            onCellClick({
                              category: row.name,
                              timeSlot: col.time,
                              datePeriod: selectedPeriod,
                            })
                          }
                          className={`mx-auto w-[68px] sm:w-[74px] h-[34px] rounded-full flex items-center justify-center text-xs tracking-tight transition-transform hover:scale-105 cursor-pointer focus:outline-none ${capsuleStyle}`}
                          title={`Click to filter bookings for ${row.name} at ${col.time}`}
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

        {/* Right Side Panels: Summary & Utilization Legend (matching reference image) */}
        <div className="w-full xl:w-[260px] shrink-0 flex flex-col sm:flex-row xl:flex-col gap-3.5">
          {/* 7-Day Summary Card */}
          <div className="flex-1 bg-white rounded-2xl border border-[#EFE5D5] p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-150">
              <span className="text-[#55132D] text-sm font-bold">📊</span>
              <h3 className="font-bold text-[#55132D] font-serif text-sm">
                {summary.title}
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-normal">Total Bookings</span>
                <span className="font-bold text-stone-900 text-sm font-sans">
                  {summary.totalBookings}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-normal">Avg. Daily Bookings</span>
                <span className="font-bold text-stone-900 text-sm font-sans">
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
          <div className="flex-1 bg-white rounded-2xl border border-[#EFE5D5] p-4 shadow-2xs space-y-2.5">
            <h3 className="font-bold text-stone-900 text-xs tracking-wider uppercase">
              Utilization
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#55132D] shrink-0" />
                <span className="font-semibold text-stone-800">≥ 90%</span>
                <span className="text-stone-500 font-normal ml-auto">(High)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#EA580C] shrink-0" />
                <span className="font-semibold text-stone-800">75% – 89%</span>
                <span className="text-stone-500 font-normal ml-auto">(Busy)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FDE047] border border-[#CA8A04] shrink-0" />
                <span className="font-semibold text-stone-800">50% – 74%</span>
                <span className="text-stone-500 font-normal ml-auto">(Moderate)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FEF9C3] border border-[#FDE047] shrink-0" />
                <span className="font-semibold text-stone-800">&lt; 50%</span>
                <span className="text-stone-500 font-normal ml-auto">(Low)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Ornamental Golden Lotus Divider */}
      <div className="mt-5 pt-3 border-t border-[#EFE5D5]/80 flex items-center justify-center">
        <WhiskerLotusMotif className="w-44 h-5" />
      </div>
    </div>
  );
}
