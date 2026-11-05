import OverlayPortal from '../../common/OverlayPortal';
import React, { useState } from 'react';
import { X, RefreshCw, Save } from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function AdjustStockModal({ isOpen, onClose, product = null }) {
  const { adjustStock } = useDevoteeServices();

  const [delta, setDelta] = useState(20);
  const [reason, setReason] = useState('Fresh kitchen consignment received');
  const [recordedBy, setRecordedBy] = useState('Store Supervisor');

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    adjustStock(product.id, Number(delta), reason, recordedBy);
    onClose();
  };

  return (
    <OverlayPortal isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#E2BC6B]" />
            <h2 className="text-sm font-bold font-serif text-white">Adjust Product Stock</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <span className="text-stone-500 block">Product:</span>
            <strong className="text-sm font-bold text-stone-900 block">{product.name}</strong>
            <span className="text-[11px] text-stone-500">Current Stock: {product.stock} {product.unit}s</span>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Quantity Change (+ to Add, - to Deduct)
            </label>
            <input
              type="number"
              required
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Reason for Adjustment</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Authorized Person</label>
            <input
              type="text"
              required
              value={recordedBy}
              onChange={(e) => setRecordedBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow"
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
    </OverlayPortal>
  );
}

