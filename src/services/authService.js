import * as SecureStore from 'expo-secure-store';

export const authService = {
  async storeToken(token) { await SecureStore.setItemAsync('authToken', token); },
  async getToken() { return await SecureStore.getItemAsync('authToken'); },
  async removeToken() { await SecureStore.deleteItemAsync('authToken'); },
  async storeUser(user) { await SecureStore.setItemAsync('user', JSON.stringify(user)); },
  async getUser() { const user = await SecureStore.getItemAsync('user'); return user ? JSON.parse(user) : null; },
};
