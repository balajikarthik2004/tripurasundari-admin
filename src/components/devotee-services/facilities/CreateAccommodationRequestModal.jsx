import OverlayPortal from '../../common/OverlayPortal';
import React, { useState } from 'react';
import { X, Building2, Calendar, User, Save } from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function CreateAccommodationRequestModal({ isOpen, onClose }) {
  const { devotees, accommodationTypes, createAccommodationRequest } = useDevoteeServices();

  const [formData, setFormData] = useState({
    devoteeId: devotees[0]?.id || '',
    accommodationType: accommodationTypes[0]?.name || 'Pilgrim Dormitory Cot (Shared Hall)',
    checkInDate: '2026-10-31',
    checkOutDate: '2026-11-01',
    guestsCount: 2,
    remarks: 'Pilgrimage visit; ID verified at reception desk.',
  });

  if (!isOpen) return null;

  const selectedDevotee = devotees.find((d) => d.id === formData.devoteeId) || devotees[0];
  const selectedType = accommodationTypes.find((a) => a.name === formData.accommodationType) || accommodationTypes[0];

  const totalAmount = (selectedType?.configuredAmount || 0) * (Number(formData.guestsCount) || 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    createAccommodationRequest({
      devoteeId: selectedDevotee.id,
      devoteeName: selectedDevotee.name,
      mobile: selectedDevotee.mobile,
      email: selectedDevotee.email,
      accommodationType: formData.accommodationType,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      guestsCount: Number(formData.guestsCount) || 1,
      allocatedUnit: 'Unit assigned upon arrival',
      amount: totalAmount,
      paymentStatus: 'Paid',
      status: 'Approved',
      remarks: formData.remarks,
    });
    onClose();
  };

  return (
    <OverlayPortal isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-[#55132D] to-[#681B37] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-white">Record Accommodation Request</h2>
              <p className="text-[11px] text-[#E2BC6B]/90">Yatri Niwas guest allotment & stay validation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/70 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Select Devotee <span className="text-rose-600">*</span>
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

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Accommodation Facility Type <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.accommodationType}
              onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
            >
              {accommodationTypes.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name} (₹{a.configuredAmount} • {a.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Check-In Date</label>
              <input
                type="date"
                required
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Check-Out Date</label>
              <input
                type="date"
                required
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Number of Guests</label>
              <input
                type="number"
                min="1"
                max="8"
                value={formData.guestsCount}
                onChange={(e) => setFormData({ ...formData, guestsCount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Estimated Cleaning / Stay Fee</label>
              <div className="px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 font-bold text-[#55132D] text-sm">
                ₹{totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Administrative Remarks / Verification</label>
            <input
              type="text"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>
        </form>

        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow"
          >
            Approve & Allot Stay
          </button>
        </div>
      </div>
    </div>
    </OverlayPortal>
  );
}

