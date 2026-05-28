import useAppTheme from '@/hooks/useAppTheme';
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function FormButton({
  title,
  onPress,
  loading,
  disabled,
  style,
  textStyle,
}: Props) {
  const { colors } = useAppTheme();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.btn,
        { backgroundColor: colors.primary },
        isDisabled && { backgroundColor: colors.disabled },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color='#FFFFFF' size='small' />
      ) : (
        <ThemedText style={[styles.text, textStyle]}>{title}</ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
