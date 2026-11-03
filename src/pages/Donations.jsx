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

  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: HeartHandshake },
    { id: 'donations', label: 'Donations Register', icon: DollarSign, badge: donations.length },
    { id: 'sponsorships', label: 'Sponsorship Programs', icon: Award, badge: sponsorships.length },
    { id: 'receipts', label: 'Receipts Directory', icon: FileCheck },
    { id: 'categories', label: 'Earmarked Funds', icon: Layers },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <ModulePageHeader
        title="Donations & Sponsorships Administration"
        subtitle="Record temple contributions, earmarked trust funds, sponsorship programs and verified electronic vouchers"
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
              subtitle="All vouchers generated"
              icon={CheckCircle2}
              iconBg="bg-emerald-50 text-emerald-700"
            />
            <ModuleMetricCard
              label="Pending Audit Review"
              value={metrics.pendingTransactions}
              subtitle="POS clearance check"
              icon={Clock}
              iconBg="bg-amber-50 text-amber-700"
              onClick={() => setActiveTab('donations')}
            />
            <ModuleMetricCard
              label="Sponsorship Programs"
              value={`₹${metrics.totalSponsorshipsAmount.toLocaleString('en-IN')}`}
              subtitle={`${sponsorships.length} patrons committed`}
              icon={Award}
              iconBg="bg-blue-50 text-blue-700"
              onClick={() => setActiveTab('sponsorships')}
            />
            <ModuleMetricCard
              label="Earmarked Categories"
              value={donationCategories.length}
              subtitle="Active trust funds"
              icon={Layers}
              iconBg="bg-purple-50 text-purple-700"
              onClick={() => setActiveTab('categories')}
            />
          </div>

          {/* Row 2: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Earmarked Trust Funds & Sacred Endowments (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-200/70">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 font-serif">
                      Earmarked Trust Fund Allocation &amp; Sacred Endowments
                    </h3>
                  </div>
                </div>

                {/* Channel Distribution Mini-strip */}
                <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="text-[10px] uppercase font-bold text-stone-500">UPI / QR Counter</div>
                    <div className="font-number font-bold text-stone-900 text-sm mt-0.5">64%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="text-[10px] uppercase font-bold text-stone-500">Bank NEFT / RTGS</div>
                    <div className="font-number font-bold text-stone-900 text-sm mt-0.5">22%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="text-[10px] uppercase font-bold text-stone-500">Physical Hundi &amp; Cash</div>
                    <div className="font-number font-bold text-[#55132D] text-sm mt-0.5">14%</div>
                  </div>
                </div>

                {/* Fund Allocation Bars */}
                <div className="space-y-3.5 my-1">
                  {[
                    { name: 'Nitya Annadanam Free Meals Fund', amount: '₹4,49,400', pct: 36, color: 'bg-[#55132D]', desc: 'Daily Pilgrim Community Dining' },
                    { name: 'Sanctum Heritage & Shikhara Conservation', amount: '₹3,24,570', pct: 26, color: 'bg-amber-600', desc: 'Temple Architectural Preservation' },
                    { name: 'Sacred Kalyansagar Lake & Bostami Turtle Habitat', amount: '₹1,99,730', pct: 16, color: 'bg-teal-600', desc: 'Ecological & Lake Ghat Safety' },
                    { name: 'Veda Pathshala & Purohit Welfare Trust', amount: '₹1,49,800', pct: 12, color: 'bg-purple-600', desc: 'Vedic Learning & Priest Healthcare' },
                    { name: 'Pilgrim Yatri Niwas & Rest Pavilions', amount: '₹1,24,850', pct: 10, color: 'bg-blue-600', desc: 'Shelters & Clean Drinking Water' },
                  ].map((fund, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-800">{fund.name}</span>
                          <span className="text-[10px] text-stone-400 font-medium">({fund.desc})</span>
                        </div>
                        <span className="font-bold text-stone-900 font-number">
                          {fund.amount} <span className="text-stone-500 font-normal">({fund.pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
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

            {/* Distribution Donut */}
            <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-stone-900 font-serif">Category Allocation</h3>
                  <PieChartIcon className="w-4 h-4 text-stone-400" />
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={68}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
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

                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                  {distributionData.slice(0, 3).map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 truncate pr-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-stone-700 truncate">{item.name}</span>
                      </div>
                      <span className="font-number font-bold text-stone-900 whitespace-nowrap">₹{item.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('donations')}
                className="mt-3 pt-2 border-t border-stone-100 text-xs font-semibold text-[#55132D] hover:underline flex items-center justify-between"
              >
                <span>View Full Register</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DONATIONS REGISTER */}
      {activeTab === 'donations' && (
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

      {/* TAB 3: SPONSORSHIPS */}
      {activeTab === 'sponsorships' && (
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

      {/* TAB 4: RECEIPTS DIRECTORY */}
      {activeTab === 'receipts' && (
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

      {/* TAB 5: CATEGORIES & CONFIGURATION */}
      {activeTab === 'categories' && (
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

