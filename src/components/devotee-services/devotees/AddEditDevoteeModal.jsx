import React, { useState, useEffect } from 'react';
import { X, User, Save } from 'lucide-react';
import { useDevoteeServices } from '../../../context/DevoteeServicesContext';

export default function AddEditDevoteeModal({ isOpen, onClose, editingDevotee = null }) {
  const { addDevotee, updateDevotee } = useDevoteeServices();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    city: 'Agartala',
    state: 'Tripura',
    address: '',
    idType: 'Aadhaar Card',
    idNumber: '',
    segment: 'Registered Devotee',
    status: 'Active',
    preferredLanguage: 'Bengali',
    notes: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingDevotee) {
      setFormData({
        name: editingDevotee.name || '',
        mobile: editingDevotee.mobile || '',
        email: editingDevotee.email || '',
        city: editingDevotee.city || 'Agartala',
        state: editingDevotee.state || 'Tripura',
        address: editingDevotee.address || '',
        idType: editingDevotee.idType || 'Aadhaar Card',
        idNumber: editingDevotee.idNumber || '',
        segment: editingDevotee.segment || 'Registered Devotee',
        status: editingDevotee.status || 'Active',
        preferredLanguage: editingDevotee.preferredLanguage || 'Bengali',
        notes: editingDevotee.notes || '',
      });
    } else {
      setFormData({
        name: '',
        mobile: '',
        email: '',
        city: 'Agartala',
        state: 'Tripura',
        address: '',
        idType: 'Aadhaar Card',
        idNumber: '',
        segment: 'New Devotee',
        status: 'Active',
        preferredLanguage: 'Bengali',
        notes: '',
      });
    }
    setErrorMsg('');
  }, [editingDevotee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (editingDevotee) {
      updateDevotee(editingDevotee.id, formData);
    } else {
      addDevotee(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B68A36]/20 border border-[#B68A36]/40 flex items-center justify-center text-[#E2BC6B]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-white">
                {editingDevotee ? 'Edit Devotee Profile' : 'Register New Devotee'}
              </h2>
              <p className="text-[11px] text-[#E2BC6B]/90">Official devotee identification & directory entry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-800">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Devotee name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Mobile Number (10 digits) <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                maxLength={10}
                required
                placeholder="9876543210"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="devotee@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">City</label>
              <input
                type="text"
                placeholder="e.g. Udaipur / Agartala"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">State</label>
              <input
                type="text"
                placeholder="Tripura / Assam / WB"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Segment</label>
              <select
                value={formData.segment}
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="New Devotee">New Devotee</option>
                <option value="Registered Devotee">Registered Devotee</option>
                <option value="Repeat Visitor">Repeat Visitor</option>
                <option value="Local Devotee">Local Devotee</option>
                <option value="Patron Donor">Patron Donor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">ID Proof Type</label>
              <select
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">ID Number (Masked / Partial)</label>
              <input
                type="text"
                placeholder="•••• •••• 1234"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Address / Landmark</label>
            <input
              type="text"
              placeholder="Residential address..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Administrative Notes</label>
            <input
              type="text"
              placeholder="e.g. Senior citizen; festival volunteer"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>
        </form>

        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{editingDevotee ? 'Update Profile' : 'Save Devotee'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

