var renderer, scene, camera;
var bodies;

function onLoad() {
  var canvasContainer = document.getElementById('myCanvasContainer');
  var width = 800;
  var height = 500;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  canvasContainer.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  var camera = new Camera(width, height);
  scene.add(camera.getCamera());

  var system = new System();
  scene.add(system.getObject3D());
  bodies = system.getBodies();

  draw();
}

function draw() {
  requestAnimationFrame(draw);

  // Get time
  var millis = Date.now();

  // Simple rotation of bodies
  bodies.forEach((item, index) => {
    // TODO: Rotate according to the speed, which is specified in Body class
    // TODO: Add a 'rotate' function to the body
    item.getBody().rotation.set(0, -(millis / 1000) % (Math.PI * 2), 0);
  });

  renderer.render(scene, camera);
}

