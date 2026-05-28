import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '../../ThemedText';
import { ThemedView } from '../../ThemedView';

export type SelectOption = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  leftIcon?: keyof typeof Ionicons.glyphMap;
  hint?: string;
};

export default function FormSelectField({
  name,
  label,
  placeholder = 'Select...',
  options,
  leftIcon,
  hint,
}: Props) {
  const { colors } = useAppTheme();
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const selected = options.find((o) => o.value === value);

        return (
          <View style={styles.wrapper}>
            <ThemedText style={[styles.label, { color: colors.text3 }]}>
              {label}
            </ThemedText>

            {/* Trigger */}
            <TouchableOpacity
              onPress={() => setOpen(true)}
              activeOpacity={0.8}
              style={[
                styles.trigger,
                {
                  backgroundColor: colors.fixed_input_bg,
                  borderColor: error ? colors.error : colors.input_Border,
                },
              ]}
            >
              {leftIcon && (
                <Ionicons
                  name={leftIcon}
                  size={17}
                  color={selected ? colors.primary : colors.text3}
                  style={{ marginRight: 2 }}
                />
              )}
              <ThemedText
                style={[
                  styles.triggerText,
                  { color: selected ? colors.text : colors.input_placeholder },
                ]}
              >
                {selected?.label ?? placeholder}
              </ThemedText>
              <Ionicons name='chevron-down' size={16} color={colors.text3} />
            </TouchableOpacity>

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

            {/* Bottom sheet modal */}
            <Modal
              visible={open}
              transparent
              animationType='slide'
              onRequestClose={() => setOpen(false)}
            >
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setOpen(false)}
              />
              <ThemedView
                style={[styles.sheet, { backgroundColor: colors.card }]}
              >
                {/* Handle */}
                <View
                  style={[styles.handle, { backgroundColor: colors.border }]}
                />

                <ThemedText style={[styles.sheetTitle, { color: colors.text }]}>
                  {label}
                </ThemedText>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {options.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => {
                          onChange(opt.value);
                          setOpen(false);
                        }}
                        style={[
                          styles.option,
                          { borderBottomColor: colors.border },
                          isSelected && { backgroundColor: colors.blue_soft },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.optionText,
                            {
                              color: isSelected ? colors.primary : colors.text,
                              fontWeight: isSelected ? '600' : '400',
                            },
                          ]}
                        >
                          {opt.label}
                        </ThemedText>
                        {isSelected && (
                          <Ionicons
                            name='checkmark'
                            size={18}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </ThemedView>
            </Modal>
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
  },
  hint: {
    fontSize: 11,
    marginTop: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  optionText: {
    fontSize: 15,
  },
});
