import { POOJAS } from "@/lib/temple-data";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Megaphone,
  ShieldAlert,
  Users,
  Wrench,
  Activity,
  MonitorPlay,
} from "lucide-react";
import { StatCard } from "../ui/StatCard";
const announcements = [
  {
    id: 1,
    text: "Evening Deepa Aradhana starting in 15 mins",
    targets: ["Queue Displays", "App Push"],
  },
  { id: 2, text: "VIP Darshan slots available for tomorrow", targets: ["App Push"] },
];
const workOrders = [
  {
    id: "WO-1042",
    facility: "North Gate Restrooms",
    issue: "Sanitation required",
    priority: "high",
    status: "open",
  },
  {
    id: "WO-1043",
    facility: "East Wing AC Unit 2",
    issue: "Cooling degraded",
    priority: "medium",
    status: "open",
  },
  {
    id: "WO-1041",
    facility: "Main Sanctum Lights",
    issue: "Bulb replacement",
    priority: "low",
    status: "resolved",
  },
];

export function OperationsSection() {
  const [broadcasts, setBroadcasts] = useState(announcements);
  const [newText, setNewText] = useState("");
  const [orders, setOrders] = useState(workOrders);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000); // Check every 10s
    return () => clearInterval(timer);
  }, []);

  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    const d = new Date(currentTime);
    d.setHours(hours, minutes, 0, 0);
    return d.getTime();
  };

  const handleBroadcast = () => {
    if (!newText.trim()) return;
    setBroadcasts([...broadcasts, { id: Date.now(), text: newText, targets: ["All Screens"] }]);
    setNewText("");
    toast.success("Broadcast Added to all screens");
  };

  const resolveOrder = (id: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "resolved" } : o)));
    toast.success(`Work Order ${id} marked as resolved`);
  };

  const dispatchJanitorial = (id: string) => {
    toast(`Janitorial team dispatched for ${id}`);
  };

  return (
    <div className="space-y-8">
      {/* 1. Operations Pulse (Top Level KPIs) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Wrench}
          label="Maintenance Work"
          value={orders.filter((o) => o.status === "open").length}
          color="text-amber-600"
          bgTint="bg-amber-50 text-amber-600 border border-amber-100"
          sub={orders.some(o => o.status === "open" && o.priority === "high") ? "High Priority issues active" : "Routine maintenance"}
        />
        <StatCard
          icon={Activity}
          label="Facility Health"
          value="94%"
          color="text-emerald-600"
          bgTint="bg-emerald-50 text-emerald-600 border border-emerald-100"
          trend={{ up: false, text: "+2% today" }}
          sub="All systems operating optimally"
        />
        <StatCard
          icon={ShieldAlert}
          label="Active Rituals"
          value={1}
          color="text-indigo-600"
          bgTint="bg-indigo-50 text-indigo-600 border border-indigo-100"
          sub="Crowd control Added"
        />
        <StatCard
          icon={Megaphone}
          label="Active Broadcasts"
          value={broadcasts.length}
          color="text-emerald-600"
          bgTint="bg-emerald-50 text-emerald-600 border border-emerald-100"
          sub="Information active on all displays"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* 2. Live Ritual & Event Command */}
        <div className="rounded-3xl border border-border/50 bg-white/60 backdrop-blur-xl p-0 shadow-sm transition-all hover:shadow-md flex flex-col overflow-hidden h-full">
          <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-6 py-5">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Ritual Command Center</h3>
              <p className="text-[13px] font-bold text-foreground mt-1">Today's Daily Pooja Schedule</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 border border-amber-100">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">LIVE TRACKING</span>
            </div>
          </div>
          <div className="flex-1 p-6">
            <ol className="relative space-y-2 border-l-2 border-border/50 pl-4 ml-1">
              {POOJAS.map((p, i) => {
                const pTime = parseTime(p.time);
                const nextPTime = i < POOJAS.length - 1 ? parseTime(POOJAS[i+1].time) : pTime + 2 * 60 * 60 * 1000;
                
                let dynamicStatus = "upcoming";
                if (currentTime.getTime() >= pTime && currentTime.getTime() < nextPTime) {
                  dynamicStatus = "live";
                } else if (currentTime.getTime() >= nextPTime) {
                  dynamicStatus = "done";
                }

                const isLive = dynamicStatus === "live";
                const isDone = dynamicStatus === "done";
                const dotColor = isDone
                  ? "bg-emerald border-emerald"
                  : isLive
                    ? "bg-saffron border-saffron shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    : "bg-surface border-border";

                return (
                  <li key={i} className="relative group">
                    <span
                      className={`absolute -left-[23px] top-2 flex h-3 w-3 items-center justify-center rounded-full border-2 ${dotColor} transition-all`}
                    >
                      {isDone && <CheckCircle2 size={10} className="text-white" />}
                    </span>

                    <div
                      className={`group rounded-xl border p-3 transition-all duration-300 ${isLive ? "border-saffron/40 bg-gradient-to-br from-saffron/10 to-amber-500/5 shadow-md scale-[1.01]" : isDone ? "border-white/60 bg-white/40 opacity-70" : "border-white/40 bg-white/20 hover:bg-white/60 hover:shadow-sm"}`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-md">
                          <div className="flex items-center gap-3">
                            <span className="rounded bg-background px-2 py-1 font-mono text-[10px] font-bold text-muted-foreground border border-border shadow-sm">
                              {p.time}
                            </span>
                            <span
                              className={`text-sm font-bold ${isLive ? "text-saffron" : "text-foreground"}`}
                            >
                              {p.name}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            {p.desc}
                          </p>
                          <div
                            className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold ${isLive ? "bg-saffron/20 text-saffron" : isDone ? "bg-emerald/10 text-emerald" : "bg-muted text-muted-foreground"}`}
                          >
                            {isDone ? "Completed" : isLive ? "In Progress" : "Upcoming"}
                          </div>
                        </div>

                        {isLive && (
                          <div className="flex shrink-0 flex-col gap-3">
                            <button
                              onClick={() => toast.success("Crowd Control Added")}
                              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-saffron to-amber-500 px-4 py-2 text-[11px] font-extrabold tracking-wide text-white shadow-[0_4px_14px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-all"
                            >
                              <Users size={14} /> Add Staff
                            </button>
                            <button
                              onClick={() => {
                                // Since network TTS and local voices are blocked, we use pre-generated static audio files
                                const filename = p.name.replace(/[^a-zA-Z0-9]/g, '_') + '.mp3';
                                const url = `/audio/${filename}`;
                                
                                let audioEl = document.getElementById("temple-announcement-audio") as HTMLAudioElement;
                                if (!audioEl) {
                                  audioEl = document.createElement("audio");
                                  audioEl.id = "temple-announcement-audio";
                                  document.body.appendChild(audioEl);
                                }
                                
                                audioEl.src = url;
                                audioEl.play().then(() => {
                                  toast.success("Tamil Audio Broadcast Started");
                                }).catch(err => {
                                  console.error("Static audio playback error:", err);
                                  toast.error("Browser blocked audio. Click to interact with the page first.");
                                });
                              }}
                              className="flex items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm px-4 py-2 text-[11px] font-extrabold tracking-wide text-foreground hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all"
                            >
                              <Megaphone size={14} /> Announce
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* 3. Facility Health & Work Orders */}
        <div className="rounded-3xl border border-border/50 bg-white/60 backdrop-blur-xl p-0 shadow-sm transition-all hover:shadow-md flex flex-col overflow-hidden h-full">
          <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-6 py-5">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Facility Maintenance Board</h3>
              <p className="text-[13px] font-bold text-foreground mt-1">
                Active work orders & asset health
              </p>
            </div>
            <button
              onClick={() => toast.success("New ticket drafted")}
              className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              + Log Ticket
            </button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px] p-6 space-y-4">
            {orders.map((order) => {
              const isOpen = order.status === "open";
              return (
                <div
                  key={order.id}
                  className={`group flex flex-col gap-3 rounded-2xl border p-5 transition-all ${isOpen ? "border-white/60 bg-white/40 shadow-sm hover:-translate-y-0.5 hover:shadow-md" : "border-border/50 bg-background/30 opacity-70"}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-foreground">{order.facility}</span>
                        {isOpen && order.priority === "high" && (
                          <span className="rounded-md bg-danger/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-danger border border-danger/20">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{order.issue}</p>
                      <div className="mt-2 inline-block rounded bg-background px-2 py-0.5 font-mono text-[9px] font-semibold text-muted-foreground border border-border">
                        {order.id}
                      </div>
                    </div>
                    {isOpen ? (
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${order.priority === "high" ? "bg-danger/10 text-danger" : "bg-status-busy/10 text-status-busy"}`}
                      >
                        <AlertCircle size={16} />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>

                  {isOpen && (
                    <div className="mt-4 flex gap-3 border-t border-border/50 pt-4">
                      <button
                        onClick={() => dispatchJanitorial(order.id)}
                        className="flex-1 rounded-xl border border-border/50 bg-white/50 py-2.5 text-[11px] font-bold text-foreground hover:bg-white transition-colors shadow-sm hover:shadow-md"
                      >
                        Dispatch Staff
                      </button>
                      <button
                        onClick={() => resolveOrder(order.id)}
                        className="flex-1 rounded-xl bg-emerald/10 text-emerald border border-emerald/20 py-2.5 text-[11px] font-bold hover:bg-emerald/20 transition-colors shadow-sm hover:shadow-md"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Digital Signage & Announcements */}
      <div className="rounded-3xl border border-border/50 bg-white/60 backdrop-blur-xl p-0 shadow-sm transition-all hover:shadow-md flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-6 py-5">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Digital Signage Controller</h3>
            <p className="text-[13px] font-bold text-foreground mt-1">
              Manage live broadcasts across temple displays
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald bg-emerald/10 px-3 py-1.5 rounded-full border border-emerald/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" /> 24 Screens Online
          </div>
        </div>

        <div className="grid gap-8 p-8 lg:grid-cols-2">
          {/* Broadcaster */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-foreground">New Broadcast</h4>
            <div className="relative">
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Type message to display..."
                className="w-full resize-none rounded-2xl border border-white/60 bg-white/40 p-5 pb-12 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner"
                rows={4}
              />
              <div className="absolute bottom-3 left-4 text-[10px] font-semibold text-muted-foreground">
                {newText.length}/120 chars
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-2">
                <button className="rounded-lg bg-saffron/10 px-3 py-1.5 text-[11px] font-bold text-saffron border border-saffron/30 hover:bg-saffron/20 transition-colors">
                  All Screens
                </button>
                <button className="rounded-lg bg-surface px-3 py-1.5 text-[11px] font-bold text-muted-foreground border border-border hover:text-foreground transition-colors">
                  App Push Only
                </button>
              </div>
                <button
                  onClick={handleBroadcast}
                  disabled={!newText.trim()}
                  className={`flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-[11px] font-extrabold tracking-wide text-white transition-all duration-300 ${newText.trim() ? "bg-gradient-to-r from-primary to-indigo-500 hover:shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5" : "bg-muted-foreground opacity-50 cursor-not-allowed"}`}
                >
                  <Megaphone size={16} /> Broadcast Now
                </button>
            </div>
          </div>

          {/* Active Broadcasts */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-foreground">Active Broadcasts</h4>
            <div className="space-y-3">
              {broadcasts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-surface/50 p-6 text-center text-xs text-muted-foreground">
                  No active broadcasts.
                </div>
              ) : (
                broadcasts.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-2xl border border-saffron/30 bg-gradient-to-r from-saffron/10 to-transparent p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground leading-snug">
                        "{b.text}"
                      </div>
                      <div className="mt-2 flex gap-1.5">
                        {b.targets.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-background px-2 py-0.5 text-[9px] font-bold text-muted-foreground border border-border shadow-sm"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setBroadcasts(broadcasts.filter((x) => x.id !== b.id))}
                      className="shrink-0 rounded-xl bg-danger/10 px-4 py-2 text-[10px] font-extrabold tracking-widest uppercase text-danger border border-danger/20 hover:bg-danger hover:text-white hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                      Revoke
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
