import React, { useState, useMemo } from 'react';
import {
  Crown,
  Users,
  Award,
  Calendar,
  Gift,
  Truck,
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Plus,
  Phone,
  Mail,
  MapPin,
  X,
  CreditCard,
  TrendingUp,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useDevoteeServices } from '../context/DevoteeServicesContext';
import ModulePageHeader from '../components/devotee-services/shared/ModulePageHeader';
import ModuleTabs from '../components/devotee-services/shared/ModuleTabs';
import ModuleMetricCard from '../components/devotee-services/shared/ModuleMetricCard';

export default function Membership() {
  const {
    members,
    membershipTiers,
    sankalpaPujas,
    kitDispatches,
    addMember,
    updateMemberStatus,
    completeSankalpaPuja,
    updateKitDispatch,
  } = useDevoteeServices();

  const [activeTab, setActiveTab] = useState('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Member Form
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    city: 'Agartala',
    state: 'Tripura',
    address: '',
    tierId: 'silver',
    gotra: 'Kashyapa',
    nakshatra: '',
    paymentMode: 'Temple Cash Counter',
    panNumber: '',
    sankalpaDate: '',
    sankalpaOccasion: '',
  });

  // Metrics
  const metrics = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === 'Active').length;
    const totalRevenue = members.reduce((sum, m) => sum + (m.amount || 0), 0);
    const scheduledPujas = sankalpaPujas.filter((p) => p.status === 'Scheduled').length;
    const pendingKits = kitDispatches.filter((k) => k.status !== 'Delivered').length;
    return { total, active, totalRevenue, scheduledPujas, pendingKits };
  }, [members, sankalpaPujas, kitDispatches]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (tierFilter !== 'All' && m.tierId !== tierFilter && m.alias !== tierFilter) return false;
      if (statusFilter !== 'All' && m.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.name?.toLowerCase().includes(q) ||
          m.id?.toLowerCase().includes(q) ||
          m.mobile?.includes(q) ||
          m.city?.toLowerCase().includes(q) ||
          m.gotra?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [members, tierFilter, statusFilter, searchQuery]);

  // Submit new member
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      alert('Please provide member name and mobile number.');
      return;
    }
    const tier = membershipTiers.find((t) => t.id === formData.tierId || t.alias === formData.tierId) || membershipTiers[0];
    const durationYears = (tier.id === 'annual' || tier.id === 'sevadhari') ? 1 : (tier.id === 'silver' || tier.id === 'kalyani') ? 5 : 99;
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + durationYears);
    const validUntil = tier.duration === 'Lifetime' || tier.duration === 'Permanent'
      ? tier.duration
      : expDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    addMember({
      name: formData.name,
      mobile: formData.mobile.startsWith('+91') ? formData.mobile : `+91 ${formData.mobile}`,
      email: formData.email,
      city: formData.city,
      state: formData.state,
      address: formData.address || `${formData.city}, ${formData.state}`,
      tierId: tier.id,
      tierName: tier.name,
      gotra: formData.gotra,
      nakshatra: formData.nakshatra,
      joiningDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      validUntil,
      duration: tier.duration,
      amount: tier.fee,
      paymentMode: formData.paymentMode,
      status: 'Active',
      darshanPassesTotal: tier.darshanPasses,
      darshanPassesUsed: 0,
      familyMembers: [],
      sankalpaDate: formData.sankalpaDate || '2026-11-20',
      sankalpaOccasion: formData.sankalpaOccasion || 'Family Well-being',
      panNumber: formData.panNumber,
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      mobile: '',
      email: '',
      city: 'Agartala',
      state: 'Tripura',
      address: '',
      tierId: 'silver',
      gotra: 'Kashyapa',
      nakshatra: '',
      paymentMode: 'Temple Cash Counter',
      panNumber: '',
      sankalpaDate: '',
      sankalpaOccasion: '',
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Member ID', 'Name', 'Mobile', 'City', 'Tier', 'Valid Until', 'Amount', 'Passes Left', 'Status'];
    const rows = filteredMembers.map((m) => [
      `"${m.id}"`,
      `"${m.name}"`,
      `"${m.mobile}"`,
      `"${m.city}"`,
      `"${m.tierName}"`,
      `"${m.validUntil}"`,
      m.amount || 0,
      m.darshanPassesTotal - m.darshanPassesUsed,
      `"${m.status}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `temple_members_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const chartData = membershipTiers.map((t) => ({
    name: t.name.split(' ')[0],
    count: members.filter((m) => m.tierId === t.id).length || t.activeCount || 0,
  }));

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <ModulePageHeader
        title="Devotee Membership Desk"
        subtitle="Manage patron registry, annual priest sankalpa schedule, fast-track VIP passes, and consecrated Mahaprasad dispatches."
        primaryActionLabel="+ Register Member"
        primaryActionIcon={Plus}
        onPrimaryAction={() => setIsAddModalOpen(true)}
        secondaryAction={
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#55132D]" />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <ModuleMetricCard
          label="Active Patrons"
          value={metrics.active}
          subtitle="Registered devotees"
          icon={Crown}
          iconBg="bg-amber-100 text-amber-900"
        />
        <ModuleMetricCard
          label="Total Contributions"
          value={`₹${(metrics.totalRevenue / 100000).toFixed(1)}L`}
          subtitle="80G Trust Corpus"
          icon={Award}
          iconBg="bg-[#55132D]/10 text-[#55132D]"
        />
        <ModuleMetricCard
          label="Sankalpa Pujas"
          value={metrics.scheduledPujas}
          subtitle="Scheduled pujas"
          icon={Flame}
          iconBg="bg-rose-100 text-rose-900"
        />
        <ModuleMetricCard
          label="Pending Dispatches"
          value={metrics.pendingKits}
          subtitle="Prasad Speed Post"
          icon={Truck}
          iconBg="bg-emerald-100 text-emerald-900"
        />
      </div>

      {/* Navigation Tabs */}
      <ModuleTabs
        tabs={[
          { id: 'directory', label: 'Member Directory', icon: Users, badge: filteredMembers.length },
          { id: 'sankalpa', label: 'Priest Sankalpa Roster', icon: Calendar, badge: metrics.scheduledPujas },
          { id: 'fulfillment', label: 'Prasad Dispatches', icon: Gift, badge: metrics.pendingKits },
          { id: 'tiers', label: 'Tiers & Fees', icon: Award },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        ]}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* ========================================================
          TAB 1: MEMBER DIRECTORY
         ======================================================== */}
      {activeTab === 'directory' && (
        <div className="space-y-3.5">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl p-3 border border-stone-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, ID, phone, gotra, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#55132D]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Tiers</option>
                <option value="annual">Annual Seva</option>
                <option value="silver">Silver Patron</option>
                <option value="gold">Gold Lifetime</option>
                <option value="platinum">Platinum Benefactor</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending Verification">Pending</option>
              </select>
            </div>
          </div>

          {/* Clean Members Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[11px]">
                    <th className="py-2.5 px-3.5">Member ID & Devotee</th>
                    <th className="py-2.5 px-3.5">Tier</th>
                    <th className="py-2.5 px-3.5">Contact & City</th>
                    <th className="py-2.5 px-3.5">Gotra</th>
                    <th className="py-2.5 px-3.5">Valid Until</th>
                    <th className="py-2.5 px-3.5">Passes Left</th>
                    <th className="py-2.5 px-3.5">Status</th>
                    <th className="py-2.5 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-stone-500">
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => {
                      const passesLeft = m.darshanPassesTotal - m.darshanPassesUsed;
                      return (
                        <tr key={m.id} className="hover:bg-amber-50/20 transition-colors">
                          <td className="py-2.5 px-3.5">
                            <span className="font-bold text-stone-900 block">{m.name}</span>
                            <span className="font-mono text-[10.5px] text-[#55132D] font-semibold">{m.id}</span>
                          </td>
                          <td className="py-2.5 px-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                              {m.tierName}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5">
                            <span className="block font-medium text-stone-800">{m.mobile}</span>
                            <span className="text-[11px] text-stone-500">{m.city}</span>
                          </td>
                          <td className="py-2.5 px-3.5 font-medium text-stone-700">
                            {m.gotra || '—'}
                          </td>
                          <td className="py-2.5 px-3.5 text-stone-700">
                            {m.validUntil}
                          </td>
                          <td className="py-2.5 px-3.5">
                            <span className="font-bold text-emerald-700">{passesLeft}</span>
                            <span className="text-stone-400 text-[10.5px]">/{m.darshanPassesTotal}</span>
                          </td>
                          <td className="py-2.5 px-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {m.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <button
                              onClick={() => setSelectedMember(m)}
                              className="p-1.5 text-stone-600 hover:text-[#55132D] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                              title="View Member Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: PRIEST SANKALPA ROSTER
         ======================================================== */}
      {activeTab === 'sankalpa' && (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {sankalpaPujas.map((puja) => (
              <div key={puja.id} className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs space-y-3">
                <div className="flex justify-between items-start border-b border-stone-100 pb-2">
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">{puja.memberName}</h4>
                    <span className="text-[11px] text-stone-500">{puja.tierName} • {puja.memberId}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    puja.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {puja.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Date & Slot:</span>
                    <span className="font-semibold text-stone-900">{puja.date} ({puja.timeSlot})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Gotra / Star:</span>
                    <span>{puja.gotra} Gotra • {puja.nakshatra || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Occasion:</span>
                    <span>{puja.occasion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Priest:</span>
                    <span className="font-semibold text-[#55132D]">{puja.priest}</span>
                  </div>
                </div>

                {puja.status === 'Scheduled' && (
                  <div className="pt-2 border-t border-stone-100 flex justify-end">
                    <button
                      onClick={() => completeSankalpaPuja(puja.id, 'Pt. Bhabatosh Bhattacharya')}
                      className="px-3 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E2BC6B]" />
                      <span>Complete Archana</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: PRASAD DISPATCHES
         ======================================================== */}
      {activeTab === 'fulfillment' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[11px]">
                  <th className="py-2.5 px-3.5">Dispatch ID & Patron</th>
                  <th className="py-2.5 px-3.5">Items</th>
                  <th className="py-2.5 px-3.5">Destination</th>
                  <th className="py-2.5 px-3.5">Carrier & Tracking</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {kitDispatches.map((k) => (
                  <tr key={k.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3.5">
                      <span className="font-bold text-stone-900 block">{k.memberName}</span>
                      <span className="text-[10.5px] text-stone-500 font-mono">{k.memberId}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-stone-700">{k.items}</td>
                    <td className="py-2.5 px-3.5 text-stone-600 truncate max-w-xs">{k.address}</td>
                    <td className="py-2.5 px-3.5">
                      <span className="font-medium text-stone-800 block">{k.carrier}</span>
                      <span className="font-mono text-[#55132D] font-bold text-[11px]">{k.trackingNumber}</span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        k.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                      }`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      {k.status !== 'Delivered' && (
                        <button
                          onClick={() => {
                            const newTracking = prompt('Enter Speed Post Tracking ID:', k.trackingNumber);
                            if (newTracking) updateKitDispatch(k.id, newTracking, 'Dispatched');
                          }}
                          className="px-2.5 py-1 bg-[#55132D] text-white rounded-lg text-xs font-semibold hover:bg-[#681B37] cursor-pointer"
                        >
                          Update Tracking
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: TIERS & FEES
         ======================================================== */}
      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {membershipTiers.map((t) => (
            <div key={t.id} className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  {t.badge}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {t.activeCount} Patrons
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900">{t.name}</h4>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[#55132D]">{t.feeLabel}</span>
                  <span className="text-xs text-stone-500">/ {t.duration}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                {t.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-1">
                    <span className="text-emerald-600">✓</span>
                    <span className="text-[11px] leading-tight">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          TAB 5: ANALYTICS
         ======================================================== */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs">
            <h4 className="font-bold text-xs text-stone-900 mb-3">Patrons by Membership Tier</h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#55132D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs space-y-3">
            <h4 className="font-bold text-xs text-stone-900">Demographic Origin</h4>
            <div className="space-y-2 text-xs">
              {[
                { state: 'Tripura (Home State)', count: '58%' },
                { state: 'West Bengal', count: '24%' },
                { state: 'Assam & North East', count: '12%' },
                { state: 'Rest of India', count: '6%' },
              ].map((row, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-stone-700 font-medium">{row.state}</span>
                  <span className="font-bold text-stone-900">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MEMBER DETAIL DRAWER */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm h-full shadow-xl flex flex-col justify-between p-5 text-xs animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{selectedMember.name}</h3>
                  <span className="font-mono text-[11px] text-[#55132D]">{selectedMember.id}</span>
                </div>
                <button onClick={() => setSelectedMember(null)} className="text-stone-400 hover:text-stone-600 text-sm font-bold">
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Tier:</span>
                    <span className="font-bold text-stone-900">{selectedMember.tierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Validity:</span>
                    <span className="font-medium">{selectedMember.validUntil}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Gotra:</span>
                    <span className="font-semibold text-stone-900">{selectedMember.gotra}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Mobile:</span>
                    <span>{selectedMember.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">City / State:</span>
                    <span>{selectedMember.city}, {selectedMember.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Passes Left:</span>
                    <span className="font-bold text-emerald-700">
                      {selectedMember.darshanPassesTotal - selectedMember.darshanPassesUsed} of {selectedMember.darshanPassesTotal}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-lg hover:bg-stone-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-xl border border-stone-200 space-y-3.5 text-xs animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
              <span className="font-bold text-sm text-stone-900">Register Devotee Member</span>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-stone-700 mb-0.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-8 px-2.5 bg-stone-50 rounded-lg border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-0.5">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full h-8 px-2.5 bg-stone-50 rounded-lg border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-0.5">Membership Tier</label>
                  <select
                    value={formData.tierId}
                    onChange={(e) => setFormData({ ...formData, tierId: e.target.value })}
                    className="w-full h-8 px-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-800"
                  >
                    <option value="annual">Annual Seva Member (₹2,100 / 1 Yr)</option>
                    <option value="silver">Silver Patron (₹11,000 / 5 Yrs)</option>
                    <option value="gold">Gold Lifetime Patron (₹51,000 / Lifetime)</option>
                    <option value="platinum">Platinum Benefactor (₹1,00,000+ / Permanent)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-0.5">Gotra *</label>
                  <input
                    type="text"
                    required
                    value={formData.gotra}
                    onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                    className="w-full h-8 px-2.5 bg-stone-50 rounded-lg border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-0.5">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-8 px-2.5 bg-stone-50 rounded-lg border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-0.5">Payment Mode</label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="w-full h-8 px-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-800"
                  >
                    <option value="Temple Cash Counter">Temple Cash Counter</option>
                    <option value="Online UPI / QR">Online UPI / QR</option>
                    <option value="Direct NEFT Transfer">Direct NEFT Transfer</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 bg-stone-100 text-stone-700 font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#55132D] text-white font-bold rounded-lg hover:bg-[#681B37] cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
