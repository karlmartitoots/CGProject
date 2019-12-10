var ssP1Frag = `

#define M_PI 3.1415926535897932384626433832795

// Color uniforms
uniform vec3 _Color;
uniform vec3 _SpecColor;
uniform vec3 _LightColor0;

// Vec3 uniforms
uniform vec3 _SpherePosition; // P pos
uniform vec3 _WorldSpaceCameraPos;
uniform vec3 _WorldSpaceLightPos0; // Sun Pos

// Float uniforms
uniform float _Shininess;
uniform float _SphereRadius; // Rpr
uniform float _LightSourceRadius; // Rsr

varying vec3 interpolatedPosition; //Frag pos ?
varying vec3 interpolatedNormal;

void main() {
  vec3 normalDirection = normalize(interpolatedNormal);

  vec3 viewDirection = normalize(_WorldSpaceCameraPos - interpolatedPosition);
  vec3 lightDirection; // S
  float lightDistance; // |S|
  float attenuation;

  lightDirection = _WorldSpaceLightPos0 - interpolatedPosition;
  lightDistance = length(lightDirection);
  attenuation = 1.0 / lightDistance; // linear attenuation
  lightDirection = lightDirection / lightDistance;

  // computation of level of shadowing w
  vec3 sphereDirection = _SpherePosition - interpolatedPosition;// P
  float sphereDistance = length(sphereDirection); // |P|
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
  
  //
  
  float Rs = _LightSourceRadius / lightDistance; // Apparent radious of the sun 
  float Rp = _SphereRadius / sphereDistance; // Apparent radious of the planet 
  float Da = acos( dot(normalize(lightDirection), normalize(sphereDirection))); // Angular Distance ( Sun - Fragment - Planet ): acos( dpt(S,P) / (|S|*|P|)
  //vec3 D = normalize(sphereDirection) - normalize(lightDirection);
  //float Da = sqrt(D.x * D.x + D.y * D.y + D.z * D.z);
  
  float Sarea = M_PI * pow(Rs, 2.0);
  float Area;

  if(Rs + Rp <= Da){ // not overlaping
  
	Area = Sarea;
	
  }else if(abs(Rs - Rp) >= Da){ // full overlaping 
  
	Area = max(Sarea - M_PI * pow(Rp, 2.0), 0.0);
	
  }else if(Rs + Rp > Da){ // partial overlapin
	
	float Rs2 = pow(Rs, 2.0);
	float Rp2 = pow(Rp, 2.0);
	float Da2 = pow(Da, 2.0);
	
	float Salph = 2.0 * acos((Rs2 + Da2 - Rp2) / (2.0 * Rs * Da));
	float Palph = 2.0 * acos((Rp2 + Da2 - Rs2) / (2.0 * Rp * Da));
	
	float Pseg = Rp2 * (Palph - sin(Palph)) / 2.0 ;
	float Sseg = Rs2 * (Salph - sin(Salph)) / 2.0 ;
	
	float OverlapA = Pseg + Sseg ;
	
	Area =  Sarea - OverlapA ; 
  }

  Area *= 3000.0;
  Area /= M_PI * pow (_LightSourceRadius, 2.0);
  
	
  //gl_FragColor = vec4(100.0 * (1.0 - w) * (diffuseReflection + specularReflection), 1.0);//web result
  
  gl_FragColor = vec4(Area * (diffuseReflection), 1.0);
}
`;


/*

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
  
  //
  

  gl_FragColor = vec4(100.0 * (1.0 - w) * (diffuseReflection + specularReflection), 1.0);
}
`;


*/