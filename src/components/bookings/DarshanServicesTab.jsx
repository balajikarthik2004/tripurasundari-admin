import React, { useMemo } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Users,
  Shield,
  Sparkles,
  Ticket,
  Clock,
  MapPin,
} from 'lucide-react';
import { useDarshanBookings } from '../../context/DarshanBookingContext';

export default function DarshanServicesTab({ onOpenAddService, onOpenEditService }) {
  const { services, toggleServiceActive } = useDarshanBookings();

  // Metrics
  const metrics = useMemo(() => {
    const active = services.filter((s) => s.status === 'active').length;
    const free = services.filter((s) => s.isFree || (Number(s.fee ?? s.amount) === 0)).length;
    const paid = services.filter((s) => !s.isFree && (Number(s.fee ?? s.amount) > 0)).length;
    const totalDailyQuota = services.reduce((sum, s) => sum + (Number(s.dailyQuota) || 0), 0);
    return { active, free, paid, totalDailyQuota };
  }, [services]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Special':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'VIP':
        return 'bg-[#55132D]/10 text-[#55132D] border-[#55132D]/30';
      case 'Assisted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Ritual':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'General':
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Configured Services</div>
            <div className="text-2xl font-bold font-number text-stone-900 mt-1">{services.length}</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">{metrics.active} active now</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#55132D]/10 text-[#55132D] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Free Darshan Options</div>
            <div className="text-2xl font-bold font-number text-emerald-900 mt-1">{metrics.free}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Zero entry fee</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Special / VIP Tiers</div>
            <div className="text-2xl font-bold font-number text-stone-900 mt-1">{metrics.paid}</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Priority expedited queues</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Total Daily Allotment</div>
            <div className="text-2xl font-bold font-number text-stone-900 mt-1">
              {metrics.totalDailyQuota.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Devotees quota capacity</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Services Catalogue Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-serif">
            Darshan Service Categories & Quota Policy
          </h3>
        </div>
        <button
          onClick={onOpenAddService}
          className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const isActive = service.status === 'active';
          return (
            <div
              key={service.id}
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                isActive ? 'border-stone-200/90 hover:border-[#B68A36]/50' : 'border-stone-200 bg-stone-50/60 opacity-80'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryColor(
                        service.category
                      )}`}
                    >
                      {service.category}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 font-serif mt-1.5">
                      {service.name}
                    </h4>
                  </div>
                  {/* Status Toggle Switch */}
                  <button
                    onClick={() => toggleServiceActive(service.id)}
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
                    }`}
                    title="Click to toggle status"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                    <span>{isActive ? 'Active' : 'Inactive'}</span>
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-stone-600 leading-relaxed mb-4 min-h-[36px]">
                  {service.description}
                </p>

                {/* Parameters List */}
                <div className="space-y-2 py-3 border-y border-stone-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Service Fee:</span>
                    <span className="font-bold text-stone-900">
                      {(service.isFree || Number(service.fee ?? service.amount ?? 0) === 0)
                        ? 'Free (Zero Cost)'
                        : `₹${(Number(service.fee ?? service.amount) || 0).toLocaleString('en-IN')} / Devotee`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Daily Quota:</span>
                    <span className="font-semibold text-stone-800">
                      {service.dailyQuota ? Number(service.dailyQuota).toLocaleString('en-IN') : 'Unlimited'} Devotees
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Max Devotees / Pass:</span>
                    <span className="font-semibold text-stone-800">{service.maxDevoteesPerBooking || 6} persons</span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-stone-500 whitespace-nowrap">Allowed Gates:</span>
                    <span className="font-medium text-stone-800 text-right text-[11px]">
                      {Array.isArray(service.allowedGates)
                        ? service.allowedGates.join(', ')
                        : service.allowedGates || 'West Entrance (Main)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Notice & Edit */}
              <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-stone-500 truncate max-w-[200px]" title={service.reportingTimeNotice}>
                  <Clock className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                  <span className="truncate">{service.reportingTimeNotice || 'Report 20m before slot'}</span>
                </div>
                <button
                  onClick={() => onOpenEditService(service)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#55132D] hover:bg-[#55132D]/10 rounded-md transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Configure</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

