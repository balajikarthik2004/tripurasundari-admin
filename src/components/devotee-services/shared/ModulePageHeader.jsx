import React from 'react';
import { Plus } from 'lucide-react';

export default function ModulePageHeader({
  title,
  subtitle,
  categoryBadge,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionIcon: ActionIcon = Plus,
  secondaryAction,
}) {
  const cleanActionLabel = primaryActionLabel
    ? primaryActionLabel.replace(/^\+\s*/, '')
    : '';

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-4.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
            {title}
          </h1>
          {categoryBadge && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {categoryBadge}
            </span>
          )}
        </div>
        
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0 self-stretch sm:self-auto justify-start sm:justify-end">
        {secondaryAction}

        {primaryActionLabel && onPrimaryAction && (
          <button
            onClick={onPrimaryAction}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#55132D] hover:bg-[#681B37] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <ActionIcon className="w-4 h-4 text-[#E2BC6B] shrink-0" />
            <span>{cleanActionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
