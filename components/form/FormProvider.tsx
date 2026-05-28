import useAppTheme from '@/hooks/useAppTheme';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { FormProvider as RHFProvider, useForm } from 'react-hook-form';
import { StyleSheet, ViewStyle } from 'react-native';
import * as yup from 'yup';
import { ThemedView } from '../ThemedView';
import FormButton from './FormButton';

interface FormProviderProps {
  children: React.ReactNode;
  onSubmit?: (data: any) => void;
  defaultValues?: object;
  schema?: yup.ObjectSchema<any>;
  submitTitle?: string;
  style?: ViewStyle;
  showButton?: boolean;
  isDisabled?: boolean;
  loading?: boolean;
  validateOnChange?: boolean;
  // Added: optional footer content to render between children and submit btn
  footer?: React.ReactNode;
}

export default function FormProvider({
  children,
  onSubmit,
  defaultValues = {},
  submitTitle = 'Submit',
  schema,
  style,
  showButton = true,
  isDisabled,
  loading,
  validateOnChange = false,
  footer,
}: FormProviderProps) {
  const { colors } = useAppTheme();

  const methods = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues,
    mode: validateOnChange ? 'onChange' : 'onSubmit',
  });
  const { formState } = methods;

  const handleFormSubmit = async (data: any) => {
    if (!onSubmit) return;
    await onSubmit(data);
  };

  return (
    <RHFProvider {...methods}>
      <ThemedView style={[styles.root, style]}>
        {children}
        {footer}
        {showButton && onSubmit && (
          <FormButton
            style={styles.submitBtn}
            title={submitTitle}
            onPress={methods.handleSubmit(handleFormSubmit)}
            loading={loading}
            disabled={
              validateOnChange
                ? !formState.isValid || loading
                : isDisabled || loading
            }
          />
        )}
      </ThemedView>
    </RHFProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  submitBtn: {
    marginTop: 24,
  },
});
