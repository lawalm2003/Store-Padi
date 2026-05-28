import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FormTextField from './FormTextField';

export default function BarcodeField() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <View style={styles.barcodeRow}>
      <View style={{ flex: 1 }}>
        <FormTextField
          name='barcode'
          label='Barcode'
          placeholder='Scan or type barcode'
          leftIcon='barcode-outline'
          keyboardType='number-pad'
          autoCapitalize='none'
          hint='Optional — scan to auto-fill product details'
        />
      </View>
      <TouchableOpacity
        style={[styles.scanBtn, { backgroundColor: colors.blue_soft }]}
        onPress={() =>
          router.push({
            pathname: '/scanner',
            params: { returnTo: 'AddProduct' },
          })
        }
      >
        <Ionicons name='camera-outline' size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scanBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
});
