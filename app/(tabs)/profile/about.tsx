import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AboutScreen() {
  const { colors, dark } = useAppTheme();
  const router = useRouter();

  const handleOpenUrl = (url: string) => {
    Linking.openURL(url);
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
          About StorePadi
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* App Logo & Version */}
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Ionicons name='storefront' size={48} color='#FFFFFF' />
          </View>
          <ThemedText style={[styles.appName, { color: colors.text }]}>
            StorePadi
          </ThemedText>
          <ThemedText style={[styles.tagline, { color: colors.text3 }]}>
            Business Management Made Simple
          </ThemedText>
          <ThemedText style={[styles.version, { color: colors.text3 }]}>
            Version 1.0.0
          </ThemedText>
        </View>

        {/* Description */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={[styles.description, { color: colors.text }]}>
            StorePadi is a powerful yet easy-to-use business management app
            designed specifically for Nigerian small business owners. Manage
            your products, track sales, monitor inventory, and grow your
            business with confidence.
          </ThemedText>
        </View>

        {/* Features */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text3 }]}>
            Features
          </ThemedText>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name='cube-outline' size={20} color={colors.primary} />
              <ThemedText style={[styles.featureText, { color: colors.text }]}>
                Product Management
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons
                name='barcode-outline'
                size={20}
                color={colors.primary}
              />
              <ThemedText style={[styles.featureText, { color: colors.text }]}>
                Barcode Scanning
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons
                name='trending-up-outline'
                size={20}
                color={colors.primary}
              />
              <ThemedText style={[styles.featureText, { color: colors.text }]}>
                Sales Tracking
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons
                name='analytics-outline'
                size={20}
                color={colors.primary}
              />
              <ThemedText style={[styles.featureText, { color: colors.text }]}>
                Business Analytics
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons
                name='cloud-upload-outline'
                size={20}
                color={colors.primary}
              />
              <ThemedText style={[styles.featureText, { color: colors.text }]}>
                Auto Backup & Sync
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name='print-outline' size={20} color={colors.primary} />
              <ThemedText style={[styles.featureText, { color: colors.text }]}>
                Receipt Printing
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Support & Links */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text3 }]}>
            Support & Links
          </ThemedText>

          <TouchableOpacity
            style={[
              styles.linkItem,
              { borderBottomColor: colors.border, borderBottomWidth: 0.5 },
            ]}
            onPress={() => handleOpenUrl('https://www.storepadi.com/help')}
          >
            <View style={styles.linkContent}>
              <Ionicons
                name='help-circle-outline'
                size={20}
                color={colors.primary}
              />
              <ThemedText style={[styles.linkText, { color: colors.text }]}>
                Help & Support
              </ThemedText>
            </View>
            <Ionicons name='open-outline' size={18} color={colors.text3} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.linkItem,
              { borderBottomColor: colors.border, borderBottomWidth: 0.5 },
            ]}
            onPress={() => handleOpenUrl('https://www.storepadi.com/terms')}
          >
            <View style={styles.linkContent}>
              <Ionicons
                name='document-text-outline'
                size={20}
                color={colors.primary}
              />
              <ThemedText style={[styles.linkText, { color: colors.text }]}>
                Terms of Service
              </ThemedText>
            </View>
            <Ionicons name='open-outline' size={18} color={colors.text3} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.linkItem,
              { borderBottomColor: colors.border, borderBottomWidth: 0.5 },
            ]}
            onPress={() => handleOpenUrl('https://www.storepadi.com/privacy')}
          >
            <View style={styles.linkContent}>
              <Ionicons
                name='lock-closed-outline'
                size={20}
                color={colors.primary}
              />
              <ThemedText style={[styles.linkText, { color: colors.text }]}>
                Privacy Policy
              </ThemedText>
            </View>
            <Ionicons name='open-outline' size={18} color={colors.text3} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleOpenUrl('https://www.storepadi.com')}
          >
            <View style={styles.linkContent}>
              <Ionicons name='globe-outline' size={20} color={colors.primary} />
              <ThemedText style={[styles.linkText, { color: colors.text }]}>
                Visit Our Website
              </ThemedText>
            </View>
            <Ionicons name='open-outline' size={18} color={colors.text3} />
          </TouchableOpacity>
        </View>

        {/* Credits */}
        {/* <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text3 }]}>
            Made With
          </ThemedText>
          <ThemedText style={[styles.creditText, { color: colors.text }]}>
            Built with love and React Native for Nigerian entrepreneurs
          </ThemedText>
        </View> */}

        {/* Footer */}
        <ThemedText style={[styles.footer, { color: colors.text3 }]}>
          © 2026 StorePadi. All rights reserved.
        </ThemedText>
        <ThemedText style={[styles.footer, { color: colors.text3 }]}>
          Made for Nigerian Small Businesses
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
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '700',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
  },
  card: {
    borderRadius: 12,
    padding: 14,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  featureList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  creditText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
