'use client';
import { useEffect, useRef } from 'react';

type Spring = { value: number; velocity: number };
function follow(spring: Spring, target: number, dt: number) {
  const omega = 30;
  const offset = spring.value - target;
  const impulse = (spring.velocity + omega * offset) * dt;
  const decay = Math.exp(-omega * dt);
  spring.value = target + (offset + impulse) * decay;
  spring.velocity = (spring.velocity - omega * impulse) * decay;
}

/** The dot tracks the device exactly; only the decorative orbit follows with inertia. */
export function OrbitCursor({ enabled, reduced }: { enabled: boolean; reduced: boolean }) {
  const dot = useRef<HTMLDivElement>(null);
  const orbit = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const core = dot.current,
      ring = orbit.current;
    if (!enabled || !core || !ring) return;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const forcedColors = matchMedia('(forced-colors: active)');
    const html = document.documentElement;
    let x = 0,
      y = 0,
      visible = false,
      pressed = false,
      frame = 0,
      previous = 0,
      size = 28;
    const sx = { value: 0, velocity: 0 },
      sy = { value: 0, velocity: 0 },
      sr = { value: 28, velocity: 0 };
    const hide = () => {
      visible = false;
      pressed = false;
      core.dataset.visible = ring.dataset.visible = 'false';
      core.dataset.pressed = ring.dataset.pressed = 'false';
      delete html.dataset.orbitCursor;
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    };
    const tick = (time: number) => {
      frame = 0;
      if (!visible) return;
      const dt = previous ? Math.min((time - previous) / 1000, 0.04) : 1 / 60;
      previous = time;
      const targetSize = pressed ? 20 : size;
      if (reduced) {
        sx.value = x;
        sy.value = y;
        sr.value = targetSize;
      } else {
        follow(sx, x, dt);
        follow(sy, y, dt);
        follow(sr, targetSize, dt);
      }
      ring.style.transform = `translate3d(${sx.value}px,${sy.value}px,0) translate(-50%,-50%)`;
      ring.style.width = ring.style.height = `${sr.value}px`;
      if (
        Math.abs(sx.value - x) + Math.abs(sy.value - y) + Math.abs(sr.value - targetSize) >
        0.05
      ) {
        frame = requestAnimationFrame(tick);
      } else previous = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const targetChanged = (target: Element | null) => {
      if (
        !finePointer.matches ||
        forcedColors.matches ||
        !target?.closest('.avastar') ||
        target.closest(
          'input,textarea,select,[contenteditable="true"],[data-native-cursor],[disabled],[aria-disabled="true"]',
        )
      ) {
        hide();
        return;
      }
      const action = target.closest('a,button,[role="button"],summary');
      const planet = !!target.closest('.cosmic-planet-target,.observatory-grab');
      size = planet ? 50 : action ? 38 : 28;
      const kind = planet ? 'planet' : action ? 'action' : 'default';
      core.dataset.kind = ring.dataset.kind = kind;
      if (!visible) {
        sx.value = x;
        sy.value = y;
        sx.velocity = sy.velocity = 0;
        sr.value = size;
        sr.velocity = 0;
        ring.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
        ring.style.width = ring.style.height = `${size}px`;
      }
      visible = true;
      core.dataset.visible = ring.dataset.visible = 'true';
      html.dataset.orbitCursor = 'on';
      schedule();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      core.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      targetChanged(event.target instanceof Element ? event.target : null);
    };
    const press = (event: PointerEvent) => {
      if (!visible || event.pointerType !== 'mouse') return;
      pressed = event.type === 'pointerdown';
      core.dataset.pressed = ring.dataset.pressed = String(pressed);
      schedule();
    };
    const scroll = () => {
      if (visible) targetChanged(document.elementFromPoint(x, y));
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Tab') hide();
    };
    const visibility = () => {
      if (document.hidden) hide();
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', press, { passive: true });
    window.addEventListener('pointerup', press, { passive: true });
    window.addEventListener('pointercancel', hide);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('blur', hide);
    window.addEventListener('keydown', keyboard);
    html.addEventListener('pointerleave', hide);
    finePointer.addEventListener('change', hide);
    forcedColors.addEventListener('change', hide);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      hide();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', press);
      window.removeEventListener('pointercancel', hide);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('blur', hide);
      window.removeEventListener('keydown', keyboard);
      html.removeEventListener('pointerleave', hide);
      finePointer.removeEventListener('change', hide);
      forcedColors.removeEventListener('change', hide);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [enabled, reduced]);
  return (
    <>
      <div ref={dot} className="orbit-cursor-dot" aria-hidden="true" />
      <div ref={orbit} className="orbit-cursor-ring" aria-hidden="true" />
    </>
  );
}
