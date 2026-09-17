'use client';
import { createContext, useContext, type ReactNode } from 'react';
const LocaleContext = createContext<'fa' | 'en'>('en');
export function UiLocaleProvider({
  locale,
  children,
}: {
  locale: 'fa' | 'en';
  children: ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
export const useUiLocale = () => useContext(LocaleContext);
