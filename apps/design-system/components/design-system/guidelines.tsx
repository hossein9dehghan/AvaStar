'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  Download,
  Globe2,
  Info,
  Layers,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  Telescope,
  Users,
  X,
} from 'lucide-react';
import { Slider } from '@avastar/ui/components/slider';
import { Switch } from '@avastar/ui/components/switch';
import { Tabs, TabsList, TabsTrigger } from '@avastar/ui/components/tabs';
import { Section, CopyButton, CodeBlock } from './primitives';
import { translate, type Locale } from '@/lib/site';
const icons = {
  Compass,
  BookOpen,
  Telescope,
  Users,
  Search,
  Globe2,
  ArrowUpRight,
  Check,
  X,
  Info,
  Menu,
  Moon,
  Sun,
  Layers,
};
export function Guidelines({ locale }: { locale: Locale }) {
  const t = translate(locale),
    [direction, setDirection] = useState<'rtl' | 'ltr'>(locale === 'fa' ? 'rtl' : 'ltr'),
    [depth, setDepth] = useState(35),
    [reduced, setReduced] = useState(true);
  return (
    <>
      <Section
        id="panels"
        index="08 / APPLICATION PATTERNS"
        title={t('یک سیستم، دو پنل آماده', 'One system. Two ready-to-use panels.')}
        description={t(
          'نمونه‌های مستقل با اجزای مشترک؛ قابل آزمایش در روشن، تیره، فارسی و انگلیسی.',
          'Independent examples built from shared components. Test them in light, dark, Persian and English.',
        )}
      >
        <div className="ds-panel-links">
          <article className="av-card">
            <span className="panel-preview-symbol">
              <Layers size={32} />
            </span>
            <span className="ds-eyebrow">ADMIN WORKSPACE</span>
            <h2>{t('پنل ادمین', 'Admin panel')}</h2>
            <p>
              {t(
                'جدول، جست‌وجو و فیلتر، مرتب‌سازی، انتخاب گروهی، جزئیات و تأیید عملیات.',
                'Table, search, filtering, sorting, bulk selection, record details and action confirmation.',
              )}
            </p>
            <a
              className="av-button av-button--primary av-button--md"
              href={`/${locale}/panels/admin`}
            >
              {t('بازکردن نمونه ادمین', 'Open admin example')}
              <ArrowUpRight size={17} />
            </a>
          </article>
          <article className="av-card">
            <span className="panel-preview-symbol">
              <BookOpen size={32} />
            </span>
            <span className="ds-eyebrow">EXPLORER WORKSPACE</span>
            <h2>{t('پنل کاربری', 'User panel')}</h2>
            <p>
              {t(
                'دوره‌های من، کارت پیشرفت، حالت خالی، تنظیمات حساب و اعلان‌ها.',
                'My courses, progress cards, empty states, account settings and notifications.',
              )}
            </p>
            <a className="av-button av-button--secondary" href={`/${locale}/panels/user`}>
              {t('بازکردن نمونه کاربری', 'Open user example')}
              <ArrowUpRight size={17} />
            </a>
          </article>
        </div>
        <CodeBlock
          locale={locale}
        >{`import { ThemeProvider } from '@avastar/ui/theme-provider';\nimport { PanelShell } from '@avastar/ui/panel-shell';\nimport { DataTable, type Column } from '@avastar/ui/data-table';\n\n<ThemeProvider locale="${locale}">\n  <PanelShell locale="${locale}" kind="admin" view={view} onViewChange={setView}>\n    <DataTable rows={rows} columns={columns} locale="${locale}"\n      caption="${t('درخواست‌ها', 'Requests')}" searchText={row => row.name}\n      rowLabel={row => row.id} />\n  </PanelShell>\n</ThemeProvider>`}</CodeBlock>
        <div className="ds-notes">
          <p>
            <strong>{t('اجزای قابل انتقال', 'Portable components')}</strong>
            {t(
              'پوسته پنل، جدول داده و مدیریت تم در پوشه avastar-ui مستقل‌اند. جدول ستون‌ها و داده را از بیرون می‌گیرد.',
              'Panel shell, data table and theme management live in avastar-ui. The table accepts external columns and rows.',
            )}
          </p>
          <p>
            <strong>{t('مرز نمونه و محصول', 'Demo versus production')}</strong>
            {t(
              'این نمونه‌ها backend و احراز هویت ندارند. در محصول واقعی، دسترسی و اعتبارسنجی باید در سرور هم اعمال شود.',
              'These examples have no backend or authentication. Production authorization and validation must also run on the server.',
            )}
          </p>
        </div>
      </Section>
      <Section
        id="imagery"
        index="09 / ART & ICONS"
        title={t('تصویر و زبان آیکون', 'Imagery & icon language')}
        description={t(
          'تصاویر کیهانی برای لندینگ؛ آیکون‌های خطی و کم‌جزئیات برای محیط کار.',
          'Cosmic imagery for the landing. Clear line icons for working interfaces.',
        )}
      >
        <div className="ds-art-grid">
          {[
            ['annulus', t('جهان حلقه‌دار', 'Ringed world')],
            ['nocturne', t('جهان آبی', 'Blue world')],
            ['glacial', t('قمر یخی', 'Icy moon')],
          ].map(([id, label]) => (
            <article key={id}>
              <div className="fixed-dark">
                <img
                  src={`/art/${id}.webp`}
                  width="1254"
                  height="1254"
                  alt={label}
                  loading="lazy"
                />
              </div>
              <footer>
                <h2>{label}</h2>
                <a href={`/art/${id}.webp`} download aria-label={t('دریافت ', 'Download ') + label}>
                  <Download size={17} />
                </a>
              </footer>
            </article>
          ))}
        </div>
        <p className="ds-note">
          {t(
            'سیاره‌ها تصاویر خیالی برند هستند. این دارایی‌ها روی بوم تیره نمایش داده می‌شوند؛ تم روشن پنل‌ها به تغییر رنگ تصویر نیاز ندارد.',
            'These are imagined brand worlds. Keep this artwork on a dark art canvas; light panel themes do not require recoloring the images.',
          )}
        </p>
        <div className="ds-icon-grid">
          {Object.entries(icons).map(([name, Icon]) => (
            <div key={name}>
              <Icon size={23} />
              <code>{name}</code>
              <CopyButton
                value={`import { ${name} } from 'lucide-react';`}
                label={t('کپی آیکون ', 'Copy icon ') + name}
                locale={locale}
              />
            </div>
          ))}
        </div>
        <p className="ds-note">
          {t(
            'اندازه معمول ۲۰–۲۴، در کنترل کوچک ۱۶ پیکسل. فلش‌های رفت‌وبرگشت با جهت زبان هماهنگ می‌شوند.',
            'Use 20–24px icons, or 16px in small controls. Navigation arrows follow the language direction.',
          )}
        </p>
      </Section>
      <Section
        id="motion"
        index="10 / MOTION"
        title={t('حرکت آرام و قابل کنترل', 'Calm, controllable motion')}
        description={t(
          'در پنل‌ها، حرکت برای بازخورد است. حرکت فضایی فقط به تجربه لندینگ تعلق دارد.',
          'Panel motion provides feedback. Spatial travel belongs to the landing experience.',
        )}
      >
        <div className="ds-motion-values">
          {[
            ['120ms', t('فوکوس و رنگ', 'Focus & color')],
            ['240ms', t('کنترل و جابه‌جایی', 'Controls & transitions')],
            ['400ms', t('تغییر صحنه لندینگ', 'Landing scene changes')],
          ].map(([duration, label]) => (
            <article className="av-card" key={duration}>
              <strong>{duration}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
        <div className="ds-motion-demo">
          <div className="ds-depth-window fixed-dark" aria-hidden="true">
            <img
              src="/art/annulus.webp"
              width="1254"
              height="1254"
              alt=""
              style={{
                transform: reduced ? 'none' : `scale(${0.86 + depth * 0.003})`,
                opacity: reduced ? 0.5 + depth * 0.005 : 1,
              }}
            />
          </div>
          <div className="av-card">
            <div className="ds-progress-label">
              <label id="motion-depth">{t('فاصله نمونه', 'Sample depth')}</label>
              <output>{new Intl.NumberFormat(locale).format(depth)}%</output>
            </div>
            <Slider
              value={[depth]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setDepth(value[0])}
              dir="ltr"
              ref={(node) => {
                node
                  ?.querySelector('[role=slider]')
                  ?.setAttribute('aria-labelledby', 'motion-depth');
              }}
            />
            <label className="ds-switch-row">
              <span>{t('کاهش حرکت در نمونه', 'Reduce motion in demo')}</span>
              <Switch dir="ltr" checked={reduced} onCheckedChange={setReduced} />
            </label>
            <p>
              {t(
                'کاهش حرکت، بزرگ‌نمایی را با تغییر شفافیت جایگزین می‌کند. ترجیح سیستم همیشه در اولویت است.',
                'Reduced motion replaces zoom with opacity. The system preference always takes priority.',
              )}
            </p>
          </div>
        </div>
        <CodeBlock
          locale={locale}
        >{`@media (prefers-reduced-motion: reduce) {\n  .av-button, .av-field { transition: none; }\n  .spatial-preview { transform: none; }\n}\n/* Background stars: bounded pointer parallax,\n   stable perspective and slow depth travel. */`}</CodeBlock>
      </Section>
      <Section
        id="accessibility"
        index="11 / ACCESSIBILITY & RTL"
        title={t('از ابتدا، برای همه', 'Inclusive from the start')}
        description={t(
          'دسترس‌پذیری بخشی از قرارداد هر جزء است. نمونه‌ها را با صفحه‌کلید هم آزمایش کنید.',
          'Accessibility belongs to each component’s contract. Test the examples with the keyboard too.',
        )}
      >
        <div className="ds-checklist">
          {[
            [
              t('فوکوس قابل دیدن', 'Visible focus'),
              t(
                'کنترل‌ها با Tab، Enter و Space؛ مدال با Escape بسته می‌شود.',
                'Use Tab, Enter and Space. Escape closes dialogs.',
              ),
            ],
            [
              t('هدف تعاملی مناسب', 'Usable targets'),
              t(
                'هدف داخلی سیستم ۴۴×۴۴ پیکسل؛ حتی برای آیکون ۱۶ پیکسلی.',
                'The internal target is 44×44px, even for a 16px icon.',
              ),
            ],
            [
              t('پیام‌های قابل درک', 'Understandable feedback'),
              t(
                'خطا با متن، آیکون و aria-describedby؛ اعلان موفقیت با ناحیه زنده.',
                'Errors use text, icons and aria-describedby. Success uses a live region.',
              ),
            ],
            [
              t('جدول و داده', 'Tables & data'),
              t(
                'عنوان ستون، نام انتخاب هر ردیف، aria-sort و صفحه‌بندی قابل دسترس.',
                'Column headers, row-selection names, aria-sort and accessible pagination.',
              ),
            ],
            [
              t('بزرگ‌نمایی و موبایل', 'Zoom & mobile'),
              t(
                'اندازه‌های rem، شکست چیدمان و اسکرول مستقل جدول.',
                'Rem sizes, responsive layout and independent table scrolling.',
              ),
            ],
            [
              t('جهت و زبان', 'Direction & language'),
              t(
                'فاصله‌ها با inline؛ عدد و ایمیل با جهت مناسب؛ فلش‌ها وابسته به زبان.',
                'Logical spacing, appropriate numeric direction and language-aware arrows.',
              ),
            ],
          ].map(([title, copy]) => (
            <article className="av-card" key={title}>
              <ShieldCheck size={21} />
              <div>
                <h2>{title}</h2>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="ds-specimen">
          <Tabs value={direction} onValueChange={(value) => setDirection(value as 'rtl' | 'ltr')}>
            <TabsList aria-label={t('جهت نمونه', 'Preview direction')}>
              <TabsTrigger value="rtl">فارسی · RTL</TabsTrigger>
              <TabsTrigger value="ltr">English · LTR</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="av-card ds-direction-example" dir={direction}>
            <Compass size={26} />
            <div>
              <h2>{direction === 'rtl' ? 'مسیر نجومی شما' : 'Your astronomy path'}</h2>
              <p>
                {direction === 'rtl'
                  ? 'یک جزء با دو جهت، بدون استایل تکراری.'
                  : 'One component, two directions, no duplicate styles.'}
              </p>
            </div>
            <a
              className="av-button av-button--secondary av-button--sm"
              href={`/${direction === 'rtl' ? 'fa' : 'en'}/panels/user`}
            >
              {direction === 'rtl' ? 'ادامه' : 'Continue'}
              {direction === 'rtl' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </a>
          </div>
        </div>
        <p className="ds-note">
          {t(
            'این مرجع جایگزین ممیزی کامل دسترس‌پذیری محصول نیست. حداقل هدف ۴۴ پیکسل قاعده خود این سیستم است.',
            'This reference is not a complete product accessibility audit. The 44px target is this system’s own rule.',
          )}{' '}
          <a
            href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
            target="_blank"
            rel="noreferrer"
          >
            WCAG 2.5.8 ↗
          </a>
        </p>
      </Section>
      <Section
        id="resources"
        index="12 / DEVELOPER HANDOFF"
        title={t('آماده برای پروژه بعدی', 'Ready for the next project')}
        description={t(
          'منبع توکن‌ها، CSS، اجزای React، فونت‌ها و نمونه پنل‌ها در یک کیت قابل دانلود.',
          'Design tokens, CSS, React components, fonts and panel examples in one downloadable kit.',
        )}
      >
        <div className="ds-download-grid">
          {[
            [
              '/design-system/avastar-design-kit.zip',
              t('کیت کامل UI و پنل‌ها', 'Complete UI & panel kit'),
              'ZIP',
            ],
            ['/design-system/tokens.json', t('توکن روشن و تیره', 'Light & dark tokens'), 'JSON'],
            ['/design-system/avastar-tokens.css', t('متغیرهای CSS', 'CSS variables'), 'CSS'],
            [
              '/design-system/README.md',
              t('راهنمای توسعه و مهاجرت', 'Development & migration guide'),
              'MD',
            ],
          ].map(([href, label, format]) => (
            <a href={href} download key={href}>
              <Download size={22} />
              <strong>{label}</strong>
              <code>{format}</code>
            </a>
          ))}
        </div>
        <CodeBlock
          locale={locale}
        >{`// 1. Styles (in this order)\nimport './avastar-fonts.css';\nimport './avastar-tokens.css';\nimport './avastar-base.css';\nimport './avastar-components.css';\nimport './avastar-panels.css';\n\n// 2. App boundary\n<html lang="${locale}" dir="${locale === 'fa' ? 'rtl' : 'ltr'}" data-theme="light">\n  <ThemeProvider locale="${locale}">{children}</ThemeProvider>\n</html>\n\n// 3. Regenerate after editing tokens.json\npnpm design:tokens\npnpm design:check\npnpm design:kit`}</CodeBlock>
        <div className="ds-notes">
          <p>
            <strong>{t('منبع مشترک', 'Single source')}</strong>
            {t(
              'رنگ‌ها در tokens.json تعریف می‌شوند. CSS تولیدی را مستقیم ویرایش نکنید. قرارداد props جدول و پوسته در فایل‌های TypeScript مشخص است.',
              'Colors live in tokens.json. Do not edit generated CSS directly. Table and shell prop contracts are typed in their TypeScript files.',
            )}
          </p>
          <p>
            <strong>{t('مهاجرت به نسخه ۲', 'Migrating to v2')}</strong>
            {t(
              'به‌جای semantic از themes.light یا themes.dark بخوانید. اندازه و شعاع کنترل‌ها از توکن مشترک خوانده می‌شود.',
              'Read themes.light or themes.dark instead of semantic. Control size and corner radius use shared tokens.',
            )}
          </p>
        </div>
        <div className="ds-version-note">
          <Check size={22} />
          <div>
            <h2>{t('Avastar UI · نسخه ۳٫۱', 'Avastar UI · Version 3.1')}</h2>
            <p>
              {t(
                'لندینگ و دیزاین سیستم دو سایت مستقل‌اند. توکن‌ها و اجزای پایه بین محصولات مشترک باقی می‌مانند.',
                'The landing and design system are separate sites. Shared tokens and primitives connect the products.',
              )}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
