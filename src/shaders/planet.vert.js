cbPlanetVert = `
uniform float size;
out vec3 interpolatedPosition; //We interpolate the position
out vec3 interpolatedNormal;   //We interpolate the normal
out vec3 interpolatedLocalPosition;

#include <noise>

void main() {
  interpolatedLocalPosition = position;
  interpolatedPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  interpolatedNormal = normalize(normalMatrix * normal).xyz;

  float f = 0.0;
  f += 0.55 * noise(3.0 * position / size);
  f += 0.15 * noise(7.0 * position / size);
  f += 0.3 * noise(17.0 * position / size);
  f += 0.5 * noise(4.0 * position / size);

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
