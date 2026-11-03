import React, { useState, useEffect } from 'react';
import { X, Package, Save } from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function ProductModal({ isOpen, onClose, editingProduct = null }) {
  const { addProduct, updateProduct } = useDevoteeServices();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Prasad',
    description: '',
    price: 150,
    stock: 50,
    unit: 'Pack',
    threshold: 20,
    status: 'active',
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || 'Prasad',
        description: editingProduct.description || '',
        price: editingProduct.price || 0,
        stock: editingProduct.stock || 0,
        unit: editingProduct.unit || 'Pack',
        threshold: editingProduct.threshold || 20,
        status: editingProduct.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        category: 'Prasad',
        description: '',
        price: 150,
        stock: 50,
        unit: 'Pack',
        threshold: 20,
        status: 'active',
      });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0,
        threshold: Number(formData.threshold) || 10,
      });
    } else {
      addProduct(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-white">
                {editingProduct ? 'Edit Store Product' : 'Add New Product'}
              </h2>
              <p className="text-[11px] text-[#E2BC6B]/90">Prasad and sacred article inventory</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Product Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Special Matabari Peda Box"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Prasad">Prasad</option>
                <option value="Puja Articles">Puja Articles</option>
                <option value="Souvenirs">Souvenirs</option>
                <option value="Publications">Publications</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Unit of Measure</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Pack">Pack</option>
                <option value="Box">Box</option>
                <option value="Bottle">Bottle</option>
                <option value="Set">Set</option>
                <option value="Piece">Piece</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Initial Stock</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Reorder Alert</label>
              <input
                type="number"
                min="0"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Preparation ingredients and sacred details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>
        </form>

        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

