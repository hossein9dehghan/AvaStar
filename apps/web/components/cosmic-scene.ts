import * as THREE from 'three';
import { starAppearance } from '@/lib/star-appearance';
import { advancePlanetRotation } from '@/lib/planet-rotation';
import { placePlanetTarget } from '@/lib/cosmic-hit-target';
import { CAMERA_FOV, FLIGHT_STEP, PLANET_DISTANCE, worldLayout } from '@/lib/cosmic-layout';
import {
  atmosphereFragment,
  ringFragment,
  starFragment,
  starVertex,
  surfaceFragment,
  surfaceVertex,
} from '@/lib/cosmic-shaders';
import type { CosmicBackdropProps } from './cosmic-backdrop';

const worlds = [
  {
    step: 0,
    id: 'learn',
    side: -1,
    style: 1,
    ring: true,
    colors: ['#344660', '#8498b5', '#b8d0e5'],
    tilt: -0.4,
    spin: 0.027,
  },
  {
    step: 1,
    id: 'learn',
    side: -1,
    style: 0,
    ring: false,
    colors: ['#102341', '#446eac', '#94caff'],
    tilt: 0.16,
    spin: 0.036,
  },
  {
    step: 2,
    id: 'explore',
    side: 1,
    style: 1,
    ring: true,
    colors: ['#322331', '#b78159', '#e3bea0'],
    tilt: 0.33,
    spin: 0.03,
  },
  {
    step: 3,
    id: 'shop',
    side: -1,
    style: 2,
    ring: false,
    colors: ['#285676', '#a9c3cf', '#ebf8fd'],
    tilt: -0.23,
    spin: 0.032,
  },
  {
    step: 4,
    id: 'club',
    side: 1,
    style: 3,
    ring: false,
    colors: ['#1c203f', '#686391', '#a9c4ed'],
    tilt: 0.26,
    spin: 0.035,
  },
] as const;

export type CosmicScene = { invalidate: () => void; dispose: () => void };

/** One perspective camera, depth buffer and frame clock for the complete journey. */
export async function createCosmicScene(
  canvas: HTMLCanvasElement,
  read: () => CosmicBackdropProps,
  onUnavailable: () => void,
): Promise<CosmicScene> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'default',
  });
  const loader = new THREE.TextureLoader();
  const loaded = await Promise.allSettled(
    [
      'saturn.jpg',
      'earth.jpg',
      'moon.jpg',
      'neptune.jpg',
      'saturn-ring.png',
      'earth-clouds.jpg',
    ].map((name) => loader.loadAsync(`/art/textures/${name}`)),
  );
  const textures = loaded.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  );
  if (textures.length !== loaded.length) {
    textures.forEach((texture) => texture.dispose());
    renderer.dispose();
    throw new Error('Planet textures could not be loaded');
  }
  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    texture.wrapS = THREE.RepeatWrapping;
  });
  const [saturnMap, earthMap, moonMap, neptuneMap, ringMap, cloudMap] = textures;
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  let shaderFailed = false;
  renderer.debug.onShaderError = () => {
    shaderFailed = true;
  };
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 240);
  const light = new THREE.Vector3(-0.8, 0.45, 0.85).normalize();
  const geometry = new THREE.SphereGeometry(
    1,
    innerWidth <= 760 ? 64 : 80,
    innerWidth <= 760 ? 40 : 56,
  );
  const ringGeometry = new THREE.RingGeometry(1.28, 2.18, 160);
  const resources: { dispose: () => void }[] = [geometry, ringGeometry, ...textures];
  let width = innerWidth,
    height = innerHeight,
    frame = 0,
    previous = 0,
    elapsed = 0;
  let disposed = false,
    dirty = true,
    lastPosition = -1,
    lastRotationRevision = -1,
    pointerX = 0,
    pointerY = 0,
    pointerActive = 0;

  function makeWorld(definition: (typeof worlds)[number], moon = false) {
    const group = new THREE.Group();
    const center = new THREE.Vector3();
    const ringNormal = new THREE.Vector3(0, 1, 0);
    const uniforms = {
      uMap: {
        value: moon
          ? moonMap
          : [saturnMap, earthMap, saturnMap, moonMap, neptuneMap][definition.step],
      },
      uCloudMap: { value: cloudMap },
      uCloud: { value: !moon && definition.step === 1 ? 1 : 0 },
      uCloudShift: { value: 0 },
      uRock: { value: moon || definition.step === 3 ? 1 : 0 },
      uColorA: { value: new THREE.Color(moon ? '#273448' : definition.colors[0]) },
      uColorB: { value: new THREE.Color(moon ? '#718197' : definition.colors[1]) },
      uColorC: { value: new THREE.Color(moon ? '#b0c6df' : definition.colors[2]) },
      uLight: { value: light },
      uCenter: { value: center },
      uRingNormal: { value: ringNormal },
      uStyle: { value: moon ? 0 : definition.style },
      uSeed: { value: definition.step * 3.73 + (moon ? 15 : 1.7) },
      uRadius: { value: 1 },
      uOpacity: { value: 0 },
      uRing: { value: !moon && definition.ring ? 1 : 0 },
    };
    // Stars render first without writing depth. Solid hemispheres then cover them completely.
    const surface = new THREE.ShaderMaterial({
      vertexShader: surfaceVertex,
      fragmentShader: surfaceFragment,
      uniforms,
      transparent: true,
      depthWrite: true,
    });
    const body = new THREE.Mesh(geometry, surface);
    group.add(body);
    const atmosphere = new THREE.ShaderMaterial({
      vertexShader: surfaceVertex,
      fragmentShader: atmosphereFragment,
      uniforms: {
        uColor: {
          value: new THREE.Color(definition.colors[2]).lerp(new THREE.Color('#428cff'), 0.38),
        },
        uLight: uniforms.uLight,
        uOpacity: uniforms.uOpacity,
      },
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const halo = new THREE.Mesh(geometry, atmosphere);
    halo.scale.setScalar(moon ? 1.015 : 1.028);
    halo.renderOrder = 2;
    if (!moon && definition.step !== 3) group.add(halo);
    resources.push(surface, atmosphere);
    if (definition.ring && !moon) {
      const material = new THREE.ShaderMaterial({
        vertexShader: surfaceVertex,
        fragmentShader: ringFragment,
        uniforms: {
          uMap: { value: ringMap },
          uColor: { value: new THREE.Color('#e6d2ac') },
          uLight: uniforms.uLight,
          uCenter: uniforms.uCenter,
          uRadius: uniforms.uRadius,
          uOpacity: uniforms.uOpacity,
        },
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeometry, material);
      ring.rotation.x = -Math.PI / 2;
      ring.renderOrder = 1;
      group.add(ring);
      resources.push(material);
    }
    scene.add(group);
    return { definition, group, body, uniforms, radius: 1, focus: 1 };
  }
  const planets = worlds.map((world) => makeWorld(world));
  const moon = makeWorld(worlds[4], true);
  const moonOffset = new THREE.Vector3();
  const projected = new THREE.Vector3();

  let seed = 92741;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const starCount = 6200;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  const brightness = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    positions.set([(random() - 0.5) * 164, (random() - 0.5) * 100, random() * 90], i * 3);
    const appearance = starAppearance(random(), random());
    colors.set(appearance.rgb, i * 3);
    sizes[i] = appearance.radius * 2;
    brightness[i] = appearance.brightness;
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  starsGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  starsGeometry.setAttribute('aBrightness', new THREE.BufferAttribute(brightness, 1));
  const starsMaterial = new THREE.ShaderMaterial({
    vertexShader: starVertex,
    fragmentShader: starFragment,
    uniforms: {
      uTravel: { value: 0 },
      uDpr: { value: 1 },
      uActive: { value: 0 },
      uCamera: { value: new THREE.Vector2() },
      uPointer: { value: new THREE.Vector2() },
      uViewport: { value: new THREE.Vector2() },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  stars.frustumCulled = false;
  stars.renderOrder = -10;
  scene.add(stars);
  resources.push(starsGeometry, starsMaterial);

  function resize() {
    width = innerWidth;
    height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, width <= 760 ? 1.25 : 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    starsMaterial.uniforms.uDpr.value = dpr;
    starsMaterial.uniforms.uViewport.value.set(width, height);
    starsGeometry.setDrawRange(0, width <= 760 ? 4000 : starCount);
    for (const planet of planets) {
      const def = planet.definition;
      const layout = worldLayout(def.step, def.side, def.ring, width, height, read().locale);
      planet.group.position.set(layout.x, layout.y, layout.z);
      planet.radius = layout.radius;
    }
    dirty = true;
    invalidate();
  }

  function render(time: number) {
    frame = 0;
    if (disposed) return;
    const state = read();
    const f = state.flight.current;
    const dt = previous ? Math.min((time - previous) / 1000, 0.04) : 1 / 60;
    previous = time;
    const position = state.reduced ? Math.round(f.position) : f.position;
    if (!state.reduced && !state.paused) elapsed += dt;
    const rotationRevision = state.rotations.current.reduce(
      (sum, rotation) => sum + rotation.revision,
      0,
    );
    if (
      !state.reduced ||
      dirty ||
      position !== lastPosition ||
      rotationRevision !== lastRotationRevision
    ) {
      lastRotationRevision = rotationRevision;
      pointerX = state.reduced ? 0 : THREE.MathUtils.damp(pointerX, f.pointerX, 8, dt);
      pointerY = state.reduced ? 0 : THREE.MathUtils.damp(pointerY, f.pointerY, 8, dt);
      pointerActive = THREE.MathUtils.damp(
        pointerActive,
        !state.reduced && f.pointerActive ? 1 : 0,
        9,
        dt,
      );
      camera.position.set(pointerX * 0.65, -pointerY * 0.42, -position * FLIGHT_STEP);
      starsMaterial.uniforms.uTravel.value = position * FLIGHT_STEP;
      starsMaterial.uniforms.uCamera.value.set(camera.position.x, camera.position.y);
      starsMaterial.uniforms.uPointer.value.set(pointerX, -pointerY);
      starsMaterial.uniforms.uActive.value = pointerActive;
      for (const planet of planets) {
        const def = planet.definition;
        const rotation = state.rotations.current[def.step];
        advancePlanetRotation(rotation, state.paused ? 0 : dt, state.reduced);
        const distance = PLANET_DISTANCE + (def.step - position) * FLIGHT_STEP;
        const near = THREE.MathUtils.clamp((distance - 1.4) / 3, 0, 1);
        const far = Math.exp(-Math.max(0, distance - 15) * 0.23);
        const opacity =
          distance > 1.4 && (!state.reduced || def.step === position) ? near * far : 0;
        const target = !state.reduced && def.id === (state.selected || state.hovered) ? 1.035 : 1;
        planet.focus = THREE.MathUtils.damp(planet.focus, target, 10, dt);
        planet.group.visible = opacity > 0.008;
        planet.group.scale.setScalar(planet.radius * planet.focus);
        planet.group.rotation.set(
          0.38 + pointerY * 0.045 + rotation.pitch,
          rotation.yaw * 0.18,
          def.tilt - pointerX * 0.025,
        );
        planet.body.rotation.y = def.step * 1.6 + elapsed * def.spin + rotation.yaw;
        planet.uniforms.uOpacity.value = opacity;
        planet.uniforms.uCloudShift.value = elapsed * 0.001;
        // Use the actual camera projection, including pointer parallax, for DOM hit areas.
        camera.updateMatrixWorld();
        projected.copy(planet.group.position).project(camera);
        const projectedRadius =
          (planet.radius * planet.focus * height) /
          (2 * Math.tan((CAMERA_FOV * Math.PI) / 360) * Math.max(0.1, distance));
        placePlanetTarget(
          state.targets.current[def.step],
          ((projected.x + 1) * width) / 2,
          ((1 - projected.y) * height) / 2,
          projectedRadius,
          Math.round(position) === def.step && opacity > 0.15,
        );
        planet.uniforms.uCenter.value.copy(planet.group.position);
        planet.uniforms.uRadius.value = planet.radius * planet.focus;
        planet.uniforms.uRingNormal.value.set(0, 1, 0).applyQuaternion(planet.group.quaternion);
      }
      const parent = planets[4];
      const orbit = 2.7 + elapsed * 0.035;
      const direction = state.locale === 'fa' ? 1 : -1;
      moon.group.visible = parent.group.visible;
      moonOffset.set(
        Math.cos(orbit) * parent.radius * 1.65 * direction,
        Math.sin(orbit) * parent.radius * 0.72 + parent.radius * 0.6,
        Math.sin(orbit) * parent.radius * 1.2,
      );
      moon.group.position.copy(parent.group.position).add(moonOffset);
      moon.group.scale.setScalar(parent.radius * 0.19);
      moon.body.rotation.y = elapsed * 0.06;
      moon.uniforms.uCenter.value.copy(moon.group.position);
      moon.uniforms.uOpacity.value = parent.uniforms.uOpacity.value;
      renderer.render(scene, camera);
      dirty = false;
      lastPosition = position;
    }
    if (!state.paused) frame = requestAnimationFrame(render);
    else previous = 0;
  }
  function invalidate() {
    if (disposed) return;
    dirty = true;
    if (!frame) frame = requestAnimationFrame(render);
  }
  function contextLost(event: Event) {
    event.preventDefault();
    dispose();
    onUnavailable();
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('webglcontextlost', contextLost);
    resources.forEach((resource) => resource.dispose());
    renderer.dispose();
  }
  try {
    resize();
    renderer.compile(scene, camera);
    // Validate the actual shader programs before replacing the fallback artwork.
    cancelAnimationFrame(frame);
    render(performance.now());
    if (shaderFailed) throw new Error('Unable to compile the cosmic scene');
  } catch (error) {
    dispose();
    throw error;
  }
  window.addEventListener('resize', resize);
  canvas.addEventListener('webglcontextlost', contextLost);
  return { invalidate, dispose };
}
