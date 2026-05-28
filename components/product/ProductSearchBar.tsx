import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  activeFilters?: number;
};

export default function ProductSearchBar({
  value,
  onChangeText,
  onFilterPress,
  activeFilters = 0,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      {/* Search input */}
      <View style={[styles.inputWrap, { backgroundColor: colors.surface2 }]}>
        <Ionicons name='search-outline' size={16} color={colors.text3} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder='Search products...'
          placeholderTextColor={colors.input_placeholder}
          value={value}
          onChangeText={onChangeText}
          returnKeyType='search'
          clearButtonMode='while-editing'
        />
      </View>

      {/* Filter button */}
      {/* <TouchableOpacity
        style={[styles.filterBtn, { backgroundColor: colors.surface2 }]}
        onPress={onFilterPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name='options-outline'
          size={18}
          color={activeFilters > 0 ? colors.primary : colors.text3}
        />
        {activeFilters > 0 && (
          <View
            style={[styles.filterBadge, { backgroundColor: colors.primary }]}
          />
        )}
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: 44,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
