import useAppTheme from '@/hooks/useAppTheme';
import {
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
  type ViewProps,
} from 'react-native';

export type ThemedViewProps = ViewProps &
  TouchableOpacityProps & {
    inversed?: boolean;
    canScroll?: boolean;
    onPress?: () => void; // Optional press handler
  };

export function ThemedView({
  style,
  inversed,
  onPress,
  canScroll = false,
  ...otherProps
}: ThemedViewProps) {
  const { colors } = useAppTheme();

  const backgroundStyle = {
    backgroundColor: inversed ? colors.inversed : colors.background,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[backgroundStyle, style]}
        onPress={onPress}
        {...otherProps}
      />
    );
  }

  return <View style={[backgroundStyle, style]} {...otherProps} />;
}
