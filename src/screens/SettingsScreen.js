import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { setTheme, setCurrency, toggleNotification, toggleBackup, toggleAutoSync, toggleHaptic, resetSettings } from '../store/settingsSlice';

const SettingsScreen = () => {
  const { theme, themeName, setSpecificTheme } = useTheme();
  const { currency, setCurrency, currencies } = useCurrency();
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        { icon: 'moon', label: 'Dark Mode', type: 'toggle', value: themeName === 'dark', onToggle: () => setSpecificTheme(themeName === 'dark' ? 'light' : 'dark') },
        { icon: 'color-palette', label: 'Theme', type: 'select', value: themeName, onPress: () => {} },
      ]
    },
    {
      title: 'Currency & Region',
      items: [
        { icon: 'cash', label: 'Currency', type: 'select', value: currency, onPress: () => {} },
        { icon: 'calendar', label: 'Date Format', type: 'select', value: settings.dateFormat, onPress: () => {} },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { icon: 'notifications', label: 'Daily Reminder', type: 'toggle', value: settings.notifications.dailyReminder, onToggle: () => dispatch(toggleNotification({ key: 'dailyReminder', value: !settings.notifications.dailyReminder })) },
        { icon: 'warning', label: 'Budget Alerts', type: 'toggle', value: settings.notifications.budgetAlerts, onToggle: () => dispatch(toggleNotification({ key: 'budgetAlerts', value: !settings.notifications.budgetAlerts })) },
        { icon: 'receipt', label: 'Bill Reminders', type: 'toggle', value: settings.notifications.billReminders, onToggle: () => dispatch(toggleNotification({ key: 'billReminders', value: !settings.notifications.billReminders })) },
        { icon: 'mail', label: 'Weekly Report', type: 'toggle', value: settings.notifications.weeklyReport, onToggle: () => dispatch(toggleNotification({ key: 'weeklyReport', value: !settings.notifications.weeklyReport })) },
      ]
    },
    {
      title: 'Data & Sync',
      items: [
        { icon: 'cloud-upload', label: 'Cloud Backup', type: 'toggle', value: settings.backupEnabled, onToggle: () => dispatch(toggleBackup()) },
        { icon: 'sync', label: 'Auto Sync', type: 'toggle', value: settings.autoSync, onToggle: () => dispatch(toggleAutoSync()) },
        { icon: 'download', label: 'Export Data', type: 'action', onPress: () => {} },
        { icon: 'trash', label: 'Clear All Data', type: 'action', danger: true, onPress: () => {} },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'finger-print', label: 'Haptic Feedback', type: 'toggle', value: settings.hapticFeedback, onToggle: () => dispatch(toggleHaptic()) },
        { icon: 'volume-high', label: 'Sound Effects', type: 'toggle', value: settings.soundEffects, onToggle: () => {} },
      ]
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'U'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>{user?.name || 'Guest User'}</Text>
            <Text style={[styles.profileEmail, { color: theme.textMuted }]}>{user?.email || 'Sign in to sync'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </TouchableOpacity>

        {settingsSections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{section.title}</Text>
            <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity key={itemIdx} style={[styles.settingItem, itemIdx !== section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]} onPress={item.type === 'action' ? item.onPress : null}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: item.danger ? theme.danger + '20' : theme.primary + '15' }]}>
                      <Ionicons name={item.icon} size={18} color={item.danger ? theme.danger : theme.primary} />
                    </View>
                    <Text style={[styles.settingLabel, { color: item.danger ? theme.danger : theme.text }]}>{item.label}</Text>
                  </View>
                  {item.type === 'toggle' && <Switch value={item.value} onValueChange={item.onToggle} trackColor={{ false: theme.border, true: theme.primary + '80' }} thumbColor={item.value ? theme.primary : '#f4f3f4'} />}
                  {item.type === 'select' && <View style={styles.selectRight}><Text style={[styles.selectValue, { color: theme.textMuted }]}>{item.value}</Text><Ionicons name="chevron-forward" size={16} color={theme.textMuted} /></View>}
                  {item.type === 'action' && !item.danger && <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: theme.textMuted }]}>ExpenseTracker Pro v1.0.0</Text>
          <TouchableOpacity onPress={logout}><Text style={[styles.logout, { color: theme.danger }]}>Log Out</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  profileCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 24 },
  avatar: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  profileInfo: { flex: 1, marginLeft: 14 },
  profileName: { fontSize: 17, fontWeight: '600' },
  profileEmail: { fontSize: 13, marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginHorizontal: 20, marginBottom: 8 },
  sectionCard: { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { fontSize: 15, fontWeight: '600' },
  selectRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  selectValue: { fontSize: 14,  },
  appInfo: { alignItems: 'center', paddingVertical: 30, gap: 12 },
  appVersion: { fontSize: 13,  },
  logout: { fontSize: 15, fontWeight: '600' },
});

export default SettingsScreen;
