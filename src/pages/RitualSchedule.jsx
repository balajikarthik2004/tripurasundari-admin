import React, { useState, useMemo } from 'react';
import {
  Flame,
  Sun,
  Moon,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Calendar,
  Sparkles,
  BookOpen,
  Info,
  X,
  ChevronRight,
  ShieldAlert,
  Users
} from 'lucide-react';
import { useTempleOperations } from '../context/TempleOperationsContext';
import OperationsPageHeader from '../components/temple-operations/shared/OperationsPageHeader';
import OperationsMetricCard from '../components/temple-operations/shared/OperationsMetricCard';
import OperationsTabs from '../components/temple-operations/shared/OperationsTabs';

export default function RitualSchedule() {
  const {
    ritualSchedule,
    updateRitualScheduleStatus,
    ritualCatalogue,
    addRitual,
    toggleRitualActive,
    specialDaySchedules,
  } = useTempleOperations();

  const [activeTab, setActiveTab] = useState('timeline');
  const [isAddRitualModalOpen, setIsAddRitualModalOpen] = useState(false);
  const [selectedSpecialSchedule, setSelectedSpecialSchedule] = useState(null);

  // New ritual form state
  const [ritualForm, setRitualForm] = useState({
    name: '',
    category: 'Daily Essential Aarti',
    standardDuration: '60 mins',
    associatedLocation: 'Sanctum Garbhagriha',
    description: '',
  });

  // Current active ritual
  const activeRitual = useMemo(
    () => ritualSchedule.find((r) => r.status === 'In Progress') || ritualSchedule[0],
    [ritualSchedule]
  );

  // Next upcoming ritual
  const nextRitual = useMemo(
    () => ritualSchedule.find((r) => r.status === 'Upcoming'),
    [ritualSchedule]
  );

  const completedCount = useMemo(
    () => ritualSchedule.filter((r) => r.status === 'Completed').length,
    [ritualSchedule]
  );

  const handleCreateRitual = (e) => {
    e.preventDefault();
    if (!ritualForm.name) return;
    addRitual(ritualForm);
    setRitualForm({
      name: '',
      category: 'Daily Essential Aarti',
      standardDuration: '60 mins',
      associatedLocation: 'Sanctum Garbhagriha',
      description: '',
    });
    setIsAddRitualModalOpen(false);
  };

  const tabs = [
    { id: 'timeline', label: "Today's Daily Ritual Sequence", count: ritualSchedule.length },
    { id: 'catalogue', label: 'Ritual Master Catalogue', count: ritualCatalogue.length },
    { id: 'special_days', label: 'Tithi & Festival Schedules', count: specialDaySchedules.length },
    { id: 'panchang', label: 'Panchang & Astronomical Timing' },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <OperationsPageHeader
        title="Daily Ritual Schedule & Seva Timings"
        subtitle="Vedic chronology, sanctum pujas, Bhog nivedana, and special Tithi astronomical timings."
        primaryActionLabel="Add to Catalogue"
        onPrimaryAction={() => setIsAddRitualModalOpen(true)}
        primaryActionIcon={Plus}
      />

      {/* Confirmation Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>CONFIRMATION NOTICE:</strong> Timings displayed represent the standard Shakta tradition daily ritual framework. Special tithis and eclipses supersede standard times with Head Priest consent.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-amber-100 px-2 py-0.5 rounded font-bold uppercase text-amber-800 shrink-0">
          Tripura Shakta Sampradaya
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <OperationsMetricCard
          label="Daily Ritual Cycle"
          value={`${ritualSchedule.length} Sequences`}
          subtext="From Mangala to Shayana Aarti"
          icon={Flame}
        />
        <OperationsMetricCard
          label="Active In Sanctum"
          value={activeRitual ? activeRitual.time : '09:00 AM'}
          subtext={activeRitual ? activeRitual.name : 'Alankara Darshan'}
          icon={Sun}
        />
        <OperationsMetricCard
          label="Next Upcoming Ritual"
          value={nextRitual ? nextRitual.time : '12:00 PM'}
          subtext={nextRitual ? nextRitual.name : 'Madhyahna Aarti'}
          icon={Clock}
        />
        <OperationsMetricCard
          label="Cycle Progress"
          value={`${completedCount} of ${ritualSchedule.length}`}
          subtext={`${Math.round((completedCount / ritualSchedule.length) * 100)}% concluded today`}
          icon={CheckCircle}
        />
      </div>

      {/* Navigation Tabs */}
      <OperationsTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* TAB 1: DAILY SEQUENCE TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-3.5">
          {ritualSchedule.map((ritual, idx) => {
            const isCompleted = ritual.status === 'Completed';
            const isInProgress = ritual.status === 'In Progress';
            const isUpcoming = ritual.status === 'Upcoming';

            return (
              <div
                key={ritual.id}
                className={`bg-white rounded-xl border p-4 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isInProgress
                    ? 'border-[#55132D] ring-1 ring-[#55132D]/20 bg-amber-50/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Left Section: Time & Order */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded">
                      {ritual.time}
                    </span>
                    <span className="text-[10px] text-stone-400 mt-1 font-mono">
                      #{idx + 1}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-stone-900">{ritual.name}</h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isInProgress
                            ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {ritual.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mb-2 leading-relaxed">{ritual.remarks}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" /> Duration: {ritual.duration}
                      </span>
                      <span>•</span>
                      <span>Location: {ritual.location}</span>
                      <span>•</span>
                      <span className="text-[#55132D] font-bold">Officiating: {ritual.priestInCharge}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section: Interactive Status Controls */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <select
                    value={ritual.status}
                    onChange={(e) => updateRitualScheduleStatus(ritual.id, e.target.value)}
                    className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#55132D] font-medium"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                  </select>

                  <button
                    onClick={() => {
                      const note = prompt('Update operational remarks for ' + ritual.name, ritual.remarks);
                      if (note !== null) {
                        updateRitualScheduleStatus(ritual.id, ritual.status, note);
                      }
                    }}
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Edit Note
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: RITUAL MASTER CATALOGUE */}
      {activeTab === 'catalogue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ritualCatalogue.map((cat) => {
            const isActive = cat.status === 'active';
            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between hover:border-[#55132D]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {cat.id}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {isActive ? 'In Liturgical Use' : 'Inactive'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-800 mb-0.5">{cat.name}</h4>
                  <p className="text-[11px] font-semibold text-[#55132D] mb-2">{cat.category}</p>
                  <p className="text-xs text-stone-600 mb-3 leading-relaxed">{cat.description}</p>

                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-150 space-y-1 text-[11px] text-stone-600 mb-3">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Standard Duration:</span>
                      <span className="font-medium text-stone-800">{cat.standardDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Designated Sanctum:</span>
                      <span className="font-medium text-stone-800">{cat.associatedLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-150 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-stone-400">Shakta Canonical Seva</span>
                  <button
                    onClick={() => toggleRitualActive(cat.id)}
                    className="text-[11px] text-stone-600 hover:text-stone-900 font-medium"
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: SPECIAL DAYS & FESTIVALS */}
      {activeTab === 'special_days' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {specialDaySchedules.map((sp) => (
              <div
                key={sp.id}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {sp.id}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {sp.publicationStatus}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-800 mb-1">{sp.eventName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#55132D] font-semibold mb-3">
                    <Calendar className="w-3.5 h-3.5" /> {sp.date}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-150">
                      <span className="text-[10px] uppercase font-semibold text-stone-500 block">Ritual Variations:</span>
                      <p className="text-stone-700 mt-0.5 leading-relaxed">{sp.specialRituals}</p>
                    </div>

                    <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                      <span className="text-[10px] uppercase font-semibold text-amber-800 block">Darshan Protocol:</span>
                      <p className="mt-0.5 leading-relaxed">{sp.scheduleNotes}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-150 mt-3 text-right">
                  <button
                    onClick={() => setSelectedSpecialSchedule(sp)}
                    className="text-xs text-[#55132D] hover:underline font-bold"
                  >
                    View Operational Directives →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PANCHANG & ASTRONOMICAL DATA */}
      {activeTab === 'panchang' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-stone-800">Tripura Sundari Daily Matabari Panchang</h3>
            <p className="text-xs text-stone-500">
              Astronomical calculations for Udaipur, Tripura (23.53° N, 91.49° E) for ritual synchronicity.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Sunrise (Surya Udaya)</span>
              <p className="font-mono text-base font-bold text-stone-900 mt-1">05:41 AM</p>
              <p className="text-[10px] text-stone-500">Mangala Aarti dawn synchrony</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Sunset (Surya Asta)</span>
              <p className="font-mono text-base font-bold text-stone-900 mt-1">05:08 PM</p>
              <p className="text-[10px] text-stone-500">Sandhya Deeparadhana bell</p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
              <span className="text-[10px] uppercase font-bold text-amber-800">Tithi</span>
              <p className="font-mono text-base font-bold mt-1">Krishna Paksha Navami</p>
              <p className="text-[10px] text-amber-700">Ends at 02:44 PM</p>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900">
              <span className="text-[10px] uppercase font-bold text-red-800">Rahu Kaalam</span>
              <p className="font-mono text-base font-bold mt-1">08:52 AM – 10:18 AM</p>
              <p className="text-[10px] text-red-700">Special Homa avoided</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD RITUAL TO CATALOGUE */}
      {isAddRitualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Add Ritual to Master Catalogue</h3>
                <p className="text-xs text-stone-500">Define a canonical puja or aarti sequence.</p>
              </div>
              <button
                onClick={() => setIsAddRitualModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRitual} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Ritual Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chandi Path & Stotra Paath"
                  value={ritualForm.name}
                  onChange={(e) => setRitualForm({ ...ritualForm, name: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={ritualForm.category}
                    onChange={(e) => setRitualForm({ ...ritualForm, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="Daily Essential Aarti">Daily Essential Aarti</option>
                    <option value="Vedic Ceremonial Bath">Vedic Ceremonial Bath</option>
                    <option value="Sacred Ornamentation & Adornment">Sacred Ornamentation</option>
                    <option value="Midday Royal Food Offering">Royal Food Offering</option>
                    <option value="Evening Dusk Flame Invocation">Evening Flame Invocation</option>
                    <option value="Special Yagya Ritual">Special Yagya Ritual</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Standard Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 45 mins"
                    value={ritualForm.standardDuration}
                    onChange={(e) => setRitualForm({ ...ritualForm, standardDuration: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Designated Sanctum Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inner Sanctum (Garbhagriha)"
                  value={ritualForm.associatedLocation}
                  onChange={(e) => setRitualForm({ ...ritualForm, associatedLocation: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Liturgical Description</label>
                <textarea
                  rows={2}
                  placeholder="Vedic mantras invoked, offerings offered..."
                  value={ritualForm.description}
                  onChange={(e) => setRitualForm({ ...ritualForm, description: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRitualModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white font-semibold rounded-lg shadow-sm"
                >
                  Save to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SPECIAL TITHI DIRECTIVES INSPECTION */}
      {selectedSpecialSchedule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="bg-[#1A0610] p-4 text-white flex items-center justify-between border-b border-[#B68A36]/30">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#E2BC6B]" />
                <div>
                  <h3 className="font-serif font-bold text-sm">{selectedSpecialSchedule.eventName}</h3>
                  <p className="text-[10px] text-[#E2BC6B]">{selectedSpecialSchedule.date} • {selectedSpecialSchedule.publicationStatus}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSpecialSchedule(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-stone-700">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">Vedic Ritual Variations</span>
                <p className="font-medium text-stone-900 leading-relaxed">{selectedSpecialSchedule.specialRituals}</p>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-1 text-amber-950">
                <span className="text-[10px] text-amber-800 uppercase font-semibold block">Darshan & Queue Protocols</span>
                <p className="leading-relaxed">{selectedSpecialSchedule.scheduleNotes}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedSpecialSchedule(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

