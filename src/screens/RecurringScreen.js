import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const RecurringScreen = () => {
  const { theme } = useTheme();
  const { currency } = useCurrency();
  const expenses = useSelector(state => state.expenses.items.filter(e => e.isRecurring));
  const frequencies = { daily: 'Every day', weekly: 'Every week', biweekly: 'Every 2 weeks', monthly: 'Every month', quarterly: 'Every 3 months', yearly: 'Every year' };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Recurring</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {expenses.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.card }]}>
            <Ionicons name="repeat" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Recurring Expenses</Text>
            <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>Set up automatic tracking for bills and subscriptions</Text>
          </View>
        ) : (
          expenses.map(expense => (
            <View key={expense.id} style={[styles.recurringCard, { backgroundColor: theme.card }]}>
              <View style={styles.recurringHeader}>
                <View>
                  <Text style={[styles.recurringTitle, { color: theme.text }]}>{expense.title}</Text>
                  <Text style={[styles.recurringFreq, { color: theme.textMuted }]}>{frequencies[expense.recurringFrequency] || 'Monthly'}</Text>
                </View>
                <Text style={[styles.recurringAmount, { color: theme.danger }]}>{formatCurrency(expense.amount, currency)}</Text>
              </View>
              <View style={styles.recurringFooter}>
                <Text style={[styles.nextPayment, { color: theme.textSecondary }]}>Next: {formatDate(expense.date, 'MMM dd, yyyy')}</Text>
                <Switch value={true} trackColor={{ false: theme.border, true: theme.primary + '80' }} thumbColor={theme.primary} />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  addBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyCard: { borderRadius: 20, padding: 40, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: 'center' },
  recurringCard: { borderRadius: 16, padding: 20, marginBottom: 12 },
  recurringHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  recurringTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  recurringFreq: { fontSize: 13 },
  recurringAmount: { fontSize: 18, fontWeight: 'bold' },
  recurringFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nextPayment: { fontSize: 13 },
});

export default RecurringScreen;
