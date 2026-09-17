'use client';
import { LanguageSwitch } from './language-switch';
import type { ReactNode } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@avastar/ui/components/sidebar';
import { Button } from '@avastar/ui/components/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@avastar/ui/components/breadcrumb';
import { ThemeControl } from './theme-provider';
import { translate, type Locale } from '@avastar/ui/lib/locale';
export type PanelView = 'overview' | 'records' | 'settings';
export function PanelShell({
  locale,
  kind,
  view,
  onViewChange,
  children,
}: {
  locale: Locale;
  kind: 'admin' | 'user';
  view: PanelView;
  onViewChange: (view: PanelView) => void;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <PanelLayout locale={locale} kind={kind} view={view} onViewChange={onViewChange}>
        {children}
      </PanelLayout>
    </SidebarProvider>
  );
}
function PanelLayout({
  locale,
  kind,
  view,
  onViewChange,
  children,
}: {
  locale: Locale;
  kind: 'admin' | 'user';
  view: PanelView;
  onViewChange: (view: PanelView) => void;
  children: ReactNode;
}) {
  const t = translate(locale),
    { toggleSidebar, setOpenMobile, isMobile } = useSidebar();
  const items = [
    { id: 'overview' as const, label: t('نمای کلی', 'Overview'), icon: LayoutDashboard },
    {
      id: 'records' as const,
      label: kind === 'admin' ? t('درخواست‌ها', 'Requests') : t('دوره‌های من', 'My courses'),
      icon: kind === 'admin' ? Users : BookOpen,
    },
    { id: 'settings' as const, label: t('تنظیمات', 'Settings'), icon: Settings },
  ];
  return (
    <div className="av-panel panel-layout av-ui" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <a className="skip-link" href="#panel-main">
        {t('رفتن به محتوای پنل', 'Skip to panel content')}
      </a>
      <Sidebar side={locale === 'fa' ? 'right' : 'left'} collapsible="offcanvas">
        <SidebarHeader className="panel-sidebar-header">
          <a href={`/${locale}`} aria-label={t('دیزاین سیستم آوا استار', 'Avastar design system')}>
            <img
              className="theme-logo-dark"
              src={`/brand/logo-lockup-${locale}-mono.png`}
              width="130"
              height="42"
              alt="Avastar"
            />
            <img
              className="theme-logo-light"
              src={`/brand/logo-lockup-${locale}.png`}
              width="130"
              height="42"
              alt="Avastar"
            />
          </a>
          {isMobile && (
            <Button
              className="av-button av-button--ghost av-button--icon"
              aria-label={t('بستن منو', 'Close menu')}
              onClick={() => setOpenMobile(false)}
            >
              <X size={19} />
            </Button>
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <p className="sidebar-caption">
              {kind === 'admin'
                ? t('فضای مدیریت', 'MANAGEMENT')
                : t('فضای کاوشگر', 'EXPLORER SPACE')}
            </p>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={view === item.id}
                      aria-current={view === item.id ? 'page' : undefined}
                      onClick={() => {
                        onViewChange(item.id);
                        setOpenMobile(false);
                        requestAnimationFrame(() =>
                          document.getElementById('panel-main')?.focus({ preventScroll: true }),
                        );
                      }}
                      className="panel-nav-item"
                    >
                      <item.icon size={18} />
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="panel-sidebar-footer">
          <span className="av-badge av-badge--info">{t('محیط نمونه', 'Demo workspace')}</span>
          <a href={`/${locale}#panels`}>
            {t('بازگشت به دیزاین سیستم', 'Back to design system')}
            {locale === 'fa' ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </a>
        </SidebarFooter>
      </Sidebar>
      <div className="panel-workspace">
        <header className="panel-header av-glass">
          <div>
            <Button
              variant="ghost"
              className="av-button av-button--ghost av-button--icon"
              aria-label={t('باز و بسته کردن منو', 'Toggle navigation')}
              onClick={toggleSidebar}
            >
              <LayoutDashboard size={20} />
            </Button>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${locale}`}>
                    {t('آوا استار UI', 'Avastar UI')}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {kind === 'admin'
                      ? t('پنل ادمین', 'Admin panel')
                      : t('پنل کاربری', 'User panel')}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div>
            <LanguageSwitch
              locale={locale}
              href={`/${locale === 'fa' ? 'en' : 'fa'}/panels/${kind}`}
            />
            <ThemeControl locale={locale} />
          </div>
        </header>
        <main id="panel-main" className="panel-main" tabIndex={-1}>
          {children}
        </main>
        <footer className="panel-footer">
          {t(
            'داده‌های نمایشی · تغییرات این محیط محلی‌اند و به‌صورت دائمی ذخیره نمی‌شوند.',
            'Demo data · Workspace changes are local and are not saved permanently.',
          )}
        </footer>
      </div>
    </div>
  );
}
