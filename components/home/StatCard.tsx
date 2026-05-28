import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

type Props = {
  title: string;
  value: string;
  color: string;

  subText?: string;
  growth?: number;

  subTextColor?: string;
};

export default function StatCard({
  title,
  value,
  color,
  subText,
  growth,
  subTextColor,
}: Props) {
  const { colors } = useAppTheme();

  const hasGrowth = typeof growth === 'number' && !isNaN(growth);

  const isPositive = (growth ?? 0) >= 0;

  const growthColor = isPositive ? colors.success : colors.error;

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.card }]}>
      <ThemedView style={[styles.stroke, { backgroundColor: color }]} />

      <View style={styles.content}>
        {/* Title */}
        <ThemedText style={[styles.title, { color: colors.text3 }]}>
          {title}
        </ThemedText>

        {/* Value */}
        <ThemedText style={[styles.value, { color: colors.text }]}>
          {value}
        </ThemedText>

        {/* Sub row */}
        <View style={styles.subRow}>
          {hasGrowth ? (
            <>
              <Ionicons
                name={isPositive ? 'arrow-up' : 'arrow-down'}
                size={12}
                color={growthColor}
              />
              <ThemedText
                style={[
                  styles.subtext,
                  { color: growthColor, fontWeight: '600' },
                ]}
              >
                {Math.abs(growth!).toFixed(1)}%
              </ThemedText>
            </>
          ) : (
            <ThemedText
              style={[styles.subtext, { color: subTextColor || colors.text4 }]}
            >
              {subText}
            </ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 88,
    gap: 8,
    borderBottomEndRadius: 16,
    borderTopEndRadius: 16,
  },

  stroke: {
    height: '100%',
    width: 3,
  },

  content: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },

  title: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '400',
  },

  value: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
  },

  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  subtext: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '400',
  },
});
