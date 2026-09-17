import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const tokens = JSON.parse(
  readFileSync(new URL('../packages/theme/tokens.json', import.meta.url), 'utf8'),
);
const luminance = (hex) => {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((channel) => parseInt(channel, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
};
const pairs = [
  ['foreground', 'background', 4.5],
  ['muted-foreground', 'card', 4.5],
  ['primary-foreground', 'primary', 4.5],
  ['link', 'background', 4.5],
  ['success', 'success-background', 4.5],
  ['warning', 'warning-background', 4.5],
  ['destructive', 'destructive-background', 4.5],
  ['info', 'info-background', 4.5],
  ['input', 'control-background', 3],
  ['ring', 'background', 3],
  ['foreground', 'card', 4.5],
  ['foreground', 'control-background', 4.5],
  ['muted-foreground', 'background', 4.5],
  ['muted-foreground', 'control-background', 4.5],
  ['muted-foreground', 'muted', 4.5],
  ['primary-foreground', 'primary-hover', 4.5],
  ['secondary-foreground', 'secondary', 4.5],
  ['popover-foreground', 'popover', 4.5],
  ['sidebar-foreground', 'sidebar', 4.5],
  ['sidebar-accent-foreground', 'sidebar-accent', 4.5],
  ['link', 'card', 4.5],
  ['ring', 'card', 3],
  ['input', 'background', 3],
  ['input', 'card', 3],
];
assert.deepEqual(
  Object.keys(tokens.themes.light).sort(),
  Object.keys(tokens.themes.dark).sort(),
  'Theme token keys must match.',
);
for (const [name, theme] of Object.entries(tokens.themes)) {
  for (const [fg, bg, minimum] of pairs) {
    const a = luminance(theme[fg]),
      b = luminance(theme[bg]),
      ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    assert(ratio >= minimum, `${name}: ${fg}/${bg} is ${ratio.toFixed(2)}; requires ${minimum}.`);
  }
}
assert(parseInt(tokens.control.sm, 10) >= 44, 'Interactive targets must be at least 44px.');
console.log(
  `Passed: matching theme schemas, ${pairs.length * 2} text/control contrast checks, and target sizes.`,
);
