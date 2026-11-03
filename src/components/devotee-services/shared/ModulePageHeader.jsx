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
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-stretch xl:self-auto justify-start xl:justify-end">
        {secondaryAction}

        {primaryActionLabel && onPrimaryAction && (
          <button
            onClick={onPrimaryAction}
            className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-xl shadow-xs transition-all duration-150 flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <ActionIcon className="w-4 h-4 text-[#E2BC6B] shrink-0" />
            <span>{cleanActionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
