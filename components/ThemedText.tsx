import { fonts } from '@/constants/fonts';
import useAppTheme from '@/hooks/useAppTheme';
import { Text, type TextProps, StyleSheet } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  inversed?: boolean;
  center?: boolean;
};

export function ThemedText({
  style,
  type = 'default',
  inversed,
  center,
  ...rest
}: ThemedTextProps) {
  const { colors } = useAppTheme();

  return (
    <Text
      style={[
        {
          color: colors[inversed ? 'text_inversed' : 'text'],
          fontFamily: fonts.regular.fontFamily,
        },
        center ? { textAlign: 'center' } : undefined,
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 20,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#2c67e3',
  },
});
