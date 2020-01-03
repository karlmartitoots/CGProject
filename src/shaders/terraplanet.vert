terraPlanetVert = `
uniform float size;
uniform float seed;
uniform vec3 lightPosition;
uniform vec3 viewPosition;
out vec3 interpolatedPosition; //We interpolate the position
out vec3 interpolatedNormal;   //We interpolate the normal
out vec3 interpolatedLocalPosition;
out vec3 interpolatedLightPosition;

#include <noise.comp>

void main() {
  interpolatedLocalPosition = position;
  interpolatedPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  interpolatedNormal = normalize(mat3(transpose(inverse(modelMatrix))) * normal).xyz;

  vec3 normalPosition = position / size;

  float f = 0.0;
  f += 0.4 * fnoise(0.5 * normalPosition, seed, 10, 0.7);
  f += 0.6 * fnoise(1.0 * normalPosition, seed, 8, 0.6);
  f += 0.7 * fnoise(2.0 * normalPosition, seed, 5, 0.2);
  f += 0.5 * fnoise(5.0 * normalPosition, seed, 5, 0.5);
  f += 0.1 * fnoise(8.0 * normalPosition, seed, 5, 0.8);

  f *= 1.8;

  if (f > 0.0)
    f = 1.0 + f * size / 185.0;

  else
    f = 1.0;

  mat4 terrainScale = mat4(
      f, 0.0, 0.0, 0.0,
    0.0,   f, 0.0, 0.0,
    0.0, 0.0,   f, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  gl_Position = projectionMatrix * modelViewMatrix * terrainScale * vec4(position, 1.0);
}
`
