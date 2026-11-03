import React from 'react';
import { CheckCircle2, AlertTriangle, Edit3 } from 'lucide-react';

export default function VerificationBadge({ status, className = '' }) {
  if (status === 'Verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 ${className}`}
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Verified
      </span>
    );
  }

  if (status === 'Requires Review') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
      >
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        Requires Review
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200 ${className}`}
    >
      <Edit3 className="w-3 h-3 text-stone-500" />
      Draft / Unverified
    </span>
  );
}

