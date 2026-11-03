import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Maximize2, X, AlertCircle } from 'lucide-react';
import { useTempleOperations } from '../../context/TempleOperationsContext';
import { INITIAL_CAMERAS } from '../../data/operations/camerasData';

export default function PremisesMonitoringCard() {
  const navigate = useNavigate();
  const operations = useTempleOperations();
  const camerasList = operations?.cameras || INITIAL_CAMERAS;

  // Selected camera: default to CAM-01
  const [selectedCamId, setSelectedCamId] = useState('CAM-01');
  const [isExpandOpen, setIsExpandOpen] = useState(false);

  // Active camera record
  const selectedCam = camerasList.find((c) => c.id === selectedCamId) || camerasList[0];

  // The 4 primary selector cameras
  const primaryCameraSelectors = [
    { id: 'CAM-01', label: 'Main Courtyard' },
    { id: 'CAM-02', label: 'Temple Approach' },
    { id: 'CAM-03', label: 'Peripheral Area' },
    { id: 'CAM-04', label: 'Facility Area' },
  ];

  const isOnline = selectedCam.status === 'Online';

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle p-4 sm:p-5 flex flex-col justify-between h-full gap-3.5 sm:gap-4">
        {/* Header */}
        <div className="flex items-center gap-2 pb-2.5 border-b border-[#E8E2D8] flex-shrink-0">
          <span className="p-1 rounded-md bg-temple-burgundy/10 text-[#55132D]">
            <Camera className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-heading text-sm font-bold text-[#55132D] tracking-wider uppercase">
              Temple Premises Monitoring
            </h3>
          </div>
        </div>

        {/* Real Temple Video Surveillance Stream Frame (Slightly increased height) */}
        <div className="relative rounded-lg overflow-hidden border border-[#E8E2D8] bg-black aspect-[16/10.5] w-full group shadow-inner flex-shrink-0">
          {isOnline ? (
            <video
              key={selectedCam.id}
              autoPlay
              loop
              muted
              playsInline
              src={selectedCam.videoUrl || '/matabari-cam01.mp4'}
              poster={selectedCam.previewImage || '/matabari-premises-1.jpg'}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-400 p-4 text-center">
              <AlertCircle className="w-8 h-8 text-rose-500 mb-1.5" />
              <span className="font-bold text-xs text-white">CAMERA FEED OFFLINE</span>
              <span className="text-[10.5px] text-stone-400 mt-0.5">Signal paused for maintenance testing</span>
            </div>
          )}

          {/* OSD Overlay Top: LIVE indicator & Camera ID */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[9.5px] font-bold tracking-wider text-white border border-white/20 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>LIVE FEED</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-black/70 text-[9.5px] font-mono font-bold text-[#FFE8A3] border border-white/20">
              {selectedCam.id}
            </span>
          </div>

          {/* Expand Preview Action */}
          <button
            type="button"
            onClick={() => setIsExpandOpen(true)}
            className="absolute top-2 right-2 p-1.5 rounded bg-black/70 hover:bg-[#55132D] text-white transition-all shadow-md focus:outline-none z-10"
            title="Expand Camera Video"
            aria-label="Expand Camera Video"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Camera Selector 2x2 Matrix */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 flex-1">
          {primaryCameraSelectors.map((item) => {
            const camRecord = camerasList.find((c) => c.id === item.id) || {};
            const isSelected = selectedCam.id === item.id;
            const itemOnline = camRecord.status === 'Online';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedCamId(item.id)}
                className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#55132D] bg-[#55132D]/5 shadow-2xs'
                    : 'border-[#E8E2D8] hover:border-stone-400 bg-[#FAF8F5] text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      isSelected ? 'text-[#55132D]' : 'text-stone-600'
                    }`}
                  >
                    {item.id}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-stone-500">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        itemOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
                      }`}
                    />
                    <span className="hidden sm:inline font-mono">{itemOnline ? 'LIVE' : 'OFFLINE'}</span>
                  </span>
                </div>

                <div>
                  <div
                    className={`text-xs font-bold truncate leading-tight ${
                      isSelected ? 'text-[#55132D]' : 'text-stone-900'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate mt-0.5">
                    {camRecord.zoneName?.split('&')[0]?.trim() || item.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Real Video Stream Modal */}
      {isExpandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-3xl w-full overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#E2BC6B]" />
                <div>
                  <h4 className="font-heading text-sm font-bold uppercase tracking-wider">
                    {selectedCam.id} • {selectedCam.name}
                  </h4>
                  <span className="text-[10px] text-white/80 font-mono">
                    {selectedCam.zoneName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsExpandOpen(false);
                    navigate('/cctv-monitoring');
                  }}
                  className="px-2.5 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                >
                  Open Full CCTV Console
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpandOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Feed in Modal (16:9) */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {isOnline ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={selectedCam.videoUrl || '/matabari-cam01.mp4'}
                  poster={selectedCam.previewImage || '/matabari-premises-1.jpg'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-stone-400">
                  <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                  <p className="font-bold text-white">FEED CURRENTLY OFFLINE</p>
                </div>
              )}

              {/* Live Tag in Modal */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-black/80 text-[10px] font-bold text-white border border-white/20 flex items-center gap-1.5 uppercase">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  LIVE STREAM
                </span>
                <span className="px-2 py-1 rounded bg-black/70 text-[10px] font-mono text-[#FFE8A3] border border-white/20">
                  {selectedCam.resolution || '1080p FHD Real Feed'}
                </span>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-4">
                <span>
                  <strong>Lens:</strong> {selectedCam.lensType || 'Standard Fixed'}
                </span>
                <span>
                  <strong>Last Verified:</strong> {selectedCam.snapshotTimestamp}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpandOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#55132D] text-white font-semibold hover:bg-[#6e193b] transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
