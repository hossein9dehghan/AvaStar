'use client';
import { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@avastar/ui/components/accordion';
import { inventory, contractDetails, componentSlug, metricsFor } from './component-contracts';
import { useActiveComponent } from './documentation';
import { translate, type Locale } from '@/lib/site';
export function ComponentReference({ section, locale }: { section: string; locale: Locale }) {
  const selected = useActiveComponent(),
    t = translate(locale),
    lang = locale === 'fa' ? 0 : 1;
  const rows = inventory.filter((row) => row[1] === section);
  useEffect(() => {
    if (!selected) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(`${section}--${selected}`);
      target?.scrollIntoView({ block: 'start' });
      target?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [section, selected]);
  if (!rows.length) return null;
  return (
    <section className="ds-component-reference" aria-labelledby={`${section}-reference-title`}>
      <h2 id={`${section}-reference-title`}>{t('قرارداد اجزا', 'Component reference')}</h2>
      <p>
        {t(
          'کاربرد، حالت‌ها و API هر جزء را باز کنید.',
          'Expand a component for usage, states and its API.',
        )}
      </p>
      <Accordion
        type="multiple"
        key={selected || section}
        defaultValue={selected ? [selected] : []}
      >
        {rows.map(([name, , states]) => {
          const detail = contractDetails[name],
            slug = componentSlug(name),
            metrics = metricsFor(name);
          return (
            <AccordionItem value={slug} key={name} id={`${section}--${slug}`}>
              <AccordionTrigger>
                <span>{locale === 'fa' ? detail.fa : name}</span>
                {locale === 'fa' && <small dir="ltr">{name}</small>}
              </AccordionTrigger>
              <AccordionContent>
                <div className="ds-reference-grid">
                  <div>
                    <h3>{t('کاربرد', 'Usage')}</h3>
                    <p>{detail.usage[lang]}</p>
                    <h3>{t('کیبورد و فوکوس', 'Keyboard & focus')}</h3>
                    <p>{detail.keyboard[lang]}</p>
                  </div>
                  <div>
                    <h3>{t('حالت‌های قابل بررسی', 'States to exercise')}</h3>
                    <p dir="ltr" className="ds-reference-states">
                      {states}
                    </p>
                    <h3>{t('API اصلی', 'Core API')}</h3>
                    <code dir="ltr">{detail.api}</code>
                  </div>
                </div>
                <div
                  className="ds-metrics"
                  aria-label={t('اندازه‌های اجرایی', 'Implementation measurements')}
                >
                  <h3>{t('اندازه‌های اجرایی', 'Implementation measurements')}</h3>
                  <dl>
                    <div>
                      <dt>{t('ارتفاع', 'Height')}</dt>
                      <dd dir="ltr">{metrics.height}</dd>
                    </div>
                    <div>
                      <dt>{t('گردی گوشه', 'Corner radius')}</dt>
                      <dd dir="ltr">{metrics.radius}</dd>
                    </div>
                    <div>
                      <dt>{t('فاصلهٔ داخلی', 'Internal inset')}</dt>
                      <dd dir="ltr">{metrics.inset}</dd>
                    </div>
                    <div>
                      <dt>{t('ناحیهٔ لمس', 'Touch target')}</dt>
                      <dd dir="ltr">{metrics.target}</dd>
                    </div>
                    {metrics.gap && (
                      <div>
                        <dt>{t('فاصلهٔ اجزا', 'Element gap')}</dt>
                        <dd dir="ltr">{metrics.gap}</dd>
                      </div>
                    )}
                  </dl>
                  <p>
                    {t(
                      'این اعداد قرارداد پیاده‌سازی هستند؛ تغییرشان باید هم‌زمان در توکن‌ها، نمونه‌ها و لندینگ اعمال شود.',
                      'These values are implementation contracts. Any change must update tokens, specimens and the landing together.',
                    )}
                  </p>
                </div>
                <a
                  className="ds-text-link"
                  href={`#${section}`}
                  onClick={() =>
                    document.getElementById(section)?.scrollIntoView({ block: 'start' })
                  }
                >
                  {t('بازگشت به نمونه‌ها', 'Back to examples')}
                </a>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
