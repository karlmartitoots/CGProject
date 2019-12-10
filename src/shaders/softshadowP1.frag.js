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
  //float Da = radians( acos( dot(lightDirection, sphereDirection) /(lightDistance * sphereDistance)) ); // Angular Distance ( Sun - Fragment - Planet ): acos( dpt(S,P) / (|S|*|P|)
  float Da = acos( dot(lightDirection, sphereDirection) /(lightDistance * sphereDistance)) ; // Angular Distance ( Sun - Fragment - Planet ): acos( dpt(S,P) / (|S|*|P|)
  float Sv ; // Volume of the sun
  float Iv; // Volume of the intersection
  
  float lightPercent = 300.0;
  //delete = 100.0 from above after done intersection


  if(Rs + Rp >= Da){ // not overlaping
  //if(Rs + Rp <= Da){ // not overlaping
  
	lightPercent = 300.0;
	
  }else if(Rs - Rp <= Da){ // full overlaping 
  //}else if(Rs - Rp >= Da){ // full overlaping 
  
	lightPercent = 300.0 * (M_PI * pow(Rs, 2.0)) / (M_PI * pow(Rp, 2.0));
	
  }else if(Rs + Rp < Da){ // partial overlapin
  //}else if(Rs + Rp > Da){ // partial overlapin
	
		/**/
		
		//sun volume
		Sv = (4.0 / 3.0) * M_PI * pow(Rs, 3.0);
		
		//Intersection volume ( 2 * Spherical cap )
		
		float h = ( Rs + Rp - Da ) / 2.0 ;
		Iv = 2.0 * (M_PI * pow(h, 2.0) / 3.0) * (3.0 * Rs - h);
		
		lightPercent = 300.0 * Sv / Iv ;
		/**/
  }
	
  //gl_FragColor = vec4(100.0 * (1.0 - w) * (diffuseReflection + specularReflection), 1.0);//web result
  
  gl_FragColor = vec4(lightPercent * (diffuseReflection), 1.0);
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