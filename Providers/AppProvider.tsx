import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'auto';

type AppContextType = {
  theme: ThemePreference;
  colorScheme: 'light' | 'dark';
  setTheme: (theme: ThemePreference) => void;

  appLoaded: boolean;
  setAppLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextType | null>(null);

export default function AppProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();

  const [theme, setTheme] = useState<ThemePreference>('auto');

  const [appLoaded, setAppLoaded] = useState(false);

  const colorScheme = useMemo(() => {
    if (theme === 'auto') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }

    return theme;
  }, [theme, systemScheme]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        colorScheme,
        appLoaded,
        setAppLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error('useApp must be inside AppProvider');
  }

  return ctx;
};
