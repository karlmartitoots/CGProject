skyboxVert = `

//out vec3 interpolatedPosition; //We interpolate the position
//out vec3 interpolatedNormal;   //We interpolate the normal
//out vec3 interpolatedLocalPosition;

void main() {
  //interpolatedLocalPosition = position;
  //interpolatedPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  //interpolatedNormal = normalize(mat3(transpose(inverse(modelMatrix))) * normal).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
