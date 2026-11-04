import React from 'react';
import DashboardHero from '../components/dashboard/DashboardHero';
import DashboardKpiCard from '../components/dashboard/DashboardKpiCard';
import CrowdStatusCard from '../components/dashboard/CrowdStatusCard';
import PremisesMonitoringCard from '../components/dashboard/PremisesMonitoringCard';
import PilgrimWelfareCard from '../components/dashboard/PilgrimWelfareCard';
import AIOperationsForecast from '../components/dashboard/AIOperationsForecast';
import RecentActivityTable from '../components/dashboard/RecentActivityTable';
import QuickActions from '../components/dashboard/QuickActions';
import { DASHBOARD_KPIS } from '../data/dashboardData';

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1780px] mx-auto">
      {/* 1. Greeting Row: Slim single row */}
      <section aria-label="Greeting and Upcoming Festival">
        <DashboardHero />
      </section>

      {/* 2. KPI Row: Exactly 4 Equal Cards (Responsive 4 -> 2 -> 1) */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DASHBOARD_KPIS.map((kpi) => (
            <DashboardKpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>

      {/* 3. Main Operations Row: 3 Equal-Height Cards */}
      <section aria-label="Live Temple Operations">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <CrowdStatusCard />
          <PremisesMonitoringCard />
          <PilgrimWelfareCard />
        </div>
      </section>

      {/* 4. Operations Intelligence & Activity: Equal 50% split */}
      <section aria-label="Transactions & Operations Intelligence">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="flex flex-col h-full">
            <RecentActivityTable />
          </div>
          <div className="flex flex-col h-full">
            <AIOperationsForecast />
          </div>
        </div>
      </section>

      {/* 5. Quick Actions: Final bottom section */}
      <section aria-label="Quick Administrative Actions">
        <QuickActions />
      </section>
    </div>
  );
}
