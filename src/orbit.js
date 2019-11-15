class Orbit {
    constructor(radius) {
        var segments = 64;
        var material = new THREE.LineBasicMaterial({color: 0x0000ff});
        var geometry = new THREE.CircleGeometry(radius, segments);
        geometry.vertices.shift(); // this removes the center vertix

        this.radius = radius;
        this.line = new THREE.LineLoop(geometry, material);
        this.line.rotation.x = Math.PI / 2;
    }

    get radius() {
      return this._radius;
    }

    set radius(r) {
        this._radius = r;
    }

    get lineloop() {
      if (this._radius == 0)
        return new THREE.Object3D();

      return this._line
    }

    set lineloop(l) {
      this._line = l;
    }
  }

