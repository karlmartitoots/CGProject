var renderer, scene, cam;
var bodies = [];
var orbits = [];
var clock = new THREE.Clock();
var delta = clock.getDelta();
var dt;
var camSpeed = 1;
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);
document.addEventListener('wheel', onMouseWheelMove, false);

var direction = new THREE.Vector3(0, 0, 0);

var mouse = new THREE.Vector2();
var MouseDown = false;

function onLoad() {
  var canvasContainer = document.getElementById('myCanvasContainer');
  var width = 800;
  var height = 500;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  canvasContainer.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  cam = new Camera(width, height);
  scene.add(cam.camera);

  // Make a light ball
  var lgt = new Lighting(0.5, 3, 5, 4);
  scene.add(lgt.light);

  var orb = new Orbit(2.0);
  var orb2 = new Orbit(10.0);
  orbits.push(orb);
  orbits.push(orb2);

  var star = new CelestialBody({orbit : orb, rotationsPerUnit : 0.05, revolutionsPerUnit : 1.0});
  var planet = new CelestialBody({size : 3, orbit : orb2, rotationsPerUnit : 0.2, revolutionsPerUnit : 1.0});
  bodies.push(star);
  bodies.push(planet);

  var system = new System(bodies, orbits);
  scene.add(system.getObject3D());

  const color = 0xFFFFFF;
  const intensity = 0.5;
  const ambientlight = new THREE.AmbientLight(color, intensity);
  scene.add(ambientlight);

  draw();
}

var counter = 0;

function draw() {
  requestAnimationFrame(draw);

  delta = clock.getDelta();

  // Camera control
  cam.updatePosition(direction, delta);
  cam.updateDirection(mouse, delta);

  // Simple rotation and revolving of bodies
  bodies.forEach((item, index) => {
    // TODO: Rotate according to the speed, which is specified in Body class
    // TODO: Add a 'rotate' function to the body

    // revolve in polar coords
    var angle = setAngle(item.revSpeed, item.revUnit)
    item.mesh.position.x = item.orbit.radius * Math.cos(angle);
    item.mesh.position.z = item.orbit.radius * Math.sin(angle);

    // rotation
    item.mesh.rotation.set(0, setAngle(item.rotSpeed, item.rotUnit), 0);
  });

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
      camSpeed ++;
	  console.log(camSpeed);
      break;

    case 190: // . -- speed DOWN
      if(camSpeed > 1)camSpeed --;
	  console.log(camSpeed);
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
