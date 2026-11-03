import React from 'react';

export default function ContentStatusBadge({ status, className = '' }) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Archived':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      case 'Unpublished':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  const getDotStyle = () => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-500';
      case 'Draft':
        return 'bg-amber-500';
      case 'Scheduled':
        return 'bg-blue-500';
      case 'Archived':
        return 'bg-stone-400';
      case 'Unpublished':
        return 'bg-rose-500';
      default:
        return 'bg-stone-400';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBadgeStyle()} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotStyle()}`} />
      {status || 'Draft'}
    </span>
  );
}

