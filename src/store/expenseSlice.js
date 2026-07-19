import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Async thunks for cloud sync
export const syncExpenses = createAsyncThunk(
  'expenses/sync',
  async (_, { getState }) => {
    const { expenses } = getState();
    // Sync logic here
    return expenses.items;
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],
    categories: [
      { id: 'food', name: 'Food & Dining', icon: 'restaurant', color: '#FF6B6B', budget: 500 },
      { id: 'transport', name: 'Transportation', icon: 'car', color: '#4ECDC4', budget: 300 },
      { id: 'shopping', name: 'Shopping', icon: 'shopping-bag', color: '#45B7D1', budget: 400 },
      { id: 'entertainment', name: 'Entertainment', icon: 'film', color: '#96CEB4', budget: 200 },
      { id: 'bills', name: 'Bills & Utilities', icon: 'bolt', color: '#FFEAA7', budget: 600 },
      { id: 'health', name: 'Health & Fitness', icon: 'heart', color: '#DDA0DD', budget: 150 },
      { id: 'education', name: 'Education', icon: 'book', color: '#98D8C8', budget: 200 },
      { id: 'travel', name: 'Travel', icon: 'plane', color: '#F7DC6F', budget: 300 },
      { id: 'groceries', name: 'Groceries', icon: 'shopping-cart', color: '#BB8FCE', budget: 400 },
      { id: 'other', name: 'Other', icon: 'more-horizontal', color: '#AAB7B8', budget: 100 },
    ],
    filters: {
      dateRange: 'month',
      category: null,
      searchQuery: '',
      sortBy: 'date',
      sortOrder: 'desc',
    },
    loading: false,
    error: null,
    lastSync: null,
  },
  reducers: {
    addExpense: (state, action) => {
      const newExpense = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRecurring: action.payload.isRecurring || false,
        receiptImage: action.payload.receiptImage || null,
        location: action.payload.location || null,
        tags: action.payload.tags || [],
        groupId: action.payload.groupId || null,
        splitWith: action.payload.splitWith || [],
      };
      state.items.unshift(newExpense);
    },
    updateExpense: (state, action) => {
      const index = state.items.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteExpense: (state, action) => {
      state.items = state.items.filter(e => e.id !== action.payload);
    },
    addCategory: (state, action) => {
      state.categories.push({
        id: uuidv4(),
        ...action.payload,
      });
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = { ...state.categories[index], ...action.payload };
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        dateRange: 'month',
        category: null,
        searchQuery: '',
        sortBy: 'date',
        sortOrder: 'desc',
      };
    },
    bulkDelete: (state, action) => {
      state.items = state.items.filter(e => !action.payload.includes(e.id));
    },
    importExpenses: (state, action) => {
      state.items = [...action.payload, ...state.items];
    },
    clearAllExpenses: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSync = new Date().toISOString();
      })
      .addCase(syncExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addExpense,
  updateExpense,
  deleteExpense,
  addCategory,
  updateCategory,
  deleteCategory,
  setFilters,
  clearFilters,
  bulkDelete,
  importExpenses,
  clearAllExpenses,
} = expenseSlice.actions;

export default expenseSlice.reducer;
