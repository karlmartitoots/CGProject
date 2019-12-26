moonFrag = `
uniform float size;
uniform vec3 colorGrey;
uniform vec3 colorDarkGrey;
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
  // Calculate f by combining multiple noise layers using different density
  float f = 0.0;
  f += 0.5 * (1.0 - abs(noise(3.0 * interpolatedLocalPosition / size, seed)));
  f += 0.5 * (1.0 - abs(noise(7.0 * interpolatedLocalPosition / size, seed)));
  f += 0.063 * noise(11.0 * interpolatedLocalPosition / size, seed);

  // Luminosity, get from texture
  vec4 lposr = texture2D(locs, vec2(0.5 / float(bodycount), 0.5));
  float lum = luminosity(locs, id, bodycount, interpolatedPosition, lposr);

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

  float specular = 0.0;
  vec3 noiseColor;
  if (f > 1.0)
    noiseColor = colorGrey;

  else if (f > 0.1)
    noiseColor = mix(colorDarkGrey, colorGrey, f / 0.5 );

  else {
    noiseColor = colorDarkGrey;
  }

  // Diffuse lighting
  float diffuse = orenNayar(l, n, v, 0.3);

  // Put Diffuse, specular and glow light together to get the end result
  vec3 interpolatedColor = lum * noiseColor * diffuse;

  gl_FragColor = vec4(interpolatedColor, 1.0);
}
`
