import { useState } from "react";
import {
  IndianRupee,
  HeartHandshake,
  PiggyBank,
  History,
  QrCode,
  ArrowRightLeft,
  Download,
  User,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";
import { StatCard } from "../ui/StatCard";

const donationTrendWeekly = [
  { time: "Mon", amount: 45000 },
  { time: "Tue", amount: 52000 },
  { time: "Wed", amount: 48000 },
  { time: "Thu", amount: 61000 },
  { time: "Fri", amount: 85000 },
  { time: "Sat", amount: 145000 },
  { time: "Sun", amount: 168000 },
];

const donationTrendDaily = [
  { time: "5 AM", amount: 1500 },
  { time: "6 AM", amount: 5000 },
  { time: "9 AM", amount: 12000 },
  { time: "12 PM", amount: 28000 },
  { time: "3 PM", amount: 19000 },
  { time: "6 PM", amount: 45000 },
  { time: "9 PM", amount: 15500 },
];

const donationTrendMonthly = [
  { time: "Week 1", amount: 320000 },
  { time: "Week 2", amount: 290000 },
  { time: "Week 3", amount: 410000 },
  { time: "Week 4", amount: 385000 },
];

const fundsBreakdownWeekly = [
  { name: "Annadhanam", amount: 420000 },
  { name: "Hundi", amount: 280000 },
  { name: "Building", amount: 150000 },
  { name: "General", amount: 95000 },
];

const fundsBreakdownDaily = [
  { name: "Annadhanam", amount: 65000 },
  { name: "Hundi", amount: 42000 },
  { name: "Building", amount: 15000 },
  { name: "General", amount: 12000 },
];

const fundsBreakdownMonthly = [
  { name: "Annadhanam", amount: 1850000 },
  { name: "Hundi", amount: 1250000 },
  { name: "Building", amount: 650000 },
  { name: "General", amount: 420000 },
];

const recentTransactions = [
  {
    id: "TRX-8923",
    donor: "Ramesh K.",
    fund: "Annadhanam",
    amount: 5000,
    type: "UPI",
    time: "10 mins ago",
    status: "Completed",
  },
  {
    id: "TRX-8924",
    donor: "Anonymous",
    fund: "Hundi",
    amount: 500,
    type: "Cash",
    time: "25 mins ago",
    status: "Completed",
  },
  {
    id: "TRX-8925",
    donor: "Lakshmi S.",
    fund: "Building Fund",
    amount: 25000,
    type: "Bank Transfer",
    time: "1 hour ago",
    status: "Completed",
  },
  {
    id: "TRX-8926",
    donor: "Karthik M.",
    fund: "General Donation",
    amount: 1001,
    type: "Credit Card",
    time: "2 hours ago",
    status: "Completed",
  },
  {
    id: "TRX-8927",
    donor: "Anonymous",
    fund: "Hundi",
    amount: 100,
    type: "UPI",
    time: "3 hours ago",
    status: "Completed",
  },
];

export function DonationSection() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const chartData = period === "daily" ? donationTrendDaily : period === "monthly" ? donationTrendMonthly : donationTrendWeekly;
  const breakdownData = period === "daily" ? fundsBreakdownDaily : period === "monthly" ? fundsBreakdownMonthly : fundsBreakdownWeekly;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={IndianRupee}
          label="Total Collections (Today)"
          value="₹1,24,500"
          sub="+12% vs yesterday · Target ₹1.5L"
          color="text-emerald-600"
          bgTint="bg-emerald-50 text-emerald-600 border-emerald-100/50"
          trend={{ up: true, text: "+12%" }}
          progress={83}
        />
        <StatCard
          icon={HeartHandshake}
          label="Annadhanam Fund"
          value="₹45,200"
          sub="320 donors today · Goal: ₹60k"
          color="text-amber-600"
          bgTint="bg-amber-50 text-amber-600 border-amber-100/50"
          progress={75}
          trend={{ up: true, text: "75% goal" }}
        />
        <StatCard
          icon={QrCode}
          label="Digital Payments"
          value="₹82,400"
          sub="UPI & Cards · 66% of total"
          color="text-indigo-600"
          bgTint="bg-indigo-50 text-indigo-600 border-indigo-100/50"
          trend={{ up: true, text: "+5%" }}
          progress={66}
        />
        <StatCard
          icon={PiggyBank}
          label="Offline Hundi"
          value="₹42,100"
          sub="Estimated cash drop · 34% of total"
          color="text-emerald-600"
          bgTint="bg-emerald-50 text-emerald-600 border-emerald-100/50"
          progress={34}
          trend={{ up: false, text: "34% share" }}
        />
      </div>

      {/* Chart & Fund Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Donation Trends */}
        <div className="lg:col-span-2 rounded-3xl border border-border/50 bg-white/60 backdrop-blur-xl p-6 lg:p-8 shadow-sm transition-all hover:shadow-md h-full">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">Donation Trends</h3>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mt-1.5">
                Collection volume over the last {period === "daily" ? "24 hours" : period === "weekly" ? "7 days" : "30 days"}
              </p>
            </div>
            <div className="flex rounded-xl border border-border/50 bg-surface/50 p-1 shadow-sm backdrop-blur-md">
              {(["daily", "weekly", "monthly"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold capitalize transition-all duration-200 ${
                    period === p 
                      ? "bg-primary text-primary-foreground shadow-md scale-[1.02]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--emerald)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--emerald)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" opacity={0.5} vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  dy={12}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  dx={-12}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "13px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontWeight: 700, color: "var(--emerald)" }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, "Collection"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--emerald)"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: "var(--emerald)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fund Distribution */}
        <div className="lg:col-span-1 rounded-3xl border border-border/50 bg-white/60 backdrop-blur-xl p-6 lg:p-8 shadow-sm transition-all hover:shadow-md h-full">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              Distribution
            </h3>
            <span className={`rounded-lg px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest border shadow-sm transition-colors ${
              period === "daily" 
                ? "bg-blue-50 text-blue-600 border-blue-100" 
                : period === "weekly" 
                  ? "bg-red-50 text-red-600 border-red-100" 
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
            }`}>
              {period}
            </span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={breakdownData}
                layout="vertical"
                margin={{ top: 10, right: 65, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="annadhanamGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="hundiGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                  <linearGradient id="buildingGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                  <linearGradient id="generalGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f87171" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  horizontal={false}
                  vertical={true}
                  stroke="var(--border)"
                  opacity={0.3}
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={90}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 800 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "13px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  cursor={{ fill: "var(--muted)", opacity: 0.15 }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, "Amount"]}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[0, 999, 999, 0]} 
                  barSize={18}
                >
                  {breakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Annadhanam"
                          ? "url(#annadhanamGrad)"
                          : entry.name === "Hundi"
                            ? "url(#hundiGrad)"
                            : entry.name === "Building"
                              ? "url(#buildingGrad)"
                              : "url(#generalGrad)"
                      }
                    />
                  ))}
                  <LabelList
                    dataKey="amount"
                    position="right"
                    formatter={(v: number) => `₹${v >= 100000 ? (v / 100000).toFixed(1) + 'L' : (v / 1000).toFixed(0) + 'k'}`}
                    style={{ fill: "var(--foreground)", fontSize: 10, fontWeight: 800 }}
                    offset={8}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions & Quick Transfer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Recent Transactions */}
        <div className="lg:col-span-2 rounded-3xl border border-border/50 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 bg-muted/20 px-6 py-5 gap-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-primary/10">
                <History size={14} className="text-primary" />
              </div>
              Recent Transactions
            </h3>
            <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 hover:bg-primary/10">
              <Download size={14} /> Export CSV
            </button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-muted/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Donor</th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Fund Category</th>
                  <th className="px-6 py-4 text-right whitespace-nowrap">Amount</th>
                  <th className="px-6 py-4 text-center whitespace-nowrap">Method</th>
                  <th className="px-6 py-4 text-right whitespace-nowrap">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentTransactions.map((trx) => (
                  <tr key={trx.id} className="transition-colors hover:bg-muted/30 group">
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-primary/10 text-primary">
                          {trx.donor.charAt(0)}
                        </div>
                        <span className="font-bold text-foreground">{trx.donor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-muted-foreground whitespace-nowrap">
                      <span className="inline-flex items-center rounded-lg bg-surface border border-border/50 px-2.5 py-1 text-[11px] font-bold shadow-sm">
                        {trx.fund}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right font-black tabular-nums text-foreground whitespace-nowrap">
                      ₹{trx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          trx.type === "UPI" 
                            ? "bg-info/10 text-info border border-info/20" 
                            : trx.type === "Cash" 
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" 
                              : "bg-emerald/10 text-emerald border border-emerald/20"
                        }`}
                      >
                        {trx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right text-xs font-medium text-muted-foreground whitespace-nowrap group-hover:text-foreground transition-colors">
                      {trx.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Transfer Widget */}
        <div className="lg:col-span-1 rounded-3xl border border-border/50 bg-white/60 backdrop-blur-xl p-6 lg:p-8 shadow-sm transition-all hover:shadow-md flex flex-col relative overflow-hidden group h-full">
          {/* Decorative background glow */}
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-[50px] transition-all group-hover:bg-indigo-500/20" />
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-primary text-white shadow-lg shadow-indigo-500/20">
              <ArrowRightLeft size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">Quick Transfer</h3>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Move funds instantly</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-center">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">From Account</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-border/60 bg-surface/80 px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm">
                  <option>General Collection (...8923)</option>
                  <option>Hundi Collection (...4421)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">To Fund</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-border/60 bg-surface/80 px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm">
                  <option>Annadhanam Trust</option>
                  <option>Temple Maintenance</option>
                  <option>Building Expansion</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Amount (₹)</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-muted-foreground font-bold">₹</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-border/60 bg-surface/80 pl-8 pr-4 py-3 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm"
                />
              </div>
            </div>
            
            <button className="w-full rounded-xl bg-primary py-3.5 text-sm font-black tracking-wide text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2">
              Initiate Transfer
              <ArrowRightLeft size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
