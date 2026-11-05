import OverlayPortal from '../common/OverlayPortal';
import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, Users, CreditCard, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useDarshanBookings } from '../../context/DarshanBookingContext';

export default function CreateBookingModal({ isOpen, onClose }) {
  const { services, slots, selectedDate, getSlotOccupancy, createBooking } = useDarshanBookings();

  // Active services
  const activeServices = useMemo(() => services.filter((s) => s.status === 'active'), [services]);

  const [formData, setFormData] = useState({
    devoteeName: '',
    mobile: '',
    email: '',
    city: 'Agartala, Tripura',
    idType: 'Aadhaar Card',
    idNumber: '',
    serviceId: activeServices[0]?.id || 'srv-001',
    visitDate: selectedDate,
    slotId: slots[0]?.id || 'slot-001',
    devoteesCount: 1,
    source: 'Counter Offline',
    paymentStatus: 'Paid',
    notes: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  // Selected service object
  const selectedService = useMemo(() => {
    return services.find((s) => s.id === formData.serviceId) || activeServices[0];
  }, [services, formData.serviceId, activeServices]);

  // Slots relevant or available
  const availableSlotsForDate = useMemo(() => {
    return slots.map((s) => {
      const occ = getSlotOccupancy(s.id, formData.visitDate);
      return {
        ...s,
        ...occ,
      };
    });
  }, [slots, formData.visitDate, getSlotOccupancy]);

  // Current slot occupancy
  const currentSlotOccupancy = useMemo(() => {
    return getSlotOccupancy(formData.slotId, formData.visitDate);
  }, [formData.slotId, formData.visitDate, getSlotOccupancy]);

  // Total amount
  const totalAmount = useMemo(() => {
    if (!selectedService) return 0;
    const fee = Number(selectedService.fee ?? selectedService.amount ?? 0);
    if (selectedService.isFree || fee === 0) return 0;
    return fee * Number(formData.devoteesCount || 1);
  }, [selectedService, formData.devoteesCount]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.devoteeName.trim()) {
      setErrorMsg('Please enter devotee full name.');
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const count = Number(formData.devoteesCount) || 1;
    if (count < 1) {
      setErrorMsg('Devotees count must be at least 1.');
      return;
    }

    if (selectedService?.maxDevoteesPerBooking && count > selectedService.maxDevoteesPerBooking) {
      setErrorMsg(`Maximum devotees allowed for ${selectedService.name} is ${selectedService.maxDevoteesPerBooking}.`);
      return;
    }

    if (currentSlotOccupancy.availableCapacity < count) {
      setErrorMsg(`Selected slot has only ${currentSlotOccupancy.availableCapacity} spots remaining.`);
      return;
    }

    const selectedSlotObj = slots.find((s) => s.id === formData.slotId);

    const bookingPayload = {
      devoteeName: formData.devoteeName.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim() || 'devotee@matabari.nic.in',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      category: selectedService.category,
      visitDate: formData.visitDate,
      slotId: formData.slotId,
      slotLabel: selectedSlotObj ? selectedSlotObj.label : 'General Slot',
      devoteesCount: count,
      amount: totalAmount,
      paymentStatus: totalAmount === 0 ? 'Not Applicable' : formData.paymentStatus,
      status: 'Confirmed',
      source: formData.source,
      gate: selectedSlotObj?.gate || 'Gate 1 (Main Entrance)',
      specialNotes: formData.notes.trim() || 'Created via administrative counter.',
      checkInStatus: 'Not Arrived',
    };

    const res = createBooking(bookingPayload);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to create booking.');
    }
  };

  return (
    <OverlayPortal isOpen={true} onClose={onClose}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#55132D] to-[#681B37] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-white tracking-wide">
                Create New Darshan Booking
              </h2>
              <p className="text-xs text-[#E2BC6B]/90">
                Administrative reservation entry with instant quota verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Devotee Primary Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#55132D]" />
              Devotee Primary Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smt. Gayatri Debbarma"
                  value={formData.devoteeName}
                  onChange={(e) => setFormData({ ...formData, devoteeName: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number (10 digits) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="devotee@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  City / State
                </label>
                <input
                  type="text"
                  placeholder="City, State"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
                />
              </div>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Darshan & Slot Selection */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#55132D]" />
              Darshan Service & Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Darshan Service <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D] bg-white"
                >
                  {activeServices.map((srv) => {
                    const fee = Number(srv.fee ?? srv.amount ?? 0);
                    const isFree = srv.isFree || fee === 0;
                    return (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} {isFree ? '(Free)' : `(₹${fee.toLocaleString('en-IN')})`}
                      </option>
                    );
                  })}
                </select>
                {selectedService && (
                  <p className="text-[11px] text-stone-500 mt-1">
                    Category: <span className="font-semibold text-stone-700">{selectedService.category}</span> • Max Devotees: {selectedService.maxDevoteesPerBooking}
                  </p>
                )}
              </div>

              {/* Visit Date */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Visit Date <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.visitDate}
                  onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D] bg-white"
                />
              </div>

              {/* Slot Selection with Real-time Capacity */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Darshan Time Slot <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formData.slotId}
                  onChange={(e) => setFormData({ ...formData, slotId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D] bg-white"
                >
                  {availableSlotsForDate.map((slot) => {
                    const isSlotFull = slot.availableCapacity <= 0;
                    return (
                      <option
                        key={slot.id}
                        value={slot.id}
                        disabled={isSlotFull || slot.status === 'disabled'}
                      >
                        {slot.label} ({slot.period}) — Available: {slot.availableCapacity}/{slot.maxCapacity} {isSlotFull ? '[FULL]' : ''}
                      </option>
                    );
                  })}
                </select>

                {/* Capacity badge */}
                <div className="mt-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span className="text-stone-600">Selected Slot Availability:</span>
                    <span className={`font-bold ${currentSlotOccupancy.availableCapacity > 50 ? 'text-emerald-700' : currentSlotOccupancy.availableCapacity > 0 ? 'text-amber-700' : 'text-rose-700'}`}>
                      {currentSlotOccupancy.availableCapacity} spots remaining
                    </span>
                  </div>
                  <span className="text-stone-400 text-[11px]">
                    Max Capacity: {currentSlotOccupancy.maxCapacity}
                  </span>
                </div>
              </div>

              {/* Devotees Count */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Number of Devotees <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedService?.maxDevoteesPerBooking || 10}
                  required
                  value={formData.devoteesCount}
                  onChange={(e) => setFormData({ ...formData, devoteesCount: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
                />
              </div>

              {/* Booking Source */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Booking Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D] bg-white"
                >
                  <option value="Counter Offline">Counter Offline</option>
                  <option value="Online Portal">Online Portal</option>
                  <option value="Administrative Quota">Administrative Quota</option>
                  <option value="VIP Protocol">VIP Protocol</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Payment & Administrative Summary */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#55132D]" />
              Fee & Administrative Settlement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={totalAmount === 0 ? 'Not Applicable' : formData.paymentStatus}
                  disabled={totalAmount === 0}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D] bg-white disabled:bg-stone-100"
                >
                  <option value="Paid">Paid (Cash / UPI at Counter)</option>
                  <option value="Unpaid">Unpaid / Pay on Arrival</option>
                  <option value="Not Applicable">Not Applicable (Free Darshan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Total Calculated Amount
                </label>
                <div className="px-3.5 py-2.5 rounded-lg bg-[#F8F5EF] border border-[#B68A36]/30 text-stone-900 font-bold text-sm flex items-center justify-between">
                  <span>{totalAmount === 0 ? 'Free Service' : `₹${totalAmount.toLocaleString('en-IN')}`}</span>
                  <span className="text-[11px] font-normal text-stone-500">
                    {totalAmount > 0 && `(₹${selectedService.fee} × ${formData.devoteesCount})`}
                  </span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Administrative Remarks / Special Requirements
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wheelchair assistance requested; Senior citizen accompanying"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Quota reserved immediately upon confirmation</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow transition-colors flex items-center gap-2"
            >
              <span>Confirm & Generate Booking</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </OverlayPortal>
  );
}

