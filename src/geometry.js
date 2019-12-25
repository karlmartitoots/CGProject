function createCBody(radius, lsource, material) {
  var geometry = new THREE.SphereBufferGeometry(radius, 50, 50);

  // Noise generation shader
  //console.log(material);
  material.onBeforeCompile = shader => {
    // Noise
    shader.fragmentShader = shader.fragmentShader.replace('#include <noise.comp>', noiseComp);
    shader.vertexShader = shader.vertexShader.replace('#include <noise.comp>', noiseComp);

    // Lighting
    shader.fragmentShader = shader.fragmentShader.replace('#include <lighting.comp>', lightComp);
    shader.vertexShader = shader.vertexShader.replace('#include <lighting.comp>', lightComp);
  };

  material.depthFunc = THREE.LessEqualDepth;
  material.blending = THREE.NoBlending;

  var sphere = new THREE.Mesh(geometry, material);

  if (lsource) {
 //   sphere.castShadow = false;
 //   sphere.receiveShadow = false;

 //   var light = new THREE.PointLight(0xff0040, 2, 1000000);

    var light = new THREE.Object3D();
    light.add(sphere);
 //   light.castShadow = true;

 //   light.shadow.mapSize.width = 800;
 //   light.shadow.mapSize.height = 500;
 //   light.shadow.camera.near = 0.5;
 //   light.shadow.camera.far = 500;

    light.name = "LIGHT";

    //return light;
    return sphere;
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
