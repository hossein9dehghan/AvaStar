import * as THREE from 'three';
/** Shared soft-box reflections for brushed metal and coated optics. */
export function createOpticalEnvironment(renderer: THREE.WebGLRenderer) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#080d15';
  ctx.fillRect(0, 0, 512, 256);
  const gradient = ctx.createLinearGradient(0, 0, 512, 0);
  const stops: [number, string][] = [
    [0, '#080d15'],
    [0.15, '#263544'],
    [0.21, '#cedde3'],
    [0.29, '#101823'],
    [0.65, '#080d15'],
    [0.76, '#78634d'],
    [0.82, '#d1bfa7'],
    [0.89, '#1c2731'],
    [1, '#080d15'],
  ];
  stops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 80, 512, 105);
  const source = new THREE.CanvasTexture(canvas);
  source.mapping = THREE.EquirectangularReflectionMapping;
  source.colorSpace = THREE.SRGBColorSpace;
  const generator = new THREE.PMREMGenerator(renderer),
    target = generator.fromEquirectangular(source);
  source.dispose();
  generator.dispose();
  return { texture: target.texture, dispose: () => target.dispose() };
}
