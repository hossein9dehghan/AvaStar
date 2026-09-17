'use client';
import { useSyncExternalStore } from 'react';
const preferencesChanged = 'avastar-preferences-change';
const memory = new Map<string, string>();
function read(key: string) {
  try {
    return localStorage.getItem(key) ?? memory.get(key);
  } catch {
    return memory.get(key);
  }
}
function write(key: string, value: string) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {}
  window.dispatchEvent(new Event(preferencesChanged));
}
function subscribe(notify: () => void) {
  const media = [
    matchMedia('(prefers-color-scheme: light)'),
    matchMedia('(prefers-reduced-motion: reduce)'),
  ];
  media.forEach((item) => item.addEventListener('change', notify));
  window.addEventListener('storage', notify);
  window.addEventListener(preferencesChanged, notify);
  return () => {
    media.forEach((item) => item.removeEventListener('change', notify));
    window.removeEventListener('storage', notify);
    window.removeEventListener(preferencesChanged, notify);
  };
}
const subscribeHydration = () => () => {};
export function useBrowserPreferences(home: boolean) {
  const mounted = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const theme = useSyncExternalStore(
    subscribe,
    () => {
      if (home) return 'dark';
      const saved = read('avastar-theme');
      return saved === 'light' || saved === 'dark'
        ? saved
        : matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark';
    },
    () => 'dark' as const,
  );
  const reduced = useSyncExternalStore(
    subscribe,
    () => {
      const saved = read('avastar-motion');
      return (
        saved === 'reduced' ||
        (saved !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches)
      );
    },
    () => false,
  );
  return {
    mounted,
    theme,
    reduced,
    changeTheme: () => write('avastar-theme', theme === 'dark' ? 'light' : 'dark'),
    changeMotion: () => write('avastar-motion', reduced ? 'full' : 'reduced'),
  };
}
