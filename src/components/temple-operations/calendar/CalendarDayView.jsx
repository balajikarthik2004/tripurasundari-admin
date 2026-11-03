import React from 'react';
import {
  Users,
  Flame,
  Clock,
  Sparkles,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Phone,
  Trash2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

export default function CalendarDayView() {
  const navigate = useNavigate();
  const {
    selectedDate,
    setSelectedDate,
    selectedDateAgenda,
    shiftTemplates,
    deleteDutyAssignment,
    toggleTaskComplete,
    deleteTask,
    setIsAddScheduleModalOpen,
    setAddScheduleTab,
  } = useTempleCalendar();

  const { date, shifts, festivals, tasks, rituals, conflicts } = selectedDateAgenda;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-6">
      {/* Day View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-150">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Selected Day Plan
          </span>
          <h2 className="text-xl font-bold font-serif text-stone-900 mt-0.5">
            {formattedDate}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAddScheduleTab('shift');
              setIsAddScheduleModalOpen(true);
            }}
            className="px-3 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
            <span>Assign Personnel</span>
          </button>
        </div>
      </div>

      {/* Conflict Warnings Box (if any) */}
      {conflicts.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>Scheduling Conflicts Detected for {formattedDate}</span>
          </div>
          <ul className="text-xs space-y-1 pl-6 list-disc text-rose-800">
            {conflicts.map((c, idx) => (
              <li key={idx}>{c.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Festivals Banner (if any) */}
      {festivals.map((fest) => (
        <div
          key={fest.id}
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-950 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{fest.title}</span>
            </div>
            <span className="text-xs font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
              {fest.category}
            </span>
          </div>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            {fest.description}
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-amber-800 pt-1">
            <span>Expected Devotees: <strong>{fest.expectedDevotees}</strong></span>
            <span>Lead: <strong>{fest.leadAdmin}</strong></span>
          </div>
        </div>
      ))}

      {/* MAIN TWO-COLUMN WORKSPACE: SHIFTS (LEFT) & RITUALS + TASKS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: STAFF DUTY ROSTERS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-150 pb-2">
            <h3 className="font-bold text-stone-900 font-serif text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-[#55132D]" />
              <span>Staff & Volunteer Shift Allocations</span>
            </h3>
            <span className="text-xs font-number font-semibold text-stone-600">
              {shifts.length} Total Assignments
            </span>
          </div>

          <div className="space-y-4">
            {shiftTemplates.map((template) => {
              const assignedToShift = shifts.filter((s) => s.shiftId === template.id);

              return (
                <div
                  key={template.id}
                  className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3"
                >
                  {/* Shift Sub-Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: template.color }}
                        />
                        <span>{template.name}</span>
                      </h4>
                      <span className="text-[11px] text-stone-500 font-mono mt-0.5 block">
                        {template.time}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold font-number px-2 py-0.5 rounded ${
                          assignedToShift.length < template.requiredStrength - 2
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {assignedToShift.length} / {template.requiredStrength} Assigned
                      </span>
                    </div>
                  </div>

                  {/* Assigned Staff Table / Cards */}
                  {assignedToShift.length > 0 ? (
                    <div className="space-y-2">
                      {assignedToShift.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="bg-white p-3 rounded-lg border border-stone-200/90 shadow-2xs flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold text-stone-900 flex items-center gap-2">
                              <span>{assignment.staffName}</span>
                              {assignment.status === 'Conflict' && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                                  Conflict
                                </span>
                              )}
                            </div>
                            <div className="text-stone-600 flex items-center gap-3 text-[11px]">
                              <span className="font-medium text-[#55132D]">
                                {assignment.role}
                              </span>
                              <span className="text-stone-400">•</span>
                              <span className="flex items-center gap-1 text-stone-500">
                                <MapPin className="w-3 h-3" />
                                {assignment.zoneName}
                              </span>
                            </div>
                            {assignment.conflictReason && (
                              <p className="text-[10px] text-rose-700 font-medium">
                                {assignment.conflictReason}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {assignment.contact && (
                              <a
                                href={`tel:${assignment.contact}`}
                                className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                                title={`Call ${assignment.staffName}`}
                              >
                                <Phone className="w-3.5 h-3.5 text-stone-600" />
                              </a>
                            )}
                            <button
                              onClick={() => deleteDutyAssignment(assignment.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Remove assignment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/80 p-3 rounded-lg border border-dashed border-stone-300 text-center text-xs text-stone-500">
                      No personnel currently assigned to this shift.
                    </div>
                  )}

                  {/* Quick Add To Shift */}
                  <button
                    onClick={() => {
                      setAddScheduleTab('shift');
                      setIsAddScheduleModalOpen(true);
                    }}
                    className="w-full py-1.5 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#55132D]" />
                    <span>Assign Staff to {template.shortName}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: SACRED RITUALS & OPERATIONAL TASKS */}
        <div className="lg:col-span-5 space-y-5">
          {/* DAILY RITUAL SCHEDULE INTEGRATION */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-bold text-stone-900 font-serif text-xs flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Daily Ritual Schedule</span>
              </h3>
              <button
                onClick={() => navigate('/ritual-schedule')}
                className="text-xs font-semibold text-[#55132D] hover:underline flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {rituals.map((ritual) => (
                <div
                  key={ritual.id}
                  className="bg-white p-2.5 rounded-lg border border-stone-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{ritual.name}</span>
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {ritual.time}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center justify-between">
                    <span>{ritual.priestInCharge}</span>
                    <span className="text-stone-400">{ritual.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OPERATIONAL TASKS DUE TODAY */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-bold text-stone-900 font-serif text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-700" />
                <span>Administrative Tasks Due</span>
              </h3>
              <button
                onClick={() => {
                  setAddScheduleTab('task');
                  setIsAddScheduleModalOpen(true);
                }}
                className="text-xs font-semibold text-[#55132D] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Task</span>
              </button>
            </div>

            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-2.5 rounded-lg border border-stone-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`mt-0.5 p-0.5 rounded border ${
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
                              : 'text-stone-900'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                          task.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-500 pl-6 flex items-center justify-between">
                      <span>{task.responsiblePerson}</span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-stone-400 hover:text-rose-600 p-0.5"
                        title="Delete task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/80 p-3 rounded-lg border border-dashed border-stone-300 text-center text-xs text-stone-500">
                No administrative tasks due on this date.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

