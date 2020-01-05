const defaults = {
  orbit : null,
  orbitRadius : 0,
  visibleOrbit: false,
  tilt : 0,
  rotationsPerUnit : 0,
  startAngle : 0,
  revolutionsPerUnit : 0,
  size : 3,
  density : 1.0,
  ellipticalOrbit : false,
  orbitTiltX : 0,
  orbitTiltZ : 0,
  ellipseX: 1,
  ellipseZ: 1,
  ellipseFocusDir: Math.random() < 0.5 ? -1 : 1, // 1 or -1
  planetType: "terra",
}

var counter = 0;

class CelestialBody {
  constructor(params) {
    // ID
    this.id = counter;
    ++counter;

    // Object
    this.size = params.size || defaults.size;
    this.density = params.density || defaults.density;
    this.mass = 4 * Math.PI * Math.pow(this.size, 3) * this.density;
    this.planetType = params.planetType ||defaults.planetType;

    this.clock = new THREE.Clock();
    this.delta = this.clock.getDelta();
    this.progression = true;

    // Hierarchy
    this._center = new THREE.Group();

    // Orbital tilt
    this.orbitTilt = new THREE.Object3D();
    this.orbitTilt.rotation.z = params.orbitTiltZ || defaults.orbitTiltZ;
    this.orbitTilt.rotation.x = params.orbitTiltX || defaults.orbitTiltX;
    this._center.add(this.orbitTilt);

    // Root of the body
    this._root = new THREE.Object3D();
    this.startAngle = params.startAngle || defaults.startAngle;
    this.orbitTilt.add(this._root);

    // Tilt node
    this.tiltNode = new THREE.Object3D();
    this.tiltNode.rotation.z = params.tilt || defaults.tilt;
    this._root.add(this.tiltNode);

    // Rotation node
    this.rotationNode = new THREE.Object3D();
    this.tiltNode.add(this.rotationNode);

    // Body temporal attributes
    this.rotSpeed = params.rotationsPerUnit / 10 || defaults.rotationsPerUnit;
    this.revSpeed = params.revolutionsPerUnit || defaults.revolutionsPerUnit;

    // Orbit
    this.orbit = new Orbit(
      params.orbitRadius * params.ellipseX,
      params.orbitRadius * params.ellipseZ,
      params.orbitYaw,
      this.revSpeed * 500,
      this.tiltNode.rotation.z
    );

    // Initial movement with 0 delta
    this.orbit.move(0, this._root);

    // Body children
    this.children = [];

    // Tilt line
    this.tiltline = createLine(new THREE.Vector3(0, 1.3 * this.size, 0), new THREE.Vector3(0, -1.3 * this.size, 0));
    this.tiltNode.add(this.tiltline);

    // Orbit line
    this.orbitLine = this.orbit.line;

    // Show orbit line if configured
    if (params.visibleOrbit || defaults.visibleOrbit)
      this.orbitTilt.add(this.orbitLine);

    // Attached camera, set to zero for now
    // TODO: Make width and height configurable somehow
    this.cam = new Camera(sceneWidth, sceneHeight, camtype.PLANET, controltype.ORBIT, this.size);
    this.tiltNode.add(this.cam.camera);

    // Scale the camera
    //this.cam.camera.scale.multiplyScalar(this.size / 20.0);

    // For debugging only
    this.helpIndex = 0;

    this.worldPosition = new THREE.Vector3();
  }

  _move(delta) {
    this.orbit.move(delta, this._root);
  }

  _rotate(delta) {
    // rotation
    this.rotationNode.rotation.y -= this.rotSpeed * delta;
  }

  update(lightSource, cameraPosition, system) {
    // TODO: Add distance check. If too far, don't update
    this.delta = this.clock.getDelta();

    if (this.progression) {
      this._move(delta);
      this._rotate(delta);

      // World position of the object
      this.worldPosition = this.mesh.getWorldPosition(this.worldPosition);

      // Update world position texture
      system.update(this.id, this.worldPosition, this.size);
    }

    // Update uniforms
    if (typeof this.mesh.material != 'undefined') {
      this.mesh.material.uniforms.viewPosition.value = cameraPosition;
      this.mesh.material.uniforms.obliquity.value = this.orbit.axialtilt;
    }

    // Update recursively
    this.children.forEach((item, index) => {
      item.update(lightSource, cameraPosition, system);
    });
  }

  add(child) {
    this._root.add(child.root);
    this.children.push(child);
  }

  get root() {
    return this._center;
  }

  reset() {
    counter = 0;
  }

  toggleLines() {
    this.tiltline.visible = !this.tiltline.visible;
    this.orbit.toggle();

    // Toggle recursively
    this.children.forEach((item) => {
      item.toggleLines();
    });
  }

  pause() {
    this.progression = !this.progression;

    // Pause recursively
    this.children.forEach((item) => {
      item.pause();
    });
  }
}
