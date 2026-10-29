import { useState, useEffect } from "react";
import { CCTV_CAMERAS, statusColor } from "@/lib/temple-data";
import { useLiveClock } from "@/lib/use-live";
import {
  Maximize2,
  Camera,
  Bell,
  ZoomIn,
  Search,
  Image as ImageIcon,
  ScanFace,
  UploadCloud,
  UserSearch,
  Target,
  Activity,
  Users,
  ActivityIcon,
  AlertTriangle,
  Crosshair,
} from "lucide-react";
import { toast } from "sonner";
import cctvMatch1 from "@/assets/cctv_match_1.png";
import cctvMatch2 from "@/assets/cctv_match_2.png";
import cctvMatch3 from "@/assets/cctv_match_3.png";

const matchImages = [cctvMatch1, cctvMatch2, cctvMatch3];
const alerts = [
  {
    cam: "CAM-P02",
    color: "danger",
    time: "14:28",
    msg: "Queue Lane A overcrowding detected. Density exceeds safe limit.",
  },
  {
    cam: "CAM-P01",
    color: "status-busy",
    time: "14:15",
    msg: "Rapid crowd inflow surge at Main Gopuram. +42 people in last 3 minutes.",
  },
];
const matchResults = [
  {
    cam: "CAM-P04",
    name: "Inner Sanctum Approach",
    time: "14:32:15",
    conf: 98,
    status: "High Match",
  },
  { cam: "CAM-P02", name: "Queue Lane A", time: "14:15:02", conf: 84, status: "Possible Match" },
  {
    cam: "CAM-P12",
    name: "Footwear Counter",
    time: "13:58:44",
    conf: 76,
    status: "Low Confidence",
  },
];
function FakeFeed({
  idx,
  status,
  scanOverlay = false,
}: {
  idx: number;
  status: string;
  scanOverlay?: boolean;
}) {
  const boxes = Array.from({ length: status === "CRITICAL" ? 6 : status === "CROWDED" ? 8 : status === "BUSY" ? 5 : 3 }).map(
    (_, i) => ({
      x: 10 + ((idx * 17 + i * 23) % 75),
      y: 15 + ((idx * 11 + i * 19) % 60),
      w: 8 + ((i * 3) % 6),
      h: 14 + ((i * 5) % 8),
    }),
  );
  const aiLabels = [
    "Adult · 98%",
    "Person · 94%",
    "Youth · 88%",
    "Person · 99%",
    "Elderly · 76%",
    "Adult · 82%",
  ];
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-border/50 shadow-inner">
      <video
        src={
          idx % 2 === 0
            ? "https://assets.mixkit.co/videos/preview/mixkit-crowd-of-people-crossing-a-street-in-the-city-4361-small.mp4"
            : "https://assets.mixkit.co/videos/preview/mixkit-commuters-walking-in-a-subway-station-4180-small.mp4"
        }
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale invert mix-blend-screen"
      />
      <div
        className="absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05) 0, transparent 60%)",
        }}
      />
      {boxes.map((b, i) => {
        const isSuspicious = status === "CRITICAL" && i === 2; // Make the 3rd person the suspicious one so it's mixed in
        return (
          <div
            key={i}
            className={`animate-track absolute border-[0.5px] ${isSuspicious ? "border-danger/80 shadow-[0_0_8px_rgba(255,0,0,0.5)] z-10" : "border-emerald/50"}`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${5 + (i % 4)}s`,
            }}
          >
            <div className={`absolute -top-3 left-0 px-1 py-[1px] text-[6px] font-semibold text-white whitespace-nowrap ${isSuspicious ? "bg-danger/90 animate-pulse" : "bg-emerald/70"}`}>
              ID:{idx}{i} {isSuspicious ? "⚠️ SUSPECT" : ""}
            </div>
          </div>
        );
      })}
      {scanOverlay && (
        <div className="absolute inset-0 z-10 bg-info/10">
          <div className="h-full w-full bg-[linear-gradient(transparent_50%,rgba(0,191,255,0.1)_50%)] bg-[length:100%_4px] mix-blend-multiply opacity-50" />
          <div className="absolute left-0 right-0 h-0.5 bg-info/60 shadow-[0_0_10px_rgba(0,191,255,0.8)] animate-scan" />
        </div>
      )}
      <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-sm bg-black/80 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-md ring-1 ring-white/10">
        <span className={`blink-rec h-1.5 w-1.5 rounded-xl ${status === "CRITICAL" ? "bg-danger shadow-[0_0_5px_rgba(255,0,0,0.8)]" : "bg-emerald shadow-[0_0_5px_rgba(16,185,129,0.8)]"}`} />
        REC
      </div>
      {/* <div className="absolute right-2 top-2 rounded-sm bg-emerald/90 px-1.5 py-0.5 text-[8px] font-semibold text-white shadow-sm"> AI TRACKING </div> */}
    </div>
  );
}
export function CCTVSection() {
  const now = useLiveClock();
  const timeStr = now.toLocaleTimeString("en-IN", { hour12: false });
  const [tab, setTab] = useState<"live" | "search">("live");
  const [searchState, setSearchState] = useState<"idle" | "scanning" | "results">("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTargetImage(reader.result as string);
        setSearchState("scanning");
        setScanProgress(0);
        toast.success("Subject image acquired. Deep scanning 12 active feeds...");
      };
      reader.readAsDataURL(file);
    }
  };
  const resetSearch = () => {
    setSearchState("idle");
    setScanProgress(0);
    setTargetImage(null);
  };
  useEffect(() => {
    if (searchState === "scanning") {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();

      const playBeep = (freq = 880, vol = 0.05, duration = 0.1) => {
        try {
          if (ctx.state === "suspended") ctx.resume();
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gainNode.gain.setValueAtTime(vol, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + duration);
        } catch (e) {
          console.error("Audio error:", e);
        }
      };

      const interval = setInterval(() => {
        setScanProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          const next = p + Math.floor(Math.random() * 12) + 4;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setSearchState("results");
              toast.success("Scan complete. 3 potential matches found.");
              playBeep(1200, 0.1, 0.3); // Success beep
            }, 0);
            return 100;
          }
          // Simple progress beep
          playBeep();
          return next;
        });
      }, 400);
      return () => {
        clearInterval(interval);
        ctx.close().catch(() => { });
      };
    }
  }, [searchState]);

  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Simulate a suspicious person entering while viewing the live recording feeds
  useEffect(() => {
    if (tab === "live") {
      const timer = setTimeout(() => {
        const targetCam = "CAM-P04";
        setActiveAlert(targetCam);
        
        // --- Play Dramatic Alert Sound Effect ---
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        try {
          if (ctx.state === "suspended") ctx.resume();
          // Create a dramatic heavy alarm / brass hit
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = "sawtooth";
          osc2.type = "square";

          // Low pitch for dramatic tension
          osc1.frequency.setValueAtTime(55, ctx.currentTime);
          osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.5);

          osc2.frequency.setValueAtTime(56, ctx.currentTime); // Slightly detuned
          osc2.frequency.exponentialRampToValueAtTime(31, ctx.currentTime + 1.5);

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1); // Sharp attack
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(2000, ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.5);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(ctx.currentTime);
          osc2.start(ctx.currentTime);
          osc1.stop(ctx.currentTime + 2);
          osc2.stop(ctx.currentTime + 2);
        } catch (e) {
          console.error("Audio playback error", e);
        }
        // ----------------------------------------

        toast.error(`Critical Alert! Suspicious person detected on ${targetCam}.`);

        // Delay the voice announcement slightly so the dramatic sound hits first
        setTimeout(() => {
          if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`Alert! Suspicious activity detected on camera ${targetCam.replace('CAM-P0', '')}. Security team, please respond immediately.`);
            utterance.pitch = 1.1;
            utterance.rate = 1.05;
            const voices = window.speechSynthesis.getVoices();
            const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'));
            if (englishVoice) utterance.voice = englishVoice;
            window.speechSynthesis.speak(utterance);
          }
        }, 800); // 800ms delay
      }, 6000); // Trigger 6 seconds after opening the live tab

      return () => {
        clearTimeout(timer);
        setActiveAlert(null);
      };
    }
  }, [tab]);

  // CCTV Recorder Ambient Sound (tape hiss + motor hum)
  useEffect(() => {
    if (tab !== "live") return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();

    let humOsc: OscillatorNode;
    let noiseSource: AudioBufferSourceNode;

    const startCCTVSound = () => {
      try {
        if (ctx.state === "suspended") ctx.resume();

        const mainGain = ctx.createGain();
        mainGain.gain.value = 0.05; // Keep it very quiet and ambient
        mainGain.connect(ctx.destination);

        // 1. Motor Hum (Low frequency)
        humOsc = ctx.createOscillator();
        humOsc.type = "triangle";
        humOsc.frequency.value = 60; // 60Hz low hum
        const humGain = ctx.createGain();
        humGain.gain.value = 0.2;
        humOsc.connect(humGain);
        humGain.connect(mainGain);
        humOsc.start();

        // 2. Film Projector Click (24 frames per second)
        const frameRate = 24;
        const frameSamples = Math.floor(ctx.sampleRate / frameRate);
        const clickBuffer = ctx.createBuffer(1, frameSamples, ctx.sampleRate);
        const clickData = clickBuffer.getChannelData(0);

        // Fill the first 5% of the frame with noise to simulate the mechanical click of the film advancing
        const clickLength = Math.floor(frameSamples * 0.05);
        for (let i = 0; i < clickLength; i++) {
          // Add a decaying burst of noise
          clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickLength / 5));
        }

        noiseSource = ctx.createBufferSource();
        noiseSource.buffer = clickBuffer;
        noiseSource.loop = true;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "highpass"; // highpass makes it sound more like a mechanical click
        noiseFilter.frequency.value = 1000;

        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.5; // Make the clicking distinct

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(mainGain);
        noiseSource.start();

      } catch (e) {
        // ignore
      }
    };

    startCCTVSound();

    // Handle browsers that block autoplay
    const handleInteraction = () => {
      if (ctx.state === "suspended") ctx.resume();
    };
    window.addEventListener("click", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      if (humOsc) {
        try { humOsc.stop(); } catch (e) { }
      }
      if (noiseSource) {
        try { noiseSource.stop(); } catch (e) { }
      }
      ctx.close().catch(() => { });
    };
  }, [tab]);

  return (
    <div className="space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-4">
        <div className="relative z-10">
          <div className="text-2xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
            Security Command Center
          </div>
          <div className="mt-1.5 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
            AI-Powered Surveillance & Threat Detection
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2 rounded-full bg-emerald/10 text-emerald px-3.5 py-1.5 border border-emerald/20 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </span>
              <span>12 Active</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted/50 text-muted-foreground px-3.5 py-1.5 border border-border/50">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              0 Offline
            </div>
            <div className="flex items-center gap-2 rounded-full bg-danger/10 text-danger px-3.5 py-1.5 border border-danger/20 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-danger shadow-[0_0_8px_rgba(255,0,0,0.8)]"></span>
              </span>
              <span>Recording All</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-2xl border border-border/40 bg-muted/20 p-1.5 relative z-10">
          <button
            onClick={() => setTab("live")}
            className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-all ${tab === "live" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/50"}`}
          >
            <Activity size={16} /> Live Grid
          </button>
          <button
            onClick={() => setTab("search")}
            className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-all ${tab === "search" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/50"}`}
          >
            <ScanFace size={16} /> AI Person Search
          </button>
        </div>
      </div>
      {tab === "live" ? (
        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          {/* Camera Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CCTV_CAMERAS.map((c, i) => {
              const isAlert = c.id === activeAlert;
              return (
              <div
                key={c.id}
                className={`group flex flex-col justify-between rounded-xl border p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
                  isAlert 
                    ? "border-danger ring-2 ring-danger/50 shadow-[0_0_30px_rgba(255,0,0,0.4)] animate-pulse bg-danger/5" 
                    : "border-border/50 bg-white/60 backdrop-blur-xl"
                }`}
              >
                <FakeFeed idx={i} status={isAlert ? "CRITICAL" : c.status} scanOverlay={isAlert} />
                <div className="mt-3 flex items-start justify-between">
                  <div>
                    <div className={`text-[9px] font-semibold tracking-widest uppercase ${isAlert ? "text-danger" : "text-muted-foreground"}`}>{c.id}</div>
                    <div className={`mt-1 text-[13px] font-bold tracking-tight leading-tight ${isAlert ? "text-danger" : "text-foreground"}`}>
                      {c.name}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-widest ${c.status === "CROWDED" ? "bg-red-50 text-red-600 border-red-100" :
                      c.status === "BUSY" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2.5 text-[11px] font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-muted-foreground/80">
                    <UserSearch size={14} className="text-muted-foreground/60" />
                    {c.type === "people" ? `${c.count} detected` : `${c.count} vehicles`}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground/70">{timeStr}</span>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {[ZoomIn, Camera, Bell, Maximize2].map((Icon, j) => (
                    <button
                      key={j}
                      className="flex h-8 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground border border-border/50 transition-all hover:bg-surface hover:text-foreground hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
            );
            })}
          </div>
          {/* Analytics Sidebar */}
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-8">
              {[
                { l: "Total Detected", v: "1,739", c: "text-amber-600", i: Users },
                { l: "In Queues", v: "398", c: "text-indigo-600", i: ActivityIcon },
                { l: "Anomalies", v: "2", c: "text-red-600", i: AlertTriangle },
                { l: "Avg Density", v: "63%", c: "text-amber-600", i: Crosshair },
              ].map((s) => (
                <div
                  key={s.l}
                  className="group rounded-xl border border-border/50 bg-white/60 backdrop-blur-xl p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">{s.l}</div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/30 border border-border/50 transition-colors group-hover:opacity-80 ${s.c}`}>
                      <s.i size={18} />
                    </div>
                  </div>
                  <div
                    className={`text-2xl font-bold tracking-tight ${s.c} tabular-nums`}
                  >
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border/50 bg-white/60 backdrop-blur-xl p-8 shadow-sm flex-1 transition-all duration-500 hover:shadow-xl">
              <div className="mb-6 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">Critical Alerts</div>
              <div className="space-y-3">
                {alerts.map((a, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl border ${a.color === 'danger' ? 'border-red-100 bg-red-50' : 'border-amber-100 bg-amber-50'} p-6 text-[12px] font-medium`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`${a.color === 'danger' ? 'text-red-600' : 'text-amber-600'} text-[10px] font-semibold uppercase tracking-widest`}>{a.cam}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{a.time}</span>
                    </div>
                    <div className="mt-1.5 leading-relaxed text-foreground/90">
                      {a.msg}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* AI Person Search Tab */ <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Upload & Controls */}
          <div className="rounded-xl border border-border/50 bg-white/60 backdrop-blur-xl p-8 shadow-sm flex flex-col transition-all duration-500 hover:shadow-xl">
            <div className="mb-8">
              <h2 className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">AI Facial Search</h2>
              <p className="mt-2 text-[12px] font-medium text-foreground leading-relaxed">
                Upload a clear photo of a person. The AI will scan the last 24 hours of footage
                across all 12 cameras.
              </p>
            </div>
            {searchState === "idle" ? (
              <label className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-surface/50 px-6 py-10 transition-all hover:border-info/50 hover:bg-info/5 cursor-pointer relative overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="rounded-xl bg-surface p-8 shadow-sm transition-transform group-hover:scale-110">
                  <UploadCloud size={32} className="text-muted-foreground group-hover:text-info" />
                </div>
                <div className="mt-3 text-[12px] font-semibold text-foreground">
                  Click to upload target photo
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  Select a JPG, PNG, or WEBP file
                </div>
              </label>
            ) : (
              <div className="flex flex-col items-center rounded-xl border border-border bg-surface p-8">
                <div className="relative h-32 w-32 overflow-hidden rounded-xl border-4 border-info shadow-[0_0_20px_rgba(0,191,255,0.3)] bg-card">
                  {targetImage ? (
                    <img
                      src={targetImage}
                      alt="Target Subject"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <UserSearch size={48} className="text-muted-foreground opacity-50" />
                    </div>
                  )}
                  {searchState === "scanning" && (
                    <div className="absolute left-0 right-0 h-1 bg-info shadow-[0_0_15px_#00bfff] animate-scan mix-blend-screen opacity-80" />
                  )}
                </div>
                <div className="mt-6 w-full text-center">
                  <div className="text-[12px] font-semibold text-foreground">Target Subject Acquired</div>
                  <div className="mt-1 text-[10px] text-info font-normal">Tracking ID: SUB-8942-A</div>
                </div>
                {searchState === "results" && (
                  <button
                    onClick={resetSearch}
                    className="mt-6 w-full rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold transition-colors hover:bg-muted"
                  >
                    New Search
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Scanning & Results View */}
          <div className="rounded-xl border border-border/50 bg-white/60 backdrop-blur-xl p-8 shadow-sm min-h-[500px] flex flex-col transition-all duration-500 hover:shadow-xl">
            {searchState === "idle" && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Target size={48} className="mb-4 text-muted-foreground/30" />
                <div className="text-[12px] font-semibold text-foreground">
                  Awaiting Target Image
                </div>
                <div className="mt-1 text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
                  Upload a photo to begin deep scanning network
                </div>
              </div>
            )}
            {searchState === "scanning" && (
              <div className="flex h-full flex-col justify-center">
                <div className="mb-10 relative">
                  <div className="relative rounded-2xl bg-white border border-border/60 p-8 shadow-sm overflow-hidden">
                    <div className="relative flex items-center justify-between text-foreground mb-6">
                      <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-foreground/80">
                        <ScanFace size={20} className="text-primary animate-pulse" /> Deep Neural Scan Running
                      </span>
                      <span className="font-mono text-2xl font-extrabold tabular-nums text-primary">
                        {scanProgress.toString().padStart(2, '0')}%
                      </span>
                    </div>

                    <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden shadow-inner border border-border/40">
                      <div
                        className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${scanProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-scan" />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <span>Analyzing Node {Math.floor(scanProgress / 10)}</span>
                      <span>{scanProgress > 50 ? 'Identifying Signatures...' : 'Isolating Variables...'}</span>
                      <span>{scanProgress === 100 ? 'Complete' : 'Processing...'}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-12 grid grid-cols-4 gap-8 opacity-50">
                  {CCTV_CAMERAS.slice(0, 4).map((c, i) => (
                    <div key={i} className="opacity-70 grayscale">
                      <FakeFeed idx={i} status="NORMAL" scanOverlay={true} />
                      <div className="mt-2 text-center text-[9px] font-mono text-muted-foreground">
                        SCANNING {c.id}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {searchState === "results" && (
              <div className="flex h-full flex-col">
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                  <div className="text-sm font-semibold text-foreground">Match Results</div>
                  <div className="rounded-xl bg-info/10 px-3 py-1 text-[10px] font-medium text-info border border-info/30">
                    3 Matches Found
                  </div>
                </div>
                <div className="space-y-4">
                  {matchResults.map((m, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row gap-8 rounded-xl border border-border bg-surface p-8 transition-all hover:shadow-md hover:border-info/30 group"
                    >
                      <div className="w-full sm:w-48 shrink-0 relative aspect-video rounded-xl overflow-hidden ring-1 ring-border shadow-inner">
                        <img
                          src={matchImages[i]}
                          alt="Match"
                          className="w-full h-full object-cover grayscale opacity-90"
                        />
                        <div
                          className="absolute inset-0 opacity-10 mix-blend-multiply"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.08) 0, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.05) 0, transparent 60%)",
                          }}
                        />

                        <div className="absolute left-[35%] top-[15%] w-[30%] h-[70%] border border-black/80 animate-pulse">
                          <div className="absolute -top-4 left-0 bg-black/90 px-1.5 py-[2px] text-[8px] font-semibold text-white whitespace-nowrap">
                            ID: TGT-{8942 + i}
                          </div>
                          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-black -translate-x-[1px] -translate-y-[1px]"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-black translate-x-[1px] -translate-y-[1px]"></div>
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-black -translate-x-[1px] translate-y-[1px]"></div>
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-black translate-x-[1px] translate-y-[1px]"></div>
                        </div>

                        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-sm bg-black/80 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-md ring-1 ring-white/10">
                          <span className="blink-rec h-1.5 w-1.5 rounded-xl bg-danger shadow-[0_0_5px_rgba(255,0,0,0.8)]" />{" "}
                          REC
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-foreground text-xs">{m.name}</div>
                            <div className="mt-1 text-[10px] font-mono text-muted-foreground">
                              {m.cam} • {m.time}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div
                              className={`text-sm font-bold tabular-nums ${m.conf > 90 ? "text-emerald" : m.conf > 80 ? "text-saffron" : "text-status-busy"}`}
                            >
                              {m.conf}%
                            </div>
                            <div className="text-[10px] font-semibold text-muted-foreground">
                              Confidence
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button className="flex items-center gap-1.5 rounded bg-info px-3 py-1.5 text-[9px] font-medium text-white shadow-sm transition-opacity hover:opacity-90">
                            <ZoomIn size={12} /> View Frame
                          </button>
                          <button className="flex items-center gap-1.5 rounded border border-border bg-card px-3 py-1.5 text-[9px] font-medium text-foreground transition-colors hover:bg-muted">
                            Track Route
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
