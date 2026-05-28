import ScreenHeader from '@/components/profile/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useUpdateShop } from '@/hooks/useData';
import { useApp } from '@/Providers/AppProvider';
import { useAuth } from '@/Providers/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type Theme = 'light' | 'dark' | 'auto';

export default function AppearanceScreen() {
  const { colors, dark } = useAppTheme();
  const router = useRouter();
  const { shop, refreshShop } = useAuth();
  const { theme, setTheme } = useApp();

  const { mutate, isPending } = useUpdateShop(shop?.id || '');

  const handleThemeChange = (thm: Theme) => {
    setTheme(thm);

    // persist to DB
    mutate(
      { theme: thm },
      {
        onError: () => {
          // optional rollback
          setTheme(theme);
        },
      },
    );
  };

  const themes: {
    id: Theme;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    description: string;
  }[] = [
    {
      id: 'light',
      label: 'Light',
      icon: 'sunny-outline',
      description: 'Light theme for bright environments',
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: 'moon-outline',
      description: 'Dark theme to reduce eye strain',
    },
    {
      id: 'auto',
      label: 'Auto',
      icon: 'contrast-outline',
      description: 'Follow system settings',
    },
  ];

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <ScreenHeader title='Appearance' />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Current Theme Display */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={[styles.label, { color: colors.text3 }]}>
            Current Theme
          </ThemedText>
          <View style={styles.currentTheme}>
            {theme === 'light' && (
              <Ionicons name='sunny-outline' size={32} color={colors.primary} />
            )}
            {theme === 'dark' && (
              <Ionicons name='moon-outline' size={32} color={colors.primary} />
            )}
            {theme === 'auto' && (
              <Ionicons
                name='contrast-outline'
                size={32}
                color={colors.primary}
              />
            )}
            <ThemedText
              style={[styles.currentThemeText, { color: colors.text }]}
            >
              {themes.find((t) => t.id === theme)?.label}
            </ThemedText>
          </View>
        </View>

        {/* Theme Selection */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={[styles.label, { color: colors.text3 }]}>
            Choose Theme
          </ThemedText>
          <View style={styles.themeGrid}>
            {themes.map((thm) => (
              <TouchableOpacity
                key={thm.id}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor:
                      theme === thm.id ? colors.primary : colors.surface2,
                    borderColor: colors.border,
                    borderWidth: theme === thm.id ? 0 : 1,
                  },
                ]}
                onPress={() => handleThemeChange(thm.id)}
              >
                <Ionicons
                  name={thm.icon}
                  size={28}
                  color={theme === thm.id ? '#FFFFFF' : colors.text}
                />
                <ThemedText
                  style={[
                    styles.themeLabel,
                    {
                      color: theme === thm.id ? '#FFFFFF' : colors.text,
                    },
                  ]}
                >
                  {thm.label}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.themeDesc,
                    {
                      color: theme === thm.id ? '#FFFFFFDD' : colors.text3,
                    },
                  ]}
                >
                  {thm.description}
                </ThemedText>
                {theme === thm.id && (
                  <View style={styles.checkmark}>
                    <Ionicons name='checkmark' size={16} color='#FFFFFF' />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: colors.blue_soft }]}>
          <Ionicons
            name='information-circle-outline'
            size={20}
            color={colors.primary}
          />
          <ThemedText style={[styles.infoText, { color: colors.text }]}>
            Theme changes apply immediately. Your preference is saved for next
            time.
          </ThemedText>
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
  currentTheme: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  currentThemeText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeOption: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    gap: 6,
  },
  themeLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  themeDesc: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 13,
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionDesc: {
    fontSize: 12,
    marginTop: 2,
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
});
