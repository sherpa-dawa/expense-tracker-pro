import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const QUOTES = [
  "Spend wisely today, so your future can thank you tomorrow.",
  "Save a little today, smile a lot tomorrow.",
  "Every penny saved is a step toward freedom.",
  "Don't spend tomorrow's dreams on today's wants.",
  "Smart spending creates a secure future.",
  "Save first, spend what's left.",
  "Wealth begins with wise choices.",
  "Small savings grow into big opportunities.",
  "Spend with purpose, not impulse.",
  "Your future is built one saved dollar at a time.",
  "Money saved today becomes peace of mind tomorrow.",
  "Every unnecessary purchase delays your financial goals.",
  "A budget is the bridge to your dreams.",
  "Spend less, live more.",
  "Saving is the habit that builds wealth.",
  "Think before you spend; your future depends on it.",
  "Financial freedom starts with self-control.",
  "Save for goals, not just for emergencies.",
  "Every coin counts when your future matters.",
  "Wise spending is an investment in yourself.",
  "Save consistently, succeed confidently.",
  "The best investment is the money you don't waste.",
  "Discipline today brings abundance tomorrow.",
  "Spend intentionally, not emotionally.",
  "A rich future begins with smart habits.",
  "The greatest luxury is financial security.",
  "Don't chase trends; build your future.",
  "Saving isn't giving up—it's leveling up.",
  "Spend on value, save for freedom.",
  "Every smart financial decision brings your dreams closer.",
];

const SplashScreen = ({ onFinish }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [quoteScale] = useState(new Animated.Value(0.9));
  const [quoteOpacity] = useState(new Animated.Value(0));
  const [currentQuote, setCurrentQuote] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const index = dayOfYear % QUOTES.length;
    setQuoteIndex(index);
    setCurrentQuote(QUOTES[index]);
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(quoteScale, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(quoteOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onFinish && onFinish());
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#0F0F1A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={[styles.circle1, { backgroundColor: 'rgba(99,102,241,0.08)' }]} />
        <View style={[styles.circle2, { backgroundColor: 'rgba(236,72,153,0.06)' }]} />
        <View style={[styles.circle3, { backgroundColor: 'rgba(16,185,129,0.05)' }]} />

        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.logoRing}>
              <Ionicons name="wallet" size={48} color="#6366F1" />
            </View>
          </Animated.View>

          <Animated.Text style={[styles.appName, { transform: [{ translateY: slideAnim }] }]}>
            ExpenseTracker
          </Animated.Text>
          <Animated.Text style={[styles.appTagline, { transform: [{ translateY: slideAnim }] }]}>
            PRO
          </Animated.Text>

          <Animated.View style={[styles.greetingContainer, { opacity: quoteOpacity, transform: [{ scale: quoteScale }] }]}>
            <View style={styles.greetingLine} />
            <Text style={styles.greetingText}>Hi Ongmu</Text>
            <View style={styles.greetingLine} />
          </Animated.View>

          <Animated.View style={[styles.quoteContainer, { opacity: quoteOpacity, transform: [{ scale: quoteScale }] }]}>
            <Ionicons name="quote" size={20} color="rgba(99,102,241,0.5)" style={styles.quoteIcon} />
            <Text style={styles.quoteText}>{currentQuote}</Text>
            <Text style={styles.quoteNumber}>Quote {quoteIndex + 1} of {QUOTES.length}</Text>
          </Animated.View>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.versionText}>v1.0.0</Text>
          <View style={styles.loadingBar}>
            <Animated.View style={[styles.loadingFill, { width: '100%' }]} />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, zIndex: 999 },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  circle1: { position: 'absolute', width: 400, height: 400, borderRadius: 200, top: -100, right: -100 },
  circle2: { position: 'absolute', width: 300, height: 300, borderRadius: 150, bottom: 100, left: -80 },
  circle3: { position: 'absolute', width: 250, height: 250, borderRadius: 125, top: '40%', left: '60%' },
  content: { alignItems: 'center', paddingHorizontal: 40, width: '100%' },
  logoContainer: { marginBottom: 24 },
  logoRing: { width: 100, height: 100, borderRadius: 30, backgroundColor: 'rgba(99,102,241,0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(99,102,241,0.3)' },
  appName: { fontSize: 32, color: '#FFFFFF', fontWeight: 'bold', letterSpacing: -0.5 },
  appTagline: { fontSize: 14, color: '#6366F1', fontWeight: '600', letterSpacing: 4, marginTop: 4, marginBottom: 40 },
  greetingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  greetingLine: { width: 30, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  greetingText: { fontSize: 18, color: '#EC4899', fontWeight: '600', letterSpacing: 1 },
  quoteContainer: { alignItems: 'center', maxWidth: 320 },
  quoteIcon: { marginBottom: 12, transform: [{ rotate: '180deg' }] },
  quoteText: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 26, fontStyle: 'italic' },
  quoteNumber: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 16, letterSpacing: 1 },
  bottomSection: { position: 'absolute', bottom: 60, alignItems: 'center', width: '80%' },
  versionText: { fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 12 },
  loadingBar: { width: 120, height: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  loadingFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 2 },
});

export default SplashScreen;
