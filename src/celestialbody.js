const defaults = {
  celBodies : [], 
  orbit : null,
  rotationsPerUnit : 0, 
  rotateUnit : 'second', 
  revolutionsPerUnit : 0, 
  revolveUnit : 'minute',
  size : 3
}

class CelestialBody {
  constructor(params) {
    this.orbit = params.orbit || defaults.orbit;
    this.children = params.celBodies || defaults.celBodies;
    this.mesh = createSphere(0xccccee);
    this.size = params.size || defaults.size;
    this.mesh.scale.set(this.size, this.size, this.size);
    this.mesh.position.y = -this.size;
    this.rotSpeed = params.rotationsPerUnit || defaults.rotationsPerUnit;
    this.rotUnit = params.rotateUnit || defaults.rotateUnit;
    this.revSpeed = params.revolutionsPerUnit || defaults.revolutionsPerUnit;
    this.revUnit = params.revolveUnit || defaults.revolveUnit;
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
  
}
