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
  //ellipseRotate: 0
}

class CelestialBody {
  constructor(params) {
    // Object
    this.size = params.size || defaults.size;
    this.mesh = createSphere(0xccccee, this.size, params.light);
    this.clock = new THREE.Clock();
    this.delta = this.clock.getDelta();

    // Hierarchy
    this._center = new THREE.Group();

    // Orbital tilt
    // TODO
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
    //this.ellipseRotate = this.ellipticalOrbit ? (params.ellipseRotate || defaults.ellipseRotate) : 0.0;
    this.orbit = this.ellipticalOrbit ? new EllipseOrbit(this.orbitRadius, this.ellipseX, this.ellipseZ) : new Orbit(this.orbitRadius);

    // Body temporal attributes
    this.rotSpeed = params.rotationsPerUnit || defaults.rotationsPerUnit;
    this.rotUnit = params.rotateUnit || defaults.rotateUnit;
    this.revSpeed = params.revolutionsPerUnit || defaults.revolutionsPerUnit;
    this.revUnit = params.revolveUnit || defaults.revolveUnit;

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
    this.cam = new Camera(800, 500);
    this.rotationNode.add(this.cam.camera);
  }

  _move(delta) {
    // revolve in polar coords
    var angle = this.startAngle + setAngle(this.revSpeed, this.revUnit);
    this._root.position.x = this.ellipticalOrbit ? this.ellipseX * this.orbitRadius * Math.cos(angle) : this.orbitRadius * Math.cos(angle);
    this._root.position.z = this.ellipticalOrbit ? this.ellipseZ * this.orbitRadius * Math.sin(angle) : this.orbitRadius * Math.sin(angle);
  }

  _rotate(delta) {
    // rotation
    this.rotationNode.rotation.y -= this.rotSpeed * delta;
  }

  update() {
    // TODO: Add distance check. If too far, don't update
    this.delta = this.clock.getDelta();
    this._move(delta);
    this._rotate(delta);

    // Update recursively
    this.children.forEach((item, index) => {
      item.update();
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
