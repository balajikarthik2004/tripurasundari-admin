import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';

// 1. Dashboard
import Dashboard from '../pages/Dashboard';

// 2. Approvals & Alerts (Consolidated)
import ApprovalsAlerts from '../pages/ApprovalsAlerts';

// 3. Bookings & Sacred Services (Consolidated)
import SacredServices from '../pages/SacredServices';

// 4. Annadanam (Standalone)
import Annadanam from '../pages/Annadanam';

// 5. Devotees & Grievances (Consolidated)
import DevoteesGrievances from '../pages/DevoteesGrievances';

// 6. Donations & Funds (Standalone)
import Donations from '../pages/Donations';

// 7. Prasad & Store (Standalone)
import PrasadStore from '../pages/PrasadStore';

// 8. Facilities & Accommodation (Standalone)
import Facilities from '../pages/Facilities';

// 9. AI Heatmap & Crowd Control (Standalone)
import CrowdControl from '../pages/CrowdControl';

// 10. CCTV Monitor (Standalone)
import CctvMonitoring from '../pages/CctvMonitoring';

// 11. Volunteer & Staff (Standalone)
import StaffManagement from '../pages/StaffManagement';

// 12. Temple Calendar (Standalone)
import TempleCalendar from '../pages/TempleCalendar';

// 13. Campus Logistics (Consolidated)
import CampusLogistics from '../pages/CampusLogistics';

// 14. Mela & Festival Management (Consolidated)
import MelaFestival from '../pages/MelaFestival';

// 15. Content Management
import TempleInformation from '../pages/TempleInformation';
import VisitGuide from '../pages/VisitGuide';
import ContentGuide from '../pages/ContentGuide';

// 16. Reports & Administration
import ReportsAdmin from '../pages/ReportsAdmin';
import TempleSettings from '../pages/TempleSettings';

// Fallbacks
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Default route redirect to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* ============================================================ */}
        {/* 16 PRIMARY SIDEBAR ROUTES (PHASE 1 CONSOLIDATION)            */}
        {/* ============================================================ */}

        {/* 1. OVERVIEW */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="approvals-alerts" element={<ApprovalsAlerts />} />

        {/* 2. DEVOTEE SERVICES */}
        <Route path="sacred-services" element={<SacredServices />} />
        <Route path="annadanam" element={<Annadanam />} />
        <Route path="devotees-grievances" element={<DevoteesGrievances />} />
        <Route path="donations" element={<Donations />} />
        <Route path="prasad-store" element={<PrasadStore />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="accommodation" element={<Facilities />} />

        {/* 3. TEMPLE OPERATIONS */}
        <Route path="crowd-control" element={<CrowdControl />} />
        <Route path="cctv-monitoring" element={<CctvMonitoring />} />
        <Route path="staff-management" element={<StaffManagement />} />
        <Route path="temple-calendar" element={<TempleCalendar />} />
        <Route path="campus-logistics" element={<CampusLogistics />} />
        <Route path="mela-festival" element={<MelaFestival />} />

        {/* 4. CONTENT MANAGEMENT (Two distinct, dedicated sections) */}
        <Route path="temple-content" element={<TempleInformation />} />
        <Route path="visitors-info" element={<VisitGuide />} />
        <Route path="content-guide" element={<Navigate to="/temple-content" replace />} />

        {/* 5. INSIGHTS & ADMINISTRATION */}
        <Route path="reports-admin" element={<ReportsAdmin />} />
        <Route path="settings" element={<TempleSettings isEmbedded={false} />} />
        <Route path="temple-settings" element={<TempleSettings isEmbedded={false} />} />

        {/* ============================================================ */}
        {/* BACKWARD-COMPATIBLE ROUTE ALIASES (100% PRESERVED LINKS)     */}
        {/* ============================================================ */}
        <Route path="approvals" element={<ApprovalsAlerts />} />
        <Route path="alerts" element={<ApprovalsAlerts />} />

        <Route path="bookings" element={<SacredServices />} />
        <Route path="pooja-seva" element={<SacredServices />} />
        <Route path="gate-management" element={<SacredServices />} />
        <Route path="ritual-schedule" element={<SacredServices />} />

        <Route path="devotees" element={<DevoteesGrievances />} />
        <Route path="grievances" element={<DevoteesGrievances />} />

        <Route path="parking" element={<CampusLogistics />} />
        <Route path="vendors" element={<CampusLogistics />} />

        <Route path="events" element={<MelaFestival />} />
        <Route path="events-festivals" element={<MelaFestival />} />
        <Route path="mela-management" element={<MelaFestival />} />

        <Route path="temple-information" element={<TempleInformation />} />
        <Route path="visit-guide" element={<VisitGuide />} />
        <Route path="announcements" element={<ContentGuide />} />

        <Route path="reports" element={<ReportsAdmin />} />
        <Route path="users" element={<Navigate to="/settings?tab=rbac" replace />} />
        <Route path="users-roles" element={<Navigate to="/settings?tab=rbac" replace />} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
