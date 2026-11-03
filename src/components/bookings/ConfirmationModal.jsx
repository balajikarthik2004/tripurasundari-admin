import React, { useState } from 'react';
import { AlertTriangle, X, Check, ShieldAlert } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmType = 'primary', // 'primary' | 'danger' | 'warning'
  requireRemarks = false,
  remarksPlaceholder = 'Add administrative notes / reasons...',
  onConfirm,
  onClose,
}) {
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(remarks);
    setRemarks('');
  };

  const getButtonClass = () => {
    switch (confirmType) {
      case 'danger':
        return 'bg-rose-700 hover:bg-rose-800 text-white shadow-xs';
      case 'warning':
        return 'bg-amber-700 hover:bg-amber-800 text-white shadow-xs';
      case 'primary':
      default:
        return 'bg-temple-burgundy hover:bg-temple-maroon text-white shadow-xs';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl border border-[#E8E2D8] shadow-2xl max-w-md w-full p-5 z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                confirmType === 'danger'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : confirmType === 'warning'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-temple-burgundy/10 text-temple-burgundy'
              }`}
            >
              {confirmType === 'danger' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <ShieldAlert className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-temple-burgundy leading-tight">
                {title}
              </h3>
              <p className="text-xs text-temple-text-secondary mt-0.5 leading-snug">
                {message}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Remarks Input */}
        {requireRemarks && (
          <div>
            <label className="text-[11px] font-bold text-temple-text-secondary uppercase tracking-wider block mb-1">
              Administrative Reason / Remarks:
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={remarksPlaceholder}
              rows={3}
              className="w-full text-xs p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] text-temple-text-primary focus:outline-none focus:ring-1 focus:ring-temple-gold focus:border-temple-gold resize-none"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E8E2D8]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${getButtonClass()}`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

