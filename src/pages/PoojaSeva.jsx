import React, { useState, useMemo } from 'react';
import {
  Flame,
  Calendar,
  CalendarCheck,
  Layers,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  FileText,
  UserCheck,
  Printer,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDevoteeServices } from '../context/DevoteeServicesContext';
import ModulePageHeader from '../components/devotee-services/shared/ModulePageHeader';
import ModuleTabs from '../components/devotee-services/shared/ModuleTabs';
import ModuleMetricCard from '../components/devotee-services/shared/ModuleMetricCard';
import DevoteeProfileDrawer from '../components/devotee-services/shared/DevoteeProfileDrawer';
import ReceiptModal from '../components/devotee-services/shared/ReceiptModal';
import CreatePoojaBookingModal from '../components/devotee-services/pooja/CreatePoojaBookingModal';
import PoojaServiceModal from '../components/devotee-services/pooja/PoojaServiceModal';

export default function PoojaSeva({ isEmbedded = false }) {
  const {
    poojaServices,
    poojaBookings,
    togglePoojaService,
    updatePoojaBookingStatus,
    getDevoteeById,
  } = useDevoteeServices();

  const [activeTab, setActiveTab] = useState('catalogue'); // 'catalogue' | 'bookings'
  const [subView, setSubView] = useState('bookings'); // 'bookings' or 'catalogue'

  // Modals & Drawers
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  const [serviceModalConfig, setServiceModalConfig] = useState({ isOpen: false, editingService: null });
  const [selectedDevoteeForProfile, setSelectedDevoteeForProfile] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  // Filters for Bookings
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  const [bookingServiceFilter, setBookingServiceFilter] = useState('All');

  // Metrics
  const metrics = useMemo(() => {
    const total = poojaBookings.length;
    const pending = poojaBookings.filter((b) => b.bookingStatus === 'Pending').length;
    const confirmed = poojaBookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Scheduled').length;
    const completed = poojaBookings.filter((b) => b.bookingStatus === 'Completed').length;
    return { total, pending, confirmed, completed };
  }, [poojaBookings]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return poojaBookings.filter((b) => {
      if (bookingStatusFilter !== 'All' && b.bookingStatus !== bookingStatusFilter) return false;
      if (bookingServiceFilter !== 'All' && b.serviceName !== bookingServiceFilter) return false;
      if (bookingSearch.trim()) {
        const q = bookingSearch.toLowerCase();
        const matchesId = b.id?.toLowerCase().includes(q);
        const matchesName = b.devoteeName?.toLowerCase().includes(q);
        const matchesMobile = b.mobile?.includes(q);
        const matchesGotra = b.gotra?.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesMobile && !matchesGotra) return false;
      }
      return true;
    });
  }, [poojaBookings, bookingStatusFilter, bookingServiceFilter, bookingSearch]);

  // Trend data
  const trendData = [
    { time: '06:00 AM', count: 4 },
    { time: '08:00 AM', count: 12 },
    { time: '10:00 AM', count: 24 },
    { time: '12:00 PM', count: 18 },
    { time: '02:00 PM', count: 8 },
    { time: '04:00 PM', count: 16 },
    { time: '06:00 PM', count: 20 },
  ];

  // Strictly 3 primary navigation tabs as required by master prompt
  const tabsConfig = [
    { id: 'overview', label: 'Overview' },
    { id: 'bookings-catalogue', label: 'Bookings & Catalogue' },
    { id: 'schedule', label: 'Schedule & Priests' },
  ];

  const handlePrintReceipt = (booking) => {
    setReceiptData({
      receiptNumber: `REC-${booking.id}`,
      date: booking.createdDate,
      transactionRef: `TXN-${booking.id}-SEVA`,
      paymentMode: booking.paymentMode || 'Counter Payment',
      donorName: booking.devoteeName,
      devoteeId: booking.devoteeId,
      mobile: booking.mobile,
      category: booking.serviceName,
      amount: booking.amount,
      notes: `Family Gotra: ${booking.gotra} • Sankalpam: ${booking.sankalpamNames}`,
    });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header (Hidden when embedded) */}
      {!isEmbedded && (
        <ModulePageHeader
          title="Pooja & Seva Administration"
          primaryActionLabel="Book Pooja / Seva"
          onPrimaryAction={() => setIsCreateBookingOpen(true)}
          primaryActionIcon={Flame}
        />
      )}

      {/* KPI Cards Row (Proportional 4-card grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModuleMetricCard
          label="Total Seva Bookings"
          value={metrics.total}
          icon={Flame}
          color="burgundy"
        />
        <ModuleMetricCard
          label="Pending Verification"
          value={metrics.pending}
          icon={AlertTriangle}
          color="amber"
        />
        <ModuleMetricCard
          label="Confirmed & Scheduled"
          value={metrics.confirmed}
          icon={CheckCircle2}
          color="emerald"
        />
        <ModuleMetricCard
          label="Active Duty Priests"
          value="6 Priests"
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Two-Option Navigation Bar: (1) Other Services Grid & Introduce Seva (2) Booked Slots Details */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-2 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('catalogue')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'catalogue'
                ? 'bg-white text-[#55132D] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Other Services Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-white text-[#55132D] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#55132D]" />
            <span>Booked Slots Details</span>
          </button>
        </div>

        {/* Action Button */}
        <div>
          {activeTab === 'catalogue' ? (
            <button
              type="button"
              onClick={() => setServiceModalConfig({ isOpen: true, editingService: null })}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Introduce New Seva</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreateBookingOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Book Seva Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: OTHER SERVICES GRID (Admin can introduce new seva) */}
      {activeTab === 'catalogue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {poojaServices.map((service) => {
            const isActive = service.status === 'active';
            return (
              <div
                key={service.id}
                className={`bg-white rounded-xl border p-5 shadow-subtle flex flex-col justify-between transition-all ${
                  isActive ? 'border-stone-200/90 hover:border-[#B68A36]/50' : 'border-stone-200 bg-stone-50/60 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#55132D]/10 text-[#55132D] border border-[#55132D]/20">
                      {service.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePoojaService(service.id)}
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1 cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-stone-100 text-stone-600 border-stone-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                      <span>{isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 mb-1 font-serif">{service.name}</h4>
                  <p className="text-xs text-stone-500 leading-relaxed mb-4 min-h-[38px]">{service.description}</p>

                  <div className="space-y-1.5 py-2.5 border-y border-stone-100 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Configured Dakshina:</span>
                      <span className="font-bold text-[#55132D]">₹{service.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Estimated Duration:</span>
                      <span className="font-medium text-stone-800">{service.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Max Family Members:</span>
                      <span className="font-medium text-stone-800">{service.maxParticipants || 4} persons</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-mono text-[11px]">{service.id}</span>
                  <button
                    type="button"
                    onClick={() => setServiceModalConfig({ isOpen: true, editingService: service })}
                    className="px-2.5 py-1 text-xs font-semibold text-[#55132D] hover:bg-[#55132D]/10 rounded-md transition-colors cursor-pointer"
                  >
                    Configure Service
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: BOOKED SLOTS DETAILS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {/* Filter Controls Bar */}
          <div className="bg-white rounded-xl p-3.5 border border-stone-200/90 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by devotee, ID, gotra, mobile..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                />
              </div>

              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending Verification</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={bookingServiceFilter}
                onChange={(e) => setBookingServiceFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
              >
                <option value="All">All Pooja Types</option>
                {poojaServices.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="bg-white rounded-xl border border-stone-200/90 shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Booking & Ritual</th>
                    <th className="py-3 px-4">Devotee</th>
                    <th className="py-3 px-4">Gotra & Sankalpam</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-400">
                        No bookings found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-stone-900">{b.serviceName}</div>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            Ref: {b.id} • {b.preferredDate} at {b.preferredTime}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => {
                              const d = getDevoteeById(b.devoteeId) || { name: b.devoteeName, mobile: b.mobile };
                              setSelectedDevoteeForProfile(d);
                            }}
                            className="font-medium text-stone-900 hover:text-[#55132D] hover:underline block text-left cursor-pointer"
                          >
                            {b.devoteeName}
                          </button>
                          <span className="text-[11px] text-stone-500">{b.mobile}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-stone-800 block">Gotra: {b.gotra || 'N/A'}</span>
                          <span className="text-[11px] text-stone-500 truncate max-w-xs block" title={b.sankalpamNames}>
                            {b.sankalpamNames}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                          ₹{b.amount.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                              b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Scheduled'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : b.bookingStatus === 'Completed'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : b.bookingStatus === 'Pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            {b.bookingStatus}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handlePrintReceipt(b)}
                              className="p-1.5 text-stone-500 hover:text-[#55132D] hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                              title="Print Voucher Receipt"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {b.bookingStatus === 'Pending' && (
                              <button
                                type="button"
                                onClick={() => updatePoojaBookingStatus(b.id, 'Confirmed', 'Verified at desk')}
                                className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}

                            {b.bookingStatus === 'Scheduled' && (
                              <button
                                type="button"
                                onClick={() => updatePoojaBookingStatus(b.id, 'Completed', 'Ritual concluded')}
                                className="px-2 py-1 text-[11px] font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Profile Drawer */}
      <CreatePoojaBookingModal
        isOpen={isCreateBookingOpen}
        onClose={() => setIsCreateBookingOpen(false)}
      />

      <PoojaServiceModal
        isOpen={serviceModalConfig.isOpen}
        onClose={() => setServiceModalConfig({ isOpen: false, editingService: null })}
        editingService={serviceModalConfig.editingService}
      />

      <DevoteeProfileDrawer
        devotee={selectedDevoteeForProfile}
        onClose={() => setSelectedDevoteeForProfile(null)}
      />

      <ReceiptModal
        isOpen={!!receiptData}
        onClose={() => setReceiptData(null)}
        receiptData={receiptData}
      />
    </div>
  );
}
