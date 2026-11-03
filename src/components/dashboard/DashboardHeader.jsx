import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Clock,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Menu,
} from 'lucide-react';
import { CURRENT_ADMIN_USER, NOTIFICATIONS_LIST, SYSTEM_BADGE } from '../../data/dashboardData';
import { TEMPLE_INFO } from '../../utils/constants';

export default function DashboardHeader({ onToggleMobileSidebar }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_LIST);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const searchResults = [
    { title: 'Special Darshan Pass #DRSN1001', category: 'Bookings', path: '/bookings' },
    { title: 'Pooja Archana #POOJ1022 - Priya Sharma', category: 'Pooja & Seva', path: '/pooja-seva' },
    { title: 'Annadanam Donation #DONN3342 - Anil Verma', category: 'Donations', path: '/donations' },
    { title: 'Zone A Main Entrance Queue Flow', category: 'Crowd Control', path: '/crowd-control' },
    { title: 'Diwali Mela Fairground Protocol', category: 'Mela Management', path: '/mela-management' },
  ].filter((item) =>
    searchQuery.trim() === ''
      ? true
      : item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-30 bg-[#F8F5EF] border-b border-[#E8E2D8] shadow-2xs px-4 sm:px-6 lg:px-8 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-3 sm:gap-4 max-w-[1780px] mx-auto">
        {/* Left: Branding & Mobile Hamburger */}
        <div className="flex items-center gap-3 min-w-0">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="p-1.5 rounded-lg text-temple-burgundy hover:bg-temple-burgundy/10 lg:hidden focus:outline-none flex-shrink-0"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="min-w-0">
              <h1 className="font-heading text-base sm:text-lg font-bold text-temple-burgundy tracking-tight leading-tight truncate">
                {TEMPLE_INFO.name}
              </h1>
              <p className="text-xs text-temple-text-secondary leading-none truncate mt-1">
                {TEMPLE_INFO.subtitle} <span className="hidden md:inline">• One of 51 Shakti Peethas</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Global Search Bar */}
          <div className="relative hidden xl:block" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-temple-text-secondary absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search bookings, devotees, passes..."
                className="w-72 pl-9 pr-3 py-2 text-sm rounded-lg bg-white border border-[#E8E2D8] text-temple-text-primary placeholder:text-temple-text-secondary/70 focus:outline-none focus:ring-1 focus:ring-temple-gold focus:border-temple-gold shadow-2xs"
              />
            </div>

            {/* Quick Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-xl border border-[#E8E2D8] shadow-card py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-xs font-bold text-temple-text-muted uppercase tracking-wider">
                  Quick Navigation Results
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.slice(0, 5).map((result, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(result.path);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-[#F8F5EF] flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="font-medium text-temple-text-primary group-hover:text-temple-burgundy">
                          {result.title}
                        </div>
                        <div className="text-xs text-stone-500">
                          {result.category}
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-temple-text-muted group-hover:text-temple-burgundy" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current Date & Time */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/70 border border-[#E8E2D8] text-xs text-temple-text-secondary shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium font-mono text-xs">Thu, 31 Oct • 10:28 AM</span>
          </div>

          {/* Notifications Icon with Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative p-2 rounded-lg bg-white border border-[#E8E2D8] text-temple-text-secondary hover:text-temple-burgundy hover:bg-[#F8F5EF] transition-colors shadow-2xs focus:outline-none"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-[#F8F5EF]">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl border border-[#E8E2D8] shadow-card py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-[#E8E2D8] flex items-center justify-between">
                  <span className="text-xs font-bold text-temple-burgundy uppercase tracking-wider">
                    Administrative Alerts ({unreadCount})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-[11px] text-temple-gold hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-[#E8E2D8]/50 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs hover:bg-[#F8F5EF] transition-colors ${
                        n.unread ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-temple-text-primary">
                          {n.title}
                        </span>
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <span className="text-[10px] text-temple-text-muted mt-1 block">
                        {n.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-[#E8E2D8] text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotifOpen(false);
                      navigate('/reports');
                    }}
                    className="text-xs text-temple-burgundy font-medium hover:underline"
                  >
                    View System Audit Logs →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Pill */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg bg-white border border-[#E8E2D8] hover:bg-[#F8F5EF] transition-colors shadow-2xs focus:outline-none"
            >
              <div className="w-7 h-7 rounded-full bg-[#55132D] text-[#E2BC6B] flex items-center justify-center font-bold text-xs">
                {CURRENT_ADMIN_USER.avatarInitials}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-temple-text-primary leading-tight">
                  {CURRENT_ADMIN_USER.name}
                </div>
                <div className="text-[10px] text-temple-text-muted leading-tight">
                  {CURRENT_ADMIN_USER.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-temple-text-secondary hidden sm:inline" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-[#E8E2D8] shadow-card py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-[#E8E2D8]">
                  <div className="text-xs font-bold text-temple-text-primary">
                    {CURRENT_ADMIN_USER.name}
                  </div>
                  <div className="text-[11px] text-temple-text-muted truncate">
                    {CURRENT_ADMIN_USER.email}
                  </div>
                  <div className="text-[10px] text-[#55132D] font-semibold mt-1">
                    {CURRENT_ADMIN_USER.department}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/users');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-temple-text-primary hover:bg-[#F8F5EF] flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#55132D]" />
                    <span>User & Role Management</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-temple-text-primary hover:bg-[#F8F5EF] flex items-center gap-2"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-[#55132D]" />
                    <span>Security & Trust Audit</span>
                  </button>
                </div>

                <div className="border-t border-[#E8E2D8] pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      alert('Signed out of administrative session.');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
