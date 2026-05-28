import useAppTheme from '@/hooks/useAppTheme';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { SettingsRow } from './SettingsRow';

type Row = React.ComponentProps<typeof SettingsRow>;

type Props = {
  title?: string;
  rows: Row[];
};

export function SettingsGroup({ title, rows }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      {title && (
        <ThemedText style={[styles.title, { color: colors.text3 }]}>
          {title}
        </ThemedText>
      )}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {rows.map((row, i) => (
          <SettingsRow
            key={row.label}
            {...row}
            isLast={i === rows.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 14,
    paddingHorizontal: 14,
  },
});
