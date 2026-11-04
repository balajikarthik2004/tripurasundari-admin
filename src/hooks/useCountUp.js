import { useState, useEffect } from 'react';

/**
 * Parses a metric string or number into prefix, number, and suffix parts.
 * Supports values like: "24,680", "₹1,28,481", "26 mins", "81%", "4,885", 18, etc.
 */
export function parseMetricValue(raw) {
  if (raw === null || raw === undefined) {
    return { prefix: '', number: 0, suffix: '', isNumeric: false, original: '' };
  }

  if (typeof raw === 'number') {
    return {
      prefix: '',
      number: raw,
      suffix: '',
      isNumeric: true,
      hasDecimals: raw % 1 !== 0,
      decimalPlaces: (String(raw).split('.')[1] || '').length,
      hasCommas: true,
    };
  }

  const str = String(raw).trim();

  // Match optional prefix, the numeric digits/commas/period, and optional suffix
  const regex = /^([^\d\-+.]*?)([\d,]+(?:\.\d+)?)([^\d.]*)$/;
  const match = str.match(regex);

  if (!match) {
    return { prefix: '', number: 0, suffix: str, isNumeric: false, original: str };
  }

  const prefix = match[1] || '';
  const numStr = match[2].replace(/,/g, '');
  const num = parseFloat(numStr);
  const suffix = match[3] || '';
  const hasDecimals = match[2].includes('.');
  const decimalPlaces = hasDecimals ? match[2].split('.')[1].length : 0;

  if (isNaN(num)) {
    return { prefix: '', number: 0, suffix: str, isNumeric: false, original: str };
  }

  return {
    prefix,
    number: num,
    suffix,
    isNumeric: true,
    hasDecimals,
    decimalPlaces,
    hasCommas: match[2].includes(','),
  };
}

function formatCount(val, parsed, isFinal = false) {
  let numFormatted;
  if (isFinal) {
    if (parsed.hasDecimals) {
      numFormatted = parsed.number.toLocaleString('en-IN', {
        minimumFractionDigits: parsed.decimalPlaces,
        maximumFractionDigits: parsed.decimalPlaces,
      });
    } else if (parsed.hasCommas) {
      numFormatted = Math.round(parsed.number).toLocaleString('en-IN');
    } else {
      numFormatted = String(Math.round(parsed.number));
    }
  } else {
    if (parsed.hasDecimals) {
      numFormatted = val.toLocaleString('en-IN', {
        minimumFractionDigits: parsed.decimalPlaces,
        maximumFractionDigits: parsed.decimalPlaces,
      });
    } else if (parsed.hasCommas) {
      numFormatted = Math.round(val).toLocaleString('en-IN');
    } else {
      numFormatted = String(Math.round(val));
    }
  }
  return `${parsed.prefix}${numFormatted}${parsed.suffix}`;
}

/**
 * useCountUp Hook
 * Animates a numeric or formatted string value from 0 to the target value on mount/change.
 */
export function useCountUp(rawValue, duration = 1100) {
  const [displayValue, setDisplayValue] = useState(() => {
    const parsed = parseMetricValue(rawValue);
    if (!parsed.isNumeric) return String(rawValue ?? '');
    return formatCount(0, parsed);
  });

  useEffect(() => {
    const parsed = parseMetricValue(rawValue);
    if (!parsed.isNumeric) {
      setDisplayValue(String(rawValue ?? ''));
      return;
    }

    const target = parsed.number;
    if (target === 0) {
      setDisplayValue(formatCount(0, parsed, true));
      return;
    }

    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth cubic ease out curve (starts brisk, smoothly settles)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeProgress * target;

      setDisplayValue(formatCount(current, parsed, progress === 1));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [rawValue, duration]);

  return displayValue;
}

