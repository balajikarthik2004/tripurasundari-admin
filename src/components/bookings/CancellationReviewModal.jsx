import React, { useState } from 'react';
import { AlertTriangle, X, Check, ShieldAlert, User, Calendar, Clock, ArrowRight, Ban, ShieldCheck } from 'lucide-react';

export default function CancellationReviewModal({
  isOpen,
  cancellation,
  booking,
  onApprove,
  onReject,
  onClose,
}) {
  const [remarks, setRemarks] = useState('');

  if (!isOpen || (!cancellation && !booking)) return null;

  const targetCan = cancellation || {
    id: 'CAN-PENDING',
    reason: booking?.notes || 'Devotee schedule conflict',
    requestDate: 'Today',
  };

  const devoteeName = cancellation?.devoteeName || booking?.devoteeName;
  const bookingId = cancellation?.bookingId || booking?.id;
  const serviceName = cancellation?.serviceName || booking?.serviceName;
  const visitDate = cancellation?.visitDate || booking?.visitDate;
  const slotLabel = cancellation?.slotLabel || booking?.slotLabel;
  const devoteesCount = cancellation?.devoteesCount || booking?.devoteesCount || 1;
  const amount = cancellation?.amount ?? booking?.amount ?? 0;
  const reason = cancellation?.reason || booking?.notes || 'Devotee requested cancellation.';

  const handleApprove = () => {
    onApprove(remarks || 'Approved by Temple Authority; slot quota returned to general pool.');
    setRemarks('');
  };

  const handleReject = () => {
    onReject(remarks || 'Cancellation rejected by Temple Authority. Slot reservation remains confirmed.');
    setRemarks('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B68A36]">
                  Temple Authority Review
                </span>
                {cancellation?.id && (
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold">
                    {cancellation.id}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-base font-bold text-[#55132D]">
                Devotee Cancellation Request
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Devotee & Reservation Summary */}
        <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-[#E8E2D8] space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <div>
              <span className="font-bold text-stone-900 text-sm block">{devoteeName}</span>
              <span className="font-mono text-stone-500 text-[11px]">{bookingId}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-[#55132D] block">{serviceName}</span>
              <span className="text-[11px] text-stone-500">
                {amount === 0 ? 'Free Pass' : `₹${amount.toLocaleString('en-IN')}`} • {devoteesCount} Devotee(s)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
            <div>
              <span className="text-stone-400 block">Scheduled Date:</span>
              <span className="font-semibold text-stone-800">{visitDate}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Time Slot:</span>
              <span className="font-semibold text-stone-800">{slotLabel}</span>
            </div>
          </div>
        </div>

        {/* Devotee's Reason */}
        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
            Devotee&apos;s Submitted Reason:
          </span>
          <p className="text-amber-950 font-medium italic leading-relaxed">
            &ldquo;{reason}&rdquo;
          </p>
        </div>

        {/* Authority Remarks */}
        <div>
          <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
            Temple Authority Remarks / Justification:
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add decision remarks (e.g. Approved due to illness / Rejected: slot begins in under 2 hours)..."
            rows={2}
            className="w-full text-xs p-2.5 rounded-lg bg-[#FAF8F5] border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#55132D] focus:border-[#55132D] resize-none"
          />
        </div>

        {/* Operational Explanation */}
        <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> Approving will cancel the booking and immediately restore <strong>{devoteesCount} spot(s)</strong> back to slot capacity. Rejecting will retain the devotee&apos;s confirmed pass.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-800 transition-colors"
            title="Reject cancellation request; keep the booking confirmed"
          >
            Reject Request (Keep Confirmed)
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white transition-colors shadow-xs flex items-center gap-1.5"
            title="Approve cancellation; release slot capacity"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve Cancellation</span>
          </button>
        </div>
      </div>
    </div>
  );
}

