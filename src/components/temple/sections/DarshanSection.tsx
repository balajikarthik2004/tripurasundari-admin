import { useState } from "react";
import { Ticket, Clock, IndianRupee, TrendingUp, TrendingDown, Users, Crown, Timer } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { StatCard } from "../ui/StatCard"; // Import StatCard
const darshanCategories = [
  {
    id: "gen",
    name: "General Darshan",
    price: "Free",
    wait: "180 min",
    sold: 12450,
    cap: "High",
    color: "text-muted-foreground",
    bg: "bg-muted-foreground",
    bgTint: "bg-muted-foreground/10",
    icon: Users,
  },
  {
    id: "100",
    name: "₹100 Special",
    price: "₹100",
    wait: "45 min",
    sold: 3200,
    cap: "Medium",
    color: "text-info",
    bg: "bg-info",
    bgTint: "bg-info/10",
    icon: Ticket,
  },
  {
    id: "200",
    name: "₹200 Quick",
    price: "₹200",
    wait: "20 min",
    sold: 1850,
    cap: "Medium",
    color: "text-saffron",
    bg: "bg-saffron",
    bgTint: "bg-saffron/10",
    icon: Timer,
  },
  {
    id: "300",
    name: "₹300 VIP",
    price: "₹300",
    wait: "5 min",
    sold: 420,
    cap: "Low",
    color: "text-emerald",
    bg: "bg-emerald",
    bgTint: "bg-emerald/10",
    icon: Crown,
  },
];
const hourlyFlow = Array.from({ length: 13 }).map((_, i) => ({
  time: `${5 + i}:00`,
  general: Math.floor(800 + Math.random() * 500),
  t100: Math.floor(200 + Math.random() * 100),
  t200: Math.floor(100 + Math.random() * 50),
  t300: Math.floor(20 + Math.random() * 10),
}));

const recentBookings = [
  { id: "BKG-8910", name: "Ramesh K.", category: "₹300 VIP", amount: "₹300", time: "10:15 AM", date: "09 Jun 2026", status: "Confirmed", mode: "UPI" },
  { id: "BKG-8911", name: "Lakshmi S.", category: "General Darshan", amount: "Free", time: "11:05 AM", date: "09 Jun 2026", status: "Checked In", mode: "-" },
  { id: "BKG-8912", name: "Suresh P.", category: "₹100 Special", amount: "₹100", time: "01:30 PM", date: "09 Jun 2026", status: "Confirmed", mode: "Cash" },
  { id: "BKG-8913", name: "Deepa M.", category: "₹200 Quick", amount: "₹400", time: "04:12 PM", date: "10 Jun 2026", status: "Pending", mode: "Card" },
  { id: "BKG-8914", name: "Karthik R.", category: "₹300 VIP", amount: "₹600", time: "05:45 PM", date: "10 Jun 2026", status: "Confirmed", mode: "UPI" },
  { id: "BKG-8915", name: "Anitha V.", category: "₹100 Special", amount: "₹300", time: "06:20 PM", date: "10 Jun 2026", status: "Confirmed", mode: "Cash" },
];

export function DarshanSection() {
  const [lanes, setLanes] = useState({ gen: true, t100: true, t200: true, t300: true });
  const toggleLane = (id: string, name: string) => {
    setLanes((prev) => {
      const next = !prev[id as keyof typeof prev];
      if (next) toast.success(`${name} Counter Opened`);
      else toast.error(`${name} Counter Closed`);
      return { ...prev, [id]: next };
    });
  };
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {darshanCategories.map((c) => (
          <StatCard
            key={c.id}
            icon={c.icon}
            label={c.name}
            value={c.wait}
            sub={`${c.sold.toLocaleString()} sold today · ${c.price === 'Free' ? 'No charge' : c.price}`}
            color={c.color}
            bgTint={`${c.bgTint} ${c.color} border border-border/50`}
            trend={{ up: true, text: c.price }}
            progress={c.id === 'gen' ? 85 : c.id === '100' ? 64 : c.id === '200' ? 37 : 8}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Hourly Flow Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-border/50 bg-white/60 backdrop-blur-xl p-6 lg:p-8 shadow-sm transition-all hover:shadow-md h-full">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-foreground tracking-tight font-montserrat">Hourly Entry Flow</h3>
              <p className="mt-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground font-montserrat">
                Devotees processed by ticket tier
              </p>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 11,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: "15px" }} iconType="circle" />

                <Line
                  type="monotone"
                  dataKey="general"
                  stroke="#9ca3af"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#9ca3af" }}
                  name="General"
                />
                <Line
                  type="monotone"
                  dataKey="t100"
                  stroke="var(--info)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "var(--info)" }}
                  name="₹100 Special"
                />
                <Line
                  type="monotone"
                  dataKey="t200"
                  stroke="var(--saffron)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "var(--saffron)" }}
                  name="₹200 Quick"
                />
                <Line
                  type="monotone"
                  dataKey="t300"
                  stroke="var(--emerald)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "var(--emerald)" }}
                  name="₹300 VIP"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Counter & Lane Control */}
        <div className="lg:col-span-1 rounded-3xl border border-border/50 bg-white/60 backdrop-blur-xl p-6 lg:p-8 shadow-sm transition-all hover:shadow-md h-full flex flex-col">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Ticket Counter Controls
              </h3>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {darshanCategories.map((c, i) => {
              const keys = ["gen", "t100", "t200", "t300"];
              const key = keys[i] as keyof typeof lanes;
              const isOpen = lanes[key];
              return (
                <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/60 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-2.5 w-2.5 rounded-full shadow-sm ${isOpen ? c.bg : "bg-muted"}`}
                    />
                    <div>
                      <div className="text-xs font-bold text-foreground">{c.name}</div>
                      <div className="text-[10px] font-medium text-muted-foreground mt-0.5">
                        Counters: <span className={isOpen ? c.color : "text-muted-foreground"}>{isOpen ? "Active" : "Closed"}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleLane(key, c.name)}
                    className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 shadow-sm ${isOpen ? "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20" : "bg-emerald/10 text-emerald hover:bg-emerald/20 border border-emerald/20"}`}
                  >
                    {isOpen ? "Close" : "Open"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="mt-2 rounded-3xl border border-border/50 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 bg-muted/20 px-6 py-5 gap-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Ticket size={14} className="text-primary" />
            </div>
            Recent Bookings
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">
              <tr>
                <th className="px-6 py-4 text-left whitespace-nowrap">Booking ID</th>
                <th className="px-6 py-4 text-left whitespace-nowrap">Devotee Name</th>
                <th className="px-6 py-4 text-left whitespace-nowrap">Category Mode</th>
                <th className="px-6 py-4 text-left whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-left whitespace-nowrap">Paid Timing</th>
                <th className="px-6 py-4 text-left whitespace-nowrap">Payment Mode</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recentBookings.map((bk) => (
                <tr key={bk.id} className="transition-colors hover:bg-muted/30 group">
                  <td className="px-6 py-4.5 font-mono text-xs text-muted-foreground whitespace-nowrap">{bk.id}</td>
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {bk.name.charAt(0)}
                      </div>
                      <span className="font-bold text-foreground">{bk.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                        bk.category.includes("VIP") 
                          ? "bg-emerald/10 text-emerald border-emerald/20" 
                          : bk.category.includes("Quick") 
                            ? "bg-saffron/10 text-saffron border-saffron/20" 
                            : bk.category.includes("Special")
                              ? "bg-info/10 text-info border-info/20"
                              : "bg-muted text-muted-foreground border-border/50"
                      }`}
                    >
                      {bk.category}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-xs font-medium text-muted-foreground">{bk.date}</td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-xs font-medium text-muted-foreground">{bk.time}</td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-xs font-medium text-foreground">
                    {bk.mode === "UPI" ? (
                      <span className="inline-flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 font-bold uppercase tracking-widest text-[9px]">UPI</span>
                    ) : bk.mode === "Card" ? (
                      <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 font-bold uppercase tracking-widest text-[9px]">Card</span>
                    ) : bk.mode === "Cash" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 font-bold uppercase tracking-widest text-[9px]">Cash</span>
                    ) : (
                      <span className="text-muted-foreground ml-2">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4.5 text-right font-black tabular-nums text-foreground whitespace-nowrap">{bk.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
