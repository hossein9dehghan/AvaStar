import * as THREE from 'three';
import { createOpticalEnvironment } from './optical-environment';

export type ApertureView = { x: number; y: number; travel: number; time: number };
/** Optical assembly: each barrel, baffle and glass element has real depth. */
export function createApertureScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.z = 7.8;
  const assembly = new THREE.Group();
  scene.add(assembly);
  const resources: { dispose: () => void }[] = [];
  const environment = createOpticalEnvironment(renderer);
  scene.environment = environment.texture;
  resources.push(environment);
  scene.add(new THREE.HemisphereLight('#c6d7e5', '#05070b', 2.4));
  const light = new THREE.DirectionalLight('#edf2f3', 4);
  light.position.set(-4, 5, 6);
  scene.add(light);
  const warm = new THREE.DirectionalLight('#d0ab7e', 2);
  warm.position.set(4, -2, 3);
  scene.add(warm);
  const material = (color: string, roughness: number, metalness: number) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    resources.push(m);
    return m;
  };
  const graphite = material('#141e27', 0.34, 0.85),
    edge = material('#79848d', 0.23, 0.95),
    black = material('#05090e', 0.62, 0.25),
    brass = material('#85705a', 0.31, 0.9);
  function add(geometry: THREE.BufferGeometry, mat: THREE.Material, z = 0) {
    resources.push(geometry);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.z = z;
    assembly.add(mesh);
    return mesh;
  }
  // Lathed barrel surfaces provide visible bevels, thickness and an open optical axis.
  const profile = [
    [1.64, -0.55],
    [1.91, -0.55],
    [1.96, -0.47],
    [1.96, 0.35],
    [1.92, 0.48],
    [1.79, 0.48],
    [1.75, 0.39],
    [1.69, -0.38],
    [1.64, -0.55],
  ].map(([r, z]) => new THREE.Vector2(r, z));
  const barrel = add(new THREE.LatheGeometry(profile, 160), graphite);
  barrel.rotation.x = Math.PI / 2;
  for (let i = 0; i < 36; i++)
    add(
      new THREE.TorusGeometry(1.942, 0.008, 5, 160),
      i % 9 === 0 ? edge : graphite,
      -0.38 + i * 0.02,
    );
  for (const [r, z] of [
    [1.89, 0.49],
    [1.79, 0.49],
    [1.71, 0.19],
    [1.65, -0.06],
    [1.58, -0.34],
  ])
    add(new THREE.TorusGeometry(r, 0.014, 8, 160), r === 1.79 ? brass : edge, z);
  for (let i = 0; i < 8; i++) {
    const ring = add(new THREE.RingGeometry(1.46 + i * 0.026, 1.7, 160), black, -0.48 + i * 0.078);
    ring.material.side = THREE.DoubleSide;
  }
  // Fine engraved graduation marks, illuminated by the same assembly light.
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2,
      r = 1.835;
    const tick = add(
      new THREE.BoxGeometry(i % 8 === 0 ? 0.006 : 0.003, i % 8 === 0 ? 0.043 : 0.018, 0.002),
      i % 8 === 0 ? brass : edge,
      0.497,
    );
    tick.position.set(Math.cos(a) * r, Math.sin(a) * r, 0.497);
    tick.rotation.z = a - Math.PI / 2;
  }
  const uniforms = { uView: { value: new THREE.Vector2() }, uTime: { value: 0 } };
  const glass = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `
    varying vec2 vUv; uniform vec2 uView; uniform float uTime;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float v=0.;float a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+1.7;a*=.5;}return v;}
    void main(){
      vec2 uv=vUv*2.-1.;float r=length(uv);vec2 p=uv+uView*.09;
      p=mat2(.84,-.54,.54,.84)*p;
      float clouds=fbm(p*7.+2.);float ribbon=exp(-pow((p.y+.1*sin(p.x*2.4))/ .19,2.));
      float dust=smoothstep(.32,.68,fbm(p*18.));
      vec3 col=vec3(.006,.012,.024)+ribbon*(.035+clouds*.16)*mix(vec3(.37,.54,.78),vec3(.84,.73,.58),clouds)*(.18+dust);
      for(int layer=0;layer<3;layer++){
        float scale=58.+float(layer)*37.;vec2 q=(uv+uView*(.008+float(layer)*.004))*scale;
        vec2 cell=floor(q),off=vec2(hash(cell+float(layer)),hash(cell+12.));float d=length(fract(q)-off);
        float seed=hash(cell+41.);float star=exp(-d*d/(.0006+seed*.002))*step(.91,seed);
        col+=star*mix(vec3(.46,.67,1.),vec3(1.,.85,.65),seed)*(.4+seed*.8);
      }
      float rim=pow(r,9.);float reflection=pow(max(0.,dot(normalize(uv+.001),normalize(vec2(-.6,.8)+uView*.2))),18.);
      col+=rim*(vec3(.09,.21,.28)*reflection+vec3(.013,.021,.039));
      col+=vec3(.1,.14,.16)*pow(max(0.,1.-abs(uv.y+.44+uv.x*.15)*14.),3.)*.13;
      gl_FragColor=vec4(col,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
  });
  resources.push(glass);
  add(new THREE.CircleGeometry(1.51, 160), glass, -0.55);
  const glow = new THREE.MeshBasicMaterial({ color: '#8bb8cc', transparent: true, opacity: 0.17 });
  resources.push(glow);
  add(new THREE.TorusGeometry(1.505, 0.009, 8, 160), glow, -0.53);
  let width = 0;
  let failed = false;
  renderer.debug.onShaderError = () => {
    failed = true;
  };
  function render(view: ApertureView) {
    const size = Math.round(canvas.clientWidth);
    if (!size) return;
    if (size !== width) {
      width = size;
      renderer.setSize(size, size, false);
    }
    assembly.rotation.set(0.22 + view.y * 0.11, -0.34 + view.x * 0.16, -0.18);
    assembly.position.z = view.travel * 2.7;
    uniforms.uView.value.set(view.x, view.y);
    uniforms.uTime.value = view.time;
    renderer.render(scene, camera);
    if (failed) throw new Error('Optical material unavailable');
  }
  return {
    render,
    dispose() {
      resources.forEach((r) => r.dispose());
      renderer.dispose();
    },
  };
}
