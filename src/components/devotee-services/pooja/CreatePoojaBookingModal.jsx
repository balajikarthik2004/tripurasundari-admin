import OverlayPortal from '../../common/OverlayPortal';
import React, { useState } from 'react';
import { X, Flame, Calendar, Clock, User, CreditCard } from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function CreatePoojaBookingModal({ isOpen, onClose }) {
  const { devotees, poojaServices, createPoojaBooking } = useDevoteeServices();
  const activeServices = poojaServices.filter((s) => s.status === 'active');

  const [formData, setFormData] = useState({
    devoteeId: devotees[0]?.id || '',
    serviceId: activeServices[0]?.id || '',
    preferredDate: '2026-10-31',
    preferredTime: '09:00 AM',
    participantsCount: 2,
    gotra: 'Kashyapa',
    sankalpamNames: '',
    paymentMode: 'UPI / Online',
    notes: '',
  });

  if (!isOpen) return null;

  const selectedService = poojaServices.find((s) => s.id === formData.serviceId) || activeServices[0];
  const selectedDevotee = devotees.find((d) => d.id === formData.devoteeId) || devotees[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedService || !selectedDevotee) return;

    createPoojaBooking({
      devoteeId: selectedDevotee.id,
      devoteeName: selectedDevotee.name,
      mobile: selectedDevotee.mobile,
      email: selectedDevotee.email,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      category: selectedService.category,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      participantsCount: Number(formData.participantsCount) || 1,
      gotra: formData.gotra.trim() || 'Not specified',
      sankalpamNames: formData.sankalpamNames.trim() || selectedDevotee.name,
      amount: selectedService.amount,
      paymentStatus: 'Paid',
      paymentMode: formData.paymentMode,
      bookingStatus: 'Confirmed',
      priestAssigned: 'Assigned on arrival',
      location: 'Main Sanctum / Yagya Shala',
      administrativeRemarks: formData.notes.trim() || 'Recorded via administrative counter.',
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
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-white">Record Sacred Pooja & Seva</h2>
              <p className="text-[11px] text-[#E2BC6B]/90">Sankalpam ritual allocation & receipt registration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/70 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Select Devotee */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Select Devotee <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.devoteeId}
              onChange={(e) => setFormData({ ...formData, devoteeId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
            >
              {devotees.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.id}) — {d.mobile} ({d.city})
                </option>
              ))}
            </select>
          </div>

          {/* Select Service */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Pooja / Seva Ritual <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
            >
              {activeServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — ₹{s.amount} ({s.duration})
                </option>
              ))}
            </select>
            {selectedService && (
              <p className="text-[11px] text-stone-500 mt-1">
                Category: <strong className="text-stone-700">{selectedService.category}</strong> • Duration: {selectedService.duration}
              </p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Preferred Date</label>
              <input
                type="date"
                required
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Preferred Time / Shift</label>
              <input
                type="text"
                placeholder="09:00 AM"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              />
            </div>
          </div>

          {/* Gotra & Sankalpam Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Family Gotra</label>
              <input
                type="text"
                placeholder="e.g. Kashyapa / Sandilya"
                value={formData.gotra}
                onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Participants Count</label>
              <input
                type="number"
                min="1"
                max={selectedService?.maxParticipants || 8}
                value={formData.participantsCount}
                onChange={(e) => setFormData({ ...formData, participantsCount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Sankalpam Family Names
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar, Sunita Devi, Aryan"
              value={formData.sankalpamNames}
              onChange={(e) => setFormData({ ...formData, sankalpamNames: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>

          <div className="p-3 bg-[#F8F5EF] rounded-xl border border-[#B68A36]/30 flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-700 block">Configured Ritual Fee</span>
              <span className="text-[11px] text-stone-500">Fixed rate demonstration schedule</span>
            </div>
            <span className="text-base font-bold text-[#55132D] font-serif">
              ₹{selectedService ? selectedService.amount.toLocaleString('en-IN') : 0}
            </span>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Payment Method</label>
            <select
              value={formData.paymentMode}
              onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
            >
              <option value="UPI / Online">UPI / QR Code</option>
              <option value="Cash at Counter">Cash at Counter</option>
              <option value="Debit / Credit Card">Debit / Credit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>
        </form>

        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow"
          >
            Confirm & Issue Pooja Booking
          </button>
        </div>
      </div>
    </div>
    </OverlayPortal>
  );
}

