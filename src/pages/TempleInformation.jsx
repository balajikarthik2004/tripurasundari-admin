import React, { useState, useMemo } from 'react';
import {
  Landmark,
  BookOpen,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Filter,
  Save,
  Globe,
  Upload,
  ArrowUp,
  ArrowDown,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { useContentManagement } from '../context/ContentManagementContext';
import ContentPageHeader from '../components/content-management/shared/ContentPageHeader';
import ContentTabs from '../components/content-management/shared/ContentTabs';
import ContentStatusBadge from '../components/content-management/shared/ContentStatusBadge';
import VerificationBadge from '../components/content-management/shared/VerificationBadge';
import ImageUploadPreview from '../components/content-management/shared/ImageUploadPreview';
import PublicWebsitePreviewModal from '../components/content-management/shared/PublicWebsitePreviewModal';

export default function TempleInformation() {
  const {
    templeProfile,
    updateTempleProfile,
    historySections,
    addHistorySection,
    updateHistorySection,
    deleteHistorySection,
    deities,
    addDeity,
    updateDeity,
    deleteDeity,
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    websitePages,
    openPreview,
    showToast,
  } = useContentManagement();

  const [activeTab, setActiveTab] = useState('overview');
  const [profileForm, setProfileForm] = useState(templeProfile);
  const [selectedGalleryCat, setSelectedGalleryCat] = useState('ALL');

  // Modals state
  const [isAddHistoryModalOpen, setIsAddHistoryModalOpen] = useState(false);
  const [isAddDeityModalOpen, setIsAddDeityModalOpen] = useState(false);
  const [isAddGalleryModalOpen, setIsAddGalleryModalOpen] = useState(false);

  // New item forms
  const [historyForm, setHistoryForm] = useState({
    title: '',
    category: 'Historical Background',
    slug: '',
    content: '',
    verificationStatus: 'Draft',
    status: 'Draft',
  });

  const [deityForm, setDeityForm] = useState({
    name: '',
    significance: '',
    material: 'Sacred Black Chlorite Stone',
    dimensions: '',
    posture: '',
    description: '',
    adornment: '',
    verificationStatus: 'Draft',
    status: 'Draft',
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Main Temple',
    description: '',
    altText: '',
    imageUrl: '/src/assets/images/temple.jpg',
    status: 'Published',
  });

  // Derived Metrics
  const totalSections = historySections.length + deities.length + websitePages.length;
  const publishedSections =
    historySections.filter((h) => h.status === 'Published').length +
    deities.filter((d) => d.status === 'Published').length +
    websitePages.filter((p) => p.status === 'Published').length;
  const draftSections =
    historySections.filter((h) => h.status === 'Draft').length +
    deities.filter((d) => d.status === 'Draft').length +
    websitePages.filter((p) => p.status === 'Draft').length;
  const reviewRequiredCount = historySections.filter((h) => h.verificationStatus === 'Requires Review').length;

  const handleProfileSave = (publish = false) => {
    updateTempleProfile({
      ...profileForm,
      status: publish ? 'Published' : profileForm.status,
    });
    if (publish) {
      showToast('Temple profile published to public portal simulation.');
    }
  };

  const handleCreateHistory = (e) => {
    e.preventDefault();
    if (!historyForm.title || !historyForm.content) return;
    addHistorySection({
      ...historyForm,
      slug: historyForm.slug || historyForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });
    setHistoryForm({
      title: '',
      category: 'Historical Background',
      slug: '',
      content: '',
      verificationStatus: 'Draft',
      status: 'Draft',
    });
    setIsAddHistoryModalOpen(false);
  };

  const handleCreateDeity = (e) => {
    e.preventDefault();
    if (!deityForm.name || !deityForm.description) return;
    addDeity(deityForm);
    setDeityForm({
      name: '',
      significance: '',
      material: 'Sacred Black Chlorite Stone',
      dimensions: '',
      posture: '',
      description: '',
      adornment: '',
      verificationStatus: 'Draft',
      status: 'Draft',
    });
    setIsAddDeityModalOpen(false);
  };

  const handleCreateGalleryItem = (e) => {
    e.preventDefault();
    if (!galleryForm.title) return;
    addGalleryItem(galleryForm);
    setGalleryForm({
      title: '',
      category: 'Main Temple',
      description: '',
      altText: '',
      imageUrl: '/src/assets/images/temple.jpg',
      status: 'Published',
    });
    setIsAddGalleryModalOpen(false);
  };

  const tabs = [
    { id: 'overview', label: 'CMS Overview' },
    { id: 'profile', label: 'Temple Profile' },
    { id: 'history', label: 'History & Heritage', count: historySections.length, alert: reviewRequiredCount > 0 },
    { id: 'deities', label: 'Deity Information', count: deities.length },
    { id: 'gallery', label: 'Gallery Archive', count: galleryItems.length },
    { id: 'pages', label: 'Website Pages', count: websitePages.length },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <ContentPageHeader
        title="Temple Information & Public Identity"
        subtitle="Manage public-facing chronicles, 1501 CE heritage archives, sanctum deities and multimedia gallery for devotee portal."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => openPreview('temple-profile', profileForm)}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-stone-200 whitespace-nowrap shrink-0"
            >
              <Eye className="w-3.5 h-3.5 text-[#55132D]" />
              <span>Preview Public Portal</span>
            </button>
            <button
              onClick={() => handleProfileSave(true)}
              className="px-3.5 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Publish Profile</span>
            </button>
          </div>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Total Sections</span>
          <div className="text-2xl font-bold font-mono text-stone-900">{totalSections}</div>
          <span className="text-[11px] text-stone-500">History, Deities & Pages</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-stone-400">Published Status</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
              {Math.round((publishedSections / totalSections) * 100)}% Live
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">{publishedSections}</div>
          <span className="text-[11px] text-stone-500">Visible on public portal</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-stone-400">Review Queue</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700">{reviewRequiredCount}</div>
          <span className="text-[11px] text-stone-500">Awaiting historical audit</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Last Portal Sync</span>
          <div className="text-base font-bold text-stone-900 truncate">{templeProfile.lastUpdated}</div>
          <span className="text-[11px] text-stone-500 font-mono">By: {templeProfile.updatedBy}</span>
        </div>
      </div>

      {/* Tabs */}
      <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Recently Updated Portal Articles</h3>
            </div>

            <div className="space-y-2.5">
              {historySections.map((sec) => (
                <div
                  key={sec.id}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-150 flex items-center justify-between gap-3 hover:border-stone-300 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-stone-400 font-bold">{sec.id}</span>
                      <h4 className="text-xs font-bold text-stone-800 truncate">{sec.title}</h4>
                      <ContentStatusBadge status={sec.status} />
                      <VerificationBadge status={sec.verificationStatus} />
                    </div>
                    <p className="text-[11px] text-stone-500 truncate max-w-lg">{sec.content}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openPreview('temple-profile', profileForm)}
                      className="p-1 text-stone-500 hover:text-[#800000]"
                      title="Preview article"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-[11px] text-[#800000] font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Status card */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-3">Content Publication Summary</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-emerald-50/60 rounded-lg border border-emerald-150">
                  <span className="text-emerald-900 font-medium">Published / Live Content</span>
                  <span className="font-bold text-emerald-900 font-mono">{publishedSections} items</span>
                </div>
                <div className="flex justify-between p-2 bg-amber-50/60 rounded-lg border border-amber-150">
                  <span className="text-amber-900 font-medium">Draft / Pending Approval</span>
                  <span className="font-bold text-amber-900 font-mono">{draftSections} items</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50/60 rounded-lg border border-blue-150">
                  <span className="text-blue-900 font-medium">Media Gallery Photos</span>
                  <span className="font-bold text-blue-900 font-mono">{galleryItems.length} photos</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-150 space-y-2">
              <button
                onClick={() => setIsAddHistoryModalOpen(true)}
                className="w-full py-2 bg-[#800000] hover:bg-[#660000] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add History Section
              </button>
              <button
                onClick={() => setIsAddGalleryModalOpen(true)}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-stone-600" />
                Upload Gallery Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLE PROFILE EDITOR */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Core Temple Public Profile</h3>
            </div>
            <div className="flex items-center gap-2">
              <ContentStatusBadge status={templeProfile.status} />
              <VerificationBadge status={templeProfile.verificationStatus} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 Cols: Form Fields */}
            <div className="lg:col-span-2 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Official Temple Name *</label>
                  <input
                    type="text"
                    value={profileForm.templeName}
                    onChange={(e) => setProfileForm({ ...profileForm, templeName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Local / Regional Title</label>
                  <input
                    type="text"
                    value={profileForm.localName}
                    onChange={(e) => setProfileForm({ ...profileForm, localName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Shakti Peetha Theological Status</label>
                <input
                  type="text"
                  value={profileForm.shaktiPeethaStatus}
                  onChange={(e) => setProfileForm({ ...profileForm, shaktiPeethaStatus: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Brief Description (Homepage Snippet)</label>
                <textarea
                  rows={2}
                  value={profileForm.shortDescription}
                  onChange={(e) => setProfileForm({ ...profileForm, shortDescription: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Descriptive Chronicle</label>
                <textarea
                  rows={4}
                  value={profileForm.fullDescription}
                  onChange={(e) => setProfileForm({ ...profileForm, fullDescription: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Public Helpline Number</label>
                  <input
                    type="text"
                    value={profileForm.contactDetails?.helplinePhone || ''}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        contactDetails: { ...profileForm.contactDetails, helplinePhone: e.target.value },
                      })
                    }
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Official Website URL</label>
                  <input
                    type="text"
                    value={profileForm.officialWebsite}
                    onChange={(e) => setProfileForm({ ...profileForm, officialWebsite: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 font-mono text-[11px] focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>
            </div>

            {/* Right 1 Col: Media & Actions */}
            <div className="space-y-4">
              <ImageUploadPreview
                imageUrl={profileForm.mainImage}
                onImageChange={(newUrl) => setProfileForm({ ...profileForm, mainImage: newUrl })}
                label="Primary Temple Cover Image"
                recommendedSize="1200 × 675 px (Landscape)"
              />

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-2">
                <span className="font-bold text-stone-800 block text-[11px]">Publishing Controls:</span>
                <p className="text-[11px] text-stone-500">
                  Saving updates local demonstration state. Live website reflects updates immediately in simulator.
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleProfileSave(false)}
                    className="w-full py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes as Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProfileSave(true)}
                    className="w-full py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Globe className="w-3.5 h-3.5" /> Publish to Public Website
                  </button>
                  <button
                    type="button"
                    onClick={() => openPreview('temple-profile', profileForm)}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#800000]" /> Open Devotee Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORY & HERITAGE */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Historical & Theological Chronicles</h3>
            </div>
            <button
              onClick={() => setIsAddHistoryModalOpen(true)}
              className="px-3 py-1.5 bg-[#800000] hover:bg-[#660000] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add History Section
            </button>
          </div>

          <div className="space-y-3">
            {historySections.map((sec, idx) => (
              <div
                key={sec.id}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between hover:border-stone-300 transition-all"
              >
                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      #{idx + 1} • {sec.id}
                    </span>
                    <span className="text-[10px] font-semibold text-[#800000] bg-[#800000]/10 px-2 py-0.5 rounded">
                      {sec.category}
                    </span>
                    <ContentStatusBadge status={sec.status} />
                    <VerificationBadge status={sec.verificationStatus} />
                  </div>

                  <h4 className="text-sm font-bold text-stone-900">{sec.title}</h4>
                  <p className="text-stone-700 leading-relaxed text-xs">{sec.content}</p>

                  <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1">
                    <span>Slug: /{sec.slug}</span>
                    <span>•</span>
                    <span>Author/Source: {sec.author}</span>
                    <span>•</span>
                    <span>Updated: {sec.lastUpdated}</span>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex flex-row md:flex-col items-end justify-between gap-2 shrink-0 border-t md:border-t-0 md:border-l border-stone-150 pt-2 md:pt-0 md:pl-4">
                  <div className="flex items-center gap-1.5">
                    <select
                      value={sec.verificationStatus}
                      onChange={(e) => updateHistorySection(sec.id, { verificationStatus: e.target.value })}
                      className="text-[10px] border border-stone-300 rounded px-2 py-1 bg-stone-50 focus:outline-none focus:border-[#800000]"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Requires Review">Requires Review</option>
                      <option value="Verified">Verified</option>
                    </select>

                    <button
                      onClick={() =>
                        updateHistorySection(sec.id, {
                          status: sec.status === 'Published' ? 'Draft' : 'Published',
                        })
                      }
                      className={`text-[10px] font-semibold px-2 py-1 rounded transition-colors ${
                        sec.status === 'Published'
                          ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {sec.status === 'Published' ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>

                  <button
                    onClick={() => deleteHistorySection(sec.id)}
                    className="text-stone-400 hover:text-red-600 p-1 rounded"
                    title="Delete section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DEITY INFORMATION */}
      {activeTab === 'deities' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Enshrined Deities of Matabari</h3>
            </div>
            <button
              onClick={() => setIsAddDeityModalOpen(true)}
              className="px-3 py-1.5 bg-[#800000] hover:bg-[#660000] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Companion Murti
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deities.map((deity) => (
              <div
                key={deity.id}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {deity.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <ContentStatusBadge status={deity.status} />
                      <VerificationBadge status={deity.verificationStatus} />
                    </div>
                  </div>

                  <h4 className="text-base font-bold font-serif text-stone-900 mb-0.5">{deity.name}</h4>
                  <p className="text-xs text-[#800000] font-semibold mb-3">{deity.significance}</p>

                  <p className="text-xs text-stone-700 leading-relaxed mb-3">{deity.description}</p>

                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-150 space-y-1.5 text-xs text-stone-600 mb-2">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Sacred Material:</span>
                      <span className="font-semibold text-stone-800">{deity.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Dimensions:</span>
                      <span className="font-mono font-medium text-stone-800">{deity.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px] mb-0.5">Canonical Adornment:</span>
                      <p className="text-[11px] text-stone-700 leading-tight">{deity.adornment}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-150 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400">Updated: {deity.lastUpdated}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        updateDeity(deity.id, {
                          status: deity.status === 'Published' ? 'Draft' : 'Published',
                        })
                      }
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold rounded"
                    >
                      {deity.status === 'Published' ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GALLERY ARCHIVE */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-stone-400" /> Filter Category:
              </span>
              <select
                value={selectedGalleryCat}
                onChange={(e) => setSelectedGalleryCat(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#800000]"
              >
                <option value="ALL">All Categories ({galleryItems.length})</option>
                <option value="Main Temple">Main Temple</option>
                <option value="Temple Architecture">Temple Architecture</option>
                <option value="Deity">Deity</option>
                <option value="Kalyan Sagar">Kalyan Sagar</option>
                <option value="Festivals">Festivals</option>
                <option value="Temple Premises">Temple Premises</option>
                <option value="Cultural Activities">Cultural Activities</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddGalleryModalOpen(true)}
              className="px-3 py-1.5 bg-[#800000] hover:bg-[#660000] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Image
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems
              .filter((g) => selectedGalleryCat === 'ALL' || g.category === selectedGalleryCat)
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#800000]/40 transition-all"
                >
                  <div className="relative aspect-video bg-stone-900 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.altText}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded">
                      {item.category}
                    </div>
                    {item.featured && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> Featured
                      </div>
                    )}
                  </div>

                  <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs leading-snug line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-150 flex items-center justify-between text-[10px] text-stone-400">
                      <span>{item.uploadDate}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateGalleryItem(item.id, {
                              status: item.status === 'Published' ? 'Draft' : 'Published',
                            })
                          }
                          className="text-[#800000] font-semibold hover:underline"
                        >
                          {item.status}
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => deleteGalleryItem(item.id)}
                          className="hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 6: WEBSITE PAGES */}
      {activeTab === 'pages' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Configured Public Portal Pages</h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#800000] bg-[#800000]/10 px-2.5 py-1 rounded-full">
              {websitePages.length} Pages Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Page Title</th>
                  <th className="py-3 px-4">URL Slug</th>
                  <th className="py-3 px-4">Template Style</th>
                  <th className="py-3 px-4">Sections</th>
                  <th className="py-3 px-4">Last Modified</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {websitePages.map((pg) => (
                  <tr key={pg.id} className="hover:bg-stone-50/60">
                    <td className="py-3 px-4 font-bold text-stone-900">{pg.title}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-600">/{pg.slug}</td>
                    <td className="py-3 px-4 text-stone-600">{pg.template}</td>
                    <td className="py-3 px-4 font-mono text-stone-800">{pg.sectionsCount} Blocks</td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">{pg.lastModified}</td>
                    <td className="py-3 px-4">
                      <ContentStatusBadge status={pg.status} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openPreview('temple-profile', profileForm)}
                        className="text-[11px] text-[#800000] font-semibold hover:underline"
                      >
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD HISTORY SECTION */}
      {isAddHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Add History & Heritage Section</h3>
                <p className="text-xs text-stone-500">Provide documented historical narrative.</p>
              </div>
              <button
                onClick={() => setIsAddHistoryModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHistory} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Section Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Coinage & Stone Epigraphs of Dhanya Manikya"
                  value={historyForm.title}
                  onChange={(e) => setHistoryForm({ ...historyForm, title: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={historyForm.category}
                    onChange={(e) => setHistoryForm({ ...historyForm, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  >
                    <option value="Religious Significance">Religious Significance</option>
                    <option value="Historical Background">Historical Background</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Cultural Heritage">Cultural Heritage</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Verification Status</label>
                  <select
                    value={historyForm.verificationStatus}
                    onChange={(e) => setHistoryForm({ ...historyForm, verificationStatus: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  >
                    <option value="Draft">Draft / Unverified</option>
                    <option value="Requires Review">Requires Review</option>
                    <option value="Verified">Verified Official</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Historical Narrative Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide historical facts, temple lore, or epigraphic citations..."
                  value={historyForm.content}
                  onChange={(e) => setHistoryForm({ ...historyForm, content: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddHistoryModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DEITY */}
      {isAddDeityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Add Companion Deity Record</h3>
                <p className="text-xs text-stone-500">Document sanctum murtis with verifiable details.</p>
              </div>
              <button
                onClick={() => setIsAddDeityModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeity} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Deity Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chhotima (Maa Tripura Sundari Companion)"
                  value={deityForm.name}
                  onChange={(e) => setDeityForm({ ...deityForm, name: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Theological Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Camp Deity"
                    value={deityForm.significance}
                    onChange={(e) => setDeityForm({ ...deityForm, significance: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="e.g. Approx 2 feet"
                    value={deityForm.dimensions}
                    onChange={(e) => setDeityForm({ ...deityForm, dimensions: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Historical & Sacred Narrative *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Royal lineage background, worship traditions..."
                  value={deityForm.description}
                  onChange={(e) => setDeityForm({ ...deityForm, description: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeityModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GALLERY ITEM */}
      {isAddGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Upload Gallery Image</h3>
                <p className="text-xs text-stone-500">Select local image and assign public metadata.</p>
              </div>
              <button
                onClick={() => setIsAddGalleryModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGalleryItem} className="p-5 space-y-3.5 text-xs">
              <ImageUploadPreview
                imageUrl={galleryForm.imageUrl}
                onImageChange={(url, name) =>
                  setGalleryForm({
                    ...galleryForm,
                    imageUrl: url,
                    title: galleryForm.title || name.replace(/\.[^/.]+$/, ''),
                  })
                }
                altText={galleryForm.altText}
                onAltTextChange={(val) => setGalleryForm({ ...galleryForm, altText: val })}
              />

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image Caption / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening Sandhya Aarti Illumination"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                >
                  <option value="Main Temple">Main Temple</option>
                  <option value="Temple Architecture">Temple Architecture</option>
                  <option value="Deity">Deity</option>
                  <option value="Kalyan Sagar">Kalyan Sagar</option>
                  <option value="Festivals">Festivals</option>
                  <option value="Temple Premises">Temple Premises</option>
                  <option value="Cultural Activities">Cultural Activities</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGalleryModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg shadow-sm"
                >
                  Confirm Upload
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

