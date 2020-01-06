var terraPlanetFrag = `
uniform vec3 color[6];
uniform vec3 colorAtm;
uniform vec3 colorWater;
uniform vec3 colorDeepWater;
uniform float seed;
uniform int bodycount;
uniform int id;

uniform sampler2D locs;
uniform vec3 viewPosition;

// positive when top half is closer to light, negative if bottom half is closer to light
uniform float obliquity;

in vec3 interpolatedLocalPosition;
in vec3 interpolatedPosition;
in vec3 interpolatedNormal;

#include <noise.comp>
#include <lighting.comp>

float shininess = 250.0;

void main() {
  // Luminosity, get from texture
  vec4 lposr = texture2D(locs, vec2(0.5 / float(bodycount), 0.5));
  vec4 pposr = texture2D(locs, vec2((float(id) + 0.5) / float(bodycount), 0.5));
  float lum = luminosity(locs, id, bodycount, interpolatedPosition, lposr);

  // Distance from light
  float ldist = length(lposr.xyz - pposr.xyz);

  // Normalized local position
  vec3 normalPosition = interpolatedLocalPosition / pposr.w;

  // Calculate f by combining multiple noise layers using different density
  float f = 0.0;
  f += 0.4 * fnoise(0.5 * normalPosition, seed, 10, 0.7);
  f += 0.6 * fnoise(1.0 * normalPosition, seed, 8, 0.6);
  f += 0.7 * fnoise(2.0 * normalPosition, seed, 5, 0.2);
  f += 0.5 * fnoise(5.0 * normalPosition, seed, 5, 0.5);
  f += 0.1 * fnoise(8.0 * normalPosition, seed, 5, 0.8);

  f *= 1.8;

  // Biomes
  float height = interpolatedLocalPosition.y + fnoise(15.0 * normalPosition, seed, 6, 0.45) + 3.0 * noise(1.5 * normalPosition, seed);
  float theight = (height - obliquity) / pposr.w;
  height / pposr.w;

  float iciness = abs(theight) + max(f, 0.005) * ldist / 800.0 + ldist / 6400.0;

  // 1. Find normal
  vec3 n = normalize(interpolatedNormal);

  // 3. Find the direction towards the viewer, normalize.
  vec3 v = normalize(viewPosition - interpolatedPosition);

  // 4. Find the direction towards the light source, normalize.
  vec3 l = normalize(lposr.xyz - interpolatedPosition);

  // 5. Blinn: Find the half-angle vector h
  vec3 h = normalize(l + v);

  // Surface colors, specular highlight
  float specular = 0.0;
  vec3 noiseColor;

  // Biomes
  // Ice
  if (iciness > 0.95) {
    noiseColor = vec3(0.93, 1.0, 1.0);

    // Very minor color variation
    float icecrack = voronoi(2.7 * normalPosition, seed);
    noiseColor.xy -= vec2(icecrack / 16.0);

    float snow = abs(noise(4.0 * normalPosition, seed) / 8.0);
    noiseColor.x += snow;
  }

  // Water
  else if (f<= 0.0) {
    f = f * f * f;
    noiseColor = mix(colorWater, colorDeepWater, min(1.0, -f));
    specular = pow(max(0.0, dot(n, h)), 3.0 * shininess);
  }

  // Hot
  else if (abs(height) + ldist / 800.0 + fnoise(32.2 * normalPosition, seed, 4, 0.85) < 2.0 && f > 0.02 + ldist / 3200.0 + height * height / 80.0) {
    if (f > 0.3)
      noiseColor = mix(color[4], color[5], min(1.0, (f - 0.3)));

    else
      noiseColor = mix(color[3], color[4], (f - 0.1) / 0.4);
  }

  // Temperate
  else {
    if (f > 0.5)
      noiseColor = mix(color[2], color[1], min(1.0, (f - 0.5)));

    else
      noiseColor = mix(color[0], color[1], (f - 0.1) / 0.4);

    // Make planets further from light less vegetationy
    noiseColor.x += sqrt(ldist) / 150.0;
    noiseColor.z += sqrt(ldist) / 400.0;
  }

  noiseColor = min(noiseColor, vec3(1.0));

  // Atmosphere glow
  // Get dot profuct between planet surface normal and vector to viewer
  // Then power it with a number to get it closer to the edge
  float glowIntensity = pow(1.0 - abs(dot(v, n)), 4.0);

  // Only show glow where the light is
  float glowDirection = dot(n, l);

  // Calculate the glow
  // Have to make sure that the glow is non-negative
  vec3 glow = max(colorAtm * glowIntensity * glowDirection, vec3(0.0));

  // Diffuse lighting
  float diffuse = orenNayar(l, n, v, 0.3);

  // Put Diffuse, specular and glow light together to get the end result
  vec3 interpolatedColor = lum * (noiseColor * diffuse + specular + glow);

  gl_FragColor = vec4(interpolatedColor, 1.0);
  //gl_FragColor = vec4(vec3(icecrack), 1.0);
}
`

