import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { IndianRupee, ArrowRight, TrendingUp } from 'lucide-react';
import { COLLECTIONS_SUMMARY } from '../../data/donationData';
import { formatCurrency } from '../../utils/formatters';

export default function CollectionsOverview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('category'); // 'category' | 'trend'
  const { totalRecorded, breakdown, hourlyComparison, comparedToYesterdayPercent } = COLLECTIONS_SUMMARY;

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#38091B] text-white p-2 rounded-lg border border-[#B68A36]/40 shadow-xl text-xs">
          <div className="font-semibold text-[#FFE8A3]">{data.name}</div>
          <div className="text-white mt-0.5">{formatCurrency(data.amount)}</div>
          <div className="text-[10px] text-white/70">{data.percentage}% of today&apos;s total</div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#38091B] text-white p-2 rounded-lg border border-[#B68A36]/40 shadow-xl text-xs">
          <div className="font-semibold text-[#FFE8A3]">{label}</div>
          <div className="text-emerald-400">Today: {formatCurrency(payload[0].value)}</div>
          {payload[1] && (
            <div className="text-slate-300">Yesterday: {formatCurrency(payload[1].value)}</div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle p-4 sm:p-5 flex flex-col justify-between h-full">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E2D8] flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-md bg-temple-burgundy/10 text-temple-burgundy flex-shrink-0">
              <IndianRupee className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h3 className="font-heading text-sm font-bold text-temple-burgundy uppercase tracking-wider truncate">
                Collections Overview
              </h3>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center bg-[#F8F5EF] p-0.5 rounded-lg border border-[#E8E2D8] text-[10px] flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('category')}
              className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                activeTab === 'category'
                  ? 'bg-[#55132D] text-white shadow-2xs'
                  : 'text-temple-text-secondary hover:text-temple-text-primary'
              }`}
            >
              Donut
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trend')}
              className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                activeTab === 'trend'
                  ? 'bg-[#55132D] text-white shadow-2xs'
                  : 'text-temple-text-secondary hover:text-temple-text-primary'
              }`}
            >
              Hourly
            </button>
          </div>
        </div>

        {/* Total Summary Row */}
        <div className="mt-2.5 p-2 rounded-lg bg-[#FAF8F5] border border-[#EFEBE4] flex items-center justify-between flex-shrink-0">
          <div>
            <span className="text-[9.5px] font-bold text-temple-text-muted uppercase tracking-wider block">
              Total Today Recorded
            </span>
            <div className="text-lg font-number font-bold text-temple-burgundy">
              {formatCurrency(totalRecorded)}
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-number">
              <TrendingUp className="w-3 h-3" />
              <span>+{comparedToYesterdayPercent}%</span>
            </div>
            <span className="text-[9.5px] text-temple-text-muted block mt-0.5">
              vs. yesterday baseline
            </span>
          </div>
        </div>

        {/* Chart View */}
        <div className="mt-2.5 flex-1 flex flex-col justify-center">
          {activeTab === 'category' ? (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {/* Donut Chart */}
              <div className="w-28 h-28 relative flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="amount"
                    >
                      {breakdown.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[8.5px] font-bold text-temple-text-muted uppercase">
                    Total
                  </span>
                  <span className="text-[10.5px] font-number font-bold text-temple-burgundy">
                    ₹18.7L
                  </span>
                </div>
              </div>

              {/* Clean Legend */}
              <div className="flex-1 w-full space-y-1">
                {breakdown.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between text-xs py-0.2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-temple-text-secondary text-[10.5px] truncate">
                        {cat.name}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0 pl-1.5">
                      <span className="font-semibold text-temple-text-primary text-[10.5px]">
                        {formatCurrency(cat.amount)}
                      </span>
                      <span className="text-[9px] text-temple-text-muted ml-1">
                        ({cat.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Hourly Bar Chart */
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyComparison} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#77717A' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 8.5, fill: '#77717A' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="today" fill="#55132D" radius={[3, 3, 0, 0]} name="Today" />
                  <Bar dataKey="yesterday" fill="#E2BC6B" radius={[3, 3, 0, 0]} name="Yesterday" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Payment Channels & Counters Distribution Strip (Eliminates empty white space) */}
        <div className="mt-2.5 p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] grid grid-cols-3 gap-2 text-center text-xs flex-shrink-0">
          <div className="border-r border-[#E8E2D8]/80 pr-1">
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider block">UPI / QR</span>
            <span className="text-xs font-bold text-[#55132D] mt-0.5 block">64%</span>
            <span className="text-[9.5px] text-stone-500 font-mono">₹12.0L</span>
          </div>
          <div className="border-r border-[#E8E2D8]/80 pr-1">
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider block">Hundi / Cash</span>
            <span className="text-xs font-bold text-[#55132D] mt-0.5 block">28%</span>
            <span className="text-[9.5px] text-stone-500 font-mono">₹5.2L</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider block">POS Counters</span>
            <span className="text-xs font-bold text-[#55132D] mt-0.5 block">8%</span>
            <span className="text-[9.5px] text-stone-500 font-mono">₹1.5L</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-3 pt-2.5 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
        <span className="text-[10.5px] text-temple-text-muted">
          Automated trust accounts reconciliation
        </span>
        <button
          type="button"
          onClick={() => navigate('/donations')}
          className="font-semibold text-temple-burgundy hover:underline flex items-center gap-1"
        >
          <span>View Reports</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
