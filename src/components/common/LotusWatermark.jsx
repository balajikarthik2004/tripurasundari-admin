import React from 'react';

export default function LotusWatermark({ className = 'w-16 h-12 text-[#E2BC6B]/20' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Central sacred lotus petal */}
      <path d="M50 8 C46 22 42 38 50 50 C58 38 54 22 50 8 Z" fill="currentColor" fillOpacity="0.08" />
      {/* Left inner petal */}
      <path d="M50 20 C38 24 30 36 38 48 C44 48 48 46 50 50" />
      {/* Right inner petal */}
      <path d="M50 20 C62 24 70 36 62 48 C56 48 52 46 50 50" />
      {/* Left outer petal */}
      <path d="M42 34 C24 36 14 44 26 52 C32 52 38 50 42 50" />
      {/* Right outer petal */}
      <path d="M58 34 C76 36 86 44 74 52 C68 52 62 50 58 50" />
      {/* Base water line */}
      <path d="M22 54 C36 52 64 52 78 54" strokeWidth="1.2" strokeDasharray="2 2" />
    </svg>
  );
}

