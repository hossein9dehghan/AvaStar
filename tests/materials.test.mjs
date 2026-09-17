import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const tokens = JSON.parse(readFileSync(new URL('../packages/theme/tokens.json', import.meta.url)));
const rgb = (hex) =>
  hex
    .slice(1)
    .match(/../g)
    .slice(0, 3)
    .map((x) => parseInt(x, 16) / 255);
const luminance = (values) =>
  values
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
for (const [name, theme] of Object.entries(tokens.themes)) {
  test(`${name}: glass text remains readable over black and white content`, () => {
    for (const material of ['glass-light', 'glass-frosted'])
      for (const backdrop of ['#000000', '#ffffff'])
        for (const foreground of ['foreground', 'glass-muted']) {
          const front = rgb(theme[material]),
            back = rgb(backdrop),
            alpha = parseInt(theme[material].slice(7), 16) / 255;
          const a = luminance(front.map((v, i) => v * alpha + back[i] * (1 - alpha))),
            b = luminance(rgb(theme[foreground]));
          const contrast = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
          assert(
            contrast >= 4.5,
            `${material}/${foreground} on ${backdrop}: ${contrast.toFixed(2)}`,
          );
        }
  });
}
