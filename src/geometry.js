function createSphere(colorCode, radius, lsource) {
  var geometry = new THREE.SphereBufferGeometry(radius, 15, 15);
  var color = new THREE.Color(colorCode);

  //var material = new THREE.MeshPhongMaterial({
  //  color: colorCode,
  //  wireframe: true
  //});
  var material = new THREE.ShaderMaterial({
    uniforms: {
      lightPosition: {
        value: new THREE.Vector3(50, 40, 20)
      }
    },
    vertexShader: cbPlanetVert,
    fragmentShader: cbPlanetFrag
  });

  // Noise generation shader
  material.onBeforeCompile = shader => {
    //console.log(shader.fragmentShader);
    shader.fragmentShader = shader.fragmentShader.replace('#include <noise>', simplexNoise);
    shader.vertexShader = shader.vertexShader.replace('#include <noise>', simplexNoise);
    //console.log(shader.fragmentShader);
  };

  var sphere = new THREE.Mesh(geometry, material);

  if (lsource) {
    sphere.castShadow = false;
    sphere.receiveShadow = false;

    var light = new THREE.PointLight(0xff0040, 2, 1000000);

    light.add(sphere);
    light.castShadow = true;

    light.shadow.mapSize.width = 800;
    light.shadow.mapSize.height = 500;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;

    return light;
  }

  else {
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    return sphere;
  }
}

function createLine(point1, point2) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(point1);
  geometry.vertices.push(point2);

  var material = new THREE.LineBasicMaterial({color: 0x0000FF});

  return new THREE.Line(geometry, material);
}
