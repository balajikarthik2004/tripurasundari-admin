import React, { useMemo, useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Users,
  Sun,
  Sunset,
  Moon,
  MapPin,
  Sparkles,
  Flame,
  Check,
} from 'lucide-react';
import { useDarshanBookings } from '../../context/DarshanBookingContext';

export default function SlotsCapacityTab({ onOpenAddSlot, onOpenEditSlot }) {
  const { slots, selectedDate, setSelectedDate, getSlotOccupancy, toggleSlotActive } = useDarshanBookings();
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState('All');
  const [liveFluctuation, setLiveFluctuation] = useState({});

  // Controlled, realistic natural random-walk simulation every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveFluctuation((prev) => {
        const next = { ...prev };
        slots.forEach((s) => {
          const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
          const current = next[s.id] || 0;
          next[s.id] = Math.max(-10, Math.min(10, current + delta));
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [slots]);

  // Compute live occupancy for all slots on selectedDate
  const computedSlots = useMemo(() => {
    return slots.map((s) => {
      const occ = getSlotOccupancy(s.id, selectedDate);
      const delta = liveFluctuation[s.id] || 0;
      const booked = Math.max(0, Math.min(s.maxCapacity, occ.bookedDevotees + delta));
      const available = Math.max(0, s.maxCapacity - booked);
      const pct = s.maxCapacity > 0 ? Math.round((booked / s.maxCapacity) * 100) : 0;
      return {
        ...s,
        ...occ,
        bookedDevotees: booked,
        availableCapacity: available,
        percentage: pct,
        isFull: available === 0 || s.status === 'disabled',
      };
    });
  }, [slots, selectedDate, getSlotOccupancy, liveFluctuation]);

  // Overall metrics for this date
  const summaryMetrics = useMemo(() => {
    let totalMax = 0;
    let totalBooked = 0;
    computedSlots.forEach((s) => {
      totalMax += s.maxCapacity;
      totalBooked += s.bookedDevotees;
    });
    const totalAvailable = Math.max(0, totalMax - totalBooked);
    const avgOccupancy = totalMax > 0 ? Math.round((totalBooked / totalMax) * 100) : 0;
    return { totalMax, totalBooked, totalAvailable, avgOccupancy };
  }, [computedSlots]);

  // Filtered by period
  const filteredSlots = useMemo(() => {
    if (selectedPeriodFilter === 'All') return computedSlots;
    return computedSlots.filter((s) => s.period === selectedPeriodFilter);
  }, [computedSlots, selectedPeriodFilter]);

  const getPeriodIcon = (period) => {
    switch (period) {
      case 'Morning':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Afternoon':
        return <Sunset className="w-4 h-4 text-orange-500" />;
      case 'Evening':
      default:
        return <Moon className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Metrics Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Configured Slots</div>
            <div className="text-2xl font-bold font-number text-stone-900 mt-1">{slots.length} Slots</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Across 3 daily shifts</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#55132D]/10 text-[#55132D] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Total Max Capacity</div>
            <div className="text-2xl font-bold font-number text-stone-900 mt-1">
              {summaryMetrics.totalMax.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Devotee quota ceiling for {selectedDate}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Total Booked Devotees</div>
            <div className="text-2xl font-bold font-number text-stone-900 mt-1">
              {summaryMetrics.totalBooked.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded font-number ${
                summaryMetrics.avgOccupancy >= 85
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {summaryMetrics.avgOccupancy}% occupancy
              </span>
              <span className="text-[10.5px] text-stone-500 font-medium">Optimal flow</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Remaining Available</div>
            <div className="text-2xl font-bold font-number text-stone-900 mt-1">
              {summaryMetrics.totalAvailable.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Quota remaining across gates</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Control Bar: Date Selector, Period Filter & Add Slot */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Selector */}
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 text-xs">
            <Calendar className="w-4 h-4 text-[#55132D]" />
            <span className="font-semibold text-stone-700">Selected Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border border-stone-200 rounded px-2 py-0.5 text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#55132D]"
            />
          </div>

          {/* Period Tabs */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
            {['All', 'Morning', 'Afternoon', 'Evening'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriodFilter(period)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  selectedPeriodFilter === period
                    ? 'bg-white text-[#55132D] shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenAddSlot}
          className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slot</span>
        </button>
      </div>

      {/* 3. Enhanced Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.map((slot) => {
          const isActive = slot.status === 'active';
          const isFull = slot.isFull;

          // Color coded progress and badges
          let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
          let barGradient = 'from-emerald-500 to-emerald-600';

          if (slot.percentage >= 90) {
            badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
            barGradient = 'from-rose-500 to-rose-600';
          } else if (slot.percentage >= 75) {
            badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
            barGradient = 'from-amber-500 to-amber-600';
          }

          return (
            <div
              key={slot.id}
              className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-all duration-200 ${
                !isActive
                  ? 'border-stone-200 bg-stone-50/70 opacity-75'
                  : isFull
                  ? 'border-rose-300 bg-rose-50/20 shadow-sm'
                  : 'border-stone-200/90 hover:border-[#B68A36]/60 hover:shadow-card'
              }`}
            >
              <div>
                {/* Header: Period, Sacred Name, Time and Status Toggle */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-stone-100 border border-stone-200 flex-shrink-0 mt-0.5">
                      {getPeriodIcon(slot.period)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 font-serif leading-tight">
                        {slot.name || slot.serviceName}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] font-mono font-semibold text-[#55132D] bg-[#55132D]/10 px-2 py-0.5 rounded">
                          {slot.label}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">({slot.period})</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Active / Disabled */}
                  <button
                    onClick={() => toggleSlotActive(slot.id)}
                    className={`text-[10.5px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 transition-colors flex-shrink-0 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
                    }`}
                    title="Click to toggle slot status"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'}`} />
                    <span>{isActive ? 'Active' : 'Disabled'}</span>
                  </button>
                </div>

                {/* Gate & Sacred Ritual Details */}
                <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-stone-200/70 mb-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-semibold text-stone-800">
                      <MapPin className="w-3.5 h-3.5 text-[#55132D]" />
                      <span>{slot.gate}</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#55132D] uppercase tracking-wider">
                      {slot.serviceName || 'Darshan Pass'}
                    </span>
                  </div>
                  {slot.ritualDescription && (
                    <p className="text-[11px] text-stone-500 leading-snug">
                      {slot.ritualDescription}
                    </p>
                  )}
                </div>

                {/* Live Occupancy Meter & Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base sm:text-lg font-bold font-number text-stone-900">
                        {slot.bookedDevotees.toLocaleString()}
                      </span>
                      <span className="text-stone-500 font-sans text-xs">
                        / {slot.maxCapacity.toLocaleString()} devotees
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold font-number border transition-colors ${badgeColor}`}>
                      {slot.percentage}% Occupancy
                    </span>
                  </div>

                  {/* Enhanced Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${barGradient}`}
                      style={{ width: `${Math.min(100, slot.percentage)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-stone-500">Remaining Quota:</span>
                    {isFull ? (
                      <span className="font-bold px-1.5 py-0.5 rounded text-[10px] bg-rose-100 text-rose-800">
                        BATCH FULL
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-700">
                        {slot.availableCapacity.toLocaleString()} spots available
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Edit Action */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400 font-mono">ID: {slot.id}</span>
                <button
                  onClick={() => onOpenEditSlot(slot)}
                  className="px-3 py-1 text-xs font-semibold text-[#55132D] bg-[#55132D]/5 hover:bg-[#55132D]/15 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Adjust Capacity</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
