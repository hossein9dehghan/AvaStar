import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../packages/theme/', import.meta.url);
const tokens = JSON.parse(readFileSync(new URL('tokens.json', root), 'utf8'));
const variables = (group, prefix = '') =>
  Object.entries(group)
    .map(([key, value]) => `  --${prefix}${key}: ${value};`)
    .join('\n');
const foundations = ['brand', 'space', 'radius', 'control', 'motion', 'layer'].map((group) =>
  variables(tokens[group], `${group}-`),
);
const css = [
  '/* Generated from tokens.json. Do not edit generated values. */',
  ':root {',
  ...foundations,
  `  --av-font: ${tokens.typography.family};`,
  ...Object.entries(tokens.layout).map(
    ([key, value]) =>
      `  --layout-${key.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase())}: ${typeof value === 'number' && !key.startsWith('columns') ? value + 'px' : value};`,
  ),
  ...tokens.typography.scale.flatMap(({ role, size, mobile, weight, lineHeight }) => [
    `  --type-${role.toLowerCase()}-size: ${size};`,
    `  --type-${role.toLowerCase()}-mobile: ${mobile};`,
    `  --type-${role.toLowerCase()}-weight: ${weight};`,
    `  --type-${role.toLowerCase()}-leading: ${lineHeight};`,
  ]),
  '  --radius: 0.75rem;',
  '}',
  ':root, [data-avastar-theme="dark"] {',
  variables(tokens.themes.dark),
  '  color-scheme: dark;',
  '}',
  ':root[data-theme="light"], [data-avastar-theme="light"] {',
  variables(tokens.themes.light),
  '  color-scheme: light;',
  '}',
].join('\n');
writeFileSync(new URL('avastar-tokens.css', root), css + '\n');
const faces = tokens.typography.weights
  .map(
    (weight) =>
      `@font-face { font-family: Peyda; src: url("./fonts/${weight.file}") format("woff"); font-weight: ${weight.value}; font-style: normal; font-display: swap; }`,
  )
  .join('\n');
writeFileSync(new URL('avastar-fonts.css', root), faces + '\n');
for (const app of ['web', 'design-system']) {
  writeFileSync(new URL(`../../apps/${app}/app/fonts.css`, root), faces.replaceAll('./fonts/', '/fonts/') + '\n');
}
console.log(`Avastar ${tokens.version}: light and dark tokens generated.`);
