import React from 'react';
import {
  Plus,
  Users,
  UserCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

function getOperationsIcon(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('crowd') || t.includes('gate') || t.includes('queue')) return Users;
  if (t.includes('staff') || t.includes('duty') || t.includes('personnel')) return UserCheck;
  return ShieldAlert;
}

export default function OperationsPageHeader({
  title,
  icon: PropIcon,
  subtitle,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionIcon: ActionIcon = Plus,
  secondaryAction,
  actions,
}) {
  const ResolvedIcon = PropIcon || getOperationsIcon(title);
  const cleanActionLabel = primaryActionLabel
    ? primaryActionLabel.replace(/^\+\s*/, '')
    : '';

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-4.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          {ResolvedIcon && (
            <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
              <ResolvedIcon className="w-4 h-4 text-[#55132D]" />
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0 self-stretch sm:self-auto justify-start sm:justify-end">
        {actions}
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
