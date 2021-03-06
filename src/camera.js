const camtype = {
  MAIN: 'Main camera',
  PLANET: 'Planet camera',
  ORTHO: 'Main Ortographic camera'
};

const controltype = {
  FLY: 'THREE.FlyControls',
  ORBIT: 'THREE.OrbitControls'
};

class Camera {
  constructor(width, height, type = camtype.MAIN, control = controltype.FLY, size = 10) {
    // Initialize variables
    this.width = sceneWidth;
    this.height = sceneHeight;

    //Setup the camera
    var camera;
    var controls;
    this._up = new THREE.Vector3(0, 1, 0);
    switch (type) {
      case camtype.ORTHO:
        camera = new THREE.OrthographicCamera(-width / 8, width / 8, height / 8, -height / 8, 0.001, 500000);
        break;

      case camtype.MAIN:
      case camtype.PLANET:
      default:
        camera = new THREE.PerspectiveCamera(80, width / height, 0.001, 500000);
        camera.up = this._up;
        break;
    }

    switch (control) {
      case controltype.ORBIT:
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = size * 2;
        controls.maxDistance = 300;
        controls.enabled = false;

        break;

      case controltype.FLY:
      default:
        controls = new THREE.FlyControls(camera, renderer.domElement);
        controls.movementSpeed = 100000;
        controls.domElement = renderer.domElement;
        controls.rollSpeed = Math.PI / 6;
        controls.autoForward = false;
        controls.dragToLook = false;

        break;
    }

    this._type = type;

    this.camera = camera;
    this.controls = controls;
  }

  update(delta) {
    this.controls.update(delta);
  }

  setMNode(node) {
    this.mnode = node;
  }
}
