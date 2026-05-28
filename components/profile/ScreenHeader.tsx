import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../ThemedText';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
}

export default function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const inset = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.pageHeader,
        { borderBottomColor: colors.border, paddingTop: inset.top + 16 },
      ]}
    >
      <TouchableOpacity onPress={onBack ? onBack : () => router.back()}>
        <Ionicons name='arrow-back' size={24} color={colors.text} />
      </TouchableOpacity>
      <ThemedText style={[styles.pageTitle, { color: colors.text }]}>
        {title}
      </ThemedText>
      <View style={{ width: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,

    paddingBottom: 14,
    borderBottomWidth: 0.5,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});
