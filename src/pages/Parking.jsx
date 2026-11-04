import React, { useState, useMemo } from 'react';
import {
  Car,
  Truck,
  Bike,
  Shield,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  LogOut,
  MapPin,
  X,
  CreditCard,
  FileText
} from 'lucide-react';
import { useTempleOperations } from '../context/TempleOperationsContext';
import OperationsPageHeader from '../components/temple-operations/shared/OperationsPageHeader';
import OperationsMetricCard from '../components/temple-operations/shared/OperationsMetricCard';
import OperationsTabs from '../components/temple-operations/shared/OperationsTabs';

export default function Parking({ isEmbedded = false }) {
  const { parkingAreas, vehicleRecords, recordVehicleEntry, recordVehicleExit } = useTempleOperations();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Parked');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  // New entry form state
  const [entryForm, setEntryForm] = useState({
    vehicleNumber: '',
    vehicleType: 'Car',
    parkingAreaId: 'PKG-02',
  });

  // Derived metrics
  const totalCapacity = useMemo(() => parkingAreas.reduce((acc, p) => acc + p.capacity, 0), [parkingAreas]);
  const currentTotalParked = useMemo(() => parkingAreas.reduce((acc, p) => acc + p.currentOccupancy, 0), [parkingAreas]);
  const availableSlots = totalCapacity - currentTotalParked;
  const overallOccupancyPct = Math.round((currentTotalParked / totalCapacity) * 100);

  const totalFeeCollected = useMemo(() => {
    return vehicleRecords.reduce((acc, v) => acc + (v.feeCollected || 0), 0);
  }, [vehicleRecords]);

  // Filtered vehicle records
  const filteredVehicles = useMemo(() => {
    return vehicleRecords.filter((v) => {
      const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
      const matchSearch =
        v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [vehicleRecords, statusFilter, searchTerm]);

  const handleEntrySubmit = (e) => {
    e.preventDefault();
    if (!entryForm.vehicleNumber) return;
    const area = parkingAreas.find((p) => p.id === entryForm.parkingAreaId);
    recordVehicleEntry({
      vehicleNumber: entryForm.vehicleNumber.toUpperCase().trim(),
      vehicleType: entryForm.vehicleType,
      parkingAreaId: entryForm.parkingAreaId,
      parkingAreaName: area ? area.name : 'Main Lot',
      feeCollected: area ? area.hourlyRate : 30,
    });
    setEntryForm({
      vehicleNumber: '',
      vehicleType: 'Car',
      parkingAreaId: 'PKG-02',
    });
    setIsEntryModalOpen(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', count: parkingAreas.length },
    { id: 'movement', label: 'Vehicle Movement', count: vehicleRecords.filter(v => v.status === 'Parked').length },
    { id: 'tariffs', label: 'Tariffs & Rules' },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header (Hidden when embedded) */}
      {!isEmbedded && (
        <OperationsPageHeader
          title="Parking Management"
          primaryActionLabel="Check In Vehicle"
          onPrimaryAction={() => setIsEntryModalOpen(true)}
          primaryActionIcon={Car}
        />
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <OperationsMetricCard
          label="Total Parking Capacity"
          value={totalCapacity}
          subtext="Across 4 designated compound bays"
          icon={Car}
        />
        <OperationsMetricCard
          label="Vehicles Parked"
          value={currentTotalParked}
          subtext={`${overallOccupancyPct}% compound occupancy`}
          icon={Clock}
        />
        <OperationsMetricCard
          label="Available Vacant Slots"
          value={availableSlots}
          subtext="Across four-wheelers & two-wheelers"
          icon={CheckCircle}
        />
        <OperationsMetricCard
          label="Today's Parking Toll"
          value={`₹${totalFeeCollected.toLocaleString('en-IN')}`}
          subtext="Computerized entry tokens & FASTag toll"
          icon={CreditCard}
        />
      </div>

      {/* Navigation Tabs */}
      <OperationsTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* TAB 1: OVERVIEW & CAPACITY GAUGES */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parkingAreas.map((area) => {
            const pct = Math.round((area.currentOccupancy / area.capacity) * 100);
            const isHigh = pct >= 80;
            return (
              <div
                key={area.id}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between hover:border-[#55132D]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {area.id}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isHigh
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {pct}% Filled
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-800 mb-0.5">{area.name}</h4>
                  <p className="text-xs text-stone-500 mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#55132D]" /> {area.zone}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs font-medium text-stone-700">
                      <span>Occupied: {area.currentOccupancy} vehicles</span>
                      <span>Max: {area.capacity} slots</span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-150 grid grid-cols-2 gap-2 text-[11px] text-stone-600 mb-2">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Permitted Class:</span>
                      <span className="font-semibold text-stone-800">{area.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Fixed Tariff:</span>
                      <span className="font-bold text-stone-900 font-mono">
                        {area.hourlyRate === 0 ? 'Exempt / Official' : `₹${area.hourlyRate} / entry`}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-400 block text-[10px]">Zone Supervisor:</span>
                      <span className="font-medium text-stone-700">{area.supervisor}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-150 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-500">
                    Remaining: <strong className="text-stone-800">{area.capacity - area.currentOccupancy} bays</strong>
                  </span>
                  <button
                    onClick={() => {
                      setEntryForm({ ...entryForm, parkingAreaId: area.id });
                      setIsEntryModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-[#55132D] hover:bg-[#681B37] text-white text-[10px] font-semibold rounded"
                  >
                    Quick Check-In
                  </button>
                </div>
              </div>
            );
          })}
          </div>

          {/* National Highway (NH-8) Traffic Coordination */}
          <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-subtle space-y-3">
            <div>
              <h3 className="section-heading">National Highway (NH-8) Traffic Coordination</h3>
              <p className="supporting-text">
                Coordination desk between temple marshals and Udaipur Sub-Division Traffic Police
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs pt-1">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Agartala Approach (North)</span>
                <p className="font-bold text-stone-900 mt-1">Normal Vehicular Speed</p>
                <p className="supporting-text mt-0.5">No congestion reported at Kakraban bypass intersection.</p>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">Sabroom Approach (South)</span>
                <p className="font-bold text-stone-900 mt-1">Pilgrim Tourist Convoys Inflow</p>
                <p className="supporting-text mt-0.5">Buses diverted toward Lot A terminal seamlessly.</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wide">Secondary Overflow Field</span>
                <p className="font-bold text-stone-900 mt-1">Standby Mode (Dry & Ready)</p>
                <p className="supporting-text mt-0.5">Available for Diwali Mela high density rush.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VEHICLE MOVEMENT LOG */}
      {activeTab === 'movement' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          {/* Controls */}
          <div className="p-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search vehicle number or token..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-[#55132D] w-60"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#55132D]"
              >
                <option value="ALL">All Records</option>
                <option value="Parked">Currently Parked</option>
                <option value="Departed">Departed Vehicles</option>
              </select>
            </div>

            <div className="text-xs text-stone-500 font-medium">
              Showing {filteredVehicles.length} vehicle movements
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Token Ref</th>
                  <th className="py-3 px-4">Vehicle Plate No.</th>
                  <th className="py-3 px-4">Vehicle Type</th>
                  <th className="py-3 px-4">Assigned Lot</th>
                  <th className="py-3 px-4">Entry Timestamp</th>
                  <th className="py-3 px-4">Exit Timestamp</th>
                  <th className="py-3 px-4">Fee Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredVehicles.map((v) => {
                  const isParked = v.status === 'Parked';
                  return (
                    <tr key={v.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{v.tokenNumber}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-stone-800 bg-stone-50/50">
                        {v.vehicleNumber}
                      </td>
                      <td className="py-3 px-4 text-stone-600">{v.vehicleType}</td>
                      <td className="py-3 px-4 text-stone-700">{v.parkingAreaName}</td>
                      <td className="py-3 px-4 text-stone-600 text-[11px]">{v.entryTime}</td>
                      <td className="py-3 px-4 text-stone-500 text-[11px]">
                        {v.exitTime || <span className="text-stone-400 italic">Still inside</span>}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-stone-800">
                        ₹{v.feeCollected || 0}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isParked
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isParked ? 'bg-blue-500' : 'bg-stone-400'
                            }`}
                          />
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isParked ? (
                          <button
                            onClick={() => recordVehicleExit(v.id)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-semibold rounded flex items-center gap-1 ml-auto"
                          >
                            <LogOut className="w-3 h-3" /> Record Exit
                          </button>
                        ) : (
                          <span className="text-[10px] text-stone-400 font-medium">Checked Out</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TARIFFS & RULES */}
      {activeTab === 'tariffs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
            <h3 className="text-sm font-bold text-stone-800 mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#55132D]" />
              Official Parking Toll Schedule
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Approved by Mata Tripura Sundari Temple Management Trust. All parking slips are computer-generated.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-150 flex items-center justify-between">
                <div>
                  <p className="font-bold text-stone-800">Two-Wheelers (Bikes & Scooters)</p>
                  <p className="text-[11px] text-stone-500">Designated Lot C (East Lake Road Shed)</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-bold text-[#55132D]">₹10</span>
                  <span className="text-[10px] text-stone-500 block">per 4 hours</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-150 flex items-center justify-between">
                <div>
                  <p className="font-bold text-stone-800">Four-Wheelers (Cars & SUVs)</p>
                  <p className="text-[11px] text-stone-500">Designated Lot B (West Main Gate)</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-bold text-[#55132D]">₹30</span>
                  <span className="text-[10px] text-stone-500 block">per 4 hours</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-150 flex items-center justify-between">
                <div>
                  <p className="font-bold text-stone-800">Tourist Buses & Maxi Cabs</p>
                  <p className="text-[11px] text-stone-500">Designated Lot A (North Highway Terminal)</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-bold text-[#55132D]">₹50</span>
                  <span className="text-[10px] text-stone-500 block">per 6 hours</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
            <h3 className="text-sm font-bold text-stone-800 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Emergency & VIP Protocol Regulations
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Clear passage requirements for security, medical evacuation and temple administrative convoys.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-150">
                <p className="font-semibold text-stone-800 mb-0.5">Ambulance & Fire Corridor</p>
                <p className="text-[11px] text-stone-600">
                  The 6-meter lane connecting West Gate to the inner courtyard must remain clear of all parked vehicles at all times.
                </p>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-150">
                <p className="font-semibold text-stone-800 mb-0.5">Lot D Protocol Access</p>
                <p className="text-[11px] text-stone-600">
                  Restricted to District Magistrate, Superintendent of Police, Temple Trust Board members, and state guests.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* MODAL: CHECK IN VEHICLE */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Check In Vehicle</h3>
                <p className="text-xs text-stone-500">Issue computerized temple parking slip.</p>
              </div>
              <button
                onClick={() => setIsEntryModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEntrySubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Vehicle License Plate Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TR-01-AX-9921"
                  value={entryForm.vehicleNumber}
                  onChange={(e) => setEntryForm({ ...entryForm, vehicleNumber: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 font-mono text-xs uppercase focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Vehicle Category</label>
                  <select
                    value={entryForm.vehicleType}
                    onChange={(e) => setEntryForm({ ...entryForm, vehicleType: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="Car">Car / SUV</option>
                    <option value="Two-Wheeler">Two-Wheeler</option>
                    <option value="Bus">Bus / Minibus</option>
                    <option value="Official">Official / VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Assigned Lot</label>
                  <select
                    value={entryForm.parkingAreaId}
                    onChange={(e) => setEntryForm({ ...entryForm, parkingAreaId: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    {parkingAreas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white font-semibold rounded-lg shadow-sm"
                >
                  Issue Token & Admit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

