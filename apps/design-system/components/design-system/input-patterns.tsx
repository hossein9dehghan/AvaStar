'use client';
import { useState } from 'react';
import { Check, Upload, X, Bold, Italic, Underline } from 'lucide-react';
import { Checkbox } from '@avastar/ui/components/checkbox';
import { Switch } from '@avastar/ui/components/switch';
import { RadioGroup, RadioGroupItem } from '@avastar/ui/components/radio-group';
import { Slider } from '@avastar/ui/components/slider';
import { ToggleGroup, ToggleGroupItem } from '@avastar/ui/components/toggle-group';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@avastar/ui/components/select';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '@avastar/ui/components/combobox';
import { Calendar } from '@avastar/ui/components/calendar';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@avastar/ui/components/input-otp';
import { Button } from '@avastar/ui/components/button';
import { Section, Specimen } from './primitives';
import { translate, type Locale } from '@/lib/site';
export function SelectionPatterns({ locale }: { locale: Locale }) {
  const t = translate(locale),
    dir = locale === 'fa' ? 'rtl' : 'ltr';
  const [checked, setChecked] = useState<boolean | 'indeterminate'>('indeterminate'),
    [enabled, setEnabled] = useState(true),
    [radio, setRadio] = useState('weekly'),
    [value, setValue] = useState([45]);
  return (
    <Section
      id="selection"
      index="CONTROLS / SELECTION"
      title={t('یک انتخاب، یک واکنش روشن', 'A choice with clear feedback')}
      description={t(
        'با کلیک، لمس و صفحه‌کلید امتحان کنید. کنترل‌ها هنگام فشردن واکنش نشان می‌دهند.',
        'Try pointer, touch and keyboard. Controls respond as soon as you press.',
      )}
    >
      <Specimen
        locale={locale}
        title={t('چک‌باکس و سوییچ', 'Checkbox & switch')}
        source={
          '<Checkbox checked={checked} onCheckedChange={setChecked} />\n<Switch checked={enabled} onCheckedChange={setEnabled} />'
        }
      >
        <div className="ds-two-col">
          <div className="ds-stack">
            <label className="ds-check-row">
              <Checkbox checked={checked} onCheckedChange={setChecked} />
              {t('انتخاب گروه؛ حالت نیمه‌انتخاب', 'Group selection; mixed state')}
            </label>
            <label className="ds-check-row">
              <Checkbox defaultChecked />
              {t('انتخاب‌شده', 'Checked')}
            </label>
            <label className="ds-check-row">
              <Checkbox />
              {t('انتخاب‌نشده', 'Unchecked')}
            </label>
            <label className="ds-check-row">
              <Checkbox disabled />
              {t('غیرفعال', 'Disabled')}
            </label>
            <label className="ds-check-row">
              <Checkbox disabled checked />
              {t('انتخاب‌شده و غیرفعال', 'Checked & disabled')}
            </label>
          </div>
          <div className="ds-stack">
            <label className="ds-switch-row">
              <span>{t('یادآوری رصد', 'Observing reminders')}</span>
              <Switch dir="ltr" checked={enabled} onCheckedChange={setEnabled} />
            </label>
            <label className="ds-switch-row">
              <span>{t('خاموش', 'Off')}</span>
              <Switch dir="ltr" />
            </label>
            <label className="ds-switch-row">
              <span>{t('روشن و غیرفعال', 'On & disabled')}</span>
              <Switch dir="ltr" checked disabled />
            </label>
            <label className="ds-switch-row">
              <span>{t('خاموش و غیرفعال', 'Off & disabled')}</span>
              <Switch dir="ltr" disabled />
            </label>
            <p className="ds-note" role="status">
              {enabled
                ? t('یادآوری نمونه روشن است.', 'Sample reminders are on.')
                : t('یادآوری نمونه خاموش است.', 'Sample reminders are off.')}
            </p>
          </div>
        </div>
      </Specimen>
      <div className="ds-two-col">
        <article className="av-card">
          <h2>{t('انتخاب تکی', 'Single choice')}</h2>
          <RadioGroup
            value={radio}
            onValueChange={setRadio}
            dir={dir}
            aria-label={t('زمان یادآوری', 'Reminder frequency')}
          >
            {[
              ['daily', t('روزانه', 'Daily')],
              ['weekly', t('هفتگی', 'Weekly')],
              ['monthly', t('ماهانه', 'Monthly')],
              ['unavailable', t('فعلاً در دسترس نیست', 'Currently unavailable')],
            ].map(([id, label]) => (
              <label className="ds-check-row" key={id}>
                <RadioGroupItem value={id} disabled={id === 'unavailable'} />
                {label}
              </label>
            ))}
          </RadioGroup>
        </article>
        <article className="av-card">
          <h2 id="range-label">{t('مقدار پیوسته', 'Continuous value')}</h2>
          <output className="ds-value">{new Intl.NumberFormat(locale).format(value[0])}%</output>
          <Slider
            aria-label={t('روشنایی نمونه', 'Sample brightness')}
            value={value}
            onValueChange={setValue}
            dir="ltr"
          />
          <Slider
            aria-label={t('مقدار غیرفعال', 'Disabled value')}
            value={[30]}
            disabled
            dir="ltr"
          />
          <p className="ds-note">
            {t(
              'کلیدهای جهت برای تغییر؛ Home و End برای دو انتهای بازه.',
              'Arrow keys adjust. Home and End jump to the range limits.',
            )}
          </p>
        </article>
      </div>
      <Specimen
        locale={locale}
        title={t('انتخاب چندتایی', 'Multiple selection')}
        source={'<ToggleGroup type="multiple" aria-label="Text formatting">…</ToggleGroup>'}
      >
        <ToggleGroup
          type="multiple"
          variant="outline"
          dir="ltr"
          aria-label={t('قالب متن', 'Text formatting')}
        >
          <ToggleGroupItem value="bold" aria-label={t('ضخیم', 'Bold')}>
            <Bold size={18} />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label={t('مورب', 'Italic')}>
            <Italic size={18} />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label={t('زیرخط', 'Underline')}>
            <Underline size={18} />
          </ToggleGroupItem>
          <ToggleGroupItem
            disabled
            value="unavailable"
            aria-label={t('قالب غیرفعال', 'Unavailable format')}
          >
            <X size={18} />
          </ToggleGroupItem>
        </ToggleGroup>
      </Specimen>
    </Section>
  );
}
export function PickerPatterns({ locale }: { locale: Locale }) {
  const t = translate(locale),
    dir = locale === 'fa' ? 'rtl' : 'ltr';
  const [path, setPath] = useState(''),
    [city, setCity] = useState<string | null>(null),
    [date, setDate] = useState<Date | undefined>(),
    [calendar, setCalendar] = useState<'persian' | 'gregorian'>(
      locale === 'fa' ? 'persian' : 'gregorian',
    ),
    [month, setMonth] = useState(new Date(2026, 8, 1)),
    [file, setFile] = useState<File | null>(null),
    [fileError, setFileError] = useState(''),
    [otp, setOtp] = useState('');
  const cities =
    locale === 'fa'
      ? ['تهران', 'کاشان', 'شیراز', 'اصفهان', 'تبریز']
      : ['Tehran', 'Kashan', 'Shiraz', 'Isfahan', 'Tabriz'];
  return (
    <Section
      id="pickers"
      index="INPUT / PICKERS"
      title={t('انتخابگرهای دقیق', 'Precise pickers')}
      description={t(
        'انتخاب، جست‌وجو، تاریخ، فایل و کد؛ با حالت خالی، انتخاب‌شده، غیرفعال و خطا.',
        'Select, search, date, file and code inputs with empty, selected, disabled and error states.',
      )}
    >
      <div className="ds-two-col">
        <article className="av-card ds-stack">
          <label htmlFor="path-picker">{t('مسیر مورد علاقه', 'Preferred path')}</label>
          <Select value={path} onValueChange={setPath} dir={dir}>
            <SelectTrigger id="path-picker">
              <SelectValue placeholder={t('یک مسیر انتخاب کنید', 'Choose a path')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="learn">{t('آموزش', 'Learning')}</SelectItem>
              <SelectItem value="observe">{t('رصد', 'Observing')}</SelectItem>
              <SelectItem value="gear" disabled>
                {t('تجهیزات؛ به‌زودی', 'Equipment; coming soon')}
              </SelectItem>
            </SelectContent>
          </Select>
          <label htmlFor="disabled-picker">{t('انتخابگر غیرفعال', 'Disabled picker')}</label>
          <Select disabled value="learn">
            <SelectTrigger id="disabled-picker">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="learn">{t('آموزش', 'Learning')}</SelectItem>
            </SelectContent>
          </Select>
          <p className="ds-note">
            {t(
              'با تایپ حرف، کلیدهای جهت و Enter انتخاب کنید.',
              'Use type-ahead, arrow keys and Enter.',
            )}
          </p>
        </article>
        <article className="av-card ds-stack">
          <label htmlFor="city-picker">
            {t('شهر رصد؛ قابل جست‌وجو', 'Observing city; searchable')}
          </label>
          <Combobox items={cities} value={city} onValueChange={setCity}>
            <ComboboxInput
              id="city-picker"
              placeholder={t('نام شهر را بنویسید', 'Type a city')}
              showClear
            />
            <ComboboxContent dir={dir}>
              <ComboboxEmpty>{t('شهری پیدا نشد', 'No cities found')}</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <p className="ds-note" role="status">
            {city || t('هنوز شهری انتخاب نشده است.', 'No city selected.')}
          </p>
        </article>
      </div>
      <Specimen
        locale={locale}
        title={t('تقویم شمسی و میلادی', 'Persian & Gregorian calendars')}
        source={
          '<Calendar calendar="persian" mode="single" selected={date} onSelect={setDate} />\n<Calendar calendar="gregorian" mode="single" selected={date} onSelect={setDate} />'
        }
      >
        <ToggleGroup
          className="ds-calendar-switch"
          type="single"
          variant="outline"
          value={calendar}
          dir={dir}
          aria-label={t('نوع تقویم', 'Calendar system')}
          onValueChange={(value) => {
            if (value !== 'persian' && value !== 'gregorian') return;
            setCalendar(value);
            if (date) setMonth(date);
          }}
        >
          <ToggleGroupItem value="persian">{t('شمسی', 'Persian')}</ToggleGroupItem>
          <ToggleGroupItem value="gregorian">{t('میلادی', 'Gregorian')}</ToggleGroupItem>
        </ToggleGroup>
        <div className="ds-picker-layout">
          <Calendar
            key={calendar}
            calendar={calendar}
            month={month}
            onMonthChange={setMonth}
            mode="single"
            numerals={locale === 'fa' ? 'arabext' : 'latn'}
            labels={{
              labelNav: () => t('ناوبری تقویم', 'Calendar navigation'),
              labelPrevious: () => t('ماه قبل', 'Previous month'),
              labelNext: () => t('ماه بعد', 'Next month'),
              labelDayButton: (date, modifiers) =>
                new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
                  calendar: calendar === 'persian' ? 'persian' : 'gregory',
                  dateStyle: 'full',
                }).format(date) +
                (modifiers.selected ? t('، انتخاب‌شده', ', selected') : '') +
                (modifiers.disabled ? t('، غیرقابل انتخاب', ', unavailable') : ''),
            }}
            selected={date}
            onSelect={setDate}
            dir={dir}
            disabled={{ before: new Date(2026, 8, 1) }}
          />
          <div className="ds-stack">
            <h2>{t('تاریخ انتخاب‌شده', 'Selected date')}</h2>
            <output aria-live="polite" aria-atomic="true">
              {date
                ? new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
                    calendar: calendar === 'persian' ? 'persian' : 'gregory',
                    dateStyle: 'long',
                  }).format(date)
                : t('یک روز را انتخاب کنید.', 'Choose a day.')}
            </output>
            <Button
              className="av-button av-button--secondary av-button--sm"
              disabled={!date}
              onClick={() => setDate(undefined)}
            >
              {t('پاک‌کردن تاریخ', 'Clear date')}
            </Button>
            <p className="ds-note">
              {t(
                'با تغییر تقویم، همان روز انتخاب‌شده حفظ می‌شود. روزهای پیش از ۱۰ شهریور ۱۴۰۵ (۱ سپتامبر ۲۰۲۶) در این نمونه غیرفعال‌اند.',
                'Switching calendars preserves the selected day. Dates before 10 Shahrivar 1405 (September 1, 2026) are disabled in this example.',
              )}
            </p>
          </div>
        </div>
      </Specimen>
      <div className="ds-two-col">
        <article className="av-card ds-stack">
          <h2>{t('انتخاب فایل', 'File selection')}</h2>
          <label className="ds-file-input">
            <Upload size={24} />
            <span>{t('انتخاب تصویر یا PDF', 'Choose an image or PDF')}</span>
            <small>
              {t('حداکثر ۵ مگابایت؛ فایل ارسال نمی‌شود.', 'Up to 5 MB; no file is uploaded.')}
            </small>
            <input
              type="file"
              accept="image/*,.pdf"
              aria-describedby="file-result"
              aria-invalid={Boolean(fileError)}
              onChange={(e) => {
                const next = e.target.files?.[0];
                if (!next) return;
                if (
                  next.size > 5 * 1024 * 1024 ||
                  (!next.type.startsWith('image/') && next.type !== 'application/pdf')
                ) {
                  setFileError(
                    t(
                      'تصویر یا PDF کوچک‌تر از ۵ مگابایت انتخاب کنید.',
                      'Choose an image or PDF smaller than 5 MB.',
                    ),
                  );
                  setFile(null);
                  e.target.value = '';
                } else {
                  setFile(next);
                  setFileError('');
                }
              }}
            />
          </label>
          <p
            id="file-result"
            role={fileError ? 'alert' : 'status'}
            className={fileError ? 'field-error' : 'field-help'}
          >
            {fileError || file?.name || t('فایلی انتخاب نشده است.', 'No file selected.')}
          </p>
        </article>
        <article className="av-card ds-stack">
          <label htmlFor="verification-code">
            {t('کد شش‌رقمی نمونه', 'Sample six-digit code')}
          </label>
          <div dir="ltr">
            <InputOTP
              id="verification-code"
              maxLength={6}
              value={otp}
              onChange={(value) =>
                setOtp(
                  value
                    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
                    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632)),
                )
              }
              pattern="[0-9۰-۹٠-٩]*"
              inputMode="numeric"
              aria-describedby="otp-status"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }, (_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="field-help" id="otp-status" role="status">
            {otp.length === 6
              ? t(
                  'کد کامل شد؛ این نمونه احراز هویت انجام نمی‌دهد.',
                  'Code complete; this demo does not authenticate.',
                )
              : t('امکان تایپ و چسباندن کد وجود دارد.', 'Type or paste a code.')}
          </p>
          <Button
            className="av-button av-button--secondary"
            disabled={otp.length !== 6}
            onClick={() => setOtp('')}
          >
            <Check size={17} />
            {t('بازنشانی نمونه', 'Reset sample')}
          </Button>
        </article>
      </div>
    </Section>
  );
}
