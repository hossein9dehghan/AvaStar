import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { designSystemOrigin } from '@/lib/design-system';
export const metadata: Metadata = { robots: { index: false, follow: true } };
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'fa' && locale !== 'en') notFound();
  redirect(`${designSystemOrigin}/${locale}`);
}
