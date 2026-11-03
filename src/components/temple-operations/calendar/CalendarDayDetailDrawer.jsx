import React from 'react';
import {
  X,
  Users,
  Flame,
  Clock,
  Sparkles,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  Phone,
  MapPin,
  CalendarDays,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

export default function CalendarDayDetailDrawer() {
  const navigate = useNavigate();
  const {
    isDetailDrawerOpen,
    setIsDetailDrawerOpen,
    selectedDateAgenda,
    shiftTemplates,
    deleteDutyAssignment,
    toggleTaskComplete,
    deleteTask,
    setIsAddScheduleModalOpen,
    setAddScheduleTab,
  } = useTempleCalendar();

  if (!isDetailDrawerOpen) return null;

  const { date, shifts, festivals, tasks, rituals, conflicts } = selectedDateAgenda;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in"
        onClick={() => setIsDetailDrawerOpen(false)}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-stone-200 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 bg-[#55132D] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-5 h-5 text-[#E2BC6B]" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#E2BC6B] block">
                  Day Schedule Inspector
                </span>
                <h3 className="text-sm font-bold font-serif leading-tight">
                  {formattedDate}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsDetailDrawerOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            {/* 1. Conflict Warning Box */}
            {conflicts.length > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-xs text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Scheduling Conflicts Detected</span>
                </div>
                <ul className="pl-5 list-disc text-[11px] space-y-1 text-rose-800">
                  {conflicts.map((c, idx) => (
                    <li key={idx}>{c.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 2. Special Festivals Occurring on this Date */}
            {festivals.map((fest) => (
              <div
                key={fest.id}
                className="p-3.5 bg-amber-500/10 border border-amber-300 rounded-xl space-y-1.5 text-amber-950"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-serif text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{fest.title}</span>
                  </span>
                  <span className="text-[9.5px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                    {fest.category}
                  </span>
                </div>
                <p className="text-[11px] text-stone-700 leading-relaxed">
                  {fest.description}
                </p>
                <div className="pt-1 text-[10px] text-amber-900/80 font-medium flex items-center justify-between">
                  <span>Lead: {fest.leadAdmin}</span>
                  <span>Est. Devotees: {fest.expectedDevotees}</span>
                </div>
              </div>
            ))}

            {/* 3. Staff Shift Duty Allocations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-stone-150 pb-1.5">
                <span className="font-bold font-serif text-stone-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#55132D]" />
                  <span>Staff & Volunteer Shifts ({shifts.length})</span>
                </span>
                <button
                  onClick={() => {
                    setAddScheduleTab('shift');
                    setIsAddScheduleModalOpen(true);
                  }}
                  className="text-xs font-semibold text-[#55132D] hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Assign</span>
                </button>
              </div>

              {shiftTemplates.map((template) => {
                const shiftPersonnel = shifts.filter((s) => s.shiftId === template.id);

                return (
                  <div
                    key={template.id}
                    className="bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-stone-900 text-xs block">
                          {template.name}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {template.time}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-stone-700 border border-stone-200">
                        {shiftPersonnel.length} / {template.requiredStrength}
                      </span>
                    </div>

                    {shiftPersonnel.length > 0 ? (
                      <div className="space-y-1.5">
                        {shiftPersonnel.map((person) => (
                          <div
                            key={person.id}
                            className="bg-white p-2 rounded-lg border border-stone-200 flex items-center justify-between gap-2 shadow-2xs"
                          >
                            <div className="space-y-0.5 min-w-0">
                              <div className="font-bold text-stone-900 truncate flex items-center gap-1.5">
                                <span className="truncate">{person.staffName}</span>
                                {person.status === 'Conflict' && (
                                  <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1 py-0.2 rounded">
                                    Double Shift
                                  </span>
                                )}
                              </div>
                              <div className="text-[10.5px] text-[#55132D] font-medium truncate">
                                {person.role}
                              </div>
                              <div className="text-[10px] text-stone-500 flex items-center gap-1 truncate">
                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">{person.zoneName}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {person.contact && (
                                <a
                                  href={`tel:${person.contact}`}
                                  className="p-1 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded"
                                  title="Call"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                              )}
                              <button
                                onClick={() => deleteDutyAssignment(person.id)}
                                className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                title="Remove assignment"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 text-center text-stone-400 bg-white/70 rounded-lg border border-dashed border-stone-200 text-[11px]">
                        No personnel allocated yet.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 4. Daily Ritual Schedule Integration */}
            <div className="space-y-2.5 pt-2 border-t border-stone-150">
              <div className="flex items-center justify-between">
                <span className="font-bold font-serif text-stone-900 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>Daily Ritual Timetable</span>
                </span>
                <button
                  onClick={() => {
                    setIsDetailDrawerOpen(false);
                    navigate('/ritual-schedule');
                  }}
                  className="text-xs font-semibold text-[#55132D] hover:underline flex items-center gap-0.5"
                >
                  <span>Ritual Desk</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-1.5">
                {rituals.map((ritual) => (
                  <div
                    key={ritual.id}
                    className="bg-white p-2 rounded-lg border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-800 block text-[11px]">
                        {ritual.name}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {ritual.priestInCharge}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {ritual.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Operational Tasks Due */}
            <div className="space-y-2.5 pt-2 border-t border-stone-150">
              <div className="flex items-center justify-between">
                <span className="font-bold font-serif text-stone-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-700" />
                  <span>Administrative Tasks ({tasks.length})</span>
                </span>
                <button
                  onClick={() => {
                    setAddScheduleTab('task');
                    setIsAddScheduleModalOpen(true);
                  }}
                  className="text-xs font-semibold text-[#55132D] hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Task</span>
                </button>
              </div>

              {tasks.length > 0 ? (
                <div className="space-y-1.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white p-2.5 rounded-xl border border-stone-200 space-y-1 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <button
                            onClick={() => toggleTaskComplete(task.id)}
                            className={`mt-0.5 p-0.5 rounded border ${
                              task.status === 'Completed'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'border-stone-300 hover:border-stone-500'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                          </button>
                          <span
                            className={`font-semibold leading-tight ${
                              task.status === 'Completed'
                                ? 'line-through text-stone-400'
                                : 'text-stone-900'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            task.priority === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-stone-500 pl-5">
                        <span>{task.responsiblePerson}</span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-stone-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-xs">
                  No preparation tasks scheduled for this date.
                </div>
              )}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setAddScheduleTab('shift');
                setIsAddScheduleModalOpen(true);
              }}
              className="flex-1 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Add Shift / Task</span>
            </button>
            <button
              onClick={() => setIsDetailDrawerOpen(false)}
              className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

