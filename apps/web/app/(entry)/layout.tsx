import type { Metadata } from 'next';
import '../globals.css';
export const metadata: Metadata = {
  title: 'آوا استار | مسیر کامل کشف کیهان',
  description: 'از یادگیری نجوم تا تجربه رصد، انتخاب ابزار و عضویت در جامعه کاوشگران',
  icons: { icon: '/brand/logo-mark.png' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
