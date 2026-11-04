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
    location: 'Inner Parikrama (Zone A)',
    timestamp: '8 mins ago',
    description: 'Devotee inflow through West Torana has created localized congestion near sanctum doorstep.',
    recommendedAction: 'Engage Pavilion 2 holding gate and direct general queue to East corridor.',
    status: 'Active',
    targetRoute: '/crowd-control',
    targetRouteLabel: 'View Crowd Heatmap',
  },
  {
    id: 'ALT-1002',
    severity: 'Warning',
    category: 'CCTV & Surveillance',
    title: 'CCTV Cam #04 (Lake Approach West) Packet Jitter & Heartbeat Warning',
    location: 'Kalyan Sagar West Ghat (CAM-04)',
    timestamp: '14 mins ago',
    description: 'Latency spiked to 620ms with intermittent frame drop on optical fiber node 2.',
    recommendedAction: 'Inspect outdoor waterproof junction box or restart CCTV switch.',
    status: 'Active',
    targetRoute: '/cctv-monitoring',
    targetRouteLabel: 'Open CCTV Surveillance',
  },
  {
    id: 'ALT-1003',
    severity: 'Warning',
    category: 'Devotee Safety',
    title: 'East Bathing Ghat Barrier Load Threshold Alert',
    location: 'Sacred Turtle Pier (Zone D)',
    timestamp: '22 mins ago',
    description: 'Concentration of devotees offering puffed rice exceeded 45 persons on lower water step.',
    recommendedAction: 'Deploy 2 Sevadal volunteers with megaphones to prevent slippery step overcrowding.',
    status: 'Active',
    targetRoute: '/facilities',
    targetRouteLabel: 'View Ghat Facilities',
  },
  {
    id: 'ALT-1004',
    severity: 'Info',
    category: 'Gate & Ticketing',
    title: 'Turnstile Terminal T-03 Thermal Barcode Paper Low (< 15%)',
    location: 'North Automated Optical Gates',
    timestamp: '35 mins ago',
    description: 'Printer spool reports ~40 receipts remaining before roll replenishment is required.',
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
    timestamp: '41 mins ago',
    description: 'Gomati District Police escort vehicle reporting ETA 12 minutes for official delegation.',
    recommendedAction: 'Clear North Gate protocol driveway and alert duty supervisor for reception.',
    status: 'Active',
    targetRoute: '/staff-management',
    targetRouteLabel: 'View Staff Deployment',
  },
];

export default function Alerts({ isEmbedded = false }) {
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

      {/* Module Page Header (Hidden when embedded) */}
      {!isEmbedded && (
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-[#55132D]" />
            </div>
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
      )}

      {/* Active Incidents Stream */}
      <div className="space-y-3.5">
        {activeAlerts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-stone-200 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-stone-900 font-serif">Campus Status All Clear</h3>
            <p className="text-xs text-stone-500 mt-1">
              No active operational incidents or security alerts in this queue.
            </p>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl p-4 sm:p-4.5 border shadow-2xs hover:shadow-subtle transition-all space-y-2.5 ${
                alert.severity === 'Critical'
                  ? 'border-rose-200 bg-rose-50/15'
                  : alert.severity === 'Warning'
                  ? 'border-amber-200 bg-amber-50/15'
                  : 'border-stone-200 bg-white'
              }`}
            >
              {/* Header: ID, Severity, Category, Time & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-150/70 pb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                    {alert.id}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full ${
                      alert.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : alert.severity === 'Warning'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs font-semibold text-stone-700">{alert.category}</span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500">{alert.timestamp}</span>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {alert.status === 'Acknowledged' ? (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      Acknowledged
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Resolve</span>
                  </button>
                </div>
              </div>

              {/* Title & Concise Summary */}
              <div>
                <h3 className="text-sm sm:text-[15px] font-bold text-stone-900 leading-snug">
                  {alert.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              {/* Directive Strip & Direct Navigation Action */}
              <div className="pt-2 border-t border-stone-150/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-baseline gap-1.5 text-stone-700 min-w-0">
                  <span className="font-bold text-[#55132D] text-[11px] uppercase tracking-wider shrink-0">
                    Directive:
                  </span>
                  <span className="text-stone-700 font-medium">
                    {alert.recommendedAction}
                  </span>
                </div>

                <button
                  onClick={() => navigate(alert.targetRoute)}
                  className="font-bold text-xs text-[#55132D] hover:underline flex items-center gap-1 shrink-0 cursor-pointer self-start sm:self-auto"
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

