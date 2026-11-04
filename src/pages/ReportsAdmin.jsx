import React from 'react';
import { BarChart3 } from 'lucide-react';
import Reports from './Reports';

export default function ReportsAdmin() {
  return (
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4 text-[#55132D]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
            Reports & Analytics
          </h1>
        </div>
      </div>

      {/* Reports Content */}
      <div className="space-y-4">
        <Reports isEmbedded={true} />
      </div>
    </div>
  );
}
