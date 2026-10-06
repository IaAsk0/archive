uniform sampler2D uTexture;
uniform float uGrayscaleProgress;
uniform float uBlurAmount;
uniform vec2 uMouse;
uniform vec2 uTextureResolution;

varying vec2 vUv;
varying float vRipple;

vec3 toGrayscale(vec3 color) {
  float gray = dot(
    color,
    vec3(0.299, 0.587, 0.114)
  );

  return vec3(gray);
}

vec4 kawaseBlur(
  sampler2D tex,
  vec2 uv,
  float offset
) {
  vec2 texelSize =
    vec2(1.0) / max(uTextureResolution, vec2(1.0));

  vec4 color = vec4(0.0);

  color += texture2D(
    tex,
    uv + vec2(offset, offset) * texelSize
  );

  color += texture2D(
    tex,
    uv + vec2(-offset, offset) * texelSize
  );

  color += texture2D(
    tex,
    uv + vec2(offset, -offset) * texelSize
  );

  color += texture2D(
    tex,
    uv + vec2(-offset, -offset) * texelSize
  );

  return color * 0.25;
}

vec4 multiPassKawaseBlur(
  sampler2D tex,
  vec2 uv,
  float blurStrength
) {
  vec4 baseTexture =
    texture2D(tex, uv);

  vec4 blur1 =
    kawaseBlur(
      tex,
      uv,
      1.0 + blurStrength * 1.5
    );

  vec4 blur2 =
    kawaseBlur(
      tex,
      uv,
      2.0 + blurStrength
    );

  vec4 blur3 =
    kawaseBlur(
      tex,
      uv,
      3.0 + blurStrength * 2.5
    );

  float t1 =
    smoothstep(0.0, 3.0, blurStrength);

  float t2 =
    smoothstep(3.0, 7.0, blurStrength);

  vec4 blurred =
    mix(blur1, blur2, t1);

  blurred =
    mix(blurred, blur3, t2);

  float mixFactor =
    smoothstep(0.0, 1.0, blurStrength);

  return mix(
    baseTexture,
    blurred,
    mixFactor
  );
}

float getMaxDistFromCorners(vec2 point) {
  float d1 = distance(point, vec2(0.0, 0.0));
  float d2 = distance(point, vec2(1.0, 0.0));
  float d3 = distance(point, vec2(0.0, 1.0));
  float d4 = distance(point, vec2(1.0, 1.0));

  return max(
    max(d1, d2),
    max(d3, d4)
  );
}

void main() {
  vec4 diffuse =
    multiPassKawaseBlur(
      uTexture,
      vUv,
      uBlurAmount
    );

  vec3 originalColor =
    diffuse.rgb;

  vec3 grayscaleColor =
    toGrayscale(originalColor);

  float maxDist =
    getMaxDistFromCorners(uMouse);

  float dist =
    distance(vUv, uMouse);

  float normalizedDist =
    dist / maxDist;

  float mask =
    smoothstep(
      uGrayscaleProgress - 0.1,
      uGrayscaleProgress,
      normalizedDist
    );

  vec3 color =
    mix(
      originalColor,
      grayscaleColor,
      mask
    );

  color += vRipple * 0.45;

  gl_FragColor =
    vec4(color, diffuse.a);
}
