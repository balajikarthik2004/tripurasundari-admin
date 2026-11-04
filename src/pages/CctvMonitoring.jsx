import React, { useState, useMemo } from 'react';
import {
  Camera,
  AlertTriangle,
  ShieldCheck,
  Maximize2,
  X,
  Filter,
  Search,
  Plus,
  Radio,
  Clock,
  MapPin,
  Save,
  CheckCircle2,
  User,
  ShieldAlert,
  ArrowRight,
  FileText,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Sparkles,
  Scan,
} from 'lucide-react';
import { useTempleOperations } from '../context/TempleOperationsContext';
import OperationsPageHeader from '../components/temple-operations/shared/OperationsPageHeader';
import AddCameraModal from '../components/temple-operations/cctv/AddCameraModal';
import AiFaceSearchModal from '../components/temple-operations/cctv/AiFaceSearchModal';

export default function CctvMonitoring() {
  const {
    cameras,
    toggleCameraStatus,
    updateCameraRemarks,
    incidents,
    createIncident,
    updateIncident,
    updateIncidentStatus,
    staff,
  } = useTempleOperations();

  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiFaceSearchOpen, setIsAiFaceSearchOpen] = useState(false);
  const [selectedCameraForDrawer, setSelectedCameraForDrawer] = useState(null);

  // New incident form state inside drawer
  const [isCreatingIncident, setIsCreatingIncident] = useState(false);
  const [newIncidentForm, setNewIncidentForm] = useState({
    category: 'Crowd Congestion',
    severity: 'Medium',
    description: '',
    assignedStaffId: staff[0]?.id || '',
    remarks: '',
  });

  // Camera administrative remarks local edit state
  const [cameraRemarksEdit, setCameraRemarksEdit] = useState('');

  // Keep selected camera in sync with context
  const activeCamera = useMemo(() => {
    if (!selectedCameraForDrawer) return null;
    return cameras.find((c) => c.id === selectedCameraForDrawer.id) || selectedCameraForDrawer;
  }, [cameras, selectedCameraForDrawer]);

  // Open drawer handler
  const handleOpenDrawer = (cam) => {
    setSelectedCameraForDrawer(cam);
    setCameraRemarksEdit(cam.remarks || '');
    setIsCreatingIncident(false);
  };

  // Metrics (computed from configured camera records)
  const onlineCount = useMemo(() => cameras.filter((c) => c.status === 'Online').length, [cameras]);
  const offlineCount = cameras.length - onlineCount;
  const activeIncidents = useMemo(() => incidents.filter((i) => i.status !== 'Resolved' && i.status !== 'Closed'), [incidents]);

  // Distinct configured zones
  const distinctZones = useMemo(() => {
    const map = new Map();
    cameras.forEach((c) => {
      if (c.zoneId && c.zoneName) {
        map.set(c.zoneId, c.zoneName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [cameras]);

  // Filtered cameras list
  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) => {
      const matchZone = selectedZoneFilter === 'ALL' || cam.zoneId === selectedZoneFilter;
      const matchStatus = selectedStatusFilter === 'ALL' || cam.status === selectedStatusFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        cam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cam.zoneName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchZone && matchStatus && matchSearch;
    });
  }, [cameras, selectedZoneFilter, selectedStatusFilter, searchQuery]);

  // Incidents tied to active camera in drawer
  const cameraIncidents = useMemo(() => {
    if (!activeCamera) return [];
    return incidents.filter((inc) => inc.cameraId === activeCamera.id);
  }, [incidents, activeCamera]);

  // Handle saving camera remarks
  const handleSaveCameraRemarks = (e) => {
    e.preventDefault();
    if (activeCamera) {
      updateCameraRemarks(activeCamera.id, cameraRemarksEdit);
    }
  };

  // Handle creating sample incident
  const handleCreateSampleIncident = (e) => {
    e.preventDefault();
    if (!activeCamera || !newIncidentForm.description.trim()) return;

    const assignedStaffObj = staff.find((s) => s.id === newIncidentForm.assignedStaffId) || staff[0];

    createIncident({
      cameraId: activeCamera.id,
      cameraName: activeCamera.name,
      zoneId: activeCamera.zoneId,
      zoneName: activeCamera.zoneName,
      category: newIncidentForm.category,
      severity: newIncidentForm.severity,
      description: newIncidentForm.description,
      assignedStaffId: assignedStaffObj?.id || 'STF-101',
      assignedStaffName: assignedStaffObj?.name || 'Staff In-charge',
      remarks: newIncidentForm.remarks || 'Logged from CCTV camera inspection desk.',
      status: 'Open',
    });

    setNewIncidentForm({
      category: 'Crowd Congestion',
      severity: 'Medium',
      description: '',
      assignedStaffId: staff[0]?.id || '',
      remarks: '',
    });
    setIsCreatingIncident(false);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. ONE HEADING CARD */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
            CCTV &amp; Premises Monitoring
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time IP surveillance feeds across sanctum sanctorum, parikrama corridor, and campus perimeter
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#E2BC6B]" />
          <span>Register Camera</span>
        </button>
      </div>

      {/* 2. ONE CONTROL CENTER */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Top Telemetry Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-serif font-bold text-sm text-stone-900">
                Surveillance Command Center
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                24/7 Live Monitoring
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-600">
              <span className="font-bold text-stone-900">{cameras.length} Feeds</span>
              <span className="text-stone-300">•</span>
              <span className="text-emerald-700 font-semibold">{onlineCount} Online</span>
              {offlineCount > 0 && (
                <>
                  <span className="text-stone-300">•</span>
                  <span className="text-rose-600 font-semibold">{offlineCount} Offline</span>
                </>
              )}
            </div>

            <button
              onClick={() => setIsAiFaceSearchOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Scan className="w-3.5 h-3.5 text-[#55132D]" />
              <span>AI Face Search</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search camera ID (CAM-...) or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#55132D]"
              />
            </div>

            {/* Zone Filter */}
            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#55132D]"
            >
              <option value="ALL">All Campus Zones</option>
              {distinctZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#55132D]"
            >
              <option value="ALL">All Feeds ({cameras.length})</option>
              <option value="Online">Online Feeds ({onlineCount})</option>
              <option value="Offline">Offline Feeds ({offlineCount})</option>
            </select>
          </div>

          {/* Counter & Reset */}
          <div className="flex items-center justify-between lg:justify-end gap-2 text-stone-500 text-xs font-medium shrink-0">
            <span>Showing <strong>{filteredCameras.length}</strong> of {cameras.length} feeds</span>
            {filteredCameras.length !== cameras.length && (
              <button
                type="button"
                onClick={() => {
                  setSelectedStatusFilter('ALL');
                  setSelectedZoneFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-[#55132D] font-bold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. ONE MATRIX (CCTV Video Wall Matrix) */}
      <div className="bg-white rounded-2xl p-5 shadow-2xs border border-stone-200/90 space-y-4">
        {/* Matrix Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-150 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-serif font-bold text-stone-900 text-sm tracking-tight">
              Live Surveillance Matrix
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500 font-medium">{filteredCameras.length} Active Feeds</span>
          </div>
          <span className="text-[11.5px] text-stone-400 hidden sm:inline">
            Click any feed for high-res inspection &amp; incident dispatch
          </span>
        </div>

        {/* Video Wall Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCameras.length === 0 ? (
            <div className="col-span-full py-16 text-center text-stone-400 text-xs">
              <Camera className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <span>No surveillance feeds match the current filter.</span>
            </div>
          ) : (
            filteredCameras.map((cam) => {
              const isOnline = cam.status === 'Online';
              const linkedIncidents = incidents.filter((i) => i.cameraId === cam.id);
              const activeIncidentCount = linkedIncidents.filter((i) => i.status !== 'Resolved' && i.status !== 'Closed').length;

              return (
                <div
                  key={cam.id}
                  onClick={() => handleOpenDrawer(cam)}
                  className="group relative aspect-[16/10] bg-stone-100 rounded-xl overflow-hidden border border-stone-200/90 hover:border-[#55132D] shadow-2xs hover:shadow-md cursor-pointer transition-all"
                >
                  {/* Video Stream Preview */}
                  {isOnline ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      key={cam.id}
                      src={cam.videoUrl || '/matabari-cam01.mp4'}
                      poster={cam.previewImage || '/matabari-premises-1.jpg'}
                      className="w-full h-full object-cover group-hover:scale-102 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 text-stone-500 p-4 text-center">
                      <AlertCircle className="w-8 h-8 text-rose-500 mb-1" />
                      <span className="font-bold text-xs text-stone-800">SIGNAL OFFLINE</span>
                      <span className="text-[10px] text-stone-400 mt-0.5">Maintenance check required</span>
                    </div>
                  )}

                  {/* Top On-Screen Telemetry Overlay */}
                  <div className={`absolute top-0 inset-x-0 p-3 flex items-center justify-between text-xs z-10 ${
                    isOnline
                      ? 'bg-gradient-to-b from-black/75 via-black/30 to-transparent text-white'
                      : 'bg-white/95 border-b border-stone-200 text-stone-800'
                  }`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                        }`}
                      />
                      <span className={`font-mono font-bold text-xs ${isOnline ? 'text-amber-300' : 'text-[#55132D]'}`}>
                        {cam.id}
                      </span>
                      <span className={`font-medium truncate text-xs ${isOnline ? 'text-stone-100' : 'text-stone-800'}`}>
                        {cam.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                        isOnline
                          ? 'bg-black/50 text-stone-200 border-white/10'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        {cam.resolution?.split(' ')[0] || '1080p'}
                      </span>
                      <div className={`p-1 rounded transition-colors border ${
                        isOnline
                          ? 'bg-black/50 text-white hover:bg-white/20 border-white/10'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-200'
                      }`}>
                        <Maximize2 className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom On-Screen Status & Action Overlay */}
                  <div className={`absolute bottom-0 inset-x-0 p-3 flex items-center justify-between text-xs z-10 ${
                    isOnline
                      ? 'bg-gradient-to-t from-black/80 via-black/35 to-transparent text-white'
                      : 'bg-white/95 border-t border-stone-200 text-stone-800'
                  }`}>
                    <div>
                      {activeIncidentCount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500 text-white text-[10.5px] font-bold shadow-2xs">
                          <AlertTriangle className="w-3 h-3 text-white" />
                          <span>{activeIncidentCount} Incident{activeIncidentCount !== 1 ? 's' : ''}</span>
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          isOnline ? 'text-emerald-300' : 'text-stone-600'
                        }`}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Normal</span>
                        </span>
                      )}
                    </div>

                    <span className={`font-semibold text-xs flex items-center gap-1 transition-colors ${
                      isOnline
                        ? 'text-stone-200 group-hover:text-amber-300'
                        : 'text-stone-600 group-hover:text-[#55132D]'
                    }`}>
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================
          5. CAMERA DETAIL & INCIDENT MANAGEMENT DRAWER / MODAL
         ======================================================== */}
      {activeCamera && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Drawer Header */}
            <div className="px-5 py-3.5 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <Camera className="w-5 h-5 text-[#E2BC6B]" />
                <div>
                  <h3 className="font-serif text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{activeCamera.id} — {activeCamera.name}</span>
                    <span
                      className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full uppercase ${
                        activeCamera.status === 'Online'
                          ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                          : 'bg-rose-900 text-rose-200 border border-rose-700'
                      }`}
                    >
                      {activeCamera.status}
                    </span>
                  </h3>
                  <span className="text-[11px] text-[#EADECF]/80 block mt-0.5">
                    Configured Zone: {activeCamera.zoneName} ({activeCamera.zoneId})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCameraForDrawer(null)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Inspection Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto p-5 space-y-5 text-xs flex-1">
              {/* Large Video Surveillance Stream Frame */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner">
                {activeCamera.status === 'Online' ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    key={activeCamera.id}
                    src={activeCamera.videoUrl || '/matabari-cam01.mp4'}
                    poster={activeCamera.previewImage || '/matabari-premises-1.jpg'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 text-stone-500 p-6 text-center">
                    <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
                    <span className="font-bold text-sm text-stone-800">CAMERA FEED OFFLINE</span>
                    <span className="text-xs text-stone-400 mt-1">Signal paused for maintenance testing</span>
                  </div>
                )}

                {/* Overlays */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {activeCamera.status === 'Online' ? (
                    <span className="px-2.5 py-1 rounded bg-black/85 backdrop-blur-xs text-[10px] font-bold text-white border border-white/20 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>LIVE FEED • TEMPLE PREMISES</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-black/85 text-[10px] font-bold text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                      SIGNAL OFFLINE
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-white">
                    {activeCamera.resolution}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white bg-black/85 backdrop-blur-xs px-3 py-1.5 rounded border border-white/20">
                  <span className="truncate">{activeCamera.zoneName}</span>
                  <span className="flex-shrink-0 pl-2">Snapshot: {activeCamera.snapshotTimestamp}</span>
                </div>
              </div>

              {/* Camera Specifications & Status Toggle Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EDE7DC]">
                <div>
                  <span className="text-[10.5px] font-semibold text-stone-500 uppercase tracking-wider block">Camera ID</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{activeCamera.id}</span>
                </div>
                <div>
                  <span className="text-[10.5px] font-semibold text-stone-500 uppercase tracking-wider block">Lens Configuration</span>
                  <span className="font-medium text-stone-800">{activeCamera.lensType || 'Fixed 4mm'}</span>
                </div>
                <div>
                  <span className="text-[10.5px] font-semibold text-stone-500 uppercase tracking-wider block">Configured Zone</span>
                  <span className="font-medium text-stone-800">{activeCamera.zoneId}</span>
                </div>
                <div>
                  <span className="text-[10.5px] font-semibold text-stone-500 uppercase tracking-wider block">Feed Power State</span>
                  <button
                    type="button"
                    onClick={() => toggleCameraStatus(activeCamera.id)}
                    className={`mt-0.5 px-3 py-1 rounded text-xs font-bold transition-colors ${
                      activeCamera.status === 'Online'
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {activeCamera.status === 'Online' ? 'Toggle Offline' : 'Restore Online'}
                  </button>
                </div>
              </div>

              {/* Administrative Remarks for Camera */}
              <form onSubmit={handleSaveCameraRemarks} className="bg-white p-3.5 rounded-xl border border-[#E8E2D8] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#55132D]" />
                    <span>Administrative Remarks & Calibration Notes</span>
                  </label>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#55132D] hover:bg-[#681B37] text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save Remarks</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={cameraRemarksEdit}
                  onChange={(e) => setCameraRemarksEdit(e.target.value)}
                  placeholder="Add administrative notes regarding camera perspective, lighting, or barricade layout..."
                  className="w-full p-2.5 rounded-lg border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#55132D]"
                />
              </form>

              {/* ========================================================
                  INCIDENT INTEGRATION SECTION
                 ======================================================== */}
              <div className="space-y-3 pt-2 border-t border-[#E8E2D8]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#55132D]" />
                    <h4 className="font-serif text-sm font-bold text-stone-900">
                      Associated Operational Incidents ({cameraIncidents.length})
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCreatingIncident(!isCreatingIncident)}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] hover:border-[#55132D] text-[#55132D] font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isCreatingIncident ? 'Cancel Incident Form' : '+ Log Sample Incident'}</span>
                  </button>
                </div>

                {/* Create Sample Incident Form */}
                {isCreatingIncident && (
                  <form onSubmit={handleCreateSampleIncident} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE5D8] space-y-3 animate-in fade-in duration-150">
                    <div className="font-bold text-xs text-[#55132D]">Log Sample Incident for {activeCamera.id}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">Category</label>
                        <select
                          value={newIncidentForm.category}
                          onChange={(e) => setNewIncidentForm({ ...newIncidentForm, category: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-xs"
                        >
                          <option value="Crowd Congestion">Crowd Congestion</option>
                          <option value="Facility & Safety Issue">Facility & Safety Issue</option>
                          <option value="Perimeter Safety Check">Perimeter Safety Check</option>
                          <option value="Protocol Coordination">Protocol Coordination</option>
                          <option value="Camera Hardware Offline">Camera Hardware Offline</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">Severity</label>
                        <select
                          value={newIncidentForm.severity}
                          onChange={(e) => setNewIncidentForm({ ...newIncidentForm, severity: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-xs"
                        >
                          <option value="Critical">Critical</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">Assign Staff Member</label>
                        <select
                          value={newIncidentForm.assignedStaffId}
                          onChange={(e) => setNewIncidentForm({ ...newIncidentForm, assignedStaffId: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-xs"
                        >
                          {staff.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.role})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Description</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Deviation in queue intake pace near approach barricade..."
                        value={newIncidentForm.description}
                        onChange={(e) => setNewIncidentForm({ ...newIncidentForm, description: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Initial Action / Remarks</label>
                      <input
                        type="text"
                        placeholder="e.g. Notified Duty Magistrate and security patrol..."
                        value={newIncidentForm.remarks}
                        onChange={(e) => setNewIncidentForm({ ...newIncidentForm, remarks: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsCreatingIncident(false)}
                        className="px-3 py-1.5 rounded-lg text-stone-600 hover:bg-stone-200 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[#55132D] text-white font-bold hover:bg-[#681B37] shadow-xs"
                      >
                        Record Incident
                      </button>
                    </div>
                  </form>
                )}

                {/* Incidents List */}
                {cameraIncidents.length === 0 ? (
                  <div className="py-6 text-center bg-[#FAF8F5] rounded-xl border border-[#EDE7DC] text-stone-500">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                    <p className="font-semibold text-stone-800">No Incidents Logged</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      No operational safety or maintenance incidents recorded for {activeCamera.id}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {cameraIncidents.map((inc) => {
                      return (
                        <div
                          key={inc.id}
                          className="p-3 bg-white rounded-xl border border-[#E8E2D8] shadow-2xs space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-stone-900">{inc.id}</span>
                              <span className="font-semibold text-stone-800">{inc.category}</span>
                              <span
                                className={`px-2 py-0.2 rounded text-[9.5px] font-bold uppercase ${
                                  inc.severity === 'Critical' || inc.severity === 'High'
                                    ? 'bg-rose-100 text-rose-800'
                                    : inc.severity === 'Medium'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-stone-100 text-stone-700'
                                }`}
                              >
                                {inc.severity}
                              </span>
                            </div>

                            <div className="text-[10.5px] text-stone-500 font-mono">
                              Reported: {inc.reportedTime}
                            </div>
                          </div>

                          <p className="text-stone-700 leading-snug">{inc.description}</p>

                          {/* Interactive Staff Assignment & Status Bar */}
                          <div className="pt-2 border-t border-[#E8E2D8]/60 flex flex-wrap items-center justify-between gap-2.5">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-stone-400" />
                              <span className="text-stone-500 font-medium">Assigned:</span>
                              <select
                                value={inc.assignedStaffId || ''}
                                onChange={(e) => {
                                  const staffMember = staff.find((s) => s.id === e.target.value);
                                  updateIncident(inc.id, {
                                    assignedStaffId: e.target.value,
                                    assignedStaffName: staffMember?.name || 'Staff Member',
                                  });
                                }}
                                className="px-2 py-1 rounded border border-[#E8E2D8] bg-white text-xs font-medium text-stone-800"
                              >
                                {staff.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name} ({s.role})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-stone-500 font-medium">Status:</span>
                              <select
                                value={inc.status}
                                onChange={(e) => updateIncidentStatus(inc.id, e.target.value)}
                                className={`px-2 py-1 rounded text-xs font-bold border ${
                                  inc.status === 'Resolved' || inc.status === 'Closed'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : inc.status === 'In Progress'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : 'bg-rose-50 text-rose-800 border-rose-300'
                                }`}
                              >
                                <option value="Open">Open</option>
                                <option value="Assigned">Assigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>
                          </div>

                          {inc.remarks && (
                            <div className="text-[10.5px] bg-[#FAF8F5] p-2 rounded text-stone-600 leading-snug">
                              <strong>Remarks:</strong> {inc.remarks}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="px-5 py-3 bg-[#FAF8F5] border-t border-[#E8E2D8] flex items-center justify-between text-xs flex-shrink-0">
              <span className="text-stone-500">
                Configured Record: {activeCamera.id} • Verified Matabari IP Optical Channel
              </span>
              <button
                type="button"
                onClick={() => setSelectedCameraForDrawer(null)}
                className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-lg transition-colors"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Camera Modal */}
      {isAddModalOpen && <AddCameraModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />}

      {/* AI Facial Recognition Search Modal */}
      <AiFaceSearchModal
        isOpen={isAiFaceSearchOpen}
        onClose={() => setIsAiFaceSearchOpen(false)}
        cameras={cameras}
        onSelectCamera={(cam) => handleOpenDrawer(cam)}
      />
    </div>
  );
}
