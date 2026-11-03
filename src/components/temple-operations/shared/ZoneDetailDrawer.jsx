import React from 'react';
import { X, Users, Video, ShieldAlert, ArrowRight, UserCheck, Flame, Clock } from 'lucide-react';
import { useTempleOperations } from '../../../context/TempleOperationsContext';

export default function ZoneDetailDrawer({ zone, onClose, onLogIncident }) {
  const { queues, staff, cameras, updateZoneDensity } = useTempleOperations();

  if (!zone) return null;

  const zoneQueues = queues.filter((q) => q.zoneId === zone.id);
  const zoneStaff = staff.filter((s) => s.assignedZoneId === zone.id);
  const zoneCameras = cameras.filter((c) => c.zoneId === zone.id);

  const occPercent = Math.min(100, Math.round((zone.currentOccupancy / zone.capacity) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#55132D] to-[#681B37] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#E2BC6B] bg-white/10 px-2 py-0.5 rounded">
                {zone.id}
              </span>
              <span className="text-[10px] uppercase font-bold text-white/80">{zone.type}</span>
            </div>
            <h2 className="text-base font-bold font-serif text-white mt-1">{zone.name}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Occupancy Meter */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-stone-700">Real-Time Occupancy:</span>
              <strong className="text-stone-900 font-serif text-sm">
                {zone.currentOccupancy} / {zone.capacity} ({occPercent}%)
              </strong>
            </div>

            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  zone.densityStatus === 'Critical'
                    ? 'bg-rose-600'
                    : zone.densityStatus === 'High'
                    ? 'bg-orange-600'
                    : zone.densityStatus === 'Moderate'
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${occPercent}%` }}
              />
            </div>

            <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">Manual Density Override:</span>
              <div className="flex items-center gap-1">
                {['Normal', 'Moderate', 'High', 'Critical'].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateZoneDensity(zone.id, st)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      zone.densityStatus === st
                        ? 'bg-[#55132D] text-white shadow-2xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-stone-600 leading-relaxed">{zone.description}</p>

          {/* Associated Queues */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-stone-900 font-serif">Queues in this Zone ({zoneQueues.length})</h4>
            </div>
            {zoneQueues.length === 0 ? (
              <p className="text-stone-400 italic">No designated queue line in this zone.</p>
            ) : (
              <div className="space-y-2">
                {zoneQueues.map((q) => (
                  <div key={q.id} className="p-2.5 rounded-lg border border-stone-200 bg-white space-y-1">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{q.name}</span>
                      <span className="text-[#55132D] font-mono text-[11px]">{q.id}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-500">
                      <span>Wait Time: ~{q.estimatedWaitMins} mins</span>
                      <span>Occupancy: {q.currentOccupancy}/{q.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Staff Members */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-stone-900 font-serif">Staff On Duty ({zoneStaff.length})</h4>
            </div>
            {zoneStaff.length === 0 ? (
              <p className="text-stone-400 italic">No staff stationed here currently.</p>
            ) : (
              <div className="space-y-1.5">
                {zoneStaff.map((s) => (
                  <div key={s.id} className="p-2 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div>
                      <strong className="text-stone-900 block">{s.name}</strong>
                      <span className="text-[11px] text-stone-500">{s.role} • {s.team}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Associated CCTV Cameras */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-stone-900 font-serif">CCTV Coverage ({zoneCameras.length})</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {zoneCameras.map((c) => (
                <div key={c.id} className="p-2 rounded-lg bg-stone-50 border border-stone-100 text-[11px]">
                  <strong className="block truncate">{c.name}</strong>
                  <span className="text-stone-400 font-mono text-[10px]">{c.id} • {c.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              if (onLogIncident) onLogIncident(zone);
            }}
            className="px-3 py-1.5 font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Raise Alert / Incident</span>
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 font-semibold text-stone-600 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

