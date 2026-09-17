import * as THREE from 'three';
import type { PlanetId } from './avastar';

/** These objects are children of the planet: perspective, drag and depth are shared. */
export function createPlanetArtifact(id: PlanetId) {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [],
    materials: THREE.Material[] = [];
  const metal = (color: string, roughness = 0.35, metalness = 0.65) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      transparent: true,
    });
    materials.push(material);
    return material;
  };
  const ivory = metal('#d9dcd5', 0.38, 0.3),
    carbon = metal('#202c39', 0.5, 0.55),
    brass = metal('#bc8a50', 0.32, 0.7),
    blue = metal('#3a7aa4', 0.25, 0.75);
  const paper = metal('#d5d2bd', 0.84, 0),
    lens = new THREE.MeshStandardMaterial({
      color: '#0c3151',
      emissive: '#126191',
      emissiveIntensity: 0.32,
      metalness: 0.75,
      roughness: 0.12,
      transparent: true,
    });
  materials.push(lens);
  const mesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    parent: THREE.Object3D = group,
  ) => {
    geometries.push(geometry);
    const m = new THREE.Mesh(geometry, material);
    parent.add(m);
    return m;
  };
  const box = (
    w: number,
    h: number,
    d: number,
    m: THREE.Material,
    parent: THREE.Object3D = group,
  ) => mesh(new THREE.BoxGeometry(w, h, d), m, parent);
  const sphere = (r: number, m: THREE.Material, parent: THREE.Object3D = group) =>
    mesh(new THREE.SphereGeometry(r, 20, 14), m, parent);
  const rod = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    r: number,
    m: THREE.Material,
    parent: THREE.Object3D = group,
  ) => {
    const v = b.clone().sub(a);
    const o = mesh(new THREE.CylinderGeometry(r, r, v.length(), 12), m, parent);
    o.position.copy(a).add(b).multiplyScalar(0.5);
    o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.normalize());
    return o;
  };
  const route = (points: THREE.Vector3[], color: string, opacity = 0.5) => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    geometries.push(g);
    const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    materials.push(m);
    const line = new THREE.Line(g, m);
    group.add(line);
    return line;
  };
  if (id === 'shop') {
    const scope = new THREE.Group();
    group.add(scope);
    scope.position.set(0.68, -0.55, 1.08);
    scope.scale.setScalar(0.8);
    scope.rotation.set(0.06, -0.32, -0.1);
    // Three splayed legs, an equatorial fork and a long optical tube.
    for (const a of [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]) {
      const foot = new THREE.Vector3(Math.cos(a) * 0.52, -1.0, Math.sin(a) * 0.52);
      rod(new THREE.Vector3(0, -0.12, 0), foot, 0.025, ivory, scope);
      sphere(0.045, carbon, scope).position.copy(foot);
    }
    rod(new THREE.Vector3(0, -0.45, 0), new THREE.Vector3(0, 0.2, 0), 0.065, carbon, scope);
    box(0.42, 0.07, 0.26, carbon, scope).position.set(0, 0.22, 0);
    for (const x of [-0.19, 0.19]) box(0.055, 0.35, 0.16, brass, scope).position.set(x, 0.36, 0);
    const tube = new THREE.Group();
    scope.add(tube);
    tube.position.set(0, 0.56, 0);
    tube.rotation.set(0.35, 0, -0.83);
    mesh(new THREE.CylinderGeometry(0.18, 0.17, 1.08, 48), ivory, tube);
    for (const y of [-0.45, 0.32])
      mesh(new THREE.CylinderGeometry(0.184, 0.184, 0.065, 48), carbon, tube).position.y = y;
    mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.17, 48), carbon, tube).position.y = 0.58;
    const glass = mesh(new THREE.CircleGeometry(0.17, 48), lens, tube);
    glass.rotation.x = -Math.PI / 2;
    glass.position.y = 0.669;
    const rim = mesh(new THREE.TorusGeometry(0.188, 0.012, 8, 48), brass, tube);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.667;
    mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.22, 20), carbon, tube).position.set(
      0,
      -0.64,
      0,
    );
    box(0.11, 0.27, 0.1, brass, tube).position.set(0.24, -0.1, 0);
    rod(new THREE.Vector3(0.24, -0.18, 0), new THREE.Vector3(0.24, 0.18, 0), 0.046, carbon, tube);
  } else if (id === 'learn') {
    const book = new THREE.Group();
    group.add(book);
    book.position.set(-0.66, -0.62, 1.16);
    book.rotation.set(-0.24, 0.15, -0.2);
    book.scale.setScalar(0.76);
    for (const side of [-1, 1]) {
      const leaf = new THREE.Group();
      book.add(leaf);
      leaf.rotation.y = side * 0.25;
      box(0.62, 0.8, 0.035, blue, leaf).position.set(side * 0.32, 0, -0.045);
      for (let i = 0; i < 6; i++)
        box(0.585, 0.76, 0.008, paper, leaf).position.set(side * 0.305, 0, -0.02 + i * 0.009);
      for (let i = 0; i < 6; i++)
        box(i === 0 ? 0.32 : 0.43, 0.009, 0.006, i === 0 ? brass : carbon, leaf).position.set(
          side * 0.31,
          0.25 - i * 0.08,
          0.045,
        );
    }
    rod(
      new THREE.Vector3(0, -0.41, -0.035),
      new THREE.Vector3(0, 0.41, -0.035),
      0.025,
      brass,
      book,
    );
    const points = Array.from({ length: 90 }, (_, i) => {
      const a = -1.2 + (i / 89) * 2.4;
      return new THREE.Vector3(Math.cos(a) * 1.12, Math.sin(a) * 0.66, 0.68);
    });
    route(points, '#9ec9e5', 0.58);
    for (const i of [0, 30, 60, 89]) {
      sphere(0.045, brass).position.copy(points[i]);
      const ring = mesh(new THREE.TorusGeometry(0.085, 0.008, 6, 30), ivory);
      ring.position.copy(points[i]);
    }
  } else if (id === 'explore') {
    const probe = new THREE.Group();
    group.add(probe);
    probe.position.set(1.5, 0.68, 0.86);
    probe.rotation.set(0.25, 0.32, -0.24);
    probe.scale.setScalar(0.6);
    box(0.35, 0.45, 0.3, brass, probe);
    for (const side of [-1, 1]) {
      rod(new THREE.Vector3(0, 0, 0), new THREE.Vector3(side * 0.8, 0, 0), 0.018, ivory, probe);
      box(0.55, 0.5, 0.025, blue, probe).position.x = side * 0.68;
      for (let i = 0; i < 4; i++)
        box(0.55, 0.006, 0.03, brass, probe).position.set(side * 0.68, -0.2 + i * 0.13, 0.015);
      box(0.008, 0.5, 0.03, brass, probe).position.set(side * 0.68, 0, 0.017);
    }
    const dish = mesh(
      new THREE.SphereGeometry(0.24, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.42),
      ivory,
      probe,
    );
    dish.rotation.x = Math.PI / 2;
    dish.position.set(0, 0.3, 0.06);
    rod(new THREE.Vector3(0, 0.3, 0.06), new THREE.Vector3(0, 0.66, 0.06), 0.01, carbon, probe);
    const points = Array.from({ length: 90 }, (_, i) => {
      const a = 0.05 + (i / 89) * 1.8;
      return new THREE.Vector3(Math.cos(a) * 2.25, Math.sin(a) * 1.03, -0.25);
    });
    route(points, '#c9b89a', 0.28);
  } else {
    const coords = [
      [-0.95, 0.3, 0.9],
      [-0.48, 0.96, 0.8],
      [0.28, 1.02, 0.69],
      [1.03, 0.48, 0.7],
      [0.78, -0.32, 0.99],
      [0.05, -0.65, 1.0],
    ];
    const nodes = coords.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    route([...nodes, nodes[0]], '#a799d1', 0.6);
    route([nodes[1], nodes[4], nodes[0], nodes[3]], '#8bafd7', 0.26);
    nodes.forEach((p, i) => {
      sphere(i % 2 ? 0.045 : 0.07, i % 2 ? ivory : brass).position.copy(p);
      const ring = mesh(new THREE.TorusGeometry(i % 2 ? 0.08 : 0.12, 0.008, 8, 36), blue);
      ring.position.copy(p);
    });
  }
  const baseOpacity = materials.map((m) => m.opacity);
  return {
    group,
    fade: (opacity: number) =>
      materials.forEach((m, i) => {
        m.opacity = baseOpacity[i] * opacity;
      }),
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
