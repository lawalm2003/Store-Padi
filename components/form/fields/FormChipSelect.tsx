import useAppTheme from '@/hooks/useAppTheme';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../ThemedText';

export type ChipOption = { label: string; value: string };

type Props = {
  name: string;
  label: string;
  options: ChipOption[];
  hint?: string;
};

export default function FormChipSelect({ name, label, options, hint }: Props) {
  const { colors } = useAppTheme();
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          <ThemedText style={[styles.label, { color: colors.text3 }]}>
            {label}
          </ThemedText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => onChange(opt.value)}
                  activeOpacity={0.7}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active
                        ? colors.primary
                        : colors.surface2,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.chipText,
                      { color: active ? '#FFFFFF' : colors.text3 },
                    ]}
                  >
                    {opt.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {(error?.message || hint) && (
            <ThemedText
              style={[
                styles.hint,
                { color: error?.message ? colors.error : colors.text3 },
              ]}
            >
              {error?.message ?? hint}
            </ThemedText>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  hint: {
    fontSize: 11,
  },
});
