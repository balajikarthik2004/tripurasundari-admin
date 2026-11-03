import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw } from 'lucide-react';

export default function ImageUploadPreview({
  imageUrl,
  onImageChange,
  altText = '',
  onAltTextChange,
  label = 'Content Media / Image',
  recommendedSize = 'Recommended: 1200 × 675 px (16:9 ratio)',
}) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onImageChange(objectUrl, file.name);
    }
  };

  const handleClear = () => {
    onImageChange('/src/assets/images/temple.jpg', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-stone-700">{label}</label>
        <span className="text-[10px] text-stone-400">{recommendedSize}</span>
      </div>

      <div className="relative border border-stone-300 rounded-xl overflow-hidden bg-stone-900 aspect-video max-h-48 flex items-center justify-center group">
        <img
          src={imageUrl || '/src/assets/images/temple.jpg'}
          alt={altText || 'Content Preview'}
          className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-75"
        />

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-white text-stone-900 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 hover:bg-stone-100 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#800000]" />
            Select Local Image
          </button>
          {imageUrl && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Reset to default image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {onAltTextChange && (
        <div>
          <label className="text-[11px] text-stone-500 block mb-0.5">Image Alt Text (Accessibility & SEO):</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => onAltTextChange(e.target.value)}
            placeholder="e.g. Sanctum dome bathed in morning sunlight"
            className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-xs focus:outline-none focus:border-[#800000]"
          />
        </div>
      )}
    </div>
  );
}

