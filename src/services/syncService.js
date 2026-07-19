import { api } from './api';

export const syncService = {
  async syncExpenses(userId, expenses) {
    try { return await api.syncData(userId, { expenses }); }
    catch (error) { console.error('Sync failed:', error); throw error; }
  },
  async backupData(data) {
    // Implement cloud backup logic
    console.log('Backing up data...');
  },
};
