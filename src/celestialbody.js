const defaults = {
  orbit : null,
  rotationsPerUnit : 0,
  rotateUnit : 'second',
  revolutionsPerUnit : 0,
  revolveUnit : 'minute',
  size : 3
}

class CelestialBody {
  constructor(params) {
    // Object
    this._size = params.size || defaults.size;
    this._mesh = createSphere(0xccccee, this._size, params.light);
    this._clock = new THREE.Clock();
    this._delta = this._clock.getDelta();

    // Hierarchy
    this._center = new THREE.Group();

    // Root of the body
    this._root = new THREE.Object3D();
    this._center.add(this._root);

    // Tilt node
    this._tilt = new THREE.Object3D();
    this._tilt.rotation.z = params.tilt;
    this._root.add(this._tilt);

    // Rotation node
    this._rotation = new THREE.Object3D();
    this._rotation.add(this._mesh);
    this._tilt.add(this._rotation);

    // Orbit
    this._radius = params.radius;
    this._orbit = new Orbit(this._radius);

    // Body temporal attributes
    this._rotSpeed = params.rotationsPerUnit || defaults.rotationsPerUnit;
    this._rotUnit = params.rotateUnit || defaults.rotateUnit;
    this._revSpeed = params.revolutionsPerUnit || defaults.revolutionsPerUnit;
    this._revUnit = params.revolveUnit || defaults.revolveUnit;

    // Body children
    this._children = [];

    // Tilt line
    this._tiltline = createLine(new THREE.Vector3(0, 1.3 * this._size, 0), new THREE.Vector3(0, -1.3 * this._size, 0));
    this._tilt.add(this._tiltline);

    // Orbit line
    this._orbitline = this._orbit.lineloop;
    this._center.add(this._orbitline);
  }

  _move(delta) {

    // revolve in polar coords
    var angle = setAngle(this._revSpeed, this._revUnit)
    this._root.position.x = this._radius * Math.cos(angle);
    this._root.position.z = this._radius * Math.sin(angle);
  }

  _rotate(delta) {
    // rotation
    this._rotation.rotation.y -= this._rotSpeed * delta;
  }

  update() {
    // TODO: Add distance check. If too far, don't update
    this._delta = this._clock.getDelta();
    this._move(delta);
    this._rotate(delta);

    // Update recursively
    this._children.forEach((item, index) => {
      item.update();
    });
  }

  add(child) {
    this._root.add(child.root);
    this._children.push(child);
  }

  get mesh() {
    return this._mesh;
  }

  set mesh(newMesh) {
    this._mesh = newMesh;
  }

  get children() {
    return this._children;
  }

  set children(newChildren) {
    this._children = newChildren;
  }

  get orbit() {
    return this._orbit;
  }

  set orbit(newOrbit) {
    this._orbit = newOrbit;
  }

  get revSpeed() {
    return this._revSpeed
  }

  get rotSpeed() {
    return this._rotSpeed
  }

  set rotSpeed(newSpeed) {
    this._rotSpeed = newSpeed
  }

  set revSpeed(newSpeed) {
    this._revSpeed = newSpeed
  }

  get rotUnit() {
    return this._rotUnit
  }

  set rotUnit(u) {
    this._rotUnit = u
  }

  get revUnit() {
    return this._revUnit
  }

  set revUnit(u) {
    this._revUnit = u
  }

  get root() {
    return this._center;
  }

}
