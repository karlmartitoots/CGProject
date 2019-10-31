function createSphere(colorCode) {
  var geometry = new THREE.SphereGeometry(1, 15, 15);
  var color = new THREE.Color(colorCode);

  var material = new THREE.MeshBasicMaterial({
    color: colorCode,
    wireframe: false
  });

  var sphere = new THREE.Mesh(geometry, material);

  return sphere;
}
