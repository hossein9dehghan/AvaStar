'use client';
import { Check, LoaderCircle } from 'lucide-react';
import { Button } from '@avastar/ui/components/button';
import { Input } from '@avastar/ui/components/input';
import { translate, type Locale } from '@/lib/site';
export function ButtonStates({ locale }: { locale: Locale }) {
  const t = translate(locale);
  const states = [
    ['default', t('عادی', 'Default')],
    ['hover', t('اشاره‌گر', 'Hover')],
    ['pressed', t('فشرده', 'Pressed')],
    ['focus', t('فوکوس', 'Focus')],
    ['disabled', t('غیرفعال', 'Disabled')],
    ['loading', t('بارگذاری', 'Loading')],
    ['success', t('موفق', 'Success')],
  ];
  return (
    <div className="ds-state-matrix">
      {['primary', 'secondary', 'ghost', 'danger'].map((variant) => (
        <div className="ds-state-matrix-row" key={variant}>
          <code>{variant}</code>
          {states.map(([state, label]) => (
            <div className="ds-state-cell" key={state}>
              <Button
                className={`av-button av-button--${variant} av-button--sm`}
                data-preview={state}
                disabled={state === 'disabled' || state === 'loading'}
                aria-busy={state === 'loading'}
                aria-label={`${variant} · ${label}`}
                onClick={(e) => e.currentTarget.focus()}
              >
                {state === 'loading' ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : state === 'success' ? (
                  <Check size={16} />
                ) : null}
                {state === 'success' ? t('انجام شد', 'Done') : t('ادامه', 'Continue')}
              </Button>
              <span>{label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
export function FieldStates({ locale }: { locale: Locale }) {
  const t = translate(locale);
  return (
    <div className="ds-field-matrix">
      {['empty', 'filled', 'hover', 'focus', 'readonly', 'disabled', 'invalid', 'valid'].map(
        (state) => (
          <div key={state}>
            <label htmlFor={`field-state-${state}`}>
              {
                (
                  {
                    empty: t('خالی', 'Empty'),
                    filled: t('تکمیل‌شده', 'Filled'),
                    hover: t('اشاره‌گر', 'Hover'),
                    focus: t('فوکوس', 'Focus'),
                    readonly: t('فقط خواندنی', 'Read only'),
                    disabled: t('غیرفعال', 'Disabled'),
                    invalid: t('خطا', 'Invalid'),
                    valid: t('معتبر', 'Valid'),
                  } as Record<string, string>
                )[state]
              }
            </label>
            <Input
              id={`field-state-${state}`}
              className="av-field"
              data-preview={state}
              aria-invalid={state === 'invalid'}
              aria-describedby={`field-hint-${state}`}
              placeholder="sky@example.com"
              defaultValue={
                state === 'empty' ? '' : state === 'invalid' ? 'sky@' : 'sky@example.com'
              }
              dir="ltr"
              disabled={state === 'disabled'}
              readOnly={state === 'readonly'}
            />
            <p
              id={`field-hint-${state}`}
              className={
                state === 'invalid'
                  ? 'field-error'
                  : state === 'valid'
                    ? 'field-success'
                    : 'field-help'
              }
            >
              {state === 'invalid'
                ? t('ایمیل کامل وارد کنید.', 'Enter a complete email.')
                : state === 'valid'
                  ? t('ایمیل معتبر است.', 'Email is valid.')
                  : state === 'readonly'
                    ? t('قابل انتخاب و کپی است.', 'Can be selected and copied.')
                    : t('نمونهٔ قابل آزمایش', 'Interactive example')}
            </p>
          </div>
        ),
      )}
    </div>
  );
}
