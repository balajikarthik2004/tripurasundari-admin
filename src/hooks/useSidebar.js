import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NAVIGATION_GROUPS, isRouteActive } from '../data/navigationData';

const findActiveGroupId = (pathname) => {
  for (const group of NAVIGATION_GROUPS) {
    if (group.items.some((item) => isRouteActive(item.path, pathname))) {
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

  // Default to ALL categories/groups OPEN on first page load
  const [expandedGroups, setExpandedGroups] = useState(() => {
    return {
      overview: true,
      'devotee-services': true,
      'temple-operations': true,
      'content-management': true,
      'insights-admin': true,
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

