import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Radio,
  ShieldAlert,
} from 'lucide-react';
import { useTempleOperations } from '../context/TempleOperationsContext';
import OperationsPageHeader from '../components/temple-operations/shared/OperationsPageHeader';
import MatabariStaffDeploymentMap from '../components/temple-operations/staff/MatabariStaffDeploymentMap';
import AddStaffModal from '../components/temple-operations/staff/AddStaffModal';
import BroadcastModal from '../components/temple-operations/staff/BroadcastModal';

export default function StaffManagement() {
  const {
    staff,
    shifts,
    zones,
    addStaff,
    updateStaff,
  } = useTempleOperations();

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isMusterOpen, setIsMusterOpen] = useState(false);

  // Metrics for muster
  const metrics = useMemo(() => {
    const total = staff.length;
    const active = staff.filter((s) => s.status === 'Active').length;
    return { total, active };
  }, [staff]);

  return (
    <div className="space-y-4 pb-10">
      <OperationsPageHeader
        title="Volunteer & Staff Deployment Operations"
        primaryActionLabel="Enroll Volunteer"
        onPrimaryAction={() => setIsAddStaffOpen(true)}
        primaryActionIcon={UserPlus}
        secondaryAction={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsBroadcastOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl border border-stone-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <Radio className="w-4 h-4 text-[#55132D]" />
              <span>Broadcast</span>
            </button>
            <button
              onClick={() => setIsMusterOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Emergency Muster</span>
            </button>
          </div>
        }
      />

      {/* 3D Strategic Deployment Digital Twin Map */}
      <MatabariStaffDeploymentMap
        staff={staff}
        zones={zones}
        shifts={shifts}
        selectedStaffId={selectedStaff?.id}
        onSelectStaff={(member) => setSelectedStaff(member)}
        onUpdateStaff={updateStaff}
        onAddStaff={addStaff}
      />

      {/* Modals */}
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onAdd={addStaff}
        zones={zones}
        shifts={shifts}
      />

      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        staffList={staff}
      />

      {/* Emergency Muster Modal */}
      {isMusterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold font-serif text-base">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Emergency Response Muster</span>
              </div>
              <button onClick={() => setIsMusterOpen(false)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>
            <p className="text-stone-600">
              Personnel headcount accounting and emergency sector assembly verification for Mata Tripura Sundari Temple campus.
            </p>
            <div className="p-3 bg-stone-50 rounded-xl space-y-2 border border-stone-200">
              <div className="flex justify-between">
                <span>Total On-Duty Active Staff:</span>
                <strong className="text-emerald-700">{metrics.active} / {metrics.total} accounted for</strong>
              </div>
              <div className="flex justify-between">
                <span>Standby Disaster Marshals:</span>
                <strong className="text-stone-800">4 Marshals (Kalyansagar Ghat & East Torana)</strong>
              </div>
              <div className="flex justify-between">
                <span>Duty Magistrate Liaison:</span>
                <strong className="text-stone-800">Udaipur Sub-Divisional Administration</strong>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsMusterOpen(false)}
                className="px-4 py-2 font-bold text-white bg-[#55132D] rounded-lg"
              >
                Close Muster Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
