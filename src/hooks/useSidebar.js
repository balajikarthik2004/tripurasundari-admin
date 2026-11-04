import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NAVIGATION_GROUPS } from '../data/navigationData';

const findActiveGroupId = (pathname) => {
  for (const group of NAVIGATION_GROUPS) {
    if (group.items.some((item) => item.path === pathname || (item.path !== '/' && pathname.startsWith(item.path)))) {
      return group.id;
    }
  }
  return 'overview';
};

export function useSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('temple_sidebar_collapsed');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Automatically expand ONLY the active group for the current route
  const [expandedGroups, setExpandedGroups] = useState(() => {
    const active = findActiveGroupId(location.pathname);
    return {
      overview: active === 'overview',
      'devotee-services': active === 'devotee-services',
      'temple-operations': active === 'temple-operations',
      'content-management': active === 'content-management',
      'insights-admin': active === 'insights-admin',
    };
  });

  // Automatically ensure the relevant group expands on route change
  useEffect(() => {
    const active = findActiveGroupId(location.pathname);
    setExpandedGroups((prev) => {
      if (prev[active]) return prev;
      return {
        ...prev,
        [active]: true,
      };
    });
  }, [location.pathname]);

  useEffect(() => {
    try {
      localStorage.setItem('temple_sidebar_collapsed', JSON.stringify(isCollapsed));
    } catch (e) {
      console.warn('Could not persist sidebar collapse state', e);
    }
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return {
    isCollapsed,
    setIsCollapsed,
    toggleCollapse,
    isMobileOpen,
    setIsMobileOpen,
    toggleMobile,
    closeMobile,
    expandedGroups,
    toggleGroup,
  };
}

