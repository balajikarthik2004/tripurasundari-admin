import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  DollarSign,
  Users,
  ShieldAlert,
  ArrowUpRight,
  Eye,
  FileSpreadsheet,
  RefreshCw,
  Search,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useDevoteeServices } from '../context/DevoteeServicesContext';
import { useTempleOperations } from '../context/TempleOperationsContext';
import { useInsightsAdmin } from '../context/InsightsAdminContext';
import AnimatedCounter from '../components/common/AnimatedCounter';

export default function Reports({ isEmbedded = false }) {
  const {
    darshanBookings = [],
    poojaBookings = [],
    donations = [],
    orders: prasadOrders = [],
    accommodationRequests: accommodationBookings = [],
  } = useDevoteeServices();

  const {
    zones = [],
    queues = [],
    incidents = [],
    staff = [],
    melaTasks = [],
    parkingAreas = [],
  } = useTempleOperations();

  const {
    reconciliationItems = [],
    updateReconciliationMatch,
    showToast,
  } = useInsightsAdmin();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('today'); // today, week, month, fy
  const [reconcileSearch, setReconcileSearch] = useState('');
  const [reconcileStatusFilter, setReconcileStatusFilter] = useState('ALL');

  // Derived Core Metrics
  const totalDevoteeVisitsRecorded = 24680;
  const totalServiceBookingsCount =
    darshanBookings.length + poojaBookings.length + prasadOrders.length + accommodationBookings.length;

  const totalGeneralDonationsAmount = useMemo(
    () => donations.reduce((acc, d) => acc + (d.amount || 0), 0),
    [donations]
  );
  const totalPoojaAmount = useMemo(
    () => poojaBookings.reduce((acc, p) => acc + (p.amount || 0), 0),
    [poojaBookings]
  );
  const totalPrasadSalesAmount = useMemo(
    () => prasadOrders.reduce((acc, p) => acc + (p.totalAmount || 0), 0),
    [prasadOrders]
  );
  const totalAccomAmount = useMemo(
    () => accommodationBookings.reduce((acc, a) => acc + (a.amount || 0), 0),
    [accommodationBookings]
  );

  const grandTotalRecordedInflow =
    totalGeneralDonationsAmount + totalPoojaAmount + totalPrasadSalesAmount + totalAccomAmount;

  const pendingReviewsCount = useMemo(() => {
    const unreviewedIncidents = incidents.filter((i) => i.status !== 'Resolved').length;
    const unmatchedReconcile = reconciliationItems.filter((r) => r.matchStatus !== 'Matched').length;
    const overdueMela = melaTasks.filter((t) => t.status !== 'Completed').length;
    return unreviewedIncidents + unmatchedReconcile + overdueMela;
  }, [incidents, reconciliationItems, melaTasks]);

  // Meaningful Hourly Devotee Flow & Collection Velocity Analytics
  const hourlyDevoteeAnalytics = [
    { time: '05:30 AM', event: 'Mangala Aarti', footfall: 480, bookings: 12, collections: 6500 },
    { time: '07:00 AM', event: 'Pratah Puja', footfall: 1150, bookings: 45, collections: 14200 },
    { time: '09:00 AM', event: 'Morning Darshan', footfall: 2100, bookings: 98, collections: 28400 },
    { time: '10:30 AM', event: 'Peak Rush', footfall: 2600, bookings: 142, collections: 39500 },
    { time: '12:30 PM', event: 'Rajbhog Arpan', footfall: 1950, bookings: 88, collections: 22100 },
    { time: '02:30 PM', event: 'Afternoon Seva', footfall: 920, bookings: 32, collections: 9800 },
    { time: '04:30 PM', event: 'Evening Opening', footfall: 1840, bookings: 76, collections: 24500 },
    { time: '06:30 PM', event: 'Sandhya Aarti', footfall: 2310, bookings: 110, collections: 32900 },
    { time: '08:30 PM', event: 'Shayana Aarti', footfall: 1040, bookings: 40, collections: 12400 },
  ];

  // Filtered Financial Reconciliation Records
  const filteredReconcileItems = useMemo(() => {
    return reconciliationItems.filter((item) => {
      const matchStatus =
        reconcileStatusFilter === 'ALL' || item.matchStatus === reconcileStatusFilter;
      const matchSearch =
        reconcileSearch.trim() === '' ||
        item.id.toLowerCase().includes(reconcileSearch.toLowerCase()) ||
        item.payerName.toLowerCase().includes(reconcileSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(reconcileSearch.toLowerCase()) ||
        (item.bankRef && item.bankRef.toLowerCase().includes(reconcileSearch.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [reconciliationItems, reconcileStatusFilter, reconcileSearch]);

  // CSV Export Action
  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Date & Time',
      'Category',
      'Devotee / Source',
      'Internal Amount (INR)',
      'Bank Ref',
      'Bank Amount (INR)',
      'Status',
    ];
    const rows = filteredReconcileItems.map((r) => [
      r.id,
      r.date,
      r.category,
      r.payerName,
      r.internalAmount,
      r.bankRef || 'N/A',
      r.bankAmount || '0',
      r.matchStatus,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Tripura_Sundari_Financial_Reconciliation_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Financial Ledger exported successfully.');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'operations', label: 'Operations', count: totalServiceBookingsCount, icon: FileSpreadsheet },
    {
      id: 'reconciliation',
      label: 'Financial Reconciliation',
      count: reconciliationItems.filter((r) => r.matchStatus !== 'Matched').length,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* 1. Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1 tracking-wider">
            Devotee Inflow
          </span>
          <div className="text-2xl font-bold font-serif text-stone-900">
            <AnimatedCounter value={totalDevoteeVisitsRecorded} />
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Recorded campus entries</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1 tracking-wider">
            Service Bookings
          </span>
          <div className="text-2xl font-bold font-serif text-blue-800">
            <AnimatedCounter value={totalServiceBookingsCount} />
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Darshan, Sevas &amp; Prasad</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1 tracking-wider">
            Total Collections
          </span>
          <div className="text-2xl font-bold font-serif text-stone-900">
            <AnimatedCounter value={`₹${grandTotalRecordedInflow}`} />
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Donations + Sevas + Sales</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1 tracking-wider">
            Pending Review
          </span>
          <div className="text-2xl font-bold font-serif text-amber-800">
            <AnimatedCounter value={pendingReviewsCount} />
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Exceptions &amp; audits</span>
        </div>
      </div>

      {/* 2. Secondary Navigation Bar */}
      <div className="flex items-center gap-1.5 border border-stone-200/90 bg-white p-1.5 rounded-2xl shadow-2xs overflow-x-auto custom-scrollbar w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-fit px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10.5px] px-2 py-0.2 rounded-full font-bold flex-shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW — ATTRACTIVE, UNIQUE, MEANINGFUL GRAPH   */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Main Analytics Graph Card */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-150">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-sm tracking-tight flex items-center gap-2">
                  <span>Devotee Footfall Flow &amp; Booking Velocity Dynamics</span>
                </h3>
                <span className="text-xs text-stone-500 font-medium block mt-0.5">
                  Hourly pilgrimage attendance across sacred Aarti epochs correlated with confirmed Sevas
                </span>
              </div>

              {/* Time Period Selector */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200 text-xs shadow-2xs">
                  {[
                    { id: 'today', label: 'Today (Live)' },
                    { id: 'week', label: '7 Days' },
                    { id: 'month', label: 'Month' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPeriod(p.id)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedPeriod === p.id
                          ? 'bg-[#55132D] text-white shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recharts Modern Multi-Area Curve Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hourlyDevoteeAnalytics}
                  margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
                >
                  <defs>
                    {/* Golden Amber Gradient for Footfall */}
                    <linearGradient id="footfallGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E2BC6B" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#E2BC6B" stopOpacity={0.02} />
                    </linearGradient>

                    {/* Burgundy Accent for Bookings */}
                    <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#55132D" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#55132D" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0ECE4" />

                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: '#78716C' }}
                    axisLine={{ stroke: '#E7E5E4' }}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: '#78716C' }}
                    axisLine={{ stroke: '#E7E5E4' }}
                    tickLine={false}
                  />

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#55132D] text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-[#B68A36]/40 select-none">
                            <div className="flex items-center justify-between gap-3 border-b border-white/20 pb-1">
                              <span className="font-bold text-[#E2BC6B]">{label}</span>
                              <span className="text-[10px] uppercase font-semibold text-white/80">
                                {data.event}
                              </span>
                            </div>
                            <div className="space-y-0.5 text-[11px]">
                              <div className="flex justify-between gap-4">
                                <span className="text-white/80">Devotee Footfall:</span>
                                <strong className="font-mono text-amber-200">
                                  {data.footfall.toLocaleString()} pilgrims
                                </strong>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-white/80">Confirmed Sevas:</span>
                                <strong className="font-mono text-white">
                                  {data.bookings} bookings
                                </strong>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-white/80">Hourly Inflow:</span>
                                <strong className="font-mono text-emerald-300">
                                  ₹{data.collections.toLocaleString()}
                                </strong>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="footfall"
                    stroke="#D97706"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#footfallGradient)"
                    name="Devotee Footfall"
                  />

                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#55132D"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#bookingsGradient)"
                    name="Seva Bookings"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Operational Insights Pill Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-stone-150 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 space-y-0.5">
                <span className="text-[10.5px] text-stone-500 font-bold uppercase tracking-wider block">
                  Peak Queue Density
                </span>
                <span className="font-serif font-bold text-stone-900 text-sm">
                  2,600 Yatris / Hr
                </span>
                <span className="text-[10px] text-stone-500 block">Peak at 10:30 AM (East Gate)</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 space-y-0.5">
                <span className="text-[10.5px] text-stone-500 font-bold uppercase tracking-wider block">
                  Avg. Sanctum Darshan Transit
                </span>
                <span className="font-serif font-bold text-emerald-800 text-sm">
                  18 Minutes
                </span>
                <span className="text-[10px] text-stone-500 block">From gate scan to sanctum exit</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 space-y-0.5">
                <span className="text-[10.5px] text-stone-500 font-bold uppercase tracking-wider block">
                  Digital Collections Ratio
                </span>
                <span className="font-serif font-bold text-blue-800 text-sm">
                  78% UPI / QR
                </span>
                <span className="text-[10px] text-stone-500 block">22% Cash counter deposits</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 space-y-0.5">
                <span className="text-[10.5px] text-stone-500 font-bold uppercase tracking-wider block">
                  Free Annadanam Seva
                </span>
                <span className="font-serif font-bold text-[#55132D] text-sm">
                  4,290 Plates
                </span>
                <span className="text-[10px] text-stone-500 block">Served in 5 dining batches</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: OPERATIONS & SERVICES REPORT (PRESERVED)           */}
      {/* ======================================================== */}
      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Darshan Service */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-150 pb-2">
              <h4 className="font-bold text-stone-900 text-sm font-serif">Darshan &amp; Special Passes</h4>
              <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded font-bold">
                {darshanBookings.length} Bookings
              </span>
            </div>
            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Confirmed Bookings:</span>
                <span className="font-bold text-emerald-700">
                  {darshanBookings.filter((b) => b.status === 'Confirmed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending Approvals:</span>
                <span className="font-bold text-amber-700">
                  {darshanBookings.filter((b) => b.status === 'Pending').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cancelled / Expired:</span>
                <span className="font-bold text-stone-400">
                  {darshanBookings.filter((b) => b.status === 'Cancelled').length}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-150 text-[11px] text-stone-500">
              Peak Slot: <strong>10:00 AM – 11:30 AM</strong>
            </div>
          </div>

          {/* Pooja & Seva */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-150 pb-2">
              <h4 className="font-bold text-stone-900 text-sm font-serif">Pooja &amp; Vedic Sevas</h4>
              <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded font-bold">
                ₹{totalPoojaAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Navagraha Shanti Seva:</span>
                <span className="font-bold text-stone-800">4 Bookings (₹4,400)</span>
              </div>
              <div className="flex justify-between">
                <span>Chandi Path Sankalpa:</span>
                <span className="font-bold text-stone-800">2 Bookings (₹5,000)</span>
              </div>
              <div className="flex justify-between">
                <span>Special Archana:</span>
                <span className="font-bold text-stone-800">8 Bookings (₹4,000)</span>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-150 text-[11px] text-stone-500">
              Priest Assignment: <strong>Head Priest Council</strong>
            </div>
          </div>

          {/* Prasad & Retail Store */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-150 pb-2">
              <h4 className="font-bold text-stone-900 text-sm font-serif">Prasad Store &amp; Peda Units</h4>
              <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded font-bold">
                ₹{totalPrasadSalesAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Dispatched Orders:</span>
                <span className="font-bold text-emerald-700">{prasadOrders.length} Packets</span>
              </div>
              <div className="flex justify-between">
                <span>Special Peda Boxes:</span>
                <span className="font-bold text-stone-800">320 Units Sold</span>
              </div>
              <div className="flex justify-between">
                <span>Panchamrit Packets:</span>
                <span className="font-bold text-stone-800">450 Units Sold</span>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-150 text-[11px] text-stone-500">
              Inventory State: <strong>Adequate stock in Central Store</strong>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FINANCIAL RECONCILIATION — JUST A SINGLE TABLE    */}
      {/* ======================================================== */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden space-y-4 p-5">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-stone-150 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transaction ID, devotee, or category..."
                value={reconcileSearch}
                onChange={(e) => setReconcileSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#55132D]"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <select
                value={reconcileStatusFilter}
                onChange={(e) => setReconcileStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 font-semibold text-stone-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#55132D] cursor-pointer"
              >
                <option value="ALL">All Statuses ({reconciliationItems.length})</option>
                <option value="Matched">Matched</option>
                <option value="Amount Mismatch">Amount Mismatch</option>
                <option value="Pending">Pending Review</option>
              </select>

              {/* Export CSV Button */}
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-[#E2BC6B]" />
                <span>Export Ledger CSV</span>
              </button>
            </div>
          </div>

          {/* The Single Comprehensive Reconciliation Table */}
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 text-stone-700 font-bold uppercase text-[10.5px] border-b border-stone-200 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-mono">Record ID</th>
                  <th className="py-3.5 px-4">Date &amp; Time</th>
                  <th className="py-3.5 px-4">Revenue Category</th>
                  <th className="py-3.5 px-4">Devotee / Source</th>
                  <th className="py-3.5 px-4 font-mono">Internal Amount</th>
                  <th className="py-3.5 px-4 font-mono">Bank Settlement Ref</th>
                  <th className="py-3.5 px-4 font-mono">Bank Credit</th>
                  <th className="py-3.5 px-4 text-center">Audit Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 text-stone-700 bg-white">
                {filteredReconcileItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-stone-400">
                      No reconciliation records match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReconcileItems.map((item) => {
                    const isMatched = item.matchStatus === 'Matched';
                    const isMismatch = item.matchStatus === 'Amount Mismatch';

                    return (
                      <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">
                          {item.id}
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-medium">
                          {item.date}
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-900">
                          {item.category}
                        </td>
                        <td className="py-3 px-4 text-stone-700">
                          {item.payerName}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#55132D]">
                          ₹{item.internalAmount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                          {item.bankRef || '—'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">
                          ₹{item.bankAmount?.toLocaleString('en-IN') || '—'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold inline-block ${
                              isMatched
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : isMismatch
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            ● {item.matchStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              updateReconciliationMatch(item.id, 'Matched', 'Manually verified by Admin.');
                              showToast(`Record ${item.id} verified and matched.`);
                            }}
                            disabled={isMatched}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                              isMatched
                                ? 'text-stone-400 cursor-not-allowed'
                                : 'text-[#55132D] hover:bg-[#55132D]/10'
                            }`}
                          >
                            {isMatched ? 'Settled' : 'Verify Match'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-xs text-stone-500 flex justify-between items-center">
            <span>Showing <strong>{filteredReconcileItems.length}</strong> entries</span>
            <span className="font-mono text-[11px] text-emerald-700 font-bold">
              Automated Bank Reconciliation Feed Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
