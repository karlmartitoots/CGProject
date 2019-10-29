class System {
  constructor() {
    var sys = new THREE.Object3D();

    var star = new Body();
    sys.add(star.getBody());

    this.bodies = [];
    this.bodies.push(star);

    this.system = sys;
  }

  getObject3D() {
    return this.system;
  }

  getBodies() {
    return this.bodies;
  }
}
