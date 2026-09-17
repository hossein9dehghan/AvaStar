'use client';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { MaterialSurface } from '@avastar/ui/material-surface';
import { chapterContent } from '@/lib/chapter-content';
import type { Locale, PlanetId } from '@/lib/avastar';
export function ChapterExperience({
  id,
  locale,
  value,
  onChange,
  onRotate,
  onReset,
}: {
  id: PlanetId;
  locale: Locale;
  value: number;
  onChange: (value: number) => void;
  onRotate: (delta: number) => void;
  onReset: () => void;
}) {
  const items = chapterContent(id, locale),
    fa = locale === 'fa';
  return (
    <div className="chapter-experience">
      <MaterialSurface
        className="chapter-options"
        material="light"
        role="group"
        aria-label={fa ? 'انتخاب موضوع' : 'Choose a topic'}
      >
        {items.map(([label], i) => (
          <button
            key={label}
            aria-pressed={i === value}
            aria-controls={`${id}-insight`}
            onClick={() => onChange(i)}
          >
            {label}
          </button>
        ))}
      </MaterialSurface>
      <div id={`${id}-insight`} className="chapter-insight" aria-live="polite" aria-atomic="true">
        <strong>{items[value][1]}</strong>
        <p>{items[value][2]}</p>
      </div>
      <div
        className="chapter-view-controls"
        role="group"
        aria-label={fa ? 'چرخش صحنه' : 'Scene rotation'}
      >
        <span>{fa ? 'زاویهٔ دید' : 'VIEWPOINT'}</span>
        <button aria-label={fa ? 'چرخش به چپ' : 'Rotate left'} onClick={() => onRotate(-0.22)}>
          <ArrowLeft size={15} />
        </button>
        <button aria-label={fa ? 'بازنشانی زاویه' : 'Reset angle'} onClick={onReset}>
          <RotateCcw size={14} />
        </button>
        <button aria-label={fa ? 'چرخش به راست' : 'Rotate right'} onClick={() => onRotate(0.22)}>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
