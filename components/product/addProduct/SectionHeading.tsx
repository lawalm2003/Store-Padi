import { ThemedText } from '@/components/ThemedText';
import useAppTheme from '@/hooks/useAppTheme';
import { StyleSheet, View } from 'react-native';

export default function SectionHeading({ title }: { title: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.sectionHeading, { borderLeftColor: colors.primary }]}>
      <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
});
