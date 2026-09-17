import './package-design-kit.mjs';
import { cpSync, mkdirSync } from 'node:fs';
const root = new URL('../', import.meta.url);
for (const app of ['web', 'design-system']) {
  const target = new URL(`apps/${app}/public/`, root);
  mkdirSync(target, { recursive: true });
  for (const folder of ['fonts', 'brand', 'art'])
    cpSync(new URL(`packages/assets/${folder}/`, root), new URL(folder, target), {
      recursive: true,
    });
  cpSync(new URL('packages/theme/', root), new URL('design-system/', target), {
    recursive: true,
    filter: (source) => !source.endsWith('package.json'),
  });
}
console.log('Shared assets and design-system downloads synchronized.');
