'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Archive,
  Bookmark,
  LoaderCircle,
  Play,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  MoreHorizontal,
  RotateCcw,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@avastar/ui/components/button';
import { Input } from '@avastar/ui/components/input';
import { Switch } from '@avastar/ui/components/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@avastar/ui/components/tabs';
import { Progress } from '@avastar/ui/components/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@avastar/ui/components/select';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@avastar/ui/components/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@avastar/ui/components/dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@avastar/ui/components/alert-dialog';
import { PanelShell, type PanelView } from '@avastar/ui/panel-shell';
import { DataTable, type Column } from '@avastar/ui/data-table';
import { translate, type Locale } from '@/lib/site';
import { ViewStatePanel, type ViewState } from '@avastar/ui/view-state';
import { StateControl } from './content-patterns';
type Status = 'pending' | 'approved' | 'archived';
type RecordRow = { id: string; name: string; email: string; path: string; status: Status };
function makeRecords(locale: Locale): RecordRow[] {
  const t = translate(locale);
  return Array.from({ length: 12 }, (_, i) => ({
    id: `AV-${String(101 + i)}`,
    name: t(
      [
        'سارا احمدی',
        'علی رضایی',
        'نیلوفر امینی',
        'آرمان نوری',
        'مریم موسوی',
        'رضا کریمی',
        'رها صالحی',
        'سامان مرادی',
        'نازنین راد',
        'کیان مهر',
        'آوا حیدری',
        'پارسا احمدی',
      ][i],
      [
        'Sara Ahmadi',
        'Ali Rezaei',
        'Niloufar Amini',
        'Arman Nouri',
        'Maryam Mousavi',
        'Reza Karimi',
        'Raha Salehi',
        'Saman Moradi',
        'Nazanin Rad',
        'Kian Mehr',
        'Ava Heidari',
        'Parsa Ahmadi',
      ][i],
    ),
    email: `explorer${i + 1}@example.com`,
    path: [t('آموزش', 'Learning'), t('کاوش', 'Exploring'), t('تجهیزات', 'Equipment')][i % 3],
    status: i % 5 === 0 ? 'archived' : i % 3 === 0 ? 'approved' : 'pending',
  }));
}
function StatusBadge({ status, locale }: { status: Status; locale: Locale }) {
  const t = translate(locale);
  const label =
    status === 'approved'
      ? t('تأییدشده', 'Approved')
      : status === 'pending'
        ? t('در انتظار', 'Pending')
        : t('بایگانی', 'Archived');
  return (
    <span
      className={`av-badge av-badge--${status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'info'}`}
    >
      {status === 'approved' ? (
        <CheckCircle2 size={13} />
      ) : status === 'pending' ? (
        <Clock size={13} />
      ) : (
        <Archive size={13} />
      )}{' '}
      {label}
    </span>
  );
}
export function PanelDemo({ locale, kind }: { locale: Locale; kind: 'admin' | 'user' }) {
  const t = translate(locale);
  const [view, setView] = useState<PanelView>('overview');
  const [state, setState] = useState<ViewState>('ready');
  return (
    <PanelShell
      locale={locale}
      kind={kind}
      view={view}
      onViewChange={(v) => {
        setView(v);
        setState('ready');
      }}
    >
      <StateControl locale={locale} state={state} onChange={setState} />
      {state !== 'ready' && (
        <div className="av-card">
          <h1 className="panel-state-title">
            {view === 'settings'
              ? t('تنظیمات', 'Settings')
              : kind === 'admin'
                ? t('درخواست‌های کاوشگران', 'Explorer requests')
                : t('دوره‌های من', 'My courses')}
          </h1>
          <ViewStatePanel locale={locale} state={state} onRecover={() => setState('ready')} />
        </div>
      )}
      <div hidden={state !== 'ready'}>
        <div hidden={view === 'settings'}>
          {kind === 'admin' ? (
            <AdminDemo locale={locale} compact={view === 'records'} />
          ) : (
            <UserDemo locale={locale} coursesOnly={view === 'records'} />
          )}
        </div>
        <div hidden={view !== 'settings'}>
          <SettingsDemo locale={locale} />
        </div>
      </div>
    </PanelShell>
  );
}
function restorePanelFocus(opener: HTMLElement | null, selector: string) {
  const target =
    opener?.isConnected && opener.getClientRects().length
      ? opener
      : (Array.from(document.querySelectorAll<HTMLElement>(selector)).find(
          (node) => node.getClientRects().length,
        ) ?? document.querySelector<HTMLElement>('#panel-main, #ds-main'));
  target?.focus({ preventScroll: true });
}
function AdminDemo({ locale, compact }: { locale: Locale; compact: boolean }) {
  const t = translate(locale),
    [rows, setRows] = useState(() => makeRecords(locale)),
    [filter, setFilter] = useState('all'),
    [current, setCurrent] = useState<RecordRow | null>(null),
    [status, setStatus] = useState<Status>('pending'),
    [archiveIds, setArchiveIds] = useState<string[]>([]),
    [resetKey, setResetKey] = useState(0),
    [demoRevision, setDemoRevision] = useState(0),
    [tableState, setTableState] = useState('ready');
  const opener = useRef<HTMLElement | null>(null);
  const visible = rows.filter((row) => filter === 'all' || row.status === filter);
  function inspect(row: RecordRow) {
    opener.current = document.querySelector<HTMLElement>(`[data-record-action="${row.id}"]`);
    setCurrent(row);
    setStatus(row.status);
  }
  function closeSheet(open: boolean) {
    if (!open) {
      setCurrent(null);
    }
  }
  function archive() {
    setRows((value) =>
      value.map((row) => (archiveIds.includes(row.id) ? { ...row, status: 'archived' } : row)),
    );
    setArchiveIds([]);
    setResetKey((key) => key + 1);
    toast.success(
      t('انتخاب‌ها در این نمونه بایگانی شدند.', 'Selected sample records were archived.'),
    );
  }
  const columns: Column<RecordRow>[] = [
    {
      id: 'name',
      label: t('کاوشگر', 'Explorer'),
      sortValue: (row) => row.name,
      cell: (row) => (
        <div className="table-person">
          <span className="panel-avatar">{row.id.slice(-2)}</span>
          <span>
            <strong>{row.name}</strong>
            <small dir="ltr">{row.email}</small>
          </span>
        </div>
      ),
    },
    {
      id: 'id',
      label: t('شناسه', 'ID'),
      sortValue: (row) => row.id,
      cell: (row) => <code>{row.id}</code>,
    },
    { id: 'path', label: t('مسیر', 'Path'), sortValue: (row) => row.path, cell: (row) => row.path },
    {
      id: 'status',
      label: t('وضعیت', 'Status'),
      sortValue: (row) => row.status,
      cell: (row) => <StatusBadge status={row.status} locale={locale} />,
    },
    {
      id: 'actions',
      label: t('عملیات', 'Actions'),
      cell: (row) => (
        <DropdownMenu dir={locale === 'fa' ? 'rtl' : 'ltr'}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="av-button av-button--ghost av-button--icon"
              aria-label={t('عملیات ', 'Actions for ') + row.id}
              data-record-action={row.id}
            >
              <MoreHorizontal size={19} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => inspect(row)}>
              <Eye size={16} />
              {t('مشاهده و ویرایش وضعیت', 'View and edit status')}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={row.status === 'archived'}
              onSelect={() => setArchiveIds([row.id])}
            >
              <Archive size={16} />
              {t('بایگانی', 'Archive')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return (
    <>
      <div className="panel-heading">
        <div>
          <span className="av-eyebrow">ADMIN / SAMPLE WORKSPACE</span>
          <h1>
            {compact
              ? t('درخواست‌های کاوشگران', 'Explorer requests')
              : t('نمای کلی مدیریت', 'Management overview')}
          </h1>
          <p>
            {t(
              'اطلاعات نمونه برای بررسی جدول، وضعیت‌ها و گردش کار مدیریت.',
              'Sample information for reviewing tables, statuses and management workflows.',
            )}
          </p>
        </div>
        <Button
          className="av-button av-button--secondary av-button--sm"
          onClick={() => {
            setRows(makeRecords(locale));
            setDemoRevision((value) => value + 1);
            setFilter('all');
            setResetKey((key) => key + 1);
            setTableState('ready');
            toast.info(t('داده‌های نمونه بازنشانی شدند.', 'Sample data reset.'));
          }}
        >
          <RotateCcw size={16} />
          {t('بازنشانی نمونه', 'Reset demo')}
        </Button>
      </div>
      {!compact && (
        <div className="panel-stats">
          {[
            [Users, t('کل درخواست‌ها', 'Total requests'), rows.length],
            [
              Clock,
              t('در انتظار بررسی', 'Pending review'),
              rows.filter((row) => row.status === 'pending').length,
            ],
            [
              CheckCircle2,
              t('تأییدشده', 'Approved'),
              rows.filter((row) => row.status === 'approved').length,
            ],
          ].map(([Icon, label, value]) => {
            const MetricIcon = Icon as typeof Users;
            return (
              <article className="av-card" key={String(label)}>
                <span>
                  <MetricIcon size={19} />
                  {String(label)}
                </span>
                <strong>{new Intl.NumberFormat(locale).format(Number(value))}</strong>
                <small>{t('بر اساس داده‌های همین نمونه', 'Based on this sample dataset')}</small>
              </article>
            );
          })}
        </div>
      )}
      <div className="panel-section-heading">
        <h2>{t('درخواست‌ها', 'Requests')}</h2>
        <div className="av-actions">
          <label htmlFor="table-state">{t('حالت نمایش نمونه', 'Demo state')}</label>
          <Select
            value={tableState}
            onValueChange={setTableState}
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
          >
            <SelectTrigger id="table-state">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="ready">{t('آماده', 'Ready')}</SelectItem>
              <SelectItem value="loading">{t('بارگذاری', 'Loading')}</SelectItem>
              <SelectItem value="error">{t('خطا', 'Error')}</SelectItem>
              <SelectItem value="empty">{t('خالی', 'Empty')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable
        key={demoRevision}
        selectionResetKey={resetKey}
        rows={tableState === 'empty' ? [] : visible}
        columns={columns}
        locale={locale}
        caption={t('درخواست‌های نمونه کاوشگران', 'Sample explorer requests')}
        searchText={(row) => `${row.name} ${row.id} ${row.email} ${row.path}`}
        rowLabel={(row) => row.id}
        loading={tableState === 'loading'}
        error={
          tableState === 'error'
            ? t(
                'این خطا برای بررسی طراحی نمایش داده شده است.',
                'This error is displayed to demonstrate the recovery pattern.',
              )
            : undefined
        }
        onRetry={() => setTableState('ready')}
        onBulkAction={(selected) => setArchiveIds(selected.map((row) => row.id))}
        toolbar={
          <Select
            value={filter}
            onValueChange={(value) => {
              setFilter(value);
              setResetKey((key) => key + 1);
            }}
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
          >
            <SelectTrigger className="table-filter" aria-label={t('فیلتر وضعیت', 'Filter status')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">{t('همه وضعیت‌ها', 'All statuses')}</SelectItem>
              <SelectItem value="pending">{t('در انتظار', 'Pending')}</SelectItem>
              <SelectItem value="approved">{t('تأییدشده', 'Approved')}</SelectItem>
              <SelectItem value="archived">{t('بایگانی', 'Archived')}</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <Sheet open={!!current} onOpenChange={closeSheet}>
        <SheetContent
          className="av-detail-sheet av-panel"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            restorePanelFocus(opener.current, '[data-record-action], [data-course-action]');
          }}
          side={locale === 'fa' ? 'left' : 'right'}
          dir={locale === 'fa' ? 'rtl' : 'ltr'}
          showCloseButton={false}
        >
          <SheetClose
            className="av-button av-button--ghost av-button--icon sheet-close"
            aria-label={t('بستن جزئیات', 'Close details')}
          >
            <X size={19} />
          </SheetClose>
          <span className="av-eyebrow">{current?.id}</span>
          <SheetTitle>{t('جزئیات درخواست', 'Request details')}</SheetTitle>
          <SheetDescription>
            {t(
              'ویرایش فقط در داده‌های نمونه این صفحه اعمال می‌شود.',
              'Edits apply only to this page’s sample data.',
            )}
          </SheetDescription>
          {current && (
            <>
              <dl className="record-details">
                <div>
                  <dt>{t('نام', 'Name')}</dt>
                  <dd>{current.name}</dd>
                </div>
                <div>
                  <dt>{t('ایمیل', 'Email')}</dt>
                  <dd dir="ltr">{current.email}</dd>
                </div>
                <div>
                  <dt>{t('مسیر', 'Path')}</dt>
                  <dd>{current.path}</dd>
                </div>
              </dl>
              <label htmlFor="record-status">{t('وضعیت درخواست', 'Request status')}</label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as Status)}
                dir={locale === 'fa' ? 'rtl' : 'ltr'}
              >
                <SelectTrigger id="record-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="pending">{t('در انتظار', 'Pending')}</SelectItem>
                  <SelectItem value="approved">{t('تأییدشده', 'Approved')}</SelectItem>
                  <SelectItem value="archived">{t('بایگانی', 'Archived')}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="av-button av-button--primary"
                onClick={() => {
                  setRows((value) =>
                    value.map((row) => (row.id === current.id ? { ...row, status } : row)),
                  );
                  closeSheet(false);
                  toast.success(t('وضعیت نمونه به‌روز شد.', 'Sample status updated.'));
                }}
              >
                {t('ذخیره وضعیت نمونه', 'Save sample status')}
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
      <AlertDialog
        open={archiveIds.length > 0}
        onOpenChange={(open) => {
          if (!open) setArchiveIds([]);
        }}
      >
        <AlertDialogContent className="av-dialog av-panel" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
          <AlertDialogTitle>
            {t('بایگانی انتخاب‌ها؟', 'Archive selected records?')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              `${new Intl.NumberFormat('fa').format(archiveIds.length)} رکورد نمونه به وضعیت بایگانی منتقل می‌شود. داده‌ای حذف نمی‌شود.`,
              `${archiveIds.length} sample records will be marked as archived. No records are deleted.`,
            )}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="av-button av-button--secondary">
              {t('انصراف', 'Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction className="av-button av-button--primary" onClick={archive}>
              {t('بایگانی نمونه‌ها', 'Archive samples')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
function UserDemo({ locale, coursesOnly }: { locale: Locale; coursesOnly: boolean }) {
  const t = translate(locale),
    [progress, setProgress] = useState([45, 20, 100]),
    [saved, setSaved] = useState<number[]>([1]),
    [tab, setTab] = useState('learning'),
    [current, setCurrent] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  function openCourse(index: number) {
    opener.current = document.activeElement as HTMLElement;
    setCurrent(index);
  }
  const courses = [
    t('شناخت آسمان شب', 'Knowing the night sky'),
    t('اولین تجربه رصد', 'Your first observation'),
    t('آشنایی با تلسکوپ', 'Understanding telescopes'),
  ];
  const visible = courses
    .map((name, index) => ({ name, index }))
    .filter(({ index }) =>
      tab === 'saved'
        ? saved.includes(index)
        : tab === 'completed'
          ? progress[index] === 100
          : progress[index] < 100,
    );
  function toggleSaved(index: number) {
    setSaved((v) => (v.includes(index) ? v.filter((i) => i !== index) : [...v, index]));
  }
  return (
    <>
      <div className="panel-heading">
        <div>
          <span className="av-eyebrow">EXPLORER WORKSPACE</span>
          <h1>
            {coursesOnly
              ? t('دوره‌های من', 'My courses')
              : t('به مسیرتان ادامه دهید', 'Continue your journey')}
          </h1>
          <p>
            {t(
              'یک قدم دیگر به شناخت آسمان نزدیک‌تر شوید.',
              'Take another step toward understanding the sky.',
            )}
          </p>
        </div>
        <span className="av-badge av-badge--info">{t('کاوشگر نمونه', 'Sample explorer')}</span>
      </div>
      {!coursesOnly && (
        <>
          <div className="user-feature">
            <div>
              <span className="av-badge">
                {t('ادامه از جایی که بودید', 'Pick up where you left off')}
              </span>
              <h2>{courses[0]}</h2>
              <p>
                {t('جلسهٔ چهارم · شناخت صورت‌های فلکی', 'Lesson four · Finding constellations')}
              </p>
              <Button className="av-button av-button--primary" onClick={() => openCourse(0)}>
                <Play size={18} />
                {progress[0] === 100
                  ? t('مرور دوره', 'Review course')
                  : t('ادامه یادگیری', 'Continue learning')}
              </Button>
            </div>
            <img src="/art/nocturne.webp" alt="" />
          </div>
          <div className="panel-stats">
            <article className="av-card">
              <span>
                <BookOpen size={18} />
                {t('دوره‌ها', 'Courses')}
              </span>
              <strong>{new Intl.NumberFormat(locale).format(3)}</strong>
              <small>{t('در کتابخانهٔ نمونه', 'In your sample library')}</small>
            </article>
            <article className="av-card">
              <span>
                <CheckCircle2 size={18} />
                {t('تکمیل‌شده', 'Completed')}
              </span>
              <strong>
                {new Intl.NumberFormat(locale).format(progress.filter((v) => v === 100).length)}
              </strong>
              <small>{t('آماده مرور دوباره', 'Ready to revisit')}</small>
            </article>
            <article className="av-card">
              <span>
                <Bookmark size={18} />
                {t('ذخیره‌شده', 'Saved')}
              </span>
              <strong>{new Intl.NumberFormat(locale).format(saved.length)}</strong>
              <small>{t('برای قدم بعدی شما', 'For your next step')}</small>
            </article>
          </div>
        </>
      )}
      <Tabs value={tab} onValueChange={setTab} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
        <TabsList variant="line" aria-label={t('دوره‌های من', 'My courses')}>
          <TabsTrigger value="learning">{t('در حال یادگیری', 'Learning')}</TabsTrigger>
          <TabsTrigger value="completed">{t('تکمیل‌شده', 'Completed')}</TabsTrigger>
          <TabsTrigger value="saved">{t('ذخیره‌شده', 'Saved')}</TabsTrigger>
        </TabsList>
        {['learning', 'completed', 'saved'].map((value) => (
          <TabsContent key={value} value={value}>
            {visible.length ? (
              <div className="user-course-grid">
                {visible.map(({ name, index }) => (
                  <article className="av-card user-course" key={index}>
                    <div className="user-course-top">
                      <span className="course-symbol">
                        <BookOpen size={24} />
                      </span>
                      <Button
                        className="av-button av-button--ghost av-button--icon"
                        aria-pressed={saved.includes(index)}
                        aria-label={
                          (saved.includes(index)
                            ? t('حذف از ذخیره‌ها: ', 'Remove bookmark: ')
                            : t('ذخیره: ', 'Bookmark: ')) + name
                        }
                        onClick={() => toggleSaved(index)}
                      >
                        <Bookmark
                          size={18}
                          fill={saved.includes(index) ? 'currentColor' : 'none'}
                        />
                      </Button>
                    </div>
                    <span
                      className={`av-badge av-badge--${progress[index] === 100 ? 'success' : 'info'}`}
                    >
                      {progress[index] === 100
                        ? t('تکمیل‌شده', 'Completed')
                        : t('دوره نمونه', 'Sample course')}
                    </span>
                    <h2>{name}</h2>
                    <p>
                      {t(
                        'آموزش مرحله‌ای همراه با تمرین مشاهده.',
                        'Step-by-step lessons with observing practice.',
                      )}
                    </p>
                    <div className="av-progress-label">
                      <span>{t('پیشرفت', 'Progress')}</span>
                      <span>{new Intl.NumberFormat(locale).format(progress[index])}%</span>
                    </div>
                    <Progress value={progress[index]} aria-label={name} />
                    <Button
                      className="av-button av-button--secondary"
                      data-course-action={index}
                      onClick={() => openCourse(index)}
                    >
                      {progress[index] === 100
                        ? t('مرور دوره', 'Review course')
                        : t('ادامه دوره', 'Continue course')}
                    </Button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="av-card">
                <ViewStatePanel
                  state="empty"
                  locale={locale}
                  title={
                    tab === 'saved'
                      ? t('هنوز دوره‌ای ذخیره نکرده‌اید', 'No saved courses yet')
                      : tab === 'completed'
                        ? t('اولین دوره را کامل کنید', 'Complete your first course')
                        : t('همهٔ دوره‌ها را کامل کرده‌اید', 'All courses completed')
                  }
                  description={
                    tab === 'saved'
                      ? t(
                          'با دکمهٔ ذخیره روی کارت، دوره‌ها را برای بعد نگه دارید.',
                          'Use the bookmark on a course card to keep it for later.',
                        )
                      : tab === 'completed'
                        ? t(
                            'از فهرست یادگیری یک دوره را ادامه دهید.',
                            'Continue a course from your learning list.',
                          )
                        : t(
                            'پیشرفت شما حفظ شده است؛ می‌توانید دوره‌های تکمیل‌شده را مرور کنید.',
                            'Your progress is preserved. Revisit your completed courses anytime.',
                          )
                  }
                  actionLabel={
                    tab === 'learning' || progress.every((p) => p === 100)
                      ? t('مرور دوره‌های تکمیل‌شده', 'Review completed courses')
                      : t('مشاهده دوره‌ها', 'Browse courses')
                  }
                  onRecover={() =>
                    setTab(
                      tab === 'learning' || progress.every((p) => p === 100)
                        ? 'completed'
                        : 'learning',
                    )
                  }
                />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <Sheet
        open={current !== null}
        onOpenChange={(open) => {
          if (!open) setCurrent(null);
        }}
      >
        <SheetContent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            restorePanelFocus(opener.current, '[data-record-action], [data-course-action]');
          }}
          className="av-detail-sheet"
          side={locale === 'fa' ? 'left' : 'right'}
          dir={locale === 'fa' ? 'rtl' : 'ltr'}
          showCloseButton={false}
        >
          <SheetClose
            className="av-button av-button--ghost av-button--icon sheet-close"
            aria-label={t('بستن دوره', 'Close course')}
          >
            <X size={18} />
          </SheetClose>
          <SheetTitle>{current !== null ? courses[current] : ''}</SheetTitle>
          <SheetDescription>
            {t(
              'نمونهٔ گردش یادگیری؛ تکمیل جلسه را امتحان کنید.',
              'Sample learning flow. Try completing a lesson.',
            )}
          </SheetDescription>
          {current !== null && (
            <>
              <div className="lesson-preview">
                <BookOpen size={36} />
                <h3>{t('پیداکردن الگوها در آسمان', 'Finding patterns in the sky')}</h3>
                <p>
                  {t(
                    'سه ستارهٔ روشن را پیدا کنید و فاصلهٔ ظاهری آن‌ها را با هم مقایسه کنید. سپس طرح ساده‌ای از جای آن‌ها بکشید.',
                    'Find three bright stars and compare their apparent distances. Sketch their positions.',
                  )}
                </p>
              </div>
              <Progress
                value={progress[current]}
                aria-label={t('پیشرفت دوره', 'Course progress')}
              />
              <p role="status">{new Intl.NumberFormat(locale).format(progress[current])}%</p>
              <Button
                className="av-button av-button--primary"
                disabled={progress[current] === 100}
                onClick={() => {
                  setProgress((v) => v.map((p, i) => (i === current ? Math.min(100, p + 10) : p)));
                  toast.success(t('پیشرفت نمونه به‌روز شد.', 'Sample progress updated.'));
                }}
              >
                <CheckCircle2 size={17} />
                {progress[current] === 100
                  ? t('دوره تکمیل شد', 'Course completed')
                  : t('تکمیل جلسهٔ نمونه', 'Complete sample lesson')}
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
export function SettingsDemo({ locale, embedded = false }: { locale: Locale; embedded?: boolean }) {
  const t = translate(locale),
    initialName = t('کاوشگر نمونه', 'Sample explorer');
  const [name, setName] = useState(initialName),
    [email, setEmail] = useState('explorer@example.com'),
    [reminders, setReminders] = useState(true),
    [digest, setDigest] = useState(false),
    [touched, setTouched] = useState({ name: false, email: false }),
    [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle'),
    [simulateError, setSimulateError] = useState(false),
    [baseline, setBaseline] = useState({
      name: initialName,
      email: 'explorer@example.com',
      reminders: true,
      digest: false,
    });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const nameError = !name.trim(),
    emailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    dirty =
      name !== baseline.name ||
      email !== baseline.email ||
      reminders !== baseline.reminders ||
      digest !== baseline.digest;
  function submit(event: React.FormEvent) {
    event.preventDefault();
    setTouched({ name: true, email: true });
    if (nameError || emailError) {
      document.getElementById(nameError ? 'settings-name' : 'settings-email')?.focus();
      return;
    }
    if (status === 'saving' || !dirty) return;
    setStatus('saving');
    timer.current = setTimeout(() => {
      if (simulateError) {
        setStatus('error');
        return;
      }
      setBaseline({ name, email, reminders, digest });
      setStatus('success');
    }, 650);
  }
  return (
    <>
      {!embedded && (
        <div className="panel-heading">
          <div>
            <span className="av-eyebrow">ACCOUNT PREFERENCES</span>
            <h1>{t('تنظیمات حساب', 'Account settings')}</h1>
            <p>
              {t(
                'اطلاعات و یادآوری‌های شما؛ در این محیط به‌صورت نمونه.',
                'Your information and reminders, using sample data.',
              )}
            </p>
          </div>
        </div>
      )}
      <form className="av-card panel-settings" onSubmit={submit} noValidate>
        <div className="settings-section-heading">
          <h2>{t('اطلاعات شخصی', 'Personal information')}</h2>
          <span className={`av-badge av-badge--${dirty ? 'warning' : 'neutral'}`}>
            {dirty ? t('تغییر ذخیره‌نشده', 'Unsaved changes') : t('به‌روز', 'Up to date')}
          </span>
        </div>
        <label htmlFor="settings-name">{t('نام نمایشی', 'Display name')}</label>
        <Input
          className="av-field"
          id="settings-name"
          autoComplete="name"
          value={name}
          disabled={status === 'saving'}
          onBlur={() => setTouched((v) => ({ ...v, name: true }))}
          onChange={(e) => {
            setName(e.target.value);
            setStatus('idle');
          }}
          aria-invalid={touched.name && nameError}
          aria-describedby="settings-name-help"
        />
        <p
          id="settings-name-help"
          className={touched.name && nameError ? 'av-field-error' : 'field-help'}
        >
          {touched.name && nameError
            ? t('نام را وارد کنید.', 'Enter a name.')
            : t('این نام در پنل نمایش داده می‌شود.', 'This name appears in your workspace.')}
        </p>
        <label htmlFor="settings-email">{t('ایمیل', 'Email')}</label>
        <Input
          className="av-field"
          id="settings-email"
          type="email"
          autoComplete="email"
          dir="ltr"
          value={email}
          disabled={status === 'saving'}
          onBlur={() => setTouched((v) => ({ ...v, email: true }))}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus('idle');
          }}
          aria-invalid={touched.email && emailError}
          aria-describedby="settings-email-help"
        />
        <p
          id="settings-email-help"
          className={touched.email && emailError ? 'av-field-error' : 'field-help'}
        >
          {touched.email && emailError
            ? t(
                'ایمیل معتبر مثل sky@example.com وارد کنید.',
                'Enter a valid email, such as sky@example.com.',
              )
            : t('اطلاعات این فرم ارسال نمی‌شود.', 'This form does not send data.')}
        </p>
        <h2 className="settings-subtitle">{t('اعلان‌ها', 'Notifications')}</h2>
        <label className="av-switch-row">
          <span>{t('یادآوری برنامه‌های رصد', 'Observing reminders')}</span>
          <Switch
            dir="ltr"
            checked={reminders}
            disabled={status === 'saving'}
            onCheckedChange={(v) => {
              setReminders(v);
              setStatus('idle');
            }}
          />
        </label>
        <label className="av-switch-row">
          <span>{t('خلاصهٔ پیشرفت هفتگی', 'Weekly progress summary')}</span>
          <Switch
            dir="ltr"
            checked={digest}
            disabled={status === 'saving'}
            onCheckedChange={(v) => {
              setDigest(v);
              setStatus('idle');
            }}
          />
        </label>
        <div className="settings-demo-option">
          <label className="av-switch-row">
            <span>{t('نمایش خطای ذخیره در نمونه', 'Simulate a save failure')}</span>
            <Switch
              dir="ltr"
              checked={simulateError}
              onCheckedChange={setSimulateError}
              disabled={status === 'saving'}
            />
          </label>
        </div>
        {status === 'error' && (
          <p className="settings-feedback settings-feedback--error" role="alert">
            {t(
              'ذخیره نمونه ناموفق بود. مقدارها حفظ شده‌اند؛ شبیه‌سازی خطا را خاموش کنید و دوباره ذخیره کنید.',
              'Sample save failed. Your entries are preserved. Turn off the failure simulation and retry.',
            )}
          </p>
        )}
        {status === 'success' && (
          <p className="settings-feedback" role="status">
            <CheckCircle2 size={18} />
            {t('تنظیمات نمونه در این صفحه به‌روز شد.', 'Sample preferences updated on this page.')}
          </p>
        )}
        <div className="av-actions settings-actions">
          <Button
            type="submit"
            className="av-button av-button--primary"
            disabled={!dirty || status === 'saving'}
            aria-busy={status === 'saving'}
          >
            {status === 'saving' && <LoaderCircle className="animate-spin" size={17} />}{' '}
            {status === 'saving'
              ? t('در حال ذخیره…', 'Saving…')
              : status === 'error'
                ? t('تلاش دوباره', 'Try again')
                : t('ذخیره تغییرات نمونه', 'Save sample changes')}
          </Button>
          <Button
            type="button"
            className="av-button av-button--ghost"
            disabled={!dirty || status === 'saving'}
            onClick={() => {
              setName(baseline.name);
              setEmail(baseline.email);
              setReminders(baseline.reminders);
              setDigest(baseline.digest);
              setTouched({ name: false, email: false });
              setStatus('idle');
            }}
          >
            {t('لغو تغییرات', 'Discard changes')}
          </Button>
        </div>
      </form>
    </>
  );
}
