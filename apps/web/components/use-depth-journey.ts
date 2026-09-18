'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { advanceCopyMotion } from '@/lib/copy-motion';

export const stops = [
  'main',
  'learn',
  'explore',
  'shop',
  'club',
  'journal',
  'about',
  'partners',
  'faq',
  'footer',
] as const;
export type FlightState = {
  position: number;
  velocity: number;
  pointerX: number;
  pointerY: number;
  pointerActive: boolean;
};
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));

export function useDepthJourney(enabled: boolean, reduced: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigationFrame = useRef(0);
  const flight = useRef<FlightState>({
    position: 0,
    velocity: 0,
    pointerX: 0,
    pointerY: 0,
    pointerActive: false,
  });
  const [station, setStation] = useState(0),
    [progress, setProgress] = useState(0);
  const reducedRef = useRef(reduced);
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);
  const jump = useCallback((index: number, instant = false) => {
    const runway = rootRef.current?.querySelector<HTMLElement>('.depth-main');
    if (!runway) return;
    const distance = Math.max(1, runway.offsetHeight - window.innerHeight);
    const top = (clamp(index, 0, stops.length - 1) / (stops.length - 1)) * distance;
    cancelAnimationFrame(navigationFrame.current);
    if (instant || reducedRef.current) {
      window.scrollTo({ top, behavior: 'instant' });
      navigationFrame.current = 0;
    } else {
      // Retarget an in-flight native scroll before starting the next journey leg.
      window.scrollTo({ top: window.scrollY, behavior: 'instant' });
      navigationFrame.current = requestAnimationFrame(() => {
        navigationFrame.current = 0;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    }
  }, []);
  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;
    const runway = root.querySelector<HTMLElement>('.depth-main');
    if (!runway) return;
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-depth-stop]'));
    const copyLayers = panels.map((panel) => {
      const copy = panel.querySelector<HTMLElement>('.hero-copy, .planet-copy');
      const elements = Array.from((copy || panel).children).filter(
        (node): node is HTMLElement => node instanceof HTMLElement,
      );
      if (copy) {
        const footer = panel.querySelector<HTMLElement>('.hero-bottom');
        if (footer) elements.push(footer);
      }
      return {
        panel,
        index: Number(panel.dataset.depthStop),
        nodes: elements.map((element, order) => {
          element.dataset.copyMotion = '';
          return {
            element,
            order,
            opacity: { value: 0, velocity: 0 },
            y: { value: 0, velocity: 0 },
            delay: 0,
            exitY: 0,
          };
        }),
      };
    });
    let raf = 0,
      lastTime = 0,
      target = 0,
      lastStation = -1,
      lastProgress = -1,
      oldWidth = window.innerWidth,
      oldHeight = window.innerHeight;
    const measure = () => {
      target =
        clamp(window.scrollY / Math.max(1, runway.offsetHeight - window.innerHeight)) *
        (stops.length - 1);
    };
    const paint = (position: number, dt = 0) => {
      const current = Math.round(position);
      const initial = lastStation < 0;
      const changed = current !== lastStation;
      const direction = initial || current >= lastStation ? 1 : -1;
      let moving = false;
      if (current !== lastStation) {
        lastStation = current;
        setStation(current);
      }
      const p = position / (stops.length - 1);
      if (Math.abs(p - lastProgress) > 0.003 || p === 0 || p === 1) {
        setProgress(p);
        lastProgress = p;
      }
      root.style.setProperty('--flight-progress', String(p));
      root.dataset.station = String(current);
      for (const layer of copyLayers) {
        const { panel, index, nodes } = layer;
        panel.style.setProperty('--panel-opacity', '1');
        panel.style.setProperty('--panel-z', '0px');
        panel.style.setProperty('--panel-blur', '0px');
        const active = current === index;
        let visible = active;
        for (const node of nodes) {
          if (initial) {
            node.opacity.value = active ? 1 : 0;
            node.y.value = 0;
          } else if (changed) {
            node.delay =
              active && !reducedRef.current && node.opacity.value < 0.002
                ? 0.09 + Math.min(node.order, 4) * 0.042
                : 0;
            // Only place an entirely invisible item at its new entrance position.
            // Visible items retain both presentation value and velocity on reversal.
            if (active && node.opacity.value < 0.002) {
              node.y.value = direction * 22;
              node.y.velocity = 0;
            }
            node.exitY = -direction * 14;
          }
          const step = Math.max(0, dt - node.delay);
          node.delay = Math.max(0, node.delay - dt);
          if (reducedRef.current) {
            node.delay = 0;
            node.y.value = node.y.velocity = 0;
            advanceCopyMotion(node.opacity, active ? 1 : 0, 42, dt);
          } else if (step > 0) {
            advanceCopyMotion(node.opacity, active ? 1 : 0, active ? 15 : 23, step);
            advanceCopyMotion(node.y, active ? 0 : node.exitY, active ? 13 : 20, step);
          }
          const opacity = clamp(node.opacity.value);
          node.element.style.setProperty('--copy-opacity', opacity.toFixed(4));
          node.element.style.setProperty('--copy-y', `${node.y.value.toFixed(3)}px`);
          visible ||= opacity > 0.002;
          moving ||=
            node.delay > 0 ||
            node.opacity.velocity !== 0 ||
            node.y.velocity !== 0 ||
            Math.abs(node.opacity.value - (active ? 1 : 0)) > 0.001;
        }
        // Keep the outgoing panel painted until its last text layer is transparent.
        panel.style.visibility = visible ? 'visible' : 'hidden';
        panel.inert = !active;
        panel.setAttribute('aria-hidden', String(!active));
        panel.dataset.current = String(active);
      }
      return moving;
    };
    const tick = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.06) : 1 / 60;
      lastTime = time;
      const previous = flight.current.position;
      const next = reducedRef.current
        ? target
        : previous + (target - previous) * (1 - Math.exp(-11 * dt));
      flight.current.position = Math.abs(next - target) < 0.0002 ? target : next;
      flight.current.velocity = reducedRef.current ? 0 : (flight.current.position - previous) / dt;
      const moving = paint(flight.current.position, dt);
      if (moving || Math.abs(flight.current.position - target) > 0.0002) {
        raf = requestAnimationFrame(tick);
      } else {
        flight.current.velocity = 0;
        raf = 0;
        lastTime = 0;
      }
    };
    const schedule = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const navigate = (hash: string, instant = false) => {
      const i = stops.indexOf(hash.replace('#', '') as (typeof stops)[number]);
      if (i < 0) return false;
      jump(i, instant);
      schedule();
      return true;
    };
    const click = (event: MouseEvent) => {
      const a = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (
        !a ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      const url = new URL(a.href, location.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        !url.hash ||
        !stops.includes(url.hash.slice(1) as (typeof stops)[number])
      )
        return;
      event.preventDefault();
      history.pushState({ avastarStop: url.hash }, '', url.hash);
      navigate(url.hash);
    };
    const hash = (event: PopStateEvent) => {
      if (location.hash.startsWith('#planet-')) return;
      if (typeof event.state?.avastarDepth === 'number') {
        jump(event.state.avastarDepth, true);
        schedule();
        return;
      }
      navigate(location.hash || '#main');
    };
    const pointer = (event: PointerEvent) => {
      // The observatory at the start may follow the cursor. Once the journey reaches
      // a chapter, only a direct drag on a planet may change its orientation.
      if (event.pointerType === 'touch' || reducedRef.current || flight.current.position > 0.35) {
        resetPointer();
        return;
      }
      flight.current.pointerActive = true;
      flight.current.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      flight.current.pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const resetPointer = () => {
      flight.current.pointerActive = false;
      flight.current.pointerX = 0;
      flight.current.pointerY = 0;
    };
    const resize = () => {
      const breakpointChanged = window.innerWidth <= 760 !== oldWidth <= 760;
      // Scrollbar changes must not cancel an in-flight section navigation.
      if (
        !breakpointChanged &&
        Math.abs(window.innerWidth - oldWidth) < 32 &&
        Math.abs(window.innerHeight - oldHeight) < 100
      )
        return;
      oldWidth = window.innerWidth;
      oldHeight = window.innerHeight;
      jump(flight.current.position, true);
      schedule();
    };
    measure();
    flight.current.position = target;
    paint(target);
    if (location.hash)
      requestAnimationFrame(() => navigate(location.hash.replace('#planet-', '#'), true));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    window.addEventListener('popstate', hash);
    root.addEventListener('click', click);
    window.addEventListener('pointermove', pointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', resetPointer);
    window.addEventListener('blur', resetPointer);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(navigationFrame.current);
      copyLayers.forEach(({ nodes }) =>
        nodes.forEach(({ element }) => {
          delete element.dataset.copyMotion;
          element.style.removeProperty('--copy-opacity');
          element.style.removeProperty('--copy-y');
        }),
      );
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      window.removeEventListener('popstate', hash);
      root.removeEventListener('click', click);
      window.removeEventListener('pointermove', pointer);
      document.documentElement.removeEventListener('pointerleave', resetPointer);
      window.removeEventListener('blur', resetPointer);
    };
  }, [enabled, jump]);
  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;
    const move = (event: PointerEvent) => {
      if (reduced || event.pointerType !== 'mouse') return;
      const element = (event.target as Element).closest<HTMLElement>(
        '.primary-button,.planet-button,.journal-card,.orbit-links a',
      );
      if (!element) return;
      const rect = element.getBoundingClientRect();
      element.style.setProperty('--hover-x', `${event.clientX - rect.left}px`);
      element.style.setProperty('--hover-y', `${event.clientY - rect.top}px`);
    };
    root.addEventListener('pointermove', move, { passive: true });
    return () => root.removeEventListener('pointermove', move);
  }, [enabled, reduced]);
  return { rootRef, flight, station, progress, jump };
}
