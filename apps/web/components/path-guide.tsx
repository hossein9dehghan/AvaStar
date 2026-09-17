'use client';
import { copy, guides, planetIds, planets, type Locale, type PlanetId } from '@/lib/avastar';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  Orbit,
  Telescope,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@avastar/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@avastar/ui/components/dialog';
import { RadioGroup, RadioGroupItem } from '@avastar/ui/components/radio-group';
const icons = { learn: BookOpen, explore: Orbit, shop: Telescope, club: Users };
const descriptions = {
  fa: {
    learn: 'می‌خواهم آسمان را بشناسم و نجوم یاد بگیرم.',
    explore: 'می‌خواهم زیر آسمان، رصد را تجربه کنم.',
    shop: 'می‌خواهم ابزار مناسب خودم را انتخاب کنم.',
    club: 'می‌خواهم با علاقه‌مندان نجوم همراه شوم.',
  },
  en: {
    learn: 'Understand the sky and learn astronomy.',
    explore: 'Get outside and experience the night sky.',
    shop: 'Choose equipment that suits my needs.',
    club: 'Meet people who share my curiosity.',
  },
};
const firstGuide = {
  learn: 'starting-astronomy',
  explore: 'first-observing-trip',
  shop: 'choosing-a-telescope',
  club: 'starting-astronomy',
} as const;
export function PathGuide({
  open,
  onOpenChange,
  locale,
  interest,
  onInterestChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  locale: Locale;
  interest: PlanetId | null;
  onInterestChange: (v: PlanetId | null) => void;
}) {
  const fa = locale === 'fa',
    c = copy[locale];
  const [step, setStep] = useState(0),
    [level, setLevel] = useState<string>('');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => heading.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
  }, [step, open]);
  const labels = fa
    ? ['علاقه شما', 'تجربه شما', 'قدم بعدی']
    : ['Your interest', 'Your experience', 'Your next step'];
  const nextArrow = fa ? <ArrowLeft size={18} /> : <ArrowRight size={18} />;
  const id = interest || 'learn',
    intro = level === 'beginner',
    g = guides[firstGuide[id]],
    Icon = icons[id];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="path-guide"
        dir={fa ? 'rtl' : 'ltr'}
        showCloseButton={false}
        onOpenAutoFocus={(e) => {
          setStep(0);
          setLevel('');
          e.preventDefault();
          heading.current?.focus();
        }}
      >
        <DialogClose
          className="av-button av-button--ghost av-button--icon dialog-close"
          aria-label={fa ? 'بستن راهنمای مسیر' : 'Close path guide'}
        >
          <X size={20} />
        </DialogClose>
        <aside className="path-sidebar">
          <div className="compass-mark">
            <Compass size={31} />
          </div>
          <p className="overline">AVASTAR COMPASS</p>
          <h2>{fa ? 'هر کنجکاوی،\nیک مسیر تازه.' : 'Every curiosity.\nA new direction.'}</h2>
          <ol className="path-steps" aria-label={fa ? 'مراحل انتخاب مسیر' : 'Path guide steps'}>
            {labels.map((label, i) => (
              <li
                key={label}
                className={i === step ? 'current' : i < step ? 'complete' : ''}
                aria-current={i === step ? 'step' : undefined}
              >
                <span>{i < step ? <Check size={14} /> : i + 1}</span>
                <strong>{label}</strong>
              </li>
            ))}
          </ol>
          <p className="path-assurance">
            {fa
              ? 'دو انتخاب ساده. بدون نیاز به ثبت‌نام.'
              : 'Two simple choices. No sign-up needed.'}
          </p>
        </aside>
        <div className="path-content">
          <div className="path-step-caption">
            <span>{labels[step]}</span>
            <span>{step + 1} / 3</span>
          </div>
          <DialogTitle ref={heading} tabIndex={-1}>
            {step === 0
              ? fa
                ? 'چه چیزی شما را به آسمان می‌کشاند؟'
                : 'What draws you to the sky?'
              : step === 1
                ? c.level
                : fa
                  ? 'این می‌تواند آغاز مسیر شما باشد.'
                  : 'Here is a place to begin.'}
          </DialogTitle>
          <DialogDescription>
            {step === 0
              ? fa
                ? 'به علاقه امروزتان فکر کنید؛ همیشه می‌توانید مسیر تازه‌ای انتخاب کنید.'
                : 'Choose what interests you today. You can always explore another path.'
              : step === 1
                ? fa
                  ? 'برای پیشنهاد یک قدم مناسب، از تجربه‌تان بگویید.'
                  : 'Tell us where you are starting from so we can suggest a useful next step.'
                : fa
                  ? 'بر اساس علاقه و تجربه‌ای که انتخاب کردید:'
                  : 'Based on your interest and experience:'}
          </DialogDescription>
          {step === 0 ? (
            <RadioGroup
              className="path-options"
              value={interest || ''}
              onValueChange={(v) => onInterestChange(v as PlanetId)}
              dir={fa ? 'rtl' : 'ltr'}
              aria-label={labels[0]}
            >
              {planetIds.map((p) => {
                const ChoiceIcon = icons[p];
                return (
                  <label key={p} className={interest === p ? 'selected' : ''}>
                    <ChoiceIcon size={23} />
                    <span>
                      <strong>{planets[p][locale].name}</strong>
                      <small>{descriptions[locale][p]}</small>
                    </span>
                    <RadioGroupItem value={p} />
                  </label>
                );
              })}
            </RadioGroup>
          ) : step === 1 ? (
            <RadioGroup
              className="path-options experience-options"
              value={level}
              onValueChange={setLevel}
              dir={fa ? 'rtl' : 'ltr'}
              aria-label={labels[1]}
            >
              {['beginner', 'experienced'].map((l, i) => (
                <label key={l} className={level === l ? 'selected' : ''}>
                  <span className="experience-number">0{i + 1}</span>
                  <span>
                    <strong>{i === 0 ? c.beginner : c.experienced}</strong>
                    <small>
                      {i === 0
                        ? fa
                          ? 'کنجکاوم، اما هنوز نمی‌دانم از کجا شروع کنم.'
                          : 'I am curious, but not sure where to start.'
                        : fa
                          ? 'با آسمان آشنایم و به دنبال قدم بعدی هستم.'
                          : 'I know the basics and want to take the next step.'}
                    </small>
                  </span>
                  <RadioGroupItem value={l} />
                </label>
              ))}
            </RadioGroup>
          ) : (
            <div className="path-recommendation">
              <div className="recommendation-meta">
                <span>
                  <Icon size={17} />
                  {planets[id][locale].name}
                </span>
                <span>{intro ? c.beginner : c.experienced}</span>
              </div>
              <div className="recommendation-icon">
                <Icon size={29} />
              </div>
              <h3>{intro ? g.title[locale] : planets[id][locale].title.replace('\n', ' ')}</h3>
              <p>
                {intro
                  ? g.description[locale]
                  : fa
                    ? 'مسیر ' +
                      planets[id][locale].name +
                      ' را مرور کنید و برای انتخاب متناسب با تجربه‌تان درخواست راهنمایی بدهید.'
                    : 'Explore the ' +
                      planets[id][locale].name.toLowerCase() +
                      ' path and request guidance suited to your experience.'}
              </p>
              <a
                className="av-button av-button--primary primary-button inline-button"
                href={`/${locale}/${intro ? firstGuide[id] : id}`}
              >
                {intro ? c.read : c.details}
                {fa ? <ArrowUpLeft size={18} /> : <ArrowUpRight size={18} />}
              </a>
              {intro && (
                <a className="recommendation-secondary" href={`/${locale}/${id}`}>
                  {fa
                    ? 'آشنایی با مسیر ' + planets[id][locale].name
                    : 'Explore ' + planets[id][locale].name}
                  {nextArrow}
                </a>
              )}
            </div>
          )}
          <div className="path-bottom">
            <span>
              {step === 0 ? (
                c.noAccount
              ) : (
                <button className="path-back" onClick={() => setStep((s) => s - 1)}>
                  {fa ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {c.back}
                </button>
              )}
            </span>
            {step < 2 ? (
              <Button
                className="av-button av-button--primary primary-button"
                disabled={step === 0 ? !interest : !level}
                onClick={() => setStep((s) => s + 1)}
              >
                {step === 1 ? (fa ? 'دیدن پیشنهاد من' : 'See my suggestion') : c.next}
                {nextArrow}
              </Button>
            ) : (
              <button
                className="path-reset"
                onClick={() => {
                  setStep(0);
                  onInterestChange(null);
                  setLevel('');
                }}
              >
                {c.newPath}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
