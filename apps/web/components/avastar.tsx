'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@avastar/ui/components/accordion';
import { Button } from '@avastar/ui/components/button';
import { Checkbox } from '@avastar/ui/components/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@avastar/ui/components/dialog';
import { copy, guides, planetIds, planets, type Locale, type PlanetId } from '@/lib/avastar';
import { planetArt } from '@/lib/planet-art';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  LoaderCircle,
  Menu,
  Moon,
  Mouse,
  MoveUpRight,
  Orbit,
  Pause,
  Play,
  Sun,
  Telescope,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { COSMIC_STAGE_MAX } from '@/lib/cosmic-layout';
import { useBrowserPreferences } from './use-browser-preferences';
import { PathGuide } from './path-guide';
import { ErrorSummary, type FieldError } from '@avastar/ui/error-summary';
import { LanguageSwitch } from '@avastar/ui/language-switch';
import { CosmicBackdrop } from './cosmic-backdrop';
import { InteractiveObservatory } from './interactive-observatory';
import { usePlanetDrag } from './use-planet-drag';
import { OrbitCursor } from './orbit-cursor';
import { SiteFooter } from './site-footer';
import { stops, useDepthJourney } from './use-depth-journey';
const icons = { learn: BookOpen, explore: Orbit, shop: Telescope, club: Users };
const faqContent = {
  fa: [
    [
      'برای شروع نجوم به تلسکوپ نیاز دارم؟',
      'برای شروع یادگیری لازم نیست فوراً ابزار بخرید. می‌توانید با شناخت آسمان و یک تجربه رصد گروهی شروع کنید و بعد با توجه به علاقه و شرایطتان ابزار انتخاب کنید.',
    ],
    [
      'کدام مسیر برای من مناسب‌تر است؟',
      'اگر تازه شروع کرده‌اید، مسیر آموزش نقطه آغاز خوبی است. برای تجربه آسمان، کاوش را انتخاب کنید؛ برای انتخاب ابزار به تجهیزات بروید و برای همراهی با دیگر علاقه‌مندان، کالب را بشناسید.',
    ],
    [
      'تاریخ و شرایط دوره‌ها و گشت‌ها را کجا ببینم؟',
      'جزئیات هر برنامه پس از نهایی‌شدن در مسیر مرتبط منتشر می‌شود. برای راهنمایی اولیه می‌توانید علاقه و درخواست خود را از طریق فرم همین سایت ثبت کنید.',
    ],
    [
      'برای مدرسه یا سازمان هم امکان همکاری وجود دارد؟',
      'برنامه‌های مدارس و سازمان‌ها بخشی از مسیر همکاری آوا استار هستند. نوع مجموعه و نیاز خود را در فرم همکاری بنویسید؛ جزئیات اجرا پس از بررسی مشخص می‌شود.',
    ],
  ],
  en: [
    [
      'Do I need a telescope to begin?',
      'You do not need to buy equipment to start learning. Begin by getting to know the sky or joining a group observing experience, then choose equipment based on your interests and circumstances.',
    ],
    [
      'Which path is right for me?',
      'Learning is a useful starting point for beginners. Explore is for observing experiences, Equipment helps with tools, and the Club connects you with the wider community.',
    ],
    [
      'Where can I find course and trip dates?',
      'Confirmed details will be published in the relevant path. For initial guidance, use the request form to tell us about your interests.',
    ],
    [
      'Can schools and organizations get involved?',
      'School and organizational programs are part of the Avastar partnership path. Tell us about your organization and needs in the partnership form; arrangements depend on a review.',
    ],
  ],
};

export default function Avastar({ locale, slug }: { locale: Locale; slug?: string }) {
  const c = copy[locale],
    fa = locale === 'fa';
  const home = !slug;
  const { theme, reduced, mounted, changeTheme, changeMotion } = useBrowserPreferences(home);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const { rootRef, flight, station, progress, jump } = useDepthJourney(home && mounted, reduced);
  const active = station >= 1 && station <= 4 ? station - 1 : -1;
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetId | null>(null);
  const [planet, setPlanet] = useState<PlanetId | null>(null),
    [guide, setGuide] = useState(false),
    [request, setRequest] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [validationAttempt, setValidationAttempt] = useState(0);
  const [interest, setInterest] = useState<PlanetId | null>(null);
  const planetDrag = usePlanetDrag();
  const planetTargets = useRef<(HTMLButtonElement | null)[]>([]);
  const lastFocus = useRef<HTMLElement | null>(null);
  const requestId = useRef<string>('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle'),
    [reference, setReference] = useState(''),
    [consent, setConsent] = useState(false);
  const homeUrl = `/${locale}`;
  const arrow = fa ? <ArrowUpLeft size={19} /> : <ArrowUpRight size={19} />;
  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = fa ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = theme;
  }, [locale, fa, theme]);
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  }, [reduced]);
  function showPlanet(id: PlanetId) {
    lastFocus.current = document.activeElement as HTMLElement;
    history.replaceState(
      { ...history.state, avastarDepth: flight.current.position },
      '',
      location.href,
    );
    setPlanet(id);
    history.pushState({ avastarPlanet: true }, '', `#planet-${id}`);
  }
  useEffect(() => {
    const pop = () => {
      const id = location.hash.replace('#planet-', '') as PlanetId;
      setPlanet(planetIds.includes(id) ? id : null);
    };
    pop();
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  function closePlanet() {
    setPlanet(null);
    if (history.state?.avastarPlanet) history.back();
    else if (location.hash.startsWith('#planet-'))
      history.replaceState(null, '', location.pathname);
    requestAnimationFrame(() => lastFocus.current?.focus());
  }
  function openRequest(type: string) {
    lastFocus.current = document.activeElement as HTMLElement;
    setRequest(type);
    setStatus('idle');
    setFieldErrors([]);
    setValidationAttempt(0);
    setReference('');
    setConsent(false);
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    requestId.current = [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join('-');
  }
  function openGuide() {
    lastFocus.current = document.activeElement as HTMLElement;
    setInterest(null);
    setGuide(true);
  }
  async function submitRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent || status === 'saving') return;
    const form = new FormData(e.currentTarget);
    const checks = [
      {
        key: 'name',
        minimum: 2,
        message: fa
          ? 'نام را با حداقل ۲ نویسه وارد کنید.'
          : 'Enter your name using at least 2 characters.',
      },
      {
        key: 'contact',
        minimum: 6,
        message: fa
          ? 'راه تماس را با حداقل ۶ نویسه وارد کنید.'
          : 'Enter a contact address using at least 6 characters.',
      },
      {
        key: 'message',
        minimum: 10,
        message: fa
          ? 'پیامتان را با حداقل ۱۰ نویسه بنویسید.'
          : 'Write a message using at least 10 characters.',
      },
    ];
    const errors = checks
      .filter(({ key, minimum }) => String(form.get(key) || '').trim().length < minimum)
      .map(({ key, message }) => ({ id: `request-${key}`, message }));
    setFieldErrors(errors);
    setValidationAttempt((value) => value + 1);
    if (errors.length) return;
    setStatus('saving');
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          contact: form.get('contact'),
          message: form.get('message'),
          website: form.get('website'),
          kind: request,
          locale,
          consent: true,
          id: requestId.current,
        }),
      });
      if (!res.ok) throw Error();
      const data = (await res.json()) as { reference?: string };
      if (!data.reference) throw Error();
      setReference(data.reference);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }
  useEffect(() => {
    const ctx = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: Record<string, unknown>,
            options: { signal: AbortSignal },
          ) => unknown;
        };
      }
    ).modelContext;
    if (!ctx?.registerTool) return;
    const life = new AbortController();
    Promise.resolve(
      ctx.registerTool(
        {
          name: 'start_avastar_path_guide',
          title: 'Start astronomy path guide',
          description:
            'Open the astronomy path guide and select an interest. Does not create an account or submit a request.',
          inputSchema: {
            type: 'object',
            properties: { interest: { type: 'string', enum: planetIds } },
            required: ['interest'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false },
          execute: async (input: unknown) => {
            const interest =
              typeof input === 'object' && input !== null && 'interest' in input
                ? input.interest
                : null;
            if (typeof interest !== 'string' || !planetIds.includes(interest as PlanetId))
              throw Error('Invalid interest');
            setInterest(interest as PlanetId);
            setGuide(true);
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
            return { opened: true, interest };
          },
        },
        { signal: life.signal },
      ),
    ).catch(() => {});
    return () => life.abort();
  }, []);
  const linkTo = (id: string) => (home ? `#${id}` : `${homeUrl}#${id}`);
  const detailPlanet = slug && planetIds.includes(slug as PlanetId) ? (slug as PlanetId) : null;
  const article = slug && slug in guides ? guides[slug as keyof typeof guides] : null;
  const stationNames = [
    fa ? 'آغاز سفر' : 'Departure',
    ...planetIds.map((id) => planets[id][locale].name),
    c.journal,
    c.about,
    c.cooperation,
    c.faq,
    fa ? 'ارتباط با آوا استار' : 'Connect with Avastar',
  ];
  const orbitalLabel = stationNames[station];

  return (
    <div
      ref={rootRef}
      style={{ '--cosmic-stage-max': `${COSMIC_STAGE_MAX}px` } as CSSProperties}
      className={`avastar ${!home ? 'inner-page' : ''} ${home && mounted ? 'depth-mode' : ''} ${reduced ? 'reduced-motion' : ''} ${planet ? 'planet-is-open' : ''}`}
      dir={fa ? 'rtl' : 'ltr'}
      lang={locale}
    >
      <a className="skip-link" href="#main">
        {fa ? 'رفتن به محتوا' : 'Skip to content'}
      </a>
      <header className="site-header">
        <a href={homeUrl} className="brand" aria-label={fa ? 'خانه آوا استار' : 'Avastar home'}>
          <img
            className="brand-dark"
            src={`/brand/logo-lockup-${locale}-mono.png`}
            width="138"
            height="43"
            alt={fa ? 'آوا استار' : 'Avastar'}
          />
          <img
            className="brand-light"
            src={`/brand/logo-lockup-${locale}.png`}
            width="138"
            height="43"
            alt={fa ? 'آوا استار' : 'Avastar'}
          />
        </a>
        <nav className="desktop-nav" aria-label={fa ? 'ناوبری اصلی' : 'Main navigation'}>
          {planetIds.map((id) => (
            <a
              key={id}
              href={linkTo(id)}
              className={home && active === planetIds.indexOf(id) ? 'nav-active' : undefined}
              aria-current={home && active === planetIds.indexOf(id) ? 'location' : undefined}
            >
              {planets[id][locale].name}
            </a>
          ))}
          <span className="nav-divider" />
          <a href={linkTo('journal')}>{c.journal}</a>
          <a href={linkTo('about')}>{c.about}</a>
        </nav>
        <div className="header-actions">
          <LanguageSwitch
            locale={locale}
            href={`/${fa ? 'en' : 'fa'}${slug ? `/${slug}` : home && station ? `#${stops[station]}` : ''}`}
          />
          {!home && (
            <button
              className="icon-button theme-control"
              onClick={changeTheme}
              aria-label={theme === 'dark' ? c.light : c.dark}
              title={theme === 'dark' ? c.light : c.dark}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <Button
            className="av-button av-button--secondary av-button--sm header-cta"
            variant="outline"
            onClick={openGuide}
          >
            {c.journey}
            <MoveUpRight size={15} />
          </Button>
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenu(true)}
            aria-label={fa ? 'بازکردن منو' : 'Open navigation'}
          >
            <Menu />
          </button>
        </div>
      </header>
      {home && (
        <>
          <OrbitCursor
            enabled={mounted && !hidden && !planet && !guide && !request && !menu}
            reduced={reduced}
          />
          <div className="cosmos" aria-hidden="true">
            <CosmicBackdrop
              locale={locale}
              targets={planetTargets}
              rotations={planetDrag.rotations}
              flight={flight}
              reduced={reduced}
              paused={hidden || !!planet || guide || !!request || menu}
              selected={planet}
              hovered={hoveredPlanet}
            />
          </div>
          <div
            className="cosmic-targets"
            inert={!!planet || guide || !!request || menu}
            aria-label={fa ? 'سیاره‌های قابل کاوش' : 'Explore the planets'}
          >
            {planetIds.map((id, index) => {
              const step = index + 1;
              return (
                <button
                  key={step}
                  type="button"
                  hidden
                  className="cosmic-planet-target"
                  ref={(node) => {
                    planetTargets.current[step] = node;
                  }}
                  {...planetDrag.bind(step)}
                  title={
                    fa
                      ? 'برای چرخش درگ کنید؛ برای جزئیات کلیک کنید'
                      : 'Drag to rotate; click for details'
                  }
                  onPointerEnter={() => setHoveredPlanet(id)}
                  onPointerLeave={() => setHoveredPlanet(null)}
                  onFocus={() => setHoveredPlanet(id)}
                  onBlur={() => setHoveredPlanet(null)}
                  onClick={(event) => {
                    if (!planetDrag.consumeClick(step, event.detail)) showPlanet(id);
                  }}
                  aria-label={
                    fa
                      ? `کشف سیاره ${planets[id].fa.name}`
                      : `Open the ${planets[id].en.name} planet`
                  }
                >
                  <span className="cosmic-target-caption">
                    {fa ? 'کاوش این سیاره' : 'Explore this planet'}{' '}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>
          <div className="atmosphere" aria-hidden="true" />
          <aside
            className="journey-side"
            aria-label={fa ? 'موقعیت در منظومه' : 'Your position in the universe'}
          >
            <span className="side-caption">{fa ? 'منظومه آوا استار' : 'AVASTAR UNIVERSE'}</span>
            <a
              href="#main"
              className={station === 0 ? 'current' : ''}
              aria-label={fa ? 'آغاز سفر' : 'Start'}
            >
              <span />
            </a>
            {planetIds.map((id, i) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === i ? 'current' : ''}
                aria-label={planets[id][locale].name}
              >
                <span />
              </a>
            ))}
            <span className="vertical-line" />
          </aside>
        </>
      )}
      <main id="main" className={home ? 'depth-main' : undefined}>
        {home ? (
          <>
            <section className="hero depth-panel" data-depth-stop="0">
              <InteractiveObservatory
                locale={locale}
                flight={flight}
                reduced={reduced}
                paused={hidden || !!planet || guide || !!request || menu}
                onExplore={jump}
              />
              <div className="hero-copy">
                <p className="eyebrow">
                  <span className="tiny-orbit" />
                  {c.welcome}
                </p>
                <h1>
                  {c.hero1}
                  <br />
                  <em>{c.hero2}</em>
                </h1>
                <p className="hero-description">{c.heroDescription}</p>
                <div className="hero-actions">
                  <Button
                    className="av-button av-button--primary primary-button"
                    onClick={openGuide}
                  >
                    {c.start}
                    {arrow}
                  </Button>
                  <a className="quiet-link" href="#learn">
                    {c.discover}
                    <ArrowDown size={17} />
                  </a>
                </div>
                <div className="hero-note">
                  <span className="note-rule" />
                  {fa ? 'یاد بگیرید. تجربه کنید. کشف کنید.' : 'LEARN. EXPERIENCE. DISCOVER.'}
                </div>
              </div>
              <div className="hero-bottom">
                <div className="scroll-cue">
                  <Mouse size={21} />
                  <span>{c.scroll}</span>
                  <ArrowDown size={15} />
                </div>
                <span className="coordinates" dir="ltr">
                  AVASTAR <span>/</span> ASTRONOMY ECOSYSTEM
                </span>
                <span className="journey-count" dir="ltr">
                  01 <span>/ 05</span>
                </span>
              </div>
            </section>
            <div className="orbit-nav">
              <div>
                <span className="overline">{fa ? 'مسیرت را انتخاب کن' : 'CHOOSE YOUR ORBIT'}</span>
                <p>{c.universe}</p>
              </div>
              <div className="orbit-links">
                {planetIds.map((id) => {
                  const Icon = icons[id];
                  return (
                    <a key={id} href={`#${id}`}>
                      <span className="orbit-number">{planets[id].number}</span>
                      <Icon size={20} />
                      <span>{planets[id][locale].name}</span>
                      {arrow}
                    </a>
                  );
                })}
              </div>
            </div>
            {planetIds.map((id, i) => {
              const p = planets[id],
                t = p[locale];
              const Icon = icons[id];
              return (
                <section
                  className={`planet-section depth-panel planet-${id} ${i % 2 ? 'alternate' : ''}`}
                  data-depth-stop={i + 1}
                  id={id}
                  key={id}
                  style={{ '--planet-color': p.color } as React.CSSProperties}
                >
                  <div className="planet-copy">
                    <div className="planet-kicker">
                      <span>{p.number}</span>
                      <span className="short-rule" />
                      <Icon size={18} />
                      {t.name}
                    </div>
                    <p className="eyebrow">{t.eyebrow}</p>
                    <h2>{t.title}</h2>
                    <p className="section-description">{t.description}</p>
                    <div className="feature-chips">
                      {t.features.map((f) => (
                        <span key={f}>{f}</span>
                      ))}
                    </div>
                    <Button
                      className="av-button av-button--secondary planet-button"
                      variant="outline"
                      onClick={() => showPlanet(id)}
                    >
                      {t.cta}
                      {arrow}
                    </Button>
                    <a className="text-link" href={`/${locale}/${id}`}>
                      {c.details}
                      <span>↗</span>
                    </a>
                  </div>
                </section>
              );
            })}
            <section
              className="journal-section content-section depth-panel"
              data-depth-stop="5"
              id="journal"
            >
              <div className="section-heading">
                <div>
                  <p className="eyebrow">
                    {fa ? 'یادداشت‌هایی برای کنجکاوی' : 'NOTES FOR THE CURIOUS'}
                  </p>
                  <h2>{c.journalTitle}</h2>
                </div>
                <p>{c.journalSub}</p>
              </div>
              <div className="journal-grid">
                {Object.entries(guides).map(([key, g], i) => (
                  <a className="journal-card" href={`/${locale}/${key}`} key={key}>
                    <div className={`journal-art journal-art-${i}`}>
                      <img
                        src={planetArt[g.planet]}
                        alt=""
                        width="1254"
                        height="1254"
                        loading="lazy"
                      />
                      <span className="article-number" dir="ltr">
                        FIELD NOTES / 0{i + 1}
                      </span>
                    </div>
                    <div className="journal-card-body">
                      <span className="overline">{g.category[locale]}</span>
                      <h3>{g.title[locale]}</h3>
                      <p>{g.description[locale]}</p>
                      <span className="article-link">
                        {c.read}
                        {arrow}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
            <section
              className="about-section content-section depth-panel"
              data-depth-stop="6"
              id="about"
            >
              <div className="about-symbol">
                <img src="/brand/logo-mark.png" alt="" width="160" height="160" loading="lazy" />
                <span dir="ltr">
                  ONE UNIVERSE.
                  <br />
                  YOUR OWN PATH.
                </span>
              </div>
              <div>
                <p className="eyebrow">{fa ? 'درباره آوا استار' : 'ABOUT AVASTAR'}</p>
                <h2>{c.aboutTitle}</h2>
                <p>{c.aboutText}</p>
                <div className="values">
                  <span>{fa ? 'یادگیری ساده' : 'Accessible learning'}</span>
                  <span>{fa ? 'انتخاب آگاهانه' : 'Informed choices'}</span>
                  <span>{fa ? 'همراهی ماندگار' : 'Lasting connection'}</span>
                </div>
              </div>
            </section>
            <section
              className="partnership content-section depth-panel"
              data-depth-stop="7"
              id="partners"
            >
              <div>
                <p className="eyebrow">{fa ? 'افق‌های مشترک' : 'SHARED HORIZONS'}</p>
                <h2>{c.partners}</h2>
                <p>{c.partnersText}</p>
              </div>
              <Button
                variant="outline"
                className="av-button av-button--secondary planet-button"
                onClick={() => openRequest('partners')}
              >
                {c.partnerCta}
                {arrow}
              </Button>
            </section>
            <section
              className="faq-section content-section depth-panel"
              data-depth-stop="8"
              id="faq"
            >
              <div>
                <p className="eyebrow">FAQ</p>
                <h2>{c.faq}</h2>
                <p>
                  {fa ? 'چند پاسخ برای اولین سؤال‌ها.' : 'A few answers to your first questions.'}
                </p>
                <Button
                  variant="outline"
                  className="av-button av-button--secondary planet-button"
                  onClick={() => openRequest('general')}
                >
                  {c.consult}
                  {arrow}
                </Button>
              </div>
              <Accordion type="single" collapsible className="faq-list">
                {faqContent[locale].map(([q, a], i) => (
                  <AccordionItem key={i} value={String(i)}>
                    <AccordionTrigger>{q}</AccordionTrigger>
                    <AccordionContent>{a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </>
        ) : detailPlanet ? (
          <section className="detail-page content-section">
            <a className="back-link" href={`${homeUrl}#${detailPlanet}`}>
              {fa ? <ArrowRight size={18} /> : <ArrowLeft size={18} />} {c.close}
            </a>
            <div className="detail-hero">
              <div>
                <p className="eyebrow">AVASTAR / {detailPlanet.toUpperCase()}</p>
                <h1>{planets[detailPlanet][locale].title}</h1>
                <p>{planets[detailPlanet][locale].detail}</p>
                <Button
                  className="av-button av-button--primary primary-button"
                  onClick={() => openRequest(detailPlanet)}
                >
                  {c.consult}
                  {arrow}
                </Button>
              </div>
              <img
                src={planetArt[detailPlanet]}
                alt={fa ? 'سیاره خیالی آوا استار' : 'An imagined Avastar world'}
                width="600"
                height="600"
                className={`static-${detailPlanet}`}
              />
            </div>
            <div className="detail-items">
              {planets[detailPlanet][locale].items.map(([title, desc], i) => (
                <article key={title}>
                  <span className="overline">0{i + 1}</span>
                  <h2>{title}</h2>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
            <p className="availability-note">{planets[detailPlanet][locale].note}</p>
            <div className="related-guide">
              <h2>{fa ? 'برای قدم اول بخوانید' : 'Read before your first step'}</h2>
              {Object.entries(guides)
                .filter(
                  ([, g]) =>
                    g.planet === detailPlanet || (detailPlanet === 'club' && g.planet === 'learn'),
                )
                .map(([k, g]) => (
                  <a href={`/${locale}/${k}`} key={k}>
                    {g.title[locale]}
                    {arrow}
                  </a>
                ))}
            </div>
          </section>
        ) : article ? (
          <article className="article-page content-section">
            <a className="back-link" href={`${homeUrl}#journal`}>
              {fa ? <ArrowRight size={18} /> : <ArrowLeft size={18} />} {c.journal}
            </a>
            <p className="eyebrow">{article.category[locale]}</p>
            <h1>{article.title[locale]}</h1>
            <p className="article-intro">{article.description[locale]}</p>
            <div className="article-cover">
              <img src={planetArt[article.planet]} alt="" width="1254" height="1254" />
            </div>
            {article.body[locale].map(([title, body], i) => (
              <section key={title}>
                <span className="article-step">0{i + 1}</span>
                <div>
                  <h2>{title}</h2>
                  <p>{body}</p>
                </div>
              </section>
            ))}
            <a className="article-next" href={`/${locale}/${article.planet}`}>
              {fa ? 'ادامه در مسیر مرتبط' : 'Continue to the related path'}
              {arrow}
            </a>
          </article>
        ) : null}
      </main>
      <SiteFooter locale={locale} home={home} openGuide={openGuide} openRequest={openRequest} />
      {home && (
        <div className="flight-control">
          <div className="flight-readout">
            <span className="flight-index" dir="ltr">
              {String(station + 1).padStart(2, '0')}
              <small> / {String(stops.length).padStart(2, '0')}</small>
            </span>
            <div>
              <span className="overline">{fa ? 'در مدار کشف' : 'IN ORBIT'}</span>
              <strong>{orbitalLabel}</strong>
            </div>
          </div>
          <nav className="flight-stops" aria-label={fa ? 'ایستگاه‌های سفر' : 'Journey stations'}>
            {stops.map((id, i) => (
              <button
                key={id}
                onClick={() => jump(i)}
                className={station === i ? 'is-current' : ''}
                aria-current={station === i ? 'step' : undefined}
                aria-label={stationNames[i]}
                title={stationNames[i]}
              >
                <span />
                <em>{stationNames[i]}</em>
              </button>
            ))}
          </nav>
          <div className="flight-actions">
            <button
              className="motion-toggle"
              onClick={changeMotion}
              aria-label={reduced ? c.motionOn : c.motionOff}
              title={reduced ? c.motionOn : c.motionOff}
            >
              {reduced ? <Play size={15} /> : <Pause size={15} />}
            </button>
            <button
              className="next-station"
              onClick={() => jump(station === stops.length - 1 ? 0 : station + 1)}
              aria-label={
                station === stops.length - 1
                  ? fa
                    ? 'شروع دوباره سفر'
                    : 'Restart journey'
                  : fa
                    ? 'ایستگاه بعدی'
                    : 'Next station'
              }
            >
              <span>
                {station === stops.length - 1
                  ? fa
                    ? 'آغاز دوباره'
                    : 'Restart'
                  : fa
                    ? 'ایستگاه بعدی'
                    : 'Next stop'}
              </span>
              {fa ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
            </button>
          </div>
          <div className="dock-progress" style={{ transform: `scaleX(${progress})` }} />
        </div>
      )}

      <Dialog
        open={!!planet}
        onOpenChange={(v) => {
          if (!v) closePlanet();
        }}
      >
        <DialogContent
          className="planet-dialog"
          dir={fa ? 'rtl' : 'ltr'}
          showCloseButton={false}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            lastFocus.current?.focus();
          }}
        >
          <DialogClose
            className="av-button av-button--ghost av-button--icon dialog-close"
            aria-label={c.close}
          >
            <X size={20} />
          </DialogClose>
          {planet && (
            <>
              <div className={`dialog-art static-${planet}`}>
                <img src={planetArt[planet]} alt="" width="1254" height="1254" />
                <span>AV / {planets[planet].number}</span>
              </div>
              <div className="dialog-copy">
                <p className="eyebrow">{planets[planet][locale].eyebrow}</p>
                <DialogTitle>{planets[planet][locale].name}</DialogTitle>
                <DialogDescription>{planets[planet][locale].detail}</DialogDescription>
                <ul>
                  {planets[planet][locale].features.map((f) => (
                    <li key={f}>
                      <Check size={15} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  className="av-button av-button--primary primary-button inline-button"
                  href={`/${locale}/${planet}`}
                >
                  {c.details}
                  {arrow}
                </a>
                <p className="dialog-small">{planets[planet][locale].note}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <PathGuide
        open={guide}
        onOpenChange={(v) => {
          setGuide(v);
          if (!v) requestAnimationFrame(() => lastFocus.current?.focus());
        }}
        locale={locale}
        interest={interest}
        onInterestChange={setInterest}
      />
      <Dialog
        open={!!request}
        onOpenChange={(v) => {
          if (!v) setRequest(null);
        }}
      >
        <DialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            lastFocus.current?.focus();
          }}
          className="request-dialog"
          dir={fa ? 'rtl' : 'ltr'}
          showCloseButton={false}
        >
          <DialogClose
            className="av-button av-button--ghost av-button--icon dialog-close"
            aria-label={c.close}
          >
            <X size={20} />
          </DialogClose>
          <DialogTitle>{status === 'success' ? c.success : c.requestTitle}</DialogTitle>
          <DialogDescription>
            {status === 'success' ? c.successSub : c.requestNote}
          </DialogDescription>
          {status === 'success' ? (
            <div className="request-success">
              <Check size={32} />
              <code dir="ltr">{reference}</code>
              <Button
                className="av-button av-button--secondary"
                variant="outline"
                onClick={() => setRequest(null)}
              >
                {fa ? 'بستن' : 'Close'}
              </Button>
            </div>
          ) : (
            <form onSubmit={submitRequest} className="request-form" noValidate>
              <ErrorSummary
                errors={fieldErrors}
                focusKey={validationAttempt}
                title={fa ? 'لطفاً این موارد را اصلاح کنید' : 'Please check these fields'}
              />
              <label>
                {c.name}
                <input
                  className="av-field"
                  id="request-name"
                  aria-invalid={fieldErrors.some((error) => error.id === 'request-name')}
                  aria-describedby={
                    fieldErrors.some((error) => error.id === 'request-name')
                      ? 'request-name-error'
                      : undefined
                  }
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                />
                {fieldErrors
                  .filter((error) => error.id === 'request-name')
                  .map((error) => (
                    <span key={error.id} id="request-name-error" className="request-field-error">
                      {error.message}
                    </span>
                  ))}
              </label>
              <label>
                {c.contact}
                <input
                  className="av-field"
                  id="request-contact"
                  aria-invalid={fieldErrors.some((error) => error.id === 'request-contact')}
                  aria-describedby={
                    fieldErrors.some((error) => error.id === 'request-contact')
                      ? 'request-contact-error'
                      : undefined
                  }
                  name="contact"
                  required
                  minLength={6}
                  maxLength={160}
                  dir="ltr"
                  autoComplete="email"
                />
                {fieldErrors
                  .filter((error) => error.id === 'request-contact')
                  .map((error) => (
                    <span key={error.id} id="request-contact-error" className="request-field-error">
                      {error.message}
                    </span>
                  ))}
              </label>
              <label>
                {c.message}
                <textarea
                  className="av-field"
                  id="request-message"
                  aria-invalid={fieldErrors.some((error) => error.id === 'request-message')}
                  aria-describedby={
                    fieldErrors.some((error) => error.id === 'request-message')
                      ? 'request-message-error'
                      : undefined
                  }
                  name="message"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={3}
                />
                {fieldErrors
                  .filter((error) => error.id === 'request-message')
                  .map((error) => (
                    <span key={error.id} id="request-message-error" className="request-field-error">
                      {error.message}
                    </span>
                  ))}
              </label>
              <label className="honeypot" aria-hidden="true">
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              <label className="consent-label">
                <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                <span>{c.consent}</span>
              </label>
              <p className="form-privacy">{c.privacy}</p>
              {status === 'error' && (
                <p role="alert" className="form-error">
                  {c.error}
                </p>
              )}
              <Button
                type="submit"
                className="av-button av-button--primary primary-button"
                disabled={!consent || status === 'saving'}
                aria-busy={status === 'saving'}
              >
                {status === 'saving' ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    {c.submitting}
                  </>
                ) : (
                  c.submit
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={menu} onOpenChange={setMenu}>
        <DialogContent className="menu-dialog" dir={fa ? 'rtl' : 'ltr'} showCloseButton={false}>
          <DialogClose
            className="av-button av-button--ghost av-button--icon dialog-close"
            aria-label={fa ? 'بستن منو' : 'Close menu'}
          >
            <X />
          </DialogClose>
          <DialogTitle>{fa ? 'منظومه آوا استار' : 'The Avastar universe'}</DialogTitle>
          <DialogDescription>{c.universeSub}</DialogDescription>
          <nav>
            {planetIds.map((id) => (
              <a
                href={linkTo(id)}
                onClick={(e) => {
                  setMenu(false);
                  if (home) {
                    e.preventDefault();
                    history.pushState({ avastarStop: '#' + id }, '', '#' + id);
                    requestAnimationFrame(() => jump(planetIds.indexOf(id) + 1));
                  }
                }}
                key={id}
              >
                {planets[id].number}
                <span>{planets[id][locale].name}</span>
                {arrow}
              </a>
            ))}
            <a
              href={linkTo('journal')}
              onClick={(e) => {
                setMenu(false);
                if (home) {
                  e.preventDefault();
                  history.pushState({ avastarStop: '#journal' }, '', '#journal');
                  requestAnimationFrame(() => jump(5));
                }
              }}
            >
              {c.journal}
            </a>
            <a
              href={linkTo('about')}
              onClick={(e) => {
                setMenu(false);
                if (home) {
                  e.preventDefault();
                  history.pushState({ avastarStop: '#about' }, '', '#about');
                  requestAnimationFrame(() => jump(6));
                }
              }}
            >
              {c.about}
            </a>
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
}
