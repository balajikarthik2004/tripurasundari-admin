import React from 'react';
import { X, CheckCircle2, Printer, ShieldCheck, Clock, User, Phone, Mail, FileText, IndianRupee } from 'lucide-react';
import { formatCurrency, getStatusBadgeStyle } from '../../utils/formatters';

export default function ActivityDetailDrawer({ item, isOpen, onClose }) {
  if (!isOpen || !item) return null;

  const badgeStyle = getStatusBadgeStyle(item.status);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F5EF] border-l border-[#E8E2D8] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#E8E2D8] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-temple-gold">
                  Administrative Record Details
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                  {item.refId}
                </span>
              </div>
              <h2 className="font-heading text-lg font-bold text-temple-burgundy mt-0.5">
                {item.service}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Status & Amount Hero Card */}
            <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] text-temple-text-muted block">Transaction Amount</span>
                <div className="text-2xl font-number font-bold text-temple-burgundy mt-0.5">
                  {formatCurrency(item.amount)}
                </div>
                <span className="text-[10px] text-temple-text-secondary mt-0.5 block">
                  Mode: {item.paymentMode}
                </span>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                  {item.status}
                </span>
                <span className="text-[10px] text-temple-text-muted block mt-1">
                  Recorded at {item.time}
                </span>
              </div>
            </div>

            {/* Devotee Info Card */}
            <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] shadow-subtle space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-temple-burgundy flex items-center gap-1.5">
                <User className="w-4 h-4 text-temple-gold" />
                <span>Devotee Information</span>
              </h3>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-temple-text-secondary">Full Name:</span>
                  <span className="font-semibold text-temple-text-primary">{item.devotee}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-temple-text-secondary">Contact Phone:</span>
                  <span className="font-mono text-temple-text-primary">{item.phone}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-temple-text-secondary">Email Address:</span>
                  <span className="text-temple-text-primary">{item.email}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-temple-text-secondary">Pilgrim Count:</span>
                  <span className="font-semibold text-temple-text-primary">{item.pilgrimsCount} Persons</span>
                </div>
              </div>
            </div>

            {/* Service & Operational Slot */}
            <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] shadow-subtle space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-temple-burgundy flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-temple-gold" />
                <span>Slot & Checkpoint Details</span>
              </h3>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-temple-text-secondary">Allocated Slot:</span>
                  <span className="font-medium text-temple-text-primary">{item.slot}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-temple-text-secondary">Assigned Gate:</span>
                  <span className="font-semibold text-temple-burgundy">{item.gateAssigned}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-temple-text-secondary">Service Category:</span>
                  <span className="font-medium text-temple-gold">{item.type}</span>
                </div>
              </div>
            </div>

            {/* Notes / Special Requests */}
            {item.notes && (
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EDE7DC] text-xs">
                <div className="flex items-center gap-1.5 font-bold text-temple-text-primary mb-1">
                  <FileText className="w-3.5 h-3.5 text-temple-gold" />
                  <span>Special Request / Notes</span>
                </div>
                <p className="text-temple-text-secondary italic">
                  &ldquo;{item.notes}&rdquo;
                </p>
              </div>
            )}

            <div className="text-[10px] text-temple-text-muted text-center pt-2">
              Official Temple Administration Entry · 256-bit TLS Encrypted
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-white border-t border-[#E8E2D8] flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert(`Printing verified pass for ${item.refId}...`)}
              className="flex-1 py-2 px-3 rounded-lg bg-temple-burgundy text-white hover:bg-temple-maroon text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Gate Pass</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

