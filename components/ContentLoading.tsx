import useAppTheme from '@/hooks/useAppTheme';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';

export default function ContentLoading() {
  const { colors } = useAppTheme();
  return (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size={'large'} color={colors.primary} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
