// ── ReceiptTopBar.tsx ─────────────────────────────────────────────────────────
// Navigation bar: back button, title, and share icon.

import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  onClose: () => void;
  onShare: () => void;
};

export default function ReceiptTopBar({ onClose, onShare }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
      <TouchableOpacity
        onPress={onClose}
        style={styles.backBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>

      <ThemedText style={styles.title}>Receipt</ThemedText>

      <TouchableOpacity
        onPress={onShare}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="share-outline" size={22} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
});
