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

  var planetColor = new THREE.Color(colorCode);
  var specularColor = new THREE.Color(0xFFFFFF);
  var lightColor = new THREE.Color(0xAABBCC);

  var material = new THREE.ShaderMaterial({
    uniforms: {
    	_Color: {
    		value: planetColor
    	},

    	_SpecColor: {
    		value: specularColor
    	},

      _LightColor0: {
        value: lightColor
      },

      _WorldSpaceCameraPos: {
        value: new THREE.Vector3(0, 0, 0)
      },

      _WorldSpaceLightPos0: {
        value: new THREE.Vector3(6, -2, -15)
      },

    	_SpherePosition: {
    		value: new THREE.Vector3(0, 0, 0)
    	},

    	_Shininess: {
    		value: 10.0
    	},

    	_SphereRadius: {
    		value: 2
    	},

    	_LightSourceRadius: {
    		value: 0.5
    	}
    },

    vertexShader: ssVert,
    fragmentShader: ssP1Frag
  });

  var sphere = new THREE.Mesh(geometry, material);
  sphere.receiveShadow = true;
  sphere.castShadow = true;
  return sphere;
}
