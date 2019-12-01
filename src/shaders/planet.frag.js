cbPlanetFrag = `
uniform vec3 color[3];
uniform vec3 colora;
uniform vec3 colorw;
uniform float seed;

uniform float size;
uniform vec3 lightPosition;
uniform vec3 viewPosition;
in vec3 interpolatedLocalPosition;
in vec3 interpolatedPosition; // We interpolate the position
in vec3 interpolatedNormal;   // We interpolate the normal
in vec3 interpolatedLightPosition;

#include <noise>

float shininess = 50.0;

void main() {
  // Calculate f by combining multiple noise layers using different density
  float f = 0.0;
  f += 0.55 * noise(3.0 * interpolatedLocalPosition / size, seed);
  f += 0.15 * noise(7.0 * interpolatedLocalPosition / size, seed);
  f += 0.3 * noise(17.0 * interpolatedLocalPosition / size, seed);
  f += 0.5 * noise(4.0 * interpolatedLocalPosition / size, seed);

  // 1. Find normal
  vec3 n = normalize(interpolatedNormal);

  // 3. Find the direction towards the viewer, normalize.
  vec3 v = normalize(viewPosition - interpolatedPosition);

  // 4. Find the direction towards the light source, normalize.
  vec3 l = normalize(lightPosition - interpolatedPosition);

  // 4.5 Blinn: Find the half-angle vector h
  vec3 h = normalize(l + v);

  float specular = 0.0;
  vec3 noiseColor;

  if (f > 0.25)
    noiseColor = color[2];

  else if (f > 0.10)
    noiseColor = color[1];

  else if (f > 0.04)
    noiseColor = color[0];

  else {
    noiseColor = colorw;
    specular = pow(max(0.0, dot(n, h)), 4.0 * shininess);
  }

  // Atmosphere glow
  // Get dot profuct between planet surface normal and vector to viewer
  // Then power it with a number to get it closer to the edge
  float glowIntensity = pow(1.0 - abs(dot(v, n)), 2.5);

  // Only show glow where the light is
  float glowDirection = dot(n, l);

  // Calculate the glow
  // Have to make sure that the glow is non-negative
  vec3 glow = max(colora * glowIntensity * glowDirection, vec3(0.0));

  // Diffuse lighting
  float diffuse = max(0.0, dot(n, l));

  // Get the light density with inverse square law
  float distanceFromLight = sqrt(pow(interpolatedPosition.x, 2.0) + pow(interpolatedPosition.y, 2.0) + pow(interpolatedPosition.z, 2.0));
  float luminosity = 350.0 / distanceFromLight;

  // Put Diffuse, specular and glow light together to get the end result
  vec3 interpolatedColor = luminosity * (noiseColor * diffuse + specular + glow);

  gl_FragColor = vec4(interpolatedColor, 1.0);
  //gl_FragColor = vec4(n, 1.0);
}
`
