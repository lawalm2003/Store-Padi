// ── ReceiptMeta.tsx ───────────────────────────────────────────────────────────
// Displays receipt ID, date, time, payment method chip, and optional note.

import useAppTheme from '@/hooks/useAppTheme';
import { Sale } from '@/types';
import {
  PAYMENT_ICON,
  PAYMENT_LABELS,
  formatDate,
  formatTime,
} from '@/utils/receiptUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = Pick<Sale, 'id' | 'createdAt' | 'paymentMethod' | 'customerNote'>;

export default function ReceiptMeta({
  id,
  createdAt,
  paymentMethod,
  customerNote,
}: Props) {
  const { colors } = useAppTheme();
  const metaColor = colors.text3;

  return (
    <View style={styles.block}>
      <MetaRow
        label='Receipt ID'
        labelColor={metaColor}
        valueColor={colors.text}
      >
        {/* <ThemedText style={[styles.value, { color: colors.text }]}>
          #{id.split('-').pop()?.toUpperCase()}
        </ThemedText> */}
        <ThemedText
          style={[
            styles.value,
            { color: colors.text, textAlign: 'right', flex: 1, marginLeft: 16 },
          ]}
        >
          {id.toUpperCase()}
        </ThemedText>
      </MetaRow>

      <MetaRow label='Date' labelColor={metaColor} valueColor={colors.text}>
        <ThemedText style={[styles.value, { color: colors.text }]}>
          {formatDate(createdAt)}
        </ThemedText>
      </MetaRow>

      <MetaRow label='Time' labelColor={metaColor} valueColor={colors.text}>
        <ThemedText style={[styles.value, { color: colors.text }]}>
          {formatTime(createdAt)}
        </ThemedText>
      </MetaRow>

      <MetaRow label='Payment' labelColor={metaColor} valueColor={colors.text}>
        <View style={styles.paymentChip}>
          <Ionicons
            name={PAYMENT_ICON[paymentMethod] ?? 'wallet-outline'}
            size={12}
            color={colors.primary}
          />
          <ThemedText style={[styles.paymentLabel, { color: colors.primary }]}>
            {' '}
            {PAYMENT_LABELS[paymentMethod] ?? paymentMethod}
          </ThemedText>
        </View>
      </MetaRow>

      {customerNote ? (
        <MetaRow label='Note' labelColor={metaColor} valueColor={colors.text}>
          <ThemedText
            style={[
              styles.value,
              { color: colors.text, flex: 1, textAlign: 'right' },
            ]}
          >
            {customerNote}
          </ThemedText>
        </MetaRow>
      ) : null}
    </View>
  );
}

// ── Internal helper ───────────────────────────────────────────────────────────
function MetaRow({
  label,
  labelColor,
  valueColor: _valueColor,
  children,
}: {
  label: string;
  labelColor: string;
  valueColor: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <ThemedText style={[styles.label, { color: labelColor }]}>
        {label}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
  },
  paymentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  paymentLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
