import * as THREE from 'three';
import type { PlanetId } from './avastar';

/** Scene objects use the planet's depth buffer, lighting and drag transform. */
export function createPlanetArtifact(id: PlanetId) {
  const group = new THREE.Group(),
    geometries: THREE.BufferGeometry[] = [],
    materials: THREE.Material[] = [];
  const choices: THREE.Group[] = [];
  const material = (color: string, roughness = 0.4, metalness = 0.65) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness, metalness, transparent: true });
    materials.push(m);
    return m;
  };
  const ivory = material('#b9c2c5', 0.27, 0.78),
    carbon = material('#151c24', 0.4, 0.65),
    brass = material('#8f7960', 0.3, 0.85),
    rubber = material('#080c12', 0.82, 0.03),
    glass = material('#153a48', 0.08, 0.92);
  const add = (g: THREE.BufferGeometry, m: THREE.Material, p: THREE.Object3D = group) => {
    geometries.push(g);
    const o = new THREE.Mesh(g, m);
    p.add(o);
    return o;
  };
  const box = (x: number, y: number, z: number, m: THREE.Material, p: THREE.Object3D = group) =>
    add(new THREE.BoxGeometry(x, y, z), m, p);
  const ball = (r: number, m: THREE.Material, p: THREE.Object3D = group) =>
    add(new THREE.SphereGeometry(r, 24, 16), m, p);
  const rod = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    r: number,
    m: THREE.Material,
    p: THREE.Object3D = group,
  ) => {
    const v = b.clone().sub(a);
    const o = add(new THREE.CylinderGeometry(r, r, v.length(), 20), m, p);
    o.position.copy(a).add(b).multiplyScalar(0.5);
    o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.normalize());
    return o;
  };
  const line = (
    points: THREE.Vector3[],
    color: string,
    opacity: number,
    p: THREE.Object3D = group,
  ) => {
    const g = new THREE.BufferGeometry().setFromPoints(points),
      m = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    geometries.push(g);
    materials.push(m);
    const o = new THREE.Line(g, m);
    o.renderOrder = 3;
    p.add(o);
    return o;
  };
  const arc = (radius: number, tilt: number, start = 0, end = Math.PI * 2) =>
    Array.from({ length: 181 }, (_, i) => {
      const a = start + (i / 180) * (end - start);
      return new THREE.Vector3(
        Math.cos(a) * radius,
        Math.sin(a) * radius * Math.cos(tilt),
        Math.sin(a) * radius * Math.sin(tilt),
      );
    });
  if (id === 'learn') {
    for (let view = 0; view < 3; view++) {
      const layer = new THREE.Group();
      group.add(layer);
      choices.push(layer);
      if (view === 0) {
        for (let a = 0; a < 6; a++) {
          const circle = arc(1.012, Math.PI / 2);
          const q = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            (a * Math.PI) / 6,
          );
          line(
            circle.map((p) => p.applyQuaternion(q)),
            '#c7d7dd',
            0.18,
            layer,
          );
        }
        for (const lat of [-0.55, 0, 0.55]) {
          line(
            arc(Math.sqrt(1.025 - lat * lat), Math.PI / 2).map(
              (p) => new THREE.Vector3(p.x, lat, p.z),
            ),
            '#a4bbc8',
            0.17,
            layer,
          );
        }
      }
      if (view === 1) {
        line(arc(1.1, 1.15), '#c4a780', 0.58, layer);
        line(arc(1.03, Math.PI / 2), '#b4cfe2', 0.22, layer);
      }
      if (view === 2) {
        const ps = [
          [-0.65, 0.53, 0.9],
          [-0.32, 0.67, 1.0],
          [0.13, 0.32, 1.1],
          [0.56, 0.43, 0.94],
          [0.78, 0.13, 0.88],
        ].map((p) => new THREE.Vector3(...p));
        line(ps, '#b5c8d7', 0.4, layer);
        ps.forEach((p) => ball(0.018, ivory, layer).position.copy(p));
      }
    }
  } else if (id === 'shop') {
    const scope = new THREE.Group();
    group.add(scope);
    scope.position.set(0.34, -0.52, 1.33);
    scope.scale.setScalar(1.05);
    scope.rotation.set(0.12, -0.37, -0.08);
    // Tripod with telescoping legs, spreader, dovetail and equatorial head.
    for (const a of [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]) {
      const foot = new THREE.Vector3(Math.cos(a) * 0.57, -1.08, Math.sin(a) * 0.57),
        top = new THREE.Vector3(Math.cos(a) * 0.12, -0.13, Math.sin(a) * 0.12);
      rod(top, foot, 0.03, ivory, scope);
      rod(top.clone().lerp(foot, 0.55), foot, 0.024, carbon, scope);
      ball(0.039, rubber, scope).position.copy(foot);
      rod(new THREE.Vector3(0, -0.49, 0), top.clone().lerp(foot, 0.45), 0.009, carbon, scope);
    }
    const mount = new THREE.Group();
    scope.add(mount);
    choices.push(mount);
    rod(new THREE.Vector3(0, -0.35, 0), new THREE.Vector3(0, 0.1, 0), 0.075, carbon, mount);
    const head = add(new THREE.CylinderGeometry(0.12, 0.13, 0.21, 48), ivory, mount);
    head.rotation.z = -0.48;
    head.position.y = 0.12;
    rod(new THREE.Vector3(-0.07, 0.1, 0), new THREE.Vector3(-0.4, -0.1, 0), 0.017, ivory, mount);
    const counter = add(new THREE.CylinderGeometry(0.11, 0.11, 0.1, 48), carbon, mount);
    counter.position.set(-0.32, -0.045, 0);
    counter.rotation.z = -1.05;
    const tube = new THREE.Group();
    scope.add(tube);
    tube.position.set(0.09, 0.38, 0);
    tube.rotation.set(0.48, 0.12, -0.72);
    const optics = new THREE.Group();
    tube.add(optics);
    choices.unshift(optics);
    const profile = [
      [0.19, -0.65],
      [0.21, -0.59],
      [0.215, 0.5],
      [0.225, 0.55],
      [0.225, 0.8],
      [0.198, 0.81],
      [0.192, 0.5],
      [0.17, -0.62],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    add(new THREE.LatheGeometry(profile, 96), ivory, tube);
    for (const y of [-0.45, 0.3]) {
      const collar = add(new THREE.CylinderGeometry(0.225, 0.225, 0.065, 72), carbon, tube);
      collar.position.y = y;
      box(0.49, 0.035, 0.05, carbon, tube).position.set(0, y, -0.21);
      for (const x of [-0.14, 0.14]) ball(0.018, brass, tube).position.set(x, y, 0.17);
    }
    for (let i = 0; i < 12; i++) {
      const b = add(new THREE.TorusGeometry(0.217, 0.004, 6, 96), carbon, tube);
      b.rotation.x = Math.PI / 2;
      b.position.y = 0.61 + i * 0.012;
    }
    const lens = add(new THREE.CircleGeometry(0.194, 96), glass, optics);
    lens.rotation.x = -Math.PI / 2;
    lens.position.y = 0.795;
    const rim = add(new THREE.TorusGeometry(0.198, 0.008, 8, 96), brass, optics);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.805;
    const eyepiece = new THREE.Group();
    tube.add(eyepiece);
    choices.push(eyepiece);
    for (const [r, y, h] of [
      [0.085, -0.7, 0.16],
      [0.06, -0.86, 0.17],
      [0.072, -0.96, 0.055],
    ])
      add(new THREE.CylinderGeometry(r, r, h, 48), carbon, eyepiece).position.y = y;
    for (const x of [-0.12, 0.12]) {
      const knob = add(new THREE.CylinderGeometry(0.048, 0.048, 0.028, 32), brass, eyepiece);
      knob.rotation.z = Math.PI / 2;
      knob.position.set(x, -0.71, 0);
    }
    rod(new THREE.Vector3(0.26, 0.03, 0), new THREE.Vector3(0.26, 0.43, 0), 0.032, carbon, tube);
    for (const y of [0.1, 0.31])
      rod(new THREE.Vector3(0.18, y, 0), new THREE.Vector3(0.26, y, 0), 0.012, ivory, tube);
  } else if (id === 'explore') {
    // Foreground terrain is a visual transition into an observing night, not a spacecraft.
    for (let layer = 0; layer < 3; layer++) {
      const shape = new THREE.Shape();
      shape.moveTo(-2.65, -1.65);
      for (let i = 0; i <= 100; i++) {
        const x = -2.65 + i * 0.053;
        const y =
          -0.87 -
          layer * 0.12 +
          Math.sin(x * 1.4 + layer) * 0.09 +
          Math.sin(x * 3.5 + layer) * 0.026 +
          Math.sin(x * 9.7) * 0.009;
        shape.lineTo(x, y);
      }
      shape.lineTo(2.65, -1.65);
      shape.closePath();
      const mat = new THREE.MeshBasicMaterial({
        color: ['#17232b', '#0b141c', '#050b12'][layer],
        transparent: true,
      });
      materials.push(mat);
      add(new THREE.ShapeGeometry(shape), mat).position.z = 1.3 + layer * 0.13;
    }
    for (let i = 0; i < 3; i++) {
      const mark = new THREE.Group();
      group.add(mark);
      choices.push(mark);
      const x = -1.3 + i * 1.15;
      line(
        [new THREE.Vector3(x, -0.85, 1.8), new THREE.Vector3(x, -0.55, 1.8)],
        '#a6b9c5',
        0.4,
        mark,
      );
      ball(0.016, brass, mark).position.set(x, -0.55, 1.8);
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const lane = new THREE.Group();
      group.add(lane);
      choices.push(lane);
      const points = arc(1.19 + i * 0.08, 0.63 + i * 0.3, -0.4, 2.6);
      line(points, '#b9c1d0', 0.36, lane);
      for (const j of [25, 90, 145]) {
        ball(0.019, ivory, lane).position.copy(points[j]);
      }
    }
  }
  const base = new Map(materials.map((m) => [m, m.opacity]));
  let opacity = 1,
    selected = 0;
  const update = () => {
    materials.forEach((m) => (m.opacity = (base.get(m) || 0) * opacity));
    choices.forEach((choice, i) => {
      choice.traverse((o) => {
        if (o instanceof THREE.Line) {
          o.material.opacity = (base.get(o.material) || 0) * opacity * (i === selected ? 1 : 0.18);
        }
        if (o instanceof THREE.Mesh && id !== 'shop') o.visible = i === selected;
      });
      if (id === 'learn') choice.visible = i === selected;
    });
    if (id === 'shop')
      choices.forEach((c, i) =>
        c.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.scale.setScalar(i === selected ? 1.025 : 1);
          }
        }),
      );
  };
  return {
    group,
    anchors: id === 'shop' ? choices.map((c) => c.children[0]) : [],
    fade(value: number) {
      opacity = value;
      update();
    },
    setView(value: number) {
      selected = value;
      update();
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
