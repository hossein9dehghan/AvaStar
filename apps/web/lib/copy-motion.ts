export type MotionValue = { value: number; velocity: number };

/** Exact critically damped spring: stable at variable frame rates and reversible in flight. */
export function advanceCopyMotion(state: MotionValue, target: number, omega: number, dt: number) {
  const displacement = state.value - target;
  const impulse = state.velocity + omega * displacement;
  const decay = Math.exp(-omega * dt);
  state.value = target + (displacement + impulse * dt) * decay;
  state.velocity = (state.velocity - omega * impulse * dt) * decay;
  if (Math.abs(state.value - target) < 0.001 && Math.abs(state.velocity) < 0.005) {
    state.value = target;
    state.velocity = 0;
  }
}
