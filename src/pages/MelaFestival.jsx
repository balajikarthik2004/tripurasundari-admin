import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Tent,
  CalendarDays,
  Shield,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import MelaManagement from './MelaManagement';
import EventsFestivals from './EventsFestivals';

export default function MelaFestival() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  const initialTab =
    urlTab === 'events' || urlTab === 'calendar'
      ? 'calendar'
      : urlTab === 'safety' || urlTab === 'emergency'
      ? 'safety'
      : 'command';

  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <Tent className="w-4 h-4 text-[#55132D]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
            Mela & Festival Management
          </h1>
        </div>

        {/* Primary Navigation: Strictly 3 Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-xl border border-stone-200/80 shrink-0 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => handleTabChange('command')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'command'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Tent className="w-3.5 h-3.5 text-[#E2BC6B]" />
            <span>Festival Command & Readiness</span>
          </button>

          <button
            onClick={() => handleTabChange('calendar')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
            <span>Public Event Calendar</span>
          </button>

          <button
            onClick={() => handleTabChange('safety')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'safety'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-500" />
            <span>Emergency & Disaster SOPs</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Festival Command (Diwali Mela 2026 Readiness) */}
      {activeTab === 'command' && (
        <div className="space-y-4">
          <MelaManagement isEmbedded={true} initialTab="overview" />
        </div>
      )}

      {/* Tab 2: Public Event Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <EventsFestivals isEmbedded={true} />
        </div>
      )}

      {/* Tab 3: Emergency & Disaster SOPs */}
      {activeTab === 'safety' && (
        <div className="space-y-4">
          <MelaManagement isEmbedded={true} initialTab="safety" />
        </div>
      )}
    </div>
  );
}

