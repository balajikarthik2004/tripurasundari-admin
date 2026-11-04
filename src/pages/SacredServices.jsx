import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  Layers,
  Ticket,
  Plus,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { DarshanBookingProvider, useDarshanBookings } from '../context/DarshanBookingContext';
import BookingOverviewTab from '../components/bookings/BookingOverviewTab';
import ServicesManagementTab from '../components/bookings/ServicesManagementTab';
import AllBookingsTab from '../components/bookings/AllBookingsTab';
import BookingDetailsDrawer from '../components/bookings/BookingDetailsDrawer';
import CreateBookingModal from '../components/bookings/CreateBookingModal';

function SacredServicesContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  // The 3 Strictly Primary Navigation Tabs: 'overview' | 'services' | 'bookings'
  const initialTab =
    urlTab === 'services' || urlTab === 'catalogue' || urlTab === 'slots' || urlTab === 'other_sevas' || urlTab === 'pooja'
      ? 'services'
      : urlTab === 'bookings' || urlTab === 'all' || urlTab === 'darshan'
      ? 'bookings'
      : 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedBookingForDrawer, setSelectedBookingForDrawer] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { bookings, setDrilldownFilter } = useDarshanBookings();

  useEffect(() => {
    if (urlTab === 'overview' || urlTab === 'services' || urlTab === 'bookings') {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (tab, filterOptions = null) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    if (filterOptions && setDrilldownFilter) {
      setDrilldownFilter((prev) => ({
        ...prev,
        ...filterOptions,
      }));
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Page Header */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
              Bookings & Sacred Services
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1 ml-10">
            Administrative booking governance, seva catalogue, slot quotas, and live devotee demand analytics.
          </p>
        </div>

        {/* Right Section: Primary 3 Navigation Tabs + Action Button */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
          {/* Strictly 3 Primary Tabs: Overview, Services, Bookings */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200/80 text-xs">
            {/* TAB 1: OVERVIEW */}
            <button
              type="button"
              onClick={() => handleTabChange('overview')}
              className={`px-3.5 sm:px-4 py-2 font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Overview</span>
            </button>

            {/* TAB 2: SERVICES */}
            <button
              type="button"
              onClick={() => handleTabChange('services')}
              className={`px-3.5 sm:px-4 py-2 font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Services</span>
            </button>

            {/* TAB 3: BOOKINGS */}
            <button
              type="button"
              onClick={() => handleTabChange('bookings')}
              className={`px-3.5 sm:px-4 py-2 font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Bookings</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-sans font-bold">
                {bookings.length}
              </span>
            </button>
          </div>

          {/* Quick Create Booking Button */}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          SECTION 1: OVERVIEW — Booking Analytics
          (Journey Flow Sankey & Demand Matrix Heatmap, NO KPI Cards)
         ======================================================== */}
      {activeTab === 'overview' && (
        <BookingOverviewTab
          onSwitchTab={handleTabChange}
        />
      )}

      {/* ========================================================
          SECTION 2: SERVICES — Catalogue & Slot Management
         ======================================================== */}
      {activeTab === 'services' && (
        <ServicesManagementTab initialView="catalogue" />
      )}

      {/* ========================================================
          SECTION 3: BOOKINGS — Individual Devotee Booking Management
         ======================================================== */}
      {activeTab === 'bookings' && (
        <AllBookingsTab
          onOpenDetails={setSelectedBookingForDrawer}
          onOpenCreate={() => setIsCreateOpen(true)}
        />
      )}

      {/* Shared Modals & Drawers */}
      <BookingDetailsDrawer
        booking={selectedBookingForDrawer}
        isOpen={Boolean(selectedBookingForDrawer)}
        onClose={() => setSelectedBookingForDrawer(null)}
      />

      <CreateBookingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}

export default function SacredServices() {
  return (
    <DarshanBookingProvider>
      <SacredServicesContent />
    </DarshanBookingProvider>
  );
}
