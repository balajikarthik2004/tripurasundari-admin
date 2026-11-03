import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { RECENT_ACTIVITIES } from '../../data/bookingData';
import { formatCurrency, getStatusBadgeStyle } from '../../utils/formatters';
import ActivityDetailDrawer from './ActivityDetailDrawer';

const TABS = ['All', 'Darshan', 'Pooja', 'Prasad', 'Donations'];

export default function RecentActivityTable() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedActivity, setSelectedActivity] = useState(null);

  // 5 records for comfortable row height and larger readable font sizes
  const filteredActivities = RECENT_ACTIVITIES.filter((item) => {
    if (activeTab === 'All') return true;
    return item.type.toLowerCase().includes(activeTab.toLowerCase());
  }).slice(0, 5);

  const handleRowClick = (item) => {
    setSelectedActivity(item);
  };

  const handleViewAll = () => {
    if (activeTab === 'Darshan') navigate('/bookings');
    else if (activeTab === 'Pooja') navigate('/pooja-seva');
    else if (activeTab === 'Prasad') navigate('/prasad-store');
    else if (activeTab === 'Donations') navigate('/donations');
    else navigate('/bookings');
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle p-4 sm:p-5 flex flex-col justify-between h-full gap-3">
        <div className="flex-1 flex flex-col">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-[#E8E2D8] flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-temple-burgundy/10 text-temple-burgundy">
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-heading text-sm font-bold text-temple-burgundy uppercase tracking-wider">
                  Recent Activity & Transactions
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleViewAll}
              className="text-xs font-semibold text-[#55132D] hover:underline flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clean Category Filter Tabs */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-[#55132D] text-white shadow-2xs font-semibold'
                    : 'bg-[#FAF8F5] text-temple-text-secondary hover:bg-slate-100 hover:text-temple-text-primary border border-[#EDE7DC]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Clean 3-Column Table without redundant columns */}
          <div className="mt-3 w-full flex-1 flex flex-col justify-between">
            <table className="w-full text-left table-fixed border-collapse">
              <thead>
                <tr className="border-b border-[#E8E2D8] text-xs font-bold text-stone-500 uppercase tracking-wider h-8">
                  <th className="py-2 px-2.5 w-[38%]">Devotee</th>
                  <th className="py-2 px-2.5 w-[42%]">Service</th>
                  <th className="py-2 px-2.5 text-right w-[20%]">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8]/60">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-temple-text-muted text-xs">
                      No records found under &ldquo;{activeTab}&rdquo; filter.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((row) => {
                    const badge = getStatusBadgeStyle(row.status);
                    return (
                      <tr
                        key={row.id}
                        onClick={() => handleRowClick(row)}
                        className="hover:bg-[#FAF7F2] transition-colors cursor-pointer group h-[52px]"
                      >
                        {/* Devotee with Time & Ref ID */}
                        <td className="py-2 px-2.5">
                          <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                            {row.devotee}
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                            {row.time} • <span className="text-temple-burgundy">{row.refId}</span>
                          </div>
                        </td>

                        {/* Service Name with full breathing space */}
                        <td className="py-2 px-2.5">
                          <div
                            className="text-xs sm:text-[13px] text-stone-700 font-medium truncate"
                            title={row.service}
                          >
                            {row.service}
                          </div>
                        </td>

                        {/* Amount with integrated status indicator */}
                        <td className="py-2 px-2.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-number font-bold text-xs sm:text-sm text-stone-900">
                              {formatCurrency(row.amount)}
                            </span>
                            <span
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${badge.dot}`}
                              title={row.status}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Activity Detail Drawer */}
      <ActivityDetailDrawer
        item={selectedActivity}
        isOpen={Boolean(selectedActivity)}
        onClose={() => setSelectedActivity(null)}
      />
    </>
  );
}
