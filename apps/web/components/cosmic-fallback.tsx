'use client';
import { useEffect, useRef, type MutableRefObject } from 'react';
import type { Locale, PlanetId } from '@/lib/avastar';
import { planetArt } from '@/lib/planet-art';
import { advancePlanetRotation, type PlanetRotation } from '@/lib/planet-rotation';
import { cosmicStageWidth } from '@/lib/cosmic-layout';
import { starAppearance } from '@/lib/star-appearance';
import { placePlanetTarget } from '@/lib/cosmic-hit-target';
import type { FlightState } from './use-depth-journey';
import { PlanetArtifact } from './planet-artifact';

const worlds = [
  { step: 1, id: 'learn', src: planetArt.learn, side: -1, spin: 0.38 },
  { step: 2, id: 'explore', src: planetArt.explore, side: 1, spin: -0.18 },
  { step: 3, id: 'shop', src: planetArt.shop, side: -1, spin: 0.3 },
  { step: 4, id: 'club', src: planetArt.club, side: 1, spin: -0.32 },
  { step: 4.28, id: 'club', src: planetArt.shop, side: 1, spin: 0.4, moon: true },
] as const;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
// A fixed seed prevents the sky from jumping on hover, resize or modal changes.
function makeStars(count: number) {
  let seed = 92741;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: count }, () => ({
    x: random() * 2 - 1,
    y: random() * 2 - 1,
    depth: random(),
    size: random(),
    brightness: random(),
    temperature: random(),
  })).map((star) => {
    const appearance = starAppearance(star.size, star.temperature);
    return { ...star, appearance, rgb: appearance.rgb.map((v) => Math.round(v * 255)).join(',') };
  });
}
/** One camera and one frame clock own both the planets and their star occlusion. */
export function CosmicFallback({
  equipmentTargets,
  chapterViews,
  targets,
  rotations,
  flight,
  locale,
  reduced,
  paused,
  selected,
  hovered,
}: {
  equipmentTargets: MutableRefObject<(HTMLButtonElement | null)[]>;
  chapterViews: Record<PlanetId, number>;
  rotations: MutableRefObject<PlanetRotation[]>;
  targets: MutableRefObject<(HTMLButtonElement | null)[]>;
  flight: MutableRefObject<FlightState>;
  locale: Locale;
  reduced: boolean;
  paused: boolean;
  selected: PlanetId | null;
  hovered: PlanetId | null;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const clock = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext('2d');
    if (!element || !ctx) return;
    let frame = 0,
      previous = 0,
      lastReducedPosition = -1,
      lastRotationRevision = -1,
      focus = 1,
      w = innerWidth,
      h = innerHeight;
    const stars = makeStars(4800);
    const resize = () => {
      w = innerWidth;
      h = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      element.width = Math.round(w * dpr);
      element.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const render = (time: number) => {
      const dt = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      const f = flight.current;
      const rotationRevision = rotations.current.reduce(
        (sum, rotation) => sum + rotation.revision,
        0,
      );
      if (
        reduced &&
        lastReducedPosition === Math.round(f.position) &&
        rotationRevision === lastRotationRevision
      ) {
        if (!paused) frame = requestAnimationFrame(render);
        return;
      }
      lastReducedPosition = Math.round(f.position);
      lastRotationRevision = rotationRevision;
      if (!paused && !reduced) clock.current += dt;
      const easing = 1 - Math.exp(-3 * dt);
      const position = reduced ? Math.round(f.position) : f.position;
      const heroPointer = !reduced && position <= 0.35;
      pointer.current.x += ((heroPointer ? f.pointerX : 0) - pointer.current.x) * easing;
      pointer.current.y += ((heroPointer ? f.pointerY : 0) - pointer.current.y) * easing;
      const px = heroPointer ? pointer.current.x : 0,
        py = heroPointer ? pointer.current.y : 0;
      const goal = selected ? 1.015 : hovered ? 1.008 : 1;
      focus = reduced ? 1 : focus + (goal - focus) * (1 - Math.exp(-6 * dt));
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      const count = w < 760 ? 2600 : 4800;
      for (let i = 0; i < count; i++) {
        const star = stars[i];
        // Match the continuous journey and pointer depth when WebGL is unavailable.
        const depth = 1 + ((((star.depth * 3 - position * 0.65) % 3) + 3) % 3);
        const scale = 1.3 / depth;
        const x = w / 2 + star.x * w * scale + px * (35 / depth);
        const y = h / 2 + star.y * h * scale + py * (25 / depth);
        if (x < 0 || x > w || y < 0 || y > h) continue;
        const radius = star.appearance.radius * (0.86 + 0.35 / depth);
        const edge = clamp((depth - 1) * 8) * clamp((4 - depth) * 8);
        const alpha = star.appearance.brightness * (0.85 + star.brightness * 0.15) * edge;
        const rgb = star.rgb;
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        if (star.size > 0.994) {
          ctx.fillStyle = `rgba(${rgb},${alpha * 0.075})`;
          ctx.beginPath();
          ctx.arc(x, y, radius * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      const mobile = w <= 760;
      const stageWidth = cosmicStageWidth(w);
      const foreground: { x: number; y: number; r: number }[] = [];
      ctx.globalCompositeOperation = 'destination-out';
      worlds.forEach((world, i) => {
        const node = layers.current[i];
        if (!node) return;
        const moon = 'moon' in world,
          ringed = world.id === 'explore';
        const distance = 10 + (world.step - position) * 18;
        const ratio = 10 / Math.max(1, distance);
        const near = clamp((distance - 1) / 3);
        const far = Math.exp(-Math.max(0, distance - 14) * 0.2);
        const allowed = !reduced || Math.round(world.step) === position;
        let alpha = allowed && distance > 1 && position < 5 ? near * far : 0;
        const baseX = mobile
          ? w * 0.5
          : w / 2 + stageWidth * world.side * (locale === 'fa' ? 1 : -1) * 0.24;
        const baseY = mobile ? Math.min(h * 0.2, 150) : h * 0.48;
        const width = mobile
          ? Math.min(w * 0.2, h * 0.075) / (ringed ? 0.245 : 0.435)
          : Math.min(stageWidth * (ringed ? 0.5 : 0.45), h * 1.04);
        const size =
          width * (moon ? 0.39 : 1) * ratio * (world.id === (selected || hovered) ? focus : 1);
        const x =
          w / 2 +
          (baseX - w / 2 + (moon ? -stageWidth * 0.31 * (locale === 'fa' ? 1 : -1) : 0)) * ratio -
          px * 2 * ratio;
        const y = h / 2 + (baseY - h / 2 + (moon ? -h * 0.38 : 0)) * ratio + py * 1.5 * ratio;
        const radius = size * (ringed ? 0.245 : 0.435);
        for (const body of foreground) {
          const t = clamp((Math.hypot(x - body.x, y - body.y) / (radius + body.r) - 0.66) / 0.48);
          alpha *= t * t * (3 - 2 * t);
        }
        if (distance > 1 && distance < 18 && alpha > 0.35) foreground.push({ x, y, r: radius });
        // Keep the photographic fallback still until the user directly rotates it.
        const rotation = rotations.current[Math.floor(world.step)];
        if (!moon) advancePlanetRotation(rotation, paused ? 0 : dt, reduced);
        // The no-WebGL artwork supports a restrained roll while the 3D scene rotates its surface.
        const angle = ((rotation.yaw * 180) / Math.PI) * 0.25 + rotation.pitch * 12;
        if (!moon)
          placePlanetTarget(
            targets.current[world.step],
            x + (ringed ? size * 0.029 * Math.sin((angle * Math.PI) / 180) : 0),
            y - (ringed ? size * 0.029 * Math.cos((angle * Math.PI) / 180) : 0),
            radius,
            Math.round(position) === world.step && alpha > 0.15,
          );
        if (world.id === 'shop' && !moon) {
          const radians = (angle * Math.PI) / 180;
          [
            [0.836, 0.603],
            [0.73, 0.73],
            [0.63, 0.75],
          ].forEach(([nx, ny], j) => {
            const target = equipmentTargets.current[j];
            if (!target) return;
            target.hidden = w <= 760 || Math.round(position) !== 3 || alpha < 0.4;
            if (!target.hidden) {
              const dx = (nx - 0.5) * size,
                dy = (ny - 0.5) * size;
              target.style.transform = `translate3d(${x + dx * Math.cos(radians) - dy * Math.sin(radians)}px,${y + dx * Math.sin(radians) + dy * Math.cos(radians)}px,0) translate(-50%,-50%)`;
            }
          });
        }
        node.style.width = `${size.toFixed(2)}px`;
        node.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(-50%,-50%) rotate(${angle.toFixed(3)}deg)`;
        node.style.opacity = alpha.toFixed(3);
        node.style.visibility = alpha > 0.008 ? 'visible' : 'hidden';
        node.style.filter = `blur(${reduced ? 0 : Math.min(7, Math.max(0, distance - 16) * 0.35)}px)`;
        node.style.zIndex = String(20 - i);
        if (alpha <= 0.008) return;
        // Physically erase stars behind the image silhouette, including the unlit hemisphere.
        // Coordinates match the artwork and share the exact same transform as the image.
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.scale(size, size);
        ctx.fillStyle = `rgba(0,0,0,${clamp(alpha * 4)})`;
        ctx.beginPath();
        ctx.arc(0, ringed ? -0.029 : 0, ringed ? 0.248 : 0.435, 0, Math.PI * 2);
        ctx.fill();
        if (ringed) {
          ctx.translate(0, -0.03);
          ctx.rotate((-27 * Math.PI) / 180);
          ctx.beginPath();
          ctx.ellipse(0, 0, 0.493, 0.118, 0, 0, Math.PI * 2);
          ctx.ellipse(0, 0, 0.357, 0.062, 0, 0, Math.PI * 2, true);
          ctx.fill('evenodd');
        }
        ctx.restore();
      });
      ctx.globalCompositeOperation = 'source-over';
      if (!paused) frame = requestAnimationFrame(render);
    };
    const onResize = () => {
      lastReducedPosition = -1;
      resize();
      if (paused) render(performance.now());
    };
    resize();
    render(performance.now());
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, [equipmentTargets, targets, rotations, flight, locale, reduced, paused, selected, hovered]);
  return (
    <>
      <canvas ref={canvas} className="cosmic-stars" aria-hidden="true" />
      <div className="planet-field" aria-hidden="true">
        {worlds.map((world, i) => (
          <div
            key={i}
            className={`planet-plane plane-${i}`}
            ref={(node) => {
              layers.current[i] = node;
            }}
          >
            <img
              src={world.src}
              alt=""
              width="1254"
              height="1254"
              fetchPriority={i === 0 ? 'high' : 'low'}
              decoding="async"
              draggable={false}
            />
            {!('moon' in world) && <PlanetArtifact id={world.id} view={chapterViews[world.id]} />}
          </div>
        ))}
      </div>
    </>
  );
}
