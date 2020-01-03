starFrag = `
uniform float size;
uniform vec3 lightPosition;
uniform float seed;
in vec3 interpolatedLocalPosition;
in vec3 interpolatedPosition; // We interpolate the position
in vec3 interpolatedNormal;   // We interpolate the normal

#include <noise.comp>

float shininess = 50.0;

void main() {
  // Calculate f by combining multiple noise layers using different density
  float f = 0.0;
  f += 0.5 * (1.0 - abs(noise(3.0 * interpolatedLocalPosition / size, seed)));
  f += 0.5 * (1.0 - abs(noise(7.0 * interpolatedLocalPosition / size, seed)));

  // 1. Find normal
  vec3 n = normalize(interpolatedNormal);

  // 3. Find the direction towards the viewer, normalize.
  vec3 v = normalize(-interpolatedPosition);

  // 4. Find the direction towards the light source, normalize.
  vec3 l = normalize(lightPosition - interpolatedPosition);

  // 4.5 Blinn: Find the half-angle vector h
  vec3 h = normalize(l + v);

  // 5. Find the reflection vector
  vec3 r = reflect(-l, n);

  float specular = 0.0;
  vec3 noiseColor;
  if (f > 0.25)
    noiseColor = vec3(1.0, 0.0, 0.0);

  else if (f > 0.10)
    noiseColor = vec3(0.0, 1.0, 0.0);

  else if (f > 0.04)
    noiseColor = vec3(0.0, 1.0, 1.0);

  else {
    noiseColor = vec3(0.0, 0.0, 1.0);
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
  vec3 glow = max(vec3(0.0, 0.0, 0.5) * glowIntensity * glowDirection, vec3(0.0));

  // Put Diffuse, specular and glow light together to get the end result
  vec3 interpolatedColor = noiseColor * max(0.0, dot(n, l)) + specular + glow;

  //gl_FragColor = vec4(interpolatedColor, 1.0);
  gl_FragColor = vec4(vec3(f), 1.0);
}
`
