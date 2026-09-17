import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Avastar from '@/components/avastar';
import { planetIds, planets, guides, origin, type Locale, type PlanetId } from '@/lib/avastar';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== 'fa' && locale !== 'en') return {};
  const p = planetIds.includes(slug as PlanetId) ? planets[slug as PlanetId][locale] : null;
  const g = slug in guides ? guides[slug as keyof typeof guides] : null;
  const title = p
    ? `${p.name} | ${locale === 'fa' ? 'آوا استار' : 'Avastar'}`
    : g
      ? `${g.title[locale]} | Avastar`
      : 'Avastar';
  return {
    title,
    description: p?.detail || g?.description[locale],
    alternates: {
      canonical: `${origin}/${locale}/${slug}`,
      languages: { fa: `${origin}/fa/${slug}`, en: `${origin}/en/${slug}` },
    },
    openGraph: {
      title,
      url: `${origin}/${locale}/${slug}`,
      type: g ? 'article' : 'website',
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (
    (locale !== 'fa' && locale !== 'en') ||
    (!planetIds.includes(slug as PlanetId) && !(slug in guides))
  )
    notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: locale === 'fa' ? 'آوا استار' : 'Avastar',
                item: `${origin}/${locale}`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: planetIds.includes(slug as PlanetId)
                  ? planets[slug as PlanetId][locale as Locale].name
                  : guides[slug as keyof typeof guides].title[locale as Locale],
                item: `${origin}/${locale}/${slug}`,
              },
            ],
          }),
        }}
      />
      <Avastar locale={locale as Locale} slug={slug} />
    </>
  );
}
