import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { useTempleOperations } from '../context/TempleOperationsContext';
import OperationsPageHeader from '../components/temple-operations/shared/OperationsPageHeader';
import MatabariCrowdHeatmap from '../components/temple-operations/crowd/MatabariCrowdHeatmap';
import ZoneDetailDrawer from '../components/temple-operations/shared/ZoneDetailDrawer';

export default function CrowdControl() {
  const {
    zones,
    createIncident,
  } = useTempleOperations();

  const [selectedZone, setSelectedZone] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRaiseAlertFromZone = (z) => {
    createIncident({
      zoneId: z.id,
      zoneName: z.name,
      category: 'Crowd Pressure Alert',
      severity: 'High',
      description: `Manual crowd density alert triggered for ${z.name}. Occupancy at ${z.currentOccupancy}/${z.capacity}.`,
      assignedStaffName: 'Standby Sevadal Wing',
    });
    showToast(`Crowd pressure alert raised for ${z.name}.`);
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <OperationsPageHeader
        title="Crowd & Queue Control Centre"
        primaryActionLabel="Raise Crowd Alert"
        onPrimaryAction={() => {
          if (zones[0]) handleRaiseAlertFromZone(zones[0]);
        }}
        primaryActionIcon={ShieldAlert}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#38091B] text-white px-4 py-2.5 rounded-xl border border-[#B68A36]/40 shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Architectural Crowd Heatmap */}
      <MatabariCrowdHeatmap
        onSelectZone={(z) => setSelectedZone(z)}
        selectedZoneId={selectedZone?.id}
        onTriggerAction={(actionDesc) => {
          createIncident({
            zoneId: 'ZONE-A',
            zoneName: 'Main Sanctum & Parikrama',
            category: 'Crowd Throttling Override',
            severity: 'High',
            description: actionDesc,
            assignedStaffName: 'Rapid Response Marshals',
          });
          showToast(`Action dispatched: ${actionDesc}`);
        }}
      />

      {/* Zone Detail Drawer */}
      <ZoneDetailDrawer
        zone={selectedZone}
        onClose={() => setSelectedZone(null)}
        onLogIncident={handleRaiseAlertFromZone}
      />
    </div>
  );
}
