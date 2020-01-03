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

function createSky() {
  var skyBox = new THREE.BoxGeometry(12000, 12000, 12000);
  var skyBoxMaterial = new THREE.MeshBasicMaterial({
    map: getRandomStarField(600, 2048, 2048),
    side: THREE.BackSide
  });
  var sky = new THREE.Mesh(skyBox, skyBoxMaterial);
  return sky;
}

function draw() {
  requestAnimationFrame(draw);

  delta = clock.getDelta();

  updateControls(delta);

  core.update(core.mesh.getWorldPosition(new THREE.Vector3()), camController.current.camera.position, system);

  system.locTexture.needsUpdate = true;

  c = ++c % 144;

  renderer.render(scene, camController.current.camera);
}

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
