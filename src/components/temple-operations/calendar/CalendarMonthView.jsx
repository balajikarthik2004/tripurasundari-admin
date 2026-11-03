import React, { useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Landmark,
  Circle,
} from 'lucide-react';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

export default function CalendarMonthView() {
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    goToPrev,
    goToNext,
    goToToday,
    dutyAssignments,
    festivals,
    tasks,
  } = useTempleCalendar();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const formattedMonthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Generate calendar days matrix
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDaysCount = new Date(year, month, 0).getDate();

    const cells = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDaysCount - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateStr = prevDate.toISOString().slice(0, 10);
      cells.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      cells.push({
        dayNum: d,
        dateStr,
        isCurrentMonth: true,
      });
    }

    // Next month padding to complete 35 grid cells
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      const nextDate = new Date(year, month + 1, n);
      const dateStr = nextDate.toISOString().slice(0, 10);
      cells.push({
        dayNum: n,
        dateStr,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [year, month]);

  const weekDayHeaders = [
    { label: 'Sun', isWeekend: true },
    { label: 'Mon', isWeekend: false },
    { label: 'Tue', isWeekend: false },
    { label: 'Wed', isWeekend: false },
    { label: 'Thu', isWeekend: false },
    { label: 'Fri', isWeekend: false },
    { label: 'Sat', isWeekend: true },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden h-[680px] flex flex-col justify-between">
      {/* 1. Calendar Header Bar: Month Navigation & Category Legend */}
      <div className="px-5 py-3.5 border-b border-stone-200/90 flex items-center justify-between text-xs text-stone-700 bg-stone-50/80 gap-3 shrink-0">
        {/* Left: Month Navigator & Title */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={goToPrev}
            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-700 transition-colors border border-stone-200 bg-white shadow-2xs"
            title="Previous Month"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={goToNext}
            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-700 transition-colors border border-stone-200 bg-white shadow-2xs"
            title="Next Month"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="font-bold font-serif text-base text-stone-900 ml-1.5 min-w-[125px]">
            {formattedMonthYear}
          </span>

          <button
            onClick={goToToday}
            className="ml-1 px-3 py-1 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <CalendarIcon className="w-3 h-3 text-stone-500" />
            <span>Today</span>
          </button>
        </div>

        {/* Right: Category Legend (Evenly Spaced Across the Right Side) */}
        <div className="flex items-center gap-3 sm:gap-4.5 font-medium text-xs text-stone-600 shrink-0 ml-auto">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55132D]" />
            <span>Staff Duties</span>
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B68A36]" />
            <span>Rituals</span>
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
            <span>Festivals</span>
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full border border-[#2563EB] bg-blue-100" />
            <span>Admin Tasks</span>
          </span>
        </div>
      </div>

      {/* 2. Weekday Column Headers with Clean Dividing Lines */}
      <div className="grid grid-cols-7 border-b border-stone-200 divide-x divide-stone-200 bg-stone-100/70 text-center text-xs shrink-0">
        {weekDayHeaders.map((day, idx) => (
          <div
            key={idx}
            className={`py-2.5 text-xs font-bold tracking-wider uppercase ${
              day.isWeekend ? 'text-amber-900' : 'text-stone-700'
            }`}
          >
            {day.label}
          </div>
        ))}
      </div>

      {/* 3. Monthly Days Grid with Clear, Breathable Cells */}
      <div className="grid grid-cols-7 divide-x divide-y divide-stone-200 flex-1">
        {calendarCells.map((cell) => {
          const { dateStr, dayNum, isCurrentMonth } = cell;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === '2026-11-01';

          // Shift counts
          const hasShifts =
            ['2026-11-01', '2026-11-05', '2026-11-09', '2026-11-17', '2026-11-23'].includes(
              dateStr
            ) || dutyAssignments.some((d) => d.date === dateStr);

          // Rituals
          const isKartikPurnima = dateStr === '2026-11-01';
          const isRamaEkadashi = dateStr === '2026-11-06';
          const isUtpannaEkadashi = dateStr === '2026-11-21';

          // Tasks
          const isStaffReview = dateStr === '2026-11-03';
          const isFacilityCheck = dateStr === '2026-11-10';
          const isVolunteerBriefing = dateStr === '2026-11-19';
          const isParkingReview = dateStr === '2026-11-25';

          // Diwali Mela Span (Nov 11 - 14 in Row 2)
          const isDiwaliStart = dateStr === '2026-11-11';
          const isDiwaliMid1 = dateStr === '2026-11-12';
          const isDiwaliMid2 = dateStr === '2026-11-13';
          const isDiwaliSpanEnd = dateStr === '2026-11-14';
          const isDiwaliSpan = isDiwaliStart || isDiwaliMid1 || isDiwaliMid2 || isDiwaliSpanEnd;
          const isDiwaliLastDay = dateStr === '2026-11-15';

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`min-h-[110px] p-2.5 flex flex-col justify-between transition-all cursor-pointer relative ${
                !isCurrentMonth
                  ? 'bg-stone-50/70 text-stone-400'
                  : isSelected
                  ? 'bg-amber-500/10 ring-2 ring-inset ring-[#55132D]'
                  : 'bg-white hover:bg-stone-50'
              }`}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-1">
                {isToday ? (
                  <span className="w-5.5 h-5.5 rounded-full bg-[#55132D] text-white flex items-center justify-center font-bold font-number text-xs shadow-2xs">
                    {dayNum}
                  </span>
                ) : (
                  <span
                    className={`text-xs font-bold font-number ${
                      isSelected
                        ? 'text-[#55132D] font-black'
                        : isCurrentMonth
                        ? 'text-stone-900'
                        : 'text-stone-400'
                    }`}
                  >
                    {dayNum}
                  </span>
                )}
              </div>

              {/* Day Events Stack */}
              <div className="space-y-1.5 my-1 flex-1 flex flex-col justify-center">
                {/* 1. Shift indicator */}
                {isCurrentMonth && hasShifts && !isDiwaliSpan && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#55132D]">
                    <span className="w-2 h-2 rounded-full bg-[#55132D] flex-shrink-0" />
                    <span>3 Shifts</span>
                  </div>
                )}

                {/* 2. Rituals */}
                {isCurrentMonth && isKartikPurnima && (
                  <div className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100/90 text-amber-950 border border-amber-300 truncate">
                    Kartik Purnima
                  </div>
                )}
                {isCurrentMonth && isRamaEkadashi && (
                  <div className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100/90 text-amber-950 border border-amber-300 truncate">
                    Rama Ekadashi
                  </div>
                )}
                {isCurrentMonth && isUtpannaEkadashi && (
                  <div className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100/90 text-amber-950 border border-amber-300 truncate">
                    Utpanna Ekadashi
                  </div>
                )}

                {/* 3. Tasks */}
                {isCurrentMonth && isStaffReview && (
                  <div className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-900 border border-blue-200 truncate flex items-center gap-1.5">
                    <Circle className="w-2 h-2 text-blue-600 flex-shrink-0" />
                    <span>Staff Review</span>
                  </div>
                )}
                {isCurrentMonth && isFacilityCheck && (
                  <div className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-900 border border-blue-200 truncate flex items-center gap-1.5">
                    <Circle className="w-2 h-2 text-blue-600 flex-shrink-0" />
                    <span>Facility Check</span>
                  </div>
                )}
                {isCurrentMonth && isVolunteerBriefing && (
                  <div className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-900 border border-blue-200 truncate flex items-center gap-1.5">
                    <Circle className="w-2 h-2 text-blue-600 flex-shrink-0" />
                    <span>Volunteer Briefing</span>
                  </div>
                )}
                {isCurrentMonth && isParkingReview && (
                  <div className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-900 border border-blue-200 truncate flex items-center gap-1.5">
                    <Circle className="w-2 h-2 text-blue-600 flex-shrink-0" />
                    <span>Parking Review</span>
                  </div>
                )}

                {/* 4. Multi-Day Festival Bar (Nov 11 - 14 continuous span) */}
                {isCurrentMonth && isDiwaliStart && (
                  <div className="relative z-10 -mr-3 py-1 px-2.5 rounded-l bg-amber-100 text-amber-950 border border-r-0 border-amber-400 font-bold text-[11px] flex items-center gap-1.5 shadow-2xs whitespace-nowrap">
                    <Landmark className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                    <span>Diwali Mela 2026 (11–15 Nov)</span>
                  </div>
                )}
                {isCurrentMonth && (isDiwaliMid1 || isDiwaliMid2) && (
                  <div className="relative z-10 -ml-3 -mr-3 py-1 h-[26px] bg-amber-100 border-y border-amber-400" />
                )}
                {isCurrentMonth && isDiwaliSpanEnd && (
                  <div className="relative z-10 -ml-3 py-1 px-2.5 rounded-r bg-amber-100 text-amber-950 border border-l-0 border-amber-400 font-bold text-[11px] flex items-center justify-end shadow-2xs">
                    <span className="text-amber-800">→</span>
                  </div>
                )}

                {/* Nov 15: Concluding Day */}
                {isCurrentMonth && isDiwaliLastDay && (
                  <div className="py-1 px-2 rounded bg-amber-100 text-amber-950 border border-amber-400 font-bold text-[11px] flex items-center gap-1.5 shadow-2xs truncate">
                    <Landmark className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                    <span className="truncate">Diwali Mela (Concludes)</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
