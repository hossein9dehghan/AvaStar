'use client';
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { Locale, PlanetId } from '@/lib/avastar';
import type { FlightState } from './use-depth-journey';
import type { PlanetRotation } from '@/lib/planet-rotation';
import type { CosmicScene } from './cosmic-scene';
import { CosmicFallback } from './cosmic-fallback';

export type CosmicBackdropProps = {
  rotations: MutableRefObject<PlanetRotation[]>;
  targets: MutableRefObject<(HTMLButtonElement | null)[]>;
  flight: MutableRefObject<FlightState>;
  locale: Locale;
  reduced: boolean;
  paused: boolean;
  selected: PlanetId | null;
  hovered: PlanetId | null;
};

export function CosmicBackdrop(props: CosmicBackdropProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef(props);
  const scene = useRef<CosmicScene | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    state.current = props;
    scene.current?.invalidate();
  }, [props]);
  useEffect(() => {
    let cancelled = false;
    void import('./cosmic-scene')
      .then(async ({ createCosmicScene }) => {
        if (cancelled || !canvas.current) return;
        const created = await createCosmicScene(
          canvas.current,
          () => state.current,
          () => setReady(false),
        );
        if (cancelled) {
          created.dispose();
          return;
        }
        scene.current = created;
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    return () => {
      cancelled = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, [props.locale]);
  return (
    <>
      {!ready && <CosmicFallback {...props} />}
      <canvas ref={canvas} className="cosmic-scene" data-ready={ready} aria-hidden="true" />
    </>
  );
}
