import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type Device = {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'web';
  lastActive: string;
  isCurrent: boolean;
};

const DUMMY_DEVICES: Device[] = [
  {
    id: 'd1',
    name: 'Samsung A12',
    type: 'phone',
    lastActive: 'Now',
    isCurrent: true,
  },
  {
    id: 'd2',
    name: 'iPad Air',
    type: 'tablet',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: 'd3',
    name: 'Web - Chrome',
    type: 'web',
    lastActive: 'Yesterday at 3:45 PM',
    isCurrent: false,
  },
];

export default function DevicesScreen() {
  const { colors, dark } = useAppTheme();
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>(DUMMY_DEVICES);

  const handleRemoveDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const getDeviceIcon = (type: 'phone' | 'tablet' | 'web') => {
    switch (type) {
      case 'phone':
        return 'phone-portrait-outline';
      case 'tablet':
        return 'tablet-landscape-outline';
      case 'web':
        return 'globe-outline';
    }
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <View style={[styles.pageHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='chevron-back' size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={[styles.pageTitle, { color: colors.text }]}>
          Connected Devices
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: colors.blue_soft }]}>
          <Ionicons
            name='information-circle-outline'
            size={20}
            color={colors.primary}
          />
          <ThemedText style={[styles.infoText, { color: colors.text }]}>
            You have {devices.length} device{devices.length !== 1 ? 's' : ''}{' '}
            connected. Remove any unrecognized devices for security.
          </ThemedText>
        </View>

        {/* Devices List */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {devices.map((device, index) => (
            <View
              key={device.id}
              style={[
                styles.deviceRow,
                index !== devices.length - 1 && {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 0.5,
                },
              ]}
            >
              {/* Device Info */}
              <View style={styles.deviceInfo}>
                <View
                  style={[
                    styles.deviceIcon,
                    { backgroundColor: colors.surface2 },
                  ]}
                >
                  <Ionicons
                    name={getDeviceIcon(device.type)}
                    size={18}
                    color={colors.text}
                  />
                </View>
                <View style={styles.deviceDetails}>
                  <View style={styles.deviceName}>
                    <ThemedText style={[styles.name, { color: colors.text }]}>
                      {device.name}
                    </ThemedText>
                    {device.isCurrent && (
                      <View
                        style={[
                          styles.currentBadge,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <ThemedText style={styles.currentBadgeText}>
                          Current
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText
                    style={[styles.lastActive, { color: colors.text3 }]}
                  >
                    {device.lastActive}
                  </ThemedText>
                </View>
              </View>

              {/* Remove Button */}
              {!device.isCurrent && (
                <TouchableOpacity
                  onPress={() => handleRemoveDevice(device.id)}
                  style={styles.removeButton}
                >
                  <Ionicons
                    name='close-circle-outline'
                    size={20}
                    color={colors.error}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Security Tip */}
        <View style={[styles.tipBox, { backgroundColor: colors.surface2 }]}>
          <Ionicons
            name='lock-closed-outline'
            size={18}
            color={colors.primary}
          />
          <View style={styles.tipContent}>
            <ThemedText style={[styles.tipTitle, { color: colors.text }]}>
              Security Tip
            </ThemedText>
            <ThemedText style={[styles.tipText, { color: colors.text3 }]}>
              Remove devices you no longer use to protect your account.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lastActive: {
    fontSize: 12,
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
  tipBox: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
