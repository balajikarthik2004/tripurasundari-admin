import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  PieChart as PieChartIcon,
  ChevronRight,
  UserCheck,
  Ban,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Flame,
  Sparkles,
  Plus,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useDarshanBookings } from '../../context/DarshanBookingContext';

export default function BookingOverviewTab({ onOpenDetails, onSwitchTab, onOpenCreate }) {
  const { bookings, services, slots, cancellations, metrics, selectedDate, getSlotOccupancy } = useDarshanBookings();
  const [chartPeriod, setChartPeriod] = useState('Today');

  // Chart trend data according to selected period
  const trendData = useMemo(() => {
    if (chartPeriod === 'Today') {
      return [
        { slot: 'Mangala', time: '05:00 - 07:00', booked: 320, available: 80, capacity: 400 },
        { slot: 'Pratah', time: '07:00 - 09:00', booked: 520, available: 80, capacity: 600 },
        { slot: 'Alankara', time: '09:00 - 11:30', booked: 680, available: 20, capacity: 700 },
        { slot: 'Bhog', time: '11:30 - 13:30', booked: 640, available: 60, capacity: 700 },
        { slot: 'Madhyahna', time: '13:30 - 15:30', booked: 380, available: 120, capacity: 500 },
        { slot: 'Sandhya', time: '15:30 - 18:00', booked: 590, available: 110, capacity: 700 },
        { slot: 'Aarti', time: '18:00 - 20:30', booked: 580, available: 70, capacity: 650 },
      ];
    } else if (chartPeriod === '7 Days') {
      return [
        { slot: '25 Oct', time: '25 Oct', booked: 3640, available: 860, capacity: 4500 },
        { slot: '26 Oct', time: '26 Oct', booked: 3820, available: 680, capacity: 4500 },
        { slot: '27 Oct', time: '27 Oct', booked: 3750, available: 750, capacity: 4500 },
        { slot: '28 Oct', time: '28 Oct', booked: 4140, available: 360, capacity: 4500 },
        { slot: '29 Oct', time: '29 Oct', booked: 4210, available: 290, capacity: 4500 },
        { slot: '30 Oct', time: '30 Oct', booked: 3980, available: 520, capacity: 4500 },
        { slot: '31 Oct', time: '31 Oct', booked: 4125, available: 375, capacity: 4500 },
      ];
    } else {
      return [
        { slot: 'Week 1', time: 'Week 1', booked: 26200, available: 5300, capacity: 31500 },
        { slot: 'Week 2', time: 'Week 2', booked: 27450, available: 4050, capacity: 31500 },
        { slot: 'Week 3', time: 'Week 3', booked: 28100, available: 3400, capacity: 31500 },
        { slot: 'Week 4', time: 'Week 4', booked: 28680, available: 2820, capacity: 31500 },
      ];
    }
  }, [chartPeriod]);

  // Dynamic breakdown by service category synchronized with selected chart period & live bookings
  const distributionData = useMemo(() => {
    // Dynamic delta from user-added bookings
    const sessionDeltas = {
      General: 0,
      Special: 0,
      VIP: 0,
      Assisted: 0,
      Ritual: 0,
    };
    bookings.forEach((b) => {
      const cat = b.category || 'Special';
      if (sessionDeltas[cat] !== undefined) {
        sessionDeltas[cat] += Number(b.devoteesCount) || 1;
      }
    });

    // Base counts aligned with slot schedule & devotee inflow volume
    let base = {
      General: 2180,
      Special: 860,
      Assisted: 340,
      Ritual: 210,
      VIP: 120,
    };

    if (chartPeriod === '7 Days') {
      base = {
        General: 16250,
        Special: 6420,
        Assisted: 2540,
        Ritual: 1570,
        VIP: 885,
      };
    } else if (chartPeriod === '30 Days') {
      base = {
        General: 65100,
        Special: 25400,
        Assisted: 9940,
        Ritual: 6200,
        VIP: 3790,
      };
    }

    const total =
      base.General +
      base.Special +
      base.Assisted +
      base.Ritual +
      base.VIP +
      (sessionDeltas.General + sessionDeltas.Special + sessionDeltas.Assisted + sessionDeltas.Ritual + sessionDeltas.VIP);

    const items = [
      {
        name: 'General Darshan',
        category: 'General',
        value: base.General + sessionDeltas.General,
        color: '#55132D',
        desc: 'Main West queue (Free entry)',
      },
      {
        name: 'Special Entry Darshan',
        category: 'Special',
        value: base.Special + sessionDeltas.Special,
        color: '#B68A36',
        desc: 'Expedited corridor (₹250)',
      },
      {
        name: 'Senior & Divyangjan',
        category: 'Assisted',
        value: base.Assisted + sessionDeltas.Assisted,
        color: '#2563EB',
        desc: 'Assisted ramp & wheelchair access',
      },
      {
        name: 'Suprabhatam & Aarti',
        category: 'Ritual',
        value: base.Ritual + sessionDeltas.Ritual,
        color: '#0D9488',
        desc: 'Mangala Aarti sanctum quota',
      },
      {
        name: 'VIP & Protocol Passage',
        category: 'VIP',
        value: base.VIP + sessionDeltas.VIP,
        color: '#831843',
        desc: 'State dignitaries & official delegates',
      },
    ];

    return items.map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
    }));
  }, [bookings, chartPeriod]);

  const totalDistributionDevotees = useMemo(() => {
    return distributionData.reduce((acc, curr) => acc + curr.value, 0);
  }, [distributionData]);

  // Devotee cancellation requests requiring temple authority decision
  const pendingCancellationRequests = useMemo(() => {
    return cancellations.filter((c) => c.status === 'Requested').slice(0, 5);
  }, [cancellations]);

  const releasedCapacityCount = useMemo(() => {
    return cancellations
      .filter((c) => c.status === 'Approved')
      .reduce((sum, c) => sum + (Number(c.devoteesCount) || 1), 0);
  }, [cancellations]);

  // Upcoming slots today
  const slotProgress = useMemo(() => {
    return slots.slice(0, 4).map((slot) => {
      const occ = getSlotOccupancy(slot.id, selectedDate);
      return {
        ...slot,
        ...occ,
      };
    });
  }, [slots, selectedDate, getSlotOccupancy]);

  return (
    <div className="space-y-5">
      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-[#B68A36]/40 transition-colors">
          <div className="flex items-center justify-between text-sm text-stone-600 mb-2">
            <span className="font-semibold text-stone-700">Today's Bookings</span>
            <span className="p-1.5 rounded-lg bg-[#55132D]/10 text-[#55132D]">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-number text-stone-900">
              {metrics.totalToday.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs sm:text-[13px] text-emerald-700 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-[#B68A36]/40 transition-colors">
          <div className="flex items-center justify-between text-sm text-stone-600 mb-2">
            <span className="font-semibold text-stone-700">Confirmed & Active</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-number text-emerald-950">
              {metrics.confirmedToday.toLocaleString('en-IN')}
            </div>
            <div className="mt-1.5 text-xs sm:text-[13px] text-stone-500 font-medium truncate">
              <span>94.2% verified confirmation</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-[#B68A36]/40 transition-colors">
          <div className="flex items-center justify-between text-sm text-stone-600 mb-2">
            <span className="font-semibold text-stone-700">Remaining Capacity</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-number text-stone-900">
              {metrics.totalAvailableCapacityToday.toLocaleString('en-IN')}
            </div>
            <div className="mt-1.5 text-xs sm:text-[13px] text-stone-500 font-medium truncate">
              <span>Of {metrics.totalMaxCapacityToday.toLocaleString('en-IN')} total quota</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onSwitchTab('cancellations')}
          className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-amber-400 cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-sm text-stone-600 mb-2">
            <span className="font-semibold text-stone-700">Cancellation Requests</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-number text-amber-900">
              {metrics.cancellationRequestsTotal}
            </div>
            <div className="mt-1.5 text-xs sm:text-[13px] text-amber-700 font-medium truncate">
              <span>Awaiting authority approval</span>
            </div>
          </div>
        </div>

        {/* Metric 5 */}
        <div
          onClick={() => onSwitchTab('cancellations')}
          className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-blue-400 cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-sm text-stone-600 mb-2">
            <span className="font-semibold text-stone-700">Quota Released</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-number text-blue-950">
              {releasedCapacityCount}
            </div>
            <div className="mt-1.5 text-xs sm:text-[13px] text-blue-700 font-medium truncate">
              <span>Restored to daily quota</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts (Booking Inflow Trend & Service Distribution Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif">
                Darshan Booking Volume & Slot Utilization
              </h3>
            </div>
            {/* Period selector */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              {['Today', '7 Days', '30 Days'].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    chartPeriod === period
                      ? 'bg-white text-[#55132D] shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <XAxis dataKey="slot" tick={{ fontSize: 11, fill: '#78716c' }} stroke="#e7e5e4" />
                <YAxis tick={{ fontSize: 11, fill: '#78716c' }} stroke="#e7e5e4" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const occupancy = Math.round((data.booked / data.capacity) * 100);
                      return (
                        <div className="bg-[#38091B] text-white p-2.5 rounded-lg border border-[#B68A36]/40 shadow-xl text-xs space-y-1">
                          <div className="font-bold text-[#FFE8A3]">{data.slot} Darshan ({data.time})</div>
                          <div className="text-white flex justify-between gap-3">
                            <span>Booked Devotees:</span>
                            <span className="font-bold">{data.booked.toLocaleString()}</span>
                          </div>
                          <div className="text-emerald-300 flex justify-between gap-3">
                            <span>Available Quota:</span>
                            <span className="font-bold">{data.available.toLocaleString()}</span>
                          </div>
                          <div className="text-stone-300 text-[10.5px] pt-1 border-t border-white/20">
                            Occupancy: <strong className="text-amber-300">{occupancy}%</strong> of {data.capacity.toLocaleString()} total quota
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  iconSize={10}
                />
                <Bar
                  dataKey="booked"
                  name="Booked Devotees"
                  stackId="a"
                  fill="#55132D"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="available"
                  name="Available Quota"
                  stackId="a"
                  fill="#E2BC6B"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution Pie/Donut Chart */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 font-serif">
                Service Distribution
              </h3>
              <PieChartIcon className="w-4 h-4 text-[#B68A36]" />
            </div>
          </div>

          {/* Donut Chart with Centered Dynamic Statistics */}
          <div className="relative h-52 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-[#38091B] text-white p-2.5 rounded-lg border border-[#B68A36]/40 shadow-xl text-xs space-y-1">
                          <div className="font-bold text-[#FFE8A3]">{item.name}</div>
                          <div className="text-stone-300 text-[11px]">{item.desc}</div>
                          <div className="text-white font-semibold flex items-center justify-between gap-3 pt-1 border-t border-white/20">
                            <span>{item.value.toLocaleString('en-IN')} devotees</span>
                            <span className="text-amber-300 font-bold">({item.percentage}%)</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-lg font-bold font-number text-stone-900 leading-tight">
                {totalDistributionDevotees.toLocaleString('en-IN')}
              </span>
              <span
                style={{ fontSize: '9.5px', letterSpacing: '0.06em' }}
                className="uppercase font-semibold text-stone-500 mt-0.5"
              >
                Devotees
              </span>
              <span
                style={{ fontSize: '9.5px', lineHeight: '12px' }}
                className="font-medium text-[#55132D] bg-[#55132D]/5 px-2 py-0.5 rounded-full border border-[#55132D]/15 mt-1"
              >
                {chartPeriod}
              </span>
            </div>
          </div>

          {/* Legend Items with Devotee Counts and Percent Badges */}
          <div className="space-y-1.5 pt-2.5 border-t border-stone-100 text-xs">
            {distributionData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs hover:bg-stone-50/80 px-1 py-0.5 rounded transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-stone-700 font-medium truncate" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-stone-900 font-bold font-mono">
                    {item.value.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 border border-stone-200">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming Slot Schedule & Recent Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Slot Schedule Status */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif">
                Today's Slot Schedule & Real-Time Capacity
              </h3>
            </div>
            <button
              onClick={() => onSwitchTab('slots')}
              className="text-xs font-semibold text-[#55132D] hover:underline flex items-center gap-1"
            >
              <span>Manage Slots</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {slotProgress.map((slot) => {
              const isFull = slot.isFull;
              return (
                <div
                  key={slot.id}
                  className="p-3 rounded-lg border border-stone-100 bg-stone-50/60 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{slot.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-medium">
                        {slot.period}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-700">
                        {slot.bookedDevotees} / {slot.maxCapacity}
                      </span>
                      {isFull ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                          FULL
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {slot.availableCapacity} left
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        slot.percentage >= 90
                          ? 'bg-rose-600'
                          : slot.percentage >= 70
                          ? 'bg-amber-600'
                          : 'bg-[#55132D]'
                      }`}
                      style={{ width: `${Math.min(100, slot.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Devotee Cancellation Requests */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                  <span>Devotee Cancellation Requests</span>
                  {metrics.cancellationRequestsTotal > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                      {metrics.cancellationRequestsTotal}
                    </span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => onSwitchTab('cancellations')}
                className="text-xs font-semibold text-[#55132D] hover:underline flex items-center gap-1"
              >
                <span>View All ({cancellations.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingCancellationRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 border border-dashed border-stone-200 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
                <p className="font-medium text-stone-700">No pending cancellation requests</p>
                <p className="text-stone-400 mt-1">All devotee cancellation submissions have been processed.</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {pendingCancellationRequests.map((c) => {
                  const matchedBooking = bookings.find((b) => b.id === c.bookingId);
                  return (
                    <div
                      key={c.id}
                      onClick={() => onSwitchTab('cancellations')}
                      className="py-2.5 flex items-center justify-between hover:bg-amber-50/40 px-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{c.devoteeName}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                            {c.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 truncate mt-0.5" title={c.reason}>
                          &ldquo;{c.reason}&rdquo;
                        </p>
                        <div className="text-[10px] text-stone-400 flex items-center gap-2 mt-0.5">
                          <span>{c.bookingId}</span>
                          <span>•</span>
                          <span>{c.devoteesCount} Devotee(s)</span>
                          <span>•</span>
                          <span>{c.slotLabel}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (matchedBooking) {
                              onOpenDetails(matchedBooking);
                            } else {
                              onSwitchTab('cancellations');
                            }
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-[#55132D] bg-[#55132D]/10 hover:bg-[#55132D]/20 rounded-md transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">Need to issue an offline counter pass?</span>
            <button
              onClick={onOpenCreate}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2BC6B] shrink-0" />
              <span>Create Booking</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

