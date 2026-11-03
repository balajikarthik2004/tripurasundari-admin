import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Flame,
  Users,
  Printer,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

export default function CalendarSelectedDatePanel() {
  const {
    selectedDate,
    dutyAssignments,
    festivals,
    tasks,
    toggleTaskComplete,
    showToast,
    checkConflictsForDate,
    setIsAddScheduleModalOpen,
    setAddScheduleTab,
  } = useTempleCalendar();

  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'duties' | 'tasks'

  // Format selected date
  const dateObj = new Date(selectedDate + 'T00:00:00');
  const isToday = selectedDate === '2026-11-01';

  const formattedHeader = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Filter items for selected date
  const dayAssignments = dutyAssignments.filter((a) => a.date === selectedDate);
  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);
  const dayFestivals = festivals.filter(
    (f) => selectedDate >= f.startDate && selectedDate <= f.endDate
  );

  // Conflicts on selected date
  const dayConflicts = checkConflictsForDate(selectedDate);

  const morningStaff = dayAssignments.filter((a) => a.shiftId === 'SHF-MORNING');
  const afternoonStaff = dayAssignments.filter((a) => a.shiftId === 'SHF-AFTERNOON');
  const nightStaff = dayAssignments.filter((a) => a.shiftId === 'SHF-NIGHT');

  const handlePrintDutySheet = () => {
    showToast(`Duty sheet generated for ${formattedHeader}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-5.5 flex flex-col h-[680px] justify-between">
      {/* TOP PINNED SECTION: Header & Tabs */}
      <div className="shrink-0">
        {/* 1. Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#55132D]" />
            <h2 className="text-base font-bold font-serif text-stone-900 tracking-tight">
              {formattedHeader}
            </h2>
          </div>
          {isToday && (
            <span className="text-xs font-semibold text-[#8B2648] bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">
              Today
            </span>
          )}
        </div>

        {/* 2. Tabs */}
        <div className="flex items-center bg-stone-100/90 p-1 rounded-xl text-xs font-semibold mt-3 border border-stone-200 gap-1">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              activeTab === 'schedule'
                ? 'bg-[#55132D] text-white shadow-xs font-bold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('duties')}
            className={`flex-1 py-2 rounded-lg transition-all text-center relative ${
              activeTab === 'duties'
                ? 'bg-[#55132D] text-white shadow-xs font-bold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Duties
            {dayConflicts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2.5" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              activeTab === 'tasks'
                ? 'bg-[#55132D] text-white shadow-xs font-bold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Tasks
          </button>
        </div>
      </div>

      {/* MIDDLE SCROLLABLE SECTION: Tab Content */}
      <div className="flex-1 my-3 overflow-y-auto custom-scrollbar pt-1 pr-1.5 min-h-0 space-y-2.5">
        {/* TAB 1: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-2.5">
            {dayFestivals.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 mb-2">
                <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block mb-0.5">
                  Special Occasion
                </span>
                <div className="text-xs font-bold text-stone-900">
                  {dayFestivals[0].title}
                </div>
              </div>
            )}

            {/* Ritual 1 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:bg-stone-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                    Morning Rituals & Mangala Aarti
                  </h4>
                  <span className="text-xs text-stone-500 mt-0.5 block font-medium">5:30 AM – 7:00 AM</span>
                </div>
              </div>
            </div>

            {/* Shift 1: Morning */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:bg-stone-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#55132D]/5 text-[#55132D] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">Pratah Shift (Morning)</h4>
                  <span className="text-xs text-stone-500 mt-0.5 block font-medium">6:00 AM – 2:00 PM</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200/80">
                {morningStaff.length > 0 ? `${morningStaff.length} Staff` : '8 Staff'}
              </span>
            </div>

            {/* Shift 2: Afternoon */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:bg-stone-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#55132D]/5 text-[#55132D] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">Madhyahna Shift (Afternoon)</h4>
                  <span className="text-xs text-stone-500 mt-0.5 block font-medium">2:00 PM – 10:00 PM</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200/80">
                {afternoonStaff.length > 0 ? `${afternoonStaff.length} Staff` : '8 Staff'}
              </span>
            </div>

            {/* Ritual 2: Aarti */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:bg-stone-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">Evening Sandhya Aarti</h4>
                  <span className="text-xs text-stone-500 mt-0.5 block font-medium">6:30 PM – 7:00 PM</span>
                </div>
              </div>
            </div>

            {/* Shift 3: Night */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:bg-stone-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#55132D]/5 text-[#55132D] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">Ratri Shift (Night Patrol)</h4>
                  <span className="text-xs text-stone-500 mt-0.5 block font-medium">10:00 PM – 6:00 AM</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200/80">
                {nightStaff.length > 0 ? `${nightStaff.length} Staff` : '8 Staff'}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: DUTIES */}
        {activeTab === 'duties' && (
          <div className="space-y-2.5">
            {/* Conflict warning if present */}
            {dayConflicts.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="text-xs font-semibold">
                  {dayConflicts[0].message}
                </span>
              </div>
            )}

            {dayAssignments.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 bg-stone-50/80 rounded-2xl space-y-2 border border-dashed border-stone-300">
                <p>No customized duty assignments recorded for this date.</p>
                <button
                  onClick={() => {
                    setAddScheduleTab('shift');
                    setIsAddScheduleModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-[#55132D] font-bold text-xs hover:underline mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Staff Duty</span>
                </button>
              </div>
            ) : (
              dayAssignments.map((duty) => (
                <div
                  key={duty.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors shadow-2xs ${
                    duty.status === 'Conflict'
                      ? 'bg-rose-50/80 border-rose-200'
                      : 'bg-white border-stone-200/90 hover:bg-stone-50/80'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{duty.staffName}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{duty.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-stone-700 block">
                      {duty.zoneName}
                    </span>
                    <span
                      className={`text-xs font-bold mt-0.5 block ${
                        duty.status === 'Conflict'
                          ? 'text-rose-700'
                          : 'text-emerald-750'
                      }`}
                    >
                      {duty.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-2.5">
            {dayTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 bg-stone-50/80 rounded-2xl space-y-2 border border-dashed border-stone-300">
                <p>No preparation tasks scheduled for this date.</p>
                <button
                  onClick={() => {
                    setAddScheduleTab('task');
                    setIsAddScheduleModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-[#55132D] font-bold text-xs hover:underline mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            ) : (
              dayTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTaskComplete(t.id)}
                  className="p-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex items-start gap-3 cursor-pointer hover:bg-stone-50/80 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={t.status === 'Completed'}
                    readOnly
                    className="mt-0.5 rounded text-[#55132D] focus:ring-[#55132D]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-xs font-bold ${
                        t.status === 'Completed' ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {t.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                      <span
                        className={`font-semibold ${
                          t.priority === 'High' ? 'text-amber-800' : 'text-stone-600'
                        }`}
                      >
                        {t.priority} Priority
                      </span>
                      <span>• {t.department}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* BOTTOM PINNED SECTION: Upcoming Occasions & Duty Sheet Button */}
      <div className="shrink-0 pt-3.5 border-t border-stone-200 space-y-3">
        <div>
          <div className="mb-2">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Upcoming Occasions</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Diwali Mela 2026</h4>
                <span className="text-xs text-stone-500 mt-0.5 block">11 Nov – 15 Nov 2026</span>
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Major Festival
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Utpanna Ekadashi</h4>
                <span className="text-xs text-stone-500 mt-0.5 block">21 Nov 2026</span>
              </div>
              <span className="text-[10px] font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
                Vrata & Seva
              </span>
            </div>
          </div>
        </div>

        {/* Generate Duty Sheet Button */}
        <button
          onClick={handlePrintDutySheet}
          className="w-full py-2.5 px-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center justify-center gap-2"
        >
          <Printer className="w-3.5 h-3.5 text-stone-600" />
          <span>Generate Daily Duty Sheet</span>
        </button>
      </div>
    </div>
  );
}
