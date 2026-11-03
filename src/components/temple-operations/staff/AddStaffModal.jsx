import React, { useState } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
import { useTempleOperations } from '../../../context/TempleOperationsContext';

export default function AddStaffModal({ isOpen, onClose }) {
  const { zones, addStaff } = useTempleOperations();

  const [formData, setFormData] = useState({
    name: '',
    role: 'Volunteer',
    contact: '9862104430',
    team: 'Sevadal Volunteer Council',
    assignedZoneId: zones[0]?.id || '',
    shift: 'Morning (06:00 - 14:00)',
    notes: 'Enrolled for festival and daily seva.',
  });

  if (!isOpen) return null;

  const selectedZone = zones.find((z) => z.id === formData.assignedZoneId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addStaff({
      ...formData,
      assignedZoneName: selectedZone ? selectedZone.name : 'Unassigned',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#E2BC6B]" />
            <h2 className="text-sm font-bold font-serif text-white">Enroll Staff / Volunteer</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Subir Chakraborty"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Contact Mobile</label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Volunteer">Volunteer</option>
                <option value="Security Supervisor">Security Supervisor</option>
                <option value="Crowd Coordinator">Crowd Coordinator</option>
                <option value="Safety Marshal">Safety Marshal</option>
                <option value="Help Desk Staff">Help Desk Staff</option>
                <option value="Facility Support">Facility Support</option>
                <option value="Parking Coordinator">Parking Coordinator</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Team / Department</label>
              <select
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Sevadal Volunteer Council">Sevadal Volunteer Council</option>
                <option value="Temple Security Wing">Temple Security Wing</option>
                <option value="Disaster & Safety Team">Disaster & Safety Team</option>
                <option value="Traffic Volunteer Unit">Traffic Volunteer Unit</option>
                <option value="Devotee Facilitation Center">Devotee Facilitation Center</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Assigned Operational Zone</label>
              <select
                value={formData.assignedZoneId}
                onChange={(e) => setFormData({ ...formData, assignedZoneId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Duty Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                <option value="Afternoon (14:00 - 22:00)">Afternoon (14:00 - 22:00)</option>
                <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Operational Instructions / Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>
        </form>

        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Staff Record</span>
          </button>
        </div>
      </div>
    </div>
  );
}

