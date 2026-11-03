import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Video,
  Users,
  Clock,
  ArrowRight,
  ExternalLink,
  Radio,
  Send,
  Building,
  RefreshCw,
  Bell,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INITIAL_ALERTS = [
  {
    id: 'ALT-1001',
    severity: 'Critical',
    category: 'Crowd & Queue',
    title: 'Zone A Inner Sanctum Queue Density Exceeds 88%',
    location: 'Inner Parikrama & Garbhagriha Approach (Zone A)',
    timestamp: 'Logged 8 mins ago (10:20 AM)',
    description: 'Devotee inflow through West Torana has created localized congestion near sanctum doorstep. Safe perimeter ceiling reached.',
    recommendedAction: 'Engage holding gate gating at Pavilion 2 and balance turnstiles by directing general queue to East corridor.',
    status: 'Active',
    targetRoute: '/crowd-control',
    targetRouteLabel: 'View Crowd Heatmap',
  },
  {
    id: 'ALT-1002',
    severity: 'Warning',
    category: 'CCTV & Surveillance',
    title: 'CCTV Cam #04 (Lake Approach West) Packet Jitter & Heartbeat Warning',
    location: 'Kalyan Sagar West Stepped Ghat (Camera CAM-04)',
    timestamp: 'Logged 14 mins ago (10:14 AM)',
    description: 'Sensor ping latency spiked to 620ms with intermittent frame drop on optical fiber node 2.',
    recommendedAction: 'Ping CCTV surveillance switch or assign IT network volunteer to inspect outdoor waterproof junction box.',
    status: 'Active',
    targetRoute: '/cctv-monitoring',
    targetRouteLabel: 'Open CCTV Surveillance',
  },
  {
    id: 'ALT-1003',
    severity: 'Warning',
    category: 'Devotee Safety',
    title: 'East Bathing Ghat Barrier Load Threshold Alert',
    location: 'Sacred Turtle Pier & Step Ghat (Zone D)',
    timestamp: 'Logged 22 mins ago (10:06 AM)',
    description: 'Concentration of devotees offering puffed rice to Bostami turtles exceeded 45 persons on lower water step.',
    recommendedAction: 'Deploy 2 Sevadal volunteers with megaphone advisory to prevent slippery step overcrowding.',
    status: 'Active',
    targetRoute: '/facilities',
    targetRouteLabel: 'View Ghat Facilities',
  },
  {
    id: 'ALT-1004',
    severity: 'Info',
    category: 'Gate & Ticketing',
    title: 'Turnstile Terminal T-03 Thermal Barcode Paper Low (< 15%)',
    location: 'North Entrance Automated Optical Gates',
    timestamp: 'Logged 35 mins ago (09:53 AM)',
    description: 'Printer spool sensor reports ~40 receipts remaining before roll replenishment required.',
    recommendedAction: 'Handover fresh 80mm thermal paper roll to Gate 2 counter attendant on duty.',
    status: 'Active',
    targetRoute: '/gate-management',
    targetRouteLabel: 'Open Gate Controls',
  },
  {
    id: 'ALT-1005',
    severity: 'Info',
    category: 'Campus Security',
    title: 'VIP Protocol Convoy Approaching North Perimeter Torana',
    location: 'Outer Approach Road (NH-8 Connecting Spur)',
    timestamp: 'Logged 41 mins ago (09:47 AM)',
    description: 'Gomati District Police escort vehicle reporting ETA 12 minutes for official State Guest delegation.',
    recommendedAction: 'Clear North Gate protocol driveway and alert duty supervisor Subal Bhattacharya for reception.',
    status: 'Active',
    targetRoute: '/staff-management',
    targetRouteLabel: 'View Staff Deployment',
  },
];

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAcknowledge = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Acknowledged' } : a))
    );
    showToast(`Alert ${id} acknowledged by administrator.`);
  };

  const handleResolve = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a))
    );
    showToast(`Alert ${id} marked as resolved & logged in security audit ledger.`);
  };

  const activeAlerts = alerts.filter((a) => a.status !== 'Resolved');

  const filteredAlerts = activeAlerts.filter((a) => {
    if (severityFilter === 'All') return true;
    return a.severity === severityFilter;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'Critical' && a.status !== 'Resolved').length;
  const warningCount = alerts.filter((a) => a.severity === 'Warning' && a.status !== 'Resolved').length;
  const infoCount = alerts.filter((a) => a.severity === 'Info' && a.status !== 'Resolved').length;

  return (
    <div className="space-y-5 pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#55132D] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#B68A36]/40 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-[#E2BC6B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Module Page Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight flex items-center gap-2.5">
            <span>Operational Alerts & Incident Response</span>
            {criticalCount > 0 && (
              <span className="text-xs font-bold font-sans px-2.5 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                {criticalCount} Critical
              </span>
            )}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/cctv-monitoring')}
            className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Video className="w-4 h-4 text-stone-500" />
            <span>CCTV Network</span>
          </button>
          <button
            onClick={() => navigate('/crowd-control')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Users className="w-4 h-4 text-[#E2BC6B]" />
            <span>Crowd Heatmap</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Severity Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Active Incidents</span>
            <span className="p-1.5 rounded-lg bg-stone-100 text-stone-700">
              <Bell className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-number text-stone-900">{activeAlerts.length}</div>
          <span className="text-[11px] text-stone-500 mt-1">Live campus triggers</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-rose-200 bg-rose-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-rose-700 mb-1">
            <span className="font-bold uppercase tracking-wider">Critical Priority</span>
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-number text-rose-800">{criticalCount}</div>
          <span className="text-[11px] text-rose-600 mt-1">Immediate intervention required</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-200 bg-amber-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-amber-800 mb-1">
            <span className="font-bold uppercase tracking-wider">Operational Warnings</span>
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-number text-amber-800">{warningCount}</div>
          <span className="text-[11px] text-amber-700 mt-1">Ghat barrier & camera jitter</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">System Notices</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-number text-stone-900">{infoCount}</div>
          <span className="text-[11px] text-stone-500 mt-1">Turnstiles & convoy reception</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto text-sm">
          {[
            { id: 'All', label: 'All Incidents', count: activeAlerts.length },
            { id: 'Critical', label: 'Critical Only', count: criticalCount },
            { id: 'Warning', label: 'Warnings', count: warningCount },
            { id: 'Info', label: 'System Notices', count: infoCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSeverityFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                severityFilter === tab.id
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  severityFilter === tab.id ? 'bg-[#E2BC6B] text-[#55132D]' : 'bg-stone-200 text-stone-800'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-mono hidden sm:inline">
          Last polled: Just now
        </span>
      </div>

      {/* Active Incidents Stream */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-stone-200 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-stone-900 font-serif">Campus Status All Clear</h3>
            <p className="text-xs text-stone-500 mt-1">
              No active operational incidents or security alerts in this queue.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl p-5 border shadow-xs transition-all space-y-3 ${
                alert.severity === 'Critical'
                  ? 'border-rose-300 ring-1 ring-rose-300/50 bg-rose-50/10'
                  : alert.severity === 'Warning'
                  ? 'border-amber-300/80 bg-amber-50/10'
                  : 'border-stone-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-150 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                    {alert.id}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      alert.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : alert.severity === 'Warning'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {alert.severity} Incident
                  </span>
                  <span className="text-[11px] font-semibold text-stone-600">{alert.category}</span>
                  <span className="text-[11px] text-stone-400">•</span>
                  <span className="text-[11px] text-stone-500">{alert.timestamp}</span>
                </div>

                <div className="flex items-center gap-2">
                  {alert.status === 'Acknowledged' ? (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      Acknowledged (Officer On Duty)
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Resolve</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif">{alert.title}</h3>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed">{alert.description}</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Recommended Command Directive:
                  </div>
                  <div className="font-medium text-stone-800">{alert.recommendedAction}</div>
                </div>

                <button
                  onClick={() => navigate(alert.targetRoute)}
                  className="px-3 py-1.5 text-xs font-bold text-[#55132D] bg-[#55132D]/10 hover:bg-[#55132D]/20 rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0 self-start md:self-auto"
                >
                  <span>{alert.targetRouteLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

