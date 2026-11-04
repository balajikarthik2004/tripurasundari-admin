import React, { useState } from 'react';
import {
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
  Info,
} from 'lucide-react';
import { useInsightsAdmin } from '../context/InsightsAdminContext';

export default function UsersRoles() {
  const {
    roles,
    permissionsMatrix,
    updateRolePermission,
    modulesList,
    showToast,
  } = useInsightsAdmin();

  // Role Permissions State
  const [selectedRoleId, setSelectedRoleId] = useState('ROLE-01');
  const [localPermissions, setLocalPermissions] = useState(permissionsMatrix);
  const [hasUnsavedPerms, setHasUnsavedPerms] = useState(false);

  const handleToggleLocalPermission = (modId, permKey) => {
    if (selectedRoleId === 'ROLE-01') {
      showToast('Super Administrator permissions are permanently unlocked for core security.', 'warning');
      return;
    }
    setLocalPermissions((prev) => {
      const rolePerms = prev[selectedRoleId] || {};
      const modPerms =
        rolePerms[modId] || {
          view: false,
          create: false,
          edit: false,
          approve: false,
          export: false,
          manage: false,
        };
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
    Object.keys(localPermissions[selectedRoleId] || {}).forEach((modId) => {
      const modPerms = localPermissions[selectedRoleId][modId];
      Object.keys(modPerms).forEach((pKey) => {
        updateRolePermission(selectedRoleId, modId, pKey, modPerms[pKey]);
      });
    });
    setHasUnsavedPerms(false);
    showToast(`Permissions saved for ${roles.find((r) => r.id === selectedRoleId)?.name}.`);
  };

  const currentRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* 1. Role Selection & Actions Control Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55132D]" />
            <h3 className="font-serif font-bold text-stone-900 text-sm tracking-tight">
              Users &amp; Roles Permission Matrix
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium block mt-0.5">
            Role-Based Access Control (RBAC) across temple administration modules
          </span>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          {/* Role Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-600 hidden sm:inline">Role:</span>
            <select
              value={selectedRoleId}
              onChange={(e) => {
                setSelectedRoleId(e.target.value);
                setHasUnsavedPerms(false);
              }}
              className="text-xs font-bold border border-stone-300 rounded-xl px-3 py-2 bg-stone-50 text-[#55132D] focus:outline-none focus:ring-1 focus:ring-[#55132D] cursor-pointer shadow-2xs"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.userCount} Active Users)
                </option>
              ))}
            </select>
          </div>

          {/* Save Action */}
          {hasUnsavedPerms && (
            <button
              onClick={handleSavePermissions}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer animate-pulse"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Permission Matrix Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-700 font-bold uppercase text-[10.5px] border-b border-stone-200 tracking-wider">
              <tr>
                <th className="py-3.5 px-5 min-w-[220px]">Temple Module</th>
                <th className="py-3.5 px-4 text-center">View</th>
                <th className="py-3.5 px-4 text-center">Create</th>
                <th className="py-3.5 px-4 text-center">Edit</th>
                <th className="py-3.5 px-4 text-center">Approve</th>
                <th className="py-3.5 px-4 text-center">Export</th>
                <th className="py-3.5 px-4 text-center">Manage / Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150 text-stone-700 bg-white">
              {modulesList.map((mod) => {
                const rolePerms = localPermissions[selectedRoleId] || {};
                const modPerms =
                  selectedRoleId === 'ROLE-01'
                    ? { view: true, create: true, edit: true, approve: true, export: true, manage: true }
                    : rolePerms[mod.id] || {
                        view: false,
                        create: false,
                        edit: false,
                        approve: false,
                        export: false,
                        manage: false,
                      };

                return (
                  <tr key={mod.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-stone-900">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                        <span>{mod.name}</span>
                      </div>
                    </td>
                    {['view', 'create', 'edit', 'approve', 'export', 'manage'].map((pKey) => {
                      const isChecked = !!modPerms[pKey];
                      const isSuperAdmin = selectedRoleId === 'ROLE-01';

                      return (
                        <td key={pKey} className="py-3.5 px-4 text-center">
                          <label className="inline-flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isSuperAdmin}
                              onChange={() => handleToggleLocalPermission(mod.id, pKey)}
                              className="w-4 h-4 text-[#55132D] rounded border-stone-300 focus:ring-[#55132D] cursor-pointer disabled:cursor-not-allowed accent-[#55132D]"
                            />
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Matrix Footer Notice */}
        <div className="p-4 bg-stone-50/70 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Active Profile: <strong className="text-stone-800">{currentRole?.name}</strong> · Permissions govern dashboard menus, booking actions, and transaction approvals.
            </span>
          </div>
          {selectedRoleId === 'ROLE-01' && (
            <span className="font-mono text-[10.5px] font-bold text-stone-500">
              * Super Administrator holds permanent bypass permissions.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
