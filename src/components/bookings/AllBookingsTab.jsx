import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  User,
  Clock,
  IndianRupee,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { useDarshanBookings } from '../../context/DarshanBookingContext';
import { SERVICE_CATEGORIES, STANDARD_TIME_SLOTS } from '../../data/unifiedBookingsData';

export default function AllBookingsTab({
  onOpenDetails,
  onOpenCreate,
  onConfirmBooking,
  onCancelBooking,
  onCompleteBooking,
}) {
  const {
    bookings,
    services,
    drilldownFilter,
    resetDrilldownFilter,
    confirmBooking,
    cancelBooking,
    completeBooking,
    rejectBooking,
  } = useDarshanBookings();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('All');
  const [dateFilter, setDateFilter] = useState('All'); // 'All' | 'Today' | '7 Days' | '30 Days' | custom string

  // Sorting State
  const [sortField, setSortField] = useState('visitDate');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sync with drilldownFilter from Overview (Sankey / Demand Matrix)
  useEffect(() => {
    if (drilldownFilter) {
      if (drilldownFilter.category && drilldownFilter.category !== 'All') {
        setSelectedCategory(drilldownFilter.category);
      }
      if (drilldownFilter.service && drilldownFilter.service !== 'All') {
        setSelectedService(drilldownFilter.service);
      }
      if (drilldownFilter.status && drilldownFilter.status !== 'All') {
        setSelectedStatus(drilldownFilter.status);
      }
      if (drilldownFilter.timeSlot && drilldownFilter.timeSlot !== 'All') {
        setSelectedTimeSlot(drilldownFilter.timeSlot);
      }
      if (drilldownFilter.datePeriod) {
        setDateFilter(drilldownFilter.datePeriod);
      }
      setCurrentPage(1);
    }
  }, [drilldownFilter]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedService('All');
    setSelectedStatus('All');
    setSelectedPayment('All');
    setSelectedTimeSlot('All');
    setDateFilter('All');
    if (resetDrilldownFilter) {
      resetDrilldownFilter();
    }
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedService !== 'All' ||
    selectedStatus !== 'All' ||
    selectedPayment !== 'All' ||
    selectedTimeSlot !== 'All' ||
    dateFilter !== 'All';

  // Filtered List
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Search Query (ID, Devotee Name, Mobile)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = b.id?.toLowerCase().includes(query) || b.refId?.toLowerCase().includes(query);
        const matchesName = b.devoteeName?.toLowerCase().includes(query);
        const matchesMobile = b.mobile?.includes(query);
        if (!matchesId && !matchesName && !matchesMobile) return false;
      }

      // 2. Category
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Pooja & Seva') {
          if (!['Archana', 'Abhishekam', 'Havan', 'Special Ritual'].includes(b.category)) return false;
        } else if (selectedCategory === 'Other Services') {
          if (!['Other Sevas', 'General'].includes(b.category)) return false;
        } else if (b.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Individual Service
      if (selectedService !== 'All') {
        if (b.serviceName !== selectedService && b.serviceId !== selectedService) {
          return false;
        }
      }

      // 4. Booking Status
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Confirmed') {
          if (b.status !== 'Confirmed' && b.status !== 'Active') return false;
        } else if (selectedStatus === 'Cancelled') {
          if (b.status !== 'Cancelled' && b.status !== 'Rejected' && b.status !== 'Cancellation Requested') {
            return false;
          }
        } else if (b.status !== selectedStatus) {
          return false;
        }
      }

      // 5. Payment Status
      if (selectedPayment !== 'All' && b.paymentStatus !== selectedPayment) {
        return false;
      }

      // 6. Time Slot
      if (selectedTimeSlot !== 'All') {
        const match =
          b.timeSlot === selectedTimeSlot ||
          (selectedTimeSlot.includes('05:00') && b.timeSlot?.includes('05:00')) ||
          (selectedTimeSlot.includes('07:00') && (b.timeSlot?.includes('07:00') || b.timeSlot?.includes('09:30'))) ||
          (selectedTimeSlot.includes('10:00') && (b.timeSlot?.includes('10:00') || b.timeSlot?.includes('12:00'))) ||
          (selectedTimeSlot.includes('01:00') && (b.timeSlot?.includes('01:00') || b.timeSlot?.includes('13:00') || b.timeSlot?.includes('03:30'))) ||
          (selectedTimeSlot.includes('04:00') && (b.timeSlot?.includes('04:00') || b.timeSlot?.includes('16:00'))) ||
          (selectedTimeSlot.includes('06:00') && (b.timeSlot?.includes('06:00') || b.timeSlot?.includes('18:00')));
        if (!match) return false;
      }

      // 7. Date Filter
      if (dateFilter !== 'All') {
        if (dateFilter === 'Today') {
          if (b.visitDate !== '2026-10-31') return false;
        } else if (dateFilter === '7 Days') {
          if (b.visitDate < '2026-10-25' || b.visitDate > '2026-10-31') return false;
        } else if (dateFilter === '30 Days') {
          if (b.visitDate < '2026-10-02' || b.visitDate > '2026-10-31') return false;
        } else if (b.visitDate !== dateFilter) {
          return false;
        }
      }

      return true;
    });
  }, [
    bookings,
    searchTerm,
    selectedCategory,
    selectedService,
    selectedStatus,
    selectedPayment,
    selectedTimeSlot,
    dateFilter,
  ]);

  // Sorted List
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredBookings, sortField, sortOrder]);

  // Paginated Slices
  const totalRecords = sortedBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedBookings.slice(start, start + pageSize);
  }, [sortedBookings, currentPage, pageSize]);

  // Sorting Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Booking ID',
      'Devotee Name',
      'Mobile Number',
      'Service Name',
      'Category',
      'Booking Date',
      'Visit Date',
      'Time Slot',
      'Devotees Count',
      'Amount (INR)',
      'Payment Status',
      'Booking Status',
    ];

    const rows = sortedBookings.map((b) => [
      `"${b.id || b.refId}"`,
      `"${b.devoteeName}"`,
      `"${b.mobile}"`,
      `"${b.serviceName}"`,
      `"${b.category}"`,
      `"${b.bookingDate || b.createdDate?.substring(0, 10)}"`,
      `"${b.visitDate}"`,
      `"${b.timeSlot || b.slotLabel}"`,
      b.devoteesCount || 1,
      b.amount || 0,
      `"${b.paymentStatus}"`,
      `"${b.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Tripura_Sundari_Bookings_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Confirmed':
      case 'Active':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Cancellation Requested':
        return 'bg-orange-50 text-orange-800 border-orange-200 animate-pulse';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  // Payment Badge Helper
  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Paid':
        return 'text-emerald-700 font-semibold';
      case 'Pending':
        return 'text-amber-700 font-semibold';
      case 'Refunded':
        return 'text-purple-700 font-semibold';
      default:
        return 'text-stone-500 font-medium';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Workspace Filter Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-150">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#55132D]" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                Devotee Booking Registry
              </h2>
              <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                {totalRecords} Matching Records
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Centralized administrative table for search, verification, check-in clearance, and status actions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Export CSV</span>
            </button>

            {onOpenCreate && (
              <button
                type="button"
                onClick={onOpenCreate}
                className="px-3.5 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
                <span>New Booking</span>
              </button>
            )}
          </div>
        </div>

        {/* Universal Search & Multi-Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* 1. Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search ID, devotee name, or mobile..."
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#55132D]"
            />
          </div>

          {/* 2. Service Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 font-medium focus:outline-none focus:border-[#55132D] cursor-pointer"
            >
              <option value="All">All Categories</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Booking Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 font-medium focus:outline-none focus:border-[#55132D] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed / Active</option>
              <option value="Pending">Pending Clearance</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled / Rejected</option>
            </select>
          </div>

          {/* 4. Payment Status */}
          <div>
            <select
              value={selectedPayment}
              onChange={(e) => {
                setSelectedPayment(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 font-medium focus:outline-none focus:border-[#55132D] cursor-pointer"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Free">Free / Exempt</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* 5. Date Range */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 font-medium focus:outline-none focus:border-[#55132D] cursor-pointer"
            >
              <option value="All">All Visit Dates</option>
              <option value="Today">Today (31 Oct)</option>
              <option value="7 Days">Past 7 Days</option>
              <option value="30 Days">Past 30 Days</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-stone-150 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-stone-600">
              <span className="font-semibold text-stone-700">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="bg-[#55132D]/10 text-[#55132D] font-bold px-2 py-0.5 rounded-full text-[11px]">
                  {selectedCategory}
                </span>
              )}
              {selectedStatus !== 'All' && (
                <span className="bg-sky-50 text-sky-800 border border-sky-200 font-bold px-2 py-0.5 rounded-full text-[11px]">
                  {selectedStatus}
                </span>
              )}
              {selectedPayment !== 'All' && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full text-[11px]">
                  Payment: {selectedPayment}
                </span>
              )}
              {dateFilter !== 'All' && (
                <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded-full text-[11px]">
                  Date: {dateFilter}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#55132D] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================
          BOOKINGS DATA TABLE (Strictly 11 Columns)
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                {/* 1. Booking ID */}
                <th
                  onClick={() => handleSort('id')}
                  className="p-3 text-left cursor-pointer hover:bg-stone-100/70 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Booking ID</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>

                {/* 2. Devotee Name */}
                <th
                  onClick={() => handleSort('devoteeName')}
                  className="p-3 text-left cursor-pointer hover:bg-stone-100/70 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Devotee Name</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>

                {/* 3. Mobile Number */}
                <th className="p-3 text-left">Mobile Number</th>

                {/* 4. Service Name */}
                <th
                  onClick={() => handleSort('serviceName')}
                  className="p-3 text-left cursor-pointer hover:bg-stone-100/70 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Service Offering</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>

                {/* 5. Booking Date */}
                <th className="p-3 text-left">Booking Date</th>

                {/* 6. Visit Date */}
                <th
                  onClick={() => handleSort('visitDate')}
                  className="p-3 text-left cursor-pointer hover:bg-stone-100/70 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Visit Date</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>

                {/* 7. Time Slot */}
                <th className="p-3 text-left">Time Slot</th>

                {/* 8. Number of Devotees */}
                <th className="p-3 text-center">Devotees</th>

                {/* 9. Payment Status */}
                <th className="p-3 text-left">Payment</th>

                {/* 10. Booking Status */}
                <th className="p-3 text-left">Status</th>

                {/* 11. Actions */}
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150">
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((b) => {
                  const statusStyle = getStatusBadge(b.status);
                  const paymentStyle = getPaymentBadge(b.paymentStatus);
                  const isPending = b.status === 'Pending';
                  const isConfirmed = b.status === 'Confirmed' || b.status === 'Active';

                  return (
                    <tr
                      key={b.id || b.refId}
                      className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                      onClick={() => onOpenDetails && onOpenDetails(b)}
                    >
                      {/* 1. Booking ID */}
                      <td className="p-3 font-mono font-bold text-stone-900 whitespace-nowrap">
                        <span className="text-[#55132D] group-hover:underline">
                          {b.id || b.refId}
                        </span>
                      </td>

                      {/* 2. Devotee Name */}
                      <td className="p-3 font-semibold text-stone-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{b.devoteeName}</span>
                        </div>
                        {b.gotra && (
                          <span className="text-[10px] text-stone-400 block font-normal ml-5">
                            Gotra: {b.gotra}
                          </span>
                        )}
                      </td>

                      {/* 3. Mobile Number */}
                      <td className="p-3 font-mono text-stone-700 whitespace-nowrap">
                        {b.mobile}
                      </td>

                      {/* 4. Service Name */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-stone-900 font-serif">{b.serviceName}</div>
                        <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded">
                          {b.category}
                        </span>
                      </td>

                      {/* 5. Booking Date */}
                      <td className="p-3 text-stone-600 whitespace-nowrap">
                        {b.bookingDate || b.createdDate?.substring(0, 10) || '2026-10-30'}
                      </td>

                      {/* 6. Visit Date */}
                      <td className="p-3 font-semibold text-stone-800 whitespace-nowrap">
                        {b.visitDate}
                      </td>

                      {/* 7. Time Slot */}
                      <td className="p-3 text-stone-700 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#B68A36] shrink-0" />
                          <span>{b.timeSlot || b.slotLabel || '07:00 AM – 10:00 AM'}</span>
                        </div>
                      </td>

                      {/* 8. Number of Devotees */}
                      <td className="p-3 text-center font-bold text-stone-800 whitespace-nowrap">
                        {b.devoteesCount || 1}
                      </td>

                      {/* 9. Payment Status */}
                      <td className="p-3 whitespace-nowrap">
                        <div className={paymentStyle}>{b.paymentStatus || 'Paid'}</div>
                        <span className="text-[10px] text-stone-400 block">
                          {b.amount > 0 ? `₹${b.amount}` : 'Complimentary'}
                        </span>
                      </td>

                      {/* 10. Booking Status */}
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${statusStyle}`}>
                          {b.status}
                        </span>
                      </td>

                      {/* 11. Actions */}
                      <td
                        className="p-3 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => confirmBooking && confirmBooking(b.id)}
                                className="p-1 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                                title="Confirm Booking"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => rejectBooking && rejectBooking(b.id, 'Administrative capacity restriction')}
                                className="p-1 hover:bg-rose-50 text-rose-700 rounded-lg transition-colors cursor-pointer"
                                title="Reject Booking"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {isConfirmed && (
                            <button
                              type="button"
                              onClick={() => completeBooking && completeBooking(b.id)}
                              className="p-1 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                              title="Mark Devotee Admitted / Completed"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenDetails && onOpenDetails(b)}
                            className="px-2 py-1 text-xs font-semibold text-stone-600 hover:text-[#55132D] hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-stone-500">
                    <p className="font-medium text-stone-700 text-sm">No devotee bookings match the selected filters.</p>
                    <p className="text-xs text-stone-400 mt-1">Try clearing filters or adjusting your date range.</p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-3 px-3 py-1.5 bg-[#55132D] text-white text-xs font-semibold rounded-xl hover:bg-[#681B37] cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600">
          <div>
            Showing <strong className="text-stone-900">{totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong className="text-stone-900">{Math.min(currentPage * pageSize, totalRecords)}</strong> of{' '}
            <strong className="text-stone-900">{totalRecords}</strong> records
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 font-semibold text-stone-800">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
