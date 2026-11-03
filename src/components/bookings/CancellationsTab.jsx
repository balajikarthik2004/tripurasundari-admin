import React, { useState, useMemo } from 'react';
import {
  Ban,
  CheckCircle2,
  XCircle,
  Search,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useDarshanBookings } from '../../context/DarshanBookingContext';

export default function CancellationsTab({ onApprove, onReject, onOpenBookingDetails }) {
  const { cancellations, bookings } = useDarshanBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Metrics
  const metrics = useMemo(() => {
    const requested = cancellations.filter((c) => c.status === 'Requested').length;
    const approved = cancellations.filter((c) => c.status === 'Approved').length;
    const rejected = cancellations.filter((c) => c.status === 'Rejected').length;
    const releasedDevotees = cancellations
      .filter((c) => c.status === 'Approved')
      .reduce((sum, c) => sum + (c.devoteesCount || 1), 0);

    return { requested, approved, rejected, releasedDevotees };
  }, [cancellations]);

  // Filtered list
  const filteredCancellations = useMemo(() => {
    return cancellations.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesId = c.id?.toLowerCase().includes(q);
        const matchesBooking = c.bookingId?.toLowerCase().includes(q);
        const matchesName = c.devoteeName?.toLowerCase().includes(q);
        const matchesMobile = c.mobile?.includes(q);
        if (!matchesId && !matchesBooking && !matchesName && !matchesMobile) return false;
      }
      return true;
    });
  }, [cancellations, statusFilter, searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Requested':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Approved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  const handleRowClick = (can) => {
    const matched = bookings.find((b) => b.id === can.bookingId);
    if (matched) {
      onOpenBookingDetails(matched);
    }
  };

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Pending Requests</div>
            <div className="text-2xl font-bold font-number text-amber-900 mt-1">{metrics.requested}</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Awaiting trust review</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Approved Cancellations</div>
            <div className="text-2xl font-bold font-number text-emerald-900 mt-1">{metrics.approved}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Processed & recorded</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Rejected Requests</div>
            <div className="text-2xl font-bold font-number text-stone-900 mt-1">{metrics.rejected}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Non-compliant window</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Slot Quota Released</div>
            <div className="text-2xl font-bold font-number text-stone-900 mt-1">
              {metrics.releasedDevotees}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Spots made available again</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Devotee Name, Booking ID, or Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#55132D]/20 focus:border-[#55132D]"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
            {['All', 'Requested', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-white text-[#55132D] shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {(searchTerm || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
              }}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Cancellations Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Devotee & Contact</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Visit Date & Slot</th>
                <th className="py-3 px-3 text-center">Devotees</th>
                <th className="py-3 px-4">Refund Amount</th>
                <th className="py-3 px-4">Cancellation Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredCancellations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
                    <p className="font-semibold text-stone-700">No cancellation requests found.</p>
                    <p className="text-xs text-stone-400 mt-1">All requests have been addressed.</p>
                  </td>
                </tr>
              ) : (
                filteredCancellations.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleRowClick(c)}
                    className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                  >
                    {/* ID & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-stone-900">{c.id}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{c.requestDate}</div>
                    </td>

                    {/* Devotee */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{c.devoteeName}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{c.mobile}</div>
                    </td>

                    {/* Booking ID */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#55132D] whitespace-nowrap">
                      {c.bookingId}
                    </td>

                    {/* Visit Date & Slot */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-stone-900">{c.visitDate}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{c.slotLabel}</div>
                    </td>

                    {/* Devotees */}
                    <td className="py-3.5 px-3 text-center font-bold text-stone-800">
                      {c.devoteesCount}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-stone-900 whitespace-nowrap">
                      {c.amount === 0 ? 'Free' : `₹${c.amount.toLocaleString('en-IN')}`}
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="truncate text-stone-600" title={c.reason}>
                        {c.reason}
                      </p>
                      {c.adminRemarks && (
                        <p className="text-[10px] text-stone-400 truncate mt-0.5">
                          Note: {c.adminRemarks}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getStatusBadge(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {c.status === 'Requested' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onApprove(c)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-200 flex items-center gap-1"
                            title="Approve Cancellation & Release Capacity"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => onReject(c)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors border border-rose-200 flex items-center gap-1"
                            title="Reject Cancellation"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">
                          Processed by {c.processedBy || 'Admin'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div>
            Showing <span className="font-bold text-stone-800">{filteredCancellations.length}</span> of{' '}
            <span className="font-bold text-stone-800">{cancellations.length}</span> total cancellation requests
          </div>
          <div className="text-[11px] text-stone-400">
            Approved cancellations immediately replenish the corresponding slot quota
          </div>
        </div>
      </div>
    </div>
  );
}

