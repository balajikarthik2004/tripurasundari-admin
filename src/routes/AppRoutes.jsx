import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import Dashboard from '../pages/Dashboard';

// Devotee Services Modules (Phase 3)
import DarshanBookings from '../pages/DarshanBookings';
import PoojaSeva from '../pages/PoojaSeva';
import Devotees from '../pages/Devotees';
import Donations from '../pages/Donations';
import PrasadStore from '../pages/PrasadStore';
import Facilities from '../pages/Facilities';

// Temple Operations Modules (Phase 4)
import CrowdControl from '../pages/CrowdControl';
import GateManagement from '../pages/GateManagement';
import StaffManagement from '../pages/StaffManagement';
import CctvMonitoring from '../pages/CctvMonitoring';
import Vendors from '../pages/Vendors';
import Parking from '../pages/Parking';
import MelaManagement from '../pages/MelaManagement';
import RitualSchedule from '../pages/RitualSchedule';
import TempleCalendar from '../pages/TempleCalendar';

// Content Management Modules (Phase 5)
import TempleInformation from '../pages/TempleInformation';
import EventsFestivals from '../pages/EventsFestivals';
import Announcements from '../pages/Announcements';
import VisitGuide from '../pages/VisitGuide';

// Overview & Management Desks
import Approvals from '../pages/Approvals';
import Alerts from '../pages/Alerts';

// Insights & Administration Modules (Phase 6)
import Reports from '../pages/Reports';
import Grievances from '../pages/Grievances';
import UsersRoles from '../pages/UsersRoles';
import TempleSettings from '../pages/TempleSettings';

// Fallbacks
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Default route redirect to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Overview */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="alerts" element={<Alerts />} />

        {/* Devotee Services */}
        <Route path="bookings" element={<DarshanBookings />} />
        <Route path="pooja-seva" element={<PoojaSeva />} />
        <Route path="devotees" element={<Devotees />} />
        <Route path="donations" element={<Donations />} />
        <Route path="prasad-store" element={<PrasadStore />} />
        <Route path="facilities" element={<Facilities />} />

        {/* Temple Operations */}
        <Route path="crowd-control" element={<CrowdControl />} />
        <Route path="gate-management" element={<GateManagement />} />
        <Route path="temple-calendar" element={<TempleCalendar />} />
        <Route path="staff-management" element={<StaffManagement />} />
        <Route path="cctv-monitoring" element={<CctvMonitoring />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="parking" element={<Parking />} />
        <Route path="mela-management" element={<MelaManagement />} />
        <Route path="ritual-schedule" element={<RitualSchedule />} />

        {/* Content Management */}
        <Route path="temple-information" element={<TempleInformation />} />
        <Route path="events" element={<EventsFestivals />} />
        <Route path="events-festivals" element={<EventsFestivals />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="visit-guide" element={<VisitGuide />} />

        {/* Insights & Administration (Phase 6) */}
        <Route path="reports" element={<Reports />} />
        <Route path="grievances" element={<Grievances />} />
        <Route path="users" element={<UsersRoles />} />
        <Route path="users-roles" element={<UsersRoles />} />
        <Route path="settings" element={<TempleSettings />} />
        <Route path="temple-settings" element={<TempleSettings />} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
