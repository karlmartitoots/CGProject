cbPlanetVert = `
uniform float size;
uniform float seed;
uniform vec3 lightPosition;
uniform vec3 viewPosition;
out vec3 interpolatedPosition; //We interpolate the position
out vec3 interpolatedNormal;   //We interpolate the normal
out vec3 interpolatedLocalPosition;
out vec3 interpolatedLightPosition;

#include <noise>

void main() {
  interpolatedLocalPosition = position;
  interpolatedPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  interpolatedNormal = normalize(mat3(transpose(inverse(modelMatrix))) * normal).xyz;

  float f = 0.0;
  f += 0.55 * noise(3.0 * position / size, seed);
  f += 0.15 * noise(7.0 * position / size, seed);
  f += 0.3 * noise(17.0 * position / size, seed);
  f += 0.5 * noise(4.0 * position / size, seed);

  // TODO: This doesn't look great on small planets
  f /= max(1.0, size);
  f = max(f, 0.04);
  f += 1.0;

  mat4 terrainScale = mat4(
      f, 0.0, 0.0, 0.0,
    0.0,   f, 0.0, 0.0,
    0.0, 0.0,   f, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  gl_Position = projectionMatrix * modelViewMatrix * terrainScale * vec4(position, 1.0);
}
`
