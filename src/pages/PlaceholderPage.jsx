import React from 'react';
import { useLocation } from 'react-router-dom';
import PagePlaceholder from '../components/common/PagePlaceholder';
import { getNavItemByPath, NAVIGATION_GROUPS } from '../data/navigationData';

export default function PlaceholderPage() {
  const location = useLocation();
  const item = getNavItemByPath(location.pathname);

  // Find parent group title
  const parentGroup = NAVIGATION_GROUPS.find((group) =>
    group.items.some((i) => i.path === location.pathname)
  );

  return (
    <PagePlaceholder
      title={item.label}
      description={item.description}
      category={parentGroup?.title}
    />
  );
}

