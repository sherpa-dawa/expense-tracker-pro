import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { parseISO, format, startOfMonth, endOfMonth, isWithinInterval, subDays, eachDayOfInterval } from 'date-fns';

import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 40;

const AnalyticsScreen = () => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const expenses = useSelector(state => state.expenses.items);
  const categories = useSelector(state => state.expenses.categories);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'pie-chart' },
    { id: 'trends', label: 'Trends', icon: 'trending-up' },
    { id: 'categories', label: 'Categories', icon: 'grid' },
  ];

  const now = new Date();
  const { start, end } = useMemo(() => {
    switch (dateRange) {
      case 'week': return { start: subDays(now, 7), end: now };
      case 'year': return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear(), 11, 31) };
      default: return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  }, [dateRange, now]);

  const filteredExpenses = expenses.filter(e => isWithinInterval(parseISO(e.date), { start, end }));
  const totalSpent = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const transactionCount = filteredExpenses.length;
  const averageTransaction = transactionCount > 0 ? totalSpent / transactionCount : 0;

  const categoryData = useMemo(() => {
    const breakdown = {};
    filteredExpenses.forEach(e => { if (!breakdown[e.category]) breakdown[e.category] = 0; breakdown[e.category] += parseFloat(e.amount); });
    return Object.entries(breakdown).map(([id, amount]) => {
      const cat = categories.find(c => c.id === id);
      return { name: cat?.name || 'Unknown', amount, color: cat?.color || '#999', percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0 };
    }).sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, categories, totalSpent]);

  const dailyData = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(now, 29), end: now });
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayExp = expenses.filter(e => format(parseISO(e.date), 'yyyy-MM-dd') === dayStr);
      return { day: format(day, 'dd'), amount: dayExp.reduce((s, e) => s + parseFloat(e.amount), 0) };
    });
  }, [expenses, now]);

  const maxDaily = Math.max(...dailyData.map(d => d.amount), 1);

  const renderOverview = () => (
    <>
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.danger + '20' }]}><Ionicons name="trending-down" size={20} color={theme.danger} /></View>
          <Text style={[styles.summaryValue, { color: theme.text }]}>{formatAmount(totalSpent)}</Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Total Spent</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.primary + '20' }]}><Ionicons name="receipt" size={20} color={theme.primary} /></View>
          <Text style={[styles.summaryValue, { color: theme.text }]}>{transactionCount}</Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Transactions</Text>
        </View>
      </View>
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.accent + '20' }]}><Ionicons name="calculator" size={20} color={theme.accent} /></View>
          <Text style={[styles.summaryValue, { color: theme.text }]}>{formatAmount(averageTransaction)}</Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Average</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.warning + '20' }]}><Ionicons name="calendar" size={20} color={theme.warning} /></View>
          <Text style={[styles.summaryValue, { color: theme.text }]}>{formatAmount(totalSpent / 30)}</Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Daily Avg</Text>
        </View>
      </View>

      {categoryData.length > 0 && (
        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Spending by Category</Text>
          <View style={styles.pieContainer}>
            {categoryData.slice(0, 6).map((cat, i) => (
              <View key={i} style={styles.pieSlice}>
                <View style={[styles.pieDot, { backgroundColor: cat.color }]} />
                <Text style={[styles.pieLabel, { color: theme.text }]} numberOfLines={1}>{cat.name}</Text>
                <Text style={[styles.piePercent, { color: theme.textMuted }]}>{cat.percentage.toFixed(0)}%</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );

  const renderTrends = () => (
    <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
      <Text style={[styles.chartTitle, { color: theme.text }]}>Daily Spending (30 Days)</Text>
      <View style={styles.barChart}>
        {dailyData.map((d, i) => (
          <View key={i} style={styles.barColumn}>
            <View style={[styles.bar, { height: `${(d.amount / maxDaily) * 100}%`, backgroundColor: d.amount > 0 ? theme.primary : theme.border }]} />
            {i % 5 === 0 && <Text style={[styles.barLabel, { color: theme.textMuted }]}>{d.day}</Text>}
          </View>
        ))}
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
      <Text style={[styles.chartTitle, { color: theme.text }]}>Category Breakdown</Text>
      {categoryData.map((cat, i) => (
        <View key={i} style={styles.catRow}>
          <View style={styles.catLeft}>
            <View style={[styles.catDot, { backgroundColor: cat.color }]} />
            <Text style={[styles.catName, { color: theme.text }]}>{cat.name}</Text>
          </View>
          <View style={styles.catRight}>
            <Text style={[styles.catAmount, { color: theme.text }]}>{formatAmount(cat.amount)}</Text>
            <Text style={[styles.catPercent, { color: theme.textMuted }]}>{cat.percentage.toFixed(1)}%</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Analytics</Text>
        <View style={styles.dateRangeSelector}>
          {['week', 'month', 'year'].map(range => (
            <TouchableOpacity key={range} style={[styles.rangeBtn, dateRange === range && { backgroundColor: theme.primary }]} onPress={() => setDateRange(range)}>
              <Text style={[styles.rangeText, { color: dateRange === range ? '#fff' : theme.textSecondary }]}>{range.charAt(0).toUpperCase() + range.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={[styles.tabBar, { backgroundColor: theme.surface }]}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab.id} style={[styles.tab, activeTab === tab.id && { backgroundColor: theme.primary + '15' }]} onPress={() => setActiveTab(tab.id)}>
            <Ionicons name={tab.icon} size={18} color={activeTab === tab.id ? theme.primary : theme.textMuted} />
            <Text style={[styles.tabText, { color: activeTab === tab.id ? theme.primary : theme.textMuted }]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'trends' && renderTrends()}
        {activeTab === 'categories' && renderCategories()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  dateRangeSelector: { flexDirection: 'row', gap: 8 },
  rangeBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
  rangeText: { fontSize: 13, fontWeight: '600' },
  tabBar: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 16, padding: 4, marginBottom: 20 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, gap: 4 },
  tabText: { fontSize: 11, fontWeight: '500' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center' },
  summaryIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  summaryValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  summaryLabel: { fontSize: 12 },
  chartCard: { borderRadius: 20, padding: 20, marginBottom: 16 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  pieContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  pieSlice: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '48%' },
  pieDot: { width: 12, height: 12, borderRadius: 6 },
  pieLabel: { fontSize: 13, fontWeight: '600', flex: 1 },
  piePercent: { fontSize: 12 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 150, paddingTop: 20 },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  bar: { width: 6, borderRadius: 3, minHeight: 2 },
  barLabel: { fontSize: 10, marginTop: 6 },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catDot: { width: 12, height: 12, borderRadius: 6 },
  catName: { fontSize: 15, fontWeight: '600' },
  catRight: { alignItems: 'flex-end' },
  catAmount: { fontSize: 15, fontWeight: 'bold' },
  catPercent: { fontSize: 12, marginTop: 2 },
});

export default AnalyticsScreen;
