import React, { useState, useMemo } from 'react';
import {
  Users,
  MapPin,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  Plus,
  TrendingUp,
  ChevronRight,
  Filter,
  Flame,
  Waves,
  Building,
  Navigation,
  Sparkles,
  Zap,
  ArrowRight,
  Compass,
  Search,
  Eye,
  Sliders,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  Legend,
} from 'recharts';
import { useTempleOperations } from '../context/TempleOperationsContext';
import OperationsPageHeader from '../components/temple-operations/shared/OperationsPageHeader';
import OperationsTabs from '../components/temple-operations/shared/OperationsTabs';
import OperationsMetricCard from '../components/temple-operations/shared/OperationsMetricCard';
import MatabariCrowdHeatmap from '../components/temple-operations/crowd/MatabariCrowdHeatmap';
import ZoneDetailDrawer from '../components/temple-operations/shared/ZoneDetailDrawer';

export default function CrowdControl() {
  const {
    zones,
    queues,
    incidents,
    updateQueueStatus,
    createIncident,
    updateZoneDensity,
  } = useTempleOperations();

  const [activeTab, setActiveTab] = useState('heatmap');
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneSearchQuery, setZoneSearchQuery] = useState('');
  const [zoneTypeFilter, setZoneTypeFilter] = useState('ALL');
  const [queueFilter, setQueueFilter] = useState('ALL');
  const [reportScenario, setReportScenario] = useState('today'); // 'today' | 'navratri' | 'diwali'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalOccupancy = zones.reduce((sum, z) => sum + z.currentOccupancy, 0);
    const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
    const attentionZones = zones.filter((z) => z.densityStatus === 'High' || z.densityStatus === 'Critical').length;
    const activeQueuesCount = queues.filter((q) => q.status === 'Active').length;
    const activeIncidents = incidents.filter((i) => i.status !== 'Resolved' && i.status !== 'Closed').length;

    return { totalOccupancy, totalCapacity, attentionZones, activeQueuesCount, activeIncidents };
  }, [zones, queues, incidents]);

  // Zone occupancy chart data with clean descriptive architectural labels
  const zoneChartData = useMemo(() => [
    {
      id: 'ZONE-A',
      name: 'Sanctum (Garbhagriha)',
      shortLabel: 'Sanctum',
      occupancy: 215,
      capacity: 250,
      percent: 86,
      status: 'Critical',
      color: '#EF4444',
      corridor: 'Char-chala dome',
    },
    {
      id: 'ZONE-B',
      name: 'Inner Parikrama Arcade',
      shortLabel: 'Parikrama',
      occupancy: 390,
      capacity: 600,
      percent: 65,
      status: 'Moderate',
      color: '#F59E0B',
      corridor: 'Circumambulation',
    },
    {
      id: 'ZONE-C',
      name: 'East Gate Plaza (Lakeside)',
      shortLabel: 'East Plaza',
      occupancy: 580,
      capacity: 800,
      percent: 73,
      status: 'High',
      color: '#EF4444',
      corridor: 'Lakefront holding',
    },
    {
      id: 'ZONE-D',
      name: 'Kalyansagar Stepped Ghat',
      shortLabel: 'Lake Ghat',
      occupancy: 210,
      capacity: 500,
      percent: 42,
      status: 'Normal',
      color: '#10B981',
      corridor: 'Turtle feeding steps',
    },
    {
      id: 'ZONE-E',
      name: 'Annadanam Dining Pavilion',
      shortLabel: 'Annadanam',
      occupancy: 180,
      capacity: 450,
      percent: 40,
      status: 'Normal',
      color: '#10B981',
      corridor: 'Bhog hall',
    },
    {
      id: 'ZONE-F',
      name: 'Tortoise Queue Colonnade',
      shortLabel: 'Queue Hall',
      occupancy: 820,
      capacity: 2500,
      percent: 33,
      status: 'Normal',
      color: '#10B981',
      corridor: 'Concentric galleries',
    },
    {
      id: 'ZONE-G',
      name: 'West Transit Terminal',
      shortLabel: 'Parking',
      occupancy: 260,
      capacity: 400,
      percent: 65,
      status: 'Moderate',
      color: '#F59E0B',
      corridor: 'Bus terminal',
    },
  ], []);

  // Multi-scenario report trend data matching Matabari temple schedule
  const reportTrendData = useMemo(() => {
    if (reportScenario === 'today') {
      return [
        { time: '06:00', devotees: 680, event: 'Temple Opens' },
        { time: '06:30', devotees: 1450, event: 'Mangala Aarti' },
        { time: '08:30', devotees: 1820, event: 'Morning Inflow' },
        { time: '10:30', devotees: 2650, event: 'Peak Darshan Rush' },
        { time: '12:30', devotees: 2100, event: 'Madhyanha Bhog Aarti' },
        { time: '14:00', devotees: 720, event: 'Midday Sanctum Cleaning' },
        { time: '16:30', devotees: 1950, event: 'Evening Reopening' },
        { time: '18:30', devotees: 2850, event: 'Sandhya Deepa Aarti' },
        { time: '20:00', devotees: 920, event: 'Temple Closes' },
      ];
    } else if (reportScenario === 'navratri') {
      return [
        { time: '06:00', devotees: 2800, event: 'Suprabhatam & Chandi Path' },
        { time: '06:30', devotees: 5200, event: 'Mangala Aarti' },
        { time: '08:30', devotees: 8400, event: 'Navratri Puja Inflow' },
        { time: '10:30', devotees: 12800, event: 'Maha Pushpanjali Peak' },
        { time: '12:30', devotees: 9800, event: 'Maha Bhog Offering' },
        { time: '14:00', devotees: 4200, event: 'Sanctum Alankara' },
        { time: '16:30', devotees: 11200, event: 'Dhanisagar Devotee Surge' },
        { time: '18:30', devotees: 14800, event: 'Maha Aarti & Deep Daan' },
        { time: '20:00', devotees: 6100, event: 'Late Night Parikrama' },
      ];
    } else {
      // Diwali Mela Surge (Over 200,000+ pilgrims daily)
      return [
        { time: '06:00', devotees: 14000, event: 'Early Kali Puja Darshan' },
        { time: '06:30', devotees: 24000, event: 'Dawn Mangala Aarti' },
        { time: '08:30', devotees: 38000, event: 'Fairground Pilgrim Arrival' },
        { time: '10:30', devotees: 52000, event: 'Kalyan Sagar Snan Peak' },
        { time: '12:30', devotees: 44000, event: 'Annadanam & Prasad Distribution' },
        { time: '14:00', devotees: 36000, event: 'Pilgrim Holding Rotation' },
        { time: '16:30', devotees: 58000, event: 'Diwali Mela Illumination' },
        { time: '18:30', devotees: 72000, event: 'Midnight Kali Puja Deepotsav' },
        { time: '20:00', devotees: 48000, event: 'Mela Grounds Cultural Pandals' },
      ];
    }
  }, [reportScenario]);

  const tabsConfig = [
    { id: 'heatmap', label: 'Live Architectural Heatmap', icon: MapPin },
    { id: 'overview', label: 'Campus Capacity & Load', icon: Users },
    { id: 'queues', label: 'Queue Management', icon: Clock, badge: queues.length },
    { id: 'zones', label: 'Zone Capacity Registry', icon: Filter, badge: zones.length },
    { id: 'reports', label: 'Crowd Pressure Reports', icon: TrendingUp },
  ];

  const handleRaiseAlertFromZone = (z) => {
    createIncident({
      zoneId: z.id,
      zoneName: z.name,
      category: 'Crowd Pressure Alert',
      severity: 'High',
      description: `Manual crowd density alert triggered for ${z.name}. Occupancy at ${z.currentOccupancy}/${z.capacity}.`,
      assignedStaffName: 'Standby Sevadal Wing',
    });
    showToast(`Crowd pressure alert raised for ${z.name}.`);
  };

  const filteredZones = useMemo(() => {
    return zones.filter((z) => {
      const matchesSearch =
        z.name.toLowerCase().includes(zoneSearchQuery.toLowerCase()) ||
        z.id.toLowerCase().includes(zoneSearchQuery.toLowerCase()) ||
        z.type.toLowerCase().includes(zoneSearchQuery.toLowerCase());
      const matchesType =
        zoneTypeFilter === 'ALL' ||
        z.type.toLowerCase().includes(zoneTypeFilter.toLowerCase());
      return matchesSearch && matchesType;
    });
  }, [zones, zoneSearchQuery, zoneTypeFilter]);

  const filteredQueues = useMemo(() => {
    if (queueFilter === 'ALL') return queues;
    if (queueFilter === 'Active') return queues.filter((q) => q.status === 'Active');
    if (queueFilter === 'Paused') return queues.filter((q) => q.status === 'Paused');
    if (queueFilter === 'Priority') return queues.filter((q) => q.priorityTier.toLowerCase().includes('priority') || q.priorityTier.toLowerCase().includes('assisted'));
    return queues;
  }, [queues, queueFilter]);

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <OperationsPageHeader
        title="Crowd & Queue Control Centre"
        subtitle="Real-time density heatmap, zone holding capacities, queue flow throttling and bottleneck alleviation"
        primaryActionLabel="Raise Crowd Alert"
        onPrimaryAction={() => {
          if (zones[0]) handleRaiseAlertFromZone(zones[0]);
        }}
        primaryActionIcon={ShieldAlert}
      />

      {/* Tabs */}
      <OperationsTabs tabs={tabsConfig} activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#38091B] text-white px-4 py-2.5 rounded-xl border border-[#B68A36]/40 shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TAB 1: ARCHITECTURAL CROWD HEATMAP */}
      {activeTab === 'heatmap' && (
        <div className="space-y-4">
          <MatabariCrowdHeatmap
            onSelectZone={(z) => setSelectedZone(z)}
            selectedZoneId={selectedZone?.id}
            onTriggerAction={(actionDesc) => {
              createIncident({
                zoneId: 'ZONE-A',
                zoneName: 'Main Sanctum & Parikrama',
                category: 'Crowd Throttling Override',
                severity: 'High',
                description: actionDesc,
                assignedStaffName: 'Rapid Response Marshals',
              });
              showToast(`Action dispatched: ${actionDesc}`);
            }}
          />
        </div>
      )}

      {/* TAB 2: CAMPUS CAPACITY & LOAD */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* 5 Operational KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <OperationsMetricCard
              label="Campus Devotee Inflow"
              value={metrics.totalOccupancy.toLocaleString('en-IN')}
              subtitle={`Of ${metrics.totalCapacity.toLocaleString('en-IN')} safe ceiling`}
              icon={Users}
              iconBg="bg-[#55132D]/10 text-[#55132D]"
            />
            <OperationsMetricCard
              label="Congested Sectors"
              value={metrics.attentionZones}
              subtitle="Exceeding 70% threshold"
              icon={AlertTriangle}
              iconBg="bg-rose-50 text-rose-700"
              onClick={() => setActiveTab('heatmap')}
            />
            <OperationsMetricCard
              label="Active Queue Lines"
              value={metrics.activeQueuesCount}
              subtitle="5 corridors manned"
              icon={Clock}
              iconBg="bg-blue-50 text-blue-700"
              onClick={() => setActiveTab('queues')}
            />
            <OperationsMetricCard
              label="Security & Sevadal"
              value="47"
              subtitle="Across 7 sectors & lake"
              icon={ShieldAlert}
              iconBg="bg-amber-50 text-amber-700"
            />
            <OperationsMetricCard
              label="Campus Load Factor"
              value={`${Math.round((metrics.totalOccupancy / metrics.totalCapacity) * 100)}%`}
              subtitle="Moderate pilgrim density"
              icon={TrendingUp}
              iconBg="bg-emerald-50 text-emerald-700"
            />
          </div>

          {/* Row 2: Zone Occupancy Bar Chart & Real-Time Entrance Gate Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Zone-Wise Occupancy vs Safe Ceiling (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    Zone-Wise Headcount vs Safe Perimeter Ceiling
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#55132D]" />
                    <span>Current Headcount</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-stone-400 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                    <span>Max Safe Ceiling</span>
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zoneChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <XAxis
                      dataKey="shortLabel"
                      tick={{ fontSize: 11, fill: '#78716c' }}
                      stroke="#e7e5e4"
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#78716c' }} stroke="#e7e5e4" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-[#38091B] text-white p-2.5 rounded-lg border border-[#B68A36]/40 shadow-xl text-xs space-y-1">
                              <div className="font-bold text-[#FFE8A3]">{item.name}</div>
                              <div className="text-stone-300 text-[11px]">{item.corridor}</div>
                              <div className="flex justify-between gap-3 text-white pt-1 border-t border-white/20">
                                <span>Current Devotees:</span>
                                <strong className="text-amber-300">{item.occupancy}</strong>
                              </div>
                              <div className="flex justify-between gap-3 text-stone-300">
                                <span>Safe Capacity Ceiling:</span>
                                <span>{item.capacity}</span>
                              </div>
                              <div className="text-[10px] text-stone-400 pt-0.5">
                                Occupancy: <strong className="text-white">{item.percent}%</strong> ({item.status})
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="capacity" name="Max Safe Ceiling" fill="#e7e5e4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="occupancy" name="Current Headcount" radius={[4, 4, 0, 0]}>
                      {zoneChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.percent > 75 ? '#DC2626' : entry.percent > 55 ? '#D97706' : '#55132D'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Status Chips Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-stone-100 text-xs">
                <div className="p-2 bg-stone-50 rounded-lg">
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">Highest Load</span>
                  <span className="font-bold text-rose-700">Sanctum (86%)</span>
                </div>
                <div className="p-2 bg-stone-50 rounded-lg">
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">Holding Reservoir</span>
                  <span className="font-bold text-emerald-700">Queue Colonnade (33%)</span>
                </div>
                <div className="p-2 bg-stone-50 rounded-lg">
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">Lakefront Descent</span>
                  <span className="font-bold text-stone-800">Kalyan Sagar (42%)</span>
                </div>
                <div className="p-2 bg-stone-50 rounded-lg">
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">Mahaprasad Dining</span>
                  <span className="font-bold text-stone-800">180 / 450 (Batch 4)</span>
                </div>
              </div>
            </div>

            {/* Entrance Gate Traffic Balance & Alleviation Protocol (1 col) */}
            <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    Entrance Gate Inflow Balance
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Balance
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-3">Devotee intake distribution across gateways</p>

                <div className="space-y-3">
                  {/* West Main Gopuram */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-stone-800">West Main Gopuram Gate</span>
                      <span className="font-bold font-mono text-[#55132D]">1,420 (53%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-600 rounded-full" style={{ width: '53%' }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-500">
                      <span>Pace: +38 dev/min</span>
                      <span className="text-rose-600 font-semibold">Turnstile Throttle Rec.</span>
                    </div>
                  </div>

                  {/* East Kalyan Sagar Gate */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-stone-800">East Lake Promenade Gate</span>
                      <span className="font-bold font-mono text-[#55132D]">755 (29%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '29%' }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-500">
                      <span>Pace: +14 dev/min</span>
                      <span className="text-amber-700 font-medium">Ghat Steps Monitored</span>
                    </div>
                  </div>

                  {/* North Assisted Ramp */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-stone-800">North Barrier-Free Ramp</span>
                      <span className="font-bold font-mono text-[#55132D]">480 (18%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '18%' }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-500">
                      <span>Pace: +8 dev/min</span>
                      <span className="text-emerald-700 font-medium">Smooth Assisted Flow</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tactical Actions */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  Quick Tactical Intervention
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      handleRaiseAlertFromZone(zones[0]);
                      showToast('Turnstile intake held for 3 minutes.');
                    }}
                    className="p-2 bg-[#55132D] hover:bg-[#681B37] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#E2BC6B]" />
                    <span>Hold West Gate 3m</span>
                  </button>
                  <button
                    onClick={() => showToast('4 Auxiliary Sevadal marshals dispatched to Lake Ghat.')}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
                  >
                    <Users className="w-3.5 h-3.5 text-stone-600" />
                    <span>Deploy 4 Sevadal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Daily Ritual Darshan Windows & Operational Timeline */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">
                  Daily Darshan Shifts & Sacred Aarti Protocol Timeline
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#55132D] bg-[#F8F5EF] px-3 py-1 rounded-lg border border-[#B68A36]/30">
                Current Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">Morning Session (06:00 AM – 01:00 PM)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">Active</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Praat (Mangala) Aarti concluded at 06:30 AM. Peak devotee inflow currently active through West and North corridors.
                </p>
                <div className="text-[10px] font-mono text-emerald-700 font-semibold pt-1">
                  Next Ritual: Madhyanha Bhog Aarti at 12:30 PM
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">Midday Closure (01:00 PM – 03:00 PM)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-700">Upcoming</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Sanctum closed for deity bhog offering, Garbhagriha ritual cleaning and corridor sanitization.
                </p>
                <div className="text-[10px] font-mono text-stone-500 font-semibold pt-1">
                  Queue lines hold in outer covered amphitheater
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">Evening Session (03:00 PM – 08:00 PM)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-700">Scheduled</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Sandhya Deepa Aarti at 06:30 PM with thousand-lamp lighting on the steps of Kalyan Sagar lake.
                </p>
                <div className="text-[10px] font-mono text-stone-500 font-semibold pt-1">
                  Anticipated evening surge: ~3,200 devotees
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUEUE MANAGEMENT */}
      {activeTab === 'queues' && (
        <div className="space-y-4">
          {/* Top Queue Operations Metrics */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-stone-500 text-[11px] block">Total Queued Devotees</span>
                <span className="text-lg font-bold font-mono text-stone-900">
                  {queues.reduce((s, q) => s + q.currentOccupancy, 0)}
                </span>
              </div>
              <div className="h-8 w-px bg-stone-200" />
              <div>
                <span className="text-stone-500 text-[11px] block">Average Wait Time</span>
                <span className="text-lg font-bold font-mono text-rose-700">
                  ~20 Mins
                </span>
              </div>
              <div className="h-8 w-px bg-stone-200" />
              <div>
                <span className="text-stone-500 text-[11px] block">Queue Lines Active</span>
                <span className="text-lg font-bold font-mono text-emerald-700">
                  {queues.filter((q) => q.status === 'Active').length} / {queues.length}
                </span>
              </div>
              <div className="h-8 w-px bg-stone-200" />
              <div>
                <span className="text-stone-500 text-[11px] block">Stationed Marshals</span>
                <span className="text-lg font-bold font-mono text-stone-800">
                  {queues.reduce((s, q) => s + q.assignedStaffCount, 0)} Officers
                </span>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              {['ALL', 'Active', 'Paused', 'Priority'].map((fil) => (
                <button
                  key={fil}
                  onClick={() => setQueueFilter(fil)}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    queueFilter === fil
                      ? 'bg-white text-[#55132D] shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {fil === 'ALL' ? 'All Lines' : fil}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQueues.map((q) => {
              const isActive = q.status === 'Active';
              const percent = Math.min(100, Math.round((q.currentOccupancy / q.capacity) * 100));

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-5 space-y-3 flex flex-col justify-between hover:border-[#B68A36]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-[#55132D] bg-[#55132D]/10 px-2 py-0.5 rounded">
                            {q.id}
                          </span>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {q.priorityTier}
                          </span>
                        </div>
                        <h4 className="font-bold text-stone-900 font-serif text-sm mt-1.5">{q.name}</h4>
                        <p className="text-xs text-stone-500">{q.zoneName}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-stone-100 text-stone-600 border-stone-300'
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-2 border border-stone-100 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-600">Holding Bay Occupancy:</span>
                        <strong className="text-stone-900 font-mono">
                          {q.currentOccupancy} / {q.capacity} ({percent}%)
                        </strong>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            percent > 80 ? 'bg-rose-600' : percent > 55 ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#B68A36]" />
                          <span>Wait: <strong>~{q.estimatedWaitMins} mins</strong></span>
                        </span>
                        <span>Intake: <strong>+{q.intakeRatePerMin} / min</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        const newStatus = isActive ? 'Paused' : 'Active';
                        updateQueueStatus(q.id, newStatus);
                        showToast(`Queue ${q.id} status updated to ${newStatus}.`);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isActive ? 'Pause Intake' : 'Resume Line'}</span>
                    </button>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {q.assignedStaffCount} Marshals Assigned
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ZONE CAPACITY REGISTRY */}
      {activeTab === 'zones' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sector by name, zone ID or architectural type..."
                  value={zoneSearchQuery}
                  onChange={(e) => setZoneSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <select
                value={zoneTypeFilter}
                onChange={(e) => setZoneTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#55132D]"
              >
                <option value="ALL">All Sectors ({zones.length})</option>
                <option value="Sanctuary">Sanctum Sanctorum</option>
                <option value="Circumambulation">Parikrama</option>
                <option value="Water">Lake & Ghats</option>
                <option value="Dining">Annadanam Hall</option>
                <option value="Ground">Queue & Fairgrounds</option>
                <option value="Transit">Parking & Transit</option>
              </select>
            </div>

            <div className="text-xs text-stone-500 font-mono">
              Total Monitored Capacity: <strong>{metrics.totalCapacity.toLocaleString('en-IN')} Devotees</strong>
            </div>
          </div>

          {/* Zones Table */}
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-stone-200 text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    <th className="py-3 px-4">Zone ID</th>
                    <th className="py-3 px-4">Architectural Sector</th>
                    <th className="py-3 px-4">Safe Capacity</th>
                    <th className="py-3 px-4">Current Load</th>
                    <th className="py-3 px-4">Density Status</th>
                    <th className="py-3 px-4">Safety Marshals</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150 text-xs text-stone-700">
                  {filteredZones.map((z) => {
                    const percent = Math.min(100, Math.round((z.currentOccupancy / z.capacity) * 100));
                    return (
                      <tr key={z.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#55132D]">{z.id}</td>
                        <td className="py-3 px-4">
                          <strong className="block text-stone-900 font-medium">{z.name}</strong>
                          <span className="text-[11px] text-stone-500">{z.description}</span>
                        </td>
                        <td className="py-3 px-4 font-bold font-mono text-stone-800">
                          {z.capacity.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="font-bold font-mono text-stone-900">
                              {z.currentOccupancy} <span className="text-[10px] text-stone-400">({percent}%)</span>
                            </div>
                            <div className="w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  percent > 75 ? 'bg-rose-600' : percent > 55 ? 'bg-amber-500' : 'bg-emerald-600'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              z.densityStatus === 'Critical'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : z.densityStatus === 'High'
                                ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                : z.densityStatus === 'Moderate'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {z.densityStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-stone-800">
                          {z.assignedStaffCount} Officers
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedZone(z)}
                            className="px-2.5 py-1 text-xs font-bold text-[#55132D] hover:bg-[#55132D]/10 rounded-lg transition-colors"
                          >
                            Inspect Sector
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CROWD PRESSURE REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-5">
          {/* Top Controls & Festival Surge Simulator */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                Devotee Inflow & Peak Pressure Curve
              </h3>
            </div>

            {/* Scenario Toggle */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              <button
                onClick={() => setReportScenario('today')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  reportScenario === 'today'
                    ? 'bg-white text-[#55132D] shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Today (Standard Day)
              </button>
              <button
                onClick={() => setReportScenario('navratri')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  reportScenario === 'navratri'
                    ? 'bg-white text-[#55132D] shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Sharad Navratri Peak
              </button>
              <button
                onClick={() => setReportScenario('diwali')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  reportScenario === 'diwali'
                    ? 'bg-white text-[#55132D] shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Diwali Mela Surge (2 Lakh+)
              </button>
            </div>
          </div>

          {/* Area Chart with Sacred Ritual Milestones */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
              <span className="font-semibold text-stone-800">
                Devotees Recorded Per 2-Hour Inflow Gate Cycle
              </span>
              <span className="text-[11px] text-[#55132D] font-bold">
                Scenario: {reportScenario === 'today' ? 'Standard 12,000 / day' : reportScenario === 'navratri' ? 'Festive 65,000 / day' : 'Mega Mela 2,20,000 / day'}
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportTrendData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#55132D" stopOpacity={0.45} />
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
                            <div className="font-bold text-[#FFE8A3]">{item.time} hrs — {item.event}</div>
                            <div className="flex justify-between gap-3 text-white pt-1 border-t border-white/20">
                              <span>Recorded Inflow:</span>
                              <strong className="text-amber-300 font-mono">{item.devotees.toLocaleString('en-IN')} devotees</strong>
                            </div>
                            <div className="text-[10.5px] text-stone-300">
                              Peak Gate Pressure Threshold: <span className="text-emerald-300">Controlled</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="devotees"
                    stroke="#55132D"
                    strokeWidth={2.5}
                    fill="url(#repGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4 Clearance & Dwell Time KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-xs text-stone-500 font-medium">Avg Sanctum Dwell Time</span>
              <div className="text-xl font-bold font-serif text-stone-900">42 Seconds</div>
              <p className="text-[11px] text-stone-400">Time spent before Garbhagriha altar</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-xs text-stone-500 font-medium">Hourly Gate Throughput</span>
              <div className="text-xl font-bold font-serif text-emerald-700">1,840 dev/hr</div>
              <p className="text-[11px] text-stone-400">Across 6 optical turnstiles</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-xs text-stone-500 font-medium">Emergency Evacuation Time</span>
              <div className="text-xl font-bold font-serif text-blue-700">4.5 Minutes</div>
              <p className="text-[11px] text-stone-400">Total campus clearance drill readiness</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-xs text-stone-500 font-medium">Peak Inflow Period</span>
              <div className="text-xl font-bold font-serif text-amber-700">10:30 – 11:30 AM</div>
              <p className="text-[11px] text-stone-400">Mid-morning puja peak rush</p>
            </div>
          </div>

          {/* Historical Festival Footfall Benchmarks */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-stone-900 font-serif">
              Annual Festival Surge Benchmarks & Crowd Management Protocols
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10.5px]">
                    <th className="py-2.5 px-3">Festival Event</th>
                    <th className="py-2.5 px-3">Calendar Period</th>
                    <th className="py-2.5 px-3">Expected Footfall</th>
                    <th className="py-2.5 px-3">Primary Crowd Bottleneck</th>
                    <th className="py-2.5 px-3">Deployed Contingency Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  <tr className="hover:bg-amber-50/20">
                    <td className="py-2.5 px-3 font-semibold text-stone-900">Diwali & Kali Puja Mela</td>
                    <td className="py-2.5 px-3 text-stone-500">Kartik Amavasya (Oct/Nov)</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-700">2,00,000+ Pilgrims</td>
                    <td className="py-2.5 px-3">Kalyan Sagar Ghat & Sanctum</td>
                    <td className="py-2.5 px-3 text-stone-600">State NDRF water safety, 3-tier perimeter holding bays</td>
                  </tr>
                  <tr className="hover:bg-amber-50/20">
                    <td className="py-2.5 px-3 font-semibold text-stone-900">Sharad Navratri / Durga Puja</td>
                    <td className="py-2.5 px-3 text-stone-500">Ashvin (Sept/Oct)</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-700">65,000 Pilgrims</td>
                    <td className="py-2.5 px-3">Inner Parikrama Arcade</td>
                    <td className="py-2.5 px-3 text-stone-600">One-way circumambulation flow, North ramp senior corridor</td>
                  </tr>
                  <tr className="hover:bg-amber-50/20">
                    <td className="py-2.5 px-3 font-semibold text-stone-900">Poila Boishakh (New Year)</td>
                    <td className="py-2.5 px-3 text-stone-500">Baisakh 1st (Mid-April)</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">35,000 Pilgrims</td>
                    <td className="py-2.5 px-3">West Archway Token Queues</td>
                    <td className="py-2.5 px-3 text-stone-600">8 computerized optical turnstiles, continuous token dispensing</td>
                  </tr>
                  <tr className="hover:bg-amber-50/20">
                    <td className="py-2.5 px-3 font-semibold text-stone-900">Nitya Darshan Baseline</td>
                    <td className="py-2.5 px-3 text-stone-500">Daily Year-Round</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">12,000 Pilgrims</td>
                    <td className="py-2.5 px-3">Sanctum Entry Doorway</td>
                    <td className="py-2.5 px-3 text-stone-600">Regular Sevadal rotation, 45-second altar dwell limit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Zone Detail Drawer */}
      <ZoneDetailDrawer
        zone={selectedZone}
        onClose={() => setSelectedZone(null)}
        onLogIncident={handleRaiseAlertFromZone}
      />
    </div>
  );
}

