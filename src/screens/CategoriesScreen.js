import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { addCategory, updateCategory, deleteCategory } from '../store/expenseSlice';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#E17055', '#74B9FF', '#FDCB6E', '#E84393', '#00B894', '#6C5CE7'];
const ICONS = ['restaurant', 'car', 'shopping-bag', 'film', 'bolt', 'heart', 'book', 'plane', 'shopping-cart', 'home', 'shield', 'paw', 'gift', 'trending-up', 'more-horizontal', 'phone-portrait', 'laptop', 'medical', 'school', 'game-controller'];

const CategoriesScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const categories = useSelector(state => state.expenses.categories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingCategory) dispatch(updateCategory({ id: editingCategory.id, name: name.trim(), color: selectedColor, icon: selectedIcon }));
    else dispatch(addCategory({ name: name.trim(), color: selectedColor, icon: selectedIcon }));
    closeModal();
  };

  const closeModal = () => { setShowModal(false); setEditingCategory(null); setName(''); setSelectedColor(COLORS[0]); setSelectedIcon(ICONS[0]); };
  const startEdit = (cat) => { setEditingCategory(cat); setName(cat.name); setSelectedColor(cat.color); setSelectedIcon(cat.icon); setShowModal(true); };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Categories</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {categories.map(cat => (
          <TouchableOpacity key={cat.id} style={[styles.categoryCard, { backgroundColor: theme.card }]} onPress={() => startEdit(cat)}>
            <View style={[styles.catIcon, { backgroundColor: cat.color + '20' }]}>
              <Ionicons name={cat.icon} size={22} color={cat.color} />
            </View>
            <View style={styles.catInfo}>
              <Text style={[styles.catName, { color: theme.text }]}>{cat.name}</Text>
              <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{editingCategory ? 'Edit' : 'New'} Category</Text>
            <TextInput style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]} value={name} onChangeText={setName} placeholder="Category name" placeholderTextColor={theme.textMuted} />
            <Text style={[styles.label, { color: theme.textMuted }]}>Color</Text>
            <View style={styles.colorGrid}>
              {COLORS.map(c => (
                <TouchableOpacity key={c} style={[styles.colorOption, { backgroundColor: c, borderWidth: selectedColor === c ? 3 : 0, borderColor: '#fff' }]} onPress={() => setSelectedColor(c)} />
              ))}
            </View>
            <Text style={[styles.label, { color: theme.textMuted }]}>Icon</Text>
            <View style={styles.iconGrid}>
              {ICONS.map(icon => (
                <TouchableOpacity key={icon} style={[styles.iconOption, { backgroundColor: selectedIcon === icon ? theme.primary + '30' : theme.card }]} onPress={() => setSelectedIcon(icon)}>
                  <Ionicons name={icon} size={22} color={selectedIcon === icon ? theme.primary : theme.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.border }]} onPress={closeModal}><Text style={[styles.btnText, { color: theme.text }]}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={handleSave}><Text style={[styles.btnText, { color: '#fff' }]}>Save</Text></TouchableOpacity>
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
  categoryCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 12 },
  catIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  catInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  catName: { fontSize: 16, fontWeight: '600' },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 10 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  colorOption: { width: 40, height: 40, borderRadius: 20 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  iconOption: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  modalActions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '600' },
});

export default CategoriesScreen;
