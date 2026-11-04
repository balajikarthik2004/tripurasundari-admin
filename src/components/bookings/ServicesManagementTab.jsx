import React, { useState, useMemo } from 'react';
import {
  Layers,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Calendar,
  Users,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Flame,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';
import { useDarshanBookings } from '../../context/DarshanBookingContext';
import { SERVICE_CATEGORIES } from '../../data/unifiedBookingsData';
import ServiceModal from './ServiceModal';
import SlotModal from './SlotModal';

export default function ServicesManagementTab({ initialView = 'catalogue' }) {
  const {
    services,
    slots,
    bookings,
    toggleServiceActive,
    toggleSlotActive,
    getSlotOccupancy,
  } = useDarshanBookings();

  // Sub-view: 'catalogue' | 'slots'
  const [currentView, setCurrentView] = useState(initialView);

  // Filters for Catalogue
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [catalogueViewMode, setCatalogueViewMode] = useState('cards'); // 'cards' | 'table'

  // Filters for Slots
  const [slotCatFilter, setSlotCatFilter] = useState('All');
  const [slotSearch, setSlotSearch] = useState('');

  // Modals
  const [serviceModalConfig, setServiceModalConfig] = useState({ isOpen: false, editingService: null });
  const [slotModalConfig, setSlotModalConfig] = useState({ isOpen: false, editingSlot: null });

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (selectedCatFilter !== 'All' && s.category !== selectedCatFilter) {
        return false;
      }
      if (catalogueSearch.trim()) {
        const query = catalogueSearch.toLowerCase();
        const matchesName = s.name?.toLowerCase().includes(query);
        const matchesDesc = s.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [services, selectedCatFilter, catalogueSearch]);

  // Filtered Slots
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      if (slotCatFilter !== 'All' && slot.category !== slotCatFilter) {
        return false;
      }
      if (slotSearch.trim()) {
        const query = slotSearch.toLowerCase();
        const matchesLabel = slot.label?.toLowerCase().includes(query) || slot.timeSlot?.toLowerCase().includes(query);
        const matchesService = slot.serviceName?.toLowerCase().includes(query);
        if (!matchesLabel && !matchesService) return false;
      }
      return true;
    });
  }, [slots, slotCatFilter, slotSearch]);

  // Category Color Badge
  const getCategoryBadgeStyle = (category) => {
    switch (category) {
      case 'Darshan':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Archana':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Abhishekam':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Havan':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-purple-50 text-purple-800 border-purple-200';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Workspace Header & View Switcher */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55132D]" />
            <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
              Services & Slot Governance
            </h2>
            <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
              {currentView === 'catalogue' ? 'Service Catalogue' : 'Slots & Availability'}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Configure approved temple rituals, seva contribution tiers, time-slot capacities, and priest allocations.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-1 bg-stone-100 rounded-xl border border-stone-200/80 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setCurrentView('catalogue')}
              className={`px-3.5 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'catalogue'
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Service Catalogue</span>
              <span className="text-[10px] ml-0.5 opacity-80 font-normal">({services.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('slots')}
              className={`px-3.5 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'slots'
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Slots & Availability</span>
              <span className="text-[10px] ml-0.5 opacity-80 font-normal">({slots.length})</span>
            </button>
          </div>

          {currentView === 'catalogue' ? (
            <button
              type="button"
              onClick={() => setServiceModalConfig({ isOpen: true, editingService: null })}
              className="px-3.5 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Add New Service</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSlotModalConfig({ isOpen: true, editingSlot: null })}
              className="px-3.5 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Create Time Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          VIEW A: SERVICE CATALOGUE
         ======================================================== */}
      {currentView === 'catalogue' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogueSearch}
                onChange={(e) => setCatalogueSearch(e.target.value)}
                placeholder="Search services by title or description..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#55132D]"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedCatFilter('All')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedCatFilter === 'All'
                    ? 'bg-[#55132D] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All Categories
              </button>
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCatFilter(cat)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedCatFilter === cat
                      ? 'bg-[#55132D] text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Layout Toggle (Cards vs Table) */}
            <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-lg border border-stone-200">
              <button
                type="button"
                onClick={() => setCatalogueViewMode('cards')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  catalogueViewMode === 'cards' ? 'bg-white shadow-2xs text-[#55132D]' : 'text-stone-500'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCatalogueViewMode('table')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  catalogueViewMode === 'table' ? 'bg-white shadow-2xs text-[#55132D]' : 'text-stone-500'
                }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cards Layout */}
          {catalogueViewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredServices.map((service) => {
                const isActive = service.status === 'active';
                const badgeStyle = getCategoryBadgeStyle(service.category);
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-4 flex flex-col justify-between hover:border-[#55132D]/40 transition-all group"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-stone-150">
                        <div className="space-y-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                            {service.category}
                          </span>
                          <h3 className="font-bold text-stone-900 text-sm font-serif leading-snug group-hover:text-[#55132D] transition-colors">
                            {service.name}
                          </h3>
                        </div>

                        {/* Status Switch */}
                        <button
                          type="button"
                          onClick={() => toggleServiceActive(service.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-stone-100 text-stone-500 border-stone-300'
                          }`}
                          title="Click to toggle status"
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-stone-600 line-clamp-2 my-2.5 leading-relaxed">
                        {service.description || 'Configured sacred seva in accordance with temple rituals.'}
                      </p>

                      {/* Key Attributes Pills */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200/70 mb-3">
                        <div>
                          <span className="text-[10px] text-stone-500 block">Dakshina / Fee</span>
                          <span className="font-bold text-stone-900">
                            {service.amount > 0 ? `₹${service.amount.toLocaleString()}` : 'Free / Exempt'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 block">Est. Duration</span>
                          <span className="font-semibold text-stone-800">{service.duration || '30 mins'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 block">Max Devotees</span>
                          <span className="font-semibold text-stone-800">
                            Up to {service.maxDevotees || 4} persons
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 block">Slot Quota</span>
                          <span className="font-semibold text-stone-800">
                            {service.activeSlots || 6} Slots configured
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-2.5 border-t border-stone-150 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setSlotCatFilter(service.category);
                          setCurrentView('slots');
                        }}
                        className="text-[#55132D] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Manage Slots</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setServiceModalConfig({ isOpen: true, editingService: service })}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit className="w-3 h-3 text-stone-500" />
                        <span>Configure</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table Layout */
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase">
                    <th className="p-3 text-left">Service Name</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Dakshina</th>
                    <th className="p-3 text-left">Duration</th>
                    <th className="p-3 text-left">Max Devotees</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3 font-bold text-stone-900 font-serif">
                        {service.name}
                        <div className="text-[11px] font-sans font-normal text-stone-500 truncate max-w-xs">
                          {service.description}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeStyle(service.category)}`}>
                          {service.category}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-stone-900">
                        {service.amount > 0 ? `₹${service.amount.toLocaleString()}` : 'Free'}
                      </td>
                      <td className="p-3 text-stone-700">{service.duration || '30 mins'}</td>
                      <td className="p-3 text-stone-700">{service.maxDevotees || 4} Devotees</td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => toggleServiceActive(service.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            service.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-stone-100 text-stone-500 border-stone-300'
                          }`}
                        >
                          {service.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => setServiceModalConfig({ isOpen: true, editingService: service })}
                          className="px-2.5 py-1 text-stone-700 hover:text-[#55132D] font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          VIEW B: SLOTS & AVAILABILITY
         ======================================================== */}
      {currentView === 'slots' && (
        <div className="space-y-4">
          {/* Slots Filter Bar */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={slotSearch}
                onChange={(e) => setSlotSearch(e.target.value)}
                placeholder="Search slot by timing or assigned service..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#55132D]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Filter by Category:</span>
              <select
                value={slotCatFilter}
                onChange={(e) => setSlotCatFilter(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 font-semibold text-stone-700 text-xs focus:outline-none focus:border-[#55132D]"
              >
                <option value="All">All Categories ({slots.length})</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slots Table */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="p-3 text-left">Time Slot</th>
                    <th className="p-3 text-left">Assigned Service</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Capacity & Bookings</th>
                    <th className="p-3 text-left">Assigned Priest / Sevadal</th>
                    <th className="p-3 text-left">Cutoff Time</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  {filteredSlots.map((slot) => {
                    const occ = getSlotOccupancy(slot.id, '2026-10-31');
                    const isActive = slot.status !== 'disabled';
                    const badgeStyle = getCategoryBadgeStyle(slot.category);

                    return (
                      <tr key={slot.id} className="hover:bg-stone-50/70 transition-colors">
                        {/* Time Slot Label */}
                        <td className="p-3 font-bold text-stone-900 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#55132D]" />
                            <span>{slot.label || slot.timeSlot}</span>
                          </div>
                        </td>

                        {/* Assigned Service */}
                        <td className="p-3 font-serif font-bold text-stone-800 whitespace-nowrap">
                          {slot.serviceName || 'Standard Temple Darshan'}
                        </td>

                        {/* Category Tag */}
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                            {slot.category || 'Darshan'}
                          </span>
                        </td>

                        {/* Capacity Progress Indicator */}
                        <td className="p-3 min-w-[160px]">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-stone-900">
                                {occ.bookedDevotees} / {occ.maxCapacity} Booked
                              </span>
                              <span className="text-stone-500 font-semibold">{occ.percentage}%</span>
                            </div>
                            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  occ.percentage >= 90
                                    ? 'bg-[#55132D]'
                                    : occ.percentage >= 75
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-600'
                                }`}
                                style={{ width: `${occ.percentage}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-stone-500 block">
                              {occ.availableCapacity} remaining available
                            </span>
                          </div>
                        </td>

                        {/* Assigned Priest */}
                        <td className="p-3 text-stone-700 whitespace-nowrap">
                          {slot.priestAssigned || 'Pt. Ramendra Sharma'}
                        </td>

                        {/* Cutoff Time */}
                        <td className="p-3 text-stone-500 whitespace-nowrap">
                          {slot.cutoffTime || '30 mins before'}
                        </td>

                        {/* Status Toggle */}
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => toggleSlotActive(slot.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-stone-100 text-stone-500 border-stone-300'
                            }`}
                          >
                            {isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSlotModalConfig({ isOpen: true, editingSlot: slot })}
                            className="px-2.5 py-1 text-stone-600 hover:text-[#55132D] font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ServiceModal
        isOpen={serviceModalConfig.isOpen}
        editingService={serviceModalConfig.editingService}
        onClose={() => setServiceModalConfig({ isOpen: false, editingService: null })}
      />

      <SlotModal
        isOpen={slotModalConfig.isOpen}
        editingSlot={slotModalConfig.editingSlot}
        onClose={() => setSlotModalConfig({ isOpen: false, editingSlot: null })}
      />
    </div>
  );
}

