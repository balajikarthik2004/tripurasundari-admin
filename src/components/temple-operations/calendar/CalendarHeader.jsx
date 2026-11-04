import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

export default function CalendarHeader() {
  const {
    view,
    setView,
    setIsAddScheduleModalOpen,
    setAddScheduleTab,
  } = useTempleCalendar();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 pb-1">
      {/* Left: Title & View Switcher */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-[#55132D]" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
            Temple Calendar
          </h1>
        </div>

        {/* View Switcher: Month | Week | Agenda */}
        <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200/80 text-xs font-semibold">
          {[
            { id: 'month', label: 'Month' },
            { id: 'week', label: 'Week' },
            { id: 'agenda', label: 'Agenda' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                view === v.id
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Controls: + Add Button */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <button
          onClick={() => {
            setAddScheduleTab('shift');
            setIsAddScheduleModalOpen(true);
          }}
          className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}
