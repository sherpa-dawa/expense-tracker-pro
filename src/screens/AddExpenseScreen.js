import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Image, Animated, Alert, Modal
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { addExpense } from '../store/expenseSlice';

const AddExpenseScreen = ({ route }) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const categories = useSelector(state => state.expenses.categories);
  const editingExpense = route?.params?.expense;

  const [amount, setAmount] = useState(editingExpense?.amount?.toString() || '');
  const [title, setTitle] = useState(editingExpense?.title || '');
  const [selectedCategory, setSelectedCategory] = useState(editingExpense?.category || null);
  const [date, setDate] = useState(editingExpense ? new Date(editingExpense.date) : new Date());
  const [note, setNote] = useState(editingExpense?.note || '');
  const [paymentMethod, setPaymentMethod] = useState(editingExpense?.paymentMethod || 'cash');
  const [receiptImage, setReceiptImage] = useState(editingExpense?.receiptImage || null);
  const [tags, setTags] = useState(editingExpense?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isRecurring, setIsRecurring] = useState(editingExpense?.isRecurring || false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: 'cash' },
    { id: 'credit', name: 'Credit Card', icon: 'card-outline' },
    { id: 'debit', name: 'Debit Card', icon: 'card' },
    { id: 'bank', name: 'Bank Transfer', icon: 'swap-horizontal' },
    { id: 'digital', name: 'Digital Wallet', icon: 'phone-portrait' },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) newErrors.amount = 'Enter a valid amount';
    if (!title.trim()) newErrors.title = 'Enter a description';
    if (!selectedCategory) newErrors.category = 'Select a category';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    dispatch(addExpense({
      amount: parseFloat(amount),
      title: title.trim(),
      category: selectedCategory,
      date: date.toISOString(),
      note: note.trim(),
      paymentMethod,
      receiptImage,
      tags,
      isRecurring,
    }));
    setShowSuccess(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setTimeout(() => { setShowSuccess(false); navigation.goBack(); }, 1200);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled) setReceiptImage(result.assets[0].uri);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags([...tags, tagInput.trim()]); setTagInput(''); }
  };
  const removeTag = (t) => setTags(tags.filter(tag => tag !== t));

  const adjustDate = (days) => { const d = new Date(date); d.setDate(d.getDate() + days); setDate(d); };
  const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={24} color={theme.text} /></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{editingExpense ? 'Edit' : 'New'} Expense</Text>
        <TouchableOpacity onPress={handleSave}><Text style={[styles.saveBtnText, { color: theme.primary }]}>Save</Text></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.amountSection}>
          <Text style={[styles.currencySymbol, { color: theme.textMuted }]}>$</Text>
          <TextInput style={[styles.amountInput, { color: theme.text }]} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={theme.textMuted} />
        </View>
        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

        <View style={[styles.inputCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.textMuted }]}>Description</Text>
          <TextInput style={[styles.input, { color: theme.text }]} value={title} onChangeText={setTitle} placeholder="What did you spend on?" placeholderTextColor={theme.textMuted} />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <TouchableOpacity style={[styles.inputCard, { backgroundColor: theme.card }]} onPress={() => setShowCategoryModal(true)}>
          <Text style={[styles.label, { color: theme.textMuted }]}>Category</Text>
          <View style={styles.selectorRow}>
            {selectedCategory ? (
              <>
                <View style={[styles.selectorIcon, { backgroundColor: categories.find(c => c.id === selectedCategory)?.color + '20' }]}>
                  <Ionicons name={categories.find(c => c.id === selectedCategory)?.icon} size={20} color={categories.find(c => c.id === selectedCategory)?.color} />
                </View>
                <Text style={[styles.selectorText, { color: theme.text }]}>{categories.find(c => c.id === selectedCategory)?.name}</Text>
              </>
            ) : <Text style={[styles.placeholder, { color: theme.textMuted }]}>Select category</Text>}
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </TouchableOpacity>

        <View style={styles.row}>
          <View style={[styles.halfCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.textMuted }]}>Date</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity onPress={() => adjustDate(-1)}><Ionicons name="chevron-back" size={20} color={theme.primary} /></TouchableOpacity>
              <Text style={[styles.dateText, { color: theme.text }]}>{formatDate(date)}</Text>
              <TouchableOpacity onPress={() => adjustDate(1)}><Ionicons name="chevron-forward" size={20} color={theme.primary} /></TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={[styles.halfCard, { backgroundColor: theme.card }]} onPress={() => setShowPaymentModal(true)}>
            <Text style={[styles.label, { color: theme.textMuted }]}>Payment</Text>
            <View style={styles.selectorRow}>
              <Ionicons name={paymentMethods.find(p => p.id === paymentMethod)?.icon} size={18} color={theme.primary} />
              <Text style={[styles.selectorText, { color: theme.text }]}>{paymentMethods.find(p => p.id === paymentMethod)?.name}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.inputCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.textMuted }]}>Note</Text>
          <TextInput style={[styles.input, { color: theme.text }]} value={note} onChangeText={setNote} placeholder="Add a note..." placeholderTextColor={theme.textMuted} multiline numberOfLines={3} />
        </View>

        <View style={[styles.inputCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.textMuted }]}>Tags</Text>
          <View style={styles.tagRow}>
            <TextInput style={[styles.tagInput, { color: theme.text, borderColor: theme.border }]} value={tagInput} onChangeText={setTagInput} placeholder="Add tag..." placeholderTextColor={theme.textMuted} onSubmitEditing={addTag} />
            <TouchableOpacity style={[styles.addTagBtn, { backgroundColor: theme.primary }]} onPress={addTag}><Ionicons name="add" size={20} color="#fff" /></TouchableOpacity>
          </View>
          <View style={styles.tagsWrap}>
            {tags.map(tag => (
              <View key={tag} style={[styles.tag, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.tagText, { color: theme.primary }]}>{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(tag)}><Ionicons name="close-circle" size={16} color={theme.primary} /></TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.inputCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.textMuted }]}>Receipt</Text>
          {receiptImage ? (
            <View style={styles.receiptPreview}>
              <Image source={{ uri: receiptImage }} style={styles.receiptImage} />
              <TouchableOpacity style={styles.removeReceipt} onPress={() => setReceiptImage(null)}><Ionicons name="close-circle" size={24} color="#fff" /></TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.receiptBtn, { borderColor: theme.border }]} onPress={pickImage}>
              <Ionicons name="image-outline" size={24} color={theme.primary} />
              <Text style={[styles.receiptBtnText, { color: theme.textSecondary }]}>Upload from Gallery</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.inputCard, { backgroundColor: theme.card }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Ionicons name="repeat" size={20} color={theme.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.toggleTitle, { color: theme.text }]}>Recurring</Text>
                <Text style={[styles.toggleSub, { color: theme.textMuted }]}>{isRecurring ? 'Monthly' : 'One-time'}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.toggle, { backgroundColor: isRecurring ? theme.primary : theme.border }]} onPress={() => setIsRecurring(!isRecurring)}>
              <View style={[styles.toggleKnob, { transform: [{ translateX: isRecurring ? 20 : 0 }], backgroundColor: '#fff' }]} />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{showSuccess ? '✓ Saved!' : editingExpense ? 'Update' : 'Add'} Expense</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Category</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {categories.map(cat => (
                <TouchableOpacity key={cat.id} style={[styles.modalItem, selectedCategory === cat.id && { backgroundColor: theme.primary + '15' }]} onPress={() => { setSelectedCategory(cat.id); setShowCategoryModal(false); }}>
                  <View style={[styles.modalIcon, { backgroundColor: cat.color + '20' }]}><Ionicons name={cat.icon} size={22} color={cat.color} /></View>
                  <Text style={[styles.modalItemText, { color: theme.text }]}>{cat.name}</Text>
                  {selectedCategory === cat.id && <Ionicons name="checkmark" size={22} color={theme.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={[styles.modalClose, { backgroundColor: theme.border }]} onPress={() => setShowCategoryModal(false)}>
              <Text style={[styles.modalCloseText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Payment Method</Text>
            {paymentMethods.map(method => (
              <TouchableOpacity key={method.id} style={[styles.modalItem, paymentMethod === method.id && { backgroundColor: theme.primary + '15' }]} onPress={() => { setPaymentMethod(method.id); setShowPaymentModal(false); }}>
                <Ionicons name={method.icon} size={22} color={theme.primary} />
                <Text style={[styles.modalItemText, { color: theme.text }]}>{method.name}</Text>
                {paymentMethod === method.id && <Ionicons name="checkmark" size={22} color={theme.primary} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.modalClose, { backgroundColor: theme.border }]} onPress={() => setShowPaymentModal(false)}>
              <Text style={[styles.modalCloseText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  saveBtnText: { fontSize: 16, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  amountSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 30 },
  currencySymbol: { fontSize: 40, fontWeight: 'bold', marginRight: 8 },
  amountInput: { fontSize: 56, fontWeight: 'bold', minWidth: 150, textAlign: 'center' },
  inputCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '500', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { fontSize: 16, paddingVertical: 8 },
  selectorRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  selectorIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  selectorText: { flex: 1, fontSize: 16, fontWeight: '600' },
  placeholder: { flex: 1, fontSize: 16,  },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  halfCard: { flex: 1, borderRadius: 16, padding: 16 },
  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  dateText: { fontSize: 15, fontWeight: '600' },
  tagRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  tagInput: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,  },
  addTagBtn: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 13, fontWeight: '500' },
  receiptBtn: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, paddingVertical: 20, alignItems: 'center', gap: 8, marginTop: 8 },
  receiptBtnText: { fontSize: 13, fontWeight: '500' },
  receiptPreview: { marginTop: 8, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  receiptImage: { width: '100%', height: 200, borderRadius: 12 },
  removeReceipt: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  toggleTitle: { fontSize: 15, fontWeight: '600' },
  toggleSub: { fontSize: 13, marginTop: 2 },
  toggle: { width: 50, height: 28, borderRadius: 14, padding: 2 },
  toggleKnob: { width: 24, height: 24, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  saveButton: { marginTop: 20, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: '70%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, marginBottom: 4 },
  modalIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  modalItemText: { flex: 1, fontSize: 16, fontWeight: '600' },
  modalClose: { marginTop: 16, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalCloseText: { fontSize: 16, fontWeight: '600' },
});

export default AddExpenseScreen;
