import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subWeeks, subMonths } from 'date-fns';

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const d = typeof date === 'string' ? parseISO(date) : date;
  const diffInDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export const getDateRange = (range) => {
  const now = new Date();
  switch (range) {
    case 'today':
      return { start: now, end: now };
    case 'week':
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'quarter':
      return { start: startOfMonth(subMonths(now, 2)), end: endOfMonth(now) };
    case 'year':
      return { start: startOfYear(now), end: endOfYear(now) };
    case 'last7':
      return { start: subDays(now, 7), end: now };
    case 'last30':
      return { start: subDays(now, 30), end: now };
    case 'last90':
      return { start: subDays(now, 90), end: now };
    default:
      return { start: startOfMonth(now), end: endOfMonth(now) };
  }
};

export const calculatePercentage = (value, total) => {
  if (!total) return 0;
  return Math.min(100, Math.max(0, (value / total) * 100));
};

export const formatNumber = (num, compact = false) => {
  if (compact && num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (compact && num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString('en-US');
};

export const groupByDate = (items) => {
  const grouped = {};
  items.forEach(item => {
    const date = format(parseISO(item.date), 'yyyy-MM-dd');
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });
  return grouped;
};

export const calculateTrend = (current, previous) => {
  if (!previous) return { value: 0, direction: 'neutral' };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(change).toFixed(1),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    isPositive: change < 0, // For expenses, down is positive
  };
};
