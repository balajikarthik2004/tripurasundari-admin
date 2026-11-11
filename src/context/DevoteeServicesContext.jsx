import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_DEVOTEES } from '../data/devoteesData';
import { INITIAL_POOJA_SERVICES, INITIAL_POOJA_BOOKINGS, INITIAL_ANNADANAM_RECORDS } from '../data/poojaData';
import { INITIAL_DONATIONS, INITIAL_SPONSORSHIPS, INITIAL_DONATION_CATEGORIES } from '../data/donationsData';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_INVENTORY_LOGS } from '../data/storeData';
import {
  INITIAL_FACILITIES,
  INITIAL_ACCOMMODATION_TYPES,
  INITIAL_ACCOMMODATION_REQUESTS,
  INITIAL_MAINTENANCE_REQUESTS,
} from '../data/facilitiesData';
import { INITIAL_DARSHAN_BOOKINGS } from '../data/darshanBookings';
import {
  INITIAL_MEMBERSHIP_TIERS,
  INITIAL_MEMBERS,
  INITIAL_SANKALPA_PUJAS,
  INITIAL_KIT_DISPATCHES,
} from '../data/membershipData';

const DevoteeServicesContext = createContext(null);

export function DevoteeServicesProvider({ children }) {
  // 1. Central Devotee Directory
  const [devotees, setDevotees] = useState(INITIAL_DEVOTEES);

  // 2. Darshan Bookings (shared reference for consolidated activity)
  const [darshanBookings, setDarshanBookings] = useState(INITIAL_DARSHAN_BOOKINGS);

  // 3. Pooja, Seva & Annadanam
  const [poojaServices, setPoojaServices] = useState(INITIAL_POOJA_SERVICES);
  const [poojaBookings, setPoojaBookings] = useState(INITIAL_POOJA_BOOKINGS);
  const [annadanamRecords, setAnnadanamRecords] = useState(INITIAL_ANNADANAM_RECORDS);

  // 4. Donations & Sponsorships
  const [donations, setDonations] = useState(INITIAL_DONATIONS);
  const [sponsorships, setSponsorships] = useState(INITIAL_SPONSORSHIPS);
  const [donationCategories, setDonationCategories] = useState(INITIAL_DONATION_CATEGORIES);

  // 5. Prasad & Store
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [inventoryLogs, setInventoryLogs] = useState(INITIAL_INVENTORY_LOGS);

  // 6. Facilities & Accommodation
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);
  const [accommodationTypes, setAccommodationTypes] = useState(INITIAL_ACCOMMODATION_TYPES);
  const [accommodationRequests, setAccommodationRequests] = useState(INITIAL_ACCOMMODATION_REQUESTS);
  const [maintenanceRequests, setMaintenanceRequests] = useState(INITIAL_MAINTENANCE_REQUESTS);

  // 7. Bhakta Mandal & Membership
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [membershipTiers, setMembershipTiers] = useState(INITIAL_MEMBERSHIP_TIERS);
  const [sankalpaPujas, setSankalpaPujas] = useState(INITIAL_SANKALPA_PUJAS);
  const [kitDispatches, setKitDispatches] = useState(INITIAL_KIT_DISPATCHES);

  // Global Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Helper: Find or get devotee
  const getDevoteeById = (id) => devotees.find((d) => d.id === id);

  // Consolidated Devotee Activity History across all modules
  const getDevoteeActivity = (devoteeId) => {
    const target = devotees.find((d) => d.id === devoteeId);
    if (!target) return { all: [], darshan: [], pooja: [], donations: [], orders: [], accommodation: [] };

    const darshan = darshanBookings.filter(
      (b) => b.devoteeId === devoteeId || (target.mobile && b.mobile === target.mobile)
    );

    const pooja = poojaBookings.filter(
      (p) => p.devoteeId === devoteeId || (target.mobile && p.mobile === target.mobile)
    );

    const devoteeDonations = donations.filter(
      (d) => d.devoteeId === devoteeId || (target.mobile && d.mobile === target.mobile)
    );

    const devoteeOrders = orders.filter(
      (o) => o.devoteeId === devoteeId || (target.mobile && o.mobile === target.mobile)
    );

    const devoteeAcc = accommodationRequests.filter(
      (a) => a.devoteeId === devoteeId || (target.mobile && a.mobile === target.mobile)
    );

    // Merge into chronological timeline
    const all = [
      ...darshan.map((b) => ({
        type: 'Darshan Booking',
        id: b.id,
        date: b.visitDate || b.createdDate,
        title: `${b.serviceName} (${b.devoteesCount} Devotee${b.devoteesCount > 1 ? 's' : ''})`,
        amount: b.amount,
        status: b.status,
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      })),
      ...pooja.map((p) => ({
        type: 'Pooja / Seva',
        id: p.id,
        date: p.preferredDate || p.createdDate,
        title: `${p.serviceName} • Gotra: ${p.gotra || 'Not specified'}`,
        amount: p.amount,
        status: p.bookingStatus,
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      })),
      ...devoteeDonations.map((d) => ({
        type: 'Donation Contribution',
        id: d.id,
        date: d.date,
        title: `${d.category} (Receipt: ${d.receiptNumber || 'Pending'})`,
        amount: d.amount,
        status: d.paymentStatus,
        badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      })),
      ...devoteeOrders.map((o) => ({
        type: 'Prasad & Store Order',
        id: o.id,
        date: o.orderDate,
        title: `${o.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}`,
        amount: o.totalAmount,
        status: o.orderStatus,
        badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      })),
      ...devoteeAcc.map((a) => ({
        type: 'Accommodation Stay',
        id: a.id,
        date: a.checkInDate,
        title: `${a.accommodationType} (${a.allocatedUnit || 'Unallocated'})`,
        amount: a.amount,
        status: a.status,
        badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      })),
    ].sort((a, b) => (b.date > a.date ? 1 : -1));

    return {
      all,
      darshan,
      pooja,
      donations: devoteeDonations,
      orders: devoteeOrders,
      accommodation: devoteeAcc,
    };
  };

  // --- DEVOTEES ACTIONS ---
  const addDevotee = (devoteeData) => {
    const nextId = `DEV-${1000 + devotees.length + 1}`;
    const newRecord = {
      ...devoteeData,
      id: nextId,
      registrationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active',
      segment: devoteeData.segment || 'New Devotee',
    };
    setDevotees((prev) => [newRecord, ...prev]);
    showToast(`Devotee ${newRecord.name} registered with ID ${nextId}.`);
    return newRecord;
  };

  const updateDevotee = (id, updatedFields) => {
    setDevotees((prev) => prev.map((d) => (d.id === id ? { ...d, ...updatedFields } : d)));
    showToast(`Devotee profile ${id} updated.`);
  };

  // --- POOJA & SEVA ACTIONS ---
  const addPoojaService = (serviceData) => {
    const id = `POOJ-SRV-${String(poojaServices.length + 1).padStart(2, '0')}`;
    const newService = { ...serviceData, id, status: 'active' };
    setPoojaServices((prev) => [...prev, newService]);
    showToast(`Pooja service "${newService.name}" created.`);
    return newService;
  };

  const updatePoojaService = (id, updatedFields) => {
    setPoojaServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s)));
    showToast('Pooja service configuration updated.');
  };

  const togglePoojaService = (id) => {
    setPoojaServices((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newStatus = s.status === 'active' ? 'inactive' : 'active';
        showToast(`Service "${s.name}" is now ${newStatus}.`);
        return { ...s, status: newStatus };
      })
    );
  };

  const createPoojaBooking = (bookingData) => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const id = `POOJ-2026-${1000 + poojaBookings.length + 1}`;
    const fullBooking = {
      ...bookingData,
      id,
      createdDate: nowTimestamp,
      bookingStatus: bookingData.bookingStatus || 'Confirmed',
    };
    setPoojaBookings((prev) => [fullBooking, ...prev]);
    showToast(`Pooja booking ${id} recorded for ${fullBooking.devoteeName}.`);
    return fullBooking;
  };

  const updatePoojaBookingStatus = (id, newStatus, remarks = '') => {
    setPoojaBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          bookingStatus: newStatus,
          administrativeRemarks: remarks ? `${b.administrativeRemarks ? b.administrativeRemarks + ' • ' : ''}${remarks}` : b.administrativeRemarks,
        };
      })
    );
    showToast(`Booking ${id} status updated to ${newStatus}.`);
  };

  const createAnnadanamRecord = (recordData) => {
    const id = `ANN-2026-${String(annadanamRecords.length + 1).padStart(3, '0')}`;
    const fullRecord = {
      ...recordData,
      id,
      distributionStatus: recordData.distributionStatus || 'Scheduled',
    };
    setAnnadanamRecords((prev) => [fullRecord, ...prev]);
    showToast(`Annadanam record ${id} logged.`);
    return fullRecord;
  };

  const updateAnnadanamStatus = (id, newStatus) => {
    setAnnadanamRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, distributionStatus: newStatus } : r))
    );
    showToast(`Annadanam record ${id} updated to ${newStatus}.`);
  };

  // --- DONATIONS & SPONSORSHIPS ACTIONS ---
  const recordDonation = (donationData) => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const nextNumber = 1000 + donations.length + 1;
    const id = `DON-2026-${nextNumber}`;
    const receiptNumber = `REC-2026-${8800 + nextNumber}`;

    const fullDonation = {
      ...donationData,
      id,
      date: nowTimestamp,
      receiptNumber,
      receiptStatus: 'Generated',
      paymentStatus: donationData.paymentStatus || 'Verified',
      transactionRef: donationData.transactionRef || `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };

    setDonations((prev) => [fullDonation, ...prev]);
    showToast(`Donation of ₹${Number(fullDonation.amount).toLocaleString('en-IN')} recorded (Receipt: ${receiptNumber}).`);
    return fullDonation;
  };

  const verifyDonation = (id) => {
    setDonations((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const receiptNumber = d.receiptNumber || `REC-2026-${Math.floor(8800 + Math.random() * 200)}`;
        return { ...d, paymentStatus: 'Verified', receiptStatus: 'Generated', receiptNumber };
      })
    );
    showToast(`Donation ${id} verified and official receipt generated.`);
  };

  const createSponsorship = (sponData) => {
    const id = `SPON-2026-${100 + sponsorships.length + 1}`;
    const fullRecord = {
      ...sponData,
      id,
      paymentStatus: sponData.paymentStatus || 'Paid',
      acknowledgementStatus: 'Issued',
    };
    setSponsorships((prev) => [fullRecord, ...prev]);
    showToast(`Sponsorship ${id} created for ${fullRecord.sponsorName}.`);
    return fullRecord;
  };

  const updateSponsorshipStatus = (id, status) => {
    setSponsorships((prev) =>
      prev.map((s) => (s.id === id ? { ...s, paymentStatus: status } : s))
    );
    showToast(`Sponsorship ${id} marked as ${status}.`);
  };

  // --- PRASAD & STORE ACTIONS ---
  const addProduct = (productData) => {
    const id = `PRD-${String(products.length + 1).padStart(3, '0')}`;
    const fullProduct = {
      ...productData,
      id,
      stock: Number(productData.stock) || 0,
      price: Number(productData.price) || 0,
      threshold: Number(productData.threshold) || 20,
      availability: (Number(productData.stock) || 0) > (Number(productData.threshold) || 20) ? 'In Stock' : 'Low Stock',
      status: 'active',
    };
    setProducts((prev) => [...prev, fullProduct]);
    showToast(`Product "${fullProduct.name}" added to store catalogue.`);
    return fullProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updatedFields };
        updated.availability =
          updated.stock <= 0 ? 'Out of Stock' : updated.stock <= updated.threshold ? 'Low Stock' : 'In Stock';
        return updated;
      })
    );
    showToast('Product details updated.');
  };

  const toggleProductActive = (id) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newStatus = p.status === 'active' ? 'inactive' : 'active';
        showToast(`Product "${p.name}" is now ${newStatus}.`);
        return { ...p, status: newStatus };
      })
    );
  };

  const adjustStock = (productId, delta, reason = 'Administrative Adjustment', recordedBy = 'Admin User') => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let updatedStockVal = 0;
    let prodName = '';

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        prodName = p.name;
        const newStock = Math.max(0, p.stock + delta);
        updatedStockVal = newStock;
        return {
          ...p,
          stock: newStock,
          availability: newStock <= 0 ? 'Out of Stock' : newStock <= p.threshold ? 'Low Stock' : 'In Stock',
        };
      })
    );

    // Record inventory log
    setInventoryLogs((prev) => [
      {
        id: `LOG-${String(prev.length + 1).padStart(3, '0')}`,
        timestamp: nowTimestamp,
        productId,
        productName: prodName,
        change: delta,
        type: delta > 0 ? 'Stock Received' : 'Adjustment / Issue',
        updatedStock: updatedStockVal,
        reason,
        recordedBy,
      },
      ...prev,
    ]);

    showToast(`Stock updated for ${prodName} (${delta > 0 ? `+${delta}` : delta}).`);
  };

  const createOrder = (orderData) => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const id = `ORD-2026-${1000 + orders.length + 1}`;

    // Deduct stock for each item
    orderData.items.forEach((item) => {
      adjustStock(item.productId, -item.quantity, `Order ${id} Fulfillment`, 'Store POS Counter');
    });

    const fullOrder = {
      ...orderData,
      id,
      orderDate: nowTimestamp,
      orderStatus: orderData.orderStatus || 'Confirmed',
    };

    setOrders((prev) => [fullOrder, ...prev]);
    showToast(`Order ${id} placed for ${fullOrder.devoteeName} (₹${fullOrder.totalAmount}).`);
    return fullOrder;
  };

  const updateOrderStatus = (id, newStatus) => {
    const targetOrder = orders.find((o) => o.id === id);

    // If cancelling, restore stock
    if (newStatus === 'Cancelled' && targetOrder && targetOrder.orderStatus !== 'Cancelled') {
      targetOrder.items.forEach((item) => {
        adjustStock(item.productId, item.quantity, `Order ${id} Cancellation Restock`, 'Store System');
      });
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o))
    );
    showToast(`Order ${id} status updated to ${newStatus}.`);
  };

  // --- FACILITIES & ACCOMMODATION ACTIONS ---
  const addFacility = (facilityData) => {
    const id = `FAC-${String(facilities.length + 1).padStart(3, '0')}`;
    const full = {
      ...facilityData,
      id,
      operationalStatus: facilityData.operationalStatus || 'Operational',
      lastInspection: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      maintenanceStatus: 'Normal',
    };
    setFacilities((prev) => [...prev, full]);
    showToast(`Facility "${full.name}" registered.`);
    return full;
  };

  const updateFacility = (id, updatedFields) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updatedFields } : f))
    );
    showToast(`Facility ${id} information updated.`);
  };

  const updateFacilityStatus = (id, operationalStatus) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, operationalStatus } : f))
    );
    showToast(`Facility status changed to ${operationalStatus}.`);
  };

  const createAccommodationRequest = (reqData) => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const id = `ACC-2026-${1000 + accommodationRequests.length + 1}`;
    const full = {
      ...reqData,
      id,
      requestDate: nowTimestamp,
      status: reqData.status || 'Approved',
    };
    setAccommodationRequests((prev) => [full, ...prev]);
    showToast(`Accommodation request ${id} recorded for ${full.devoteeName}.`);
    return full;
  };

  const updateAccommodationStatus = (id, status, allocatedUnit = '') => {
    setAccommodationRequests((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return {
          ...a,
          status,
          ...(allocatedUnit ? { allocatedUnit } : {}),
        };
      })
    );
    showToast(`Accommodation booking ${id} status changed to ${status}.`);
  };

  const createMaintenanceRequest = (mntData) => {
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const id = `MNT-2026-${100 + maintenanceRequests.length + 1}`;
    const full = {
      ...mntData,
      id,
      reportedDate: nowTimestamp,
      status: mntData.status || 'Open',
    };
    setMaintenanceRequests((prev) => [full, ...prev]);

    // Also mark facility maintenance status
    setFacilities((prev) =>
      prev.map((f) => (f.id === mntData.facilityId ? { ...f, maintenanceStatus: 'Active Alert' } : f))
    );

    showToast(`Maintenance ticket ${id} created for ${full.facilityName}.`);
    return full;
  };

  const updateMaintenanceStatus = (id, status, remarks = '') => {
    setMaintenanceRequests((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        return {
          ...m,
          status,
          remarks: remarks ? `${m.remarks ? m.remarks + ' • ' : ''}${remarks}` : m.remarks,
        };
      })
    );
    showToast(`Maintenance ticket ${id} marked as ${status}.`);
  };

  // ========================================================
  // 7. MEMBERSHIP ACTIONS
  // ========================================================
  const addMember = (memberData) => {
    const id = memberData.id || `MTS-MEM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMember = {
      ...memberData,
      id,
      joiningDate: memberData.joiningDate || new Date().toISOString().slice(0, 10),
      status: memberData.status || 'Active',
      darshanPassesUsed: memberData.darshanPassesUsed || 0,
    };
    setMembers((prev) => [newMember, ...prev]);

    // Also schedule their annual sankalpa puja if date provided
    if (newMember.sankalpaDate) {
      const newSankalpa = {
        id: `SP-2026-${Math.floor(800 + Math.random() * 200)}`,
        memberId: id,
        memberName: newMember.name,
        gotra: newMember.gotra,
        nakshatra: newMember.nakshatra || '',
        tierName: newMember.tierName,
        date: newMember.sankalpaDate,
        timeSlot: '09:00 AM',
        occasion: newMember.sankalpaOccasion || 'Annual Devotional Archana',
        priest: 'Pt. Bhabatosh Bhattacharya',
        status: 'Scheduled',
        videoLinkSent: false,
        prasadDispatched: false,
      };
      setSankalpaPujas((prev) => [newSankalpa, ...prev]);
    }

    // Also add to prasad kit fulfillment queue
    const newKit = {
      id: `KIT-2026-${Math.floor(400 + Math.random() * 100)}`,
      memberId: id,
      memberName: newMember.name,
      tierName: newMember.tierName,
      address: newMember.address,
      items: newMember.tierId === 'poshak'
        ? 'Gold-plated Sri Yantra, Pure Silk Vastra & Grand Bhog Box'
        : newMember.tierId === 'rajarajeshwari'
        ? 'Pure Silver Coin, Silk Chunari & Dry Peda Box'
        : 'Silver-foil Sri Yantra, Blessed Peda & Holy Sindoor',
      carrier: 'India Post Speed Post',
      trackingNumber: 'Awaiting Packing',
      status: 'Ready for Dispatch',
      dispatchDate: 'Pending',
    };
    setKitDispatches((prev) => [newKit, ...prev]);

    showToast(`Devotee ${newMember.name} enrolled under ${newMember.tierName} (${id}).`);
    return newMember;
  };

  const updateMemberStatus = (memberId, status, remarks = '') => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status, remarks: remarks || m.remarks } : m))
    );
    showToast(`Member ${memberId} status updated to ${status}.`);
  };

  const renewMember = (memberId, durationYears = 1) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const currentExp = new Date(m.validUntil);
        const baseDate = isNaN(currentExp.getTime()) ? new Date() : currentExp;
        baseDate.setFullYear(baseDate.getFullYear() + durationYears);
        const newValidUntil = baseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        return {
          ...m,
          status: 'Active',
          validUntil: newValidUntil,
          darshanPassesUsed: 0,
        };
      })
    );
    showToast(`Member ${memberId} renewed for ${durationYears} year(s).`);
  };

  const completeSankalpaPuja = (pujaId, priest = 'Pt. Bhabatosh Bhattacharya') => {
    setSankalpaPujas((prev) =>
      prev.map((p) =>
        p.id === pujaId
          ? { ...p, status: 'Completed', priest, videoLinkSent: true, prasadDispatched: true }
          : p
      )
    );
    showToast(`Sankalpa Archana ${pujaId} consecrated & completed by ${priest}. Devotee notified.`);
  };

  const updateKitDispatch = (kitId, trackingNumber, status = 'Dispatched') => {
    setKitDispatches((prev) =>
      prev.map((k) =>
        k.id === kitId
          ? {
              ...k,
              trackingNumber: trackingNumber || k.trackingNumber,
              status,
              dispatchDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            }
          : k
      )
    );
    showToast(`Prasad kit ${kitId} marked as ${status} (Tracking: ${trackingNumber}).`);
  };

  const updateTierConfig = (tierId, updatedFields) => {
    setMembershipTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, ...updatedFields } : t))
    );
    showToast(`Membership tier ${tierId} configuration updated.`);
  };

  return (
    <DevoteeServicesContext.Provider
      value={{
        // Devotees
        devotees,
        addDevotee,
        updateDevotee,
        getDevoteeById,
        getDevoteeActivity,

        // Darshan Bookings (shared state)
        darshanBookings,
        setDarshanBookings,

        // Pooja, Seva & Annadanam
        poojaServices,
        poojaBookings,
        annadanamRecords,
        addPoojaService,
        updatePoojaService,
        togglePoojaService,
        createPoojaBooking,
        updatePoojaBookingStatus,
        createAnnadanamRecord,
        updateAnnadanamStatus,

        // Donations & Sponsorships
        donations,
        sponsorships,
        donationCategories,
        recordDonation,
        verifyDonation,
        createSponsorship,
        updateSponsorshipStatus,

        // Prasad & Store
        products,
        orders,
        inventoryLogs,
        addProduct,
        updateProduct,
        toggleProductActive,
        adjustStock,
        createOrder,
        updateOrderStatus,

        // Facilities & Accommodation
        facilities,
        accommodationTypes,
        accommodationRequests,
        maintenanceRequests,
        addFacility,
        updateFacility,
        updateFacilityStatus,
        createAccommodationRequest,
        updateAccommodationStatus,
        createMaintenanceRequest,
        updateMaintenanceStatus,

        // Bhakta Mandal & Membership
        members,
        membershipTiers,
        sankalpaPujas,
        kitDispatches,
        addMember,
        updateMemberStatus,
        renewMember,
        completeSankalpaPuja,
        updateKitDispatch,
        updateTierConfig,

        // Global UI
        toast,
        showToast,
      }}
    >
      {children}

      {/* Global Module Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 max-w-sm ${
              toast.type === 'error'
                ? 'bg-rose-900 text-rose-50 border-rose-700'
                : toast.type === 'info'
                ? 'bg-amber-900 text-amber-50 border-amber-700'
                : 'bg-[#55132D] text-white border-[#B68A36]/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#E2BC6B] animate-pulse flex-shrink-0" />
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        </div>
      )}
    </DevoteeServicesContext.Provider>
  );
}

export function useDevoteeServices() {
  const context = useContext(DevoteeServicesContext);
  if (!context) {
    throw new Error('useDevoteeServices must be used within a DevoteeServicesProvider');
  }
  return context;
}

