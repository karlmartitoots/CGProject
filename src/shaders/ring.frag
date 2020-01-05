var ringFrag = `
uniform float size;
uniform float seed;
uniform vec3 primaryColor;
uniform vec3 secondaryColor;
uniform int bodycount;

uniform sampler2D locs;

in vec3 interpolatedPosition;
in vec3 interpolatedNormal;
in vec3 interpolatedLocalPosition;

#include <noise.comp>
#include <lighting.comp>

void main() {
  // Luminosity, get from texture
  vec4 lposr = texture2D(locs, vec2(0.5 / float(bodycount), 0.5));
  float lum = luminosity(locs, 3, bodycount, interpolatedPosition, lposr);

  vec3 normalPosition = interpolatedLocalPosition / size * 2.0;

  float r = length(normalPosition.xy);
  float f = sin(r * 100.0 - seed) + cos(r * r * 200.0 - seed) / 2.0 + cos(r * r * 300.0 + r * seed) / 5.0 + sin(r * r * 350.0 * seed) / 1.3;

  float v = 0.0;
  vec3 c = vec3(0.0);

  if (f > 0.2 && f < 0.5) {
    c = secondaryColor;
    v = 0.5;
  }

  else {
    c = primaryColor;
    v = 0.3;
  }

  if (r < 0.55 || r > 0.67 + sin(seed * 100.0) / 10.0)
    v = 0.0;

  gl_FragColor = vec4(lum * vec3(c), v);
}
`
