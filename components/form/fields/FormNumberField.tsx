import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../ThemedText';

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  prefix?: string; // e.g. '₦'
  suffix?: string; // e.g. 'units'
  min?: number;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  showStepper?: boolean; // show +/- buttons (for qty fields)
};

export default function FormNumberField({
  name,
  label,
  placeholder = '0',
  prefix,
  suffix,
  min = 0,
  hint,
  leftIcon,
  showStepper = false,
}: Props) {
  const { colors } = useAppTheme();
  const { control } = useFormContext();
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const numeric = Number(value) || 0;

        function step(delta: number) {
          const next = Math.max(min, numeric + delta);
          onChange(next);
        }

        return (
          <View style={styles.wrapper}>
            <ThemedText style={[styles.label, { color: colors.text3 }]}>
              {label}
            </ThemedText>

            <View
              style={[
                styles.row,
                {
                  backgroundColor: colors.fixed_input_bg,
                  borderColor: error
                    ? colors.error
                    : focused
                      ? colors.primary
                      : colors.input_Border,
                },
              ]}
            >
              {/* Minus stepper */}
              {showStepper && (
                <TouchableOpacity
                  onPress={() => step(-1)}
                  style={[styles.stepBtn, { backgroundColor: colors.surface2 }]}
                >
                  <Ionicons name='remove' size={16} color={colors.text3} />
                </TouchableOpacity>
              )}

              {leftIcon && !showStepper && (
                <Ionicons
                  name={leftIcon}
                  size={17}
                  color={focused ? colors.primary : colors.text3}
                />
              )}

              {prefix && (
                <ThemedText style={[styles.affix, { color: colors.text3 }]}>
                  {prefix}
                </ThemedText>
              )}

              <TextInput
                value={value !== undefined && value !== '' ? String(value) : ''}
                onChangeText={(t) => {
                  const cleaned = t.replace(/[^0-9.]/g, '');
                  onChange(cleaned === '' ? '' : Number(cleaned));
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={placeholder}
                placeholderTextColor={colors.input_placeholder}
                keyboardType='numeric'
                style={[
                  styles.input,
                  { color: colors.text },
                  showStepper && { textAlign: 'center' },
                ]}
              />

              {suffix && (
                <ThemedText style={[styles.affix, { color: colors.text3 }]}>
                  {suffix}
                </ThemedText>
              )}

              {/* Plus stepper */}
              {showStepper && (
                <TouchableOpacity
                  onPress={() => step(1)}
                  style={[styles.stepBtn, { backgroundColor: colors.primary }]}
                >
                  <Ionicons name='add' size={16} color='#FFFFFF' />
                </TouchableOpacity>
              )}
            </View>

            {/* Profit preview — shown when field has a value and prefix is ₦ */}
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
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 8,
  },
  affix: {
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    fontWeight: '500',
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 11,
    marginTop: 2,
  },
});
