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
    <div className="py-2">
      {/* Group Header */}
      {!isCollapsed ? (
        <button
          type="button"
          onClick={() => onToggleExpand && onToggleExpand(id)}
          className="w-full flex items-center justify-between px-4 py-1.5 text-left text-[12.5px] font-heading font-bold tracking-wider text-[#E2BC6B] uppercase select-none group focus:outline-none"
        >
          <span className="truncate group-hover:text-[#FFE8A3] transition-colors">
            {title}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#E2BC6B]/70 transition-transform duration-200 group-hover:text-[#FFE8A3] ${
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
        <div className="mt-1 space-y-1 transition-all duration-200">
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

