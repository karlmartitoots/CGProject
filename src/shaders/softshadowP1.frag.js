var ssP1Frag = `

// Color uniforms
uniform vec3 _Color;
uniform vec3 _SpecColor;
uniform vec3 _LightColor0;

// Vec3 uniforms
uniform vec3 _SpherePosition;
uniform vec3 _WorldSpaceCameraPos;
uniform vec3 _WorldSpaceLightPos0;

// Float uniforms
uniform float _Shininess;
uniform float _SphereRadius;
uniform float _LightSourceRadius;

varying vec3 interpolatedPosition;
varying vec3 interpolatedNormal;

void main() {
  vec3 normalDirection = normalize(interpolatedNormal);

  vec3 viewDirection = normalize(_WorldSpaceCameraPos - interpolatedPosition);
  vec3 lightDirection;
  float lightDistance;
  float attenuation;

  lightDirection = _WorldSpaceLightPos0 - interpolatedPosition;
  lightDistance = length(lightDirection);
  attenuation = 1.0 / lightDistance; // linear attenuation
  lightDirection = lightDirection / lightDistance;

  // computation of level of shadowing w
  vec3 sphereDirection = _SpherePosition - interpolatedPosition;
  float sphereDistance = length(sphereDirection);
  sphereDirection = sphereDirection / sphereDistance;

  float d = lightDistance * (
    asin(min(1.0, length(cross(lightDirection, sphereDirection)))) - asin(min(1.0, _SphereRadius / sphereDistance))
  );

  float w = smoothstep(-1.0, 1.0, -d / _LightSourceRadius);

  w *= smoothstep(0.0, 0.2, dot(lightDirection, sphereDirection));
  w *= smoothstep(0.0, _SphereRadius, lightDistance - sphereDistance);

  vec3 diffuseReflection = attenuation * _LightColor0 * _Color * max(0.0, dot(normalDirection, lightDirection));

  vec3 specularReflection;

  // light source on the wrong side?
  if (dot(normalDirection, lightDirection) < 0.0) {
    // no specular reflection
    specularReflection = vec3(0.0, 0.0, 0.0);
  }

  // light source on the right side
  else {
     specularReflection = attenuation * _LightColor0 * _SpecColor * pow(
       max(0.0, dot(reflect(-lightDirection, normalDirection), viewDirection)),
       _Shininess
     );
  }

  gl_FragColor = vec4(100.0 * (1.0 - w) * (diffuseReflection + specularReflection), 1.0);
}
`;
