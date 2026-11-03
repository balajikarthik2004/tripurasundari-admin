import React from 'react';
import DashboardHero from '../components/dashboard/DashboardHero';
import DashboardKpiCard from '../components/dashboard/DashboardKpiCard';
import OperationalStrip from '../components/dashboard/OperationalStrip';
import CrowdStatusCard from '../components/dashboard/CrowdStatusCard';
import PremisesMonitoringCard from '../components/dashboard/PremisesMonitoringCard';
import PilgrimWelfareCard from '../components/dashboard/PilgrimWelfareCard';
import AIOperationsForecast from '../components/dashboard/AIOperationsForecast';
import RecentActivityTable from '../components/dashboard/RecentActivityTable';
import QuickActions from '../components/dashboard/QuickActions';
import RitualTimeline from '../components/dashboard/RitualTimeline';
import { DASHBOARD_KPIS } from '../data/dashboardData';

export default function Dashboard() {
  return (
    <div className="space-y-3.5 sm:space-y-4 pb-8 max-w-[1780px] mx-auto">
      {/* 1. Sleek, Compact Executive Hero Strip */}
      <section aria-label="Executive Greeting and Festival Overview">
        <DashboardHero />
      </section>

      {/* 2. Five Compact, Consistent KPI Metric Cards */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-3.5">
          {DASHBOARD_KPIS.map((kpi) => (
            <DashboardKpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>

      {/* 3. Compact Operational Summary Strip */}
      <section aria-label="Operational Summary Strip">
        <OperationalStrip />
      </section>

      {/* 4. Main Operations Overview (Balanced 3-Column Grid) */}
      <section aria-label="Main Operations Overview">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-stretch">
          <div className="h-full">
            <CrowdStatusCard />
          </div>
          <div className="h-full">
            <PremisesMonitoringCard />
          </div>
          <div className="h-full">
            <PilgrimWelfareCard />
          </div>
        </div>
      </section>

      {/* 5. AI Operations Forecast (Full-Width Predictive Insights & Actionable Recommendations) */}
      <section aria-label="AI Operations Forecast">
        <AIOperationsForecast />
      </section>

      {/* 6. Administrative Activity (Balanced 3-Column Grid) */}
      <section aria-label="Administrative Activity and Shortcuts">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* Table (5 cols on lg, 5 cols on xl) */}
          <div className="lg:col-span-5 xl:col-span-5 h-full">
            <RecentActivityTable />
          </div>

          {/* Quick Actions (3 cols on lg, 3 cols on xl - compact 2x3 matrix) */}
          <div className="lg:col-span-3 xl:col-span-3 h-full">
            <QuickActions />
          </div>

          {/* Ritual Schedule (4 cols on lg, 4 cols on xl - increased width) */}
          <div className="lg:col-span-4 xl:col-span-4 h-full">
            <RitualTimeline />
          </div>
        </div>
      </section>

      {/* Footer Notice */}
      <footer className="pt-3 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between text-xs text-temple-text-muted gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-temple-text-secondary">
            MATA TRIPURA SUNDARI TEMPLE TRUST
          </span>
          <span>•</span>
          <span>Official Administration Portal</span>
        </div>

        <div className="text-[11px] font-mono text-temple-text-muted">
          Matabari, Udaipur, Gomati District, Tripura – 799114
        </div>
      </footer>
    </div>
  );
}
