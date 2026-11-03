import React, { useState } from 'react';
import { X, HeartHandshake, CreditCard, Sparkles, User } from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function RecordDonationModal({ isOpen, onClose }) {
  const { devotees, donationCategories, recordDonation } = useDevoteeServices();

  const [formData, setFormData] = useState({
    devoteeId: devotees[0]?.id || '',
    category: donationCategories[0]?.name || 'Nitya Annadanam Trust Fund',
    amount: 5000,
    paymentMode: 'Online / UPI',
    transactionRef: '',
    panNumber: '',
    notes: '',
  });

  if (!isOpen) return null;

  const selectedDevotee = devotees.find((d) => d.id === formData.devoteeId) || devotees[0];
  const selectedCat = donationCategories.find((c) => c.name === formData.category) || donationCategories[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) return;

    recordDonation({
      devoteeId: selectedDevotee.id,
      donorName: selectedDevotee.name,
      mobile: selectedDevotee.mobile,
      email: selectedDevotee.email,
      category: formData.category,
      amount: Number(formData.amount),
      paymentMode: formData.paymentMode,
      transactionRef: formData.transactionRef.trim() || `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
      panNumber: formData.panNumber.trim() || selectedDevotee.idNumber || '',
      notes: formData.notes.trim() || 'Recorded via donation desk counter.',
      paymentStatus: 'Verified',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-[#55132D] to-[#681B37] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-white">Record Temple Donation</h2>
              <p className="text-[11px] text-[#E2BC6B]/90">Official electronic receipt and trust ledger entry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/70 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Select Devotee Donor */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Select Devotee / Donor <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.devoteeId}
              onChange={(e) => setFormData({ ...formData, devoteeId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
            >
              {devotees.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.id}) — {d.city} ({d.mobile})
                </option>
              ))}
            </select>
          </div>

          {/* Donation Category */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Earmarked Donation Category <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
            >
              {donationCategories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            {selectedCat && (
              <p className="text-[11px] text-stone-500 mt-1">{selectedCat.description}</p>
            )}
          </div>

          {/* Amount and Suggested Chips */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Donation Contribution Amount (₹) <span className="text-rose-600">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 font-bold text-sm text-[#55132D]"
            />

            <div className="flex flex-wrap gap-1.5 mt-2">
              {[501, 1100, 2500, 5000, 11000, 25000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setFormData({ ...formData, amount: amt })}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    formData.amount === amt
                      ? 'bg-[#55132D] text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Payment Mode</label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Online / UPI">Online / UPI QR</option>
                <option value="Net Banking">Net Banking / NEFT</option>
                <option value="Debit / Credit Card">Debit / Credit Card POS</option>
                <option value="Cash at Counter">Cash at Counter</option>
                <option value="Bank Cheque / DD">Bank Cheque / DD</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Transaction Ref / Cheque No.</label>
              <input
                type="text"
                placeholder="UPI-123456 / CHQ-123"
                value={formData.transactionRef}
                onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">PAN Card Number (Optional)</label>
            <input
              type="text"
              maxLength={10}
              placeholder="ABCDE1234F"
              value={formData.panNumber}
              onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 uppercase font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Dedication / Seva Notes</label>
            <input
              type="text"
              placeholder="e.g. In memory of family elders; for pilgrim lunch seva"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>
        </form>

        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow"
          >
            Record & Generate Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

