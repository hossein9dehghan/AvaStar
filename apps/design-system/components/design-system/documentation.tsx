'use client';
import { createContext, useContext, useSyncExternalStore } from 'react';
import type { Locale } from '@/lib/site';
export const navigationGroups = [
  {
    id: 'foundations',
    fa: 'مبانی طراحی',
    en: 'Foundations',
    items: ['overview', 'brand', 'colors', 'type', 'layout', 'materials'],
  },
  {
    id: 'controls',
    fa: 'کنترل‌ها و ورودی‌ها',
    en: 'Controls & inputs',
    items: ['buttons', 'forms', 'selection', 'pickers'],
  },
  {
    id: 'wayfinding',
    fa: 'ناوبری و لایه‌ها',
    en: 'Navigation & layers',
    items: ['navigation', 'disclosure', 'overlays'],
  },
  {
    id: 'content',
    fa: 'داده و بازخورد',
    en: 'Data & feedback',
    items: ['cards', 'data', 'feedback', 'states'],
  },
  {
    id: 'patterns',
    fa: 'الگوهای محصول',
    en: 'Product patterns',
    items: ['panels', 'account', 'imagery', 'motion'],
  },
  {
    id: 'build',
    fa: 'توسعه و استاندارد',
    en: 'Build & standards',
    items: ['accessibility', 'standards', 'resources', 'catalog'],
  },
];
export const sections = [
  ['overview', 'شروع و اصول', 'Overview', 'start introduction اصول شروع'],
  ['brand', 'هویت و لوگو', 'Brand & logos', 'identity assets logo'],
  ['colors', 'رنگ و کنتراست', 'Color & contrast', 'tokens semantic palette theme'],
  ['type', 'تایپوگرافی', 'Typography', 'font Peyda scale'],
  ['layout', 'چیدمان و فاصله', 'Layout & spacing', 'grid responsive radius elevation'],
  ['materials', 'سطوح و عمق', 'Materials & depth', 'glass blur translucency elevation'],
  ['buttons', 'دکمه‌ها', 'Buttons', 'action loading disabled focus hover pressed'],
  [
    'forms',
    'فیلد و فرم',
    'Fields & forms',
    'input validation textarea password error ورودی رمز عبور متن چندخطی خطا اعتبارسنجی',
  ],
  [
    'selection',
    'کنترل‌های انتخاب',
    'Selection controls',
    'checkbox switch radio slider toggle سوییچ سوئیچ کلید چک‌باکس چک باکس تیک رادیو اسلایدر لغزنده',
  ],
  [
    'pickers',
    'انتخابگرها',
    'Pickers',
    'select combobox calendar date upload file otp تقویم تاریخ بارگذاری آپلود فایل کد تایید تأیید یکبار مصرف انتخابگر کشویی',
  ],
  ['navigation', 'ناوبری و تب', 'Navigation & tabs', 'breadcrumb pagination segmented tabs'],
  [
    'disclosure',
    'نمایش تدریجی',
    'Disclosure',
    'accordion collapsible tooltip hover card آکاردئون جمع شونده راهنما تولتیپ',
  ],
  [
    'overlays',
    'مدال و لایه‌ها',
    'Overlays',
    'dialog sheet drawer alert menu popover دیالوگ گفتگو کشو منو تأیید حذف اعلان',
  ],
  ['cards', 'کارت و هویت', 'Cards & identity', 'avatar badge card progress'],
  ['data', 'جدول و نمودار', 'Tables & charts', 'table sort filter selection pagination chart'],
  ['feedback', 'اعلان و پیام', 'Feedback', 'toast alert notification progress skeleton'],
  [
    'states',
    'حالت‌های صفحه',
    'Page states',
    'loading empty error offline forbidden success no results',
  ],
  ['panels', 'پنل کاربر و ادمین', 'User & admin panels', 'dashboard workspace settings'],
  ['account', 'حساب و تنظیمات', 'Account patterns', 'profile security validation unsaved'],
  ['imagery', 'تصویر و آیکون', 'Imagery & icons', 'art icon assets'],
  ['motion', 'حرکت و واکنش', 'Motion & response', 'animation reduced spring interruption'],
  ['accessibility', 'دسترس‌پذیری و جهت', 'Accessibility & RTL', 'keyboard WCAG focus RTL'],
  ['standards', 'قرارداد طراحی', 'Design contracts', 'WCAG W3C standards governance'],
  ['resources', 'منابع و استفاده', 'Resources & usage', 'download kit install code CSS React'],
  ['catalog', 'فهرست کامپوننت‌ها', 'Component inventory', 'catalog component API states coverage'],
] as const;
export const normalizeSearch = (value: string) =>
  value
    .toLocaleLowerCase()
    .normalize('NFKC')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u200c\u200d\u064b-\u065f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const DocumentationContext = createContext({ active: 'overview', locale: 'fa' as Locale });
export const DocumentationProvider = DocumentationContext.Provider;
export const useDocumentation = () => useContext(DocumentationContext);
const getSection = () => {
  const hash = location.hash.slice(1).split('/')[0];
  return sections.some(([id]) => id === hash) ? hash : 'overview';
};
const subscribe = (notify: () => void) => {
  window.addEventListener('hashchange', notify);
  return () => window.removeEventListener('hashchange', notify);
};
export const useActiveComponent = () =>
  useSyncExternalStore(
    subscribe,
    () => location.hash.slice(1).split('/')[1] || '',
    () => '',
  );
export const useActiveSection = () => useSyncExternalStore(subscribe, getSection, () => 'overview');
// Documented implementation contracts, not a claim of independent accessibility certification.
const guidance: Record<string, [string, string, string, string]> = {
  brand: [
    'لوگو را با حریم امن و نسبت اصلی استفاده کنید؛ رنگ‌های تزئینی هویت برند را تغییر نمی‌دهند.',
    'Preserve logo proportions and clear space. Decoration must not redefine the brand.',
    'نام برند برای لوگوی لینک‌شده؛ تصویر تکراری و تزئینی با alt خالی.',
    'Name linked logos; give repeated decorative images an empty alt.',
  ],
  colors: [
    'رنگ را با نقش انتخاب کنید: اقدام، سطح، متن یا وضعیت. مقدار ثابت رنگ را در کامپوننت قرار ندهید.',
    'Choose colors by role: action, surface, text or status. Avoid hard-coded values inside components.',
    'وضعیت را با متن و آیکون همراه کنید. هر جفت رنگ را در هر دو تم بررسی کنید.',
    'Pair status colors with text and icons. Check every pairing in both themes.',
  ],
  type: [
    'برای فارسی از پیدا و وزن واقعی فونت استفاده کنید؛ فاصله حروف فارسی صفر بماند.',
    'Use Peyda with real font weights. Do not add tracking to Persian text.',
    'متن را در بزرگ‌نمایی ۲۰۰٪ بررسی کنید؛ ارتفاع ثابت نباید نوشته را قطع کند.',
    'Check text at 200% zoom. Fixed heights must not crop content.',
  ],
  layout: [
    'فاصله‌ها از مقیاس مشترک؛ یک تراز اصلی و فضای بیشتر بین گروه‌ها نسبت به داخل آن‌ها.',
    'Use the shared spacing scale, a clear alignment and more space between groups than within them.',
    'در عرض ۳۲۰ پیکسل محتوا باید بازچینی شود؛ جدول داده می‌تواند اسکرول افقی مستقل داشته باشد.',
    'Content must reflow at 320px; data tables may have their own horizontal scrolling.',
  ],
  buttons: [
    'در هر گروه یک اقدام اصلی. متن دکمه یک فعل روشن باشد؛ برای تغییر مسیر از لینک استفاده کنید.',
    'One primary action per group. Use a clear verb; use links for navigation.',
    'Enter و Space برای دکمه؛ نام برای آیکون؛ aria-busy در انتظار و جلوگیری از ارسال تکراری.',
    'Enter and Space activate buttons. Name icon buttons; expose busy state and prevent duplicate submission.',
  ],
  forms: [
    'برچسب دائمی، راهنمای کوتاه و خطای قابل اصلاح کنار فیلد. ورودی کاربر پس از خطا حفظ شود.',
    'Use persistent labels, concise help and actionable errors next to fields. Preserve input after errors.',
    'خطا با aria-describedby متصل شود؛ فرم نامعتبر فوکوس را به خلاصهٔ خطا یا اولین فیلد مشکل‌دار ببرد.',
    'Associate errors with aria-describedby. Move focus to the error summary or first invalid field on submission.',
  ],
  feedback: [
    'پیام موقت برای تأیید کوتاه؛ پیام درون صفحه برای خطای مهم؛ مدال فقط برای تصمیم متمرکز.',
    'Use toasts for brief confirmation, inline alerts for important errors and dialogs for focused decisions.',
    'مدال فوکوس را نگه دارد، با Escape بسته شود و فوکوس را برگرداند؛ پیام وضعیت برای صفحه‌خوان اعلام شود.',
    'Trap dialog focus, support Escape and restore focus. Announce status updates to screen readers.',
  ],
  panels: [
    'حالت خالی، بارگذاری، خطا و نتیجه واقعی را جدا طراحی کنید. فیلترها و انتخاب ردیف‌ها همیشه قابل تشخیص باشند.',
    'Design empty, loading, error and populated states. Keep filters and row selection visible.',
    'سرستون و ترتیب مرتب‌سازی معنایی؛ عملیات هر ردیف نام مستقل و هدف قابل لمس داشته باشد.',
    'Use semantic headers and sort state. Give row actions unique names and touch targets.',
  ],
  imagery: [
    'تصویر برای روایت، آیکون برای راه‌یابی. اندازه و ضخامت آیکون‌ها در یک زمینه ثابت بماند.',
    'Use imagery for storytelling and icons for wayfinding. Keep icon size and stroke consistent.',
    'تصویر آموزشی alt معنادار دارد؛ آیکون کنار متن تزئینی است؛ اطلاعات فقط در تصویر نباشد.',
    'Describe informative images. Icons next to labels are decorative; do not hide information in artwork.',
  ],
  motion: [
    'حرکت باید تغییر وضعیت را توضیح دهد؛ بازخورد کوچک سریع‌تر از جابه‌جایی یک سطح بزرگ باشد.',
    'Motion should explain a state change. Small feedback is faster than a large surface transition.',
    'prefers-reduced-motion را رعایت کنید؛ حرکت تزئینی قابل توقف باشد و انتقال فوکوس به انیمیشن وابسته نباشد.',
    'Respect prefers-reduced-motion. Allow decorative motion to pause; never tie focus transfer to animation.',
  ],
  accessibility: [
    'ترتیب خواندن با DOM هماهنگ؛ CSS منطقی برای جهت؛ آیکون‌های جهت‌دار آینه شوند، لوگو و اعداد خیر.',
    'Keep DOM and reading order aligned. Use logical CSS; mirror directional icons, not logos or numbers.',
    'کیبورد، بزرگ‌نمایی، کاهش حرکت، فارسی و انگلیسی را جدا بررسی کنید. چک خودکار جای تست انسانی را نمی‌گیرد.',
    'Check keyboard, zoom, reduced motion, Persian and English separately. Automation does not replace human testing.',
  ],
  resources: [
    'توکن‌ها، اجزا و فونت‌ها را از کیت مشترک بگیرید. سفارشی‌سازی از لایه تم انجام شود.',
    'Consume tokens, components and fonts from the shared kit. Customize through the theme layer.',
    'پس از به‌روزرسانی، جفت‌رنگ‌ها، تغییر تم، جهت و گردش کار اصلی پنل را دوباره بررسی کنید.',
    'After upgrades, recheck color pairs, theme switching, direction and key panel workflows.',
  ],
};
Object.assign(guidance, {
  materials: [
    'سطح شناور باید از محتوا جدا باشد؛ پس‌زمینهٔ متن خوانا بماند.',
    'Floating surfaces should separate from content while keeping text readable.',
    'در کاهش شفافیت، سطح جامد؛ در کنتراست بیشتر، مرز واضح.',
    'Use solid surfaces for reduced transparency and defined borders for increased contrast.',
  ],
  selection: [
    'چک‌باکس برای انتخاب مستقل، رادیو برای یک گزینه و سوییچ برای تنظیم فوری است.',
    'Use checkboxes for independent choices, radio for one choice and switches for immediate settings.',
    'برچسب ثابت، ناحیهٔ کلیک کافی و وضعیت checked یا mixed؛ فقط رنگ کافی نیست.',
    'Keep labels stable, provide sufficient hit areas and expose checked or mixed state beyond color.',
  ],
  pickers: [
    'انتخابگر بر اساس طول فهرست و نوع داده انتخاب شود؛ امکان پاک‌کردن و حالت بدون نتیجه روشن باشد.',
    'Choose a picker for the data type and list length; make clearing and no-results states clear.',
    'نام کنترل‌های بازکردن و پاک‌کردن، رقم محلی و نام روزها را بررسی کنید.',
    'Name open/clear controls and support localized digits and day labels.',
  ],
  navigation: [
    'تب برای نماهای هم‌سطح، مسیر راهنما برای سلسله‌مراتب و صفحه‌بندی برای دادهٔ طولانی است.',
    'Use tabs for peer views, breadcrumbs for ancestry and pagination for longer data sets.',
    'گزینهٔ جاری معنایی باشد؛ تغییر نما نباید فوکوس را گم کند.',
    'Expose the current destination semantically and retain meaningful focus on view changes.',
  ],
  disclosure: [
    'عنوان باید بدون بازکردن محتوا قابل فهم باشد؛ اطلاعات ضروری را پنهان نکنید.',
    'Make headings understandable while collapsed; do not hide essential information.',
    'Enter و Space روی محرک؛ expanded و کنترل محتوای مرتبط مشخص باشند.',
    'Support Enter/Space on triggers and expose expanded state and the controlled content.',
  ],
  overlays: [
    'دیالوگ برای کار متمرکز؛ sheet برای جزئیات؛ popover برای محتوای کوتاه متصل به محرک.',
    'Use dialogs for focused tasks, sheets for details and popovers for short anchored content.',
    'عنوان قابل دسترس، Escape و مقصد فوکوس پس از بستن؛ حذف محرک هم پوشش داده شود.',
    'Provide an accessible title, Escape and focus restoration even when the trigger disappears.',
  ],
  cards: [
    'عنوان، اطلاعات و اقدام کارت سلسله‌مراتب روشن داشته باشند؛ ذخیره با اقدام اصلی تداخل نکند.',
    'Give card content and actions a clear hierarchy; keep bookmarking separate from the primary action.',
    'از دکمهٔ تو‌در‌تو پرهیز کنید؛ لینک و ذخیره نام مستقل و وضعیت قابل تشخیص داشته باشند.',
    'Avoid nested buttons; name links and bookmarks independently and expose their state.',
  ],
  data: [
    'جست‌وجو، فیلتر و مرتب‌سازی با هم کار کنند؛ فقط انتخاب ردیف‌ها در تغییر فیلتر بازنشانی شود.',
    'Compose search, filtering and sorting; reset only row selection when filters change.',
    'caption، سرستون، aria-sort و نام اقدام هر ردیف؛ نمودار نسخهٔ متنی داشته باشد.',
    'Provide captions, headers, aria-sort and named row actions; expose chart values as text.',
  ],
  states: [
    'خالی با بدون نتیجه فرق دارد؛ اقدام بازیابی به زمینهٔ صفحه مرتبط باشد و داده را پاک نکند.',
    'Distinguish empty from no results; recovery should match the context and preserve data.',
    'عنوان صفحه حفظ شود؛ loading با busy و نتیجهٔ عمل با پیام وضعیت اعلام شود.',
    'Keep the page heading; expose loading as busy and announce action results.',
  ],
  account: [
    'ویرایش تا ذخیره یک پیش‌نویس است؛ خطا و تغییر نما نباید آن را پاک کنند.',
    'Edits remain a draft until saved; errors and view changes must not discard them.',
    'برچسب و خطای فیلد، وضعیت ذخیره و جلوگیری از ارسال تکراری مشخص باشند.',
    'Expose labels, field errors, saving status and duplicate-submit prevention.',
  ],
});
export function SectionGuidance({ id }: { id: string }) {
  const { locale } = useDocumentation();
  const related: Record<string, string> = {
    materials: 'layout',
    selection: 'forms',
    pickers: 'forms',
    navigation: 'accessibility',
    disclosure: 'accessibility',
    overlays: 'feedback',
    cards: 'panels',
    data: 'panels',
    states: 'feedback',
    account: 'forms',
    catalog: 'resources',
  };
  const item = guidance[id] || guidance[related[id]];
  if (!item) return null;
  const fa = locale === 'fa';
  return (
    <div className="ds-contract">
      <article>
        <span>{fa ? 'قاعده استفاده' : 'Usage contract'}</span>
        <p>{item[fa ? 0 : 1]}</p>
      </article>
      <article>
        <span>{fa ? 'تعامل و دسترس‌پذیری' : 'Interaction & accessibility'}</span>
        <p>{item[fa ? 2 : 3]}</p>
      </article>
    </div>
  );
}
