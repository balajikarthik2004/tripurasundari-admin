import React from 'react';
import Reports from './Reports';

export default function ReportsAdmin() {
  return (
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
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
