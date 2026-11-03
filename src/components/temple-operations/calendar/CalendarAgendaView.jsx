import React, { useMemo } from 'react';
import {
  CalendarDays,
  Users,
  Flame,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

export default function CalendarAgendaView() {
  const {
    dutyAssignments,
    festivals,
    tasks,
    rituals,
    setSelectedDate,
    setIsDetailDrawerOpen,
    categoryFilter,
    shiftFilter,
    staffFilter,
    searchQuery,
    toggleTaskComplete,
    checkConflictsForDate,
  } = useTempleCalendar();

  // Aggregate and sort all distinct dates with active items
  const agendaDates = useMemo(() => {
    const datesSet = new Set();

    dutyAssignments.forEach((d) => datesSet.add(d.date));
    festivals.forEach((f) => {
      datesSet.add(f.startDate);
      if (f.endDate && f.endDate !== f.startDate) {
        datesSet.add(f.endDate);
      }
    });
    tasks.forEach((t) => datesSet.add(t.dueDate));

    const sorted = Array.from(datesSet).sort();
    return sorted;
  }, [dutyAssignments, festivals, tasks]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-150">
        <div>
          <h2 className="text-lg font-bold font-serif text-stone-900">
            Chronological Temple Agenda
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Sequential timeline of upcoming staff duties, special occasions, and deadlines.
          </p>
        </div>
        <span className="text-xs font-semibold text-stone-600 font-number bg-stone-100 px-3 py-1 rounded-full">
          {agendaDates.length} Scheduled Days Ahead
        </span>
      </div>

      <div className="space-y-6">
        {agendaDates.map((dateStr) => {
          const dateObj = new Date(dateStr);
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });

          // Items for this date
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

          const dayTasks = tasks.filter((t) => {
            if (t.dueDate !== dateStr) return false;
            if (
              searchQuery &&
              !t.title.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              return false;
            }
            return true;
          });

          const conflicts = checkConflictsForDate(dateStr);
          const hasConflict = conflicts.length > 0;

          // Check if date has visible items under current filter
          const hasDuties = (categoryFilter === 'ALL' || categoryFilter === 'SHIFTS') && dayDuties.length > 0;
          const hasFests = (categoryFilter === 'ALL' || categoryFilter === 'FESTIVALS') && dayFestivals.length > 0;
          const hasTasks = (categoryFilter === 'ALL' || categoryFilter === 'TASKS') && dayTasks.length > 0;
          const hasRituals = categoryFilter === 'ALL' || categoryFilter === 'RITUALS';

          if (!hasDuties && !hasFests && !hasTasks && !hasRituals) return null;

          return (
            <div
              key={dateStr}
              className="bg-stone-50/70 rounded-xl p-4 border border-stone-200/90 space-y-3.5"
            >
              {/* Date Group Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#55132D] text-white flex flex-col items-center justify-center font-bold font-number text-xs leading-none">
                    <span>{dateObj.getDate()}</span>
                    <span className="text-[8px] font-sans uppercase">
                      {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 font-serif text-sm">
                      {formattedDate}
                    </h3>
                    {hasConflict && (
                      <span className="text-[11px] text-rose-700 font-semibold flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Overlap Conflict on Duty Roster</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setIsDetailDrawerOpen(true);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-[#55132D] hover:bg-white rounded-lg transition-colors border border-stone-200 flex items-center gap-1 self-start sm:self-center"
                >
                  <span>Open Day Plan</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Day Contents */}
              <div className="space-y-3">
                {/* 1. Festivals */}
                {hasFests &&
                  dayFestivals.map((fest) => (
                    <div
                      key={fest.id}
                      className="p-3 bg-amber-500/10 border border-amber-300 rounded-lg text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-serif text-amber-900 text-sm flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>{fest.title}</span>
                        </span>
                        <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                          {fest.category}
                        </span>
                      </div>
                      <p className="text-stone-700 leading-relaxed text-[11px]">
                        {fest.description}
                      </p>
                    </div>
                  ))}

                {/* 2. Staff Duties */}
                {hasDuties && (
                  <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-2 text-xs">
                    <span className="font-bold text-stone-800 text-[11px] uppercase tracking-wider block">
                      Assigned Personnel ({dayDuties.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {dayDuties.map((duty) => (
                        <div
                          key={duty.id}
                          className="p-2 bg-stone-50 rounded-lg border border-stone-150 space-y-0.5"
                        >
                          <div className="font-bold text-stone-900 truncate">
                            {duty.staffName}
                          </div>
                          <div className="text-[11px] text-[#55132D] font-medium truncate">
                            {duty.role}
                          </div>
                          <div className="text-[10px] text-stone-500 truncate flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{duty.zoneName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Prep Tasks */}
                {hasTasks && (
                  <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-2 text-xs">
                    <span className="font-bold text-stone-800 text-[11px] uppercase tracking-wider block">
                      Administrative Tasks Due ({dayTasks.length})
                    </span>
                    <div className="space-y-1.5">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between gap-2 p-1.5 bg-stone-50 rounded-lg border border-stone-150"
                        >
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleTaskComplete(task.id)}
                              className={`p-0.5 rounded border ${
                                task.status === 'Completed'
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'border-stone-300 hover:border-stone-500'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <span
                              className={`font-semibold ${
                                task.status === 'Completed'
                                  ? 'line-through text-stone-400'
                                  : 'text-stone-800'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>
                          <span
                            className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                              task.priority === 'High'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
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

