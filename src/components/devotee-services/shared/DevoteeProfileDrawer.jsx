import OverlayPortal from '../../common/OverlayPortal';
import React, { useState, useMemo } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  Flame,
  Building2,
  CalendarCheck,
  Clock,
  ShieldCheck,
  Edit2,
  ExternalLink,
} from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function DevoteeProfileDrawer({ devotee, onClose, onEditDevotee }) {
  const { getDevoteeActivity } = useDevoteeServices();
  const [activeProfileTab, setActiveProfileTab] = useState('timeline');

  const activity = useMemo(() => {
    if (!devotee) return { all: [], darshan: [], pooja: [], donations: [], orders: [], accommodation: [] };
    return getDevoteeActivity(devotee.id);
  }, [devotee, getDevoteeActivity]);

  if (!devotee) return null;

  return (
    <OverlayPortal isOpen={true} onClose={onClose}>
      <div className="fixed inset-0 z-[9999] flex justify-end bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#55132D] to-[#681B37] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B] font-bold text-lg font-serif">
              {devotee.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-serif text-white">{devotee.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2BC6B] text-[#55132D]">
                  {devotee.segment || 'Registered Devotee'}
                </span>
              </div>
              <p className="text-xs text-[#E2BC6B]/90 font-mono mt-0.5">
                ID: {devotee.id} • Registered: {devotee.registrationDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEditDevotee && (
              <button
                onClick={() => onEditDevotee(devotee)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Edit Profile"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Devotee Info Strip */}
        <div className="px-6 py-3.5 bg-[#F8F5EF] border-b border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-start gap-2">
            <Phone className="w-3.5 h-3.5 text-[#55132D] mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">Mobile Phone</span>
              <span className="font-semibold text-stone-800 font-number">{devotee.mobile}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 min-w-0">
            <Mail className="w-3.5 h-3.5 text-[#55132D] mt-0.5 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">Email Address</span>
              <span className="font-semibold text-stone-800 truncate block text-[11px]" title={devotee.email}>
                {devotee.email || 'None'}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#55132D] mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">Location</span>
              <span className="font-semibold text-stone-800">{devotee.city}, {devotee.state}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#55132D] mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">ID Verification</span>
              <span className="font-semibold text-stone-800">{devotee.idType || 'Aadhaar Card'}</span>
            </div>
          </div>
        </div>

        {/* 5 Cumulative Metrics Bar */}
        <div className="px-6 py-3 bg-white border-b border-stone-200 grid grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-[#F8F5EF] border border-stone-200/80">
            <span className="text-sm font-bold text-stone-900 block font-number">{activity.darshan.length}</span>
            <span className="text-[10px] text-stone-500 font-medium">Darshan</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F8F5EF] border border-stone-200/80">
            <span className="text-sm font-bold text-stone-900 block font-number">{activity.pooja.length}</span>
            <span className="text-[10px] text-stone-500 font-medium">Pooja/Seva</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F8F5EF] border border-stone-200/80">
            <span className="text-sm font-bold text-stone-900 block font-number">{activity.donations.length}</span>
            <span className="text-[10px] text-stone-500 font-medium">Donations</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F8F5EF] border border-stone-200/80">
            <span className="text-sm font-bold text-stone-900 block font-number">{activity.orders.length}</span>
            <span className="text-[10px] text-stone-500 font-medium">Prasad Orders</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F8F5EF] border border-stone-200/80">
            <span className="text-sm font-bold text-stone-900 block font-number">{activity.accommodation.length}</span>
            <span className="text-[10px] text-stone-500 font-medium">Stays</span>
          </div>
        </div>

        {/* Internal Tabs - Shared Consistent Pill Design without Ugly Scrollbar */}
        <div className="px-6 py-2.5 bg-[#F8F5EF] border-b border-stone-200">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {[
              { id: 'timeline', label: 'Activity', count: activity.all.length, icon: Clock },
              { id: 'darshan', label: 'Darshan', count: activity.darshan.length, icon: CalendarCheck },
              { id: 'pooja', label: 'Pooja & Seva', count: activity.pooja.length, icon: Flame },
              { id: 'donations', label: 'Donations', count: activity.donations.length, icon: CreditCard },
              { id: 'orders', label: 'Store Orders', count: activity.orders.length, icon: ShoppingBag },
              { id: 'accommodation', label: 'Accommodation', count: activity.accommodation.length, icon: Building2 },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeProfileTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#55132D] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/60'
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-number font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: Consolidated Timeline */}
          {activeProfileTab === 'timeline' && (
            <div className="space-y-4">
              {activity.all.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400">
                  No recorded activity found for this devotee profile.
                </div>
              ) : (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {activity.all.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-[#55132D] ring-4 ring-white" />
                      <div className="p-3.5 rounded-xl border border-stone-200/90 bg-white hover:border-[#B68A36]/50 shadow-2xs transition-colors">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-stone-900">{item.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-stone-500">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#55132D]">{item.type}</span>
                            <span>•</span>
                            <span className="font-mono">{item.id}</span>
                            <span>•</span>
                            <span>{item.date}</span>
                          </div>
                          {item.amount > 0 && (
                            <span className="font-bold text-stone-900">
                              ₹{Number(item.amount).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Darshan Bookings */}
          {activeProfileTab === 'darshan' && (
            <div className="space-y-3">
              {activity.darshan.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400">No Darshan bookings recorded.</div>
              ) : (
                activity.darshan.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl border border-stone-200/90 bg-white hover:border-[#B68A36]/50 shadow-2xs transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm font-heading">{b.serviceName}</span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-[#55132D] border border-stone-200/60">
                        {b.id}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-number text-stone-500">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {b.visitDate} ({b.slotLabel})
                      </span>
                      <span className="font-number font-semibold text-stone-700">
                        {b.devoteesCount} {b.devoteesCount === 1 ? 'Devotee' : 'Devotees'}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
                      <span className="flex items-center gap-1">
                        Status: <strong className="text-emerald-700 font-semibold">{b.status}</strong>
                      </span>
                      <span className="font-number font-bold text-stone-900 text-sm">
                        ₹{Number(b.amount || 0).toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal text-stone-500 pl-1 font-sans">({b.paymentStatus})</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Pooja & Seva */}
          {activeProfileTab === 'pooja' && (
            <div className="space-y-3">
              {activity.pooja.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400">No Pooja or Seva bookings recorded.</div>
              ) : (
                activity.pooja.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-stone-200/90 bg-white hover:border-[#B68A36]/50 shadow-2xs transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm font-heading">{p.serviceName}</span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-[#55132D] border border-stone-200/60">
                        {p.id}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-number text-stone-500">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {p.preferredDate} at {p.preferredTime}
                      </span>
                      <span className="text-stone-700">
                        Gotra: <strong>{p.gotra || 'Kashyapa'}</strong>
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
                      <span className="flex items-center gap-1">
                        Status: <strong className="text-amber-800 font-semibold">{p.bookingStatus}</strong>
                      </span>
                      <span className="font-number font-bold text-stone-900 text-sm">
                        ₹{Number(p.amount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: Donations */}
          {activeProfileTab === 'donations' && (
            <div className="space-y-3">
              {activity.donations.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400">No donation contributions recorded.</div>
              ) : (
                activity.donations.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl border border-stone-200/90 bg-white hover:border-[#B68A36]/50 shadow-2xs transition-colors space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm font-heading">{d.category}</h4>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                          <span className="font-number">{d.date}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] bg-stone-100 px-1.5 py-0.2 rounded text-stone-600">
                            Receipt: {d.receiptNumber || 'REC-2026-8809'}
                          </span>
                        </div>
                      </div>
                      <span className="font-number font-bold text-base text-[#55132D] shrink-0">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 text-stone-600">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                        Mode: <strong className="text-stone-800">{d.paymentMode}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {d.paymentStatus || 'Verified'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: Store Orders */}
          {activeProfileTab === 'orders' && (
            <div className="space-y-3">
              {activity.orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400">No Prasad or store orders recorded.</div>
              ) : (
                activity.orders.map((o) => (
                  <div key={o.id} className="p-4 rounded-xl border border-stone-200/90 bg-white hover:border-[#B68A36]/50 shadow-2xs transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm font-heading">Order {o.id}</span>
                      <span className="font-number font-bold text-base text-[#55132D]">
                        ₹{Number(o.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-100">
                      {o.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                    </div>
                    <div className="text-xs text-stone-500 flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1">
                        Status: <strong className="text-blue-700 font-semibold">{o.orderStatus}</strong>
                      </span>
                      <span className="text-stone-500">Method: {o.fulfilmentMethod}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 6: Accommodation */}
          {activeProfileTab === 'accommodation' && (
            <div className="space-y-3">
              {activity.accommodation.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400">No accommodation stays recorded.</div>
              ) : (
                activity.accommodation.map((a) => (
                  <div key={a.id} className="p-4 rounded-xl border border-stone-200/90 bg-white hover:border-[#B68A36]/50 shadow-2xs transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm font-heading">{a.accommodationType}</span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-[#55132D] border border-stone-200/60">
                        {a.id}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-number text-stone-500">
                        Stay: {a.checkInDate} to {a.checkOutDate}
                      </span>
                      <span className="text-stone-700">Unit: {a.allocatedUnit || 'Pending'}</span>
                    </div>
                    <div className="text-xs text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
                      <span className="flex items-center gap-1">
                        Status: <strong className="text-purple-700 font-semibold">{a.status}</strong>
                      </span>
                      <span className="font-number font-bold text-stone-900 text-sm">
                        ₹{Number(a.amount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
          <span className="text-stone-500">Mata Tripura Sundari Devotee Directory</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
      </div>
    </OverlayPortal>
  );
}
