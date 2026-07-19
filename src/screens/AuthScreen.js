import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
  const { theme } = useTheme();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isLogin) await login(email, password);
      else await register(email, password, name);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <LinearGradient colors={theme.gradient.primary} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="wallet" size={48} color="#fff" />
            </View>
            <Text style={styles.appName}>ExpenseTracker</Text>
            <Text style={styles.tagline}>Track. Budget. Save.</Text>
          </View>

          <View style={[styles.formCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.formTitle, { color: theme.text }]}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput style={[styles.input, { color: theme.text }]} placeholder="Full Name" placeholderTextColor={theme.textMuted}
                  value={name} onChangeText={setName} />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput style={[styles.input, { color: theme.text }]} placeholder="Email" placeholderTextColor={theme.textMuted}
                value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput style={[styles.input, { color: theme.text, flex: 1 }]} placeholder="Password" placeholderTextColor={theme.textMuted}
                value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: theme.primary }]} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.submitText}>{loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchBtn} onPress={() => setIsLogin(!isLogin)}>
              <Text style={[styles.switchText, { color: theme.textSecondary }]}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text style={{ color: theme.primary, fontWeight: '600' }}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  appName: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  formCard: { borderRadius: 24, padding: 28, gap: 16 },
  formTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15 },
  submitBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  switchBtn: { alignItems: 'center', paddingVertical: 8 },
  switchText: { fontSize: 14 },
});

export default AuthScreen;
