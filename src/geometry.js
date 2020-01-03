function createCBody(radius, lsource, material) {
  var geometry = new THREE.SphereBufferGeometry(radius, 70, 70);

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

  return new THREE.Mesh(geometry, material);
}

function createLine(point1, point2) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(point1);
  geometry.vertices.push(point2);

  var material = new THREE.LineBasicMaterial({color: 0x0000FF});

  return new THREE.Line(geometry, material);
}
