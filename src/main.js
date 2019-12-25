var renderer, scene, cam;
var sceneWidth = 800;
var sceneHeight = 500;
var bodies = [];
var clock = new THREE.Clock();
var delta = clock.getDelta();
var seed = '42';

var system;

var confMap = new Conf().confMap;

var core;
var camController;

function onLoad() {
  if (WEBGL.isWebGL2Available() === false ) {
    document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
    console.log("WebGL2 is not available");
  }

  var canvasContainer = document.getElementById('myCanvasContainer');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('webgl2', {alpha: false});

  renderer = new THREE.WebGLRenderer({canvas: canvas, context: context});
  renderer.setSize(sceneWidth, sceneHeight);
  renderer.sortObjects = true;
  canvasContainer.appendChild(canvas);

  scene = new THREE.Scene();

  var generator = new Generator(confMap);

  setupGui(generator);

  core = generator.generate(seed);

  scene.add(core.root);

  console.log(core);

  // System controller. Is for shadows
  system = new System(core);

  // Camera config
  camController = new CameraController(renderer, core, sceneWidth, sceneHeight);

  // Initalize keyboard and mouse controls
  initializeControls(camController);

  draw();
}


var c = 0;

function draw() {
  requestAnimationFrame(draw);

  delta = clock.getDelta();

  updateControls(delta);

  core.update(core.mesh.getWorldPosition(new THREE.Vector3()), camController.current.camera.position, system);

  //system.locTexture.dispose();
  system.locTexture.needsUpdate = true;

  //if (c == 0)
  //  console.log(system.locations);

  c = ++c % 60;

  renderer.render(scene, camController.current.camera);
}
