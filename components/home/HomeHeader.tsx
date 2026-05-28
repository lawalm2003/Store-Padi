import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

type Props = {
  shopName: string;
};

export default function HomeHeader({ shopName }: Props) {
  const { colors } = useAppTheme();
  const inset = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: inset.top + 16 }]}>
      {/* Left content */}
      <View style={styles.left}>
        <ThemedText style={[styles.text1, { color: colors.text3 }]}>
          Welcome back,
        </ThemedText>

        <ThemedText
          style={[styles.text2, { color: colors.primary }]}
          numberOfLines={2} // allows wrapping instead of pushing layout
        >
          {shopName}
        </ThemedText>
      </View>

      {/* Right icon */}
      <Ionicons name='notifications-outline' size={24} color={colors.primary} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },

  left: {
    flex: 1,
    gap: 6,
  },

  text1: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '400',
  },

  text2: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
    flexShrink: 1,
  },
});
