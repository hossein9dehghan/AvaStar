/** A deterministic stellar disc, painted once and composited during the journey. */
export function paintGalaxy(ctx: CanvasRenderingContext2D, size: number) {
  let seed = 81427;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const gaussian = () =>
    Math.sqrt(-2 * Math.log(Math.max(0.00001, random()))) * Math.cos(2 * Math.PI * random());
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(-0.48);
  ctx.scale(1, 0.61);
  const radius = size * 0.43;
  const glow = (x: number, y: number, r: number, rgb: string, opacity: number) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, `rgba(${rgb},${opacity})`);
    gradient.addColorStop(0.35, `rgba(${rgb},${opacity * 0.4})`);
    gradient.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  glow(0, 0, radius * 1.15, '105,125,184', 0.12);
  // Broad, irregular arms with a warm bulge and blue outer star-forming regions.
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 2100; i++) {
    const r = Math.pow(random(), 0.72) * radius;
    const arm = i % 3;
    const angle = (arm * Math.PI * 2) / 3 + 5.4 * Math.sqrt(r / radius) + gaussian() * 0.16;
    const spread = gaussian() * (3 + r * 0.085);
    const x = Math.cos(angle) * r + Math.cos(angle + Math.PI / 2) * spread;
    const y = Math.sin(angle) * r + Math.sin(angle + Math.PI / 2) * spread;
    glow(
      x,
      y,
      size * (0.008 + random() * 0.023),
      r < radius * 0.3 ? '217,179,139' : '110,156,214',
      0.025 + random() * 0.07,
    );
  }
  for (let i = 0; i < 22000; i++) {
    const r = Math.pow(random(), 1.08) * radius;
    const a =
      ((i % 3) * Math.PI * 2) / 3 + 5.4 * Math.sqrt(r / radius) + gaussian() * (i % 5 ? 0.13 : 0.7);
    const x = Math.cos(a) * r + gaussian() * (1.5 + r * 0.035);
    const y = Math.sin(a) * r + gaussian() * (1.5 + r * 0.035);
    const fade = Math.pow(1 - r / radius, 0.55);
    const warm = r < radius * 0.32;
    ctx.fillStyle = `rgba(${warm ? '244,215,175' : '167,199,239'},${(0.12 + random() * 0.55) * fade})`;
    const s = ((0.35 + Math.pow(random(), 4) * 1.2) * size) / 1100;
    ctx.fillRect(x, y, s, s);
  }
  // A soft central bulge, with no hard ring or artificial lens flare.
  glow(0, 0, radius * 0.37, '232,192,146', 0.42);
  glow(0, 0, radius * 0.13, '255,222,179', 0.68);
  glow(0, 0, radius * 0.035, '255,245,216', 0.84);
  ctx.restore();
}
