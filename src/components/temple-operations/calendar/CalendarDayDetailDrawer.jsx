import OverlayPortal from '../../common/OverlayPortal';
import React, { useState } from 'react';
import {
  X,
  Users,
  Flame,
  Clock,
  Sparkles,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  Phone,
  MapPin,
  CalendarDays,
  Radio,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { useTempleCalendar } from '../../../context/TempleCalendarContext';

// Vedic Panchang mapping for November 2026
const PANCHANG_BY_DAY = {
  1: { tithi: 'Kartik Purnima', nakshatra: 'Krittika', yog: 'Siddha Yoga' },
  2: { tithi: 'Margashirsha Krishna Pratipada', nakshatra: 'Rohini', yog: 'Sadhya Yoga' },
  3: { tithi: 'Margashirsha Krishna Dwitiya', nakshatra: 'Mrigashira', yog: 'Shubha Yoga' },
  4: { tithi: 'Margashirsha Krishna Tritiya', nakshatra: 'Ardra', yog: 'Shukla Yoga' },
  5: { tithi: 'Margashirsha Krishna Chaturthi (Sankashti)', nakshatra: 'Punarvasu', yog: 'Brahma Yoga' },
  6: { tithi: 'Margashirsha Krishna Panchami (Rama Ekadashi)', nakshatra: 'Pushya', yog: 'Indra Yoga' },
  7: { tithi: 'Margashirsha Krishna Shashthi', nakshatra: 'Ashlesha', yog: 'Vaidhriti Yoga' },
  8: { tithi: 'Margashirsha Krishna Saptami', nakshatra: 'Magha', yog: 'Vishkumbha Yoga' },
  9: { tithi: 'Margashirsha Krishna Ashtami (Kalashtami)', nakshatra: 'Purva Phalguni', yog: 'Priti Yoga' },
  10: { tithi: 'Margashirsha Krishna Navami', nakshatra: 'Uttara Phalguni', yog: 'Ayushman Yoga' },
  11: { tithi: 'Margashirsha Krishna Dashami (Diwali Mela Day 1)', nakshatra: 'Hasta', yog: 'Saubhagya Yoga' },
  12: { tithi: 'Margashirsha Krishna Ekadashi (Dhanteras)', nakshatra: 'Chitra', yog: 'Shobhana Yoga' },
  13: { tithi: 'Margashirsha Krishna Trayodashi (Choti Diwali)', nakshatra: 'Swati', yog: 'Atiganda Yoga' },
  14: { tithi: 'Margashirsha Krishna Chaturdashi (Narak Chaturdashi)', nakshatra: 'Vishakha', yog: 'Sukarma Yoga' },
  15: { tithi: 'Margashirsha Amavasya (Diwali & Kali Puja)', nakshatra: 'Anuradha', yog: 'Dhriti Yoga' },
  16: { tithi: 'Margashirsha Shukla Pratipada (Govardhan Puja)', nakshatra: 'Jyeshtha', yog: 'Shula Yoga' },
  17: { tithi: 'Margashirsha Shukla Dwitiya (Bhai Dooj)', nakshatra: 'Mula', yog: 'Ganda Yoga' },
  18: { tithi: 'Margashirsha Shukla Tritiya', nakshatra: 'Purva Ashadha', yog: 'Vriddhi Yoga' },
  19: { tithi: 'Margashirsha Shukla Chaturthi (Vinayaka)', nakshatra: 'Uttara Ashadha', yog: 'Dhruva Yoga' },
  20: { tithi: 'Margashirsha Shukla Panchami (Chhath Sandhya)', nakshatra: 'Shravana', yog: 'Vyaghata Yoga' },
  21: { tithi: 'Margashirsha Shukla Ekadashi (Utpanna Ekadashi)', nakshatra: 'Dhanishta', yog: 'Harshana Yoga' },
  22: { tithi: 'Margashirsha Shukla Dwadashi', nakshatra: 'Shatabhisha', yog: 'Vajra Yoga' },
  23: { tithi: 'Margashirsha Shukla Trayodashi', nakshatra: 'Purva Bhadrapada', yog: 'Siddhi Yoga' },
  24: { tithi: 'Margashirsha Shukla Chaturdashi', nakshatra: 'Uttara Bhadrapada', yog: 'Vyatipata Yoga' },
  25: { tithi: 'Margashirsha Purnima', nakshatra: 'Revati', yog: 'Variyana Yoga' },
  26: { tithi: 'Pausha Krishna Pratipada', nakshatra: 'Ashwini', yog: 'Parigha Yoga' },
  27: { tithi: 'Pausha Krishna Dwitiya', nakshatra: 'Bharani', yog: 'Shiva Yoga' },
  28: { tithi: 'Pausha Krishna Tritiya', nakshatra: 'Krittika', yog: 'Siddha Yoga' },
  29: { tithi: 'Pausha Krishna Chaturthi', nakshatra: 'Rohini', yog: 'Sadhya Yoga' },
  30: { tithi: 'Pausha Krishna Panchami', nakshatra: 'Mrigashira', yog: 'Shubha Yoga' },
};

// Realistic Daily Temple Rituals Timetable for Tripura Sundari
const DAILY_RITUALS_SCHEDULE = [
  {
    time: '05:30 AM – 06:15 AM',
    name: 'Mangala Aarti & Suprabhatam',
    priest: 'Pt. Ramendra Sharma (Head Pujari)',
    location: 'Main Sanctum Sanctorum',
    offering: 'Fresh Lotus garland, curd & raw milk snana',
    status: 'Completed',
  },
  {
    time: '08:00 AM – 09:30 AM',
    name: 'Pratah Kalik Puja & Sri Chandi Paath',
    priest: 'Pt. Kalyan Chakraborty (Shakta Acharya)',
    location: 'Chandi Mandap Corridor',
    offering: '108 Bilva leaves, red hibiscus & Panchamrit',
    status: 'Completed',
  },
  {
    time: '12:30 PM – 01:30 PM',
    name: 'Madhyahna Bhog & Rajbhog Arpan',
    priest: 'Pt. Bhattacharya & Temple Seva Dal',
    location: 'Garbhagriha & Anna Mandir',
    offering: 'Govindabhog rice, moong dal khichuri, 5-shak, payesh',
    status: 'In Progress',
  },
  {
    time: '06:30 PM – 07:30 PM',
    name: 'Sandhya Aarti & Kalyan Sagar Deeparadhana',
    priest: 'Pt. Bhabesh Shastri',
    location: 'Ghat Steps & Sanctum Forecourt',
    offering: '108-wick brass lamp Deepam, dhup & kansar recital',
    status: 'Scheduled',
  },
  {
    time: '08:45 PM – 09:15 PM',
    name: 'Shayana Aarti & Sacred Temple Closure',
    priest: 'Temple Night Pujari',
    location: 'Garbhagriha Inner Enclosure',
    offering: 'Chandan lepan, sacred floral shayan vastra',
    status: 'Scheduled',
  },
];

export default function CalendarDayDetailDrawer() {
  const {
    isDetailDrawerOpen,
    setIsDetailDrawerOpen,
    selectedDate,
    selectedDateAgenda,
    dutyOfficersMap,
    assignDutyOfficer,
    availableDutyOfficers,
    deleteDutyAssignment,
    setIsAddScheduleModalOpen,
    setAddScheduleTab,
  } = useTempleCalendar();

  const [isAssigningOfficer, setIsAssigningOfficer] = useState(false);

  if (!isDetailDrawerOpen) return null;

  const dateObj = new Date(selectedDate);
  const dayNum = dateObj.getDate();
  const isNovember = dateObj.getMonth() === 10 && dateObj.getFullYear() === 2026;
  const isToday = isNovember && dayNum === 4;

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const panchang = PANCHANG_BY_DAY[dayNum] || {
    tithi: 'Shukla Paksha Tithi',
    nakshatra: 'Shravana Nakshatra',
    yog: 'Shubha Yoga',
  };

  const currentOfficer = isNovember && dutyOfficersMap ? dutyOfficersMap[dayNum] : null;

  const { shifts, festivals, tasks } = selectedDateAgenda;

  // Notes for this day (matching the reference image notes)
  const notesByDay = {
    3: { title: 'Staff review', desc: 'Monthly performance audit with all department heads in Conference Room.', supervisor: 'Kamal S.' },
    10: { title: 'Facility check', desc: 'Pre-festival infrastructure inspection: Yatri Niwas, RO plant, ghat lighting.', supervisor: 'Nilanjan D.' },
    11: { title: 'Brief officers, 8 AM', desc: 'Mandatory morning briefing for all shift commanders at West Gopuram Control Room.', supervisor: 'Bidhan C.' },
    19: { title: 'Volunteer meeting', desc: 'Briefing with 40 NSS college cadets and Seva Dal volunteers for Ekadashi rush.', supervisor: 'Subal B.' },
    25: { title: 'Parking review', desc: 'Audit traffic overflow management along Udaipur-Matabari link road.', supervisor: 'Subal B.' },
    28: { title: 'Month-end report', desc: 'Compile monthly devotees count, Annadanam records & hundi registers for Board audit.', supervisor: 'Nilanjan D.' },
  };

  const dayNote = isNovember ? notesByDay[dayNum] : null;

  // Multi-day festival notes for Diwali Mela (Nov 11-15)
  const isDiwaliMelaSpan = isNovember && dayNum >= 11 && dayNum <= 15;
  const diwaliDayNumber = dayNum - 10;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsDetailDrawerOpen(false)}
      />

      {/* Slide-In Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-16 z-10">
        <div className="w-screen max-w-lg bg-stone-50 shadow-2xl border-l border-stone-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4.5 bg-[#55132D] text-white flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-[#E2BC6B]/30 shadow-2xs">
                <CalendarDays className="w-5 h-5 text-[#E2BC6B]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#E2BC6B]">
                    Day Inspection & Operations
                  </span>
                  {isToday && (
                    <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[9.5px] font-bold">
                      Today
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold font-serif leading-tight">
                  {formattedDate}
                </h3>
                <p className="text-[11px] text-amber-200/80 font-medium">
                  {panchang.tithi} · {panchang.nakshatra}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDetailDrawerOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto p-4.5 space-y-5 custom-scrollbar text-xs">
            {/* ========================================================= */}
            {/* SECTION 1: SPECIAL THINGS OR EVENTS */}
            {/* ========================================================= */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-serif uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#EA580C]" />
                  <span>Special Things & Events</span>
                </h4>
                {festivals.length > 0 && (
                  <span className="text-[10px] font-bold bg-[#FFEDD5] text-[#9A3412] px-2 py-0.5 rounded-full border border-amber-300">
                    Active Festival
                  </span>
                )}
              </div>

              {/* Multi-day Diwali Mela banner */}
              {isDiwaliMelaSpan && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-[#EA580C] text-white text-[10px] font-bold uppercase tracking-wider">
                        Day {diwaliDayNumber} of 5
                      </span>
                      <h5 className="text-sm font-bold font-serif text-stone-900 mt-1">
                        Diwali Mahotsav & Kalyan Sagar Dipavali Mela 2026
                      </h5>
                    </div>
                    <span className="text-[11px] font-bold font-mono px-2 py-1 rounded-lg bg-white border border-amber-200 text-amber-950">
                      1,50,000+ Yatris
                    </span>
                  </div>
                  <p className="text-[11.5px] text-stone-700 leading-relaxed">
                    Grandest annual Shakta festival at Mata Tripura Sundari Peetha. Over 1,00,000 earthen deepams illuminated across Kalyan Sagar steps with 24-hour non-stop darshan corridors.
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-amber-200 text-[10.5px] text-stone-600">
                    <span className="font-semibold text-stone-800">Marshal Lead: Subal Bhattacharya</span>
                    <span className="text-amber-800 font-bold">Special Prasad: 50,000 Peda packets</span>
                  </div>
                </div>
              )}

              {/* Single-day Festivals */}
              {festivals.filter((f) => f.id !== 'FST-03').map((fest) => (
                <div
                  key={fest.id}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/90 rounded-2xl p-4 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold font-serif text-stone-900">
                      {fest.title}
                    </h5>
                    <span className="text-[10px] font-bold bg-[#FFEDD5] text-[#9A3412] px-2 py-0.5 rounded-full">
                      {fest.category}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-stone-700 leading-relaxed">
                    {fest.description}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-amber-200 text-[10.5px] text-stone-600">
                    <span className="font-semibold text-stone-800">Lead: {fest.leadAdmin}</span>
                    <span className="text-amber-800 font-bold">Forecast: {fest.expectedDevotees}</span>
                  </div>
                </div>
              ))}

              {/* Operational Note for this day if scheduled */}
              {dayNote && (
                <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-blue-950">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Administrative Note: {dayNote.title}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Officer In-charge: {dayNote.supervisor}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-blue-900/90 leading-relaxed pl-5">
                    {dayNote.desc}
                  </p>
                </div>
              )}

              {/* If no festival and no note */}
              {!isDiwaliMelaSpan && festivals.length === 0 && !dayNote && (
                <div className="bg-white border border-stone-200 rounded-2xl p-3.5 text-stone-600 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-900 block text-xs">
                      Standard Temple Devotional Day
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Regular Darshan: 05:30 AM – 09:00 PM · Free Annadanam Bhog: 11:30 AM – 03:00 PM
                    </span>
                  </div>
                  <span className="text-[10.5px] font-mono font-semibold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md">
                    ~6,500 Devotees
                  </span>
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* SECTION 2: DAY RITUALS */}
            {/* ========================================================= */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-serif uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>That Day Rituals & Sacred Timetable</span>
                </h4>
                <span className="text-[10px] font-semibold text-stone-500">
                  5 Timed Pujas
                </span>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl divide-y divide-stone-150 shadow-2xs overflow-hidden">
                {DAILY_RITUALS_SCHEDULE.map((ritual, idx) => (
                  <div
                    key={idx}
                    className="p-3 hover:bg-stone-50/80 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-stone-900">
                          {ritual.name}
                        </span>
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded ${
                            ritual.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ritual.status === 'In Progress'
                              ? 'bg-amber-100 text-amber-900 animate-pulse'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {ritual.status}
                        </span>
                      </div>

                      <div className="text-[10.5px] text-stone-600 flex items-center gap-1.5">
                        <span className="font-medium text-[#55132D]">{ritual.priest}</span>
                        <span>•</span>
                        <span className="text-stone-500">{ritual.location}</span>
                      </div>

                      <div className="text-[10px] text-amber-900/80 font-medium">
                        Naivedyam: {ritual.offering}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="font-mono text-[10.5px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {ritual.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================================= */}
            {/* SECTION 3: DUTY STAFF ALLOCATED */}
            {/* ========================================================= */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-serif uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#55132D]" />
                  <span>Duty Staff Allocated</span>
                </h4>
                <button
                  onClick={() => {
                    setAddScheduleTab('shift');
                    setIsAddScheduleModalOpen(true);
                  }}
                  className="text-xs font-semibold text-[#55132D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Roster</span>
                </button>
              </div>

              {/* 1. Lead Duty Officer Card */}
              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-150 pb-2">
                  <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Designated Duty Officer
                  </span>
                  {currentOfficer ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      <span>Allocated</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-dashed border-rose-300 text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>Needs Officer</span>
                    </span>
                  )}
                </div>

                {currentOfficer ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#55132D] text-white font-bold text-sm flex items-center justify-center shadow-2xs shrink-0">
                        {currentOfficer.initials}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-stone-900 leading-tight">
                          {currentOfficer.name}
                        </h5>
                        <p className="text-[11px] text-[#55132D] font-medium">
                          {currentOfficer.role}
                        </p>
                        <div className="flex items-center gap-3 text-[10.5px] text-stone-500 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{currentOfficer.contact}</span>
                          </span>
                          <span className="flex items-center gap-1 font-mono text-purple-900 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                            <Radio className="w-2.5 h-2.5 text-purple-600" />
                            <span>{currentOfficer.radio}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsAssigningOfficer((prev) => !prev)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition-colors shrink-0 cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11.5px] text-rose-800 bg-rose-50/70 p-2.5 rounded-xl border border-rose-200">
                      No supervisory duty officer assigned for this date yet. Select an officer to ensure campus command.
                    </p>
                    <button
                      onClick={() => setIsAssigningOfficer((prev) => !prev)}
                      className="w-full py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#E2BC6B]" />
                      <span>Assign Duty Officer Now</span>
                      <ChevronDown className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                )}

                {/* Instant Officer Assignment Dropdown */}
                {isAssigningOfficer && (
                  <div className="pt-2 border-t border-stone-150 space-y-1.5 animate-in fade-in">
                    <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
                      Select Available Officer:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                      {availableDutyOfficers.map((off) => (
                        <button
                          key={off.id}
                          onClick={() => {
                            assignDutyOfficer(dayNum, off);
                            setIsAssigningOfficer(false);
                          }}
                          className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-400 text-left flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#55132D] text-white font-bold text-[10px] flex items-center justify-center">
                              {off.initials}
                            </span>
                            <div>
                              <span className="font-bold text-stone-900 block text-xs">
                                {off.name}
                              </span>
                              <span className="text-[10px] text-stone-500">
                                {off.role}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-stone-600 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                            {off.radio}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Deployed Shifts & Volunteers */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                  Ground Shifts & Deployed Personnel ({shifts.length})
                </span>

                {shifts.length > 0 ? (
                  <div className="space-y-2">
                    {shifts.map((person) => (
                      <div
                        key={person.id}
                        className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-xs">
                              {person.staffName}
                            </span>
                            <span className="text-[9.5px] font-bold bg-[#55132D]/10 text-[#55132D] px-1.5 py-0.2 rounded">
                              {person.shiftId === 'SHF-MORNING'
                                ? 'Morning'
                                : person.shiftId === 'SHF-AFTERNOON'
                                ? 'Afternoon'
                                : 'Night'}
                            </span>
                          </div>

                          <div className="text-[10.5px] text-[#55132D] font-medium">
                            {person.role}
                          </div>

                          <div className="text-[10px] text-stone-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                            <span>{person.zoneName}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {person.contact && (
                            <a
                              href={`tel:${person.contact}`}
                              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                              title="Call Personnel"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => deleteDutyAssignment(person.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove assignment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 text-center text-stone-500 bg-white rounded-xl border border-dashed border-stone-200 text-xs">
                    Standard 15 Seva Dal volunteers deployed under Duty Officer command.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-stone-200 bg-white flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={() => {
                setAddScheduleTab('shift');
                setIsAddScheduleModalOpen(true);
              }}
              className="flex-1 py-2 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2BC6B]" />
              <span>Add Shift / Task</span>
            </button>
            <button
              onClick={() => setIsDetailDrawerOpen(false)}
              className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl border border-stone-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
