import React from 'react';

export default function TempleLogo({ className = 'w-9 h-9' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sacred Temple Kalasha & Shikhara (Tripura Sundari Matabari Motif) */}
      <defs>
        <linearGradient id="templeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="50%" stopColor="#E2BC6B" />
          <stop offset="100%" stopColor="#B68A36" />
        </linearGradient>
        <radialGradient id="templeAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E2BC6B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#B68A36" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Radiant Aura */}
      <circle cx="24" cy="24" r="22" fill="url(#templeAura)" />

      {/* Base Steps / Chabutara */}
      <path
        d="M6 42H42V40H6V42Z"
        fill="url(#templeGoldGrad)"
      />
      <path
        d="M9 40H39V37H9V40Z"
        fill="url(#templeGoldGrad)"
      />
      <path
        d="M12 37H36V34H12V37Z"
        fill="url(#templeGoldGrad)"
      />

      {/* Main Temple Pillars & Sanctum Entrance */}
      <rect x="14" y="26" width="4" height="8" rx="0.5" fill="url(#templeGoldGrad)" />
      <rect x="30" y="26" width="4" height="8" rx="0.5" fill="url(#templeGoldGrad)" />
      <path
        d="M20 34V27C20 24.8 21.8 23 24 23C26.2 23 28 24.8 28 27V34H20Z"
        fill="#38091B"
        stroke="url(#templeGoldGrad)"
        strokeWidth="1.2"
      />
      {/* Inner Flame / Jyoti */}
      <path
        d="M24 26C24.8 27.2 25.2 28.5 24 30.5C22.8 28.5 23.2 27.2 24 26Z"
        fill="#FFE28A"
      />

      {/* Roof Terraces (Tiered Shikhara) */}
      <path
        d="M12 26L15 22H33L36 26H12Z"
        fill="url(#templeGoldGrad)"
      />
      <path
        d="M15 22L18 17H30L33 22H15Z"
        fill="url(#templeGoldGrad)"
      />
      <path
        d="M18 17L21 12H27L30 17H18Z"
        fill="url(#templeGoldGrad)"
      />

      {/* Top Amalak & Kalash Pinnacle */}
      <ellipse cx="24" cy="10" rx="3.5" ry="2" fill="url(#templeGoldGrad)" />
      <path
        d="M24 3L26.5 8H21.5L24 3Z"
        fill="url(#templeGoldGrad)"
      />
      {/* Sacred Dhwaja / Trishul Flag */}
      <path
        d="M24 3V1M24 1L27 2L24 3"
        stroke="#FFE28A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

