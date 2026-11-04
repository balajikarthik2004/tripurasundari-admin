import React, { useState, useMemo } from 'react';
import { Calendar, Filter, Clock, Flame, Info, ArrowUpRight } from 'lucide-react';
import { STANDARD_TIME_SLOTS, SERVICE_CATEGORIES } from '../../data/unifiedBookingsData';

export default function BookingDemandMatrix({
  bookings = [],
  slots = [],
  datePeriod = 'Today', // 'Today' | '7 Days' | '30 Days'
  onDatePeriodChange,
  serviceFilter = 'All',
  onServiceFilterChange,
  onCellClick,
}) {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Time Slot columns
  const timeSlots = STANDARD_TIME_SLOTS;

  // Row Categories
  const rowCategories = useMemo(() => {
    if (serviceFilter && serviceFilter !== 'All') {
      return [serviceFilter];
    }
    return SERVICE_CATEGORIES;
  }, [serviceFilter]);

  // Multiplier for capacity based on datePeriod
  const periodDays = useMemo(() => {
    if (datePeriod === '7 Days') return 7;
    if (datePeriod === '30 Days') return 30;
    return 1;
  }, [datePeriod]);

  // Filter bookings based on datePeriod
  const activeBookings = useMemo(() => {
    if (datePeriod === 'Today') {
      return bookings.filter((b) => b.visitDate === '2026-10-31');
    }
    if (datePeriod === '7 Days') {
      // 25 Oct to 31 Oct
      return bookings.filter((b) => b.visitDate >= '2026-10-25' && b.visitDate <= '2026-10-31');
    }
    // 30 Days
    return bookings;
  }, [bookings, datePeriod]);

  // Compute Matrix Data: grid[category][timeSlotLabel]
  const matrixData = useMemo(() => {
    const grid = {};
    let maxBookingCount = 1;

    rowCategories.forEach((cat) => {
      grid[cat] = {};
      timeSlots.forEach((slot) => {
        // Find matching bookings
        const matchingBookings = activeBookings.filter(
          (b) =>
            (b.category === cat || (cat === 'Other Sevas' && (b.category === 'Special Ritual' || b.category === 'General'))) &&
            (b.timeSlot === slot.label ||
              (slot.id === 'TS-1' && b.timeSlot?.includes('05:00')) ||
              (slot.id === 'TS-2' && (b.timeSlot?.includes('07:00') || b.timeSlot?.includes('09:30'))) ||
              (slot.id === 'TS-3' && (b.timeSlot?.includes('10:00') || b.timeSlot?.includes('12:00'))) ||
              (slot.id === 'TS-4' && (b.timeSlot?.includes('01:00') || b.timeSlot?.includes('13:00') || b.timeSlot?.includes('03:30'))) ||
              (slot.id === 'TS-5' && (b.timeSlot?.includes('04:00') || b.timeSlot?.includes('16:00'))) ||
              (slot.id === 'TS-6' && (b.timeSlot?.includes('06:00') || b.timeSlot?.includes('18:00'))))
        );

        const count = matchingBookings.length;
        if (count > maxBookingCount) {
          maxBookingCount = count;
        }

        // Capacity calculation aggregated for period
        const matchingSlots = slots.filter(
          (s) =>
            s.status !== 'disabled' &&
            s.category === cat &&
            (s.timeSlot === slot.label || s.timeSlot?.includes(slot.startTime))
        );

        const baseDailyCapacity = matchingSlots.reduce((sum, s) => sum + (s.maxCapacity || 50), 0) || 50;
        const totalConfiguredCapacity = baseDailyCapacity * periodDays;
        const totalDevotees = matchingBookings.reduce((sum, b) => sum + (Number(b.devoteesCount) || 1), 0);
        const remainingCapacity = Math.max(0, totalConfiguredCapacity - totalDevotees);
        const utilization = totalConfiguredCapacity > 0
          ? Math.min(100, Math.round((totalDevotees / totalConfiguredCapacity) * 100))
          : 0;

        grid[cat][slot.label] = {
          category: cat,
          timeSlot: slot.label,
          periodName: slot.period,
          count,
          totalDevotees,
          capacity: totalConfiguredCapacity,
          remainingCapacity,
          utilization,
        };
      });
    });

    return { grid, maxBookingCount };
  }, [rowCategories, timeSlots, activeBookings, slots, periodDays]);

  // Overall Matrix Summary
  const summary = useMemo(() => {
    const totalBookings = activeBookings.length;
    const avgDaily = (totalBookings / periodDays).toFixed(1);

    // Find peak slot
    const slotCounts = {};
    timeSlots.forEach((s) => {
      slotCounts[s.label] = 0;
    });

    // Find highest demand service
    const serviceCounts = {};

    activeBookings.forEach((b) => {
      // By slot
      const matchedSlot = timeSlots.find(
        (ts) =>
          b.timeSlot === ts.label ||
          (ts.id === 'TS-1' && b.timeSlot?.includes('05:00')) ||
          (ts.id === 'TS-2' && (b.timeSlot?.includes('07:00') || b.timeSlot?.includes('09:30'))) ||
          (ts.id === 'TS-3' && (b.timeSlot?.includes('10:00') || b.timeSlot?.includes('12:00'))) ||
          (ts.id === 'TS-4' && (b.timeSlot?.includes('01:00') || b.timeSlot?.includes('13:00') || b.timeSlot?.includes('03:30'))) ||
          (ts.id === 'TS-5' && (b.timeSlot?.includes('04:00') || b.timeSlot?.includes('16:00'))) ||
          (ts.id === 'TS-6' && (b.timeSlot?.includes('06:00') || b.timeSlot?.includes('18:00')))
      );
      if (matchedSlot) {
        slotCounts[matchedSlot.label] += 1;
      }

      // By service
      const sName = b.serviceName || b.category || 'General';
      serviceCounts[sName] = (serviceCounts[sName] || 0) + 1;
    });

    let peakSlot = timeSlots[1]?.label || '07:00 AM – 10:00 AM';
    let maxSlotCount = 0;
    Object.entries(slotCounts).forEach(([slotName, count]) => {
      if (count > maxSlotCount) {
        maxSlotCount = count;
        peakSlot = slotName;
      }
    });

    let highestService = 'Special Entry Darshan';
    let maxServiceCount = 0;
    Object.entries(serviceCounts).forEach(([name, count]) => {
      if (count > maxServiceCount) {
        maxServiceCount = count;
        highestService = name;
      }
    });

    return {
      totalBookings,
      avgDaily,
      peakSlot,
      peakSlotCount: maxSlotCount,
      highestService,
      highestServiceCount: maxServiceCount,
      dateRangeLabel:
        datePeriod === 'Today'
          ? '31 Oct 2026'
          : datePeriod === '7 Days'
          ? '25 Oct – 31 Oct 2026'
          : '02 Oct – 31 Oct 2026 (30 Days)',
    };
  }, [activeBookings, periodDays, datePeriod, timeSlots]);

  // Color helper based on utilization
  const getUtilizationStyle = (utilization) => {
    if (utilization >= 90) {
      return {
        bg: 'bg-[#55132D]',
        border: 'border-[#3D0A1E]',
        text: 'text-white',
        label: 'High (≥90%)',
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      };
    }
    if (utilization >= 75) {
      return {
        bg: 'bg-amber-600',
        border: 'border-amber-700',
        text: 'text-white',
        label: 'Busy (75–89%)',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    }
    if (utilization >= 50) {
      return {
        bg: 'bg-sky-600',
        border: 'border-sky-700',
        text: 'text-white',
        label: 'Moderate (50–74%)',
        badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
      };
    }
    return {
      bg: 'bg-emerald-600',
      border: 'border-emerald-700',
      text: 'text-white',
      label: 'Low (<50%)',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    };
  };

  // Bubble size scaler (diameter in pixels)
  const getBubbleSize = (count) => {
    if (count <= 0) return 24;
    const max = matrixData.maxBookingCount || 1;
    // Scale between 28px and 50px
    const minSize = 28;
    const maxSize = 48;
    const size = minSize + Math.round((count / max) * (maxSize - minSize));
    return Math.max(minSize, Math.min(maxSize, size));
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 flex flex-col justify-between">
      {/* Visual Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3.5 border-b border-stone-150 gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B68A36]" />
            <h2 className="text-sm sm:text-base font-bold text-stone-900 font-serif">
              Booking Demand Matrix
            </h2>
            <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
              Time-Slot Demand & Capacity Utilization
            </span>
          </div>
          <p className="text-[11.5px] text-stone-500 mt-0.5">
            Bubble size indicates booking volume; color indicates quota capacity utilization ({summary.dateRangeLabel}).
          </p>
        </div>

        {/* Compact Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Service Filter */}
          <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={serviceFilter}
              onChange={(e) => onServiceFilterChange && onServiceFilterChange(e.target.value)}
              className="bg-transparent font-semibold text-stone-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="All">All Service Categories</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date Period Filter Pills */}
          <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-xl border border-stone-200 text-xs">
            {['Today', '7 Days', '30 Days'].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => onDatePeriodChange && onDatePeriodChange(period)}
                className={`px-3 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                  datePeriod === period
                    ? 'bg-[#55132D] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid + Summary Side Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-4 items-start">
        {/* The Bubble Matrix Table */}
        <div className="w-full overflow-x-auto custom-scrollbar border border-stone-150 rounded-xl bg-[#FAF8F5]/60 p-2 sm:p-3">
          <table className="w-full min-w-[680px] border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left text-[11px] font-bold text-stone-600 uppercase tracking-wider w-[120px] bg-white rounded-l-lg border-b border-stone-200">
                  Offering
                </th>
                {timeSlots.map((slot) => (
                  <th
                    key={slot.id}
                    className="p-2 text-center text-[10.5px] font-bold text-stone-700 bg-white border-b border-stone-200"
                  >
                    <div>{slot.label}</div>
                    <div className="text-[9.5px] font-normal text-stone-400 mt-0.5">{slot.period}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150">
              {rowCategories.map((cat) => (
                <tr key={cat} className="hover:bg-white/80 transition-colors">
                  {/* Row Header */}
                  <td className="p-2.5 font-bold text-stone-900 text-xs whitespace-nowrap bg-white/60">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            cat === 'Darshan'
                              ? '#D97706'
                              : cat === 'Archana'
                              ? '#B68A36'
                              : cat === 'Abhishekam'
                              ? '#0284C7'
                              : cat === 'Havan'
                              ? '#8C3220'
                              : '#55132D',
                        }}
                      />
                      <span>{cat}</span>
                    </div>
                  </td>

                  {/* Matrix Cells */}
                  {timeSlots.map((slot) => {
                    const cell = matrixData.grid[cat]?.[slot.label] || {
                      count: 0,
                      utilization: 0,
                      capacity: 100,
                      remainingCapacity: 100,
                    };
                    const style = getUtilizationStyle(cell.utilization);
                    const bubbleSize = getBubbleSize(cell.count);

                    return (
                      <td
                        key={slot.id}
                        className="p-2 text-center align-middle"
                        onMouseEnter={() => setHoveredCell(cell)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onCellClick &&
                            onCellClick({
                              category: cat,
                              timeSlot: slot.label,
                              datePeriod,
                            })
                          }
                          className="mx-auto flex flex-col items-center justify-center relative group focus:outline-none cursor-pointer"
                          style={{ minHeight: '52px' }}
                          title={`Click to filter bookings for ${cat} at ${slot.label}`}
                        >
                          {cell.count > 0 ? (
                            <div
                              className={`rounded-full flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-110 ${style.bg} ${style.text}`}
                              style={{
                                width: `${bubbleSize}px`,
                                height: `${bubbleSize}px`,
                              }}
                            >
                              <span className="text-[11px]">{cell.count}</span>
                            </div>
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full bg-stone-200/70 border border-stone-300/80 group-hover:scale-125 transition-transform" />
                          )}
                          <span className="text-[9.5px] font-medium text-stone-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {cell.utilization}%
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compact Summary Side Panel */}
        <div className="flex flex-col gap-3 bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-3.5 text-xs">
          <div className="font-bold text-stone-900 font-serif pb-2 border-b border-stone-200 flex items-center justify-between">
            <span>Demand Summary</span>
            <span className="text-[10px] text-stone-500 font-sans font-normal">{datePeriod}</span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[10.5px] text-stone-500 block">Total Inflow Bookings</span>
              <span className="text-base font-bold text-stone-900 font-serif leading-tight">
                {summary.totalBookings.toLocaleString()} Bookings
              </span>
            </div>

            <div>
              <span className="text-[10.5px] text-stone-500 block">Avg. Daily Bookings</span>
              <span className="text-sm font-bold text-stone-800">
                {summary.avgDaily} / day
              </span>
            </div>

            <div>
              <span className="text-[10.5px] text-stone-500 block">Peak Inflow Slot</span>
              <span className="text-xs font-semibold text-[#55132D] leading-tight block truncate">
                {summary.peakSlot}
              </span>
              <span className="text-[10px] text-stone-500">
                ({summary.peakSlotCount} bookings in this slot)
              </span>
            </div>

            <div>
              <span className="text-[10.5px] text-stone-500 block">Highest-Demand Offering</span>
              <span className="text-xs font-semibold text-stone-800 leading-tight block truncate">
                {summary.highestService}
              </span>
            </div>
          </div>

          {/* Utilization Legend */}
          <div className="pt-2.5 border-t border-stone-200 space-y-1.5">
            <span className="text-[10.5px] font-bold text-stone-700 block">Quota Utilization</span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-stone-600">&lt;50% Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                <span className="text-stone-600">50-74% Mod</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                <span className="text-stone-600">75-89% Busy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#55132D]" />
                <span className="text-stone-600">≥90% High</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Hover Tooltip Bar */}
      <div className="mt-3 pt-2.5 border-t border-stone-150 flex items-center justify-between text-xs min-h-[30px]">
        {hoveredCell ? (
          <div className="flex flex-wrap items-center gap-2 animate-in fade-in text-stone-700">
            <span className="font-bold text-stone-900">{hoveredCell.category}</span>
            <span className="text-stone-400">•</span>
            <span className="font-medium text-stone-800">{hoveredCell.timeSlot}</span>
            <span className="text-stone-400">•</span>
            <span>
              Bookings: <strong className="text-stone-900">{hoveredCell.count}</strong>
            </span>
            <span className="text-stone-400">•</span>
            <span>
              Cumulative Capacity: <strong className="text-stone-900">{hoveredCell.capacity}</strong>
            </span>
            <span className="text-stone-400">•</span>
            <span>
              Utilization:{' '}
              <strong className="text-[#55132D]">{hoveredCell.utilization}%</strong>
            </span>
          </div>
        ) : (
          <div className="text-stone-400 text-[11px] italic">
            Click any bubble to jump into filtered devotee bookings for that service & time slot.
          </div>
        )}

        <div className="text-[11px] text-stone-500 font-medium hidden md:block">
          Clickable Matrix Navigation Active
        </div>
      </div>
    </div>
  );
}
