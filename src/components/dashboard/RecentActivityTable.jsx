import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { DASHBOARD_RECENT_ACTIVITIES } from '../../data/dashboardData';

export default function RecentActivityTable() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xs p-5 flex flex-col justify-between h-full min-h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
            Recent Transactions
          </h3>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 my-2 overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E8E2D8] text-[11px] font-bold text-stone-400 uppercase tracking-wider h-8">
              <th className="py-2 px-1.5 sm:px-2">Txn ID</th>
              <th className="py-2 px-1.5 sm:px-2">Devotee</th>
              <th className="py-2 px-1.5 sm:px-2">Service / Seva</th>
              <th className="py-2 px-1.5 sm:px-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D8]/60 text-xs">
            {DASHBOARD_RECENT_ACTIVITIES.map((row) => (
              <tr
                key={row.id}
                onClick={() => navigate('/sacred-services?tab=bookings')}
                className="hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
              >
                <td className="py-2.5 px-1.5 sm:px-2 font-mono text-[11px] font-semibold text-stone-500 whitespace-nowrap">
                  <span className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">
                    {row.id}
                  </span>
                </td>
                <td className="py-2.5 px-1.5 sm:px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#55132D]/10 text-[#55132D] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {row.devotee.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900 group-hover:text-[#55132D] transition-colors leading-tight">
                        {row.devotee}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                        {row.time}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-1.5 sm:px-2 text-stone-700 font-medium whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] bg-stone-100/90 text-stone-800 border border-stone-200/70 font-medium">
                    {row.service}
                  </span>
                </td>
                <td className="py-2.5 px-1.5 sm:px-2 text-right font-serif font-bold text-sm text-stone-900 whitespace-nowrap group-hover:text-[#55132D] transition-colors">
                  ₹{row.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Footer */}
      <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-xs flex-shrink-0">
        <span className="text-[11px] text-stone-500">
          Showing latest 5 recorded transactions
        </span>
        <button
          type="button"
          onClick={() => navigate('/sacred-services?tab=bookings')}
          className="font-bold text-[#55132D] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View all transactions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
