import React from 'react';
import { ChevronDown } from 'lucide-react';
import SidebarItem from './SidebarItem';

export default function SidebarGroup({
  group,
  isCollapsed = false,
  isExpanded = true,
  onToggleExpand,
  onNavigate,
}) {
  const { id, title, items } = group;

  return (
    <div className="pt-2.5 pb-1 first:pt-1">
      {/* Group Header: Refined uppercase section header with gold accent */}
      {!isCollapsed ? (
        <button
          type="button"
          onClick={() => onToggleExpand && onToggleExpand(id)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-left text-[12px] font-bold tracking-[0.06em] text-[#E2BC6B] uppercase select-none group focus:outline-none transition-colors font-jakarta cursor-pointer"
        >
          <span className="truncate group-hover:text-[#FFE8A3] transition-colors">
            {title}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#E2BC6B]/80 transition-transform duration-200 group-hover:text-[#FFE8A3] shrink-0 ${
              isExpanded ? 'rotate-0' : '-rotate-90'
            }`}
          />
        </button>
      ) : (
        /* Divider line in collapsed mode */
        <div className="my-2 mx-3 border-t border-white/10" />
      )}

      {/* Group Items */}
      {(!isCollapsed ? isExpanded : true) && (
        <div className="mt-1 space-y-0.5 transition-all duration-150">
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
