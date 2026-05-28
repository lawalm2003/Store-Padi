// ── DashedDivider.tsx ─────────────────────────────────────────────────────────
// A row of short dashes that mimics a paper receipt tear line.

import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = { color: string };

export default function DashedDivider({ color }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: 28 }).map((_, i) => (
        <View key={i} style={[styles.dash, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 2,
  },
  dash: {
    width: 6,
    height: 1.5,
    borderRadius: 1,
    opacity: 0.5,
  },
});
