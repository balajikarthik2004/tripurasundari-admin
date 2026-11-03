/**
 * Utility functions for currency, numbers, dates and status badges
 */

export const formatCurrency = (amount, compact = false) => {
  if (amount === undefined || amount === null) return '₹0';
  if (compact) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatIndianNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const getStatusBadgeStyle = (status) => {
  const normalized = (status || '').toLowerCase();
  switch (normalized) {
    case 'confirmed':
    case 'completed':
    case 'paid':
    case 'approved':
    case 'online':
    case 'active':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'pending':
    case 'in progress':
    case 'under review':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'cancellation requested':
    case 'cancellation pending':
      return {
        bg: 'bg-amber-50 text-amber-900 border-amber-300',
        dot: 'bg-amber-600',
      };
    case 'high':
    case 'critical':
    case 'cancelled':
    case 'offline':
      return {
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'warning':
    case 'moderate':
    case 'medium':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      };
  }
};

export const getSeverityStyle = (severity) => {
  switch ((severity || '').toLowerCase()) {
    case 'critical':
      return {
        badge: 'bg-rose-100 text-rose-900 border-rose-200',
        border: 'border-l-4 border-l-rose-500',
        iconColor: 'text-rose-600',
        pill: 'bg-rose-500',
      };
    case 'warning':
      return {
        badge: 'bg-amber-100 text-amber-900 border-amber-200',
        border: 'border-l-4 border-l-amber-500',
        iconColor: 'text-amber-600',
        pill: 'bg-amber-500',
      };
    case 'information':
    default:
      return {
        badge: 'bg-blue-100 text-blue-900 border-blue-200',
        border: 'border-l-4 border-l-blue-500',
        iconColor: 'text-blue-600',
        pill: 'bg-blue-500',
      };
  }
};
