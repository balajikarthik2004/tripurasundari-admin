import React from 'react';
import { Globe, Landmark, Compass } from 'lucide-react';

export default function ContentPageHeader({
  title,
  subtitle,
  actions,
  icon: PropIcon,
}) {
  const getHeaderIcon = () => {
    if (PropIcon) return PropIcon;
    const lower = (title || '').toLowerCase();
    if (lower.includes('temple')) return Landmark;
    if (lower.includes('visitor') || lower.includes('guide')) return Compass;
    return Globe;
  };

  const HeaderIcon = getHeaderIcon();

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-4.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <HeaderIcon className="w-4 h-4 text-[#55132D]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0 self-stretch sm:self-auto justify-start sm:justify-end">
        {actions}
      </div>
    </div>
  );
}

