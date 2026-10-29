import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
const compare = [
  { d: "Mon", today: 32000, yesterday: 28000, lastWeek: 27000 },
  { d: "Tue", today: 38240, yesterday: 31000, lastWeek: 29000 },
  { d: "Wed", today: 0, yesterday: 33000, lastWeek: 30000 },
];
const peakDist = Array.from({ length: 16 }).map((_, i) => ({
  h: `${6 + i}:00`,
  v: Math.round(
    800 + Math.sin((i - 3) / 2) * 700 + Math.random() * 600 + (i > 4 && i < 11 ? 2000 : 0),
  ),
}));
const journey = [{ stage: "Avg", entry: 8, queue: 38, darshan: 6, exit: 5 }];
const efficiency = Array.from({ length: 12 }).map((_, i) => ({
  t: `${i * 10}m`,
  v: 70 + Math.round(Math.sin(i / 2) * 10) + i,
}));
const monthly = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((m, i) => ({
  m,
  v: 240000 + i * 18000 + Math.round(Math.random() * 12000),
}));
const satisfaction = ["Wk1", "Wk2", "Wk3", "Wk4", "Wk5", "Wk6", "Wk7", "Wk8"].map((w, i) => ({
  w,
  v: 3.8 + Math.random() * 0.5 + i * 0.02,
}));
const summary = [
  ["Total Devotees", "2,84,000", "2,61,000", "+8.8%", true],
  ["Avg Wait Time", "38 min", "42 min", "-9.5%", false],
  ["Peak Crowd", "22,400", "19,800", "+13.1%", true],
  ["Staff Efficiency", "87%", "82%", "+6.1%", true],
  ["Parking Utilization", "76%", "71%", "+7.0%", true],
];
export function AnalyticsSection() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2 text-xs">
          {["Today", "7 Days", "30 Days", "Custom"].map((r, i) => (
            <button
              key={r}
              className={`rounded-xl px-3 py-1.5 ${i === 1 ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm" : "bg-card border border-border"}`}
            >
              {r}
            </button>
          ))}
        </div>
        <button className="rounded-xl bg-foreground px-3 py-1.5 text-xs font-normal text-background">
          Export Report
        </button>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card title="Today vs Yesterday vs Last Week">
          <BarChart data={compare}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="today" fill="var(--saffron)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="yesterday" fill="var(--info)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lastWeek" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </Card>
        <Card title="Peak Hour Distribution">
          <AreaChart data={peakDist}>
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--saffron)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--saffron)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="h" stroke="var(--muted-foreground)" fontSize={10} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area dataKey="v" stroke="var(--saffron)" fill="url(#pg)" strokeWidth={2} />
          </AreaChart>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card title="Devotee Journey Time (min)">
          <BarChart data={journey} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis type="category" dataKey="stage" stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="entry" stackId="a" fill="var(--info)" name="Entry" />
            <Bar dataKey="queue" stackId="a" fill="var(--saffron)" name="Queue Wait" />
            <Bar dataKey="darshan" stackId="a" fill="var(--gold)" name="Darshan" />
            <Bar dataKey="exit" stackId="a" fill="var(--emerald)" name="Exit" />
          </BarChart>
        </Card>
        <Card title="Queue Efficiency (%)">
          <LineChart data={efficiency}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Line dataKey="v" stroke="var(--emerald)" strokeWidth={2} dot={false} />
          </LineChart>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card title="Monthly Footfall (6 mo)">
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Line dataKey="v" stroke="var(--saffron)" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </Card>
        <Card title="Crowd Satisfaction (avg 4.1/5)">
          <AreaChart data={satisfaction}>
            <defs>
              <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="w" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis domain={[3, 5]} stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area dataKey="v" stroke="var(--gold)" fill="url(#sg2)" strokeWidth={2} />
          </AreaChart>
        </Card>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3 font-medium">This Week vs Last Week</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground">
              <tr>
                {["Metric", "This Week", "Last Week", "Change"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="">
              {summary.map(([m, t, l, c, up]) => (
                <tr key={m as string} className="hover:bg-surface">
                  <td className="px-4 py-2 font-normal">{m}</td>
                  <td className="px-4 py-2 tabular-nums">{t}</td>
                  <td className="px-4 py-2 tabular-nums text-muted-foreground">{l}</td>
                  <td
                    className={`px-4 py-2 font-medium tabular-nums ${up ? "text-emerald" : "text-emerald"}`}
                  >
                    {up ? "↑" : "↓"} {String(c).replace("-", "")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-2 text-sm font-medium">{title}</div>
      <div className="h-60">
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </div>
  );
}
