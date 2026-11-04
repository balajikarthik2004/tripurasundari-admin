import React, { useState } from 'react';
import {
  Landmark,
  BookOpen,
  Image as ImageIcon,
  Sparkles,
  Bell,
  Eye,
  Globe,
  Upload,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Save,
  Filter,
  X,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useContentManagement } from '../context/ContentManagementContext';
import ContentPageHeader from '../components/content-management/shared/ContentPageHeader';
import ContentTabs from '../components/content-management/shared/ContentTabs';
import PublicWebsitePreviewModal from '../components/content-management/shared/PublicWebsitePreviewModal';

export default function TempleInformation() {
  const {
    templeProfile,
    updateTempleProfile,
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    openPreview,
    showToast,
  } = useContentManagement();

  // 5 Navigation Bar Options
  const [activeTab, setActiveTab] = useState('profile');

  // Tab 1: Profile State
  const [profileForm, setProfileForm] = useState({
    ...templeProfile,
    foundationEra: templeProfile.foundationEra || '1501 CE by Maharaja Dhanya Manikya',
    darshanHours: templeProfile.darshanHours || '05:30 AM – 09:00 PM (Continuous)',
    bhogSchedule: templeProfile.bhogSchedule || '11:30 AM – 03:00 PM (Daily Mahaprasad)',
    coverImageUrl: templeProfile.coverImageUrl || '/matabari-premises-1.jpg',
  });

  // Tab 2: Deities State
  const [deitiesList, setDeitiesList] = useState([
    {
      id: 'DEITY-01',
      name: 'Mata Tripura Sundari (Soroshi)',
      role: 'Presiding Sovereign Deity (Boro Ma & Chhoto Ma)',
      murti: '5-ft Black Chlorite Stone Vigraha',
      timings: '05:30 AM, 12:30 PM & 06:30 PM',
      priest: 'Pt. Ramendra Sharma (Head Pujari)',
      status: 'Published',
    },
    {
      id: 'DEITY-02',
      name: 'Sri Chandi Mandap',
      role: 'Sacred Havan & Chandi Paath Enclosure',
      murti: 'Akhanda Yajna Kunda & Silver Trishul',
      timings: '08:00 AM (Pratah Chandi Paath)',
      priest: 'Pt. Kalyan Chakraborty',
      status: 'Published',
    },
    {
      id: 'DEITY-03',
      name: 'Lord Kalyaneswar Shiva Lingam',
      role: 'North Ghat Sacred Guardian Shrine',
      murti: 'Svayambhu Black Basalt Linga',
      timings: 'Daily Snana & Somwar Rudrabhishek',
      priest: 'Pt. Bhabesh Shastri',
      status: 'Published',
    },
    {
      id: 'DEITY-04',
      name: 'Bhairav Ksetrapala Shrine',
      role: 'Peetha Perimeter Guardian Protector',
      murti: 'Terracotta & Stone Vigraha',
      timings: 'Dhoop Aarti & Raksha Archana',
      priest: 'Temple Seva Dal Lead',
      status: 'Published',
    },
  ]);

  // Tab 3: Heritage & History State
  const [historyMilestones, setHistoryMilestones] = useState([
    {
      id: 'HIST-01',
      year: '1501 CE',
      title: 'Peetha Sthapana & Consecration',
      description:
        'Maharaja Dhanya Manikya installed the holy deity of Tripura Sundari after receiving a nocturnal divine command.',
      highlight: 'Char-chala vaulted architecture fusing Bengali style with indigenous Tripuri royal motifs.',
      status: 'Published',
    },
    {
      id: 'HIST-02',
      year: '1650 CE',
      title: 'Excavation of Sacred Kalyan Sagar',
      description:
        'Maharaja Kalyan Manikya excavated the 6.4-acre holy lake south of the temple.',
      highlight: 'Permanent sanctuary for venerable Bostami freshwater black softshell turtles.',
      status: 'Published',
    },
    {
      id: 'HIST-03',
      year: '1700s',
      title: 'Sanctum Fortification & Restoration',
      description:
        'Reconstructed with earthquake-resistant solid brick masonry by Maharaja Rama Manikya.',
      highlight: 'Preserved the historic sanctum dome with antique terracotta ornamental friezes.',
      status: 'Published',
    },
    {
      id: 'HIST-04',
      year: 'Present',
      title: '51 Sacred Shakti Peethas Recognition',
      description:
        'Venerated across India as the sacred spot where Sati’s right foot (Dakshina Pada) fell.',
      highlight: 'Welcoming over 2.5 million devotees and pilgrims annually.',
      status: 'Published',
    },
  ]);

  // Tab 4: Gallery Filter
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('ALL');

  // Tab 5: Public Announcements State
  const [announcements, setAnnouncements] = useState([
    {
      id: 'ANN-01',
      title: 'Diwali Mahotsav 2026 Special Darshan Timings',
      category: 'Festival Notice',
      priority: 'High',
      content:
        '24-hour continuous darshan corridors open from Nov 11 to Nov 15. Free shoe cloakrooms active at West Gopuram.',
      validity: 'Valid through Nov 16, 2026',
      status: 'Live',
    },
    {
      id: 'ANN-02',
      title: 'Kalyan Sagar Ghat Water Safety Notice',
      category: 'Safety Advisory',
      priority: 'Medium',
      content:
        'Devotees must stay behind safety chains on submerged steps. Feeding sacred turtles restricted to pure puffed rice (muri).',
      validity: 'Continuous Protocol',
      status: 'Live',
    },
    {
      id: 'ANN-03',
      title: 'Daily Free Annadanam Lunch Service Hours',
      category: 'Prasad Service',
      priority: 'Medium',
      content:
        'Mahaprasad coupon distribution starts 09:30 AM at East Counter. Dining batches operate continuously from 11:30 AM to 03:00 PM.',
      validity: 'Daily Service',
      status: 'Live',
    },
    {
      id: 'ANN-04',
      title: 'Senior Citizen & Divyangjan Wheelchair Assistance',
      category: 'Accessibility',
      priority: 'Medium',
      content:
        'Free battery-operated shuttle carts running from West Bus Terminal to Sanctum North Ramp with dedicated volunteer assistance.',
      validity: 'Daily Service',
      status: 'Live',
    },
  ]);

  // Modals & Editing State
  const [deityModal, setDeityModal] = useState({ isOpen: false, item: null, isEdit: false });
  const [milestoneModal, setMilestoneModal] = useState({ isOpen: false, item: null, isEdit: false });
  const [announcementModal, setAnnouncementModal] = useState({ isOpen: false, item: null, isEdit: false });
  const [galleryModal, setGalleryModal] = useState({ isOpen: false, item: null, isEdit: false });
  const [coverPhotoModal, setCoverPhotoModal] = useState(false);

  // Profile Save
  const handleProfileSave = (publish = false) => {
    updateTempleProfile({
      ...profileForm,
      status: publish ? 'Published' : profileForm.status,
    });
    showToast(
      publish
        ? 'Temple profile published to devotee portal successfully.'
        : 'Profile draft saved successfully.'
    );
  };

  // --- Deity Handlers ---
  const openAddDeity = () => {
    setDeityModal({
      isOpen: true,
      isEdit: false,
      item: {
        id: `DEITY-0${deitiesList.length + 1}`,
        name: '',
        role: '',
        murti: '',
        timings: '',
        priest: '',
        status: 'Published',
      },
    });
  };

  const openEditDeity = (deity) => {
    setDeityModal({ isOpen: true, isEdit: true, item: { ...deity } });
  };

  const saveDeityModal = () => {
    if (!deityModal.item?.name.trim()) {
      showToast('Please enter deity name', 'error');
      return;
    }
    if (deityModal.isEdit) {
      setDeitiesList((prev) =>
        prev.map((d) => (d.id === deityModal.item.id ? deityModal.item : d))
      );
      showToast('Deity shrine updated for devotee portal.');
    } else {
      setDeitiesList((prev) => [...prev, deityModal.item]);
      showToast('New deity shrine added.');
    }
    setDeityModal({ isOpen: false, item: null, isEdit: false });
  };

  const toggleDeityStatus = (id) => {
    setDeitiesList((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === 'Published' ? 'Draft' : 'Published' }
          : d
      )
    );
    showToast('Deity portal visibility updated.');
  };

  const deleteDeity = (id) => {
    if (window.confirm('Remove this deity entry from devotee portal?')) {
      setDeitiesList((prev) => prev.filter((d) => d.id !== id));
      showToast('Deity entry removed.');
    }
  };

  // --- Milestone Handlers ---
  const openAddMilestone = () => {
    setMilestoneModal({
      isOpen: true,
      isEdit: false,
      item: {
        id: `HIST-0${historyMilestones.length + 1}`,
        year: '',
        title: '',
        description: '',
        highlight: '',
        status: 'Published',
      },
    });
  };

  const openEditMilestone = (milestone) => {
    setMilestoneModal({ isOpen: true, isEdit: true, item: { ...milestone } });
  };

  const saveMilestoneModal = () => {
    if (!milestoneModal.item?.title.trim()) {
      showToast('Please enter chronicle title', 'error');
      return;
    }
    if (milestoneModal.isEdit) {
      setHistoryMilestones((prev) =>
        prev.map((m) => (m.id === milestoneModal.item.id ? milestoneModal.item : m))
      );
      showToast('Chronicle updated for devotee portal.');
    } else {
      setHistoryMilestones((prev) => [...prev, milestoneModal.item]);
      showToast('New chronicle added.');
    }
    setMilestoneModal({ isOpen: false, item: null, isEdit: false });
  };

  const toggleHistoryStatus = (id) => {
    setHistoryMilestones((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, status: h.status === 'Published' ? 'Draft' : 'Published' }
          : h
      )
    );
    showToast('Historical milestone portal visibility updated.');
  };

  const deleteMilestone = (id) => {
    if (window.confirm('Remove this historical milestone?')) {
      setHistoryMilestones((prev) => prev.filter((m) => m.id !== id));
      showToast('Milestone removed.');
    }
  };

  // --- Announcement Handlers ---
  const openAddAnnouncement = () => {
    setAnnouncementModal({
      isOpen: true,
      isEdit: false,
      item: {
        id: `ANN-0${announcements.length + 1}`,
        title: '',
        category: 'Festival Notice',
        priority: 'High',
        content: '',
        validity: 'Continuous Protocol',
        status: 'Live',
      },
    });
  };

  const openEditAnnouncement = (ann) => {
    setAnnouncementModal({ isOpen: true, isEdit: true, item: { ...ann } });
  };

  const saveAnnouncementModal = () => {
    if (!announcementModal.item?.title.trim()) {
      showToast('Please enter announcement title', 'error');
      return;
    }
    if (announcementModal.isEdit) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === announcementModal.item.id ? announcementModal.item : a))
      );
      showToast('Announcement updated for devotee portal.');
    } else {
      setAnnouncements((prev) => [...prev, announcementModal.item]);
      showToast('New notice posted to devotee portal.');
    }
    setAnnouncementModal({ isOpen: false, item: null, isEdit: false });
  };

  const toggleAnnouncementStatus = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'Live' ? 'Draft' : 'Live' } : a
      )
    );
    showToast('Notice live broadcast status updated.');
  };

  const deleteAnnouncement = (id) => {
    if (window.confirm('Remove this announcement notice?')) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      showToast('Announcement removed.');
    }
  };

  // --- Gallery Handlers ---
  const openAddPhoto = () => {
    setGalleryModal({
      isOpen: true,
      isEdit: false,
      item: {
        title: '',
        category: 'Main Temple',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Tripura_Sundari_Temple%2C_Udaipur.jpg',
        description: '',
        status: 'Published',
      },
    });
  };

  const openEditPhoto = (photo) => {
    setGalleryModal({ isOpen: true, isEdit: true, item: { ...photo } });
  };

  const saveGalleryModal = () => {
    if (!galleryModal.item?.title.trim()) {
      showToast('Please enter photo title', 'error');
      return;
    }
    if (galleryModal.isEdit) {
      updateGalleryItem(galleryModal.item.id, galleryModal.item);
      showToast('Photo details updated.');
    } else {
      addGalleryItem({
        ...galleryModal.item,
        uploadDate: 'Today',
      });
      showToast('New photo added to devotee gallery.');
    }
    setGalleryModal({ isOpen: false, item: null, isEdit: false });
  };

  // 5 Navigation Bar Options
  const tabs = [
    { id: 'profile', label: 'Temple Profile', icon: Landmark },
    { id: 'deities', label: 'Deities & Shrines', icon: Sparkles, count: deitiesList.length },
    { id: 'heritage', label: 'Heritage & History', icon: BookOpen, count: historyMilestones.length },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon, count: galleryItems.length },
    { id: 'announcements', label: 'Announcements', icon: Bell, count: announcements.length },
  ];

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* 1. Page Header */}
      <ContentPageHeader
        title="Temple Content"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => openPreview('temple-profile', profileForm)}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#55132D]" />
              <span>Preview Devotee Portal</span>
            </button>
            <button
              onClick={() => handleProfileSave(true)}
              className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Publish All to Portal</span>
            </button>
          </div>
        }
      />

      {/* Synchronized Devotee Portal Notice Banner */}
      <div className="flex items-center justify-between text-xs px-4 py-2.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 shadow-2xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Devotee Portal CMS:</strong> All temple profiles, sanctum deities, historical chronicles, photo galleries, and announcements configured here directly update the public devotee mobile and web portal.
          </span>
        </div>
        <span className="hidden sm:inline-block font-mono text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-md">
          Live sync: matabari.tripura.gov.in
        </span>
      </div>

      {/* 2. 5 Clean Navigation Bar Options */}
      <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* ======================================================== */}
      {/* OPTION 1: TEMPLE PROFILE */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Left 2 Cols: Structured Identity & Operational Details */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-150 pb-3">
              <div>
                <h3 className="text-base font-bold font-serif text-stone-900 tracking-tight">
                  Core Identity & Operational Schedule
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Directly editable fields displayed on devotee portal hero & footer
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-bold">
                ● Published / Live
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Official Temple Name
                </label>
                <input
                  type="text"
                  value={profileForm.templeName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, templeName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Local / Regional Title
                </label>
                <input
                  type="text"
                  value={profileForm.localName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, localName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Theological Shakti Peetha Status
                </label>
                <input
                  type="text"
                  value={profileForm.shaktiPeethaStatus}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, shaktiPeethaStatus: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Foundation Consecration Era
                </label>
                <input
                  type="text"
                  value={profileForm.foundationEra}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, foundationEra: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Daily Public Darshan Hours (Shown to Devotees)
                </label>
                <input
                  type="text"
                  value={profileForm.darshanHours}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, darshanHours: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Daily Free Annadanam Bhog Schedule
                </label>
                <input
                  type="text"
                  value={profileForm.bhogSchedule}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bhogSchedule: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Public Helpline Number
                </label>
                <input
                  type="text"
                  value={profileForm.contactDetails?.helplinePhone || '+91 3821 222238'}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      contactDetails: {
                        ...profileForm.contactDetails,
                        helplinePhone: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Official Portal Website URL
                </label>
                <input
                  type="text"
                  value={profileForm.officialWebsite}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, officialWebsite: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1 text-xs">
                Devotee Homepage Overview Summary (Public introduction)
              </label>
              <textarea
                rows={3}
                value={profileForm.shortDescription}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, shortDescription: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#55132D] leading-relaxed"
              />
            </div>
          </div>

          {/* Right 1 Col: Cover Media & Publishing Control — Equal Height */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs flex flex-col justify-between h-full">
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-stone-150 pb-3">
                <span className="font-bold font-serif text-stone-900 text-base tracking-tight">
                  Primary Portal Cover Visual
                </span>
                <button
                  type="button"
                  onClick={() => setCoverPhotoModal(true)}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#55132D] bg-[#55132D]/10 hover:bg-[#55132D] hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Change Cover</span>
                </button>
              </div>

              <div className="relative flex-1 min-h-[220px] rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group">
                <img
                  src={profileForm.coverImageUrl}
                  alt="Mata Tripura Sundari Temple"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                  Active Cover Visual
                </div>
              </div>

              <div className="text-[11px] text-stone-500 bg-stone-50 rounded-xl p-2.5 border border-stone-200/80">
                <span className="font-semibold text-stone-700 block mb-0.5">Homepage Hero Visual</span>
                Displayed across devotee mobile web portal, digital visitor passes, and darshan booking confirmations.
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-stone-150 text-xs mt-3">
              <button
                type="button"
                onClick={() => handleProfileSave(true)}
                className="w-full py-2.5 bg-[#55132D] hover:bg-[#681B37] text-white font-bold rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#E2BC6B]" />
                <span>Publish Profile to Public Portal</span>
              </button>
              <button
                type="button"
                onClick={() => handleProfileSave(false)}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* OPTION 2: DEITIES & SHRINES */}
      {/* ======================================================== */}
      {activeTab === 'deities' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-serif text-stone-900 tracking-tight">
                Enshrined Deities & Shrines ({deitiesList.length})
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Documented sanctum murtis, daily aarti schedules & seva pujaris for devotee guidance
              </p>
            </div>
            <button
              onClick={openAddDeity}
              className="px-3.5 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Add Deity Shrine</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deitiesList.map((deity) => (
              <div
                key={deity.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-4.5 shadow-2xs space-y-3 hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                      {deity.id}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleDeityStatus(deity.id)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer border ${
                          deity.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                        title="Click to toggle Devotee Portal visibility"
                      >
                        ● {deity.status === 'Published' ? 'Live on Portal' : 'Draft (Hidden)'}
                      </button>
                      <button
                        onClick={() => openEditDeity(deity)}
                        className="p-1 hover:bg-stone-100 text-stone-600 hover:text-[#55132D] rounded transition-colors cursor-pointer"
                        title="Edit Deity details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDeity(deity.id)}
                        className="p-1 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Delete Deity entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold font-serif text-stone-900">
                      {deity.name}
                    </h4>
                    <p className="text-[11.5px] text-[#55132D] font-medium mt-0.5">
                      {deity.role}
                    </p>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 space-y-1.5 text-[11px] text-stone-600">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Sacred Murti:</span>
                      <span className="font-semibold text-stone-800">{deity.murti}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Puja Schedule:</span>
                      <span className="font-medium text-stone-800">{deity.timings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Pujari In-charge:</span>
                      <span className="font-semibold text-[#55132D]">{deity.priest}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-stone-150 flex items-center justify-between text-xs">
                  <span className="text-[10.5px] text-stone-400">Published to public deity directory</span>
                  <button
                    onClick={() => openEditDeity(deity)}
                    className="text-[#55132D] text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Edit Shrine Details</span>
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* OPTION 3: HERITAGE & HISTORY */}
      {/* ======================================================== */}
      {activeTab === 'heritage' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-serif text-stone-900 tracking-tight">
                Historical Chronicles & Heritage Milestones ({historyMilestones.length})
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Epigraphic records and architectural chronicles published on devotee portal history section
              </p>
            </div>
            <button
              onClick={openAddMilestone}
              className="px-3.5 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Add Chronicle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historyMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-4.5 shadow-2xs space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#55132D]/10 text-[#55132D] font-serif font-bold text-xs">
                      {milestone.year}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleHistoryStatus(milestone.id)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer border ${
                          milestone.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                        title="Click to toggle Devotee Portal visibility"
                      >
                        ● {milestone.status === 'Published' ? 'Live on Portal' : 'Draft (Hidden)'}
                      </button>
                      <button
                        onClick={() => openEditMilestone(milestone)}
                        className="p-1 hover:bg-stone-100 text-stone-600 hover:text-[#55132D] rounded transition-colors cursor-pointer"
                        title="Edit milestone chronicle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMilestone(milestone.id)}
                        className="p-1 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold font-serif text-stone-900">
                    {milestone.title}
                  </h4>

                  <p className="text-[11.5px] text-stone-700 leading-relaxed">
                    {milestone.description}
                  </p>

                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-150 text-[10.5px] text-stone-600 font-medium">
                    {milestone.highlight}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-stone-150 flex items-center justify-between text-xs">
                  <span className="text-[10.5px] text-stone-400">Chronicle ID: {milestone.id}</span>
                  <button
                    onClick={() => openEditMilestone(milestone)}
                    className="text-[#55132D] text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Edit Chronicle</span>
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* OPTION 4: PHOTO GALLERY */}
      {/* ======================================================== */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'Main Temple', 'Temple Architecture', 'Kalyan Sagar', 'Festivals'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedGalleryCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      selectedGalleryCategory === cat
                        ? 'bg-[#55132D] text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Photos' : cat}
                  </button>
                )
              )}
            </div>

            <button
              onClick={openAddPhoto}
              className="px-3.5 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Add / Upload Photo</span>
            </button>
          </div>

          {/* Clean 4-Column Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems
              .filter(
                (g) =>
                  selectedGalleryCategory === 'ALL' ||
                  g.category === selectedGalleryCategory
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs flex flex-col justify-between group hover:border-[#55132D] transition-all"
                >
                  <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/matabari-premises-1.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-bold px-2 py-0.5 rounded-md">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10.5px] text-stone-500 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-150 flex items-center justify-between text-[10px] text-stone-500">
                      <span>{item.uploadDate}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateGalleryItem(item.id, {
                              status: item.status === 'Published' ? 'Draft' : 'Published',
                            })
                          }
                          className="text-[#55132D] font-bold hover:underline cursor-pointer"
                          title="Toggle published status"
                        >
                          {item.status}
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => openEditPhoto(item)}
                          className="text-stone-500 hover:text-[#55132D] cursor-pointer"
                          title="Edit photo info"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => deleteGalleryItem(item.id)}
                          className="text-stone-400 hover:text-rose-600 cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* OPTION 5: PUBLIC ANNOUNCEMENTS */}
      {/* ======================================================== */}
      {activeTab === 'announcements' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-serif text-stone-900 tracking-tight">
                Live Devotee Announcements & Public Notices ({announcements.length})
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Active alerts displayed in devotee portal header marquee and news feed
              </p>
            </div>
            <button
              onClick={openAddAnnouncement}
              className="px-3.5 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Post Announcement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-4.5 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                      {ann.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAnnouncementStatus(ann.id)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer border ${
                          ann.status === 'Live'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                        title="Click to toggle Devotee Portal visibility"
                      >
                        ● {ann.status === 'Live' ? 'Live on Portal' : 'Draft (Hidden)'}
                      </button>
                      <button
                        onClick={() => openEditAnnouncement(ann)}
                        className="p-1 hover:bg-stone-100 text-stone-600 hover:text-[#55132D] rounded transition-colors cursor-pointer"
                        title="Edit announcement notice"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="p-1 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Delete announcement notice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold font-serif text-stone-900">
                    {ann.title}
                  </h4>

                  <p className="text-[11.5px] text-stone-700 leading-relaxed">
                    {ann.content}
                  </p>

                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-150 flex items-center justify-between text-[10.5px] text-stone-500 font-mono">
                    <span>{ann.validity}</span>
                    <span className="font-semibold text-stone-700">Notice ID: {ann.id}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-stone-150 flex items-center justify-between text-xs">
                  <span className="text-[10.5px] text-stone-400">Broadcast to devotee web portal</span>
                  <button
                    onClick={() => openEditAnnouncement(ann)}
                    className="text-[#55132D] text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Edit Notice Content</span>
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT DEITY SHRINE */}
      {/* ======================================================== */}
      {deityModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                {deityModal.isEdit ? 'Edit Deity Shrine' : 'Add New Deity Shrine'}
              </h3>
              <button
                onClick={() => setDeityModal({ isOpen: false, item: null, isEdit: false })}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Deity / Shrine Name *
                </label>
                <input
                  type="text"
                  value={deityModal.item?.name || ''}
                  onChange={(e) =>
                    setDeityModal({
                      ...deityModal,
                      item: { ...deityModal.item, name: e.target.value },
                    })
                  }
                  placeholder="e.g. Mata Tripura Sundari (Chhoto Ma)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Theological Significance / Role
                </label>
                <input
                  type="text"
                  value={deityModal.item?.role || ''}
                  onChange={(e) =>
                    setDeityModal({
                      ...deityModal,
                      item: { ...deityModal.item, role: e.target.value },
                    })
                  }
                  placeholder="e.g. Presiding Sovereign Deity"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Sacred Murti Description
                </label>
                <input
                  type="text"
                  value={deityModal.item?.murti || ''}
                  onChange={(e) =>
                    setDeityModal({
                      ...deityModal,
                      item: { ...deityModal.item, murti: e.target.value },
                    })
                  }
                  placeholder="e.g. 5-ft Black Chlorite Stone Vigraha"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Daily Puja Schedule
                  </label>
                  <input
                    type="text"
                    value={deityModal.item?.timings || ''}
                    onChange={(e) =>
                      setDeityModal({
                        ...deityModal,
                        item: { ...deityModal.item, timings: e.target.value },
                      })
                    }
                    placeholder="e.g. 05:30 AM & 06:30 PM"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Pujari In-charge
                  </label>
                  <input
                    type="text"
                    value={deityModal.item?.priest || ''}
                    onChange={(e) =>
                      setDeityModal({
                        ...deityModal,
                        item: { ...deityModal.item, priest: e.target.value },
                      })
                    }
                    placeholder="e.g. Head Pujari"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Portal Visibility Status
                </label>
                <select
                  value={deityModal.item?.status || 'Published'}
                  onChange={(e) =>
                    setDeityModal({
                      ...deityModal,
                      item: { ...deityModal.item, status: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                >
                  <option value="Published">Published (Live on Devotee Portal)</option>
                  <option value="Draft">Draft (Hidden from Devotees)</option>
                </select>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDeityModal({ isOpen: false, item: null, isEdit: false })}
                className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDeityModal}
                className="px-4 py-2 bg-[#55132D] text-white font-semibold rounded-xl hover:bg-[#681B37] cursor-pointer"
              >
                Save Deity Shrine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD / EDIT HISTORICAL CHRONICLE */}
      {/* ======================================================== */}
      {milestoneModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                {milestoneModal.isEdit ? 'Edit Historical Chronicle' : 'Add New Historical Chronicle'}
              </h3>
              <button
                onClick={() => setMilestoneModal({ isOpen: false, item: null, isEdit: false })}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Year / Era *
                  </label>
                  <input
                    type="text"
                    value={milestoneModal.item?.year || ''}
                    onChange={(e) =>
                      setMilestoneModal({
                        ...milestoneModal,
                        item: { ...milestoneModal.item, year: e.target.value },
                      })
                    }
                    placeholder="e.g. 1501 CE"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Chronicle Title *
                  </label>
                  <input
                    type="text"
                    value={milestoneModal.item?.title || ''}
                    onChange={(e) =>
                      setMilestoneModal({
                        ...milestoneModal,
                        item: { ...milestoneModal.item, title: e.target.value },
                      })
                    }
                    placeholder="e.g. Peetha Sthapana & Consecration"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Historical Chronicle Narrative (Shown to Devotees)
                </label>
                <textarea
                  rows={3}
                  value={milestoneModal.item?.description || ''}
                  onChange={(e) =>
                    setMilestoneModal({
                      ...milestoneModal,
                      item: { ...milestoneModal.item, description: e.target.value },
                    })
                  }
                  placeholder="Detailed chronicle narrative for devotee website..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D] leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Architectural / Inscriptional Highlight
                </label>
                <input
                  type="text"
                  value={milestoneModal.item?.highlight || ''}
                  onChange={(e) =>
                    setMilestoneModal({
                      ...milestoneModal,
                      item: { ...milestoneModal.item, highlight: e.target.value },
                    })
                  }
                  placeholder="e.g. Char-chala vaulted architecture fusing Bengali style..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Portal Visibility Status
                </label>
                <select
                  value={milestoneModal.item?.status || 'Published'}
                  onChange={(e) =>
                    setMilestoneModal({
                      ...milestoneModal,
                      item: { ...milestoneModal.item, status: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                >
                  <option value="Published">Published (Live on Devotee Portal)</option>
                  <option value="Draft">Draft (Hidden from Devotees)</option>
                </select>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMilestoneModal({ isOpen: false, item: null, isEdit: false })}
                className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveMilestoneModal}
                className="px-4 py-2 bg-[#55132D] text-white font-semibold rounded-xl hover:bg-[#681B37] cursor-pointer"
              >
                Save Chronicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD / EDIT ANNOUNCEMENT NOTICE */}
      {/* ======================================================== */}
      {announcementModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                {announcementModal.isEdit ? 'Edit Devotee Announcement' : 'Post New Devotee Announcement'}
              </h3>
              <button
                onClick={() => setAnnouncementModal({ isOpen: false, item: null, isEdit: false })}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Notice Headline *
                </label>
                <input
                  type="text"
                  value={announcementModal.item?.title || ''}
                  onChange={(e) =>
                    setAnnouncementModal({
                      ...announcementModal,
                      item: { ...announcementModal.item, title: e.target.value },
                    })
                  }
                  placeholder="e.g. Diwali Mahotsav 2026 Special Darshan Timings"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Notice Category
                  </label>
                  <select
                    value={announcementModal.item?.category || 'Festival Notice'}
                    onChange={(e) =>
                      setAnnouncementModal({
                        ...announcementModal,
                        item: { ...announcementModal.item, category: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="Festival Notice">Festival Notice</option>
                    <option value="Safety Advisory">Safety Advisory</option>
                    <option value="Prasad Service">Prasad Service</option>
                    <option value="Accessibility">Accessibility</option>
                    <option value="General Advisory">General Advisory</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Priority Alert
                  </label>
                  <select
                    value={announcementModal.item?.priority || 'High'}
                    onChange={(e) =>
                      setAnnouncementModal({
                        ...announcementModal,
                        item: { ...announcementModal.item, priority: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="High">High (Banner Marquee)</option>
                    <option value="Medium">Medium (Standard Feed)</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Notice Content & Devotee Instructions
                </label>
                <textarea
                  rows={3}
                  value={announcementModal.item?.content || ''}
                  onChange={(e) =>
                    setAnnouncementModal({
                      ...announcementModal,
                      item: { ...announcementModal.item, content: e.target.value },
                    })
                  }
                  placeholder="Provide precise details, gate instructions, and timings for pilgrims..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D] leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Validity Period / Range
                </label>
                <input
                  type="text"
                  value={announcementModal.item?.validity || ''}
                  onChange={(e) =>
                    setAnnouncementModal({
                      ...announcementModal,
                      item: { ...announcementModal.item, validity: e.target.value },
                    })
                  }
                  placeholder="e.g. Valid through Nov 16, 2026"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Broadcast Status
                </label>
                <select
                  value={announcementModal.item?.status || 'Live'}
                  onChange={(e) =>
                    setAnnouncementModal({
                      ...announcementModal,
                      item: { ...announcementModal.item, status: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                >
                  <option value="Live">Live (Broadcasted to Devotee Portal)</option>
                  <option value="Draft">Draft (Hidden from Devotees)</option>
                </select>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAnnouncementModal({ isOpen: false, item: null, isEdit: false })}
                className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveAnnouncementModal}
                className="px-4 py-2 bg-[#55132D] text-white font-semibold rounded-xl hover:bg-[#681B37] cursor-pointer"
              >
                Broadcast Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ADD / EDIT GALLERY PHOTO */}
      {/* ======================================================== */}
      {galleryModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                {galleryModal.isEdit ? 'Edit Photo Details' : 'Upload / Add Photo to Gallery'}
              </h3>
              <button
                onClick={() => setGalleryModal({ isOpen: false, item: null, isEdit: false })}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Photo Caption / Title *
                </label>
                <input
                  type="text"
                  value={galleryModal.item?.title || ''}
                  onChange={(e) =>
                    setGalleryModal({
                      ...galleryModal,
                      item: { ...galleryModal.item, title: e.target.value },
                    })
                  }
                  placeholder="e.g. Sanctum Char-chala Dome at Sunset"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Gallery Category
                  </label>
                  <select
                    value={galleryModal.item?.category || 'Main Temple'}
                    onChange={(e) =>
                      setGalleryModal({
                        ...galleryModal,
                        item: { ...galleryModal.item, category: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="Main Temple">Main Temple</option>
                    <option value="Temple Architecture">Temple Architecture</option>
                    <option value="Kalyan Sagar">Kalyan Sagar</option>
                    <option value="Festivals">Festivals</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Image URL or Photo Link
                  </label>
                  <input
                    type="url"
                    value={galleryModal.item?.imageUrl || ''}
                    onChange={(e) =>
                      setGalleryModal({
                        ...galleryModal,
                        item: { ...galleryModal.item, imageUrl: e.target.value },
                      })
                    }
                    placeholder="https://... or choose preset below"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-stone-500">
                    <span className="font-medium text-stone-600">Preset:</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setGalleryModal({
                            ...galleryModal,
                            item: { ...galleryModal.item, imageUrl: e.target.value },
                          });
                        }
                      }}
                      className="text-[11px] border border-stone-200 rounded-lg px-2 py-0.5 bg-white text-stone-700 focus:outline-none"
                    >
                      <option value="">-- Quick Choose Preset --</option>
                      <option value="https://upload.wikimedia.org/wikipedia/commons/b/be/Tripura_Sundari_Temple%2C_Udaipur.jpg">Sanctum Dome at Sunrise</option>
                      <option value="https://upload.wikimedia.org/wikipedia/commons/e/e2/Kalyan_Sagar.JPG">Sacred Kalyan Sagar Lake</option>
                      <option value="https://upload.wikimedia.org/wikipedia/commons/4/4d/Goddess_Tripureswari.jpg">Deity Idol Vigraha</option>
                      <option value="https://upload.wikimedia.org/wikipedia/commons/1/1d/Matabari_Mela.jpg">Matabari Diwali Mela</option>
                      <option value="https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80">Aarti Deepas & Lamps</option>
                      <option value="/matabari-premises-1.jpg">Local Courtyard Premises</option>
                      <option value="/matabari-main.jpg">Temple Main Entrance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Preview in Modal */}
              {galleryModal.item?.imageUrl && (
                <div className="relative aspect-[16/8] w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                  <img
                    src={galleryModal.item.imageUrl}
                    alt="Preview"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/matabari-premises-1.jpg';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 right-2 bg-black/60 text-white text-[9.5px] px-2 py-0.5 rounded font-medium">
                    Live Photo Preview
                  </span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description / Devotee Context
                </label>
                <textarea
                  rows={2}
                  value={galleryModal.item?.description || ''}
                  onChange={(e) =>
                    setGalleryModal({
                      ...galleryModal,
                      item: { ...galleryModal.item, description: e.target.value },
                    })
                  }
                  placeholder="Devotee description shown on gallery lightbox..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>
            </div>

            <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setGalleryModal({ isOpen: false, item: null, isEdit: false })}
                className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveGalleryModal}
                className="px-4 py-2 bg-[#55132D] text-white font-semibold rounded-xl hover:bg-[#681B37] cursor-pointer"
              >
                Save Photo Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: CHANGE PORTAL COVER PHOTO */}
      {/* ======================================================== */}
      {coverPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                Select Portal Cover Visual
              </h3>
              <button
                onClick={() => setCoverPhotoModal(false)}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <p className="text-stone-600">
                Choose the primary landscape cover visual displayed on the Devotee Portal homepage and digital passes:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { name: 'Inner Sanctum Heritage Courtyard', url: '/matabari-premises-1.jpg' },
                  { name: 'Outer Temple Corridors & Perimeter', url: '/matabari-premises-2.jpg' },
                  { name: 'Historic Bengali Char-chala Sanctum', url: '/matabari-temple-main.png' },
                ].map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setProfileForm({ ...profileForm, coverImageUrl: preset.url });
                      setCoverPhotoModal(false);
                      showToast('Cover visual updated. Click "Publish Profile" to apply live.');
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      profileForm.coverImageUrl === preset.url
                        ? 'border-[#55132D] bg-[#55132D]/5 ring-1 ring-[#55132D]'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-16 h-11 object-cover rounded-lg border border-stone-200 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-stone-900">{preset.name}</div>
                      <div className="text-[10.5px] text-stone-400 font-mono">{preset.url}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setCoverPhotoModal(false)}
                className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-100 cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Devotee Portal Preview Modal */}
      <PublicWebsitePreviewModal />
    </div>
  );
}
