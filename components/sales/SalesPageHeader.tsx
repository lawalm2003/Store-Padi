import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  totalTransactions: number;
};

export default function SalesPageHeader({ totalTransactions }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.pageHeader}>
      <View>
        <ThemedText style={styles.pageTitle}>Sales History</ThemedText>
        <ThemedText style={[styles.pageSubtitle, { color: colors.text3 }]}>
          {totalTransactions} transactions
        </ThemedText>
      </View>
      <TouchableOpacity
        style={[styles.add, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/record-sale')}
      >
        <Ionicons name='add' size={15} color={colors.white} />
        <ThemedText style={[styles.addLabel, { color: colors.white }]}>
          Record Sale
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  pageTitle: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
  pageSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});
