'use client';
import { useEffect, useRef, type PointerEvent } from 'react';
import { Move, RotateCcw } from 'lucide-react';
import { paintObservatory, paintPlanetDisc } from '@/lib/observatory-art';
import { planetIds, planets, type Locale } from '@/lib/avastar';
import type { FlightState } from './use-depth-journey';

export function InteractiveObservatory({
  locale,
  flight,
  reduced,
  paused,
  onExplore,
}: {
  locale: Locale;
  flight: React.MutableRefObject<FlightState>;
  reduced: boolean;
  paused: boolean;
  onExplore: (step: number) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null),
    buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const bodies = useRef<(HTMLCanvasElement | undefined)[]>([]);
  const motion = useRef({
    yaw: -0.12,
    pitch: 0.75,
    vx: 0,
    vy: 0,
    hover: -1,
    dragging: false,
    x: 0,
    y: 0,
    last: 0,
    revision: 0,
  });
  const gesture = useRef<null | { id: number; x: number; y: number; type: string; moved: boolean }>(
    null,
  );
  useEffect(() => {
    let cancelled = false;
    const images = ['earth.jpg', 'saturn.jpg', 'moon.jpg', 'neptune.jpg'].map((name, i) => {
      const image = new Image();
      image.onload = () => {
        if (cancelled) return;
        const map = document.createElement('canvas');
        map.width = 1024;
        map.height = 512;
        const context = map.getContext('2d');
        if (!context) return;
        context.drawImage(image, 0, 0, 1024, 512);
        const disc = document.createElement('canvas');
        disc.width = disc.height = 192;
        const surface = disc.getContext('2d');
        if (!surface) return;
        paintPlanetDisc(surface, context.getImageData(0, 0, 1024, 512), 192, 0.58 + i * 0.13);
        bodies.current[i] = disc;
        motion.current.revision++;
      };
      image.src = `/art/textures/${name}`;
      return image;
    });
    return () => {
      cancelled = true;
      images.forEach((image) => {
        image.onload = null;
      });
    };
  }, []);
  useEffect(() => {
    const node = canvas.current,
      ctx = node?.getContext('2d');
    if (!node || !ctx) return;
    let frame = 0,
      previous = 0,
      time = 0,
      px = 0,
      py = 0,
      lastRevision = -1;
    const render = (now: number) => {
      const dt = previous ? Math.min((now - previous) / 1000, 0.04) : 1 / 60;
      previous = now;
      const s = motion.current,
        visible = flight.current.position < 1;
      const p = Math.max(0, Math.min(1, flight.current.position));
      if (root.current) {
        root.current.style.opacity = String(1 - p * p * (3 - 2 * p));
        root.current.style.scale = String(reduced ? 1 : 1 + p * 0.12);
      }
      if (visible && (!reduced || s.revision !== lastRevision)) {
        if (!paused && !reduced) {
          time += dt;
          if (!s.dragging) {
            s.yaw += s.vx * dt;
            s.pitch = Math.max(-0.55, Math.min(1.3, s.pitch + s.vy * dt));
            s.vx *= Math.exp(-5 * dt);
            s.vy *= Math.exp(-5 * dt);
          }
        }
        px += ((reduced ? 0 : flight.current.pointerX) - px) * (1 - Math.exp(-8 * dt));
        py += ((reduced ? 0 : flight.current.pointerY) - py) * (1 - Math.exp(-8 * dt));
        const points = paintObservatory(
          ctx,
          1200,
          {
            yaw: s.yaw + px * 0.24,
            pitch: s.pitch + py * 0.16,
            hover: s.hover,
            time,
          },
          bodies.current,
        );
        points.forEach((p, i) => {
          const b = buttons.current[i];
          if (b) {
            b.style.left = `${p.x / 8}%`;
            b.style.top = `${p.y / 8}%`;
          }
        });
        lastRevision = s.revision;
      }
      if (!paused) frame = requestAnimationFrame(render);
    };
    render(performance.now());
    return () => cancelAnimationFrame(frame);
  }, [flight, reduced, paused]);
  const end = (event: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || event.pointerId !== g.id) return;
    const s = motion.current;
    s.dragging = false;
    if (reduced || performance.now() - s.last > 100) s.vx = s.vy = 0;
    gesture.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const help =
    locale === 'fa'
      ? 'با درگ بچرخانید؛ یک مسیر را انتخاب کنید.'
      : 'Drag to rotate. Choose an orbit.';
  return (
    <div
      ref={root}
      className="hero-observatory"
      role="group"
      aria-label={locale === 'fa' ? 'منظومهٔ تعاملی آوا استار' : 'Interactive Avastar observatory'}
    >
      <div
        className="observatory-grab"
        tabIndex={0}
        role="group"
        aria-label={
          locale === 'fa'
            ? 'چرخش منظومه؛ از کلیدهای جهت استفاده کنید'
            : 'Rotate the observatory with arrow keys'
        }
        onKeyDown={(e) => {
          if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
          e.preventDefault();
          const s = motion.current;
          s.vx = s.vy = 0;
          s.yaw += e.key === 'ArrowRight' ? 0.15 : e.key === 'ArrowLeft' ? -0.15 : 0;
          s.pitch = Math.max(
            -0.55,
            Math.min(1.3, s.pitch + (e.key === 'ArrowDown' ? 0.1 : e.key === 'ArrowUp' ? -0.1 : 0)),
          );
          s.revision++;
        }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          const s = motion.current;
          gesture.current = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
            type: e.pointerType,
            moved: false,
          };
          s.x = e.clientX;
          s.y = e.clientY;
          s.last = performance.now();
          s.vx = s.vy = 0;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const g = gesture.current;
          if (!g || e.pointerId !== g.id) return;
          const dx = e.clientX - g.x,
            dy = e.clientY - g.y;
          if (!g.moved) {
            if (Math.hypot(dx, dy) < 6) return;
            if (g.type === 'touch' && Math.abs(dy) > Math.abs(dx)) return;
            g.moved = true;
          }
          e.preventDefault();
          const s = motion.current,
            now = performance.now(),
            dt = Math.max(0.01, (now - s.last) / 1000),
            mx = (e.clientX - s.x) * 0.007,
            my = (e.clientY - s.y) * 0.005;
          s.dragging = true;
          e.currentTarget.dataset.dragging = 'true';
          s.yaw += mx;
          s.pitch = Math.max(-0.55, Math.min(1.3, s.pitch + my));
          s.vx = Math.max(-2, Math.min(2, mx / dt));
          s.vy = Math.max(-1, Math.min(1, my / dt));
          s.x = e.clientX;
          s.y = e.clientY;
          s.last = now;
          s.revision++;
        }}
        onPointerUp={end}
        onPointerCancel={(e) => {
          motion.current.vx = motion.current.vy = 0;
          end(e);
        }}
        onLostPointerCapture={() => {
          gesture.current = null;
          motion.current.dragging = false;
        }}
        onBlur={() => {
          motion.current.vx = motion.current.vy = 0;
          motion.current.dragging = false;
          gesture.current = null;
        }}
      />
      <canvas ref={canvas} width={1200} height={1200} aria-hidden="true" />
      {planetIds.map((id, i) => (
        <button
          key={id}
          className="observatory-destination"
          ref={(node) => {
            buttons.current[i] = node;
          }}
          aria-label={`${locale === 'fa' ? 'رفتن به' : 'Go to'} ${planets[id][locale].name}`}
          onPointerEnter={() => {
            motion.current.hover = i;
            motion.current.revision++;
          }}
          onPointerLeave={() => {
            motion.current.hover = -1;
            motion.current.revision++;
          }}
          onFocus={() => {
            motion.current.hover = i;
            motion.current.revision++;
          }}
          onBlur={() => {
            motion.current.hover = -1;
            motion.current.revision++;
          }}
          onClick={() => onExplore(i + 1)}
        >
          <span>
            {planets[id][locale].name}
            <small aria-hidden="true">↗</small>
          </span>
        </button>
      ))}
      <div className="observatory-help">
        <Move size={14} aria-hidden="true" />
        <span>{help}</span>
        <button
          aria-label={locale === 'fa' ? 'بازنشانی زاویهٔ منظومه' : 'Reset the observatory view'}
          onClick={() => {
            Object.assign(motion.current, { yaw: -0.12, pitch: 0.75, vx: 0, vy: 0 });
            motion.current.revision++;
          }}
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}
