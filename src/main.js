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

  var generator = new Generator(confMap);

  setupGui(generator);

  core = generator.generate(seed);

  scene.add(core.root);

  // Camera config
  camController = new CameraController(renderer, core, sceneWidth, sceneHeight);

  // Initalize keyboard and mouse controls
  initializeControls(camController);

  draw();
}

var counter = 0;

function setupGui(generator) {
  var gui = new dat.GUI();

  var guiObj = createGuiObject(generator);

  gui.add(guiObj, 'seed');
  gui.add(guiObj, 'Generate');
  gui.add(guiObj, 'celBodyRotationsPerUnit', 0, 100);
  gui.add(guiObj, 'minRevolutionsPerUnit', 0, 100);
  gui.add(guiObj, 'maxRevolutionsPerUnit', 0, 100);
  gui.add(guiObj, 'minTilt', -Math.PI / 2, Math.PI / 2);
  gui.add(guiObj, 'maxTilt', -Math.PI / 2, Math.PI / 2);
  var starConfFolder = gui.addFolder('Star Configuration');
  starConfFolder.add(guiObj, 'starSize', 1, 100);

  var planetConfFolder = gui.addFolder('Planet Configuration');
  planetConfFolder.add(guiObj, 'planetMinSize', 1, 100);
  planetConfFolder.add(guiObj, 'planetMaxSize', 1, 100);

  var moonConfFolder = gui.addFolder('Moon Configuration');
  moonConfFolder.add(guiObj, 'minMoonRevolutionsPerUnit', 0, 100);
  moonConfFolder.add(guiObj, 'maxMoonRevolutionsPerUnit', 0, 100);
  moonConfFolder.add(guiObj, 'minMoonAmount', 0, 10);
  moonConfFolder.add(guiObj, 'maxMoonAmount', 0, 10);
  moonConfFolder.add(guiObj, 'moonMinTilt', -Math.PI / 2, Math.PI / 2);
  moonConfFolder.add(guiObj, 'moonMaxTilt', -Math.PI / 2, Math.PI / 2);

  var orbitsConfFolder = gui.addFolder('Orbits Configuration');
  orbitsConfFolder.add(guiObj, 'minDistanceBetweenOrbits', 10, 100);
  orbitsConfFolder.add(guiObj, 'visibleOrbits');
  orbitsConfFolder.add(guiObj, 'ellipticalOrbit');
  orbitsConfFolder.add(guiObj, 'minOrbitTiltX', - Math.PI / 2, Math.PI / 2);
  orbitsConfFolder.add(guiObj, 'maxOrbitTiltX', - Math.PI / 2, Math.PI / 2);
  orbitsConfFolder.add(guiObj, 'minOrbitTiltZ', - Math.PI / 2, Math.PI / 2);
  orbitsConfFolder.add(guiObj, 'maxOrbitTiltZ', - Math.PI / 2, Math.PI / 2);
  orbitsConfFolder.add(guiObj, 'minEllipseX', 0.3, 3.0);
  orbitsConfFolder.add(guiObj, 'maxEllipseX', 0.3, 3.0);
  orbitsConfFolder.add(guiObj, 'minEllipseZ', 0.3, 3.0);
  orbitsConfFolder.add(guiObj, 'maxEllipseZ', 0.3, 3.0);
  orbitsConfFolder.add(guiObj, 'orbitYaw', 0, 1);

  setCustomConf(guiObj);
}

function createGuiObject(generator) {
  return {
    seed: globalThis.seed,
    starSize: 20,
    celBodyRotationsPerUnit: 0.1,
    minTilt: 0.0,
    maxTilt: Math.PI / 4,
    planetMinSize: 1,
    planetMaxSize: 6,
    minRevolutionsPerUnit: 1,
    maxRevolutionsPerUnit: 2,
    minMoonAmount: 0,
    maxMoonAmount: 4,
    minMoonRevolutionsPerUnit: 1,
    maxMoonRevolutionsPerUnit: 2,
    moonMinTilt: 0.0,
    moonMaxTilt: Math.PI / 4,
    visibleOrbits: true,
    ellipticalOrbit: true,
    minDistanceBetweenOrbits: 30,
    minOrbitTiltX: - Math.PI / 20,
    maxOrbitTiltX: Math.PI / 20,
    minOrbitTiltZ: - Math.PI / 20,
    maxOrbitTiltZ: Math.PI / 20,
    minEllipseX: 0.9,
    maxEllipseX: 1.1,
    minEllipseZ: 0.9,
    maxEllipseZ: 1.1,
    orbitYaw: 0.5,
    Generate: function () {
      scene.remove(core.root);
      setCustomConf(this);
      core = generator.generate(this.seed);
      scene.add(core.root);
    }
  };
}

function setCustomConf(guiObject) {
  var customConf = new Map();
  for( prop in guiObject ){
    if(prop == 'seed' || prop == 'Generate') continue;
    customConf.set(prop, guiObject[prop]);
  }
  confMap = new Conf(customConf).confMap;
}

function draw() {
  requestAnimationFrame(draw);

  delta = clock.getDelta();

  updateControls(delta);

  core.update(core.mesh.getWorldPosition(new THREE.Vector3()), camController.current.camera.position);

  renderer.render(scene, camController.current.camera);
}
