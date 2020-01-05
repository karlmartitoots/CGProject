function getRandomStarField(numberOfStars, width, height) {
  var canvas = document.createElement('CANVAS');

  canvas.width = width;
  canvas.height = height;

  var ctx = canvas.getContext('2d');

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  for (var i = 0; i < numberOfStars; ++i) {
    var radius = Math.random() * 2;
    var x = Math.floor(Math.random() * width);
    var y = Math.floor(Math.random() * height);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
  }

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
};

function createSky() {
  // var geometry = new THREE.BoxGeometry(45000, 45000, 45000);
  var geometry = new THREE.SphereBufferGeometry(45000, 70, 70);
  var material = new THREE.MeshBasicMaterial({
    map: getRandomStarField(5000, 6000, 6000),
    side: THREE.BackSide
  });
  var sky = new THREE.Mesh(geometry, material);
  return sky;
}
