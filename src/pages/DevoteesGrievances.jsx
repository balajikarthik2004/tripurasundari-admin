import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  MessageSquareText,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import Devotees from './Devotees';
import Grievances from './Grievances';

export default function DevoteesGrievances() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  const initialTab =
    urlTab === 'grievances' || urlTab === 'cases'
      ? 'grievances'
      : urlTab === 'feedback' || urlTab === 'insights'
      ? 'feedback'
      : 'directory';

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
            <Users className="w-4 h-4 text-[#55132D]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
            Devotees & Grievances Administration
          </h1>
        </div>

        {/* Primary Navigation: Strictly 3 Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-xl border border-stone-200/80 shrink-0 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => handleTabChange('directory')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'directory'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#E2BC6B]" />
            <span>Devotees Directory</span>
          </button>

          <button
            onClick={() => handleTabChange('grievances')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'grievances'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Grievances</span>
          </button>

          <button
            onClick={() => handleTabChange('feedback')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5 text-blue-500" />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DEVOTEE DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <Devotees isEmbedded={true} />
        </div>
      )}

      {/* TAB 2: GRIEVANCE CASES */}
      {activeTab === 'grievances' && (
        <div className="space-y-4">
          <Grievances isEmbedded={true} initialTab="grievances" />
        </div>
      )}

      {/* TAB 3: FEEDBACK & INSIGHTS */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <Grievances isEmbedded={true} initialTab="feedback" />
        </div>
      )}
    </div>
  );
}

