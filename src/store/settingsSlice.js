import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    theme: 'dark',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      dailyReminder: true,
      budgetAlerts: true,
      billReminders: true,
      weeklyReport: true,
    },
    exportFormat: 'csv',
    backupEnabled: true,
    autoSync: true,
    hapticFeedback: true,
    soundEffects: false,
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setDateFormat: (state, action) => {
      state.dateFormat = action.payload;
    },
    toggleNotification: (state, action) => {
      const { key, value } = action.payload;
      state.notifications[key] = value;
    },
    setExportFormat: (state, action) => {
      state.exportFormat = action.payload;
    },
    toggleBackup: (state) => {
      state.backupEnabled = !state.backupEnabled;
    },
    toggleAutoSync: (state) => {
      state.autoSync = !state.autoSync;
    },
    toggleHaptic: (state) => {
      state.hapticFeedback = !state.hapticFeedback;
    },
    resetSettings: (state) => {
      return settingsSlice.getInitialState();
    },
  },
});

export const {
  setTheme,
  setCurrency,
  setDateFormat,
  toggleNotification,
  setExportFormat,
  toggleBackup,
  toggleAutoSync,
  toggleHaptic,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
