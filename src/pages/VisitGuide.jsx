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
  ChevronRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useContentManagement } from '../context/ContentManagementContext';
import ContentPageHeader from '../components/content-management/shared/ContentPageHeader';
import ContentTabs from '../components/content-management/shared/ContentTabs';
import ContentStatusBadge from '../components/content-management/shared/ContentStatusBadge';
import VerificationBadge from '../components/content-management/shared/VerificationBadge';
import PublicWebsitePreviewModal from '../components/content-management/shared/PublicWebsitePreviewModal';
import TempleArchitectureMap from '../components/content-management/shared/TempleArchitectureMap';

export default function VisitGuide() {
  const {
    visitorGuidelines,
    addVisitorGuideline,
    updateVisitorGuideline,
    deleteVisitorGuideline,
    travelInformation,
    updateTravelInformation,
    publicFacilities,
    addPublicFacility,
    updatePublicFacility,
    deletePublicFacility,
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

  // Map state
  const [mapZoom, setMapZoom] = useState(1);
  const [selectedMapCategory, setSelectedMapCategory] = useState('ALL');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isAddingMarkerMode, setIsAddingMarkerMode] = useState(false);
  const [isAddMarkerModalOpen, setIsAddMarkerModalOpen] = useState(false);
  const [isEditMarkerModalOpen, setIsEditMarkerModalOpen] = useState(false);

  // Facility search & filter
  const [facilitySearch, setFacilitySearch] = useState('');
  const [facilityCatFilter, setFacilityCatFilter] = useState('ALL');

  // FAQ search & filter
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

  // Facility Form Modal State
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [facilityForm, setFacilityForm] = useState({
    name: '',
    category: 'Drinking Water',
    location: '',
    publicDescription: '',
    operatingHours: '05:00 AM – 09:00 PM',
    visitorInstructions: '',
    contactInfo: '',
    internalFacilityId: '',
    publicationStatus: 'Published',
    verificationStatus: 'Verified',
  });

  // FAQ Form Modal State
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'General Visit',
    status: 'Published',
    verificationStatus: 'Verified',
  });

  // Metrics
  const totalGuideSections = visitorGuidelines.length;
  const publishedFacilitiesCount = useMemo(
    () => publicFacilities.filter((f) => f.publicationStatus === 'Published').length,
    [publicFacilities]
  );
  const visibleMarkersCount = useMemo(
    () => mapMarkers.filter((m) => m.isVisible).length,
    [mapMarkers]
  );

  // Filtered map markers
  const filteredMarkers = useMemo(() => {
    return mapMarkers.filter((m) => {
      if (selectedMapCategory === 'ALL') return true;
      return m.category === selectedMapCategory;
    });
  }, [mapMarkers, selectedMapCategory]);

  // Marker categories
  const markerCategories = [
    'ALL',
    'Temple',
    'Entry Point',
    'Exit Point',
    'Parking',
    'Drinking Water',
    'Toilets',
    'Help Desk',
    'Prasad Area',
    'Annadanam Area',
    'Accommodation',
    'Other Facility',
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

  const handleCreateFacilitySubmit = (e) => {
    e.preventDefault();
    if (!facilityForm.name) return;
    addPublicFacility(facilityForm);
    setIsFacilityModalOpen(false);
    setFacilityForm({
      name: '',
      category: 'Drinking Water',
      location: '',
      publicDescription: '',
      operatingHours: '05:00 AM – 09:00 PM',
      visitorInstructions: '',
      contactInfo: '',
      internalFacilityId: '',
      publicationStatus: 'Published',
      verificationStatus: 'Verified',
    });
  };

  const handleCreateFaqSubmit = (e) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;
    addFaq(faqForm);
    setIsFaqModalOpen(false);
    setFaqForm({
      question: '',
      answer: '',
      category: 'General Visit',
      status: 'Published',
      verificationStatus: 'Verified',
    });
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
    { id: 'facilities_map', label: 'Interactive Facilities Map', count: mapMarkers.length },
    { id: 'facilities_directory', label: 'Public Facilities Directory', count: publicFacilities.length },
    { id: 'visitor_guidelines', label: 'Visitor Guidelines & Transit', count: visitorGuidelines.length },
    { id: 'faqs', label: 'Devotee FAQs', count: faqs.length },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <ContentPageHeader
        title="Visit Guide & Facilities Map"
        subtitle="Curate pilgrim guidelines, public facility directories, transit itineraries and interactive visitor campus map."
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

      {/* Tabs */}
      <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* TAB 1: INTERACTIVE FACILITIES MAP */}
      {activeTab === 'facilities_map' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            {/* 2D Architectural Site Plan Map Component */}
            <div className="lg:col-span-2">
              <TempleArchitectureMap
                markers={filteredMarkers}
                selectedMarker={selectedMarker}
                onSelectMarker={setSelectedMarker}
                isAddingMarkerMode={isAddingMarkerMode}
                onMapClick={handleSvgMapClick}
                selectedCategory={selectedMapCategory}
                onSelectCategory={setSelectedMapCategory}
                categories={markerCategories}
              />
            </div>

            {/* Marker Inspector & Quick Directory Panel */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-4">
              {selectedMarker ? (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded-lg border border-stone-200">
                      {selectedMarker.id}
                    </span>
                    <span className="text-[10px] font-bold text-[#55132D] uppercase bg-[#55132D]/10 px-2.5 py-0.5 rounded-full border border-[#55132D]/20">
                      {selectedMarker.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-serif leading-snug">
                      {selectedMarker.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {selectedMarker.shortDescription}
                    </p>
                  </div>

                  <div className="bg-stone-50/80 p-3 rounded-xl border border-stone-200/80 text-xs space-y-1">
                    <span className="font-bold text-stone-800 block text-[11px] uppercase tracking-wider">
                      Visitor Guidance
                    </span>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {selectedMarker.visitorInstructions}
                    </p>
                  </div>

                  <div className="bg-stone-50/80 p-3 rounded-xl border border-stone-200/80 text-xs flex justify-between items-center">
                    <span className="text-stone-500 font-medium">Campus Coordinates:</span>
                    <span className="font-mono font-bold text-stone-800 text-xs">
                      X: {selectedMarker.x}% · Y: {selectedMarker.y}%
                    </span>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => setIsEditMarkerModalOpen(true)}
                      className="w-full py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Marker Info</span>
                    </button>
                    <button
                      onClick={() => toggleMarkerVisibility(selectedMarker.id)}
                      className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors border border-stone-200/80"
                    >
                      {selectedMarker.isVisible ? 'Hide from Visitor Map' : 'Show on Visitor Map'}
                    </button>
                    <button
                      onClick={() => {
                        deleteMapMarker(selectedMarker.id);
                        setSelectedMarker(null);
                      }}
                      className="w-full py-2 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-colors border border-rose-200"
                    >
                      Delete Marker
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 text-stone-400 space-y-1.5 border-b border-stone-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-5 h-5 text-stone-400 stroke-1" />
                    </div>
                    <p className="text-xs font-bold text-stone-800">Campus Amenity Inspector</p>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Click any pin on the 2D architectural map or select from the list below to inspect guidelines.
                    </p>
                  </div>

                  {/* Quick-Jump Facility Roster */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block px-1">
                      Quick Facilities Directory
                    </span>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
                      {mapMarkers.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setSelectedMarker(m)}
                          className="p-2.5 rounded-xl border border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/80 cursor-pointer transition-all flex items-center justify-between text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold text-stone-900 block truncate">{m.name}</span>
                            <span className="text-[10px] text-stone-400 block">{m.category}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 text-[11px] text-stone-500 flex justify-between items-center font-medium">
                <span>Total Configured: {mapMarkers.length} pins</span>
                <span className="text-emerald-700 font-semibold">Active: {visibleMarkersCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PUBLIC FACILITIES DIRECTORY */}
      {activeTab === 'facilities_directory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search facilities..."
                  value={facilitySearch}
                  onChange={(e) => setFacilitySearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-[#800000] w-60"
                />
              </div>

              <select
                value={facilityCatFilter}
                onChange={(e) => setFacilityCatFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#800000]"
              >
                <option value="ALL">All Categories</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Waiting Area">Waiting Area</option>
                <option value="Bathing & Viewing Ghat">Bathing Ghat</option>
                <option value="Drinking Water">Drinking Water</option>
                <option value="Toilets">Toilets</option>
                <option value="Help Desk">Help Desk</option>
                <option value="Prasad">Prasad</option>
              </select>
            </div>

            <button
              onClick={() => setIsFacilityModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#800000] hover:bg-[#660000] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Facility Entry
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {publicFacilities
              .filter((f) => {
                const matchCat = facilityCatFilter === 'ALL' || f.category === facilityCatFilter;
                const matchSearch =
                  f.name.toLowerCase().includes(facilitySearch.toLowerCase()) ||
                  f.publicDescription.toLowerCase().includes(facilitySearch.toLowerCase());
                return matchCat && matchSearch;
              })
              .map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between hover:border-[#800000]/40 transition-all space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                          {fac.id}
                        </span>
                        <span className="text-[10px] font-bold text-[#800000] uppercase bg-[#800000]/10 px-2 py-0.5 rounded">
                          {fac.category}
                        </span>
                      </div>
                      <ContentStatusBadge status={fac.publicationStatus} />
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 mb-1">{fac.name}</h4>
                    <p className="text-xs text-stone-600 mb-2 leading-relaxed">{fac.publicDescription}</p>

                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-150 space-y-1 text-xs text-stone-600 mb-2">
                      <div className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-[#800000]" />
                        <span className="font-medium text-stone-800">{fac.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>Hours: {fac.operatingHours}</span>
                      </div>
                      {fac.internalFacilityId && (
                        <div className="pt-1 text-[10px] text-blue-700 flex items-center gap-1 font-mono">
                          <Tag className="w-2.5 h-2.5" /> Linked Operational Record: {fac.internalFacilityId}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-150 flex items-center justify-between text-xs">
                    <button
                      onClick={() => openPreview('facility', fac)}
                      className="text-[11px] text-stone-600 hover:text-stone-900 underline font-medium"
                    >
                      Public Preview
                    </button>
                    <button
                      onClick={() =>
                        updatePublicFacility(fac.id, {
                          publicationStatus: fac.publicationStatus === 'Published' ? 'Draft' : 'Published',
                        })
                      }
                      className="text-[10px] font-semibold text-[#800000] hover:underline"
                    >
                      {fac.publicationStatus === 'Published' ? 'Set as Draft' : 'Publish Live'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: VISITOR GUIDELINES & TRANSIT (Merged Guidelines + Travel Guide) */}
      {activeTab === 'visitor_guidelines' && (
        <div className="space-y-5">
          {/* Section 1: Travel & Transit Guide */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-150 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Transit & How to Reach</h3>
                <p className="text-xs text-stone-500">
                  Devotee traveler guide covering flights, trains, highways and local Udaipur transit routes.
                </p>
              </div>
              <ContentStatusBadge status={travelInformation.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {travelInformation.transportModes.map((tm, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-[#55132D]/10 text-[#55132D] rounded-lg">
                      {tm.mode === 'Air Travel' && <Plane className="w-4 h-4" />}
                      {tm.mode === 'Rail Travel' && <Train className="w-4 h-4" />}
                      {tm.mode === 'Road & Highway' && <Bus className="w-4 h-4" />}
                      {tm.mode.includes('Local') && <Car className="w-4 h-4" />}
                    </span>
                    <span className="font-bold text-stone-900 text-xs">{tm.title}</span>
                  </div>

                  <p className="text-stone-700 leading-relaxed text-[11px]">{tm.description}</p>
                  <p className="text-[10px] text-stone-500 italic bg-white p-2 rounded border border-stone-150">
                    Note: {tm.notes}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Highway Advisory:</strong> {travelInformation.travelAdvisory}
                </span>
              </div>
              <span className="font-mono text-[10px] bg-amber-100 px-2 py-0.5 rounded font-bold">
                NH-8 Verified
              </span>
            </div>
          </div>

          {/* Section 2: Devotee Guidelines & Sacred Conduct */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Devotee Guidelines & Sacred Conduct</h3>
                <p className="text-xs text-stone-500">
                  Visitor decorum, dress code, photography policies and accessibility information.
                </p>
              </div>
              <button
                onClick={() => {
                  const title = prompt('Enter guideline title:');
                  if (title) {
                    const content = prompt('Enter guideline instructions:');
                    if (content) {
                      addVisitorGuideline({
                        title,
                        category: 'Visitor Guidelines',
                        content,
                        status: 'Published',
                        verificationStatus: 'Verified',
                      });
                    }
                  }
                }}
                className="px-3 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Guideline
              </button>
            </div>

            <div className="space-y-3">
              {visitorGuidelines.map((g, idx) => (
                <div
                  key={g.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 text-xs flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] font-semibold text-[#55132D] bg-[#55132D]/10 px-2 py-0.5 rounded">
                        {g.category}
                      </span>
                      <ContentStatusBadge status={g.status} />
                    </div>
                    <h4 className="text-sm font-bold text-stone-900">{g.title}</h4>
                    <p className="text-stone-700 leading-relaxed text-xs">{g.content}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                    <button
                      onClick={() => openPreview('visitor-guide', g)}
                      className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-semibold"
                      title="Devotee Preview"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#55132D]" />
                    </button>
                    <button
                      onClick={() => deleteVisitorGuideline(g.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                      title="Delete guideline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEVOTEE FAQS */}
      {activeTab === 'faqs' && (
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
              onClick={() => setIsFaqModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add FAQ
            </button>
          </div>

          <div className="space-y-3">
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
                  className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        {faq.id}
                      </span>
                      <span className="text-[10px] font-semibold text-[#55132D] bg-[#55132D]/10 px-2 py-0.5 rounded">
                        {faq.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ContentStatusBadge status={faq.status} />
                      <button
                        onClick={() => deleteFaq(faq.id)}
                        className="text-stone-400 hover:text-red-600 p-1"
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
              ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD MAP MARKER */}
      {isAddMarkerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
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
      )}

      {/* MODAL: EDIT MARKER */}
      {isEditMarkerModalOpen && selectedMarker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
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
      )}

      {/* MODAL: ADD FACILITY */}
      {isFacilityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Add Public Facility Record</h3>
                <p className="text-xs text-stone-500">Public guide entry displayed to devotees.</p>
              </div>
              <button
                onClick={() => setIsFacilityModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFacilitySubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Cloakroom & Footwear Deposit"
                  value={facilityForm.name}
                  onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={facilityForm.category}
                    onChange={(e) => setFacilityForm({ ...facilityForm, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  >
                    <option value="Accommodation">Accommodation</option>
                    <option value="Waiting Area">Waiting Area</option>
                    <option value="Drinking Water">Drinking Water</option>
                    <option value="Toilets">Toilets</option>
                    <option value="Help Desk">Help Desk</option>
                    <option value="Prasad">Prasad</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Premises Location</label>
                  <input
                    type="text"
                    placeholder="e.g. East Gate Torana"
                    value={facilityForm.location}
                    onChange={(e) => setFacilityForm({ ...facilityForm, location: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Public Description</label>
                <textarea
                  rows={2}
                  placeholder="Facility specifications for visiting devotees..."
                  value={facilityForm.publicDescription}
                  onChange={(e) => setFacilityForm({ ...facilityForm, publicDescription: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={facilityForm.operatingHours}
                    onChange={(e) => setFacilityForm({ ...facilityForm, operatingHours: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Inquiry Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. Help Desk Ext 101"
                    value={facilityForm.contactInfo}
                    onChange={(e) => setFacilityForm({ ...facilityForm, contactInfo: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFacilityModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD FAQ */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Add Devotee FAQ</h3>
                <p className="text-xs text-stone-500">Provide authoritative answer for public portal.</p>
              </div>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFaqSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Devotee Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Can elderly pilgrims book wheelchair assistance in advance?"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">FAQ Category</label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
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
                <label className="block font-semibold text-stone-700 mb-1">Authoritative Answer *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Official guidance according to temple trust guidelines..."
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg shadow-sm"
                >
                  Publish FAQ
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

