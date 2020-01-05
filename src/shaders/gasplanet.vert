var gasPlanetVert = `
uniform float seed;
out vec3 interpolatedPosition; //We interpolate the position
out vec3 interpolatedNormal;   //We interpolate the normal
out vec3 interpolatedLocalPosition;
out vec3 interpolatedLightPosition;

void main() {
  interpolatedLocalPosition = position;
  interpolatedPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  interpolatedNormal = normalize(normalMatrix * normal).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
