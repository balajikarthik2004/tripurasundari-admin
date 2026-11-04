import React from 'react';
import { Globe } from 'lucide-react';

export default function ContentPageHeader({
  title,
  subtitle,
  actions,
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-4.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
          {title}
        </h1>
        
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0 self-stretch sm:self-auto justify-start sm:justify-end">
        {actions}
      </div>
    </div>
  );
}

