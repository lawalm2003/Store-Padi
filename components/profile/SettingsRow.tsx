import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type RowType = 'navigate' | 'toggle' | 'value' | 'destructive';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  sub?: string;
  type?: RowType;
  value?: string;
  toggled?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  isLast?: boolean;
};

export function SettingsRow({
  icon,
  iconColor,
  label,
  sub,
  type = 'navigate',
  value,
  toggled,
  onToggle,
  onPress,
  isLast,
}: Props) {
  const { colors } = useAppTheme();
  const ic = iconColor ?? colors.text3;

  const content = (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 0.5, borderBottomColor: colors.border },
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: colors.surface2 }]}>
        <Ionicons name={icon} size={16} color={ic} />
      </View>

      {/* Labels */}
      <View style={styles.labels}>
        <ThemedText
          style={[
            styles.label,
            { color: type === 'destructive' ? colors.error : colors.text },
          ]}
        >
          {label}
        </ThemedText>
        {sub && (
          <ThemedText style={[styles.sub, { color: colors.text3 }]}>
            {sub}
          </ThemedText>
        )}
      </View>

      {/* Right element */}
      {type === 'navigate' && (
        <Ionicons name='chevron-forward' size={15} color={colors.text3} />
      )}
      {type === 'value' && value && (
        <ThemedText style={[styles.value, { color: colors.text3 }]}>
          {value}
        </ThemedText>
      )}
      {type === 'toggle' && (
        <Switch
          value={toggled}
          onValueChange={onToggle}
          trackColor={{ false: colors.surface2, true: colors.primary }}
          thumbColor='#FFFFFF'
        />
      )}
    </View>
  );

  if (type === 'toggle') return content;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  labels: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  sub: {
    fontSize: 12,
  },
  value: {
    fontSize: 13,
  },
});
