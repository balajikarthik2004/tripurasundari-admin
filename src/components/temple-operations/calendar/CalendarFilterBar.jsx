import React from 'react';
import {
  Filter,
  Search,
  X,
  Users,
  Flame,
  Sparkles,
  Clock,
  Layers,
} from 'lucide-react';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

export default function CalendarFilterBar() {
  const {
    categoryFilter,
    setCategoryFilter,
    shiftFilter,
    setShiftFilter,
    staffFilter,
    setStaffFilter,
    searchQuery,
    setSearchQuery,
    shiftTemplates,
    staffList,
  } = useTempleCalendar();

  const categories = [
    { id: 'ALL', label: 'All Items', icon: Layers, color: '#55132D' },
    { id: 'SHIFTS', label: 'Staff Duties', icon: Users, color: '#55132D' },
    { id: 'RITUALS', label: 'Rituals & Aarti', icon: Flame, color: '#B68A36' },
    { id: 'FESTIVALS', label: 'Festivals', icon: Sparkles, color: '#D97706' },
    { id: 'TASKS', label: 'Admin Tasks', icon: Clock, color: '#475569' },
  ];

  const hasActiveFilters =
    categoryFilter !== 'ALL' ||
    shiftFilter !== 'ALL' ||
    staffFilter !== 'ALL' ||
    searchQuery.trim().length > 0;

  const clearAllFilters = () => {
    setCategoryFilter('ALL');
    setShiftFilter('ALL');
    setStaffFilter('ALL');
    setSearchQuery('');
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-0.5">
        {categories.map((cat) => {
          const isSelected = categoryFilter === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#55132D] text-white border-[#55132D] shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Controls: Shift dropdown, Staff dropdown, Search input, Clear */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Shift Selector */}
        <select
          value={shiftFilter}
          onChange={(e) => setShiftFilter(e.target.value)}
          className="text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-700 font-medium focus:outline-none focus:border-[#55132D]"
          title="Filter by shift"
        >
          <option value="ALL">All Shifts</option>
          {shiftTemplates.map((s) => (
            <option key={s.id} value={s.id}>
              {s.shortName} Shift
            </option>
          ))}
        </select>

        {/* Staff Filter Dropdown */}
        <select
          value={staffFilter}
          onChange={(e) => setStaffFilter(e.target.value)}
          className="text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-700 font-medium focus:outline-none focus:border-[#55132D] max-w-[150px]"
          title="Filter by personnel"
        >
          <option value="ALL">All Personnel</option>
          {staffList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.role})
            </option>
          ))}
        </select>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search duties, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#55132D] w-44"
          />
        </div>

        {/* Clear Filters Reset */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
            title="Reset filters"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}

