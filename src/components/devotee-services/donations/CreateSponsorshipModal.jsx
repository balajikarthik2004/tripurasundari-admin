import OverlayPortal from '../../common/OverlayPortal';
import React, { useState } from 'react';
import { X, Award, Save } from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function CreateSponsorshipModal({ isOpen, onClose }) {
  const { devotees, createSponsorship } = useDevoteeServices();

  const [formData, setFormData] = useState({
    devoteeId: devotees[0]?.id || '',
    category: 'Annadanam Sponsorship',
    amount: 15000,
    sponsorshipDate: '2026-10-31',
    associatedEvent: 'Saturday Special Pilgrimage Annadanam',
    remarks: 'Display commemorative banner honoring family.',
  });

  if (!isOpen) return null;

  const selectedDevotee = devotees.find((d) => d.id === formData.devoteeId) || devotees[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    createSponsorship({
      devoteeId: selectedDevotee.id,
      sponsorName: selectedDevotee.name,
      category: formData.category,
      amount: Number(formData.amount) || 1000,
      sponsorshipDate: formData.sponsorshipDate,
      associatedEvent: formData.associatedEvent,
      paymentStatus: 'Paid',
      acknowledgementStatus: 'Issued',
      remarks: formData.remarks,
    });
    onClose();
  };

  return (
    <OverlayPortal isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-white">Create Temple Sponsorship Program</h2>
              <p className="text-[11px] text-[#E2BC6B]/90">Record major festival or event sponsorship</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Select Sponsoring Devotee <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.devoteeId}
              onChange={(e) => setFormData({ ...formData, devoteeId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
            >
              {devotees.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.id}) — {d.city}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Sponsorship Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Annadanam Sponsorship">Annadanam Sponsorship</option>
                <option value="General Temple Support">General Temple Support</option>
                <option value="Special Event Support">Special Event Support</option>
                <option value="Diya Seva">Diya Seva</option>
                <option value="Festival Illumination">Festival Illumination</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Sponsorship Amount (₹)</label>
              <input
                type="number"
                min="500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Sponsorship Date</label>
              <input
                type="date"
                required
                value={formData.sponsorshipDate}
                onChange={(e) => setFormData({ ...formData, sponsorshipDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Associated Event / Programme</label>
              <input
                type="text"
                value={formData.associatedEvent}
                onChange={(e) => setFormData({ ...formData, associatedEvent: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Administrative Remarks / Citations</label>
            <input
              type="text"
              placeholder="e.g. Felicitation plaque presented; banner displayed"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
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
            <span>Record Sponsorship</span>
          </button>
        </div>
      </div>
    </div>
    </OverlayPortal>
  );
}

