import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MoreVertical,
  RotateCcw,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { useDarshanBookings } from '../../context/DarshanBookingContext';

export default function AllBookingsTab({
  onOpenDetails,
  onOpenCreate,
  onReviewCancellation,
  onCancel,
  onComplete,
}) {
  const { bookings, services } = useDarshanBookings();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedService('All');
    setSelectedStatus('All');
    setSelectedSource('All');
    setDateFilter('');
  };

  // Filtered List
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = b.id?.toLowerCase().includes(query);
        const matchesName = b.devoteeName?.toLowerCase().includes(query);
        const matchesMobile = b.mobile?.includes(query);
        if (!matchesId && !matchesName && !matchesMobile) return false;
      }

      // Service
      if (selectedService !== 'All' && b.serviceName !== selectedService && b.category !== selectedService) {
        return false;
      }

      // Status
      if (selectedStatus !== 'All' && b.status !== selectedStatus) {
        return false;
      }

      // Source
      if (selectedSource !== 'All' && b.source !== selectedSource) {
        return false;
      }

      // Date
      if (dateFilter && b.visitDate !== dateFilter) {
        return false;
      }

      return true;
    });
  }, [bookings, searchTerm, selectedService, selectedStatus, selectedSource, dateFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Booking ID',
      'Devotee Name',
      'Mobile',
      'Service',
      'Category',
      'Visit Date',
      'Slot',
      'Devotees',
      'Amount (INR)',
      'Payment Status',
      'Status',
      'Source',
      'Gate',
    ];

    const rows = filteredBookings.map((b) => [
      `"${b.id}"`,
      `"${b.devoteeName}"`,
      `"${b.mobile}"`,
      `"${b.serviceName}"`,
      `"${b.category}"`,
      `"${b.visitDate}"`,
      `"${b.slotLabel}"`,
      b.devoteesCount,
      b.amount,
      `"${b.paymentStatus}"`,
      `"${b.status}"`,
      `"${b.source}"`,
      `"${b.gate || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `darshan_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancellation Requested':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-stone-50 text-stone-600 border-stone-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Devotee Name, Ref ID (DRSN-...) or Mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
            />
          </div>

          {/* Action buttons: Export CSV + Create Booking */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5"
              title="Export visible bookings to CSV file"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onOpenCreate}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Booking</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2 border-t border-stone-100 text-xs">
          {/* Service Dropdown */}
          <div>
            <label className="block text-[11px] font-medium text-stone-500 mb-1">Service Tier</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#55132D]"
            >
              <option value="All">All Services</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-[11px] font-medium text-stone-500 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#55132D]"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancellation Requested">Cancellation Requested</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Source Dropdown */}
          <div>
            <label className="block text-[11px] font-medium text-stone-500 mb-1">Booking Source</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#55132D]"
            >
              <option value="All">All Sources</option>
              <option value="Online Portal">Online Portal</option>
              <option value="Counter Offline">Counter Offline</option>
              <option value="Administrative Quota">Administrative Quota</option>
              <option value="VIP Protocol">VIP Protocol</option>
            </select>
          </div>

          {/* Visit Date Filter */}
          <div>
            <label className="block text-[11px] font-medium text-stone-500 mb-1">Visit Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#55132D]"
            />
          </div>

          {/* Reset button */}
          <div className="flex items-end col-span-2 sm:col-span-4 lg:col-span-1">
            <button
              onClick={handleResetFilters}
              className="w-full px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Devotee Information</th>
                <th className="py-3 px-4">Darshan Service</th>
                <th className="py-3 px-4">Visit Date & Slot</th>
                <th className="py-3 px-3 text-center">Devotees</th>
                <th className="py-3 px-4">Amount & Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Gate</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-500">
                    <p className="font-semibold text-stone-700">No bookings match the selected criteria.</p>
                    <p className="text-xs text-stone-400 mt-1">Try clearing search keywords or filter dropdowns.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => onOpenDetails(b)}
                    className="hover:bg-amber-50/40 cursor-pointer transition-colors group"
                  >
                    {/* Ref ID */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#55132D] whitespace-nowrap">
                      {b.id}
                    </td>

                    {/* Devotee Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{b.devoteeName}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <span>{b.mobile}</span>
                        <span>•</span>
                        <span>{b.source}</span>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{b.serviceName}</div>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        {b.category}
                      </span>
                    </td>

                    {/* Date & Slot */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-stone-900">{b.visitDate}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{b.slotLabel}</div>
                    </td>

                    {/* Devotees Count */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-full text-[11px]">
                        {b.devoteesCount}
                      </span>
                    </td>

                    {/* Amount & Payment */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-stone-900">
                        {b.amount === 0 ? 'Free' : `₹${b.amount.toLocaleString('en-IN')}`}
                      </div>
                      <div
                        className={`text-[10px] font-medium mt-0.5 ${
                          b.paymentStatus === 'Paid'
                            ? 'text-emerald-700'
                            : b.paymentStatus === 'Unpaid'
                            ? 'text-amber-700'
                            : 'text-stone-500'
                        }`}
                      >
                        {b.paymentStatus}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* Gate */}
                    <td className="py-3.5 px-4 text-[11px] text-stone-600 whitespace-nowrap">
                      {b.gate || 'Gate 1'}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDetails(b)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-[#55132D] hover:bg-stone-100 transition-colors"
                          title="View Voucher Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Actions according to verified operational model */}
                        {b.status === 'Cancellation Requested' && (
                          <button
                            onClick={() => onReviewCancellation && onReviewCancellation(b)}
                            className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors border border-amber-300 flex items-center gap-1 shadow-2xs"
                            title="Review devotee cancellation request (Approve / Reject)"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Review Cancellation</span>
                          </button>
                        )}

                        {b.status === 'Confirmed' && (
                          <>
                            <button
                              onClick={() => onComplete(b.id)}
                              className="px-2 py-1 text-[11px] font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200"
                              title="Mark Darshan Completed"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => onCancel(b)}
                              className="px-2 py-1 text-[11px] font-semibold text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                              title="Administrative Cancellation"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Results Bar */}
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div>
            Showing <span className="font-bold text-stone-800">{filteredBookings.length}</span> of{' '}
            <span className="font-bold text-stone-800">{bookings.length}</span> recorded bookings
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-stone-400">All administrative operations logged in trust audit register</span>
          </div>
        </div>
      </div>
    </div>
  );
}

