import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from '../dashboard/DashboardHeader';
import { useSidebar } from '../../hooks/useSidebar';

export default function AdminLayout() {
  const sidebar = useSidebar();
  const location = useLocation();

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        sidebar.toggleCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebar]);

  // Scroll to top of content when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContent = document.getElementById('main-workspace');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-body text-temple-text-primary antialiased selection:bg-[#E2BC6B]/30 selection:text-temple-burgundy">
      {/* Complete Approved Temple Admin Sidebar */}
      <Sidebar
        isCollapsed={sidebar.isCollapsed}
        toggleCollapse={sidebar.toggleCollapse}
        isMobileOpen={sidebar.isMobileOpen}
        closeMobile={sidebar.closeMobile}
        expandedGroups={sidebar.expandedGroups}
        toggleGroup={sidebar.toggleGroup}
      />

      {/* Main Workspace Area (adapts to sidebar width on desktop) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebar.isCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[280px]'
        }`}
      >
        {/* Fixed / Sticky Top Header with solid background to prevent see-through */}
        <DashboardHeader onToggleMobileSidebar={sidebar.toggleMobile} />

        {/* ========================================================
            Main Workspace Viewport (Natural vertical scrolling, no double scrollbars)
           ======================================================== */}
        <main
          id="main-workspace"
          className="flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 max-w-full overflow-x-hidden"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
