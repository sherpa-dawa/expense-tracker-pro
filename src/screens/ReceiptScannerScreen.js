import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert, Modal
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNavigation } from '@react-navigation/native';

const ReceiptScannerScreen = () => {
  const { theme } = useTheme();
  const { currency } = useCurrency();
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      processReceipt(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      processReceipt(photo.uri);
    }
  };

  const processReceipt = async (uri) => {
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setExtractedData({
        merchant: 'Whole Foods Market',
        date: new Date().toISOString(),
        total: 87.43,
        items: [
          { name: 'Organic Bananas', amount: 3.99 },
          { name: 'Almond Milk', amount: 4.49 },
          { name: 'Avocados (3)', amount: 5.97 },
          { name: 'Chicken Breast', amount: 12.99 },
          { name: 'Greek Yogurt', amount: 6.49 },
        ],
        category: 'groceries',
      });
      setScanned(true);
      setShowCamera(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to process receipt');
    } finally {
      setProcessing(false);
    }
  };

  const saveExpense = () => {
    navigation.navigate('AddExpense', {
      expense: {
        title: extractedData.merchant,
        amount: extractedData.total,
        date: extractedData.date,
        category: extractedData.category,
      }
    });
  };

  // Camera permission screen
  if (!permission?.granted && showCamera) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="camera-outline" size={64} color={theme.textMuted} />
        <Text style={[styles.text, { color: theme.text, marginTop: 20 }]}>Camera permission required</Text>
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary, marginTop: 20 }]} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 16 }} onPress={() => setShowCamera(false)}>
          <Text style={{ color: theme.textMuted }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Receipt result screen
  if (scanned && extractedData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScanned(false)}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Receipt Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.resultContent}>
          <View style={[styles.receiptCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.merchantName, { color: theme.text }]}>{extractedData.merchant}</Text>
            <Text style={[styles.receiptDate, { color: theme.textMuted }]}>
              {new Date(extractedData.date).toLocaleDateString()}
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            {extractedData.items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text style={[styles.itemName, { color: theme.textSecondary }]}>{item.name}</Text>
                <Text style={[styles.itemAmount, { color: theme.text }]}>${item.amount.toFixed(2)}</Text>
              </View>
            ))}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
              <Text style={[styles.totalAmount, { color: theme.primary }]}>${extractedData.total.toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={saveExpense}>
            <Text style={styles.saveBtnText}>Save as Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.retakeBtn, { borderColor: theme.border }]} onPress={() => setScanned(false)}>
            <Text style={[styles.retakeText, { color: theme.text }]}>Scan Another</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Camera view
  if (showCamera) {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.headerOverlay}>
              <TouchableOpacity onPress={() => setShowCamera(false)}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.overlayTitle}>Scan Receipt</Text>
              <View style={{ width: 28 }} />
            </View>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <View style={styles.bottomOverlay}>
              {processing ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                  <View style={styles.captureInner} />
                </TouchableOpacity>
              )}
              <Text style={styles.hint}>Position receipt within frame</Text>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // Default view - choose scan method
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Scan Receipt</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={[styles.optionCard, { backgroundColor: theme.card }]} onPress={() => setShowCamera(true)}>
          <View style={[styles.optionIcon, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="camera" size={32} color={theme.primary} />
          </View>
          <Text style={[styles.optionTitle, { color: theme.text }]}>Camera</Text>
          <Text style={[styles.optionDesc, { color: theme.textMuted }]}>Scan receipt with camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionCard, { backgroundColor: theme.card }]} onPress={pickImage}>
          <View style={[styles.optionIcon, { backgroundColor: theme.accent + '20' }]}>
            <Ionicons name="images" size={32} color={theme.accent} />
          </View>
          <Text style={[styles.optionTitle, { color: theme.text }]}>Gallery</Text>
          <Text style={[styles.optionDesc, { color: theme.textMuted }]}>Upload from photos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'space-between' },
  headerOverlay: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  overlayTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  scanFrame: { width: 300, height: 400, alignSelf: 'center', position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#fff', borderWidth: 3 },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  bottomOverlay: { alignItems: 'center', paddingBottom: 50, gap: 20 },
  captureBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff' },
  hint: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  text: { fontSize: 16, marginBottom: 20 },
  btn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  resultContent: { padding: 20, paddingBottom: 40 },
  receiptCard: { borderRadius: 20, padding: 24, marginBottom: 20 },
  merchantName: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  receiptDate: { fontSize: 13, marginBottom: 16 },
  divider: { height: 1, marginVertical: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  itemName: { fontSize: 14, flex: 1 },
  itemAmount: { fontSize: 14, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8 },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalAmount: { fontSize: 20, fontWeight: 'bold' },
  saveBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  retakeBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1 },
  retakeText: { fontSize: 16, fontWeight: '600' },
  optionsContainer: { padding: 20, gap: 16, marginTop: 20 },
  optionCard: { borderRadius: 20, padding: 28, alignItems: 'center' },
  optionIcon: { width: 72, height: 72, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  optionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  optionDesc: { fontSize: 14 },
});

export default ReceiptScannerScreen;
