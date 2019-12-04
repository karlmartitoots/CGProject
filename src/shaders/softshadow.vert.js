var ssVert = `
varying vec3 interpolatedPosition; // We interpolate the position
varying vec3 interpolatedNormal;   // We interpolate the normal

void main() {
	interpolatedPosition = (modelMatrix * vec4(position, 1.0)).xyz;
	interpolatedNormal = normalize(mat3(modelMatrix) * normal);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
