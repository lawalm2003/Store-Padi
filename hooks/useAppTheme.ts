import { DarkThemeCustom, LightTheme } from '@/constants/theme';
import { useApp } from '@/Providers/AppProvider';

export default function useAppTheme() {
  const { colorScheme } = useApp();

  const theme = colorScheme === 'light' ? LightTheme : DarkThemeCustom;

  return {
    ...theme,
    scheme: colorScheme,
  };
}
