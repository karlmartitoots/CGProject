const defaults = {
  orbit : null,
  orbitRadius : 0,
  tilt : 0,
  rotationsPerUnit : 0,
  rotateUnit : 'second',
  startAngle : 0,
  revolutionsPerUnit : 0,
  revolveUnit : 'minute',
  size : 3,
  ellipticalOrbit : false,
  orbitTiltX : 0,
  orbitTiltZ : 0,
  ellipseX: 1,
  ellipseZ: 1,
  ellipseFocusDir: Math.random() < 0.5 ? -1 : 1 // 1 or -1
  //ellipseRotate: 0
}

class CelestialBody {
  constructor(params) {
    // Object
    this.size = params.size || defaults.size;
    this.mesh = createSphere(0xccccee, this.size, params.light, Math.random());
    this.clock = new THREE.Clock();
    this.delta = this.clock.getDelta();

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
    this.rotationNode.add(this.mesh);
    this.tiltNode.add(this.rotationNode);

    // Orbit
    this.orbitRadius = params.orbitRadius || defaults.orbitRadius;
    this.ellipticalOrbit = params.ellipticalOrbit || defaults.ellipticalOrbit;
    this.ellipseX = this.ellipticalOrbit ? (params.ellipseX || defaults.ellipseX) : 1.0;
    this.ellipseZ = this.ellipticalOrbit ? (params.ellipseZ || defaults.ellipseZ) : 1.0;
    this.ellipseFocusDir = params.ellipseFocusDir || defaults.ellipseFocusDir;
    if (this.ellipseX > this.ellipseZ) {
      this.ellipseShiftX = this.ellipseFocusDir * Math.sqrt(Math.pow(this.ellipseX * this.orbitRadius, 2) -
                           Math.pow(this.ellipseZ * this.orbitRadius, 2));
      this.ellipseShiftZ = 0;
    }

    else {
      this.ellipseShiftZ = this.ellipseFocusDir * Math.sqrt(Math.pow(this.ellipseZ * this.orbitRadius, 2) -
                           Math.pow(this.ellipseX * this.orbitRadius, 2));
      this.ellipseShiftX = 0;
    }

    //this.ellipseRotate = this.ellipticalOrbit ? (params.ellipseRotate || defaults.ellipseRotate) : 0.0;
    this.orbit = this.ellipticalOrbit ? new EllipseOrbit(this.orbitRadius, this.ellipseX, this.ellipseZ, this.ellipseFocusDir) : new Orbit(this.orbitRadius);

    this.orbitAngle = 0;

    // Initial Position
    this._root.position.x = (this.ellipticalOrbit ? this.ellipseX : 1) * this.orbitRadius * Math.cos(this.orbitAngle);
    this._root.position.z = (this.ellipticalOrbit ? this.ellipseZ : 1) * this.orbitRadius * Math.sin(this.orbitAngle);

    this._root.position.x += this.ellipseShiftX;
    this._root.position.z += this.ellipseShiftZ;

    // Body temporal attributes
    this.rotSpeed = params.rotationsPerUnit / 10 || defaults.rotationsPerUnit;
    this.rotUnit = 'second'; //params.rotateUnit || defaults.rotateUnit;
    this.revSpeed = params.revolutionsPerUnit * 5 || defaults.revolutionsPerUnit;
    this.revUnit = 'second'; //params.revolveUnit || defaults.revolveUnit;

    // Body children
    this.children = [];

    // Tilt line
    this.tiltline = createLine(new THREE.Vector3(0, 1.3 * this.size, 0), new THREE.Vector3(0, -1.3 * this.size, 0));
    this.tiltNode.add(this.tiltline);

    // Orbit line
    this.orbitLine = this.orbit.line;
    this.orbitTilt.add(this.orbitLine);

    // Attached camera, set to zero for now
    // TODO: Make width and height configurable somehow
    this.cam = new Camera(800, 500, camtype.MAIN);
    this.rotationNode.add(this.cam.camera);

    this.helpIndex = 0;
  }

  _move(delta) {
    // Get distance from focus
    var radius = Math.sqrt(
      Math.pow(this._root.position.x + this.ellipseShiftX, 2) +
      Math.pow(this._root.position.z + this.ellipseShiftZ, 2)
    );

    // Get the orbital period (in seconds)
    // Use Keplers third law
    var biggest = this.ellipseX > this.ellipseZ ? this.ellipseX : this.ellipseZ;
    var T = Math.sqrt(Math.pow(biggest, 3)) * 100;// * 0.000007496;

    // Get the mean velocity
    var n = 2 * Math.PI / T;

    // Get the dphi/dt
    var angularVelocity = n * this.ellipseX * this.ellipseZ / Math.pow(radius, 2);

    // revolve in polar coords
    if (isFinite(angularVelocity)) {
      this.orbitAngle += angularVelocity * delta * 100 * this.revSpeed;
      this.orbitAngle %= Math.PI * 2;

      this._root.position.x = (this.ellipticalOrbit ? this.ellipseX : 1) * this.orbitRadius * Math.cos(this.orbitAngle);
      this._root.position.z = (this.ellipticalOrbit ? this.ellipseZ : 1) * this.orbitRadius * Math.sin(this.orbitAngle);

      this._root.position.x += this.ellipseShiftX;
      this._root.position.z += this.ellipseShiftZ;
    }
  }

  _rotate(delta) {
    // rotation
    this.rotationNode.rotation.y -= this.rotSpeed * delta;
  }

  update(lightSource, cameraPosition) {
    // TODO: Add distance check. If too far, don't update
    this.delta = this.clock.getDelta();
    this._move(delta);
    this._rotate(delta);
    if (typeof this.mesh.material != 'undefined') {
      var localSrc = new THREE.Vector3().copy(lightSource).sub(this._root.getWorldPosition(new THREE.Vector3()));

      this.mesh.worldToLocal(localSrc);

      // Cancle the rotation
      localSrc.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationNode.rotation.y)

      this.mesh.material.uniforms.lightPosition.value = localSrc;
      this.mesh.material.uniforms.viewPosition.value = cameraPosition;
    }

    // Update recursively
    this.children.forEach((item, index) => {
      item.update(lightSource, cameraPosition);
    });
  }

  add(child) {
    this._root.add(child.root);
    this.children.push(child);
  }

  get root() {
    return this._center;
  }
}
