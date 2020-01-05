var starFrag = `
uniform float size;
uniform vec3 lightPosition;
uniform float seed;

uniform vec3 primaryColor;
uniform vec3 secondaryColor;

in vec3 interpolatedLocalPosition;
in vec3 interpolatedPosition;
in vec3 interpolatedNormal;

#include <noise.comp>

float shininess = 50.0;

void main() {
  vec3 normalPosition = interpolatedLocalPosition / size;

  // Calculate f by combining multiple noise layers using different density
  float granules = 1.0 - fnoise(15.0 * normalPosition, seed, 10, 0.8);

  float darks = max(fnoise(4.0 * normalPosition, seed, 5, 0.6), 0.0) * max(fnoise(3.0 * normalPosition, seed, 5, 0.4), 0.0) * 2.5;

  gl_FragColor = vec4(mix(primaryColor, secondaryColor, 1.0 - granules) - vec3(max(darks, 0.0)), 1.0);
}
`
