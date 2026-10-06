varying vec2 vUv;
varying float vRipple;

uniform float uRippleProgress;
uniform vec2 uMouse;
uniform float uTime;

#define PI 3.14159265359

void main() {
  vec3 pos = position;

  float dist = distance(uv, uMouse);

  float ripple = sin(
    -PI * 10.0 * (dist - uTime * 0.1)
  );

  ripple *= uRippleProgress;
  ripple *= smoothstep(0.9, 0.0, dist);

  pos.y += ripple * 0.08;
  pos.z += ripple * 0.12;

  vRipple = ripple;
  vUv = uv;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(pos, 1.0);
}
