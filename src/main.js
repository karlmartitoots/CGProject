var renderer, scene, cam;
var sceneWidth = 800;
var sceneHeight = 500;
var bodies = [];
var orbits = [];
var clock = new THREE.Clock();
var delta = clock.getDelta();
var dt;
var camSpeed = 1;
var movementLock = true;
var confMap = new Conf().confMap;
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);
document.addEventListener('wheel', onMouseWheelMove, false);

var mouse = new THREE.Vector2();
var MouseDown = false;

var core;
var camController;
var controls;

function onLoad() {
  if (WEBGL.isWebGL2Available() === false ) {
    document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
    console.log("WebGL2 is not available");
  }

  var canvasContainer = document.getElementById('myCanvasContainer');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('webgl2', {alpha: false});

  renderer = new THREE.WebGLRenderer({canvas: canvas, context: context});
  renderer.setSize(sceneWidth, sceneHeight);
  renderer.sortObjects = true;
//  renderer.shadowMap.enabled = true;//
//  renderer.shadowMap.type = THREE.BasicShadowMap;//PCFSoftShadowMap;//
  canvasContainer.appendChild(canvas);

  scene = new THREE.Scene();

  setCustomConf();
  generateStarSystem();

  scene.add(core.root);

  const color = 0xFFFFFF;
  const intensity = 0.2;
  const ambientlight = new THREE.AmbientLight(color, intensity);
  scene.add(ambientlight);

  // Camera config
  camController = new CameraController(renderer, core, sceneWidth, sceneHeight);

  controls = new THREE.FlyControls( camController._maincam.camera, renderer.domElement );
  controls.movementSpeed = 1000;
  controls.domElement = renderer.domElement;
  controls.rollSpeed = Math.PI / 6;
  controls.autoForward = false;
  controls.dragToLook = false;

  // DAT.GUI Related Stuff
  var guiObj = {
    Generate : function(){
      scene.remove(core.root);
      generateStarSystem();
      scene.add(core.root);
    },
    StarScaleX : core.mesh.children[0].scale.x
  };
  console.log(guiObj);
  var gui = new dat.GUI();
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

function generateSimpleStarSystem(){
  var star = new CelestialBody({orbitRadius: 0.0, size: 4, rotationsPerUnit: 1, revolutionsPerUnit: 1.0, tilt: 0.2, light: true});
  var planet = new CelestialBody({orbitRadius: 20.0, size: 2, rotationsPerUnit: 3, revolutionsPerUnit: 1.0, tilt: 0.4,
    ellipticalOrbit: true,
    ellipseX: 2,
    ellipseZ: 0.8});
  var moon = new CelestialBody({orbitRadius:4, size: 0.5, rotationsPerUnit:1, revolutionsPerUnit:4, tilt:0.1});
  star.add(planet);
  planet.add(moon);

  // Add all the created bodies to an array
  bodies.push(moon);
  bodies.push(planet);
  bodies.push(star);

  core = star;

  return core;
}

function generateStarSystem(){
  // Create star
  var star = new CelestialBody({size: confMap.get("starSize"), rotationsPerUnit: 1, revolutionsPerUnit: 1.0, tilt: 0.2, light: true});
  console.log("Star created");
  core = star;
  generatePlanets(star);

  bodies.push(star);
}

function generatePlanets(star){
  var orbitsDistance = confMap.get("minDistanceBetweenOrbits");
  var planetsLeft = confMap.get("planetAmount");
  var currentRadius = star.size + orbitsDistance * Math.random() + confMap.get("planetMaxSize");
  // Create random distanced planets
  while(planetsLeft){
    var planet = makePlanet();
    console.log("Planet created with orbit radius ", currentRadius);

    if(confMap.get("maxMoonAmount") > 0) generateMoons(planet);

    bodies.push(planet);
    star.add(planet);

    currentRadius = currentRadius + 2 * confMap.get("planetMaxSize") + orbitsDistance * Math.random();
    planetsLeft--;
  }

  function makePlanet() {
    return new CelestialBody({
      orbitRadius: currentRadius,
      startAngle: 2 * Math.PI * Math.random(),
      size: getRandomFloatInRange(confMap.get("planetMinSize"), confMap.get("planetMaxSize")),
      rotationsPerUnit: 3,
      revolutionsPerUnit: getRandomFloatInRange(confMap.get("minRevolutionsPerUnit"), confMap.get("maxRevolutionsPerUnit")),
      tilt: getRandomFloatInRange(confMap.get("minTilt"), confMap.get("maxTilt")),
      orbitTiltX: getRandomFloatInRange(confMap.get("minOrbitTiltX"), confMap.get("maxOrbitTiltX")),
      orbitTiltZ: getRandomFloatInRange(confMap.get("minOrbitTiltZ"), confMap.get("minOrbitTiltZ")),
      ellipseX: getGaussianNoise(1, 0.01), // mean 1, variance 0.01
      ellipseZ: getGaussianNoise(1, 0.01),
      ellipseFocusDir: (Math.random() < 0.5 ? -1 : 1)
    });
  }
}

function generateMoons(planet){
  var moonsLeft = getRandomIntInRange(confMap.get("minMoonAmount"), confMap.get("maxMoonAmount"));
  var moonRevPerUnit = getRandomFloatInRange(confMap.get("minMoonRevolutionsPerUnit"), confMap.get("maxMoonRevolutionsPerUnit"));
  var angles = range(0, moonsLeft).map(i => i * 2 * Math.PI / moonsLeft); // avoid collisions
  while(moonsLeft){
    var moonSize = getRandomFloatInRange(confMap.get("moonMinSize"), confMap.get("moonMaxSize"));
    var moon = makeMoon();

    console.log("Moon created for planet.");
    bodies.push(moon);
    planet.add(moon);

    moonsLeft--;
  }

  function makeMoon() {
    return new CelestialBody({
      startAngle: angles[moonsLeft - 1],
      orbitRadius: planet.size + moonSize + 3.0,
      size: moonSize,
      rotationsPerUnit: 1,
      revolutionsPerUnit: moonRevPerUnit,
      tilt: getRandomFloatInRange(confMap.get("minMoonTilt"), confMap.get("maxMoonTilt")),
      orbitTiltX: getRandomFloatInRange(confMap.get("minOrbitTiltX"), confMap.get("maxOrbitTiltX")),
      orbitTiltZ: getRandomFloatInRange(confMap.get("minOrbitTiltZ"), confMap.get("minOrbitTiltZ")),
      ellipticalOrbit: confMap.get("ellipticalOrbit"),
      ellipseX: getRandomFloatInRange(confMap.get("minEllipseX"), confMap.get("maxEllipseX")),
      ellipseZ: getRandomFloatInRange(confMap.get("minEllipseZ"), confMap.get("maxEllipseZ")),
      ellipseFocusDir: (Math.random() < 0.5 ? -1 : 1)
    });
  }
}

function draw() {
  requestAnimationFrame(draw);

  delta = clock.getDelta();

  controls.movementSpeed = 50.0 * camSpeed;
  controls.update( delta );

  core.update(core.mesh.getWorldPosition(new THREE.Vector3()), camController.current.camera.position);

  renderer.render(scene, camController.current.camera);
}

function onMouseDown (event) {
  MouseDown = true;
}

function onMouseUp (event) {
  MouseDown = false;
}

function onMouseWheelMove (event) {
  if(event.deltaY < 0)
    camSpeed++;

  else if(camSpeed > 1)
    camSpeed--;
}
