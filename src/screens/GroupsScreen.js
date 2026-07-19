import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

const GroupsScreen = () => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([
    { id: '1', name: 'Roommates', members: ['You', 'Alex', 'Sam'], total: 450, yourShare: 150 },
    { id: '2', name: 'Trip to Bali', members: ['You', 'Mike', 'Sarah', 'John'], total: 2400, yourShare: 600 },
  ]);

  const createGroup = () => {
    if (!groupName.trim()) return;
    setGroups([...groups, { id: Date.now().toString(), name: groupName.trim(), members: ['You'], total: 0, yourShare: 0 }]);
    setGroupName(''); setShowModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Groups</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {groups.map(group => (
          <TouchableOpacity key={group.id} style={[styles.groupCard, { backgroundColor: theme.card }]}>
            <View style={[styles.groupIcon, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="people" size={24} color={theme.primary} />
            </View>
            <View style={styles.groupInfo}>
              <Text style={[styles.groupName, { color: theme.text }]}>{group.name}</Text>
              <Text style={[styles.groupMembers, { color: theme.textMuted }]}>{group.members.length} members</Text>
            </View>
            <View style={styles.groupAmounts}>
              <Text style={[styles.groupTotal, { color: theme.text }]}>{formatAmount(group.total)}</Text>
              <Text style={[styles.yourShare, { color: theme.primary }]}>You: {formatAmount(group.yourShare)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>New Group</Text>
            <TextInput style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]} value={groupName} onChangeText={setGroupName} placeholder="Group name" placeholderTextColor={theme.textMuted} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.border }]} onPress={() => setShowModal(false)}><Text style={[styles.btnText, { color: theme.text }]}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={createGroup}><Text style={[styles.btnText, { color: '#fff' }]}>Create</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  addBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  groupCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 12 },
  groupIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  groupInfo: { flex: 1 },
  groupName: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  groupMembers: { fontSize: 13 },
  groupAmounts: { alignItems: 'flex-end' },
  groupTotal: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  yourShare: { fontSize: 13, fontWeight: '500' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '600' },
});

export default GroupsScreen;
