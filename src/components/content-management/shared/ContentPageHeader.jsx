import React from 'react';
import { Globe } from 'lucide-react';

export default function ContentPageHeader({
  title,
  subtitle,
  actions,
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">{title}</h1>
          {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
          {actions}
        </div>
      </div>
    </div>
  );
}

