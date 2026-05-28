// ── HolePunchRow.tsx ──────────────────────────────────────────────────────────
// Decorative row of circular "hole punches" that adds receipt authenticity.

import useAppTheme from '@/hooks/useAppTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  holeBg: string;
  borderColor: string;
};

export default function HolePunchRow({ holeBg, borderColor }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => (
        <View
          key={i}
          style={[styles.hole, { backgroundColor: holeBg, borderColor }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  hole: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
  },
});
