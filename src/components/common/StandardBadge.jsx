import React from 'react';

/**
 * StandardBadge — Global unified status & priority badges
 */
export default function StandardBadge({
  status,
  variant,
  size = 'md',
  className = '',
}) {
  const normalized = (variant || status || '').toLowerCase();

  let styles = 'bg-stone-100 text-stone-700 border-stone-200';

  if (
    normalized.includes('success') ||
    normalized.includes('resolved') ||
    normalized.includes('approved') ||
    normalized.includes('operational') ||
    normalized.includes('checked out') ||
    normalized.includes('completed')
  ) {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (
    normalized.includes('warning') ||
    normalized.includes('pending') ||
    normalized.includes('in progress') ||
    normalized.includes('high') ||
    normalized.includes('preparation') ||
    normalized.includes('partially')
  ) {
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (
    normalized.includes('critical') ||
    normalized.includes('urgent') ||
    normalized.includes('rejected') ||
    normalized.includes('cancelled') ||
    normalized.includes('incident') ||
    normalized.includes('closed')
  ) {
    styles = 'bg-rose-50 text-rose-800 border-rose-200';
  } else if (
    normalized.includes('info') ||
    normalized.includes('checked in') ||
    normalized.includes('vip') ||
    normalized.includes('new')
  ) {
    styles = 'bg-blue-50 text-blue-800 border-blue-200';
  }

  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${sizeClasses} ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      <span>{status}</span>
    </span>
  );
}

