import FormButton from '@/components/form/FormButton';
import ScreenHeader from '@/components/profile/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useUpdateShop } from '@/hooks/useData';
import { useAuth } from '@/Providers/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ThresholdScreen() {
  const { colors, dark } = useAppTheme();
  const { shop, refreshShop } = useAuth();
  const { mutate, isPending } = useUpdateShop(shop?.id || '');
  const [threshold, setThreshold] = useState(
    shop?.low_stock_threshold_percent || 0,
  );

  const handleAdjust = (value: number) => {
    if (value >= 0 && value <= 100) {
      setThreshold(value);
    }
  };

  const handleSubmit = () => {
    mutate(
      { low_stock_threshold_percent: threshold },
      {
        onSuccess: () => {
          refreshShop();
        },
      },
    );
    console.log('New Threshold:', threshold);
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <ScreenHeader title='Low Stock Threshold' />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: colors.blue_soft }]}>
          <Ionicons
            name='information-circle-outline'
            size={20}
            color={colors.primary}
          />
          <ThemedText style={[styles.infoText, { color: colors.text }]}>
            Products will trigger alerts when stock falls below this percentage
            of your minimum stock level.
          </ThemedText>
        </View>

        {/* Current Threshold Display */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={[styles.label, { color: colors.text3 }]}>
            Current Threshold
          </ThemedText>
          <View style={styles.thresholdDisplay}>
            <ThemedText
              style={[styles.thresholdValue, { color: colors.primary }]}
            >
              {threshold}%
            </ThemedText>
          </View>
        </View>

        {/* Adjustment Buttons */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={[styles.label, { color: colors.text3 }]}>
            Adjust Threshold
          </ThemedText>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.adjButton, { borderColor: colors.border }]}
              onPress={() => handleAdjust(threshold - 5)}
            >
              <Ionicons name='remove' size={20} color={colors.text} />
            </TouchableOpacity>
            <ThemedText style={[styles.adjValue, { color: colors.text }]}>
              {threshold}%
            </ThemedText>
            <TouchableOpacity
              style={[styles.adjButton, { borderColor: colors.border }]}
              onPress={() => handleAdjust(threshold + 5)}
            >
              <Ionicons name='add' size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Presets */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={[styles.label, { color: colors.text3 }]}>
            Quick Presets
          </ThemedText>
          <View style={styles.presetGrid}>
            {[10, 20, 30, 50].map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.preset,
                  {
                    backgroundColor:
                      threshold === preset ? colors.primary : colors.surface2,
                  },
                ]}
                onPress={() => handleAdjust(preset)}
              >
                <ThemedText
                  style={[
                    styles.presetText,
                    {
                      color: threshold === preset ? '#fff' : colors.text,
                    },
                  ]}
                >
                  {preset}%
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.submitBtnContainer}>
        <FormButton
          title={'Save Threshold'}
          onPress={handleSubmit}
          loading={isPending}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  scroll: {
    padding: 20,
    gap: 12,
    paddingBottom: 48,
  },
  infoBox: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  thresholdDisplay: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  thresholdValue: {
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '700',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  adjButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  adjValue: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  preset: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtnContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
