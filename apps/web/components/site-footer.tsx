'use client';
import { copy, guides, planetIds, planets, type Locale } from '@/lib/avastar';
import { ArrowUp, ArrowUpLeft, ArrowUpRight, Compass, MessageCircle } from 'lucide-react';
export function SiteFooter({
  locale,
  home,
  openGuide,
  openRequest,
}: {
  locale: Locale;
  home: boolean;
  openGuide: () => void;
  openRequest: (kind: string) => void;
}) {
  const fa = locale === 'fa',
    c = copy[locale],
    arrow = fa ? <ArrowUpLeft size={18} /> : <ArrowUpRight size={18} />;
  const link = (id: string) => (home ? `#${id}` : `/${locale}#${id}`);
  return (
    <footer
      id="footer"
      className={`site-footer content-section ${home ? 'journey-footer depth-panel' : ''}`}
      data-depth-stop={home ? 9 : undefined}
      aria-label={fa ? 'پایان سفر و ارتباط با آوا استار' : 'Avastar information and contact'}
    >
      <div className="closing-aperture" aria-hidden="true" />
      <div className="footer-surface av-glass" data-material="frosted">
        <div className="footer-invitation">
          <div>
            <p className="eyebrow">
              <span className="tiny-orbit" />
              {fa
                ? 'پایان این صفحه، آغاز مسیر شما'
                : 'THE END OF THE PAGE. THE START OF YOUR JOURNEY.'}
            </p>
            <h2>{fa ? 'آسمان منتظر کنجکاوی شماست.' : 'The sky is waiting for your curiosity.'}</h2>
          </div>
          <button
            className="av-button av-button--primary primary-button inline-button"
            onClick={openGuide}
          >
            <Compass size={19} />
            {c.start}
            {arrow}
          </button>
        </div>
        <div className="footer-grid">
          <div className="footer-identity">
            <a
              href={`/${locale}`}
              className="brand"
              aria-label={fa ? 'خانه آوا استار' : 'Avastar home'}
            >
              <img
                src={`/brand/logo-lockup-${locale}-mono.png`}
                className="brand-dark"
                alt={fa ? 'آوا استار' : 'Avastar'}
                width="138"
                height="43"
              />
              <img
                src={`/brand/logo-lockup-${locale}.png`}
                className="brand-light"
                alt={fa ? 'آوا استار' : 'Avastar'}
                width="138"
                height="43"
              />
            </a>
            <p>
              {fa
                ? 'از اولین سؤال درباره آسمان تا یادگیری، رصد و همراهی با جامعه کاوشگران؛ آوا استار کنار شماست.'
                : 'From your first question about the sky to learning, observing and finding your community. Avastar connects the journey.'}
            </p>
            <span className="footer-tagline">{c.footer}</span>
          </div>
          <nav aria-label={fa ? 'مسیرهای آوا استار' : 'Avastar paths'}>
            <h3>{fa ? 'مسیرهای کشف' : 'Paths to discovery'}</h3>
            {planetIds.map((id) => (
              <a key={id} href={`/${locale}/${id}`}>
                {planets[id][locale].name}
                {arrow}
              </a>
            ))}
          </nav>
          <nav aria-label={fa ? 'راهنما و آشنایی' : 'Guides and information'}>
            <h3>{fa ? 'برای شروع' : 'Getting started'}</h3>
            {Object.entries(guides).map(([key, g]) => (
              <a key={key} href={`/${locale}/${key}`}>
                {g.title[locale]}
              </a>
            ))}
            <a href={link('faq')}>{c.faq}</a>
            <a href={link('about')}>{c.about}</a>
          </nav>
          <div className="footer-contact">
            <h3>{fa ? 'در ارتباط باشیم' : 'Let’s connect'}</h3>
            <button onClick={() => openRequest('general')}>
              <MessageCircle size={17} />
              {fa ? 'راهنمایی و ارتباط با ما' : 'Guidance and contact'}
              {arrow}
            </button>
            <button onClick={() => openRequest('partners')}>
              {fa ? 'مدارس و سازمان‌ها' : 'Schools and organizations'}
              {arrow}
            </button>
            <button onClick={() => openRequest('partners')}>
              {fa ? 'همکاری فروش و معرفی' : 'Retail and referral partners'}
              {arrow}
            </button>
            <p>
              {fa
                ? 'در فرم ارتباط، راه تماس و موضوع درخواستتان را بنویسید.'
                : 'Leave your contact details and tell us how we can help.'}
            </p>
          </div>
        </div>
        <div className="footer-base">
          <a href="/art/textures/CREDITS.txt" target="_blank" rel="noreferrer">
            {fa ? 'اعتبار تصاویر' : 'Image credits'}
          </a>
          <span dir="ltr">© {new Date().getFullYear()} AVASTAR</span>
          <a href={link('main')}>
            {fa ? 'بازگشت به آغاز سفر' : 'Back to the beginning'}
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
