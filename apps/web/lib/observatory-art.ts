export type ObservatoryView = { yaw: number; pitch: number; hover: number; time: number };
export type ObservatoryPoint = { x: number; y: number; z: number; scale: number };
const colors = ['#72b9f0', '#e6ae71', '#b7c9d6', '#b8a1eb'];
const phases = [-2.15, -0.6, 0.8, 2.5];
const radii = [150, 205, 258, 302];
const inclinations = [-0.16, 0.22, -0.32, 0.1];
export function projectObservatory(
  x: number,
  y: number,
  z: number,
  yaw: number,
  pitch: number,
): ObservatoryPoint {
  const xx = x * Math.cos(yaw) + z * Math.sin(yaw);
  const zz = z * Math.cos(yaw) - x * Math.sin(yaw);
  const yy = y * Math.cos(pitch) - zz * Math.sin(pitch);
  const depth = y * Math.sin(pitch) + zz * Math.cos(pitch);
  const scale = 1100 / (1100 + depth);
  return { x: 400 + xx * scale, y: 383 + yy * scale, z: depth, scale };
}
export function paintObservatory(
  ctx: CanvasRenderingContext2D,
  size: number,
  view: ObservatoryView,
  bodies: (CanvasImageSource | undefined)[] = [],
) {
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.scale(size / 800, size / 800);
  const project = (x: number, y: number, z: number) =>
    projectObservatory(x, y, z, view.yaw, view.pitch);
  const orbit = (i: number, a: number) =>
    project(
      Math.cos(a) * radii[i],
      Math.sin(a) * radii[i] * Math.cos(inclinations[i]),
      Math.sin(a) * radii[i] * Math.sin(inclinations[i]),
    );
  const nodes = radii.map((_, i) => orbit(i, phases[i]));
  const haze = ctx.createRadialGradient(400, 383, 15, 400, 383, 340);
  haze.addColorStop(0, 'rgba(89,128,183,.13)');
  haze.addColorStop(1, 'rgba(30,60,110,0)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, 800, 800);
  function drawOrbits(front: boolean) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 144; j++) {
        const a = (j / 144) * Math.PI * 2,
          p = orbit(i, a),
          next = orbit(i, a + (Math.PI * 2) / 144);
        if (p.z <= 0 !== front) continue;
        ctx.strokeStyle = colors[i];
        ctx.globalAlpha = (view.hover === i ? 0.7 : 0.24) * (front ? 1 : 0.4);
        ctx.lineWidth = view.hover === i ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
        if (j % 6 === 0) {
          const tick = project(
            Math.cos(a) * (radii[i] + 4),
            Math.sin(a) * (radii[i] + 4) * Math.cos(inclinations[i]),
            Math.sin(a) * (radii[i] + 4) * Math.sin(inclinations[i]),
          );
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(tick.x, tick.y);
          ctx.stroke();
        }
      }
      const dust = orbit(i, phases[i] + 0.7 + view.time * 0.045 * (i % 2 ? -1 : 1));
      if (dust.z <= 0 === front) {
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, 1.6 * dust.scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  function sphere(
    p: ObservatoryPoint,
    radius: number,
    color: string,
    selected = false,
    image?: CanvasImageSource,
  ) {
    const r = radius * p.scale;
    if (selected) {
      const glow = ctx.createRadialGradient(p.x, p.y, r, p.x, p.y, r * 2.1);
      glow.addColorStop(0, color + '50');
      glow.addColorStop(1, color + '00');
      ctx.fillStyle = glow;
      ctx.fillRect(p.x - r * 2.1, p.y - r * 2.1, r * 4.2, r * 4.2);
    }
    if (image) {
      ctx.drawImage(image, p.x - r, p.y - r, r * 2, r * 2);
      return;
    }
    const g = ctx.createRadialGradient(
      p.x - r * 0.38,
      p.y - r * 0.42,
      0,
      p.x + r * 0.25,
      p.y + r * 0.1,
      r * 1.3,
    );
    g.addColorStop(0, '#f0e8da');
    g.addColorStop(0.2, color);
    g.addColorStop(0.57, color);
    g.addColorStop(0.88, '#101c30');
    g.addColorStop(1, '#030810');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color + '88';
    ctx.lineWidth = 0.65;
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, r - 0.5, 0, Math.PI * 2);
    ctx.clip();
    for (let j = 0; j < 7; j++) {
      ctx.strokeStyle = j % 2 ? '#ffffff13' : '#00000016';
      ctx.lineWidth = 1 + (j % 3);
      ctx.beginPath();
      ctx.ellipse(
        p.x - r * 0.1,
        p.y - r * 0.7 + j * r * 0.23,
        r * 1.4,
        r * 0.2,
        -0.26,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
    ctx.restore();
  }
  drawOrbits(false);
  nodes.forEach((p, i) => {
    if (p.z > 0) sphere(p, [23, 29, 25, 21][i], colors[i], view.hover === i, bodies[i]);
  });
  // A warm stellar core makes a strong focal point, with a quiet, physically sized corona.
  const corona = ctx.createRadialGradient(400, 383, 43, 400, 383, 120);
  corona.addColorStop(0, 'rgba(237,161,70,.24)');
  corona.addColorStop(0.3, 'rgba(237,161,70,.09)');
  corona.addColorStop(1, 'rgba(237,161,70,0)');
  ctx.fillStyle = corona;
  ctx.fillRect(280, 263, 240, 240);
  const core = ctx.createRadialGradient(385, 365, 0, 404, 390, 55);
  core.addColorStop(0, '#fff8df');
  core.addColorStop(0.46, '#f4d798');
  core.addColorStop(0.82, '#d38d44');
  core.addColorStop(1, '#995221');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(400, 383, 51, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(400, 383, 50, 0, Math.PI * 2);
  ctx.clip();
  let seed = 19713;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = 0; i < 1100; i++) {
    const a = random() * Math.PI * 2,
      r = 50 * Math.sqrt(random());
    ctx.fillStyle = i % 3 ? '#fff5d617' : '#81422217';
    ctx.beginPath();
    ctx.arc(400 + Math.cos(a) * r, 383 + Math.sin(a) * r, 0.6 + (i % 5) * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  drawOrbits(true);
  nodes.forEach((p, i) => {
    if (p.z <= 0) sphere(p, [23, 29, 25, 21][i], colors[i], view.hover === i, bodies[i]);
  });
  ctx.restore();
  return nodes;
}

/** Equirectangular surface mapping gives the small navigation worlds real spherical shading. */
export function paintPlanetDisc(
  ctx: CanvasRenderingContext2D,
  texture: ImageData,
  size: number,
  rotation: number,
) {
  const output = ctx.createImageData(size, size),
    pixels = output.data;
  for (let py = 0; py < size; py++)
    for (let px = 0; px < size; px++) {
      const x = (px + 0.5 - size / 2) / (size / 2 - 1),
        y = -(py + 0.5 - size / 2) / (size / 2 - 1),
        d = x * x + y * y;
      if (d >= 1) continue;
      const z = Math.sqrt(1 - d),
        u = (((Math.atan2(x, z) / (Math.PI * 2) + rotation) % 1) + 1) % 1,
        v = Math.acos(y) / Math.PI;
      const tx = Math.floor(u * (texture.width - 1)),
        ty = Math.floor(v * (texture.height - 1)),
        si = (ty * texture.width + tx) * 4,
        di = (py * size + px) * 4;
      const light = Math.max(0, -0.6 * x + 0.43 * y + 0.67 * z),
        shade = 0.055 + 0.94 * Math.pow(light, 0.9);
      for (let c = 0; c < 3; c++)
        pixels[di + c] = Math.min(255, texture.data[si + c] * shade * 1.15);
      pixels[di + 3] = Math.min(255, (1 - d) * size * 2 * 255);
    }
  ctx.putImageData(output, 0, 0);
}
