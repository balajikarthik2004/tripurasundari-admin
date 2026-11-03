import React, { useState, useEffect } from 'react';
import { X, Flame, Save } from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function PoojaServiceModal({ isOpen, onClose, editingService = null }) {
  const { addPoojaService, updatePoojaService } = useDevoteeServices();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Vedic Havan',
    deity: 'Mata Tripura Sundari (Matabari)',
    description: '',
    amount: 1100,
    duration: '60 mins',
    bookingRequirement: 'Advance 24h booking required',
    maxParticipants: 4,
    availability: 'Daily',
    instructions: 'Devotees should arrive in traditional attire at least 20 minutes before sankalpam.',
    status: 'active',
  });

  useEffect(() => {
    if (editingService) {
      setFormData({
        name: editingService.name || '',
        category: editingService.category || 'Vedic Havan',
        deity: editingService.deity || 'Mata Tripura Sundari (Matabari)',
        description: editingService.description || '',
        amount: editingService.amount || 0,
        duration: editingService.duration || '60 mins',
        bookingRequirement: editingService.bookingRequirement || 'Advance booking required',
        maxParticipants: editingService.maxParticipants || 4,
        availability: editingService.availability || 'Daily',
        instructions: editingService.instructions || '',
        status: editingService.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        category: 'Vedic Havan',
        deity: 'Mata Tripura Sundari (Matabari)',
        description: '',
        amount: 1100,
        duration: '60 mins',
        bookingRequirement: 'Advance 24h booking required',
        maxParticipants: 4,
        availability: 'Daily',
        instructions: 'Devotees should arrive in traditional attire at least 20 minutes before sankalpam.',
        status: 'active',
      });
    }
  }, [editingService, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      ...formData,
      amount: Number(formData.amount) || 0,
      maxParticipants: Number(formData.maxParticipants) || 1,
    };

    if (editingService) {
      updatePoojaService(editingService.id, payload);
    } else {
      addPoojaService(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-white">
                {editingService ? 'Edit Pooja / Seva Service' : 'Add New Pooja Service'}
              </h2>
              <p className="text-[11px] text-[#E2BC6B]/90">Configurable ritual parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Ritual / Service Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Navagraha Shanti & Chandi Path"
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
                <option value="Vedic Havan">Vedic Havan</option>
                <option value="Archana">Archana</option>
                <option value="Abhishekam">Abhishekam</option>
                <option value="Special Ritual">Special Ritual</option>
                <option value="Daily Seva">Daily Seva</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Configured Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Estimated Duration</label>
              <input
                type="text"
                placeholder="e.g. 60 mins"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Max Devotee Participants</label>
              <input
                type="number"
                min="1"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Significance and scriptural background..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Devotee Guidelines / Instructions</label>
            <input
              type="text"
              placeholder="e.g. Arrive 20m early in traditional attire..."
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
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
            <span>{editingService ? 'Save Changes' : 'Create Service'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

