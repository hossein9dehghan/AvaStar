'use client';
import { useState, useSyncExternalStore } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Bookmark,
  Bell,
  ChevronDown,
  Copy,
  MoreHorizontal,
  Settings,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@avastar/ui/components/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@avastar/ui/components/tabs';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@avastar/ui/components/breadcrumb';
import { Pagination, PaginationContent, PaginationItem } from '@avastar/ui/components/pagination';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@avastar/ui/components/accordion';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@avastar/ui/components/collapsible';
import { Tooltip, TooltipTrigger, TooltipContent } from '@avastar/ui/components/tooltip';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@avastar/ui/components/hover-card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@avastar/ui/components/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@avastar/ui/components/alert-dialog';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@avastar/ui/components/sheet';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@avastar/ui/components/drawer';
import { Popover, PopoverTrigger, PopoverContent } from '@avastar/ui/components/popover';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@avastar/ui/components/dropdown-menu';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@avastar/ui/components/context-menu';
import { Section, Specimen } from './primitives';
import { translate, type Locale } from '@/lib/site';
const subscribeMotion = (notify: () => void) => {
  const query = matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
export function NavigationPatterns({ locale }: { locale: Locale }) {
  const t = translate(locale),
    dir = locale === 'fa' ? 'rtl' : 'ltr';
  const [page, setPage] = useState(1);
  return (
    <Section
      id="navigation"
      index="WAYFINDING / NAVIGATION"
      title={t('همیشه بدانید کجا هستید', 'Always know where you are')}
      description={t(
        'تب برای تغییر نما، مسیر راهنما برای سلسله‌مراتب، و صفحه‌بندی برای داده‌های طولانی.',
        'Tabs switch views, breadcrumbs express hierarchy, and pagination divides long datasets.',
      )}
    >
      <Specimen
        locale={locale}
        title={t('تب و کنترل بخش‌بندی', 'Tabs & segmented control')}
        source={`<Tabs defaultValue="learning" dir="${dir}">\n  <TabsList>…</TabsList>\n  <TabsContent value="learning">…</TabsContent>\n</Tabs>`}
      >
        <Tabs defaultValue="learning" dir={dir}>
          <TabsList aria-label={t('نمای دوره', 'Course view')}>
            <TabsTrigger value="learning">{t('در حال یادگیری', 'Learning')}</TabsTrigger>
            <TabsTrigger value="complete">{t('تکمیل‌شده', 'Completed')}</TabsTrigger>
            <TabsTrigger value="locked" disabled>
              {t('آرشیو', 'Archive')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="learning">
            <div className="ds-tab-example">
              <strong>{t('شناخت آسمان شب', 'Knowing the night sky')}</strong>
              <p>{t('جلسهٔ چهارم: صورت‌های فلکی', 'Lesson four: constellations')}</p>
            </div>
          </TabsContent>
          <TabsContent value="complete">
            <div className="ds-tab-example">
              <strong>{t('اولین رصد شما', 'Your first observation')}</strong>
              <p>{t('دوره تکمیل شده است.', 'Course completed.')}</p>
            </div>
          </TabsContent>
        </Tabs>
        <p className="ds-note">
          {t(
            'با کلیدهای جهت میان تب‌ها جابه‌جا شوید؛ تب غیرفعال از ترتیب فوکوس خارج است.',
            'Use arrow keys between tabs. Disabled tabs are skipped.',
          )}
        </p>
      </Specimen>
      <Specimen
        locale={locale}
        title={t('تب خطی با آیکون و شمارنده', 'Underline tabs with icons and counts')}
        description={t(
          'برای بخش‌های هم‌سطح یک صفحه. خط زیر عنوان، نمای فعال را مشخص می‌کند.',
          'For peer sections within a page. The underline marks the current view.',
        )}
        source={`<Tabs defaultValue="active" dir="${dir}">\n  <TabsList variant="line" aria-label="${t('وضعیت دوره‌ها', 'Course status')}">\n    <TabsTrigger value="active">${t('در حال یادگیری', 'Learning')}</TabsTrigger>\n    <TabsTrigger value="done">${t('تکمیل‌شده', 'Completed')}</TabsTrigger>\n  </TabsList>\n  <TabsContent value="active">${t('دوره‌های جاری', 'Current courses')}</TabsContent>\n  <TabsContent value="done">${t('دوره‌های تکمیل‌شده', 'Completed courses')}</TabsContent>\n</Tabs>`}
      >
        <Tabs defaultValue="active" dir={dir}>
          <TabsList variant="line" aria-label={t('وضعیت دوره‌ها', 'Course status')}>
            <TabsTrigger value="active">
              <BookOpen aria-hidden="true" />
              {t('در حال یادگیری', 'Learning')}
              <span className="av-tab-count">{t('۲', '2')}</span>
            </TabsTrigger>
            <TabsTrigger value="done">
              <CheckCircle2 aria-hidden="true" />
              {t('تکمیل‌شده', 'Completed')}
              <span className="av-tab-count">{t('۱', '1')}</span>
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Bookmark aria-hidden="true" />
              {t('ذخیره‌شده', 'Saved')}
              <span className="av-tab-count">{t('۰', '0')}</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <div className="ds-tab-example">
              <strong>{t('۲ دوره در حال یادگیری', '2 courses in progress')}</strong>
              <p>
                {t(
                  'شناخت آسمان شب و مقدمات عکاسی نجومی',
                  'Knowing the night sky and introductory astrophotography',
                )}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="done">
            <div className="ds-tab-example">
              <strong>{t('اولین رصد شما', 'Your first observation')}</strong>
              <p>{t('همهٔ جلسه‌ها تکمیل شده‌اند.', 'All lessons are complete.')}</p>
            </div>
          </TabsContent>
          <TabsContent value="saved">
            <div className="ds-tab-example">
              <strong>{t('هنوز دوره‌ای ذخیره نکرده‌اید', 'No saved courses yet')}</strong>
              <p>
                {t(
                  'دوره‌های ذخیره‌شده در این بخش نمایش داده می‌شوند.',
                  'Your saved courses will appear here.',
                )}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Specimen>
      <Specimen
        locale={locale}
        title={t('مسیر راهنما', 'Breadcrumbs')}
        source={'<Breadcrumb><BreadcrumbList>…</BreadcrumbList></Breadcrumb>'}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#overview">{t('دیزاین سیستم', 'Design system')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#panels">{t('پنل‌ها', 'Panels')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('ناوبری', 'Navigation')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Specimen>
      <Specimen
        locale={locale}
        title={t('صفحه‌بندی؛ ابتدا، میانه و انتها', 'Pagination; first, middle & last')}
        source={'<Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>'}
      >
        <Pagination aria-label={t('صفحه‌بندی نمونه', 'Example pagination')}>
          <PaginationContent>
            <PaginationItem>
              <Button
                className="av-button av-button--ghost av-button--sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                {t('قبلی', 'Previous')}
              </Button>
            </PaginationItem>
            {[1, 2, 3].map((n) => (
              <PaginationItem key={n}>
                <Button
                  aria-current={page === n ? 'page' : undefined}
                  className={`av-button av-button--icon ${page === n ? 'av-button--primary' : 'av-button--ghost'}`}
                  onClick={() => setPage(n)}
                >
                  {new Intl.NumberFormat(locale).format(n)}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                className="av-button av-button--ghost av-button--sm"
                disabled={page === 3}
                onClick={() => setPage(page + 1)}
              >
                {t('بعدی', 'Next')}
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <p className="ds-note" role="status">
          {t(`صفحهٔ ${new Intl.NumberFormat('fa').format(page)} از ۳`, `Page ${page} of 3`)}
        </p>
      </Specimen>
    </Section>
  );
}
export function DisclosurePatterns({ locale }: { locale: Locale }) {
  const t = translate(locale),
    [open, setOpen] = useState(false);
  return (
    <Section
      id="disclosure"
      index="CONTENT / DISCLOSURE"
      title={t('جزئیات، در زمان نیاز', 'Details when they are needed')}
      description={t(
        'اطلاعات ضروری را آشکار نگه دارید؛ محتوای تکمیلی را به‌تدریج نمایش دهید.',
        'Keep essential information visible. Reveal supporting detail progressively.',
      )}
    >
      <Specimen
        locale={locale}
        title={t('آکاردئون؛ باز، بسته و غیرفعال', 'Accordion; open, closed & disabled')}
        source={'<Accordion type="single" collapsible>…</Accordion>'}
      >
        <Accordion type="single" defaultValue="first" collapsible>
          <AccordionItem value="first">
            <AccordionTrigger>
              {t('برای اولین رصد چه چیزی لازم است؟', 'What do I need for my first observation?')}
            </AccordionTrigger>
            <AccordionContent>
              {t(
                'با چشم غیرمسلح، یک نقشه آسمان و محیطی دور از نور شروع کنید.',
                'Start with your eyes, a sky map and a location away from bright lights.',
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="second">
            <AccordionTrigger>
              {t('آیا تلسکوپ ضروری است؟', 'Do I need a telescope?')}
            </AccordionTrigger>
            <AccordionContent>
              {t(
                'خیر؛ شناخت صورت‌های فلکی و حرکت آسمان نقطه شروع خوبی است.',
                'No. Learning constellations and sky movement is a good starting point.',
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="third" disabled>
            <AccordionTrigger>
              {t('برنامه بعدی؛ هنوز اعلام نشده', 'Next program; not announced')}
            </AccordionTrigger>
            <AccordionContent />
          </AccordionItem>
        </Accordion>
      </Specimen>
      <Specimen
        locale={locale}
        title={t('بخش بازشونده', 'Collapsible section')}
        source={'<Collapsible open={open} onOpenChange={setOpen}>…</Collapsible>'}
      >
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="av-button av-button--secondary">
            <Settings size={17} />
            {t('تنظیمات پیشرفته', 'Advanced preferences')}
            <ChevronDown size={16} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ds-tab-example">
              <strong>{t('نمایش مختصات', 'Coordinate display')}</strong>
              <p>
                {t(
                  'در محصول نهایی، این تنظیمات در کنار کنترل مرتبط قرار می‌گیرند.',
                  'In a product, keep these preferences next to the relevant control.',
                )}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Specimen>
      <div className="ds-two-col">
        <article className="av-card ds-stack">
          <h2>{t('راهنمای کوتاه', 'Tooltip')}</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="av-button av-button--secondary av-button--icon"
                aria-label={t('اعلان‌ها', 'Notifications')}
              >
                <Bell size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('اعلان‌های شما', 'Your notifications')}</TooltipContent>
          </Tooltip>
          <p className="ds-note">
            {t(
              'با فوکوس یا اشاره‌گر ظاهر می‌شود. اطلاعات ضروری را در راهنما پنهان نکنید.',
              'Appears on focus or hover. Never hide essential information here.',
            )}
          </p>
        </article>
        <article className="av-card ds-stack">
          <h2>{t('پیش‌نمایش هویت', 'Identity preview')}</h2>
          <HoverCard>
            <HoverCardTrigger asChild>
              <a className="av-button av-button--ghost" href={`/${locale}/panels/user`}>
                <User size={18} />
                {t('کاوشگر آوا استار', 'Avastar explorer')}
              </a>
            </HoverCardTrigger>
            <HoverCardContent dir={locale === 'fa' ? 'rtl' : 'ltr'}>
              <strong>{t('کاوشگر نمونه', 'Sample explorer')}</strong>
              <p>{t('علاقه‌مند به آسمان شب · ۳ دوره', 'Night-sky enthusiast · 3 courses')}</p>
            </HoverCardContent>
          </HoverCard>
          <p className="ds-note">
            {t(
              'لینک مستقل هم با لمس و صفحه‌کلید قابل استفاده است.',
              'The underlying link also works with touch and keyboard.',
            )}
          </p>
        </article>
      </div>
    </Section>
  );
}
export function OverlayPatterns({ locale }: { locale: Locale }) {
  const t = translate(locale),
    dir = locale === 'fa' ? 'rtl' : 'ltr';
  const [notice, setNotice] = useState(true),
    [archived, setArchived] = useState(false);
  const reduce = useSyncExternalStore(
    subscribeMotion,
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => true,
  );
  return (
    <Section
      id="overlays"
      index="LAYERS / OVERLAYS"
      title={t('لایه‌ها با مبدأ روشن', 'Layers with a clear origin')}
      description={t(
        'ورود و خروج از یک مسیر، بستن با Escape و بازگشت فوکوس به کنترل آغازکننده.',
        'Symmetric entry and exit, Escape dismissal and focus restored to the trigger.',
      )}
    >
      <div className="ds-overlay-grid">
        <article className="av-card ds-stack">
          <h2>{t('مدال', 'Dialog')}</h2>
          <p>{t('برای تصمیمی کوتاه و متمرکز.', 'For a short, focused decision.')}</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="av-button av-button--secondary">
                {t('نمایش مدال', 'Open dialog')}
              </Button>
            </DialogTrigger>
            <DialogContent className="av-dialog" dir={dir}>
              <DialogTitle>{t('برنامه رصد شما', 'Your observing plan')}</DialogTitle>
              <DialogDescription>
                {t(
                  'صورت‌های فلکی تابستانی؛ یادآور نمونه را به برنامه اضافه کنید.',
                  'Summer constellations. Add a sample reminder to your plan.',
                )}
              </DialogDescription>
              <DialogClose asChild>
                <Button
                  className="av-button av-button--primary"
                  onClick={() =>
                    toast.success(t('یادآور نمونه اضافه شد.', 'Sample reminder added.'))
                  }
                >
                  {t('افزودن یادآور نمونه', 'Add sample reminder')}
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </article>
        <article className="av-card ds-stack">
          <h2>{t('پنل جزئیات', 'Detail sheet')}</h2>
          <p>{t('بررسی رکورد با حفظ زمینه.', 'Inspect a record in context.')}</p>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="av-button av-button--secondary">
                {t('نمایش جزئیات', 'Open details')}
              </Button>
            </SheetTrigger>
            <SheetContent
              className="av-detail-sheet"
              side={locale === 'fa' ? 'left' : 'right'}
              dir={dir}
              showCloseButton={false}
            >
              <SheetClose
                className="av-button av-button--ghost av-button--icon sheet-close"
                aria-label={t('بستن جزئیات', 'Close details')}
              >
                <X size={19} />
              </SheetClose>
              <SheetTitle>{t('درخواست AV-104', 'Request AV-104')}</SheetTitle>
              <SheetDescription>
                {t('جزئیات نمایشی درخواست کاوشگر.', 'Sample explorer request details.')}
              </SheetDescription>
              <dl className="record-details">
                <div>
                  <dt>{t('مسیر', 'Path')}</dt>
                  <dd>{t('اولین رصد', 'First observation')}</dd>
                </div>
                <div>
                  <dt>{t('وضعیت', 'Status')}</dt>
                  <dd>
                    <span className="av-badge av-badge--warning">{t('در انتظار', 'Pending')}</span>
                  </dd>
                </div>
              </dl>
              <SheetClose className="av-button av-button--primary">
                {t('بازگشت', 'Back')}
              </SheetClose>
            </SheetContent>
          </Sheet>
        </article>
        <article className="av-card ds-stack">
          <h2>{t('کشوی لمسی', 'Touch drawer')}</h2>
          <p>
            {t(
              'کشیدن مستقیم با انگشت؛ قابل بستن در هر لحظه.',
              'Direct finger tracking, dismissible at any time.',
            )}
          </p>
          <Drawer direction="bottom" shouldScaleBackground={!reduce}>
            <DrawerTrigger asChild>
              <Button className="av-button av-button--secondary">
                {t('بازکردن کشو', 'Open drawer')}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="av-drawer" dir={dir}>
              <DrawerTitle>{t('مسیر بعدی شما', 'Your next path')}</DrawerTitle>
              <DrawerDescription>
                {t(
                  'ادامهٔ شناخت آسمان شب یا بازگشت به برنامه؛ تصمیم با شماست.',
                  'Continue learning the night sky or return to your plan.',
                )}
              </DrawerDescription>
              <DrawerClose className="av-button av-button--primary">
                {t('ادامه مسیر', 'Continue')}
              </DrawerClose>
              <DrawerClose className="av-button av-button--ghost">
                {t('فعلاً نه', 'Not now')}
              </DrawerClose>
            </DrawerContent>
          </Drawer>
        </article>
        <article className="av-card ds-stack">
          <h2>{t('تأیید عملیات حساس', 'Destructive confirmation')}</h2>
          <p>
            {archived
              ? t(
                  'مورد نمونه حذف شد؛ می‌توانید آن را برگردانید.',
                  'Sample item removed. You can restore it.',
                )
              : t(
                  'عنوان و پیام، نتیجهٔ دقیق عمل را توضیح می‌دهند.',
                  'Explain exactly what the action will do.',
                )}
          </p>
          {archived ? (
            <Button className="av-button av-button--secondary" onClick={() => setArchived(false)}>
              {t('بازگردانی نمونه', 'Restore sample')}
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="av-button av-button--danger">
                  <Trash2 size={16} />
                  {t('حذف مورد نمونه', 'Delete sample item')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="av-dialog" dir={dir}>
                <AlertDialogTitle>
                  {t('این یادآور حذف شود؟', 'Delete this reminder?')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    'یادآور از فهرست نمونه حذف می‌شود. این نمایش هیچ دادهٔ واقعی را تغییر نمی‌دهد.',
                    'The reminder will be removed from the sample list. This example changes no real data.',
                  )}
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel className="av-button av-button--secondary">
                    {t('نگه‌داشتن', 'Keep reminder')}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="av-button av-button--danger"
                    onClick={() => setArchived(true)}
                  >
                    {t('حذف یادآور', 'Delete reminder')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </article>
      </div>
      <Specimen
        locale={locale}
        title={t('منو، پاپ‌اور و منوی زمینه', 'Menu, popover & context menu')}
        source={
          '<DropdownMenu>…</DropdownMenu>\n<Popover>…</Popover>\n<ContextMenu>…</ContextMenu>'
        }
      >
        <div className="ds-button-row">
          <DropdownMenu dir={dir}>
            <DropdownMenuTrigger asChild>
              <Button className="av-button av-button--secondary">
                <MoreHorizontal size={18} />
                {t('عملیات', 'Actions')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => toast.info(t('ویرایش نمونه انتخاب شد.', 'Sample edit selected.'))}
              >
                <Settings size={16} />
                {t('ویرایش', 'Edit')}
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={notice} onCheckedChange={setNotice}>
                {t('یادآوری روشن', 'Reminders on')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                {t('انتقال؛ غیرفعال', 'Transfer; unavailable')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="av-button av-button--secondary">
                <Bell size={17} />
                {t('اعلان‌ها', 'Notifications')}
              </Button>
            </PopoverTrigger>
            <PopoverContent dir={dir} aria-labelledby="notifications-title">
              <strong id="notifications-title">
                {t('همه‌چیز به‌روز است', 'You are up to date')}
              </strong>
              <p>{t('اعلان خوانده‌نشده‌ای ندارید.', 'No unread notifications.')}</p>
            </PopoverContent>
          </Popover>
          <ContextMenu dir={dir}>
            <ContextMenuTrigger className="ds-context-target" tabIndex={0}>
              {t('راست‌کلیک یا لمس طولانی', 'Right-click or long press')}
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onSelect={() => toast.info(t('عملیات کپی نمونه', 'Sample copy action'))}
              >
                <Copy size={15} />
                {t('کپی نمونه', 'Sample copy')}
              </ContextMenuItem>
              <ContextMenuItem disabled>{t('انتقال غیرفعال', 'Move unavailable')}</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </Specimen>
    </Section>
  );
}
