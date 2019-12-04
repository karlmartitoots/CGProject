/*cbPlanetVert = `
out vec3 interpolatedPosition; //We interpolate the position
out vec3 interpolatedNormal;   //We interpolate the normal
			
void main() {
							
	interpolatedPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
	interpolatedNormal = normalize(normalMatrix * normal);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`*/

/**/
`
#include "UnityCG.glslinc"

Shader "GLSL shadow of sphere" {
   Properties {
      _Color ("Diffuse Material Color", Color) = (1,1,1,1) 
      _SpecColor ("Specular Material Color", Color) = (1,1,1,1) 
      _Shininess ("Shininess", Float) = 10
      _SpherePosition ("Sphere Position", Vector) = (0,0,0,1)
      _SphereRadius ("Sphere Radius", Float) = 1
      _LightSourceRadius ("Light Source Radius", Float) = 0.005
   }
   SubShader {
      Pass {      
         Tags { "LightMode" = "ForwardBase" } 
            // pass for ambient light and first light source
 
         GLSLPROGRAM
 
         // User-specified properties
         uniform vec4 _Color; 
         uniform vec4 _SpecColor; 
         uniform float _Shininess;
         uniform vec4 _SpherePosition; 
            // center of shadow-casting sphere in world coordinates
         uniform float _SphereRadius; 
            // radius of shadow-casting sphere
         uniform float _LightSourceRadius; 
            // in radians for directional light sources
 
         // The following built-in uniforms (except _LightColor0) 
         // are also defined in "UnityCG.glslinc", 
         // i.e. one could #include "UnityCG.glslinc" 
         uniform vec3 _WorldSpaceCameraPos; 
            // camera position in world space
         uniform mat4 _Object2World; // model matrix
         uniform mat4 _World2Object; // inverse model matrix
         uniform vec4 _WorldSpaceLightPos0; 
            // direction to or position of light source
         uniform vec4 _LightColor0; 
            // color of light source (from "Lighting.cginc")
 
         varying vec4 position; 
            // position of the vertex (and fragment) in world space 
         varying vec3 varyingNormalDirection; 
            // surface normal vector in world space
 
         #ifdef VERTEX
 
         void main()
         {                                
            mat4 modelMatrix = _Object2World;
            mat4 modelMatrixInverse = _World2Object; // unity_Scale.w 
               // is unnecessary because we normalize vectors
 
            position = modelMatrix * gl_Vertex;
            varyingNormalDirection = normalize(vec3(
               vec4(gl_Normal, 0.0) * modelMatrixInverse));
 
            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
         }
 
         #endif
 
         #ifdef FRAGMENT
 
         void main()
         {
            vec3 normalDirection = normalize(varyingNormalDirection);
 
            vec3 viewDirection = 
               normalize(_WorldSpaceCameraPos - vec3(position));
            vec3 lightDirection;
            float lightDistance;
            float attenuation;
 
            if (0.0 == _WorldSpaceLightPos0.w) // directional light?
            {
               attenuation = 1.0; // no attenuation
               lightDirection = normalize(vec3(_WorldSpaceLightPos0));
               lightDistance = 1.0;
            } 
            else // point or spot light
            {
               lightDirection = vec3(_WorldSpaceLightPos0 - position);
               lightDistance = length(lightDirection);
               attenuation = 1.0 / lightDistance; // linear attenuation 
               lightDirection = lightDirection / lightDistance;
            }

            // computation of level of shadowing w  
            vec3 sphereDirection = vec3(_SpherePosition - position);
            float sphereDistance = length(sphereDirection);
            sphereDirection = sphereDirection / sphereDistance;
            float d = lightDistance 
               * (asin(min(1.0, 
               length(cross(lightDirection, sphereDirection)))) 
               - asin(min(1.0, _SphereRadius / sphereDistance)));
            float w = smoothstep(-1.0, 1.0, -d / _LightSourceRadius);
            w = w * smoothstep(0.0, 0.2, 
               dot(lightDirection, sphereDirection));
            if (0.0 != _WorldSpaceLightPos0.w) // point light source?
            {
               w = w * smoothstep(0.0, _SphereRadius, 
                  lightDistance - sphereDistance);
            }

            vec3 ambientLighting = 
               vec3(gl_LightModel.ambient) * vec3(_Color);
 
            vec3 diffuseReflection = 
               attenuation * vec3(_LightColor0) * vec3(_Color) 
               * max(0.0, dot(normalDirection, lightDirection));
 
            vec3 specularReflection;
            if (dot(normalDirection, lightDirection) < 0.0) 
               // light source on the wrong side?
            {
               specularReflection = vec3(0.0, 0.0, 0.0); 
                  // no specular reflection
            }
            else // light source on the right side
            {
               specularReflection = attenuation * vec3(_LightColor0) 
                  * vec3(_SpecColor) * pow(max(0.0, dot(
                  reflect(-lightDirection, normalDirection), 
                  viewDirection)), _Shininess);
            }
 
            gl_FragColor = vec4(ambientLighting 
               + (1.0 - w) * (diffuseReflection + specularReflection), 
               1.0);
         }
 
         #endif
 
         ENDGLSL
      }
 
      Pass {      
         Tags { "LightMode" = "ForwardAdd" } 
            // pass for additional light sources
         Blend One One // additive blending 

         GLSLPROGRAM
 
         // User-specified properties
         uniform vec4 _Color; 
         uniform vec4 _SpecColor; 
         uniform float _Shininess;
         uniform vec4 _SpherePosition; 
            // center of shadow-casting sphere in world coordinates
         uniform float _SphereRadius; 
            // radius of shadow-casting sphere
         uniform float _LightSourceRadius; 
            // in radians for directional light sources
 
         // The following built-in uniforms (except _LightColor0) 
         // are also defined in "UnityCG.glslinc", 
         // i.e. one could #include "UnityCG.glslinc" 
         uniform vec3 _WorldSpaceCameraPos; 
            // camera position in world space
         uniform mat4 _Object2World; // model matrix
         uniform mat4 _World2Object; // inverse model matrix
         uniform vec4 _WorldSpaceLightPos0; 
            // direction to or position of light source
         uniform vec4 _LightColor0; 
            // color of light source (from "Lighting.cginc")
 
         varying vec4 position; 
            // position of the vertex (and fragment) in world space 
         varying vec3 varyingNormalDirection; 
            // surface normal vector in world space
 
         #ifdef VERTEX
 
         void main()
         {                                
            mat4 modelMatrix = _Object2World;
            mat4 modelMatrixInverse = _World2Object; // unity_Scale.w 
               // is unnecessary because we normalize vectors
 
            position = modelMatrix * gl_Vertex;
            varyingNormalDirection = normalize(vec3(
               vec4(gl_Normal, 0.0) * modelMatrixInverse));
 
            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
         }
 
         #endif
 
         #ifdef FRAGMENT
 
         void main()
         {
            vec3 normalDirection = normalize(varyingNormalDirection);
 
            vec3 viewDirection = 
               normalize(_WorldSpaceCameraPos - vec3(position));
            vec3 lightDirection;
            float lightDistance;
            float attenuation;
 
            if (0.0 == _WorldSpaceLightPos0.w) // directional light?
            {
               attenuation = 1.0; // no attenuation
               lightDirection = normalize(vec3(_WorldSpaceLightPos0));
               lightDistance = 1.0;
            } 
            else // point or spot light
            {
               lightDirection = vec3(_WorldSpaceLightPos0 - position);
               lightDistance = length(lightDirection);
               attenuation = 1.0 / lightDistance; // linear attenuation 
               lightDirection = lightDirection / lightDistance;
            }
 
            // computation of level of shadowing w  
            vec3 sphereDirection = vec3(_SpherePosition - position);
            float sphereDistance = length(sphereDirection);
            sphereDirection = sphereDirection / sphereDistance;
            float d = lightDistance 
               * (asin(min(1.0, 
               length(cross(lightDirection, sphereDirection)))) 
               - asin(min(1.0, _SphereRadius / sphereDistance)));
            float w = smoothstep(-1.0, 1.0, -d / _LightSourceRadius);
            w = w * smoothstep(0.0, 0.2, 
               dot(lightDirection, sphereDirection));
            if (0.0 != _WorldSpaceLightPos0.w) // point light source?
            {
               w = w * smoothstep(0.0, _SphereRadius, 
                  lightDistance - sphereDistance);
            }

            vec3 diffuseReflection = 
               attenuation * vec3(_LightColor0) * vec3(_Color) 
               * max(0.0, dot(normalDirection, lightDirection));
 
            vec3 specularReflection;
            if (dot(normalDirection, lightDirection) < 0.0) 
               // light source on the wrong side?
            {
               specularReflection = vec3(0.0, 0.0, 0.0); 
                  // no specular reflection
            }
            else // light source on the right side
            {
               specularReflection = attenuation * vec3(_LightColor0) 
                  * vec3(_SpecColor) * pow(max(0.0, dot(
                  reflect(-lightDirection, normalDirection), 
                  viewDirection)), _Shininess);
            }
 
            gl_FragColor = vec4((1.0 - w) * (diffuseReflection 
               + specularReflection), 1.0);
         }
 
         #endif
 
         ENDGLSL 
      }
   } 
   // The definition of a fallback shader should be commented out 
   // during development:
   // Fallback "Specular"
}
`



/**/
