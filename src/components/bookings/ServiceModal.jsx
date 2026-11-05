import OverlayPortal from '../common/OverlayPortal';
import React, { useState, useEffect } from 'react';
import { X, Layers, Save, CheckCircle2 } from 'lucide-react';
import { useDarshanBookings } from '../../context/DarshanBookingContext';

export default function ServiceModal({ isOpen, onClose, editingService = null }) {
  const { addService, updateService } = useDarshanBookings();

  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    description: '',
    fee: 0,
    isFree: true,
    maxDevoteesPerBooking: 6,
    dailyQuota: 500,
    bookingRequired: true,
    reportingTimeNotice: 'Report at least 20 minutes prior to darshan slot',
    allowedGates: 'Gate 1 (Main Entrance)',
    status: 'active',
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingService) {
      setFormData({
        name: editingService.name || '',
        category: editingService.category || 'General',
        description: editingService.description || '',
        fee: editingService.fee || 0,
        isFree: editingService.isFree ?? (editingService.fee === 0),
        maxDevoteesPerBooking: editingService.maxDevoteesPerBooking || 6,
        dailyQuota: editingService.dailyQuota || 500,
        bookingRequired: editingService.bookingRequired ?? true,
        reportingTimeNotice: editingService.reportingTimeNotice || 'Report 20 minutes before slot',
        allowedGates: Array.isArray(editingService.allowedGates)
          ? editingService.allowedGates.join(', ')
          : editingService.allowedGates || 'Gate 1 (Main Entrance)',
        status: editingService.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        category: 'General',
        description: '',
        fee: 0,
        isFree: true,
        maxDevoteesPerBooking: 6,
        dailyQuota: 500,
        bookingRequired: true,
        reportingTimeNotice: 'Report at least 20 minutes prior to darshan slot',
        allowedGates: 'Gate 1 (Main Entrance)',
        status: 'active',
      });
    }
    setErrorMsg('');
  }, [editingService, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Service name is required.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      fee: formData.isFree ? 0 : Number(formData.fee) || 0,
      isFree: formData.isFree,
      maxDevoteesPerBooking: Number(formData.maxDevoteesPerBooking) || 1,
      dailyQuota: Number(formData.dailyQuota) || 100,
      bookingRequired: formData.bookingRequired,
      reportingTimeNotice: formData.reportingTimeNotice.trim(),
      allowedGates: formData.allowedGates.split(',').map((g) => g.trim()).filter(Boolean),
      status: formData.status,
    };

    if (editingService) {
      updateService(editingService.id, payload);
    } else {
      addService(payload);
    }
    onClose();
  };

  return (
    <OverlayPortal isOpen={true} onClose={onClose}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-white">
                {editingService ? 'Edit Darshan Service' : 'Add New Darshan Service'}
              </h2>
              <p className="text-[11px] text-[#E2BC6B]/90">Configure quota rules and darshan parameters</p>
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

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Service Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Special Senior Citizen Darshan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D] bg-white"
              >
                <option value="General">General</option>
                <option value="Special">Special</option>
                <option value="VIP">VIP</option>
                <option value="Assisted">Assisted</option>
                <option value="Ritual">Ritual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D] bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of privileges and line segregation..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
            />
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">Service Fee Mode:</span>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData({ ...formData, isFree: checked, fee: checked ? 0 : formData.fee || 100 });
                  }}
                  className="rounded text-[#55132D] focus:ring-[#55132D]"
                />
                <span>Free Darshan (Zero Fee)</span>
              </label>
            </div>

            {!formData.isFree && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ticket Fee Per Devotee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D] bg-white"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Max Devotees / Booking
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.maxDevoteesPerBooking}
                onChange={(e) => setFormData({ ...formData, maxDevoteesPerBooking: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Daily Allotted Quota
              </label>
              <input
                type="number"
                min="10"
                value={formData.dailyQuota}
                onChange={(e) => setFormData({ ...formData, dailyQuota: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Designated Gates (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Gate 1, Gate 2"
              value={formData.allowedGates}
              onChange={(e) => setFormData({ ...formData, allowedGates: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
            />
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
            <span>{editingService ? 'Save Changes' : 'Create Service'}</span>
          </button>
        </div>
      </div>
    </div>
    </OverlayPortal>
  );
}

