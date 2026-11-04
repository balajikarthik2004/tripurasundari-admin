import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedCounter from '../../common/AnimatedCounter';

export default function OperationsMetricCard({
  label,
  title,
  value,
  subtitle,
  subtext,
  icon: Icon,
  trend,
  trendPositive = true,
  iconBg,
  color,
  onClick,
}) {
  const displayLabel = label || title;
  const displaySubtitle = subtitle || subtext;
  const colorMap = {
    burgundy: 'bg-[#55132D]/10 text-[#55132D]',
    gold: 'bg-amber-500/10 text-amber-700',
    emerald: 'bg-emerald-500/10 text-emerald-700',
    blue: 'bg-blue-500/10 text-blue-700',
    amber: 'bg-amber-500/10 text-amber-700',
    purple: 'bg-purple-500/10 text-purple-700',
    rose: 'bg-rose-500/10 text-rose-700',
  };
  const resolvedIconBg = (color && colorMap[color]) || iconBg || 'bg-[#55132D]/10 text-[#55132D]';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between transition-all ${
        onClick ? 'cursor-pointer hover:border-[#B68A36]/50 group' : 'hover:border-stone-300'
      }`}
    >
      <div className="flex items-center justify-between text-sm text-stone-600 mb-2">
        <span className="font-semibold text-stone-700 truncate pr-2">{displayLabel}</span>
        {Icon && (
          <span className={`p-1.5 rounded-lg ${resolvedIconBg} flex-shrink-0 transition-transform ${onClick ? 'group-hover:scale-105' : ''}`}>
            <Icon className="w-4 h-4" />
          </span>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-bold font-number text-stone-900 tracking-tight flex items-center gap-2">
          <AnimatedCounter value={value} />
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 mt-1.5 text-xs sm:text-[13px] font-semibold ${
              trendPositive ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {trendPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{trend}</span>
          </div>
        )}

        {displaySubtitle && !trend && (
          <div className="text-xs sm:text-[13px] text-stone-500 font-medium mt-1.5 truncate">
            {displaySubtitle}
          </div>
        )}
      </div>
    </div>
  );
}

