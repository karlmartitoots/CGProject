var lavaPlanetFrag = `
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

void main() {
  // Luminosity, get from texture
  vec4 lposr = texture2D(locs, vec2(0.5 / float(bodycount), 0.5));
  vec4 pposr = texture2D(locs, vec2((0.5 + float(id)) / float(bodycount), 0.5));
  float lum = luminosity(locs, id, bodycount, interpolatedPosition, lposr);

  vec3 normalPosition = interpolatedLocalPosition / pposr.w;

  // Calculate f by combining multiple noise layers using different density
  float f = 0.0;
  f += 0.4 * fnoise(0.5 * normalPosition, seed, 10, 0.7);
  f += 0.6 * fnoise(1.0 * normalPosition, seed, 8, 0.6);
  f += 0.7 * fnoise(2.0 * normalPosition, seed, 5, 0.2);
  f += 0.5 * fnoise(5.0 * normalPosition, seed, 5, 0.5);
  f += 0.1 * fnoise(8.0 * normalPosition, seed, 5, 0.8);

  f *= 1.8;

  // 1. Find normal
  vec3 n = normalize(interpolatedNormal);

  // 3. Find the direction towards the viewer, normalize.
  vec3 v = normalize(viewPosition - interpolatedPosition);

  // 4. Find the direction towards the light source, normalize.
  vec3 l = normalize(lposr.xyz - interpolatedPosition);

  // Find angle between light and normal
  float landing = dot(l, n);
  landing = pow(max(landing, 0.0), 0.6);

  // Surface colors
  vec3 noiseColor;
  vec3 lavaglow = vec3(0.0);

  if (f > 0.4 + landing){
    noiseColor = colorAsh;

  } else if (f > 0.2 + landing)
    noiseColor = mix(colorBurnedGround, colorAsh, (f - 0.2) * 5.0);

  else if (f > -0.3 + landing / 20.0)
    noiseColor = mix(colorLava, colorBurnedGround, (f + 0.3) * 8.5);

  else {
    float depth = min(1.0, -(f + 0.2));
    noiseColor = mix(colorLava, colorDeepLava, depth);
    lavaglow = noiseColor;
  }

  // Diffuse lighting
  float diffuse = orenNayar(l, n, v, 0.3);

  // Put Diffuse, specular and glow light together to get the end result
  vec3 interpolatedColor = max(lum * (noiseColor * diffuse), lavaglow);

  gl_FragColor = vec4(interpolatedColor, 1.0);
}
`
