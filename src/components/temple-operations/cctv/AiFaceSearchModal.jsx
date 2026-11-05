import OverlayPortal from '../../common/OverlayPortal';
import React, { useState, useMemo, useRef } from 'react';
import {
  Upload,
  Camera,
  X,
  MapPin,
  Clock,
  CheckCircle2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

export default function AiFaceSearchModal({
  isOpen,
  onClose,
  cameras = [],
  onSelectCamera,
}) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedPresetId, setSelectedPresetId] = useState('preset-1');
  const [isSearching, setIsSearching] = useState(false);

  const fileInputRef = useRef(null);

  // Clean, realistic preset sample devotees
  const PRESET_SUBJECTS = useMemo(
    () => [
      {
        id: 'preset-1',
        name: 'Ramesh Kumar',
        desc: 'Special Darshan Devotee',
        avatar: '/matabari-premises-1.jpg',
        matchedCameras: [
          {
            cameraId: 'CAM-01',
            cameraName: 'CAM 01 — Main Courtyard',
            location: 'Inner Sanctum portico',
            timestamp: '10:28 AM (Just now)',
            image: '/matabari-premises-1.jpg',
            box: { top: '34%', left: '44%', width: '15%', height: '20%' },
          },
          {
            cameraId: 'CAM-04',
            cameraName: 'CAM 04 — Facility Area',
            location: 'Footwear & shelter walkway',
            timestamp: '10:21 AM (7 mins ago)',
            image: '/matabari-facade.jpg',
            box: { top: '48%', left: '52%', width: '14%', height: '18%' },
          },
          {
            cameraId: 'CAM-02',
            cameraName: 'CAM 02 — Temple Approach',
            location: 'Main entrance archway',
            timestamp: '10:14 AM (14 mins ago)',
            image: '/matabari-premises-2.jpg',
            box: { top: '42%', left: '38%', width: '14%', height: '18%' },
          },
        ],
      },
      {
        id: 'preset-2',
        name: 'Aarav Sharma (Child, Age 7)',
        desc: 'Reported Missing by Parents',
        avatar: '/matabari-lake.jpg',
        matchedCameras: [
          {
            cameraId: 'CAM-05',
            cameraName: 'CAM 05 — Kalyansagar Bank',
            location: 'Stepped Ghat turtle feeding area',
            timestamp: '10:28 AM (Just now)',
            image: '/matabari-lake.jpg',
            box: { top: '50%', left: '56%', width: '15%', height: '20%' },
          },
          {
            cameraId: 'CAM-03',
            cameraName: 'CAM 03 — Peripheral Area',
            location: 'East parikrama pathway',
            timestamp: '10:18 AM (10 mins ago)',
            image: '/matabari-approach.jpg',
            box: { top: '43%', left: '45%', width: '13%', height: '17%' },
          },
        ],
      },
      {
        id: 'preset-3',
        name: 'Subhashree Roy',
        desc: 'Devotee (Token DRSN-2026-1006)',
        avatar: '/matabari-facade.jpg',
        matchedCameras: [
          {
            cameraId: 'CAM-01',
            cameraName: 'CAM 01 — Main Courtyard',
            location: 'Special queue bay',
            timestamp: '10:28 AM (Just now)',
            image: '/matabari-premises-1.jpg',
            box: { top: '38%', left: '48%', width: '14%', height: '18%' },
          },
          {
            cameraId: 'CAM-02',
            cameraName: 'CAM 02 — Temple Approach',
            location: 'West Torana entry turnstile',
            timestamp: '10:12 AM (16 mins ago)',
            image: '/matabari-premises-2.jpg',
            box: { top: '44%', left: '42%', width: '14%', height: '18%' },
          },
        ],
      },
    ],
    []
  );

  // Active subject
  const currentSubject = useMemo(() => {
    if (uploadedImage) {
      return {
        id: 'custom-upload',
        name: 'Uploaded Photo',
        desc: 'Custom search photo',
        avatar: uploadedImage,
        matchedCameras: [
          {
            cameraId: 'CAM-01',
            cameraName: 'CAM 01 — Main Courtyard',
            location: 'Main Sanctum walkway',
            timestamp: '10:28 AM (Live)',
            image: '/matabari-premises-1.jpg',
            box: { top: '35%', left: '45%', width: '15%', height: '19%' },
          },
          {
            cameraId: 'CAM-02',
            cameraName: 'CAM 02 — Temple Approach',
            location: 'Main approach archway',
            timestamp: '10:16 AM (12 mins ago)',
            image: '/matabari-premises-2.jpg',
            box: { top: '43%', left: '39%', width: '14%', height: '18%' },
          },
        ],
      };
    }
    return PRESET_SUBJECTS.find((p) => p.id === selectedPresetId) || PRESET_SUBJECTS[0];
  }, [uploadedImage, selectedPresetId, PRESET_SUBJECTS]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result);
        setSelectedPresetId(null);
        triggerBriefSearch();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerBriefSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 450);
  };

  const handleSelectPreset = (preset) => {
    setUploadedImage(null);
    setSelectedPresetId(preset.id);
    triggerBriefSearch();
  };

  if (!isOpen) return null;

  return (
    <OverlayPortal isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-[9999] bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Simple & Clean Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between gap-4 bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#55132D] text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5 text-[#E2BC6B]" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-stone-900">
                AI Face Search Across Cameras
              </h2>
              <p className="text-xs text-stone-500">
                Upload a photo to see every camera feed where this person was spotted.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Upload & Sample Selection (4 cols) */}
          <div className="md:col-span-4 space-y-4 flex flex-col">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Photo Preview / Upload Dropzone */}
            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/60 flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-xl overflow-hidden border border-stone-300 shadow-sm relative group bg-stone-200">
                <img
                  src={currentSubject.avatar}
                  alt={currentSubject.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white text-xs font-semibold transition-opacity"
                >
                  <Upload className="w-4 h-4 text-white" />
                  <span>Change</span>
                </button>
              </div>

              <div className="mt-3 w-full">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Or Try Sample Photo:
              </span>
              <div className="space-y-1.5">
                {PRESET_SUBJECTS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id && !uploadedImage;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-[#55132D]/10 border-[#55132D] text-[#55132D]'
                          : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <img
                        src={preset.avatar}
                        alt={preset.name}
                        className="w-8 h-8 rounded-md object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate">{preset.name}</div>
                        <div className="text-[10.5px] text-stone-500 truncate">{preset.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Clean Matched Camera Results (8 cols) */}
          <div className="md:col-span-8 space-y-4">
            {/* Status bar */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-stone-900">
                  {isSearching
                    ? 'Scanning cameras...'
                    : `Found in ${currentSubject.matchedCameras.length} Camera Feed${
                        currentSubject.matchedCameras.length > 1 ? 's' : ''
                      }`}
                </span>
              </div>
              <span className="text-xs font-semibold text-stone-500">
                Searching for: <strong className="text-stone-800">{currentSubject.name}</strong>
              </span>
            </div>

            {/* Scanning Indicator or Camera Grid */}
            {isSearching ? (
              <div className="py-20 text-center text-stone-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#55132D] mx-auto" />
                <p className="text-xs font-medium">Scanning live feeds...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentSubject.matchedCameras.map((match) => (
                  <div
                    key={match.cameraId}
                    className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:border-[#B68A36] transition-colors flex flex-col justify-between"
                  >
                    {/* Camera Feed Image with Neat Person Box */}
                    <div className="relative aspect-video bg-stone-900 overflow-hidden">
                      <img
                        src={match.image}
                        alt={match.cameraName}
                        className="w-full h-full object-cover"
                      />

                      {/* Clean bounding highlight */}
                      <div
                        className="absolute border-2 border-[#E2BC6B] bg-[#E2BC6B]/15 rounded-xs pointer-events-none"
                        style={{
                          top: match.box.top,
                          left: match.box.left,
                          width: match.box.width,
                          height: match.box.height,
                        }}
                      >
                        <span className="absolute -top-4 left-0 bg-[#55132D] text-white text-[9px] font-bold px-1 rounded-xs whitespace-nowrap shadow-xs">
                          {currentSubject.name.split(' ')[0]}
                        </span>
                      </div>

                      {/* Clean Camera Tag */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold">
                        {match.cameraName.split('—')[0].trim()}
                      </span>

                      {/* Time Tag */}
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-stone-300 text-[10px] flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#E2BC6B]" />
                        {match.timestamp}
                      </span>
                    </div>

                    {/* Camera Info & Open Button */}
                    <div className="p-3 space-y-2">
                      <div>
                        <div className="font-bold text-xs text-stone-900 truncate">
                          {match.cameraName}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-[#B68A36] flex-shrink-0" />
                          <span className="truncate">{match.location}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const targetCam = cameras.find((c) => c.id === match.cameraId);
                          if (targetCam) {
                            onSelectCamera(targetCam);
                            onClose();
                          }
                        }}
                        className="w-full py-1.5 px-3 bg-stone-100 hover:bg-[#55132D] hover:text-white text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>View Camera Feed</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clean Footer */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Upload any face portrait to quickly locate devotees or lost persons across premises.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 font-semibold text-stone-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </OverlayPortal>
  );
}
