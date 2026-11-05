import OverlayPortal from '../common/OverlayPortal';
import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
  Layers,
  Printer,
  Ban,
  Check,
  ChevronRight,
  ShieldCheck,
  Edit,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency, getStatusBadgeStyle } from '../../utils/formatters';
import { useDarshanBookings } from '../../context/DarshanBookingContext';
import ConfirmationModal from './ConfirmationModal';

export default function BookingDetailsDrawer({ booking, isOpen, onClose, onEdit }) {
  const {
    cancellations,
    approveCancellation,
    rejectCancellation,
    cancelBooking,
    completeBooking,
    confirmBooking,
    rejectBooking,
  } = useDarshanBookings();
  const [modalAction, setModalAction] = useState(null); // 'approve_cancellation' | 'reject_cancellation' | 'cancel'

  if (!isOpen || !booking) return null;

  const badgeStyle = getStatusBadgeStyle(booking.status);
  const matchingCan = cancellations.find(
    (c) => c.bookingId === booking.id && c.status === 'Requested'
  );

  const handleModalConfirm = (remarks) => {
    if (modalAction === 'approve_cancellation') {
      const canId = matchingCan?.id || `CAN-${booking.id}`;
      approveCancellation(canId, remarks || 'Cancellation approved by Temple Authority; slot quota released.');
    } else if (modalAction === 'reject_cancellation') {
      const canId = matchingCan?.id || `CAN-${booking.id}`;
      rejectCancellation(canId, remarks || 'Cancellation rejected by Temple Authority. Pass remains active.');
    } else if (modalAction === 'cancel') {
      cancelBooking(booking.id, remarks || 'Cancelled by Temple Authority');
    }
    setModalAction(null);
  };

  return (
    <>
      <OverlayPortal isOpen={true} onClose={onClose}>
      <div className="fixed inset-0 z-[9999] overflow-hidden animate-in fade-in duration-200">
        <div
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-10">
          <div className="w-screen max-w-lg bg-[#F8F5EF] border-l border-[#E8E2D8] shadow-2xl flex flex-col justify-between">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-[#E8E2D8] flex items-center justify-between flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-temple-gold">
                    Darshan Booking Voucher
                  </span>
                  <span className="text-[10.5px] bg-[#FAF8F5] border border-[#E8E2D8] text-temple-burgundy px-1.5 py-0.2 rounded font-mono font-bold">
                    {booking.refId}
                  </span>
                </div>
                <h2 className="font-serif text-lg font-bold text-temple-burgundy mt-0.5 truncate">
                  {booking.serviceName}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
              {/* Status & Amount Hero */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D8] shadow-subtle flex items-center justify-between">
                <div>
                  <span className="text-[10.5px] text-temple-text-muted block">Applicable Fee</span>
                  <div className="text-2xl font-number font-bold text-temple-burgundy tracking-tight">
                    {booking.amount > 0 ? formatCurrency(booking.amount) : 'Free Pass'}
                  </div>
                  <span className="text-[10px] text-temple-text-secondary mt-0.5 block">
                    Source: {booking.source} • Mode: {booking.paymentStatus}
                  </span>
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeStyle.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                    {booking.status}
                  </span>
                  <span className="text-[10px] text-temple-text-muted block mt-1">
                    Booked: {booking.createdDate}
                  </span>
                </div>
              </div>

              {/* Devotee Cancellation Request Banner */}
              {booking.status === 'Cancellation Requested' && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Cancellation Requested by Devotee</span>
                    {matchingCan && (
                      <span className="font-mono text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                        {matchingCan.id}
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-amber-950 font-medium">
                    Reason: &ldquo;{matchingCan?.reason || booking.notes || 'Devotee requested cancellation.'}&rdquo;
                  </p>
                  <p className="text-[10px] text-amber-700">
                    Review required by Temple Authority. Approving releases slot capacity; rejecting retains the confirmed pass.
                  </p>
                </div>
              )}

              {/* Devotee Info */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D8] shadow-subtle space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-temple-burgundy flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-temple-gold" />
                  <span>Devotee Information</span>
                </h3>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-temple-text-secondary">Full Name:</span>
                    <span className="font-semibold text-temple-text-primary">{booking.devoteeName}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-temple-text-secondary">Mobile Number:</span>
                    <span className="font-mono text-temple-text-primary">{booking.mobile}</span>
                  </div>
                  {booking.gotra && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-temple-text-secondary">Family Gotra:</span>
                      <span className="font-semibold text-temple-text-primary">{booking.gotra}</span>
                    </div>
                  )}
                  {booking.email && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-temple-text-secondary">Email Address:</span>
                      <span className="text-temple-text-primary">{booking.email}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-temple-text-secondary">Devotee Reference ID:</span>
                    <span className="font-mono font-medium text-temple-gold">{booking.devoteeId || 'DEV-AUTO'}</span>
                  </div>
                </div>
              </div>

              {/* Reservation & Slot Details */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D8] shadow-subtle space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-temple-burgundy flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-temple-gold" />
                  <span>Service & Slot Allocation</span>
                </h3>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-temple-text-secondary">Service Offering:</span>
                    <span className="font-bold text-temple-text-primary">{booking.serviceName}</span>
                  </div>
                  {booking.category && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-temple-text-secondary">Category:</span>
                      <span className="font-medium text-temple-burgundy">{booking.category}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-temple-text-secondary">Visit Date:</span>
                    <span className="font-bold text-temple-text-primary">{booking.visitDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-temple-text-secondary">Time Slot:</span>
                    <span className="font-semibold text-temple-burgundy">{booking.timeSlot || booking.slotLabel}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-temple-text-secondary">Devotees Count:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                      {booking.devoteesCount} Pilgrim{booking.devoteesCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-temple-text-secondary">Payment Method:</span>
                    <span className="font-medium text-temple-text-primary">
                      {booking.paymentMethod || 'Online (UPI / Card)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes & Special Requests */}
              {booking.notes && (
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EDE7DC] text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-temple-text-primary mb-1">
                    <FileText className="w-3.5 h-3.5 text-temple-gold" />
                    <span>Special Notes & Instructions</span>
                  </div>
                  <p className="text-temple-text-secondary italic text-[11.5px] leading-relaxed">
                    &ldquo;{booking.notes}&rdquo;
                  </p>
                </div>
              )}

              {/* Status History & Audit Log */}
              {booking.history && booking.history.length > 0 && (
                <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D8] shadow-subtle space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-temple-burgundy flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-temple-gold" />
                    <span>Lifecycle Activity History</span>
                  </h3>
                  <div className="space-y-1.5 text-[11px]">
                    {booking.history.map((log, i) => (
                      <div key={i} className="flex items-start justify-between gap-2 py-1 border-b border-slate-100 last:border-b-0">
                        <div>
                          <span className="font-semibold text-temple-text-primary block">{log.action}</span>
                          <span className="text-[10px] text-temple-text-muted">By {log.user}</span>
                        </div>
                        <span className="font-mono text-[10px] text-temple-text-secondary flex-shrink-0">
                          {log.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Action Buttons Footer */}
            <div className="p-4 bg-white border-t border-[#E8E2D8] flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Printing verified darshan entry pass voucher for ${booking.refId}...`)}
                  className="px-3 py-1.5 rounded-lg border border-[#E8E2D8] hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-temple-gold" />
                  <span>Print Slip</span>
                </button>

                {onEdit && booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEdit(booking);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#E8E2D8] hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Edit className="w-3.5 h-3.5 text-temple-burgundy" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {booking.status === 'Pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        rejectBooking(booking.id, 'Administrative capacity limit');
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-xs font-bold text-rose-800 transition-colors"
                    >
                      Reject Booking
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        confirmBooking(booking.id);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Booking</span>
                    </button>
                  </>
                )}

                {booking.status === 'Cancellation Requested' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setModalAction('reject_cancellation')}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-xs font-bold text-rose-800 transition-colors"
                      title="Reject cancellation request and keep booking active"
                    >
                      Reject Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalAction('approve_cancellation')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white flex items-center gap-1 transition-colors shadow-xs"
                      title="Approve cancellation and release slot capacity"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Cancellation</span>
                    </button>
                  </>
                )}

                {(booking.status === 'Confirmed' || booking.status === 'Active') && (
                  <>
                    <button
                      type="button"
                      onClick={() => setModalAction('cancel')}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-xs font-semibold text-rose-800 transition-colors"
                    >
                      Cancel Booking
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        completeBooking(booking.id);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-temple-burgundy hover:bg-temple-maroon text-xs font-semibold text-white flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E2BC6B]" />
                      <span>Mark Completed</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </OverlayPortal>

      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={Boolean(modalAction)}
        title={
          modalAction === 'approve_cancellation'
            ? 'Approve Devotee Cancellation'
            : modalAction === 'reject_cancellation'
            ? 'Reject Cancellation Request'
            : 'Cancel Confirmed Darshan'
        }
        message={
          modalAction === 'approve_cancellation'
            ? `Approving will cancel pass ${booking.refId} for ${booking.devoteeName} and release ${booking.devoteesCount} spot(s) back into slot "${booking.slotLabel}".`
            : modalAction === 'reject_cancellation'
            ? `Rejecting will retain booking ${booking.refId} as Confirmed. Devotee will be notified.`
            : `Cancelling booking ${booking.refId} will immediately release ${booking.devoteesCount} pilgrim capacity back to "${booking.slotLabel}".`
        }
        confirmText={
          modalAction === 'approve_cancellation'
            ? 'Approve & Release Quota'
            : modalAction === 'reject_cancellation'
            ? 'Reject Request (Keep Active)'
            : 'Proceed Cancellation'
        }
        confirmType={modalAction === 'approve_cancellation' ? 'primary' : 'danger'}
        requireRemarks={modalAction === 'reject_cancellation' || modalAction === 'cancel'}
        remarksPlaceholder={
          modalAction === 'reject_cancellation'
            ? 'Administrative reason for rejection...'
            : 'Cancellation reason...'
        }
        onConfirm={handleModalConfirm}
        onClose={() => setModalAction(null)}
      />
    </>
  );
}

