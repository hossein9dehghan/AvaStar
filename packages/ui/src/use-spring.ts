'use client';
import { useCallback, useEffect, useRef } from 'react';
/** A critically damped spring that preserves position and velocity when retargeted. */
export function useSpringValue(onFrame: (value: number) => void, response = 0.4) {
  const state = useRef({ position: 0, velocity: 0, target: 0, last: 0, frame: 0 });
  const callback = useRef(onFrame);
  useEffect(() => {
    callback.current = onFrame;
  }, [onFrame]);
  useEffect(() => () => cancelAnimationFrame(state.current.frame), []);
  return useCallback(
    (target: number, instant = false) => {
      const s = state.current;
      s.target = target;
      if (instant) {
        cancelAnimationFrame(s.frame);
        s.frame = 0;
        s.position = target;
        s.velocity = 0;
        callback.current(target);
        return;
      }
      if (s.frame) return;
      s.last = performance.now();
      const tick = (time: number) => {
        const dt = Math.min((time - s.last) / 1000, 0.04);
        s.last = time;
        const omega = (2 * Math.PI) / response,
          x = s.position - s.target,
          c = s.velocity + omega * x,
          decay = Math.exp(-omega * dt);
        s.position = s.target + (x + c * dt) * decay;
        s.velocity = (s.velocity - omega * c * dt) * decay;
        callback.current(s.position);
        if (Math.abs(s.position - s.target) < 0.001 && Math.abs(s.velocity) < 0.001) {
          s.position = s.target;
          s.velocity = 0;
          s.frame = 0;
          callback.current(s.target);
        } else s.frame = requestAnimationFrame(tick);
      };
      s.frame = requestAnimationFrame(tick);
    },
    [response],
  );
}
