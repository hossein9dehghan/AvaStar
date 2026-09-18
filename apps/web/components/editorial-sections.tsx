'use client';
import { useState } from 'react';
import { Button } from '@avastar/ui/components/button';
import type { Locale } from '@/lib/avastar';
export const partnerOptions = {
  fa: [
    ['school', 'مدرسه', 'برای دانش‌آموزان، یک تجربهٔ علمی متناسب با سن و فضای آموزشی طراحی کنیم.'],
    ['organization', 'سازمان', 'برای تیم یا مجموعهٔ شما، یک برنامهٔ رصد و یادگیری مشترک شکل دهیم.'],
    ['partner', 'مجموعهٔ همکار', 'دربارهٔ همکاری آموزشی، خدمات رصد یا تجهیزات گفت‌وگو کنیم.'],
  ],
  en: [
    [
      'school',
      'School',
      'Shape a science experience around your students, their ages and learning environment.',
    ],
    [
      'organization',
      'Organization',
      'Create a shared observing and learning experience for your team.',
    ],
    [
      'partner',
      'Partner',
      'Discuss a collaboration in education, observing services or equipment.',
    ],
  ],
} as const;
export function PartnerAudience({
  locale,
  value,
  onChange,
}: {
  locale: Locale;
  value: string;
  onChange: (value: string) => void;
}) {
  const items = partnerOptions[locale],
    current = items.find((x) => x[0] === value) || items[0];
  return (
    <div className="partner-audience">
      <div
        className="partner-choice"
        role="group"
        aria-label={locale === 'fa' ? 'نوع مجموعه' : 'Organization type'}
      >
        {items.map(([id, label], i) => (
          <Button
            variant="ghost"
            className="av-choice-button"
            key={id}
            aria-pressed={id === value}
            onClick={() => onChange(id)}
          >
            <small>0{i + 1}</small>
            {label}
            <span aria-hidden="true">↗</span>
          </Button>
        ))}
      </div>
      <p className="partner-description" aria-live="polite">
        {current[2]}
      </p>
    </div>
  );
}
export function AboutJourney({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0),
    fa = locale === 'fa';
  const items = fa
    ? [
        [
          'یادگیری',
          'از یک سؤال شروع کنید',
          'مسیر را از سطح تجربه و علاقهٔ خودتان آغاز کنید؛ هر قدم، زمینهٔ کشف بعدی است.',
        ],
        [
          'تجربه',
          'دانسته‌ها را ببینید',
          'شناخت آسمان را به یک شب رصد، یک گفت‌وگو و تجربه‌ای مشترک پیوند بزنید.',
        ],
        [
          'همراهی',
          'مسیر را ادامه دهید',
          'با انتخاب آگاهانهٔ ابزار و ارتباط با دیگر علاقه‌مندان، کنجکاوی را زنده نگه دارید.',
        ],
      ]
    : [
        [
          'Learn',
          'Begin with a question',
          'Start with your experience and interests. Each step makes room for the next discovery.',
        ],
        [
          'Experience',
          'See what you have learned',
          'Connect your understanding to an observing night, a conversation and a shared experience.',
        ],
        [
          'Stay connected',
          'Keep the journey going',
          'Thoughtful equipment choices and a curious community help your interest grow.',
        ],
      ];
  return (
    <div className="about-journey">
      <div role="group" aria-label={fa ? 'مسیر آوا استار' : 'The Avastar journey'}>
        {items.map(([label], i) => (
          <Button
            variant="ghost"
            className="av-choice-button"
            key={label}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
          >
            <small>0{i + 1}</small>
            {label}
          </Button>
        ))}
      </div>
      <div className="about-journey-copy" aria-live="polite">
        <strong>{items[active][1]}</strong>
        <p>{items[active][2]}</p>
      </div>
    </div>
  );
}
export function JournalArtwork({ index }: { index: number }) {
  return (
    <div className={`editorial-art editorial-art-${index}`} aria-hidden="true">
      {index === 0 ? (
        <>
          <img src="/art/glacial.webp" alt="" width="1254" height="1254" loading="lazy" />
          <div className="editorial-grid" />
        </>
      ) : index === 1 ? (
        <div className="editorial-optic">
          <i />
          <i />
          <i />
        </div>
      ) : (
        <>
          <img src="/art/annulus.webp" alt="" width="1254" height="1254" loading="lazy" />
          <div className="editorial-horizon" />
        </>
      )}
      <span>FIELD NOTES / 0{index + 1}</span>
    </div>
  );
}
