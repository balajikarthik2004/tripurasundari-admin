import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  UserCog,
  Users,
  Key,
  Lock,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  Clock,
  Eye,
  Edit3,
  ShieldAlert,
  ChevronRight,
  UserCheck,
  Info
} from 'lucide-react';
import { useInsightsAdmin } from '../context/InsightsAdminContext';

export default function UsersRoles() {
  const {
    adminUsers,
    addAdminUser,
    updateAdminUser,
    toggleUserStatus,
    roles,
    permissionsMatrix,
    updateRolePermission,
    modulesList,
    accessLogs,
    showToast,
  } = useInsightsAdmin();

  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Role Permissions Tab State
  const [selectedRoleId, setSelectedRoleId] = useState('ROLE-01');
  const [localPermissions, setLocalPermissions] = useState(permissionsMatrix);
  const [hasUnsavedPerms, setHasUnsavedPerms] = useState(false);

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Temple Administration Board',
    role: 'Temple Administrator',
    roleId: 'ROLE-02',
  });

  // Derived Metrics
  const totalUsers = adminUsers.length;
  const activeUsers = useMemo(() => adminUsers.filter((u) => u.status === 'Active'), [adminUsers]);
  const pendingUsers = useMemo(() => adminUsers.filter((u) => u.status === 'Invitation Pending'), [adminUsers]);
  const suspendedUsers = useMemo(() => adminUsers.filter((u) => u.status === 'Suspended'), [adminUsers]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return adminUsers.filter((u) => {
      const matchRole = selectedRoleFilter === 'ALL' || u.roleId === selectedRoleFilter;
      const matchStatus = selectedStatusFilter === 'ALL' || u.status === selectedStatusFilter;
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department.toLowerCase().includes(searchTerm.toLowerCase());
      return matchRole && matchStatus && matchSearch;
    });
  }, [adminUsers, selectedRoleFilter, selectedStatusFilter, searchTerm]);

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) return;
    const selectedRoleObj = roles.find((r) => r.id === userForm.roleId);
    addAdminUser({
      ...userForm,
      role: selectedRoleObj ? selectedRoleObj.name : userForm.role,
    });
    setUserForm({
      name: '',
      email: '',
      phone: '',
      department: 'Temple Administration Board',
      role: 'Temple Administrator',
      roleId: 'ROLE-02',
    });
    setIsAddUserModalOpen(false);
  };

  const handleToggleLocalPermission = (modId, permKey) => {
    if (selectedRoleId === 'ROLE-01') {
      alert('Super Administrator permissions are permanently unlocked for core system security.');
      return;
    }
    setLocalPermissions((prev) => {
      const rolePerms = prev[selectedRoleId] || {};
      const modPerms = rolePerms[modId] || { view: false, create: false, edit: false, approve: false, export: false, manage: false };
      const nextVal = !modPerms[permKey];
      return {
        ...prev,
        [selectedRoleId]: {
          ...rolePerms,
          [modId]: {
            ...modPerms,
            [permKey]: nextVal,
          },
        },
      };
    });
    setHasUnsavedPerms(true);
  };

  const handleSavePermissions = () => {
    // Commit local matrix to context
    Object.keys(localPermissions[selectedRoleId] || {}).forEach((modId) => {
      const modPerms = localPermissions[selectedRoleId][modId];
      Object.keys(modPerms).forEach((pKey) => {
        updateRolePermission(selectedRoleId, modId, pKey, modPerms[pKey]);
      });
    });
    setHasUnsavedPerms(false);
    showToast(`Permissions saved for ${roles.find((r) => r.id === selectedRoleId)?.name}.`);
  };

  const tabs = [
    { id: 'users', label: 'User Directory', count: adminUsers.length, icon: Users },
    { id: 'roles_permissions', label: 'Roles & RBAC Permission Matrix', count: roles.length, icon: ShieldCheck },
    { id: 'access_activity', label: 'Access & Governance Log', count: accessLogs.length, icon: Clock },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">
              Users & Roles Management
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Enroll Administrator
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Total Enrolled</span>
          <div className="text-2xl font-bold font-mono text-stone-900">{totalUsers}</div>
          <span className="text-[11px] text-stone-500">Across 5 departments</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Active Duty</span>
          <div className="text-2xl font-bold font-mono text-emerald-700">{activeUsers.length}</div>
          <span className="text-[11px] text-stone-500">Logged in this week</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Governance Roles</span>
          <div className="text-2xl font-bold font-mono text-blue-700">{roles.length}</div>
          <span className="text-[11px] text-stone-500">Security profiles</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Pending / Suspended</span>
          <div className="text-2xl font-bold font-mono text-amber-700">
            {pendingUsers.length + suspendedUsers.length}
          </div>
          <span className="text-[11px] text-stone-500">Awaiting activation</span>
        </div>
      </div>

      {/* Tabs */}
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

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user name, email, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-[#800000] w-64"
                />
              </div>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#800000]"
              >
                <option value="ALL">All Roles</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#800000]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Invitation Pending">Invitation Pending</option>
              </select>
            </div>

            <span className="text-xs text-stone-500 font-medium">
              Showing {filteredUsers.length} administrators
            </span>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Administrator Name</th>
                  <th className="py-3 px-4">Department / Wing</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{u.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{u.name}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">{u.department}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#800000]/10 text-[#800000] border border-[#800000]/20">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">{u.lastActivity}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : u.status === 'Suspended'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className="text-[11px] text-stone-600 hover:text-stone-900 underline font-medium"
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES & RBAC PERMISSION MATRIX */}
      {activeTab === 'roles_permissions' && (
        <div className="space-y-4">
          {/* Role Selector Header */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Configured Role Permissions Matrix</h3>
              <p className="text-xs text-stone-500">
                Grant or restrict access per administrative module (View, Create, Edit, Approve, Export, Manage).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600">Select Role:</span>
              <select
                value={selectedRoleId}
                onChange={(e) => {
                  setSelectedRoleId(e.target.value);
                  setHasUnsavedPerms(false);
                }}
                className="text-xs font-bold border border-stone-300 rounded-lg px-3 py-1.5 bg-stone-50 focus:outline-none focus:border-[#800000] text-[#800000]"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.userCount} users)
                  </option>
                ))}
              </select>

              {hasUnsavedPerms && (
                <button
                  onClick={handleSavePermissions}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm animate-pulse"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 min-w-[200px]">Temple Module</th>
                    <th className="py-3 px-4 text-center">View</th>
                    <th className="py-3 px-4 text-center">Create</th>
                    <th className="py-3 px-4 text-center">Edit</th>
                    <th className="py-3 px-4 text-center">Approve</th>
                    <th className="py-3 px-4 text-center">Export</th>
                    <th className="py-3 px-4 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {modulesList.map((mod) => {
                    const rolePerms = localPermissions[selectedRoleId] || {};
                    const modPerms =
                      selectedRoleId === 'ROLE-01'
                        ? { view: true, create: true, edit: true, approve: true, export: true, manage: true }
                        : rolePerms[mod.id] || { view: false, create: false, edit: false, approve: false, export: false, manage: false };

                    return (
                      <tr key={mod.id} className="hover:bg-stone-50/60">
                        <td className="py-2.5 px-4 font-medium text-stone-900">{mod.name}</td>
                        {['view', 'create', 'edit', 'approve', 'export', 'manage'].map((pKey) => (
                          <td key={pKey} className="py-2.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={!!modPerms[pKey]}
                              disabled={selectedRoleId === 'ROLE-01'}
                              onChange={() => handleToggleLocalPermission(mod.id, pKey)}
                              className="w-4 h-4 text-[#800000] rounded focus:ring-[#800000] disabled:opacity-50 cursor-pointer"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACCESS & GOVERNANCE LOG */}
      {activeTab === 'access_activity' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200">
            <h3 className="text-sm font-bold text-stone-900">Administrative Governance & Security Log</h3>
            <p className="text-xs text-stone-500">
              Audit trail of permissions granted, role updates and privileged administrative actions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Audit ID</th>
                  <th className="py-3 px-4">User Account</th>
                  <th className="py-3 px-4">Action Summary</th>
                  <th className="py-3 px-4">Target Domain</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {accessLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{log.id}</td>
                    <td className="py-3 px-4 font-medium text-stone-800">{log.user}</td>
                    <td className="py-3 px-4 text-stone-900 font-semibold">{log.action}</td>
                    <td className="py-3 px-4 text-stone-600">{log.module}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500">{log.timestamp}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD ADMIN USER */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Enroll Temple Administrator</h3>
                <p className="text-xs text-stone-500">Assign role and department credentials.</p>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Officer Prafulla Deb"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. prafulla.deb@matabari-temple.gov.in"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 font-mono text-[11px] focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={userForm.department}
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Assigned Role</label>
                  <select
                    value={userForm.roleId}
                    onChange={(e) => setUserForm({ ...userForm, roleId: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg shadow-sm"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

