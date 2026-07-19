import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const BottomNav = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();

  const tabs = [
    { name: 'Home', icon: 'home', label: 'Home' },
    { name: 'Analytics', icon: 'bar-chart', label: 'Analytics' },
    { name: 'Add', icon: 'add-circle', label: 'Add', isCenter: true },
    { name: 'Budget', icon: 'wallet', label: 'Budget' },
    { name: 'Settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {tabs.map((tab) => {
        const isFocused = state.routes[state.index]?.name === tab.name;
        if (tab.isCenter) {
          return (
            <TouchableOpacity key={tab.name} style={[styles.centerBtn, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('AddExpense')}>
              <Ionicons name={tab.icon} size={28} color="#fff" />
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity key={tab.name} style={styles.tab} onPress={() => navigation.navigate(tab.name)}>
            <Ionicons name={isFocused ? tab.icon : `${tab.icon}-outline`} size={22} color={isFocused ? theme.primary : theme.textMuted} />
            <Text style={[styles.tabLabel, { color: isFocused ? theme.primary : theme.textMuted }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  tab: { alignItems: 'center', justifyContent: 'center', flex: 1, gap: 4 },
  tabLabel: { fontSize: 11, fontWeight: '500' },
  centerBtn: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: -30, shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
});

export default BottomNav;
