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
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#55132D] text-white border-r border-[#400D21] transition-all duration-200 ease-in-out shadow-2xl lg:shadow-none ${
          /* Desktop Width: Standard 256px (w-64) for balanced 14" laptop viewports */
          isCollapsed ? 'lg:w-[70px]' : 'lg:w-64'
        } ${
          /* Mobile Drawer Position */
          isMobileOpen ? 'translate-x-0 w-[270px]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* ========================================================
            A. FIXED TOP BRANDING HEADER
           ======================================================== */}
        <div className="flex-shrink-0 h-[70px] px-4 flex items-center justify-between border-b border-white/10 bg-[#4F1129]/95 backdrop-blur-sm relative z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Temple Logo */}
            <div className="flex-shrink-0 p-1.5 rounded-xl bg-gradient-to-br from-[#681B37] to-[#3D0A1E] border border-[#E2BC6B]/40 shadow-sm">
              <TempleLogo className="w-8 h-8" />
            </div>

            {/* Temple Branding Text (Hidden when collapsed on desktop) */}
            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0 flex flex-col justify-center">
                <span className="font-cinzel text-[18px] font-bold tracking-tight text-white leading-tight truncate drop-shadow-xs">
                  Tripura Sundari
                </span>
                <span className="font-jakarta text-[11.5px] font-semibold tracking-wider text-[#E2BC6B] uppercase leading-tight mt-0.5">
                  Admin Portal
                </span>
              </div>
            )}
          </div>

          {/* Close button for Mobile drawer */}
          <button
            type="button"
            onClick={closeMobile}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 lg:hidden focus:outline-none cursor-pointer"
            aria-label="Close sidebar drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================
            B. INDEPENDENTLY SCROLLABLE NAVIGATION AREA
           ======================================================== */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-2.5 space-y-1 relative z-10">
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

          {/* Bottom decorative padding */}
          <div className="h-6" />
        </div>

        {/* ========================================================
            C. FIXED BOTTOM CONTROLS
           ======================================================== */}
        <div className="flex-shrink-0 border-t border-white/10 bg-[#470F24]/90 backdrop-blur-xs relative z-20">
          {/* Desktop Collapse / Expand Toggle Control */}
          <div className="hidden lg:block p-2">
            <Tooltip
              content={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              enabled={isCollapsed}
              position="right"
            >
              <button
                type="button"
                onClick={toggleCollapse}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#EADECF]/75 hover:text-white hover:bg-white/[0.08] transition-all focus:outline-none group font-jakarta cursor-pointer ${
                  isCollapsed ? 'justify-center' : 'justify-between'
                }`}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1 rounded-lg bg-black/20 text-[#E2BC6B] group-hover:text-white group-hover:bg-[#E2BC6B]/20 transition-all">
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronLeft className="w-3.5 h-3.5" />
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="truncate tracking-wide text-[13px] font-semibold text-[#EADECF]/85 group-hover:text-white">
                      Collapse sidebar
                    </span>
                  )}
                </div>
              </button>
            </Tooltip>
          </div>

          {/* Mobile Footer Note */}
          <div className="lg:hidden p-3 text-center text-[10px] text-[#EADECF]/60 font-jakarta">
            Mata Tripura Sundari Temple • Matabari
          </div>
        </div>
      </aside>
    </>
  );
}
