import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const navigation = useNavigation();
  const expenses = useSelector(state => state.expenses.items);
  const categories = useSelector(state => state.expenses.categories);
  const budgets = useSelector(state => state.budgets);
  const user = useSelector(state => state.user.currentUser);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expDate = parseISO(expense.date);
      return isWithinInterval(expDate, { start: currentMonthStart, end: currentMonthEnd });
    });
  }, [expenses]);

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const previousMonthExpenses = expenses.filter(expense => {
    const expDate = parseISO(expense.date);
    const prevStart = startOfMonth(subMonths(now, 1));
    const prevEnd = endOfMonth(subMonths(now, 1));
    return isWithinInterval(expDate, { start: prevStart, end: prevEnd });
  });
  const previousTotal = previousMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const trendValue = previousTotal > 0 ? (((totalSpent - previousTotal) / previousTotal) * 100).toFixed(1) : '0';
  const trendDown = totalSpent < previousTotal;

  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    filteredExpenses.forEach(expense => {
      if (!breakdown[expense.category]) breakdown[expense.category] = { amount: 0, count: 0 };
      breakdown[expense.category].amount += parseFloat(expense.amount);
      breakdown[expense.category].count += 1;
    });
    return Object.entries(breakdown).map(([id, data]) => {
      const cat = categories.find(c => c.id === id);
      return { id, name: cat?.name || 'Unknown', icon: cat?.icon || 'help-circle', color: cat?.color || '#999', ...data, percentage: totalSpent > 0 ? (data.amount / totalSpent) * 100 : 0 };
    }).sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, categories, totalSpent]);

  const topCategories = categoryBreakdown.slice(0, 5);
  const recentExpenses = filteredExpenses.slice(0, 5);

  const monthlyBudget = budgets.monthlyBudgets.find(b => b.month === now.getMonth() && b.year === now.getFullYear());
  const budgetAmount = monthlyBudget?.amount || 3000;
  const budgetProgress = Math.min((totalSpent / budgetAmount) * 100, 100);
  const remainingBudget = budgetAmount - totalSpent;

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500); };
  const periods = [{ id: 'today', label: 'Today' }, { id: 'week', label: 'Week' }, { id: 'month', label: 'Month' }, { id: 'year', label: 'Year' }];

  // Simple pie chart using View components
  const renderSimplePieChart = () => {
    if (categoryBreakdown.length === 0) return null;
    let currentAngle = 0;
    return (
      <View style={styles.pieContainer}>
        <View style={styles.pieChart}>
          {categoryBreakdown.slice(0, 6).map((cat, index) => {
            const angle = (cat.percentage / 100) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;
            return (
              <View key={cat.id} style={[styles.pieSlice, {
                backgroundColor: cat.color,
                transform: [{ rotate: `${startAngle}deg` }],
                borderRadius: 100,
                position: 'absolute',
                width: 20,
                height: 20,
                left: 50 + Math.cos((startAngle + angle/2) * Math.PI / 180) * 40,
                top: 50 + Math.sin((startAngle + angle/2) * Math.PI / 180) * 40,
              }]} />
            );
          })}
          <View style={[styles.pieCenter, { backgroundColor: theme.card }]}>
            <Text style={[styles.pieTotal, { color: theme.text }]}>{formatAmount(totalSpent)}</Text>
          </View>
        </View>
        <View style={styles.pieLegend}>
          {categoryBreakdown.slice(0, 6).map(cat => (
            <View key={cat.id} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>{cat.name}</Text>
              <Text style={[styles.legendPercent, { color: theme.text }]}>{cat.percentage.toFixed(0)}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient colors={theme.gradient.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},</Text>
            <Text style={styles.userName}>{user?.name || 'Ongmu'}</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
            <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'O'}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Spent</Text>
          <Text style={styles.balanceAmount}>{formatAmount(totalSpent)}</Text>
          <View style={styles.trendContainer}>
            <View style={[styles.trendBadge, { backgroundColor: trendDown ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)' }]}>
              <Ionicons name={trendDown ? 'trend-down' : 'trend-up'} size={14} color={trendDown ? '#10B981' : '#EF4444'} />
              <Text style={[styles.trendText, { color: trendDown ? '#10B981' : '#EF4444' }]}>{trendValue}%</Text>
            </View>
            <Text style={styles.trendLabel}>vs last month</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />} contentContainerStyle={styles.scrollContent}>
        <View style={styles.periodSelector}>
          {periods.map(period => (
            <TouchableOpacity key={period.id} style={[styles.periodBtn, selectedPeriod === period.id && { backgroundColor: theme.primary }]} onPress={() => setSelectedPeriod(period.id)}>
              <Text style={[styles.periodText, { color: selectedPeriod === period.id ? '#fff' : theme.textSecondary }]}>{period.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <QuickActionButton icon="add-circle" label="Add Expense" color={theme.primary} onPress={() => navigation.navigate('AddExpense')} theme={theme} />
            <QuickActionButton icon="scan" label="Scan Receipt" color={theme.secondary} onPress={() => navigation.navigate('AddExpense')} theme={theme} />
            <QuickActionButton icon="bar-chart" label="Analytics" color={theme.info} onPress={() => navigation.navigate('Analytics')} theme={theme} />
            <QuickActionButton icon="wallet" label="Budget" color={theme.accent} onPress={() => navigation.navigate('Budget')} theme={theme} />
          </View>
        </View>

        <View style={[styles.budgetCard, { backgroundColor: theme.card }]}>
          <View style={styles.budgetHeader}>
            <View>
              <Text style={[styles.budgetTitle, { color: theme.text }]}>Monthly Budget</Text>
              <Text style={[styles.budgetSubtitle, { color: theme.textMuted }]}>{formatAmount(remainingBudget)} remaining</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Budget')}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>Manage</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View style={[styles.progressFill, { width: `${budgetProgress}%`, backgroundColor: budgetProgress > 90 ? theme.danger : budgetProgress > 75 ? theme.warning : theme.accent }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressText, { color: theme.textMuted }]}>{budgetProgress.toFixed(0)}% used</Text>
              <Text style={[styles.progressText, { color: theme.textMuted }]}>{formatAmount(budgetAmount)}</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {topCategories.map((cat, index) => (
              <TouchableOpacity key={cat.id} style={[styles.categoryCard, { backgroundColor: theme.card, marginLeft: index === 0 ? 20 : 0 }]}>
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                  <Ionicons name={cat.icon} size={24} color={cat.color} />
                </View>
                <Text style={[styles.categoryName, { color: theme.text }]} numberOfLines={1}>{cat.name}</Text>
                <Text style={[styles.categoryAmount, { color: theme.textSecondary }]}>{formatAmount(cat.amount)}</Text>
                <View style={styles.categoryBar}>
                  <View style={[styles.categoryBarFill, { width: `${cat.percentage}%`, backgroundColor: cat.color }]} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ marginBottom: 30 }}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.transactionsCard, { backgroundColor: theme.card }]}>
            {recentExpenses.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={48} color={theme.textMuted} />
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>No transactions yet</Text>
                <TouchableOpacity style={[styles.addFirstBtn, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('AddExpense')}>
                  <Text style={styles.addFirstBtnText}>Add First Expense</Text>
                </TouchableOpacity>
              </View>
            ) : (
              recentExpenses.map((expense, index) => {
                const cat = categories.find(c => c.id === expense.category);
                return (
                  <TouchableOpacity key={expense.id} style={[styles.transactionItem, index !== recentExpenses.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
                    <View style={[styles.transactionIcon, { backgroundColor: (cat?.color || theme.primary) + '20' }]}>
                      <Ionicons name={cat?.icon || 'help-circle'} size={20} color={cat?.color || theme.primary} />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={[styles.transactionTitle, { color: theme.text }]} numberOfLines={1}>{expense.title}</Text>
                      <Text style={[styles.transactionDate, { color: theme.textMuted }]}>{format(parseISO(expense.date), 'MMM dd')} • {cat?.name || 'Other'}</Text>
                    </View>
                    <Text style={[styles.transactionAmount, { color: theme.danger }]}>-{formatAmount(expense.amount)}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const QuickActionButton = ({ icon, label, color, onPress, theme }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={[styles.actionLabel, { color: theme.textSecondary }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  userName: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  profileBtn: { padding: 4 },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, color: '#fff', fontWeight: '600' },
  balanceCard: { alignItems: 'center', paddingVertical: 10 },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  balanceAmount: { fontSize: 42, color: '#fff', fontWeight: 'bold' },
  trendContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 4 },
  trendText: { fontSize: 12, fontWeight: '600' },
  trendLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  scrollContent: { paddingTop: 20 },
  periodSelector: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 24, gap: 8 },
  periodBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  periodText: { fontSize: 13, fontWeight: '600' },
  quickActions: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { alignItems: 'center', gap: 8 },
  actionIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 12 },
  budgetCard: { marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 24 },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  budgetTitle: { fontSize: 16, fontWeight: '600' },
  budgetSubtitle: { fontSize: 13, marginTop: 4 },
  seeAll: { fontSize: 13, fontWeight: '600' },
  progressContainer: { gap: 8 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  categoriesScroll: { paddingRight: 20, gap: 12 },
  categoryCard: { width: 140, padding: 16, borderRadius: 20, marginRight: 12 },
  categoryIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  categoryName: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  categoryAmount: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  categoryBar: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  categoryBarFill: { height: '100%', borderRadius: 2 },
  transactionsCard: { marginHorizontal: 20, borderRadius: 20, padding: 16, overflow: 'hidden' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  transactionIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  transactionDate: { fontSize: 12 },
  transactionAmount: { fontSize: 15, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 15, fontWeight: '500', marginTop: 12, marginBottom: 20 },
  addFirstBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  addFirstBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  pieContainer: { alignItems: 'center', marginVertical: 20 },
  pieChart: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  pieCenter: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  pieTotal: { fontSize: 14, fontWeight: 'bold' },
  pieLegend: { marginTop: 20, width: '100%' },
  legendItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  legendText: { flex: 1, fontSize: 13 },
  legendPercent: { fontSize: 13, fontWeight: '600' },
});

export default HomeScreen;
