import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Car,
  Store,
} from 'lucide-react';
import Parking from './Parking';
import Vendors from './Vendors';

export default function CampusLogistics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  const initialTab =
    urlTab === 'vendors' || urlTab === 'stalls' ? 'vendors' : 'parking';

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
            Campus Logistics & Premises Management
          </h1>
        </div>

        {/* Primary Navigation: Strictly 2 Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-xl border border-stone-200/80 shrink-0">
          <button
            onClick={() => handleTabChange('parking')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'parking'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-[#E2BC6B]" />
            <span>Parking & Transit Management</span>
          </button>

          <button
            onClick={() => handleTabChange('vendors')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'vendors'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-500" />
            <span>Vendors & Commercial Stalls</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Parking Management */}
      {activeTab === 'parking' && (
        <div className="space-y-4">
          <Parking isEmbedded={true} />
        </div>
      )}

      {/* Tab 2: Vendors & Stalls */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <Vendors isEmbedded={true} />
        </div>
      )}
    </div>
  );
}

