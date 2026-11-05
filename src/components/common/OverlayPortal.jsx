import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * OverlayPortal:
 * Mounts full-screen overlay components (Drawers, Modals, Lightboxes) directly to document.body.
 *
 * Solves two critical UI/UX problems across the entire application:
 * 1. Stacking Context & Full Coverage: Teleports overlays out of nested containers and layout boundaries
 *    so the dark translucent backdrop uniformly covers the entire viewport (including header and sidebar)
 *    without any gaps, borders, or uncovered elements.
 * 2. Background Scroll Locking: Completely locks document.body and the main workspace scrollbar
 *    while the overlay is open, preventing background page scrolling during modal/drawer interaction.
 */
export default function OverlayPortal({ children, isOpen = true, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Body and main workspace scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const workspaceEl = document.getElementById('main-workspace');
    const originalWorkspaceOverflow = workspaceEl ? workspaceEl.style.overflow : '';

    // Lock scrolling on document and main workspace
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (workspaceEl) {
      workspaceEl.style.overflow = 'hidden';
    }

    // Handle Escape key to close
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      if (workspaceEl) {
        workspaceEl.style.overflow = originalWorkspaceOverflow;
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(children, document.body);
}

