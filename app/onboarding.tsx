import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: W } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'cube-outline' as const,
    color: '#1899FA',
    bg: '#0D2236',
    title: 'Track Every Product',
    sub: 'Add products with cost price, selling price and stock levels. Get alerts before you run out.',
  },
  {
    id: '2',
    icon: 'cash-outline' as const,
    color: '#1EB27C',
    bg: '#0A2018',
    title: 'Record Sales Instantly',
    sub: 'Sell multiple products in one transaction. Cash, transfer, POS — your shop, your way.',
  },
  {
    id: '3',
    icon: 'trending-up-outline' as const,
    color: '#FAB41E',
    bg: '#28200D',
    title: 'AI-Powered Forecasts',
    sub: 'StorePadi predicts when to restock based on your real sales data. Never lose a sale to empty shelves.',
  },
];

export default function OnboardingScreen() {
  const { colors, dark } = useAppTheme();
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const flatRef = useRef<FlatList>(null);

  function goNext() {
    if (activeIdx < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIdx + 1 });
    } else {
      router.push('/(auth)/register');
    }
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* Skip */}
      <TouchableOpacity
        onPress={() => router.push('/(auth)/login')}
        style={styles.skip}
      >
        <ThemedText style={[styles.skipText, { color: colors.text3 }]}>
          Log in
        </ThemedText>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setActiveIdx(Math.round(e.nativeEvent.contentOffset.x / W));
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: W }]}>
            {/* Icon card */}
            <View style={[styles.iconCard, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon} size={72} color={item.color} />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              {item.title}
            </ThemedText>
            <ThemedText style={[styles.sub, { color: colors.text3 }]}>
              {item.sub}
            </ThemedText>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === activeIdx ? colors.primary : colors.border,
                width: i === activeIdx ? 20 : 6,
              },
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={goNext}
          style={[styles.btn, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
        >
          <ThemedText style={styles.btnText}>
            {activeIdx < SLIDES.length - 1 ? 'Next' : 'Get Started'}
          </ThemedText>
          <Ionicons name='arrow-forward' size={18} color='#FFF' />
        </TouchableOpacity>

        {activeIdx === SLIDES.length - 1 && (
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <ThemedText style={[styles.loginLink, { color: colors.text3 }]}>
              Already have an account?{' '}
              <ThemedText style={{ color: colors.primary, fontWeight: '600' }}>
                Log in
              </ThemedText>
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  skip: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: { fontSize: 14, fontWeight: '500' },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  iconCard: {
    width: 140,
    height: 140,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  sub: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  dot: { height: 6, borderRadius: 3 },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 16,
    alignItems: 'center',
  },
  btn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
  },
  btnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  loginLink: { fontSize: 14, textAlign: 'center' },
});
