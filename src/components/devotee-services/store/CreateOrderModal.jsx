import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Trash2 } from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function CreateOrderModal({ isOpen, onClose }) {
  const { devotees, products, createOrder } = useDevoteeServices();
  const availableProducts = products.filter((p) => p.status === 'active' && p.stock > 0);

  const [formData, setFormData] = useState({
    devoteeId: devotees[0]?.id || '',
    items: [{ productId: availableProducts[0]?.id || '', quantity: 1 }],
    fulfilmentMethod: 'Counter Pickup',
    paymentMode: 'Cash at Counter',
    notes: '',
  });

  if (!isOpen) return null;

  const selectedDevotee = devotees.find((d) => d.id === formData.devoteeId) || devotees[0];

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: availableProducts[0]?.id || '', quantity: 1 }],
    });
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    setFormData({ ...formData, items: updated });
  };

  // Calculate items with details and total
  const populatedItems = formData.items.map((it) => {
    const prod = products.find((p) => p.id === it.productId);
    const unitPrice = prod?.price || 0;
    const quantity = Number(it.quantity) || 1;
    return {
      productId: it.productId,
      productName: prod?.name || 'Selected Item',
      quantity,
      unitPrice,
      total: unitPrice * quantity,
      maxStock: prod?.stock || 0,
    };
  });

  const totalAmount = populatedItems.reduce((sum, i) => sum + i.total, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (populatedItems.length === 0 || totalAmount <= 0) return;

    createOrder({
      devoteeId: selectedDevotee.id,
      devoteeName: selectedDevotee.name,
      mobile: selectedDevotee.mobile,
      items: populatedItems,
      totalAmount,
      fulfilmentMethod: formData.fulfilmentMethod,
      paymentStatus: 'Paid',
      paymentMode: formData.paymentMode,
      orderStatus: 'Ready',
      notes: formData.notes.trim() || 'Counter fulfillment',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-[#55132D] to-[#681B37] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-white">Create Prasad & Store Order</h2>
              <p className="text-[11px] text-[#E2BC6B]/90">Instant counter billing & inventory deduction</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/70 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Select Devotee */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Select Devotee <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.devoteeId}
              onChange={(e) => setFormData({ ...formData, devoteeId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
            >
              {devotees.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.id}) — {d.city}
                </option>
              ))}
            </select>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-stone-700">Order Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[11px] font-bold text-[#55132D] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {formData.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                  className="flex-1 text-xs px-2 py-1.5 rounded border border-stone-200 bg-white"
                >
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price} • In Stock: {p.stock})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  max="50"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  className="w-16 text-xs px-2 py-1.5 rounded border border-stone-200 text-center"
                />

                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Total Bar */}
          <div className="p-3 bg-[#F8F5EF] rounded-xl border border-[#B68A36]/30 flex items-center justify-between">
            <span className="font-bold text-stone-800">Total Calculated Amount:</span>
            <span className="text-base font-bold text-[#55132D] font-serif">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Fulfilment Method</label>
              <select
                value={formData.fulfilmentMethod}
                onChange={(e) => setFormData({ ...formData, fulfilmentMethod: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Counter Pickup">Counter Pickup</option>
                <option value="Postal Delivery">Postal Delivery</option>
                <option value="Temple Sanctum Delivery">Temple Sanctum Delivery</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Payment Mode</label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Cash at Counter">Cash at Counter</option>
                <option value="UPI">UPI QR Scan</option>
                <option value="Card Swipe">Debit / Credit Card</option>
              </select>
            </div>
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
            Complete Order & Issue Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

