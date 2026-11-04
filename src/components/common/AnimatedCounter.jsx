import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';

/**
 * AnimatedCounter Component
 * Smoothly animates numbers and metric strings from 0 to actual value when mounted.
 */
export default function AnimatedCounter({ value, duration = 1100, className = '' }) {
  const animated = useCountUp(value, duration);

  return <span className={className}>{animated}</span>;
}

