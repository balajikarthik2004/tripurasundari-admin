import React, { useState } from 'react';
import { X, Radio, Send } from 'lucide-react';
import { useTempleOperations } from '../../../context/TempleOperationsContext';

export default function BroadcastModal({ isOpen, onClose }) {
  const { showToast } = useTempleOperations();

  const [message, setMessage] = useState('All volunteers report to East Gate queue line A for crowd bifurcation.');
  const [recipientGroup, setRecipientGroup] = useState('All Active Personnel');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    showToast(`Operational message broadcasted to ${recipientGroup}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-[#55132D] text-white flex items-center justify-between border-b border-[#B68A36]/30">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#E2BC6B]" />
            <h2 className="text-sm font-bold font-serif text-white">Broadcast Operational Notification</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Target Recipient Group</label>
            <select
              value={recipientGroup}
              onChange={(e) => setRecipientGroup(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
            >
              <option value="All Active Personnel">All Active Personnel</option>
              <option value="Sevadal Volunteer Council">Sevadal Volunteer Council</option>
              <option value="Temple Security Wing">Temple Security Wing</option>
              <option value="Traffic Volunteer Unit">Traffic Volunteer Unit</option>
              <option value="Disaster & Safety Team">Disaster & Safety Team</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Broadcast Message</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200"
            />
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Broadcast</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

