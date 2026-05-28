import useAppTheme from '@/hooks/useAppTheme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function ProductCardSkeleton() {
  const { colors } = useAppTheme();

  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const shimmerStyle = {
    transform: [{ translateX }],
  };

  const base = colors.surface2;
  const highlight = colors.border;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* ── Icon ───────────────────────── */}
      <View style={[styles.iconBox, { backgroundColor: base }]} />

      {/* ── Info ───────────────────────── */}
      <View style={styles.info}>
        {/* Name */}
        <View style={[styles.line, { width: '70%', backgroundColor: base }]} />

        {/* Category */}
        <View
          style={[styles.lineSmall, { width: '50%', backgroundColor: base }]}
        />

        {/* Price row */}
        <View style={styles.row}>
          <View style={[styles.line, { width: 80, backgroundColor: base }]} />
          <View
            style={[styles.lineSmall, { width: 40, backgroundColor: base }]}
          />
          <View
            style={[styles.lineSmall, { width: 60, backgroundColor: base }]}
          />
        </View>

        {/* Stock bar */}
        <View style={[styles.barTrack, { backgroundColor: base }]} />

        {/* Buttons */}
        <View style={styles.row}>
          <View style={[styles.btn, { backgroundColor: base }]} />
          <View style={[styles.btn, { backgroundColor: base }]} />
        </View>
      </View>

      {/* ── Right side ─────────────────── */}
      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: base }]} />
        <View style={[styles.chevron, { backgroundColor: base }]} />
      </View>

      {/* ── Shimmer overlay ───────────── */}
      <Animated.View
        pointerEvents='none'
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: highlight,
            opacity: 0.2,
          },
          shimmerStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    gap: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },

  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },

  info: {
    flex: 1,
    gap: 6,
  },

  row: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },

  line: {
    height: 12,
    borderRadius: 6,
  },

  lineSmall: {
    height: 10,
    borderRadius: 6,
  },

  barTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },

  btn: {
    height: 24,
    borderRadius: 8,
    width: 80,
  },

  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  badge: {
    width: 70,
    height: 20,
    borderRadius: 8,
  },

  chevron: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
});
