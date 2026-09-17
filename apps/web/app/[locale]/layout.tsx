import { siteOrigin } from '@avastar/config/urls';
import type { Metadata } from 'next';
import { UiLocaleProvider } from '@avastar/ui/locale-provider';
import '../globals.css';
import '../fonts.css';
import '@avastar/theme/avastar-tokens.css';
import '@avastar/theme/avastar-base.css';
import '@avastar/theme/avastar-components.css';
import '../observatory.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: 'آوا استار | Avastar', template: '%s' },
  icons: { icon: '/brand/logo-mark.png' },
};
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale === 'en' ? 'en' : 'fa';
  return (
    <html
      lang={lang}
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('avastar-theme');document.documentElement.dataset.theme=['/fa','/en','/fa/','/en/'].includes(location.pathname)?'dark':t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}catch(e){}",
          }}
        />
      </head>
      <body>
        <UiLocaleProvider locale={lang}>{children}</UiLocaleProvider>
      </body>
    </html>
  );
}
