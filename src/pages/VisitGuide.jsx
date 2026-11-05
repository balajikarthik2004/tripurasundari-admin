import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  Building2,
  HelpCircle,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  Car,
  Plane,
  Train,
  Bus,
  Droplet,
  Sparkles,
  Waves,
  Utensils,
  ShoppingBag,
  Home,
  LogIn,
  LogOut,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Info,
  PhoneCall,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useContentManagement } from '../context/ContentManagementContext';
import ContentPageHeader from '../components/content-management/shared/ContentPageHeader';
import ContentTabs from '../components/content-management/shared/ContentTabs';
import ContentStatusBadge from '../components/content-management/shared/ContentStatusBadge';
import VerificationBadge from '../components/content-management/shared/VerificationBadge';
import OverlayPortal from '../components/common/OverlayPortal';
import PublicWebsitePreviewModal from '../components/content-management/shared/PublicWebsitePreviewModal';
import TempleArchitectureMap from '../components/content-management/shared/TempleArchitectureMap';

export default function VisitGuide({ isEmbedded = false }) {
  const {
    visitorGuidelines,
    addVisitorGuideline,
    updateVisitorGuideline,
    deleteVisitorGuideline,
    travelInformation,
    updateTravelInformation,
    mapMarkers,
    addMapMarker,
    updateMapMarker,
    moveMapMarker,
    toggleMarkerVisibility,
    deleteMapMarker,
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    openPreview,
    showToast,
  } = useContentManagement();

  const [activeTab, setActiveTab] = useState('facilities_map');
  const [guidelinesSubTab, setGuidelinesSubTab] = useState('guidelines');

  // Map state
  const [mapZoom, setMapZoom] = useState(1);
  const [selectedMapCategory, setSelectedMapCategory] = useState('All');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddingMarkerMode, setIsAddingMarkerMode] = useState(false);
  const [isAddMarkerModalOpen, setIsAddMarkerModalOpen] = useState(false);
  const [isEditMarkerModalOpen, setIsEditMarkerModalOpen] = useState(false);

  // FAQ search & filter
  const [directorySearch, setDirectorySearch] = useState('');
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCatFilter, setFaqCatFilter] = useState('ALL');

  // Marker form state
  const [markerForm, setMarkerForm] = useState({
    name: '',
    category: 'Drinking Water',
    x: 50,
    y: 50,
    shortDescription: '',
    visitorInstructions: '',
    status: 'Published',
  });

  // Guideline Form Modal State (Add & Edit)
  const [isGuidelineModalOpen, setIsGuidelineModalOpen] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState(null);
  const [guidelineForm, setGuidelineForm] = useState({
    title: '',
    category: 'Timings & Darshan',
    content: '',
    status: 'Published',
  });

  // Transit Form Modal State (Edit)
  const [isTransitModalOpen, setIsTransitModalOpen] = useState(false);
  const [editingTransitIndex, setEditingTransitIndex] = useState(null);
  const [transitForm, setTransitForm] = useState({
    title: '',
    tag: '',
    description: '',
  });

  // FAQ Form Modal State (Add & Edit)
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'General Visit',
    status: 'Published',
    verificationStatus: 'Verified',
  });

  // Metrics
  const totalGuideSections = visitorGuidelines.length;
  const visibleMarkersCount = useMemo(
    () => mapMarkers.filter((m) => m.isVisible).length,
    [mapMarkers]
  );

  // Filtered map markers (Streamlined into 6 concise categories to avoid scrollbars)
  // Filtered and searched markers for directory
  const searchedDirectoryMarkers = useMemo(() => {
    return filteredMarkers.filter((m) => {
      if (!directorySearch.trim()) return true;
      const q = directorySearch.toLowerCase();
      return (
        m.name?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q) ||
        m.shortDescription?.toLowerCase().includes(q) ||
        m.visitorInstructions?.toLowerCase().includes(q) ||
        m.id?.toLowerCase().includes(q)
      );
    });
  }, [filteredMarkers, directorySearch]);

  const DEVOTEE_JOURNEY_STEPS = [
    { step: '01', id: 'MKR-004', name: 'West Parking (Lot B)', sub: 'Arrival & Vehicles', tip: 'Organized tourist coach & car bays' },
    { step: '02', id: 'MKR-002', name: 'Singh Dwar (Gate 1)', sub: 'Main Pedestrian Entry', tip: 'Security scanning & free footwear counter' },
    { step: '03', id: 'MKR-007', name: 'Help Desk & Water', sub: 'Pilgrim Amenities', tip: 'RO chilled water & sevadal guidance' },
    { step: '04', id: 'MKR-001', name: 'Garbhagriha Sanctum', sub: 'Holy Darshan', tip: 'Historic 1501 CE shrine of Maa Tripura Sundari' },
    { step: '05', id: 'MKR-008', name: 'Prasad Stalls', sub: 'Bhog & Matabari Peda', tip: 'Pure condensed milk pedas & dry bhog' },
    { step: '06', id: 'MKR-012', name: 'Kalyan Sagar Lake', sub: 'Turtle Sanctuary', tip: 'Sacred Bostami turtle observation deck' },
  ];

  const filteredMarkers = useMemo(() => {
    return mapMarkers.filter((m) => {
      if (selectedMapCategory === 'All' || selectedMapCategory === 'ALL') return true;
      if (selectedMapCategory === 'Sanctum') return m.category === 'Temple';
      if (selectedMapCategory === 'Gates & Parking') return ['Entry Point', 'Exit Point', 'Parking'].includes(m.category);
      if (selectedMapCategory === 'Amenities') return ['Drinking Water', 'Toilets', 'Help Desk', 'Accommodation'].includes(m.category);
      if (selectedMapCategory === 'Prasad & Dining') return ['Prasad Area', 'Annadanam Area'].includes(m.category);
      if (selectedMapCategory === 'Kalyan Sagar') return m.category === 'Other Facility';
      return m.category === selectedMapCategory;
    });
  }, [mapMarkers, selectedMapCategory]);

  // Streamlined marker categories (Fits on one line without horizontal scrollbars)
  const markerCategories = [
    'All',
    'Sanctum',
    'Gates & Parking',
    'Amenities',
    'Prasad & Dining',
    'Kalyan Sagar',
  ];

  // Handle map click to place new marker or move marker
  const handleSvgMapClick = (e) => {
    if (!isAddingMarkerMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setMarkerForm((prev) => ({ ...prev, x: clickX, y: clickY }));
    setIsAddingMarkerMode(false);
    setIsAddMarkerModalOpen(true);
  };

  const handleCreateMarkerSubmit = (e) => {
    e.preventDefault();
    if (!markerForm.name) return;
    addMapMarker(markerForm);
    setIsAddMarkerModalOpen(false);
    setMarkerForm({
      name: '',
      category: 'Drinking Water',
      x: 50,
      y: 50,
      shortDescription: '',
      visitorInstructions: '',
      status: 'Published',
    });
  };

  const handleEditMarkerSubmit = (e) => {
    e.preventDefault();
    if (!selectedMarker) return;
    updateMapMarker(selectedMarker.id, selectedMarker);
    setIsEditMarkerModalOpen(false);
  };

  // Guideline Actions
  const openAddGuidelineModal = () => {
    setEditingGuideline(null);
    setGuidelineForm({
      title: '',
      category: 'Timings & Darshan',
      content: '',
      status: 'Published',
    });
    setIsGuidelineModalOpen(true);
  };

  const openEditGuidelineModal = (g) => {
    setEditingGuideline(g);
    setGuidelineForm({
      title: g.title,
      category: g.category,
      content: g.content,
      status: g.status || 'Published',
    });
    setIsGuidelineModalOpen(true);
  };

  const handleGuidelineSubmit = (e) => {
    e.preventDefault();
    if (!guidelineForm.title || !guidelineForm.content) return;
    if (editingGuideline) {
      updateVisitorGuideline(editingGuideline.id, guidelineForm);
      showToast('Guideline updated successfully.');
    } else {
      addVisitorGuideline(guidelineForm);
      showToast('New Guideline created.');
    }
    setIsGuidelineModalOpen(false);
    setEditingGuideline(null);
  };

  const toggleGuidelineStatus = (g) => {
    const nextStatus = g.status === 'Published' ? 'Draft' : 'Published';
    updateVisitorGuideline(g.id, { status: nextStatus });
    showToast(`Guideline "${g.title}" set to ${nextStatus}.`);
  };

  // Transit Actions
  const openEditTransitModal = (index) => {
    const tm = travelInformation.transportModes[index];
    setEditingTransitIndex(index);
    setTransitForm({
      title: tm.title,
      tag: tm.tag || tm.mode,
      description: tm.description,
    });
    setIsTransitModalOpen(true);
  };

  const handleTransitSubmit = (e) => {
    e.preventDefault();
    if (editingTransitIndex === null) return;
    const updatedModes = [...travelInformation.transportModes];
    updatedModes[editingTransitIndex] = {
      ...updatedModes[editingTransitIndex],
      title: transitForm.title,
      tag: transitForm.tag,
      description: transitForm.description,
    };
    updateTravelInformation({ transportModes: updatedModes });
    showToast('Transit option updated successfully.');
    setIsTransitModalOpen(false);
    setEditingTransitIndex(null);
  };

  // FAQ Actions
  const openAddFaqModal = () => {
    setEditingFaq(null);
    setFaqForm({
      question: '',
      answer: '',
      category: 'General Visit',
      status: 'Published',
      verificationStatus: 'Verified',
    });
    setIsFaqModalOpen(true);
  };

  const openEditFaqModal = (faq) => {
    setEditingFaq(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      status: faq.status || 'Published',
      verificationStatus: faq.verificationStatus || 'Verified',
    });
    setIsFaqModalOpen(true);
  };

  const handleFaqSubmit = (e) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;
    if (editingFaq) {
      updateFaq(editingFaq.id, faqForm);
      showToast('FAQ updated successfully.');
    } else {
      addFaq(faqForm);
      showToast('New FAQ added.');
    }
    setIsFaqModalOpen(false);
    setEditingFaq(null);
  };

  const toggleFaqStatus = (faq) => {
    const nextStatus = faq.status === 'Published' ? 'Draft' : 'Published';
    updateFaq(faq.id, { status: nextStatus });
    showToast(`FAQ "${faq.id}" set to ${nextStatus}.`);
  };

  // Helper to get marker badge color and icon
  const getMarkerBadgeInfo = (cat) => {
    switch (cat) {
      case 'Temple':
        return { bg: 'bg-[#800000]', text: 'text-white', border: 'border-white', label: 'Sanctum' };
      case 'Entry Point':
        return { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-200', label: 'Gate' };
      case 'Exit Point':
        return { bg: 'bg-teal-600', text: 'text-white', border: 'border-teal-200', label: 'Exit' };
      case 'Parking':
        return { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-200', label: 'Parking' };
      case 'Drinking Water':
        return { bg: 'bg-cyan-600', text: 'text-white', border: 'border-cyan-200', label: 'Water' };
      case 'Toilets':
        return { bg: 'bg-indigo-600', text: 'text-white', border: 'border-indigo-200', label: 'Restroom' };
      case 'Help Desk':
        return { bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-200', label: 'Info' };
      case 'Prasad Area':
        return { bg: 'bg-rose-600', text: 'text-white', border: 'border-rose-200', label: 'Prasad' };
      case 'Annadanam Area':
        return { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-200', label: 'Bhog' };
      case 'Accommodation':
        return { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-200', label: 'Lodging' };
      default:
        return { bg: 'bg-stone-700', text: 'text-white', border: 'border-stone-400', label: 'Facility' };
    }
  };

  const tabs = [
    { id: 'facilities_map', label: 'Interactive Facilities Map' },
    { id: 'guidelines_faqs', label: 'Visitor Guidelines & FAQs' },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      {!isEmbedded && (
        <ContentPageHeader
          title="Visitors Info"
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAddingMarkerMode(true);
                  showToast('Click anywhere on the map to place a new marker pin.', 'info');
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors ${
                  isAddingMarkerMode
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-[#55132D] hover:bg-[#681B37] text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                {isAddingMarkerMode ? 'Click Map to Place Pin' : 'Add Map Marker'}
              </button>
            </div>
          }
        />
      )}

      {/* Tabs */}
      <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* TAB 1: INTERACTIVE FACILITIES MAP (FULL WIDTH WITH SLIDE-IN INSPECTOR DRAWER) */}
      {activeTab === 'facilities_map' && (
        <div className="w-full space-y-4">
          {/* Quick Overview & Admin Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
                <Compass className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider truncate">Campus Orientation</div>
                <div className="text-xs font-bold text-stone-900 mt-0.5 truncate">West NH-8 to Kalyan Sagar</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider truncate">Managed Facilities</div>
                <div className="text-xs font-bold text-stone-900 mt-0.5 truncate">{mapMarkers.length} Points of Interest</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Eye className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider truncate">Devotee Portal Visibility</div>
                <div className="text-xs font-bold text-stone-900 mt-0.5 truncate">{visibleMarkersCount} Visible on Map</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Info className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider truncate">Admin Action Guide</div>
                <div className="text-xs font-bold text-stone-900 mt-0.5 truncate">Click Any Pin to Inspect</div>
              </div>
            </div>
          </div>
          {/* First-Time Pilgrim Suggested Flow (Step-by-Step Campus Route) */}
          <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF6ED] to-[#FFF9F2] rounded-2xl border border-[#E2BC6B]/50 p-4 shadow-2xs space-y-2.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#55132D] text-[#E2BC6B] flex items-center justify-center text-xs font-bold font-serif">
                  ॐ
                </span>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm">
                    Recommended Pilgrim Route (For First-Time Devotees)
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Step-by-step campus walkway flow from vehicle parking to sanctum darshan &amp; lake observation. Click any stage to inspect.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#55132D] bg-[#55132D]/10 px-2.5 py-1 rounded-full shrink-0">
                Avg. Campus Walk: 350m · 20-30 Mins
              </span>
            </div>

            {/* Stepper Flow Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
              {DEVOTEE_JOURNEY_STEPS.map((st, idx) => {
                const targetMarker = mapMarkers.find((m) => m.id === st.id);
                const isSelected = selectedMarker?.id === st.id;
                return (
                  <button
                    key={st.step}
                    type="button"
                    onClick={() => {
                      if (targetMarker) {
                        setSelectedMarker(targetMarker);
                        setIsDrawerOpen(true);
                      }
                    }}
                    className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#55132D] bg-[#55132D] text-white shadow-xs ring-2 ring-[#E2BC6B]/40'
                        : 'border-stone-200/90 bg-white hover:border-[#55132D]/40 hover:bg-[#FFFDF9]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-white/20 text-[#E2BC6B]'
                              : 'bg-stone-100 text-[#55132D]'
                          }`}
                        >
                          Step {st.step}
                        </span>
                        {idx < DEVOTEE_JOURNEY_STEPS.length - 1 && (
                          <ArrowRight
                            className={`w-3 h-3 hidden lg:block ${
                              isSelected ? 'text-[#E2BC6B]' : 'text-stone-300'
                            }`}
                          />
                        )}
                      </div>
                      <div
                        className={`font-bold text-xs truncate ${
                          isSelected ? 'text-white' : 'text-stone-900 group-hover:text-[#55132D]'
                        }`}
                      >
                        {st.name}
                      </div>
                      <div
                        className={`text-[10px] truncate mt-0.5 ${
                          isSelected ? 'text-amber-100/90' : 'text-stone-500'
                        }`}
                      >
                        {st.sub}
                      </div>
                    </div>
                    <div
                      className={`text-[9.5px] mt-2 pt-1.5 border-t line-clamp-1 ${
                        isSelected
                          ? 'border-white/20 text-white/80'
                          : 'border-stone-100 text-stone-400'
                      }`}
                    >
                      {st.tip}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Width Pencil-Drawn Architectural Masterplan */}
          <TempleArchitectureMap
            markers={filteredMarkers}
            selectedMarker={selectedMarker}
            onSelectMarker={(marker) => {
              setSelectedMarker(marker);
              setIsDrawerOpen(true);
            }}
            isAddingMarkerMode={isAddingMarkerMode}
            onMapClick={handleSvgMapClick}
            selectedCategory={selectedMapCategory}
            onSelectCategory={setSelectedMapCategory}
            categories={markerCategories}
          />

          {/* Campus Facilities & Administrative Directory */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
            {/* Directory Header with Search & Counter */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-stone-150">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#55132D]/10 text-[#55132D] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-serif text-stone-900 text-sm sm:text-base">
                    Campus Facilities &amp; Amenity Directory
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Complete administrative POI registry. Search, inspect visitor guidelines, or toggle live visibility on devotee portal.
                  </p>
                </div>
              </div>

              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    placeholder="Search by facility name or ID..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#55132D] focus:ring-1 focus:ring-[#55132D] transition-colors"
                  />
                  {directorySearch && (
                    <button
                      onClick={() => setDirectorySearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl shrink-0 text-center">
                  Showing {searchedDirectoryMarkers.length} of {mapMarkers.length} Facilities
                </span>
              </div>
            </div>

            {/* Category Filter Badges */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1">
                Category:
              </span>
              {markerCategories.map((cat) => {
                const isSelected = selectedMapCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedMapCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#55132D] text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/80'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Directory Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 pt-1">
              {searchedDirectoryMarkers.map((marker) => {
                const isSelected = selectedMarker?.id === marker.id;
                const badgeInfo = getMarkerBadgeInfo(marker.category);
                return (
                  <div
                    key={marker.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-[#55132D] bg-[#FFF9F2] shadow-xs ring-1 ring-[#55132D]/30'
                        : 'border-stone-200/90 bg-white hover:border-[#55132D]/40 hover:shadow-2xs'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Top Bar: Category, ID & Devotee Visibility Toggle */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${badgeInfo.bg} ${badgeInfo.text}`}>
                            {badgeInfo.label}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400 font-semibold bg-stone-100 px-1.5 py-0.5 rounded">
                            {marker.id}
                          </span>
                        </div>

                        {/* Visibility Toggle Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMarkerVisibility(marker.id);
                            showToast(
                              `Marker "${marker.name}" is now ${
                                marker.isVisible ? 'hidden from' : 'visible on'
                              } devotee portal.`
                            );
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            marker.isVisible
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
                          }`}
                          title="Click to toggle public devotee visibility"
                        >
                          {marker.isVisible ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-700" />
                              <span>Devotee Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-stone-400" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Title & Short Description */}
                      <div>
                        <h4
                          className="font-bold text-stone-900 font-serif text-sm leading-tight hover:text-[#55132D] transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedMarker(marker);
                            setIsDrawerOpen(true);
                          }}
                        >
                          {marker.name}
                        </h4>
                        <p className="text-[11.5px] text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                          {marker.shortDescription}
                        </p>
                      </div>

                      {/* Devotee Visitor Guideline Tip Box */}
                      {marker.visitorInstructions && (
                        <div className="bg-stone-50 rounded-lg p-2 border border-stone-200/70 text-[10.5px] text-stone-600 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-[#55132D] shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-tight">
                            {marker.visitorInstructions}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-2.5 border-t border-stone-150 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-stone-400 font-mono">
                        Grid ({marker.x}%, {marker.y}%)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMarker(marker);
                            setIsEditMarkerModalOpen(true);
                          }}
                          className="p-1 hover:bg-stone-100 rounded text-stone-500 hover:text-stone-800 transition-colors"
                          title="Edit marker metadata"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMarker(marker);
                            setIsDrawerOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#55132D]/10 hover:bg-[#55132D] text-[#55132D] hover:text-white font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Emergency & Campus Control Contacts Strip */}
            <div className="bg-[#FFFDF9] rounded-xl border border-amber-200/80 p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 text-xs">Temple Administration &amp; Pilgrim Emergency Hotlines</span>
                  <div className="text-[11px] text-stone-500">24/7 on-site sevadal volunteers, first-aid medical personnel, and administrative control desk.</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="bg-white border border-stone-200 px-2.5 py-1 rounded-md font-mono font-medium text-stone-700">
                  Security: <strong>+91 3821 222 108</strong>
                </span>
                <span className="bg-white border border-stone-200 px-2.5 py-1 rounded-md font-mono font-medium text-stone-700">
                  First Aid: <strong>Ext 104</strong>
                </span>
                <span className="bg-white border border-stone-200 px-2.5 py-1 rounded-md font-mono font-medium text-stone-700">
                  Yatri Sahayata: <strong>+91 3821 222 109</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-In Facility & Marker Detail Drawer */}
      {isDrawerOpen && selectedMarker && (
        <OverlayPortal isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="fixed inset-0 z-[9999] overflow-hidden select-none">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-16 z-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-stone-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="p-4.5 bg-[#55132D] text-white flex items-center justify-between shadow-xs shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-[#E2BC6B]/30 shadow-2xs">
                    <MapPin className="w-5 h-5 text-[#E2BC6B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#E2BC6B]">
                        Facility Inspector
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-white/10 text-white font-mono text-[9px] font-bold">
                        {selectedMarker.id}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold font-serif leading-tight">
                      {selectedMarker.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Close Inspector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                {/* Category & Status */}
                <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                      Facility Category
                    </span>
                    <span className="text-xs font-bold text-stone-900">
                      {selectedMarker.category}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                      selectedMarker.isVisible
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    ● {selectedMarker.isVisible ? 'Visible on Map' : 'Hidden from Map'}
                  </span>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <span className="font-bold text-stone-800 block text-xs uppercase tracking-wider">
                    Facility Overview
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed bg-stone-50/70 p-3 rounded-xl border border-stone-150">
                    {selectedMarker.shortDescription}
                  </p>
                </div>

                {/* Visitor Guidance */}
                <div className="space-y-1">
                  <span className="font-bold text-stone-800 block text-xs uppercase tracking-wider">
                    Devotee Guidance &amp; Rules
                  </span>
                  <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-300 text-amber-950 space-y-1">
                    <p className="text-xs leading-relaxed font-medium">
                      {selectedMarker.visitorInstructions}
                    </p>
                  </div>
                </div>

                {/* Campus Coordinates */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex justify-between items-center text-xs">
                  <span className="text-stone-500 font-medium">Architectural Grid Position:</span>
                  <span className="font-mono font-bold text-stone-800 bg-white px-2 py-0.5 rounded border border-stone-200">
                    X: {selectedMarker.x}% · Y: {selectedMarker.y}%
                  </span>
                </div>
              </div>

              {/* Footer Action Buttons */}
              <div className="p-4 border-t border-stone-200 bg-stone-50 flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsEditMarkerModalOpen(true);
                    }}
                    className="flex-1 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#E2BC6B]" />
                    <span>Edit Marker Info</span>
                  </button>
                  <button
                    onClick={() => toggleMarkerVisibility(selectedMarker.id)}
                    className="flex-1 py-2 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                  >
                    {selectedMarker.isVisible ? 'Hide from Map' : 'Show on Map'}
                  </button>
                </div>
                <button
                  onClick={() => {
                    deleteMapMarker(selectedMarker.id);
                    setSelectedMarker(null);
                    setIsDrawerOpen(false);
                  }}
                  className="w-full py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Delete Marker
                </button>
              </div>
            </div>
          </div>
        </div>
              </OverlayPortal>
      )}

      {/* TAB 2: VISITOR GUIDELINES & FAQS (Segmented Sub-views) */}
      {activeTab === 'guidelines_faqs' && (
        <div className="space-y-4">
          {/* Segmented Sub-view Switcher */}
          <div className="flex items-center gap-2 border border-stone-200/90 bg-stone-100/80 p-1 rounded-xl w-fit">
            <button
              onClick={() => setGuidelinesSubTab('guidelines')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                guidelinesSubTab === 'guidelines'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Visitor Guidelines & Transit
            </button>
            <button
              onClick={() => setGuidelinesSubTab('faqs')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                guidelinesSubTab === 'faqs'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Devotee FAQs & Answers
            </button>
          </div>

          {guidelinesSubTab === 'guidelines' && (
            <div className="space-y-5">
              {/* Section 1: Travel & Transit Guide */}
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                  <h3 className="text-sm font-bold text-stone-900 font-serif">Transit & How to Reach</h3>
                  <ContentStatusBadge status={travelInformation.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {travelInformation.transportModes.map((tm, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-stone-50/80 hover:bg-stone-50 rounded-xl border border-stone-200/80 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="p-2 bg-[#55132D]/10 text-[#55132D] rounded-lg">
                              {tm.mode === 'Air Travel' && <Plane className="w-4 h-4" />}
                              {tm.mode === 'Rail Travel' && <Train className="w-4 h-4" />}
                              {tm.mode === 'Road & Highway' && <Bus className="w-4 h-4" />}
                              {tm.mode.includes('Local') && <Car className="w-4 h-4" />}
                            </span>
                            <span className="text-[10px] font-bold text-stone-600 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                              {tm.tag || tm.mode}
                            </span>
                          </div>
                          <button
                            onClick={() => openEditTransitModal(idx)}
                            className="p-1.5 hover:bg-white text-stone-500 hover:text-[#55132D] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-stone-200 shadow-2xs"
                            title="Edit Transit Option"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="font-bold text-stone-900 text-xs">{tm.title}</h4>
                        <p className="text-stone-600 leading-relaxed text-xs">{tm.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Devotee Guidelines & Sacred Conduct */}
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                  <h3 className="text-sm font-bold text-stone-900 font-serif">Devotee Guidelines & Sacred Conduct</h3>
                  <button
                    onClick={openAddGuidelineModal}
                    className="px-3 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Guideline</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {visitorGuidelines.map((g, idx) => (
                    <div
                      key={g.id}
                      className="p-4 bg-stone-50/70 hover:bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col justify-between gap-3 transition-colors"
                    >
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-stone-900 bg-stone-200/70 px-2 py-0.5 rounded">
                              #{idx + 1}
                            </span>
                            <span className="text-[10.5px] font-semibold text-[#55132D] bg-[#55132D]/10 px-2.5 py-0.5 rounded">
                              {g.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {/* Interactive Live/Draft Toggle Button */}
                            <button
                              onClick={() => toggleGuidelineStatus(g)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                g.status === 'Published'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              }`}
                              title="Click to toggle Devotee Portal visibility"
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  g.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                              />
                              <span>{g.status === 'Published' ? 'Live on Portal' : 'Draft (Hidden)'}</span>
                            </button>

                            {/* Edit Guideline Button */}
                            <button
                              onClick={() => openEditGuidelineModal(g)}
                              className="p-1 hover:bg-white text-stone-600 hover:text-[#55132D] rounded transition-colors cursor-pointer"
                              title="Edit Guideline"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Preview on Devotee Portal */}
                            <button
                              onClick={() => openPreview('visitor-guide', g)}
                              className="p-1 hover:bg-white text-stone-600 rounded transition-colors cursor-pointer"
                              title="Devotee Preview"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#55132D]" />
                            </button>

                            {/* Delete Guideline */}
                            <button
                              onClick={() => deleteVisitorGuideline(g.id)}
                              className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                              title="Delete guideline"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900">{g.title}</h4>
                        <p className="text-stone-700 leading-relaxed text-xs">{g.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {guidelinesSubTab === 'faqs' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-stone-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-[#55132D] w-60"
                    />
                  </div>

                  <select
                    value={faqCatFilter}
                    onChange={(e) => setFaqCatFilter(e.target.value)}
                    className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="General Visit">General Visit</option>
                    <option value="Darshan">Darshan</option>
                    <option value="Travel">Travel</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Donations">Donations</option>
                    <option value="Accessibility">Accessibility</option>
                  </select>
                </div>

                <button
                  onClick={openAddFaqModal}
                  className="px-3.5 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              {/* Single Column List of FAQ Cards */}
              <div className="space-y-3.5">
                {faqs
                  .filter((f) => {
                    const matchCat = faqCatFilter === 'ALL' || f.category === faqCatFilter;
                    const matchSearch =
                      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
                      f.answer.toLowerCase().includes(faqSearch.toLowerCase());
                    return matchCat && matchSearch;
                  })
                  .map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-white rounded-xl border border-stone-200/90 p-4 shadow-2xs space-y-2.5 text-xs hover:border-[#55132D]/30 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                              {faq.id}
                            </span>
                            <span className="text-[10px] font-semibold text-[#55132D] bg-[#55132D]/10 px-2 py-0.5 rounded">
                              {faq.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {/* Live/Draft Toggle Button */}
                            <button
                              onClick={() => toggleFaqStatus(faq)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                faq.status === 'Published'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              }`}
                              title="Click to toggle Devotee Portal visibility"
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  faq.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                              />
                              <span>{faq.status === 'Published' ? 'Live on Portal' : 'Draft (Hidden)'}</span>
                            </button>

                            {/* Edit FAQ Button */}
                            <button
                              onClick={() => openEditFaqModal(faq)}
                              className="p-1 hover:bg-stone-100 text-stone-600 hover:text-[#55132D] rounded transition-colors cursor-pointer"
                              title="Edit FAQ"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete FAQ Button */}
                            <button
                              onClick={() => deleteFaq(faq.id)}
                              className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-stone-900 flex items-start gap-1.5">
                          <HelpCircle className="w-4 h-4 text-[#55132D] shrink-0 mt-0.5" />
                          <span>{faq.question}</span>
                        </h4>
                        <p className="text-stone-700 leading-relaxed text-xs pl-5.5">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD MAP MARKER */}
      {isAddMarkerModalOpen && (
        <OverlayPortal isOpen={isAddMarkerModalOpen} onClose={() => setIsAddMarkerModalOpen(false)}>
          <div className="fixed inset-0 z-[9999] bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Configure Map Marker</h3>
                <p className="text-xs text-stone-500">
                  Target: ({markerForm.x}%, {markerForm.y}%) on site plan
                </p>
              </div>
              <button
                onClick={() => setIsAddMarkerModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMarkerSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Marker Name / Facility *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Gate Free Cloakroom"
                  value={markerForm.name}
                  onChange={(e) => setMarkerForm({ ...markerForm, name: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category</label>
                <select
                  value={markerForm.category}
                  onChange={(e) => setMarkerForm({ ...markerForm, category: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                >
                  <option value="Temple">Temple Sanctum</option>
                  <option value="Entry Point">Entry Point</option>
                  <option value="Exit Point">Exit Point</option>
                  <option value="Parking">Parking</option>
                  <option value="Drinking Water">Drinking Water</option>
                  <option value="Toilets">Toilets / Restrooms</option>
                  <option value="Help Desk">Help Desk</option>
                  <option value="Prasad Area">Prasad Area</option>
                  <option value="Annadanam Area">Annadanam Bhog</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Other Facility">Other Facility</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Complimentary safe locker deposit for footwear and luggage."
                  value={markerForm.shortDescription}
                  onChange={(e) => setMarkerForm({ ...markerForm, shortDescription: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Visitor Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Collect brass token before proceeding to sanctum."
                  value={markerForm.visitorInstructions}
                  onChange={(e) => setMarkerForm({ ...markerForm, visitorInstructions: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">X Coordinate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={markerForm.x}
                    onChange={(e) => setMarkerForm({ ...markerForm, x: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-1.5 bg-stone-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Y Coordinate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={markerForm.y}
                    onChange={(e) => setMarkerForm({ ...markerForm, y: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-1.5 bg-stone-50 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMarkerModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Pin to Map
                </button>
              </div>
            </form>
          </div>
          </div>
        </OverlayPortal>
      )}

      {/* MODAL: EDIT MARKER */}
      {isEditMarkerModalOpen && selectedMarker && (
        <OverlayPortal isOpen={isEditMarkerModalOpen} onClose={() => setIsEditMarkerModalOpen(false)}>
          <div className="fixed inset-0 z-[9999] bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Edit Marker Details</h3>
                <p className="text-xs text-stone-500">{selectedMarker.id}</p>
              </div>
              <button
                onClick={() => setIsEditMarkerModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditMarkerSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Marker Title</label>
                <input
                  type="text"
                  required
                  value={selectedMarker.name}
                  onChange={(e) => setSelectedMarker({ ...selectedMarker, name: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={selectedMarker.shortDescription}
                  onChange={(e) => setSelectedMarker({ ...selectedMarker, shortDescription: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Visitor Instructions</label>
                <input
                  type="text"
                  value={selectedMarker.visitorInstructions}
                  onChange={(e) => setSelectedMarker({ ...selectedMarker, visitorInstructions: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">X Coord (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedMarker.x}
                    onChange={(e) => setSelectedMarker({ ...selectedMarker, x: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-1.5 bg-stone-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Y Coord (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedMarker.y}
                    onChange={(e) => setSelectedMarker({ ...selectedMarker, y: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-1.5 bg-stone-50 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditMarkerModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
          </div>
        </OverlayPortal>
      )}

      {/* MODAL: CONFIGURE DEVOTEE GUIDELINE (ADD & EDIT) */}
      {isGuidelineModalOpen && (
        <OverlayPortal isOpen={isGuidelineModalOpen} onClose={() => setIsGuidelineModalOpen(false)}>
          <div className="fixed inset-0 z-[9999] bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">
                  {editingGuideline ? 'Edit Devotee Guideline' : 'Add Devotee Guideline'}
                </h3>
                <p className="text-xs text-stone-500">Public policy displayed on the devotee portal.</p>
              </div>
              <button
                onClick={() => setIsGuidelineModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGuidelineSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Guideline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Temple Timings & Recommended Hours"
                  value={guidelineForm.title}
                  onChange={(e) => setGuidelineForm({ ...guidelineForm, title: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={guidelineForm.category}
                    onChange={(e) => setGuidelineForm({ ...guidelineForm, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="Timings & Darshan">Timings & Darshan</option>
                    <option value="Dress & Conduct">Dress & Conduct</option>
                    <option value="Photography Rules">Photography Rules</option>
                    <option value="Accessibility">Accessibility</option>
                    <option value="Sacred Offerings">Sacred Offerings</option>
                    <option value="General Guidelines">General Guidelines</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Devotee Portal Visibility</label>
                  <select
                    value={guidelineForm.status}
                    onChange={(e) => setGuidelineForm({ ...guidelineForm, status: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Guidance Instructions *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Official advisory instructions for visiting yatris..."
                  value={guidelineForm.content}
                  onChange={(e) => setGuidelineForm({ ...guidelineForm, content: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGuidelineModalOpen(false)}
                  className="px-3.5 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white font-semibold rounded-lg shadow-2xs cursor-pointer"
                >
                  {editingGuideline ? 'Save Updates' : 'Publish Guideline'}
                </button>
              </div>
            </form>
          </div>
          </div>
        </OverlayPortal>
      )}

      {/* MODAL: EDIT TRANSIT OPTION */}
      {isTransitModalOpen && (
        <OverlayPortal isOpen={isTransitModalOpen} onClose={() => setIsTransitModalOpen(false)}>
          <div className="fixed inset-0 z-[9999] bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Edit Transit Option</h3>
                <p className="text-xs text-stone-500">Route guidance displayed in How to Reach.</p>
              </div>
              <button
                onClick={() => setIsTransitModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTransitSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Transit Title / Station *</label>
                <input
                  type="text"
                  required
                  value={transitForm.title}
                  onChange={(e) => setTransitForm({ ...transitForm, title: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Distance &amp; Time Tag *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 55 km · ~1.5 hrs via NH-8"
                  value={transitForm.tag}
                  onChange={(e) => setTransitForm({ ...transitForm, tag: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Transit Details &amp; Options *</label>
                <textarea
                  rows={3}
                  required
                  value={transitForm.description}
                  onChange={(e) => setTransitForm({ ...transitForm, description: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransitModalOpen(false)}
                  className="px-3.5 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white font-semibold rounded-lg shadow-2xs cursor-pointer"
                >
                  Save Transit Option
                </button>
              </div>
            </form>
          </div>
          </div>
        </OverlayPortal>
      )}

      {/* MODAL: CONFIGURE FAQ (ADD & EDIT) */}
      {isFaqModalOpen && (
        <OverlayPortal isOpen={isFaqModalOpen} onClose={() => setIsFaqModalOpen(false)}>
          <div className="fixed inset-0 z-[9999] bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">
                  {editingFaq ? 'Edit Devotee FAQ' : 'Add Devotee FAQ'}
                </h3>
                <p className="text-xs text-stone-500">Provide authoritative answer for public portal.</p>
              </div>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFaqSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Devotee Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Can elderly pilgrims book wheelchair assistance in advance?"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">FAQ Category</label>
                  <select
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="General Visit">General Visit</option>
                    <option value="Darshan">Darshan</option>
                    <option value="Travel">Travel</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Donations">Donations</option>
                    <option value="Accessibility">Accessibility</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Portal Visibility</label>
                  <select
                    value={faqForm.status}
                    onChange={(e) => setFaqForm({ ...faqForm, status: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Authoritative Answer *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Official guidance according to temple trust guidelines..."
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-3.5 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white font-semibold rounded-lg shadow-2xs cursor-pointer"
                >
                  {editingFaq ? 'Save Updates' : 'Publish FAQ'}
                </button>
              </div>
            </form>
          </div>
          </div>
        </OverlayPortal>
      )}

      {/* Global Preview Modal */}
      <PublicWebsitePreviewModal />
    </div>
  );
}

