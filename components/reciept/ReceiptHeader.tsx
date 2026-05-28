// ── ReceiptHeader.tsx ─────────────────────────────────────────────────────────
// Top section of the receipt card: logo, shop name, address, phone.

import useAppTheme from '@/hooks/useAppTheme';
import { useAuth } from '@/Providers/AuthContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppLogo from '../AppLogo';
import { ThemedText } from '../ThemedText';

export default function ReceiptHeader() {
  const { colors } = useAppTheme();
  const { shop } = useAuth();

  return (
    <View style={styles.header}>
      {/* <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
        <ThemedText style={styles.logoText}>{logoInitials}</ThemedText>
      </View> */}
      <View style={{ marginBottom: 8 }}>
        <AppLogo />
      </View>
      <ThemedText style={[styles.shopName, { color: colors.text }]}>
        {shop?.name}
      </ThemedText>
      <ThemedText style={[styles.sub, { color: colors.text3 }]}>
        {shop?.address}
      </ThemedText>
      <ThemedText style={[styles.sub, { color: colors.text3 }]}>
        {shop?.phone}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 24,
    gap: 4,
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  shopName: {
    fontSize: 18,
    fontWeight: '700',
  },
  sub: {
    fontSize: 12,
  },
});
