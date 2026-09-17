'use client';
import { useState, type CSSProperties } from 'react';
import { Check, Download } from 'lucide-react';
import { Input } from '@avastar/ui/components/input';
import { Tabs, TabsList, TabsTrigger } from '@avastar/ui/components/tabs';
import { Section, CopyButton, CodeBlock } from './primitives';
import { useAvastarTheme } from '@avastar/ui/theme-provider';
import { contrastRatio } from '@/lib/contrast';
import { translate, type Locale } from '@/lib/site';
import tokens from '@/public/design-system/tokens.json';
export function Foundations({ locale }: { locale: Locale }) {
  const t = translate(locale),
    { theme } = useAvastarTheme(),
    semantic = tokens.themes[theme];
  const [sample, setSample] = useState(
    t('کشف کیهان، برای کشف خود.', 'Discover the universe. Discover yourself.'),
  );
  const [grid, setGrid] = useState('desktop');
  const pairs = [
    ['foreground', 'background', t('متن اصلی', 'Primary text')],
    ['muted-foreground', 'card', t('متن فرعی', 'Secondary text')],
    ['primary-foreground', 'primary', t('اقدام اصلی', 'Primary action')],
    ['link', 'background', t('لینک متنی', 'Text link')],
    ['success', 'success-background', t('موفقیت', 'Success')],
    ['warning', 'warning-background', t('هشدار', 'Warning')],
    ['destructive', 'destructive-background', t('خطا', 'Error')],
    ['info', 'info-background', t('اطلاع', 'Information')],
  ] as const;
  return (
    <>
      <Section
        id="brand"
        index="01 / IDENTITY"
        title={t('هویت، ثابت؛ کاربرد، منعطف', 'Consistent identity. Flexible application.')}
        description={t(
          'رنگ‌های لوگو پایه هویت‌اند. رنگ معنایی هر تم برای خوانایی همان محیط تنظیم می‌شود.',
          'The logo defines the brand palette. Semantic colors adapt to each theme for readability.',
        )}
      >
        <div className="ds-logo-grid">
          <div className="ds-logo-card fixed-dark">
            <span>{t('روی زمینه تیره', 'On dark')}</span>
            <img
              src={`/brand/logo-lockup-${locale}-mono.png`}
              width="220"
              height="70"
              alt={t('لوگوی سفید آوا استار', 'White Avastar logo')}
            />
            <a href={`/brand/logo-lockup-${locale}-mono.png`} download>
              <Download size={16} /> PNG
            </a>
          </div>
          <div className="ds-logo-card fixed-light">
            <span>{t('روی زمینه روشن', 'On light')}</span>
            <img
              src={`/brand/logo-lockup-${locale}.png`}
              width="220"
              height="70"
              alt={t('لوگوی رنگی آوا استار', 'Full-color Avastar logo')}
            />
            <a href={`/brand/logo-lockup-${locale}.png`} download>
              <Download size={16} /> PNG
            </a>
          </div>
          <div className="ds-logo-card">
            <span>{t('نشان مستقل', 'Standalone mark')}</span>
            <img
              src="/brand/logo-mark.png"
              width="80"
              height="80"
              alt={t('نشان آوا استار', 'Avastar mark')}
            />
            <a href="/brand/logo-mark.png" download>
              <Download size={16} /> PNG
            </a>
          </div>
        </div>
        <div className="ds-notes">
          <p>
            <strong>{t('حریم امن', 'Clear space')}</strong>
            {t(
              'حداقل یک‌چهارم ارتفاع نشان؛ حداقل عرض لوگوتایپ ۱۱۲ و نشان ۲۴ پیکسل.',
              'At least one quarter of the mark height. Minimum width: lockup 112px, mark 24px.',
            )}
          </p>
          <p>
            <strong>{t('یک خانواده، دو محیط', 'One family, two contexts')}</strong>
            {t(
              'دکمه‌های گرد برای لندینگ؛ شعاع ۱۲ پیکسل برای پنل‌ها. لوگو و پالت در هر دو مشترک‌اند.',
              'Pill actions for the landing; 12px corners in panels. Both share the same logo and palette.',
            )}
          </p>
        </div>
      </Section>
      <Section
        id="colors"
        index="02 / COLOR"
        title={t('رنگ‌ها و کنتراست واقعی', 'Colors & measured contrast')}
        description={t(
          'با تغییر تم در بالای صفحه، مقادیر و نمونه‌های این بخش هم تغییر می‌کنند.',
          'Change the theme in the header to update these values and examples.',
        )}
      >
        <div className="ds-brand-colors">
          {Object.entries(tokens.brand).map(([name, value]) => (
            <div
              key={name}
              style={{ background: value, color: name === 'orange' ? '#172338' : 'white' }}
            >
              <span>{name.toUpperCase()}</span>
              <strong dir="ltr">{value}</strong>
              <CopyButton
                value={value}
                label={t('کپی رنگ ', 'Copy color ') + name}
                locale={locale}
              />
            </div>
          ))}
        </div>
        <p className="ds-note">
          {t(
            'آبی لوگو برای دکمه اصلی ثابت است؛ برای متن لینک در دارک از آبی روشن‌تر و برای هشدار در لایت از کهربایی تیره استفاده می‌شود.',
            'The action blue stays constant. Dark-mode links use a lighter blue; light-mode warnings use a darker amber.',
          )}
        </p>
        <div className="ds-token-grid">
          {(
            [
              'background',
              'foreground',
              'card',
              'muted-foreground',
              'secondary',
              'border',
              'input',
              'ring',
              'link',
              'success',
              'warning',
              'destructive',
            ] as const
          ).map((key) => (
            <div key={key} className="ds-token">
              <span className="ds-chip" style={{ background: semantic[key] }} />
              <div>
                <code>{key}</code>
                <small dir="ltr">{semantic[key]}</small>
              </div>
              <CopyButton
                value={`var(--${key})`}
                label={t('کپی توکن ', 'Copy token ') + key}
                locale={locale}
              />
            </div>
          ))}
        </div>
        <h2 className="ds-subheading">
          {t('متن معمولی · هدف حداقل ۴٫۵:۱', 'Normal text · minimum target 4.5:1')}
        </h2>
        <div className="ds-contrast-grid">
          {pairs.map(([fg, bg, name]) => {
            const ratio = contrastRatio(semantic[fg], semantic[bg]);
            return (
              <article key={fg}>
                <div style={{ color: semantic[fg], background: semantic[bg] }}>
                  {t('آسمان برای همه', 'The sky is for everyone')}
                </div>
                <footer>
                  <strong>{name}</strong>
                  <span dir="ltr">{ratio.toFixed(2)} : 1</span>
                  <span className={`av-badge av-badge--${ratio >= 4.5 ? 'success' : 'error'}`}>
                    <Check size={13} />
                    {ratio >= 4.5 ? 'AA' : 'Fail'}
                  </span>
                </footer>
              </article>
            );
          })}
        </div>
        <p className="ds-note">
          {t(
            'محاسبه از رنگ‌های واقعی توکن‌هاست. روی تصویر یا سطح شفاف، ترکیب نهایی باید جداگانه بررسی شود.',
            'Ratios are calculated from the actual opaque tokens. Text over imagery or transparency needs a separate check.',
          )}{' '}
          <a
            href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
            target="_blank"
            rel="noreferrer"
          >
            WCAG 1.4.3 ↗
          </a>
        </p>
      </Section>
      <Section
        id="type"
        index="03 / TYPOGRAPHY"
        title={t('پیدا؛ خوانا در هر مقیاس', 'Peyda, readable at every scale')}
        description={t(
          'پنج وزن فونت اصلی برند؛ با مقیاس جدا برای تیتر، متن، فرم و داده.',
          'Five original brand font weights, with separate roles for headings, body text, forms and data.',
        )}
      >
        <label htmlFor="type-sample">{t('متن آزمایشی', 'Sample text')}</label>
        <Input
          id="type-sample"
          className="av-field"
          value={sample}
          maxLength={90}
          onChange={(event) => setSample(event.target.value)}
        />
        <div className="ds-weight-grid">
          {tokens.typography.weights.map((weight) => (
            <div key={weight.value}>
              <span style={{ fontWeight: weight.value }}>{locale === 'fa' ? 'آوا' : 'Aa'}</span>
              <strong>{weight.name}</strong>
              <small>{weight.value}</small>
              <a
                href={`/fonts/${weight.file}`}
                download
                aria-label={t('دانلود فونت ', 'Download font ') + weight.name}
              >
                <Download size={16} />
              </a>
            </div>
          ))}
        </div>
        <div className="ds-type-scale">
          {tokens.typography.scale.map((row) => (
            <div key={row.role}>
              <div>
                <strong>{row.role}</strong>
                <code>
                  {row.size} / {row.weight}
                </code>
                <small>
                  {t('ارتفاع خط', 'Line height')}: {row.lineHeight}
                </small>
              </div>
              <p
                style={
                  {
                    '--sample-size': row.size,
                    '--sample-mobile': row.mobile,
                    fontWeight: row.weight,
                    lineHeight: row.lineHeight,
                  } as CSSProperties
                }
              >
                {sample || 'Avastar'}
              </p>
              <CopyButton
                value={`font-family: var(--av-font);\nfont-size: ${row.size};\nfont-weight: ${row.weight};\nline-height: ${row.lineHeight};`}
                locale={locale}
              />
            </div>
          ))}
        </div>
        <div className="ds-notes">
          <p>
            <strong>{t('متن فارسی', 'Persian text')}</strong>
            {t(
              'فاصله حروف صفر؛ نیم‌فاصله حفظ شود. ایمیل و کد جهت مستقل LTR دارند.',
              'Zero letter spacing; preserve joining conventions. Emails and code use their own LTR direction.',
            )}
          </p>
          <p>
            <strong>{t('پنل‌ها', 'Panels')}</strong>
            {t(
              'بدنه ۱۶، برچسب و سلول جدول ۱۴–۱۶، متادیتا ۱۲–۱۳ پیکسل. وزن Light فقط برای تیتر بزرگ.',
              '16px body, 14–16px labels and table cells, 12–13px metadata. Reserve Light for large display text.',
            )}
          </p>
        </div>
      </Section>
      <Section
        id="layout"
        index="04 / STRUCTURE"
        title={t('فاصله، سطح و چیدمان', 'Spacing, surfaces & layout')}
        description={t(
          'فاصله‌ها بر پایه ۴ پیکسل؛ سطوح با رنگ و مرز مشخص از هم جدا می‌شوند.',
          'A 4px spacing rhythm. Surface color and borders define hierarchy.',
        )}
      >
        <div className="ds-spacing-grid">
          {Object.entries(tokens.space).map(([key, value]) => (
            <div key={key}>
              <code>space-{key}</code>
              <span style={{ width: value }} />
              <small>{value}</small>
              <CopyButton value={`var(--space-${key})`} locale={locale} />
            </div>
          ))}
        </div>
        <div className="ds-radii">
          {Object.entries(tokens.radius).map(([key, value]) => (
            <div key={key}>
              <span style={{ borderRadius: value }} />
              <code>
                {key} / {value}
              </code>
            </div>
          ))}
        </div>
        <div className="ds-surface-grid">
          {(['background', 'card', 'secondary'] as const).map((key) => (
            <article key={key} style={{ background: semantic[key] }}>
              <strong>{key}</strong>
              <code>var(--{key})</code>
            </article>
          ))}
        </div>
        <div className="ds-specimen">
          <h2>{t('شبکه واکنش‌گرا', 'Responsive grid')}</h2>
          <Tabs value={grid} onValueChange={setGrid} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
            <TabsList>
              <TabsTrigger value="desktop">
                {t('دسکتاپ · ۱۲ ستون', 'Desktop · 12 columns')}
              </TabsTrigger>
              <TabsTrigger value="mobile">{t('موبایل · ۴ ستون', 'Mobile · 4 columns')}</TabsTrigger>
            </TabsList>
          </Tabs>
          <div
            className="ds-grid-demo"
            style={{
              gridTemplateColumns: `repeat(${grid === 'desktop' ? 12 : 4},minmax(0,1fr))`,
              maxWidth: grid === 'mobile' ? 320 : undefined,
            }}
          >
            {Array.from({ length: grid === 'desktop' ? 12 : 4 }, (_, index) => (
              <span key={index}>{index + 1}</span>
            ))}
          </div>
          <p className="ds-note">
            {t(
              'عرض محتوای مرجع ۱۲۴۰؛ فاصله لبه ۳۲/۲۰ پیکسل. جدول عریض در ظرف خودش اسکرول می‌شود.',
              'Reference content width: 1240px. Gutters: 32/20px. Wide tables scroll inside their own container.',
            )}
          </p>
        </div>
        <CodeBlock
          locale={locale}
        >{`.av-panel { --radius: 0.75rem; }\n/* Logical properties work in RTL and LTR. */\n.panel-content { padding-inline: var(--space-8); }\n/* Layers */\n/* content: 3 · navigation: 30 · overlay: 50 · toast: 100 */`}</CodeBlock>
      </Section>
    </>
  );
}
