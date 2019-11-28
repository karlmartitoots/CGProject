simplexNoise = `
float F = 1.0 / 3.0;
float G = 1.0 / 6.0;

vec3 hash(ivec3 internal, ivec3 s, float seed) {
  vec3 p = vec3(internal) + vec3(s);
  p = vec3(
    dot(p, vec3(127.1,311.7, 74.7)),
    dot(p, vec3(269.5,163.3,226.1)),
    dot(p, vec3(114.5,271.9,124.6))
  );

  return normalize(-1.0 + 2.0 * fract(sin(p) * 43758.5453123 + seed));
}

float noise(in vec3 p, in float seed) {
  float sum = p.x + p.y + p.z;
  float skewFactor = sum * F;

  // Skew
  ivec3 internal = ivec3(floor(p + skewFactor));

  int unsum = internal.x + internal.y + internal.z;
  float unskewFactor = float(unsum) * G;

  // Unskew
  vec3 unskew = vec3(internal) - unskewFactor;

  // Distance
  vec3 dst = p - unskew;

  // Determine in which simplices we are in
  ivec3 s[4];
  s[0] = ivec3(0);
  s[3] = ivec3(1);

  if (dst.x >= dst.y) {
    if (dst.y >= dst.z) {
      s[1] = ivec3(1, 0, 0);
      s[2] = ivec3(1, 1, 0);
    }

    else if (dst.x >= dst.z) {
      s[1] = ivec3(1, 0, 0);
      s[2] = ivec3(1, 0, 1);
    }

    else {
      s[1] = ivec3(0, 0, 1);
      s[2] = ivec3(1, 0, 1);
    }
  }

  else { // dst.x < dst.y
    if (dst.y < dst.z) {
      s[1] = ivec3(0, 0, 1);
      s[2] = ivec3(0, 1, 1);
    }

    else if (dst.x < dst.z) {
      s[1] = ivec3(0, 1, 0);
      s[2] = ivec3(0, 1, 1);
    }

    else {
      s[1] = ivec3(0, 1, 0);
      s[2] = ivec3(1, 1, 0);
    }
  }

  // Offsets for conrners
  vec3 offset[] = vec3[](
    dst,
    dst - vec3(s[1]) + G,
    dst - vec3(s[2]) + 2.0 * G,
    dst - vec3(s[3]) + 3.0 * G
  );

  // Gradients
  vec3 g[4];
  for (int i = 0; i < 4; ++i) {
    g[i] = hash(internal, s[i], seed);
  }

  // Interpolate
  vec3 tmp;
  float t = 0.0;
  float n[] = float[](0.0, 0.0, 0.0, 0.0);

  for (int i = 0; i < 4; ++i) {
    tmp = pow(offset[i], vec3(2.0));
    t = 0.5 - tmp.x - tmp.y - tmp.z;

    if (t > 0.0) {
      t *= t;
      n[i] = t * t * dot(g[i], offset[i]);
    }
  }

  return (32.0 * (n[0] + n[1] + n[2] + n[3]));
}
`
