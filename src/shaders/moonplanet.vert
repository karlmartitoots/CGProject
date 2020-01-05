var moonVert = `
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

  float crater = (1.0 - voronoi(normalPosition * 1.6, seed));
  crater = pow(crater, 19.5);

  float f;
  if (crater > 0.001 && crater < 0.01)
    f = 1.017;

  else
    f = max(mix(1.0, 1.0 - size / 2.0, crater), 1.0 - size / 50.0);

  mat4 terrainScale = mat4(
      f, 0.0, 0.0, 0.0,
    0.0,   f, 0.0, 0.0,
    0.0, 0.0,   f, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  gl_Position = projectionMatrix * modelViewMatrix * terrainScale * vec4(position, 1.0);
}
`
