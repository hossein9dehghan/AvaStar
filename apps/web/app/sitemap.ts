import type { MetadataRoute } from 'next';
import { origin, planetIds, guides } from '@/lib/avastar';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', ...planetIds.map((x) => '/' + x), ...Object.keys(guides).map((x) => '/' + x)].flatMap(
    (path) =>
      ['fa', 'en'].map((locale) => ({
        url: `${origin}/${locale}${path}`,
        alternates: {
          languages: { fa: `${origin}/fa${path}`, en: `${origin}/en${path}` },
        },
      })),
  );
}
