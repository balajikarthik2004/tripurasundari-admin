import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  Users,
  Radio,
  Send,
  Building,
  RefreshCw,
  Bell,
  Eye,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import Approvals from './Approvals';
import Alerts from './Alerts';

export default function ApprovalsAlerts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'alerts' ? 'alerts' : 'approvals';
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
            Approvals & Operational Alerts
          </h1>
        </div>

        {/* Segmented Primary Navigation: Strictly 2 Options */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-xl border border-stone-200/80 shrink-0">
          <button
            onClick={() => handleTabChange('approvals')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'approvals'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-[#E2BC6B]" />
            <span>Administrative Approvals</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-white">
              18
            </span>
          </button>

          <button
            onClick={() => handleTabChange('alerts')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'alerts'
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Operational Alerts</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-rose-600 text-white">
              5
            </span>
          </button>
        </div>
      </div>

      {/* Primary Tab Content */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <Approvals isEmbedded={true} />
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <Alerts isEmbedded={true} />
        </div>
      )}
    </div>
  );
}

