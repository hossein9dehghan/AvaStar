import type { ComponentProps } from 'react';
export type MaterialKind = 'light' | 'frosted' | 'solid';
/** A surface, not a layout: preserve semantic controls and headings inside it. */
export function MaterialSurface({
  material = 'frosted',
  reducedTransparency = false,
  className = '',
  ...props
}: ComponentProps<'div'> & { material?: MaterialKind; reducedTransparency?: boolean }) {
  return (
    <div
      {...props}
      className={`av-glass ${className}`}
      data-material={material}
      data-transparency={reducedTransparency ? 'reduced' : undefined}
    />
  );
}
