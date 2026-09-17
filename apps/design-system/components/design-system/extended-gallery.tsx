'use client';
import { useDocumentation } from './documentation';
import { SelectionPatterns, PickerPatterns } from './input-patterns';
import { NavigationPatterns, DisclosurePatterns, OverlayPatterns } from './interaction-patterns';
import { MaterialPatterns, CardPatterns, DataPatterns, PageStates } from './content-patterns';
import { Inventory } from './inventory';
import { SettingsDemo } from './panel-demos';
import { Section } from './primitives';
import { translate, type Locale } from '@/lib/site';
export function ExtendedGallery({ locale }: { locale: Locale }) {
  const { active } = useDocumentation(),
    t = translate(locale);
  const components = {
    materials: MaterialPatterns,
    selection: SelectionPatterns,
    pickers: PickerPatterns,
    navigation: NavigationPatterns,
    disclosure: DisclosurePatterns,
    overlays: OverlayPatterns,
    cards: CardPatterns,
    data: DataPatterns,
    states: PageStates,
    catalog: Inventory,
  };
  if (active === 'account')
    return (
      <Section
        id="account"
        index="PATTERNS / ACCOUNT"
        title={t('حساب، تنظیمات و بازخورد ذخیره', 'Account, preferences & save feedback')}
        description={t(
          'حالت‌های بدون تغییر، ویرایش‌شده، نامعتبر، ذخیره، خطا و موفقیت را در فرم واقعی آزمایش کنید.',
          'Try unchanged, dirty, invalid, saving, error and success states in a working form.',
        )}
      >
        <SettingsDemo locale={locale} embedded />
      </Section>
    );
  const Component = components[active as keyof typeof components];
  return Component ? <Component locale={locale} /> : null;
}
