import useAppTheme from '@/hooks/useAppTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export default function AppLogo() {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.wordmarkRow]}>
      <ThemedText style={[styles.wordStore, { color: colors.text }]}>
        Store
      </ThemedText>
      <ThemedText style={[styles.wordPadi, { color: colors.text_yellow }]}>
        Padi
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordStore: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: -1,
  },
  wordPadi: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: -1,
  },
});
