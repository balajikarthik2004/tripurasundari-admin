import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  SHIFT_TEMPLATES,
  DUTY_ROLES,
  INITIAL_DUTY_ASSIGNMENTS,
  INITIAL_FESTIVALS,
  INITIAL_CALENDAR_TASKS,
} from '../data/operations/calendarData';
import { INITIAL_STAFF } from '../data/operations/staffData';
import { INITIAL_RITUAL_SCHEDULE } from '../data/operations/ritualsData';

const TempleCalendarContext = createContext(null);

export function TempleCalendarProvider({ children }) {
  // Calendar View & Navigation State
  // Default to November 2026 where the rich demonstration festival and shift data exists
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 10, 1));
  const [view, setView] = useState('month'); // 'month' | 'week' | 'day' | 'agenda'
  const [selectedDate, setSelectedDate] = useState('2026-11-01');

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'SHIFTS' | 'RITUALS' | 'FESTIVALS' | 'TASKS'
  const [shiftFilter, setShiftFilter] = useState('ALL'); // 'ALL' | shiftId
  const [staffFilter, setStaffFilter] = useState('ALL'); // 'ALL' | staffId
  const [searchQuery, setSearchQuery] = useState('');

  // Primary Data Collections
  const [dutyAssignments, setDutyAssignments] = useState(INITIAL_DUTY_ASSIGNMENTS);
  const [festivals, setFestivals] = useState(INITIAL_FESTIVALS);
  const [tasks, setTasks] = useState(INITIAL_CALENDAR_TASKS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [rituals, setRituals] = useState(INITIAL_RITUAL_SCHEDULE);

  // Modals & Drawers
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [addScheduleTab, setAddScheduleTab] = useState('shift'); // 'shift' | 'festival' | 'task' | 'ritual'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Notification Toast
  const [calendarToast, setCalendarToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setCalendarToast({ message, type });
    setTimeout(() => setCalendarToast(null), 3500);
  }, []);

  // --- NAVIGATION METHODS ---
  const goToToday = useCallback(() => {
    // Navigate to November 1, 2026 (the active demo epoch)
    const baseDate = new Date(2026, 10, 1);
    setCurrentDate(baseDate);
    setSelectedDate('2026-11-01');
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (view === 'month') {
        next.setMonth(next.getMonth() - 1);
      } else if (view === 'week') {
        next.setDate(next.getDate() - 7);
      } else if (view === 'day') {
        next.setDate(next.getDate() - 1);
      } else {
        next.setMonth(next.getMonth() - 1);
      }
      return next;
    });
  }, [view]);

  const goToNext = useCallback(() => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (view === 'month') {
        next.setMonth(next.getMonth() + 1);
      } else if (view === 'week') {
        next.setDate(next.getDate() + 7);
      } else if (view === 'day') {
        next.setDate(next.getDate() + 1);
      } else {
        next.setMonth(next.getMonth() + 1);
      }
      return next;
    });
  }, [view]);

  // --- CONFLICT DETECTION LOGIC ---
  const checkConflictsForDate = useCallback(
    (dateStr) => {
      const dayAssignments = dutyAssignments.filter((a) => a.date === dateStr);
      const conflicts = [];
      const staffMap = {};

      // 1. Check for overlapping/multiple shifts for the same person on the same date
      dayAssignments.forEach((item) => {
        if (!staffMap[item.staffId]) {
          staffMap[item.staffId] = [item];
        } else {
          staffMap[item.staffId].push(item);
        }
      });

      Object.entries(staffMap).forEach(([staffId, items]) => {
        if (items.length > 1) {
          const staffObj = staffList.find((s) => s.id === staffId);
          const staffName = staffObj ? staffObj.name : items[0].staffName;
          const shiftNames = items
            .map((it) => {
              const tmpl = SHIFT_TEMPLATES.find((t) => t.id === it.shiftId);
              return tmpl ? tmpl.shortName : it.shiftId;
            })
            .join(' & ');

          conflicts.push({
            type: 'DOUBLE_ASSIGNMENT',
            severity: 'High',
            staffId,
            staffName,
            message: `${staffName} is assigned to multiple shifts on ${dateStr} (${shiftNames}).`,
          });
        }
      });

      // 2. Check for shift strength shortages (e.g., Morning needs 6, has fewer than 4)
      SHIFT_TEMPLATES.forEach((tmpl) => {
        const count = dayAssignments.filter((a) => a.shiftId === tmpl.id).length;
        if (count > 0 && count < tmpl.requiredStrength - 2) {
          conflicts.push({
            type: 'UNDERSTAFFED',
            severity: 'Medium',
            shiftId: tmpl.id,
            shiftName: tmpl.name,
            message: `${tmpl.shortName} shift on ${dateStr} is understaffed (${count} / ${tmpl.requiredStrength} assigned).`,
          });
        }
      });

      return conflicts;
    },
    [dutyAssignments, staffList]
  );

  // --- CRUD ACTIONS ---
  const addDutyAssignment = useCallback(
    (newAssignment) => {
      // Check for immediate conflict before saving
      const existing = dutyAssignments.filter(
        (a) => a.date === newAssignment.date && a.staffId === newAssignment.staffId
      );

      let conflictReason = null;
      let status = 'Confirmed';

      if (existing.length > 0) {
        status = 'Conflict';
        conflictReason = `Duplicate shift assignment: already assigned to ${existing[0].role}.`;
      }

      const record = {
        ...newAssignment,
        id: `DTY-${Date.now()}`,
        status,
        conflictReason,
      };

      setDutyAssignments((prev) => [...prev, record]);
      showToast(
        status === 'Conflict'
          ? `Assigned with warning: ${conflictReason}`
          : `Duty allocated to ${record.staffName}.`,
        status === 'Conflict' ? 'warning' : 'success'
      );
      return record;
    },
    [dutyAssignments, showToast]
  );

  const updateDutyAssignment = useCallback(
    (id, fields) => {
      setDutyAssignments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...fields } : item))
      );
      showToast('Shift duty assignment updated.');
    },
    [showToast]
  );

  const deleteDutyAssignment = useCallback(
    (id) => {
      setDutyAssignments((prev) => prev.filter((item) => item.id !== id));
      showToast('Shift assignment removed.');
    },
    [showToast]
  );

  const addFestival = useCallback(
    (newFestival) => {
      const record = {
        ...newFestival,
        id: `FST-${Date.now()}`,
        prepDeadlines: newFestival.prepDeadlines || [],
        status: 'Upcoming',
      };
      setFestivals((prev) => [...prev, record]);
      showToast(`Festival "${record.title}" added to temple calendar.`);
      return record;
    },
    [showToast]
  );

  const updateFestival = useCallback(
    (id, fields) => {
      setFestivals((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...fields } : item))
      );
      showToast('Festival parameters updated.');
    },
    [showToast]
  );

  const deleteFestival = useCallback(
    (id) => {
      setFestivals((prev) => prev.filter((item) => item.id !== id));
      showToast('Festival occasion removed from calendar.');
    },
    [showToast]
  );

  const addTask = useCallback(
    (newTask) => {
      const record = {
        ...newTask,
        id: `TSK-${Date.now()}`,
        status: newTask.status || 'Pending',
      };
      setTasks((prev) => [...prev, record]);
      showToast(`Operational task "${record.title}" scheduled.`);
      return record;
    },
    [showToast]
  );

  const toggleTaskComplete = useCallback(
    (id) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        })
      );
      showToast('Task status updated.');
    },
    [showToast]
  );

  const deleteTask = useCallback(
    (id) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Administrative task removed.');
    },
    [showToast]
  );

  // --- SMART PLANNING INSIGHTS ---
  const insights = useMemo(() => {
    const todayStr = '2026-11-01'; // Operating demo epoch
    const todayShifts = dutyAssignments.filter((a) => a.date === todayStr);
    const todayStaffCount = new Set(todayShifts.map((a) => a.staffId)).size;
    const todayConflicts = checkConflictsForDate(todayStr);

    // Next upcoming festival
    const upcomingFests = festivals.filter((f) => f.startDate >= todayStr);
    upcomingFests.sort((a, b) => a.startDate.localeCompare(b.startDate));
    const nextFestival = upcomingFests[0] || null;

    // Pending tasks due this week
    const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
    const highPriorityTasks = pendingTasks.filter((t) => t.priority === 'High');

    return {
      todayStaffCount,
      todayShiftsCount: todayShifts.length,
      todayConflictsCount: todayConflicts.length,
      todayConflicts,
      nextFestival,
      pendingTasksCount: pendingTasks.length,
      highPriorityTasksCount: highPriorityTasks.length,
    };
  }, [dutyAssignments, festivals, tasks, checkConflictsForDate]);

  // Selected date's full aggregated agenda
  const selectedDateAgenda = useMemo(() => {
    const shifts = dutyAssignments.filter((a) => a.date === selectedDate);
    const dayFestivals = festivals.filter(
      (f) => selectedDate >= f.startDate && selectedDate <= f.endDate
    );
    const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);
    const conflicts = checkConflictsForDate(selectedDate);

    return {
      date: selectedDate,
      shifts,
      festivals: dayFestivals,
      tasks: dayTasks,
      rituals,
      conflicts,
    };
  }, [selectedDate, dutyAssignments, festivals, tasks, rituals, checkConflictsForDate]);

  const value = {
    currentDate,
    setCurrentDate,
    view,
    setView,
    selectedDate,
    setSelectedDate,
    categoryFilter,
    setCategoryFilter,
    shiftFilter,
    setShiftFilter,
    staffFilter,
    setStaffFilter,
    searchQuery,
    setSearchQuery,
    dutyAssignments,
    festivals,
    tasks,
    staffList,
    rituals,
    shiftTemplates: SHIFT_TEMPLATES,
    dutyRoles: DUTY_ROLES,
    goToToday,
    goToPrev,
    goToNext,
    checkConflictsForDate,
    addDutyAssignment,
    updateDutyAssignment,
    deleteDutyAssignment,
    addFestival,
    updateFestival,
    deleteFestival,
    addTask,
    toggleTaskComplete,
    deleteTask,
    insights,
    selectedDateAgenda,
    isAddScheduleModalOpen,
    setIsAddScheduleModalOpen,
    addScheduleTab,
    setAddScheduleTab,
    selectedEvent,
    setSelectedEvent,
    isDetailDrawerOpen,
    setIsDetailDrawerOpen,
    calendarToast,
    showToast,
  };

  return (
    <TempleCalendarContext.Provider value={value}>
      {children}
    </TempleCalendarContext.Provider>
  );
}

export function useTempleCalendar() {
  const context = useContext(TempleCalendarContext);
  if (!context) {
    throw new Error('useTempleCalendar must be used within a TempleCalendarProvider');
  }
  return context;
}

