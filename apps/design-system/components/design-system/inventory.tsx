'use client';
import { useState } from 'react';
import { Input } from '@avastar/ui/components/input';
import { Section } from './primitives';
import { translate, type Locale } from '@/lib/site';
import { inventory, contractDetails, componentSlug } from './component-contracts';
import { normalizeSearch } from './documentation';
export function Inventory({ locale }: { locale: Locale }) {
  const t = translate(locale),
    [query, setQuery] = useState('');
  const rows = inventory.filter((row) =>
    normalizeSearch(row.join(' ') + ' ' + contractDetails[row[0]].fa).includes(
      normalizeSearch(query),
    ),
  );
  return (
    <Section
      id="catalog"
      index="BUILD / INVENTORY"
      title={t('فهرست اجزا و حالت‌ها', 'Component & state inventory')}
      description={t(
        'هر ردیف قرارداد جزء را در بخش نمونه‌های زنده باز می‌کند. حالت‌های بازخورد و داده برای هر دو تم مشترک‌اند.',
        'Each row opens its contract in the live example section. Feedback and data states apply to both themes.',
      )}
    >
      <label htmlFor="inventory-search">
        {t('جست‌وجوی جزء یا حالت؛ فارسی و انگلیسی', 'Find a component or state')}
      </label>
      <Input
        id="inventory-search"
        className="av-field"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('مثلاً سوییچ، فرم یا disabled…', 'Button, disabled, loading…')}
      />
      <p className="ds-note" role="status">
        {new Intl.NumberFormat(locale).format(rows.length)}{' '}
        {t('جزء و الگوی قابل بررسی', 'components and patterns')}
      </p>
      <div className="ds-table-scroll">
        <table className="ds-standards-table">
          <thead>
            <tr>
              <th>{t('جزء', 'Component')}</th>
              <th>{t('حالت‌ها', 'States')}</th>
              <th>{t('نمونه', 'Example')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, section, states]) => (
              <tr key={name}>
                <th scope="row">
                  {locale === 'fa' ? contractDetails[name].fa : name}
                  {locale === 'fa' && (
                    <small className="ds-catalog-en" dir="ltr">
                      {name}
                    </small>
                  )}
                </th>
                <td dir="ltr">{states}</td>
                <td>
                  <a className="ds-text-link" href={`#${section}/${componentSlug(name)}`}>
                    {t('نمونه و قرارداد', 'Example & contract')}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <p className="ds-empty">
            {t('جزئی پیدا نشد؛ عبارت دیگری امتحان کنید.', 'No components found. Try another term.')}
          </p>
        )}
      </div>
    </Section>
  );
}
