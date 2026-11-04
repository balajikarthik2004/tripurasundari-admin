import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  Layers,
  Ticket,
  Plus,
  CalendarCheck,
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
      {/* ========================================================
          TOP STICKY NAVIGATION BAR (Prominent, Fixed & Accessible)
         ======================================================== */}
      <header className="sticky top-0 z-30 bg-[#F8F5EF]/95 backdrop-blur-md py-2.5 -mt-2 -mx-4 px-4 sm:-mx-5 sm:px-5 lg:-mx-6 lg:px-6 border-b border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all">
        {/* Left: Module Title & Context */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#55132D] text-white flex items-center justify-center shadow-xs shrink-0">
            <CalendarCheck className="w-5 h-5 text-[#E2BC6B]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-stone-900 font-serif leading-tight">
              Bookings & Sacred Services
            </h1>
            <p className="text-[11px] text-stone-500 font-sans hidden sm:block">
              Administrative booking governance & live devotee demand analytics
            </p>
          </div>
        </div>

        {/* Center / Right: Primary Navigation Pill Bar (Overview | Services | Bookings) */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Exactly matches user reference image pill container */}
          <nav
            aria-label="Bookings module primary navigation"
            className="inline-flex items-center gap-1 p-1 bg-white/90 backdrop-blur-xs rounded-2xl sm:rounded-full border border-stone-200/90 shadow-2xs text-xs sm:text-sm"
          >
            {/* TAB 1: OVERVIEW */}
            <button
              type="button"
              onClick={() => handleTabChange('overview')}
              className={`px-4 py-2 font-bold rounded-xl sm:rounded-full transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer select-none ${
                activeTab === 'overview'
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${activeTab === 'overview' ? 'text-[#E2BC6B]' : 'text-[#C88728]'}`} />
              <span>Overview</span>
            </button>

            {/* TAB 2: SERVICES */}
            <button
              type="button"
              onClick={() => handleTabChange('services')}
              className={`px-4 py-2 font-bold rounded-xl sm:rounded-full transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer select-none ${
                activeTab === 'services'
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Layers className={`w-4 h-4 ${activeTab === 'services' ? 'text-[#E2BC6B]' : 'text-[#C88728]'}`} />
              <span>Services</span>
            </button>

            {/* TAB 3: BOOKINGS */}
            <button
              type="button"
              onClick={() => handleTabChange('bookings')}
              className={`px-4 py-2 font-bold rounded-xl sm:rounded-full transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer select-none ${
                activeTab === 'bookings'
                  ? 'bg-[#55132D] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Ticket className={`w-4 h-4 ${activeTab === 'bookings' ? 'text-[#E2BC6B]' : 'text-[#C88728]'}`} />
              <span>Bookings</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold font-sans ml-0.5 ${
                  activeTab === 'bookings'
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 text-stone-800'
                }`}
              >
                {bookings.length}
              </span>
            </button>
          </nav>

          {/* Quick Create Booking Button */}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl sm:rounded-full shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
            <span className="hidden sm:inline">New Booking</span>
          </button>
        </div>
      </header>

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
