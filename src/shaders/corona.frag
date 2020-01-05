var coronaFrag = `
uniform float size;
uniform vec3 primaryColor;

in vec3 interpolatedPosition;
in vec3 interpolatedNormal;
in vec3 interpolatedLocalPosition;

#include <noise.comp>

void main() {
  vec3 normalPosition = interpolatedLocalPosition / size;

  gl_FragColor = vec4(primaryColor, 1.8 * size / pow(length(interpolatedLocalPosition.xy), 1.5) * (0.9 - length(normalPosition.xy)));
}
`
