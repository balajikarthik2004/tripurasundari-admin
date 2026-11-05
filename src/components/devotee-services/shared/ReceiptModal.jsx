import OverlayPortal from '../../common/OverlayPortal';
import React, { useRef } from 'react';
import { X, Printer, ShieldCheck, Download } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, receiptData }) {
  const receiptRef = useRef(null);

  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <OverlayPortal isOpen={true} onClose={onClose}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#55132D]" />
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Temple Administrative Voucher / Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 text-xs font-bold text-[#55132D] bg-white hover:bg-stone-50 border border-stone-300 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div ref={receiptRef} className="p-6 bg-white overflow-y-auto space-y-4 text-stone-800">
          {/* Temple Letterhead */}
          <div className="text-center pb-4 border-b-2 border-[#55132D]">
            <div className="text-xs font-semibold text-[#B68A36] uppercase tracking-widest mb-0.5">
              ॥ श्री श्री माता त्रिपुर सुन्दरी ट्रस्ट ॥
            </div>
            <h2 className="text-lg font-bold font-serif text-[#55132D]">
              Mata Tripura Sundari Temple Trust
            </h2>
            <p className="text-[11px] text-stone-500">
              Matabari, Udaipur, Gomati District, Tripura — 799114 • Sacred Shakti Peetha
            </p>
            <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-800 uppercase border border-emerald-200">
              OFFICIAL TRUST RECEIPT VOUCHER
            </div>
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#F8F5EF] p-3 rounded-xl border border-[#B68A36]/30">
            <div>
              <span className="text-[11px] text-stone-500 block">Receipt Number:</span>
              <span className="font-mono font-bold text-[#55132D]">{receiptData.receiptNumber || 'REC-2026-8812'}</span>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">Date & Time:</span>
              <span className="font-medium text-stone-800">{receiptData.date || new Date().toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">Transaction Reference:</span>
              <span className="font-mono text-[11px] text-stone-700">{receiptData.transactionRef || 'TXN-984210984'}</span>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">Payment Mode:</span>
              <span className="font-medium text-stone-800">{receiptData.paymentMode || 'Verified Online Transfer'}</span>
            </div>
          </div>

          {/* Donor / Devotee Details */}
          <div className="space-y-1.5 text-xs py-2 border-b border-stone-100">
            <div className="flex justify-between">
              <span className="text-stone-500">Received With Thanks From:</span>
              <span className="font-bold text-stone-900">{receiptData.donorName || receiptData.devoteeName}</span>
            </div>
            {receiptData.devoteeId && (
              <div className="flex justify-between">
                <span className="text-stone-500">Devotee ID:</span>
                <span className="font-mono font-semibold text-stone-700">{receiptData.devoteeId}</span>
              </div>
            )}
            {receiptData.mobile && (
              <div className="flex justify-between">
                <span className="text-stone-500">Contact Mobile:</span>
                <span className="text-stone-700">{receiptData.mobile}</span>
              </div>
            )}
            {receiptData.panNumber && (
              <div className="flex justify-between">
                <span className="text-stone-500">PAN Number:</span>
                <span className="font-mono text-stone-700">{receiptData.panNumber}</span>
              </div>
            )}
          </div>

          {/* Purpose & Amount */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
            <div className="flex justify-between items-start text-xs">
              <div>
                <span className="font-bold text-stone-900 block">{receiptData.category || receiptData.serviceName || 'General Contribution'}</span>
                <span className="text-[11px] text-stone-500">{receiptData.notes || 'For Mata Tripura Sundari Sacred Seva & Trust Welfare'}</span>
              </div>
              <span className="text-base font-bold text-[#55132D] whitespace-nowrap">
                ₹{Number(receiptData.amount || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Verification Stamp & Notice */}
          <div className="pt-3 flex items-center justify-between text-[11px] text-stone-400">
            <div>
              <p className="font-semibold text-stone-700">Authorised Signatory</p>
              <p>Mata Tripura Sundari Trust Desk</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-1 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                ✓ VERIFIED & RECORDED
              </span>
            </div>
          </div>

          <div className="text-[10px] text-stone-400 text-center pt-2 border-t border-stone-100">
            This administrative acknowledgement is generated by Mata Tripura Sundari Shrine Board computerized billing system.
          </div>
        </div>
      </div>
    </div>
    </OverlayPortal>
  );
}

