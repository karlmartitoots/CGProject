const camtype = {
  MAIN: 'Main camera',
  PLANET: 'Planet camera',
  ORTHO: 'Main Ortographic camera'
};

class Camera {
  constructor(width, height, type = camtype.MAIN) {
    // Initialize variables
    this.width = width;
    this.height = height;

    // Viewer position in world space
    var viewerPosition = new THREE.Vector3(0.0, 30.0, 0.0);

    //Setup the camera
    var camera;
    this._up = new THREE.Vector3(0, 1, 0);
    switch (type) {
      case camtype.ORTHO:
        camera = new THREE.OrthographicCamera(-width / 8, width / 8, height / 8, -height / 8, 1, 1000);
        break;

      case camtype.MAIN:
      case camtype.PLANET:
      default:
        camera = new THREE.PerspectiveCamera(80, width / height, 1, 1000);
        camera.up = this._up;
        break;
    }

    this._type = type;

    camera.position.set(viewerPosition.x, viewerPosition.y, viewerPosition.z);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.camera = camera;

    // Position and target
    this.position = new THREE.Vector3().copy(viewerPosition);
    this.target = new THREE.Vector3(0, 0, 0);

    // Helper variables
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.mouseLast = new THREE.Vector2(0, 0, 0);
    this.mouseDelta = new THREE.Vector2(0, 0, 0);
    this.longitude = 0;
    this.latitude = 0;

    // TODO: Make configurable
    this.acc = 5;
    this.drag = 0.90;
  }

  update() {
    this.camera.position.set(this.position.x, this.position.y, this.position.z);
  }

  setMNode(node) {
    this.mnode = node;
  }

  updatePosition(direction, delta) {
    this.velocity.multiplyScalar(this.drag);
    this.velocity.addScaledVector(direction, this.acc);

    // Get the normal vector to the movement plane
    var worldForward = this.camera.getWorldDirection(new THREE.Vector3());
    worldForward.normalize();


    // We want to orbit the planet
    if (this._type == camtype.PLANET) {
      // Rotate the node
    }

    else {
      var dirX, dirY, dirZ;

      // Calculate direction vector for all directions
      dirX = new THREE.Vector3().copy(worldForward);
      dirX.cross(this._up);

      dirY = new THREE.Vector3().copy(worldForward);
      dirY.cross(dirX);

      dirZ = new THREE.Vector3().copy(worldForward).multiplyScalar(-1);

      // Normalize the direction vectors
      dirX.normalize();
      dirY.normalize();
      dirZ.normalize();

      // If moving on X axis
      if (this.velocity.x != 0) {
        this.position.addScaledVector(dirX, this.velocity.x * delta);
      }

      // If moving on Y axis
      if (this.velocity.y != 0) {
        this.position.addScaledVector(dirY, this.velocity.y * delta);
      }

      // If moving on Z axis
      if (this.velocity.z != 0) {
        this.position.addScaledVector(dirZ, this.velocity.z * delta);
      }

      this.update();
    }

  }

  // Camera rotation
  updateDirection(mouse, delta) {
    this.mouseDelta.x = (mouse.x - this.mouseLast.x) * delta * 60;
    this.mouseDelta.y = (mouse.y - this.mouseLast.y) * delta * 60;

    this.mouseLast.copy(mouse);

    if (this.mouseDelta.x != 0 && this.mouseDelta.y != 0) {
      // Planet camera
      if (this._type == camtype.PLANET) {
        // Get the normal vector to the movement plane
        var worldForward = this.camera.getWorldDirection(new THREE.Vector3());
        worldForward.normalize();

        // Get the vector from center to current position
        var fromCore = new THREE.Vector3().copy(this.position).normalize();

        // Correct the direction
        var dirZ = new THREE.Vector3().copy(worldForward);
        dirZ.cross(fromCore).normalize().cross(fromCore);
        dirZ.normalize();

        this.target.copy(this.camera.position).add(dirZ);
        this.camera.lookAt(this.target);
      }

      // Regular camera
      else {
        this.longitude += this.mouseDelta.x;
        this.latitude += this.mouseDelta.y;

        var phi = (90 - this.latitude) * Math.PI / 180;
        var theta = this.longitude * Math.PI / 180;

        this.target.x = this.camera.position.x + 100 * Math.sin(phi) * Math.cos(theta);
        this.target.y = this.camera.position.y + 100 * Math.cos(phi);
        this.target.z = this.camera.position.z + 100 * Math.sin(phi) * Math.sin(theta);


        this.camera.lookAt(this.target);
      }
    }
  }
}
