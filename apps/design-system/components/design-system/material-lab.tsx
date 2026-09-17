'use client';
import { useState } from 'react';
import { Layers, ArrowUpRight, Check } from 'lucide-react';
import { MaterialSurface, type MaterialKind } from '@avastar/ui/material-surface';
import { Button } from '@avastar/ui/components/button';
import type { Locale } from '@/lib/site';
export function MaterialLab({ locale }: { locale: Locale }) {
  const fa = locale === 'fa';
  const [background, setBackground] = useState('image'),
    [reduced, setReduced] = useState(false),
    [selected, setSelected] = useState<MaterialKind>('frosted'),
    [saved, setSaved] = useState(false);
  const kinds: MaterialKind[] = ['light', 'frosted', 'solid'];
  const names = fa
    ? ['شیشهٔ سبک', 'شیشهٔ مات', 'سطح متراکم']
    : ['Light glass', 'Frosted glass', 'Dense surface'];
  return (
    <div className="material-lab">
      <div className="material-lab-controls">
        <div role="group" aria-label={fa ? 'پس‌زمینه نمونه' : 'Sample background'}>
          {['image', 'light', 'dark'].map((v, i) => (
            <Button
              key={v}
              variant="outline"
              aria-pressed={background === v}
              onClick={() => setBackground(v)}
            >
              {(fa ? ['تصویری', 'روشن', 'تیره'] : ['Image', 'Light', 'Dark'])[i]}
            </Button>
          ))}
        </div>
        <label>
          <input type="checkbox" checked={reduced} onChange={(e) => setReduced(e.target.checked)} />
          {fa ? 'کاهش شفافیت' : 'Reduce transparency'}
        </label>
      </div>
      <div className="material-stage" data-background={background}>
        <div className="material-stage-sky" aria-hidden="true" />
        {kinds.map((kind, i) => (
          <MaterialSurface
            key={kind}
            material={kind}
            reducedTransparency={reduced}
            className="material-sample"
          >
            <Layers size={23} />
            <span className="material-sample-number">0{i + 1}</span>
            <h3>{names[i]}</h3>
            <p>
              {
                (fa
                  ? [
                      'ابزارهای کوچک و کنترل‌های صحنه',
                      'هدر، منو و لایه‌های شناور',
                      'فرم، جدول و محتوای طولانی',
                    ]
                  : [
                      'Small tools and scene controls',
                      'Headers, menus and floating layers',
                      'Forms, tables and long content',
                    ])[i]
              }
            </p>
            <Button
              variant={selected === kind ? 'default' : 'outline'}
              aria-pressed={selected === kind}
              onClick={() => setSelected(kind)}
            >
              {selected === kind ? <Check size={16} /> : <ArrowUpRight size={16} />}{' '}
              {fa ? 'انتخاب متریال' : 'Select material'}
            </Button>
          </MaterialSurface>
        ))}
      </div>
      <div className="material-contract-grid">
        <div>
          <h3>{fa ? 'بازخورد و حالت‌ها' : 'Feedback and states'}</h3>
          <p>
            {fa
              ? 'نمونه را با موس و کیبورد بررسی کنید؛ انتخاب از طریق برچسب و علامت هم مشخص است.'
              : 'Inspect with pointer and keyboard; selection is expressed through both label and icon.'}
          </p>
          <div className="material-state-actions">
            <Button onClick={() => setSaved((v) => !v)}>
              {saved ? (fa ? 'ذخیره شد' : 'Saved') : fa ? 'ذخیره نمونه' : 'Save example'}
            </Button>
            <Button disabled>{fa ? 'غیرفعال' : 'Disabled'}</Button>
          </div>
          <span role="status">
            {saved ? (fa ? 'تنظیم نمونه ذخیره شد.' : 'Example preference saved.') : ''}
          </span>
        </div>
        <div>
          <h3>{fa ? 'قاعدهٔ ترکیب' : 'Composition rule'}</h3>
          <p>
            {fa
              ? 'در هر ناحیه یک سطح شیشه‌ای کافی است. متن و کنترل‌ها روی سطح قرار می‌گیرند؛ شیشهٔ دوم روی آن اضافه نمی‌شود.'
              : 'Use one glass surface per region. Place text and controls directly on it without stacking another glass layer.'}
          </p>
          <code>{`<MaterialSurface material="${selected}" />`}</code>
        </div>
      </div>
    </div>
  );
}
