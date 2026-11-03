import React from 'react';

export default function OperationsTabs({ tabs = [], activeTab, onChangeTab, onTabChange }) {
  const handleChange = onChangeTab || onTabChange;

  return (
    <div className="flex items-center gap-1.5 border border-stone-200/80 bg-white/70 backdrop-blur-xs p-1.5 rounded-xl shadow-2xs overflow-x-auto custom-scrollbar w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        const badgeValue = tab.badge !== undefined && tab.badge !== null ? tab.badge : tab.count;

        return (
          <button
            key={tab.id}
            onClick={() => handleChange?.(tab.id)}
            className={`flex-1 min-w-fit px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
              isActive
                ? 'bg-[#55132D] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            <span>{tab.label}</span>
            {badgeValue !== undefined && badgeValue !== null && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : tab.badgeColor || 'bg-stone-100 text-stone-600'
                }`}
              >
                {badgeValue}
              </span>
            )}
            {tab.dot && (
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${tab.dotColor || 'bg-amber-400'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}

