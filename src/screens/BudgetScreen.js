import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { parseISO, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  setMonthlyBudget, 
  setCategoryBudget, 
  addSavingsGoal, 
  updateSavingsGoal,
  contributeToGoal,
  deleteSavingsGoal,
  addAlert 
} from '../store/budgetSlice';
import { formatCurrency } from '../utils/formatters';

const BudgetScreen = () => {
  const { theme } = useTheme();
  const { currency } = useCurrency();
  const dispatch = useDispatch();

  const expenses = useSelector(state => state.expenses.items);
  const categories = useSelector(state => state.expenses.categories);
  const { monthlyBudgets, categoryBudgets, savingsGoals, alerts } = useSelector(state => state.budgets);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalIcon, setGoalIcon] = useState('car');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyBudget = monthlyBudgets.find(
    b => b.month === currentMonth && b.year === currentYear
  );
  const budgetLimit = monthlyBudget?.amount || 0;

  const currentMonthExpenses = expenses.filter(e => {
    const eDate = parseISO(e.date);
    return isWithinInterval(eDate, { start: startOfMonth(now), end: endOfMonth(now) });
  });

  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const remaining = budgetLimit - totalSpent;
  const progress = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;

  const getCategorySpending = (catId) => {
    return currentMonthExpenses
      .filter(e => e.category === catId)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
  };

  const getCategoryBudget = (catId) => {
    const catBudget = categoryBudgets.find(
      b => b.categoryId === catId && b.month === currentMonth
    );
    return catBudget?.amount || 0;
  };

  const handleSetBudget = () => {
    const amount = parseFloat(budgetAmount);
    if (amount > 0) {
      dispatch(setMonthlyBudget({
        month: currentMonth,
        year: currentYear,
        amount,
      }));
      setShowBudgetModal(false);
      setBudgetAmount('');
    }
  };

  const handleAddGoal = () => {
    const target = parseFloat(goalAmount);
    if (goalName.trim() && target > 0) {
      dispatch(addSavingsGoal({
        name: goalName.trim(),
        targetAmount: target,
        deadline: goalDeadline || null,
        icon: goalIcon,
        color: theme.primary,
      }));
      setShowGoalModal(false);
      setGoalName('');
      setGoalAmount('');
      setGoalDeadline('');
    }
  };

  const handleContribute = (goalId, amount) => {
    dispatch(contributeToGoal({ goalId, amount: parseFloat(amount) }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'wallet' },
    { id: 'categories', label: 'Categories', icon: 'grid' },
    { id: 'goals', label: 'Goals', icon: 'trophy' },
    { id: 'alerts', label: 'Alerts', icon: 'notifications' },
  ];

  const goalIcons = ['car', 'home', 'airplane', 'phone-portrait', 'laptop', 'gift', 'medical', 'school'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Budget</Text>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={() => activeTab === 'goals' ? setShowGoalModal(true) : setShowBudgetModal(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface }]}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && { backgroundColor: theme.primary + '15' }]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons 
              name={tab.icon} 
              size={16} 
              color={activeTab === tab.id ? theme.primary : theme.textMuted} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === tab.id ? theme.primary : theme.textMuted }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'overview' && (
          <>
            {/* Main Budget Card */}
            <View style={[styles.budgetMainCard, { backgroundColor: theme.card }]}>
              <View style={styles.budgetHeader}>
                <View>
                  <Text style={[styles.budgetLabel, { color: theme.textMuted }]}>Monthly Budget</Text>
                  <Text style={[styles.budgetTotal, { color: theme.text }]}>
                    {formatCurrency(budgetLimit, currency)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowBudgetModal(true)}>
                  <Ionicons name="create-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
              </View>

              {/* Circular Progress */}
              <View style={styles.progressCircleContainer}>
                <View style={styles.progressCircle}>
                  <Text style={[styles.progressAmount, { color: theme.text }]}>
                    {formatCurrency(totalSpent, currency)}
                  </Text>
                  <Text style={[styles.progressSubtext, { color: theme.textMuted }]}>
                    of {formatCurrency(budgetLimit, currency)}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                  <View style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: progress > 90 ? theme.danger : progress > 75 ? theme.warning : theme.accent,
                    }
                  ]} />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={[styles.progressLabel, { color: theme.textMuted }]}>
                    {progress.toFixed(0)}% used
                  </Text>
                  <Text style={[styles.progressLabel, { color: theme.textMuted }]}>
                    {formatCurrency(remaining, currency)} left
                  </Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.danger }]}>
                    {formatCurrency(totalSpent, currency)}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>Spent</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.accent }]}>
                    {formatCurrency(remaining, currency)}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>Remaining</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.primary }]}>
                    {currentMonthExpenses.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>Transactions</Text>
                </View>
              </View>
            </View>

            {/* Daily Budget */}
            <View style={[styles.dailyCard, { backgroundColor: theme.card }]}>
              <View style={styles.dailyHeader}>
                <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                <Text style={[styles.dailyTitle, { color: theme.text }]}>Daily Budget</Text>
              </View>
              <Text style={[styles.dailyAmount, { color: theme.text }]}>
                {formatCurrency(remaining / (30 - now.getDate() + 1), currency)}
              </Text>
              <Text style={[styles.dailySubtext, { color: theme.textMuted }]}>
                per day for the rest of the month
              </Text>
            </View>
          </>
        )}

        {activeTab === 'categories' && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Category Budgets</Text>
            {categories.map(cat => {
              const spent = getCategorySpending(cat.id);
              const budget = getCategoryBudget(cat.id);
              const catProgress = budget > 0 ? (spent / budget) * 100 : 0;

              return (
                <View key={cat.id} style={[styles.catBudgetCard, { backgroundColor: theme.card }]}>
                  <View style={styles.catBudgetHeader}>
                    <View style={styles.catBudgetLeft}>
                      <View style={[styles.catIcon, { backgroundColor: cat.color + '20' }]}>
                        <Ionicons name={cat.icon} size={18} color={cat.color} />
                      </View>
                      <View>
                        <Text style={[styles.catName, { color: theme.text }]}>{cat.name}</Text>
                        <Text style={[styles.catSpent, { color: theme.textMuted }]}>
                          {formatCurrency(spent, currency)} spent
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => {
                        setSelectedCategory(cat.id);
                        setShowBudgetModal(true);
                      }}
                    >
                      <Text style={[styles.catBudgetAmount, { color: theme.primary }]}>
                        {budget > 0 ? formatCurrency(budget, currency) : 'Set Budget'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.catProgressBar, { backgroundColor: theme.border }]}>
                    <View style={[
                      styles.catProgressFill,
                      {
                        width: `${Math.min(catProgress, 100)}%`,
                        backgroundColor: catProgress > 90 ? theme.danger : catProgress > 75 ? theme.warning : cat.color,
                      }
                    ]} />
                  </View>
                </View>
              );
            })}
          </>
        )}

        {activeTab === 'goals' && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Savings Goals</Text>
            {savingsGoals.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: theme.card }]}>
                <Ionicons name="trophy-outline" size={48} color={theme.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No Savings Goals</Text>
                <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
                  Set a goal to start saving towards something special
                </Text>
                <TouchableOpacity 
                  style={[styles.emptyBtn, { backgroundColor: theme.primary }]}
                  onPress={() => setShowGoalModal(true)}
                >
                  <Text style={styles.emptyBtnText}>Create Goal</Text>
                </TouchableOpacity>
              </View>
            ) : (
              savingsGoals.map(goal => {
                const goalProgress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <View key={goal.id} style={[styles.goalCard, { backgroundColor: theme.card }]}>
                    <View style={styles.goalHeader}>
                      <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                        <Ionicons name={goal.icon} size={22} color={goal.color} />
                      </View>
                      <View style={styles.goalInfo}>
                        <Text style={[styles.goalName, { color: theme.text }]}>{goal.name}</Text>
                        <Text style={[styles.goalDeadline, { color: theme.textMuted }]}>
                          {goal.deadline ? `Target: ${goal.deadline}` : 'No deadline'}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => dispatch(deleteSavingsGoal(goal.id))}>
                        <Ionicons name="trash-outline" size={18} color={theme.danger} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.goalProgressSection}>
                      <View style={[styles.goalProgressBar, { backgroundColor: theme.border }]}>
                        <View style={[
                          styles.goalProgressFill,
                          { width: `${Math.min(goalProgress, 100)}%`, backgroundColor: goal.color }
                        ]} />
                      </View>
                      <View style={styles.goalAmounts}>
                        <Text style={[styles.goalCurrent, { color: theme.text }]}>
                          {formatCurrency(goal.currentAmount, currency)}
                        </Text>
                        <Text style={[styles.goalTarget, { color: theme.textMuted }]}>
                          of {formatCurrency(goal.targetAmount, currency)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={[styles.contributeBtn, { borderColor: theme.primary }]}
                      onPress={() => {
                        // Show contribute modal
                      }}
                    >
                      <Text style={[styles.contributeText, { color: theme.primary }]}>
                        + Add Contribution
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </>
        )}

        {activeTab === 'alerts' && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Budget Alerts</Text>
            {alerts.filter(a => !a.read).length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: theme.card }]}>
                <Ionicons name="checkmark-circle-outline" size={48} color={theme.accent} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>All Clear!</Text>
                <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
                  No budget alerts at the moment
                </Text>
              </View>
            ) : (
              alerts.filter(a => !a.read).map(alert => (
                <View key={alert.id} style={[styles.alertCard, { backgroundColor: theme.card }]}>
                  <View style={[styles.alertIcon, { backgroundColor: theme.warning + '20' }]}>
                    <Ionicons name="warning" size={20} color={theme.warning} />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={[styles.alertTitle, { color: theme.text }]}>{alert.title}</Text>
                    <Text style={[styles.alertDesc, { color: theme.textSecondary }]}>
                      {alert.message}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Budget Modal */}
      <Modal
        visible={showBudgetModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBudgetModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {selectedCategory ? 'Set Category Budget' : 'Set Monthly Budget'}
            </Text>
            <TextInput
              style={[styles.modalInput, { 
                color: theme.text, 
                borderColor: theme.border,
                backgroundColor: theme.card 
              }]}
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              keyboardType="decimal-pad"
              placeholder="Enter amount"
              placeholderTextColor={theme.textMuted}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: theme.border }]}
                onPress={() => setShowBudgetModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: theme.primary }]}
                onPress={handleSetBudget}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Goal Modal */}
      <Modal
        visible={showGoalModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>New Savings Goal</Text>
            <TextInput
              style={[styles.modalInput, { 
                color: theme.text, 
                borderColor: theme.border,
                backgroundColor: theme.card 
              }]}
              value={goalName}
              onChangeText={setGoalName}
              placeholder="Goal name (e.g., New Car)"
              placeholderTextColor={theme.textMuted}
            />
            <TextInput
              style={[styles.modalInput, { 
                color: theme.text, 
                borderColor: theme.border,
                backgroundColor: theme.card 
              }]}
              value={goalAmount}
              onChangeText={setGoalAmount}
              keyboardType="decimal-pad"
              placeholder="Target amount"
              placeholderTextColor={theme.textMuted}
            />
            <Text style={[styles.modalLabel, { color: theme.textMuted }]}>Choose Icon</Text>
            <View style={styles.iconGrid}>
              {goalIcons.map(icon => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    goalIcon === icon && { 
                      backgroundColor: theme.primary + '30',
                      borderColor: theme.primary 
                    }
                  ]}
                  onPress={() => setGoalIcon(icon)}
                >
                  <Ionicons name={icon} size={24} color={goalIcon === icon ? theme.primary : theme.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: theme.border }]}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: theme.primary }]}
                onPress={handleAddGoal}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  budgetMainCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  budgetLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  budgetTotal: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  progressCircleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressSubtext: {
    fontSize: 12,
    ,
    marginTop: 4,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    ,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    ,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  dailyCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  dailyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  dailyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  dailyAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dailySubtext: {
    fontSize: 13,
    ,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  catBudgetCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  catBudgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  catBudgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  catIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catName: {
    fontSize: 15,
    fontWeight: '600',
  },
  catSpent: {
    fontSize: 12,
    ,
    marginTop: 2,
  },
  catBudgetAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  catProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyCard: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    ,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  goalCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalDeadline: {
    fontSize: 12,
    ,
    marginTop: 2,
  },
  goalProgressSection: {
    marginBottom: 14,
  },
  goalProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCurrent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalTarget: {
    fontSize: 14,
    ,
  },
  contributeBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  contributeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 13,
    ,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    ,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BudgetScreen;
