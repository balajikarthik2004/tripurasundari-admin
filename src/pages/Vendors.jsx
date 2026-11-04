import React, { useState, useMemo } from 'react';
import {
  Store,
  Users,
  Building,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  DollarSign,
  ShieldAlert,
  FileText,
  Phone,
  Tag,
  MapPin,
  X,
  ExternalLink,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { useTempleOperations } from '../context/TempleOperationsContext';
import OperationsPageHeader from '../components/temple-operations/shared/OperationsPageHeader';
import OperationsMetricCard from '../components/temple-operations/shared/OperationsMetricCard';
import OperationsTabs from '../components/temple-operations/shared/OperationsTabs';

export default function Vendors({ isEmbedded = false }) {
  const { vendors, addVendor, stalls, allocateStall, updateStallStatus } = useTempleOperations();

  const [activeTab, setActiveTab] = useState('overview');
  const [subView, setSubView] = useState('stalls'); // 'stalls' or 'vendors'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedStallForAllocation, setSelectedStallForAllocation] = useState(null);
  const [selectedVendorForDetails, setSelectedVendorForDetails] = useState(null);

  // New vendor form state
  const [vendorForm, setVendorForm] = useState({
    name: '',
    contactPerson: '',
    mobile: '',
    category: 'Traditional Sweets & Peda',
    description: '',
    licenseRef: '',
  });

  // Allocation form state
  const [selectedVendorId, setSelectedVendorId] = useState('');

  // Metrics
  const totalVendors = vendors.length;
  const allocatedStallsCount = useMemo(() => stalls.filter((s) => s.allocationStatus === 'Allocated').length, [stalls]);
  const totalMonthlyLease = useMemo(
    () => stalls.filter((s) => s.allocationStatus === 'Allocated').reduce((acc, s) => acc + (s.monthlyFee || 0), 0),
    [stalls]
  );
  const availableStalls = useMemo(() => stalls.filter((s) => s.allocationStatus === 'Available'), [stalls]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(vendors.map((v) => v.category));
    return ['ALL', ...Array.from(set)];
  }, [vendors]);

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchCat = selectedCategory === 'ALL' || v.category === selectedCategory;
      const matchSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [vendors, selectedCategory, searchTerm]);

  const handleCreateVendor = (e) => {
    e.preventDefault();
    if (!vendorForm.name || !vendorForm.contactPerson) return;
    addVendor(vendorForm);
    setVendorForm({
      name: '',
      contactPerson: '',
      mobile: '',
      category: 'Traditional Sweets & Peda',
      description: '',
      licenseRef: '',
    });
    setIsAddVendorOpen(false);
  };

  const handleConfirmAllocation = (e) => {
    e.preventDefault();
    if (!selectedStallForAllocation || !selectedVendorId) return;
    const vendor = vendors.find((v) => v.id === selectedVendorId);
    if (vendor) {
      allocateStall(selectedStallForAllocation.id, vendor.id, vendor.name);
    }
    setIsAllocateModalOpen(false);
    setSelectedStallForAllocation(null);
    setSelectedVendorId('');
  };

  // Strictly 3 primary tabs as required
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'stalls-vendors', label: 'Vendors & Stalls' },
    { id: 'lease-compliance', label: 'Lease & Compliance' },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header (Hidden when embedded) */}
      {!isEmbedded && (
        <OperationsPageHeader
          title="Vendors & Stalls Management"
          primaryActionLabel="Register New Vendor"
          onPrimaryAction={() => setIsAddVendorOpen(true)}
          primaryActionIcon={Plus}
        />
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <OperationsMetricCard
          label="Registered Merchants"
          value={totalVendors}
          subtext="Approved temple vendors"
          icon={Users}
        />
        <OperationsMetricCard
          label="Stall Occupancy"
          value={`${allocatedStallsCount} / ${stalls.length}`}
          subtext={`${availableStalls.length} stalls vacant & available`}
          icon={Store}
        />
        <OperationsMetricCard
          label="Monthly Lease Inflow"
          value={`₹${totalMonthlyLease.toLocaleString('en-IN')}`}
          subtext="Configured trust lease rate"
          icon={DollarSign}
        />
        <OperationsMetricCard
          label="Hygiene & Safety"
          value="100%"
          subtext="FSSAI & local permits verified"
          icon={CheckCircle}
        />
      </div>

      {/* Tabs */}
      <OperationsTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* ========================================================
          TAB 1: OVERVIEW
         ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Zone Occupancy & Commercial Health */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-stone-200/90 shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="section-heading">Premises Zone Commercial Distribution</h3>
                  <p className="supporting-text">Allocation status across outer parikrama and lake ghat areas</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-stone-100 text-stone-700">
                  {stalls.length} Total Units
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">North Approach</span>
                    <span className="text-emerald-700 font-bold">100% Full</span>
                  </div>
                  <div className="text-xl font-bold font-serif text-stone-900">4 / 4 Units</div>
                  <p className="supporting-text">Peda, Sweets & Souvenirs</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">South Parikrama</span>
                    <span className="text-amber-700 font-bold">75% Full</span>
                  </div>
                  <div className="text-xl font-bold font-serif text-stone-900">3 / 4 Units</div>
                  <p className="supporting-text">Puja Samagri & Flowers</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">Kalyan Sagar Ghat</span>
                    <span className="text-blue-700 font-bold">Ecological Zone</span>
                  </div>
                  <div className="text-xl font-bold font-serif text-stone-900">2 / 2 Units</div>
                  <p className="supporting-text">Turtle Feed & Pradakshina</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-600">
                  Vacant stalls requiring allotment: <strong className="text-[#55132D]">{availableStalls.length} unit(s)</strong>
                </span>
                <button
                  onClick={() => {
                    setActiveTab('stalls-vendors');
                    setSubView('stalls');
                  }}
                  className="text-xs font-semibold text-[#55132D] hover:underline"
                >
                  View All Stalls →
                </button>
              </div>
            </div>

            {/* Right Col: Quick Merchant Spotlight */}
            <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-subtle flex flex-col justify-between">
              <div>
                <h4 className="section-heading mb-1">Top Temple Vendors</h4>
                <p className="supporting-text mb-4">Highest compliance & lease reliability</p>

                <div className="space-y-3">
                  {vendors.slice(0, 3).map((v) => (
                    <div key={v.id} className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-xs">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-stone-900">{v.name}</span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                      </div>
                      <div className="supporting-text">{v.category} • {v.contactPerson}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('stalls-vendors');
                  setSubView('vendors');
                }}
                className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-[#55132D] hover:underline block text-center"
              >
                Browse Full Directory ({vendors.length}) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: VENDORS & STALLS
         ======================================================== */}
      {activeTab === 'stalls-vendors' && (
        <div className="space-y-4">
          {/* Sub-view Segmented Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 rounded-xl border border-stone-200/90 shadow-subtle">
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
              <button
                onClick={() => setSubView('stalls')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  subView === 'stalls'
                    ? 'bg-white text-[#55132D] shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Stalls & Premises Units ({stalls.length})
              </button>
              <button
                onClick={() => setSubView('vendors')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  subView === 'vendors'
                    ? 'bg-white text-[#55132D] shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Authorized Vendor Directory ({vendors.length})
              </button>
            </div>

            {subView === 'vendors' && (
              <button
                onClick={() => setIsAddVendorOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Register Vendor</span>
              </button>
            )}
          </div>

          {/* Sub-view A: Stalls Grid */}
          {subView === 'stalls' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stalls.map((stall) => {
                const isAllocated = stall.allocationStatus === 'Allocated';
                return (
                  <div
                    key={stall.id}
                    className="bg-white rounded-xl border border-stone-200/90 p-4 shadow-subtle flex flex-col justify-between hover:border-[#55132D]/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                          {stall.number}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isAllocated
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {stall.allocationStatus}
                        </span>
                      </div>

                      <h4 className="card-heading mb-1">{stall.category}</h4>
                      <p className="supporting-text mb-3 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#55132D]" /> {stall.zone}
                      </p>

                      <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100 space-y-1 text-xs mb-3">
                        <div className="flex justify-between text-stone-600">
                          <span>Dimensions:</span>
                          <span className="font-medium text-stone-800">{stall.dimensions}</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>Monthly Rent:</span>
                          <span className="font-bold text-stone-900 font-mono">₹{stall.monthlyFee?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>Status:</span>
                          <span className="font-medium text-stone-800">{stall.operationalStatus}</span>
                        </div>
                      </div>

                      {isAllocated ? (
                        <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs">
                          <p className="text-[11px] text-stone-500">Allocated Merchant:</p>
                          <p className="font-bold text-stone-900 truncate">{stall.vendorName}</p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 text-xs text-amber-800">
                          Ready for commercial lease allocation.
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      {isAllocated ? (
                        <button
                          onClick={() => updateStallStatus(stall.id, 'Available')}
                          className="text-[11px] font-semibold text-rose-700 hover:text-rose-900"
                        >
                          Revoke Lease
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedStallForAllocation(stall);
                            setIsAllocateModalOpen(true);
                          }}
                          className="w-full py-1.5 text-xs font-semibold bg-[#55132D] text-white rounded-lg hover:bg-[#681B37] text-center"
                        >
                          Allocate Stall
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sub-view B: Vendors Directory */}
          {subView === 'vendors' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-3.5 border border-stone-200/90 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search vendors by name, owner, license..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c === 'ALL' ? 'All Trade Categories' : c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200/90 shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">Merchant Name</th>
                        <th className="py-3 px-4">Trade Category</th>
                        <th className="py-3 px-4">Contact Person</th>
                        <th className="py-3 px-4">License Ref</th>
                        <th className="py-3 px-4">Compliance</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredVendors.map((v) => (
                        <tr key={v.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-stone-900 block">{v.name}</span>
                            <span className="supporting-text">{v.description || 'Authorized vendor'}</span>
                          </td>
                          <td className="py-3 px-4 text-stone-700">{v.category}</td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-stone-900 block">{v.contactPerson}</span>
                            <span className="supporting-text">{v.mobile}</span>
                          </td>
                          <td className="py-3 px-4 font-mono text-stone-600">{v.licenseRef || v.id}</td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Verified
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedVendorForDetails(v)}
                              className="px-2.5 py-1 text-xs font-semibold text-[#55132D] hover:bg-[#55132D]/10 rounded-md transition-colors"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: LEASE & COMPLIANCE
         ======================================================== */}
      {activeTab === 'lease-compliance' && (
        <div className="space-y-6">
          {/* Commercial Lease Register */}
          <div className="bg-white rounded-xl border border-stone-200/90 shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="section-heading">Temple Trust Commercial Lease Register</h3>
                <p className="supporting-text">Contractual rent schedule, billing cycles and trust revenue tracking</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 uppercase font-semibold text-[11px] border-b border-stone-200">
                    <th className="py-3 px-4">Stall No.</th>
                    <th className="py-3 px-4">Premises Zone</th>
                    <th className="py-3 px-4">Tenant / Merchant</th>
                    <th className="py-3 px-4">Monthly Rate</th>
                    <th className="py-3 px-4">Billing Cycle</th>
                    <th className="py-3 px-4">Renewal Due</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {stalls.filter((s) => s.allocationStatus === 'Allocated').map((s) => (
                    <tr key={s.id} className="hover:bg-stone-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{s.number}</td>
                      <td className="py-3 px-4 text-stone-700">{s.zone}</td>
                      <td className="py-3 px-4 font-medium text-stone-900">{s.vendorName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">₹{s.monthlyFee?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-stone-600">1st of Month</td>
                      <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">31 Dec 2026</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Up-to-Date
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Safety & Ecological Compliance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-subtle space-y-4">
              <h3 className="section-heading flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Food Safety & Hygiene Regulations (FSSAI)
              </h3>
              <p className="supporting-text">
                All sweets (Peda) and food stalls adhere to Food Safety and Standards Authority of India directives.
              </p>

              <div className="space-y-2.5 text-xs pt-1">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-stone-800">Pure Cow Milk Peda Quality Testing</p>
                    <p className="supporting-text">Weekly random sampling by district health officer</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    PASSED (28 Oct)
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-stone-800">Potable Water Compliance at Stalls</p>
                    <p className="supporting-text">Reverse Osmosis (RO) filtration certification</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    VERIFIED
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-stone-800">Plastic Ban Strict Enforcement</p>
                    <p className="supporting-text">Only biodegradable sal-leaf / paper containers permitted</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    100% ADHERED
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-subtle space-y-4">
              <h3 className="section-heading flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#55132D]" />
                Kalyan Sagar Ecological Guidelines
              </h3>
              <p className="supporting-text">
                Special perimeter guidelines protecting the sacred lake and endangered Bostami turtles (Nigricans).
              </p>

              <div className="space-y-2.5 text-xs pt-1">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <p className="font-semibold text-stone-800 mb-0.5">Approved Turtle Feed Pellets Only</p>
                  <p className="supporting-text">
                    Stalls around Ghat steps are strictly prohibited from selling unapproved grains. Only certified puffed rice and vitamin pellets are permitted.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <p className="font-semibold text-stone-800 mb-0.5">Zero Waste Discharge Zone</p>
                  <p className="supporting-text">
                    Dedicated segregated waste disposal bins deployed at every 10 meters along Ghat steps. Monitored twice daily.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register Vendor */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="card-heading">Register Merchant / Vendor</h3>
                <p className="supporting-text">Add an authorized stall licensee to the temple database.</p>
              </div>
              <button
                onClick={() => setIsAddVendorOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Establishment / Stall Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Udaipur Peda Bhandar"
                  value={vendorForm.name}
                  onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sri Subhash Das"
                    value={vendorForm.contactPerson}
                    onChange={(e) => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98623 XXXXX"
                    value={vendorForm.mobile}
                    onChange={(e) => setVendorForm({ ...vendorForm, mobile: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Trade Category</label>
                <select
                  value={vendorForm.category}
                  onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                >
                  <option value="Traditional Sweets & Peda">Traditional Sweets & Peda</option>
                  <option value="Sacred Flowers & Garlands">Sacred Flowers & Garlands</option>
                  <option value="Puja Samagri & Havan Items">Puja Samagri & Havan Items</option>
                  <option value="Religious Souvenirs & Books">Religious Souvenirs & Books</option>
                  <option value="Approved Turtle Feed">Approved Turtle Feed</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVendorOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] text-white rounded-lg hover:bg-[#681B37] text-xs font-semibold"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Allocate Stall */}
      {isAllocateModalOpen && selectedStallForAllocation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="card-heading">Allocate Stall {selectedStallForAllocation.number}</h3>
                <p className="supporting-text">{selectedStallForAllocation.zone} • {selectedStallForAllocation.category}</p>
              </div>
              <button
                onClick={() => setIsAllocateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAllocation} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Select Licensed Merchant</label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  required
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                >
                  <option value="">-- Choose Vendor --</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.contactPerson}) - {v.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Monthly Rate:</span>
                  <span className="font-bold text-stone-900">₹{selectedStallForAllocation.monthlyFee?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Dimensions:</span>
                  <span>{selectedStallForAllocation.dimensions}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedVendorId}
                  className="px-4 py-2 bg-[#55132D] text-white rounded-lg hover:bg-[#681B37] text-xs font-semibold disabled:opacity-50"
                >
                  Confirm Allotment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Vendor Details Drawer */}
      {selectedVendorForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="card-heading">{selectedVendorForDetails.name}</h3>
                <p className="supporting-text">{selectedVendorForDetails.id}</p>
              </div>
              <button
                onClick={() => setSelectedVendorForDetails(null)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Contact Person:</span>
                <span className="font-medium text-stone-900">{selectedVendorForDetails.contactPerson}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Mobile Phone:</span>
                <span className="font-mono text-stone-900">{selectedVendorForDetails.mobile}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Trade Category:</span>
                <span className="font-medium text-stone-900">{selectedVendorForDetails.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">License Reference:</span>
                <span className="font-mono text-stone-900">{selectedVendorForDetails.licenseRef || 'LIC-2026-MATABARI'}</span>
              </div>
              <div className="pt-2">
                <span className="text-stone-500 block mb-1">Establishment Profile:</span>
                <p className="text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  {selectedVendorForDetails.description || 'Authorized vendor operating under Tripura Sundari Temple Board commercial licensing.'}
                </p>
              </div>
            </div>

            <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedVendorForDetails(null)}
                className="px-4 py-2 bg-[#55132D] text-white rounded-lg hover:bg-[#681B37] text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
