import React, { useState } from 'react';
import { X, HeartHandshake, Save } from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function AnnadanamModal({ isOpen, onClose }) {
  const { devotees, createAnnadanamRecord } = useDevoteeServices();

  const [formData, setFormData] = useState({
    date: '2026-10-31',
    mealCategory: 'Mahaprasad Lunch Service (Bhog)',
    beneficiaryCount: 1200,
    couponRef: `CPN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    sponsorId: devotees[0]?.id || '',
    sponsorshipCategory: 'Full Day Annadanam Sponsorship',
    recordedContribution: 15000,
    diningHall: 'Dining Hall Complex A (Main)',
    menuItems: 'Govindabhog rice, Moong dal khichuri, Labra mixed sabzi, Payesh',
    remarks: 'Pilgrim meal distribution logged.',
  });

  if (!isOpen) return null;

  const selectedSponsor = devotees.find((d) => d.id === formData.sponsorId) || devotees[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    createAnnadanamRecord({
      date: formData.date,
      mealCategory: formData.mealCategory,
      beneficiaryCount: Number(formData.beneficiaryCount) || 100,
      couponRef: formData.couponRef,
      sponsorId: selectedSponsor.id,
      sponsorName: selectedSponsor.name,
      sponsorshipCategory: formData.sponsorshipCategory,
      recordedContribution: Number(formData.recordedContribution) || 0,
      distributionStatus: 'In Progress',
      diningHall: formData.diningHall,
      menuItems: formData.menuItems,
      remarks: formData.remarks,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B]">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-white">Record Annadanam Meal Session</h2>
              <p className="text-[11px] text-[#E2BC6B]/90">Pilgrim food distribution & coupon accounting</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Estimated Beneficiaries</label>
              <input
                type="number"
                min="50"
                value={formData.beneficiaryCount}
                onChange={(e) => setFormData({ ...formData, beneficiaryCount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Meal / Service Category</label>
            <select
              value={formData.mealCategory}
              onChange={(e) => setFormData({ ...formData, mealCategory: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
            >
              <option value="Mahaprasad Lunch Service (Bhog)">Mahaprasad Lunch Service (Bhog)</option>
              <option value="Balya Bhog & Morning Sweet Porridge">Balya Bhog & Morning Sweet Porridge</option>
              <option value="Sandhya Bhog & Evening Khichuri">Sandhya Bhog & Evening Khichuri</option>
              <option value="Special Festival Maha Annadanam">Special Festival Maha Annadanam</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Sponsoring Devotee</label>
            <select
              value={formData.sponsorId}
              onChange={(e) => setFormData({ ...formData, sponsorId: e.target.value })}
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
              <label className="block font-semibold text-stone-700 mb-1">Recorded Contribution (₹)</label>
              <input
                type="number"
                value={formData.recordedContribution}
                onChange={(e) => setFormData({ ...formData, recordedContribution: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Coupon Batch Code</label>
              <input
                type="text"
                value={formData.couponRef}
                onChange={(e) => setFormData({ ...formData, couponRef: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Dining Hall Venue</label>
            <input
              type="text"
              value={formData.diningHall}
              onChange={(e) => setFormData({ ...formData, diningHall: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Menu Items</label>
            <input
              type="text"
              value={formData.menuItems}
              onChange={(e) => setFormData({ ...formData, menuItems: e.target.value })}
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
            <span>Save Annadanam Record</span>
          </button>
        </div>
      </div>
    </div>
  );
}

