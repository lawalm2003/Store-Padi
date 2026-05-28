import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

type Props = {
  lowStockCount: number;
  onPress?: () => void; // 👈 optional navigation
};

export default function RestockAlert({ lowStockCount, onPress }: Props) {
  const { colors } = useAppTheme();

  const isSingular = lowStockCount === 1;

  const label = isSingular ? 'product' : 'products';
  const verb = isSingular ? 'needs' : 'need';

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.burnt_orange }]}
    >
      <ThemedView
        style={[styles.stroke, { backgroundColor: colors.golden_yellow }]}
      />

      <View style={styles.content}>
        <View style={styles.group}>
          <Ionicons name='warning' size={14} color={colors.text_yellow} />

          <ThemedText style={[styles.alertText, { color: colors.text_yellow }]}>
            {lowStockCount === 0
              ? 'All products are well stocked'
              : `${lowStockCount} ${label} ${verb} restocking`}
          </ThemedText>
        </View>

        <View style={styles.group}>
          <ThemedText
            style={[styles.viewText, { color: colors.golden_yellow }]}
          >
            View
          </ThemedText>
          <Ionicons
            name='arrow-forward'
            size={14}
            color={colors.golden_yellow}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    borderBottomEndRadius: 16,
    borderTopEndRadius: 16,
  },

  stroke: {
    height: '100%',
    width: 3,
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  alertText: {
    fontSize: 14,
    lineHeight: 14,
  },

  viewText: {
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '500',
  },
});
