import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

export default function CalendarMonthView() {
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    goToPrev,
    goToNext,
    dutyOfficersMap,
    setIsDetailDrawerOpen,
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

    // Prev month padding (if any)
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

    // Next month padding to complete 35 grid cells (5 full weeks)
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
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const handleCellClick = (dateStr) => {
    setSelectedDate(dateStr);
    setIsDetailDrawerOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-300 shadow-2xs overflow-hidden flex flex-col">
      {/* 1. Month Navigation Header with Arrows at Two Corners & Category Legend */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-stone-300 bg-white">
        {/* Left Corner: Left Arrow & Month Year */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrev}
            className="p-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            {formattedMonthYear}
          </h2>
        </div>

        {/* Right Corner: Category Legend & Right Arrow at Far Right Corner */}
        <div className="flex items-center gap-6">
          {/* Legend */}
          <div className="flex items-center gap-5 text-xs font-medium text-stone-700">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
              <span>Festivals</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
              <span>Notes</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#55132D]" />
              <span>Duty officer</span>
            </span>
          </div>

          {/* Right Corner: Next Month Arrow */}
          <button
            onClick={goToNext}
            className="p-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Weekday Column Headers with Crisp Dividing Lines */}
      <div className="grid grid-cols-7 border-b border-stone-300 divide-x divide-stone-300 text-xs font-medium text-stone-700 bg-stone-50/50">
        {weekDayHeaders.map((day) => (
          <div key={day} className="px-4 py-2.5 text-stone-700 font-semibold">
            {day}
          </div>
        ))}
      </div>

      {/* 3. Month Days Grid with Enhanced Cell Lines Opacity */}
      <div className="grid grid-cols-7 divide-x divide-y divide-stone-300 bg-white">
        {calendarCells.map((cell) => {
          const { dateStr, dayNum, isCurrentMonth } = cell;
          const isSelected = selectedDate === dateStr;
          // November 4 is "Today" in the demo
          const isToday = isCurrentMonth && dayNum === 4;

          const officer = isCurrentMonth && dutyOfficersMap ? dutyOfficersMap[dayNum] : null;

          // Specific Events & Notes Matching Reference Screenshot
          const isKartikPurnima = isCurrentMonth && dayNum === 1;
          const isStaffReview = isCurrentMonth && dayNum === 3;
          const isRamaEkadashi = isCurrentMonth && dayNum === 6;
          const isFacilityCheck = isCurrentMonth && dayNum === 10;
          const isDiwali11 = isCurrentMonth && dayNum === 11;
          const isDiwali12 = isCurrentMonth && dayNum === 12;
          const isDiwali13 = isCurrentMonth && dayNum === 13;
          const isDiwali14 = isCurrentMonth && dayNum === 14;
          const isDiwali15 = isCurrentMonth && dayNum === 15;
          const isVolunteerMeeting = isCurrentMonth && dayNum === 19;
          const isUtpannaEkadashi = isCurrentMonth && dayNum === 21;
          const isParkingReview = isCurrentMonth && dayNum === 25;
          const isMonthEndReport = isCurrentMonth && dayNum === 28;

          return (
            <div
              key={dateStr}
              onClick={() => handleCellClick(dateStr)}
              className={`h-[128px] p-2.5 flex flex-col justify-between transition-colors cursor-pointer relative group ${
                !isCurrentMonth
                  ? 'bg-stone-50/40 text-stone-300'
                  : isToday
                  ? 'bg-[#FAF5F0]/80'
                  : isSelected
                  ? 'bg-amber-500/5 ring-2 ring-inset ring-[#55132D]'
                  : 'bg-white hover:bg-stone-50/70'
              }`}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between">
                {isToday ? (
                  <span className="w-6 h-6 rounded-full bg-[#55132D] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {dayNum}
                  </span>
                ) : (
                  <span
                    className={`text-xs font-semibold ${
                      !isCurrentMonth ? 'text-stone-300' : 'text-stone-900'
                    }`}
                  >
                    {dayNum}
                  </span>
                )}
              </div>

              {/* Event & Note Content in Cell Body */}
              <div className="flex-1 my-1 flex flex-col justify-center space-y-1 overflow-hidden">
                {/* Day 1: Kartik Purnima */}
                {isKartikPurnima && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412] font-semibold text-[11px] self-start inline-block truncate max-w-full">
                    Kartik Purnima
                  </span>
                )}

                {/* Day 3: Staff review */}
                {isStaffReview && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E40AF] font-semibold text-[11px] self-start inline-block truncate max-w-full">
                    Staff review
                  </span>
                )}

                {/* Day 6: Rama Ekadashi */}
                {isRamaEkadashi && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412] font-semibold text-[11px] self-start inline-block truncate max-w-full">
                    Rama Ekadashi
                  </span>
                )}

                {/* Day 10: Facility check */}
                {isFacilityCheck && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E40AF] font-semibold text-[11px] self-start inline-block truncate max-w-full">
                    Facility check
                  </span>
                )}

                {/* Days 11-14: Continuous Spanned Diwali Mela Bar */}
                {isDiwali11 && (
                  <div className="space-y-1 w-full">
                    <div className="bg-[#FFEDD5] text-[#9A3412] font-semibold text-[11px] py-0.5 px-2.5 rounded-l-md -mr-2.5 relative z-10 truncate whitespace-nowrap shadow-2xs">
                      Diwali Mela · 11–15 Nov
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E40AF] font-semibold text-[11px] self-start inline-block truncate max-w-full">
                      Brief officers, 8 AM
                    </span>
                  </div>
                )}
                {isDiwali12 && (
                  <div className="bg-[#FFEDD5] h-[22px] -mx-2.5 relative z-10" />
                )}
                {isDiwali13 && (
                  <div className="bg-[#FFEDD5] h-[22px] -mx-2.5 relative z-10" />
                )}
                {isDiwali14 && (
                  <div className="bg-[#FFEDD5] h-[22px] rounded-r-md -ml-2.5 flex items-center justify-end pr-2 text-stone-600 font-bold text-xs relative z-10 shadow-2xs">
                    →
                  </div>
                )}

                {/* Day 15: Diwali Mela Day 5 */}
                {isDiwali15 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412] font-semibold text-[11px] self-start inline-block truncate max-w-full">
                    Diwali Mela · Day 5
                  </span>
                )}

                {/* Day 19: Volunteer meeting */}
                {isVolunteerMeeting && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E40AF] font-semibold text-[11px] self-start inline-block truncate max-w-full">
                    Volunteer meeting
                  </span>
                )}

                {/* Day 21: Utpanna Ekadashi */}
                {isUtpannaEkadashi && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412] font-semibold text-[11px] self-start inline-block truncate max-w-full">
                    Utpanna Ekadashi
                  </span>
                )}

                {/* Day 25: Parking review */}
                {isParkingReview && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E40AF] font-semibold text-[11px] self-start inline-block truncate max-w-full">
                    Parking review
                  </span>
                )}

                {/* Day 28: Month-end report */}
                {isMonthEndReport && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E40AF] font-semibold text-[11px] self-start inline-block truncate max-w-full">
                    Month-end report
                  </span>
                )}
              </div>

              {/* Duty Officer Badge Pinned to Bottom */}
              {isCurrentMonth && (
                <div className="pt-1">
                  {officer ? (
                    <div className="flex items-center gap-1.5 self-start text-[11px] text-stone-700 font-medium">
                      <span className="w-4 h-4 rounded-full bg-[#55132D]/10 text-[#55132D] font-bold text-[9px] flex items-center justify-center shrink-0">
                        {officer.initials}
                      </span>
                      <span className="truncate">{officer.name}</span>
                    </div>
                  ) : (
                    <div className="px-2 py-0.5 rounded-full border border-dashed border-rose-400 bg-rose-50/60 text-[#B91C1C] text-[10.5px] font-medium self-start inline-block">
                      Needs officer
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
