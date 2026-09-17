'use client';
import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@avastar/ui/components/select';
import { UiLocaleProvider } from './locale-provider';
import { Toaster } from '@avastar/ui/components/sonner';
export type ThemeMode = 'light' | 'dark' | 'system';
type Theme = 'light' | 'dark';
const storageKey = 'avastar-ui-theme';
const changeEvent = 'avastar-ui-theme-change';
let fallbackMode: ThemeMode = 'system';
function readMode(): ThemeMode {
  let value: string | null = null;
  try {
    value = localStorage.getItem(storageKey);
  } catch {}
  if (!value) {
    try {
      value =
        document.cookie.match(/(?:^|; )avastar-ui-theme=(light|dark|system)(?:;|$)/)?.[1] ?? null;
    } catch {}
  }
  return value === 'light' || value === 'dark' || value === 'system' ? value : fallbackMode;
}
function subscribeMode(notify: () => void) {
  window.addEventListener(changeEvent, notify);
  window.addEventListener('storage', notify);
  return () => {
    window.removeEventListener(changeEvent, notify);
    window.removeEventListener('storage', notify);
  };
}
function subscribeSystem(notify: () => void) {
  const media = matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
}
const readSystem = () => matchMedia('(prefers-color-scheme: dark)').matches;
const subscribeHydration = () => () => {};
const ThemeContext = createContext<{
  mode: ThemeMode;
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
}>({ mode: 'system', theme: 'light', setMode: () => {} });
export function ThemeProvider({
  children,
  locale = 'fa',
}: {
  children: ReactNode;
  locale?: 'fa' | 'en';
}) {
  const mode = useSyncExternalStore(subscribeMode, readMode, () => 'system' as ThemeMode);
  const systemDark = useSyncExternalStore(subscribeSystem, readSystem, () => false);
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const theme: Theme = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, hydrated]);
  function setMode(value: ThemeMode) {
    fallbackMode = value;
    try {
      localStorage.setItem(storageKey, value);
    } catch {}
    try {
      document.cookie = `${storageKey}=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {}
    window.dispatchEvent(new Event(changeEvent));
  }
  return (
    <UiLocaleProvider locale={locale}>
      <ThemeContext.Provider value={{ mode, theme, setMode }}>
        {children}
        <Toaster
          theme={theme}
          containerAriaLabel={locale === 'fa' ? 'اعلان‌ها' : 'Notifications'}
          toastOptions={{
            closeButtonAriaLabel: locale === 'fa' ? 'بستن اعلان' : 'Close notification',
          }}
          dir={locale === 'fa' ? 'rtl' : 'ltr'}
          position={locale === 'fa' ? 'bottom-left' : 'bottom-right'}
        />
      </ThemeContext.Provider>
    </UiLocaleProvider>
  );
}
export const useAvastarTheme = () => useContext(ThemeContext);
export function ThemeControl({ locale = 'fa' }: { locale?: 'fa' | 'en' }) {
  const { mode, setMode } = useAvastarTheme();
  const fa = locale === 'fa';
  return (
    <Select
      value={mode}
      onValueChange={(value) => setMode(value as ThemeMode)}
      dir={fa ? 'rtl' : 'ltr'}
    >
      <SelectTrigger className="theme-control" aria-label={fa ? 'حالت نمایش' : 'Color theme'}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value="light">
          <Sun size={18} aria-hidden="true" />
          {fa ? 'روشن' : 'Light'}
        </SelectItem>
        <SelectItem value="dark">
          <Moon size={18} aria-hidden="true" />
          {fa ? 'تیره' : 'Dark'}
        </SelectItem>
        <SelectItem value="system">
          <Monitor size={18} aria-hidden="true" />
          {fa ? 'سیستم' : 'System'}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
