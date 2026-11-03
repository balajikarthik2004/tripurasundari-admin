import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Clock,
  Ban,
  Plus,
  Ticket,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { DarshanBookingProvider, useDarshanBookings } from '../context/DarshanBookingContext';
import BookingOverviewTab from '../components/bookings/BookingOverviewTab';
import AllBookingsTab from '../components/bookings/AllBookingsTab';
import DarshanServicesTab from '../components/bookings/DarshanServicesTab';
import SlotsCapacityTab from '../components/bookings/SlotsCapacityTab';
import CancellationsTab from '../components/bookings/CancellationsTab';
import BookingDetailsDrawer from '../components/bookings/BookingDetailsDrawer';
import CreateBookingModal from '../components/bookings/CreateBookingModal';
import ServiceModal from '../components/bookings/ServiceModal';
import SlotModal from '../components/bookings/SlotModal';
import ConfirmationModal from '../components/bookings/ConfirmationModal';
import CancellationReviewModal from '../components/bookings/CancellationReviewModal';

function DarshanBookingsContent() {
  const {
    bookings,
    services,
    slots,
    cancellations,
    metrics,
    confirmBooking,
    rejectBooking,
    cancelBooking,
    completeBooking,
    approveCancellation,
    rejectCancellation,
  } = useDarshanBookings();

  // Active Tab: 'overview' | 'all' | 'services' | 'slots' | 'cancellations'
  const [activeTab, setActiveTab] = useState('overview');

  // Modals & Drawer State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBookingForDrawer, setSelectedBookingForDrawer] = useState(null);

  const [serviceModalConfig, setServiceModalConfig] = useState({
    isOpen: false,
    editingService: null,
  });

  const [slotModalConfig, setSlotModalConfig] = useState({
    isOpen: false,
    editingSlot: null,
  });

  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDestructive: false,
    requireRemarks: false,
    remarksPlaceholder: 'Enter administrative remarks...',
    onConfirmAction: () => {},
  });

  // Modal Action Handlers
  const handleOpenConfirmBooking = (booking) => {
    setConfirmModalConfig({
      isOpen: true,
      title: `Confirm Darshan Booking`,
      message: `Are you sure you want to approve and confirm booking ${booking.id} for ${booking.devoteeName}? An official confirmation voucher and queue pass will be validated.`,
      confirmLabel: 'Approve & Confirm',
      isDestructive: false,
      requireRemarks: false,
      remarksPlaceholder: 'Optional approval notes (e.g. VIP priority approved)...',
      onConfirmAction: (remarks) => {
        confirmBooking(booking.id, remarks);
        if (selectedBookingForDrawer?.id === booking.id) {
          setSelectedBookingForDrawer((prev) => (prev ? { ...prev, status: 'Confirmed' } : null));
        }
      },
    });
  };

  const handleOpenRejectBooking = (booking) => {
    setConfirmModalConfig({
      isOpen: true,
      title: `Reject Booking Request`,
      message: `Provide an administrative reason for rejecting booking ${booking.id} (${booking.devoteeName}). Devotee will be notified.`,
      confirmLabel: 'Reject Request',
      isDestructive: true,
      requireRemarks: true,
      remarksPlaceholder: 'Specify rejection reason (e.g. Incomplete ID verification)...',
      onConfirmAction: (remarks) => {
        rejectBooking(booking.id, remarks);
        if (selectedBookingForDrawer?.id === booking.id) {
          setSelectedBookingForDrawer((prev) => (prev ? { ...prev, status: 'Rejected' } : null));
        }
      },
    });
  };

  const handleOpenCancelBooking = (booking) => {
    setConfirmModalConfig({
      isOpen: true,
      title: `Cancel Darshan Booking`,
      message: `Cancelling booking ${booking.id} will immediately release ${booking.devoteesCount} spot(s) back into slot "${booking.slotLabel}".`,
      confirmLabel: 'Cancel Booking & Release Slot',
      isDestructive: true,
      requireRemarks: true,
      remarksPlaceholder: 'Cancellation reason / devotee request details...',
      onConfirmAction: (remarks) => {
        cancelBooking(booking.id, remarks);
        if (selectedBookingForDrawer?.id === booking.id) {
          setSelectedBookingForDrawer((prev) => (prev ? { ...prev, status: 'Cancelled' } : null));
        }
      },
    });
  };

  const handleOpenApproveCancellation = (cancellation) => {
    setConfirmModalConfig({
      isOpen: true,
      title: `Approve Cancellation Request`,
      message: `Approve cancellation ${cancellation.id} for devotee ${cancellation.devoteeName}. This will release ${cancellation.devoteesCount} spot(s) back to the general slot capacity.`,
      confirmLabel: 'Approve & Release Quota',
      isDestructive: false,
      requireRemarks: false,
      remarksPlaceholder: 'Approval remarks for records...',
      onConfirmAction: (remarks) => {
        approveCancellation(cancellation.id, remarks);
      },
    });
  };

  const handleOpenRejectCancellation = (cancellation) => {
    setConfirmModalConfig({
      isOpen: true,
      title: `Reject Cancellation Request`,
      message: `Provide a reason for rejecting cancellation ${cancellation.id} for devotee ${cancellation.devoteeName}.`,
      confirmLabel: 'Reject Cancellation',
      isDestructive: true,
      requireRemarks: true,
      remarksPlaceholder: 'State reason (e.g. Non-refundable window passed)...',
      onConfirmAction: (remarks) => {
        rejectCancellation(cancellation.id, remarks);
      },
    });
  };

  // Dedicated Devotee Cancellation Review Modal State
  const [reviewCancellationConfig, setReviewCancellationConfig] = useState({
    isOpen: false,
    cancellation: null,
    booking: null,
  });

  const handleOpenReviewCancellation = (bookingOrCan) => {
    let targetBooking = null;
    let targetCan = null;

    if (bookingOrCan?.refId) {
      targetBooking = bookingOrCan;
      targetCan =
        cancellations.find((c) => c.bookingId === targetBooking.id && c.status === 'Requested') || {
          id: `CAN-${targetBooking.id.replace('DRSN-2026-', '')}`,
          bookingId: targetBooking.id,
          devoteeName: targetBooking.devoteeName,
          mobile: targetBooking.mobile,
          serviceName: targetBooking.serviceName,
          visitDate: targetBooking.visitDate,
          slotLabel: targetBooking.slotLabel,
          devoteesCount: targetBooking.devoteesCount,
          amount: targetBooking.amount,
          reason: targetBooking.notes || 'Devotee requested cancellation of confirmed darshan pass.',
          status: 'Requested',
        };
    } else {
      targetCan = bookingOrCan;
      targetBooking = bookings.find((b) => b.id === targetCan?.bookingId);
    }

    setReviewCancellationConfig({
      isOpen: true,
      cancellation: targetCan,
      booking: targetBooking,
    });
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Module Page Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
            Darshan & Bookings Administration
          </h1>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-xl shadow-xs transition-all duration-150 flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 text-[#E2BC6B] shrink-0" />
            <span>Create Booking</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 border border-stone-200/80 bg-white/70 backdrop-blur-xs p-1.5 rounded-xl shadow-2xs overflow-x-auto custom-scrollbar w-full">
        {/* Overview Tab */}
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 min-w-fit px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#55132D] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>Overview & Analytics</span>
        </button>

        {/* All Bookings Tab */}
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 min-w-fit px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'all'
              ? 'bg-[#55132D] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Ticket className="w-4 h-4 flex-shrink-0" />
          <span>All Devotee Bookings</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
              activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
            }`}
          >
            {bookings.length}
          </span>
          {metrics.cancellationRequestsTotal > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500 text-white flex-shrink-0"
              title={`${metrics.cancellationRequestsTotal} cancellation request(s) awaiting approval`}
            >
              {metrics.cancellationRequestsTotal} req
            </span>
          )}
        </button>

        {/* Darshan Services Tab */}
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 min-w-fit px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'services'
              ? 'bg-[#55132D] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4 flex-shrink-0" />
          <span>Darshan Services</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
              activeTab === 'services' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
            }`}
          >
            {services.length}
          </span>
        </button>

        {/* Slots & Capacity Tab */}
        <button
          onClick={() => setActiveTab('slots')}
          className={`flex-1 min-w-fit px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'slots'
              ? 'bg-[#55132D] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>Slots & Live Capacity</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
              activeTab === 'slots' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
            }`}
          >
            {slots.length}
          </span>
        </button>

        {/* Cancellations Tab */}
        <button
          onClick={() => setActiveTab('cancellations')}
          className={`flex-1 min-w-fit px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'cancellations'
              ? 'bg-[#55132D] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Ban className="w-4 h-4 flex-shrink-0" />
          <span>Cancellations</span>
          {metrics.cancellationRequestsTotal > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-rose-600 text-white flex-shrink-0">
              {metrics.cancellationRequestsTotal}
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'overview' && (
          <BookingOverviewTab
            onOpenDetails={(booking) => setSelectedBookingForDrawer(booking)}
            onSwitchTab={(tabName) => setActiveTab(tabName)}
            onOpenCreate={() => setIsCreateOpen(true)}
          />
        )}

        {activeTab === 'all' && (
          <AllBookingsTab
            onOpenDetails={(booking) => setSelectedBookingForDrawer(booking)}
            onOpenCreate={() => setIsCreateOpen(true)}
            onReviewCancellation={handleOpenReviewCancellation}
            onCancel={handleOpenCancelBooking}
            onComplete={(bookingId) => completeBooking(bookingId)}
          />
        )}

        {activeTab === 'services' && (
          <DarshanServicesTab
            onOpenAddService={() => setServiceModalConfig({ isOpen: true, editingService: null })}
            onOpenEditService={(service) => setServiceModalConfig({ isOpen: true, editingService: service })}
          />
        )}

        {activeTab === 'slots' && (
          <SlotsCapacityTab
            onOpenAddSlot={() => setSlotModalConfig({ isOpen: true, editingSlot: null })}
            onOpenEditSlot={(slot) => setSlotModalConfig({ isOpen: true, editingSlot: slot })}
          />
        )}

        {activeTab === 'cancellations' && (
          <CancellationsTab
            onApprove={handleOpenApproveCancellation}
            onReject={handleOpenRejectCancellation}
            onOpenBookingDetails={(booking) => setSelectedBookingForDrawer(booking)}
          />
        )}
      </div>

      {/* Booking Details Drawer */}
      <BookingDetailsDrawer
        booking={selectedBookingForDrawer}
        onClose={() => setSelectedBookingForDrawer(null)}
        onConfirm={handleOpenConfirmBooking}
        onReject={handleOpenRejectBooking}
        onCancel={handleOpenCancelBooking}
        onComplete={(bookingId) => completeBooking(bookingId)}
      />

      {/* Create Booking Modal */}
      <CreateBookingModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* Darshan Service Config Modal */}
      <ServiceModal
        isOpen={serviceModalConfig.isOpen}
        onClose={() => setServiceModalConfig({ isOpen: false, editingService: null })}
        editingService={serviceModalConfig.editingService}
      />

      {/* Slot Capacity Config Modal */}
      <SlotModal
        isOpen={slotModalConfig.isOpen}
        onClose={() => setSlotModalConfig({ isOpen: false, editingSlot: null })}
        editingSlot={slotModalConfig.editingSlot}
      />

      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmLabel={confirmModalConfig.confirmLabel}
        isDestructive={confirmModalConfig.isDestructive}
        requireRemarks={confirmModalConfig.requireRemarks}
        remarksPlaceholder={confirmModalConfig.remarksPlaceholder}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={(remarks) => {
          confirmModalConfig.onConfirmAction(remarks);
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        }}
      />

      {/* Dedicated Devotee Cancellation Review Modal */}
      <CancellationReviewModal
        isOpen={reviewCancellationConfig.isOpen}
        cancellation={reviewCancellationConfig.cancellation}
        booking={reviewCancellationConfig.booking}
        onApprove={(remarks) => {
          if (reviewCancellationConfig.cancellation?.id) {
            approveCancellation(reviewCancellationConfig.cancellation.id, remarks);
          }
          setReviewCancellationConfig({ isOpen: false, cancellation: null, booking: null });
        }}
        onReject={(remarks) => {
          if (reviewCancellationConfig.cancellation?.id) {
            rejectCancellation(reviewCancellationConfig.cancellation.id, remarks);
          }
          setReviewCancellationConfig({ isOpen: false, cancellation: null, booking: null });
        }}
        onClose={() => setReviewCancellationConfig({ isOpen: false, cancellation: null, booking: null })}
      />
    </div>
  );
}

export default function DarshanBookings() {
  return (
    <DarshanBookingProvider>
      <DarshanBookingsContent />
    </DarshanBookingProvider>
  );
}

