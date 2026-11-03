import React from 'react';
import {
  CalendarHeader,
  CalendarPlanningSummary,
  CalendarMonthView,
  CalendarWeekView,
  CalendarDayView,
  CalendarAgendaView,
  CalendarSelectedDatePanel,
  CalendarAddScheduleModal,
} from '../components/temple-operations/calendar';
import { useTempleCalendar } from '../context/TempleCalendarContext';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TempleCalendar() {
  const { view, calendarToast } = useTempleCalendar();

  return (
    <div className="space-y-6 pb-14 select-none">
      {/* Toast Notification */}
      {calendarToast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl border shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            calendarToast.type === 'warning'
              ? 'bg-amber-900 text-white border-amber-600'
              : 'bg-[#38091B] text-white border-[#B68A36]/40'
          }`}
        >
          {calendarToast.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-300" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{calendarToast.message}</span>
        </div>
      )}

      {/* 1. Header (Clean & Minimal: Title, Subtitle, View Switcher & Add Schedule) */}
      <CalendarHeader />

      {/* 2. Top 4 Useful Summary Cards (Today's Duty, Today's Rituals, Next Occasion, Pending Tasks) */}
      <CalendarPlanningSummary />

      {/* 3. Main Two-Column Calendar Layout (Matches Reference Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Calendar View (~70% width) */}
        <div className="lg:col-span-8">
          {view === 'month' && <CalendarMonthView />}
          {view === 'week' && <CalendarWeekView />}
          {view === 'day' && <CalendarDayView />}
          {view === 'agenda' && <CalendarAgendaView />}
        </div>

        {/* Right Column: Selected Date Panel (~30% width) */}
        <div className="lg:col-span-4">
          <CalendarSelectedDatePanel />
        </div>
      </div>

      {/* 4. Add Schedule Modal */}
      <CalendarAddScheduleModal />
    </div>
  );
}
