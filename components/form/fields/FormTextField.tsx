import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '../../ThemedText';

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  editable?: boolean;
  maxLength?: number;
  hint?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

export default function FormTextField({
  name,
  label,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  onRightIconPress,
  editable = true,
  maxLength,
  hint,
  autoCapitalize = 'sentences',
}: Props) {
  const { colors } = useAppTheme();
  const { control } = useFormContext();
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(secureTextEntry);

  const isPassword = secureTextEntry;

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View style={styles.wrapper}>
          {/* Label */}
          <ThemedText style={[styles.label, { color: colors.text3 }]}>
            {label}
          </ThemedText>

          {/* Input row */}
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: colors.fixed_input_bg,
                borderColor: error
                  ? colors.error
                  : focused
                    ? colors.primary
                    : colors.input_Border,
              },
              multiline && {
                height: numberOfLines * 21,
                alignItems: 'flex-start',
              },
              !editable && { opacity: 0.5 },
            ]}
          >
            {leftIcon && (
              <Ionicons
                name={leftIcon}
                size={17}
                color={focused ? colors.primary : colors.text3}
                style={[styles.leftIcon, multiline && { marginTop: 14 }]}
              />
            )}

            <TextInput
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              onFocus={() => setFocused(true)}
              placeholder={placeholder}
              placeholderTextColor={colors.input_placeholder}
              keyboardType={keyboardType}
              secureTextEntry={secure}
              multiline={multiline}
              numberOfLines={multiline ? numberOfLines : undefined}
              editable={editable}
              maxLength={maxLength}
              autoCapitalize={autoCapitalize}
              style={[
                styles.input,
                { color: colors.text },
                multiline && styles.multilineInput,
              ]}
            />

            {/* Password toggle */}
            {isPassword && (
              <TouchableOpacity
                onPress={() => setSecure((p) => !p)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={secure ? 'eye-outline' : 'eye-off-outline'}
                  size={17}
                  color={colors.text3}
                />
              </TouchableOpacity>
            )}

            {/* Right icon (not password) */}
            {rightIcon && !isPassword && (
              <TouchableOpacity
                onPress={onRightIconPress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                disabled={!onRightIconPress}
              >
                <Ionicons
                  name={rightIcon}
                  size={17}
                  color={focused ? colors.primary : colors.text3}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Hint or error */}
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
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  leftIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  multilineInput: {
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 11,
    marginTop: 2,
  },
});
