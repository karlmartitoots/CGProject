class Orbit {
    constructor(radius) {
        var segments = 64;
        var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        var geometry = new THREE.CircleGeometry( radius, segments );
        geometry.vertices.shift(); // this removes the center vertix

        this.radius = radius;
        this.lineloop = new THREE.LineLoop( geometry, material );
        this.lineloop.rotation.x = Math.PI / 2;
    }

    get radius() {
      return this._radius;
    }

    set radius(r) {
        this._radius = r;
    }

    get lineloop() {
      return this._lineloop
    }

    set lineloop(l) {
      this._lineloop = l;
    }
  }

