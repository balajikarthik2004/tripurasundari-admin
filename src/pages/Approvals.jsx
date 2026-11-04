import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  User,
  Phone,
  Crown,
  Check,
  X,
  ArrowRight,
  ExternalLink,
  Calendar,
  AlertTriangle,
  Building,
  Flame,
  Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INITIAL_APPROVALS = [
  {
    id: 'APP-101',
    category: 'VIP Protocol',
    title: 'District Magistrate Escort Protocol Pass',
    devoteeName: 'B. K. Debbarma (Gomati District Admin)',
    phone: '+91 98765 11001',
    personsCount: 4,
    date: '2026-11-03',
    timeSlot: '11:00 AM – 11:45 AM',
    requestedTier: 'Special VIP Protocol Darshan',
    reason: 'Official State Guest visit accompanying Joint Secretary, Ministry of Culture.',
    status: 'Pending',
    priority: 'Critical',
    submittedAt: 'Today, 08:30 AM',
  },
  {
    id: 'APP-102',
    category: 'VIP Protocol',
    title: 'State Guest Protocol Darshan',
    devoteeName: 'Hon. Justice R. P. Bhattacharya',
    phone: '+91 98765 11002',
    personsCount: 3,
    date: '2026-11-03',
    timeSlot: '01:30 PM – 02:15 PM',
    requestedTier: 'VVIP Sanctum Protocol',
    reason: 'High Court judicial protocol darshan with inner sanctum floral tribute.',
    status: 'Pending',
    priority: 'Critical',
    submittedAt: 'Today, 09:05 AM',
  },
  {
    id: 'APP-103',
    category: 'VIP Protocol',
    title: 'Tripura Tourism Development Delegation',
    devoteeName: 'Sanjay Chakraborty (Director Tourism)',
    phone: '+91 98765 11003',
    personsCount: 5,
    date: '2026-11-03',
    timeSlot: '03:00 PM – 03:45 PM',
    requestedTier: 'Special Entry Darshan',
    reason: 'National heritage circuit study group inspecting pilgrim infrastructure.',
    status: 'Pending',
    priority: 'High',
    submittedAt: 'Today, 09:20 AM',
  },
  {
    id: 'APP-104',
    category: 'VIP Protocol',
    title: 'Superintendent of Police Escort Clearance',
    devoteeName: 'Inspector Alok Roy (Security Division)',
    phone: '+91 98765 11004',
    personsCount: 2,
    date: '2026-11-03',
    timeSlot: '12:00 PM – 12:30 PM',
    requestedTier: 'Special VIP Protocol Darshan',
    reason: 'Pre-inspection for Diwali Mela high-level security rehearsal.',
    status: 'Pending',
    priority: 'High',
    submittedAt: 'Today, 07:50 AM',
  },
  {
    id: 'APP-105',
    category: 'VIP Protocol',
    title: 'Vedic Scholar & Temple Trust Guest Pass',
    devoteeName: 'Dr. Mukund Shastri (Varanasi Sanskrit Univ)',
    phone: '+91 98765 11005',
    personsCount: 2,
    date: '2026-11-03',
    timeSlot: '04:00 PM – 04:45 PM',
    requestedTier: 'VVIP Sanctum Protocol',
    reason: 'Consultation with Head Priest regarding Chandi Path astronomical schedule.',
    status: 'Pending',
    priority: 'Medium',
    submittedAt: 'Yesterday, 06:10 PM',
  },
  {
    id: 'APP-106',
    category: 'VIP Protocol',
    title: 'ONGC Tripura Basin Senior Executive Pass',
    devoteeName: 'Subir K. Roy (Executive Director)',
    phone: '+91 98765 11006',
    personsCount: 4,
    date: '2026-11-04',
    timeSlot: '10:00 AM – 10:45 AM',
    requestedTier: 'Special Entry Darshan',
    reason: 'Institutional CSR donor delegation for solar lighting plant inspection.',
    status: 'Pending',
    priority: 'Medium',
    submittedAt: 'Yesterday, 07:30 PM',
  },
  {
    id: 'APP-107',
    category: 'VIP Protocol',
    title: 'North Eastern Council (NEC) Delegated Visit',
    devoteeName: 'P. Lyngdoh (Adviser, Heritage)',
    phone: '+91 98765 11007',
    personsCount: 3,
    date: '2026-11-04',
    timeSlot: '11:30 AM – 12:15 PM',
    requestedTier: 'Special VIP Protocol Darshan',
    reason: 'Shakti Peeth development grant review visit.',
    status: 'Pending',
    priority: 'Medium',
    submittedAt: 'Yesterday, 08:15 PM',
  },
  {
    id: 'APP-108',
    category: 'VIP Protocol',
    title: 'Senior State Government Advisor Protocol',
    devoteeName: 'Dr. Anupam Sen (Finance Dept)',
    phone: '+91 98765 11008',
    personsCount: 2,
    date: '2026-11-04',
    timeSlot: '02:00 PM – 02:45 PM',
    requestedTier: 'Special VIP Protocol Darshan',
    reason: 'State trust financial audit inspection team.',
    status: 'Pending',
    priority: 'Medium',
    submittedAt: 'Yesterday, 09:00 PM',
  },

  // 2. Special Seva & Sankalpam Verification (5)
  {
    id: 'APP-201',
    category: 'Seva Verification',
    title: 'Maha Shodashopachara Puja with Special Sankalpam',
    devoteeName: 'Rameshwar Nath & Family',
    phone: '+91 98765 22001',
    personsCount: 6,
    date: '2026-11-03',
    timeSlot: '10:30 AM (Inner Mandap)',
    requestedTier: 'Shodashopachara Seva (₹5,100)',
    reason: 'Golden anniversary family sankalpam with priest assignment request for Purohit Acharya Debnath.',
    status: 'Pending',
    priority: 'High',
    submittedAt: 'Today, 06:45 AM',
  },
  {
    id: 'APP-202',
    category: 'Seva Verification',
    title: 'Special Chandi Path at Chhoto-Ma Sanctum Altar',
    devoteeName: 'Smt. Ananya Majumdar',
    phone: '+91 98765 22002',
    personsCount: 2,
    date: '2026-11-03',
    timeSlot: '12:00 PM (Chhoto-Ma)',
    requestedTier: 'Special Chandi Path (₹3,500)',
    reason: 'Sacred vow fulfillment after successful health recovery.',
    status: 'Pending',
    priority: 'Medium',
    submittedAt: 'Today, 07:15 AM',
  },
  {
    id: 'APP-203',
    category: 'Seva Verification',
    title: 'Navagraha & Shanti Mahayagya Samagri Clearance',
    devoteeName: 'Debabrata Barman',
    phone: '+91 98765 22003',
    personsCount: 4,
    date: '2026-11-04',
    timeSlot: '09:00 AM (Yagya Shala)',
    requestedTier: 'Navagraha Mahayagya (₹2,500)',
    reason: 'Requesting permission to bring pure ghee and organic havan samagri from devotee farm.',
    status: 'Pending',
    priority: 'Medium',
    submittedAt: 'Yesterday, 05:40 PM',
  },
  {
    id: 'APP-204',
    category: 'Seva Verification',
    title: 'Kalyansagar Deep Daan & 108 Oil Lamp Aarti',
    devoteeName: 'Gouranga Datta',
    phone: '+91 98765 22004',
    personsCount: 5,
    date: '2026-11-04',
    timeSlot: '06:00 PM (Lake Ghat)',
    requestedTier: 'Lake Ghat Deep Daan (₹1,500)',
    reason: 'Evening Diwali pre-utsav family memorial deep daan ritual on turtle-safe floating brass diyas.',
    status: 'Pending',
    priority: 'Medium',
    submittedAt: 'Yesterday, 04:30 PM',
  },
  {
    id: 'APP-205',
    category: 'Seva Verification',
    title: 'Akhanda Jyoti Continuous Oil Offering Clearance',
    devoteeName: 'Kailash Singha (Silchar)',
    phone: '+91 98765 22005',
    personsCount: 1,
    date: '2026-11-04',
    timeSlot: 'Continuous Sanctum',
    requestedTier: 'Akhanda Jyoti Seva (₹7,500)',
    reason: 'One-month unbroken mustard oil supply endorsement for sanctum eternal flame.',
    status: 'Pending',
    priority: 'High',
    submittedAt: 'Yesterday, 02:15 PM',
  },

  // 3. Cancellations & Refunds (3)
  {
    id: 'APP-301',
    category: 'Cancellations',
    title: 'Medical Emergency Darshan Pass Cancellation & Refund',
    devoteeName: 'S. Lakshmi',
    phone: '+91 98765 33001',
    personsCount: 2,
    date: '2026-11-03',
    timeSlot: '03:30 PM – 05:30 PM',
    requestedTier: 'Special Darshan Pass (₹1,000)',
    reason: 'Sudden fever and medical doctor certificate submitted requesting 100% refund release.',
    status: 'Pending',
    priority: 'High',
    submittedAt: 'Today, 08:50 AM',
  },
  {
    id: 'APP-302',
    category: 'Cancellations',
    title: 'Train Cancellation Agartala Intercity Delay Refund',
    devoteeName: 'Manoj Majumder',
    phone: '+91 98765 33002',
    personsCount: 4,
    date: '2026-11-03',
    timeSlot: '05:30 PM – 07:30 PM',
    requestedTier: 'VIP Seva Pass (₹2,000)',
    reason: 'Northeast Frontier Railway train #15626 delayed by 6 hours; family cannot arrive before sanctum closing.',
    status: 'Pending',
    priority: 'Medium',
    submittedAt: 'Today, 07:30 AM',
  },
  {
    id: 'APP-303',
    category: 'Cancellations',
    title: 'Bereavement Rescheduling & Trust Credit Request',
    devoteeName: 'Pratima Das',
    phone: '+91 98765 33003',
    personsCount: 3,
    date: '2026-11-04',
    timeSlot: '08:00 AM – 10:00 AM',
    requestedTier: 'Special Entry Darshan (₹1,500)',
    reason: 'Family emergency requesting credit rollover to December pilgrimage window.',
    status: 'Pending',
    priority: 'Medium',
    submittedAt: 'Yesterday, 11:20 PM',
  },

  // 4. Special Accommodation Allotment (2)
  {
    id: 'APP-401',
    category: 'Accommodation',
    title: 'Yatri Niwas VIP Family Cottage #3 Allotment',
    devoteeName: 'Prof. Hemanta Goswami (Guwahati)',
    phone: '+91 98765 44001',
    personsCount: 4,
    date: '2026-11-03 to 2026-11-05',
    timeSlot: 'Check-in: 02:00 PM',
    requestedTier: 'VIP AC Guest Cottage',
    reason: 'Visiting research scholar presenting historical monograph on Matabari copper-plate grants.',
    status: 'Pending',
    priority: 'High',
    submittedAt: 'Today, 08:10 AM',
  },
  {
    id: 'APP-402',
    category: 'Accommodation',
    title: 'Step-Free Ground-Floor Senior Citizen Quota Room',
    devoteeName: 'Kamalendu Roy (Age 79)',
    phone: '+91 98765 44002',
    personsCount: 2,
    date: '2026-11-03 to 2026-11-04',
    timeSlot: 'Check-in: 01:00 PM',
    requestedTier: 'Accessible Dormitory Deluxe',
    reason: 'Wheelchair user requesting barrier-free ground floor bed near West Gate ramp.',
    status: 'Pending',
    priority: 'High',
    submittedAt: 'Today, 06:30 AM',
  },
];

export default function Approvals({ isEmbedded = false }) {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [mainTab, setMainTab] = useState('pending'); // 'pending' or 'reviewed'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = (id) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
    showToast(`Request ${id} approved & administrative clearance voucher generated.`);
  };

  const handleReject = (id) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Rejected' } : item))
    );
    showToast(`Request ${id} marked as rejected. Devotee notified via SMS.`);
  };

  const pendingList = approvals.filter((a) => a.status === 'Pending');
  const reviewedList = approvals.filter((a) => a.status !== 'Pending');

  const displayedList = (mainTab === 'pending' ? pendingList : reviewedList).filter((item) => {
    const matchesCategory =
      categoryFilter === 'all'
        ? true
        : categoryFilter === 'vip'
        ? item.category === 'VIP Protocol'
        : categoryFilter === 'seva'
        ? item.category === 'Seva Verification'
        : categoryFilter === 'cancellations'
        ? item.category === 'Cancellations'
        : categoryFilter === 'accommodation'
        ? item.category === 'Accommodation'
        : true;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : item.devoteeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.requestedTier.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const vipCount = pendingList.filter((a) => a.category === 'VIP Protocol').length;
  const sevaCount = pendingList.filter((a) => a.category === 'Seva Verification').length;
  const canCount = pendingList.filter((a) => a.category === 'Cancellations').length;
  const accCount = pendingList.filter((a) => a.category === 'Accommodation').length;

  return (
    <div className="space-y-5 pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#55132D] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#B68A36]/40 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-[#E2BC6B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Module Page Header (Hidden when embedded) */}
      {!isEmbedded && (
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
              Administrative Approvals & Clearance Desk
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/bookings')}
              className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4 text-stone-500" />
              <span>Bookings Register</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      )}

      {/* Approvals Cards Stream */}
      <div className="space-y-3.5">
        {displayedList.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-stone-200 shadow-xs">
            <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-900 font-serif">No Approvals Found</h3>
            <p className="text-xs text-stone-500 mt-1">
              {mainTab === 'pending'
                ? 'All requests in this category have been processed and cleared.'
                : 'No reviewed requests in this category yet.'}
            </p>
          </div>
        ) : (
          displayedList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs hover:border-stone-300 hover:shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative"
            >
              {/* Left Column: ID, Title, Reason & Devotee Contact */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#681B37] bg-pink-50 border border-pink-100/80 px-2.5 py-0.5 rounded-full inline-block">
                    {item.id}
                  </span>
                  {item.priority === 'Critical' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                      Critical
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-stone-900 font-serif leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed max-w-2xl">
                  {item.reason}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 pt-1">
                  <div className="flex items-center gap-1.5 font-medium text-stone-800">
                    <User className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{item.devoteeName}</span>
                  </div>
                  <span className="text-stone-300 font-light hidden sm:inline">|</span>
                  <div className="flex items-center gap-1.5 font-mono text-stone-500">
                    <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{item.phone}</span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Requested Pass & Scheduled Time */}
              <div className="border-t lg:border-t-0 lg:border-l border-stone-200 pt-3 lg:pt-0 lg:pl-6 xl:pl-8 lg:w-72 xl:w-80 shrink-0 space-y-3">
                <div className="flex items-start gap-2.5">
                  <Crown className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-medium text-stone-400 block leading-tight">
                      Requested Pass
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-stone-900 block mt-0.5 leading-snug">
                      {item.requestedTier}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-medium text-stone-400 block leading-tight">
                      Scheduled Time
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-stone-900 block mt-0.5 leading-snug">
                      {item.timeSlot}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions or Status Badge */}
              <div className="border-t lg:border-t-0 lg:border-l border-stone-200 pt-3 lg:pt-0 lg:pl-6 xl:pl-8 shrink-0 flex items-center justify-end">
                {item.status === 'Pending' ? (
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-5 py-2 rounded-full bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap active:scale-[0.98]"
                    >
                      <Check className="w-3.5 h-3.5 text-[#E2BC6B]" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-4 py-2 rounded-full border border-pink-200 bg-white hover:bg-pink-50 text-[#8B2648] text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-[0.98]"
                    >
                      <X className="w-3.5 h-3.5 text-rose-500" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                      item.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

