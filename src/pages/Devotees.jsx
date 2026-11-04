import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Download,
  Eye,
  Edit2,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useDevoteeServices } from '../context/DevoteeServicesContext';
import ModulePageHeader from '../components/devotee-services/shared/ModulePageHeader';
import DevoteeProfileDrawer from '../components/devotee-services/shared/DevoteeProfileDrawer';
import AddEditDevoteeModal from '../components/devotee-services/devotees/AddEditDevoteeModal';

export default function Devotees({ isEmbedded = false }) {
  const { devotees, getDevoteeActivity } = useDevoteeServices();

  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [segmentFilter, setSegmentFilter] = useState('All');

  const [selectedDevoteeForProfile, setSelectedDevoteeForProfile] = useState(null);
  const [editingDevotee, setEditingDevotee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Real, meaningful operational insights
  const metrics = useMemo(() => {
    const total = devotees.length;
    const active = devotees.filter((d) => d.status === 'Active').length;
    const patrons = devotees.filter((d) => d.segment === 'Patron Donor').length;
    const repeats = devotees.filter((d) => d.segment === 'Repeat Visitor').length;
    const withActiveSevas = devotees.filter((d) => {
      const act = getDevoteeActivity(d.id);
      return act?.all && act.all.length > 0;
    }).length;
    return { total, active, patrons, repeats, withActiveSevas };
  }, [devotees, getDevoteeActivity]);

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

  return (
    <div className="space-y-5 pb-10">
      {/* Page Header (Hidden when embedded) */}
      {!isEmbedded && (
        <ModulePageHeader
          title="Devotees Directory"
          primaryActionLabel="Register Devotee"
          onPrimaryAction={() => {
            setEditingDevotee(null);
            setIsAddModalOpen(true);
          }}
          primaryActionIcon={UserPlus}
        />
      )}

      {/* Meaningful Real Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Devotees</span>
            <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 flex items-center justify-center text-[#55132D]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-number text-stone-900">{metrics.total}</div>
          <div className="text-xs text-stone-500 font-medium">
            <span className="text-emerald-700 font-semibold">{metrics.active} active</span> registered profiles
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Patron Donors</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-number text-stone-900">{metrics.patrons}</div>
          <div className="text-xs text-stone-500 font-medium">
            Major Seva & Annadanam sponsors
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Repeat Pilgrims</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-number text-stone-900">{metrics.repeats}</div>
          <div className="text-xs text-stone-500 font-medium">
            Frequent temple & festival visitors
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Seva Participants</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-number text-stone-900">{metrics.withActiveSevas}</div>
          <div className="text-xs text-stone-500 font-medium">
            Devotees with booked services
          </div>
        </div>
      </div>

      {/* Devotees Directory Section */}
      <div className="space-y-4">
        {/* Search, Filters, Export & Register */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by devotee name, ID (DEV-...), mobile, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
            >
              <option value="All">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
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
              className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 flex items-center gap-1.5 transition-colors"
              title="Export Devotees Directory to CSV"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                setEditingDevotee(null);
                setIsAddModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Register Devotee</span>
            </button>
          </div>
        </div>

        {/* Devotees Table */}
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200/90 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Devotee</th>
                  <th className="py-3.5 px-5">Contact & Location</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Seva Engagement</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredDevotees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-stone-400">
                      No devotees found matching the current search filters.
                    </td>
                  </tr>
                ) : (
                  filteredDevotees.map((d) => {
                    const act = getDevoteeActivity(d.id);
                    return (
                      <tr
                        key={d.id}
                        onClick={() => setSelectedDevoteeForProfile(d)}
                        className="hover:bg-amber-50/20 cursor-pointer transition-colors"
                      >
                        {/* Devotee */}
                        <td className="py-3.5 px-5">
                          <div className="font-semibold text-stone-900 text-sm">{d.name}</div>
                          <div className="text-xs font-mono text-[#55132D] font-medium mt-0.5">{d.id}</div>
                        </td>

                        {/* Contact & Location */}
                        <td className="py-3.5 px-5">
                          <div className="text-xs font-mono text-stone-800 font-medium">{d.mobile}</div>
                          <div className="text-xs text-stone-500 mt-0.5">{d.city}, {d.state}</div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium border ${
                              d.segment === 'Patron Donor'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : d.segment === 'Repeat Visitor'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : d.segment === 'Local Devotee'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            {d.segment}
                          </span>
                        </td>

                        {/* Seva Engagement */}
                        <td className="py-3.5 px-5">
                          {act.all.length > 0 ? (
                            <div className="text-xs text-stone-700 flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-stone-900">{act.all.length} bookings</span>
                              <span className="text-stone-300">•</span>
                              <span className="text-stone-500">
                                {[
                                  act.darshan.length ? `${act.darshan.length} Darshan` : null,
                                  act.pooja.length ? `${act.pooja.length} Pooja` : null,
                                  act.donations.length ? `${act.donations.length} Dakshina` : null,
                                ].filter(Boolean).join(' · ')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-stone-400">No active bookings</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-5 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {d.status || 'Active'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td
                          className="py-3.5 px-5 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedDevoteeForProfile(d)}
                              className="p-1.5 text-stone-400 hover:text-[#55132D] hover:bg-stone-100 rounded-lg transition-colors"
                              title="View Full Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingDevotee(d);
                                setIsAddModalOpen(true);
                              }}
                              className="p-1.5 text-stone-400 hover:text-[#55132D] hover:bg-stone-100 rounded-lg transition-colors"
                              title="Edit Devotee Info"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 bg-stone-50 border-t border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
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

