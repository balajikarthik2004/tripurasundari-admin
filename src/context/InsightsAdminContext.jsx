import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_RECONCILIATION_RUNS, INITIAL_RECONCILIATION_ITEMS } from '../data/administration/reconciliationData';
import { INITIAL_GRIEVANCES, INITIAL_FEEDBACK, INITIAL_GRIEVANCE_CATEGORIES } from '../data/administration/grievancesData';
import {
  INITIAL_ROLES,
  INITIAL_ADMIN_USERS,
  INITIAL_MODULES_LIST,
  INITIAL_PERMISSIONS_MATRIX,
  INITIAL_ACCESS_LOGS,
} from '../data/administration/usersRolesData';
import { INITIAL_TEMPLE_SETTINGS } from '../data/administration/templeSettingsData';

const InsightsAdminContext = createContext(null);

export function InsightsAdminProvider({ children }) {
  // 1. Reconciliation State
  const [reconciliationRuns, setReconciliationRuns] = useState(INITIAL_RECONCILIATION_RUNS);
  const [reconciliationItems, setReconciliationItems] = useState(INITIAL_RECONCILIATION_ITEMS);

  // 2. Grievances & Feedback State
  const [grievances, setGrievances] = useState(INITIAL_GRIEVANCES);
  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK);
  const [grievanceCategories, setGrievanceCategories] = useState(INITIAL_GRIEVANCE_CATEGORIES);

  // 3. Users, Roles & Permissions State
  const [adminUsers, setAdminUsers] = useState(INITIAL_ADMIN_USERS);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [permissionsMatrix, setPermissionsMatrix] = useState(INITIAL_PERMISSIONS_MATRIX);
  const [accessLogs, setAccessLogs] = useState(INITIAL_ACCESS_LOGS);

  // 4. Temple Settings State
  const [templeSettings, setTempleSettings] = useState(INITIAL_TEMPLE_SETTINGS);

  // Global Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- RECONCILIATION ACTIONS ---
  const updateReconciliationMatch = (itemId, matchStatus, remarks = '') => {
    setReconciliationItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              matchStatus,
              remarks: remarks || item.remarks,
              reviewedBy: 'Super Administrator',
            }
          : item
      )
    );
    showToast(`Transaction ${itemId} marked as ${matchStatus}.`);
  };

  const createReconciliationRun = (periodName) => {
    const id = `REC-2026-${String(reconciliationRuns.length + 10)}`;
    const newRun = {
      id,
      period: periodName || 'Quarterly Financial Reconciliation Run',
      totalRecords: reconciliationItems.length,
      matchedRecords: reconciliationItems.filter((i) => i.matchStatus === 'Matched').length,
      exceptions: reconciliationItems.filter((i) => i.matchStatus !== 'Matched').length,
      preparedBy: 'Super Administrator',
      status: 'Completed',
      reconciliationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalLedgerAmount: reconciliationItems.reduce((acc, i) => acc + (i.internalAmount || 0), 0),
      totalBankAmount: reconciliationItems.reduce((acc, i) => acc + (i.bankAmount || 0), 0),
      variance: -500,
    };
    setReconciliationRuns((prev) => [newRun, ...prev]);
    showToast(`Reconciliation Run ${id} created.`);
    return newRun;
  };

  // --- GRIEVANCES ACTIONS ---
  const addGrievance = (grievanceData) => {
    const id = `GRV-2026-${String(grievances.length + 1).padStart(3, '0')}`;
    const newCase = {
      ...grievanceData,
      id,
      submittedDate: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: grievanceData.status || 'New',
      priority: grievanceData.priority || 'Normal',
      internalNotes: [],
      responses: [],
    };
    setGrievances((prev) => [newCase, ...prev]);
    showToast(`Case ${id} submitted.`);
    return newCase;
  };

  const updateGrievanceStatus = (caseId, status, noteText = '') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id !== caseId) return g;
        const updatedNotes = noteText
          ? [...g.internalNotes, { date: nowTime, author: 'Super Admin', text: noteText }]
          : g.internalNotes;
        return {
          ...g,
          status,
          internalNotes: updatedNotes,
        };
      })
    );
    showToast(`Case ${caseId} status updated to ${status}.`);
  };

  const assignGrievance = (caseId, assignedTo, priority = null, assignmentNote = '') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id !== caseId) return g;
        const notes = assignmentNote
          ? [...g.internalNotes, { date: nowTime, author: 'Super Admin', text: `Assigned to ${assignedTo}: ${assignmentNote}` }]
          : g.internalNotes;
        return {
          ...g,
          assignedTo,
          status: g.status === 'New' ? 'Assigned' : g.status,
          priority: priority || g.priority,
          internalNotes: notes,
        };
      })
    );
    showToast(`Case ${caseId} assigned to ${assignedTo}.`);
  };

  const addGrievanceResponse = (caseId, responseText) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id !== caseId) return g;
        return {
          ...g,
          responses: [...g.responses, { date: nowTime, author: 'Temple Administration', text: responseText }],
          status: g.status === 'New' || g.status === 'Assigned' ? 'In Progress' : g.status,
        };
      })
    );
    showToast(`Response dispatched for ${caseId}.`);
  };

  const convertFeedbackToGrievance = (feedbackId) => {
    const feedback = feedbackList.find((f) => f.id === feedbackId);
    if (!feedback) return;
    const newCase = addGrievance({
      subject: `Follow-up on Feedback: ${feedback.category}`,
      devoteeName: feedback.devoteeName,
      devoteePhone: '+91 98623 00000',
      category: feedback.category,
      priority: 'Normal',
      description: feedback.message,
      relatedBookingId: null,
      assignedTo: 'Pending Assignment',
    });
    setFeedbackList((prev) =>
      prev.map((f) => (f.id === feedbackId ? { ...f, reviewStatus: 'Converted to Grievance' } : f))
    );
    showToast(`Feedback converted to Formal Case ${newCase.id}.`);
  };

  // --- USERS, ROLES & PERMISSIONS ACTIONS ---
  const addAdminUser = (userData) => {
    const id = `USR-${String(adminUsers.length + 1).padStart(3, '0')}`;
    const newUser = {
      ...userData,
      id,
      status: 'Active',
      lastActivity: 'Just Now',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setAdminUsers((prev) => [...prev, newUser]);

    // Record activity
    logAccessActivity(`Created new administrative user: ${newUser.name} (${newUser.role})`, 'Users & Roles');
    showToast(`User ${newUser.name} created.`);
    return newUser;
  };

  const updateAdminUser = (id, fields) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...fields } : u)));
    logAccessActivity(`Updated profile details for user ${id}`, 'Users & Roles');
    showToast(`User ${id} updated.`);
  };

  const toggleUserStatus = (id) => {
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        logAccessActivity(`Changed status of user ${u.name} to ${nextStatus}`, 'Users & Roles');
        showToast(`User ${u.name} status is now ${nextStatus}.`);
        return { ...u, status: nextStatus };
      })
    );
  };

  const updateRolePermission = (roleId, moduleId, permissionKey, value) => {
    setPermissionsMatrix((prev) => {
      const rolePerms = prev[roleId] || {};
      const modPerms = rolePerms[moduleId] || { view: false, create: false, edit: false, approve: false, export: false, manage: false };
      return {
        ...prev,
        [roleId]: {
          ...rolePerms,
          [moduleId]: {
            ...modPerms,
            [permissionKey]: value,
          },
        },
      };
    });
  };

  const logAccessActivity = (action, module = 'General Administration', result = 'Success') => {
    const id = `ACT-${Math.floor(9900 + Math.random() * 99)}`;
    const newLog = {
      id,
      user: 'Super Administrator',
      action,
      module,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      result,
      ipAddress: '192.168.1.10',
    };
    setAccessLogs((prev) => [newLog, ...prev]);
  };

  // --- TEMPLE SETTINGS ACTIONS ---
  const updateSettingsSection = (sectionKey, fields) => {
    setTempleSettings((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        ...fields,
      },
    }));
    logAccessActivity(`Modified ${sectionKey} configurations`, 'Temple Master Settings');
    showToast(`Temple ${sectionKey} configuration saved.`);
  };

  const resetAllDemoData = () => {
    setTempleSettings(INITIAL_TEMPLE_SETTINGS);
    setReconciliationRuns(INITIAL_RECONCILIATION_RUNS);
    setReconciliationItems(INITIAL_RECONCILIATION_ITEMS);
    setGrievances(INITIAL_GRIEVANCES);
    setFeedbackList(INITIAL_FEEDBACK);
    setAdminUsers(INITIAL_ADMIN_USERS);
    logAccessActivity('Reset all demo state to factory demonstration configuration', 'Temple Settings');
    showToast('Demo environment restored to initial static configuration.', 'info');
  };

  return (
    <InsightsAdminContext.Provider
      value={{
        // Reconciliation
        reconciliationRuns,
        reconciliationItems,
        updateReconciliationMatch,
        createReconciliationRun,

        // Grievances & Feedback
        grievances,
        addGrievance,
        updateGrievanceStatus,
        assignGrievance,
        addGrievanceResponse,
        feedbackList,
        convertFeedbackToGrievance,
        grievanceCategories,

        // Users & Roles
        adminUsers,
        addAdminUser,
        updateAdminUser,
        toggleUserStatus,
        roles,
        permissionsMatrix,
        updateRolePermission,
        modulesList: INITIAL_MODULES_LIST,
        accessLogs,
        logAccessActivity,

        // Temple Settings
        templeSettings,
        updateSettingsSection,
        resetAllDemoData,

        showToast,
      }}
    >
      {children}

      {/* Global Toast */}
      {toast && (
        <div className="fixed top-20 right-5 sm:right-6 z-[9999] bg-[#28212A] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-[#B68A36]/40 flex items-center gap-2.5 text-xs animate-in slide-in-from-top-3 fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-[#E2BC6B] animate-ping" />
          <span>{toast.message}</span>
        </div>
      )}
    </InsightsAdminContext.Provider>
  );
}

export function useInsightsAdmin() {
  const context = useContext(InsightsAdminContext);
  if (!context) {
    throw new Error('useInsightsAdmin must be used within an InsightsAdminProvider');
  }
  return context;
}

