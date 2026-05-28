// ── ReceiptFooter.tsx ─────────────────────────────────────────────────────────
// Bottom of the receipt card: thank-you text and "Powered by StorePadi" tag.

import useAppTheme from '@/hooks/useAppTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

export default function ReceiptFooter() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.footer}>
      <ThemedText style={[styles.thankYou, { color: colors.text }]}>
        Thank you for your business! 🙏
      </ThemedText>
      <ThemedText style={[styles.poweredBy, { color: colors.text3 }]}>
        Powered by StorePadi
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 8,
    gap: 4,
  },
  thankYou: {
    fontSize: 13,
    fontWeight: '500',
  },
  poweredBy: {
    fontSize: 11,
  },
});
