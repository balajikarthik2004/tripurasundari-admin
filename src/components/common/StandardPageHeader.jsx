import React from 'react';
import { Building2 } from 'lucide-react';

/**
 * StandardPageHeader — Global unified page header
 * Matches temple theme (#55132D burgundy, stone borders, compact for 14" laptops)
 */
export default function StandardPageHeader({
  title,
  subtitle,
  badge,
  actions,
  icon: PropIcon,
}) {
  const IconComponent = PropIcon || Building2;

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-4.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <IconComponent className="w-4 h-4 text-[#55132D]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-tight">
            {title}
          </h1>
          {badge && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {badge}
            </span>
          )}
        </div>
        
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-stretch sm:self-auto justify-start sm:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}

