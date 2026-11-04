import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Settings,
  ShieldCheck,
  Sliders,
  DollarSign,
  Bell,
  Shield,
  Database,
  RotateCcw,
  Save,
  CheckCircle,
  AlertTriangle,
  Globe,
  Calendar,
  Lock,
  Building,
  Mail,
  Phone,
  Info
} from 'lucide-react';
import { useInsightsAdmin } from '../context/InsightsAdminContext';
import UsersRoles from './UsersRoles';

export default function TempleSettings() {
  const {
    templeSettings,
    updateSettingsSection,
    resetAllDemoData,
    showToast,
  } = useInsightsAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const initialNavTab = urlTab === 'rbac' || urlTab === 'users' || urlTab === 'roles' ? 'rbac' : 'settings';
  const [mainNavTab, setMainNavTab] = useState(initialNavTab);

  const handleMainNavChange = (tab) => {
    setMainNavTab(tab);
    setSearchParams({ tab });
  };

  const [activeTab, setActiveTab] = useState('general');
  const [localSettings, setLocalSettings] = useState(templeSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = (section, field, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleNestedFieldChange = (section, subSection, field, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const handleSaveSection = (section) => {
    updateSettingsSection(section, localSettings[section]);
    setHasChanges(false);
  };

  const handleResetConfirm = () => {
    if (window.confirm('Reset all demo state to initial static configuration? This will refresh all demonstration records across all modules.')) {
      resetAllDemoData();
      setLocalSettings(templeSettings);
      setHasChanges(false);
    }
  };

  const navItems = [
    { id: 'general', label: 'General Identity', icon: Building, desc: 'Temple name, address & contacts' },
    { id: 'booking_rules', label: 'Booking Rules', icon: Calendar, desc: 'Advance slots, passes & refunds' },
    { id: 'financial', label: 'Financial Preferences', icon: DollarSign, desc: 'Receipt prefix, 80G & currencies' },
    { id: 'notifications', label: 'Notification Channels', icon: Bell, desc: 'Email, SMS & alert routing' },
    { id: 'operational', label: 'Operational Defaults', icon: Sliders, desc: 'Crowd thresholds & camera heartbeats' },
    { id: 'system_demo', label: 'System Maintenance', icon: Database, desc: 'Application cache & state controls' },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header with Navigation Bar: Settings & RBAC */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
            {mainNavTab === 'rbac' ? 'Role-Based Access Control (RBAC)' : 'Temple Settings'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {mainNavTab === 'settings' && hasChanges && (
            <button
              onClick={() => handleSaveSection(activeTab)}
              className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors self-start md:self-auto animate-pulse cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          )}

          {/* Navigation Bar: Settings & RBAC */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-xl border border-stone-200/80 shrink-0 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => handleMainNavChange('settings')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                mainNavTab === 'settings'
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-stone-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => handleMainNavChange('rbac')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                mainNavTab === 'rbac'
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>RBAC</span>
            </button>
          </div>
        </div>
      </div>

      {mainNavTab === 'settings' && (
      /* Main Settings Layout: Left Nav + Right Content */
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {/* Left Settings Sidebar Navigation */}
        <div className="bg-white rounded-xl border border-stone-200 p-2 shadow-xs space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-3.5 rounded-xl text-sm font-medium transition-all flex items-start gap-3.5 ${isActive
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-50'
                  }`}
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                <div className="min-w-0">
                  <div className={`font-bold text-sm ${isActive ? 'text-white' : 'text-stone-900'}`}>{item.label}</div>
                  <div className={`text-xs truncate mt-0.5 ${isActive ? 'text-stone-200' : 'text-stone-400'}`}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form Container */}
        <div className="md:col-span-3 bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          {/* SECTION 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-150 pb-3">
                <h3 className="text-sm font-bold text-stone-900">General Temple Identity</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Temple Display Title</label>
                  <input
                    type="text"
                    value={localSettings.general.templeName}
                    onChange={(e) => handleFieldChange('general', 'templeName', e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Alternative Shrine Title</label>
                  <input
                    type="text"
                    value={localSettings.general.alternativeName}
                    onChange={(e) => handleFieldChange('general', 'alternativeName', e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Administration Trust / Board Name</label>
                <input
                  type="text"
                  value={localSettings.general.trustTitle}
                  onChange={(e) => handleFieldChange('general', 'trustTitle', e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Physical Location Address</label>
                <input
                  type="text"
                  value={localSettings.general.location}
                  onChange={(e) => handleFieldChange('general', 'location', e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-stone-150">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Time Zone</label>
                  <input
                    type="text"
                    disabled
                    value={localSettings.general.timeZone}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 bg-stone-100 text-stone-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Currency Standard</label>
                  <input
                    type="text"
                    disabled
                    value={localSettings.general.currency}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 bg-stone-100 text-stone-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Date Format</label>
                  <input
                    type="text"
                    disabled
                    value={localSettings.general.dateFormat}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 bg-stone-100 text-stone-500 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: BOOKING RULES */}
          {activeTab === 'booking_rules' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-150 pb-3">
                <h3 className="text-sm font-bold text-stone-900">Darshan & Seva Booking Policies</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Advance Booking Window (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={localSettings.bookingRules.darshanAdvanceDays}
                    onChange={(e) => handleFieldChange('bookingRules', 'darshanAdvanceDays', Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Max Devotees per Pass</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={localSettings.bookingRules.maxPersonsPerBooking}
                    onChange={(e) => handleFieldChange('bookingRules', 'maxPersonsPerBooking', Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Official Cancellation Policy Notice</label>
                <textarea
                  rows={3}
                  value={localSettings.bookingRules.cancellationPolicyText}
                  onChange={(e) => handleFieldChange('bookingRules', 'cancellationPolicyText', e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000] leading-relaxed"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-150">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={localSettings.bookingRules.vipPassApprovalRequired}
                    onChange={(e) => handleFieldChange('bookingRules', 'vipPassApprovalRequired', e.target.checked)}
                    className="w-4 h-4 text-[#800000] rounded focus:ring-[#800000]"
                  />
                  <span>Require Administrative Board approval for VIP protocol passes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={localSettings.bookingRules.autoConfirmGeneralPasses}
                    onChange={(e) => handleFieldChange('bookingRules', 'autoConfirmGeneralPasses', e.target.checked)}
                    className="w-4 h-4 text-[#800000] rounded focus:ring-[#800000]"
                  />
                  <span>Auto-confirm standard general darshan tickets upon payment verification</span>
                </label>
              </div>
            </div>
          )}

          {/* SECTION 3: FINANCIAL PREFERENCES */}
          {activeTab === 'financial' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-150 pb-3">
                <h3 className="text-sm font-bold text-stone-900">Financial Ledger & Receipt Formats</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Receipt Numbering Prefix</label>
                  <input
                    type="text"
                    value={localSettings.financialPreferences.receiptNumberPrefix}
                    onChange={(e) => handleFieldChange('financialPreferences', 'receiptNumberPrefix', e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 font-mono text-[11px] focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Default Payment Method</label>
                  <select
                    value={localSettings.financialPreferences.defaultPaymentMode}
                    onChange={(e) => handleFieldChange('financialPreferences', 'defaultPaymentMode', e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  >
                    <option value="UPI (QR Terminal)">UPI (Dynamic QR Code)</option>
                    <option value="POS Card Swipe">POS Card Swipe Terminal</option>
                    <option value="Cash Counter">Cash Counter Voucher</option>
                    <option value="Netbanking NEFT">Netbanking NEFT / RTGS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">80G Statutory Exemption Disclaimer</label>
                <textarea
                  rows={2}
                  value={localSettings.financialPreferences.exemptionNoticeText}
                  onChange={(e) => handleFieldChange('financialPreferences', 'exemptionNoticeText', e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>
            </div>
          )}

          {/* SECTION 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-150 pb-3">
                <h3 className="text-sm font-bold text-stone-900">Administrative Notification Dispatchers</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <label className="flex items-center gap-2 font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.notifications.channels.inAppAlerts}
                    onChange={(e) => handleNestedFieldChange('notifications', 'channels', 'inAppAlerts', e.target.checked)}
                    className="w-4 h-4 text-[#800000] rounded focus:ring-[#800000]"
                  />
                  <span>In-App Banner Notifications</span>
                </label>
                <label className="flex items-center gap-2 font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.notifications.channels.emailNotifications}
                    onChange={(e) => handleNestedFieldChange('notifications', 'channels', 'emailNotifications', e.target.checked)}
                    className="w-4 h-4 text-[#800000] rounded focus:ring-[#800000]"
                  />
                  <span>Officer Email Dispatch</span>
                </label>
                <label className="flex items-center gap-2 font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.notifications.channels.smsGateway}
                    onChange={(e) => handleNestedFieldChange('notifications', 'channels', 'smsGateway', e.target.checked)}
                    className="w-4 h-4 text-[#800000] rounded focus:ring-[#800000]"
                  />
                  <span>Devotee SMS Confirmations</span>
                </label>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-150">
                <span className="font-bold text-stone-800 block text-xs">Automated Alerts Dispatch Routing:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-500 mb-0.5 text-[11px]">Operations & Crowd Alerts to:</label>
                    <input
                      type="email"
                      value={localSettings.notifications.recipients.operationsAlertsTo}
                      onChange={(e) => handleNestedFieldChange('notifications', 'recipients', 'operationsAlertsTo', e.target.value)}
                      className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-0.5 text-[11px]">Devotee Grievance Escalations to:</label>
                    <input
                      type="email"
                      value={localSettings.notifications.recipients.grievanceAlertsTo}
                      onChange={(e) => handleNestedFieldChange('notifications', 'recipients', 'grievanceAlertsTo', e.target.value)}
                      className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: OPERATIONAL DEFAULTS */}
          {activeTab === 'operational' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-150 pb-3">
                <h3 className="text-sm font-bold text-stone-900">Perimeter & Crowd Threshold Defaults</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crowd Warning Threshold (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="95"
                    value={localSettings.operationalDefaults.crowdWarningThresholdPct}
                    onChange={(e) => handleFieldChange('operationalDefaults', 'crowdWarningThresholdPct', Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 font-mono"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Triggers amber indicator on site map</span>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">CCTV Sensor Ping Heartbeat (Secs)</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={localSettings.operationalDefaults.cctvHeartbeatPingSeconds}
                    onChange={(e) => handleFieldChange('operationalDefaults', 'cctvHeartbeatPingSeconds', Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 font-mono"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Camera online health polling interval</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Designated Emergency Evacuation Muster Point</label>
                <input
                  type="text"
                  value={localSettings.operationalDefaults.emergencyMusterZone}
                  onChange={(e) => handleFieldChange('operationalDefaults', 'emergencyMusterZone', e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50"
                />
              </div>
            </div>
          )}

          {/* SECTION 6: SYSTEM MAINTENANCE */}
          {activeTab === 'system_demo' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-150 pb-3">
                <h3 className="text-sm font-bold text-stone-900">System Maintenance & Cache Controls</h3>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between py-1 border-b border-stone-150">
                  <span className="text-stone-500">Environment Storage:</span>
                  <span className="font-mono font-bold text-stone-900">Active Session State</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-150">
                  <span className="text-stone-500">System Build:</span>
                  <span className="font-mono text-stone-800">{localSettings.systemDemoState.prototypeVersion}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Connected State Stores:</span>
                  <span className="font-medium text-emerald-700">{localSettings.systemDemoState.connectedDataStores}</span>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-2">
                <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-700" />
                  Restore Baseline Configuration
                </div>
                <p className="text-red-700 text-[11px] leading-relaxed">
                  Resetting system state will reload baseline records for Devotee Services, Operations, CMS, Reports, Grievances and RBAC permissions. Any local changes made during this session will be refreshed.
                </p>
                <button
                  onClick={handleResetConfirm}
                  className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore Baseline System Configuration
                </button>
              </div>
            </div>
          )}

          {/* Bottom Save Action Bar */}
          <div className="pt-4 border-t border-stone-150 flex items-center justify-between text-xs mt-4">
            <span className="text-stone-400 text-[11px]">
              Changes are immediately applied to the local demonstration session.
            </span>
            <button
              onClick={() => handleSaveSection(activeTab)}
              className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save {navItems.find((n) => n.id === activeTab)?.label}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Tab 2: Role-Based Access Control (RBAC) */}
      {mainNavTab === 'rbac' && (
        <div className="space-y-4">
          <UsersRoles />
        </div>
      )}
    </div>
  );
}

