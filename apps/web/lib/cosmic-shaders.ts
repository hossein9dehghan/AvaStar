// Surface coordinates rotate with the sphere; lighting stays in world space.
export const surfaceVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vSurface;
varying vec3 vWorld;
varying vec3 vNormal;
void main() {
  vUv = uv;
  vSurface = position;
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}`;

export const surfaceFragment = /* glsl */ `
uniform sampler2D uMap, uCloudMap;
uniform vec3 uColorC, uLight, uCenter, uRingNormal;
uniform float uOpacity, uRadius, uRing, uCloud, uCloudShift, uRock;
varying vec2 vUv;
varying vec3 vSurface, vWorld, vNormal;
void main() {
  vec3 color = texture2D(uMap, vUv).rgb;
  float cloud = texture2D(uCloudMap, vec2(vUv.x + uCloudShift, vUv.y)).r * uCloud;
  color = mix(color, vec3(0.93, 0.96, 1.0), smoothstep(0.12, 0.85, cloud) * 0.9);
  vec3 n = normalize(vNormal);
  float relief = dot(color, vec3(0.2126, 0.7152, 0.0722));
  n = normalize(n - normalize(dFdx(vWorld)) * dFdx(relief) * 0.09 * uRock
                  - normalize(dFdy(vWorld)) * dFdy(relief) * 0.09 * uRock);
  vec3 light = normalize(uLight);
  vec3 view = normalize(cameraPosition - vWorld);
  float day = max(dot(n, light), 0.0);
  float ringShadow = 1.0;
  if (uRing > 0.5) {
    float denominator = dot(light, uRingNormal);
    float t = -dot(vWorld - uCenter, uRingNormal) / (denominator + 0.00001);
    float radius = length(vWorld + light * t - uCenter) / uRadius;
    float band = smoothstep(1.27, 1.36, radius) * (1.0 - smoothstep(2.10, 2.18, radius));
    ringShadow -= step(0.0, t) * band * 0.62;
  }
  vec3 lit = color * (0.016 + pow(day, 0.85) * 1.55 * ringShadow);
  float ocean = uCloud * (1.0 - smoothstep(0.06, 0.3, color.g)) * (1.0 - cloud);
  lit += vec3(0.65, 0.76, 0.9) * pow(max(dot(n, normalize(light + view)), 0.0), 64.0) * day * ocean * 0.28;
  float rim = pow(1.0 - max(dot(n, view), 0.0), 4.5);
  lit += uColorC * rim * day * (1.0 - uRock) * 0.035;
  gl_FragColor = vec4(lit, uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export const atmosphereFragment = /* glsl */ `
uniform vec3 uColor, uLight;
uniform float uOpacity;
varying vec3 vWorld, vNormal;
void main() {
  vec3 n = normalize(vNormal);
  vec3 view = normalize(cameraPosition - vWorld);
  float rim = pow(1.0 - abs(dot(n, view)), 3.3);
  float day = 0.2 + 0.8 * max(dot(n, normalize(uLight)), 0.0);
  gl_FragColor = vec4(uColor * 1.3, rim * day * uOpacity * 0.25);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export const ringFragment = /* glsl */ `
uniform sampler2D uMap;
uniform vec3 uColor, uLight, uCenter;
uniform float uRadius, uOpacity;
varying vec3 vSurface, vWorld, vNormal;
void main() {
  float r = length(vSurface.xy);
  float edge = smoothstep(1.28, 1.4, r) * (1.0 - smoothstep(2.07, 2.18, r));
  vec4 ring = texture2D(uMap, vec2(clamp((r - 1.28) / 0.9, 0.0, 1.0), 0.5));
  float grooves = ring.a;
  float gap = 1.0 - (1.0 - smoothstep(0.008, 0.024, abs(r - 1.82))) * 0.91;
  float alpha = edge * grooves * gap * uOpacity * 0.8;
  if (alpha < 0.015) discard;
  vec3 light = normalize(uLight);
  vec3 oc = vWorld - uCenter;
  float t = -dot(oc, light);
  float closest = length(oc + light * max(t, 0.0)) / uRadius;
  float shadow = step(0.0, t) * (1.0 - smoothstep(0.95, 1.04, closest));
  vec3 color = ring.rgb * (0.8 + grooves * 0.35) * (1.0 - shadow * 0.88);
  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export const starVertex = /* glsl */ `
uniform float uTravel, uDpr, uActive;
uniform vec2 uCamera, uPointer, uViewport;
attribute float aSize, aBrightness;
attribute vec3 aColor;
varying float vAlpha;
varying vec3 vColor;
void main() {
  float depth = mod(position.z - uTravel, 90.0) + 2.0;
  vec4 projected = projectionMatrix * vec4(position.xy - uCamera, -depth, 1.0);
  vec2 ndc = projected.xy / projected.w;
  vec2 away = ndc - uPointer;
  vec2 distance = away * vec2(uViewport.x / uViewport.y, 1.0);
  float proximity = 1.0 - smoothstep(0.0, 0.28, length(distance));
  projected.xy += normalize(away + vec2(0.0001)) * proximity * proximity
                  * 0.024 * uActive * projected.w;
  gl_Position = projected;
  gl_PointSize = clamp(aSize * (0.72 + 18.0 / depth), 0.85, 4.8) * uDpr;
  vAlpha = aBrightness * smoothstep(2.0, 7.0, depth) * (1.0 - smoothstep(72.0, 92.0, depth));
  vColor = aColor;
}`;

export const starFragment = /* glsl */ `
varying float vAlpha;
varying vec3 vColor;
void main() {
  float radius = length(gl_PointCoord - 0.5);
  float core = 1.0 - smoothstep(0.06, 0.34, radius);
  float halo = (1.0 - smoothstep(0.18, 0.5, radius)) * 0.18;
  float alpha = (core * 0.82 + halo) * vAlpha;
  gl_FragColor = vec4(vColor, alpha);
  #include <colorspace_fragment>
}`;
