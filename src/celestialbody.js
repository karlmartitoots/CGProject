const defaults = {
  orbit : null,
  orbitRadius : 0,
  tilt : 0,
  rotationsPerUnit : 0,
  startAngle : 0,
  revolutionsPerUnit : 0,
  size : 3,
  ellipticalOrbit : false,
  orbitTiltX : 0,
  orbitTiltZ : 0,
  ellipseX: 1,
  ellipseZ: 1,
  ellipseFocusDir: Math.random() < 0.5 ? -1 : 1 // 1 or -1
}

var counter = 0;

class CelestialBody {
  constructor(params) {
    // ID
    this.id = counter;
    ++counter;

    // Object
    this.size = params.size || defaults.size;
    this.mesh = createSphere(0xccccee, this.size, params.light, Math.random(), this.id);
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

    // Body temporal attributes
    this.rotSpeed = params.rotationsPerUnit / 10 || defaults.rotationsPerUnit;
    this.revSpeed = params.revolutionsPerUnit || defaults.revolutionsPerUnit;

    // Orbit
    this.orbit = new Orbit(params.orbitRadius * params.ellipseX, params.orbitRadius * params.ellipseZ, params.orbitYaw, this.revSpeed * 500);

    // Initial movement with 0 delta
    this.orbit.move(0, this._root);

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
    this.cam = new Camera(800, 500, camtype.PLANET, controltype.ORBIT);
    this.rotationNode.add(this.cam.camera);

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
    this._move(delta);
    this._rotate(delta);

    // World position of the object
    this.worldPosition = this.mesh.getWorldPosition(this.worldPosition);

    // Update world position texture
    system.update(this.id, this.worldPosition, this.size);

    // Update uniforms
    if (typeof this.mesh.material != 'undefined') {
      // Get the vector from light source to current celestial body
      var localSrc = new THREE.Vector3().copy(lightSource).sub(this.worldPosition);

      // Convert the vector from world-space to object-space
      this.mesh.worldToLocal(localSrc);

      // Cancle the rotation
      localSrc.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationNode.rotation.y)

      this.mesh.material.uniforms.lightPosition.value = localSrc;
      this.mesh.material.uniforms.viewPosition.value = cameraPosition;
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
}
