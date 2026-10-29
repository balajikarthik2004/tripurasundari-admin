import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  color?: string;
  sub?: string;
  trend?: { up: boolean; text: string };
  valueSuffix?: React.ReactNode;
  bgTint?: string;
  progress?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color = "text-foreground",
  sub,
  trend,
  valueSuffix,
  bgTint,
}: StatCardProps) {
  
  // Safely map text colors to background and gradient colors for Tailwind JIT
  let glowClass = "from-primary/20 to-primary/0";
  let lineClass = "bg-primary";
  
  if (color.includes("emerald")) {
    glowClass = "from-emerald-500/20 to-emerald-500/0";
    lineClass = "bg-emerald-500";
  } else if (color.includes("amber")) {
    glowClass = "from-amber-500/20 to-amber-500/0";
    lineClass = "bg-amber-500";
  } else if (color.includes("indigo")) {
    glowClass = "from-indigo-500/20 to-indigo-500/0";
    lineClass = "bg-indigo-500";
  } else if (color.includes("red")) {
    glowClass = "from-red-500/20 to-red-500/0";
    lineClass = "bg-red-500";
  } else if (color.includes("blue")) {
    glowClass = "from-blue-500/20 to-blue-500/0";
    lineClass = "bg-blue-500";
  }

  return (
    <div className="relative group overflow-hidden rounded-3xl border border-border/50 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
      
      {/* Decorative Glow Blob */}
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${glowClass} opacity-50 blur-[40px] transition-all duration-500 group-hover:scale-150 group-hover:opacity-100`} />

      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        {/* Top Row: Heading (Left) + Icon (Right) */}
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest pr-2 leading-tight">
            {label}
          </div>
          
          <div className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${bgTint || 'bg-white border border-border/50 text-muted-foreground'}`}>
            <Icon size={20} className={bgTint ? "" : "text-slate-700"} />
          </div>
        </div>

        {/* Bottom Row: Value + Sub/Trend */}
        <div className="flex flex-col">
          <h3 className={`flex items-baseline gap-1.5 text-2xl font-black tracking-tight ${color} tabular-nums drop-shadow-sm leading-none`}>
            {value}
            {valueSuffix && (
              <span className="text-xs font-bold text-muted-foreground tracking-normal">
                {valueSuffix}
              </span>
            )}
          </h3>

          {(trend || sub) && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {trend && (
                <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm ${trend.up ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {trend.text}
                </div>
              )}
              
              {sub && (
                <span className="text-[11px] font-bold text-muted-foreground">
                  {sub}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animated Bottom Accent Line */}
      <div className={`absolute bottom-0 left-0 h-1 w-0 ${lineClass} transition-all duration-500 group-hover:w-full opacity-80`} />
    </div>
  );
}