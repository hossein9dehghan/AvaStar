'use client';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { MaterialSurface } from '@avastar/ui/material-surface';
import { Button } from '@avastar/ui/components/button';
import { chapterContent } from '@/lib/chapter-content';
import type { Locale, PlanetId } from '@/lib/avastar';
export function ChapterExperience({
  id,
  locale,
  value,
  rotatable = true,
  onChange,
  onRotate,
  onReset,
}: {
  id: PlanetId;
  locale: Locale;
  value: number;
  rotatable?: boolean;
  onChange: (value: number) => void;
  onRotate: (delta: number) => void;
  onReset: () => void;
}) {
  const items = chapterContent(id, locale),
    fa = locale === 'fa';
  return (
    <div className="chapter-experience">
      <MaterialSurface
        className="chapter-options av-choice-group"
        material="light"
        role="group"
        aria-label={fa ? 'انتخاب موضوع' : 'Choose a topic'}
      >
        {items.map(([label], i) => (
          <Button
            key={label}
            variant="ghost"
            className="av-choice-button"
            aria-pressed={i === value}
            aria-controls={`${id}-insight`}
            onClick={() => onChange(i)}
          >
            {label}
          </Button>
        ))}
      </MaterialSurface>
      <div id={`${id}-insight`} className="chapter-insight" aria-live="polite" aria-atomic="true">
        <strong>{items[value][1]}</strong>
        <p>{items[value][2]}</p>
      </div>
      {rotatable ? (
        <div
          className="chapter-view-controls"
          role="group"
          aria-label={fa ? 'چرخش سیاره' : 'Planet rotation'}
        >
          <span>{fa ? 'زاویهٔ دید' : 'VIEWPOINT'}</span>
          <Button
            variant="ghost"
            className="av-button av-button--ghost av-button--icon"
            aria-label={fa ? 'چرخش به چپ' : 'Rotate left'}
            onClick={() => onRotate(-0.22)}
          >
            <ArrowLeft size={15} />
          </Button>
          <Button
            variant="ghost"
            className="av-button av-button--ghost av-button--icon"
            aria-label={fa ? 'بازنشانی زاویه' : 'Reset angle'}
            onClick={onReset}
          >
            <RotateCcw size={14} />
          </Button>
          <Button
            variant="ghost"
            className="av-button av-button--ghost av-button--icon"
            aria-label={fa ? 'چرخش به راست' : 'Rotate right'}
            onClick={() => onRotate(0.22)}
          >
            <ArrowRight size={15} />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
