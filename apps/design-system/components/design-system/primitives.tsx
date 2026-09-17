'use client';
import { Eye, Code2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@avastar/ui/components/tabs';
import { Button } from '@avastar/ui/components/button';
import type { Locale } from '@/lib/site';
import { ComponentReference } from './component-reference';
import { useDocumentation, SectionGuidance, sections } from './documentation';
export function Section({
  id,
  index,
  title,
  description,
  children,
}: {
  id: string;
  index: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { active, locale } = useDocumentation();
  const label = sections.find(([key]) => key === id)?.[locale === 'fa' ? 1 : 2] ?? title;
  if (active !== id) return null;
  return (
    <section id={id} className="ds-section">
      <header className="ds-section-heading">
        <span className="ds-eyebrow" dir="ltr">
          {index}
        </span>
        <h1>
          <a href={`#${id}`}>{label}</a>
        </h1>
        {description && <p>{description}</p>}
      </header>
      {children}
      <SectionGuidance id={id} />
      <ComponentReference section={id} locale={locale} />
    </section>
  );
}
export function CopyButton({
  value,
  label,
  locale = 'fa',
}: {
  value: string;
  label?: string;
  locale?: Locale;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
      toast.success(locale === 'fa' ? 'کپی شد' : 'Copied');
    } catch {
      toast.error(locale === 'fa' ? 'متن را انتخاب و کپی کنید.' : 'Select and copy the text.');
    }
  }
  return (
    <Button
      variant="ghost"
      className="av-button av-button--ghost av-button--icon"
      onClick={copy}
      aria-label={label || (locale === 'fa' ? 'کپی کد' : 'Copy code')}
    >
      {copied ? <Check size={17} /> : <Copy size={17} />}
    </Button>
  );
}
export function CodeBlock({ children, locale = 'fa' }: { children: string; locale?: Locale }) {
  return (
    <div className="ds-code">
      <CopyButton value={children} locale={locale} />
      <pre dir="ltr">
        <code>{children}</code>
      </pre>
    </div>
  );
}
export function Specimen({
  title,
  description,
  source,
  locale,
  children,
}: {
  title: string;
  description?: string;
  source: string;
  locale: Locale;
  children: ReactNode;
}) {
  const { active } = useDocumentation();
  const modules: Record<string, string> = {
    buttons: 'component-gallery',
    forms:
      title.includes('Textarea') ||
      title.includes('چندخطی') ||
      title.includes('عدد') ||
      title.includes('Number') ||
      title.includes('خلاصه') ||
      title.includes('summary')
        ? 'form-patterns'
        : 'component-gallery',
    selection: 'input-patterns',
    pickers: 'input-patterns',
    navigation: 'interaction-patterns',
    disclosure: 'interaction-patterns',
    overlays: 'interaction-patterns',
    cards: 'content-patterns',
    data: 'content-patterns',
    materials: 'content-patterns',
    feedback: 'component-gallery',
  };
  const sourceModule = modules[active];
  return (
    <div className="ds-specimen">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <Tabs defaultValue="preview" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
        <TabsList aria-label={title}>
          <TabsTrigger value="preview">
            <Eye aria-hidden="true" />
            {locale === 'fa' ? 'پیش‌نمایش' : 'Preview'}
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code2 aria-hidden="true" />
            {locale === 'fa' ? 'کد' : 'Code'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="ds-specimen-preview">
          {children}
        </TabsContent>
        <TabsContent value="code">
          <p className="ds-note">
            {locale === 'fa'
              ? 'قطعهٔ زیر بخش اصلی استفاده را نشان می‌دهد.'
              : 'This snippet shows the core usage.'}{' '}
            {sourceModule && (
              <a
                className="ds-text-link"
                download
                href={`/design-system/source/components/design-system/${sourceModule}.tsx`}
              >
                {locale === 'fa' ? 'دریافت سورس کامل نمونه‌ها' : 'Download complete example source'}
              </a>
            )}
          </p>
          <CodeBlock locale={locale}>{source}</CodeBlock>
        </TabsContent>
      </Tabs>
    </div>
  );
}
