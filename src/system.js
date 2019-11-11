class System {
  constructor(celBodies, orbits) {
    this.celestialBodies = celBodies;
    this.orbits = orbits;

    var sys = new THREE.Object3D();
    this.celestialBodies.forEach(celBody => {
      sys.add(celBody.root)
    });

    this.orbits.forEach(o => {
      sys.add(o.lineloop)
    });

    this.system = sys;
  }

  getObject3D() {
    return this.system;
  }

  get celestialBodies() {
    return this._bodies;
  }

  set celestialBodies(newBodies) {
    this._bodies = newBodies;
  }

  get orbits() {
    return this._orbits;
  }

  set orbits(o) {
    this._orbits = o;
  }

}
