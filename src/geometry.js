function createCBody(radius, lsource, material) {
  var geometry = new THREE.SphereBufferGeometry(radius, 50, 50);
  return new THREE.Mesh(geometry, material);
}

function createLine(point1, point2) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(point1);
  geometry.vertices.push(point2);

  var material = new THREE.LineBasicMaterial({color: 0x0000FF});

  return new THREE.Line(geometry, material);
}
