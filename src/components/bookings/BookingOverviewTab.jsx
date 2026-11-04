import React, { useState } from 'react';
import { useDarshanBookings } from '../../context/DarshanBookingContext';
import BookingJourneySankey from './BookingJourneySankey';
import BookingDemandMatrix from './BookingDemandMatrix';

export default function BookingOverviewTab({ onSwitchTab, onNavigateWithFilter }) {
  const { bookings, slots, setDrilldownFilter } = useDarshanBookings();

  // Top Filter States for Analytics
  const [datePeriod, setDatePeriod] = useState('Today'); // 'Today' | '7 Days' | '30 Days'
  const [serviceFilter, setServiceFilter] = useState('All');

  // Unified Handler when user clicks on a Sankey ribbon/node or Matrix bubble
  const handleDrilldown = (filterOptions) => {
    if (setDrilldownFilter) {
      setDrilldownFilter((prev) => ({
        ...prev,
        ...filterOptions,
      }));
    }
    if (onSwitchTab) {
      onSwitchTab('bookings', filterOptions);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. PRIMARY VISUALIZATION A: Booking Journey Flow (Sankey Diagram) */}
      <BookingJourneySankey
        bookings={bookings}
        onNavigateWithFilter={handleDrilldown}
      />

      {/* 2. PRIMARY VISUALIZATION B: Booking Demand Matrix (Bubble Matrix / Heatmap) */}
      <BookingDemandMatrix
        bookings={bookings}
        slots={slots}
        datePeriod={datePeriod}
        onDatePeriodChange={setDatePeriod}
        serviceFilter={serviceFilter}
        onServiceFilterChange={setServiceFilter}
        onCellClick={handleDrilldown}
      />
    </div>
  );
}
