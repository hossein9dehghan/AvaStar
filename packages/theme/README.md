# Avastar UI 3.1 — راهنمای طراحی و توسعه

دیزاین سیستم آوا استار برای لندینگ، پنل کاربری و پنل ادمین؛ فارسی/انگلیسی و تم روشن/تیره/سیستم.

## ساختار کیت

- `tokens.json`: منبع حقیقت طراحی؛ رنگ‌ها در `themes.light` و `themes.dark`.
- `avastar-tokens.css`: CSS تولیدشده؛ مستقیم ویرایش نشود.
- `avastar-fonts.css` و `fonts/`: فونت‌های پیدا، وزن‌های ۳۰۰، ۴۰۰، ۵۰۰، ۶۰۰ و ۷۰۰.
- `avastar-base.css`: پایه‌های صفحه، فوکوس، سطح‌های Radix و مدیریت RTL.
- `avastar-components.css`: دکمه، فیلد، کارت و وضعیت.
- `avastar-panels.css`: پوسته، جدول داده، جزئیات، تنظیمات و کارت دوره.
- `components/avastar-ui`: ThemeProvider، PanelShell و DataTable با قرارداد TypeScript.
- `components/ui`: اجزای shadcn/Radix مورد استفاده و وابستگی‌های محلی آن‌ها.
- `components/design-system/panel-demos.tsx`: نمونه پنل کاربری و ادمین با داده نمایشی.
- `lib/site.ts`، `lib/utils.ts`، `hooks/`: ابزارهای محلی مورد نیاز اجزا.
- `brand/`، `art/`: لوگو و تصویرهای برند.
- `scripts/`: تولید توکن و کنترل کنتراست.
- `starter.html`: پیش‌نمایش مستقل پایه‌ها در روشن و تیره.
- `DEPENDENCIES.json`: وابستگی‌های ثبت‌شده پروژه مرجع؛ فقط وابستگی‌های لازم برای اجزای منتقل‌شده را در پروژه مقصد نصب کنید.

## استفاده در React / Next

پوشه‌های `components`، `lib` و `hooks` را بدون تغییر importها به ریشه پروژه ببرید؛ alias `@/*` باید به همان ریشه اشاره کند. فایل‌های CSS، fonts و دارایی‌ها را با مسیرهای نسبی حفظ کنید. مسیرهای نمونه را با مسیر پروژه مقصد تطبیق دهید.

```tsx
import './avastar-fonts.css';
import './avastar-tokens.css';
import './avastar-base.css';
import './avastar-components.css';
import './avastar-panels.css';
import { ThemeProvider } from '@/components/avastar-ui/theme-provider';

// Persian document: lang="fa" dir="rtl"
// English document: lang="en" dir="ltr"
<ThemeProvider locale="fa">{children}</ThemeProvider>;
```

اجزای shadcn به React، Tailwind CSS 4، radix-ui، lucide-react، class-variance-authority، clsx و tailwind-merge نیاز دارند. اعلان‌ها از sonner استفاده می‌کنند؛ Toaster مرجع همچنین next-themes را import می‌کند. فایل `DEPENDENCIES.json` نسخه‌های دقیق مورد استفاده را ثبت می‌کند. کیت شامل node_modules نیست و یک برنامه آماده با backend نیست.

در Tailwind متغیرهای معنایی را map کنید؛ نمونه کامل `tailwind-theme.css` همراه کیت است. dark variant باید `data-theme="dark"` یا کلاس `.dark` را شناسایی کند. ThemeProvider هر دو را به‌روز می‌کند.

### تم و جلوگیری از فلش اولیه

حالت انتخابی در localStorage با کلید `avastar-ui-theme` و یک کوکی ترجیح ظاهر ذخیره می‌شود؛ کوکی راه جایگزین برای زمان محدودبودن localStorage است. `system` از prefers-color-scheme پیروی می‌کند و تغییر سیستم یا تب دیگر را دریافت می‌کند. اسکریپت `theme-init.js` را پیش از محتوای صفحه اجرا کنید. در محیط CSP دارای محدودیت، nonce یا hash مجاز پروژه خود را به این اسکریپت اختصاص دهید. این کیت سیاست امنیتی پروژه مقصد را تغییر نمی‌دهد.

### پوسته پنل

```tsx
const [view, setView] = useState<PanelView>('overview');
<PanelShell locale="fa" kind="admin" view={view} onViewChange={setView}>
  {view === 'overview' ? <Overview /> : <Settings />}
</PanelShell>;
```

اندازهٔ کنترل‌ها و گوشه‌های پیش‌فرض ۱۲ پیکسلی از توکن‌های مشترک می‌آیند. تغییر شکل برای یک زمینه باید صریح باشد؛ وجود یا نبود `av-panel` به‌تنهایی قرارداد دکمهٔ کپسولی نیست. سایدبار موبایل از Sheet واقعی استفاده می‌کند؛ منو با صفحه‌کلید قابل کنترل است.

### جدول عمومی

```tsx
const columns: Column<Row>[] = [
  { id: 'name', label: 'نام', cell: (row) => row.name, sortValue: (row) => row.name },
  { id: 'status', label: 'وضعیت', cell: (row) => <StatusBadge status={row.status} /> },
];
<DataTable
  rows={rows}
  columns={columns}
  locale="fa"
  caption="درخواست‌ها"
  rowLabel={(row) => row.id}
  searchText={(row) => `${row.name} ${row.id}`}
  onBulkAction={(selected) => openConfirmation(selected)}
/>;
```

هر ردیف `id` یکتا دارد. جدول جست‌وجو، مرتب‌سازی، صفحه‌بندی، انتخاب ردیف و حالت‌های loading/error/empty دارد. `onBulkAction` فقط انتخاب را تحویل می‌دهد؛ اجرای عملیات یا درخواست سرور وظیفه مصرف‌کننده است. جدول مرجع پردازش سمت کاربر دارد؛ برای حجم داده بالا، صفحه‌بندی و جست‌وجو را به API مقصد متصل و قرارداد داده را توسعه دهید.

### داده واقعی و دسترسی

نمونه‌ها اطلاعات ساختگی و مشخص‌شده دارند؛ تغییرات فقط در حافظه همان صفحه باقی می‌مانند. ThemeProvider فقط ترجیح تم را نگه می‌دارد. برای محصول واقعی، بارگذاری داده، اعتبارسنجی سمت سرور، احراز هویت و اجازه هر عملیات را پیاده کنید؛ پنهان‌کردن دکمه به معنی کنترل دسترسی نیست.

## تغییر توکن‌ها

در پروژه مرجع:

```sh
pnpm design:tokens
pnpm design:check
pnpm design:kit
```

در کیت استخراج‌شده:

```sh
node scripts/sync-design-tokens.mjs
node scripts/check-design-tokens.mjs
```

کنترل کنتراست ۴۸ ترکیب را در دو تم بررسی می‌کند: متن حداقل ۴٫۵:۱ و کادر ورودی/فوکوس حداقل ۳:۱. این کنترل جایگزین ممیزی محصول واقعی، حالت hover، تصویر زمینه یا تکنولوژی کمکی نیست.

## قواعد طراحی

- هویت ثابت: آبی #2D56C8، سرمه‌ای #172B64 و نارنجی #F7751D. رنگ‌های معنایی success/warning/error رنگ هویتی نیستند و برای عملکرد استفاده می‌شوند.
- در لایت، متن و وضعیت‌ها تیره‌تر و در دارک روشن‌ترند. آبی لوگو را برای نوشته ریز روی بوم تیره استفاده نکنید؛ از `--link` استفاده کنید.
- بدنه ۱۶–۱۸، برچسب و سلول جدول ۱۴–۱۶، متادیتا ۱۲–۱۳ پیکسل. فاصله حروف فارسی صفر است.
- وزن Light برای تیتر بزرگ، Regular/Medium برای داده و فرم. کنترل‌ها حداقل ۴۴ پیکسل هدف تعاملی دارند.
- spacing بر پایه ۴ پیکسل؛ حاشیه‌های منطقی inline-start/end برای RTL/LTR.
- مدال برای تصمیم، Sheet برای جزئیات، Toast برای بازخورد کوتاه. عملیات حساس باید تأیید یا راه بازگشت مناسب داشته باشد.
- تصویر سیاره مخصوص بوم تیره لندینگ است و نباید به پس‌زمینه جدول و پنل تبدیل شود.
- حالت reduced-motion، فوکوس واضح، برچسب مستقل و پیام خطای متصل به فیلد الزامی است.

## مهاجرت 1.x به 2.0

1. `tokens.semantic` با `tokens.themes[theme]` جایگزین شده است.
2. ThemeProvider قبلی که همیشه dark بود حذف شده؛ حالت روشن/تیره/سیستم مستقل است.
3. کلاس‌های av-button، av-field و av-card باقی مانده‌اند. av-badge--success اضافه شده؛ وضعیت‌ها از رنگ‌های معنایی استفاده می‌کنند.
4. وابستگی دیزاین سیستم به PathGuide، سه‌بعدی لندینگ و API ثبت درخواست حذف شده است.
5. مسیر قدیمی دیزاین سیستم در لندینگ به سایت مستقل هدایت می‌شود.
6. منبع اصلی توکن‌ها این پروژه است؛ هنگام ارتقا، tokens و CSS پایه را با هم به محصول‌های مصرف‌کننده منتقل کنید.

## English quick start

Avastar UI 3.1 provides a bilingual, light/dark/system design foundation. Import fonts, tokens, base styles, primitives and panel styles in order. Keep the `@/*` alias pointed at the project root, and configure the Tailwind theme using the included mapping. `ThemeProvider` stores only the theme preference and follows the operating system when set to `system`.

`PanelShell` is a responsive user/admin workspace wrapper. `DataTable<T>` accepts rows with unique IDs and typed column renderers; it supports client-side search, sorting, pagination, selection and loading/error/empty states. Connect callbacks to your own backend. The included demo panels deliberately use in-memory sample data and do not supply authentication or server-side authorization.

Edit `tokens.json`, regenerate CSS and run the contrast checks together. v2 replaces `semantic` with `themes.light` and `themes.dark`. Avoid editing generated CSS. Review changes in both languages, both themes, keyboard interaction and narrow layouts before adoption.

Fonts and logos originate from the files supplied for this project. Keep their original license terms when reusing them. Planet images are generated brand illustrations. This kit does not imply rights outside those original terms.

References: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html and https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

## نسخه 3.0

مرجع بخش‌بندی‌شده، جست‌وجوی فارسی/انگلیسی، قرارداد استفاده و تعامل برای هر بخش، و راهنمای استانداردها اضافه شده است. API اجزای 2.0 و نام توکن‌ها تغییری نکرده‌اند. قواعد تحویل و منابع رسمی در `DESIGN-CONTRACTS.md` آمده‌اند. این کیت گواهی انطباق کامل دسترس‌پذیری نیست.

## UI 3

- ناوبری درختی با یک شاخه باز و اسکرول‌بار مخفی؛ ۲۵ بخش مستقل.
- فهرست ۴۵ جزء و الگو همراه با حالت‌های تعامل و لینک نمونه.
- `ViewStatePanel`: loading، empty، no-results، error، offline، forbidden و success.
- `useSpringValue`: فنر با میرایی بحرانی، حفظ موقعیت و سرعت هنگام تغییر جهت.
- پنل‌ها دادهٔ نمایشی دارند؛ تغییرات تا بارگذاری مجدد صفحه در حافظه باقی می‌مانند.
- رنگ‌ها، کنترل‌ها و حالت‌های reduced-motion، reduced-transparency و increased-contrast مشترک‌اند.
- نمونه‌های مستندات به `design-system.css` و تنظیم Tailwind نیاز دارند؛ خروجی HTML مستقل فقط مبانی CSS را نشان می‌دهد.

## نسخهٔ 3.1 — سطوح تمام‌عرض و قرارداد اجزا

- پوستهٔ مستندات و پنل از عرض موجود استفاده می‌کند؛ فقط متن توضیحی و فرم طولانی عرض خوانا دارند.
- فاصله‌ها، لایه‌ها، تایپوگرافی و اندازه‌های layout به CSS تولید می‌شوند. متغیر CSS در شرط media query قابل استفاده نیست؛ breakpointهای ساختاری در CSS ثابت‌اند و مقدارشان در tokens.json مستند است.
- ThemeProvider، زبان کنترل‌های کمکی را با UiLocaleProvider تأمین می‌کند؛ مصرف‌کنندهٔ بدون مدیریت تم می‌تواند فقط UiLocaleProvider را استفاده کند.
- تغییر فیلتر جدول، query/sort را حفظ می‌کند. selectionResetKey فقط انتخاب ردیف را پاک می‌کند؛ remount جدول فقط برای بازنشانی صریح دمو است.
- ViewStatePanel برای CTA زمینه‌مند، title/description/actionLabel می‌گیرد. بازگشت از حالت خالی نباید پیشرفت یا ویرایش را پاک کند.
- NumberField و ErrorSummary قابل استفادهٔ مستقل‌اند. OTP فارسی/عربی در نمونه به رقم استاندارد نرمال می‌شود.
- تقویم دو حالت شمسی و میلادی دارد؛ سرویس آپلود و احراز هویت واقعی به این دمو اضافه نشده‌اند.
- کنترل پیش‌فرض: ۴۸، کوچک: ۴۴ و بزرگ: ۵۶ پیکسل. خانه‌های تقویم در عرض کم به شبکهٔ هفت‌ستونه پاسخ می‌دهند و حداقل ارتفاع ۴۴ دارند؛ OTP یک ورودی واحد با شش خانهٔ بصری است.
- سورس کامل نمونه‌ها در source/ و کیت موجود است. قطعه‌کدهای کوتاهِ صفحه، فایل کامل مستقل نیستند.
- قرارداد ۴۷ جزء/الگو، نام فارسی، کاربرد، API و رفتار کیبورد را کنار نمونه‌ها ارائه می‌کند.

منابع بررسی رفتار: [W3C Dialog APG](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)، [GOV.UK Error summary](https://design-system.service.gov.uk/components/error-summary/)، [Carbon component catalog](https://carbondesignsystem.com/components/overview/components/).

### Tabs and language controls

`TabsList variant="default"` is a segmented control for compact view choices. Use `variant="line"` for peer sections of a page. Tab targets are at least 44px; long groups scroll inside their own list without widening the page. Arrow keys follow `dir`, Home/End skip disabled tabs, and both variants expose the selected state independently of color. Import `avastar-components.css` for the shared geometry and states.

`LanguageSwitch` accepts `locale` and the complete destination `href`. Pass the active section and component fragment to preserve the reading location. It displays the destination language in its native script, uses a translation icon, and has a localized accessible name.


### Optical materials

Import `avastar-materials.css` after `avastar-components.css`. `MaterialSurface` from `@avastar/ui/material-surface` supports `material="light" | "frosted" | "solid"` and `reducedTransparency`. Use light glass for small scene controls, frosted glass for floating navigation, and dense surfaces for forms and tables. Never nest transparent surfaces. Both themes define fill, edge, highlight, shadow and readable secondary text; tests composite text against black and white backdrops. Reduced transparency, increased contrast, forced colors and missing backdrop-filter support have opaque alternatives. The interactive Materials section demonstrates backgrounds, selection, disabled controls and keyboard focus.
