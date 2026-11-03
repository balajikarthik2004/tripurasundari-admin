import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import TempleLogo from '../common/TempleLogo';
import SidebarGroup from './SidebarGroup';
import Tooltip from '../common/Tooltip';
import { NAVIGATION_GROUPS } from '../../data/navigationData';
import { TEMPLE_INFO } from '../../utils/constants';

export default function Sidebar({
  isCollapsed,
  toggleCollapse,
  isMobileOpen,
  closeMobile,
  expandedGroups,
  toggleGroup,
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 drawer-backdrop lg:hidden transition-opacity duration-300"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#55132D] text-white border-r border-[#400D21] transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          /* Desktop Width */
          isCollapsed ? 'lg:w-[76px]' : 'lg:w-[280px]'
        } ${
          /* Mobile Drawer Position */
          isMobileOpen ? 'translate-x-0 w-[290px]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* ========================================================
            A. FIXED TOP BRANDING HEADER
           ======================================================== */}
        <div className="flex-shrink-0 h-[88px] px-4 flex items-center justify-between border-b border-white/10 bg-[#4F1129]/95 backdrop-blur-sm relative z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Temple Logo */}
            <div className="flex-shrink-0 p-1 rounded-lg bg-black/15 border border-[#E2BC6B]/30 shadow-inner">
              <TempleLogo className="w-8 h-8" />
            </div>

            {/* Temple Branding Text (Hidden when collapsed on desktop) */}
            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0 flex flex-col justify-center">
                <span className="font-serif text-lg font-bold tracking-tight text-white leading-tight truncate">
                  Tripura Sundari
                </span>
                <span className="text-[13px] font-medium tracking-wide text-[#EADECF]/90 leading-tight mt-0.5">
                  Admin Portal
                </span>
              </div>
            )}
          </div>

          {/* Close button for Mobile drawer */}
          <button
            type="button"
            onClick={closeMobile}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 lg:hidden focus:outline-none"
            aria-label="Close sidebar drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================
            B. INDEPENDENTLY SCROLLABLE NAVIGATION AREA
           ======================================================== */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-3 space-y-1 relative z-10">
          {NAVIGATION_GROUPS.map((group) => (
            <SidebarGroup
              key={group.id}
              group={group}
              isCollapsed={isCollapsed && !isMobileOpen}
              isExpanded={expandedGroups[group.id] !== false}
              onToggleExpand={toggleGroup}
              onNavigate={() => {
                if (isMobileOpen) closeMobile();
              }}
            />
          ))}

          {/* Bottom decorative padding to ensure last item is easily reachable */}
          <div className="h-6" />
        </div>

        {/* ========================================================
            C. FIXED BOTTOM CONTROLS
           ======================================================== */}
        <div className="flex-shrink-0 border-t border-white/10 bg-[#4A0E25] relative z-20">
          {/* Desktop Collapse / Expand Toggle Control */}
          <div className="hidden lg:block p-2.5">
            <Tooltip
              content={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              enabled={isCollapsed}
              position="right"
            >
              <button
                type="button"
                onClick={toggleCollapse}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#EADECF]/80 hover:text-white hover:bg-[#5F1633] transition-colors focus:outline-none group ${
                  isCollapsed ? 'justify-center' : 'justify-between'
                }`}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1 rounded bg-black/20 text-[#E2BC6B] group-hover:text-white transition-colors">
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronLeft className="w-4 h-4" />
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="truncate tracking-wide text-[13.5px] font-medium">
                      Collapse sidebar
                    </span>
                  )}
                </div>
              </button>
            </Tooltip>
          </div>

          {/* Mobile Footer Note */}
          <div className="lg:hidden p-3 text-center text-[10px] text-[#EADECF]/60">
            Mata Tripura Sundari Temple • Matabari
          </div>
        </div>
      </aside>
    </>
  );
}

