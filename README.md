# آوا استار · AvaStar

لندینگ نجومی و دیزاین سیستم مشترک، با Next.js، React، TypeScript، Tailwind و اجزای shadcn/Radix. فارسی و انگلیسی. لندینگ فقط تیره؛ دیزاین سیستم و پنل‌های نمونه روشن، تیره و تابع سیستم.

## ساختار

| مسیر                 | کاربرد                                                         |
| -------------------- | -------------------------------------------------------------- |
| `apps/web`           | لندینگ، حرکت عمقی، سیاره‌ها، محتوا و API درخواست مشاوره        |
| `apps/design-system` | مستندات و نمونه‌های پنل کاربر و ادمین؛ مقصد ساب‌دامین `design` |
| `packages/ui`        | اجزای پایه و اجزای مشترک جدول، پوسته پنل و مدیریت تم           |
| `packages/theme`     | منبع واحد توکن‌های رنگ و CSS مشترک                             |
| `packages/assets`    | فونت‌های پیدا، لوگوهای برند و تصاویر کیهانی                    |
| `packages/config`    | آدرس دامنه اصلی و ساب‌دامین                                    |
| `database`           | ساختار SQL فرم مشاوره                                          |

## اجرا

Node.js 22.13+ و pnpm 11.25.0:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

لندینگ: `http://localhost:3000/fa` · دیزاین سیستم: `http://localhost:3001/fa`

برای انگلیسی از `/en` استفاده کنید. صفحه‌های نمونه پنل در دیزاین سیستم: `/fa/panels/admin` و `/fa/panels/user`. داده‌های پنل نمایشی و محلی‌اند؛ پنل ادمین عملیاتی یا سامانه احراز هویت نیستند.

## Vercel و ساب‌دامین

ریپازیتوری را برای دو Project وارد کنید:

| Project       | Root Directory       | دامنه                  |
| ------------- | -------------------- | ---------------------- |
| Landing       | `apps/web`           | دامنهٔ اصلی شما        |
| Design system | `apps/design-system` | `design.` + همان دامنه |

Preset هر دو `Next.js` است. Build Command در `vercel.json` هر اپ تعریف شده است. گزینه **Include source files outside of the Root Directory** باید فعال باشد تا بسته‌های مشترک در دسترس باشند. در هر دو پروژه `NEXT_PUBLIC_SITE_URL` را به آدرس HTTPS دامنه اصلی تنظیم کنید؛ آدرس دیزاین سیستم خودکار با پیشوند `design.` ساخته می‌شود. `NEXT_PUBLIC_DESIGN_SYSTEM_URL` فقط برای تغییر این قرارداد لازم است. مقادیر `example.com` در فایل‌های نمونه، دامنهٔ واقعی پروژه نیستند.

[راهنمای کامل Vercel، DNS و دیتابیس](docs/vercel.md)

## نگهداری

```sh
pnpm design:tokens   # تولید CSS و انتشار دارایی‌های مشترک به هر دو اپ
pnpm design:check    # بررسی کنتراست و هماهنگی توکن‌های دو تم
pnpm typecheck
pnpm test           # بررسی خطاها و پارامترهای ارتباط دیتابیس
pnpm build          # ساخت مستقل هر دو اپ با Next.js
pnpm format
pnpm design:kit     # بازسازی کیت دانلودی از سورس فعلی
```

دارایی‌های `apps/*/public` تولیدی‌اند و در Git تکرار نمی‌شوند. Build هر اپ آن‌ها را از بسته‌های مشترک آماده می‌کند. بعد از تغییر توکن‌ها یا اجزای مشترک، کیت را دوباره بسازید و سپس Build بگیرید. استایل‌های اختصاصی لندینگ در اپ لندینگ می‌مانند.

## حرکت و نمایش لندینگ

سیاره‌ها با WebGL و بافت‌های سطحی روی کره‌های سه‌بعدی نمایش داده می‌شوند و با درگ موس می‌چرخند. در نبود WebGL، نسخهٔ تصویری جایگزین نمایش داده می‌شود. حرکت ستاره‌ها به موس و پیشروی در سفر واکنش دارد؛ ورود و خروج متن‌ها قابل برگشت است. حالت کاهش حرکت رعایت می‌شود و ترکیب سیاره و متن در نمایشگرهای بزرگ به عرض ۱۴۴۰ پیکسل محدود می‌ماند.

منبع و مجوز بافت‌ها در `packages/assets/art/textures/CREDITS.txt` آمده است.

## فرم مشاوره

API روی runtime استاندارد Node.js اجرا می‌شود و برای ذخیرهٔ پایدار از D1 REST استفاده می‌کند. سه متغیر محرمانهٔ ذکرشده در راهنمای استقرار را در پروژهٔ لندینگ تنظیم کنید. بدون تنظیم دیتابیس، API خطای 503 می‌دهد و موفقیت ساختگی نشان نمی‌دهد. اطلاعات قبلی نسخهٔ Sites در این ریپازیتوری کپی نشده‌اند.

## UI 3 release

The interface uses shared semantic tokens, immediate press feedback, reversible springs, restrained translucent navigation and light/dark materials. Persian typography keeps zero tracking.

- 25 documentation sections with an accordion navigation tree and hidden overflow scrollbars.
- 45 components and patterns in the searchable state inventory.
- User and admin demo workspaces preserve edits between views; data remains in memory.
- User course bookmarks, lesson progress and completed courses; account dirty/saving/error/success flows.
- 48 text, hover, input and focus contrast checks across both themes.
- `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast` fallbacks.
