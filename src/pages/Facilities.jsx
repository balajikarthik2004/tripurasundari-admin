import React, { useState, useMemo } from 'react';
import {
  Building2,
  Bed,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Clock,
  Eye,
  MapPin,
  Users,
  Calendar,
  User,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useDevoteeServices } from '../context/DevoteeServicesContext';
import ModulePageHeader from '../components/devotee-services/shared/ModulePageHeader';
import ModuleTabs from '../components/devotee-services/shared/ModuleTabs';
import ModuleMetricCard from '../components/devotee-services/shared/ModuleMetricCard';
import DevoteeProfileDrawer from '../components/devotee-services/shared/DevoteeProfileDrawer';
import CreateAccommodationRequestModal from '../components/devotee-services/facilities/CreateAccommodationRequestModal';
import CreateMaintenanceModal from '../components/devotee-services/facilities/CreateMaintenanceModal';

export default function Facilities() {
  const {
    facilities,
    accommodationTypes,
    accommodationRequests,
    maintenanceRequests,
    updateFacilityStatus,
    updateAccommodationStatus,
    updateMaintenanceStatus,
    getDevoteeById,
  } = useDevoteeServices();

  const [activeTab, setActiveTab] = useState('overview');
  const [requestSearch, setRequestSearch] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('All');
  const [facilityCategoryFilter, setFacilityCategoryFilter] = useState('All');

  // Modals & Drawers
  const [isAccommodationModalOpen, setIsAccommodationModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedDevoteeForProfile, setSelectedDevoteeForProfile] = useState(null);

  // Metrics
  const metrics = useMemo(() => {
    const totalFac = facilities.length;
    const operational = facilities.filter((f) => f.operationalStatus === 'Operational').length;
    const maintenanceAlerts = maintenanceRequests.filter((m) => m.status === 'Open' || m.status === 'In Progress' || m.status === 'Assigned').length;
    const activeStays = accommodationRequests.filter((a) => a.status === 'Checked In' || a.status === 'Approved').length;
    const pendingRequests = accommodationRequests.filter((a) => a.status === 'Pending').length;

    return { totalFac, operational, maintenanceAlerts, activeStays, pendingRequests };
  }, [facilities, maintenanceRequests, accommodationRequests]);

  // Filtered Accommodation Requests
  const filteredRequests = useMemo(() => {
    return accommodationRequests.filter((a) => {
      if (requestStatusFilter !== 'All' && a.status !== requestStatusFilter) return false;
      if (requestSearch.trim()) {
        const q = requestSearch.toLowerCase();
        const matchesId = a.id.toLowerCase().includes(q);
        const matchesName = a.devoteeName.toLowerCase().includes(q);
        const matchesMobile = a.mobile.includes(q);
        if (!matchesId && !matchesName && !matchesMobile) return false;
      }
      return true;
    });
  }, [accommodationRequests, requestStatusFilter, requestSearch]);

  // Filtered Facilities
  const filteredFacilities = useMemo(() => {
    if (facilityCategoryFilter === 'All') return facilities;
    return facilities.filter((f) => f.category === facilityCategoryFilter);
  }, [facilities, facilityCategoryFilter]);

  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'facilities', label: 'Facilities Directory', icon: MapPin, badge: facilities.length },
    { id: 'accommodation', label: 'Accommodation Types', icon: Bed },
    { id: 'requests', label: 'Stays & Requests', icon: Calendar, badge: accommodationRequests.length, dot: metrics.pendingRequests > 0 },
    { id: 'maintenance', label: 'Maintenance Log', icon: Wrench, badge: metrics.maintenanceAlerts > 0 ? `${metrics.maintenanceAlerts} Alert` : null, badgeColor: 'bg-rose-100 text-rose-800' },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <ModulePageHeader
        title="Facilities & Accommodation Administration"
        subtitle="Manage pilgrim Yatri Niwas guest shelters, communal dormitories, sanitation, ghat safety and active maintenance tickets"
        primaryActionLabel="Request Accommodation"
        onPrimaryAction={() => setIsAccommodationModalOpen(true)}
        primaryActionIcon={Bed}
      />

      {/* Tabs Navigation */}
      <ModuleTabs tabs={tabsConfig} activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* 5 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <ModuleMetricCard
              label="Configured Facilities"
              value={metrics.totalFac}
              subtitle="Temple campus premises"
              icon={Building2}
              iconBg="bg-[#55132D]/10 text-[#55132D]"
              onClick={() => setActiveTab('facilities')}
            />
            <ModuleMetricCard
              label="Operational Status"
              value={`${Math.round((metrics.operational / metrics.totalFac) * 100)}%`}
              subtitle={`${metrics.operational}/${metrics.totalFac} fully functional`}
              icon={CheckCircle2}
              iconBg="bg-emerald-50 text-emerald-700"
            />
            <ModuleMetricCard
              label="Active Maintenance"
              value={metrics.maintenanceAlerts}
              subtitle="Inspection & repairs"
              icon={Wrench}
              iconBg="bg-rose-50 text-rose-700"
              onClick={() => setActiveTab('maintenance')}
            />
            <ModuleMetricCard
              label="Active Pilgrim Stays"
              value={metrics.activeStays}
              subtitle="Dormitory & guest cottages"
              icon={Bed}
              iconBg="bg-blue-50 text-blue-700"
              onClick={() => setActiveTab('requests')}
            />
            <ModuleMetricCard
              label="Pending Approvals"
              value={metrics.pendingRequests}
              subtitle="Special quota requests"
              icon={Clock}
              iconBg="bg-amber-50 text-amber-700"
              onClick={() => setActiveTab('requests')}
            />
          </div>

          {/* Row 2: Pilgrim Facility & Yatri Niwas Occupancy Meters */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-200/70">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">
                  Pilgrim Shelter &amp; Facility Occupancy Meters
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>All Core Amenities Active</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                { name: 'Yatri Niwas Dormitory Complex A', metric: '62 / 80 Cots', pct: 78, color: 'bg-[#55132D]', sub: 'East Gate Perimeter' },
                { name: 'Yatri Niwas Guest Cottages', metric: '7 / 8 Units', pct: 88, color: 'bg-amber-600', sub: 'North Garden Area' },
                { name: 'Forecourt Waiting Pavilion', metric: '310 / 500 Seated', pct: 62, color: 'bg-teal-600', sub: 'Main Approach' },
                { name: 'Free Digital Lockers & Cloakroom', metric: '408 / 600 In Use', pct: 68, color: 'bg-blue-600', sub: 'Gate 1 Plaza' },
              ].map((f, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-stone-900 leading-tight">{f.name}</span>
                    <span className="text-xs font-bold text-stone-900 font-mono">{f.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${f.color}`}
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10.5px] text-stone-500 pt-0.5">
                    <span>{f.sub}</span>
                    <span className="font-semibold text-stone-800">{f.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Maintenance Alerts & Accommodation Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Active Maintenance Tickets */}
            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 font-serif">Active Maintenance Works</h3>
                  </div>
                  <button
                    onClick={() => setIsMaintenanceModalOpen(true)}
                    className="text-xs font-bold text-[#55132D] hover:underline"
                  >
                    + Log Issue
                  </button>
                </div>

                <div className="space-y-3">
                  {maintenanceRequests.slice(0, 3).map((m) => (
                    <div key={m.id} className="p-3 rounded-lg border border-stone-100 bg-stone-50/60 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>{m.facilityName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            m.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : m.priority === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {m.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-snug">{m.description}</p>
                      <div className="flex justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-200/40">
                        <span>Assigned: {m.assignedPerson} ({m.assignedTeam})</span>
                        <span className="font-semibold text-[#55132D]">{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('maintenance')}
                className="mt-4 pt-2.5 border-t border-stone-100 text-xs font-semibold text-[#55132D] hover:underline flex items-center justify-between"
              >
                <span>View All Maintenance Tickets ({maintenanceRequests.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Upcoming Accommodation Bookings */}
            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 font-serif">Recent Stay Allotments</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="text-xs font-semibold text-[#55132D] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {accommodationRequests.slice(0, 3).map((a) => (
                    <div key={a.id} className="p-3 rounded-lg border border-stone-100 bg-stone-50/60 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>{a.devoteeName} ({a.guestsCount} guests)</span>
                        <span className="font-mono text-[#55132D]">{a.id}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-500">
                        <span>{a.accommodationType}</span>
                        <span className="font-semibold text-emerald-800">{a.status}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-200/40">
                        Dates: {a.checkInDate} to {a.checkOutDate} • Unit: {a.allocatedUnit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">Need to allot a pilgrim bed?</span>
                <button
                  onClick={() => setIsAccommodationModalOpen(true)}
                  className="px-3 py-1.5 font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs"
                >
                  + Allot Bed / Cottage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACILITIES DIRECTORY */}
      {activeTab === 'facilities' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif">Temple Facilities Directory</h3>
            </div>
            <select
              value={facilityCategoryFilter}
              onChange={(e) => setFacilityCategoryFilter(e.target.value)}
              className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-stone-200 bg-white font-medium text-stone-700"
            >
              <option value="All">All Facility Categories</option>
              <option value="Dormitory">Dormitory</option>
              <option value="Guest Cottage">Guest Cottage</option>
              <option value="Waiting Hall">Waiting Hall</option>
              <option value="Bathing Ghat">Bathing Ghat</option>
              <option value="Drinking Water">Drinking Water</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Parking">Parking</option>
              <option value="Dining Hall">Dining Hall</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {filteredFacilities.map((f) => {
              const isOper = f.operationalStatus === 'Operational';
              return (
                <div
                  key={f.id}
                  className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between h-full transition-all hover:shadow-sm ${
                    !isOper ? 'border-amber-300 bg-amber-50/15' : 'border-stone-200/90 hover:border-[#B68A36]/50'
                  }`}
                >
                  <div>
                    {/* Header: Category Badge & Operational Status Button */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200/60">
                        {f.category}
                      </span>
                      <button
                        onClick={() => updateFacilityStatus(f.id, isOper ? 'Maintenance Required' : 'Operational')}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1.5 ${
                          isOper
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/70'
                            : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100/70'
                        }`}
                        title="Click to toggle operational status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isOper ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{f.operationalStatus}</span>
                      </button>
                    </div>

                    {/* Facility Title */}
                    <div className="h-12 flex items-start mb-2">
                      <h4 className="font-bold text-stone-900 font-serif text-[15px] leading-snug line-clamp-2" title={f.name}>
                        {f.name}
                      </h4>
                    </div>

                    {/* Facility Description */}
                    <p className="text-xs text-stone-600 leading-relaxed mb-4 h-10 line-clamp-2" title={f.description}>
                      {f.description}
                    </p>

                    {/* Core Specifications - Clean, Breathable & Focused */}
                    <div className="bg-stone-50/80 rounded-xl p-3.5 border border-stone-200/60 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-stone-500 font-medium flex-shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>Location</span>
                        </div>
                        <span className="text-stone-800 font-semibold truncate text-right text-xs" title={f.location}>
                          {f.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-200/50">
                        <div className="flex items-center gap-2 text-stone-500 font-medium flex-shrink-0">
                          <Users className="w-3.5 h-3.5 text-[#B68A36]" />
                          <span>Capacity</span>
                        </div>
                        <span className="text-stone-900 font-bold font-number truncate text-right text-xs" title={f.capacity}>
                          {f.capacity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: ID and Action */}
                  <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-xs font-semibold text-stone-500 bg-stone-100/70 px-2.5 py-1 rounded-md border border-stone-200/60">
                      {f.id}
                    </span>
                    <button
                      onClick={() => setIsMaintenanceModalOpen(true)}
                      className="px-3.5 py-1.5 text-xs font-bold text-[#55132D] bg-[#55132D]/5 hover:bg-[#55132D]/12 rounded-lg border border-[#55132D]/15 flex items-center gap-1.5 transition-colors"
                    >
                      <Wrench className="w-3.5 h-3.5 text-[#B68A36]" />
                      <span>Log Issue</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ACCOMMODATION TYPES */}
      {activeTab === 'accommodation' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 font-serif">Configurable Accommodation Categories</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {accommodationTypes.map((acc) => (
              <div key={acc.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between h-full space-y-3">
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                      {acc.category}
                    </span>
                    <span className="font-number font-bold text-base text-[#55132D]">
                      ₹{acc.configuredAmount} / night
                    </span>
                  </div>

                  <div className="h-10 flex items-center mb-1">
                    <h4 className="font-bold text-stone-900 font-serif text-[15px] line-clamp-2 leading-snug">{acc.name}</h4>
                  </div>
                  <div className="text-xs text-stone-600 space-y-1.5 border-t border-stone-100 pt-2.5">
                    <div className="flex justify-between items-center py-1 border-b border-stone-100/70">
                      <span className="text-stone-500 font-medium">Configured Capacity:</span>
                      <span className="font-semibold text-stone-900">{acc.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-stone-100/70">
                      <span className="text-stone-500 font-medium">Allotment Rule:</span>
                      <span className="text-stone-800 font-medium">{acc.bookingRequirement}</span>
                    </div>
                    <p className="text-xs text-stone-500 pt-1.5 leading-relaxed">{acc.rules}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REQUESTS & BOOKINGS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Request ID, Devotee Name, or Mobile..."
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={requestStatusFilter}
                onChange={(e) => setRequestStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Pending">Pending Review</option>
              </select>

              <button
                onClick={() => setIsAccommodationModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Request</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Devotee Information</th>
                    <th className="py-3 px-4">Accommodation Facility</th>
                    <th className="py-3 px-4">Stay Dates</th>
                    <th className="py-3 px-4">Allotted Unit</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                  {filteredRequests.map((a) => (
                    <tr key={a.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#55132D] whitespace-nowrap">
                        {a.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            const dev = getDevoteeById(a.devoteeId);
                            if (dev) setSelectedDevoteeForProfile(dev);
                          }}
                          className="font-bold text-stone-900 hover:text-[#55132D] hover:underline text-left block"
                        >
                          {a.devoteeName}
                        </button>
                        <span className="text-[11px] text-stone-500">{a.mobile}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-800 block">{a.accommodationType}</span>
                        <span className="text-[11px] text-stone-500">{a.guestsCount} Guest(s)</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-stone-900 block">{a.checkInDate} to {a.checkOutDate}</span>
                        <span className="text-[10px] text-stone-400">Requested: {a.requestDate}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-stone-800">
                        {a.allocatedUnit}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-stone-900 whitespace-nowrap">
                        ₹{a.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            a.status === 'Checked In'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : a.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : a.status === 'Checked Out'
                              ? 'bg-stone-100 text-stone-600 border-stone-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {a.status === 'Approved' && (
                            <button
                              onClick={() => updateAccommodationStatus(a.id, 'Checked In')}
                              className="px-2 py-1 text-[11px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                            >
                              Check In
                            </button>
                          )}
                          {a.status === 'Checked In' && (
                            <button
                              onClick={() => updateAccommodationStatus(a.id, 'Checked Out')}
                              className="px-2 py-1 text-[11px] font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300"
                            >
                              Check Out
                            </button>
                          )}
                          {a.status === 'Pending' && (
                            <button
                              onClick={() => updateAccommodationStatus(a.id, 'Approved', 'Dorm Unit Allocated')}
                              className="px-2 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                            >
                              Approve
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

      {/* TAB 5: MAINTENANCE LOG */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif">Facility Maintenance Audit Log</h3>
            </div>
            <button
              onClick={() => setIsMaintenanceModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4" />
              <span>Log Maintenance Ticket</span>
            </button>
          </div>

          <div className="space-y-3">
            {maintenanceRequests.map((m) => (
              <div key={m.id} className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#55132D]">{m.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        m.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : m.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {m.priority}
                    </span>
                    <strong className="text-stone-900 font-serif">{m.facilityName}</strong>
                  </div>
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-full border ${
                      m.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <p className="text-stone-700 leading-relaxed">{m.description}</p>

                <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-stone-500">
                  <div>
                    <span>Reported: {m.reportedDate}</span> • <span>Assigned to: <strong className="text-stone-700">{m.assignedPerson}</strong> ({m.assignedTeam})</span>
                  </div>

                  {m.status !== 'Resolved' && (
                    <button
                      onClick={() => updateMaintenanceStatus(m.id, 'Resolved', 'Inspection verified')}
                      className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals & Profile Drawer */}
      <CreateAccommodationRequestModal
        isOpen={isAccommodationModalOpen}
        onClose={() => setIsAccommodationModalOpen(false)}
      />

      <CreateMaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
      />

      <DevoteeProfileDrawer
        devotee={selectedDevoteeForProfile}
        onClose={() => setSelectedDevoteeForProfile(null)}
      />
    </div>
  );
}

