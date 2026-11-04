import React from 'react';

/**
 * StandardTabs — Global unified segmented tab bar
 * Supports up to 3 tabs cleanly with active burgundy background, optional count badges and alerts
 */
export default function StandardTabs({
  tabs = [],
  activeTab,
  onTabChange,
  onChangeTab,
}) {
  const handleChange = onTabChange || onChangeTab;

  return (
    <div className="flex items-center gap-1.5 border border-stone-200/90 bg-white/80 p-1.5 rounded-xl shadow-2xs overflow-x-auto custom-scrollbar w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        const count = tab.count !== undefined && tab.count !== null ? tab.count : tab.badge;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleChange?.(tab.id)}
            className={`flex-1 min-w-fit px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 select-none ${
              isActive
                ? 'bg-[#55132D] text-white shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
            }`}
          >
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            <span>{tab.label}</span>
            {count !== undefined && count !== null && (
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : tab.badgeColor || 'bg-stone-100 text-stone-600'
                }`}
              >
                {count}
              </span>
            )}
            {tab.alert && (
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-amber-300' : 'bg-amber-500'} animate-pulse`} />
            )}
            {tab.dot && (
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${tab.dotColor || (isActive ? 'bg-amber-300' : 'bg-amber-400')}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}

