import React from 'react';
import {
  CalendarHeader,
  CalendarMonthView,
  CalendarWeekView,
  CalendarDayView,
  CalendarAgendaView,
  CalendarDayDetailDrawer,
  CalendarAddScheduleModal,
} from '../components/temple-operations/calendar';
import { useTempleCalendar } from '../context/TempleCalendarContext';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TempleCalendar() {
  const { view, calendarToast } = useTempleCalendar();

  return (
    <div className="space-y-4 pb-12 select-none">
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

      {/* 1. Header (Clean Temple Calendar + View Switcher + Actions) */}
      <CalendarHeader />

      {/* 2. Full-Width Calendar Views (Matches Reference Image) */}
      <div className="w-full">
        {view === 'month' && <CalendarMonthView />}
        {view === 'week' && <CalendarWeekView />}
        {view === 'day' && <CalendarDayView />}
        {view === 'agenda' && <CalendarAgendaView />}
      </div>

      {/* 3. Slide-in Day Detail Info Drawer (Triggered by tapping any cell) */}
      <CalendarDayDetailDrawer />

      {/* 4. Add Schedule Modal */}
      <CalendarAddScheduleModal />
    </div>
  );
}
