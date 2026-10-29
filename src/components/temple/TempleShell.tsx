import { useState, useEffect } from "react";
import {
  Home,
  Users,
  Flame,
  Video,
  Timer,
  UsersRound,
  Landmark,
  Car,
  Megaphone,
  BarChart3,
  Siren,
  Bell,
  LogOut,
  ChevronDown,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  IndianRupee,
  Utensils,
} from "lucide-react";
import { Toaster } from "sonner";
import { NAV_ITEMS, TEMPLES, type SectionId } from "@/lib/temple-data";
import { useLiveClock } from "@/lib/use-live";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { DashboardSection } from "./sections/DashboardSection";
import { HeatmapSection } from "./sections/HeatmapSection";
import { CCTVSection } from "./sections/CCTVSection";
import { DarshanSection } from "./sections/DarshanSection";
import { QueueSection } from "./sections/QueueSection";
import { StaffSection } from "./sections/StaffSection";
import { OperationsSection } from "./sections/OperationsSection";
import { ParkingSection } from "./sections/ParkingSection";
import { AnnouncementsSection } from "./sections/AnnouncementsSection";
import { AnalyticsSection } from "./sections/AnalyticsSection";
import { EmergencySection } from "./sections/EmergencySection";
import { DonationSection } from "./sections/DonationSection";
import { AnnadhanamSection } from "./sections/AnnadhanamSection";
import omgLogo from "@/assets/logo.png";

const ICONS: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Home,
  Users,
  Flame,
  Video,
  Timer,
  UsersRound,
  Landmark,
  Car,
  Megaphone,
  BarChart3,
  Siren,
  Ticket,
  IndianRupee,
  Utensils,
};

export function TempleShell() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [section, setSection] = useState<SectionId>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      return (NAV_ITEMS.find((n) => n.id === hash)?.id as SectionId) || "dashboard";
    }
    return "dashboard";
  });
  useEffect(() => {
    window.location.hash = section;
  }, [section]);
  const [templeId, setTempleId] = useState<string | null>("palani-murugan");
  const [templeOpen, setTempleOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [stateOpen, setStateOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All Districts");
  const [districtOpen, setDistrictOpen] = useState(false);
  const [shimmer, setShimmer] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const temple = templeId ? TEMPLES.find((t) => t.id === templeId) : undefined;

  const otherStates = Array.from(new Set(TEMPLES.map((t) => t.state)))
    .filter(s => s !== "Tamil Nadu")
    .sort();
  const states = ["All States", "Tamil Nadu", ...otherStates];

  const filteredByState = selectedState === "All States"
    ? TEMPLES
    : TEMPLES.filter(t => t.state === selectedState);

  const districts = [
    "All Districts",
    ...Array.from(new Set(filteredByState.map((t) => t.district))),
  ].sort();
  const now = useLiveClock();
  const switchTemple = (id: string) => {
    setShimmer(true);
    setTempleId(id);
    setTempleOpen(false);
    setTimeout(() => setShimmer(false), 1000);
  };
  const sectionTitle = NAV_ITEMS.find((n) => n.id === section)?.label ?? "";

  return (
    <div className="min-h-screen relative overflow-hidden bg-background selection:bg-primary/30">
      {/* -- Premium Mesh Background -- */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-secondary-tint)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,var(--color-muted)_0%,transparent_50%)] opacity-70" />
      <div
        className="orb-1 absolute top-[-10%] left-[-10%] h-[60vw] w-[60vw] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(226,46,40,0.03) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="orb-2 absolute bottom-[-20%] right-[-10%] h-[50vw] w-[50vw] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(41,48,136,0.04) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex min-h-screen">
        <Toaster position="top-right" richColors theme="light" />

        {/* =============================
          SIDEBAR (Deep Navy Premium)
          ============================= */}
        <aside
          className={`fixed left-0 top-0 z-30 flex h-screen flex-col transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${sidebarExpanded ? "w-[260px]" : "w-[80px]"}`}
          style={{
            background: "linear-gradient(180deg, #293088 0%, #293088 65%, #E22E28 100%)",
            borderRight: "1px solid rgba(255,255,255,0.03)",
            boxShadow: "4px 0 40px rgba(0,0,0,0.25)",
          }}
        >
          {/* Logo row */}
          <div className="relative flex flex-col px-5 py-7">
            <div className={`flex items-center ${sidebarExpanded ? "gap-4" : "justify-center"} transition-all duration-300`}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-500 hover:scale-105 border border-white/80 bg-white relative overflow-hidden group">
                <img
                  src={omgLogo}
                  alt="OMG Logo"
                  className="h-7 w-auto object-contain transition-transform duration-500 group-hover:scale-110 relative z-10"
                />
              </div>
              {sidebarExpanded && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500 min-w-0">
                  <div className="text-xl font-montserrat font-extrabold tracking-tight text-white drop-shadow-md truncate">
                    OMG
                  </div>
                  <div className="text-[10px] font-bold text-indigo-200/90 uppercase tracking-[0.2em] mt-0.5 truncate">
                    Admin Portal
                  </div>
                </div>
              )}
            </div>

            {/* Collapse toggle */}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="absolute -right-3.5 top-10 flex h-7 w-7 items-center justify-center rounded-full z-40 transition-all duration-300 hover:scale-110 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-primary border border-border/10 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
            >
              {sidebarExpanded ? <ChevronLeft size={14} strokeWidth={2.5} /> : <ChevronRight size={14} strokeWidth={2.5} />}
            </button>
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-white/5" />

          {/* Nav items */}
          <nav className="relative flex-1 overflow-y-auto px-4 py-6 space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            {NAV_ITEMS.map((item) => {
              const Icon = ICONS[item.icon];
              const active = item.id === section;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`group relative flex w-full items-center ${sidebarExpanded ? "p-1.5 pr-4" : "p-1.5 justify-center"} rounded-2xl text-[14px] transition-all duration-400 border ${active
                    ? "bg-white/10 backdrop-blur-xl border-white/20 border-t-white/30 border-l-white/30 text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                    : "border-transparent text-indigo-100/70 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  title={!sidebarExpanded ? item.label : undefined}
                >
                  {/* Left Indicator for Active State */}
                  {active && sidebarExpanded && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-7 bg-white/90 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  )}

                  {/* Icon Container */}
                  <div className={`flex items-center justify-center shrink-0 h-[42px] w-[42px] rounded-[14px] transition-colors duration-400 ${active
                    ? "bg-white/15 ml-3 shadow-inner"
                    : "bg-white/5 group-hover:bg-white/10"
                    }`}>
                    <Icon
                      size={18}
                      className={active ? "text-white drop-shadow-md" : "text-indigo-200 group-hover:text-white transition-colors duration-400"}
                    />
                  </div>

                  {/* Label */}
                  {sidebarExpanded && (
                    <span className={`ml-3.5 truncate transition-all duration-400 ${active ? "font-bold tracking-wide" : "font-semibold tracking-wide"
                      }`}>
                      {item.label}
                    </span>
                  )}

                  {/* Right Dot for Active State */}
                  {active && sidebarExpanded && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User & Logout section */}
          <div className="relative p-5 mt-auto flex flex-col gap-6">

            {/* Profile Container */}
            <div className={`flex items-center ${sidebarExpanded ? "gap-3.5" : "justify-center"} rounded-2xl p-2 cursor-pointer transition-all duration-400 border border-white/20 hover:bg-white/5 shadow-sm`}>
              <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full text-[16px] font-bold text-white bg-[#1A1F60] shadow-inner">
                A
              </div>
              {sidebarExpanded && (
                <div className="min-w-0 flex-1 text-left animate-in fade-in duration-500">
                  <div className="truncate text-[14px] font-bold text-white drop-shadow-sm">
                    Santhosh Kumar
                  </div>
                  <div className="truncate text-[11px] font-medium text-white/70 mt-0.5">
                    Admin
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button 
              onClick={() => {
                auth.logout();
                navigate({ to: '/login' });
              }}
              className={`flex items-center ${sidebarExpanded ? "gap-3.5 px-3" : "justify-center"} cursor-pointer transition-all duration-300 text-white hover:text-white/80 group`}
            >
               <LogOut
                 size={20}
                 strokeWidth={2}
                 className="transition-transform duration-300 group-hover:translate-x-1"
               />
               {sidebarExpanded && (
                 <span className="font-bold text-[15px] tracking-wide">Logout</span>
               )}
            </button>
          </div>
        </aside>

        {/* =============================
        TOPBAR
        ============================= */}
        <header
          className={`fixed right-0 top-0 z-20 flex h-16 items-center justify-between px-8 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] bg-white/70 backdrop-blur-2xl border-b border-border/40 shadow-sm ${sidebarExpanded ? "left-[260px]" : "left-[80px]"}`}
        >
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1 text-[9px] font-bold tracking-wide bg-status-normal/10 border border-status-normal/20 text-status-normal shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-status-normal animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              LIVE
            </div>

            {/* State filter */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => {
                  setStateOpen((o) => !o);
                  setDistrictOpen(false);
                  setTempleOpen(false);
                  setBellOpen(false);
                }}
                className="group flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md bg-white border border-border/60 text-foreground"
              >
                <Sparkles size={14} className="text-primary" />
                <span className="tracking-wide">{selectedState}</span>
                <ChevronDown
                  size={14}
                  className="text-muted-foreground transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </button>
              {stateOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto bg-white border border-border/50">
                  {states.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedState(s);
                        setStateOpen(false);
                        setSelectedDistrict("All Districts");
                        const firstTemple = s === "All States"
                          ? TEMPLES[0]
                          : TEMPLES.find((t) => t.state === s);
                        if (firstTemple && temple?.state !== s) {
                          switchTemple(firstTemple.id);
                        }
                      }}
                      className={`flex w-full items-center px-4 py-3 text-left text-xs transition-colors hover:bg-muted/50 ${s === selectedState ? "bg-muted/50 font-bold text-foreground" : "font-medium text-foreground"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* District filter */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => {
                  setDistrictOpen((o) => !o);
                  setStateOpen(false);
                  setTempleOpen(false);
                  setBellOpen(false);
                }}
                className="group flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md bg-white border border-border/60 text-foreground"
              >
                <MapPin size={14} className="text-primary" />
                <span className="tracking-wide">{selectedDistrict}</span>
                <ChevronDown
                  size={14}
                  className="text-muted-foreground transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </button>
              {districtOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto bg-white border border-border/50">
                  {districts.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setSelectedDistrict(d);
                        setDistrictOpen(false);
                        const firstTemple =
                          d === "All Districts"
                            ? filteredByState[0]
                            : filteredByState.find((t) => t.district === d);
                        if (firstTemple && d !== "All Districts" && temple?.district !== d) {
                          switchTemple(firstTemple.id);
                        }
                      }}
                      className={`flex w-full items-center px-4 py-3 text-left text-xs transition-colors hover:bg-muted/50 ${d === selectedDistrict ? "bg-muted/50 font-bold text-foreground" : "font-medium text-foreground"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Temple switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setTempleOpen((o) => !o);
                  setDistrictOpen(false);
                  setStateOpen(false);
                  setBellOpen(false);
                }}
                className="group flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md bg-white border border-border/60 text-foreground"
              >
                <Landmark size={14} className="text-primary" />
                <span className="hidden sm:block tracking-wide">{temple?.name || "Select Temple"}</span>
                <ChevronDown
                  size={14}
                  className="text-muted-foreground transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </button>
              {templeOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto bg-white border border-border/50">
                  {filteredByState.filter(
                    (t) => selectedDistrict === "All Districts" || t.district === selectedDistrict,
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => switchTemple(t.id)}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50 ${t.id === templeId ? "bg-muted/50 font-bold text-foreground" : "font-medium text-foreground"}`}
                    >
                      <span className="text-xs">{t.name}</span>
                      <span className="text-[9px] font-semibold tracking-wider text-muted-foreground">{t.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Empty space that was replaced by moving filters */}

            {/* Clock + weather */}
            <div className="hidden md:flex items-center gap-1.5 text-xs ml-2">
              <span className="font-mono font-semibold tracking-tight text-foreground">
                {now.toLocaleTimeString("en-IN", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                -{" "}
                {now.toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>

            {/* Weather */}
            {temple && (
              <div className="hidden sm:flex items-center gap-2 rounded-full px-4 py-2 bg-white border border-border/60 shadow-sm ml-2">
                <span className="text-[9px] font-semibold tracking-wider text-muted-foreground">
                  {temple.short}
                </span>
                <span className="text-xs font-bold text-foreground">{temple.weather}</span>
              </div>
            )}

            {/* Bell */}
            <div className="relative ml-1">
              <button
                onClick={() => {
                  setBellOpen((o) => !o);
                  setDistrictOpen(false);
                  setStateOpen(false);
                  setTempleOpen(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-white hover:shadow-sm border border-transparent hover:border-border/60"
              >
                <Bell size={20} className="text-muted-foreground transition-colors hover:text-foreground" />
                <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full text-[8px] font-bold text-white bg-primary shadow-sm border border-white">
                  3
                </span>
              </button>
              {bellOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl shadow-xl bg-white border border-border/50">
                  <div className="px-5 py-3 text-[11px] font-bold tracking-tight bg-muted/40 border-b border-border/50 text-white">
                    Notifications
                  </div>
                  {[
                    {
                      t: "Peak alert",
                      b: "Inner sanctum approaching capacity",
                      c: "var(--color-primary)",
                      dot: "var(--color-primary)",
                    },
                    {
                      t: "Queue update",
                      b: "Lane B wait time +6 min",
                      c: "var(--color-status-busy)",
                      dot: "var(--color-status-busy)",
                    },
                    {
                      t: "Staff",
                      b: "8 volunteers Added to Lane C",
                      c: "var(--color-secondary)",
                      dot: "var(--color-secondary)",
                    },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 px-5 py-4 text-sm hover:bg-muted/40 transition-colors border-b border-border/30 last:border-0"
                    >
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full shadow-sm"
                        style={{ background: n.dot }}
                      />
                      <div>
                        <div className="font-bold text-xs tracking-tight" style={{ color: n.c }}>
                          {n.t}
                        </div>
                        <div className="text-muted-foreground mt-1 text-[10px] leading-relaxed">{n.b}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-white cursor-pointer transition-all duration-300 hover:scale-105 bg-[#1A1F60] shadow-sm ml-1 border border-white/20">
              A
            </div>
          </div>
        </header>

        <main
          className={`flex-1 pt-16 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${sidebarExpanded ? "ml-[260px]" : "ml-[80px]"}`}
        >
          <div className="relative p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
            {/* Temple switch shimmer */}
            {shimmer && (
              <div
                className={`fixed top-16 right-0 bottom-0 z-50 ${sidebarExpanded ? "left-[260px]" : "left-[72px]"} flex items-center justify-center backdrop-blur-md animate-in fade-in duration-200 bg-background/70`}
              >
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-red-500/5 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.15)] transform scale-110">
                  <span className="text-7xl font-montserrat text-primary/15 relative z-10">ॐ</span>
                  <div className="absolute inset-0 flex items-center justify-center animate-fill-up z-20" style={{ animationDuration: '0.5s' }}>
                    <span className="text-7xl font-montserrat text-primary drop-shadow-xl">ॐ</span>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`transition-all duration-500 ${shimmer ? "opacity-30 blur-[2px] pointer-events-none translate-y-2" : "opacity-100 translate-y-0 blur-none"}`}
            >
              {temple && (
                <>
                  {section === "dashboard" && <DashboardSection temple={temple} />}
                  {section === "darshan" && <DarshanSection />}
                  {section === "heatmap" && <HeatmapSection temple={temple} />}
                  {section === "cctv" && <CCTVSection />}
                  {(section as string) === "queue" && <QueueSection />}
                  {section === "staff" && <StaffSection />}
                  {section === "operations" && <OperationsSection />}
                  {section === "parking" && <ParkingSection />}
                  {section === "donations" && <DonationSection />}
                  {section === "annadhanam" && <AnnadhanamSection temple={temple} />}
                </>
              )}
              {/* {section === "announcements" && <AnnouncementsSection />} */}
              {/* {section === "analytics" && <AnalyticsSection />} */}
              {/* {section === "emergency" && <EmergencySection />} */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
