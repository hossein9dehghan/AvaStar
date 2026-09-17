/** WCAG relative luminance for opaque six-digit sRGB colors. */
export function contrastRatio(foreground: string, background: string): number {
  const luminance = (hex: string) => {
    const rgb = hex
      .slice(1)
      .match(/.{2}/g)!
      .map((channel) => parseInt(channel, 16) / 255);
    const linear = rgb.map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const a = luminance(foreground),
    b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
