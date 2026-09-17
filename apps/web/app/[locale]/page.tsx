import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Avastar from '@/components/avastar';
import { origin, type Locale } from '@/lib/avastar';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fa = locale === 'fa';
  return {
    title: fa ? 'آوا استار؛ مسیر کامل کشف کیهان' : 'Avastar — Your Complete Astronomy Journey',
    description: fa
      ? 'از یادگیری نجوم تا تجربه رصد، انتخاب آگاهانه تلسکوپ و عضویت در جامعه کاوشگران. مسیر نجومی خود را در منظومه آوا استار پیدا کنید.'
      : 'From learning astronomy to observing, choosing equipment and finding your community. Discover your path in the Avastar universe.',
    alternates: {
      canonical: `${origin}/${locale}`,
      languages: { fa: `${origin}/fa`, en: `${origin}/en` },
    },
    openGraph: {
      type: 'website',
      locale: fa ? 'fa_IR' : 'en_US',
      url: `${origin}/${locale}`,
      siteName: 'Avastar',
    },
  };
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'fa' && locale !== 'en') notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Avastar',
            alternateName: 'آوا استار',
            url: origin,
            logo: `${origin}/brand/logo-mark.png`,
          }),
        }}
      />
      <Avastar locale={locale as Locale} />
    </>
  );
}
