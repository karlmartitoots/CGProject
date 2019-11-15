var renderer, scene, cam;
var bodies = [];
var orbits = [];
var clock = new THREE.Clock();
var delta = clock.getDelta();
var dt;
var camSpeed = 1;
var movementLock = true;
var confMap = new Conf();
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);
document.addEventListener('wheel', onMouseWheelMove, false);

var direction = new THREE.Vector3(0, 0, 0);

var mouse = new THREE.Vector2();
var MouseDown = false;

var core;
var camController;

function onLoad() {
  var canvasContainer = document.getElementById('myCanvasContainer');
  var width = 800;
  var height = 500;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;//
  renderer.shadowMap.type = THREE.BasicShadowMap;//PCFSoftShadowMap;//
  canvasContainer.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  setCustomConf();
  generateStarSystem();

  scene.add(core.root);

  const color = 0xFFFFFF;
  const intensity = 0.2;
  const ambientlight = new THREE.AmbientLight(color, intensity);
  scene.add(ambientlight);

  // Camera config
  camController = new CameraController(renderer, core, width, height);

  draw();
}

var counter = 0;

function setCustomConf() {
  var customConf = new Map();
  customConf.set("starSize", 20);
  customConf.set("planetMinSize", 1);
  customConf.set("planetMaxSize", 6);
  customConf.set("minRevolutionsPerUnit", 0.1);
  customConf.set("maxRevolutionsPerUnit", 1.0);
  customConf.set("minMoonAmount", 0);
  customConf.set("maxMoonAmount", 14);
  customConf.set("minMoonRevolutionsPerUnit", 0.0);
  customConf.set("maxMoonRevolutionsPerUnit", 0.0);
  customConf.set("minOrbitTiltX", - Math.PI / 20) // 9 degrees
  customConf.set("maxOrbitTiltX", Math.PI / 20) 
  customConf.set("minOrbitTiltZ", - Math.PI / 20) 
  customConf.set("maxOrbitTiltZ", Math.PI / 20) 
  confMap = new Conf(customConf).confMap;
}

function generateSimpleStarSystem(){
  var star = new CelestialBody({orbitRadius: 0.0, size: 4, rotationsPerUnit: 1, revolutionsPerUnit: 1.0, tilt:0.2, light: true});
  var planet = new CelestialBody({orbitRadius: 20.0, size: 2, rotationsPerUnit: 3, revolutionsPerUnit: 1.0, tilt:0.4});
  var moon = new CelestialBody({orbitRadius:4, size: 0.5, rotationsPerUnit:1, revolutionsPerUnit:4, tilt:0.1});
  star.add(planet);
  planet.add(moon);

  // Add all the created bodies to an array
  bodies.push(moon);
  bodies.push(planet);
  bodies.push(star);

  core = star;
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
      orbitTiltZ: getRandomFloatInRange(confMap.get("minOrbitTiltZ"), confMap.get("minOrbitTiltZ"))
    });
  }
}

function generateMoons(planet){
  var moonsLeft = getRandomIntInRange(confMap.get("minMoonAmount"), confMap.get("maxMoonAmount"));
  var moonRevPerUnit = getRandomFloatInRange(confMap.get("minMoonRevolutionsPerUnit"), confMap.get("maxMoonRevolutionsPerUnit"));
  var angles = range(0, moonsLeft).map(i => i * 2 * Math.PI / moonsLeft); // avoid collisions
  while(moonsLeft){
    var moonSize = getRandomFloatInRange(confMap.get("moonMinSize"), confMap.get("moonMaxSize"));
    var moon = new CelestialBody({
      startAngle: angles[moonsLeft - 1],
      orbitRadius: planet.size + moonSize + 3.0,
      size: moonSize,
      rotationsPerUnit: 1,
      revolutionsPerUnit: moonRevPerUnit, // keep this the same for every moon to avoid collisions
      tilt: getRandomFloatInRange(confMap.get("minMoonTilt"), confMap.get("maxMoonTilt"))
    });

    console.log("Moon created for planet.");
    bodies.push(moon);
    planet.add(moon);

    moonsLeft--;
  }
}

function draw() {
  requestAnimationFrame(draw);

  delta = clock.getDelta();

  // Camera control
  if (movementLock) {
    camController.update(direction, mouse);
  }

  // Simple rotation and revolving of bodies
  core.update();

  renderer.render(scene, camController.current.camera);
}

function onKeyDown(event) {

  var keyCode = event.which;

  switch (keyCode){
    case 65: // Left
      direction.x = -camSpeed;
      break;

    case 87: // W
      direction.z = -camSpeed;
      break;

    case 68: // Right
      direction.x = camSpeed;
      break;

    case 83: // S
      direction.z = camSpeed;
      break;

    case 81: // Q -- outside
      direction.y = camSpeed;
      break;

    case 69: // E -- inside
      direction.y = -camSpeed;
      break;

    case 37: // < -- left arrow key
      camController.translate(new THREE.Vector3(-15, 0, 0));
      break;

    case 39: // > -- right arrow key
      camController.translate(new THREE.Vector3(15, 0, 0));
      break;

    case 38: // ^ -- up arrow key
      camController.translate(new THREE.Vector3(0, 0, -15));
      break;

    case 40: // v -- down arrow key
      camController.translate(new THREE.Vector3(0, 0, 15));
      break;

    case 188: // , -- speed UP
      camSpeed++;
      console.log(camSpeed);
      break;

    case 190: // . -- speed DOWN
      if(camSpeed > 1) camSpeed--;
      console.log(camSpeed);
      break;

    case 27: // ESC -- lock/unlock movement
      movementLock ^= true;
      break;

    case 84: // t / -- teleport to topview
      var systemRadius = core.children.map(planet => planet.orbitRadius).reduce((a, b) => {
        return Math.max(a, b);
      });

      // A smigeon bigger
      systemRadius *= 1.05;

      camController.topview(systemRadius);

      break;
  }
}

function onKeyUp(event){

  var keyCode = event.which;

  switch (keyCode){
    case 65: // Left
      direction.x = 0;
      break;

    case 87: // W
      direction.z = 0;
      break;

    case 68: // Right
      direction.x = 0;
      break;

    case 83: // S
      direction.z = 0;
      break;

    case 81: // Q -- outside
      direction.y = 0;
      break;

    case 69: // E -- inside
      direction.y = 0;
      break;

    case 219: // [ -- body explorer up
      camController.up();
      break;

    case 221: // ] -- body explorer down
      camController.down();
      break;

    case 220: // \ -- body explorer next
      camController.nextcam();
      break;
  }
}



function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}

function onMouseDown (event) {
  MouseDown = true;
}

function onMouseUp (event) {
  MouseDown = false;
}

function onMouseWheelMove (event) {
  if(event.deltaY < 0) camSpeed ++;
  else if(camSpeed > 1)camSpeed --;
  console.log(camSpeed);
}
