'use client';
import { useId } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Input } from '@avastar/ui/components/input';
import { Button } from '@avastar/ui/components/button';
import { useUiLocale } from './locale-provider';
export function NumberField({
  label,
  value,
  onValueChange,
  min = 0,
  max = 99,
  step = 1,
  disabled = false,
}: {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  const id = useId(),
    locale = useUiLocale();
  const change = (next: number) => onValueChange(Math.min(max, Math.max(min, next)));
  return (
    <div className="av-number-field">
      <label htmlFor={id}>{label}</label>
      <div className="av-number-controls" dir="ltr">
        <Button
          type="button"
          className="av-button av-button--secondary av-button--icon"
          disabled={disabled || value <= min}
          aria-label={`${locale === 'fa' ? 'کاهش' : 'Decrease'} ${label}`}
          onClick={() => change(value - step)}
        >
          <Minus size={18} />
        </Button>
        <Input
          className="av-field"
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(event) => {
            if (event.target.value !== '') change(Number(event.target.value));
          }}
        />
        <Button
          type="button"
          className="av-button av-button--secondary av-button--icon"
          disabled={disabled || value >= max}
          aria-label={`${locale === 'fa' ? 'افزایش' : 'Increase'} ${label}`}
          onClick={() => change(value + step)}
        >
          <Plus size={18} />
        </Button>
      </div>
    </div>
  );
}
