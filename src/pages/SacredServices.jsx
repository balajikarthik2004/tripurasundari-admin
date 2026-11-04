import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  Layers,
  Ticket,
  Plus,
} from 'lucide-react';
import { DarshanBookingProvider, useDarshanBookings } from '../context/DarshanBookingContext';
import ModulePageHeader from '../components/devotee-services/shared/ModulePageHeader';
import ModuleTabs from '../components/devotee-services/shared/ModuleTabs';
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

  // Strictly 3 primary tabs matching standard ModuleTabs design
  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'bookings', label: 'Bookings', icon: Ticket, badge: bookings.length },
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Page Header with Title & Action */}
      <ModulePageHeader
        title="Bookings & Sacred Services"
        primaryActionLabel="New Booking"
        onPrimaryAction={() => setIsCreateOpen(true)}
        primaryActionIcon={Plus}
      />

      {/* 2. Top Navigation Bar (Full-Width ModuleTabs exactly matching expected design) */}
      <ModuleTabs
        tabs={tabsConfig}
        activeTab={activeTab}
        onChangeTab={handleTabChange}
      />

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
