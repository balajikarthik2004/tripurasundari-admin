import React from 'react';
import { NavLink } from 'react-router-dom';
import IconRenderer from '../common/IconRenderer';
import Tooltip from '../common/Tooltip';

export default function SidebarItem({
  item,
  isCollapsed = false,
  onNavigate,
}) {
  const { path, label, icon, badge } = item;

  const content = (
    <NavLink
      to={path}
      onClick={onNavigate}
      className={({ isActive }) => {
        const baseClasses =
          'group relative flex items-center transition-all duration-150 select-none outline-none font-jakarta';

        if (isCollapsed) {
          return `${baseClasses} justify-center w-11 h-11 mx-auto rounded-xl ${
            isActive
              ? 'bg-gradient-to-r from-[#6E1A3C] to-[#55132D] text-[#E2BC6B] shadow-sm ring-1 ring-[#E2BC6B]/30'
              : 'text-[#EADECF]/75 hover:bg-white/[0.08] hover:text-white'
          }`;
        }

        return `${baseClasses} h-[44px] px-3.5 mx-2 rounded-xl gap-3 ${
          isActive
            ? 'bg-gradient-to-r from-[#6E1A3C] to-[#55132D] text-white shadow-xs font-semibold border border-white/10 ring-1 ring-[#E2BC6B]/20'
            : 'text-[#EADECF]/80 hover:bg-white/[0.08] hover:text-white font-medium hover:translate-x-0.5'
        }`;
      }}
    >
      {({ isActive }) => (
        <>
          {/* Active left antique-gold indicator */}
          {!isCollapsed && isActive && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-6 bg-[#E2BC6B] rounded-r shadow-[0_0_8px_rgba(226,188,107,0.5)]"
              aria-hidden="true"
            />
          )}

          {/* Consistent Lucide icon directly on sidebar (20-21px) */}
          <div
            className={`flex items-center justify-center shrink-0 transition-colors duration-150 ${
              isActive
                ? 'text-[#E2BC6B]'
                : 'text-[#EADECF]/75 group-hover:text-white'
            }`}
          >
            <IconRenderer name={icon} className="w-[20.5px] h-[20.5px] shrink-0" />
          </div>

          {/* Menu Label with Plus Jakarta Sans */}
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span
                className={`truncate text-[15px] leading-tight tracking-normal transition-colors duration-150 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#EADECF]/90 group-hover:text-white font-medium'
                }`}
              >
                {label}
              </span>

              {/* Notification Badge aligned to far right */}
              {badge && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E2BC6B] text-[#3D0A1E] shadow-2xs shrink-0 ml-auto font-mono">
                  {badge}
                </span>
              )}
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
