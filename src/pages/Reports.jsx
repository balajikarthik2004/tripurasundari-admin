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
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { useDevoteeServices } from '../context/DevoteeServicesContext';
import { useTempleOperations } from '../context/TempleOperationsContext';
import { useInsightsAdmin } from '../context/InsightsAdminContext';

export default function Reports() {
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
    reconciliationRuns = [],
    reconciliationItems = [],
    updateReconciliationMatch,
    createReconciliationRun,
    showToast,
  } = useInsightsAdmin();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // today, week, month, fy
  const [reconcileFilter, setReconcileFilter] = useState('ALL');
  const [selectedReconcileItem, setSelectedReconcileItem] = useState(null);

  // Derived Core Metrics
  const totalDevoteeVisitsRecorded = 24680; // Baseline visits
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

  // Unresolved items requiring administrative review
  const pendingReviewsCount = useMemo(() => {
    const unreviewedIncidents = incidents.filter((i) => i.status !== 'Resolved').length;
    const unmatchedReconcile = reconciliationItems.filter((r) => r.matchStatus !== 'Matched').length;
    const overdueMela = melaTasks.filter((t) => t.status !== 'Completed').length;
    return unreviewedIncidents + unmatchedReconcile + overdueMela;
  }, [incidents, reconciliationItems, melaTasks]);

  // Recharts Data: Revenue by Service Category
  const financialCategoryDistribution = [
    { name: 'General Donations', value: totalGeneralDonationsAmount, color: '#55132D' },
    { name: 'Pooja & Seva', value: totalPoojaAmount, color: '#D97706' },
    { name: 'Prasad Store', value: totalPrasadSalesAmount, color: '#2563EB' },
    { name: 'Accommodation', value: totalAccomAmount, color: '#059669' },
  ];

  // Booking Trend Data
  const bookingTrendData = [
    { hour: '06 AM', bookings: 42, devotees: 480 },
    { hour: '08 AM', bookings: 120, devotees: 1250 },
    { hour: '10 AM', bookings: 245, devotees: 2600 },
    { hour: '12 PM', bookings: 190, devotees: 1950 },
    { hour: '02 PM', bookings: 85, devotees: 920 },
    { hour: '04 PM', bookings: 165, devotees: 1840 },
    { hour: '06 PM', bookings: 210, devotees: 2310 },
    { hour: '08 PM', bookings: 95, devotees: 1040 },
  ];

  // CSV Export Action
  const handleExportCSV = () => {
    const headers = ['Record ID', 'Category', 'Payer/Devotee', 'Internal Amount', 'Bank Reference', 'Match Status'];
    const rows = reconciliationItems.map((r) => [
      r.id,
      r.category,
      r.payerName,
      `₹${r.internalAmount}`,
      r.bankRef || 'None',
      r.matchStatus,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Tripura_Sundari_Reconciliation_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Reconciliation CSV exported successfully.');
  };

  const tabs = [
    { id: 'overview', label: 'Consolidated Dashboard', icon: BarChart3 },
    { id: 'services', label: 'Operations & Services', count: totalServiceBookingsCount, icon: FileSpreadsheet },
    { id: 'financial', label: 'Financial Breakdown', icon: TrendingUp },
    { id: 'reconciliation', label: 'Bank Reconciliation', count: reconciliationItems.filter(r => r.matchStatus !== 'Matched').length, icon: CheckCircle },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">
              Reports & Reconciliation
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Period Selector */}
            <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs">
              <button
                onClick={() => setSelectedPeriod('today')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  selectedPeriod === 'today' ? 'bg-[#55132D] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  selectedPeriod === 'week' ? 'bg-[#55132D] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  selectedPeriod === 'month' ? 'bg-[#55132D] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Month (Oct)
              </button>
              <button
                onClick={() => setSelectedPeriod('fy')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  selectedPeriod === 'fy' ? 'bg-[#55132D] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                FY 2026-27
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-stone-200/80 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Devotee Inflow</span>
          <div className="text-2xl font-bold font-number text-stone-900">
            {totalDevoteeVisitsRecorded.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-500">Recorded campus entries</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200/80 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Service Bookings</span>
          <div className="text-2xl font-bold font-number text-blue-700">{totalServiceBookingsCount}</div>
          <span className="text-[11px] text-stone-500">Darshan, Sevas & Prasad</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200/80 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Total Recorded Collections</span>
          <div className="text-2xl font-bold font-number text-stone-900">
            ₹{grandTotalRecordedInflow.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-500">Donations + Sevas + Sales</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200/80 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Pending Review</span>
          <div className="text-2xl font-bold font-number text-amber-700">{pendingReviewsCount}</div>
          <span className="text-[11px] text-stone-500">Exceptions & open tasks</span>
        </div>
      </div>

      {/* Internal Navigation Tabs (Clean 4-Option Bar) */}
      <div className="flex items-center gap-1.5 border border-stone-200/80 bg-white/70 backdrop-blur-xs p-1.5 rounded-xl shadow-2xs overflow-x-auto custom-scrollbar w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-fit px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-xs font-number px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
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

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Devotee & Booking Inflow Trend */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">Hourly Inflow & Booking Velocity</h3>
                  <p className="text-xs text-stone-500">Devotee entrance throughput compared to verified reservations</p>
                </div>
                <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600 font-bold">
                  Peak: 10:00 AM
                </span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', color: '#FFF', borderRadius: 8, fontSize: 11 }}
                    />
                    <Bar dataKey="devotees" fill="#E2BC6B" radius={[4, 4, 0, 0]} name="Devotees" />
                    <Bar dataKey="bookings" fill="#55132D" radius={[4, 4, 0, 0]} name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Revenue Distribution (PieChart) */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 font-serif">Collections by Category</h3>
                    <p className="text-xs text-stone-500">Revenue distribution across service domains</p>
                  </div>
                  <span className="text-xs font-number font-bold text-[#55132D]">
                    Total: ₹{(grandTotalRecordedInflow / 100000).toFixed(1)}L
                  </span>
                </div>

                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={financialCategoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {financialCategoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                        contentStyle={{ backgroundColor: '#1F2937', color: '#FFF', borderRadius: 8, fontSize: 11 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend Summary */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-150 text-xs">
                {financialCategoryDistribution.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-1.5 bg-stone-50 rounded">
                    <span className="flex items-center gap-1.5 text-stone-600 text-[11px]">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-[11px]">
                      ₹{cat.value.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Administrative Review Queue */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Cross-Module Review Queue</h3>
                <p className="text-xs text-stone-500">
                  Pending exceptions and operational tasks requiring administrative sign-off
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {pendingReviewsCount} Action Items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Item 1: Reconciliation Discrepancy */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-amber-800">Financial Exception</span>
                  <span className="text-[10px] text-stone-400 font-mono">TXN-REC-105</span>
                </div>
                <h4 className="font-bold text-stone-900">Amount Mismatch (₹500 Discrepancy)</h4>
                <p className="text-[11px] text-stone-600">
                  NEFT donation from Debabrata Debbarma has bank credit of ₹9,500 vs ₹10,000 receipt.
                </p>
                <div className="pt-2 text-right">
                  <button
                    onClick={() => setActiveTab('reconciliation')}
                    className="text-[#55132D] font-semibold text-[11px] hover:underline"
                  >
                    Inspect in Reconciliation →
                  </button>
                </div>
              </div>

              {/* Item 2: Active Operational Incident */}
              <div className="p-3 bg-red-50/60 rounded-xl border border-red-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-red-800">CCTV & Premises</span>
                  <span className="text-[10px] text-stone-400 font-mono">INC-2026-101</span>
                </div>
                <h4 className="font-bold text-stone-900">Queue Barricade Pressure at East Plaza</h4>
                <p className="text-[11px] text-stone-600">
                  Holding line approaching 78% capacity. Standby volunteer reinforcement required.
                </p>
                <div className="pt-2 text-right">
                  <a href="/crowd-control" className="text-[#55132D] font-semibold text-[11px] hover:underline">
                    Open Crowd Control →
                  </a>
                </div>
              </div>

              {/* Item 3: Mela Planning Task */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-blue-800">Mela Preparation</span>
                  <span className="text-[10px] text-stone-400 font-mono">TSK-102</span>
                </div>
                <h4 className="font-bold text-stone-900">Kalyan Sagar Lake Safety Diver Team</h4>
                <p className="text-[11px] text-stone-600">
                  NDRF rescue boats and lifebuoy deployment review due by 06 Nov 2026.
                </p>
                <div className="pt-2 text-right">
                  <a href="/mela-management" className="text-[#55132D] font-semibold text-[11px] hover:underline">
                    Open Mela Planning →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OPERATIONS & SERVICES REPORT (Merged Services + Premises Operations) */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Darshan Service */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-150 pb-2">
              <h4 className="font-bold text-stone-900 text-sm font-serif">Darshan & Special Passes</h4>
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

          {/* 2. Pooja & Seva */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-150 pb-2">
              <h4 className="font-bold text-stone-900 text-sm font-serif">Pooja & Vedic Sevas</h4>
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

          {/* 3. Prasad & Store */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-150 pb-2">
              <h4 className="font-bold text-stone-900 text-sm font-serif">Prasad Store & Sweets</h4>
              <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded font-bold">
                ₹{totalPrasadSalesAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Traditional Cow Milk Peda:</span>
                <span className="font-bold text-stone-800">142 Packets</span>
              </div>
              <div className="flex justify-between">
                <span>Special Mahaprasad Box:</span>
                <span className="font-bold text-stone-800">85 Boxes</span>
              </div>
              <div className="flex justify-between">
                <span>Scriptures & Guides:</span>
                <span className="font-bold text-stone-800">24 Publications</span>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-150 text-[11px] text-stone-500">
              Distribution: <strong>East Gate Forecourt Counter</strong>
            </div>
          </div>

          {/* 4. Accommodation */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-150 pb-2">
              <h4 className="font-bold text-stone-900 text-sm font-serif">Yatri Niwas Accommodation</h4>
              <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded font-bold">
                {accommodationBookings.length} Active
              </span>
            </div>
            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Dormitory Complex Cots:</span>
                <span className="font-bold text-stone-800">42 / 80 Occupied</span>
              </div>
              <div className="flex justify-between">
                <span>Guest Cottages:</span>
                <span className="font-bold text-stone-800">6 / 8 Occupied</span>
              </div>
              <div className="flex justify-between">
                <span>Overall Occupancy Rate:</span>
                <span className="font-bold text-emerald-700">55% (Moderate)</span>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-150 text-[11px] text-stone-500">
              Reception: <strong>24-Hour Registration Desk</strong>
            </div>
          </div>

          {/* 5. Crowd & Perimeter Control (Merged from Operations) */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-150 pb-2">
              <h4 className="font-bold text-stone-900 text-sm font-serif">Crowd & Perimeter Control</h4>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                Normal Flow
              </span>
            </div>
            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Active Holding Queues:</span>
                <span className="font-bold text-stone-800 font-mono">{queues.length} Lines Operational</span>
              </div>
              <div className="flex justify-between">
                <span>Peak Occupancy Rate:</span>
                <span className="font-bold text-amber-700 font-mono">78% (Zone C - East Plaza)</span>
              </div>
              <div className="flex justify-between">
                <span>CCTV Surveillance:</span>
                <span className="font-bold text-emerald-700 font-mono">9 Feeds (100% Protected)</span>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-150 text-[11px] text-stone-500">
              Status: <strong>Continuous intake via West Gate</strong>
            </div>
          </div>

          {/* 6. Staff & Logistics (Merged from Operations) */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-150 pb-2">
              <h4 className="font-bold text-stone-900 text-sm font-serif">Staff & Premises Logistics</h4>
              <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded font-bold">
                10 Deployed
              </span>
            </div>
            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Deployed On-Duty Staff:</span>
                <span className="font-bold text-stone-800 font-mono">10 Assigned / 3 Shifts</span>
              </div>
              <div className="flex justify-between">
                <span>Commercial Stalls:</span>
                <span className="font-bold text-emerald-700 font-mono">5 Allocated / 3 Vacant</span>
              </div>
              <div className="flex justify-between">
                <span>Parking Bay Inflow:</span>
                <span className="font-bold text-stone-800 font-mono">425 Vehicles Parked</span>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-150 text-[11px] text-stone-500">
              Shift Roster: <strong>Pratah (Morning) Active</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FINANCIAL CATEGORY BREAKDOWN */}
      {activeTab === 'financial' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden space-y-4 p-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">Financial Inflow Ledger</h3>
            <p className="text-xs text-stone-500">
              Revenue categorization by trust bylaws and operational head.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Financial Category</th>
                  <th className="py-3 px-4">Transaction Count</th>
                  <th className="py-3 px-4">Total Amount Recorded</th>
                  <th className="py-3 px-4">Dominant Mode</th>
                  <th className="py-3 px-4">Statutory Treatment</th>
                  <th className="py-3 px-4 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr className="hover:bg-stone-50/60">
                  <td className="py-3 px-4 font-bold text-stone-900">1. General Devotee Donations</td>
                  <td className="py-3 px-4 font-mono">{donations.length} receipts</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#55132D]">₹{totalGeneralDonationsAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-stone-600">Online UPI & Netbanking</td>
                  <td className="py-3 px-4 text-stone-500 text-[11px]">80G Tax Exemption Receipt</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      Reconciled
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-stone-50/60">
                  <td className="py-3 px-4 font-bold text-stone-900">2. Pooja & Seva Collections</td>
                  <td className="py-3 px-4 font-mono">{poojaBookings.length} sevas</td>
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">₹{totalPoojaAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-stone-600">Counter Cash & QR</td>
                  <td className="py-3 px-4 text-stone-500 text-[11px]">Priest Remuneration Fund</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      Verified
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-stone-50/60">
                  <td className="py-3 px-4 font-bold text-stone-900">3. Prasad & Store Sales</td>
                  <td className="py-3 px-4 font-mono">{prasadOrders.length} orders</td>
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">₹{totalPrasadSalesAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-stone-600">POS EDC Swipe Terminal</td>
                  <td className="py-3 px-4 text-stone-500 text-[11px]">Commercial Merchandise</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      Settled
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-stone-50/60">
                  <td className="py-3 px-4 font-bold text-stone-900">4. Accommodation & Yatri Niwas</td>
                  <td className="py-3 px-4 font-mono">{accommodationBookings.length} stays</td>
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">₹{totalAccomAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-stone-600">Counter Deposit</td>
                  <td className="py-3 px-4 text-stone-500 text-[11px]">Maintenance Recovery</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                      Audited
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RECONCILIATION */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-4">
          {/* Header Controls Bar */}
          <div className="bg-white border border-stone-200/90 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold font-serif text-stone-900">Bank Clearance Verification</span>
              <span className="text-stone-400 hidden sm:inline">• Automated matching of internal receipts against bank settlement records</span>
            </div>
            <button
              onClick={() => createReconciliationRun('Monthly Audit Batch')}
              className="px-3 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
            >
              Run Audit Batch
            </button>
          </div>

          {/* Reconciliation Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">Filter Match Status:</span>
                <select
                  value={reconcileFilter}
                  onChange={(e) => setReconcileFilter(e.target.value)}
                  className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                >
                  <option value="ALL">All Records ({reconciliationItems.length})</option>
                  <option value="Matched">Matched</option>
                  <option value="Amount Mismatch">Amount Mismatch</option>
                  <option value="Reference Mismatch">Reference Mismatch</option>
                  <option value="Missing Reference">Missing Reference</option>
                </select>
              </div>

              <span className="text-xs text-stone-500 font-medium">
                Matched:{' '}
                <strong className="text-emerald-700">
                  {reconciliationItems.filter((r) => r.matchStatus === 'Matched').length}
                </strong>{' '}
                • Exceptions:{' '}
                <strong className="text-amber-700">
                  {reconciliationItems.filter((r) => r.matchStatus !== 'Matched').length}
                </strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Txn ID</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Internal Ref</th>
                    <th className="py-3 px-4">Payer Devotee</th>
                    <th className="py-3 px-4">Internal Amount</th>
                    <th className="py-3 px-4">Bank Ref</th>
                    <th className="py-3 px-4">Bank Amount</th>
                    <th className="py-3 px-4">Match Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {reconciliationItems
                    .filter((item) => reconcileFilter === 'ALL' || item.matchStatus === reconcileFilter)
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/60">
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">{item.id}</td>
                        <td className="py-3 px-4 text-stone-500 text-[11px] whitespace-nowrap">{item.date}</td>
                        <td className="py-3 px-4 font-medium text-stone-800">{item.category}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#55132D] font-semibold">{item.internalRef}</td>
                        <td className="py-3 px-4 text-stone-800">{item.payerName}</td>
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">₹{item.internalAmount}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                          {item.bankRef || <span className="text-red-500 italic">None</span>}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-stone-800">
                          {item.bankAmount ? `₹${item.bankAmount}` : <span className="text-stone-300">—</span>}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.matchStatus === 'Matched'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {item.matchStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {item.matchStatus !== 'Matched' ? (
                            <button
                              onClick={() => {
                                const note = prompt('Enter adjustment note or bank UTR verification:');
                                if (note !== null) {
                                  updateReconciliationMatch(item.id, 'Matched', note);
                                }
                              }}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold rounded"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="text-emerald-700 text-[10px] font-medium">Reconciled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

