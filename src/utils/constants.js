export const APP_NAME = 'ExpenseTracker Pro';
export const APP_VERSION = '1.0.0';

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: 'restaurant', color: '#FF6B6B', emoji: '🍔' },
  { id: 'transport', name: 'Transportation', icon: 'car', color: '#4ECDC4', emoji: '🚗' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-bag', color: '#45B7D1', emoji: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film', color: '#96CEB4', emoji: '🎬' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'bolt', color: '#FFEAA7', emoji: '⚡' },
  { id: 'health', name: 'Health & Fitness', icon: 'heart', color: '#DDA0DD', emoji: '💊' },
  { id: 'education', name: 'Education', icon: 'book', color: '#98D8C8', emoji: '📚' },
  { id: 'travel', name: 'Travel', icon: 'plane', color: '#F7DC6F', emoji: '✈️' },
  { id: 'groceries', name: 'Groceries', icon: 'shopping-cart', color: '#BB8FCE', emoji: '🛒' },
  { id: 'housing', name: 'Housing & Rent', icon: 'home', color: '#E17055', emoji: '🏠' },
  { id: 'insurance', name: 'Insurance', icon: 'shield', color: '#74B9FF', emoji: '🛡️' },
  { id: 'pets', name: 'Pets', icon: 'paw', color: '#FDCB6E', emoji: '🐾' },
  { id: 'gifts', name: 'Gifts & Donations', icon: 'gift', color: '#E84393', emoji: '🎁' },
  { id: 'investment', name: 'Investments', icon: 'trending-up', color: '#00B894', emoji: '📈' },
  { id: 'other', name: 'Other', icon: 'more-horizontal', color: '#AAB7B8', emoji: '📌' },
];

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: 'money' },
  { id: 'credit', name: 'Credit Card', icon: 'credit-card' },
  { id: 'debit', name: 'Debit Card', icon: 'credit-card' },
  { id: 'bank', name: 'Bank Transfer', icon: 'landmark' },
  { id: 'digital', name: 'Digital Wallet', icon: 'smartphone' },
  { id: 'crypto', name: 'Cryptocurrency', icon: 'bitcoin' },
];

export const RECURRING_FREQUENCIES = [
  { id: 'daily', name: 'Daily', days: 1 },
  { id: 'weekly', name: 'Weekly', days: 7 },
  { id: 'biweekly', name: 'Bi-weekly', days: 14 },
  { id: 'monthly', name: 'Monthly', days: 30 },
  { id: 'quarterly', name: 'Quarterly', days: 91 },
  { id: 'yearly', name: 'Yearly', days: 365 },
];

export const DATE_RANGES = [
  { id: 'today', name: 'Today' },
  { id: 'week', name: 'This Week' },
  { id: 'month', name: 'This Month' },
  { id: 'quarter', name: 'This Quarter' },
  { id: 'year', name: 'This Year' },
  { id: 'custom', name: 'Custom Range' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CHART_TYPES = {
  PIE: 'pie',
  BAR: 'bar',
  LINE: 'line',
  DONUT: 'donut',
  RADAR: 'radar',
};
