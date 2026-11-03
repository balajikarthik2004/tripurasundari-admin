import React from 'react';
import { Plus } from 'lucide-react';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

export default function CalendarHeader() {
  const {
    view,
    setView,
    setIsAddScheduleModalOpen,
    setAddScheduleTab,
  } = useTempleCalendar();

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs px-6 py-4.5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
      {/* Left: Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
          Temple Calendar & Duty Planner
        </h1>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          Plan temple activities, staff duties and occasions.
        </p>
      </div>

      {/* Right Controls: View Switcher & Add Schedule */}
      <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
        {/* View Switcher: Month | Week | Day | Agenda */}
        <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200 text-xs font-medium">
          {['month', 'week', 'day', 'agenda'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3.5 py-1.5 rounded-lg capitalize transition-all font-semibold ${
                view === v
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Add Schedule Button */}
        <button
          onClick={() => {
            setAddScheduleTab('shift');
            setIsAddScheduleModalOpen(true);
          }}
          className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Schedule</span>
        </button>
      </div>
    </div>
  );
}
