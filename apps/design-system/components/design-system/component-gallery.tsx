'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Compass,
  Info,
  LoaderCircle,
  Search,
  TriangleAlert,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@avastar/ui/components/button';
import { Input } from '@avastar/ui/components/input';
import { FormPatterns } from './form-patterns';
import { Textarea } from '@avastar/ui/components/textarea';
import { Checkbox } from '@avastar/ui/components/checkbox';
import { Switch } from '@avastar/ui/components/switch';
import { RadioGroup, RadioGroupItem } from '@avastar/ui/components/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@avastar/ui/components/select';
import { Slider } from '@avastar/ui/components/slider';
import { Progress } from '@avastar/ui/components/progress';
import { Skeleton } from '@avastar/ui/components/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@avastar/ui/components/alert';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@avastar/ui/components/dialog';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@avastar/ui/components/accordion';
import { Tooltip, TooltipTrigger, TooltipContent } from '@avastar/ui/components/tooltip';
import { Section, Specimen } from './primitives';
import { ButtonStates, FieldStates } from './state-examples';
import { translate, type Locale } from '@/lib/site';
export function ComponentGallery({ locale }: { locale: Locale }) {
  const t = translate(locale),
    dir = locale === 'fa' ? 'rtl' : 'ltr';
  const [busy, setBusy] = useState(false),
    [email, setEmail] = useState(''),
    [error, setError] = useState(''),
    [valid, setValid] = useState(false),
    [plan, setPlan] = useState('learn'),
    [checked, setChecked] = useState(false),
    [notification, setNotification] = useState(true),
    [progress, setProgress] = useState(45);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function loadingDemo() {
    if (busy) return;
    setBusy(true);
    timer.current = setTimeout(() => {
      setBusy(false);
      toast.success(t('نمونه کامل شد', 'Demo complete'));
    }, 800);
  }
  function validate(event: React.FormEvent) {
    event.preventDefault();
    setValid(false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(
        t(
          'ایمیل معتبر وارد کنید؛ مثل sky@example.com.',
          'Enter a valid email, such as sky@example.com.',
        ),
      );
      document.getElementById('sample-email')?.focus();
      return;
    }
    setError('');
    setValid(true);
  }
  return (
    <>
      <Section
        id="buttons"
        index="05 / ACTIONS"
        title={t('اقدام‌ها و حالت‌های کنترل', 'Actions & control states')}
        description={t(
          'همه نمونه‌ها قابل آزمایش‌اند. در هر گروه یک اقدام اصلی کافی است.',
          'Every example is interactive. Use one primary action in each group.',
        )}
      >
        <Specimen
          locale={locale}
          title={t('دکمه‌های مشترک', 'Shared buttons')}
          source={`<Button className="av-button av-button--primary">\n  ${t('ادامه مسیر', 'Continue')}\n</Button>`}
        >
          <div className="ds-button-row">
            <Button
              className="av-button av-button--primary"
              onClick={() => toast.success(t('اقدام نمونه انجام شد', 'Sample action complete'))}
            >
              {t('ادامه مسیر', 'Continue')}
              {locale === 'fa' ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
            </Button>
            <Button
              className="av-button av-button--secondary"
              onClick={() => toast.info(t('جزئیات نمونه', 'Sample details'))}
            >
              {t('مشاهده جزئیات', 'View details')}
            </Button>
            <Button
              className="av-button av-button--ghost"
              onClick={() => toast.info(t('بازگشت نمونه', 'Sample back action'))}
            >
              {t('بازگشت', 'Back')}
            </Button>
            <Button
              className="av-button av-button--danger"
              onClick={() =>
                toast.warning(
                  t('عملیات حساس به تأیید نیاز دارد.', 'Sensitive actions require confirmation.'),
                )
              }
            >
              {t('عملیات حساس', 'Sensitive action')}
            </Button>
          </div>
        </Specimen>
        <h2 className="ds-subheading">{t('مقایسه همه حالت‌ها', 'All interaction states')}</h2>
        <ButtonStates locale={locale} />
        <div className="ds-control-states">
          <article>
            <span>{t('کوچک · ۴۴', 'Small · 44')}</span>
            <Button className="av-button av-button--secondary av-button--sm" onClick={loadingDemo}>
              {t('مشاهده', 'View')}
            </Button>
          </article>
          <article>
            <span>{t('پنل · ۴۸', 'Panel · 48')}</span>
            <div className="av-panel">
              <Button className="av-button av-button--primary" onClick={loadingDemo}>
                {t('ذخیره نمونه', 'Save demo')}
              </Button>
            </div>
          </article>
          <article>
            <span>{t('غیرفعال', 'Disabled')}</span>
            <Button disabled className="av-button av-button--primary av-button--md">
              {t('ادامه', 'Continue')}
            </Button>
          </article>
          <article>
            <span>{t('بارگذاری', 'Loading')}</span>
            <Button
              disabled={busy}
              aria-busy={busy}
              className="av-button av-button--secondary"
              onClick={loadingDemo}
            >
              {busy ? <LoaderCircle className="animate-spin" size={17} /> : <Check size={17} />}{' '}
              {busy ? t('در حال اجرا', 'Running') : t('اجرای نمونه', 'Run demo')}
            </Button>
          </article>
        </div>
        <div className="ds-tip">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="av-button av-button--secondary av-button--icon"
                aria-label={t('راهنمای قطب‌نما', 'Compass help')}
                onClick={() => toast.info(t('راهنمای نمونه', 'Sample help'))}
              >
                <Compass size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('راهنمای مسیر', 'Journey help')}</TooltipContent>
          </Tooltip>
          <p>
            {t(
              'با Tab حلقه فوکوس را بررسی کنید. کنترل آیکونی نام قابل دسترس و هدف ۴۴ پیکسلی دارد.',
              'Tab to inspect focus. Icon controls have accessible names and 44px targets.',
            )}
          </p>
        </div>
      </Section>
      <Section
        id="forms"
        index="06 / INPUT"
        title={t('فرم‌های قابل فهم و اصلاح', 'Understandable, recoverable forms')}
        description={t(
          'برچسب بیرون فیلد، خطا کنار همان ورودی، و حفظ مقدار واردشده.',
          'Persistent labels, errors next to inputs, and preserved values.',
        )}
      >
        <Specimen
          locale={locale}
          title={t('اعتبارسنجی نمونه', 'Validation example')}
          description={t(
            'اطلاعات این نمونه ارسال یا ذخیره نمی‌شود.',
            'This example does not submit or store data.',
          )}
          source={
            '<label htmlFor="email">ایمیل</label>\n<Input id="email" className="av-field"\n  aria-invalid={!!error}\n  aria-describedby="email-help" />\n<p id="email-help" role={error ? "alert" : undefined}>\n  {error || "توضیح ورودی"}\n</p>'
          }
        >
          <form className="ds-form" onSubmit={validate} noValidate>
            <div>
              <label htmlFor="sample-name">{t('نام کاوشگر', 'Explorer name')}</label>
              <Input
                className="av-field"
                id="sample-name"
                placeholder={t('نام شما', 'Your name')}
              />
            </div>
            <div>
              <label htmlFor="sample-email">{t('ایمیل', 'Email')}</label>
              <Input
                id="sample-email"
                className="av-field"
                dir="ltr"
                type="email"
                value={email}
                onBlur={() => {
                  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                    setError(t('ایمیل کامل وارد کنید.', 'Enter a complete email.'));
                }}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setValid(false);
                }}
                placeholder="sky@example.com"
                aria-invalid={!!error}
                aria-describedby="sample-email-help"
              />
              <p
                id="sample-email-help"
                className={error ? 'field-error' : 'field-help'}
                role={error ? 'alert' : undefined}
              >
                {error || t('فقط برای بررسی رفتار فرم.', 'Only to demonstrate form behavior.')}
              </p>
            </div>
            <div className="span-two">
              <label htmlFor="sample-message">{t('پیام', 'Message')}</label>
              <Textarea
                className="av-field"
                id="sample-message"
                placeholder={t(
                  'از علاقه‌تان به آسمان بگویید…',
                  'Tell us what interests you about the sky…',
                )}
              />
            </div>
            <div>
              <label htmlFor="sample-disabled">{t('نمونه غیرفعال', 'Disabled sample')}</label>
              <Input
                className="av-field"
                id="sample-disabled"
                value={t('ویرایش غیرفعال است', 'Editing is disabled')}
                disabled
              />
            </div>
            <div className="span-two ds-button-row">
              <Button className="av-button av-button--primary av-button--md" type="submit">
                {t('بررسی نمونه', 'Validate example')}
              </Button>
              {valid && (
                <p className="field-success" role="status">
                  <CheckCircle2 size={18} />
                  {t('ورودی نمونه معتبر است.', 'The sample input is valid.')}
                </p>
              )}
            </div>
          </form>
        </Specimen>
        <h2 className="ds-subheading">{t('حالت‌های فیلد', 'Field states')}</h2>
        <FieldStates locale={locale} />
        <FormPatterns locale={locale} />
        <div className="ds-two-col">
          <div className="av-card">
            <h2>{t('انتخاب مسیر', 'Path selection')}</h2>
            <RadioGroup
              className="ds-radio-list"
              value={plan}
              onValueChange={setPlan}
              aria-label={t('مسیر نمونه', 'Sample path')}
              dir={dir}
            >
              {[
                ['learn', t('آموزش', 'Learning')],
                ['explore', t('کاوش', 'Exploring')],
                ['shop', t('تجهیزات', 'Equipment')],
              ].map(([id, label]) => (
                <label className="ds-check-row" key={id}>
                  <RadioGroupItem value={id} />
                  {label}
                </label>
              ))}
            </RadioGroup>
            <label className="ds-label" htmlFor="sample-select">
              {t('همان انتخاب، در فهرست', 'The same selection, in a list')}
            </label>
            <Select value={plan} onValueChange={setPlan} dir={dir}>
              <SelectTrigger id="sample-select" className="av-field">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="learn">{t('آموزش', 'Learning')}</SelectItem>
                <SelectItem value="explore">{t('کاوش', 'Exploring')}</SelectItem>
                <SelectItem value="shop">{t('تجهیزات', 'Equipment')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="av-card">
            <h2>{t('تنظیمات و پیشرفت', 'Settings & progress')}</h2>
            <label className="ds-check-row">
              <Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
              {t('این گزینه نمونه را انتخاب می‌کنم', 'Select this sample option')}
            </label>
            <label className="ds-switch-row">
              <span>{t('یادآوری برنامه‌ها', 'Program reminders')}</span>
              <Switch checked={notification} onCheckedChange={setNotification} dir="ltr" />
            </label>
            <div className="ds-progress-label">
              <label id="sample-progress-label">{t('پیشرفت نمونه', 'Sample progress')}</label>
              <output>{new Intl.NumberFormat(locale).format(progress)}%</output>
            </div>
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              min={0}
              max={100}
              step={5}
              dir="ltr"
              aria-labelledby="sample-progress-label"
              ref={(node) => {
                node
                  ?.querySelector('[role=slider]')
                  ?.setAttribute('aria-labelledby', 'sample-progress-label');
              }}
            />
            <Progress
              value={progress}
              aria-label={t('پیشرفت نمونه', 'Sample progress')}
              className="ds-progress"
            />
          </div>
        </div>
      </Section>
      <Section
        id="feedback"
        index="07 / FEEDBACK"
        title={t('بازخورد روشن، در هر دو تم', 'Clear feedback, in both themes')}
        description={t(
          'رنگ وضعیت با آیکون و متن همراه است؛ رنگ به‌تنهایی پیام نیست.',
          'Pair status colors with icons and text. Never rely on color alone.',
        )}
      >
        <div className="ds-button-row">
          {[
            ['success', CheckCircle2, t('موفق', 'Success')],
            ['warning', TriangleAlert, t('نیاز به بررسی', 'Needs review')],
            ['error', XCircle, t('ناموفق', 'Failed')],
            ['info', Info, t('در انتظار', 'Pending')],
          ].map(([kind, Icon, label]) => {
            const StatusIcon = Icon as typeof Info;
            return (
              <span key={String(kind)} className={`av-badge av-badge--${kind}`}>
                <StatusIcon size={15} />
                {String(label)}
              </span>
            );
          })}
        </div>
        <div className="ds-two-col">
          <Alert className="ds-alert">
            <Info />
            <AlertTitle>{t('تغییرات آماده ثبت است', 'Changes are ready to save')}</AlertTitle>
            <AlertDescription>
              {t(
                'پیش از ثبت، اطلاعات واردشده را بررسی کنید.',
                'Review your entries before saving.',
              )}
            </AlertDescription>
          </Alert>
          <Alert className="ds-alert ds-alert-error">
            <XCircle />
            <AlertTitle>{t('ذخیره انجام نشد', 'Could not save')}</AlertTitle>
            <AlertDescription>
              {t(
                'اطلاعات حفظ شده است. دوباره تلاش کنید.',
                'Your information is preserved. Try again.',
              )}
            </AlertDescription>
          </Alert>
        </div>
        <div className="ds-two-col">
          <Alert
            className="ds-alert"
            style={{ background: 'var(--success-background)', color: 'var(--success)' }}
          >
            <CheckCircle2 />
            <AlertTitle>{t('ذخیره انجام شد', 'Saved successfully')}</AlertTitle>
            <AlertDescription>
              {t('تغییرات نمونه آماده‌اند.', 'Sample changes are ready.')}
            </AlertDescription>
          </Alert>
          <Alert
            className="ds-alert"
            style={{ background: 'var(--warning-background)', color: 'var(--warning)' }}
          >
            <TriangleAlert />
            <AlertTitle>{t('تغییر ذخیره‌نشده دارید', 'You have unsaved changes')}</AlertTitle>
            <AlertDescription>
              {t(
                'پیش از خروج، تغییرات را ذخیره یا لغو کنید.',
                'Save or discard your changes before leaving.',
              )}
            </AlertDescription>
          </Alert>
        </div>
        <div className="ds-button-row ds-margin">
          {(['info', 'warning', 'error'] as const).map((kind) => (
            <Button
              className="av-button av-button--secondary"
              key={kind}
              onClick={() =>
                toast[kind](
                  kind === 'info'
                    ? t('این یک اعلان اطلاعاتی نمونه است.', 'This is a sample information message.')
                    : kind === 'warning'
                      ? t('تغییر نمونه ذخیره نشده است.', 'Sample changes are unsaved.')
                      : t(
                          'ذخیره نمونه انجام نشد؛ دوباره تلاش کنید.',
                          'Sample save failed. Try again.',
                        ),
                )
              }
            >
              {kind === 'info'
                ? t('اعلان اطلاع', 'Information toast')
                : kind === 'warning'
                  ? t('اعلان هشدار', 'Warning toast')
                  : t('اعلان خطا', 'Error toast')}
            </Button>
          ))}

          <Button
            className="av-button av-button--secondary"
            onClick={() => toast.success(t('نمونه اعلان موفقیت', 'Sample success notification'))}
          >
            {t('نمایش اعلان', 'Show notification')}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="av-button av-button--primary av-button--md">
                {t('آزمایش مدال', 'Test dialog')}
              </Button>
            </DialogTrigger>
            <DialogContent className="av-dialog" dir={dir}>
              <DialogTitle>{t('تغییرات را بررسی کنید', 'Review your changes')}</DialogTitle>
              <DialogDescription>
                {t(
                  'این مدال از همان توکن‌های فرم و پنل استفاده می‌کند. با Escape بسته می‌شود و فوکوس به بازکننده برمی‌گردد.',
                  'This dialog shares the form and panel tokens. Escape closes it and focus returns to its trigger.',
                )}
              </DialogDescription>
              <DialogClose asChild>
                <Button className="av-button av-button--primary av-button--md">
                  {t('متوجه شدم', 'Got it')}
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
        <div className="ds-two-col">
          <div className="av-card ds-empty">
            <Search size={27} />
            <h2>{t('نتیجه‌ای پیدا نشد', 'No results found')}</h2>
            <p>
              {t(
                'عبارت کوتاه‌تر یا فیلتر دیگری را امتحان کنید.',
                'Try a shorter query or another filter.',
              )}
            </p>
          </div>
          <div
            className="av-card"
            aria-busy="true"
            aria-label={t('نمونه حالت بارگذاری', 'Loading state example')}
          >
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="mt-5 h-4 w-full" />
            <Skeleton className="mt-3 h-4 w-4/5" />
            <Skeleton className="mt-6 h-10 w-1/3" />
            <span className="sr-only">{t('در حال بارگذاری', 'Loading')}</span>
          </div>
        </div>
        <Accordion type="single" collapsible className="ds-margin">
          <AccordionItem value="usage">
            <AccordionTrigger>
              {t(
                'چه زمانی از مدال یا پنل جزئیات استفاده کنیم؟',
                'When should we use a dialog or a detail sheet?',
              )}
            </AccordionTrigger>
            <AccordionContent>
              {t(
                'مدال برای یک تصمیم متمرکز؛ پنل جزئیات برای مرور رکورد کنار جدول. در هر دو، بستن با صفحه‌کلید و بازگشت فوکوس لازم است.',
                'A dialog supports one focused decision. A sheet lets you inspect a record beside the table. Both need keyboard dismissal and focus restoration.',
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>
    </>
  );
}
