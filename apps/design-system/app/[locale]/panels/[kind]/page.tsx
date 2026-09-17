import { notFound } from 'next/navigation';
import { PanelDemo } from '@/components/design-system/panel-demos';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; kind: string }>;
}) {
  const { locale, kind } = await params;
  if ((locale !== 'fa' && locale !== 'en') || (kind !== 'admin' && kind !== 'user')) notFound();
  return <PanelDemo locale={locale} kind={kind} />;
}
