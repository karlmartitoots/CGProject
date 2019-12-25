lavaPlanetFrag = `
uniform vec3 colorLava;
uniform vec3 colorDeepLava;
uniform vec3 colorBurnedGround;
uniform vec3 colorAsh;
uniform float seed;
uniform int bodycount;
uniform int id;

uniform sampler2D locs;

uniform float size;
uniform vec3 lightPosition;
uniform vec3 viewPosition;
in vec3 interpolatedLocalPosition;
in vec3 interpolatedPosition;
in vec3 interpolatedNormal;
in vec3 interpolatedLightPosition;

#include <noise.comp>
#include <lighting.comp>

float shininess = 250.0;

void main() {
  // Calculate f by combining multiple noise layers using different density
  float f = 0.0;
  f += 1.0 * noise(1.0 * interpolatedLocalPosition / size, seed);
  f += 0.8 * noise(5.0 * interpolatedLocalPosition / size, seed);
  f += 0.6 * noise(8.0 * interpolatedLocalPosition / size, seed);
  f += 0.4 * noise(13.0 * interpolatedLocalPosition / size, seed);
  f += 0.2 * noise(11.0 * interpolatedLocalPosition / size, seed);
  //f += 0.55 * noise(3.0 * interpolatedLocalPosition / size, seed);
  //f += 0.15 * noise(7.0 * interpolatedLocalPosition / size, seed);
  //f += 0.3 * noise(17.0 * interpolatedLocalPosition / size, seed);
  //f += 0.5 * noise(4.0 * interpolatedLocalPosition / size, seed);

  // Luminosity, get from texture
  float luminosity = 1.0;
  vec4 cposr;
  vec4 lposr = texture2D(locs, vec2(0.5 / float(bodycount), 0.5));

  // Bodies before self
  int i;
  for (i = 1; i < id; ++i) {
    cposr = texture2D(locs, vec2((float(i) + 0.5) / float(bodycount), 0.5));
    luminosity *= softShadow(lposr.xyz, lposr.w, cposr.xyz, cposr.w, interpolatedPosition);
  }

  // Bodies after self
  for (i = id + 1; i < bodycount; ++i) {
    cposr = texture2D(locs, vec2((float(i) + 0.5) / float(bodycount), 0.5));
    luminosity *= softShadow(lposr.xyz, lposr.w, cposr.xyz, cposr.w, interpolatedPosition);
  }

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
  vec3 lavaglow = vec3(0.0);

  if (f > 0.2){
    noiseColor = colorAsh;//mix(color[2], color[1], min(1.0, (f - 0.5)) );

  } else if (f > -0.2)
    noiseColor = mix(colorBurnedGround, colorAsh, (f + 0.2) / 0.4 );

  else if (f > -0.3)
    noiseColor = mix(colorLava, colorBurnedGround, (f + 0.3) / 0.1 );

  else {
    noiseColor = mix(colorLava, colorDeepLava, min(1.0, -(f + 0.3)) );
    lavaglow = colorDeepLava;
  }

  // Diffuse lighting
  float diffuse = orenNayar(l, n, v, 0.3);

  // Put Diffuse, specular and glow light together to get the end result
  vec3 interpolatedColor = luminosity * (noiseColor * diffuse) + lavaglow;

  gl_FragColor = vec4(interpolatedColor, 1.0);
}
`

terraPlanetFrag = `
uniform vec3 color[3];
uniform vec3 colorAtm;
uniform vec3 colorWater;
uniform vec3 colorDeepWater;
uniform float seed;
uniform int bodycount;
uniform int id;

uniform sampler2D locs;

uniform float size;
uniform vec3 lightPosition;
uniform vec3 viewPosition;
in vec3 interpolatedLocalPosition;
in vec3 interpolatedPosition;
in vec3 interpolatedNormal;
in vec3 interpolatedLightPosition;

#include <noise.comp>
#include <lighting.comp>

float shininess = 250.0;

void main() {
  // Calculate f by combining multiple noise layers using different density
  float f = 0.0;
  f += 1.0 * noise(1.0 * interpolatedLocalPosition / size, seed);
  f += 0.8 * noise(5.0 * interpolatedLocalPosition / size, seed);
  f += 0.6 * noise(8.0 * interpolatedLocalPosition / size, seed);
  f += 0.4 * noise(13.0 * interpolatedLocalPosition / size, seed);
  f += 0.2 * noise(11.0 * interpolatedLocalPosition / size, seed);

  // Luminosity, get from texture
  float luminosity = 1.0;
  vec4 cposr;
  vec4 lposr = texture2D(locs, vec2(0.5 / float(bodycount), 0.5));

  // Bodies before self
  int i;
  for (i = 1; i < id; ++i) {
    cposr = texture2D(locs, vec2((float(i) + 0.5) / float(bodycount), 0.5));
    luminosity *= softShadow(lposr.xyz, lposr.w, cposr.xyz, cposr.w, interpolatedPosition);
  }

  // Bodies after self
  for (i = id + 1; i < bodycount; ++i) {
    cposr = texture2D(locs, vec2((float(i) + 0.5) / float(bodycount), 0.5));
    luminosity *= softShadow(lposr.xyz, lposr.w, cposr.xyz, cposr.w, interpolatedPosition);
  }

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

  if (f > 0.5)
    noiseColor = mix(color[2], color[1], min(1.0, (f - 0.5)) );

  else if (f > 0.1)
    noiseColor = mix(color[0], color[1], (f - 0.1) / 0.4 );

  else if (f > 0.0)
    noiseColor = mix(colorWater, color[0], f / 0.1 );

  else {
    noiseColor = mix(colorWater, colorDeepWater, min(1.0, -f) );
    specular = pow(max(0.0, dot(n, h)), 3.0 * shininess);
  }

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
  vec3 interpolatedColor = luminosity * (noiseColor * diffuse + specular + glow);

  gl_FragColor = vec4(interpolatedColor, 1.0);
}
`

moonFrag = `
uniform float size;
uniform vec3 colorGrey;
uniform vec3 colorDarkGrey;
uniform vec3 lightPosition;
uniform float seed;
in vec3 interpolatedLocalPosition;
in vec3 interpolatedPosition; // We interpolate the position
in vec3 interpolatedNormal;   // We interpolate the normal

#include <noise.comp>
#include <lighting.comp>

float shininess = 50.0;

void main() {
  // Calculate f by combining multiple noise layers using different density
  float f = 0.0;
  f += 0.5 * (1.0 - abs(noise(3.0 * interpolatedLocalPosition / size, seed)));
  f += 0.5 * (1.0 - abs(noise(7.0 * interpolatedLocalPosition / size, seed)));
  f += 0.063 * noise(11.0 * interpolatedLocalPosition / size, seed);

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
  if (f > 1.0)
    noiseColor = colorGrey;

  else if (f > 0.1)
    noiseColor = mix(colorDarkGrey, colorGrey, f / 0.5 );

  else {
    noiseColor = colorDarkGrey;
  }

  vec3 interpolatedColor = noiseColor * max(0.0, orenNayar(l, n, v, 1.0));

  gl_FragColor = vec4(interpolatedColor, 1.0);
  //gl_FragColor = vec4(vec3(f), 1.0);
}
`

