class Camera {
  constructor(width, height) {
    // Initialize variables
    this.width = width;
    this.height = height;

    // Viewer position in world space
    var viewerPosition = new THREE.Vector3(0.0, 10.0, 4.0);

    //Setup the camera
    var camera = new THREE.PerspectiveCamera(80, width / height, 1, 1000);
    camera.position.set(viewerPosition.x, viewerPosition.y, viewerPosition.z);
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.camera = camera;

    // Position and target
    this.position = new THREE.Vector3(0, 0, 0);
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

  updatePosition(direction, delta) {
    this.velocity.multiplyScalar(this.drag);
    this.velocity.addScaledVector(direction, this.acc);

    // Get the normal vector to the movement plane
    var worldForward = this.camera.getWorldDirection(new THREE.Vector3());
    worldForward.normalize();

    // Calculate direction vector for all directions
    var dirX = new THREE.Vector3().copy(worldForward);
    dirX.cross(this.camera.up);
    dirX.normalize();

    var dirY = new THREE.Vector3().copy(worldForward);
    dirY.cross(dirX);
    dirY.normalize();

    var dirZ = new THREE.Vector3().copy(worldForward).multiplyScalar(-1);

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

    this.camera.position.set(this.position.x, this.position.y, this.position.z);
  }

  // Camera rotation
  updateDirection(mouse, delta) {
    this.mouseDelta.x = (mouse.x - this.mouseLast.x) * delta * 60;
    this.mouseDelta.y = (mouse.y - this.mouseLast.y) * delta * 60;

    this.mouseLast.copy(mouse);

    if (this.mouseDelta.x != 0 && this.mouseDelta.y != 0) {
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
