import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Flame,
  Users,
  HeartHandshake,
  ShoppingBag,
  Building2,
  UsersRound,
  QrCode,
  UserCog,
  Video,
  Store,
  Car,
  Tent,
  Clock,
  Landmark,
  CalendarDays,
  Megaphone,
  MapPin,
  BarChart3,
  MessageSquareText,
  ShieldCheck,
  Settings,
  HelpCircle,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

const ICON_MAP = {
  LayoutDashboard,
  CalendarCheck,
  Flame,
  Users,
  HeartHandshake,
  ShoppingBag,
  Building2,
  UsersRound,
  QrCode,
  UserCog,
  Video,
  Store,
  Car,
  Tent,
  Clock,
  Landmark,
  CalendarDays,
  Megaphone,
  MapPin,
  BarChart3,
  MessageSquareText,
  ShieldCheck,
  Settings,
  FileCheck,
  AlertTriangle,
};

export default function IconRenderer({ name, className = 'w-4 h-4', ...props }) {
  const Component = ICON_MAP[name] || HelpCircle;
  return <Component className={className} {...props} />;
}

