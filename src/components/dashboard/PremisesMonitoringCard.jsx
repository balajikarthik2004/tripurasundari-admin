import React, { useState } from 'react';
import { Camera, Maximize2, AlertCircle } from 'lucide-react';
import { CAMERA_FEEDS } from '../../data/dashboardData';

export default function PremisesMonitoringCard() {
  const [selectedCamId, setSelectedCamId] = useState('CAM-01');
  const [isExpandOpen, setIsExpandOpen] = useState(false);

  const selectedCam = CAMERA_FEEDS.find((c) => c.id === selectedCamId) || CAMERA_FEEDS[0];
  const isOnline = selectedCam.status === 'Online';

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xs p-5 flex flex-col justify-between h-full">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
              Premises Monitoring
            </h3>
          </div>
        </div>

        {/* Video Stream Frame with single small static LIVE dot */}
        <div className="relative rounded-lg overflow-hidden border border-[#E8E2D8] bg-black aspect-video w-full my-2 flex-shrink-0">
          {isOnline ? (
            <video
              key={selectedCam.id}
              autoPlay
              loop
              muted
              playsInline
              src={selectedCam.videoUrl}
              poster="/matabari-premises-1.jpg"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-400 p-4 text-center">
              <AlertCircle className="w-6 h-6 text-red-500 mb-1" />
              <span className="font-semibold text-xs text-white">Camera feed offline</span>
            </div>
          )}

          {/* Corner LIVE Chip: Single small static red dot, no pulse */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[11px] font-medium text-white border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            <span>LIVE</span>
          </div>

          {/* Expand Button */}
          <button
            type="button"
            onClick={() => setIsExpandOpen(true)}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-black/70 hover:bg-[#55132D] text-white transition-colors cursor-pointer"
            title="Expand camera view"
            aria-label="Expand camera view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Camera Selectors (CAM-01 to CAM-04 with clean 2-line layout, zero truncation) */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E8E2D8]">
          {CAMERA_FEEDS.map((cam) => {
            const isSelected = selectedCamId === cam.id;
            return (
              <button
                key={cam.id}
                type="button"
                onClick={() => setSelectedCamId(cam.id)}
                className={`px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#55132D] text-white border-[#55132D] shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-[#E8E2D8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold tracking-wider ${isSelected ? 'text-[#E2BC6B]' : 'text-stone-500'}`}>
                    {cam.id}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'Online' ? (isSelected ? 'bg-emerald-400' : 'bg-emerald-500') : 'bg-stone-400'}`} />
                </div>
                <div className={`text-xs font-semibold leading-tight mt-0.5 truncate ${isSelected ? 'text-white' : 'text-stone-800'}`}>
                  {cam.name || cam.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Modal */}
      {isExpandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-3xl w-full overflow-hidden flex flex-col">
            <div className="px-5 py-3 bg-[#55132D] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#E2BC6B]" />
                <span className="text-sm font-semibold">{selectedCam.label}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpandOpen(false)}
                className="text-stone-300 hover:text-white text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20"
              >
                Close
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                autoPlay
                loop
                muted
                playsInline
                src={selectedCam.videoUrl}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
