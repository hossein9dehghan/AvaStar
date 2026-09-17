'use client';
import { useState } from 'react';
import {
  ChevronDown,
  Shapes,
  SlidersHorizontal,
  PanelLeft,
  Rows3,
  LayoutGrid,
  Code2,
} from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@avastar/ui/components/collapsible';
import { navigationGroups, sections } from './documentation';
import type { Locale } from '@/lib/site';
const icons = [Shapes, SlidersHorizontal, PanelLeft, Rows3, LayoutGrid, Code2];
export function TreeNavigation({
  locale,
  active,
  onNavigate,
}: {
  locale: Locale;
  active: string;
  onNavigate: () => void;
}) {
  const activeGroup = navigationGroups.find((g) => g.items.includes(active))?.id ?? 'foundations';
  const [choice, setChoice] = useState<{ section: string; group: string | null }>({
    section: active,
    group: activeGroup,
  });
  const expanded = choice.section === active ? choice.group : activeGroup;
  return (
    <nav
      className="ds-tree"
      aria-label={locale === 'fa' ? 'بخش‌های دیزاین سیستم' : 'Design system sections'}
    >
      {navigationGroups.map((group, index) => {
        const Icon = icons[index];
        return (
          <Collapsible
            key={group.id}
            open={expanded === group.id}
            onOpenChange={(open) => setChoice({ section: active, group: open ? group.id : null })}
          >
            <CollapsibleTrigger className="ds-tree-parent" data-current={activeGroup === group.id}>
              <Icon size={18} aria-hidden="true" />
              <span>{locale === 'fa' ? group.fa : group.en}</span>
              <ChevronDown size={15} className="ds-tree-chevron" aria-hidden="true" />
            </CollapsibleTrigger>
            <CollapsibleContent className="ds-tree-children">
              <ul>
                {group.items.map((id) => {
                  const section = sections.find((item) => item[0] === id)!;
                  return (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        aria-current={id === active ? 'page' : undefined}
                        onClick={onNavigate}
                      >
                        {section[locale === 'fa' ? 1 : 2]}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </nav>
  );
}
