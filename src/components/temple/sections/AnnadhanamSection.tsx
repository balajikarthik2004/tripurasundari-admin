import { type Temple } from "@/lib/temple-data";
import { StatCard } from "../ui/StatCard";
import {
  Utensils,
  Users,
  Clock,
  TrendingUp,
  Package,
  Salad,
  Flame,
  HeartHandshake,
  ChefHat,
  Leaf,
  IndianRupee,
  Star,
  AlertTriangle
} from "lucide-react";

export function AnnadhanamSection({ temple }: { temple: Temple }) {
  // Mock data scaled by temple capacity/tier
  const capacityMultiplier = temple.name.includes("Meenakshi") || temple.name.includes("Tirupati") || temple.name.includes("Palani") ? 3 : 1;
  const mealsServed = 3250 * capacityMultiplier;
  const waitingCrowd = 145 * capacityMultiplier;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER RIBBON (MINIMAL) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Utensils}
          label="Meals Served Today"
          value={mealsServed.toLocaleString()}
          color="text-emerald-600"
          bgTint="bg-emerald-50 text-emerald-600 border border-emerald-100"
          trend={{ up: true, text: "+12%" }}
          sub={`Target: ${(mealsServed * 1.1).toFixed(0)} · 92% achieved`}
          progress={92}
        />
        <StatCard
          icon={Users}
          label="Queue Waiting"
          value={waitingCrowd}
          color="text-amber-600"
          bgTint="bg-amber-50 text-amber-600 border border-amber-100/50"
          sub="~24 mins wait · 2 halls open"
          progress={Math.min(100, Math.round((waitingCrowd / (500 * capacityMultiplier)) * 100))}
          trend={{ up: waitingCrowd > 200, text: waitingCrowd > 200 ? "High queue" : "Manageable" }}
        />
        <StatCard
          icon={Flame}
          label="Kitchen Status"
          value="Cooking Dinner"
          color="text-orange-600"
          bgTint="bg-orange-50 text-orange-600 border border-orange-100/50"
          sub="Live Operations · Batch 3/4"
          trend={{ up: true, text: "On track" }}
        />
        <StatCard
          icon={HeartHandshake}
          label="On-Duty Volunteers"
          value={12 * capacityMultiplier}
          color="text-indigo-600"
          bgTint="bg-indigo-50 text-indigo-600 border border-indigo-100/50"
          sub={`Serving now · ${4 * capacityMultiplier} on break`}
          progress={Math.round(((12 * capacityMultiplier) / (16 * capacityMultiplier)) * 100)}
          trend={{ up: true, text: "Fully staffed" }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* DINING HALLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="overflow-hidden rounded-xl bg-white/60 backdrop-blur-xl shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className="border-b border-border/40 bg-muted/10 px-6 py-5 flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Utensils size={16} className="text-primary" /> Dining Hall Live Status
              </h3>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="p-6 grid gap-6 sm:grid-cols-2">
              {/* Hall A */}
              <div className="group rounded-xl border border-border/40 bg-white/40 p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:bg-white/80 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/5 to-transparent rounded-bl-full pointer-events-none" />
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-100 text-red-500 shadow-sm transition-transform group-hover:scale-105">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground tracking-tight">Hall A</h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Capacity: {200 * capacityMultiplier} seats</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 shadow-inner flex items-center gap-1.5 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
                    95% Busy
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden shadow-inner border border-border/20">
                    <div className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full w-[95%] shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Clock size={12} /> Turnover in</span>
                    <span className="text-red-600 font-extrabold tracking-normal">~8 mins</span>
                  </div>
                </div>
              </div>

              {/* Hall B */}
              <div className="group rounded-xl border border-border/40 bg-white/40 p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:bg-white/80 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-500 shadow-sm transition-transform group-hover:scale-105">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground tracking-tight">Hall B</h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Capacity: {150 * capacityMultiplier} seats</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-inner flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    60% Busy
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden shadow-inner border border-border/20">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full w-[60%] shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Clock size={12} /> Turnover in</span>
                    <span className="text-amber-600 font-extrabold tracking-normal">~15 mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SPONSORSHIP AND MENU */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Today's Menu */}
            <div className="overflow-hidden rounded-xl bg-white/60 backdrop-blur-xl shadow-sm border border-border/50 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="border-b border-border/40 bg-muted/10 px-6 py-5 flex items-center justify-between">
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ChefHat size={16} className="text-primary" /> Today's Menu
                </h3>
                <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                  Pure Veg
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 p-3 rounded-xl border border-border/20 bg-muted/5 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 border border-orange-100 text-orange-500 group-hover:scale-110 transition-transform">
                      <Flame size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <p className="font-extrabold text-foreground text-xs group-hover:text-primary transition-colors">Sambar Rice (Hot)</p>
                        <span className="text-[8px] font-bold uppercase text-muted-foreground/85 tracking-widest bg-muted/30 px-1.5 py-0.5 rounded">Main</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-medium leading-relaxed">Freshly prepared with country vegetables</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4 p-3 rounded-xl border border-border/20 bg-muted/5 hover:bg-emerald/5 hover:border-emerald/20 transition-all duration-300 group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                      <Leaf size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <p className="font-extrabold text-foreground text-xs group-hover:text-emerald transition-colors">Curd Rice</p>
                        <span className="text-[8px] font-bold uppercase text-muted-foreground/85 tracking-widest bg-muted/30 px-1.5 py-0.5 rounded">Side</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-medium leading-relaxed">With pomegranate and local pickle</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4 p-3 rounded-xl border border-border/20 bg-muted/5 hover:bg-amber/5 hover:border-amber/20 transition-all duration-300 group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-500 group-hover:scale-110 transition-transform">
                      <Utensils size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <p className="font-extrabold text-foreground text-xs group-hover:text-amber transition-colors">Sweet Pongal</p>
                        <span className="text-[8px] font-bold uppercase text-muted-foreground/85 tracking-widest bg-muted/30 px-1.5 py-0.5 rounded">Dessert</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-medium leading-relaxed">Special double-ghee traditional recipe</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sponsorships */}
            <div className="overflow-hidden rounded-xl bg-white/60 backdrop-blur-xl shadow-sm border border-border/50 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="border-b border-border/40 bg-muted/10 px-6 py-5 flex items-center justify-between">
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <HeartHandshake size={16} className="text-primary" /> Today's Sponsors
                </h3>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-100 p-5 relative overflow-hidden mb-4">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-bl-full pointer-events-none" />
                  <div className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Total Funds Raised</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-extrabold text-amber-600">₹</span>
                    <span className="text-2xl font-extrabold text-foreground tracking-tight">1,50,000</span>
                    <span className="text-[10px] font-bold text-muted-foreground ml-auto bg-white/80 border border-border/40 px-2 py-0.5 rounded-full shadow-sm">Target Met</span>
                  </div>
                  {/* Subtle target progress bar */}
                  <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden mt-3 border border-border/20">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-[100%] shadow-[0_0_6px_rgba(245,158,11,0.3)]" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3.5 p-3 rounded-xl border border-border/30 hover:border-amber-200 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground">Shri R. Krishnan & Family</p>
                      <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mt-0.5">Morning Breakfast Sponsor</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-xl border border-border/30 hover:border-amber-200 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground">Smt. Lakshmi N.</p>
                      <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mt-0.5">Evening Dinner Sponsor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INVENTORY */}
        <div className="overflow-hidden rounded-xl bg-white/60 backdrop-blur-xl shadow-sm border border-border/50 flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
          <div className="border-b border-border/40 bg-muted/10 px-6 py-5 flex items-center justify-between">
            <h3 className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Package size={16} className="text-primary" /> Kitchen Inventory
            </h3>
            <span className="text-[9px] font-bold bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 uppercase tracking-wider">
              5 Items
            </span>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-2.5 overflow-y-auto">
            {/* Item 1 */}
            <div className="group p-3 rounded-xl border border-border/40 bg-white/40 hover:bg-white/80 hover:shadow-md hover:border-emerald-500/25 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="flex justify-between items-start mb-1.5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm transition-transform group-hover:scale-110">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-foreground tracking-tight block">Rice (Ponni)</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 block">Rate: ~50kg/day</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-extrabold text-foreground tracking-tight block">450 kg</span>
                  <span className="inline-flex items-center gap-1 text-[7px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-1.5 py-0.5 mt-0.5 shadow-sm">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" /> Sufficient
                  </span>
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>Stock Level</span>
                  <span className="text-emerald-600 font-extrabold">80%</span>
                </div>
                <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden border border-border/20 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full w-[80%] shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-500" />
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="group p-3 rounded-xl border border-border/40 bg-white/40 hover:bg-white/80 hover:shadow-md hover:border-emerald-500/25 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="flex justify-between items-start mb-1.5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm transition-transform group-hover:scale-110">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-foreground tracking-tight block">Toor Dal</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 block">Rate: ~15kg/day</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-extrabold text-foreground tracking-tight block">120 kg</span>
                  <span className="inline-flex items-center gap-1 text-[7px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-1.5 py-0.5 mt-0.5 shadow-sm">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" /> Sufficient
                  </span>
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>Stock Level</span>
                  <span className="text-emerald-600 font-extrabold">65%</span>
                </div>
                <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden border border-border/20 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full w-[65%] shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-500" />
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="group p-3 rounded-xl border border-border/40 bg-white/40 hover:bg-white/80 hover:shadow-md hover:border-amber-500/25 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="flex justify-between items-start mb-1.5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500 border border-amber-100 shadow-sm transition-transform group-hover:scale-110">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-foreground tracking-tight block">Cooking Oil</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 block">Rate: ~8L/day</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-extrabold text-foreground tracking-tight block">45 L</span>
                  <span className="inline-flex items-center gap-1 text-[7px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-1.5 py-0.5 mt-0.5 shadow-sm animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" /> Reorder Soon
                  </span>
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>Stock Level</span>
                  <span className="text-amber-600 font-extrabold">35%</span>
                </div>
                <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden border border-border/20 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full w-[35%] shadow-[0_0_8px_rgba(245,158,11,0.3)] transition-all duration-500" />
                </div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="group p-3 rounded-xl border border-red-100 bg-red-50/40 hover:bg-red-50/80 hover:shadow-md hover:border-red-500/25 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-red-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="flex justify-between items-start mb-1.5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 shadow-sm transition-transform group-hover:scale-110">
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-red-600 tracking-tight block">Pure Ghee</span>
                    <span className="text-[8px] font-bold text-red-400/80 uppercase tracking-widest mt-0.5 block">Rate: ~4kg/day</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-extrabold text-red-600 tracking-tight block">12 kg</span>
                  <span className="inline-flex items-center gap-1 text-[7px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 rounded-full px-1.5 py-0.5 mt-0.5 shadow-sm animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" /> Critical Low
                  </span>
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                <div className="flex justify-between items-center text-[9px] font-bold text-red-600 uppercase tracking-wider">
                  <span>Stock Level</span>
                  <span className="text-red-600 font-extrabold">15%</span>
                </div>
                <div className="h-1.5 w-full bg-red-100 rounded-full overflow-hidden border border-red-200 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full w-[15%] shadow-[0_0_8px_rgba(239,68,68,0.4)] transition-all duration-500" />
                </div>
              </div>
            </div>

            {/* Item 5 */}
            <div className="group p-3 rounded-2xl border border-border/40 bg-surface/30 hover:bg-white hover:shadow-md hover:border-emerald-500/25 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="flex justify-between items-start mb-1.5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm transition-transform group-hover:scale-110">
                    <Salad className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-foreground tracking-tight block">Vegetables</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 block">Rate: ~60kg/day</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-extrabold text-foreground tracking-tight block">200 kg</span>
                  <span className="inline-flex items-center gap-1 text-[7px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-1.5 py-0.5 mt-0.5 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Sufficient
                  </span>
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>Stock Level</span>
                  <span className="text-emerald-600 font-extrabold">90%</span>
                </div>
                <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden border border-border/20 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full w-[90%] shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-500" />
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3">
              <button className="w-full rounded-xl bg-primary hover:bg-primary/95 text-white py-3 font-bold text-[13px] hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 border border-primary/20 cursor-pointer flex items-center justify-center gap-2">
                <TrendingUp size={16} /> Generate Indent Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
