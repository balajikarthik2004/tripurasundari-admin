import React, { useMemo } from 'react';
import {
  Users,
  Clock,
  Sparkles,
  Flame,
  AlertTriangle,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

export default function CalendarWeekView() {
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    setIsDetailDrawerOpen,
    setIsAddScheduleModalOpen,
    setAddScheduleTab,
    categoryFilter,
    shiftFilter,
    staffFilter,
    searchQuery,
    dutyAssignments,
    festivals,
    tasks,
    rituals,
    shiftTemplates,
    checkConflictsForDate,
  } = useTempleCalendar();

  // Compute 7 days for the current week based on currentDate
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const dayOfWeek = curr.getDay(); // 0 is Sun
    const firstDay = new Date(curr);
    firstDay.setDate(curr.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(firstDay);
      d.setDate(firstDay.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      days.push({
        date: d,
        dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return days;
  }, [currentDate]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
      {/* 7 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-stone-200">
        {weekDays.map((day) => {
          const { dateStr, dayName, dayNum, monthName } = day;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === '2026-11-01';

          // Data for this date
          const dayDuties = dutyAssignments.filter((a) => {
            if (a.date !== dateStr) return false;
            if (shiftFilter !== 'ALL' && a.shiftId !== shiftFilter) return false;
            if (staffFilter !== 'ALL' && a.staffId !== staffFilter) return false;
            if (
              searchQuery &&
              !a.staffName.toLowerCase().includes(searchQuery.toLowerCase()) &&
              !a.role.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              return false;
            }
            return true;
          });

          const dayFestivals = festivals.filter(
            (f) => dateStr >= f.startDate && dateStr <= f.endDate
          );

          const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
          const conflicts = checkConflictsForDate(dateStr);
          const hasConflict = conflicts.length > 0;

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`p-3 min-h-[500px] flex flex-col justify-between transition-colors ${
                isSelected
                  ? 'bg-[#55132D]/5'
                  : 'bg-white hover:bg-stone-50/70'
              }`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">
                      {dayName}
                    </span>
                    <span className="text-lg font-bold font-serif text-stone-900">
                      {dayNum} {monthName}
                    </span>
                  </div>
                  {isToday && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#55132D] text-white">
                      Today
                    </span>
                  )}
                </div>

                {/* Festival Banner if any */}
                {dayFestivals.map((fest) => (
                  <div
                    key={fest.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(dateStr);
                      setIsDetailDrawerOpen(true);
                    }}
                    className="mt-2 p-1.5 rounded-lg bg-amber-500/15 border border-amber-400/40 text-amber-950 text-[10px] font-bold cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600 flex-shrink-0" />
                      <span className="truncate">{fest.shortTitle}</span>
                    </div>
                  </div>
                ))}

                {/* Conflict Alert Banner */}
                {hasConflict && (
                  <div className="mt-2 p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600 flex-shrink-0" />
                    <span className="truncate">{conflicts[0].message}</span>
                  </div>
                )}

                {/* SHIFTS BREAKDOWN */}
                {(categoryFilter === 'ALL' || categoryFilter === 'SHIFTS') && (
                  <div className="mt-3 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#55132D]" />
                        <span>Shift Rosters</span>
                      </span>
                      <span className="font-number text-stone-500">
                        {dayDuties.length}
                      </span>
                    </div>

                    {shiftTemplates.map((shift) => {
                      const shiftStaff = dayDuties.filter(
                        (d) => d.shiftId === shift.id
                      );
                      if (shiftStaff.length === 0) return null;

                      return (
                        <div
                          key={shift.id}
                          className="bg-stone-50 rounded-xl p-2 border border-stone-200/80 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#55132D] uppercase tracking-wide">
                              {shift.shortName}
                            </span>
                            <span className="text-[10px] font-mono text-stone-500">
                              {shiftStaff.length}/{shift.requiredStrength}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {shiftStaff.map((staff) => (
                              <div
                                key={staff.id}
                                className="bg-white p-1.5 rounded-lg border border-stone-150 text-[11px] space-y-0.5"
                              >
                                <div className="font-semibold text-stone-800 truncate">
                                  {staff.staffName}
                                </div>
                                <div className="text-[10px] text-stone-500 truncate">
                                  {staff.role}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* DAILY RITUALS (Summary in week view) */}
                {(categoryFilter === 'ALL' || categoryFilter === 'RITUALS') && (
                  <div className="mt-3 pt-2 border-t border-stone-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-600" />
                        <span>Sacred Aartis</span>
                      </span>
                      <span className="font-number text-stone-500">6</span>
                    </div>
                    <div className="text-[10px] text-stone-600 bg-amber-50/60 p-1.5 rounded-lg border border-amber-200/60 leading-tight">
                      Mangala (05:00) → Abhishekam (07:00) → Rajbhog (12:00) → Sandhya (16:00) → Shayana (19:00)
                    </div>
                  </div>
                )}

                {/* PREPARATION TASKS */}
                {(categoryFilter === 'ALL' || categoryFilter === 'TASKS') &&
                  dayTasks.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-stone-100 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-600" />
                          <span>Prep Tasks</span>
                        </span>
                        <span className="font-number text-stone-500">
                          {dayTasks.length}
                        </span>
                      </div>
                      {dayTasks.map((t) => (
                        <div
                          key={t.id}
                          className="bg-white p-1.5 rounded-lg border border-stone-200 text-[10.5px] leading-tight space-y-0.5"
                        >
                          <div className="font-semibold text-stone-800 truncate">
                            {t.title}
                          </div>
                          <div className="text-[9.5px] text-rose-700 font-bold">
                            {t.priority} Priority
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Bottom Card Actions: Open Day Detail Drawer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setIsDetailDrawerOpen(true);
                  }}
                  className="w-full py-1 text-center text-xs font-semibold text-[#55132D] hover:bg-[#55132D]/10 rounded-lg transition-colors"
                >
                  Manage Day Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

