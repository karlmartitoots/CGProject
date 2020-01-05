var dryPlanetVert = `
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

  // Calculate f by combining multiple noise layers using different density
  float f = 0.0;
  f += 2.5 * fnoise(0.5 * normalPosition, seed, 10, 0.7);
  f += 2.3 * fnoise(1.0 * normalPosition, seed, 8, 0.6);
  f += 2.7 * fnoise(2.0 * normalPosition, seed, 5, 0.2);
  f += 1.5 * fnoise(5.0 * normalPosition, seed, 5, 0.5);
  f += 1.1 * fnoise(8.0 * normalPosition, seed, 5, 0.8);

  if (f > 0.0)
    f = 1.0 + f * size / 300.0;

  else
    f = 1.0;


  // Craters
  float crater = (1.0 - voronoi(normalPosition * 1.6, seed));
  crater = pow(crater, 19.5);

  float c;

  if (crater > 0.01)
    c = max(mix(1.0, 1.0 - size / 2.0, crater), 1.0 - size / 650.0);

  else if (crater < 0.001)
    c = f;

  else
    c = 1.005;


  mat4 terrainScale = mat4(
      c, 0.0, 0.0, 0.0,
    0.0,   c, 0.0, 0.0,
    0.0, 0.0,   c, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  gl_Position = projectionMatrix * modelViewMatrix * terrainScale * vec4(position, 1.0);
}
`
