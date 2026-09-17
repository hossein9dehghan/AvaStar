import { redirect, notFound } from 'next/navigation';
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'fa' && locale !== 'en') notFound();
  redirect(`/${locale}`);
}
