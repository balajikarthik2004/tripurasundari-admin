import OverlayPortal from '../../common/OverlayPortal';
import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Sparkles,
  Clock,
  Flame,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

export default function CalendarAddScheduleModal() {
  const {
    isAddScheduleModalOpen,
    setIsAddScheduleModalOpen,
    addScheduleTab,
    setAddScheduleTab,
    selectedDate,
    shiftTemplates,
    dutyRoles,
    staffList,
    addDutyAssignment,
    addFestival,
    addTask,
    dutyAssignments,
  } = useTempleCalendar();

  // 1. Shift Duty Form
  const [shiftForm, setShiftForm] = useState({
    date: selectedDate,
    shiftId: 'SHF-MORNING',
    staffId: staffList[0]?.id || '',
    role: dutyRoles[0] || 'Sanctum Line Marshal',
    zoneName: 'Main Sanctum & Parikrama',
    notes: '',
  });

  // 2. Festival Form
  const [festivalForm, setFestivalForm] = useState({
    title: '',
    shortTitle: '',
    category: 'Religious Observance',
    startDate: selectedDate,
    endDate: selectedDate,
    leadAdmin: 'Subal Bhattacharya',
    expectedDevotees: '15,000',
    description: '',
  });

  // 3. Task Form
  const [taskForm, setTaskForm] = useState({
    title: '',
    dueDate: selectedDate,
    priority: 'High',
    responsiblePerson: staffList[0]?.name || 'Subal Bhattacharya',
    department: 'Administration',
    description: '',
  });

  // Update date in forms when selectedDate changes
  useEffect(() => {
    setShiftForm((prev) => ({ ...prev, date: selectedDate }));
    setFestivalForm((prev) => ({ ...prev, startDate: selectedDate, endDate: selectedDate }));
    setTaskForm((prev) => ({ ...prev, dueDate: selectedDate }));
  }, [selectedDate]);

  if (!isAddScheduleModalOpen) return null;

  // Real-time conflict preview for staff shift
  const selectedStaffObj = staffList.find((s) => s.id === shiftForm.staffId);
  const existingShiftForStaff = dutyAssignments.find(
    (a) => a.date === shiftForm.date && a.staffId === shiftForm.staffId
  );

  const handleShiftSubmit = (e) => {
    e.preventDefault();
    const staff = staffList.find((s) => s.id === shiftForm.staffId);
    if (!staff) return;

    addDutyAssignment({
      date: shiftForm.date,
      shiftId: shiftForm.shiftId,
      staffId: staff.id,
      staffName: staff.name,
      role: shiftForm.role,
      zoneName: shiftForm.zoneName,
      contact: staff.contact,
    });

    setIsAddScheduleModalOpen(false);
  };

  const handleFestivalSubmit = (e) => {
    e.preventDefault();
    if (!festivalForm.title) return;

    addFestival({
      title: festivalForm.title,
      shortTitle: festivalForm.shortTitle || festivalForm.title.slice(0, 16),
      category: festivalForm.category,
      startDate: festivalForm.startDate,
      endDate: festivalForm.endDate,
      leadAdmin: festivalForm.leadAdmin,
      expectedDevotees: festivalForm.expectedDevotees,
      description: festivalForm.description,
      isMajor: festivalForm.category === 'Major Festival',
    });

    setIsAddScheduleModalOpen(false);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.title) return;

    addTask({
      title: taskForm.title,
      dueDate: taskForm.dueDate,
      priority: taskForm.priority,
      responsiblePerson: taskForm.responsiblePerson,
      department: taskForm.department,
      description: taskForm.description,
    });

    setIsAddScheduleModalOpen(false);
  };

  return (
    <OverlayPortal isOpen={true} onClose={onClose}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-2xs select-none">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 bg-[#55132D] text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-serif">Add Temple Schedule Item</h3>
            <p className="text-xs text-[#E2BC6B] mt-0.5">
              Target Date: {selectedDate}
            </p>
          </div>
          <button
            onClick={() => setIsAddScheduleModalOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Tab Mode Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-semibold">
          <button
            onClick={() => setAddScheduleTab('shift')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              addScheduleTab === 'shift'
                ? 'border-[#55132D] text-[#55132D] bg-white font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Duty</span>
          </button>

          <button
            onClick={() => setAddScheduleTab('festival')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              addScheduleTab === 'festival'
                ? 'border-[#55132D] text-[#55132D] bg-white font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Festival / Occasion</span>
          </button>

          <button
            onClick={() => setAddScheduleTab('task')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              addScheduleTab === 'task'
                ? 'border-[#55132D] text-[#55132D] bg-white font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Operational Task</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
          {/* TAB 1: STAFF SHIFT ASSIGNMENT */}
          {addScheduleTab === 'shift' && (
            <form onSubmit={handleShiftSubmit} className="space-y-3.5">
              {/* Conflict Preview Warning */}
              {existingShiftForStaff && (
                <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Scheduling Warning:</span>
                    <span>
                      {selectedStaffObj?.name} is already assigned on {shiftForm.date} ({existingShiftForStaff.role}). Saving will create a double-shift overlap.
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={shiftForm.date}
                    onChange={(e) => setShiftForm({ ...shiftForm, date: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Shift Template *
                  </label>
                  <select
                    value={shiftForm.shiftId}
                    onChange={(e) => setShiftForm({ ...shiftForm, shiftId: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  >
                    {shiftTemplates.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Assign Staff Member / Volunteer *
                </label>
                <select
                  value={shiftForm.staffId}
                  onChange={(e) => setShiftForm({ ...shiftForm, staffId: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                >
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} — {st.role} ({st.team})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Operational Duty Role *
                  </label>
                  <select
                    value={shiftForm.role}
                    onChange={(e) => setShiftForm({ ...shiftForm, role: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  >
                    {dutyRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Zone / Deployment Area
                  </label>
                  <input
                    type="text"
                    value={shiftForm.zoneName}
                    onChange={(e) => setShiftForm({ ...shiftForm, zoneName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                    placeholder="e.g. West Main Gopuram"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Special Shift Instructions
                </label>
                <textarea
                  rows="2"
                  value={shiftForm.notes}
                  onChange={(e) => setShiftForm({ ...shiftForm, notes: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 bg-stone-50 text-stone-900"
                  placeholder="e.g. Relieve night patrol at 05:45 AM; coordinate senior ramp wheelchairs."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-100 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  Save Duty Allocation
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: FESTIVAL / OCCASION */}
          {addScheduleTab === 'festival' && (
            <form onSubmit={handleFestivalSubmit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Occasion / Festival Title *
                </label>
                <input
                  type="text"
                  required
                  value={festivalForm.title}
                  onChange={(e) => setFestivalForm({ ...festivalForm, title: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  placeholder="e.g. AnnualPeetha Sthapana Divas"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Event Category
                  </label>
                  <select
                    value={festivalForm.category}
                    onChange={(e) => setFestivalForm({ ...festivalForm, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  >
                    <option value="Major Festival">Major Festival</option>
                    <option value="Religious Observance">Religious Observance</option>
                    <option value="Special Pooja Day">Special Pooja Day</option>
                    <option value="Temple Celebration">Temple Celebration</option>
                    <option value="Administrative Holiday">Administrative Holiday</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Short Display Label
                  </label>
                  <input
                    type="text"
                    value={festivalForm.shortTitle}
                    onChange={(e) => setFestivalForm({ ...festivalForm, shortTitle: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900"
                    placeholder="e.g. Foundation Day"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={festivalForm.startDate}
                    onChange={(e) => setFestivalForm({ ...festivalForm, startDate: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    End Date (for multi-day)
                  </label>
                  <input
                    type="date"
                    required
                    value={festivalForm.endDate}
                    onChange={(e) => setFestivalForm({ ...festivalForm, endDate: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Responsible Admin / Lead
                  </label>
                  <input
                    type="text"
                    value={festivalForm.leadAdmin}
                    onChange={(e) => setFestivalForm({ ...festivalForm, leadAdmin: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Expected Devotee Influx
                  </label>
                  <input
                    type="text"
                    value={festivalForm.expectedDevotees}
                    onChange={(e) => setFestivalForm({ ...festivalForm, expectedDevotees: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900"
                    placeholder="e.g. 50,000"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Occasion Overview & Ritual Instructions
                </label>
                <textarea
                  rows="2"
                  value={festivalForm.description}
                  onChange={(e) => setFestivalForm({ ...festivalForm, description: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 bg-stone-50 text-stone-900"
                  placeholder="Brief description of special rituals and pilgrim arrangements..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-100 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  Record Festival
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ADMINISTRATIVE TASK */}
          {addScheduleTab === 'task' && (
            <form onSubmit={handleTaskSubmit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  placeholder="e.g. Review festival crowd barricades"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Responsible Person / Team
                  </label>
                  <input
                    type="text"
                    value={taskForm.responsiblePerson}
                    onChange={(e) => setTaskForm({ ...taskForm, responsiblePerson: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={taskForm.department}
                    onChange={(e) => setTaskForm({ ...taskForm, department: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description & Deliverables
                </label>
                <textarea
                  rows="2"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 bg-stone-50 text-stone-900"
                  placeholder="Specific instructions or checks to complete..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-100 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
    </OverlayPortal>
  );
}

