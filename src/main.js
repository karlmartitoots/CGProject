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

var planet;
var star;
var lgt;

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
  lgt = new Lighting(0.5, 6, -2, -15);
  scene.add(lgt.light);
  //var lgt2 = new Lighting(0.5, -10, 5, 0);
  //scene.add(lgt2.light);

  var orb = new Orbit(2.0);
  var orb2 = new Orbit(10.0);
  orbits.push(orb);
  orbits.push(orb2);

  star = new CelestialBody({orbit : orb, rotationsPerUnit : 0.05, revolutionsPerUnit : 1.0});
  planet = new CelestialBody({size : 3, orbit : orb2, rotationsPerUnit : 0.2, revolutionsPerUnit : 1.0});
  bodies.push(star);
  bodies.push(planet);

  var system = new System(bodies, orbits);
  scene.add(system.getObject3D());

  const color = 0xFFFFFF;
  const intensity = 0.3;
  const ambientlight = new THREE.AmbientLight(color, intensity);
  scene.add(ambientlight);

  draw();
}

var counter = 0;
var lock = false;
var spherePos = new THREE.Vector3();

function draw() {
  requestAnimationFrame(draw);

  delta = clock.getDelta();

  // Camera control
  if (!lock) {
    cam.updatePosition(direction, delta);
    cam.updateDirection(mouse, delta);
  }

  var angle;
  // Update planet
  angle = setAngle(planet.revSpeed * 10, planet.revUnit);
  planet.mesh.position.x = planet.orbit.radius * Math.cos(angle);
  planet.mesh.position.z = planet.orbit.radius * Math.sin(angle);

  // Update star
  angle = setAngle(star.revSpeed, star.revUnit);
  star.mesh.position.x = star.orbit.radius * Math.cos(angle);
  star.mesh.position.z = star.orbit.radius * Math.sin(angle);

  // Update the position of camera and position of shadow-caster
  planet.mesh.getWorldPosition(spherePos);
  star.mesh.material.uniforms._SpherePosition.value = spherePos;
  star.mesh.material.uniforms._WorldSpaceCameraPos.value = cam.camera.position;
  star.mesh.material.uniforms._WorldSpaceLightPos0.value = lgt.light.position;

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

    case 27:
      lock ^= true;
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
