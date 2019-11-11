function createSphere(colorCode) {
  var geometry = new THREE.SphereGeometry(1, 15, 15);
  var color = new THREE.Color(colorCode);

  var material = new THREE.MeshPhongMaterial({
    color: colorCode,
    wireframe: false
  });

  var sphere = new THREE.Mesh(geometry, material);
  sphere.receiveShadow = true;
  sphere.castShadow = true;
  return sphere;
}
