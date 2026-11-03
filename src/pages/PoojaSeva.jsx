import React, { useState, useMemo } from 'react';
import {
  Flame,
  Calendar,
  Layers,
  HeartHandshake,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  FileText,
  UserCheck,
  CalendarCheck,
  Printer,
  ChevronRight,
  TrendingUp,
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
import AnnadanamModal from '../components/devotee-services/pooja/AnnadanamModal';

export default function PoojaSeva() {
  const {
    poojaServices,
    poojaBookings,
    annadanamRecords,
    devotees,
    togglePoojaService,
    updatePoojaBookingStatus,
    updateAnnadanamStatus,
    getDevoteeById,
  } = useDevoteeServices();

  const [activeTab, setActiveTab] = useState('overview');

  // Modals & Drawers
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  const [serviceModalConfig, setServiceModalConfig] = useState({ isOpen: false, editingService: null });
  const [isAnnadanamOpen, setIsAnnadanamOpen] = useState(false);
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
    const totalBeneficiaries = annadanamRecords.reduce((sum, a) => sum + (a.beneficiaryCount || 0), 0);
    return { total, pending, confirmed, completed, totalBeneficiaries };
  }, [poojaBookings, annadanamRecords]);

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

  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: Flame },
    { id: 'catalogue', label: 'Pooja & Seva Catalogue', icon: Layers, badge: poojaServices.length },
    {
      id: 'bookings',
      label: 'Bookings Management',
      icon: Calendar,
      badge: poojaBookings.length,
      dot: metrics.pending > 0,
      dotColor: 'bg-amber-400',
    },
    { id: 'annadanam', label: 'Annadanam Seva', icon: HeartHandshake, badge: annadanamRecords.length },
    { id: 'schedule', label: 'Schedule & Priests', icon: Clock },
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
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <ModulePageHeader
        title="Pooja, Seva & Annadanam Administration"
        subtitle="Manage sacred archana, havan sankalpam, scheduled priest assignments and daily pilgrim Annadanam meals"
        primaryActionLabel="Book Pooja / Seva"
        onPrimaryAction={() => setIsCreateBookingOpen(true)}
        primaryActionIcon={Flame}
      />

      {/* Tabs */}
      <ModuleTabs tabs={tabsConfig} activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* 5 Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <ModuleMetricCard
              label="Total Pooja Bookings"
              value={metrics.total}
              trend="+14% this week"
              icon={Flame}
              iconBg="bg-[#55132D]/10 text-[#55132D]"
            />
            <ModuleMetricCard
              label="Confirmed & Scheduled"
              value={metrics.confirmed}
              subtitle="Priests & altars allotted"
              icon={CheckCircle2}
              iconBg="bg-emerald-50 text-emerald-700"
            />
            <ModuleMetricCard
              label="Pending Verifications"
              value={metrics.pending}
              subtitle="Sankalpam verification"
              icon={AlertTriangle}
              iconBg="bg-amber-50 text-amber-700"
              onClick={() => setActiveTab('bookings')}
            />
            <ModuleMetricCard
              label="Today Completed"
              value={metrics.completed}
              subtitle="Sanctified prasadam handed"
              icon={CalendarCheck}
              iconBg="bg-blue-50 text-blue-700"
            />
            <ModuleMetricCard
              label="Annadanam Served"
              value={metrics.totalBeneficiaries.toLocaleString('en-IN')}
              subtitle="Pilgrims fed today"
              icon={HeartHandshake}
              iconBg="bg-rose-50 text-rose-700"
              onClick={() => setActiveTab('annadanam')}
            />
          </div>

          {/* Row 2: Charts & Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Daily Ritual Execution & Purohit Seva Matrix (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-200/70">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    Daily Ritual Execution &amp; Purohit Fulfillment
                  </h3>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>92% Executed</span>
                </span>
              </div>

              {/* Ritual Fulfillment Bars */}
              <div className="space-y-3 my-1">
                {[
                  { name: 'Special Chandi Path (Chhoto-Ma Altar)', completed: 22, total: 25, color: 'bg-[#55132D]', time: 'Main Mandap' },
                  { name: 'Maha Shodashopachara Puja & Abhishek', completed: 18, total: 20, color: 'bg-amber-600', time: 'Inner Sanctum' },
                  { name: 'Navagraha & Shanti Mahayagya Havan', completed: 12, total: 12, color: 'bg-emerald-600', time: 'Yagya Shala' },
                  { name: 'Nitya Archana & Pushpanjali Sankalpam', completed: 184, total: 200, color: 'bg-[#681B37]', time: 'Forecourt' },
                  { name: 'Kalyansagar Deep Daan & Aarti Seva', completed: 96, total: 120, color: 'bg-teal-600', time: 'Lake Ghat' },
                ].map((ritual, idx) => {
                  const pct = Math.round((ritual.completed / ritual.total) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-stone-800">{ritual.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-stone-400">{ritual.time}</span>
                          <span className="font-bold text-stone-900 font-mono">
                            {ritual.completed} / {ritual.total} <span className="text-stone-500 font-normal">({pct}%)</span>
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${ritual.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Annabhog Dining Pulse Sub-banner */}
              <div className="mt-3 pt-2.5 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>
                    <strong>Annabhog Distribution:</strong> 4,850 Khichuri &amp; Labra meals served today
                  </span>
                </div>
                <span className="font-bold text-[#55132D] text-[11px]">Batch 3 Continuous Seva</span>
              </div>
            </div>

            {/* Popular Services Breakdown */}
            <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif mb-3">
                  Popular Ritual Categories
                </h3>

                <div className="space-y-3">
                  {poojaServices.slice(0, 4).map((s) => (
                    <div key={s.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs">
                      <div className="flex justify-between font-bold text-stone-900 mb-0.5">
                        <span className="truncate pr-2">{s.name}</span>
                        <span className="text-[#55132D]">₹{s.amount}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-500">
                        <span>{s.category}</span>
                        <span>{s.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('catalogue')}
                className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-[#55132D] hover:underline flex items-center justify-between"
              >
                <span>View Full Catalogue ({poojaServices.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POOJA & SEVA CATALOGUE */}
      {activeTab === 'catalogue' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                Configurable Pooja & Seva Catalogue
              </h3>
              <p className="text-xs text-stone-500">
                Define sacred ceremonies, suggested dakshina rates, duration, and participant limits
              </p>
            </div>
            <button
              onClick={() => setServiceModalConfig({ isOpen: true, editingService: null })}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {poojaServices.map((service) => {
              const isActive = service.status === 'active';
              return (
                <div
                  key={service.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                    isActive ? 'border-stone-200/90 hover:border-[#B68A36]/50' : 'border-stone-200 bg-stone-50/60 opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#55132D]/10 text-[#55132D] border border-[#55132D]/20">
                        {service.category}
                      </span>
                      <button
                        onClick={() => togglePoojaService(service.id)}
                        className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-stone-100 text-stone-600 border-stone-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                        <span>{isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 font-serif mb-1">{service.name}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4 min-h-[38px]">{service.description}</p>

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
                    <span className="text-[11px] text-stone-400 font-mono">{service.id}</span>
                    <button
                      onClick={() => setServiceModalConfig({ isOpen: true, editingService: service })}
                      className="px-2.5 py-1 text-xs font-semibold text-[#55132D] hover:bg-[#55132D]/10 rounded-md transition-colors"
                    >
                      Configure Service
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Devotee Name, Ref ID, Gotra, or Mobile..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                onClick={() => setIsCreateBookingOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Booking</span>
              </button>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Devotee Information</th>
                    <th className="py-3 px-4">Pooja / Seva</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Gotra & Sankalpam</th>
                    <th className="py-3 px-4">Dakshina</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#55132D] whitespace-nowrap">
                        {b.id}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            const dev = getDevoteeById(b.devoteeId);
                            if (dev) setSelectedDevoteeForProfile(dev);
                          }}
                          className="font-bold text-stone-900 hover:text-[#55132D] hover:underline text-left block"
                        >
                          {b.devoteeName}
                        </button>
                        <span className="text-[11px] text-stone-500">{b.mobile}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-800 block">{b.serviceName}</span>
                        <span className="text-[10px] text-stone-500">{b.category}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-stone-800 block">{b.preferredDate}</span>
                        <span className="text-[11px] text-stone-500">{b.preferredTime}</span>
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
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
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
                            onClick={() => handlePrintReceipt(b)}
                            className="p-1.5 text-stone-500 hover:text-[#55132D] hover:bg-stone-100 rounded-md"
                            title="Print Voucher Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {b.bookingStatus === 'Pending' && (
                            <button
                              onClick={() => updatePoojaBookingStatus(b.id, 'Confirmed', 'Verified at desk')}
                              className="px-2 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                            >
                              Confirm
                            </button>
                          )}

                          {b.bookingStatus === 'Scheduled' && (
                            <button
                              onClick={() => updatePoojaBookingStatus(b.id, 'Completed', 'Ritual concluded')}
                              className="px-2 py-1 text-[11px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANNADANAM */}
      {activeTab === 'annadanam' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                Maha Annadanam Daily Meal Distribution
              </h3>
              <p className="text-xs text-stone-500">
                Track free sacred meal services, coupons, dining hall deployments, and devotee sponsorships
              </p>
            </div>
            <button
              onClick={() => setIsAnnadanamOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Meal Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {annadanamRecords.map((rec) => (
              <div key={rec.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {rec.couponRef}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 font-serif mt-1">{rec.mealCategory}</h4>
                    <p className="text-xs text-stone-500">{rec.date} • {rec.diningHall}</p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      rec.distributionStatus === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : rec.distributionStatus === 'In Progress'
                        ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                        : 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}
                  >
                    {rec.distributionStatus}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg text-xs space-y-1.5 border border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Beneficiary Devotees:</span>
                    <strong className="text-stone-900 font-number font-bold text-sm">{rec.beneficiaryCount.toLocaleString('en-IN')} pilgrims</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Sponsor:</span>
                    <strong className="text-stone-800">{rec.sponsorName} ({rec.sponsorshipCategory})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Recorded Contribution:</span>
                    <strong className="text-[#55132D] font-number font-bold">₹{rec.recordedContribution.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <p className="text-xs text-stone-600"><span className="font-semibold">Menu:</span> {rec.menuItems}</p>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400">{rec.remarks}</span>
                  {rec.distributionStatus === 'In Progress' && (
                    <button
                      onClick={() => updateAnnadanamStatus(rec.id, 'Completed')}
                      className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SCHEDULE & PRIESTS */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h3 className="text-sm font-bold text-stone-900 font-serif">
              Priest Shift Assignments & Ritual Timetable
            </h3>
            <p className="text-xs text-stone-500">
              Official shift alignment synchronized with traditional Matabari ritual calendar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                Morning Shift (05:00 AM – 12:00 PM)
              </span>
              <h4 className="font-bold text-stone-900 font-serif">Pratah Mangala & Abhishekam</h4>
              <p className="text-stone-600 text-[11px]">In-Charge: Head Priest Pandit S. Bhattacharya</p>
              <div className="text-[11px] text-stone-500 pt-1 border-t border-amber-200/40">
                Assigned Altars: Inner Sanctum, Yagya Mandir
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                Afternoon Bhog (12:00 PM – 03:00 PM)
              </span>
              <h4 className="font-bold text-stone-900 font-serif">Madhyahna Aarti & Rajbhog</h4>
              <p className="text-stone-600 text-[11px]">In-Charge: Pandit K. Chakraborty</p>
              <div className="text-[11px] text-stone-500 pt-1 border-t border-blue-200/40">
                Assigned Altars: Bhog Shala, Annadanam Kitchen
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">
                Evening Shift (04:00 PM – 09:30 PM)
              </span>
              <h4 className="font-bold text-stone-900 font-serif">Sandhya Aarti & Shayan Seva</h4>
              <p className="text-stone-600 text-[11px]">In-Charge: Pandit B. Roy & Sevadal Council</p>
              <div className="text-[11px] text-stone-500 pt-1 border-t border-purple-200/40">
                Assigned Altars: Main Sanctum, Deepa Sthambha
              </div>
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

      <AnnadanamModal
        isOpen={isAnnadanamOpen}
        onClose={() => setIsAnnadanamOpen(false)}
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

