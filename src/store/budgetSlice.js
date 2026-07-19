import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const budgetSlice = createSlice({
  name: 'budgets',
  initialState: {
    monthlyBudgets: [],
    categoryBudgets: [],
    alerts: [],
    savingsGoals: [],
    activeBudgetId: null,
  },
  reducers: {
    setMonthlyBudget: (state, action) => {
      const existing = state.monthlyBudgets.find(
        b => b.month === action.payload.month && b.year === action.payload.year
      );
      if (existing) {
        existing.amount = action.payload.amount;
      } else {
        state.monthlyBudgets.push({
          id: uuidv4(),
          ...action.payload,
          createdAt: new Date().toISOString(),
        });
      }
    },
    setCategoryBudget: (state, action) => {
      const existing = state.categoryBudgets.find(
        b => b.categoryId === action.payload.categoryId && b.month === action.payload.month
      );
      if (existing) {
        existing.amount = action.payload.amount;
      } else {
        state.categoryBudgets.push({
          id: uuidv4(),
          ...action.payload,
          createdAt: new Date().toISOString(),
        });
      }
    },
    addSavingsGoal: (state, action) => {
      state.savingsGoals.push({
        id: uuidv4(),
        ...action.payload,
        currentAmount: 0,
        createdAt: new Date().toISOString(),
      });
    },
    updateSavingsGoal: (state, action) => {
      const index = state.savingsGoals.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.savingsGoals[index] = { ...state.savingsGoals[index], ...action.payload };
      }
    },
    contributeToGoal: (state, action) => {
      const goal = state.savingsGoals.find(g => g.id === action.payload.goalId);
      if (goal) {
        goal.currentAmount += action.payload.amount;
      }
    },
    deleteSavingsGoal: (state, action) => {
      state.savingsGoals = state.savingsGoals.filter(g => g.id !== action.payload);
    },
    addAlert: (state, action) => {
      state.alerts.push({
        id: uuidv4(),
        ...action.payload,
        read: false,
        createdAt: new Date().toISOString(),
      });
    },
    markAlertRead: (state, action) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) alert.read = true;
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
  },
});

export const {
  setMonthlyBudget,
  setCategoryBudget,
  addSavingsGoal,
  updateSavingsGoal,
  contributeToGoal,
  deleteSavingsGoal,
  addAlert,
  markAlertRead,
  clearAlerts,
} = budgetSlice.actions;

export default budgetSlice.reducer;
