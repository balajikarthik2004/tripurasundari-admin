import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Calendar,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDevoteeServices } from '../context/DevoteeServicesContext';
import ModulePageHeader from '../components/devotee-services/shared/ModulePageHeader';
import ModuleTabs from '../components/devotee-services/shared/ModuleTabs';
import ModuleMetricCard from '../components/devotee-services/shared/ModuleMetricCard';
import DevoteeProfileDrawer from '../components/devotee-services/shared/DevoteeProfileDrawer';
import AddEditDevoteeModal from '../components/devotee-services/devotees/AddEditDevoteeModal';

export default function Devotees() {
  const { devotees, getDevoteeActivity } = useDevoteeServices();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [segmentFilter, setSegmentFilter] = useState('All');

  const [selectedDevoteeForProfile, setSelectedDevoteeForProfile] = useState(null);
  const [editingDevotee, setEditingDevotee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Metrics
  const metrics = useMemo(() => {
    const total = devotees.length;
    const active = devotees.filter((d) => d.status === 'Active').length;
    const patrons = devotees.filter((d) => d.segment === 'Patron Donor').length;
    const repeats = devotees.filter((d) => d.segment === 'Repeat Visitor').length;
    const newRegs = devotees.filter((d) => d.segment === 'New Devotee').length;
    return { total, active, patrons, repeats, newRegs };
  }, [devotees]);

  // Unique cities for filter dropdown
  const cities = useMemo(() => {
    return Array.from(new Set(devotees.map((d) => d.city))).filter(Boolean);
  }, [devotees]);

  // Filtered Devotees
  const filteredDevotees = useMemo(() => {
    return devotees.filter((d) => {
      if (cityFilter !== 'All' && d.city !== cityFilter) return false;
      if (segmentFilter !== 'All' && d.segment !== segmentFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesId = d.id.toLowerCase().includes(q);
        const matchesName = d.name.toLowerCase().includes(q);
        const matchesMobile = d.mobile.includes(q);
        const matchesCity = d.city.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesMobile && !matchesCity) return false;
      }
      return true;
    });
  }, [devotees, cityFilter, segmentFilter, searchTerm]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Devotee ID', 'Name', 'Mobile', 'Email', 'City', 'State', 'Segment', 'Registration Date', 'Status'];
    const rows = filteredDevotees.map((d) => [
      `"${d.id}"`,
      `"${d.name}"`,
      `"${d.mobile}"`,
      `"${d.email || ''}"`,
      `"${d.city}"`,
      `"${d.state}"`,
      `"${d.segment}"`,
      `"${d.registrationDate}"`,
      `"${d.status}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `devotees_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const trendData = [
    { month: 'Jun', count: 120 },
    { month: 'Jul', count: 180 },
    { month: 'Aug', count: 240 },
    { month: 'Sep', count: 310 },
    { month: 'Oct', count: 390 },
  ];

  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'all', label: 'All Devotees Directory', icon: Users, badge: devotees.length },
    { id: 'segments', label: 'Devotee Segments', icon: Filter },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <ModulePageHeader
        title="Devotee Directory & Patron Profiles"
        subtitle="Central identity register, unified activity lifecycle across bookings, donations, poojas and accommodations"
        primaryActionLabel="Register Devotee"
        onPrimaryAction={() => {
          setEditingDevotee(null);
          setIsAddModalOpen(true);
        }}
        primaryActionIcon={UserPlus}
      />

      {/* Tabs Navigation */}
      <ModuleTabs tabs={tabsConfig} activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <ModuleMetricCard
              label="Registered Devotees"
              value={metrics.total}
              trend="+18% pilgrimage growth"
              icon={Users}
              iconBg="bg-[#55132D]/10 text-[#55132D]"
            />
            <ModuleMetricCard
              label="Active Status"
              value={metrics.active}
              subtitle="Verified KYC identities"
              icon={CheckCircle2}
              iconBg="bg-emerald-50 text-emerald-700"
            />
            <ModuleMetricCard
              label="Patron Donors"
              value={metrics.patrons}
              subtitle="Regular trust benefactors"
              icon={Sparkles}
              iconBg="bg-amber-50 text-amber-700"
            />
            <ModuleMetricCard
              label="Repeat Visitors"
              value={metrics.repeats}
              subtitle="Multiple annual visits"
              icon={Clock}
              iconBg="bg-blue-50 text-blue-700"
            />
            <ModuleMetricCard
              label="New Registrations"
              value={metrics.newRegs}
              subtitle="Joined this month"
              icon={UserPlus}
              iconBg="bg-purple-50 text-purple-700"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Pilgrim Origin & Regional Inflow Distribution (2 Cols) */}
            {/* Pilgrim Geographic Origin & Regional Inflow (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-200/70">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 font-serif">
                      Pilgrim Geographic Origin &amp; Regional Inflow
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#55132D] bg-[#55132D]/10 px-2.5 py-1 rounded-md">
                    Active Trust Registry
                  </span>
                </div>

                {/* Devotee Tier Summary Pills */}
                <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="text-[10px] uppercase font-bold text-stone-500">Patron Donors</div>
                    <div className="font-serif font-bold text-stone-900 text-sm mt-0.5">{metrics.patrons}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="text-[10px] uppercase font-bold text-stone-500">Repeat Yatris</div>
                    <div className="font-serif font-bold text-stone-900 text-sm mt-0.5">{metrics.repeats}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="text-[10px] uppercase font-bold text-stone-500">New Registrations</div>
                    <div className="font-serif font-bold text-[#55132D] text-sm mt-0.5">{metrics.newRegs}</div>
                  </div>
                </div>

                {/* Horizontal Ranked Region Bars */}
                <div className="space-y-3.5 my-1">
                  {[
                    { region: 'Tripura (Gomati, Agartala & South Tripura)', devotees: '13,320', pct: 54, color: 'bg-[#55132D]', hub: 'Home State Yatra' },
                    { region: 'Assam & Barak Valley (Silchar, Guwahati, Karimganj)', devotees: '5,920', pct: 24, color: 'bg-amber-600', hub: 'Interstate Pilgrim Corridor' },
                    { region: 'West Bengal (Kolkata, Howrah, Siliguri)', devotees: '3,450', pct: 14, color: 'bg-teal-600', hub: 'Shakti Peeth Circuit' },
                    { region: 'Rest of India & International (Dhaka / Sylhet Yatris)', devotees: '1,990', pct: 8, color: 'bg-blue-600', hub: 'Cross-Border & NRI Yatris' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-800">{item.region}</span>
                          <span className="text-[10px] text-stone-400 font-medium">({item.hub})</span>
                        </div>
                        <span className="font-bold text-stone-900 font-mono">
                          {item.devotees} <span className="text-stone-500 font-normal">({item.pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif mb-3">
                  Recently Enrolled Devotees
                </h3>

                <div className="space-y-2.5">
                  {devotees.slice(0, 4).map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDevoteeForProfile(d)}
                      className="p-2.5 rounded-lg border border-stone-100 bg-stone-50/60 hover:bg-stone-100 cursor-pointer transition-colors text-xs"
                    >
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>{d.name}</span>
                        <span className="font-mono text-[#55132D] text-[11px]">{d.id}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-500 mt-0.5">
                        <span>{d.city}, {d.state}</span>
                        <span>{d.segment}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('all')}
                className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-[#55132D] hover:underline flex items-center justify-between"
              >
                <span>Browse All Devotees</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL DEVOTEES DIRECTORY */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Search, Filters & Export */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Devotee Name, ID (DEV-...), Mobile, or City..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="All">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="All">All Segments</option>
                <option value="Registered Devotee">Registered Devotee</option>
                <option value="Repeat Visitor">Repeat Visitor</option>
                <option value="Patron Donor">Patron Donor</option>
                <option value="Local Devotee">Local Devotee</option>
                <option value="New Devotee">New Devotee</option>
              </select>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 flex items-center gap-1.5"
                title="Export Devotees Directory to CSV"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Devotees Table */}
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Devotee ID</th>
                    <th className="py-3 px-4">Devotee Name</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">City / State</th>
                    <th className="py-3 px-4">Segment</th>
                    <th className="py-3 px-4 text-center">Darshan</th>
                    <th className="py-3 px-4 text-center">Pooja</th>
                    <th className="py-3 px-4 text-center">Donations</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                  {filteredDevotees.map((d) => {
                    const act = getDevoteeActivity(d.id);
                    return (
                      <tr
                        key={d.id}
                        onClick={() => setSelectedDevoteeForProfile(d)}
                        className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#55132D] whitespace-nowrap">
                          {d.id}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{d.name}</div>
                          <div className="text-[11px] text-stone-500 truncate max-w-xs">{d.email || 'No email registered'}</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-stone-700 whitespace-nowrap">
                          {d.mobile}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-stone-900 block">{d.city}</span>
                          <span className="text-[11px] text-stone-500">{d.state}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                            {d.segment}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-stone-800">
                          {act.darshan.length}
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-stone-800">
                          {act.pooja.length}
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-stone-800">
                          {act.donations.length}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {d.status}
                          </span>
                        </td>

                        <td
                          className="py-3.5 px-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedDevoteeForProfile(d)}
                              className="p-1.5 text-stone-500 hover:text-[#55132D] hover:bg-stone-100 rounded-md transition-colors"
                              title="View Full Profile & Activity"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingDevotee(d);
                                setIsAddModalOpen(true);
                              }}
                              className="p-1.5 text-stone-500 hover:text-[#55132D] hover:bg-stone-100 rounded-md transition-colors"
                              title="Edit Devotee Info"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <div>
                Showing <strong className="text-stone-800">{filteredDevotees.length}</strong> of{' '}
                <strong className="text-stone-800">{devotees.length}</strong> registered devotees
              </div>
              <div className="text-[11px] text-stone-400">
                Click any row to open the complete consolidated activity drawer
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEVOTEE SEGMENTS */}
      {activeTab === 'segments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Patron Donors',
              count: devotees.filter((d) => d.segment === 'Patron Donor').length,
              description: 'Generous recurring benefactors who sponsor Annadanam and infrastructure expansion programs.',
              color: 'border-amber-200 bg-amber-50/30',
              badgeColor: 'bg-amber-100 text-amber-800',
              filterKey: 'Patron Donor',
            },
            {
              title: 'Repeat Visitors',
              count: devotees.filter((d) => d.segment === 'Repeat Visitor').length,
              description: 'Devotees with multiple pilgrimage visits and verified pass bookings.',
              color: 'border-blue-200 bg-blue-50/30',
              badgeColor: 'bg-blue-100 text-blue-800',
              filterKey: 'Repeat Visitor',
            },
            {
              title: 'Local Devotees',
              count: devotees.filter((d) => d.segment === 'Local Devotee').length,
              description: 'Residents of Udaipur and Gomati District participating in weekend aartis and volunteer seva.',
              color: 'border-emerald-200 bg-emerald-50/30',
              badgeColor: 'bg-emerald-100 text-emerald-800',
              filterKey: 'Local Devotee',
            },
            {
              title: 'New Devotees',
              count: devotees.filter((d) => d.segment === 'New Devotee').length,
              description: 'Recently registered pilgrims enrolling for their first darshan pass or pooja ceremony.',
              color: 'border-purple-200 bg-purple-50/30',
              badgeColor: 'bg-purple-100 text-purple-800',
              filterKey: 'New Devotee',
            },
          ].map((seg) => (
            <div
              key={seg.title}
              onClick={() => {
                setSegmentFilter(seg.filterKey);
                setActiveTab('all');
              }}
              className={`p-5 rounded-xl border ${seg.color} shadow-xs cursor-pointer hover:shadow-sm transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-stone-900 font-serif">{seg.title}</h4>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${seg.badgeColor}`}>
                    {seg.count} Devotees
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{seg.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-semibold text-[#55132D]">
                <span>View Segment Members</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Drawer */}
      <DevoteeProfileDrawer
        devotee={selectedDevoteeForProfile}
        onClose={() => setSelectedDevoteeForProfile(null)}
        onEditDevotee={(d) => {
          setSelectedDevoteeForProfile(null);
          setEditingDevotee(d);
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Devotee Modal */}
      <AddEditDevoteeModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDevotee(null);
        }}
        editingDevotee={editingDevotee}
      />
    </div>
  );
}

