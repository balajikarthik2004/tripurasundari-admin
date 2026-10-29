import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useJitter } from "@/lib/use-live";
import { toast } from "sonner";
import { Plus, Pause, Megaphone, Merge, Siren, AlertOctagon } from "lucide-react";
const lanes = [
  {
    name: "Queue A",
    waiting: 620,
    max: 800,
    wait: 52,
    vols: 8,
    status: "ACTIVE",
    bgTint: "bg-saffron/10",
  },
  {
    name: "Queue B",
    waiting: 540,
    max: 800,
    wait: 46,
    vols: 6,
    status: "ACTIVE",
    bgTint: "bg-info/10",
  },
  {
    name: "Queue C",
    waiting: 280,
    max: 500,
    wait: 28,
    vols: 4,
    status: "ACTIVE",
    bgTint: "bg-emerald/10",
  },
  {
    name: "VIP Lane",
    waiting: 34,
    max: 100,
    wait: 8,
    vols: 2,
    status: "ACTIVE",
    bgTint: "bg-gold/10",
  },
  {
    name: "Special Darshan",
    waiting: 12,
    max: 200,
    wait: 5,
    vols: 1,
    status: "LIMITED",
    bgTint: "bg-primary/5",
  },
];
const waitTrend = Array.from({ length: 16 }).map((_, i) => ({
  t: `${i * 15}m`,
  A: 30 + Math.round(Math.sin(i / 2) * 14 + i),
  B: 25 + Math.round(Math.cos(i / 2) * 10 + i * 0.8),
  C: 18 + Math.round(Math.sin(i / 3) * 7),
  VIP: 5 + Math.round(Math.sin(i) * 3),
}));
export function QueueSection() {
  const intake = useJitter(200, 10);
  return (
    <div className="space-y-4">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {lanes.map((l) => {
          const pct = l.waiting / l.max;
          return (
            <div key={l.name} className={`kpi-card p-6 flex flex-col justify-between ${l.bgTint}`}>
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">{l.name}</div>
                <span
                  className={`flex items-center gap-1 text-[10px] ${l.status === "ACTIVE" ? "text-emerald" : "text-status-busy"}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-xl ${l.status === "ACTIVE" ? "bg-emerald" : "bg-status-busy"}`}
                  />
                  {l.status}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-end gap-1.5">
                  <span className="text-xl font-montserrat font-semibold tabular-nums leading-none">
                    {l.waiting}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground mb-0.5">
                    / {l.max}
                  </span>
                </div>
                <div className="mt-1 text-[10px] font-normal text-muted-foreground text-right">
                  {Math.round(pct * 100)}% Full
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs border-t border-border pt-3">
                <span className="rounded bg-saffron/10 px-2 py-1 font-medium text-saffron">
                  {l.wait} min wait
                </span>
                <span className="font-normal text-muted-foreground">{l.vols} vols</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-xl border border-saffron/50 bg-saffron/5">
        <div className="flex items-center gap-2 border-b border-saffron/20 bg-saffron/10 px-4 py-3">
          <AlertOctagon size={16} className="text-saffron" />
          <div className="text-xs font-bold text-saffron">AI Optimization Recommended</div>
        </div>
        <div className="p-8">
          <div className="text-sm font-bold text-foreground">Open Special Darshan Lane</div>
          <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Main queues are approaching 80% saturation. Projected wait times will exceed safety
            thresholds (75 mins) in approximately 22 minutes.
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => toast.success("Special Darshan Lane Opened.")}
              className="flex-1 rounded-xl bg-saffron py-2 text-xs font-medium text-white hover:bg-saffron/90"
            >
              Execute
            </button>
            <button className="flex-1 rounded-xl border border-border bg-surface py-2 text-xs font-semibold text-foreground hover:bg-muted">
              Dismiss
            </button>
          </div>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold text-foreground">Queue Wait Time Trend</div>
            <div className="flex items-center gap-8">
              <span className="text-xs font-extrabold text-muted-foreground">Last 4 Hours</span>
              <span className="rounded bg-saffron/10 px-2 py-0.5 text-xs font-semibold text-saffron">
                Peak: 54 min
              </span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waitTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="var(--border)"
                  opacity={0.5}
                  vertical={false}
                />
                <XAxis
                  dataKey="t"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                  tickFormatter={(val) => `${val}m`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontWeight: 600 }}
                  labelStyle={{
                    fontWeight: "bold",
                    color: "var(--foreground)",
                    marginBottom: "4px",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, paddingTop: "20px", fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="A"
                  name="Queue A"
                  stroke="var(--saffron)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="B"
                  name="Queue B"
                  stroke="var(--info)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="C"
                  name="Queue C"
                  stroke="var(--emerald)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="VIP"
                  name="VIP Lane"
                  stroke="var(--gold)"
                  strokeWidth={3}
                  dot={false}
                  strokeDasharray="5 5"
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="mb-2 text-sm font-medium">Queue Actions</div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {[
                { i: Plus, l: "Open New Queue Lane" },
                { i: Pause, l: "Pause Queue Intake" },
                { i: Megaphone, l: "Announce Wait Time" },
                { i: Merge, l: "Merge Queues A & B" },
                { i: Siren, l: "Emergency Queue Clear" },
              ].map(({ i: Icon, l }) => (
                <button
                  key={l}
                  onClick={() => toast(`${l} triggered`)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-left font-normal hover:bg-muted"
                >
                  <Icon size={14} className="text-muted-foreground" /> {l}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="mb-2 text-sm font-medium">Queue Configuration</div>
            <div className="space-y-4 text-xs">
              <div>
                <div className="mb-1 flex justify-between">
                  <span>Max intake rate</span>
                  <span className="font-mono">{intake} ppl/min</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={400}
                  defaultValue={200}
                  className="w-full accent-saffron"
                />
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span>Target wait time</span>
                  <span className="font-mono">45 min</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={120}
                  defaultValue={45}
                  className="w-full accent-saffron"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Auto-balance</span>
                <span className="rounded-xl bg-emerald/15 px-2 py-0.5 font-medium text-emerald">
                  ● ON
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
