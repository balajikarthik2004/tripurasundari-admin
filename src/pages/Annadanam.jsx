import React, { useState, useMemo } from 'react';
import {
  Utensils,
  Plus,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Search,
  Filter,
  TrendingUp,
  Printer,
  Sparkles,
  Layers,
  ChefHat,
  Building,
  Soup,
  ShieldCheck,
} from 'lucide-react';
import { useDevoteeServices } from '../context/DevoteeServicesContext';
import ModulePageHeader from '../components/devotee-services/shared/ModulePageHeader';
import ModuleTabs from '../components/devotee-services/shared/ModuleTabs';
import ModuleMetricCard from '../components/devotee-services/shared/ModuleMetricCard';
import AnnadanamModal from '../components/devotee-services/pooja/AnnadanamModal';
import ReceiptModal from '../components/devotee-services/shared/ReceiptModal';

export default function Annadanam() {
  const {
    annadanamRecords,
    updateAnnadanamStatus,
    showToast,
  } = useDevoteeServices();

  const [activeTab, setActiveTab] = useState('overview');
  const [isAnnadanamModalOpen, setIsAnnadanamModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Filters for Distribution Records Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Operational KPIs
  const kpis = useMemo(() => {
    const totalServed = annadanamRecords.reduce((sum, r) => sum + (r.beneficiaryCount || 0), 0);
    const activeSessions = annadanamRecords.filter((r) => r.distributionStatus === 'In Progress').length;
    const completedSessions = annadanamRecords.filter((r) => r.distributionStatus === 'Completed').length;
    const totalDonation = annadanamRecords.reduce((sum, r) => sum + (r.recordedContribution || 0), 0);
    return { totalServed, activeSessions, completedSessions, totalDonation };
  }, [annadanamRecords]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return annadanamRecords.filter((r) => {
      if (statusFilter !== 'All' && r.distributionStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSponsor = r.sponsorName?.toLowerCase().includes(q);
        const matchesCategory = r.mealCategory?.toLowerCase().includes(q);
        const matchesCoupon = r.couponRef?.toLowerCase().includes(q);
        const matchesHall = r.diningHall?.toLowerCase().includes(q);
        if (!matchesSponsor && !matchesCategory && !matchesCoupon && !matchesHall) return false;
      }
      return true;
    });
  }, [annadanamRecords, statusFilter, searchQuery]);

  const tabsConfig = [
    { id: 'overview', label: 'Overview' },
    { id: 'operations', label: 'Meal Operations' },
    { id: 'records', label: 'Distribution Records' },
  ];

  const handlePrintReceipt = (record) => {
    setReceiptData({
      receiptNumber: `REC-${record.id}`,
      date: record.date,
      transactionRef: record.couponRef,
      paymentMode: 'Temple Trust Earmarked Fund',
      donorName: record.sponsorName,
      devoteeId: record.sponsorId,
      mobile: '+91 98623 44012',
      category: record.sponsorshipCategory,
      amount: record.recordedContribution,
      notes: `Maha Annadanam: ${record.mealCategory} • Beneficiaries: ${record.beneficiaryCount.toLocaleString('en-IN')} pilgrims`,
    });
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Page Header */}
      <ModulePageHeader
        title="Maha Annadanam Operations"
        primaryActionLabel="Record Meal Session"
        onPrimaryAction={() => setIsAnnadanamModalOpen(true)}
        primaryActionIcon={Plus}
      />

      {/* KPI Cards Row (Balanced 4-column layout on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModuleMetricCard
          label="Daily Meals Planned"
          value="4,500"
          icon={Utensils}
          color="burgundy"
        />
        <ModuleMetricCard
          label="Meals Prepared & Ready"
          value="3,200"
          icon={ChefHat}
          color="gold"
        />
        <ModuleMetricCard
          label="Total Pilgrims Served"
          value={kpis.totalServed.toLocaleString('en-IN')}
          icon={Users}
          color="emerald"
        />
        <ModuleMetricCard
          label="Active Dining Halls"
          value="2 Halls Open"
          icon={Building}
          color="blue"
        />
      </div>

      {/* Navigation Tabs (Strictly max 3 tabs) */}
      <ModuleTabs
        tabs={tabsConfig}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* ========================================================
          TAB 1: OVERVIEW
         ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Live Service Spotlight */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-subtle">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <div>
                  <h3 className="section-heading flex items-center gap-2">
                    Current Live Service: Mahaprasad Lunch Service (Bhog)
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Live Serving
                    </span>
                  </h3>
                  <p className="supporting-text mt-0.5">
                    Dining Hall Complex A (Main) • Seating Capacity: 350 Devotees / Batch
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAnnadanamModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#55132D] text-white hover:bg-[#681B37] transition-colors"
                >
                  Log Batch Count
                </button>
              </div>
            </div>

            {/* Quick Metrics of Live Service */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-100">
                <span className="supporting-text block">Batches Dispatched</span>
                <span className="text-xl font-bold font-serif text-stone-900 mt-0.5 block">5 Batches</span>
                <span className="text-xs text-stone-500">1,450 devotees fed so far</span>
              </div>
              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-100">
                <span className="supporting-text block">Avg. Dining Time</span>
                <span className="text-xl font-bold font-serif text-stone-900 mt-0.5 block">18 Minutes</span>
                <span className="text-xs text-stone-500">Fast clearing & sanitization</span>
              </div>
              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-100">
                <span className="supporting-text block">Volunteer Servers</span>
                <span className="text-xl font-bold font-serif text-stone-900 mt-0.5 block">14 Sevadals</span>
                <span className="text-xs text-stone-500">Deployed under Sri Ramakrishna Mission</span>
              </div>
            </div>
          </div>

          {/* Kitchen Preparation Pipeline (Full Width, replaces clumsy 2-column layout) */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200/80 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-900 font-serif">
                    Daily Kitchen Preparation Stages
                  </h4>
                  <p className="text-xs text-stone-500">
                    Traditional wood-fired steam kitchen & consecrated bhog preparation pipeline
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Steam Kettles Active
                </span>
              </div>
            </div>

            {/* 3 Balanced Operational Stages: Morning -> Afternoon (Live) -> Evening */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Stage 1: Morning Balya Bhog */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/90 flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                      06:30 AM – 08:00 AM
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      100% Done
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-stone-900 mb-1">
                    Morning Balya Bhog
                  </h5>
                  <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                    Sweet halwa, seasonal fruits & sweetened panchamrit prasad.
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200/60 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-stone-500">420 pilgrims fed</span>
                    <span className="text-emerald-700 font-bold">100%</span>
                  </div>
                  <div className="w-full bg-stone-200/60 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full w-full" />
                  </div>
                </div>
              </div>

              {/* Stage 2: Mahaprasad Lunch Bhog (ACTIVE) */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-300 shadow-2xs flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-[#55132D] bg-white px-2 py-0.5 rounded border border-amber-200">
                      11:30 AM – 03:00 PM
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#55132D] text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Live Serving
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-stone-900 mb-1">
                    Mahaprasad Lunch Bhog
                  </h5>
                  <p className="text-xs text-stone-700 mb-3 leading-relaxed">
                    Govindabhog rice, moong dal khichuri, mixed labra, and payesh.
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-200/70 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-stone-700 font-semibold">1,450 pilgrims fed (Batch 5)</span>
                    <span className="text-amber-800 font-bold">85%</span>
                  </div>
                  <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full w-[85%]" />
                  </div>
                </div>
              </div>

              {/* Stage 3: Sandhya Bhog & Evening Khichuri */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/90 flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                      05:30 PM – 08:30 PM
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                      In Kitchen Prep
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-stone-900 mb-1">
                    Sandhya Bhog & Khichuri
                  </h5>
                  <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                    Ingredients washed; wood-fired boiling kettles primed at 04:30 PM.
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200/60 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-stone-500">Expected ~800 pilgrims</span>
                    <span className="text-stone-700 font-bold">40%</span>
                  </div>
                  <div className="w-full bg-stone-200/60 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full w-[40%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: MEAL OPERATIONS
         ======================================================== */}
      {activeTab === 'operations' && (
        <div className="space-y-6">
          {/* Operations Schedule Grid */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-subtle space-y-4">
            <div>
              <h4 className="section-heading">Daily Meal Preparation & Quality Clearance</h4>
              <p className="supporting-text">Kitchen shifts, chef assignments, and religious food sanctification logs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Morning Balya Bhog
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    Cleared
                  </span>
                </div>
                <h5 className="text-sm font-bold text-stone-900 font-serif">Sooji Halwa & Fruit Naivedyam</h5>
                <p className="text-xs text-stone-600">
                  <span className="font-semibold">Shift Timing:</span> 05:00 AM – 08:00 AM
                </p>
                <p className="text-xs text-stone-600">
                  <span className="font-semibold">Head Cook:</span> Sri Nitai Karmakar
                </p>
                <div className="pt-2 border-t border-amber-200/50 text-xs text-stone-500">
                  Priest Abhishekam Offering sanctified at 06:15 AM
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                    Maha Rajbhog Lunch
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                    In Service
                  </span>
                </div>
                <h5 className="text-sm font-bold text-stone-900 font-serif">Govindabhog Rice & Khichuri</h5>
                <p className="text-xs text-stone-600">
                  <span className="font-semibold">Shift Timing:</span> 09:30 AM – 03:00 PM
                </p>
                <p className="text-xs text-stone-600">
                  <span className="font-semibold">Head Cook:</span> Pandit B. Ganguly & 6 Assistants
                </p>
                <div className="pt-2 border-t border-emerald-200/50 text-xs text-stone-500">
                  Mother Goddess Bhog offered at 11:30 AM by Head Priest
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                    Evening Sandhya Bhog
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
                    Upcoming
                  </span>
                </div>
                <h5 className="text-sm font-bold text-stone-900 font-serif">Hot Moong Khichuri & Gur Payesh</h5>
                <p className="text-xs text-stone-600">
                  <span className="font-semibold">Shift Timing:</span> 04:30 PM – 08:30 PM
                </p>
                <p className="text-xs text-stone-600">
                  <span className="font-semibold">Head Cook:</span> Sri Gouranga Das
                </p>
                <div className="pt-2 border-t border-purple-200/50 text-xs text-stone-500">
                  Evening Sandhya Aarti Bhog scheduled for 06:45 PM
                </div>
              </div>
            </div>
          </div>

          {/* Daily Ingredient Consumption & Pantry Status */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-subtle space-y-4">
            <div>
              <h4 className="section-heading">Pantry & Raw Material Daily Allocations</h4>
              <p className="supporting-text">Tracked provisions from central temple warehouse</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-100">
                <span className="supporting-text block">Govindabhog Rice</span>
                <span className="text-lg font-bold font-serif text-stone-900 mt-0.5 block">450 kg</span>
                <span className="text-xs text-emerald-700 font-medium">320 kg consumed</span>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-100">
                <span className="supporting-text block">Yellow Moong Dal</span>
                <span className="text-lg font-bold font-serif text-stone-900 mt-0.5 block">180 kg</span>
                <span className="text-xs text-emerald-700 font-medium">135 kg consumed</span>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-100">
                <span className="supporting-text block">Pure Desi Cow Ghee</span>
                <span className="text-lg font-bold font-serif text-stone-900 mt-0.5 block">65 Litres</span>
                <span className="text-xs text-emerald-700 font-medium">48 Litres consumed</span>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-100">
                <span className="supporting-text block">Organic Vegetables</span>
                <span className="text-lg font-bold font-serif text-stone-900 mt-0.5 block">600 kg</span>
                <span className="text-xs text-emerald-700 font-medium">Pumpkin, Potato, Papaya</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: DISTRIBUTION RECORDS
         ======================================================== */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          {/* Filters & Actions Bar */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/90 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by sponsor, session, or venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">Live / In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>

            <button
              onClick={() => setIsAnnadanamModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#55132D] text-white hover:bg-[#681B37] flex items-center justify-center gap-2 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Record Meal Session</span>
            </button>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-xl border border-stone-200/90 shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200/90 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Session & Venue</th>
                    <th className="py-3.5 px-5">Sponsor</th>
                    <th className="py-3.5 px-5 text-center">Devotees Fed</th>
                    <th className="py-3.5 px-5 text-right">Contribution</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-stone-400">
                        No Annadanam records found matching the current search.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-amber-50/20 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="font-semibold text-stone-900 text-sm">{rec.mealCategory}</div>
                          <div className="text-xs text-stone-500 mt-0.5">
                            {rec.diningHall}
                          </div>
                        </td>

                        <td className="py-3.5 px-5">
                          <div className="font-semibold text-stone-900 text-sm">{rec.sponsorName}</div>
                          <div className="text-xs text-stone-500 mt-0.5">
                            {rec.sponsorshipCategory ? rec.sponsorshipCategory.replace(' Sponsorship', '') : 'Seva Sponsor'}
                          </div>
                        </td>

                        <td className="py-3.5 px-5 text-center">
                          <span className="font-bold text-stone-900 text-sm font-number">
                            {rec.beneficiaryCount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-stone-400 block -mt-0.5">devotees</span>
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <span className="font-bold text-[#55132D] text-sm font-number">
                            ₹{rec.recordedContribution.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-stone-400 block">Dakshina</span>
                        </td>

                        <td className="py-3.5 px-5 text-center">
                          {rec.distributionStatus === 'In Progress' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Live Serving
                            </span>
                          ) : rec.distributionStatus === 'Completed' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                              Scheduled
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {rec.distributionStatus === 'In Progress' && (
                              <button
                                onClick={() => {
                                  updateAnnadanamStatus(rec.id, 'Completed');
                                  showToast('Meal distribution session marked completed');
                                }}
                                className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors shadow-2xs"
                              >
                                Mark Done
                              </button>
                            )}

                            <button
                              onClick={() => handlePrintReceipt(rec)}
                              className="p-1.5 text-stone-400 hover:text-[#55132D] hover:bg-stone-100 rounded-lg transition-colors"
                              title="Print Earmarked Receipt"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
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

      {/* Record Meal Session Modal */}
      <AnnadanamModal
        isOpen={isAnnadanamModalOpen}
        onClose={() => setIsAnnadanamModalOpen(false)}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={!!receiptData}
        onClose={() => setReceiptData(null)}
        receiptData={receiptData}
      />
    </div>
  );
}

