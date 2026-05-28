import { DUMMY_SETTINGS } from '@/data/dummy';
import useAppTheme from '@/hooks/useAppTheme';
import { useLogout } from '@/hooks/useAuth';
import { useAuth } from '@/Providers/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { ProfileHeader } from './ProfileHeader';
import { SettingsGroup } from './SettingsGroup';

export default function ProfileScreen() {
  const { colors, dark } = useAppTheme();
  const { shop } = useAuth();
  const router = useRouter();
  const { mutate } = useLogout();

  const [settings, setSettings] = useState(DUMMY_SETTINGS);

  function toggle(
    key: 'stockAlerts' | 'dailySummary' | 'restockReminders' | 'autoBackup',
  ) {
    setSettings((prev) => {
      if (key === 'autoBackup') {
        return {
          ...prev,
          backup: { ...prev.backup, autoBackup: !prev.backup.autoBackup },
        };
      }
      return {
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: !prev.notifications[key],
        },
      };
    });
  }

  function confirmLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out of StorePadi?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => mutate(),
      },
    ]);
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <View style={[styles.pageHeader, { borderBottomColor: colors.border }]}>
        <ThemedText style={[styles.pageTitle, { color: colors.text }]}>
          Settings
        </ThemedText>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile card ─────────────────────────────────────────────── */}
        <ProfileHeader onEditPress={() => router.push('/profile/edit')} />

        {/* ── Shop settings ────────────────────────────────────────────── */}
        <SettingsGroup
          title='Shop'
          rows={[
            {
              icon: 'storefront-outline',
              label: 'Shop Name & Info',
              sub: settings.shop.name,
              type: 'navigate',
              onPress: () => router.push('/(tabs)/profile/shop'),
            },
            {
              icon: 'cash-outline',
              label: 'Currency',
              sub: `${settings.currencySymbol} ${settings.currency}`,
              type: 'value',
              value: settings.currency,
            },
            {
              icon: 'alert-circle-outline',
              label: 'Low Stock Threshold',
              sub: `Alert at ${settings.lowStockThresholdPercent}% remaining`,
              type: 'navigate',
              onPress: () => router.push('/(tabs)/profile/threshold'),
            },
          ]}
        />

        {/* ── Sync & Backup ────────────────────────────────────────────── */}
        <SettingsGroup
          title='Sync & Backup'
          rows={[
            {
              icon: 'cloud-upload-outline',
              label: 'Auto Backup',
              sub: settings.backup.autoBackup
                ? `Daily at ${settings.backup.backupTime}`
                : 'Disabled',
              type: 'toggle',
              toggled: settings.backup.autoBackup,
              onToggle: () => toggle('autoBackup'),
            },
            {
              icon: 'phone-portrait-outline',
              label: 'Connected Devices',
              sub: `${settings.connectedDevices} device${settings.connectedDevices > 1 ? 's' : ''} linked`,
              type: 'navigate',
              onPress: () => router.push('/(tabs)/profile/devices'),
            },
            {
              icon: 'download-outline',
              label: 'Export Data',
              sub: 'CSV, Excel, PDF',
              type: 'navigate',
              onPress: () => router.push('/(tabs)/profile/export'),
            },
          ]}
        />

        {/* ── Notifications ────────────────────────────────────────────── */}
        <SettingsGroup
          title='Notifications'
          rows={[
            {
              icon: 'notifications-outline',
              label: 'Stock Alerts',
              sub: 'Push when stock runs low',
              type: 'toggle',
              toggled: settings.notifications.stockAlerts,
              onToggle: () => toggle('stockAlerts'),
            },
            {
              icon: 'bar-chart-outline',
              label: 'Daily Summary',
              sub: settings.notifications.dailySummary
                ? `Sent at ${settings.notifications.dailySummaryTime}`
                : 'Disabled',
              type: 'toggle',
              toggled: settings.notifications.dailySummary,
              onToggle: () => toggle('dailySummary'),
            },
            {
              icon: 'cube-outline',
              label: 'Restock Reminders',
              sub: 'Remind when products need ordering',
              type: 'toggle',
              toggled: settings.notifications.restockReminders,
              onToggle: () => toggle('restockReminders'),
            },
          ]}
        />

        {/* ── App ──────────────────────────────────────────────────────── */}
        <SettingsGroup
          title='App'
          rows={[
            {
              icon: 'color-palette-outline',
              label: 'Appearance',
              sub: `${settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)} mode`,
              type: 'navigate',
              onPress: () => router.push('/(tabs)/profile/appearance'),
            },
            {
              icon: 'information-circle-outline',
              label: 'About StorePadi',
              sub: 'Version 1.0.0',
              type: 'navigate',
              onPress: () => router.push('/(tabs)/profile/about'),
            },
          ]}
        />

        {/* ── Logout ───────────────────────────────────────────────────── */}
        <SettingsGroup
          rows={[
            {
              icon: 'log-out-outline',
              iconColor: colors.error,
              label: 'Log Out',
              type: 'destructive',
              onPress: confirmLogout,
            },
          ]}
        />

        <ThemedText style={[styles.footer, { color: colors.text3 }]}>
          StorePadi v1.0.0 · Made for Nigerian Small Businesses
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  scroll: {
    padding: 20,
    gap: 20,
    paddingBottom: 48,
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
