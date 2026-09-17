export type PlanetRotation = {
  yaw: number;
  pitch: number;
  yawSpeed: number;
  pitchSpeed: number;
  dragging: boolean;
  revision: number;
};
export const createPlanetRotation = (): PlanetRotation => ({
  yaw: 0,
  pitch: 0,
  yawSpeed: 0,
  pitchSpeed: 0,
  dragging: false,
  revision: 0,
});
export const limitPitch = (pitch: number) => Math.max(-0.65, Math.min(0.65, pitch));
export function advancePlanetRotation(rotation: PlanetRotation, dt: number, reduced: boolean) {
  if (rotation.dragging) return;
  if (reduced) {
    rotation.yawSpeed = rotation.pitchSpeed = 0;
    return;
  }
  const decay = Math.exp(-6 * dt);
  rotation.yaw += (rotation.yawSpeed * (1 - decay)) / 6;
  rotation.pitch = limitPitch(rotation.pitch + (rotation.pitchSpeed * (1 - decay)) / 6);
  rotation.yawSpeed *= decay;
  rotation.pitchSpeed *= decay;
  if (Math.abs(rotation.yawSpeed) < 0.001) rotation.yawSpeed = 0;
  if (Math.abs(rotation.pitchSpeed) < 0.001) rotation.pitchSpeed = 0;
}
