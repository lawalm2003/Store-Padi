// ── ReceiptActions.tsx ────────────────────────────────────────────────────────
// Row of action buttons: Share, Print, and Save PDF.

import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  pressAnim: Animated.Value;
  onShare: () => void;
  onPrint?: () => void;
  onSavePdf?: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
};

export default function ReceiptActions({
  pressAnim,
  onShare,
  onPrint,
  onSavePdf,
  onPressIn,
  onPressOut,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.actions}>
      {/* Share */}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.surface2 }]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onShare}
      >
        <Ionicons name="share-social-outline" size={18} color={colors.text} />
        <ThemedText style={[styles.btnText, { color: colors.text }]}>
          Share
        </ThemedText>
      </TouchableOpacity>

      {/* Print */}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.surface2 }]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPrint}
      >
        <Ionicons name="print-outline" size={18} color={colors.text} />
        <ThemedText style={[styles.btnText, { color: colors.text }]}>
          Print
        </ThemedText>
      </TouchableOpacity>

      {/* Save PDF */}
      <TouchableOpacity
        style={[styles.btnPrimary, { backgroundColor: colors.primary }]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onSavePdf}
      >
        <Ionicons name="download-outline" size={18} color="#FFFFFF" />
        <ThemedText style={[styles.btnText, { color: '#FFFFFF' }]}>
          Save PDF
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
