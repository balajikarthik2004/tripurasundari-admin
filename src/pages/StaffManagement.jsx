import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  MapPin,
  Clock,
  Radio,
  Search,
  Filter,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useTempleOperations } from '../context/TempleOperationsContext';
import OperationsPageHeader from '../components/temple-operations/shared/OperationsPageHeader';
import OperationsTabs from '../components/temple-operations/shared/OperationsTabs';
import OperationsMetricCard from '../components/temple-operations/shared/OperationsMetricCard';
import MatabariStaffDeploymentMap from '../components/temple-operations/staff/MatabariStaffDeploymentMap';
import AddStaffModal from '../components/temple-operations/staff/AddStaffModal';
import BroadcastModal from '../components/temple-operations/staff/BroadcastModal';

export default function StaffManagement() {
  const {
    staff,
    shifts,
    zones,
    addStaff,
    updateStaff,
    reassignStaffZone,
    updateStaffStatus,
  } = useTempleOperations();

  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isMusterOpen, setIsMusterOpen] = useState(false);

  // Metrics
  const metrics = useMemo(() => {
    const total = staff.length;
    const active = staff.filter((s) => s.status === 'Active').length;
    const onBreak = staff.filter((s) => s.status === 'On Break').length;
    const assigned = staff.filter((s) => s.assignedZoneId).length;
    const unassigned = staff.filter((s) => !s.assignedZoneId).length;

    return { total, active, onBreak, assigned, unassigned };
  }, [staff]);

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      if (roleFilter !== 'All' && s.role !== roleFilter) return false;
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesId = s.id.toLowerCase().includes(q);
        const matchesTeam = s.team.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesTeam) return false;
      }
      return true;
    });
  }, [staff, roleFilter, statusFilter, searchTerm]);

  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'map', label: 'Interactive Deployment Map', icon: MapPin },
    { id: 'directory', label: 'Personnel Directory', icon: UserCheck, badge: staff.length },
    { id: 'shifts', label: 'Shifts & Attendance', icon: Clock, badge: shifts.length },
    { id: 'assignments', label: 'Zone Roster', icon: Filter },
  ];

  return (
    <div className="space-y-5 pb-10">
      <OperationsPageHeader
        title="Volunteer & Staff Deployment Operations"
        subtitle="Roster coordination, campus deployment map, shift attendance and emergency response muster"
        primaryActionLabel="Enroll Volunteer"
        onPrimaryAction={() => setIsAddStaffOpen(true)}
        primaryActionIcon={UserPlus}
        secondaryAction={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsBroadcastOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl border border-stone-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <Radio className="w-4 h-4 text-[#55132D]" />
              <span>Broadcast</span>
            </button>
            <button
              onClick={() => setIsMusterOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Emergency Muster</span>
            </button>
          </div>
        }
      />

      <OperationsTabs tabs={tabsConfig} activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <OperationsMetricCard
              label="Configured Personnel"
              value={metrics.total}
              subtitle="Staff & Sevadal registered"
              icon={Users}
              iconBg="bg-[#55132D]/10 text-[#55132D]"
              onClick={() => setActiveTab('directory')}
            />
            <OperationsMetricCard
              label="Active On Duty"
              value={metrics.active}
              trend="100% morning coverage"
              icon={CheckCircle2}
              iconBg="bg-emerald-50 text-emerald-700"
            />
            <OperationsMetricCard
              label="Personnel On Break"
              value={metrics.onBreak}
              subtitle="Rotation in progress"
              icon={Clock}
              iconBg="bg-amber-50 text-amber-700"
            />
            <OperationsMetricCard
              label="Stationed at Zones"
              value={metrics.assigned}
              subtitle="Deployed to perimeters"
              icon={MapPin}
              iconBg="bg-blue-50 text-blue-700"
              onClick={() => setActiveTab('map')}
            />
            <OperationsMetricCard
              label="Unassigned Standby"
              value={metrics.unassigned}
              subtitle="Administrative pool"
              icon={UserCheck}
              iconBg="bg-purple-50 text-purple-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shifts.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-[#55132D] bg-[#55132D]/10 px-2 py-0.5 rounded">
                    {s.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {s.status}
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 font-serif text-sm">{s.name}</h4>
                <p className="text-xs text-stone-500">{s.timings} • In-Charge: {s.supervisor}</p>

                <div className="pt-2 border-t border-stone-100 flex justify-between text-xs text-stone-600">
                  <span>Assigned Staff: <strong className="text-stone-900">{s.assignedCount}</strong></span>
                  <span>Present: <strong className="text-emerald-700">{s.presentCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE DEPLOYMENT MAP */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <MatabariStaffDeploymentMap
            staff={staff}
            zones={zones}
            shifts={shifts}
            selectedStaffId={selectedStaff?.id}
            onSelectStaff={(member) => setSelectedStaff(member)}
            onUpdateStaff={updateStaff}
            onAddStaff={addStaff}
          />
        </div>
      )}

      {/* TAB 3: PERSONNEL DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by Name, ID, or Team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="All">All Roles</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Security Supervisor">Security Supervisor</option>
                <option value="Crowd Coordinator">Crowd Coordinator</option>
                <option value="Safety Marshal">Safety Marshal</option>
                <option value="Parking Coordinator">Parking Coordinator</option>
                <option value="Help Desk Staff">Help Desk Staff</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Break">On Break</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Staff ID</th>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role & Team</th>
                    <th className="py-3 px-4">Assigned Operational Zone</th>
                    <th className="py-3 px-4">Shift</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                  {filteredStaff.map((s) => (
                    <tr key={s.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#55132D]">{s.id}</td>
                      <td className="py-3.5 px-4">
                        <strong className="block text-stone-900">{s.name}</strong>
                        <span className="text-[11px] text-stone-500">{s.contact}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-800 block">{s.role}</span>
                        <span className="text-[11px] text-stone-400">{s.team}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-stone-800">
                        {s.assignedZoneName}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-stone-600">{s.shift}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : s.status === 'On Break'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedStaff(s);
                            setActiveTab('map');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-[#55132D] hover:bg-[#55132D]/10 rounded"
                        >
                          View on Map
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SHIFTS & ATTENDANCE */}
      {activeTab === 'shifts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shifts.map((s) => (
            <div key={s.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold text-[#55132D]">{s.id}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {s.status}
                </span>
              </div>
              <h4 className="font-bold text-stone-900 font-serif text-sm">{s.name}</h4>
              <p className="text-xs text-stone-500">{s.timings}</p>
              <div className="text-xs text-stone-600 space-y-1 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Assigned Personnel:</span>
                  <strong>{s.assignedCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Present on Duty:</span>
                  <strong className="text-emerald-700">{s.presentCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>On Authorized Break:</span>
                  <strong className="text-amber-700">{s.onBreakCount}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: ZONE ROSTER ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((z) => {
            const assignedMembers = staff.filter((s) => s.assignedZoneId === z.id);
            return (
              <div key={z.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#55132D] bg-[#55132D]/10 px-2 py-0.5 rounded">
                      {z.id}
                    </span>
                    <h4 className="font-bold text-stone-900 font-serif text-sm mt-1">{z.name}</h4>
                  </div>
                  <span className="text-xs font-bold text-stone-700">
                    {assignedMembers.length} Officers
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                  {assignedMembers.map((m) => (
                    <div key={m.id} className="p-2 rounded bg-stone-50 flex items-center justify-between">
                      <div>
                        <strong className="text-stone-900">{m.name}</strong>
                        <span className="text-[11px] text-stone-500 block">{m.role} • {m.shift}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-stone-200">
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddStaffModal isOpen={isAddStaffOpen} onClose={() => setIsAddStaffOpen(false)} />
      <BroadcastModal isOpen={isBroadcastOpen} onClose={() => setIsBroadcastOpen(false)} />

      {/* Emergency Muster Modal */}
      {isMusterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold font-serif text-base">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Emergency Response Muster</span>
              </div>
              <button onClick={() => setIsMusterOpen(false)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>
            <p className="text-stone-600">
              Personnel headcount accounting and emergency sector assembly verification for Mata Tripura Sundari Temple campus.
            </p>
            <div className="p-3 bg-stone-50 rounded-xl space-y-2 border border-stone-200">
              <div className="flex justify-between">
                <span>Total On-Duty Active Staff:</span>
                <strong className="text-emerald-700">{metrics.active} / {metrics.total} accounted for</strong>
              </div>
              <div className="flex justify-between">
                <span>Standby Disaster Marshals:</span>
                <strong className="text-stone-800">4 Marshals (Kalyansagar Ghat & East Torana)</strong>
              </div>
              <div className="flex justify-between">
                <span>Duty Magistrate Liaison:</span>
                <strong className="text-stone-800">Udaipur Sub-Divisional Administration</strong>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsMusterOpen(false)}
                className="px-4 py-2 font-bold text-white bg-[#55132D] rounded-lg"
              >
                Close Muster Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

