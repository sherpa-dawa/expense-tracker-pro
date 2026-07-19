import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (error) { console.error('Auth check error:', error); }
    finally { setLoading(false); }
  };

  const login = async (email, password) => {
    const mockUser = { id: '1', email, name: email.split('@')[0], avatar: null, createdAt: new Date().toISOString() };
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const register = async (email, password, name) => {
    const newUser = { id: Date.now().toString(), email, name, avatar: null, createdAt: new Date().toISOString() };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
