import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  DollarSign,
  TrendingUp,
  Award,
  FileCheck,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  PieChart as PieChartIcon,
  CreditCard,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useDevoteeServices } from '../context/DevoteeServicesContext';
import ModulePageHeader from '../components/devotee-services/shared/ModulePageHeader';
import ModuleTabs from '../components/devotee-services/shared/ModuleTabs';
import ModuleMetricCard from '../components/devotee-services/shared/ModuleMetricCard';
import DevoteeProfileDrawer from '../components/devotee-services/shared/DevoteeProfileDrawer';
import ReceiptModal from '../components/devotee-services/shared/ReceiptModal';
import RecordDonationModal from '../components/devotee-services/donations/RecordDonationModal';
import CreateSponsorshipModal from '../components/devotee-services/donations/CreateSponsorshipModal';

export default function Donations() {
  const {
    donations,
    sponsorships,
    donationCategories,
    devotees,
    verifyDonation,
    getDevoteeById,
  } = useDevoteeServices();

  const [activeTab, setActiveTab] = useState('overview');
  const [donationSubView, setDonationSubView] = useState('donations'); // 'donations' or 'sponsorships'
  const [receiptSubView, setReceiptSubView] = useState('receipts'); // 'receipts' or 'funds'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawers
  const [isRecordDonationOpen, setIsRecordDonationOpen] = useState(false);
  const [isSponsorshipOpen, setIsSponsorshipOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedDevoteeForProfile, setSelectedDevoteeForProfile] = useState(null);

  // Metrics
  const metrics = useMemo(() => {
    const totalAmount = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const totalTransactions = donations.length;
    const verifiedTransactions = donations.filter((d) => d.paymentStatus === 'Verified').length;
    const pendingTransactions = donations.filter((d) => d.paymentStatus === 'Pending Verification').length;
    const totalSponsorshipsAmount = sponsorships.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

    return {
      totalAmount,
      totalTransactions,
      verifiedTransactions,
      pendingTransactions,
      totalSponsorshipsAmount,
    };
  }, [donations, sponsorships]);

  // Filtered Donations
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && d.paymentStatus !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesId = d.id.toLowerCase().includes(q);
        const matchesDonor = d.donorName.toLowerCase().includes(q);
        const matchesMobile = d.mobile.includes(q);
        const matchesReceipt = d.receiptNumber?.toLowerCase().includes(q);
        if (!matchesId && !matchesDonor && !matchesMobile && !matchesReceipt) return false;
      }
      return true;
    });
  }, [donations, categoryFilter, statusFilter, searchTerm]);

  // Category distribution for PieChart
  const distributionData = useMemo(() => {
    const map = {};
    donations.forEach((d) => {
      map[d.category] = (map[d.category] || 0) + d.amount;
    });

    const colors = ['#55132D', '#B68A36', '#2563EB', '#0D9488', '#D97706', '#7C3AED'];
    return Object.keys(map).map((key, idx) => ({
      name: key,
      value: map[key],
      color: colors[idx % colors.length],
    }));
  }, [donations]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Donation ID', 'Date', 'Donor Name', 'Devotee ID', 'Category', 'Amount', 'Payment Mode', 'Transaction Ref', 'Status', 'Receipt No'];
    const rows = filteredDonations.map((d) => [
      `"${d.id}"`,
      `"${d.date}"`,
      `"${d.donorName}"`,
      `"${d.devoteeId || ''}"`,
      `"${d.category}"`,
      d.amount,
      `"${d.paymentMode}"`,
      `"${d.transactionRef}"`,
      `"${d.paymentStatus}"`,
      `"${d.receiptNumber || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `temple_donations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const trendData = [
    { day: '25 Oct', amount: 82000 },
    { day: '26 Oct', amount: 94000 },
    { day: '27 Oct', amount: 88000 },
    { day: '28 Oct', amount: 112000 },
    { day: '29 Oct', amount: 145000 },
    { day: '30 Oct', amount: 168000 },
    { day: '31 Oct', amount: 109601 },
  ];

  // Strictly 3 primary tabs
  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: HeartHandshake },
    { id: 'donations-sponsorships', label: 'Donations & Sponsorships', icon: DollarSign },
    { id: 'receipts-funds', label: 'Receipts & Funds', icon: FileCheck },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <ModulePageHeader
        title="Donations & Funds Administration"
        primaryActionLabel="Record Donation"
        onPrimaryAction={() => setIsRecordDonationOpen(true)}
        primaryActionIcon={HeartHandshake}
      />

      {/* Tabs */}
      <ModuleTabs tabs={tabsConfig} activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* 5 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <ModuleMetricCard
              label="Total Donations Recorded"
              value={`₹${metrics.totalAmount.toLocaleString('en-IN')}`}
              trend="+22% this week"
              icon={HeartHandshake}
              iconBg="bg-[#55132D]/10 text-[#55132D]"
            />
            <ModuleMetricCard
              label="Verified Receipts"
              value={metrics.verifiedTransactions}
              icon={CheckCircle2}
              iconBg="bg-emerald-50 text-emerald-700"
            />
            <ModuleMetricCard
              label="Pending Audit Review"
              value={metrics.pendingTransactions}
              icon={Clock}
              iconBg="bg-amber-50 text-amber-700"
              onClick={() => { setActiveTab('donations-sponsorships'); setDonationSubView('donations'); }}
            />
            <ModuleMetricCard
              label="Sponsorship Programs"
              value={`₹${metrics.totalSponsorshipsAmount.toLocaleString('en-IN')}`}
              icon={Award}
              iconBg="bg-blue-50 text-blue-700"
              onClick={() => setActiveTab('sponsorships')}
            />
            <ModuleMetricCard
              label="Earmarked Categories"
              value={donationCategories.length}
              icon={Layers}
              iconBg="bg-purple-50 text-purple-700"
              onClick={() => setActiveTab('categories')}
            />
          </div>

          {/* Row 2: Charts & Allocations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Earmarked Trust Funds & Sacred Endowments (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-stone-150">
                  <h3 className="text-sm font-bold text-stone-900">
                    Earmarked Trust Fund Allocation
                  </h3>
                  <span className="text-xs font-semibold text-stone-500 font-mono">
                    5 Endowments • ₹12,48,350 Total
                  </span>
                </div>

                {/* Fund Allocation Clean Rows */}
                <div className="space-y-3.5 my-1">
                  {[
                    { name: 'Nitya Annadanam Free Meals', amount: '₹4,49,400', pct: 36, color: 'bg-[#55132D]' },
                    { name: 'Sanctum Heritage & Conservation', amount: '₹3,24,570', pct: 26, color: 'bg-amber-600' },
                    { name: 'Kalyansagar Lake Preservation', amount: '₹1,99,730', pct: 16, color: 'bg-teal-600' },
                    { name: 'Veda Pathshala & Priest Welfare', amount: '₹1,49,800', pct: 12, color: 'bg-purple-600' },
                    { name: 'Pilgrim Yatri Niwas & Rest Pavilions', amount: '₹1,24,850', pct: 10, color: 'bg-blue-600' },
                  ].map((fund, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-stone-800">{fund.name}</span>
                        <span className="font-bold text-stone-900 font-number">
                          {fund.amount} <span className="text-stone-500 font-normal">({fund.pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${fund.color}`}
                          style={{ width: `${fund.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Channels & Mode Breakdown */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-150">
                  <h3 className="text-sm font-bold text-stone-900">Payment Channels</h3>
                  <CreditCard className="w-4 h-4 text-stone-400" />
                </div>

                {/* Donut Chart */}
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'UPI & QR Counter', value: 70144, color: '#55132D' },
                          { name: 'Bank NEFT / RTGS', value: 24112, color: '#B68A36' },
                          { name: 'Physical Hundi & Cash', value: 15345, color: '#2563EB' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={44}
                        outerRadius={66}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {[
                          { color: '#55132D' },
                          { color: '#B68A36' },
                          { color: '#2563EB' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e7e5e4',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Channel Breakdown Legend */}
                <div className="space-y-2 pt-2 border-t border-stone-150 text-xs">
                  {[
                    { name: 'UPI & QR Counter', pct: '64%', amount: '₹70,144', color: '#55132D' },
                    { name: 'Bank NEFT / RTGS', pct: '22%', amount: '₹24,112', color: '#B68A36' },
                    { name: 'Physical Hundi & Cash', pct: '14%', amount: '₹15,345', color: '#2563EB' },
                  ].map((ch) => (
                    <div key={ch.name} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 truncate pr-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ch.color }} />
                        <span className="text-stone-700 font-medium truncate">{ch.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-number font-bold text-stone-900 whitespace-nowrap">
                        <span className="text-stone-500 font-normal">({ch.pct})</span>
                        <span>{ch.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setActiveTab('donations-sponsorships'); setDonationSubView('donations'); }}
                className="mt-3 pt-2.5 border-t border-stone-150 text-xs font-semibold text-[#55132D] hover:underline flex items-center justify-between w-full cursor-pointer"
              >
                <span>View Full Donations Register</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* TAB 2: DONATIONS & SPONSORSHIPS */}
      {activeTab === 'donations-sponsorships' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg w-fit border border-stone-200">
            <button
              onClick={() => setDonationSubView('donations')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                donationSubView === 'donations'
                  ? 'bg-white text-[#55132D] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Donations Register ({donations.length})
            </button>
            <button
              onClick={() => setDonationSubView('sponsorships')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                donationSubView === 'sponsorships'
                  ? 'bg-white text-[#55132D] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sponsorship Programs ({sponsorships.length})
            </button>
          </div>

          {donationSubView === 'donations' && (
            <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Donor Name, ID, Receipt No, or Mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="All">All Categories</option>
                {donationCategories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Verified">Verified</option>
                <option value="Pending Verification">Pending Verification</option>
              </select>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Donation ID</th>
                    <th className="py-3 px-4">Donor Information</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment Mode & Ref</th>
                    <th className="py-3 px-4">Receipt No.</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                  {filteredDonations.map((d) => (
                    <tr key={d.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#55132D] whitespace-nowrap">
                        {d.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            const dev = getDevoteeById(d.devoteeId);
                            if (dev) setSelectedDevoteeForProfile(dev);
                          }}
                          className="font-bold text-stone-900 hover:text-[#55132D] hover:underline text-left block"
                        >
                          {d.donorName}
                        </button>
                        <span className="text-[11px] text-stone-500">{d.mobile}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-stone-900 block">{d.category}</span>
                        <span className="text-[11px] text-stone-400">{d.date}</span>
                      </td>

                      <td className="py-3.5 px-4 font-serif font-bold text-base text-stone-900 whitespace-nowrap">
                        ₹{d.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-stone-800 block">{d.paymentMode}</span>
                        <span className="font-mono text-[11px] text-stone-400">{d.transactionRef}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-stone-700 whitespace-nowrap">
                        {d.receiptNumber || 'Pending'}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            d.paymentStatus === 'Verified'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {d.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReceipt(d)}
                            className="p-1.5 text-stone-500 hover:text-[#55132D] hover:bg-stone-100 rounded-md"
                            title="Print Voucher Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {d.paymentStatus === 'Pending Verification' && (
                            <button
                              onClick={() => verifyDonation(d.id)}
                              className="px-2 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                            >
                              Verify
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

          {donationSubView === 'sponsorships' && (
            <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                Temple Sponsorship & Endowment Programs
              </h3>
            </div>
            <button
              onClick={() => setIsSponsorshipOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Record New Sponsorship</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sponsorships.map((spon) => (
              <div key={spon.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#55132D] bg-[#55132D]/10 px-2 py-0.5 rounded">
                      {spon.id}
                    </span>
                    <h4 className="text-base font-bold text-stone-900 font-serif mt-1">{spon.sponsorName}</h4>
                    <p className="text-xs text-stone-500">{spon.associatedEvent}</p>
                  </div>
                  <span className="text-lg font-bold font-serif text-[#55132D]">
                    ₹{spon.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg text-xs space-y-1.5 border border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Program Category:</span>
                    <strong className="text-stone-800">{spon.category}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Sponsorship Date:</span>
                    <span className="text-stone-700">{spon.sponsorshipDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Acknowledgement:</span>
                    <span className="font-semibold text-emerald-800">{spon.acknowledgementStatus}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-500 italic truncate max-w-xs">{spon.remarks}</span>
                  <button
                    onClick={() => {
                      const dev = getDevoteeById(spon.devoteeId);
                      if (dev) setSelectedDevoteeForProfile(dev);
                    }}
                    className="text-xs font-semibold text-[#55132D] hover:underline"
                  >
                    View Patron Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
          )}
        </div>
      )}

      {/* TAB 3: RECEIPTS & FUNDS */}
      {activeTab === 'receipts-funds' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg w-fit border border-stone-200">
            <button
              onClick={() => setReceiptSubView('receipts')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                receiptSubView === 'receipts'
                  ? 'bg-white text-[#55132D] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Receipts Directory
            </button>
            <button
              onClick={() => setReceiptSubView('funds')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                receiptSubView === 'funds'
                  ? 'bg-white text-[#55132D] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Earmarked Trust Funds ({donationCategories.length})
            </button>
          </div>

          {receiptSubView === 'receipts' && (
            <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif">Electronic Receipt Register</h3>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Register</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {donations.filter((d) => d.receiptNumber).map((d) => (
              <div key={d.receiptNumber} className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#55132D]">{d.receiptNumber}</span>
                    <div className="text-[11px] text-stone-400 mt-0.5">{d.date}</div>
                  </div>
                  <span className="font-bold text-stone-900 font-serif">₹{d.amount.toLocaleString('en-IN')}</span>
                </div>

                <div className="text-xs text-stone-700">
                  <strong className="block truncate">{d.donorName}</strong>
                  <span className="text-[11px] text-stone-500 truncate block">{d.category}</span>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                    VERIFIED VOUCHER
                  </span>
                  <button
                    onClick={() => setSelectedReceipt(d)}
                    className="px-2.5 py-1 text-xs font-bold text-[#55132D] hover:bg-[#55132D]/10 rounded flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
          )}

          {receiptSubView === 'funds' && (
            <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 font-serif">Configured Earmarked Trust Funds</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donationCategories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {cat.code}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <h4 className="text-sm font-bold text-stone-900 font-serif">{cat.name}</h4>
                <p className="text-xs text-stone-600 leading-relaxed min-h-[36px]">{cat.description}</p>

                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[11px] text-stone-500 block mb-1">Suggested Slabs:</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.suggestedAmounts.map((amt) => (
                      <span key={amt} className="px-1.5 py-0.5 rounded bg-stone-50 border border-stone-200 text-[10px] font-medium text-stone-700">
                        ₹{amt.toLocaleString('en-IN')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
          )}
        </div>
      )}

      {/* Modals & Profile Drawer */}
      <RecordDonationModal
        isOpen={isRecordDonationOpen}
        onClose={() => setIsRecordDonationOpen(false)}
      />

      <CreateSponsorshipModal
        isOpen={isSponsorshipOpen}
        onClose={() => setIsSponsorshipOpen(false)}
      />

      <ReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receiptData={selectedReceipt}
      />

      <DevoteeProfileDrawer
        devotee={selectedDevoteeForProfile}
        onClose={() => setSelectedDevoteeForProfile(null)}
      />
    </div>
  );
}

