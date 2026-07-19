import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { parseISO, format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';

export const useAnalytics = (dateRange = 'month') => {
  const expenses = useSelector(state => state.expenses.items);
  const categories = useSelector(state => state.expenses.categories);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let start, end;
    switch (dateRange) {
      case 'week': start = new Date(now.setDate(now.getDate() - 7)); end = new Date(); break;
      case 'month': start = startOfMonth(now); end = endOfMonth(now); break;
      case 'year': start = new Date(now.getFullYear(), 0, 1); end = new Date(now.getFullYear(), 11, 31); break;
      default: start = startOfMonth(now); end = endOfMonth(now);
    }
    return expenses.filter(e => isWithinInterval(parseISO(e.date), { start, end }));
  }, [expenses, dateRange]);

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    filteredExpenses.forEach(e => {
      if (!breakdown[e.category]) breakdown[e.category] = 0;
      breakdown[e.category] += parseFloat(e.amount);
    });
    return Object.entries(breakdown).map(([id, amount]) => {
      const cat = categories.find(c => c.id === id);
      return { id, name: cat?.name || 'Unknown', amount, color: cat?.color || '#999', percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0 };
    }).sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, categories, totalSpent]);

  return { filteredExpenses, totalSpent, categoryBreakdown, transactionCount: filteredExpenses.length };
};
