import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Archive,
  RotateCcw,
  Trash2,
  Pin,
  ExternalLink,
  Calendar,
  X,
  FileText
} from 'lucide-react';
import { useContentManagement } from '../context/ContentManagementContext';
import ContentPageHeader from '../components/content-management/shared/ContentPageHeader';
import ContentTabs from '../components/content-management/shared/ContentTabs';
import ContentStatusBadge from '../components/content-management/shared/ContentStatusBadge';
import VerificationBadge from '../components/content-management/shared/VerificationBadge';
import PublicWebsitePreviewModal from '../components/content-management/shared/PublicWebsitePreviewModal';

export default function Announcements() {
  const {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    archiveAnnouncement,
    restoreAnnouncement,
    deleteAnnouncement,
    announcementCategories,
    events,
    openPreview,
    showToast,
  } = useContentManagement();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    category: 'General Notice',
    priority: 'Normal',
    relatedEventId: '',
    shortDescription: '',
    fullContent: '',
    publishDate: '31 Oct 2026',
    expiryDate: '15 Nov 2026',
    pinned: false,
    showOnHomepage: true,
    status: 'Published',
    verificationStatus: 'Verified',
  });

  // Metrics
  const totalCount = announcements.length;
  const publishedCount = useMemo(() => announcements.filter((a) => a.status === 'Published').length, [announcements]);
  const draftCount = useMemo(() => announcements.filter((a) => a.status === 'Draft').length, [announcements]);
  const scheduledCount = useMemo(() => announcements.filter((a) => a.status === 'Scheduled').length, [announcements]);
  const archivedCount = useMemo(() => announcements.filter((a) => a.status === 'Archived').length, [announcements]);
  const urgentCount = useMemo(() => announcements.filter((a) => a.priority === 'Urgent' && a.status === 'Published').length, [announcements]);

  // Active (non-archived) announcements
  const activeAnnouncements = useMemo(() => announcements.filter((a) => a.status !== 'Archived'), [announcements]);

  // Filtered announcements
  const filteredAnnouncements = useMemo(() => {
    return activeAnnouncements.filter((a) => {
      const matchCat = categoryFilter === 'ALL' || a.category === categoryFilter;
      const matchPriority = priorityFilter === 'ALL' || a.priority === priorityFilter;
      const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
      const matchSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchPriority && matchStatus && matchSearch;
    });
  }, [activeAnnouncements, categoryFilter, priorityFilter, statusFilter, searchTerm]);

  // Archived filtered
  const filteredArchived = useMemo(() => {
    return announcements
      .filter((a) => a.status === 'Archived')
      .filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [announcements, searchTerm]);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setForm({
      title: '',
      category: 'General Notice',
      priority: 'Normal',
      relatedEventId: '',
      shortDescription: '',
      fullContent: '',
      publishDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: '15 Nov 2026',
      pinned: false,
      showOnHomepage: true,
      status: 'Published',
      verificationStatus: 'Verified',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      priority: item.priority,
      relatedEventId: item.relatedEventId || '',
      shortDescription: item.shortDescription,
      fullContent: item.fullContent,
      publishDate: item.publishDate,
      expiryDate: item.expiryDate || '',
      pinned: item.pinned || false,
      showOnHomepage: item.showOnHomepage !== false,
      status: item.status,
      verificationStatus: item.verificationStatus,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.fullContent) return;

    const payload = {
      ...form,
      slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    if (editingItem) {
      updateAnnouncement(editingItem.id, payload);
    } else {
      addAnnouncement(payload);
    }
    setIsModalOpen(false);
  };

  const tabs = [
    { id: 'all', label: 'All Notices', count: activeAnnouncements.length, alert: urgentCount > 0 },
    { id: 'categories', label: 'Notice Categories', count: announcementCategories.length },
    { id: 'archive', label: 'Archived / Expired', count: archivedCount },
    { id: 'overview', label: 'Overview & Analytics' },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <ContentPageHeader
        title="Public Announcements & Circulars"
        subtitle="Publish instant administrative advisories, festival timings, queue protocols and circulars for public website."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreateModal}
              className="px-3.5 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Announcement</span>
            </button>
          </div>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Total Notices</span>
          <div className="text-2xl font-bold font-mono text-stone-900">{totalCount}</div>
          <span className="text-[11px] text-stone-500">Historical & active total</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-stone-400">Live on Website</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
              {publishedCount} Live
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">{publishedCount}</div>
          <span className="text-[11px] text-stone-500">Visible to devotees</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-stone-400">Urgent Advisories</span>
            {urgentCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-800">
                Priority
              </span>
            )}
          </div>
          <div className="text-2xl font-bold font-mono text-red-700">{urgentCount}</div>
          <span className="text-[11px] text-stone-500">High priority broadcast</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Scheduled / Draft</span>
          <div className="text-2xl font-bold font-mono text-blue-700">{scheduledCount + draftCount}</div>
          <span className="text-[11px] text-stone-500">Pending or in pipeline</span>
        </div>
      </div>

      {/* Tabs */}
      <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* TAB 1: ALL ACTIVE ANNOUNCEMENTS */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          {/* Controls */}
          <div className="p-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-[#800000] w-60"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#800000]"
              >
                <option value="ALL">All Categories</option>
                {announcementCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#800000]"
              >
                <option value="ALL">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="Important">Important</option>
                <option value="Normal">Normal</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#800000]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <span className="text-xs text-stone-500 font-medium">
              Showing {filteredAnnouncements.length} active announcements
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Notice Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Publish Date</th>
                  <th className="py-3 px-4">Expires</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Pinned</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredAnnouncements.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{item.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{item.title}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-sm">{item.shortDescription}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.priority === 'Urgent'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : item.priority === 'Important'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-600">{item.publishDate}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                      {item.expiryDate || <span className="text-stone-300">Indefinite</span>}
                    </td>
                    <td className="py-3 px-4">
                      <ContentStatusBadge status={item.status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.pinned ? (
                        <span className="inline-block p-1 bg-amber-100 text-amber-800 rounded-full" title="Pinned to top">
                          <Pin className="w-3 h-3 fill-current" />
                        </span>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openPreview('announcement', item)}
                        className="text-[11px] text-stone-600 hover:text-stone-900 underline font-medium"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="text-[11px] text-[#800000] hover:underline font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => archiveAnnouncement(item.id)}
                        className="text-stone-400 hover:text-amber-700 p-1"
                        title="Archive notice"
                      >
                        <Archive className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Announcement Classification Categories</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {announcementCategories.map((c) => (
              <div key={c.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-mono text-[10px] text-stone-400 font-bold">{c.id}</span>
                <h4 className="text-xs font-bold text-stone-900">{c.name}</h4>
                <p className="text-[11px] text-stone-500">{c.description}</p>
                <div className="pt-2 flex justify-between items-center text-[10px]">
                  <span className="text-emerald-700 font-semibold">{c.status}</span>
                  <span className="text-stone-400">
                    {announcements.filter((a) => a.category === c.name).length} notices linked
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ARCHIVE */}
      {activeTab === 'archive' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Archived & Expired Public Notices</h3>
            </div>
            <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
              {filteredArchived.length} Archived
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Originally Published</th>
                  <th className="py-3 px-4">Expired On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredArchived.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{item.id}</td>
                    <td className="py-3 px-4 font-medium text-stone-800">{item.title}</td>
                    <td className="py-3 px-4 text-stone-600">{item.category}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500">{item.publishDate}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500">{item.expiryDate}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => restoreAnnouncement(item.id)}
                        className="text-[11px] text-blue-600 hover:underline font-semibold flex items-center gap-1 inline-flex"
                      >
                        <RotateCcw className="w-3 h-3" /> Restore Draft
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(item.id)}
                        className="text-[11px] text-red-600 hover:underline font-semibold ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredArchived.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-stone-400 italic">
                      No archived announcements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900">Broadcast Network & Circular Coordination</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-500">Public Portal Sync</span>
              <p className="font-bold text-stone-900">Instant Automated Feed</p>
              <p className="text-[11px] text-stone-600">Published notices appear in top scrolling ribbon.</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-500">Premises LED Screens</span>
              <p className="font-bold text-stone-900">East & West Gate Sync</p>
              <p className="text-[11px] text-stone-600">Urgent category circulars prioritized automatically.</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-500">Media Cell Release</span>
              <p className="font-bold text-stone-900">Press Circular Generation</p>
              <p className="text-[11px] text-stone-600">Printable format for state information directorate.</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT ANNOUNCEMENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {editingItem ? 'Edit Notice' : 'Draft New Public Notice'}
                </h3>
                <p className="text-xs text-stone-500">Prepare official advisory for devotee portal.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5 text-xs overflow-y-auto custom-scrollbar flex-1">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notice Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Darshan Queue Barricade Directions for Kartik Purnima"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Notice Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  >
                    {announcementCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Broadcast Urgency / Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  >
                    <option value="Normal">Normal Notice</option>
                    <option value="Important">Important Advisory</option>
                    <option value="Urgent">Urgent / Emergency Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Related Festival (Optional Link)</label>
                <select
                  value={form.relatedEventId}
                  onChange={(e) => setForm({ ...form, relatedEventId: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                >
                  <option value="">-- No specific festival link --</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.startDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Excerpt (Public Banner) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="One sentence summary shown on ticker or banner..."
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Detailed Notice Text *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Complete administrative instructions, rules and devotee advisory..."
                  value={form.fullContent}
                  onChange={(e) => setForm({ ...form, fullContent: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Publish Date</label>
                  <input
                    type="text"
                    value={form.publishDate}
                    onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Auto-Expiry Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Nov 2026"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Publishing Mode</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  >
                    <option value="Published">Publish Immediately</option>
                    <option value="Scheduled">Schedule for Later</option>
                    <option value="Draft">Save as Draft</option>
                  </select>
                </div>

                <div className="space-y-1.5 pt-3">
                  <label className="flex items-center gap-2 font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.pinned}
                      onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                      className="w-4 h-4 text-[#800000] rounded focus:ring-[#800000]"
                    />
                    <span>Pin to top of public feed</span>
                  </label>
                  <label className="flex items-center gap-2 font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showOnHomepage}
                      onChange={(e) => setForm({ ...form, showOnHomepage: e.target.checked })}
                      className="w-4 h-4 text-[#800000] rounded focus:ring-[#800000]"
                    />
                    <span>Show in homepage ticker</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg shadow-sm"
                >
                  {editingItem ? 'Save Notice Edits' : 'Publish / Broadcast Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Preview Modal */}
      <PublicWebsitePreviewModal />
    </div>
  );
}

