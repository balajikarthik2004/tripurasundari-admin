import React, { useState, useMemo, useRef } from 'react';
import TempleCampus3DScene from './TempleCampus3DScene';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Users,
  Clock,
  Shield,
  ShieldAlert,
  Radio,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Compass,
  Layers,
  Sparkles,
  LifeBuoy,
  HeartHandshake,
  Headphones,
  Footprints,
  Eye,
  EyeOff,
  Move,
  X,
  Phone,
  Maximize2,
  Box,
  Sliders,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function MatabariStaffDeploymentMap({
  staff = [],
  zones = [],
  shifts = [],
  selectedStaffId = null,
  onSelectStaff,
  onUpdateStaff,
  onAddStaff,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState('isometric'); // 'isometric' | 'blueprint' | 'night'
  const [isPlacingPin, setIsPlacingPin] = useState(false);
  const [pendingCoords, setPendingCoords] = useState(null);
  const [isRepositioningId, setIsRepositioningId] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showSectors, setShowSectors] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [activePresetZone, setActivePresetZone] = useState(null);

  // Modal / Drawer state for deploying personnel
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deployType, setDeployType] = useState('existing'); // 'existing' | 'new'
  const [selectedExistingStaffId, setSelectedExistingStaffId] = useState('');
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    role: 'Crowd Coordinator',
    team: 'Sevadal Volunteer Council',
    contact: '98621044',
    shift: 'Morning (06:00 - 14:00)',
    radioChannel: 'CH-2 Security & Queue',
    notes: '',
  });

  const svgRef = useRef(null);

  // Temple architectural sectors with accurate bounding coordinates (1000 x 680)
  const SECTORS = useMemo(
    () => [
      {
        id: 'ZONE-A',
        name: 'Main Sanctum & Garbhagriha',
        center: { x: 640, y: 335 },
        desc: 'Kurma-pitha elevated sanctum and Char-chala dome',
        bounds: { minX: 560, maxX: 720, minY: 260, maxY: 400 },
        badgeColor: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
      },
      {
        id: 'ZONE-B',
        name: 'Inner Courtyard & Parikrama Path',
        center: { x: 520, y: 280 },
        desc: 'Covered circumambulation arcade around sanctum',
        bounds: { minX: 430, maxX: 630, minY: 200, maxY: 380 },
        badgeColor: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
      },
      {
        id: 'ZONE-C',
        name: 'East Gate Plaza & Entry Arcade',
        center: { x: 740, y: 440 },
        desc: 'Upper plaza connecting Parikrama to lake steps',
        bounds: { minX: 680, maxX: 820, minY: 370, maxY: 490 },
        badgeColor: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
      },
      {
        id: 'ZONE-D',
        name: 'Kalyansagar Ghat & Stepped Bank',
        center: { x: 800, y: 530 },
        desc: 'Sacred turtle habitat with stepped lake edge',
        bounds: { minX: 720, maxX: 920, minY: 460, maxY: 640 },
        badgeColor: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
      },
      {
        id: 'ZONE-E',
        name: 'Annadanam Dining Complex',
        center: { x: 540, y: 570 },
        desc: 'Pilgrim free Mahaprasad hall and serving queue',
        bounds: { minX: 460, maxX: 620, minY: 510, maxY: 640 },
        badgeColor: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      },
      {
        id: 'ZONE-F',
        name: 'North Mela Grounds & Stalls Arena',
        center: { x: 330, y: 160 },
        desc: 'Diwali fairgrounds, cultural stage and stalls',
        bounds: { minX: 200, maxX: 460, minY: 80, maxY: 240 },
        badgeColor: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
      },
      {
        id: 'ZONE-G',
        name: 'West Parking & Bus Terminal',
        center: { x: 130, y: 220 },
        desc: 'Vehicle entry plaza and FASTag transit bays',
        bounds: { minX: 50, maxX: 220, minY: 140, maxY: 320 },
        badgeColor: 'border-stone-500/50 bg-stone-500/10 text-stone-300',
      },
      {
        id: 'ZONE-NORTH-RAMP',
        name: 'North Barrier-Free Ramp',
        center: { x: 540, y: 190 },
        desc: 'Gentle sloping ramp for seniors & wheelchair yatris',
        bounds: { minX: 480, maxX: 600, minY: 130, maxY: 240 },
        badgeColor: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      },
      {
        id: 'ZONE-WEST-GOPURAM',
        name: 'West Main Torana Gopuram',
        center: { x: 140, y: 370 },
        desc: 'Primary 4-lane turnstile entrance portal',
        bounds: { minX: 70, maxX: 220, minY: 320, maxY: 440 },
        badgeColor: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
      },
    ],
    []
  );

  // Helper to determine sector from coordinates
  const getSectorFromCoords = (x, y) => {
    for (const sec of SECTORS) {
      if (
        x >= sec.bounds.minX &&
        x <= sec.bounds.maxX &&
        y >= sec.bounds.minY &&
        y <= sec.bounds.maxY
      ) {
        return sec;
      }
    }
    // Fallback: pick closest center
    let closest = SECTORS[0];
    let minD = Infinity;
    for (const sec of SECTORS) {
      const d = Math.hypot(sec.center.x - x, sec.center.y - y);
      if (d < minD) {
        minD = d;
        closest = sec;
      }
    }
    return closest;
  };

  // Normalize staff coordinate on 1000 x 680 SVG canvas
  const getNormalizedCoords = (staffMember) => {
    if (!staffMember.mapCoords) return null;
    let { x, y } = staffMember.mapCoords;
    if (x <= 100 && y <= 100) {
      // Legacy percentage-based coords (0 - 100)
      return { x: Math.round((x / 100) * 1000), y: Math.round((y / 100) * 680) };
    }
    return { x: Math.round(x), y: Math.round(y) };
  };

  // Filter staff based on controls
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      // Check department / team
      if (departmentFilter !== 'ALL') {
        if (departmentFilter === 'Security' && !s.team.includes('Security')) return false;
        if (departmentFilter === 'Sevadal' && !s.team.includes('Sevadal') && !s.team.includes('Volunteer')) return false;
        if (departmentFilter === 'Safety' && !s.team.includes('Safety') && !s.team.includes('Disaster')) return false;
        if (departmentFilter === 'Facilitation' && !s.team.includes('Facilitation') && !s.role.includes('Help Desk')) return false;
      }
      // Check shift
      if (shiftFilter !== 'ALL') {
        if (!s.shift.toLowerCase().includes(shiftFilter.toLowerCase())) return false;
      }
      return true;
    });
  }, [staff, departmentFilter, shiftFilter]);

  // Selected staff object
  const currentSelectedStaff = useMemo(() => {
    return staff.find((s) => s.id === selectedStaffId) || null;
  }, [staff, selectedStaffId]);

  // Unassigned or standby staff list (for quick deployment dropdown)
  const availableForDeployment = useMemo(() => {
    return staff.filter((s) => !s.mapCoords || s.id === isRepositioningId);
  }, [staff, isRepositioningId]);

  // Role visual styling & icons
  const getRoleBadge = (role = '') => {
    const r = role.toLowerCase();
    if (r.includes('security') || r.includes('police')) {
      return {
        bg: 'bg-[#55132D] text-amber-200 border-[#B68A36]/60',
        dot: 'bg-amber-400',
        icon: Shield,
        colorHex: '#55132D',
        ringClass: 'ring-[#B68A36]',
      };
    }
    if (r.includes('crowd') || r.includes('queue')) {
      return {
        bg: 'bg-purple-900 text-purple-200 border-purple-500/60',
        dot: 'bg-purple-400',
        icon: Users,
        colorHex: '#6D28D9',
        ringClass: 'ring-purple-400',
      };
    }
    if (r.includes('safety') || r.includes('water') || r.includes('ghat')) {
      return {
        bg: 'bg-amber-900 text-amber-200 border-amber-500/60',
        dot: 'bg-amber-400',
        icon: LifeBuoy,
        colorHex: '#D97706',
        ringClass: 'ring-amber-400',
      };
    }
    if (r.includes('volunteer') || r.includes('sevadal') || r.includes('facility')) {
      return {
        bg: 'bg-emerald-900 text-emerald-200 border-emerald-500/60',
        dot: 'bg-emerald-400',
        icon: HeartHandshake,
        colorHex: '#059669',
        ringClass: 'ring-emerald-400',
      };
    }
    if (r.includes('help desk') || r.includes('facilitation')) {
      return {
        bg: 'bg-blue-900 text-blue-200 border-blue-500/60',
        dot: 'bg-blue-400',
        icon: Headphones,
        colorHex: '#2563EB',
        ringClass: 'ring-blue-400',
      };
    }
    return {
      bg: 'bg-stone-800 text-stone-200 border-stone-600',
      dot: 'bg-stone-400',
      icon: Footprints,
      colorHex: '#44403C',
      ringClass: 'ring-stone-400',
    };
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setActivePresetZone(null);
  };

  // Handle click on the SVG map canvas
  const handleCanvasClick = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert to SVG 1000 x 680 space
    const scaleX = 1000 / rect.width;
    const scaleY = 680 / rect.height;
    const x = Math.round(clientX * scaleX);
    const y = Math.round(clientY * scaleY);

    // Clamp coordinates
    const clampedX = Math.max(40, Math.min(960, x));
    const clampedY = Math.max(40, Math.min(640, y));

    if (isRepositioningId) {
      // Repositioning an existing staff member
      const detectedSector = getSectorFromCoords(clampedX, clampedY);
      if (onUpdateStaff) {
        onUpdateStaff(isRepositioningId, {
          mapCoords: { x: clampedX, y: clampedY },
          assignedZoneId: detectedSector.id,
          assignedZoneName: detectedSector.name,
        });
      }
      setIsRepositioningId(null);
      setIsPlacingPin(false);
      return;
    }

    if (isPlacingPin) {
      setPendingCoords({ x: clampedX, y: clampedY });
      setIsDeployModalOpen(true);
      setIsPlacingPin(false);
    }
  };

  // Confirm deployment from modal
  const handleConfirmDeployment = (e) => {
    e.preventDefault();
    if (!pendingCoords) return;

    const detectedSector = getSectorFromCoords(pendingCoords.x, pendingCoords.y);

    if (deployType === 'existing' && selectedExistingStaffId) {
      if (onUpdateStaff) {
        onUpdateStaff(selectedExistingStaffId, {
          mapCoords: pendingCoords,
          assignedZoneId: detectedSector.id,
          assignedZoneName: detectedSector.name,
          status: 'Active',
        });
      }
      onSelectStaff?.(staff.find((s) => s.id === selectedExistingStaffId));
    } else if (deployType === 'new') {
      if (!newStaffForm.name) return;
      if (onAddStaff) {
        const added = onAddStaff({
          ...newStaffForm,
          mapCoords: pendingCoords,
          assignedZoneId: detectedSector.id,
          assignedZoneName: detectedSector.name,
          status: 'Active',
        });
        onSelectStaff?.(added);
      }
    }

    setIsDeployModalOpen(false);
    setPendingCoords(null);
    setSelectedExistingStaffId('');
  };

  // Jump to specific zone
  const handleJumpToZone = (sector) => {
    setActivePresetZone(sector.id);
    setZoomLevel(1.4);
  };

  return (
    <div className="space-y-4">
      {/* Sleek, Uncongested Deployment Control Bar */}
      <div className="bg-white rounded-xl p-3 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Department Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#55132D]" />
            Department:
          </span>
          {['ALL', 'Security', 'Crowd', 'Safety', 'Sevadal', 'Facilitation'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                departmentFilter === dept
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Toggle Labels */}
          <button
            onClick={() => setShowLabels((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showLabels
                ? 'bg-stone-100 border-stone-300 text-stone-800'
                : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800'
            }`}
            title="Toggle Officer Name Labels"
          >
            {showLabels ? <Eye className="w-3.5 h-3.5 text-[#55132D]" /> : <EyeOff className="w-3.5 h-3.5 text-stone-400" />}
            <span>Labels</span>
          </button>

          {/* Deploy Marker Button */}
          <button
            onClick={() => {
              setIsPlacingPin((prev) => !prev);
              setIsRepositioningId(null);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isPlacingPin
                ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300 animate-pulse'
                : 'bg-[#55132D] hover:bg-[#681B37] text-white'
            }`}
          >
            <Plus className="w-4 h-4 text-[#E2BC6B]" />
            <span>{isPlacingPin ? 'Click Map to Place...' : 'Deploy Officer'}</span>
          </button>
        </div>
      </div>

      {/* ACTIVE REPOSITIONING OR PLACING PIN BANNER */}
      {(isPlacingPin || isRepositioningId) && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
            <span>
              <strong>Targeting Active:</strong> Click anywhere on the temple drawing to{' '}
              {isRepositioningId ? 'reposition the selected personnel' : 'deploy a new staff / volunteer post'}.
            </span>
          </div>
          <button
            onClick={() => {
              setIsPlacingPin(false);
              setIsRepositioningId(null);
            }}
            className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* TRUE 3D WEBGL TEMPLE CAMPUS VIEWPORT WITH THREE.JS & D3 */}
      <TempleCampus3DScene
        staff={filteredStaff}
        sectors={SECTORS}
        selectedStaffId={selectedStaffId}
        isPlacingPin={isPlacingPin}
        isRepositioningId={isRepositioningId}
        showLabels={showLabels}
        showSectors={showSectors}
        departmentFilter={departmentFilter}
        shiftFilter={shiftFilter}
        onSelectStaff={onSelectStaff}
        onCanvasDeployClick={(coords) => {
          if (isRepositioningId) {
            const detectedSector = getSectorFromCoords(coords.x, coords.y);
            if (onUpdateStaff) {
              onUpdateStaff(isRepositioningId, {
                mapCoords: coords,
                assignedZoneId: detectedSector.id,
                assignedZoneName: detectedSector.name,
              });
            }
            setIsRepositioningId(null);
            setIsPlacingPin(false);
          } else if (isPlacingPin) {
            setPendingCoords(coords);
            setIsDeployModalOpen(true);
            setIsPlacingPin(false);
          }
        }}
        activePresetZone={activePresetZone}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />

      {/* SELECTED PERSONNEL INSPECTION & ACTION DRAWER */}
      {currentSelectedStaff && (
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#55132D] to-[#801B42] text-[#E2BC6B] flex items-center justify-center font-serif text-lg font-bold shadow-sm">
              {currentSelectedStaff.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold font-serif text-stone-900">{currentSelectedStaff.name}</h3>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#55132D]/10 text-[#55132D]">
                  {currentSelectedStaff.role}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-stone-100 text-stone-600">
                  {currentSelectedStaff.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    currentSelectedStaff.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {currentSelectedStaff.status}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Stationed at: <strong className="text-stone-900">{currentSelectedStaff.assignedZoneName || 'Unassigned'}</strong> •{' '}
                {currentSelectedStaff.shift} • Team: <strong>{currentSelectedStaff.team}</strong> • Contact: {currentSelectedStaff.contact}
              </p>
              {currentSelectedStaff.notes && (
                <p className="text-[11px] text-stone-500 mt-1 italic">
                  Operational Directive: "{currentSelectedStaff.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => {
                setIsRepositioningId(currentSelectedStaff.id);
                setIsPlacingPin(false);
              }}
              className="px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Move className="w-3.5 h-3.5 text-amber-700" />
              <span>Relocate Station</span>
            </button>

            <button
              onClick={() => {
                const nextStatus = currentSelectedStaff.status === 'Active' ? 'On Break' : 'Active';
                onUpdateStaff?.(currentSelectedStaff.id, { status: nextStatus });
              }}
              className="px-3 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors"
            >
              {currentSelectedStaff.status === 'Active' ? 'Set On Break' : 'Set Active on Duty'}
            </button>

            <button
              onClick={() => {
                // Clear pin coordinate
                onUpdateStaff?.(currentSelectedStaff.id, { mapCoords: null });
                onSelectStaff?.(null);
              }}
              className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
              title="Return to standby pool"
            >
              Recall to Base
            </button>

            <button
              onClick={() => onSelectStaff?.(null)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL: DEPLOY PERSONNEL AT CLICKED COORDINATE */}
      {isDeployModalOpen && pendingCoords && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#1A0610] p-4 text-white flex items-center justify-between border-b border-[#B68A36]/30">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#E2BC6B]" />
                <div>
                  <h3 className="font-serif font-bold text-sm">Deploy Personnel at Station</h3>
                  <p className="text-[11px] text-[#E2BC6B]">
                    Detected Sector: {getSectorFromCoords(pendingCoords.x, pendingCoords.y).name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDeployModalOpen(false);
                  setPendingCoords(null);
                }}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleConfirmDeployment} className="p-5 space-y-4 text-xs">
              {/* Type Switcher: Assign Existing vs Enroll New */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDeployType('existing')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    deployType === 'existing'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Assign Existing Personnel
                </button>
                <button
                  type="button"
                  onClick={() => setDeployType('new')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    deployType === 'new'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Deploy New Volunteer / Guard
                </button>
              </div>

              {deployType === 'existing' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Select Available Personnel</label>
                    <select
                      value={selectedExistingStaffId}
                      onChange={(e) => setSelectedExistingStaffId(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                    >
                      <option value="">Choose officer / volunteer...</option>
                      {staff.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.id}) — {s.role} [{s.team}] {s.mapCoords ? '• Currently Stationed' : '• Standby'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Full Name & Honorific</label>
                    <input
                      type="text"
                      placeholder="e.g. Subrata Debbarma"
                      value={newStaffForm.name}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Operational Role</label>
                      <select
                        value={newStaffForm.role}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="Security Supervisor">Security Supervisor</option>
                        <option value="Crowd Coordinator">Crowd Coordinator</option>
                        <option value="Safety Marshal">Safety Marshal</option>
                        <option value="Water Lifeguard">Water Lifeguard (Ghat)</option>
                        <option value="Volunteer">Sevadal Volunteer</option>
                        <option value="Help Desk Staff">Help Desk Officer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Department Wing</label>
                      <select
                        value={newStaffForm.team}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, team: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="Temple Security Wing">Temple Security Wing</option>
                        <option value="Sevadal Volunteer Council">Sevadal Volunteer Council</option>
                        <option value="Disaster & Safety Team">Disaster & Safety Team</option>
                        <option value="Devotee Facilitation Center">Devotee Facilitation Center</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Shift Timings</label>
                      <select
                        value={newStaffForm.shift}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, shift: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                        <option value="Afternoon (14:00 - 22:00)">Afternoon (14:00 - 22:00)</option>
                        <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Radio Channel</label>
                      <select
                        value={newStaffForm.radioChannel}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, radioChannel: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="CH-1 Command Net">CH-1 Command Net</option>
                        <option value="CH-2 Security & Queue">CH-2 Security & Queue</option>
                        <option value="CH-3 Lake & Ghat Patrol">CH-3 Lake & Ghat Patrol</option>
                        <option value="CH-4 Medical & Safety">CH-4 Medical & Safety</option>
                        <option value="CH-5 Sevadal Coordinators">CH-5 Sevadal Coordinators</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Station Directive / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Ensure one-way pedestrian queue flow and prevent crowding"
                      value={newStaffForm.notes}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, notes: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeployModalOpen(false);
                    setPendingCoords(null);
                  }}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#55132D] hover:bg-[#681B37] text-white font-bold shadow-sm"
                >
                  Confirm Station Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

