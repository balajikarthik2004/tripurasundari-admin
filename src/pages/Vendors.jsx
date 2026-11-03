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
  Sliders
} from 'lucide-react';
import { useTempleOperations } from '../context/TempleOperationsContext';
import OperationsPageHeader from '../components/temple-operations/shared/OperationsPageHeader';
import OperationsMetricCard from '../components/temple-operations/shared/OperationsMetricCard';
import OperationsTabs from '../components/temple-operations/shared/OperationsTabs';

export default function Vendors() {
  const { vendors, addVendor, stalls, allocateStall, updateStallStatus } = useTempleOperations();

  const [activeTab, setActiveTab] = useState('stalls');
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

  const tabs = [
    { id: 'stalls', label: 'Stalls & Premises Units', count: stalls.length },
    { id: 'vendors', label: 'Authorized Vendor Directory', count: vendors.length },
    { id: 'allocations', label: 'Lease & Allotment Register' },
    { id: 'compliance', label: 'Safety & FSSAI Standards' },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <OperationsPageHeader
        title="Vendors & Stalls Management"
        subtitle="Licensing, stall allotments, lease registry and food hygiene compliance for temple perimeter merchants."
        primaryActionLabel="Register New Vendor"
        onPrimaryAction={() => setIsAddVendorOpen(true)}
        primaryActionIcon={Plus}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
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

      {/* TAB 1: STALLS GRID */}
      {activeTab === 'stalls' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {stalls.map((stall) => {
              const isAllocated = stall.allocationStatus === 'Allocated';
              return (
                <div
                  key={stall.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between hover:border-[#55132D]/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        {stall.number}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isAllocated
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {stall.allocationStatus}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-800 mb-1">{stall.category}</h4>
                    <p className="text-[11px] text-stone-500 mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#55132D]" /> {stall.zone}
                    </p>

                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-150 space-y-1 text-[11px] mb-3">
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
                      <div className="p-2 bg-emerald-50/60 rounded border border-emerald-150 text-[11px] mb-2">
                        <span className="text-[10px] text-emerald-800 block uppercase font-semibold">Leased to:</span>
                        <p className="font-bold text-emerald-950 truncate">{stall.vendorName}</p>
                      </div>
                    ) : (
                      <div className="p-2 bg-stone-50 rounded border border-dashed border-stone-300 text-[11px] text-stone-500 text-center mb-2 italic">
                        Available for allocation
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-150 flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        updateStallStatus(
                          stall.id,
                          stall.operationalStatus === 'Operational' ? 'Under Maintenance' : 'Operational'
                        )
                      }
                      className="text-[10px] text-stone-600 hover:text-stone-900 font-medium"
                    >
                      {stall.operationalStatus === 'Operational' ? 'Mark Maint.' : 'Mark Active'}
                    </button>

                    {!isAllocated ? (
                      <button
                        onClick={() => {
                          setSelectedStallForAllocation(stall);
                          setIsAllocateModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-[#55132D] hover:bg-[#6B1939] text-white text-[10px] font-semibold rounded transition-colors"
                      >
                        Allot Stall
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Allotted
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: VENDOR DIRECTORY */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search vendor or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-[#55132D] w-60"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#55132D]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'ALL' ? 'All Trade Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-stone-500 font-medium">
              Showing {filteredVendors.length} of {vendors.length} merchants
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Vendor ID</th>
                  <th className="py-3 px-4">Establishment Name</th>
                  <th className="py-3 px-4">Proprietor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Assigned Unit</th>
                  <th className="py-3 px-4">License / FSSAI</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-stone-900">{v.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-900">{v.name}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-xs">{v.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-800">{v.contactPerson}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
                        <Phone className="w-2.5 h-2.5 text-stone-400" /> +91 {v.mobile}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {v.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {v.assignedStallName || (
                        <span className="text-amber-600 font-sans italic">Not Allotted</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-600">{v.licenseRef}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          v.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedVendorForDetails(v)}
                        className="text-[11px] text-[#55132D] hover:underline font-bold"
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
      )}

      {/* TAB 3: LEASE REGISTER */}
      {activeTab === 'allocations' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200">
            <h3 className="text-sm font-bold text-stone-800">Temple Trust Commercial Lease Register</h3>
            <p className="text-xs text-stone-500">
              Contractual rent schedule, billing cycles and trust revenue tracking.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Stall No.</th>
                  <th className="py-3 px-4">Premises Zone</th>
                  <th className="py-3 px-4">Tenant / Merchant</th>
                  <th className="py-3 px-4">Trade Line</th>
                  <th className="py-3 px-4">Monthly Rate</th>
                  <th className="py-3 px-4">Billing Cycle</th>
                  <th className="py-3 px-4">Renewal Due</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {stalls.filter(s => s.allocationStatus === 'Allocated').map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{s.number}</td>
                    <td className="py-3 px-4 text-stone-700">{s.zone}</td>
                    <td className="py-3 px-4 font-medium text-stone-900">{s.vendorName}</td>
                    <td className="py-3 px-4 text-stone-600">{s.category}</td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">₹{s.monthlyFee?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-stone-600">1st of Month</td>
                    <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">31 Dec 2026</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Up-to-Date
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLIANCE */}
      {activeTab === 'compliance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
            <h3 className="text-sm font-bold text-stone-800 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Food Safety & Hygiene Regulations (FSSAI)
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              All sweets (Peda) and cooked food stalls in temple vicinity must adhere to the Food Safety and Standards Authority of India directives.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-150 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-stone-800">Pure Cow Milk Peda Quality Testing</p>
                  <p className="text-[11px] text-stone-500">Weekly random sampling by district health officer</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  PASSED (28 Oct)
                </span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-150 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-stone-800">Potable Water Compliance at Stalls</p>
                  <p className="text-[11px] text-stone-500">Reverse Osmosis (RO) filtration certification</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  VERIFIED
                </span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-150 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-stone-800">Plastic Ban Strict Enforcement</p>
                  <p className="text-[11px] text-stone-500">Only biodegradable sal-leaf / paper containers permitted</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  100% ADHERED
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
            <h3 className="text-sm font-bold text-stone-800 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#55132D]" />
              Kalyan Sagar Ecological Guidelines
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Special vendor guidelines protecting the holy lake, sacred aquatic life and endangered Bostami turtles (Nigricans).
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-150">
                <p className="font-semibold text-stone-800 mb-0.5">Approved Turtle Feed Pellets Only</p>
                <p className="text-[11px] text-stone-600">
                  Stalls around Ghat steps are strictly prohibited from selling harmful fried snacks or unapproved grains. Only Fisheries-certified puffed rice and vitamin pellets are permitted.
                </p>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-150">
                <p className="font-semibold text-stone-800 mb-0.5">Zero Waste Discharge Zone</p>
                <p className="text-[11px] text-stone-600">
                  Dedicated segregated waste disposal bins deployed at every 10 meters along the Ghat steps. Daily inspection at 07:00 AM and 07:00 PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER VENDOR */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Register Merchant / Vendor</h3>
                <p className="text-xs text-stone-500">Add an authorized stall licensee to the temple database.</p>
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
                  <label className="block font-semibold text-stone-700 mb-1">Proprietor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shri Bikash Roy"
                    value={vendorForm.contactPerson}
                    onChange={(e) => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mobile Contact *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10 digit mobile"
                    value={vendorForm.mobile}
                    onChange={(e) => setVendorForm({ ...vendorForm, mobile: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Trade Category</label>
                  <select
                    value={vendorForm.category}
                    onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="Traditional Sweets & Peda">Traditional Sweets & Peda</option>
                    <option value="Pooja Items">Pooja Items & Garlands</option>
                    <option value="Souvenirs & Crafts">Souvenirs & Crafts</option>
                    <option value="Food & Refreshments">Food & Refreshments</option>
                    <option value="Publications">Publications & Photos</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Trade License / FSSAI Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. FSSAI-TR-102948"
                    value={vendorForm.licenseRef}
                    onChange={(e) => setVendorForm({ ...vendorForm, licenseRef: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Merchandise Description</label>
                <textarea
                  rows={2}
                  placeholder="Items permitted to sell, raw material source..."
                  value={vendorForm.description}
                  onChange={(e) => setVendorForm({ ...vendorForm, description: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVendorOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white font-semibold rounded-lg shadow-sm"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ALLOCATE STALL */}
      {isAllocateModalOpen && selectedStallForAllocation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Allot Commercial Stall</h3>
                <p className="text-xs text-stone-500">
                  Assign {selectedStallForAllocation.number} ({selectedStallForAllocation.zone})
                </p>
              </div>
              <button
                onClick={() => setIsAllocateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAllocation} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Select Registered Vendor *</label>
                <select
                  required
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                >
                  <option value="">-- Choose Vendor --</option>
                  {vendors
                    .filter((v) => !v.assignedStallId)
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.contactPerson}) - {v.category}
                      </option>
                    ))}
                </select>
                {vendors.filter((v) => !v.assignedStallId).length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    All existing vendors currently have stalls allocated. You can register a new vendor first.
                  </p>
                )}
              </div>

              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1">
                <p className="text-[11px] text-stone-600">
                  Monthly Rent: <span className="font-bold text-stone-800">₹{selectedStallForAllocation.monthlyFee}</span>
                </p>
                <p className="text-[11px] text-stone-600">
                  Dimensions: <span className="font-bold text-stone-800">{selectedStallForAllocation.dimensions}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedVendorId}
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] disabled:bg-stone-300 text-white font-semibold rounded-lg shadow-sm"
                >
                  Confirm Allotment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VENDOR DETAILS INSPECTION */}
      {selectedVendorForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="bg-[#1A0610] p-4 text-white flex items-center justify-between border-b border-[#B68A36]/30">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#E2BC6B]" />
                <div>
                  <h3 className="font-serif font-bold text-sm">{selectedVendorForDetails.name}</h3>
                  <p className="text-[10px] text-[#E2BC6B]">{selectedVendorForDetails.id} • {selectedVendorForDetails.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVendorForDetails(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-stone-700">
              <div className="grid grid-cols-2 gap-2.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Proprietor</span>
                  <span className="font-bold text-stone-900">{selectedVendorForDetails.contactPerson}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Phone</span>
                  <span className="font-mono text-stone-900">+91 {selectedVendorForDetails.mobile}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">FSSAI / License</span>
                  <span className="font-mono text-stone-900">{selectedVendorForDetails.licenseRef || 'Verified Trust Permit'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Assigned Unit</span>
                  <span className="font-bold text-[#55132D]">{selectedVendorForDetails.assignedStallName || 'Not Allotted'}</span>
                </div>
              </div>

              {selectedVendorForDetails.description && (
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block mb-0.5">Approved Merchandise</span>
                  <p className="text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200 leading-relaxed">
                    {selectedVendorForDetails.description}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedVendorForDetails(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

