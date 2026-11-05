import OverlayPortal from '../common/OverlayPortal';
import React, { useState, useEffect } from 'react';
import { X, Clock, Save } from 'lucide-react';
import { useDarshanBookings } from '../../context/DarshanBookingContext';

export default function SlotModal({ isOpen, onClose, editingSlot = null }) {
  const { addSlot, updateSlot } = useDarshanBookings();

  const [formData, setFormData] = useState({
    label: '',
    startTime: '06:00 AM',
    endTime: '07:30 AM',
    period: 'Morning',
    maxCapacity: 150,
    gate: 'Gate 1 (Main Entrance)',
    description: 'General Darshan queue batch',
    status: 'active',
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingSlot) {
      setFormData({
        label: editingSlot.label || '',
        startTime: editingSlot.startTime || '06:00 AM',
        endTime: editingSlot.endTime || '07:30 AM',
        period: editingSlot.period || 'Morning',
        maxCapacity: editingSlot.maxCapacity || 150,
        gate: editingSlot.gate || 'Gate 1 (Main Entrance)',
        description: editingSlot.description || '',
        status: editingSlot.status || 'active',
      });
    } else {
      setFormData({
        label: '',
        startTime: '06:00 AM',
        endTime: '07:30 AM',
        period: 'Morning',
        maxCapacity: 150,
        gate: 'Gate 1 (Main Entrance)',
        description: 'General Darshan batch',
        status: 'active',
      });
    }
    setErrorMsg('');
  }, [editingSlot, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const computedLabel = formData.label.trim() || `${formData.startTime} - ${formData.endTime}`;

    const payload = {
      label: computedLabel,
      startTime: formData.startTime.trim(),
      endTime: formData.endTime.trim(),
      period: formData.period,
      maxCapacity: Number(formData.maxCapacity) || 50,
      gate: formData.gate.trim(),
      description: formData.description.trim(),
      status: formData.status,
    };

    if (editingSlot) {
      updateSlot(editingSlot.id, payload);
    } else {
      addSlot(payload);
    }
    onClose();
  };

  return (
    <OverlayPortal isOpen={true} onClose={onClose}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-white">
                {editingSlot ? 'Edit Time Slot' : 'Add New Darshan Slot'}
              </h2>
              <p className="text-[11px] text-[#E2BC6B]/90">Define batch timings and capacity ceiling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Start Time <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="06:00 AM"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                End Time <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="07:30 AM"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Period</label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D] bg-white"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Max Devotees Capacity <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min="10"
                required
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Assigned Gate</label>
            <input
              type="text"
              placeholder="e.g. Gate 1 (Main Entrance) / Gate 2 (VIP)"
              value={formData.gate}
              onChange={(e) => setFormData({ ...formData, gate: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D] bg-white"
            >
              <option value="active">Active (Available for booking)</option>
              <option value="disabled">Disabled (Suspended / Blocked)</option>
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{editingSlot ? 'Update Slot' : 'Create Slot'}</span>
          </button>
        </div>
      </div>
    </div>
    </OverlayPortal>
  );
}

