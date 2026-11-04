import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Calendar as CalendarIcon,
  Sparkles,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Archive,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Tag
} from 'lucide-react';
import { useContentManagement } from '../context/ContentManagementContext';
import ContentPageHeader from '../components/content-management/shared/ContentPageHeader';
import ContentTabs from '../components/content-management/shared/ContentTabs';
import ContentStatusBadge from '../components/content-management/shared/ContentStatusBadge';
import VerificationBadge from '../components/content-management/shared/VerificationBadge';
import ImageUploadPreview from '../components/content-management/shared/ImageUploadPreview';
import PublicWebsitePreviewModal from '../components/content-management/shared/PublicWebsitePreviewModal';

export default function EventsFestivals({ isEmbedded = false }) {
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleEventFeatured,
    eventCategories,
    openPreview,
    showToast,
  } = useContentManagement();

  const [activeTab, setActiveTab] = useState('all_events');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Major Festivals',
    startDate: '10 Nov 2026',
    endDate: '12 Nov 2026',
    startTime: '05:00 AM',
    endTime: '11:00 PM',
    venue: 'Matabari Temple Complex & Kalyan Sagar',
    shortDescription: '',
    detailedDescription: '',
    highlightsText: '',
    visitorInstructions: '',
    featured: false,
    coverImage: '/src/assets/images/temple.jpg',
    status: 'Published',
    verificationStatus: 'Verified',
  });

  // Derived Metrics
  const totalEvents = events.length;
  const publishedEvents = useMemo(() => events.filter((e) => e.status === 'Published'), [events]);
  const upcomingEvents = useMemo(() => events.filter((e) => e.status === 'Published' || e.status === 'Scheduled'), [events]);
  const draftEvents = useMemo(() => events.filter((e) => e.status === 'Draft'), [events]);
  const featuredEvents = useMemo(() => events.filter((e) => e.featured), [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchCat = categoryFilter === 'ALL' || evt.category === categoryFilter;
      const matchStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'FEATURED'
          ? evt.featured
          : evt.status === statusFilter;
      const matchSearch =
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    });
  }, [events, categoryFilter, statusFilter, searchTerm]);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      category: 'Major Festivals',
      startDate: '10 Nov 2026',
      endDate: '12 Nov 2026',
      startTime: '05:00 AM',
      endTime: '11:00 PM',
      venue: 'Matabari Temple Complex & Kalyan Sagar',
      shortDescription: '',
      detailedDescription: '',
      highlightsText: '',
      visitorInstructions: '',
      featured: false,
      coverImage: '/src/assets/images/temple.jpg',
      status: 'Published',
      verificationStatus: 'Verified',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (evt) => {
    setEditingEvent(evt);
    setEventForm({
      title: evt.title,
      category: evt.category,
      startDate: evt.startDate,
      endDate: evt.endDate,
      startTime: evt.startTime || '05:00 AM',
      endTime: evt.endTime || '11:00 PM',
      venue: evt.venue,
      shortDescription: evt.shortDescription,
      detailedDescription: evt.detailedDescription,
      highlightsText: (evt.highlights || []).join('\n'),
      visitorInstructions: evt.visitorInstructions || '',
      featured: evt.featured || false,
      coverImage: evt.coverImage || '/src/assets/images/temple.jpg',
      status: evt.status,
      verificationStatus: evt.verificationStatus,
    });
    setIsCreateModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!eventForm.title) return;

    const highlights = eventForm.highlightsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload = {
      ...eventForm,
      highlights,
      slug: eventForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, payload);
    } else {
      addEvent(payload);
    }
    setIsCreateModalOpen(false);
  };

  const tabs = [
    { id: 'all_events', label: 'Events', count: events.length },
    { id: 'calendar', label: 'Festival Calendar' },
    { id: 'categories', label: 'Categories', count: eventCategories.length },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      {!isEmbedded && (
        <ContentPageHeader
          title="Public Events & Religious Festivals"
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCreateModal}
                className="px-3.5 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Public Event</span>
              </button>
            </div>
          }
        />
      )}
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Total Events</span>
          <div className="text-2xl font-bold font-mono text-stone-900">{totalEvents}</div>
          <span className="text-[11px] text-stone-500">Across annual calendar</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-stone-400">Published on Portal</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
              {publishedEvents.length} Active
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">{publishedEvents.length}</div>
          <span className="text-[11px] text-stone-500">Visible to devotees</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Upcoming Celebrations</span>
          <div className="text-2xl font-bold font-mono text-blue-700">{upcomingEvents.length}</div>
          <span className="text-[11px] text-stone-500">Scheduled within 6 months</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-stone-400">Featured on Home</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
              Hero Slots
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#55132D]">{featuredEvents.length}</div>
          <span className="text-[11px] text-stone-500">Pinned banner items</span>
        </div>
      </div>

      {/* Tabs */}
      <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* TAB 1: ALL EVENTS TABLE */}
      {activeTab === 'all_events' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search event title or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-[#55132D] w-60"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#55132D]"
              >
                <option value="ALL">All Categories</option>
                {eventCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#55132D]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Scheduled">Scheduled</option>
                <option value="FEATURED">Featured on Home ({featuredEvents.length})</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <span className="text-xs text-stone-500 font-medium">
              Showing {filteredEvents.length} of {events.length} events
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Event Ref</th>
                  <th className="py-3 px-4">Festival Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Venue</th>
                  <th className="py-3 px-4">Internal Ref</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{evt.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{evt.title}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-xs">{evt.shortDescription}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {evt.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                      {evt.startDate}
                      {evt.endDate !== evt.startDate && ` – ${evt.endDate}`}
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-[140px] truncate">{evt.venue}</td>
                    <td className="py-3 px-4">
                      {evt.internalMelaId ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200" title="Linked with internal operations">
                          <Tag className="w-2.5 h-2.5" />
                          {evt.internalMelaId}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[10px] italic">Independent</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <ContentStatusBadge status={evt.status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleEventFeatured(evt.id)}
                        className={`p-1 rounded-full transition-colors ${
                          evt.featured ? 'text-amber-500 hover:text-amber-600' : 'text-stone-300 hover:text-stone-400'
                        }`}
                        title="Toggle featured status"
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openPreview('event', evt)}
                        className="text-[11px] text-stone-600 hover:text-stone-900 underline font-medium"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(evt)}
                        className="text-[11px] text-[#55132D] hover:underline font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(evt.id)}
                        className="text-stone-400 hover:text-red-600 p-1"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FESTIVAL CALENDAR TIMELINE */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Annual Festival Schedule Flow</h3>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="px-3 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Schedule Event
            </button>
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#55132D]/40 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center min-w-[70px] shrink-0">
                    <span className="text-[10px] uppercase font-bold text-[#55132D] block">
                      {evt.startDate.split(' ')[1]}
                    </span>
                    <span className="text-xl font-bold font-mono text-stone-900 block leading-tight">
                      {evt.startDate.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {evt.startDate.split(' ')[2]}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900">{evt.id}</span>
                      <ContentStatusBadge status={evt.status} />
                      {evt.featured && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Featured
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-stone-900">{evt.title}</h4>
                    <p className="text-stone-600 leading-relaxed text-xs max-w-2xl">{evt.shortDescription}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" /> {evt.startTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#55132D]" /> {evt.venue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => openPreview('event', evt)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#55132D]" /> Preview Devotee Card
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(evt)}
                    className="px-3 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg"
                  >
                    Edit Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES & OPERATIONAL LINKAGES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="section-heading">Configured CMS Event Categories</h3>
                <p className="supporting-text">Official classification of festivals and sacred rituals</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {eventCategories.map((cat) => (
                <div key={cat.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <span className="font-mono text-[11px] text-stone-400 font-bold">{cat.id}</span>
                  <h4 className="text-xs font-bold text-stone-900">{cat.name}</h4>
                  <p className="supporting-text">{cat.description}</p>
                  <div className="pt-2 flex justify-between items-center text-[11px]">
                    <span className="text-emerald-700 font-semibold">{cat.status}</span>
                    <span className="text-stone-400">
                      {events.filter((e) => e.category === cat.name).length} events linked
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-subtle space-y-2">
              <h4 className="font-bold text-stone-900">Operational Logistics Linkage</h4>
              <p className="text-stone-600 text-xs leading-relaxed">
                Diwali Mela 2026 is connected with internal operational logistics under Mela Management (ID: <code className="font-mono bg-stone-100 px-1 py-0.5 rounded text-[#55132D]">MELA-2026-01</code>), ensuring public announcements and queue schedules reflect live command directives.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-subtle space-y-2">
              <h4 className="font-bold text-stone-900">Verification & Astrological Sanction</h4>
              <p className="text-stone-600 text-xs leading-relaxed">
                All festival dates are synchronized with the official Tripura Shakta Sampradaya Panjika. Special midnight timings require Priest Council consent prior to public syndication.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT EVENT */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {editingEvent ? 'Edit Public Event' : 'Create Public Event'}
                </h3>
                <p className="text-xs text-stone-500">Configure public festival details and schedule.</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5 text-xs overflow-y-auto custom-scrollbar flex-1">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Event / Festival Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kartik Purnima Maha Deeparadhana 2026"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    {eventCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Venue / Precinct</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Matabari Temple Complex"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Nov 2026"
                    value={eventForm.startDate}
                    onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">End Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Nov 2026"
                    value={eventForm.endDate}
                    onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Brief Description (Public Snippet) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary displayed on cards and calendar..."
                  value={eventForm.shortDescription}
                  onChange={(e) => setEventForm({ ...eventForm, shortDescription: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Detailed Observance Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed schedule, pujas, cultural recitals..."
                  value={eventForm.detailedDescription}
                  onChange={(e) => setEventForm({ ...eventForm, detailedDescription: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Program Highlights (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="e.g.&#10;Lighting of 1,00,000 earthen lamps&#10;Midnight Kali Puja on Amavasya&#10;Free Annadanam for visiting yatris"
                  value={eventForm.highlightsText}
                  onChange={(e) => setEventForm({ ...eventForm, highlightsText: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Visitor Advisory Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Expect peak rush after 05:00 PM. Utilize Lot A parking."
                  value={eventForm.visitorInstructions}
                  onChange={(e) => setEventForm({ ...eventForm, visitorInstructions: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Publication Status</label>
                  <select
                    value={eventForm.status}
                    onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="featuredToggle"
                    checked={eventForm.featured}
                    onChange={(e) => setEventForm({ ...eventForm, featured: e.target.checked })}
                    className="w-4 h-4 text-[#55132D] rounded focus:ring-[#55132D]"
                  />
                  <label htmlFor="featuredToggle" className="font-semibold text-stone-800 cursor-pointer">
                    Pin as Featured on Home
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white font-semibold rounded-lg shadow-sm"
                >
                  {editingEvent ? 'Save Event Changes' : 'Publish / Save Event'}
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

