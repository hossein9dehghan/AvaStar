'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Download,
  Menu,
  Search,
  X,
  Layers,
  Palette,
  Component,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { LanguageSwitch } from '@avastar/ui/language-switch';
import { Button } from '@avastar/ui/components/button';
import { TooltipProvider } from '@avastar/ui/components/tooltip';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@avastar/ui/components/sheet';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@avastar/ui/components/dialog';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@avastar/ui/components/command';
import { ThemeControl } from '@avastar/ui/theme-provider';
import { Foundations } from './foundations';
import { ComponentGallery } from './component-gallery';
import { Guidelines } from './guidelines';
import { Standards } from './standards';
import { ExtendedGallery } from './extended-gallery';
import { ComponentReference } from './component-reference';
import { TreeNavigation } from './tree-navigation';
import {
  DocumentationProvider,
  sections,
  useActiveSection,
  useActiveComponent,
  normalizeSearch,
} from './documentation';
import { translate, type Locale } from '@/lib/site';
export function DesignSystem({ locale }: { locale: Locale }) {
  const t = translate(locale),
    fa = locale === 'fa',
    active = useActiveSection(),
    activeComponent = useActiveComponent();
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState(false);
  const main = useRef<HTMLElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchSelected = useRef(false);
  const last = useRef(active);
  const current = sections.findIndex(([id]) => id === active);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearch((v) => !v);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  useEffect(() => {
    if (last.current !== active) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      main.current?.focus({ preventScroll: true });
      last.current = active;
    }
  }, [active]);
  const navigate = (id: string) => {
    setOpen(false);
    setSearch(false);
    location.hash = id;
  };
  const navigation = (
    <TreeNavigation locale={locale} active={active} onNavigate={() => setOpen(false)} />
  );
  return (
    <TooltipProvider delayDuration={250}>
      <DocumentationProvider value={{ active, locale }}>
        <div className="ds-page av-ui">
          <a
            className="skip-link"
            href="#ds-main"
            onClick={(event) => {
              event.preventDefault();
              main.current?.focus();
              main.current?.scrollIntoView({ block: 'start' });
            }}
          >
            {t('رفتن به محتوای دیزاین سیستم', 'Skip to design system content')}
          </a>
          <header className="ds-header av-glass">
            <div className="ds-header-brand">
              <Button
                className="av-button av-button--ghost av-button--icon ds-menu-toggle"
                aria-label={t('فهرست دیزاین سیستم', 'Design system menu')}
                onClick={() => setOpen(true)}
              >
                <Menu size={21} />
              </Button>
              <a href={`/${locale}`} aria-label={t('خانه دیزاین سیستم', 'Design system home')}>
                <img
                  className="theme-logo-dark"
                  src={`/brand/logo-lockup-${locale}-mono.png`}
                  width="122"
                  height="40"
                  alt="Avastar"
                />
                <img
                  className="theme-logo-light"
                  src={`/brand/logo-lockup-${locale}.png`}
                  width="122"
                  height="40"
                  alt="Avastar"
                />
              </a>
              <span className="ds-header-label">
                DESIGN SYSTEM <small>3.1</small>
              </span>
            </div>
            <button
              ref={searchButton}
              aria-label={t('جست‌وجو در دیزاین سیستم', 'Search the design system')}
              className="ds-search"
              onClick={() => setSearch(true)}
            >
              <Search size={18} aria-hidden="true" />
              <span>{t('جست‌وجو در سیستم…', 'Search the system…')}</span>
              <kbd dir="ltr">⌘ / Ctrl K</kbd>
            </button>
            <div className="ds-header-actions">
              <LanguageSwitch
                locale={locale}
                href={`/${fa ? 'en' : 'fa'}#${active}${activeComponent ? `/${activeComponent}` : ''}`}
              />
              <ThemeControl locale={locale} />
              <a
                className="av-button av-button--secondary av-button--sm ds-header-download"
                href="/design-system/avastar-design-kit.zip"
                download
              >
                <Download size={18} aria-hidden="true" />
                {t('دریافت کیت', 'Get the kit')}
              </a>
            </div>
          </header>
          <div className="ds-shell">
            <aside className="ds-sidebar">
              {navigation}
              <div className="ds-sidebar-bottom">
                <span>AVASTAR UI / 3.1</span>
              </div>
            </aside>
            <main id="ds-main" className="ds-main" ref={main} tabIndex={-1}>
              <div className="ds-breadcrumb">
                <span>{t('دیزاین سیستم', 'Design system')}</span>
                <span aria-hidden="true">/</span>
                <strong>{sections[current][fa ? 1 : 2]}</strong>
                <span className="ds-release">v3.1</span>
              </div>
              {active === 'overview' && (
                <section id="overview" className="ds-section ds-overview">
                  <div className="ds-overview-hero">
                    <div>
                      <span className="ds-eyebrow">AVASTAR UI / 3.1</span>
                      <h1>{t('دیزاین سیستم آوا استار', 'Avastar design system')}</h1>
                      <p className="ds-lead">
                        {t(
                          'مبانی، اجزای تعاملی و الگوهای پنل؛ همراه با حالت‌ها، کد استفاده و قرارداد دسترس‌پذیری.',
                          'Foundations, interactive components and workspace patterns, with states, usage code and accessibility contracts.',
                        )}
                      </p>
                      <div className="ds-overview-actions">
                        <a className="av-button av-button--primary av-button--md" href="#buttons">
                          {t('کاوش در اجزا', 'Explore components')}
                          {fa ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                        </a>
                        <a className="av-button av-button--ghost" href="#resources">
                          {t('شروع توسعه', 'Start building')}
                          <ArrowUpRight size={17} />
                        </a>
                      </div>
                    </div>
                    <div
                      className="ds-language-board"
                      aria-label={t('نمونه زبان بصری سیستم', 'System visual language sample')}
                    >
                      <div className="ds-board-top">
                        <span>AV / FOUNDATIONS</span>
                        <span className="ds-board-dot" />
                      </div>
                      <div className="ds-board-type">
                        <span>{fa ? 'آ' : 'Aa'}</span>
                        <div>
                          <strong>Peyda</strong>
                          <small>{t('خوانا، انسانی، آشنا', 'Legible. Human. Familiar.')}</small>
                        </div>
                      </div>
                      <div className="ds-board-swatches">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="ds-board-controls">
                        <Button
                          className="av-button av-button--primary"
                          onClick={() => navigate('buttons')}
                        >
                          {t('ادامه مسیر', 'Continue')}
                          {fa ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                        </Button>
                        <a
                          href="#colors"
                          className="av-button av-button--secondary av-button--icon"
                          aria-label={t('مشاهده رنگ‌ها', 'View colors')}
                        >
                          <Palette size={19} />
                        </a>
                      </div>
                      <div className="ds-board-footer">
                        <span>{t('مبتنی بر نقش، سازگار با تم', 'Role-based. Theme-aware.')}</span>
                        <span>RTL ↔ LTR</span>
                      </div>
                    </div>
                  </div>
                  <div className="ds-overview-strip">
                    <span>{t('پیدا / فارسی و انگلیسی', 'Peyda / Persian & English')}</span>
                    <span>{t('روشن و تیره', 'Light & dark')}</span>
                    <span>{t('توکن + React + CSS', 'Tokens + React + CSS')}</span>
                    <span>{t('هدف: WCAG 2.2 AA', 'Target: WCAG 2.2 AA')}</span>
                  </div>
                  <div className="ds-start-grid">
                    {[
                      [
                        'colors',
                        Palette,
                        t('از مبانی شروع کنید', 'Start with foundations'),
                        t(
                          'پالت معنایی، تایپوگرافی و ریتم فاصله‌ها؛ قواعد مشترک هر صفحه.',
                          'Semantic color, typography and spacing: the shared rules for every page.',
                        ),
                      ],
                      [
                        'buttons',
                        Component,
                        t('اجزا را آزمایش کنید', 'Try the components'),
                        t(
                          'نمونه زنده، حالت‌های تعامل، کد استفاده و راهنمای دسترس‌پذیری.',
                          'Live examples, interaction states, usage code and accessibility guidance.',
                        ),
                      ],
                      [
                        'panels',
                        Layers,
                        t('یک فضای کاری بسازید', 'Build a workspace'),
                        t(
                          'الگوهای جدول، فرم و ناوبری برای پنل کاربر و مدیریت.',
                          'Table, form and navigation patterns for user and admin workspaces.',
                        ),
                      ],
                    ].map(([id, Icon, title, description]) => {
                      const Symbol = Icon as typeof Palette;
                      return (
                        <a href={`#${id}`} key={id as string}>
                          <Symbol size={23} />
                          <h2>{title as string}</h2>
                          <p>{description as string}</p>
                          <span>
                            {t('مشاهده راهنما', 'Read the guide')}
                            {fa ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                  <div className="ds-overview-note">
                    <span className="ds-eyebrow">DESIGNED TO BE SHARED</span>
                    <h2>
                      {t(
                        'لندینگ، پنل و ادمین؛ یک پایه مشترک.',
                        'Landing, user panel, admin. One shared foundation.',
                      )}
                    </h2>
                    <p>
                      {t(
                        'برند ثابت می‌ماند؛ تراکم، چیدمان و لحن تعامل با کاربرد هماهنگ می‌شود. کیت قابل دانلود شامل توکن‌ها، فونت‌ها، اجزا و نمونه شروع است.',
                        'The brand stays consistent while density, layout and interaction adapt to the task. The downloadable kit includes tokens, fonts, components and a starter example.',
                      )}
                    </p>
                    <a className="av-button av-button--secondary" href={`/${locale}/panels/admin`}>
                      {t('مشاهده نمونه ادمین', 'Open admin example')}
                      <ArrowUpRight size={17} />
                    </a>
                  </div>
                  <ComponentReference section="overview" locale={locale} />
                </section>
              )}
              <Foundations locale={locale} />
              <ComponentGallery locale={locale} />
              <Guidelines locale={locale} />
              <Standards locale={locale} />
              <ExtendedGallery locale={locale} />
              <nav
                className="ds-page-navigation"
                aria-label={t('بخش‌های قبل و بعد', 'Previous and next sections')}
              >
                {current > 0 ? (
                  <a href={`#${sections[current - 1][0]}`}>
                    <small>{t('بخش قبل', 'Previous')}</small>
                    <strong>{sections[current - 1][fa ? 1 : 2]}</strong>
                  </a>
                ) : (
                  <span />
                )}
                {current < sections.length - 1 ? (
                  <a href={`#${sections[current + 1][0]}`}>
                    <small>{t('بخش بعد', 'Next')}</small>
                    <strong>{sections[current + 1][fa ? 1 : 2]}</strong>
                  </a>
                ) : (
                  <span />
                )}
              </nav>
              <footer className="ds-footer">
                <span dir="ltr">AVASTAR UI / 3.1</span>
                <a href="#standards">
                  {t('استانداردها و منابع مرجع', 'Standards & references')}
                  <ArrowUpRight size={15} />
                </a>
              </footer>
            </main>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
              className="ds-mobile-nav"
              side={fa ? 'right' : 'left'}
              showCloseButton={false}
              dir={fa ? 'rtl' : 'ltr'}
            >
              <SheetClose
                className="av-button av-button--ghost av-button--icon sheet-close"
                aria-label={t('بستن فهرست', 'Close navigation')}
              >
                <X size={20} />
              </SheetClose>
              <SheetTitle>{t('دیزاین سیستم', 'Design system')}</SheetTitle>
              <SheetDescription>
                {t('بخش موردنظر را انتخاب کنید.', 'Choose a section.')}
              </SheetDescription>
              {navigation}
            </SheetContent>
          </Sheet>
          <Dialog open={search} onOpenChange={setSearch}>
            <DialogContent
              className="ds-search-dialog"
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                searchInput.current?.focus();
              }}
              showCloseButton={false}
              dir={fa ? 'rtl' : 'ltr'}
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                (searchSelected.current ? main.current : searchButton.current)?.focus({
                  preventScroll: true,
                });
                searchSelected.current = false;
              }}
            >
              <DialogTitle>{t('جست‌وجو در دیزاین سیستم', 'Search the design system')}</DialogTitle>
              <DialogClose
                className="ds-search-close av-button av-button--ghost av-button--icon"
                aria-label={t('بستن جست‌وجو', 'Close search')}
              >
                <X size={18} />
              </DialogClose>
              <DialogDescription>
                {t(
                  'نام جزء یا موضوع را بنویسید. با کلیدهای جهت و Enter انتخاب کنید.',
                  'Find a component or topic. Use arrow keys and Enter to select.',
                )}
              </DialogDescription>
              <Command
                filter={(value, search) =>
                  normalizeSearch(value).includes(normalizeSearch(search)) ? 1 : 0
                }
              >
                <CommandInput
                  ref={searchInput}
                  aria-label={t('جست‌وجوی بخش‌ها', 'Search sections')}
                  placeholder={t('مثلاً رنگ، فرم یا motion…', 'Try color, forms or motion…')}
                />
                <CommandList aria-label={t('نتایج جست‌وجو', 'Search results')}>
                  <CommandEmpty>
                    {t(
                      'بخشی پیدا نشد؛ واژه کوتاه‌تری امتحان کنید.',
                      'No sections found. Try a shorter query.',
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {sections.map(([id, label, en, keywords]) => (
                      <CommandItem
                        key={id}
                        value={`${label} ${en} ${keywords}`}
                        onSelect={() => {
                          searchSelected.current = true;
                          navigate(id);
                        }}
                      >
                        <span>{fa ? label : en}</span>
                        {fa && <small dir="ltr">{en}</small>}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DialogContent>
          </Dialog>
        </div>
      </DocumentationProvider>
    </TooltipProvider>
  );
}
