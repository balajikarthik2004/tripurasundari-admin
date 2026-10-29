import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useJitter } from "@/lib/use-live";
import { toast } from "sonner";
import {
  Car,
  Bike,
  AlertCircle,
  TrendingUp,
  IndianRupee,
  MapPin,
  Activity,
  Zap,
} from "lucide-react";
import { StatCard } from "../ui/StatCard";

// Static flow data – entry/exit vehicles per 5-min window (last 90 mins)
const flowData = Array.from({ length: 18 }).map((_, i) => ({
  t: `${i * 5}m`,
  entry: 10 + Math.round(Math.sin(i / 2) * 6 + 9),
  exit: 6 + Math.round(Math.cos(i / 2) * 3 + 5),
}));

// Hourly occupancy % for the last 6 hours (for bar chart)
const occupancyHistory = [
  { hour: "8AM", pct: 28 },
  { hour: "9AM", pct: 45 },
  { hour: "10AM", pct: 62 },
  { hour: "11AM", pct: 78 },
  { hour: "12PM", pct: 85 },
  { hour: "1PM", pct: 91 },
];

export function ParkingSection() {
  const lotA2W = useJitter(850, 15);
  const lotA4W = useJitter(210, 5);
  const lotB2W = useJitter(120, 10);
  const lotB4W = useJitter(340, 8);

  const totalCap2W = 1200;
  const totalCap4W = 750;
  const total2W = lotA2W + lotB2W;
  const total4W = lotA4W + lotB4W;
  const pct2WTotal = Math.round((total2W / totalCap2W) * 100);
  const pct4WTotal = Math.round((total4W / totalCap4W) * 100);

  const lots = [
    {
      name: "Main Lot A",
      sub: "Gopuram Entrance",
      capacity2W: 1000,
      filled2W: lotA2W,
      capacity4W: 250,
      filled4W: lotA4W,
      status: (lotA2W + lotA4W) / 1250 > 0.85 ? "BUSY" : "MODERATE",
    },
    {
      name: "Lot B",
      sub: "South Gate",
      capacity2W: 200,
      filled2W: lotB2W,
      capacity4W: 500,
      filled4W: lotB4W,
      status: (lotB2W + lotB4W) / 700 > 0.85 ? "BUSY" : "MODERATE",
    },
  ];

  const getStatusStyle = (status: string) => {
    if (status === "BUSY" || status === "CROWDED")
      return {
        badge: "bg-red-50 text-red-600 border border-red-200",
        dot: "bg-red-500 animate-pulse",
      };
    if (status === "MODERATE")
      return {
        badge: "bg-amber-50 text-amber-600 border border-amber-200",
        dot: "bg-amber-400 animate-pulse",
      };
    if (status === "INACTIVE")
      return {
        badge: "bg-slate-100 text-slate-500 border border-slate-200",
        dot: "bg-slate-400",
      };
    return {
      badge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
      dot: "bg-emerald-500",
    };
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 85) return "#ef4444";
    if (pct >= 60) return "#f59e0b";
    if (pct >= 40) return "#f97316";
    return "#10b981";
  };

  const getProgressBarClass = (pct: number) => {
    if (pct >= 85) return "bg-red-500";
    if (pct >= 60) return "bg-amber-500";
    if (pct >= 40) return "bg-orange-500";
    return "bg-emerald-500";
  };

  return (
    <div className="space-y-8">
      {/* ── Top KPI Stat Cards ── */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <StatCard
          icon={Bike}
          label="Two-Wheelers"
          value={total2W.toLocaleString()}
          valueSuffix={`/ ${totalCap2W.toLocaleString()}`}
          color="text-amber-600"
          bgTint="bg-amber-50 text-amber-600 border border-amber-100"
          progress={pct2WTotal}
          sub={`${pct2WTotal}% occupied`}
          trend={{ up: pct2WTotal > 70, text: `${pct2WTotal}%` }}
        />
        <StatCard
          icon={Car}
          label="Four-Wheelers"
          value={total4W.toLocaleString()}
          valueSuffix={`/ ${totalCap4W.toLocaleString()}`}
          color="text-indigo-600"
          bgTint="bg-indigo-50 text-indigo-600 border border-indigo-100"
          progress={pct4WTotal}
          sub={`${pct4WTotal}% occupied`}
          trend={{ up: pct4WTotal > 70, text: `${pct4WTotal}%` }}
        />
        <StatCard
          icon={Zap}
          label="Fill Speed"
          value="+18"
          valueSuffix="veh/min"
          color="text-primary"
          bgTint="bg-primary/5 text-primary border border-primary/20"
          sub="net arrivals per minute"
          trend={{ up: true, text: "↑ surge" }}
        />
        <StatCard
          icon={IndianRupee}
          label="Daily Revenue"
          value="₹42.5K"
          color="text-emerald-600"
          bgTint="bg-emerald-50 text-emerald-600 border border-emerald-100"
          sub="estimated collection"
          trend={{ up: true, text: "+8.2%" }}
        />
      </div>

      {/* ── Top Row: Lot Cards + AI Alert ── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">

        {/* Lot Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {lots.map((l) => {
            const { badge, dot } = getStatusStyle(l.status);
            return (
              <div
                key={l.name}
                className="rounded-2xl border border-border/40 bg-white/80 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[14px] font-bold text-foreground">
                    {l.name} <span className="font-normal text-muted-foreground">({l.sub})</span>
                  </div>
                  <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${badge}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                    {l.status}
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { Icon: Bike, label: "Two-Wheelers", filled: l.filled2W, cap: l.capacity2W },
                    { Icon: Car, label: "Four-Wheelers", filled: l.filled4W, cap: l.capacity4W },
                  ].map(({ Icon, label, filled, cap }) => (
                    <div key={label} className="flex items-center justify-between text-[13px]">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Icon size={13} /> {label}
                      </span>
                      <span className="tabular-nums font-semibold text-foreground">
                        {filled} / {cap}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Alert Card */}
        <div className="relative overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 to-rose-50/60 backdrop-blur-xl p-6 shadow-md">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-200/60 to-transparent" />
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-400/20 blur-[30px]" />
          <div className="relative z-10 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-red-600 mb-2">
            <div className="p-1.5 rounded-lg bg-red-100">
              <AlertCircle size={14} className="text-red-600" />
            </div>
            Action Required
          </div>
          <p className="relative z-10 mt-1 text-[13px] leading-relaxed text-foreground">
            Main Lot A (Two-Wheelers) is approaching critical capacity (85%). At
            the current net flow rate, it will be completely full in{" "}
            <strong>14 minutes</strong>.
          </p>
          <div className="relative z-10 mt-4 flex flex-col gap-2">
            <button
              onClick={() => toast.success("Overflow Grounds activated. LED signages updated.")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md"
            >
              Activate Overflow Grounds
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white/70 px-4 py-2.5 text-[11px] font-bold text-foreground transition-colors hover:bg-red-50">
              Dismiss Alert
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Chart + Live Map ── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">

        {/* Vehicle Flow Chart */}
        <div className="rounded-3xl border border-border/50 bg-white/70 backdrop-blur-xl p-6 lg:p-8 shadow-md">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity size={20} className="text-primary" />
                <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                  Vehicle Traffic Flow
                </h3>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Entry vs Exit — Last 90 Minutes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700">
                <div className="h-2 w-2 rounded-full bg-amber-500" /> Entry
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-700">
                <div className="h-2 w-2 rounded-full bg-indigo-500" /> Exit
              </div>
            </div>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flowData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradEntry" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradExit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={30} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                  cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Area type="monotone" dataKey="entry" stroke="#f59e0b" strokeWidth={2.5} fill="url(#gradEntry)" name="Entry/min" dot={false} activeDot={{ r: 5, fill: "#f59e0b", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="exit" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradExit)" name="Exit/min" dot={false} activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Aisle Map */}
        <div className="rounded-3xl border border-border/50 bg-white/70 backdrop-blur-xl p-6 shadow-md">
          <div className="mb-4 flex items-center gap-2">
            <MapPin size={14} className="text-primary" />
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Live Map · Main Lot A
            </div>
          </div>
          <div className="relative rounded-2xl bg-slate-50/80 border border-border/30 p-4">
            <svg viewBox="0 0 400 250" className="w-full drop-shadow-sm h-[200px]">
              <rect width="400" height="250" rx="12" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
              <path d="M 200 0 L 200 250" stroke="var(--border)" strokeWidth="36" fill="none" opacity="0.25" strokeDasharray="8 8" />
              <text x="200" y="125" textAnchor="middle" transform="rotate(-90 200 125)" fontSize="9" fontWeight="700" letterSpacing="0.1em" fill="var(--muted-foreground)">MAIN DRIVEWAY</text>
              <g transform="translate(200, 16)">
                <circle r="10" fill="var(--saffron)" opacity="0.9" />
                <path d="M -3,-2 L 0,3 L 3,-2" stroke="white" strokeWidth="2" fill="none" />
              </g>
              <text x="200" y="36" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--saffron)">ENTRY</text>
              <g>
                <rect x="18" y="18" width="152" height="214" rx="8"
                  fill={getProgressColor(Math.round((lotA2W / 1000) * 100))}
                  fillOpacity="0.12"
                  stroke={getProgressColor(Math.round((lotA2W / 1000) * 100))}
                  strokeWidth="1.5"
                />
                <text x="94" y="95" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--foreground)">Two-Wheelers</text>
                <text x="94" y="116" textAnchor="middle" fontSize="20" fontWeight="900" fill={getProgressColor(Math.round((lotA2W / 1000) * 100))}>{Math.round((lotA2W / 1000) * 100)}%</text>
                <text x="94" y="134" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--muted-foreground)">{lotA2W} / 1000</text>
                <rect x="30" y="148" width="120" height="6" rx="3" fill="var(--border)" fillOpacity="0.4" />
                <rect x="30" y="148" width={Math.round((lotA2W / 1000) * 120)} height="6" rx="3" fill={getProgressColor(Math.round((lotA2W / 1000) * 100))} />
              </g>
              <g>
                <rect x="230" y="18" width="152" height="214" rx="8"
                  fill={getProgressColor(Math.round((lotA4W / 250) * 100))}
                  fillOpacity="0.12"
                  stroke={getProgressColor(Math.round((lotA4W / 250) * 100))}
                  strokeWidth="1.5"
                />
                <text x="306" y="95" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--foreground)">Four-Wheelers</text>
                <text x="306" y="116" textAnchor="middle" fontSize="20" fontWeight="900" fill={getProgressColor(Math.round((lotA4W / 250) * 100))}>{Math.round((lotA4W / 250) * 100)}%</text>
                <text x="306" y="134" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--muted-foreground)">{lotA4W} / 250</text>
                <rect x="242" y="148" width="120" height="6" rx="3" fill="var(--border)" fillOpacity="0.4" />
                <rect x="242" y="148" width={Math.round((lotA4W / 250) * 120)} height="6" rx="3" fill={getProgressColor(Math.round((lotA4W / 250) * 100))} />
              </g>
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}
