function createSphere(colorCode) {
  var geometry = new THREE.SphereGeometry(1, 15, 15);
  var color = new THREE.Color(colorCode);

  /*var material = new THREE.MeshPhongMaterial({
    color: colorCode,
    wireframe: false
  });*/
  
  /*var material = new THREE.ShaderMaterial({
    //color: colorCode,
    wireframe: false,
	uniforms: {
		lightPosition: {
			value: new THREE.Vector3(3, 5, 4)
		},
		color : {
			value: color
		}
	},
    vertexShader: cbPlanetVert,
    vertexShader: cbPlanetFrag
  });*/
  
  var material = new THREE.ShaderMaterial({
	uniforms: {
		_Color :{
			value: color
		},
		
		_SpecColor :{
			value: color
		},
		
		_Shininess :{
			value: 10.0
		},
			
		_SpherePosition :{
			value: new THREE.Vector4(3, 6, -2, -15)
		},
		
		_SphereRadius :{
			value: 0.5
		},
		
		_LightSourceRadius :{
			value: 0.5
		}
	}
	//vertexShader: 
	//vertexShader:
  });

  var sphere = new THREE.Mesh(geometry, material);
  sphere.receiveShadow = true;
  sphere.castShadow = true;
  return sphere;
}