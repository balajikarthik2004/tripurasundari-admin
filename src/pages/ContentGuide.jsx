import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Landmark,
  MapPin,
  Megaphone,
} from 'lucide-react';
import TempleInformation from './TempleInformation';
import VisitGuide from './VisitGuide';
import Announcements from './Announcements';

export default function ContentGuide() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  const initialTab =
    urlTab === 'map' || urlTab === 'visit' || urlTab === 'visit-guide'
      ? 'visit_guide'
      : urlTab === 'announcements' || urlTab === 'notices'
      ? 'announcements'
      : 'temple_content';

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
            <Landmark className="w-4 h-4 text-[#55132D]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
            Temple Content & Visitor Guide
          </h1>
        </div>

        {/* Primary Navigation: Strictly 3 Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-xl border border-stone-200/80 shrink-0 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => handleTabChange('temple_content')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'temple_content'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-[#E2BC6B]" />
            <span>Temple Heritage & CMS</span>
          </button>

          <button
            onClick={() => handleTabChange('visit_guide')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'visit_guide'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>Visitor Guide & Campus Map</span>
          </button>

          <button
            onClick={() => handleTabChange('announcements')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-amber-500" />
            <span>Public Announcements</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Temple Content & Heritage */}
      {activeTab === 'temple_content' && (
        <div className="space-y-4">
          <TempleInformation isEmbedded={true} />
        </div>
      )}

      {/* Tab 2: Visitor Guide & 2D Site Plan Map */}
      {activeTab === 'visit_guide' && (
        <div className="space-y-4">
          <VisitGuide isEmbedded={true} />
        </div>
      )}

      {/* Tab 3: Announcements & Circulars */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <Announcements isEmbedded={true} />
        </div>
      )}
    </div>
  );
}

