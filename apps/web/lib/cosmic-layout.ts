import type { Locale } from './avastar';

export const COSMIC_STAGE_MAX = 1440;
export const cosmicStageWidth = (width: number) => Math.min(width, COSMIC_STAGE_MAX);

export const FLIGHT_STEP = 18;
export const PLANET_DISTANCE = 10;
export const CAMERA_FOV = 50;

/** The scene and its DOM hit targets use the same mirrored composition. */
export function worldLayout(
  step: number,
  side: number,
  ringed: boolean,
  width: number,
  height: number,
  locale: Locale,
) {
  const mobile = width <= 760;
  const stageWidth = cosmicStageWidth(width);
  const hero = step === 0;
  const direction = locale === 'fa' ? 1 : -1;
  const centerX = mobile ? 0.5 : 0.5 + (side * direction * stageWidth * 0.24) / width;
  const centerY = mobile ? (hero ? 0.73 : Math.min(height * 0.2, 150) / height) : 0.48;
  const radius = mobile
    ? Math.min(width * (hero ? (ringed ? 0.21 : 0.255) : 0.2), height * (hero ? 0.12 : 0.075))
    : Math.min(stageWidth * (ringed ? 0.115 : 0.18), height * (ringed ? 0.205 : 0.28));
  const viewHeight = 2 * PLANET_DISTANCE * Math.tan((CAMERA_FOV * Math.PI) / 360);
  return {
    x: (centerX - 0.5) * viewHeight * (width / height),
    y: (0.5 - centerY) * viewHeight,
    z: -PLANET_DISTANCE - step * FLIGHT_STEP,
    radius: (radius / height) * viewHeight,
  };
}
