var renderer, scene, camera;
var bodies = [];
var orbits = [];
var clock = new THREE.Clock();
var delta = clock.getDelta();
var dt;
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);

var longitude = 0;
var latitude = 0;

var lastTime;
var acc = 5, drag = 0.90;
var position = new THREE.Vector3(0, 0, 0);
var velocity = new THREE.Vector3(0, 0, 0);
var direction = new THREE.Vector3(0, 0, 0);

//
var cameraCenter = new THREE.Vector3(0, 0, 0);
var cameraHorzLimit = 50;
var cameraVertLimit = 50;
var cameraTarget = new THREE.Vector3();
var mouse = new THREE.Vector2();
var mouseLast = new THREE.Vector2();
var MouseDown = false;

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

  // Make a sphere + pointlight
  var sphere = new THREE.SphereBufferGeometry(0.5, 16, 8);
  var light = new THREE.PointLight(0xff0040, 2, 50);//"rgb(50%, 0%, 0%)"
  light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial({ color: 0xff0040 })));
  light.position.set(3, 5, 4);
  scene.add(light);

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

  draw();
}

var counter = 0;

function draw() {
  requestAnimationFrame(draw);

  // Camera Movement
  velocity.multiplyScalar(drag);
  velocity.addScaledVector(direction, acc);

  delta = clock.getDelta();

  // Camera position
  // Get the normal vector to the movement plane
  // TODO: Move the camera controls into camera class
  var cameraDirection = new THREE.Vector3();
  cameraDirection = camera.getWorldDirection(cameraDirection);
  cameraDirection.normalize();

  // Calculate direction vector for all directions
  var dirX = new THREE.Vector3().copy(cameraDirection);
  // TODO: (0, 1, 0) is the up-vector of the camera
  dirX.cross(new THREE.Vector3(0, 1, 0));
  dirX.normalize();

  var dirY = new THREE.Vector3().copy(cameraDirection);
  dirY.cross(dirX);
  dirY.normalize();

  var dirZ = new THREE.Vector3().copy(cameraDirection).multiplyScalar(-1);

  // Apply the velocity to it to get the real position
  var cameraPosition = new THREE.Vector3().copy(camera.position);

  // If moving on X axis
  if (velocity.x != 0) {
    cameraPosition.addScaledVector(dirX, velocity.x * delta);
  }

  // If moving on Y axis
  if (velocity.y != 0) {
    cameraPosition.addScaledVector(dirY, velocity.y * delta);
  }

  // If moving on Z axis
  if (velocity.z != 0) {
    cameraPosition.addScaledVector(dirZ, velocity.z * delta);
  }

  // position.addScaledVector(velocity, delta);
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

  // Camera rotation
  var mouseDelta = new THREE.Vector2();
  mouseDelta.x = (mouse.x - mouseLast.x) * delta * 60;
  mouseDelta.y = (mouse.y - mouseLast.y) * delta * 60;

  mouseLast.copy(mouse);

  if (mouseDelta.x != 0 && mouseDelta.y != 0) {
    longitude += mouseDelta.x;
    latitude += mouseDelta.y;

    var phi = (90 - latitude) * Math.PI / 180;
    var theta = longitude * Math.PI / 180;

    cameraTarget.x = camera.position.x + 100 * Math.sin(phi) * Math.cos(theta);
    cameraTarget.y = camera.position.y + 100 * Math.cos(phi);
    cameraTarget.z = camera.position.z + 100 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(cameraTarget);
  }

  // Get time
  var millis = Date.now();

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

  renderer.render(scene, camera);
}

function onKeyDown(event) {

  var keyCode = event.which;

  switch (keyCode){
    case 65: // Left
      direction.x = -1.0;
      break;

    case 87: // W
      direction.z = -1.0;
      break;

    case 68: // Right
      direction.x = 1.0;
      break;

    case 83: // S
      direction.z = 1.0;
      break;

    case 81: // Q -- outside
      direction.y = 1.0;
      break;

    case 69: // E -- inside
      direction.y = -1.0;
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

  // if(MouseDown)
  //   camera.lookAt(cameraCenter.x + (cameraHorzLimit * mouse.x), cameraCenter.y + (cameraVertLimit * mouse.y), cameraCenter.z);

  // if(!document.pointerLockElement) return;

  // event.preventDefault();
  //
  // mouse.x += e.originalEvent.movementX       ||
  //                 e.originalEvent.mozMovementX    ||
  //                 e.originalEvent.webkitMovementX ||
  //                 0;
  // mouse.y += e.originalEvent.movementY       ||
  //                 e.originalEvent.mozMovementY    ||
  //                 e.originalEvent.webkitMovementY ||
  //                 0;
}

function onMouseDown (event) {
  MouseDown = true;
}

function onMouseUp (event) {
  MouseDown = false;
}
