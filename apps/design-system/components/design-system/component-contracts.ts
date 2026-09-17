export const inventory = [
  ['Button', 'buttons', 'default · hover · pressed · focus · disabled · loading · success'],
  ['Icon button', 'buttons', 'default · tooltip · focus · disabled'],
  ['Input', 'forms', 'empty · filled · hover · focus · readonly · disabled · invalid · valid'],
  ['Textarea', 'forms', 'empty · filled · focus · readonly · disabled · invalid · valid'],
  ['Number input', 'forms', 'value · minimum · maximum · disabled'],
  ['Error summary', 'forms', 'hidden · invalid · links · focus · recovered'],
  ['Form validation', 'forms', 'pristine · touched · invalid · valid'],
  ['Checkbox', 'selection', 'unchecked · checked · indeterminate · disabled'],
  ['Switch', 'selection', 'off · on · disabled'],
  ['Radio group', 'selection', 'unselected · selected · disabled'],
  ['Slider', 'selection', 'value · keyboard · drag · disabled'],
  ['Toggle group', 'selection', 'off · on · multiple · disabled'],
  ['Select', 'pickers', 'placeholder · selected · open · disabled option · disabled'],
  ['Combobox', 'pickers', 'empty · searching · selected · no results · clear'],
  ['Calendar', 'pickers', 'unselected · selected · unavailable · clear'],
  ['File input', 'pickers', 'empty · selected · invalid type · too large'],
  ['Input OTP', 'pickers', 'empty · partial · complete · paste'],
  ['Tabs', 'navigation', 'active · inactive · disabled · keyboard'],
  ['Breadcrumb', 'navigation', 'ancestor · current · RTL'],
  ['Pagination', 'navigation', 'first · middle · last · disabled'],
  ['Tree navigation', 'overview', 'collapsed · expanded · current · mobile'],
  ['Accordion', 'disclosure', 'collapsed · expanded · disabled'],
  ['Collapsible', 'disclosure', 'closed · open'],
  ['Tooltip', 'disclosure', 'hidden · hover · focus'],
  ['Hover card', 'disclosure', 'hidden · open · fallback link'],
  ['Dialog', 'overlays', 'closed · open · dismiss · focus return'],
  ['Alert dialog', 'overlays', 'open · cancel · confirm · restore'],
  ['Sheet', 'overlays', 'closed · open · RTL · dismiss'],
  ['Drawer', 'overlays', 'closed · open · drag · dismiss · reduced motion'],
  ['Dropdown menu', 'overlays', 'open · closed · selected · disabled'],
  ['Popover', 'overlays', 'closed · open · anchored'],
  ['Context menu', 'overlays', 'open · disabled item · long press'],
  ['Card', 'cards', 'default · selected · action · complete'],
  ['Avatar', 'cards', 'image · initials · icon fallback · sizes'],
  ['Badge', 'cards', 'neutral · information · success · warning · error'],
  ['Data table', 'data', 'ready · sorted · selected · loading · empty · error'],
  ['Chart', 'data', 'labeled values · zero · partial · complete'],
  ['Progress', 'cards', 'zero · partial · complete'],
  ['Skeleton', 'feedback', 'loading · reduced motion'],
  ['Alert', 'feedback', 'information · warning · error · success'],
  ['Toast', 'feedback', 'success · warning · error · information · dismiss'],
  ['Command search', 'overview', 'closed · query · results · no results · keyboard'],
  ['Theme control', 'colors', 'light · dark · system · persisted'],
  [
    'Page state',
    'states',
    'ready · loading · empty · no results · error · offline · restricted · success',
  ],
  ['Account form', 'account', 'unchanged · dirty · invalid · saving · failed · saved'],
  ['Panel shell', 'panels', 'user · admin · desktop · mobile · active view'],
  ['Spring', 'materials', 'idle · moving · interrupted · reversed · reduced motion'],
] as const;

export const contractDetails: Record<
  string,
  { fa: string; usage: [string, string]; keyboard: [string, string]; api: string }
> = {
  Button: {
    fa: 'دکمه',
    usage: [
      'اجرای یک اقدام؛ برای تغییر صفحه از لینک استفاده کنید.',
      'Perform an action; use a link for navigation.',
    ],
    keyboard: [
      'Enter و Space؛ بارگذاری از ارسال دوباره جلوگیری کند.',
      'Enter and Space; loading prevents duplicate submission.',
    ],
    api: 'variant="default" | "outline" | "ghost"; size; disabled=false; onClick; aria-busy; className',
  },
  'Icon button': {
    fa: 'دکمهٔ آیکونی',
    usage: [
      'برای اقدام آشنا همراه نام قابل دسترس و راهنمای کوتاه.',
      'A familiar action with an accessible name and brief tooltip.',
    ],
    keyboard: [
      'Tab برای فوکوس؛ Enter/Space برای اجرا؛ نام مستقل لازم است.',
      'Tab to focus; Enter/Space to activate; provide an accessible name.',
    ],
    api: 'Button + className="av-button av-button--icon"; aria-label; disabled',
  },
  Input: {
    fa: 'ورودی متن',
    usage: [
      'برای پاسخ کوتاه با برچسب دائمی و راهنمای مرتبط.',
      'A short answer with a persistent label and associated help.',
    ],
    keyboard: [
      'Tab، ویرایش و انتخاب بومی؛ خطا به فیلد متصل باشد.',
      'Native editing and selection; associate errors with the field.',
    ],
    api: 'id; type="text"; value/defaultValue; onChange; readOnly; disabled; aria-invalid; aria-describedby',
  },
  Textarea: {
    fa: 'متن چندخطی',
    usage: [
      'برای پیام بلند؛ محدودیت واقعی را با شمارش نویسه نشان دهید.',
      'Longer messages; show a count when a real limit exists.',
    ],
    keyboard: [
      'Enter خط تازه؛ Tab خروج؛ تغییر اندازه فقط عمودی.',
      'Enter inserts a line; Tab exits; allow vertical resizing.',
    ],
    api: 'rows; value/defaultValue; onChange; readOnly; disabled; aria-invalid; aria-describedby; className="av-field"',
  },
  'Form validation': {
    fa: 'اعتبارسنجی فرم',
    usage: [
      'خطا را نزدیک پاسخ و در فرم طولانی در خلاصه نشان دهید.',
      'Show errors next to answers and in a summary for longer forms.',
    ],
    keyboard: [
      'پس از ارسال نامعتبر، به خلاصه یا اولین فیلد خطادار بروید.',
      'On invalid submit, focus the summary or first invalid field.',
    ],
    api: 'form: onSubmit; noValidate; input: aria-invalid; aria-describedby; preserve values',
  },
  Checkbox: {
    fa: 'چک‌باکس',
    usage: [
      'انتخاب مستقل یا انتخاب گروهی با حالت نیمه‌انتخاب.',
      'Independent choices or a mixed group selection.',
    ],
    keyboard: [
      'Space وضعیت را عوض می‌کند؛ برچسب هم قابل کلیک است.',
      'Space toggles; the label is also clickable.',
    ],
    api: 'checked: boolean | "indeterminate"; onCheckedChange; defaultChecked; disabled; required',
  },
  Switch: {
    fa: 'سوییچ',
    usage: [
      'تغییر فوری تنظیم روشن/خاموش؛ نتیجه باید همان لحظه روشن باشد.',
      'Immediately change an on/off setting with visible feedback.',
    ],
    keyboard: [
      'Space و Enter؛ برچسب ثابت و وضعیت checked اعلام شود.',
      'Space and Enter; keep the label stable and expose checked state.',
    ],
    api: 'checked/defaultChecked; onCheckedChange; disabled; name; dir',
  },
  'Radio group': {
    fa: 'گروه انتخاب تکی',
    usage: ['یک انتخاب از مجموعهٔ کوچک و مرتبط.', 'One choice from a small related set.'],
    keyboard: [
      'کلیدهای جهت بین گزینه‌ها؛ Space انتخاب؛ Tab خروج از گروه.',
      'Arrow keys move between choices; Space selects; Tab exits the group.',
    ],
    api: 'RadioGroup: value/defaultValue; onValueChange; dir; aria-label; RadioGroupItem: value; disabled',
  },
  Slider: {
    fa: 'لغزنده',
    usage: [
      'انتخاب مقدار تقریبی در بازه؛ مقدار فعلی را هم نمایش دهید.',
      'An approximate value within a range; display the current value.',
    ],
    keyboard: [
      'کلید جهت، Home و End؛ نام و مقدار برای صفحه‌خوان.',
      'Arrow keys, Home and End; expose the label and value.',
    ],
    api: 'value: number[]; onValueChange; min=0; max=100; step=1; disabled; dir',
  },
  'Toggle group': {
    fa: 'گروه دکمهٔ انتخاب',
    usage: [
      'انتخاب تکی یا چندتایی گزینه‌های هم‌نوع مثل قالب متن.',
      'Single or multiple related choices such as text formatting.',
    ],
    keyboard: [
      'کلید جهت برای حرکت؛ Space/Enter برای انتخاب.',
      'Arrow keys navigate; Space/Enter toggle a choice.',
    ],
    api: 'type="single" | "multiple"; value; onValueChange; variant; disabled; aria-label',
  },
  Select: {
    fa: 'انتخابگر',
    usage: [
      'گزینه‌های از پیش تعیین‌شده؛ برای جست‌وجوی طولانی از Combobox استفاده کنید.',
      'A fixed option set; use Combobox for searchable lists.',
    ],
    keyboard: ['جهت‌ها، تایپ حرف، Enter و Escape.', 'Arrow keys, type-ahead, Enter and Escape.'],
    api: 'value/defaultValue; onValueChange; disabled; dir; SelectItem: value; disabled',
  },
  Combobox: {
    fa: 'انتخابگر جست‌وجوشونده',
    usage: [
      'جست‌وجوی شهر و انتخاب از فهرست؛ بدون نتیجه را توضیح دهید.',
      'Search and choose an item; explain when no results match.',
    ],
    keyboard: [
      'جهت‌ها و Enter انتخاب؛ Escape بستن؛ پاک‌کردن دارای نام.',
      'Arrows and Enter select; Escape closes; name the clear action.',
    ],
    api: 'items; value; onValueChange; multiple; ComboboxInput: showClear=false; showTrigger=true; disabled',
  },
  Calendar: {
    fa: 'تقویم',
    usage: [
      'تاریخ با تقویم مشخص و روزهای غیرقابل انتخاب روشن.',
      'Select a date in an explicitly named calendar with unavailable days.',
    ],
    keyboard: [
      'جهت‌ها بین روزها؛ PageUp/PageDown بین ماه‌ها؛ Enter انتخاب.',
      'Arrows move dates; PageUp/PageDown change months; Enter selects.',
    ],
    api: 'mode="single" | "range"; selected; onSelect; disabled; locale; dir; labels; numerals',
  },
  'File input': {
    fa: 'انتخاب فایل',
    usage: [
      'نوع و حجم مجاز را پیش از انتخاب بگویید؛ این نمونه فایل ارسال نمی‌کند.',
      'State allowed types and size before selection; this demo does not upload.',
    ],
    keyboard: [
      'کنترل بومی با کیبورد؛ نتیجه یا خطا کنار فیلد اعلام شود.',
      'Use the native keyboard picker; announce the result or error beside it.',
    ],
    api: 'input: type="file"; accept; onChange; disabled; aria-invalid; aria-describedby',
  },
  'Input OTP': {
    fa: 'کد یک‌بارمصرف',
    usage: [
      'یک ورودی شش‌رقمی با خانه‌های بصری؛ رقم فارسی و عربی هم پذیرفته شود.',
      'One six-digit input rendered as slots; accept Persian and Arabic digits.',
    ],
    keyboard: [
      'تایپ، چسباندن، جهت‌ها و Backspace در یک ورودی.',
      'Typing, paste, arrows and Backspace operate one input.',
    ],
    api: 'maxLength=6; value; onChange; pattern; inputMode="numeric"; aria-describedby',
  },
  Tabs: {
    fa: 'تب',
    usage: [
      'تعویض نماهای هم‌سطح؛ محتوای مرتبط به تب فعال متصل باشد.',
      'Switch peer views; associate content with the active tab.',
    ],
    keyboard: [
      'جهت‌ها مطابق RTL/LTR؛ Home/End؛ گزینهٔ غیرفعال رد شود.',
      'Direction-aware arrows, Home/End; skip disabled tabs.',
    ],
    api: 'value/defaultValue; onValueChange; dir; orientation; TabsList: variant="default" | "line"; TabsTrigger: value; disabled; TabsContent: value',
  },
  Breadcrumb: {
    fa: 'مسیر راهنما',
    usage: [
      'مسیر والد تا صفحهٔ فعلی؛ برای گام‌های یک فرم مناسب نیست.',
      'Show ancestry to the current page, not steps in a form.',
    ],
    keyboard: [
      'لینک‌های والد در Tab؛ صفحهٔ جاری لینک تکراری نباشد.',
      'Parent links are tabbable; the current page is not a redundant link.',
    ],
    api: 'Breadcrumb; BreadcrumbList; BreadcrumbItem; BreadcrumbLink; BreadcrumbPage; BreadcrumbSeparator',
  },
  Pagination: {
    fa: 'صفحه‌بندی',
    usage: [
      'حرکت بین صفحه‌های داده با شمارش و مرز مشخص.',
      'Move through paged results with a clear count and boundaries.',
    ],
    keyboard: [
      'Enter اجرا؛ قبلی/بعدی در دو انتها غیرفعال.',
      'Enter activates; disable previous/next at the boundaries.',
    ],
    api: 'page; pageSize; total; onPageChange; buttons: disabled; aria-label; aria-current="page"',
  },
  'Tree navigation': {
    fa: 'ناوبری گروهی',
    usage: [
      'دسته‌ها را کوتاه نگه دارید؛ بخش جاری و شاخهٔ باز مشخص باشند.',
      'Keep groups compact and expose the current section and open branch.',
    ],
    keyboard: [
      'Tab برای لینک‌ها؛ Enter/Space برای بازکردن گروه.',
      'Tab reaches links; Enter/Space expands a group.',
    ],
    api: 'TreeNavigation: locale; active; onNavigate; links: aria-current; collapsible trigger: aria-expanded',
  },
  Accordion: {
    fa: 'آکاردئون',
    usage: [
      'گروه‌های محتوای مستقل با عنوان روشن و قابل اسکن.',
      'Independent content groups with clear, scannable titles.',
    ],
    keyboard: [
      'Enter/Space باز و بسته؛ فوکوس روی عنوان باقی می‌ماند.',
      'Enter/Space expands or collapses; focus stays on the heading.',
    ],
    api: 'type="single" | "multiple"; collapsible; value/defaultValue; AccordionItem: value; disabled',
  },
  Collapsible: {
    fa: 'بخش بازشونده',
    usage: [
      'یک جزئیات مکمل که بدون آن هم مسیر اصلی کامل است.',
      'Supplementary detail that is not required to understand the main flow.',
    ],
    keyboard: [
      'Enter/Space؛ وضعیت expanded باید اعلام شود.',
      'Enter/Space; expose expanded state.',
    ],
    api: 'open/defaultOpen; onOpenChange; disabled; CollapsibleTrigger; CollapsibleContent',
  },
  Tooltip: {
    fa: 'راهنمای کوتاه',
    usage: [
      'توضیح کوتاهِ کنترل؛ اطلاعات ضروری فقط در tooltip نباشد.',
      'Brief control help; do not hide essential information only in a tooltip.',
    ],
    keyboard: ['با فوکوس و hover باز؛ Escape بستن.', 'Open on focus or hover; Escape dismisses.'],
    api: 'TooltipProvider: delayDuration; Tooltip; TooltipTrigger asChild; TooltipContent: side',
  },
  'Hover card': {
    fa: 'کارت پیش‌نمایش',
    usage: [
      'پیش‌نمایش محتوای یک لینک؛ خود لینک همیشه قابل استفاده بماند.',
      'Preview a link destination while keeping the link usable.',
    ],
    keyboard: [
      'لینک با کیبورد قابل اجرا؛ اطلاعات ضروری در مقصد نیز هست.',
      'The link remains keyboard-usable; essential information also exists at the destination.',
    ],
    api: 'open/defaultOpen; onOpenChange; openDelay; closeDelay; HoverCardTrigger; HoverCardContent',
  },
  Dialog: {
    fa: 'گفتگو',
    usage: [
      'یک تصمیم یا کار متمرکز؛ عنوان و راه بستن مشخص.',
      'One focused task or decision with a title and clear dismissal.',
    ],
    keyboard: [
      'Tab محصور، Escape بستن، بازگشت فوکوس با مقصد جایگزین.',
      'Trap Tab, Escape dismisses, restore focus with a fallback.',
    ],
    api: 'open/defaultOpen; onOpenChange; DialogTitle; DialogDescription; onOpenAutoFocus; onCloseAutoFocus',
  },
  'Alert dialog': {
    fa: 'تأیید اقدام حساس',
    usage: [
      'پیش از اقدام برگشت‌ناپذیر، پیامد را دقیق بگویید.',
      'Explain the consequence before an irreversible action.',
    ],
    keyboard: [
      'فوکوس اولیه روی انصراف؛ Enter/Space انتخاب؛ بازگشت فوکوس.',
      'Initially focus cancel; Enter/Space chooses; restore focus.',
    ],
    api: 'open; onOpenChange; AlertDialogTitle; AlertDialogDescription; AlertDialogCancel; AlertDialogAction',
  },
  Sheet: {
    fa: 'پنل جزئیات',
    usage: [
      'جزئیات رکورد در زمینهٔ همان فهرست.',
      'Inspect a record without losing the surrounding list context.',
    ],
    keyboard: [
      'فوکوس محصور و Escape؛ پس از حذف ردیف به فهرست برگردید.',
      'Trap focus and support Escape; return to the list if the row disappears.',
    ],
    api: 'open; onOpenChange; side; showCloseButton=true; onCloseAutoFocus; SheetTitle',
  },
  Drawer: {
    fa: 'کشوی لمسی',
    usage: [
      'یک کار کوتاه در سطح پایین صفحه با امکان بستن بدون drag.',
      'A short task in a bottom surface with a non-drag dismissal option.',
    ],
    keyboard: [
      'دکمهٔ بستن و Escape؛ drag مسیر جایگزین دارد.',
      'Provide a close button and Escape as alternatives to dragging.',
    ],
    api: 'open; onOpenChange; direction; dismissible; DrawerTitle; DrawerClose',
  },
  'Dropdown menu': {
    fa: 'منوی عملیات',
    usage: [
      'اقدام‌های مرتبط با یک محرک، نه فرم طولانی.',
      'Related actions from one trigger, not a long form.',
    ],
    keyboard: [
      'جهت‌ها، Home/End، Enter و Escape؛ گزینهٔ غیرفعال رد شود.',
      'Arrows, Home/End, Enter and Escape; skip disabled actions.',
    ],
    api: 'DropdownMenu; DropdownMenuTrigger; DropdownMenuItem: onSelect; disabled; CheckboxItem: checked',
  },
  Popover: {
    fa: 'پنجرهٔ شناور',
    usage: [
      'اطلاعات یا تنظیم کوتاه متصل به محرک با عنوان قابل دسترس.',
      'Small anchored information or settings with an accessible title.',
    ],
    keyboard: [
      'Tab طبق نوع محتوا؛ Escape؛ بازگشت به محرک.',
      'Tab follows content; Escape dismisses and returns to the trigger.',
    ],
    api: 'open; onOpenChange; modal=false; PopoverContent: side; align; aria-labelledby',
  },
  'Context menu': {
    fa: 'منوی زمینه',
    usage: [
      'میانبرِ اقدام‌ها؛ راه عادی انجام همان کار نیز وجود داشته باشد.',
      'Shortcut actions that are also available through a regular route.',
    ],
    keyboard: [
      'راست‌کلیک/لمس طولانی؛ جهت‌ها، Enter و Escape داخل منو.',
      'Right-click/long press; arrows, Enter and Escape inside the menu.',
    ],
    api: 'ContextMenu; ContextMenuTrigger; ContextMenuContent; ContextMenuItem: onSelect; disabled',
  },
  Card: {
    fa: 'کارت',
    usage: [
      'محتوای هم‌موضوع با اقدام اصلی مشخص؛ دکمه‌های داخلی مستقل.',
      'Related content with one clear primary action and independent secondary buttons.',
    ],
    keyboard: [
      'فقط لینک/دکمه قابل فوکوس؛ کارت تعاملی نام مشخص داشته باشد.',
      'Focus links and buttons; give interactive cards clear names.',
    ],
    api: 'className="av-card"; native link/button for actions; selected state: aria-pressed',
  },
  Avatar: {
    fa: 'آواتار',
    usage: [
      'هویت فرد با تصویر، حروف اول و fallback قابل اعتماد.',
      'Identify a person with an image, initials and reliable fallback.',
    ],
    keyboard: [
      'آواتار تزئینی از فوکوس خارج؛ اقدام پروفایل لینک مستقل.',
      'Decorative avatars are not focusable; use a separate profile link.',
    ],
    api: 'Avatar; AvatarImage: src; alt; AvatarFallback; size via className',
  },
  Badge: {
    fa: 'نشان وضعیت',
    usage: [
      'وضعیت کوتاه با متن؛ رنگ تنها حامل معنا نیست.',
      'A short text status; color is not the only cue.',
    ],
    keyboard: [
      'نشان غیرتعاملی وارد Tab نشود.',
      'Non-interactive badges do not enter the Tab order.',
    ],
    api: 'className="av-badge av-badge--success | --warning | --error | --info"; text; decorative icon',
  },
  'Data table': {
    fa: 'جدول داده',
    usage: [
      'دادهٔ قابل مقایسه با جست‌وجو، مرتب‌سازی، انتخاب و بازیابی.',
      'Comparable data with search, sort, selection and recovery.',
    ],
    keyboard: [
      'سرستون با aria-sort؛ اقدام ردیف دارای نام؛ فیلتر query را حفظ کند.',
      'Use aria-sort, name row actions and preserve query across filters.',
    ],
    api: 'rows; columns; locale; caption; searchText; rowLabel; pageSize=5; loading; error; onRetry; onBulkAction; selectionResetKey',
  },
  Chart: {
    fa: 'نمودار',
    usage: [
      'روند یا مقایسه؛ مقادیر متنی کنار نمایش بصری در دسترس باشند.',
      'Show trends or comparisons with text values alongside the visual.',
    ],
    keyboard: [
      'اطلاعات به hover وابسته نباشد؛ برچسب و مقدار متنی موجود باشد.',
      'Do not require hover; expose labels and text values.',
    ],
    api: 'Native labeled bars or chart data; accessible label; textual values; empty/zero handling',
  },
  Progress: {
    fa: 'پیشرفت',
    usage: [
      'پیشرفت قابل اندازه‌گیری؛ درصد و برچسب در کنار نوار.',
      'Measurable completion with a label and percentage beside the bar.',
    ],
    keyboard: [
      'progressbar غیرتعاملی؛ aria-valuenow/min/max و نام روشن.',
      'Non-interactive progressbar with a clear name and value range.',
    ],
    api: 'value: number; max=100; aria-label; className; adjacent formatted percentage',
  },
  Skeleton: {
    fa: 'اسکلت بارگذاری',
    usage: [
      'فضای پایدار تا رسیدن داده؛ محتوای نهایی را جابه‌جا نکند.',
      'Reserve stable space while content loads to reduce layout shifts.',
    ],
    keyboard: [
      'غیرقابل فوکوس؛ ناحیهٔ والد busy و متن وضعیت دارد.',
      'Not focusable; the parent exposes busy state and a status message.',
    ],
    api: 'className for dimensions; parent: aria-busy=true; role="status"; reduced motion',
  },
  Alert: {
    fa: 'پیام درون‌صفحه',
    usage: [
      'پیام مهم نزدیک زمینه؛ خطا نباید فقط toast باشد.',
      'Important contextual feedback; errors must not rely only on toasts.',
    ],
    keyboard: [
      'پیام فوری role=alert؛ اقدام اصلاحی لینک یا دکمهٔ مستقل.',
      'Urgent messages use alert; recovery is a separate link or button.',
    ],
    api: 'Alert; AlertTitle; AlertDescription; variant; role; action button',
  },
  Toast: {
    fa: 'اعلان موقت',
    usage: [
      'تأیید کوتاه یا اطلاع؛ اطلاعات لازم برای ادامه در صفحه هم باشد.',
      'Brief confirmation; keep essential follow-up information on the page.',
    ],
    keyboard: [
      'اعلان وضعیت؛ دکمهٔ بستن و اقدام دارای نام.',
      'Announce status; name close and action buttons.',
    ],
    api: 'toast.success/info/warning/error(message, options); duration; action; dismiss',
  },
  'Command search': {
    fa: 'جست‌وجوی عمومی',
    usage: [
      'نام فارسی/انگلیسی بخش یا جزء را جست‌وجو کنید.',
      'Find a section or component by Persian or English name.',
    ],
    keyboard: [
      'Ctrl/Cmd+K؛ فوکوس اولیه ورودی؛ جهت‌ها و Enter؛ Escape.',
      'Ctrl/Cmd+K; initially focus input; arrows/Enter select; Escape closes.',
    ],
    api: 'Command: filter; CommandInput; CommandList; CommandItem: value; onSelect; CommandEmpty',
  },
  'Theme control': {
    fa: 'انتخاب تم',
    usage: [
      'روشن، تیره یا پیروی از سیستم؛ انتخاب در تغییر زبان حفظ شود.',
      'Light, dark or system; preserve preference across language changes.',
    ],
    keyboard: [
      'Select استاندارد؛ نام و مقدار تم اعلام شوند.',
      'Standard select interaction; announce the name and current mode.',
    ],
    api: 'ThemeProvider: locale; ThemeControl: locale; useAvastarTheme(): mode, theme, setMode',
  },
  'Page state': {
    fa: 'حالت صفحه',
    usage: [
      'برای خالی، بدون نتیجه و خطا اقدام ادامهٔ متناسب تعریف کنید.',
      'Give empty, no-results and error states context-appropriate recovery.',
    ],
    keyboard: [
      'عنوان صفحه حفظ؛ تغییر وضعیت اعلام؛ CTA بدون پاک‌کردن داده.',
      'Keep the page title; announce changes; recovery must preserve data.',
    ],
    api: 'ViewStatePanel: state; locale; title?; description?; actionLabel?; onRecover?; compact=false',
  },
  'Account form': {
    fa: 'فرم حساب',
    usage: [
      'تغییرات ذخیره‌نشده، شکست و موفقیت را از هم جدا کنید.',
      'Distinguish unsaved changes, save failure and success.',
    ],
    keyboard: [
      'فوکوس روی خطا؛ وضعیت ذخیره اعلام؛ مقدار بعد از شکست حفظ شود.',
      'Focus errors, announce save state and retain values after failure.',
    ],
    api: 'Controlled fields; dirty baseline; validation; saving/error/success; retry; preserve draft',
  },
  'Panel shell': {
    fa: 'پوستهٔ پنل',
    usage: [
      'ناوبری و محتوای تمام‌عرض با منوی جمع‌شوندهٔ موبایل.',
      'Full-width workspace content with responsive navigation.',
    ],
    keyboard: [
      'skip link، بخش جاری معنایی، بستن منوی موبایل پس از انتخاب.',
      'Skip link, semantic current view and close mobile navigation after selection.',
    ],
    api: 'PanelShell: locale; kind="user" | "admin"; view; onViewChange; children',
  },
  Spring: {
    fa: 'حرکت فنری',
    usage: [
      'حرکت از مقدار فعلی ادامه یابد و با تغییر هدف قابل برگشت باشد.',
      'Continue from the current position and allow retargeting in motion.',
    ],
    keyboard: [
      'کاهش حرکت رعایت؛ معنا و فوکوس وابسته به انیمیشن نباشد.',
      'Respect reduced motion; meaning and focus must not depend on animation.',
    ],
    api: 'useSpringValue(onFrame, response=0.4): (target, instant=false) => void; reduced-motion fallback',
  },
  'Number input': {
    fa: 'ورودی عددی',
    usage: ['تعداد محدود با حداقل و حداکثر مشخص.', 'A bounded quantity with explicit limits.'],
    keyboard: [
      'تایپ و جهت‌ها؛ دکمه‌های دو انتها غیرفعال می‌شوند.',
      'Typing and arrows; step buttons disable at boundaries.',
    ],
    api: 'NumberField: label; value; onValueChange; min=0; max=99; step=1; disabled=false',
  },
  'Error summary': {
    fa: 'خلاصهٔ خطا',
    usage: [
      'فهرست خطاهای فرم با لینک به پاسخ مربوط.',
      'A form error list linking to the relevant answers.',
    ],
    keyboard: [
      'پس از ارسال، فوکوس خلاصه؛ Enter روی لینک به ورودی می‌رود.',
      'After submit focus the summary; Enter on a link focuses the field.',
    ],
    api: 'ErrorSummary: errors: {id, message}[]; title; focusKey=0',
  },
};
export const componentSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
