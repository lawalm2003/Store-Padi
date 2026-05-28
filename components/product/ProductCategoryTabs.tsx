import useAppTheme from '@/hooks/useAppTheme';
import { ProductCategory } from '@/types';
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';

export const ALL_CATEGORY = 'All' as const;
export type CategoryFilter = typeof ALL_CATEGORY | ProductCategory;

const CATEGORIES: CategoryFilter[] = [
  'All',
  'Food',
  'Beverages',
  'Dairy',
  'Household',
  'Snacks',
  'Personal Care',
  'General',
];

type Props = {
  selected: CategoryFilter;
  onSelect: (cat: CategoryFilter) => void;
};

export default function ProductCategoryTabs({ selected, onSelect }: Props) {
  const { colors } = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const active = cat === selected;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            style={[
              styles.tab,
              {
                backgroundColor: active ? colors.primary : colors.surface2,
              },
            ]}
            activeOpacity={0.75}
          >
            <ThemedText
              style={[
                styles.tabText,
                { color: active ? '#FFFFFF' : colors.text3 },
              ]}
            >
              {cat}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
