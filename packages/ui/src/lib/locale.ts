export type Locale = 'fa' | 'en';
export const translate = (locale: Locale) => (fa: string, en: string) =>
  locale === 'fa' ? fa : en;
