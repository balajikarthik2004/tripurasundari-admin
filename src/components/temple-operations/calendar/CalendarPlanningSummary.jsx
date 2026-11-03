import React from 'react';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';
import { Users, Flame, Calendar as CalendarIcon, CheckSquare } from 'lucide-react';

export default function CalendarPlanningSummary() {
  const { setSelectedDate, dutyAssignments, tasks } = useTempleCalendar();

  const todayAssignments = dutyAssignments.filter((a) => a.date === '2026-11-01');
  const staffCount = todayAssignments.length > 0 ? todayAssignments.length : 24;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const highPriorityTasksCount = tasks.filter(
    (t) => t.status !== 'Completed' && t.priority === 'High'
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Today's Duty */}
      <div
        onClick={() => setSelectedDate('2026-11-01')}
        className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-5.5 shadow-2xs hover:shadow-xs hover:border-[#55132D]/40 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Today's Duty
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#55132D]/5 text-[#55132D] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
            {staffCount} Personnel Assigned
          </div>
          <div className="text-xs text-stone-500 mt-1.5 font-medium">
            3 Scheduled Shifts Active
          </div>
        </div>
      </div>

      {/* 2. Today's Rituals */}
      <div
        onClick={() => setSelectedDate('2026-11-01')}
        className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-5.5 shadow-2xs hover:shadow-xs hover:border-[#B68A36]/40 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Today's Rituals
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
            5 Scheduled Rituals
          </div>
          <div className="text-xs text-stone-500 mt-1.5 font-medium">
            Next: Evening Aarti (6:30 PM)
          </div>
        </div>
      </div>

      {/* 3. Next Special Occasion */}
      <div
        onClick={() => setSelectedDate('2026-11-11')}
        className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-5.5 shadow-2xs hover:shadow-xs hover:border-[#EA580C]/40 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Next Special Occasion
          </span>
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight leading-tight truncate">
            Diwali Mela 2026
          </div>
          <div className="text-xs text-stone-500 mt-1.5 font-medium">
            11 Nov – 15 Nov 2026
          </div>
        </div>
      </div>

      {/* 4. Pending Preparation */}
      <div
        onClick={() => setSelectedDate('2026-11-01')}
        className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-5.5 shadow-2xs hover:shadow-xs hover:border-[#2563EB]/40 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Pending Preparation
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckSquare className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
            {pendingTasksCount} Pending Tasks
          </div>
          <div className="text-xs text-stone-500 mt-1.5 font-medium">
            {highPriorityTasksCount} High-Priority Items
          </div>
        </div>
      </div>
    </div>
  );
}
