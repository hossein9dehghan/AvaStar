import { Languages } from 'lucide-react';
import type { Locale } from '@avastar/ui/lib/locale';
export function LanguageSwitch({ locale, href }: { locale: Locale; href: string }) {
  const target = locale === 'fa' ? 'en' : 'fa';
  const label = locale === 'fa' ? 'تغییر زبان به انگلیسی' : 'Switch language to Persian';
  return (
    <a
      className="av-language-switch"
      href={href}
      hrefLang={target}
      aria-label={label}
      title={label}
    >
      <Languages aria-hidden="true" />
      <span lang={target} dir={target === 'fa' ? 'rtl' : 'ltr'}>
        {target === 'fa' ? 'فارسی' : 'English'}
      </span>
    </a>
  );
}
