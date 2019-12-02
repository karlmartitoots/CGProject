var renderer, scene, cam;
var sceneWidth = 800;
var sceneHeight = 500;
var bodies = [];
var clock = new THREE.Clock();
var delta = clock.getDelta();
var seed = '42';

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

  setCustomConf();

  var generator = new Generator(confMap);

  core = generator.generate(seed);

  scene.add(core.root);

  // Camera config
  camController = new CameraController(renderer, core, sceneWidth, sceneHeight);

  // Initalize keyboard and mouse controls
  initializeControls(camController);

  // DAT.GUI Related Stuff
  var guiObj = {
    seed : globalThis.seed,
    Generate : function() {
      scene.remove(core.root);
      core = generator.generate(this.seed);
      scene.add(core.root);
    },
    StarScaleX : core.mesh.children[0].scale.x
  };
  console.log(guiObj);
  var gui = new dat.GUI();
  gui.add(guiObj, 'seed');
  gui.add(guiObj, 'Generate');

  var starFolder = gui.addFolder('Star');
  starFolder.add(core.mesh.children[0].material, 'wireframe').listen();
  starFolder.add(core.mesh.children[0].scale, 'x', 1, 10).listen();
  starFolder.open();

  draw();
}

var counter = 0;

function setCustomConf() {
  var customConf = new Map();
  customConf.set("starSize", 20);
  customConf.set("planetMinSize", 1);
  customConf.set("planetMaxSize", 6);
  customConf.set("minRevolutionsPerUnit", 1);
  customConf.set("maxRevolutionsPerUnit", 2);
  customConf.set("minMoonAmount", 0);
  customConf.set("maxMoonAmount", 4);
  customConf.set("minMoonRevolutionsPerUnit", 1.0);
  customConf.set("maxMoonRevolutionsPerUnit", 2.0);
  customConf.set("minOrbitTiltX", - Math.PI / 20); // 9 degrees
  customConf.set("maxOrbitTiltX", Math.PI / 20);
  customConf.set("minOrbitTiltZ", - Math.PI / 20);
  customConf.set("maxOrbitTiltZ", Math.PI / 20);
  customConf.set("ellipticalOrbit", true);
  customConf.set("minEllipseX", 0.9);
  customConf.set("maxEllipseX", 1.1);
  customConf.set("minEllipseZ", 0.9);
  customConf.set("maxEllipseZ", 1.1);
  customConf.set("celBodyRotationsPerUnit", 0.1);
  confMap = new Conf(customConf).confMap;
}

function draw() {
  requestAnimationFrame(draw);

  delta = clock.getDelta();

  updateControls(delta);

  core.update(core.mesh.getWorldPosition(new THREE.Vector3()), camController.current.camera.position);

  renderer.render(scene, camController.current.camera);
}
