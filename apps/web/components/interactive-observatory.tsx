'use client';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Move } from 'lucide-react';
import { planetIds, planets, type Locale } from '@/lib/avastar';
import { Button } from '@avastar/ui/components/button';
import type { FlightState } from './use-depth-journey';
import type { createApertureScene } from '@/lib/aperture-scene';
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
  const root = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    scene = useRef<ReturnType<typeof createApertureScene> | null>(null);
  const [ready, setReady] = useState(false);
  const state = useRef({ x: 0, y: 0, tx: 0, ty: 0, revision: 0 });
  const gesture = useRef<null | { id: number; x: number; y: number; tx: number; ty: number }>(null);
  useEffect(() => {
    let cancelled = false;
    const node = canvas.current;
    const unavailable = (event: Event) => {
      event.preventDefault();
      scene.current?.dispose();
      scene.current = null;
      setReady(false);
    };
    node?.addEventListener('webglcontextlost', unavailable);
    void import('@/lib/aperture-scene')
      .then(({ createApertureScene }) => {
        if (cancelled || !canvas.current) return;
        try {
          const s = createApertureScene(canvas.current);
          scene.current = s;
          s.render({ x: 0, y: 0, travel: 0, time: 0 });
          setReady(true);
        } catch {
          scene.current?.dispose();
          scene.current = null;
        }
      })
      .catch(() => {
        /* Keep the optical fallback when the graphics chunk cannot load. */
      });
    return () => {
      node?.removeEventListener('webglcontextlost', unavailable);
      cancelled = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);
  useEffect(() => {
    let frame = 0,
      previous = 0,
      last = -1;
    const render = (now: number) => {
      const dt = previous ? Math.min((now - previous) / 1000, 0.04) : 0.016;
      previous = now;
      const s = state.current,
        p = Math.max(0, Math.min(1, flight.current.position));
      if (root.current) {
        root.current.style.opacity = String(1 - p * p * (3 - 2 * p));
        root.current.style.setProperty('--optic-x', String(s.x));
        root.current.style.setProperty('--optic-y', String(s.y));
      }
      if (p < 1 && (!reduced || last !== s.revision)) {
        const rate = reduced || gesture.current ? 1 : 1 - Math.exp(-8 * dt);
        s.x += (s.tx + (reduced ? 0 : flight.current.pointerX * 0.55) - s.x) * rate;
        s.y += (s.ty + (reduced ? 0 : flight.current.pointerY * 0.4) - s.y) * rate;
        try {
          scene.current?.render({ x: s.x, y: s.y, travel: reduced ? 0 : p, time: now / 1000 });
        } catch {
          scene.current?.dispose();
          scene.current = null;
          setReady(false);
        }
        last = s.revision;
      }
      if (!paused) frame = requestAnimationFrame(render);
    };
    render(performance.now());
    return () => cancelAnimationFrame(frame);
  }, [flight, paused, reduced, ready]);
  const turn = (n: number) => {
    state.current.tx = Math.max(-2, Math.min(2, state.current.tx + n));
    state.current.revision++;
  };
  const end = (e: PointerEvent<HTMLDivElement>) => {
    if (gesture.current?.id !== e.pointerId) return;
    gesture.current = null;
    delete e.currentTarget.dataset.dragging;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const fa = locale === 'fa';
  return (
    <div
      className="hero-observatory"
      ref={root}
      role="group"
      aria-label={fa ? 'دریچهٔ رصد آوا استار' : 'The Avastar observatory'}
    >
      <div className="aperture-fallback" aria-hidden="true" data-hidden={ready}>
        <div className="aperture-fallback-sky" />
        <i />
        <i />
        <i />
      </div>
      <canvas ref={canvas} className="aperture-canvas" data-ready={ready} aria-hidden="true" />
      <div
        className="observatory-grab"
        role="group"
        tabIndex={0}
        aria-label={
          fa
            ? 'تغییر زاویهٔ رصد؛ با درگ یا کلیدهای جهت'
            : 'Change viewing angle by dragging or using arrow keys'
        }
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            turn(e.key === 'ArrowLeft' ? -0.3 : 0.3);
          }
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            state.current.ty = Math.max(
              -1,
              Math.min(1, state.current.ty + (e.key === 'ArrowUp' ? -0.25 : 0.25)),
            );
            state.current.revision++;
          }
        }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          gesture.current = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
            tx: state.current.tx,
            ty: state.current.ty,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const g = gesture.current;
          if (!g || g.id !== e.pointerId) return;
          const dx = e.clientX - g.x,
            dy = e.clientY - g.y;
          if (e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) return;
          e.currentTarget.dataset.dragging = 'true';
          state.current.tx = Math.max(-2, Math.min(2, g.tx + dx * 0.008));
          state.current.ty = Math.max(-1, Math.min(1, g.ty + dy * 0.005));
          state.current.revision++;
        }}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={() => {
          gesture.current = null;
        }}
        onBlur={() => {
          gesture.current = null;
        }}
      />
      <div className="optical-caption">
        <span>AVASTAR OBSERVATORY</span>
        <span>{fa ? 'دریچه‌ای به بی‌نهایت' : 'A window into infinity'}</span>
      </div>
      <div className="aperture-readout av-glass" data-material="light" aria-hidden="true">
        <span>{fa ? 'میدان دید' : 'FIELD OF VIEW'}</span>
        <strong dir="ltr">08° 24′</strong>
        <i />
        <small>{fa ? 'نور، عمق، جهت' : 'LIGHT · DEPTH · DIRECTION'}</small>
      </div>
      <div
        className="observatory-tools av-glass"
        data-material="light"
        role="group"
        aria-label={fa ? 'کنترل زاویه' : 'View controls'}
      >
        <Move size={15} aria-hidden="true" />
        <Button
          variant="ghost"
          className="av-button av-button--ghost av-button--icon"
          onClick={() => turn(-0.3)}
          aria-label={fa ? 'چرخش به چپ' : 'Rotate left'}
        >
          <ArrowLeft size={16} />
        </Button>
        <Button
          variant="ghost"
          className="av-button av-button--ghost av-button--icon"
          onClick={() => {
            state.current.tx = state.current.ty = 0;
            state.current.revision++;
          }}
          aria-label={fa ? 'زاویهٔ اولیه' : 'Reset view'}
        >
          <RotateCcw size={15} />
        </Button>
        <Button
          variant="ghost"
          className="av-button av-button--ghost av-button--icon"
          onClick={() => turn(0.3)}
          aria-label={fa ? 'چرخش به راست' : 'Rotate right'}
        >
          <ArrowRight size={16} />
        </Button>
      </div>
      <nav className="observatory-paths" aria-label={fa ? 'مسیرهای آوا استار' : 'Avastar paths'}>
        {planetIds.map((id, i) => (
          <Button
            variant="ghost"
            className="av-button av-button--ghost av-button--landing"
            key={id}
            onClick={() => onExplore(i + 1)}
          >
            <small>0{i + 1}</small>
            {planets[id][locale].name}
          </Button>
        ))}
      </nav>
    </div>
  );
}
