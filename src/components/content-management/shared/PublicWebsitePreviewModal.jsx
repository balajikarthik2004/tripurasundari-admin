import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Monitor,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Info,
  Phone,
  Mail,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useContentManagement } from '../../../context/ContentManagementContext';

export default function PublicWebsitePreviewModal() {
  const { previewData, closePreview } = useContentManagement();
  const [viewport, setViewport] = useState('desktop'); // desktop or mobile

  if (!previewData) return null;

  const { type, item } = previewData;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div
        className={`bg-stone-100 rounded-2xl shadow-2xl border border-stone-700 overflow-hidden flex flex-col transition-all duration-300 ${
          viewport === 'mobile' ? 'max-w-md w-full' : 'max-w-4xl w-full'
        } max-h-[92vh]`}
      >
        {/* Preview Top Control Bar */}
        <div className="px-4 py-3 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-stone-200 uppercase tracking-wider">
              Public Portal Website Preview
            </span>
            <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded border border-stone-700 font-mono">
              {type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport switch */}
            <div className="flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewport === 'desktop' ? 'bg-[#800000] text-white' : 'text-stone-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewport === 'mobile' ? 'bg-[#800000] text-white' : 'text-stone-400 hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={closePreview}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Public Website Frame */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FAF8F5]">
          {/* Simulated Public Portal Header */}
          <div className="bg-[#55132D] text-white px-5 py-3 border-b-2 border-[#E2BC6B] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#E2BC6B] text-[#55132D] font-bold flex items-center justify-center text-xs font-serif shadow-sm">
                ॐ
              </div>
              <div>
                <h4 className="font-serif text-xs font-bold tracking-tight text-white">
                  Mata Tripura Sundari Temple
                </h4>
                <p className="text-[10px] text-[#EADECF]/80">Matabari, Udaipur, Tripura • Official Portal</p>
              </div>
            </div>
            <span className="text-[10px] text-[#E2BC6B] font-mono uppercase tracking-wider hidden sm:inline">
              One of 51 Shakti Peethas
            </span>
          </div>

          {/* Body Content based on preview type */}
          <div className="p-5 space-y-4">
            {/* TYPE: TEMPLE PROFILE */}
            {type === 'temple-profile' && (
              <div className="space-y-4 text-stone-800">
                {/* Hero Card */}
                <div className="relative rounded-xl overflow-hidden shadow-sm aspect-video max-h-64 bg-stone-900">
                  <img
                    src={item.mainImage || '/src/assets/images/temple.jpg'}
                    alt={item.templeName}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="text-[11px] font-semibold text-[#E2BC6B] uppercase tracking-wider mb-1">
                      {item.shaktiPeethaStatus}
                    </span>
                    <h2 className="text-xl font-bold font-serif">{item.templeName}</h2>
                    <p className="text-xs text-stone-200 mt-1 max-w-xl">{item.shortDescription}</p>
                  </div>
                </div>

                {/* About & Description */}
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold font-serif text-[#55132D] border-b border-stone-150 pb-2">
                    Sacred Chronicle & Spiritual Heritage
                  </h3>
                  <p className="text-xs text-stone-700 leading-relaxed">{item.fullDescription}</p>
                  <div className="text-[11px] text-stone-500 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/80">
                    <strong>Historical Inscription:</strong> {item.historicalReference}
                  </div>
                </div>

                {/* Opening Hours & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-2">
                    <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#800000]" />
                      Daily Darshan & Aarti Timings
                    </h4>
                    <div className="space-y-1 text-[11px] text-stone-600">
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span>Morning Darshan:</span>
                        <span className="font-medium text-stone-800">{item.openingInformation?.morningDarshan}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span>Evening Darshan:</span>
                        <span className="font-medium text-stone-800">{item.openingInformation?.eveningDarshan}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Sandhya Aarti:</span>
                        <span className="font-medium text-stone-800">{item.openingInformation?.sandhyaAarti}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-2">
                    <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#800000]" />
                      Location & Trust Coordinates
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {item.address?.line1}, {item.address?.line2}, {item.address?.city}, {item.address?.state} – {item.address?.pinCode}
                    </p>
                    <p className="text-[11px] text-[#800000] font-mono mt-1">
                      Helpline: {item.contactDetails?.helplinePhone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TYPE: EVENT PREVIEW */}
            {type === 'event' && (
              <div className="space-y-4 text-stone-800">
                <div className="relative rounded-xl overflow-hidden shadow-sm aspect-video max-h-56 bg-stone-900">
                  <img
                    src={item.coverImage || '/src/assets/images/temple.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute top-3 right-3 bg-[#800000] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {item.category}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
                    <div className="flex items-center gap-2 text-xs text-[#E2BC6B] font-semibold mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.startDate} {item.endDate !== item.startDate && `– ${item.endDate}`}
                    </div>
                    <h2 className="text-lg font-bold font-serif">{item.title}</h2>
                    <p className="text-xs text-stone-300 mt-1">{item.shortDescription}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-[#800000]">
                    Festival Details & Observance
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{item.detailedDescription}</p>

                  {item.highlights && item.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-stone-150">
                      <h5 className="text-[11px] font-bold text-stone-800">Program Highlights:</h5>
                      <ul className="space-y-1 text-xs text-stone-600">
                        {item.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.visitorInstructions && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-[11px]">
                        <Info className="w-3.5 h-3.5 text-amber-700" />
                        Important Devotee Advisory:
                      </div>
                      <p className="text-[11px] leading-relaxed">{item.visitorInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TYPE: ANNOUNCEMENT PREVIEW */}
            {type === 'announcement' && (
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3 text-stone-800">
                <div className="flex items-center justify-between gap-2 border-b border-stone-150 pb-3">
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      item.priority === 'Urgent'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : item.priority === 'Important'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {item.priority} Notice • {item.category}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Published: {item.publishDate}
                  </span>
                </div>

                <h3 className="text-base font-bold font-serif text-stone-900">{item.title}</h3>
                <p className="text-xs text-stone-600 font-medium italic">{item.shortDescription}</p>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-150 text-xs text-stone-700 leading-relaxed space-y-2">
                  <p>{item.fullContent}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Issued By: {item.author || 'Temple Trust Administration'}</span>
                  {item.expiryDate && <span>Valid Until: {item.expiryDate}</span>}
                </div>
              </div>
            )}

            {/* TYPE: VISITOR GUIDE / FACILITY PREVIEW */}
            {(type === 'visitor-guide' || type === 'facility') && (
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3 text-stone-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#800000]">
                  <Building className="w-4 h-4" />
                  {item.category}
                </div>
                <h3 className="text-base font-bold font-serif text-stone-900">{item.name || item.title}</h3>
                <p className="text-xs text-stone-700 leading-relaxed">{item.publicDescription || item.content}</p>

                {item.visitorInstructions && (
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
                    <span className="font-semibold text-stone-800 block text-[11px]">Visitor Instructions:</span>
                    <p className="text-[11px]">{item.visitorInstructions}</p>
                  </div>
                )}

                {item.contactInfo && (
                  <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-2 border-t border-stone-150">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>Inquiry: {item.contactInfo}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 py-3 bg-stone-900 text-stone-300 text-xs flex items-center justify-between border-t border-stone-800">
          <span className="text-[11px]">
            Devotee View Simulation • Ready for Portal Syndication
          </span>
          <button
            onClick={closePreview}
            className="px-4 py-1.5 bg-[#800000] hover:bg-[#660000] text-white font-semibold rounded-lg transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
