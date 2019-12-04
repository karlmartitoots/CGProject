var controls;
var mouse = new THREE.Vector2();
var movementLock = true;
var camSpeed = 1;
var camman;

var onMouseWheelMove = event => {
  return;
  console.log(event.deltaY);
  console.log(camSpeed);

  camSpeed += -event.deltaY / 1000;

  // Clamp
  if(camSpeed < 0.2)
    camSpeed = 0.2;
}

var onKeyDown = event => {
  switch (event.key) {
    case "Escape":
      movementLock ^= true;
      break;

    case "u":
      camman.up();
      break;

    case "i":
      camman.down();
      break;

    case "o":
      camman.nextcam();
      break;

    default:
      break;
  }
}

function initializeControls(camManager) {
  camman = camManager;

  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("wheel", onMouseWheelMove, false);

}

function updateControls(delta) {
  if (movementLock) {
    camman.current.controls.movementSpeed = 50.0 * camSpeed;
    camman.update(delta);
  }
}
