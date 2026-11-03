import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-[#E8E2D8] shadow-card p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[#55132D]/10 text-temple-burgundy mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="text-xs font-bold text-temple-gold uppercase tracking-wider mb-1">
          Error 404
        </div>
        <h1 className="text-2xl font-serif font-bold text-temple-burgundy mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-temple-text-secondary mb-6">
          The requested administrative module or page does not exist within the Mata Tripura Sundari Temple Portal.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-temple-burgundy text-white hover:bg-temple-maroon text-sm font-semibold transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

