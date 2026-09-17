import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@avastar/ui/theme-provider';
import { siteOrigin } from '@/lib/site';
import '../globals.css';
import '../fonts.css';
import '@avastar/theme/avastar-tokens.css';
import '@avastar/theme/avastar-base.css';
import '@avastar/theme/avastar-components.css';
import '@avastar/theme/avastar-materials.css';
import '@avastar/theme/avastar-panels.css';
import '../design-system.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: 'Avastar UI | دیزاین سیستم آوا استار',
  description: 'دیزاین سیستم آوا استار، تم روشن و تیره و اجزای قابل استفاده در پنل کاربری و ادمین.',
  robots: { index: false, follow: true },
  icons: { icon: '/brand/logo-mark.png' },
};
const initializeTheme = `try{var m;try{m=localStorage.getItem('avastar-ui-theme')}catch(e){}if(!m)m=(document.cookie.match(/(?:^|; )avastar-ui-theme=(light|dark|system)(?:;|$)/)||[])[1];var d=m==='dark'||(m!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}`;
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== 'fa' && locale !== 'en') notFound();
  return (
    <html
      lang={locale}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: initializeTheme }} />
      </head>
      <body>
        <ThemeProvider locale={locale}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
