'use client';
import { useRef, useState } from 'react';
import { Bookmark, Check, CheckCircle2, Layers, Play, User } from 'lucide-react';
import { Button } from '@avastar/ui/components/button';
import { Avatar, AvatarImage, AvatarFallback } from '@avastar/ui/components/avatar';
import { Progress } from '@avastar/ui/components/progress';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@avastar/ui/components/select';
import { DataTable, type Column } from '@avastar/ui/data-table';
import { ViewStatePanel, viewStates, stateLabel, type ViewState } from '@avastar/ui/view-state';
import { useSpringValue } from '@avastar/ui/use-spring';
import { MaterialLab } from './material-lab';
import { Section, Specimen } from './primitives';
import { translate, type Locale } from '@/lib/site';
export function StateControl({
  state,
  onChange,
  locale,
}: {
  state: ViewState;
  onChange: (value: ViewState) => void;
  locale: Locale;
}) {
  const t = translate(locale);
  return (
    <div className="ds-state-control">
      <span>{t('حالت نمونه', 'Sample state')}</span>
      <Select
        value={state}
        onValueChange={(v) => onChange(v as ViewState)}
        dir={locale === 'fa' ? 'rtl' : 'ltr'}
      >
        <SelectTrigger aria-label={t('انتخاب حالت نمونه', 'Choose sample state')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {viewStates.map((value) => (
            <SelectItem key={value} value={value}>
              {stateLabel(value, locale)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
export function PageStates({ locale }: { locale: Locale }) {
  const t = translate(locale),
    [state, setState] = useState<ViewState>('empty');
  return (
    <Section
      id="states"
      index="FEEDBACK / PAGE STATES"
      title={t('هر وضعیت، یک راه ادامه', 'A way forward in every state')}
      description={t(
        'حالت‌ها را تغییر دهید؛ هر پیام نتیجه را توضیح می‌دهد و اقدام مناسب ارائه می‌کند.',
        'Switch states. Each message explains the outcome and offers a useful next action.',
      )}
    >
      <StateControl state={state} onChange={setState} locale={locale} />
      <div className="av-card ds-state-stage">
        {state === 'ready' ? (
          <div className="av-state">
            <CheckCircle2 size={30} />
            <h2>{t('اطلاعات آماده است', 'Information is ready')}</h2>
            <p>
              {t(
                'محتوای محصول در این ناحیه نمایش داده می‌شود.',
                'Product content appears in this area.',
              )}
            </p>
            <a className="av-button av-button--primary" href={`/${locale}/panels/user`}>
              {t('مشاهده پنل نمونه', 'Open sample panel')}
            </a>
          </div>
        ) : (
          <ViewStatePanel state={state} locale={locale} onRecover={() => setState('ready')} />
        )}
      </div>
      <div className="ds-two-col">
        <article className="av-card">
          <h2>{t('اولین استفاده', 'First use')}</h2>
          <p>
            {t(
              'حالت خالی دعوت به شروع است؛ خطا نیست. محتوای مربوط به وظیفه و یک اقدام روشن نشان دهید.',
              'Empty is an invitation to start, not an error. Show task-relevant copy and one clear action.',
            )}
          </p>
        </article>
        <article className="av-card">
          <h2>{t('خطای قابل اصلاح', 'Recoverable error')}</h2>
          <p>
            {t(
              'دادهٔ واردشده و انتخاب‌های کاربر حفظ می‌شوند. تلاش دوباره نباید فرم را از ابتدا بسازد.',
              'Preserve entries and selections. Retrying must not make someone start again.',
            )}
          </p>
        </article>
      </div>
    </Section>
  );
}
type SampleRow = { id: string; name: string; status: string; progress: number };
export function DataPatterns({ locale }: { locale: Locale }) {
  const t = translate(locale),
    [state, setState] = useState<ViewState>('ready'),
    [archived, setArchived] = useState<string[]>([]);
  const rows: SampleRow[] = [
    'شناخت آسمان',
    'اولین رصد',
    'نقشه آسمان',
    'آشنایی با تلسکوپ',
    'عکاسی شب',
    'ماه و سیارات',
  ].map((name, i) => ({
    id: `CR-${101 + i}`,
    name:
      locale === 'fa'
        ? name
        : [
            'Night sky',
            'First observation',
            'Sky map',
            'Telescopes',
            'Night photography',
            'Moon & planets',
          ][i],
    status: archived.includes(`CR-${101 + i}`)
      ? t('بایگانی', 'Archived')
      : i === 2
        ? t('تکمیل‌شده', 'Completed')
        : t('در حال یادگیری', 'Learning'),
    progress: [45, 20, 100, 0, 60, 75][i],
  }));
  const columns: Column<SampleRow>[] = [
    {
      id: 'name',
      label: t('دوره', 'Course'),
      sortValue: (r) => r.name,
      cell: (r) => <strong>{r.name}</strong>,
    },
    {
      id: 'status',
      label: t('وضعیت', 'Status'),
      sortValue: (r) => r.status,
      cell: (r) => (
        <span className={`av-badge av-badge--${r.progress === 100 ? 'success' : 'info'}`}>
          {r.status}
        </span>
      ),
    },
    {
      id: 'progress',
      label: t('پیشرفت', 'Progress'),
      sortValue: (r) => r.progress,
      cell: (r) => <span>{new Intl.NumberFormat(locale).format(r.progress)}%</span>,
    },
  ];
  return (
    <Section
      id="data"
      index="DATA / TABLES & CHARTS"
      title={t('اطلاعات قابل بررسی', 'Information you can inspect')}
      description={t(
        'جست‌وجو، مرتب‌سازی، انتخاب گروهی و صفحه‌بندی با داده‌های نمایشی.',
        'Search, sort, select and paginate sample data.',
      )}
    >
      <StateControl locale={locale} state={state} onChange={setState} />
      {['offline', 'forbidden', 'success'].includes(state) ? (
        <ViewStatePanel
          locale={locale}
          state={state as 'offline' | 'forbidden' | 'success'}
          onRecover={() => setState('ready')}
        />
      ) : (
        <DataTable
          locale={locale}
          rows={state === 'empty' || state === 'no-results' ? [] : rows}
          columns={columns}
          caption={t('دوره‌های نمونه', 'Sample courses')}
          emptyKind={state === 'no-results' ? 'no-results' : 'empty'}
          searchText={(r) => r.name + ' ' + r.id}
          rowLabel={(r) => r.name}
          pageSize={4}
          loading={state === 'loading'}
          error={
            state === 'error'
              ? t('ارتباط نمونه قطع شده است.', 'Sample connection interrupted.')
              : undefined
          }
          onRetry={() => setState('ready')}
          onBulkAction={(items) => setArchived((v) => [...v, ...items.map((r) => r.id)])}
        />
      )}
      <Specimen
        locale={locale}
        title={t('نمودار با دادهٔ قابل خواندن', 'A chart with readable data')}
        source={
          '<figure><figcaption>Course progress</figcaption>\n  <dl>…accessible values…</dl>\n</figure>'
        }
      >
        <figure className="ds-chart">
          <figcaption>{t('پیشرفت دوره‌های نمونه', 'Sample course progress')}</figcaption>
          <dl>
            {rows.slice(0, 4).map((row) => (
              <div key={row.id}>
                <dt>{row.name}</dt>
                <dd>
                  <span className="ds-chart-track" aria-hidden="true">
                    <i style={{ width: `${row.progress}%` }} />
                  </span>
                  <strong>{new Intl.NumberFormat(locale).format(row.progress)}%</strong>
                </dd>
              </div>
            ))}
          </dl>
        </figure>
      </Specimen>
    </Section>
  );
}
export function CardPatterns({ locale }: { locale: Locale }) {
  const t = translate(locale),
    [saved, setSaved] = useState(false),
    [value, setValue] = useState(45);
  return (
    <Section
      id="cards"
      index="CONTENT / CARDS & IDENTITY"
      title={t('محتوای روشن، هویت مشخص', 'Clear content, recognizable identity')}
      description={t(
        'کارت‌ها بر اساس کارکرد ساخته می‌شوند؛ انتخاب، پیشرفت و عملیات مستقل‌اند.',
        'Cards follow the task. Selection, progress and actions remain distinct.',
      )}
    >
      <div className="ds-two-col">
        <article className="av-card ds-course-card">
          <div className="ds-course-art">
            <img src="/art/nocturne.webp" alt="" />
            <span className="av-badge">{t('دوره نمونه', 'Sample course')}</span>
            <Button
              className="av-button av-button--icon"
              aria-label={
                saved
                  ? t('حذف از ذخیره‌شده‌ها', 'Remove bookmark')
                  : t('ذخیره دوره', 'Bookmark course')
              }
              aria-pressed={saved}
              onClick={() => setSaved(!saved)}
            >
              <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
            </Button>
          </div>
          <div className="ds-stack">
            <h2>{t('شناخت آسمان شب', 'Knowing the night sky')}</h2>
            <p>
              {t(
                'از اولین ستاره تا نخستین صورت فلکی.',
                'From your first star to your first constellation.',
              )}
            </p>
            <div className="av-progress-label">
              <span>{t('پیشرفت یادگیری', 'Learning progress')}</span>
              <output>{new Intl.NumberFormat(locale).format(value)}%</output>
            </div>
            <Progress value={value} aria-label={t('پیشرفت دوره نمونه', 'Sample course progress')} />
            <Button
              className="av-button av-button--primary"
              disabled={value === 100}
              onClick={() => setValue((v) => Math.min(100, v + 10))}
            >
              {value === 100 ? <Check size={17} /> : <Play size={17} />}{' '}
              {value === 100 ? t('تکمیل شد', 'Completed') : t('ادامه یادگیری', 'Continue learning')}
            </Button>
          </div>
        </article>
        <article className="av-card ds-stack">
          <h2>{t('هویت، اندازه و جایگزین', 'Identity, sizes & fallback')}</h2>
          <div className="ds-button-row">
            <Avatar className="size-10">
              <AvatarImage src="/brand/logo-mark.png" alt={t('آوا استار', 'Avastar')} />
              <AvatarFallback>AV</AvatarFallback>
            </Avatar>
            <Avatar className="size-12">
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <Avatar className="size-16">
              <AvatarFallback>
                <User size={24} />
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="ds-note">
            {t(
              'در نبود تصویر، حروف نام یا آیکون عمومی نشان داده می‌شود.',
              'Use initials or a generic icon when no image is available.',
            )}
          </p>
          <h2>{t('نشان‌های وضعیت', 'Status badges')}</h2>
          <div className="ds-button-row">
            {[
              ['success', t('تأییدشده', 'Approved')],
              ['warning', t('در انتظار', 'Pending')],
              ['error', t('ردشده', 'Declined')],
              ['info', t('اطلاع', 'Information')],
              ['neutral', t('پیش‌نویس', 'Draft')],
            ].map(([status, label]) => (
              <span key={status} className={`av-badge av-badge--${status}`}>
                {label}
              </span>
            ))}
          </div>
          <h2>{t('کارت انتخابی', 'Selectable card')}</h2>
          <button className="ds-select-card" aria-pressed={saved} onClick={() => setSaved(!saved)}>
            <Bookmark size={20} />
            <span>{t('ذخیره برای بعد', 'Save for later')}</span>
            {saved && <Check size={18} />}
          </button>
        </article>
      </div>
    </Section>
  );
}
export function MaterialPatterns({ locale }: { locale: Locale }) {
  const t = translate(locale),
    [atEnd, setAtEnd] = useState(false),
    ref = useRef<HTMLDivElement>(null);
  const target = useSpringValue((v) => {
    if (ref.current) ref.current.style.transform = `translateX(${v * 100}%)`;
  });
  return (
    <Section
      id="materials"
      index="FOUNDATIONS / MATERIALS"
      title={t('عمق، بدون شلوغی', 'Depth without clutter')}
      description={t(
        'سطوح محتوا مات‌اند. شفافیت فقط به نوارهای شناور و ناوبری کمک می‌کند تا سلسله‌مراتب خوانا بماند.',
        'Content surfaces stay opaque. Translucency gives floating navigation a clear hierarchy.',
      )}
    >
      <MaterialLab locale={locale} />
      <div className="ds-notes">
        <p>
          <strong>{t('کاهش شفافیت', 'Reduced transparency')}</strong>
          {t(
            'با ترجیح سیستم، لایه شفاف به سطح مات تبدیل می‌شود.',
            'The system preference replaces translucent layers with solid surfaces.',
          )}
        </p>
        <p>
          <strong>{t('کنتراست بیشتر', 'Increased contrast')}</strong>
          {t(
            'مرزهای ضروری پررنگ‌تر می‌شوند و زمینه‌ها مات می‌مانند.',
            'Essential borders become stronger and backgrounds stay opaque.',
          )}
        </p>
      </div>
      <Specimen
        locale={locale}
        title={t('حرکت قابل قطع و برگشت', 'Interruptible motion')}
        description={t(
          'پیش از پایان حرکت، دوباره دکمه را بزنید؛ حرکت از موقعیت و سرعت فعلی ادامه پیدا می‌کند.',
          'Press again before it settles. Motion continues from the current position and velocity.',
        )}
        source={
          'const retarget = useSpringValue(updatePosition, 0.4);\nretarget(next, prefersReducedMotion);'
        }
      >
        <div className="ds-spring-track" dir="ltr">
          <div ref={ref} className="ds-spring-object">
            <Layers size={22} />
          </div>
        </div>
        <Button
          className="av-button av-button--secondary"
          onClick={() => {
            setAtEnd(!atEnd);
            target(atEnd ? 0 : 3, matchMedia('(prefers-reduced-motion: reduce)').matches);
          }}
        >
          {t('تغییر جهت', 'Reverse direction')}
        </Button>
        <p className="ds-note">
          {t(
            'میرایی ۱ · پاسخ ۰٫۴ ثانیه · بدون جهش تزئینی',
            'Damping 1 · response 0.4 s · no decorative bounce',
          )}
        </p>
      </Specimen>
    </Section>
  );
}
