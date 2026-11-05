import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_ZONES } from '../data/operations/zonesData';
import { INITIAL_QUEUES, INITIAL_ENTRY_POINTS } from '../data/operations/queuesData';
import { INITIAL_STAFF, INITIAL_SHIFTS } from '../data/operations/staffData';
import { INITIAL_CAMERAS, INITIAL_INCIDENTS } from '../data/operations/camerasData';
import { INITIAL_VENDORS, INITIAL_STALLS } from '../data/operations/vendorsData';
import { INITIAL_PARKING_AREAS, INITIAL_VEHICLE_RECORDS } from '../data/operations/parkingData';
import { INITIAL_MELA_EVENTS, INITIAL_MELA_TASKS, INITIAL_READINESS_CHECKLIST } from '../data/operations/melaData';
import {
  INITIAL_RITUAL_SCHEDULE,
  INITIAL_RITUAL_CATALOGUE,
  INITIAL_SPECIAL_DAY_SCHEDULES,
} from '../data/operations/ritualsData';

const TempleOperationsContext = createContext(null);

export function TempleOperationsProvider({ children }) {
  // 1. Zones & Queues
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [queues, setQueues] = useState(INITIAL_QUEUES);
  const [entryPoints, setEntryPoints] = useState(INITIAL_ENTRY_POINTS);

  // 2. Staff, Volunteers & Shifts
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [shifts, setShifts] = useState(INITIAL_SHIFTS);

  // 3. CCTV & Incidents
  const [cameras, setCameras] = useState(INITIAL_CAMERAS);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);

  // 4. Vendors & Stalls
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [stalls, setStalls] = useState(INITIAL_STALLS);

  // 5. Parking Management
  const [parkingAreas, setParkingAreas] = useState(INITIAL_PARKING_AREAS);
  const [vehicleRecords, setVehicleRecords] = useState(INITIAL_VEHICLE_RECORDS);

  // 6. Mela & Festival Planning
  const [melaEvents, setMelaEvents] = useState(INITIAL_MELA_EVENTS);
  const [melaTasks, setMelaTasks] = useState(INITIAL_MELA_TASKS);
  const [readinessChecklist, setReadinessChecklist] = useState(INITIAL_READINESS_CHECKLIST);

  // 7. Daily Ritual Schedule
  const [ritualSchedule, setRitualSchedule] = useState(INITIAL_RITUAL_SCHEDULE);
  const [ritualCatalogue, setRitualCatalogue] = useState(INITIAL_RITUAL_CATALOGUE);
  const [specialDaySchedules, setSpecialDaySchedules] = useState(INITIAL_SPECIAL_DAY_SCHEDULES);

  // Global Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- ZONE & QUEUE ACTIONS ---
  const updateZoneDensity = (zoneId, densityStatus, occupancy = null) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== zoneId) return z;
        return {
          ...z,
          densityStatus,
          currentOccupancy: occupancy !== null ? occupancy : z.currentOccupancy,
        };
      })
    );
    showToast(`Zone ${zoneId} crowd status updated to ${densityStatus}.`);
  };

  const addZone = (zoneData) => {
    const id = `ZONE-${String.fromCharCode(65 + zones.length)}`;
    const full = {
      ...zoneData,
      id,
      currentOccupancy: 0,
      densityStatus: 'Normal',
      entryPointIds: [],
      cameraIds: [],
      assignedStaffCount: 0,
      mapCoords: { x: 30 + zones.length * 5, y: 30 + zones.length * 5, width: 18, height: 18, shape: 'rect' },
    };
    setZones((prev) => [...prev, full]);
    showToast(`Zone "${full.name}" registered.`);
    return full;
  };

  const updateZone = (id, fields) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, ...fields } : z)));
    showToast(`Zone ${id} parameters updated.`);
  };

  const updateQueueStatus = (queueId, status) => {
    setQueues((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, status } : q))
    );
    showToast(`Queue ${queueId} status changed to ${status}.`);
  };

  const addQueue = (queueData) => {
    const id = `Q-${String(queues.length + 1).padStart(2, '0')}`;
    const full = { ...queueData, id, currentOccupancy: 0, status: 'Active' };
    setQueues((prev) => [...prev, full]);
    showToast(`Queue "${full.name}" configured.`);
    return full;
  };

  // --- STAFF ACTIONS ---
  const addStaff = (staffData) => {
    const id = `STF-${100 + staff.length + 1}`;
    const full = {
      ...staffData,
      id,
      status: staffData.status || 'Active',
      mapCoords: staffData.mapCoords || (staffData.assignedZoneId
        ? { x: Math.floor(20 + Math.random() * 60), y: Math.floor(20 + Math.random() * 60) }
        : null),
    };
    setStaff((prev) => [...prev, full]);
    showToast(`Staff member ${full.name} added with ID ${id}.`);
    return full;
  };

  const updateStaff = (id, fields) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...fields } : s)));
    showToast(`Staff record ${id} updated.`);
  };

  const reassignStaffZone = (staffId, zoneId, zoneName) => {
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id !== staffId) return s;
        return {
          ...s,
          assignedZoneId: zoneId,
          assignedZoneName: zoneName,
          mapCoords: { x: Math.floor(20 + Math.random() * 60), y: Math.floor(20 + Math.random() * 60) },
        };
      })
    );
    showToast(`Staff member reassigned to ${zoneName}.`);
  };

  const updateStaffStatus = (id, status) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    showToast(`Staff ${id} status set to ${status}.`);
  };

  // --- INCIDENT ACTIONS ---
  const createIncident = (incidentData) => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const id = `INC-2026-${100 + incidents.length + 1}`;
    const full = {
      ...incidentData,
      id,
      reportedTime: nowTimestamp,
      status: incidentData.status || 'In Progress',
    };
    setIncidents((prev) => [full, ...prev]);
    showToast(`Operational alert ${id} created for ${full.zoneName}.`, 'info');
    return full;
  };

  const updateIncidentStatus = (id, status, remarks = '') => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;
        return {
          ...inc,
          status,
          remarks: remarks ? `${inc.remarks ? inc.remarks + ' • ' : ''}${remarks}` : inc.remarks,
        };
      })
    );
    showToast(`Incident ${id} marked as ${status}.`);
  };

  // --- CCTV CAMERA ACTIONS ---
  const addCamera = (cameraData) => {
    const id = `CAM-${String(cameras.length + 1).padStart(2, '0')}`;
    const full = {
      ...cameraData,
      id,
      status: 'Online',
      lastPing: new Date().toLocaleTimeString(),
      previewImage: '/temple-reference.jpg',
      incidentCount: 0,
    };
    setCameras((prev) => [...prev, full]);
    showToast(`Monitoring Camera ${id} registered.`);
    return full;
  };

  const toggleCameraStatus = (id) => {
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newStatus = c.status === 'Online' ? 'Offline' : 'Online';
        showToast(`Camera ${id} status: ${newStatus}.`);
        return { ...c, status: newStatus };
      })
    );
  };

  const updateIncident = (id, updates) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;
        return { ...inc, ...updates };
      })
    );
    showToast(`Incident ${id} updated.`);
  };

  const updateCameraRemarks = (id, remarks) => {
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return { ...c, remarks };
      })
    );
    showToast(`Camera ${id} remarks saved.`);
  };

  // --- VENDORS & STALLS ACTIONS ---
  const addVendor = (vendorData) => {
    const id = `VND-${String(vendors.length + 1).padStart(2, '0')}`;
    const full = {
      ...vendorData,
      id,
      registrationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active',
    };
    setVendors((prev) => [...prev, full]);
    showToast(`Vendor "${full.name}" registered.`);
    return full;
  };

  const allocateStall = (stallId, vendorId, vendorName) => {
    setStalls((prev) =>
      prev.map((st) => (st.id === stallId ? { ...st, vendorId, vendorName, allocationStatus: 'Allocated' } : st))
    );
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, assignedStallId: stallId, assignedStallName: stallId } : v))
    );
    showToast(`Stall ${stallId} allocated to ${vendorName}.`);
  };

  const updateStallStatus = (stallId, operationalStatus) => {
    setStalls((prev) =>
      prev.map((st) => (st.id === stallId ? { ...st, operationalStatus } : st))
    );
    showToast(`Stall ${stallId} status: ${operationalStatus}.`);
  };

  // --- PARKING ACTIONS ---
  const recordVehicleEntry = (recordData) => {
    const id = `VEH-${1000 + vehicleRecords.length + 1}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const full = {
      ...recordData,
      id,
      entryTime: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${nowTime}`,
      exitTime: null,
      status: 'Parked',
      tokenNumber: `TKN-${Math.floor(8800 + Math.random() * 200)}`,
    };

    setVehicleRecords((prev) => [full, ...prev]);

    // Update occupancy in parking area
    setParkingAreas((prev) =>
      prev.map((p) => (p.id === recordData.parkingAreaId ? { ...p, currentOccupancy: p.currentOccupancy + 1 } : p))
    );

    showToast(`Vehicle ${full.vehicleNumber} checked in (Token: ${full.tokenNumber}).`);
    return full;
  };

  const recordVehicleExit = (recordId) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let targetAreaId = null;

    setVehicleRecords((prev) =>
      prev.map((v) => {
        if (v.id !== recordId) return v;
        targetAreaId = v.parkingAreaId;
        return {
          ...v,
          exitTime: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${nowTime}`,
          status: 'Departed',
        };
      })
    );

    if (targetAreaId) {
      setParkingAreas((prev) =>
        prev.map((p) => (p.id === targetAreaId ? { ...p, currentOccupancy: Math.max(0, p.currentOccupancy - 1) } : p))
      );
    }

    showToast(`Vehicle ${recordId} exit recorded.`);
  };

  // --- MELA & TASKS ACTIONS ---
  const addMelaTask = (taskData) => {
    const id = `TSK-${100 + melaTasks.length + 1}`;
    const full = { ...taskData, id, status: taskData.status || 'In Progress' };
    setMelaTasks((prev) => [...prev, full]);
    showToast(`Task "${full.title}" added to Mela planning.`);
    return full;
  };

  const updateMelaTaskStatus = (id, status) => {
    setMelaTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    showToast(`Task ${id} marked as ${status}.`);
  };

  const toggleChecklistItem = (index) => {
    setReadinessChecklist((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const nextStatus = item.status === 'Completed' ? 'In Progress' : 'Completed';
        showToast(`Checklist item marked as ${nextStatus}.`);
        return { ...item, status: nextStatus };
      })
    );
  };

  // --- RITUAL SCHEDULE ACTIONS ---
  const updateRitualScheduleStatus = (id, status, remarks = '') => {
    setRitualSchedule((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          status,
          remarks: remarks ? `${r.remarks ? r.remarks + ' • ' : ''}${remarks}` : r.remarks,
        };
      })
    );
    showToast(`Ritual ${id} schedule status set to ${status}.`);
  };

  const addRitual = (ritualData) => {
    const id = `RIT-${String(ritualCatalogue.length + 1).padStart(2, '0')}`;
    const full = { ...ritualData, id, status: 'active' };
    setRitualCatalogue((prev) => [...prev, full]);
    showToast(`Ritual "${full.name}" added to catalogue.`);
    return full;
  };

  const toggleRitualActive = (id) => {
    setRitualCatalogue((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = r.status === 'active' ? 'inactive' : 'active';
        showToast(`Ritual ${r.name} is now ${next}.`);
        return { ...r, status: next };
      })
    );
  };

  return (
    <TempleOperationsContext.Provider
      value={{
        // Zones & Queues
        zones,
        addZone,
        updateZone,
        updateZoneDensity,
        queues,
        addQueue,
        updateQueueStatus,
        entryPoints,

        // Staff & Volunteers
        staff,
        addStaff,
        updateStaff,
        reassignStaffZone,
        updateStaffStatus,
        shifts,

        // CCTV & Incidents
        cameras,
        addCamera,
        toggleCameraStatus,
        updateCameraRemarks,
        incidents,
        createIncident,
        updateIncident,
        updateIncidentStatus,

        // Vendors & Stalls
        vendors,
        addVendor,
        stalls,
        allocateStall,
        updateStallStatus,

        // Parking
        parkingAreas,
        vehicleRecords,
        recordVehicleEntry,
        recordVehicleExit,

        // Mela Management
        melaEvents,
        melaTasks,
        addMelaTask,
        updateMelaTaskStatus,
        readinessChecklist,
        toggleChecklistItem,

        // Daily Ritual Schedule
        ritualSchedule,
        updateRitualScheduleStatus,
        ritualCatalogue,
        addRitual,
        toggleRitualActive,
        specialDaySchedules,

        // Global UI
        toast,
        showToast,
      }}
    >
      {children}

      {/* Operations Toast */}
      {toast && (
        <div className="fixed top-20 right-5 sm:right-6 z-[9999] animate-in slide-in-from-top-3 fade-in duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 max-w-sm ${
              toast.type === 'error'
                ? 'bg-rose-900 text-rose-50 border-rose-700'
                : toast.type === 'info'
                ? 'bg-amber-900 text-amber-50 border-amber-700'
                : 'bg-[#55132D] text-white border-[#B68A36]/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#E2BC6B] animate-pulse flex-shrink-0" />
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        </div>
      )}
    </TempleOperationsContext.Provider>
  );
}

export function useTempleOperations() {
  const context = useContext(TempleOperationsContext);
  if (!context) {
    throw new Error('useTempleOperations must be used within a TempleOperationsProvider');
  }
  return context;
}

