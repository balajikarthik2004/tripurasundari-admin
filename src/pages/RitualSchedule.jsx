import React, { useMemo } from 'react';
import {
  Flame,
  Sun,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useTempleOperations } from '../context/TempleOperationsContext';
import OperationsMetricCard from '../components/temple-operations/shared/OperationsMetricCard';

export default function RitualSchedule() {
  const {
    ritualSchedule,
    updateRitualScheduleStatus,
  } = useTempleOperations();

  // Current active ritual
  const activeRitual = useMemo(
    () => ritualSchedule.find((r) => r.status === 'In Progress') || ritualSchedule[0],
    [ritualSchedule]
  );

  // Next upcoming ritual
  const nextRitual = useMemo(
    () => ritualSchedule.find((r) => r.status === 'Upcoming'),
    [ritualSchedule]
  );

  const completedCount = useMemo(
    () => ritualSchedule.filter((r) => r.status === 'Completed').length,
    [ritualSchedule]
  );

  return (
    <div className="space-y-4 pb-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <OperationsMetricCard
          label="Daily Ritual Cycle"
          value={`${ritualSchedule.length} Sequences`}
          subtext="From Mangala to Shayana Aarti"
          icon={Flame}
        />
        <OperationsMetricCard
          label="Active In Sanctum"
          value={activeRitual ? activeRitual.time : '09:00 AM'}
          subtext={activeRitual ? activeRitual.name : 'Alankara Darshan'}
          icon={Sun}
        />
        <OperationsMetricCard
          label="Next Upcoming Ritual"
          value={nextRitual ? nextRitual.time : '12:00 PM'}
          subtext={nextRitual ? nextRitual.name : 'Madhyahna Aarti'}
          icon={Clock}
        />
        <OperationsMetricCard
          label="Cycle Progress"
          value={`${completedCount} of ${ritualSchedule.length}`}
          subtext={`${Math.round((completedCount / ritualSchedule.length) * 100)}% concluded today`}
          icon={CheckCircle}
        />
      </div>

      {/* Daily Rituals List */}
      <div className="space-y-3">
        {ritualSchedule.map((ritual, idx) => {
          const isCompleted = ritual.status === 'Completed';
          const isInProgress = ritual.status === 'In Progress';

          return (
            <div
              key={ritual.id}
              className={`bg-white rounded-xl border p-4 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isInProgress
                  ? 'border-[#55132D] ring-1 ring-[#55132D]/20 bg-amber-50/20'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Left Section: Time & Order */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded">
                    {ritual.time}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-1 font-mono">
                    #{idx + 1}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-stone-900">{ritual.name}</h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isInProgress
                          ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}
                    >
                      {ritual.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mb-2 leading-relaxed">{ritual.remarks}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" /> Duration: {ritual.duration}
                    </span>
                    <span>•</span>
                    <span>Location: {ritual.location}</span>
                    <span>•</span>
                    <span className="text-[#55132D] font-bold">Officiating: {ritual.priestInCharge}</span>
                  </div>
                </div>
              </div>

              {/* Right Section: Interactive Status Controls */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <select
                  value={ritual.status}
                  onChange={(e) => updateRitualScheduleStatus(ritual.id, e.target.value)}
                  className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#55132D] font-medium"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                </select>

                <button
                  onClick={() => {
                    const note = prompt('Update operational remarks for ' + ritual.name, ritual.remarks);
                    if (note !== null) {
                      updateRitualScheduleStatus(ritual.id, ritual.status, note);
                    }
                  }}
                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Edit Note
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
