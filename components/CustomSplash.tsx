import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

const { width: W } = Dimensions.get('window');

const BRAND = {
  blue: '#1899FA',
  green: '#1EB27C',
  amber: '#FAB41E',
  amberDark: '#C47A08',
  dark: '#0C0C0E',
  light: '#F2F4F7',
};

type Props = {
  onFinish?: () => void;
};

export default function CustomSplash({ onFinish }: Props) {
  const scheme = useColorScheme();
  const dark = scheme !== 'light';

  const wordmarkSlideY = useRef(new Animated.Value(20)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Wordmark slides up & fades in
      Animated.parallel([
        Animated.timing(wordmarkSlideY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(wordmarkOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // 2. Hold
      Animated.delay(1200),
      // 3. Fade out
      Animated.timing(wordmarkOpacity, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => onFinish?.());
  }, []);

  const bg = dark ? BRAND.dark : BRAND.light;
  const textMain = dark ? '#FFFFFF' : '#0D0E14';
  const amberTxt = dark ? BRAND.amber : BRAND.amberDark;
  const glowOpacity = dark ? 0.07 : 0.09;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={bg}
      />

      {/* ── Background glow blobs ────────────────────────────────────────── */}
      <View
        style={[
          styles.glowBlue,
          { backgroundColor: BRAND.blue, opacity: glowOpacity },
        ]}
      />
      <View
        style={[
          styles.glowGreen,
          { backgroundColor: BRAND.green, opacity: glowOpacity - 0.01 },
        ]}
      />
      <View
        style={[
          styles.glowAmber,
          { backgroundColor: BRAND.amber, opacity: glowOpacity - 0.02 },
        ]}
      />

      {/* ── Dot grid ────────────────────────────────────────────────────── */}
      <View style={styles.dotGrid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.gridDot,
              { backgroundColor: dark ? '#FFFFFF' : '#0D0E14', opacity: 0.06 },
            ]}
          />
        ))}
      </View>

      {/* ── App name ─────────────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.wordmarkRow,
          {
            opacity: wordmarkOpacity,
            transform: [{ translateY: wordmarkSlideY }],
          },
        ]}
      >
        <Animated.Text style={[styles.wordStore, { color: textMain }]}>
          Store
        </Animated.Text>
        <Animated.Text style={[styles.wordPadi, { color: amberTxt }]}>
          Padi
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Background blobs ────────────────────────────────────────────────────────
  glowBlue: {
    position: 'absolute',
    width: W * 0.85,
    height: W * 0.85,
    borderRadius: W * 0.425,
    bottom: -W * 0.2,
    right: -W * 0.2,
  },
  glowGreen: {
    position: 'absolute',
    width: W * 0.75,
    height: W * 0.75,
    borderRadius: W * 0.375,
    top: W * 0.05,
    left: -W * 0.25,
  },
  glowAmber: {
    position: 'absolute',
    width: W * 0.28,
    height: W * 0.28,
    borderRadius: W * 0.14,
    top: W * 0.18,
    right: W * 0.04,
  },

  // ── Dot grid ────────────────────────────────────────────────────────────────
  dotGrid: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: W - 40,
    gap: 24,
  },
  gridDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // ── Wordmark ────────────────────────────────────────────────────────────────
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordStore: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
  },
  wordPadi: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
  },
});
