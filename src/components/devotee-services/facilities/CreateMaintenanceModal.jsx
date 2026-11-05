import OverlayPortal from '../../common/OverlayPortal';
import React, { useState, useEffect } from 'react';
import { X, Wrench, Save, Flag } from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function CreateMaintenanceModal({ isOpen, onClose, defaultFacilityId }) {
  const { facilities, createMaintenanceRequest } = useDevoteeServices();

  const [formData, setFormData] = useState({
    facilityId: defaultFacilityId || facilities[0]?.id || '',
    issueCategory: 'Civil / Safety Railing',
    description: '',
    priority: 'High',
    assignedTeam: 'Temple Civil Works Taskforce',
    assignedPerson: 'Engineer T. Bhowmik',
    remarks: 'Immediate onsite inspection scheduled.',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        facilityId: defaultFacilityId || facilities[0]?.id || '',
        description: '',
      }));
    }
  }, [isOpen, defaultFacilityId, facilities]);

  if (!isOpen) return null;

  const selectedFacility = facilities.find((f) => f.id === formData.facilityId) || facilities[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    createMaintenanceRequest({
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      issueCategory: formData.issueCategory,
      description: formData.description.trim(),
      priority: formData.priority,
      assignedTeam: formData.assignedTeam,
      assignedPerson: formData.assignedPerson,
      status: 'In Progress',
      remarks: formData.remarks,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-[#E2BC6B]" />
            <h2 className="text-sm font-bold font-serif text-white">Flag Facility Maintenance Issue</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Select Affected Facility <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.facilityId}
              onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
            >
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.location})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Issue Category</label>
              <select
                value={formData.issueCategory}
                onChange={(e) => setFormData({ ...formData, issueCategory: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Civil / Safety Railing">Civil / Safety Railing</option>
                <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
                <option value="Electrical / Lighting">Electrical / Lighting</option>
                <option value="Water Filtration & RO">Water Filtration & RO</option>
                <option value="Cleanliness & Waste">Cleanliness & Waste</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Urgent">Urgent (Safety Critical)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Issue Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe physical fault, required materials, or safety hazards..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Assigned Maintenance Team</label>
              <input
                type="text"
                value={formData.assignedTeam}
                onChange={(e) => setFormData({ ...formData, assignedTeam: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Assigned Person</label>
              <input
                type="text"
                value={formData.assignedPerson}
                onChange={(e) => setFormData({ ...formData, assignedPerson: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
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
            <span>Create Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
}

