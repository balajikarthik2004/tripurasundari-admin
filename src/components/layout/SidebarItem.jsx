import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import IconRenderer from '../common/IconRenderer';
import Tooltip from '../common/Tooltip';

export default function SidebarItem({
  item,
  isCollapsed = false,
  onNavigate,
}) {
  const { path, label, icon, hasSubmenu, description, badge } = item;

  const content = (
    <NavLink
      to={path}
      onClick={onNavigate}
      className={({ isActive }) => {
        const baseClasses =
          'group relative flex items-center transition-all duration-200 text-sm font-medium rounded-lg select-none outline-none';

        if (isCollapsed) {
          return `${baseClasses} justify-center w-10 h-10 mx-auto ${
            isActive
              ? 'bg-[#731B3F] text-white shadow-md shadow-black/20 ring-1 ring-[#E2BC6B]/30'
              : 'text-[#E8DFC] hover:bg-[#5F1633] text-white/75 hover:text-white'
          }`;
        }

        return `${baseClasses} px-3.5 py-2.5 mx-2.5 gap-3.5 ${
          isActive
            ? 'bg-[#721A3D] text-white shadow-sm ring-1 ring-[#E2BC6B]/25 font-semibold'
            : 'text-[#EADECF]/90 hover:bg-[#5F1633] hover:text-white hover:translate-x-0.5'
        }`;
      }}
    >
      {({ isActive }) => (
        <>
          {/* Active left indicator pill for expanded mode */}
          {!isCollapsed && isActive && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#E2BC6B] rounded-r-full shadow-[0_0_8px_#E2BC6B]"
              aria-hidden="true"
            />
          )}

          {/* Icon */}
          <div
            className={`flex-shrink-0 transition-colors duration-200 ${
              isActive
                ? 'text-[#FFE8A3]'
                : 'text-[#E2BC6B]/80 group-hover:text-[#FFE8A3]'
            }`}
          >
            <IconRenderer name={icon} className="w-5 h-5" />
          </div>

          {/* Label & right-side chevron (visible only when expanded) */}
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="truncate text-[15px] font-medium tracking-normal">
                {label}
              </span>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {badge && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E2BC6B] text-[#55132D] shadow-2xs">
                    {badge}
                  </span>
                )}

                {hasSubmenu && (
                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                      isActive
                        ? 'text-[#FFE8A3] opacity-80'
                        : 'text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5'
                    }`}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={label} enabled={isCollapsed} position="right">
        {content}
      </Tooltip>
    );
  }

  return content;
}

