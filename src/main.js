var renderer, scene, cam;
var bodies = [];
var orbits = [];
var clock = new THREE.Clock();
var delta = clock.getDelta();
var dt;
var camSpeed = 1;
var movementLock = true;
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

  cam = new Camera(width, height);
  scene.add(cam.camera);

  // Make a light ball
  //var lgt = new Lighting(0.5, 3, 5, 4);
  //scene.add(lgt.light);
  /*var helper = new THREE.CameraHelper( lgt.light.shadow.camera );
  scene.add( helper );*/

  var conf = new Conf();
  var star = new CelestialBody({radius: 0.0, size: 4, rotationsPerUnit: 1, revolutionsPerUnit: 1.0, tilt:0.2, light: true});
  var planet = new CelestialBody({radius: 10.0, size: 2, rotationsPerUnit: 3, revolutionsPerUnit: 1.0, tilt:0.4});
  var moon = new CelestialBody({radius:4, size: 0.5, rotationsPerUnit:1, revolutionsPerUnit:4, tilt:0.1});
  star.add(planet);
  planet.add(moon);

  // Add all the created bodies to an array
  bodies.push(moon);
  bodies.push(planet);
  bodies.push(star);

  core = star;

  scene.add(core.root);

  const color = 0xFFFFFF;
  const intensity = 0.2;
  const ambientlight = new THREE.AmbientLight(color, intensity);
  scene.add(ambientlight);

  draw();
}

var counter = 0;

function draw() {
  requestAnimationFrame(draw);

  delta = clock.getDelta();

  // Camera control
  if (movementLock) {
    cam.updatePosition(direction, delta);
    cam.updateDirection(mouse, delta);
  }

  // Simple rotation and revolving of bodies
  core.update();

  renderer.render(scene, cam.camera);
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
      cam.position.x -= 15;
      break;

    case 39: // > -- right arrow key
      cam.position.x += 15;
      break;

    case 38: // ^ -- up arrow key
      cam.position.z -= 15;
      break;

    case 40: // v -- down arrow key
      cam.position.z += 15;
      break;

    case 188: // , -- speed UP
      camSpeed++;
      console.log(camSpeed);
      break;

    case 190: // . -- speed DOWN
      if(camSpeed > 1) camSpeed--;
      console.log(camSpeed);
      break;

    case 27: // / -- lock/unlock movement
      movementLock ^= true;
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
