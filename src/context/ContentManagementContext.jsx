import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_TEMPLE_PROFILE } from '../data/content/templeProfile';
import { INITIAL_HISTORY_SECTIONS } from '../data/content/templeHistory';
import { INITIAL_DEITIES } from '../data/content/deityInformation';
import { INITIAL_GALLERY_ITEMS } from '../data/content/galleryItems';
import { INITIAL_WEBSITE_PAGES } from '../data/content/websitePages';
import { INITIAL_EVENTS } from '../data/content/events';
import { INITIAL_EVENT_CATEGORIES } from '../data/content/eventCategories';
import { INITIAL_ANNOUNCEMENTS } from '../data/content/announcements';
import { INITIAL_ANNOUNCEMENT_CATEGORIES } from '../data/content/announcementCategories';
import { INITIAL_VISITOR_GUIDELINES } from '../data/content/visitorInformation';
import { INITIAL_TRAVEL_INFORMATION } from '../data/content/travelInformation';
import { INITIAL_PUBLIC_FACILITIES } from '../data/content/publicFacilities';
import { INITIAL_MAP_MARKERS } from '../data/content/visitorMapMarkers';
import { INITIAL_FAQS } from '../data/content/faqs';

const ContentManagementContext = createContext(null);

export function ContentManagementProvider({ children }) {
  // 1. Temple Information State
  const [templeProfile, setTempleProfile] = useState(INITIAL_TEMPLE_PROFILE);
  const [historySections, setHistorySections] = useState(INITIAL_HISTORY_SECTIONS);
  const [deities, setDeities] = useState(INITIAL_DEITIES);
  const [galleryItems, setGalleryItems] = useState(INITIAL_GALLERY_ITEMS);
  const [websitePages, setWebsitePages] = useState(INITIAL_WEBSITE_PAGES);

  // 2. Events & Festivals State
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [eventCategories, setEventCategories] = useState(INITIAL_EVENT_CATEGORIES);

  // 3. Announcements State
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [announcementCategories, setAnnouncementCategories] = useState(INITIAL_ANNOUNCEMENT_CATEGORIES);

  // 4. Visit Guide & Facilities Map State
  const [visitorGuidelines, setVisitorGuidelines] = useState(INITIAL_VISITOR_GUIDELINES);
  const [travelInformation, setTravelInformation] = useState(INITIAL_TRAVEL_INFORMATION);
  const [publicFacilities, setPublicFacilities] = useState(INITIAL_PUBLIC_FACILITIES);
  const [mapMarkers, setMapMarkers] = useState(INITIAL_MAP_MARKERS);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);

  // Global Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Preview Drawer/Modal State
  const [previewData, setPreviewData] = useState(null);

  const openPreview = (type, item) => {
    setPreviewData({ type, item });
  };

  const closePreview = () => {
    setPreviewData(null);
  };

  // --- TEMPLE PROFILE ACTIONS ---
  const updateTempleProfile = (fields) => {
    setTempleProfile((prev) => ({
      ...prev,
      ...fields,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    showToast('Temple public profile updated.');
  };

  // --- HISTORY SECTIONS ACTIONS ---
  const addHistorySection = (sectionData) => {
    const id = `HIST-${String(historySections.length + 1).padStart(3, '0')}`;
    const newSection = {
      ...sectionData,
      id,
      displayOrder: historySections.length + 1,
      status: sectionData.status || 'Draft',
      verificationStatus: sectionData.verificationStatus || 'Draft',
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      image: sectionData.image || '/src/assets/images/temple.jpg',
    };
    setHistorySections((prev) => [...prev, newSection]);
    showToast(`History section "${newSection.title}" created.`);
    return newSection;
  };

  const updateHistorySection = (id, fields) => {
    setHistorySections((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              ...fields,
              lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : h
      )
    );
    showToast(`Section ${id} updated.`);
  };

  const deleteHistorySection = (id) => {
    setHistorySections((prev) => prev.filter((h) => h.id !== id));
    showToast(`Section ${id} deleted.`);
  };

  // --- DEITIES ACTIONS ---
  const addDeity = (deityData) => {
    const id = `DEI-${String(deities.length + 1).padStart(3, '0')}`;
    const newDeity = {
      ...deityData,
      id,
      displayOrder: deities.length + 1,
      status: deityData.status || 'Draft',
      verificationStatus: deityData.verificationStatus || 'Draft',
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      image: deityData.image || '/src/assets/images/temple.jpg',
    };
    setDeities((prev) => [...prev, newDeity]);
    showToast(`Deity record "${newDeity.name}" added.`);
    return newDeity;
  };

  const updateDeity = (id, fields) => {
    setDeities((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              ...fields,
              lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : d
      )
    );
    showToast(`Deity record ${id} updated.`);
  };

  const deleteDeity = (id) => {
    setDeities((prev) => prev.filter((d) => d.id !== id));
    showToast(`Deity record ${id} removed.`);
  };

  // --- GALLERY ACTIONS ---
  const addGalleryItem = (galleryData) => {
    const id = `GAL-${String(galleryItems.length + 1).padStart(3, '0')}`;
    const newItem = {
      ...galleryData,
      id,
      displayOrder: galleryItems.length + 1,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: galleryData.status || 'Published',
      imageUrl: galleryData.imageUrl || '/src/assets/images/temple.jpg',
    };
    setGalleryItems((prev) => [...prev, newItem]);
    showToast(`Gallery item "${newItem.title}" uploaded.`);
    return newItem;
  };

  const updateGalleryItem = (id, fields) => {
    setGalleryItems((prev) => prev.map((g) => (g.id === id ? { ...g, ...fields } : g)));
    showToast(`Gallery record ${id} updated.`);
  };

  const deleteGalleryItem = (id) => {
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
    showToast(`Gallery record ${id} deleted.`);
  };

  // --- WEBSITE PAGES ACTIONS ---
  const addWebsitePage = (pageData) => {
    const id = `PAGE-${String(websitePages.length + 1).padStart(3, '0')}`;
    const newPage = {
      ...pageData,
      id,
      status: pageData.status || 'Draft',
      verificationStatus: pageData.verificationStatus || 'Draft',
      lastModified: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setWebsitePages((prev) => [...prev, newPage]);
    showToast(`Website page "${newPage.title}" created.`);
    return newPage;
  };

  const updateWebsitePage = (id, fields) => {
    setWebsitePages((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...fields,
              lastModified: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : p
      )
    );
    showToast(`Page ${id} updated.`);
  };

  const deleteWebsitePage = (id) => {
    setWebsitePages((prev) => prev.filter((p) => p.id !== id));
    showToast(`Page ${id} deleted.`);
  };

  // --- EVENTS & FESTIVALS ACTIONS ---
  const addEvent = (eventData) => {
    const id = `EVT-2026-${String(events.length + 1).padStart(3, '0')}`;
    const newEvent = {
      ...eventData,
      id,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: eventData.status || 'Draft',
      verificationStatus: eventData.verificationStatus || 'Draft',
      coverImage: eventData.coverImage || '/src/assets/images/temple.jpg',
    };
    setEvents((prev) => [newEvent, ...prev]);
    showToast(`Event "${newEvent.title}" created.`);
    return newEvent;
  };

  const updateEvent = (id, fields) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              ...fields,
              lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : e
      )
    );
    showToast(`Event ${id} updated.`);
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast(`Event ${id} removed.`);
  };

  const toggleEventFeatured = (id) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const next = !e.featured;
        showToast(`Event featured status: ${next ? 'Featured on Portal' : 'Unfeatured'}.`);
        return { ...e, featured: next };
      })
    );
  };

  // --- ANNOUNCEMENTS ACTIONS ---
  const addAnnouncement = (announcementData) => {
    const id = `ANN-2026-${String(announcements.length + 1).padStart(3, '0')}`;
    const newAnn = {
      ...announcementData,
      id,
      publishDate: announcementData.publishDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: announcementData.status || 'Draft',
      verificationStatus: announcementData.verificationStatus || 'Draft',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast(`Notice "${newAnn.title}" registered.`);
    return newAnn;
  };

  const updateAnnouncement = (id, fields) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...fields } : a)));
    showToast(`Notice ${id} updated.`);
  };

  const archiveAnnouncement = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Archived', pinned: false, showOnHomepage: false } : a))
    );
    showToast(`Notice ${id} moved to archive.`);
  };

  const restoreAnnouncement = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Draft' } : a))
    );
    showToast(`Notice ${id} restored to draft.`);
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast(`Notice ${id} deleted.`);
  };

  // --- VISITOR GUIDELINES ACTIONS ---
  const addVisitorGuideline = (guideData) => {
    const id = `VIG-${String(visitorGuidelines.length + 1).padStart(3, '0')}`;
    const newGuide = {
      ...guideData,
      id,
      displayOrder: visitorGuidelines.length + 1,
      status: guideData.status || 'Draft',
      verificationStatus: guideData.verificationStatus || 'Draft',
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setVisitorGuidelines((prev) => [...prev, newGuide]);
    showToast(`Visitor guide section "${newGuide.title}" added.`);
    return newGuide;
  };

  const updateVisitorGuideline = (id, fields) => {
    setVisitorGuidelines((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              ...fields,
              lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : v
      )
    );
    showToast(`Guideline ${id} updated.`);
  };

  const deleteVisitorGuideline = (id) => {
    setVisitorGuidelines((prev) => prev.filter((v) => v.id !== id));
    showToast(`Guideline ${id} deleted.`);
  };

  // --- TRAVEL INFORMATION ACTIONS ---
  const updateTravelInformation = (fields) => {
    setTravelInformation((prev) => ({
      ...prev,
      ...fields,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    showToast('Directions & travel guide updated.');
  };

  // --- PUBLIC FACILITIES ACTIONS ---
  const addPublicFacility = (facilityData) => {
    const id = `PUB-FAC-${String(publicFacilities.length + 1).padStart(2, '0')}`;
    const newFacility = {
      ...facilityData,
      id,
      displayOrder: publicFacilities.length + 1,
      publicationStatus: facilityData.publicationStatus || 'Draft',
      verificationStatus: facilityData.verificationStatus || 'Draft',
    };
    setPublicFacilities((prev) => [...prev, newFacility]);
    showToast(`Public facility entry "${newFacility.name}" created.`);
    return newFacility;
  };

  const updatePublicFacility = (id, fields) => {
    setPublicFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, ...fields } : f)));
    showToast(`Facility entry ${id} updated.`);
  };

  const deletePublicFacility = (id) => {
    setPublicFacilities((prev) => prev.filter((f) => f.id !== id));
    showToast(`Facility entry ${id} deleted.`);
  };

  // --- VISITOR MAP MARKERS ACTIONS ---
  const addMapMarker = (markerData) => {
    const id = `MKR-${String(mapMarkers.length + 1).padStart(3, '0')}`;
    const newMarker = {
      ...markerData,
      id,
      x: markerData.x || 50,
      y: markerData.y || 50,
      status: markerData.status || 'Published',
      isVisible: true,
    };
    setMapMarkers((prev) => [...prev, newMarker]);
    showToast(`Map marker "${newMarker.name}" added at (${newMarker.x}%, ${newMarker.y}%).`);
    return newMarker;
  };

  const updateMapMarker = (id, fields) => {
    setMapMarkers((prev) => prev.map((m) => (m.id === id ? { ...m, ...fields } : m)));
    showToast(`Map marker ${id} updated.`);
  };

  const moveMapMarker = (id, x, y) => {
    setMapMarkers((prev) => prev.map((m) => (m.id === id ? { ...m, x: Math.round(x), y: Math.round(y) } : m)));
    showToast(`Marker repositioned to (${Math.round(x)}%, ${Math.round(y)}%).`);
  };

  const toggleMarkerVisibility = (id) => {
    setMapMarkers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const next = !m.isVisible;
        showToast(`Marker ${m.name} is now ${next ? 'Visible' : 'Hidden'} on visitor map.`);
        return { ...m, isVisible: next };
      })
    );
  };

  const deleteMapMarker = (id) => {
    setMapMarkers((prev) => prev.filter((m) => m.id !== id));
    showToast(`Map marker ${id} removed.`);
  };

  // --- FAQS ACTIONS ---
  const addFaq = (faqData) => {
    const id = `FAQ-${String(faqs.length + 1).padStart(3, '0')}`;
    const newFaq = {
      ...faqData,
      id,
      displayOrder: faqs.length + 1,
      status: faqData.status || 'Published',
      verificationStatus: faqData.verificationStatus || 'Draft',
    };
    setFaqs((prev) => [...prev, newFaq]);
    showToast(`FAQ "${newFaq.question.substring(0, 30)}..." added.`);
    return newFaq;
  };

  const updateFaq = (id, fields) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...fields } : f)));
    showToast(`FAQ ${id} updated.`);
  };

  const deleteFaq = (id) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    showToast(`FAQ ${id} deleted.`);
  };

  return (
    <ContentManagementContext.Provider
      value={{
        // Temple Information
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
        addWebsitePage,
        updateWebsitePage,
        deleteWebsitePage,

        // Events & Festivals
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventFeatured,
        eventCategories,

        // Announcements
        announcements,
        addAnnouncement,
        updateAnnouncement,
        archiveAnnouncement,
        restoreAnnouncement,
        deleteAnnouncement,
        announcementCategories,

        // Visit Guide & Facilities Map
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

        // Previews & Global Actions
        previewData,
        openPreview,
        closePreview,
        showToast,
      }}
    >
      {children}

      {/* Global Context Toast */}
      {toast && (
        <div className="fixed top-20 right-5 sm:right-6 z-[9999] bg-[#28212A] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-[#B68A36]/40 flex items-center gap-2.5 text-xs animate-in slide-in-from-top-3 fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-[#E2BC6B] animate-ping" />
          <span>{toast.message}</span>
        </div>
      )}
    </ContentManagementContext.Provider>
  );
}

export function useContentManagement() {
  const context = useContext(ContentManagementContext);
  if (!context) {
    throw new Error('useContentManagement must be used within a ContentManagementProvider');
  }
  return context;
}

