import React, { useState, useMemo, useEffect } from 'react';
import {
  MessageSquareText,
  AlertCircle,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  UserCheck,
  Send,
  X,
  Star,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Tag
} from 'lucide-react';
import { useInsightsAdmin } from '../context/InsightsAdminContext';

export default function Grievances({ isEmbedded = false, initialTab = 'grievances' }) {
  const {
    grievances,
    addGrievance,
    updateGrievanceStatus,
    assignGrievance,
    addGrievanceResponse,
    feedbackList,
    convertFeedbackToGrievance,
    grievanceCategories,
    adminUsers,
    showToast,
  } = useInsightsAdmin();

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Case Drawer State
  const [selectedCase, setSelectedCase] = useState(null);

  // New Case Modal State
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    subject: '',
    devoteeName: '',
    devoteePhone: '',
    devoteeEmail: '',
    category: 'Facilities',
    priority: 'Normal',
    description: '',
    relatedBookingId: '',
    assignedTo: 'Officer S. Bhattacharya',
  });

  // Drawer Action inputs
  const [responseText, setResponseText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');

  // Derived Metrics
  const openCases = useMemo(() => grievances.filter((g) => g.status !== 'Resolved' && g.status !== 'Closed'), [grievances]);
  const highPriorityCases = useMemo(
    () => openCases.filter((g) => g.priority === 'High' || g.priority === 'Critical'),
    [openCases]
  );
  const resolvedCases = useMemo(() => grievances.filter((g) => g.status === 'Resolved' || g.status === 'Closed'), [grievances]);
  const overdueCases = useMemo(() => openCases.filter((g) => g.priority === 'Critical'), [openCases]);

  // Filtered Grievances
  const filteredGrievances = useMemo(() => {
    return grievances.filter((g) => {
      const matchCat = selectedCategory === 'ALL' || g.category === selectedCategory;
      const matchPriority = selectedPriority === 'ALL' || g.priority === selectedPriority;
      const matchStatus = selectedStatus === 'ALL' || g.status === selectedStatus;
      const matchSearch =
        g.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.devoteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchPriority && matchStatus && matchSearch;
    });
  }, [grievances, selectedCategory, selectedPriority, selectedStatus, searchTerm]);

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!newCaseForm.subject || !newCaseForm.devoteeName) return;
    addGrievance(newCaseForm);
    setNewCaseForm({
      subject: '',
      devoteeName: '',
      devoteePhone: '',
      devoteeEmail: '',
      category: 'Facilities',
      priority: 'Normal',
      description: '',
      relatedBookingId: '',
      assignedTo: 'Officer S. Bhattacharya',
    });
    setIsNewCaseModalOpen(false);
  };

  const handleSendResponse = (e) => {
    e.preventDefault();
    if (!responseText || !selectedCase) return;
    addGrievanceResponse(selectedCase.id, responseText);
    setResponseText('');
    // Refresh selectedCase in local drawer
    setSelectedCase((prev) => ({
      ...prev,
      responses: [
        ...prev.responses,
        { date: 'Just now', author: 'Temple Administration', text: responseText },
      ],
      status: prev.status === 'New' || prev.status === 'Assigned' ? 'In Progress' : prev.status,
    }));
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!internalNoteText || !selectedCase) return;
    updateGrievanceStatus(selectedCase.id, selectedCase.status, internalNoteText);
    setSelectedCase((prev) => ({
      ...prev,
      internalNotes: [
        ...prev.internalNotes,
        { date: 'Just now', author: 'Super Admin', text: internalNoteText },
      ],
    }));
    setInternalNoteText('');
  };

  const tabs = [
    { id: 'grievances', label: 'Active Grievance Cases', count: openCases.length, alert: highPriorityCases.length > 0, icon: AlertCircle },
    { id: 'feedback', label: 'Devotee Feedback Feed', count: feedbackList.length, icon: MessageSquareText },
    { id: 'recurring', label: 'Recurring Issue Insights', icon: TrendingUp },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header (Hidden when embedded) */}
      {!isEmbedded && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
              Grievances & Devotee Feedback
            </h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsNewCaseModalOpen(true)}
              className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Log Devotee Grievance</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: ACTIVE GRIEVANCES TABLE */}
      {activeTab === 'grievances' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search case ID, devotee, subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3.5 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/80 focus:bg-white focus:outline-none focus:border-[#55132D] w-64 transition-all"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs border border-stone-200 rounded-xl px-3 py-2 bg-stone-50/80 font-medium text-stone-700 focus:outline-none focus:border-[#55132D] transition-all"
              >
                <option value="ALL">All Categories</option>
                {grievanceCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="text-xs border border-stone-200 rounded-xl px-3 py-2 bg-stone-50/80 font-medium text-stone-700 focus:outline-none focus:border-[#55132D] transition-all"
              >
                <option value="ALL">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs border border-stone-200 rounded-xl px-3 py-2 bg-stone-50/80 font-medium text-stone-700 focus:outline-none focus:border-[#55132D] transition-all"
              >
                <option value="ALL">All Statuses</option>
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs text-stone-500 font-semibold bg-stone-100/80 px-3 py-1 rounded-full border border-stone-200">
                Showing {filteredGrievances.length} cases
              </span>
              <button
                onClick={() => setIsNewCaseModalOpen(true)}
                className="px-3.5 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
                <span>Log Grievance</span>
              </button>
            </div>
          </div>

          {/* Table (Zero-Scroll Responsive Design) */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 text-stone-500 uppercase font-bold text-[10.5px] tracking-wider border-b border-stone-200/90">
                <tr>
                  <th className="py-3.5 px-4 font-bold w-[22%]">Case & Priority</th>
                  <th className="py-3.5 px-4 font-bold w-[34%]">Subject & Details</th>
                  <th className="py-3.5 px-4 font-bold w-[20%]">Devotee</th>
                  <th className="py-3.5 px-4 font-bold w-[14%]">Status & Assignee</th>
                  <th className="py-3.5 px-4 font-bold text-right w-[10%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredGrievances.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className="hover:bg-stone-50/70 cursor-pointer transition-colors"
                  >
                    {/* 1. Case ID & Priority & Meta */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-[#681B37] bg-pink-50 border border-pink-100/80 px-2.5 py-0.5 rounded-full inline-block">
                          {c.id}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                            c.priority === 'Critical'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : c.priority === 'High'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1.5 flex items-center gap-1.5">
                        <span className="font-semibold text-stone-600">{c.category}</span>
                        <span>•</span>
                        <span>{c.submittedDate.split(' ')[0]} {c.submittedDate.split(' ')[1]}</span>
                      </div>
                    </td>

                    {/* 2. Subject & Description */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-1" title={c.subject}>
                        {c.subject}
                      </div>
                      <div className="text-xs text-stone-500 line-clamp-2 mt-0.5 leading-relaxed" title={c.description}>
                        {c.description}
                      </div>
                    </td>

                    {/* 3. Devotee & Contact */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-semibold text-stone-900 text-xs truncate">
                        {c.devoteeName}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono mt-1">
                        <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{c.devoteePhone}</span>
                      </div>
                    </td>

                    {/* 4. Status & Assigned Officer */}
                    <td className="py-4 px-4 align-top">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : c.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'Resolved'
                              ? 'bg-emerald-600'
                              : c.status === 'In Progress'
                              ? 'bg-blue-600'
                              : 'bg-amber-600'
                          }`}
                        />
                        <span>{c.status}</span>
                      </span>
                      <div className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1.5 truncate" title={c.assignedTo}>
                        <div className="w-4.5 h-4.5 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-[9px] shrink-0 border border-stone-200">
                          {c.assignedTo.split(' ')[0][0] || 'O'}
                        </div>
                        <span className="truncate">{c.assignedTo.replace(/\s*\(.*?\)\s*/g, '')}</span>
                      </div>
                    </td>

                    {/* 5. Action */}
                    <td className="py-4 px-4 text-right align-top">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCase(c);
                        }}
                        className="px-3 py-1.5 rounded-full border border-stone-200 hover:border-[#55132D] hover:bg-[#55132D]/5 text-[#55132D] text-xs font-bold transition-all whitespace-nowrap inline-flex items-center gap-1 active:scale-[0.98]"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3 text-[#55132D]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DEVOTEE FEEDBACK FEED & RECURRING INSIGHTS */}
      {(activeTab === 'feedback' || activeTab === 'recurring') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-1 border-b border-stone-200/80">
            <h3 className="text-sm font-bold text-stone-900 font-serif">Devotee Experience Feedback</h3>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
              {feedbackList.length} Entries Recorded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {feedbackList.map((fdb) => (
              <div
                key={fdb.id}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {fdb.id}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(fdb.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                      <span className="text-xs font-bold font-mono text-stone-700 ml-1">({fdb.rating}/5)</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-stone-800 mb-1">
                    {fdb.devoteeName} • <span className="text-[#800000]">{fdb.category}</span>
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed italic bg-stone-50 p-2.5 rounded-lg border border-stone-150">
                    "{fdb.message}"
                  </p>

                  {fdb.internalRemarks && (
                    <p className="text-[11px] text-stone-500 mt-2">
                      <strong>Admin Remark:</strong> {fdb.internalRemarks}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-150 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-stone-400">{fdb.submittedDate}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                      {fdb.reviewStatus}
                    </span>
                    {fdb.reviewStatus !== 'Converted to Grievance' && (
                      <button
                        onClick={() => convertFeedbackToGrievance(fdb.id)}
                        className="text-[11px] text-[#800000] font-semibold hover:underline"
                      >
                        Escalate to Case
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recurring Issue Insights */}
          <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 font-serif">Recurring Operational Issue Analytics</h3>
              <span className="text-xs text-stone-500 font-medium">Departmental Correlation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Pattern 1 */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 uppercase text-[10px]">Frequent Bottleneck</span>
                  <span className="text-[10px] font-bold bg-amber-100 px-2 py-0.5 rounded text-amber-800">
                    2 Cases this week
                  </span>
                </div>
                <h4 className="font-bold text-stone-900">West Gate Accessibility Passage Obstructed</h4>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  Senior citizens and wheelchair users flagged temporary barricades blocking the designated ramp. Security marshals frequently position overflow queue stanchions across the pathway.
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-amber-200 text-[11px] text-stone-600">
                  <strong>Recommended Action:</strong> Paint high-visibility yellow diagonal box markings on pavement and install fixed bollards preventing barricade repositioning.
                </div>
              </div>

              {/* Pattern 2 */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 uppercase text-[10px]">Process Improvement</span>
                  <span className="text-[10px] font-bold bg-blue-100 px-2 py-0.5 rounded text-blue-800">
                    3 Inquiries
                  </span>
                </div>
                <h4 className="font-bold text-stone-900">Prasad Pre-order Delivery Counter Sync</h4>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  Devotees booking Mahaprasad online report 15-20 min delays at the counter during noon Bhog rush due to barcode scanner lookup latency.
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-blue-200 text-[11px] text-stone-600">
                  <strong>Recommended Action:</strong> Pre-print packing vouchers 1 hour before scheduled pickup and create a dedicated "Online Pre-orders Express Window".
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CASE DETAIL DRAWER */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto custom-scrollbar shadow-2xl p-5 flex flex-col justify-between text-xs space-y-4">
            <div className="space-y-4">
              {/* Drawer Top */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                    {selectedCase.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      selectedCase.priority === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : selectedCase.priority === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {selectedCase.priority} Priority
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Case Subject & Description */}
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif leading-snug">
                  {selectedCase.subject}
                </h3>
                <span className="text-[11px] text-[#800000] font-semibold block mt-1">
                  Category: {selectedCase.category}
                </span>
                <p className="text-stone-700 leading-relaxed text-xs mt-2 bg-stone-50 p-3 rounded-xl border border-stone-150">
                  {selectedCase.description}
                </p>
              </div>

              {/* Devotee Info & Booking Link */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Devotee Name:</span>
                  <span className="font-bold text-stone-900">{selectedCase.devoteeName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Contact:</span>
                  <span className="font-mono text-stone-800">{selectedCase.devoteePhone}</span>
                </div>
                {selectedCase.relatedBookingId && (
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                    <span className="text-stone-500">Related Booking:</span>
                    <span className="font-mono font-bold text-[#800000]">{selectedCase.relatedBookingId}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Assigned Officer:</span>
                  <span className="font-medium text-stone-800">{selectedCase.assignedTo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Status:</span>
                  <span className="font-bold text-[#800000]">{selectedCase.status}</span>
                </div>
              </div>

              {/* Status Update / Assignment Controls */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="font-bold text-stone-800 block text-xs">Update Case Status:</label>
                <div className="flex flex-wrap gap-1.5">
                  {['In Progress', 'Awaiting Response', 'Resolved', 'Closed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateGrievanceStatus(selectedCase.id, st)}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-colors ${
                        selectedCase.status === st
                          ? 'bg-[#800000] text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes History */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <h4 className="font-bold text-stone-800 text-xs">Internal Administrative Notes</h4>
                <div className="space-y-1.5">
                  {(selectedCase.internalNotes || []).map((n, i) => (
                    <div key={i} className="p-2 bg-amber-50/70 rounded border border-amber-200 text-[11px]">
                      <div className="flex justify-between text-stone-400 text-[10px] mb-0.5">
                        <span className="font-semibold text-amber-900">{n.author}</span>
                        <span>{n.date}</span>
                      </div>
                      <p className="text-stone-800">{n.text}</p>
                    </div>
                  ))}
                  {(!selectedCase.internalNotes || selectedCase.internalNotes.length === 0) && (
                    <p className="text-[11px] text-stone-400 italic">No internal notes logged yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add internal note..."
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    className="flex-1 border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-xs focus:outline-none focus:border-[#800000]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white font-semibold rounded-lg text-xs"
                  >
                    Note
                  </button>
                </form>
              </div>

              {/* Devotee Responses History */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <h4 className="font-bold text-stone-800 text-xs">Official Devotee Communication</h4>
                <div className="space-y-1.5">
                  {(selectedCase.responses || []).map((r, i) => (
                    <div key={i} className="p-2 bg-blue-50/70 rounded border border-blue-200 text-[11px]">
                      <div className="flex justify-between text-stone-400 text-[10px] mb-0.5">
                        <span className="font-semibold text-blue-900">{r.author}</span>
                        <span>{r.date}</span>
                      </div>
                      <p className="text-stone-800">{r.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendResponse} className="space-y-1.5 pt-1">
                  <textarea
                    rows={2}
                    placeholder="Type official reply to devotee..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 text-xs focus:outline-none focus:border-[#800000]"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Response & Update
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-[11px] text-stone-500">
              <span>Submitted: {selectedCase.submittedDate}</span>
              <button
                onClick={() => setSelectedCase(null)}
                className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOG NEW CASE */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Log Devotee Grievance Case</h3>
                <p className="text-xs text-stone-500">Formal complaint intake for temple management.</p>
              </div>
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subject / Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken water tap near eastern ghat stairs"
                  value={newCaseForm.subject}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, subject: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Devotee Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shri Alok Deb"
                    value={newCaseForm.devoteeName}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, devoteeName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="10 digit mobile"
                    value={newCaseForm.devoteePhone}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, devoteePhone: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newCaseForm.category}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  >
                    {grievanceCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Priority</label>
                  <select
                    value={newCaseForm.priority}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, priority: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Devotee's direct narrative..."
                  value={newCaseForm.description}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, description: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Assigned Administrator</label>
                <select
                  value={newCaseForm.assignedTo}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, assignedTo: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                >
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg shadow-sm"
                >
                  Register Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

