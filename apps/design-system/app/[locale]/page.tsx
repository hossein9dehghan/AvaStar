import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DesignSystem } from '@/components/design-system';
import { siteOrigin } from '@/lib/site';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'fa' ? 'دیزاین سیستم آوا استار | Avastar UI' : 'Avastar UI | Design system',
    alternates: {
      canonical: `${siteOrigin}/${locale}`,
      languages: { fa: `${siteOrigin}/fa`, en: `${siteOrigin}/en` },
    },
  };
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'fa' && locale !== 'en') notFound();
  return <DesignSystem locale={locale} />;
}
