import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarCheck,
  Flame,
  Clock,
  Ticket,
} from 'lucide-react';
import { DarshanBookingProvider } from '../context/DarshanBookingContext';
import DarshanBookings from './DarshanBookings';
import GateManagement from './GateManagement';
import PoojaSeva from './PoojaSeva';
import RitualSchedule from './RitualSchedule';

function SacredServicesContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  
  // Tab 1: 'darshan' | Tab 2: 'other_sevas' | Tab 3: 'rituals'
  const initialTab =
    urlTab === 'other_sevas' || urlTab === 'pooja' || urlTab === 'pooja_seva'
      ? 'other_sevas'
      : urlTab === 'rituals' || urlTab === 'ritual_schedule'
      ? 'rituals'
      : 'darshan';

  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
            Bookings & Sacred Services
          </h1>
        </div>

        {/* Primary Navigation: Strictly 3 Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-xl border border-stone-200/80 shrink-0 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => handleTabChange('darshan')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'darshan' || activeTab === 'darshan_gate'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-[#E2BC6B]" />
            <span>Darshan</span>
          </button>

          <button
            onClick={() => handleTabChange('other_sevas')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'other_sevas' || activeTab === 'pooja_seva'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Other Sevas</span>
          </button>

          <button
            onClick={() => handleTabChange('rituals')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rituals'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Rituals</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DARSHAN */}
      {(activeTab === 'darshan' || activeTab === 'darshan_gate') && (
        <div className="space-y-4">
          {urlTab === 'gate' || urlTab === 'gate_management' ? (
            <GateManagement isEmbedded={true} />
          ) : (
            <DarshanBookings isEmbedded={true} />
          )}
        </div>
      )}

      {/* TAB 2: OTHER SEVAS */}
      {(activeTab === 'other_sevas' || activeTab === 'pooja_seva') && (
        <div className="space-y-4">
          <PoojaSeva isEmbedded={true} />
        </div>
      )}

      {/* TAB 3: RITUAL TIMETABLE */}
      {activeTab === 'rituals' && (
        <div className="space-y-4">
          <RitualSchedule isEmbedded={true} />
        </div>
      )}
    </div>
  );
}

export default function SacredServices() {
  return (
    <DarshanBookingProvider>
      <SacredServicesContent />
    </DarshanBookingProvider>
  );
}

