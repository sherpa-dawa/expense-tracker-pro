import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const themes = {
  dark: {
    name: 'dark',
    background: '#0A0A0F',
    surface: '#14141F',
    surfaceLight: '#1E1E2E',
    card: '#1A1A2E',
    cardHover: '#252542',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#EC4899',
    accent: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    border: '#27273A',
    borderLight: '#334155',
    success: '#10B981',
    chart: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#F97316', '#14B8A6'],
    gradient: {
      primary: ['#6366F1', '#8B5CF6'],
      success: ['#10B981', '#34D399'],
      danger: ['#EF4444', '#F87171'],
      card: ['#1A1A2E', '#14141F'],
    },
    shadow: {
      color: '#000',
      opacity: 0.3,
    },
  },
  light: {
    name: 'light',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceLight: '#F1F5F9',
    card: '#FFFFFF',
    cardHover: '#F8FAFC',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#EC4899',
    accent: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#CBD5E1',
    success: '#10B981',
    chart: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#F97316', '#14B8A6'],
    gradient: {
      primary: ['#6366F1', '#8B5CF6'],
      success: ['#10B981', '#34D399'],
      danger: ['#EF4444', '#F87171'],
      card: ['#FFFFFF', '#F8FAFC'],
    },
    shadow: {
      color: '#000',
      opacity: 0.1,
    },
  },
  midnight: {
    name: 'midnight',
    background: '#020617',
    surface: '#0F172A',
    surfaceLight: '#1E293B',
    card: '#0F172A',
    cardHover: '#1E293B',
    primary: '#38BDF8',
    primaryLight: '#7DD3FC',
    primaryDark: '#0284C7',
    secondary: '#F472B6',
    accent: '#34D399',
    danger: '#FB7185',
    warning: '#FBBF24',
    info: '#60A5FA',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#64748B',
    border: '#1E293B',
    borderLight: '#334155',
    success: '#34D399',
    chart: ['#38BDF8', '#F472B6', '#34D399', '#FBBF24', '#60A5FA', '#A78BFA', '#FB923C', '#2DD4BF'],
    gradient: {
      primary: ['#38BDF8', '#818CF8'],
      success: ['#34D399', '#6EE7B7'],
      danger: ['#FB7185', '#FDA4AF'],
      card: ['#0F172A', '#020617'],
    },
    shadow: {
      color: '#000',
      opacity: 0.4,
    },
  },
};

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [themeName, setThemeName] = useState('dark');
  const [theme, setTheme] = useState(themes.dark);

  useEffect(() => {
    if (themeName === 'system') {
      setTheme(themes[systemScheme === 'dark' ? 'dark' : 'light']);
    } else {
      setTheme(themes[themeName] || themes.dark);
    }
  }, [themeName, systemScheme]);

  const toggleTheme = () => {
    setThemeName(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setSpecificTheme = (name) => {
    setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme, setSpecificTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
