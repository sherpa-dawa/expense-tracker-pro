import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', action: () => {} },
    { icon: 'notifications-outline', label: 'Notifications', action: () => {} },
    { icon: 'shield-checkmark-outline', label: 'Security', action: () => {} },
    { icon: 'card-outline', label: 'Payment Methods', action: () => {} },
    { icon: 'help-circle-outline', label: 'Help & Support', action: () => {} },
    { icon: 'document-text-outline', label: 'Privacy Policy', action: () => {} },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={theme.text} /></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'U'}</Text>
          </View>
          <Text style={[styles.name, { color: theme.text }]}>{user?.name || 'User'}</Text>
          <Text style={[styles.email, { color: theme.textMuted }]}>{user?.email || 'user@example.com'}</Text>
          <TouchableOpacity style={[styles.editBtn, { borderColor: theme.primary }]}>
            <Text style={[styles.editText, { color: theme.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.menuCard, { backgroundColor: theme.card }]}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity key={idx} style={[styles.menuItem, idx !== menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]} onPress={item.action}>
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={20} color={theme.primary} />
                <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.danger + '15' }]} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={theme.danger} />
          <Text style={[styles.logoutText, { color: theme.danger }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  profileCard: { marginHorizontal: 20, borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 14, marginBottom: 16 },
  editBtn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 8 },
  editText: { fontSize: 14, fontWeight: '600' },
  menuCard: { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 20 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuLabel: { fontSize: 15, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 20, paddingVertical: 16, borderRadius: 16, marginBottom: 40 },
  logoutText: { fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen;
