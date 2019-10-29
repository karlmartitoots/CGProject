class Camera {
  constructor(width, height) {
    // Initialize variables
    this.width = width;
    this.height = height;

    // Viewer position in world space
    var viewerPosition = new THREE.Vector3(0.0, 10.0, 4.0);

    //Setup the camera
    camera = new THREE.PerspectiveCamera(80, width / height, 1, 1000);
    camera.position.set(viewerPosition.x, viewerPosition.y, viewerPosition.z);
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.camera = camera;
  }

  getCamera() {
    return this.camera;
  }
}
