import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

type Props = {
  visible: boolean;
  productName: string;
  currentStock: number;
  unit: string;
  onClose: () => void;
  onConfirm: (qtyToAdd: number) => void;
  loading?: boolean;
};

const QUICK_AMOUNTS = [5, 10, 20, 50];

export function RestockSheet({
  visible,
  productName,
  currentStock,
  unit,
  onClose,
  onConfirm,
  loading,
}: Props) {
  const { colors } = useAppTheme();
  const [input, setInput] = useState('');
  const inputRef = useRef<TextInput>(null);

  const qtyToAdd = Math.max(0, parseInt(input || '0', 10));
  const newTotal = currentStock + qtyToAdd;
  const canSubmit = qtyToAdd > 0;

  function handleClose() {
    setInput('');
    onClose();
  }

  function handleConfirm() {
    if (!canSubmit) return;
    onConfirm(qtyToAdd);
    setInput('');
  }

  function applyQuick(n: number) {
    setInput(String(n));
    inputRef.current?.focus();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleClose}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kvWrap}
      >
        <ThemedView style={[styles.sheet, { backgroundColor: colors.card }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText style={[styles.title, { color: colors.text }]}>
                Restock
              </ThemedText>
              <ThemedText
                style={[styles.productName, { color: colors.text3 }]}
                numberOfLines={1}
              >
                {productName}
              </ThemedText>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name='close' size={22} color={colors.text3} />
            </TouchableOpacity>
          </View>

          {/* Current stock row */}
          <View style={[styles.stockRow, { backgroundColor: colors.surface2 }]}>
            <View style={styles.stockItem}>
              <ThemedText style={[styles.stockLabel, { color: colors.text3 }]}>
                Current Stock
              </ThemedText>
              <ThemedText style={[styles.stockValue, { color: colors.text }]}>
                {currentStock} {unit}s
              </ThemedText>
            </View>

            <Ionicons name='arrow-forward' size={16} color={colors.text3} />

            <View style={styles.stockItem}>
              <ThemedText style={[styles.stockLabel, { color: colors.text3 }]}>
                New Total
              </ThemedText>
              <ThemedText
                style={[
                  styles.stockValue,
                  { color: canSubmit ? colors.success : colors.text },
                ]}
              >
                {newTotal} {unit}s
              </ThemedText>
            </View>
          </View>

          {/* Quick amounts */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionLabel, { color: colors.text3 }]}>
              Quick add
            </ThemedText>
            <View style={styles.quickRow}>
              {QUICK_AMOUNTS.map((n) => {
                const active = qtyToAdd === n;
                return (
                  <TouchableOpacity
                    key={n}
                    onPress={() => applyQuick(n)}
                    style={[
                      styles.quickBtn,
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
                        styles.quickText,
                        { color: active ? '#FFFFFF' : colors.text3 },
                      ]}
                    >
                      +{n}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Manual input */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionLabel, { color: colors.text3 }]}>
              Or enter quantity
            </ThemedText>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: colors.fixed_input_bg,
                  borderColor: canSubmit ? colors.primary : colors.input_Border,
                },
              ]}
            >
              <ThemedText style={[styles.inputPrefix, { color: colors.text3 }]}>
                +
              </ThemedText>
              <TextInput
                ref={inputRef}
                value={input}
                onChangeText={(t) => setInput(t.replace(/[^0-9]/g, ''))}
                placeholder='0'
                placeholderTextColor={colors.input_placeholder}
                keyboardType='number-pad'
                style={[styles.input, { color: colors.text }]}
                maxLength={5}
              />
              <ThemedText style={[styles.inputSuffix, { color: colors.text3 }]}>
                {unit}s
              </ThemedText>
              {input.length > 0 && (
                <TouchableOpacity onPress={() => setInput('')}>
                  <Ionicons
                    name='close-circle'
                    size={16}
                    color={colors.text3}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Preview banner — only shown when qty > 0 */}
          {canSubmit && (
            <View
              style={[
                styles.preview,
                { backgroundColor: colors.alert_success_bg },
              ]}
            >
              <Ionicons
                name='checkmark-circle-outline'
                size={16}
                color={colors.success}
              />
              <ThemedText
                style={[styles.previewText, { color: colors.success }]}
              >
                Adding {qtyToAdd} {unit}s will bring stock to {newTotal}
              </ThemedText>
            </View>
          )}

          {/* Confirm button */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!canSubmit || loading}
            activeOpacity={0.85}
            style={[
              styles.confirmBtn,
              {
                backgroundColor:
                  canSubmit && !loading ? colors.success : colors.disabled,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator size={'small'} />
            ) : (
              <>
                <Ionicons
                  name={'add-circle-outline'}
                  size={18}
                  color='#FFFFFF'
                />
                <ThemedText style={styles.confirmText}>
                  `Add ${qtyToAdd > 0 ? qtyToAdd : ''} to Stock`
                </ThemedText>
              </>
            )}
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  kvWrap: {
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
    gap: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  productName: {
    fontSize: 13,
    marginTop: 2,
    maxWidth: 260,
  },

  // ── Stock row ────────────────────────────────────────────────────────────────
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 14,
  },
  stockItem: {
    alignItems: 'center',
    gap: 4,
  },
  stockLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  stockValue: {
    fontSize: 20,
    fontWeight: '700',
  },

  // ── Section ──────────────────────────────────────────────────────────────────
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  // ── Quick amounts ────────────────────────────────────────────────────────────
  quickRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  quickText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Input ────────────────────────────────────────────────────────────────────
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    gap: 8,
  },
  inputPrefix: {
    fontSize: 20,
    fontWeight: '300',
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 0,
  },
  inputSuffix: {
    fontSize: 13,
  },

  // ── Preview ──────────────────────────────────────────────────────────────────
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  previewText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },

  // ── Button ───────────────────────────────────────────────────────────────────
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
