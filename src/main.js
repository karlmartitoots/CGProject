var renderer, scene, cam;
var sceneWidth = window.innerWidth;
var sceneHeight = window.innerHeight;
var bodies = [];
var clock = new THREE.Clock();
var delta = clock.getDelta();
var seed = '42';

var system;

var confMap = new Conf().confMap;

var core;
var camController;

function onLoad() {
  if (WEBGL.isWebGL2Available() === false) {
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

  // Preprocess shaders
  preprocessShaders();

  var generator = new Generator(confMap);

  setupGui(generator);

  core = generator.generate(seed);

  scene.add(core.root);

  var sky = createSky();
  scene.add(sky);

  // System controller. Is for shadows
  system = new System(core);

  // Camera config
  camController = new CameraController(renderer, core, sceneWidth, sceneHeight);

  // Initalize keyboard and mouse controls
  initializeControls(camController);

  draw();
}

var c = 0;
var cp = new THREE.Vector3();

function draw() {
  scene.updateMatrixWorld(true);

  requestAnimationFrame(draw);

  delta = clock.getDelta();

  updateControls(delta);

  cp = camController.current.camera.getWorldPosition(cp);

  core.update(
    cp,
    system
  );

  system.locTexture.needsUpdate = true;

  c = ++c % 144;
  if (c == 0)
    console.log(core.shaderMaterial.uniforms.bodycount.value);

  renderer.render(scene, camController.current.camera);
}
