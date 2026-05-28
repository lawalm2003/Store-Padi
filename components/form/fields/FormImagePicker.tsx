import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '../../ThemedText';

type Props = {
  name: string;
  label?: string;
  hint?: string;
  size?: number; // avatar circle size — default 100
  shape?: 'circle' | 'square';
  placeholder?: keyof typeof Ionicons.glyphMap;
};

export default function FormImagePicker({
  name,
  label,
  hint,
  size = 100,
  shape = 'circle',
  placeholder = 'storefront-outline',
}: Props) {
  const { colors } = useAppTheme();
  const { control } = useFormContext();
  const [loading, setLoading] = useState(false);

  const borderRadius = shape === 'circle' ? size / 2 : 16;

  async function pickImage(onChange: (val: string) => void) {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please allow access to your photo library to pick an image.',
        [{ text: 'OK' }],
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // force square crop
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } finally {
      setLoading(false);
    }
  }

  async function takePhoto(onChange: (val: string) => void) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please allow camera access to take a photo.',
        [{ text: 'OK' }],
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } finally {
      setLoading(false);
    }
  }

  function showOptions(onChange: (val: string) => void, currentValue: string) {
    Alert.alert(label ?? 'Choose Image', undefined, [
      {
        text: 'Choose from Library',
        onPress: () => pickImage(onChange),
      },
      {
        text: 'Take Photo',
        onPress: () => takePhoto(onChange),
      },
      ...(currentValue
        ? [
            {
              text: 'Remove Image',
              style: 'destructive' as const,
              onPress: () => onChange(''),
            },
          ]
        : []),
      {
        text: 'Cancel',
        style: 'cancel' as const,
      },
    ]);
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          {/* Label */}
          {label && (
            <ThemedText style={[styles.label, { color: colors.text3 }]}>
              {label}
            </ThemedText>
          )}

          {/* Picker button */}
          <View style={styles.pickerRow}>
            <TouchableOpacity
              onPress={() => showOptions(onChange, value)}
              activeOpacity={0.8}
              disabled={loading}
              style={[
                styles.imageWrap,
                {
                  width: size,
                  height: size,
                  borderRadius,
                  backgroundColor: colors.surface2,
                  borderColor: error ? colors.error : colors.border,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color={colors.primary} />
              ) : value ? (
                <>
                  {/* Selected image */}
                  <Image
                    source={{ uri: value }}
                    style={[styles.image, { borderRadius }]}
                  />
                  {/* Edit overlay */}
                  <View style={[styles.editOverlay, { borderRadius }]}>
                    <Ionicons name='camera' size={18} color='#FFFFFF' />
                  </View>
                </>
              ) : (
                /* Empty state */
                <View style={styles.emptyState}>
                  <Ionicons
                    name={placeholder}
                    size={size * 0.34}
                    color={colors.text3}
                  />
                  <Ionicons
                    name='add-circle'
                    size={20}
                    color={colors.primary}
                    style={styles.addIcon}
                  />
                </View>
              )}
            </TouchableOpacity>

            {/* Side instructions */}
            <View style={styles.instructions}>
              <ThemedText
                style={[styles.instructionTitle, { color: colors.text }]}
              >
                {value
                  ? 'Image selected'
                  : `Tap to add ${label?.toLowerCase() ?? 'image'}`}
              </ThemedText>
              <ThemedText
                style={[styles.instructionSub, { color: colors.text3 }]}
              >
                {value
                  ? 'Tap the image to change or remove it'
                  : 'Choose from your library or take a photo'}
              </ThemedText>
              {value && (
                <TouchableOpacity
                  onPress={() => onChange('')}
                  style={[
                    styles.removeBtn,
                    { backgroundColor: colors.red_soft },
                  ]}
                >
                  <Ionicons
                    name='trash-outline'
                    size={13}
                    color={colors.error}
                  />
                  <ThemedText
                    style={[styles.removeText, { color: colors.error }]}
                  >
                    Remove
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Error or hint */}
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
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  addIcon: {
    position: 'absolute',
    bottom: -6,
    right: -6,
  },
  instructions: {
    flex: 1,
    gap: 4,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  instructionSub: {
    fontSize: 12,
    lineHeight: 17,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 4,
  },
  removeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  hint: {
    fontSize: 11,
    marginTop: 2,
  },
});
