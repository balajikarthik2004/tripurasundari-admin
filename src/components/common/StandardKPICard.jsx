import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

/**
 * StandardKPICard — Global unified KPI & Metric card
 * Proportional for 14-inch laptops, no bloated descriptive text
 */
export default function StandardKPICard({
  label,
  title,
  value,
  subtext,
  badge,
  icon: Icon,
  trend,
  trendPositive = true,
  valueColor = 'text-stone-900',
  iconColor = 'text-[#55132D] bg-[#55132D]/10',
  onClick,
}) {
  const displayLabel = label || title;
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-stone-200/90 p-4 shadow-xs flex flex-col justify-between h-full transition-all ${
        onClick ? 'cursor-pointer hover:border-[#B68A36]/50 group' : 'hover:border-stone-300'
      }`}
    >
      <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
        <span className="font-semibold text-stone-600 truncate uppercase tracking-wider text-[11px]">
          {displayLabel}
        </span>
        {Icon && (
          <span className={`p-1.5 rounded-lg ${iconColor} flex-shrink-0 transition-transform ${onClick ? 'group-hover:scale-105' : ''}`}>
            <Icon className="w-4 h-4" />
          </span>
        )}
      </div>

      <div>
        <div className={`text-2xl sm:text-[26px] font-bold font-mono tracking-tight leading-none ${valueColor}`}>
          <AnimatedCounter value={value} />
        </div>

        <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-stone-100 text-xs text-stone-500">
          {subtext && <span className="truncate">{subtext}</span>}
          {trend && (
            <span
              className={`flex items-center gap-0.5 text-[11px] font-bold shrink-0 ${
                trendPositive ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {trendPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{trend}</span>
            </span>
          )}
          {badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 shrink-0">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

