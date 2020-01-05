var moonFrag = `
uniform float size;
uniform vec3 colorGrey;
uniform vec3 colorDarkGrey;
uniform vec3 colorLightGrey;
uniform float seed;
uniform int bodycount;
uniform int id;

uniform sampler2D locs;
uniform vec3 viewPosition;

in vec3 interpolatedLocalPosition;
in vec3 interpolatedPosition;
in vec3 interpolatedNormal;

#include <noise.comp>
#include <lighting.comp>

float shininess = 50.0;

void main() {
  // Luminosity, get from texture
  vec4 lposr = texture2D(locs, vec2(0.5 / float(bodycount), 0.5));
  vec4 pposr = texture2D(locs, vec2((0.5 + float(id)) / float(bodycount), 0.5));
  float lum = luminosity(locs, id, bodycount, interpolatedPosition, lposr);

  vec3 normalPosition = interpolatedLocalPosition / pposr.w;

  // Calculate f by combining multiple noise layers using different density
  float f = 0.0;
  f += 2.5 * fnoise(0.5 * normalPosition, seed, 10, 0.7);
  f += 2.3 * fnoise(1.0 * normalPosition, seed, 8, 0.6);
  f += 2.7 * fnoise(2.0 * normalPosition, seed, 5, 0.2);
  f += 1.5 * fnoise(5.0 * normalPosition, seed, 5, 0.5);
  f += 1.1 * fnoise(8.0 * normalPosition, seed, 5, 0.8);

  // Craters
  float crater = (1.0 - voronoi(normalPosition * 1.6, seed));
  crater = pow(crater, 19.5);

  float c;
  if (crater > 0.001 && crater < 0.01)
    c = 1.017;

  else
    c = max(mix(1.0, 1.0 - pposr.w / 2.0, crater), 1.0 - pposr.w / 50.0);

  // 1. Find normal
  vec3 n = normalize(interpolatedNormal);

  // 3. Find the direction towards the viewer, normalize.
  vec3 v = normalize(-interpolatedPosition);

  // 4. Find the direction towards the light source, normalize.
  vec3 l = normalize(lposr.xyz - interpolatedPosition);

  // 4.5 Blinn: Find the half-angle vector h
  vec3 h = normalize(l + v);

  // 5. Find the reflection vector
  vec3 r = reflect(-l, n);

  if (0.995 < c)
    f /= 1.5;

  vec3 noiseColor;

  // 3-way interpolation
  float nf = (f + 1.0) / 2.0;
  float w1 = nf * nf;
  float w2 = -2.0 * (nf - 1.0) * nf;
  float w3 = (nf - 1.0) * (nf - 1.0);

  vec3 dust = vec3(1.7) * max(noise(0.6 * normalPosition, seed), 0.0) / (2.0 - c);
  noiseColor = w1 * colorLightGrey + w2 * colorGrey + w3 * colorDarkGrey + dust;

  // Diffuse lighting
  float diffuse = orenNayar(l, n, v, 0.3);

  // Put Diffuse, specular and glow light together to get the end result
  vec3 interpolatedColor = lum * noiseColor * diffuse;

  gl_FragColor = vec4(interpolatedColor, 1.0);
}
`
