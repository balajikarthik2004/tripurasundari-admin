import React, { useState } from 'react';
import { X, Video, Save } from 'lucide-react';
import { useTempleOperations } from '../../../context/TempleOperationsContext';

export default function AddCameraModal({ isOpen, onClose }) {
  const { zones, addCamera } = useTempleOperations();

  const [formData, setFormData] = useState({
    name: '',
    zoneId: zones[0]?.id || '',
    type: 'Dome PTZ (Night Vision)',
    resolution: '1080p FHD IP Feed',
  });

  if (!isOpen) return null;

  const selectedZone = zones.find((z) => z.id === formData.zoneId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addCamera({
      ...formData,
      zoneName: selectedZone ? selectedZone.name : 'General Area',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#E2BC6B]" />
            <h2 className="text-sm font-bold font-serif text-white">Add Monitoring Camera</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Camera Name / Location <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. West Torana Outer Barricade"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Associated Zone</label>
            <select
              value={formData.zoneId}
              onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Hardware / Optical Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
            >
              <option value="Dome PTZ (Night Vision)">Dome PTZ (Night Vision)</option>
              <option value="Bullet 4K Fixed">Bullet 4K Fixed</option>
              <option value="Wide Angle Dome">Wide Angle Dome</option>
              <option value="High-Mast 360 Long-Range">High-Mast 360 Long-Range</option>
              <option value="Weatherproof Outdoor Bullet">Weatherproof Outdoor Bullet</option>
            </select>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Register Camera</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

