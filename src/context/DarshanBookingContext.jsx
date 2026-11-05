import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  INITIAL_UNIFIED_BOOKINGS,
  INITIAL_UNIFIED_SERVICES,
  INITIAL_UNIFIED_SLOTS,
  STANDARD_TIME_SLOTS,
  SERVICE_CATEGORIES,
} from '../data/unifiedBookingsData';
import { INITIAL_CANCELLATIONS } from '../data/cancellationRequests';

const DarshanBookingContext = createContext(null);

export function DarshanBookingProvider({ children }) {
  const [bookings, setBookings] = useState(INITIAL_UNIFIED_BOOKINGS);
  const [services, setServices] = useState(INITIAL_UNIFIED_SERVICES);
  const [slots, setSlots] = useState(INITIAL_UNIFIED_SLOTS);
  const [cancellations, setCancellations] = useState(INITIAL_CANCELLATIONS);
  const [selectedDate, setSelectedDate] = useState('2026-10-31');
  const [toast, setToast] = useState(null);

  // Drilldown Filter for seamless navigation from Overview (Sankey / Demand Matrix) to Bookings
  const [drilldownFilter, setDrilldownFilter] = useState({
    category: 'All',
    service: 'All',
    status: 'All',
    timeSlot: 'All',
    dateRange: 'Today',
  });

  const resetDrilldownFilter = () => {
    setDrilldownFilter({
      category: 'All',
      service: 'All',
      status: 'All',
      timeSlot: 'All',
      dateRange: 'Today',
    });
  };

  // Show temporary toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Helper to calculate dynamic slot occupancy
  const getSlotOccupancy = (slotId, date = selectedDate) => {
    const slot = slots.find((s) => s.id === slotId || s.timeSlot === slotId);
    if (!slot) return { maxCapacity: 0, bookedDevotees: 0, availableCapacity: 0, isFull: false, percentage: 0 };

    const bookingDelta = bookings
      .filter(
        (b) =>
          (b.slotId === slot.id || b.timeSlot === slot.timeSlot) &&
          (date === 'All' || !date || b.visitDate === date) &&
          b.status !== 'Cancelled' &&
          b.status !== 'Rejected'
      )
      .reduce((sum, b) => sum + (Number(b.devoteesCount) || 1), 0);

    const maxCapacity = slot.maxCapacity || 100;
    const bookedDevotees = Math.min(maxCapacity, bookingDelta);
    const availableCapacity = Math.max(0, maxCapacity - bookedDevotees);
    const isFull = availableCapacity === 0 || slot.status === 'disabled';
    const percentage = maxCapacity > 0 ? Math.min(100, Math.round((bookedDevotees / maxCapacity) * 100)) : 0;

    return {
      maxCapacity,
      bookedDevotees,
      availableCapacity,
      isFull,
      percentage,
      status: slot.status || 'active',
    };
  };

  // Derived Overall Metrics for Selected Date
  const metrics = useMemo(() => {
    const dayBookings = bookings.filter((b) => b.visitDate === selectedDate);
    const totalToday = dayBookings.filter((b) => b.status !== 'Cancelled' && b.status !== 'Rejected').length;
    const confirmedToday = dayBookings.filter((b) => b.status === 'Confirmed' || b.status === 'Completed').length;
    const cancellationRequestsTotal = cancellations.filter((c) => c.status === 'Requested').length;
    const pendingCancellationBookings = bookings.filter((b) => b.status === 'Cancellation Requested').length;

    // Total available capacity across all active slots for selected date
    let totalMax = 0;
    let totalBooked = 0;
    slots.filter((s) => s.status === 'active').forEach((slot) => {
      totalMax += slot.maxCapacity;
      const occ = getSlotOccupancy(slot.id, selectedDate);
      totalBooked += occ.bookedDevotees;
    });

    const totalAvailable = Math.max(0, totalMax - totalBooked);

    return {
      totalToday,
      confirmedToday,
      pendingTotal: cancellationRequestsTotal, // Deprecated alias aligned with cancellation requests
      cancellationRequestsTotal,
      pendingCancellationBookings,
      totalAvailableCapacityToday: totalAvailable,
      totalMaxCapacityToday: totalMax,
      occupancyPercentageToday: totalMax > 0 ? Math.round((totalBooked / totalMax) * 100) : 0,
    };
  }, [bookings, cancellations, slots, selectedDate]);

  // Actions: Booking Lifecycle
  const createBooking = (newBookingData) => {
    const occupancy = getSlotOccupancy(newBookingData.slotId, newBookingData.visitDate);
    const requiredDevotees = Number(newBookingData.devoteesCount) || 1;

    if (occupancy.availableCapacity < requiredDevotees) {
      showToast(`Selected slot does not have sufficient capacity (Only ${occupancy.availableCapacity} remaining).`, 'error');
      return { success: false, error: 'Capacity exceeded' };
    }

    const nextNumber = bookings.length + 1001;
    const generatedRefId = `DRSN-2026-${nextNumber}`;
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const fullBooking = {
      ...newBookingData,
      id: generatedRefId,
      refId: generatedRefId,
      status: 'Confirmed', // Direct confirmation upon booking; no admin gate for initial booking
      createdDate: nowTimestamp,
      devoteeId: `DEV-${Math.floor(10000 + Math.random() * 90000)}`,
      history: [
        { timestamp: nowTimestamp, action: 'Booking Created & Confirmed', user: newBookingData.source || 'Online Portal' },
        { timestamp: nowTimestamp, action: 'E-Pass & Turnstile Voucher Issued', user: 'System' },
      ],
    };

    setBookings((prev) => [fullBooking, ...prev]);
    showToast(`Booking ${generatedRefId} successfully confirmed for ${fullBooking.devoteeName}.`);
    return { success: true, booking: fullBooking };
  };

  const updateBooking = (bookingId, updatedFields) => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          ...updatedFields,
          history: [
            ...(b.history || []),
            { timestamp: nowTimestamp, action: 'Booking Information Updated', user: 'Admin User' },
          ],
        };
      })
    );
    showToast(`Booking ${bookingId} details updated.`);
  };

  const confirmBooking = (bookingId, remarks = '') => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'Confirmed',
          paymentStatus: b.amount > 0 && b.paymentStatus !== 'Paid' ? 'Paid' : b.paymentStatus,
          notes: remarks ? `${b.notes ? b.notes + ' • ' : ''}${remarks}` : b.notes,
          history: [
            ...(b.history || []),
            {
              timestamp: nowTimestamp,
              action: `Booking Confirmed${remarks ? ` (${remarks})` : ''}`,
              user: 'Admin User',
            },
          ],
        };
      })
    );
    showToast(`Booking ${bookingId} has been confirmed.`);
  };

  const rejectBooking = (bookingId, reason = 'Administrative grounds') => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'Rejected',
          notes: `${b.notes ? b.notes + ' • ' : ''}Rejection Reason: ${reason}`,
          history: [
            ...(b.history || []),
            {
              timestamp: nowTimestamp,
              action: `Booking Rejected: ${reason}`,
              user: 'Admin User',
            },
          ],
        };
      })
    );
    showToast(`Booking ${bookingId} rejected.`, 'info');
  };

  const cancelBooking = (bookingId, reason = 'Cancelled by administrator') => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let targetBooking = null;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        targetBooking = b;
        return {
          ...b,
          status: 'Cancelled',
          paymentStatus: b.paymentStatus === 'Paid' ? 'Refund Pending' : b.paymentStatus,
          history: [
            ...(b.history || []),
            {
              timestamp: nowTimestamp,
              action: `Booking Cancelled: ${reason}`,
              user: 'Admin User',
            },
          ],
        };
      })
    );

    // Also update/add cancellation record in cancellations list
    if (targetBooking) {
      setCancellations((prev) => {
        const existing = prev.find((c) => c.bookingId === bookingId);
        if (existing) {
          return prev.map((c) =>
            c.bookingId === bookingId
              ? { ...c, status: 'Approved', adminRemarks: reason, processedDate: nowTimestamp }
              : c
          );
        }
        return [
          {
            id: `CAN-${Math.floor(800 + Math.random() * 200)}`,
            bookingId: targetBooking.id,
            devoteeName: targetBooking.devoteeName,
            mobile: targetBooking.mobile,
            serviceName: targetBooking.serviceName,
            visitDate: targetBooking.visitDate,
            slotLabel: targetBooking.slotLabel,
            devoteesCount: targetBooking.devoteesCount,
            amount: targetBooking.amount,
            reason: reason,
            requestDate: nowTimestamp,
            status: 'Approved',
            adminRemarks: 'Cancelled administratively; slot capacity released back to general pool.',
            processedBy: 'Admin User',
            processedDate: nowTimestamp,
          },
          ...prev,
        ];
      });
    }

    showToast(`Booking ${bookingId} cancelled; slot capacity released.`);
  };

  const completeBooking = (bookingId) => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'Completed',
          history: [
            ...(b.history || []),
            { timestamp: nowTimestamp, action: 'Marked Completed after Darshan', user: 'Admin User' },
          ],
        };
      })
    );
    showToast(`Booking ${bookingId} marked completed.`);
  };

  // Actions: Cancellations Management
  const requestCancellation = (bookingId, reason = 'Devotee requested cancellation') => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let targetBooking = null;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        targetBooking = b;
        return {
          ...b,
          status: 'Cancellation Requested',
          notes: `${b.notes ? b.notes + ' • ' : ''}Cancellation requested: ${reason}`,
          history: [
            ...(b.history || []),
            {
              timestamp: nowTimestamp,
              action: `Cancellation Requested: ${reason}`,
              user: 'Devotee Portal',
            },
          ],
        };
      })
    );

    if (targetBooking) {
      const newCanId = `CAN-${Math.floor(885 + Math.random() * 115)}`;
      setCancellations((prev) => [
        {
          id: newCanId,
          bookingId: targetBooking.id,
          devoteeName: targetBooking.devoteeName,
          mobile: targetBooking.mobile,
          serviceName: targetBooking.serviceName,
          visitDate: targetBooking.visitDate,
          slotLabel: targetBooking.slotLabel,
          devoteesCount: targetBooking.devoteesCount,
          amount: targetBooking.amount,
          reason,
          requestDate: nowTimestamp,
          status: 'Requested',
          adminRemarks: '',
          processedBy: null,
          processedDate: null,
        },
        ...prev,
      ]);
      showToast(`Cancellation request submitted for ${targetBooking.id}. Awaiting temple authority decision.`);
    }
  };

  const approveCancellation = (cancellationId, remarks = '') => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const targetCan = cancellations.find((c) => c.id === cancellationId);

    if (targetCan) {
      // Mark linked booking as Cancelled (this releases slot capacity in getSlotOccupancy!)
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== targetCan.bookingId) return b;
          return {
            ...b,
            status: 'Cancelled',
            paymentStatus: b.paymentStatus === 'Paid' ? 'Refund Processed' : b.paymentStatus,
            notes: `${b.notes ? b.notes + ' • ' : ''}Cancellation Approved: ${remarks || 'Approved by authority'}`,
            history: [
              ...(b.history || []),
              {
                timestamp: nowTimestamp,
                action: `Cancellation Approved by Temple Authority${remarks ? `: ${remarks}` : ''}. Slot quota released.`,
                user: 'Temple Authority',
              },
            ],
          };
        })
      );

      setCancellations((prev) =>
        prev.map((c) =>
          c.id === cancellationId
            ? {
                ...c,
                status: 'Approved',
                adminRemarks: remarks || 'Approved by Temple Authority; slot quota returned to general pool.',
                processedBy: 'Temple Authority',
                processedDate: nowTimestamp,
              }
            : c
        )
      );
      showToast(`Cancellation ${cancellationId} approved. Quota released back to pool.`);
    }
  };

  const rejectCancellation = (cancellationId, remarks = 'Non-compliant cancellation window') => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const targetCan = cancellations.find((c) => c.id === cancellationId);

    if (targetCan) {
      // Retain the booking as Confirmed
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== targetCan.bookingId) return b;
          return {
            ...b,
            status: 'Confirmed',
            notes: `${b.notes ? b.notes + ' • ' : ''}Cancellation Rejected: ${remarks}`,
            history: [
              ...(b.history || []),
              {
                timestamp: nowTimestamp,
                action: `Cancellation Request Rejected: ${remarks}. Booking remains Confirmed.`,
                user: 'Temple Authority',
              },
            ],
          };
        })
      );

      setCancellations((prev) =>
        prev.map((c) =>
          c.id === cancellationId
            ? {
                ...c,
                status: 'Rejected',
                adminRemarks: remarks,
                processedBy: 'Temple Authority',
                processedDate: nowTimestamp,
              }
            : c
        )
      );
      showToast(`Cancellation ${cancellationId} request rejected. Booking remains Confirmed.`, 'info');
    }
  };

  // Actions: Darshan Services
  const addService = (newServiceData) => {
    const now = '31 Oct 2026';
    const id = `srv-${Date.now().toString().slice(-6)}`;
    const fullService = {
      ...newServiceData,
      id,
      amount: newServiceData.amount ?? newServiceData.fee ?? 0,
      fee: newServiceData.fee ?? newServiceData.amount ?? 0,
      lastUpdated: now,
    };
    setServices((prev) => [...prev, fullService]);
    showToast(`Service "${fullService.name}" created.`);
    return fullService;
  };

  const updateService = (serviceId, updatedFields) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, ...updatedFields, lastUpdated: '31 Oct 2026' } : s))
    );
    showToast('Service category configuration updated.');
  };

  const toggleServiceActive = (serviceId) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;
        const newStatus = s.status === 'active' ? 'inactive' : 'active';
        showToast(`Service "${s.name}" is now ${newStatus}.`);
        return { ...s, status: newStatus, lastUpdated: '31 Oct 2026' };
      })
    );
  };

  // Actions: Slots & Capacity
  const addSlot = (newSlotData) => {
    const id = `slot-${Date.now().toString().slice(-4)}`;
    const fullSlot = {
      ...newSlotData,
      id,
      status: 'active',
    };
    setSlots((prev) => [...prev, fullSlot]);
    showToast(`Time slot "${fullSlot.label}" added.`);
    return fullSlot;
  };

  const updateSlot = (slotId, updatedFields) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, ...updatedFields } : s))
    );
    showToast('Slot configuration updated.');
  };

  const toggleSlotActive = (slotId) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s;
        const newStatus = s.status === 'active' ? 'disabled' : 'active';
        showToast(`Slot "${s.label}" is now ${newStatus}.`);
        return { ...s, status: newStatus };
      })
    );
  };

  return (
    <DarshanBookingContext.Provider
      value={{
        bookings,
        services,
        slots,
        cancellations,
        selectedDate,
        setSelectedDate,
        metrics,
        getSlotOccupancy,
        createBooking,
        updateBooking,
        confirmBooking,
        rejectBooking,
        cancelBooking,
        completeBooking,
        requestCancellation,
        approveCancellation,
        rejectCancellation,
        addService,
        updateService,
        toggleServiceActive,
        addSlot,
        updateSlot,
        toggleSlotActive,
        drilldownFilter,
        setDrilldownFilter,
        resetDrilldownFilter,
        toast,
        showToast,
      }}
    >
      {children}

      {/* Global Module Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-5 sm:right-6 z-[9999] animate-in slide-in-from-top-3 fade-in duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 max-w-sm ${
              toast.type === 'error'
                ? 'bg-rose-900 text-rose-50 border-rose-700'
                : toast.type === 'info'
                ? 'bg-amber-900 text-amber-50 border-amber-700'
                : 'bg-[#55132D] text-white border-[#B68A36]/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#E2BC6B] animate-pulse flex-shrink-0" />
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        </div>
      )}
    </DarshanBookingContext.Provider>
  );
}

export function useDarshanBookings() {
  const context = useContext(DarshanBookingContext);
  if (!context) {
    throw new Error('useDarshanBookings must be used within a DarshanBookingProvider');
  }
  return context;
}

// Unified alias for the redesigned module
export const useBookingsServices = useDarshanBookings;


