'use client';
import { useState } from 'react';
import { Textarea } from '@avastar/ui/components/textarea';
import { Input } from '@avastar/ui/components/input';
import { Button } from '@avastar/ui/components/button';
import { ErrorSummary, type FieldError } from '@avastar/ui/error-summary';
import { NumberField } from '@avastar/ui/number-field';
import { Specimen } from './primitives';
import { translate, type Locale } from '@/lib/site';
export function FormPatterns({ locale }: { locale: Locale }) {
  const t = translate(locale);
  const [message, setMessage] = useState(''),
    [count, setCount] = useState(2),
    [name, setName] = useState(''),
    [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FieldError[]>([]),
    [attempt, setAttempt] = useState(0),
    [saved, setSaved] = useState(false);
  const messageInvalid = message.length > 160;
  return (
    <>
      <Specimen
        locale={locale}
        title={t('متن چندخطی و شمارش نویسه', 'Textarea & character count')}
        source={`import { useState } from 'react';\nimport { Textarea } from '@avastar/ui/components/textarea';\n\nexport function MessageField() {\n  const [value, setValue] = useState('');\n  const invalid = value.length > 160;\n  return <div>\n    <label htmlFor="message">${t('پیام', 'Message')}</label>\n    <Textarea id="message" className="av-field" value={value}\n      onChange={(event) => setValue(event.target.value)}\n      aria-invalid={invalid} aria-describedby="message-count" />\n    <p id="message-count">{value.length} / 160</p>\n  </div>;\n}`}
      >
        <div className="ds-field-matrix">
          <div>
            <label htmlFor="textarea-live">{t('پیام؛ قابل ویرایش', 'Message; editable')}</label>
            <Textarea
              id="textarea-live"
              className="av-field"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={messageInvalid}
              aria-describedby="textarea-count"
              placeholder={t('پیام خود را بنویسید…', 'Write your message…')}
            />
            <p
              id="textarea-count"
              className={messageInvalid ? 'field-error' : 'field-help'}
              aria-live="polite"
            >
              {new Intl.NumberFormat(locale).format(message.length)} /{' '}
              {new Intl.NumberFormat(locale).format(160)}
              {messageInvalid && t(' — پیام را کوتاه‌تر کنید.', ' — Shorten your message.')}
            </p>
          </div>
          {(['readonly', 'disabled', 'invalid', 'valid'] as const).map((state) => (
            <div key={state}>
              <label htmlFor={`textarea-${state}`}>
                {
                  {
                    readonly: t('فقط خواندنی', 'Read only'),
                    disabled: t('غیرفعال', 'Disabled'),
                    invalid: t('خطای نمونه', 'Invalid example'),
                    valid: t('معتبر', 'Valid'),
                  }[state]
                }
              </label>
              <Textarea
                id={`textarea-${state}`}
                className="av-field"
                data-preview={state}
                readOnly={state === 'readonly'}
                disabled={state === 'disabled'}
                aria-invalid={state === 'invalid'}
                aria-describedby={`textarea-help-${state}`}
                defaultValue={t(
                  'برای رصد آسمان شب آماده‌ام.',
                  'I am ready to observe the night sky.',
                )}
              />
              <p
                id={`textarea-help-${state}`}
                className={
                  state === 'invalid'
                    ? 'field-error'
                    : state === 'valid'
                      ? 'field-success'
                      : 'field-help'
                }
              >
                {state === 'invalid'
                  ? t('نمونهٔ خطا: جزئیات بیشتری وارد کنید.', 'Example error: add more detail.')
                  : state === 'valid'
                    ? t('متن قابل قبول است.', 'The message is valid.')
                    : state === 'readonly'
                      ? t(
                          'می‌توانید متن را انتخاب و کپی کنید.',
                          'You can select and copy this text.',
                        )
                      : t('ویرایش در این حالت ممکن نیست.', 'Editing is unavailable in this state.')}
              </p>
            </div>
          ))}
        </div>
      </Specimen>
      <Specimen
        locale={locale}
        title={t('ورودی عددی با حداقل و حداکثر', 'Number input with limits')}
        source={`import { useState } from 'react';\nimport { NumberField } from '@avastar/ui/number-field';\nexport function GuestCount() {\n  const [value, setValue] = useState(2);\n  return <NumberField label="${t('تعداد همراهان', 'Guests')}" value={value} onValueChange={setValue} min={0} max={6} />;\n}`}
      >
        <NumberField
          label={t('تعداد همراهان', 'Guests')}
          value={count}
          onValueChange={setCount}
          min={0}
          max={6}
        />
        <p className="field-help">
          {t(
            'از صفر تا شش نفر؛ تایپ عدد یا دکمه‌های افزایش و کاهش.',
            'Zero to six guests. Type a number or use the step buttons.',
          )}
        </p>
      </Specimen>
      <Specimen
        locale={locale}
        title={t('خلاصهٔ خطا و بازیابی فرم', 'Error summary & form recovery')}
        source={`import { ErrorSummary } from '@avastar/ui/error-summary';\n\n// Render errors from your validation result.\n<ErrorSummary title="${t('این موارد را اصلاح کنید', 'Check these fields')}"\n  errors={[{ id: 'name', message: '${t('نام را وارد کنید.', 'Enter your name.')}' }]}\n  focusKey={1} />`}
      >
        <form
          className="ds-stack"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const next: FieldError[] = [];
            if (!name.trim())
              next.push({
                id: 'summary-name',
                message: t('نام را وارد کنید.', 'Enter your name.'),
              });
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
              next.push({
                id: 'summary-email',
                message: t('ایمیل کامل وارد کنید.', 'Enter a complete email.'),
              });
            setErrors(next);
            setSaved(!next.length);
            setAttempt((v) => v + 1);
          }}
        >
          <ErrorSummary
            errors={errors}
            title={t('این موارد را اصلاح کنید', 'Check these fields')}
            focusKey={attempt}
          />
          <div className="ds-two-col">
            <div>
              <label htmlFor="summary-name">{t('نام', 'Name')}</label>
              <Input
                id="summary-name"
                className="av-field"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
                aria-invalid={errors.some((e) => e.id === 'summary-name')}
                aria-describedby="summary-name-error"
              />
              <p id="summary-name-error" className="field-error">
                {errors.find((e) => e.id === 'summary-name')?.message}
              </p>
            </div>
            <div>
              <label htmlFor="summary-email">{t('ایمیل', 'Email')}</label>
              <Input
                id="summary-email"
                type="email"
                className="av-field"
                autoComplete="email"
                dir="ltr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSaved(false);
                }}
                aria-invalid={errors.some((e) => e.id === 'summary-email')}
                aria-describedby="summary-email-error"
              />
              <p id="summary-email-error" className="field-error">
                {errors.find((e) => e.id === 'summary-email')?.message}
              </p>
            </div>
          </div>
          <div className="av-actions">
            <Button type="submit" className="av-button av-button--primary">
              {t('بررسی فرم', 'Check form')}
            </Button>
            {saved && (
              <p className="field-success" role="status">
                {t(
                  'هر دو فیلد معتبرند؛ داده‌ای ارسال نشد.',
                  'Both fields are valid. No data was sent.',
                )}
              </p>
            )}
          </div>
        </form>
      </Specimen>
    </>
  );
}
