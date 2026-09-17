'use client';
import { CheckCircle2, Inbox, LockKeyhole, Search, TriangleAlert, WifiOff } from 'lucide-react';
import { Button } from '@avastar/ui/components/button';
import { Skeleton } from '@avastar/ui/components/skeleton';
import { translate, type Locale } from '@avastar/ui/lib/locale';
export const viewStates = [
  'ready',
  'loading',
  'empty',
  'no-results',
  'error',
  'offline',
  'forbidden',
  'success',
] as const;
export type ViewState = (typeof viewStates)[number];
export function stateLabel(state: ViewState, locale: Locale) {
  const labels = {
    ready: ['آماده', 'Ready'],
    loading: ['بارگذاری', 'Loading'],
    empty: ['خالی', 'Empty'],
    'no-results': ['بدون نتیجه', 'No results'],
    error: ['خطا', 'Error'],
    offline: ['آفلاین', 'Offline'],
    forbidden: ['دسترسی محدود', 'Restricted'],
    success: ['موفق', 'Success'],
  };
  return labels[state][locale === 'fa' ? 0 : 1];
}
export function ViewStatePanel({
  state,
  locale,
  onRecover,
  compact = false,
  title,
  description,
  actionLabel,
}: {
  state: Exclude<ViewState, 'ready'>;
  locale: Locale;
  onRecover?: () => void;
  compact?: boolean;
  title?: string;
  description?: string;
  actionLabel?: string;
}) {
  const t = translate(locale);
  if (state === 'loading')
    return (
      <div
        className={`av-state av-state-loading ${compact ? 'compact' : ''}`}
        aria-busy="true"
        role="status"
      >
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-64 max-w-full" />
        <Skeleton className="h-11 w-32" />
        <span className="sr-only">{t('در حال بارگذاری اطلاعات…', 'Loading information…')}</span>
      </div>
    );
  const content = {
    empty: {
      icon: Inbox,
      title: t('هنوز چیزی اینجا نیست', 'Nothing here yet'),
      body: t(
        'با افزودن اولین مورد، این بخش آماده استفاده می‌شود.',
        'Add your first item to get started.',
      ),
      action: t('افزودن مورد نمونه', 'Add sample item'),
    },
    'no-results': {
      icon: Search,
      title: t('نتیجه‌ای پیدا نشد', 'No results found'),
      body: t(
        'عبارت جست‌وجو را کوتاه‌تر کنید یا فیلترها را بردارید.',
        'Try a shorter search or clear the filters.',
      ),
      action: t('پاک‌کردن فیلترها', 'Clear filters'),
    },
    error: {
      icon: TriangleAlert,
      title: t('اطلاعات دریافت نشد', 'Could not load information'),
      body: t(
        'اطلاعات واردشده حفظ شده است. دوباره تلاش کنید.',
        'Your entries are preserved. Please try again.',
      ),
      action: t('تلاش دوباره', 'Try again'),
    },
    offline: {
      icon: WifiOff,
      title: t('ارتباط برقرار نیست', 'You are offline'),
      body: t(
        'اتصال اینترنت را بررسی کنید؛ تغییرات این صفحه حفظ شده‌اند.',
        'Check your connection. Changes on this page are preserved.',
      ),
      action: t('بررسی دوباره', 'Try connection again'),
    },
    forbidden: {
      icon: LockKeyhole,
      title: t('دسترسی به این بخش محدود است', 'Access is restricted'),
      body: t(
        'این عملیات به نقش مدیر نیاز دارد. می‌توانید به فضای خود برگردید.',
        'This action requires an administrator role. Return to your workspace.',
      ),
      action: t('بازگشت به فضای نمونه', 'Back to sample workspace'),
    },
    success: {
      icon: CheckCircle2,
      title: t('تغییرات ثبت شد', 'Changes saved'),
      body: t(
        'اطلاعات نمونه به‌روز است و می‌توانید ادامه دهید.',
        'The sample information is up to date. You can continue.',
      ),
      action: t('ادامه', 'Continue'),
    },
  }[state];
  const Icon = content.icon;
  return (
    <div
      className={`av-state av-state--${state} ${compact ? 'compact' : ''}`}
      role={state === 'error' ? 'alert' : 'status'}
    >
      <span className="av-state-icon">
        <Icon size={26} />
      </span>
      <h2>{title ?? content.title}</h2>
      <p>{description ?? content.body}</p>
      {onRecover && (
        <Button className="av-button av-button--secondary av-button--sm" onClick={onRecover}>
          {actionLabel ?? content.action}
        </Button>
      )}
    </div>
  );
}
