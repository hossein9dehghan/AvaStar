'use client';
import { useEffect, useRef, type PointerEvent, type KeyboardEvent } from 'react';
import { createPlanetRotation, limitPitch } from '@/lib/planet-rotation';

export function usePlanetDrag() {
  const rotations = useRef(Array.from({ length: 5 }, createPlanetRotation));
  const gesture = useRef<null | {
    step: number;
    pointerId: number;
    startX: number;
    startY: number;
    x: number;
    y: number;
    time: number;
    moved: boolean;
    node: HTMLButtonElement;
  }>(null);
  const suppressed = useRef<number | null>(null);
  const finish = (cancelled = false) => {
    const drag = gesture.current;
    if (!drag) return;
    const rotation = rotations.current[drag.step];
    rotation.dragging = false;
    rotation.revision++;
    if (cancelled || performance.now() - drag.time > 90)
      rotation.yawSpeed = rotation.pitchSpeed = 0;
    suppressed.current = drag.moved ? drag.step : null;
    delete drag.node.dataset.dragging;
    gesture.current = null;
    if (drag.node.hasPointerCapture(drag.pointerId))
      drag.node.releasePointerCapture(drag.pointerId);
  };
  useEffect(() => {
    const blur = () => finish(true);
    window.addEventListener('blur', blur);
    return () => {
      blur();
      window.removeEventListener('blur', blur);
    };
  }, []);
  const bind = (step: number) => ({
    onPointerDown(event: PointerEvent<HTMLButtonElement>) {
      suppressed.current = null;
      if (event.pointerType === 'touch' || event.button !== 0) return;
      const rotation = rotations.current[step];
      rotation.yawSpeed = rotation.pitchSpeed = 0;
      rotation.dragging = true;
      gesture.current = {
        step,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        x: event.clientX,
        y: event.clientY,
        time: performance.now(),
        moved: false,
        node: event.currentTarget,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove(event: PointerEvent<HTMLButtonElement>) {
      const drag = gesture.current;
      if (!drag || drag.step !== step || drag.pointerId !== event.pointerId) return;
      if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 6)
        return;
      event.preventDefault();
      drag.moved = true;
      event.currentTarget.dataset.dragging = 'true';
      const now = performance.now(),
        dt = Math.max(0.008, (now - drag.time) / 1000);
      const dx = (event.clientX - drag.x) * 0.007,
        dy = (event.clientY - drag.y) * 0.005;
      const rotation = rotations.current[step];
      rotation.yaw += dx;
      rotation.pitch = limitPitch(rotation.pitch + dy);
      rotation.yawSpeed = Math.max(-2.5, Math.min(2.5, dx / dt));
      rotation.pitchSpeed = Math.max(-1.5, Math.min(1.5, dy / dt));
      rotation.revision++;
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.time = now;
    },
    onPointerUp() {
      finish();
    },
    onPointerCancel() {
      finish(true);
    },
    onLostPointerCapture() {
      if (gesture.current) finish(true);
    },
    onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const rotation = rotations.current[step];
      rotation.yaw += event.key === 'ArrowRight' ? 0.2 : event.key === 'ArrowLeft' ? -0.2 : 0;
      rotation.pitch = limitPitch(
        rotation.pitch + (event.key === 'ArrowDown' ? 0.12 : event.key === 'ArrowUp' ? -0.12 : 0),
      );
      rotation.revision++;
    },
  });
  const consumeClick = (step: number, detail: number) => {
    const dragged = detail !== 0 && suppressed.current === step;
    suppressed.current = null;
    return dragged;
  };
  const rotate = (step: number, delta: number) => {
    const r = rotations.current[step];
    r.yaw += delta;
    r.yawSpeed = r.pitchSpeed = 0;
    r.revision++;
  };
  const reset = (step: number) => {
    const r = rotations.current[step];
    Object.assign(r, createPlanetRotation(), { revision: r.revision + 1 });
  };
  return { rotations, bind, consumeClick, rotate, reset };
}
