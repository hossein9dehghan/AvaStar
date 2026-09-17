'use client';
import { useEffect, useRef } from 'react';
import { cosmicStageWidth } from '@/lib/cosmic-layout';
import { paintGalaxy } from '@/lib/galaxy-art';
import type { CosmicBackdropProps } from './cosmic-backdrop';

export function HeroGalaxy({ flight, locale, reduced, paused }: CosmicBackdropProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext('2d');
    if (!node || !ctx) return;
    node.width = node.height = 1200;
    paintGalaxy(ctx, 1200);
  }, []);
  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    let frame = 0,
      previous = 0,
      px = 0,
      py = 0;
    let width = innerWidth,
      height = innerHeight;
    const render = (now: number) => {
      const state = flight.current;
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60;
      previous = now;
      px += ((reduced ? 0 : state.pointerX) - px) * (1 - Math.exp(-7 * dt));
      py += ((reduced ? 0 : state.pointerY) - py) * (1 - Math.exp(-7 * dt));
      const p = Math.max(0, Math.min(1, reduced ? Math.round(state.position) : state.position));
      const fade = 1 - p * p * (3 - 2 * p);
      const stage = cosmicStageWidth(width),
        mobile = width <= 760;
      const size = mobile
        ? Math.min(width * 1.18, height * 0.62)
        : Math.min(stage * 0.6, height * 1.02);
      const x = mobile ? width / 2 : width / 2 + (locale === 'fa' ? -1 : 1) * stage * 0.235;
      const y = height * (mobile ? 0.75 : 0.48);
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      node.style.opacity = String(fade);
      node.style.visibility = fade < 0.005 ? 'hidden' : 'visible';
      node.style.transform = `translate3d(${x + px * 16}px,${y + py * 10}px,0) translate(-50%,-50%) perspective(1000px) rotateX(${-py * 4}deg) rotateY(${px * 5}deg) scale(${reduced ? 1 : 1 + p * 0.45})`;
      if (!paused) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      width = innerWidth;
      height = innerHeight;
      if (paused) render(performance.now());
    };
    render(performance.now());
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [flight, locale, reduced, paused]);
  return <canvas ref={canvas} className="hero-galaxy" aria-hidden="true" />;
}
