'use client';
import { Section } from './primitives';
import { translate, type Locale } from '@/lib/site';
export function Standards({ locale }: { locale: Locale }) {
  const t = translate(locale);
  const rows = [
    [
      t('کنتراست متن', 'Text contrast'),
      '4.5 : 1',
      t(
        'متن معمولی؛ برای متن بزرگ ۳:۱. حالت غیرفعال از این معیار مستثناست.',
        'Normal text; 3:1 for large text. Inactive controls are exempt.',
      ),
    ],
    [
      t('کنترل و فوکوس', 'Controls & focus'),
      '3 : 1',
      t(
        'مرزهای ضروری کنترل و نشانه فوکوس نسبت به رنگ مجاور.',
        'Essential control boundaries and focus indicators against adjacent colors.',
      ),
    ],
    [
      t('هدف تعامل داخلی', 'Internal target size'),
      '44 × 44 px',
      t(
        'قاعده محصول آوا استار؛ حداقل WCAG 2.2 AA با استثناهای مشخص ۲۴×۲۴ است.',
        'Avastar product rule. WCAG 2.2 AA defines a 24×24 minimum with specific exceptions.',
      ),
    ],
    [
      t('بازچینی و بزرگ‌نمایی', 'Reflow & zoom'),
      '320 px / 200%',
      t(
        'بدون حذف محتوا؛ جدول‌های دوبعدی در محفظه مستقل.',
        'No lost content. Two-dimensional tables use a separate scroll container.',
      ),
    ],
  ];
  return (
    <Section
      id="standards"
      index="12 / DESIGN CONTRACTS"
      title={t('استانداردها، در خدمت تجربه', 'Standards in service of experience')}
      description={t(
        'قواعد مشترک برای طراحی، توسعه و تحویل تجربهٔ آوا استار.',
        'Shared rules for designing, building and delivering the Avastar experience.',
      )}
    >
      <div className="ds-specimen">
        <span className="ds-eyebrow">AVASTAR / INTERACTION</span>
        <h2>
          {t(
            'بازخورد فوری، حرکت قابل برگشت، عمق خوانا',
            'Immediate feedback, interruptible motion, clear depth',
          )}
        </h2>
        <p>
          {t(
            'کنترل‌ها با فشردن بازخورد می‌دهند. حرکت با تغییر تصمیم کاربر ادامه یا برمی‌گردد. لایه‌های شناور، محتوا و مسیر بازگشت را روشن نگه می‌دارند.',
            'Controls respond on press. Motion continues or reverses as intent changes. Floating layers keep content and the way back clear.',
          )}
        </p>
      </div>
      <div className="ds-standard-intro">
        <span>WCAG 2.2 AA</span>
        <p>
          {t(
            'هدف دسترس‌پذیری سیستم است، نه گواهی انطباق کامل. کنتراست توکن‌های منتشرشده خودکار بررسی می‌شود؛ هر صفحه به ارزیابی کیبورد، صفحه‌خوان و محتوای واقعی نیاز دارد.',
            'Our accessibility target, not a certification. Published token contrast is checked automatically; each page still needs keyboard, screen-reader and real-content review.',
          )}
        </p>
      </div>
      <div className="ds-table-scroll">
        <table className="ds-standards-table">
          <caption>{t('معیارهای پایه تحویل رابط', 'Interface delivery criteria')}</caption>
          <thead>
            <tr>
              <th>{t('معیار', 'Criterion')}</th>
              <th>{t('هدف', 'Target')}</th>
              <th>{t('کاربرد', 'Application')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, value, note]) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                <td dir="ltr">{value}</td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ds-standard-grid">
        <article>
          <span>01 / TOKEN ARCHITECTURE</span>
          <h2>{t('مقدار، نقش، جزء', 'Value → role → component')}</h2>
          <p>
            {t(
              'آبی برند یک مقدار پایه است؛ primary نقش اقدام است؛ دکمه از نقش استفاده می‌کند. تغییر تم باید نگاشت نقش‌ها را عوض کند، نه منطق اجزا را.',
              'Brand blue is a primitive; primary is an action role; buttons consume the role. Theme changes remap roles, not component logic.',
            )}
          </p>
          <code dir="ltr">brand.blue → primary → button</code>
        </article>
        <article>
          <span>02 / COMPONENT CONTRACT</span>
          <h2>{t('یک جزء، همه حالت‌ها', 'One component, every state')}</h2>
          <p>
            {t(
              'پیش‌فرض، hover، فوکوس، فشرده، غیرفعال، انتظار، خطا و موفقیت را متناسب با نوع جزء تعریف کنید. نمونه‌ها از همان اجزای قابل دانلود ساخته شده‌اند.',
              'Define default, hover, focus, pressed, disabled, pending, error and success as applicable. Examples use the same components included in the kit.',
            )}
          </p>
        </article>
        <article>
          <span>03 / CONTENT DESIGN</span>
          <h2>{t('کوتاه، روشن، قابل اقدام', 'Brief, clear, actionable')}</h2>
          <p>
            {t(
              'به‌جای «خطا رخ داد»: «ایمیل معتبر وارد کنید؛ مثل sky@example.com». به‌جای «تأیید»: نام کار واقعی، مثل «ذخیره تغییرات». متن فارسی از نیم‌فاصله و واژه‌های ثابت استفاده کند.',
              'Replace “An error occurred” with “Enter a valid email, such as sky@example.com”. Replace “Confirm” with the actual action, such as “Save changes”. Keep terminology consistent across languages.',
            )}
          </p>
        </article>
        <article>
          <span>04 / CHANGE MANAGEMENT</span>
          <h2>{t('تغییر قابل ردیابی', 'Traceable changes')}</h2>
          <p>
            {t(
              'هر جزء جدید باید مسئله، نمونه زنده، API، حالت‌ها و راهنمای دسترس‌پذیری داشته باشد. حذف توکن یا تغییر API نیازمند نسخه اصلی و راهنمای مهاجرت است؛ رفع اشکال با نسخه اصلاحی منتشر شود.',
              'New components need a use case, live example, API, states and accessibility guidance. Token removal or API changes require a major version and migration notes; bug fixes use patch versions.',
            )}
          </p>
        </article>
      </div>
      <h2 className="ds-subheading">{t('معیارهای دسترس‌پذیری', 'Accessibility specifications')}</h2>
      <div className="ds-reference-grid">
        {[
          [
            'W3C / WCAG 2.2',
            'https://www.w3.org/TR/WCAG22/',
            t('معیارهای قابل آزمون دسترس‌پذیری وب', 'Testable web accessibility criteria'),
          ],
          [
            'WAI / ARIA APG',
            'https://www.w3.org/WAI/ARIA/apg/',
            t('الگوهای کیبورد، نقش و فوکوس', 'Keyboard, role and focus patterns'),
          ],
        ].map(([title, url, description]) => (
          <a key={title} href={url} target="_blank" rel="noreferrer">
            <strong dir="ltr">
              {title}
              <span aria-hidden="true"> ↗</span>
            </strong>
            <span>{description}</span>
          </a>
        ))}
      </div>
    </Section>
  );
}
