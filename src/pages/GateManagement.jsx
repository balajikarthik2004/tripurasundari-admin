import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ScanLine,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  UserCheck,
  Zap,
  Building,
  Navigation,
  Compass,
  ArrowRight,
  Maximize2,
  Lock,
  Unlock,
  Radio,
  FileText,
  User,
  QrCode,
  Flame,
  Waves,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTempleOperations } from '../context/TempleOperationsContext';
import { useDevoteeServices } from '../context/DevoteeServicesContext';
import { INITIAL_DARSHAN_BOOKINGS } from '../data/darshanBookings';
import OperationsPageHeader from '../components/temple-operations/shared/OperationsPageHeader';
import OperationsTabs from '../components/temple-operations/shared/OperationsTabs';
import OperationsMetricCard from '../components/temple-operations/shared/OperationsMetricCard';

export default function GateManagement({ isEmbedded = false }) {
  const { entryPoints } = useTempleOperations();
  const { darshanBookings: contextBookings } = useDevoteeServices();

  // Combine context bookings with master bookings to ensure complete coverage
  const allMasterBookings = useMemo(() => {
    return contextBookings && contextBookings.length > 0 ? contextBookings : INITIAL_DARSHAN_BOOKINGS;
  }, [contextBookings]);

  const [activeTab, setActiveTab] = useState('verification');
  const [gateSubView, setGateSubView] = useState('metrics');
  const [scanQuery, setScanQuery] = useState('DRSN-2026-1001');
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [selectedGateLane, setSelectedGateLane] = useState('GATE-01-LANE-2');
  const [toastMessage, setToastMessage] = useState(null);

  // Initial verified pass state pre-populated with Ramesh Kumar
  const [verificationResult, setVerificationResult] = useState({
    status: 'Valid',
    message: 'Pass Verified. Turnstile barrier unlocked for 4 Devotee(s).',
    booking: {
      id: 'DRSN-2026-1001',
      devoteeName: 'Ramesh Kumar',
      mobile: '+91 98765 43210',
      serviceName: 'Special Entry Darshan',
      slotLabel: '09:30 AM – 11:30 AM',
      gate: 'Gate 2 (West Enclosure Turnstile #2)',
      devoteesCount: 4,
      amount: 1000,
      paymentStatus: 'Paid',
      notes: 'Wheelchair assistance requested for senior citizen devotee.',
    },
    admitted: false,
    timestamp: 'Just now',
    securityHash: 'SHA256-TRIPURA-77A912',
  });

  // Recent Entry Audit Log
  const [entryRecords, setEntryRecords] = useState([
    {
      id: 'VER-9901',
      ticketId: 'DRSN-2026-1004',
      gateName: 'West Main Torana Gopuram (Lane 1)',
      devoteeName: 'Anil Verma',
      serviceName: 'Suprabhatam Aarti',
      time: '10:28 AM',
      devoteesCount: 3,
      result: 'Valid / Admitted',
      staffName: 'Officer T. Majumder',
    },
    {
      id: 'VER-9902',
      ticketId: 'DRSN-2026-1006',
      gateName: 'North Barrier-Free Ramp (Lane 3)',
      devoteeName: 'Subhashree Roy',
      serviceName: 'Special Entry Darshan',
      time: '10:15 AM',
      devoteesCount: 5,
      result: 'Valid / Admitted',
      staffName: 'Volunteer B. Chakraborty',
    },
    {
      id: 'VER-9903',
      ticketId: 'USED-TOKEN-01',
      gateName: 'West Main Torana Gopuram (Lane 2)',
      devoteeName: 'Duplicate Token',
      serviceName: 'General Darshan',
      time: '09:58 AM',
      devoteesCount: 1,
      result: 'Rejected (Duplicate Scan)',
      staffName: 'Officer T. Majumder',
    },
    {
      id: 'VER-9904',
      ticketId: 'DRSN-2026-1002',
      gateName: 'East Lake Promenade Gate (Lane 4)',
      devoteeName: 'Priya Sharma',
      serviceName: 'Special Entry Darshan',
      time: '09:42 AM',
      devoteesCount: 2,
      result: 'Valid / Admitted',
      staffName: 'Safety Marshal N. Das',
    },
  ]);

  // Search & Filter in Audit Records Tab
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditStatusFilter, setAuditStatusFilter] = useState('ALL');

  // Emergency override state per gate
  const [emergencyUnlockedGates, setEmergencyUnlockedGates] = useState({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleEmergencyGate = (gateId) => {
    setEmergencyUnlockedGates((prev) => {
      const isCurrentlyUnlocked = !!prev[gateId];
      const updated = { ...prev, [gateId]: !isCurrentlyUnlocked };
      showToast(
        !isCurrentlyUnlocked
          ? `Emergency override active: ${gateId} turnstiles held OPEN.`
          : `${gateId} returned to standard optical scan verification.`
      );
      return updated;
    });
  };

  // Hourly Turnstile Velocity Chart Data
  const throughputData = useMemo(() => [
    { time: '06:00', rate: 240, label: 'Praat Mangala Aarti' },
    { time: '08:00', rate: 680, label: 'Morning Darshan' },
    { time: '10:00', rate: 1240, label: 'Peak Mid-Morning Rush' },
    { time: '12:00', rate: 980, label: 'Madhyanha Bhog' },
    { time: '14:00', rate: 320, label: 'Sanctum Cleaning' },
    { time: '16:00', rate: 890, label: 'Evening Reopening' },
    { time: '18:00', rate: 1420, label: 'Sandhya Aarti Peak' },
    { time: '20:00', rate: 410, label: 'Night Closure' },
  ], []);

  // Quick Vouchers for Rapid Demonstration
  const sampleVouchers = [
    { id: 'DRSN-2026-1001', name: 'Ramesh Kumar (4 Pax)', badge: 'Special Entry' },
    { id: 'DRSN-2026-1004', name: 'Anil Verma (3 Pax)', badge: 'Suprabhatam' },
    { id: 'DRSN-2026-1006', name: 'Subhashree Roy (5 Pax)', badge: 'Special Entry' },
    { id: 'DRSN-2026-1003', name: 'S. Lakshmi (2 Pax)', badge: 'Senior Ramp' },
    { id: 'USED-TOKEN-01', name: 'Duplicate Pass', badge: 'Previously Used' },
    { id: 'INVALID-QR-99', name: 'Corrupt Hash', badge: 'Unregistered' },
  ];

  const handleScanPass = (targetId) => {
    const query = (targetId || scanQuery).trim();
    if (!query) return;

    if (query === 'USED-TOKEN-01') {
      setVerificationResult({
        status: 'Duplicate',
        message: 'Pass already scanned previously at 08:30 AM at West Gate Turnstile #1. Duplicate entry prohibited by Trust Security Protocol.',
        booking: {
          id: query,
          devoteeName: 'Prior Admitted Devotee',
          serviceName: 'General Darshan',
          devoteesCount: 1,
          slotLabel: '07:00 AM – 09:00 AM',
          gate: 'West Gopuram Gate',
        },
        admitted: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        securityHash: 'DUP-BLOCKED-SEC-8819',
      });
      return;
    }

    if (query.includes('INVALID') || query.includes('UNKNOWN')) {
      setVerificationResult({
        status: 'Invalid',
        message: 'Security Hash Mismatch: QR signature could not be verified in Mata Tripura Sundari Shrine Board computerized registry. Direct devotee to Help Desk Counter 1.',
        booking: null,
        admitted: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        securityHash: 'HASH-FAILED-REJECTED',
      });
      return;
    }

    // Match against real darshan booking records
    const matched = allMasterBookings.find(
      (b) => b.id.toLowerCase() === query.toLowerCase() || b.mobile === query
    );

    if (matched) {
      if (matched.status === 'Cancelled' || matched.status === 'Rejected') {
        setVerificationResult({
          status: 'Rejected',
          message: `Booking ${matched.id} is marked ${matched.status}. Admission Denied. Direct devotee to Admin Office.`,
          booking: matched,
          admitted: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          securityHash: `REVOKED-${matched.id}`,
        });
      } else {
        setVerificationResult({
          status: 'Valid',
          message: `Pass Verified. Turnstile barrier unlocked for ${matched.devoteesCount} Devotee(s).`,
          booking: matched,
          admitted: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          securityHash: `SHA256-${matched.id}-${Math.floor(1000 + Math.random() * 9000)}`,
        });
      }
    } else {
      setVerificationResult({
        status: 'Invalid',
        message: `Pass reference "${query}" not found in current daily allocation ledger. Please re-enter or check devotee contact number.`,
        booking: null,
        admitted: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        securityHash: 'NOT-FOUND',
      });
    }
  };

  const handleAuthorizeAdmission = () => {
    if (!verificationResult || !verificationResult.booking || verificationResult.status !== 'Valid') return;
    const b = verificationResult.booking;
    const newLog = {
      id: `VER-${Math.floor(9900 + Math.random() * 99)}`,
      ticketId: b.id,
      gateName: b.gate || 'West Main Torana Gopuram (Lane 2)',
      devoteeName: b.devoteeName,
      serviceName: b.serviceName || 'General Darshan',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      devoteesCount: b.devoteesCount || 1,
      result: 'Valid / Admitted',
      staffName: 'Officer T. Majumder',
    };

    setEntryRecords((prev) => [newLog, ...prev]);
    setVerificationResult((prev) => ({
      ...prev,
      admitted: true,
      message: `✓ Devotee admitted. Pass ${b.id} validated and logged into Shrine Board ledger. Turnstile relocked.`,
    }));

    showToast(`Admitted ${b.devoteesCount} devotee(s) for ${b.devoteeName}.`);
  };

  const filteredAuditRecords = useMemo(() => {
    return entryRecords.filter((rec) => {
      const matchesSearch =
        rec.ticketId.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        rec.devoteeName.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        rec.gateName.toLowerCase().includes(auditSearchQuery.toLowerCase());
      const matchesStatus =
        auditStatusFilter === 'ALL' ||
        (auditStatusFilter === 'Valid' && rec.result.includes('Valid')) ||
        (auditStatusFilter === 'Rejected' && rec.result.includes('Rejected'));
      return matchesSearch && matchesStatus;
    });
  }, [entryRecords, auditSearchQuery, auditStatusFilter]);

  const handleExportAuditCSV = () => {
    const headers = ['Verification ID', 'Pass Reference', 'Gate Location', 'Devotee Name', 'Ritual Service', 'Timestamp', 'Devotees Count', 'Verdict', 'Officer'];
    const rows = filteredAuditRecords.map((r) => [
      r.id,
      r.ticketId,
      `"${r.gateName}"`,
      `"${r.devoteeName}"`,
      `"${r.serviceName}"`,
      `"${r.time}"`,
      r.devoteesCount,
      `"${r.result}"`,
      `"${r.staffName}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Matabari_Gate_Verification_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Gate admissions audit ledger exported to CSV.');
  };

  const tabsConfig = [
    { id: 'verification', label: 'Ticket Verification Station', icon: ScanLine },
    { id: 'overview_gates', label: 'Overview & Entry Gates', icon: ShieldCheck },
    { id: 'records', label: 'Entry Audit Records', icon: CheckCircle2, badge: entryRecords.length },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Laser Scanning Keyframe Animation */}
      <style>{`
        @keyframes laserSweep {
          0% {
            top: 6%;
            opacity: 0.95;
          }
          50% {
            top: 90%;
            opacity: 1;
          }
          100% {
            top: 6%;
            opacity: 0.95;
          }
        }
        .laser-line {
          animation: laserSweep 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Header (Hidden when embedded) */}
      {!isEmbedded && (
        <OperationsPageHeader
          title="Gate & Ticket Verification Administration"
          primaryActionLabel="Live Verification Station"
          onPrimaryAction={() => setActiveTab('verification')}
          primaryActionIcon={ScanLine}
        />
      )}

      {/* Tabs */}
      <OperationsTabs tabs={tabsConfig} activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 sm:right-6 z-[9999] bg-[#38091B] text-white px-4 py-2.5 rounded-xl border border-[#B68A36]/40 shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TAB 1: TICKET VERIFICATION STATION (LIVE ADMISSION TERMINAL) */}
      {activeTab === 'verification' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: OPTICAL SCANNER VIEWFINDER & TURNSTILE LANES (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Optical Laser Scanner Viewfinder Frame */}
            <div className="bg-[#1A0610] rounded-2xl border border-[#B68A36]/40 shadow-2xl p-5 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#55132D] border border-[#B68A36]/40 text-[#E2BC6B]">
                    <ScanLine className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-white">
                      Optical Turnstile Laser Scanner
                    </h3>
                    <p className="text-[11px] text-[#EADECF]/70">
                      High-speed optical camera & barcode reader at West Torana Gopuram
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    SCANNER ONLINE
                  </span>
                </div>
              </div>

              {/* Graphical Viewfinder Scanner Screen */}
              <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center">
                {/* Background Tech Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#55132D_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                {/* Corner Crosshairs */}
                <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#E2BC6B]" />
                <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#E2BC6B]" />
                <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#E2BC6B]" />
                <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#E2BC6B]" />

                {/* Animated Red Laser Scanning Beam */}
                {isScanningActive && (
                  <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_12px_#EF4444] laser-line pointer-events-none" />
                )}

                {/* Center QR Reticle Target */}
                <div className="relative flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
                  <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#E2BC6B]/60 flex items-center justify-center mb-2 bg-black/40 backdrop-blur-xs">
                    <QrCode className="w-8 h-8 text-[#E2BC6B]" />
                  </div>
                  <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                    Align QR / Barcode Here
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    Or enter pass reservation reference below
                  </span>
                </div>

                {/* HUD Overlay Details */}
                <div className="absolute top-3 left-4 text-[10px] font-mono text-stone-400">
                  DEV-ID: <span className="text-white">SCAN-GATE-01</span>
                </div>
                <div className="absolute top-3 right-4 text-[10px] font-mono text-stone-400">
                  LATENCY: <span className="text-emerald-400">14ms</span>
                </div>
                <div className="absolute bottom-3 left-4 text-[10px] font-mono text-stone-400">
                  GATE: <span className="text-amber-300">West Gopuram Lane 2</span>
                </div>
                <div className="absolute bottom-3 right-4 text-[10px] font-mono text-stone-400">
                  OPTICAL SENSOR: <span className="text-white">1080p ANPR Active</span>
                </div>
              </div>

              {/* Manual Entry Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleScanPass(scanQuery);
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={scanQuery}
                    onChange={(e) => setScanQuery(e.target.value)}
                    placeholder="Scan barcode or enter Booking ID (e.g. DRSN-2026-1001)..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-black/50 border border-white/20 text-white font-mono font-bold placeholder:text-stone-500 focus:outline-none focus:border-[#E2BC6B] shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl border border-[#B68A36]/40 shadow-lg flex items-center gap-2 transition-all flex-shrink-0"
                >
                  <ScanLine className="w-4 h-4 text-[#E2BC6B]" />
                  <span>Verify Pass</span>
                </button>
              </form>

              {/* Quick Verified Pass Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Quick Access Tokens (Real Temple Darshan Passes):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleVouchers.map((voucher) => (
                    <button
                      key={voucher.id}
                      type="button"
                      onClick={() => {
                        setScanQuery(voucher.id);
                        handleScanPass(voucher.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 text-[11px] font-mono transition-colors flex items-center gap-1.5"
                    >
                      <span>{voucher.id}</span>
                      <span className="text-[9px] text-[#FFE8A3] bg-[#55132D]/80 px-1 py-0.2 rounded font-sans">
                        {voucher.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Turnstile Lanes Operational Health */}
            <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 font-serif text-sm">
                    West Torana Gate Turnstile Lanes Status
                  </h4>
                  <p className="text-xs text-stone-500">Live optical barrier motor health and admission counters</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  All 4 Lanes Operating
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-800">Lane 1</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] text-stone-500">General West Queue</div>
                  <div className="font-mono font-bold text-stone-900">1,420 Devotees</div>
                  <div className="text-[10px] text-emerald-700">+18 dev/min</div>
                </div>

                <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-800">Lane 2</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] text-stone-500">Special Pass (₹250)</div>
                  <div className="font-mono font-bold text-stone-900">580 Devotees</div>
                  <div className="text-[10px] text-amber-700">+12 dev/min</div>
                </div>

                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-800">Lane 3</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] text-stone-500">North Senior Ramp</div>
                  <div className="font-mono font-bold text-stone-900">240 Devotees</div>
                  <div className="text-[10px] text-emerald-700">+6 dev/min</div>
                </div>

                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-800">Lane 4</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] text-stone-500">Lakefront Promenade</div>
                  <div className="font-mono font-bold text-stone-900">415 Devotees</div>
                  <div className="text-[10px] text-emerald-700">+14 dev/min</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PASS VALIDATION VERDICT & LIVE ADMISSION FEED (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Dynamic Pass Validation Result Card */}
            {verificationResult && (
              <div
                className={`rounded-2xl p-5 border shadow-md space-y-4 transition-all duration-200 ${
                  verificationResult.status === 'Valid'
                    ? 'bg-[#F9FDFB] border-emerald-300 text-stone-900'
                    : verificationResult.status === 'Duplicate'
                    ? 'bg-[#FFFDF5] border-amber-300 text-stone-900'
                    : 'bg-[#FFF8F8] border-rose-300 text-stone-900'
                }`}
              >
                {/* Verdict Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    {verificationResult.status === 'Valid' ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
                        <XCircle className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif font-bold text-sm tracking-tight text-stone-900">
                        {verificationResult.status === 'Valid' ? 'PASS VALIDATED — UNLOCKED' : 'ACCESS PROHIBITED'}
                      </h4>
                      <span className="text-[10px] font-mono text-stone-500">
                        Security Hash: {verificationResult.securityHash}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                      verificationResult.status === 'Valid'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}
                  >
                    {verificationResult.status}
                  </span>
                </div>

                {/* Validation Message */}
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {verificationResult.message}
                </p>

                {/* Devotee Credentials Breakdown */}
                {verificationResult.booking && (
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs space-y-2.5 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">PRIMARY DEVOTEE</span>
                        <strong className="text-sm font-serif text-stone-900">
                          {verificationResult.booking.devoteeName}
                        </strong>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {verificationResult.booking.mobile}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block font-mono">PASS REFERENCE</span>
                        <strong className="font-mono text-xs text-[#55132D] bg-[#55132D]/10 px-2 py-0.5 rounded">
                          {verificationResult.booking.id}
                        </strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11.5px]">
                      <div>
                        <span className="text-stone-400 text-[10px] block">RITUAL / SERVICE</span>
                        <span className="font-semibold text-stone-800">
                          {verificationResult.booking.serviceName}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">HEADCOUNT</span>
                        <span className="font-bold text-stone-900">
                          {verificationResult.booking.devoteesCount} Devotee(s)
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">SCHEDULED SLOT</span>
                        <span className="font-medium text-stone-800">
                          {verificationResult.booking.slotLabel}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">ASSIGNED CORRIDOR</span>
                        <span className="font-medium text-stone-800">
                          {verificationResult.booking.gate || 'West Torana Lane 2'}
                        </span>
                      </div>
                    </div>

                    {verificationResult.booking.notes && (
                      <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                        <strong>Special Request:</strong> {verificationResult.booking.notes}
                      </div>
                    )}
                  </div>
                )}

                {/* Admission Trigger Button */}
                {verificationResult.status === 'Valid' && (
                  <button
                    onClick={handleAuthorizeAdmission}
                    disabled={verificationResult.admitted}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center gap-2 ${
                      verificationResult.admitted
                        ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                        : 'bg-[#55132D] hover:bg-[#681B37] text-white'
                    }`}
                  >
                    <Unlock className="w-4 h-4 text-[#E2BC6B]" />
                    <span>
                      {verificationResult.admitted
                        ? 'Devotee Admitted & Gate Relocked'
                        : 'Unlock Turnstile & Authorize Entry'}
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Live Admitted Devotees Rolling Feed */}
            <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="font-bold text-stone-900 font-serif text-sm">
                    Recent Verified Admissions
                  </h4>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">Live Gate Stream</span>
              </div>

              <div className="space-y-2">
                {entryRecords.slice(0, 4).map((record) => (
                  <div
                    key={record.id}
                    className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between text-xs hover:bg-stone-100/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-stone-900 truncate">{record.devoteeName}</strong>
                        <span className="text-[10px] font-mono text-stone-500 bg-stone-200/80 px-1.5 py-0.2 rounded">
                          {record.ticketId}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">
                        {record.gateName} • {record.devoteesCount} pax
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="font-mono text-[10px] text-stone-500 block">{record.time}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          record.result.includes('Valid')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {record.result.includes('Valid') ? 'ADMITTED' : 'BLOCKED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW & ENTRY GATES (Segmented Sub-switch) */}
      {activeTab === 'overview_gates' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg w-fit border border-stone-200">
            <button
              onClick={() => setGateSubView('metrics')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                gateSubView === 'metrics'
                  ? 'bg-white text-[#55132D] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Turnstile Throughput & Metrics
            </button>
            <button
              onClick={() => setGateSubView('gates')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                gateSubView === 'gates'
                  ? 'bg-white text-[#55132D] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Configured Entry Checkpoints ({entryPoints.length})
            </button>
          </div>

          {gateSubView === 'metrics' && (
            <div className="space-y-5">
          {/* 4 Operations KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <OperationsMetricCard
              label="Active Checkpoint Portals"
              value={entryPoints.length}
              icon={Layers}
              iconBg="bg-[#55132D]/10 text-[#55132D]"
              onClick={() => { setActiveTab('overview_gates'); setGateSubView('gates'); }}
            />
            <OperationsMetricCard
              label="Today's Verified Admissions"
              value="4,980"
              trend="+12% inflow velocity"
              icon={CheckCircle2}
              iconBg="bg-emerald-50 text-emerald-700"
            />
            <OperationsMetricCard
              label="Intercepted Scan Attempts"
              value="28"
              icon={AlertTriangle}
              iconBg="bg-amber-50 text-amber-700"
            />
            <OperationsMetricCard
              label="Optical Scanner Network"
              value="10 / 10 Active"
              icon={ScanLine}
              iconBg="bg-blue-50 text-blue-700"
            />
          </div>

          {/* Turnstile Velocity Chart & Gate Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Turnstile Throughput Velocity (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    Hourly Turnstile Admission Velocity
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#55132D] bg-[#F8F5EF] px-2.5 py-1 rounded-lg border border-[#B68A36]/30">
                  Peak: 1,420 dev/hr
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={throughputData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gateVelocityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#55132D" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#55132D" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#78716c' }} stroke="#e7e5e4" />
                    <YAxis tick={{ fontSize: 11, fill: '#78716c' }} stroke="#e7e5e4" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-[#38091B] text-white p-2.5 rounded-lg border border-[#B68A36]/40 shadow-xl text-xs space-y-1">
                              <div className="font-bold text-[#FFE8A3]">{item.time} hrs — {item.label}</div>
                              <div className="flex justify-between gap-3 text-white pt-1 border-t border-white/20">
                                <span>Throughput Rate:</span>
                                <strong className="text-amber-300 font-mono">{item.rate} devotees/hr</strong>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="#55132D"
                      strokeWidth={2.5}
                      fill="url(#gateVelocityGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Gate Inspection Spotlight (1 col) */}
            <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif mb-3">
                  Primary Access Portals Summary
                </h3>

                <div className="space-y-2 text-xs">
                  {entryPoints.slice(0, 4).map((g) => (
                    <div
                      key={g.id}
                      className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-stone-900 truncate">{g.name}</div>
                        <div className="text-[11px] text-stone-500">{g.scannersOnline} scanners online</div>
                      </div>
                      <span className="font-mono font-bold text-[#55132D] text-xs">
                        {g.dailyVerifications} passes
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('gates')}
                className="w-full pt-3 border-t border-stone-100 text-xs font-bold text-[#55132D] hover:underline flex items-center justify-between"
              >
                <span>View All 6 Entry Gate Configurations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

          {gateSubView === 'gates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entryPoints.map((gate) => {
            const isEmergencyOpen = !!emergencyUnlockedGates[gate.id];

            return (
              <div
                key={gate.id}
                className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-[#B68A36]/40 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-[#55132D] bg-[#55132D]/10 px-2 py-0.5 rounded">
                      {gate.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isEmergencyOpen
                          ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {isEmergencyOpen ? 'EMERGENCY HELD OPEN' : gate.operationalStatus}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 font-serif text-sm mt-2">{gate.name}</h4>
                  <p className="text-xs text-stone-500">{gate.zoneName} • {gate.type} Access Point</p>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs space-y-1.5 mt-3">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Optical Scanners:</span>
                      <strong className="text-emerald-800 font-mono">{gate.scannersOnline} units online</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Station In-Charge:</span>
                      <span className="text-stone-800 font-medium truncate max-w-[170px]">
                        {gate.assignedStaff}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Daily Admissions:</span>
                      <strong className="text-stone-900 font-mono">{gate.dailyVerifications} passes</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-200/60">
                      <span>Inspection Timestamp:</span>
                      <span>{gate.lastInspection}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => toggleEmergencyGate(gate.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isEmergencyOpen
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    {isEmergencyOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{isEmergencyOpen ? 'Restore Scanned Entry' : 'Emergency Open Barrier'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setScanQuery(gate.id === 'GATE-02' ? 'DRSN-2026-1003' : 'DRSN-2026-1001');
                      setActiveTab('verification');
                    }}
                    className="text-[#55132D] font-bold hover:underline"
                  >
                    Open Terminal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </div>
      )}

      {/* TAB 4: ENTRY AUDIT RECORDS */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          {/* Controls & Export Header */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search audit log by pass reference, devotee name, or gate..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <select
                value={auditStatusFilter}
                onChange={(e) => setAuditStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#55132D]"
              >
                <option value="ALL">All Audit Statuses</option>
                <option value="Valid">Valid / Admitted</option>
                <option value="Rejected">Rejected / Duplicate</option>
              </select>
            </div>

            <button
              onClick={handleExportAuditCSV}
              className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-200 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit CSV</span>
            </button>
          </div>

          {/* Audit Records Table */}
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-stone-200 text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    <th className="py-3 px-4">Verification ID</th>
                    <th className="py-3 px-4">Pass Reference</th>
                    <th className="py-3 px-4">Gate Location</th>
                    <th className="py-3 px-4">Devotee Name</th>
                    <th className="py-3 px-4">Ritual Service</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Headcount</th>
                    <th className="py-3 px-4">Scan Verdict</th>
                    <th className="py-3 px-4">Duty Officer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150 text-xs text-stone-700">
                  {filteredAuditRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#55132D]">{rec.id}</td>
                      <td className="py-3.5 px-4 font-mono text-stone-900 font-semibold">{rec.ticketId}</td>
                      <td className="py-3.5 px-4 text-stone-700">{rec.gateName}</td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">{rec.devoteeName}</td>
                      <td className="py-3.5 px-4 text-stone-600">{rec.serviceName}</td>
                      <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap font-mono">{rec.time}</td>
                      <td className="py-3.5 px-4 font-bold font-mono">{rec.devoteesCount}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.result.includes('Valid')
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {rec.result}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">{rec.staffName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
