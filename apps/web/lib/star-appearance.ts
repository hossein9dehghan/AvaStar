/** Mostly faint, small stars, with progressively fewer bright foreground points. */
export function starAppearance(magnitude: number, temperature: number) {
  return {
    radius: 0.38 + Math.pow(magnitude, 6) * 1.45,
    brightness: 0.26 + magnitude * 0.52,
    rgb:
      temperature < 0.12 ? [1, 0.86, 0.7] : temperature > 0.86 ? [0.72, 0.84, 1] : [0.9, 0.94, 1],
  };
}
