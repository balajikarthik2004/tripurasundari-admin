import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import { FESTIVAL_INFO } from '../../data/dashboardData';

export default function DashboardHero() {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#55132D] via-[#481026] to-[#360B1C] text-white px-5 py-4 shadow-sm border border-[#E8E2D8]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left: Greeting & Operational Status */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#E2BC6B]/50 bg-stone-900/40 p-0.5 shadow-xs">
            <img
              src="/temple-admin-crest.png"
              alt="Temple Crest"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight font-serif">
            Good Morning, Administrator
          </h2>
        </div>
      </div>

      {/* Right: Festival Action Pill */}
      <button
        type="button"
        onClick={() => navigate(FESTIVAL_INFO.path)}
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white transition-all cursor-pointer shrink-0 self-start sm:self-auto group shadow-2xs"
      >
        <Sparkles className="w-4 h-4 text-[#E2BC6B] group-hover:rotate-12 transition-transform" />
        <span className="font-semibold text-[#E2BC6B]">{FESTIVAL_INFO.name}</span>
        <span className="text-white/40">·</span>
        <span className="text-stone-300">{FESTIVAL_INFO.dates}</span>
        <span className="text-white/40">·</span>
        <span className="text-amber-300 font-bold">{FESTIVAL_INFO.daysLeft}d left</span>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
