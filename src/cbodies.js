class TerraPlanet extends CelestialBody {
  constructor(confMap, orbitRadius) {
    super({
      orbitRadius: orbitRadius,
      startAngle: 2 * Math.PI * Math.random(),
      size: Math.max(confMap.get("minPlanetSize"), getGaussianNoise(confMap.get("starSizeMean") / confMap.get("starPlanetSizeRatio"), confMap.get("planetSizeVariance"))),
      density: 4.0,
      rotationsPerUnit: 3,
      revolutionsPerUnit: getRandomFloatInRange(confMap.get("minRevPerUnit"), confMap.get("maxRevPerUnit")),
      tilt: getRandomFloatInRange(confMap.get("minTilt"), confMap.get("maxTilt")),
      orbitTiltX: getRandomFloatInRange(confMap.get("minOrbitTiltX"), confMap.get("maxOrbitTiltX")),
      orbitTiltZ: getRandomFloatInRange(confMap.get("minOrbitTiltZ"), confMap.get("minOrbitTiltZ")),
      ellipseX: getGaussianNoise(1, orbitRadius / 50000), // mean 1, variance 0.01
      ellipseZ: getGaussianNoise(1, orbitRadius / 50000),
      orbitYaw: Math.random(),
      visibleOrbit: confMap.get("visibleOrbit")
    });

    // Temperate
    var color1 = new THREE.Color(0x197b30);
    var color2 = new THREE.Color(0x005826);
    var color3 = new THREE.Color(0xFFFFFF);

    // Hot
    var color4 = new THREE.Color(0xEFDEC2);
    var color5 = new THREE.Color(0xDAC27C);
    var color6 = new THREE.Color(0xA8651E);

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        viewPosition: {
          value: new THREE.Vector3(0, 0, 0)
        },

        locs: {
          value: null
        },

        bodycount: {
          value: 0
        },

        size: {
          value: this.size
        },

        seed: {
          value: Math.random()
        },

        id: {
          value: this.id
        },

        colorAtm: {
          value: new THREE.Color(0x66d5ed)
        },

        colorWater: {
          value: new THREE.Color(0x00aeef)
        },

        colorDeepWater: {
          value: new THREE.Color(0x383c80)
        },

        color: {
          value: [color1, color2, color3, color4, color5, color6]
        },

        obliquity: {
          value: 0
        }
      },

      fragmentShader: terraPlanetFrag,
      vertexShader: terraPlanetVert
    });

    this.mesh = createCBody(this.size, false, this.shaderMaterial);
    this.rotationNode.add(this.mesh);
  }
}

class DryPlanet extends CelestialBody {
  constructor(confMap, orbitRadius) {
    super({
      orbitRadius: orbitRadius,
      startAngle: 2 * Math.PI * Math.random(),
      size: Math.max(confMap.get("minPlanetSize"), getGaussianNoise(confMap.get("starSizeMean") / confMap.get("starPlanetSizeRatio"), confMap.get("planetSizeVariance"))),
      density: 4.0,
      rotationsPerUnit: 3,
      revolutionsPerUnit: getRandomFloatInRange(confMap.get("minRevPerUnit"), confMap.get("maxRevPerUnit")),
      tilt: getRandomFloatInRange(confMap.get("minTilt"), confMap.get("maxTilt")),
      orbitTiltX: getRandomFloatInRange(confMap.get("minOrbitTiltX"), confMap.get("maxOrbitTiltX")),
      orbitTiltZ: getRandomFloatInRange(confMap.get("minOrbitTiltZ"), confMap.get("minOrbitTiltZ")),
      ellipseX: getGaussianNoise(1, orbitRadius / 50000), // mean 1, variance 0.01
      ellipseZ: getGaussianNoise(1, orbitRadius / 50000),
      orbitYaw: Math.random(),
      visibleOrbit: confMap.get("visibleOrbit")
    });

    // Temperate
    var color1 = new THREE.Color(0xEFDEC2);
    var color2 = new THREE.Color(0xDAC27C);
    var color3 = new THREE.Color(0xA8651E);

    // Hot
    var color4 = new THREE.Color(0xDAC27C);
    var color5 = new THREE.Color(0xEFDEC2);
    var color6 = new THREE.Color(0xDAC27C);

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        viewPosition: {
          value: new THREE.Vector3(0, 0, 0)
        },

        locs: {
          value: null
        },

        bodycount: {
          value: 0
        },

        size: {
          value: this.size
        },

        seed: {
          value: Math.random()
        },

        id: {
          value: this.id
        },

        colorAtm: {
          value: new THREE.Color(0xDB7093)
        },

        color: {
          value: [color1, color2, color3, color4, color5, color6]
        },

        obliquity: {
          value: 0
        }
      },

      fragmentShader: dryPlanetFrag,
      vertexShader: dryPlanetVert
    });

    this.mesh = createCBody(this.size, false, this.shaderMaterial);
    this.rotationNode.add(this.mesh);
  }
}

class LavaPlanet extends CelestialBody {
  constructor(confMap, orbitRadius) {
    super({
      orbitRadius: orbitRadius,
      startAngle: 2 * Math.PI * Math.random(),
      size: confMap.get("LavaTerraSizeRatio") * Math.max(confMap.get("minPlanetSize"), getGaussianNoise(confMap.get("starSizeMean") / confMap.get("starPlanetSizeRatio"), confMap.get("planetSizeVariance"))),
      density: 4.0,
      rotationsPerUnit: 3,
      revolutionsPerUnit: getRandomFloatInRange(confMap.get("minRevPerUnit"), confMap.get("maxRevPerUnit")),
      tilt: getRandomFloatInRange(confMap.get("minTilt"), confMap.get("maxTilt")),
      orbitTiltX: getRandomFloatInRange(confMap.get("minOrbitTiltX"), confMap.get("maxOrbitTiltX")),
      orbitTiltZ: getRandomFloatInRange(confMap.get("minOrbitTiltZ"), confMap.get("minOrbitTiltZ")),
      ellipseX: getGaussianNoise(1, orbitRadius / 50000), // mean 1, variance 0.01
      ellipseZ: getGaussianNoise(1, orbitRadius / 50000),
      orbitYaw: Math.random(),
      planetType: "lava",
      visibleOrbit: confMap.get("visibleOrbit")
    });

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        viewPosition: {
          value: new THREE.Vector3(0, 0, 0)
        },

        locs: {
          value: null
        },

        bodycount: {
          value: 0
        },

        size: {
          value: this.size
        },

        seed: {
          value: Math.random()
        },

        id: {
          value: this.id
        },

        colorDeepLava: {
          value: new THREE.Color(0xfceb1e)
        },

        colorLava: {
          value: new THREE.Color(0xff8921)
        },

        colorBurnedGround: {
          value: new THREE.Color(0x6e3d13)
        },

        colorAsh: {
          value: new THREE.Color(0x3d240e)
        },

        obliquity: {
          value: 0
        }
      },

      fragmentShader: lavaPlanetFrag,
      vertexShader: lavaPlanetVert
    });

    this.mesh = createCBody(this.size, false, this.shaderMaterial);
    this.rotationNode.add(this.mesh);
  }
}

class GasGiantPlanet extends CelestialBody {
  constructor(confMap, orbitRadius) {
    super({
      orbitRadius: orbitRadius,
      startAngle: 2 * Math.PI * Math.random(),
      size: confMap.get("C1GasGiantTerraSizeRatio") * Math.max(confMap.get("minPlanetSize"), getGaussianNoise(confMap.get("starSizeMean") / confMap.get("starPlanetSizeRatio"), confMap.get("planetSizeVariance"))),
      density: 1.0,
      rotationsPerUnit: 3,
      revolutionsPerUnit: getRandomFloatInRange(confMap.get("minRevPerUnit"), confMap.get("maxRevPerUnit")),
      tilt: getRandomFloatInRange(confMap.get("minTilt"), confMap.get("maxTilt")),
      orbitTiltX: getRandomFloatInRange(confMap.get("minOrbitTiltX"), confMap.get("maxOrbitTiltX")),
      orbitTiltZ: getRandomFloatInRange(confMap.get("minOrbitTiltZ"), confMap.get("minOrbitTiltZ")),
      ellipseX: getGaussianNoise(1, orbitRadius / 50000), // mean 1, variance 0.01
      ellipseZ: getGaussianNoise(1, orbitRadius / 50000),
      orbitYaw: Math.random(),
      visibleOrbit: confMap.get("visibleOrbit")
    });

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        viewPosition: {
          value: new THREE.Vector3(0, 0, 0)
        },

        locs: {
          value: null
        },

        bodycount: {
          value: 0
        },

        size: {
          value: this.size
        },

        seed: {
          value: Math.random()
        },

        id: {
          value: this.id
        },

        colorRed: {
          type: 'c',
          value: new THREE.Color(0xba756c)
        },

        colorGrey: {
          type: 'c',
          value: new THREE.Color(0xdbd9d9)
        },

        colorBeige: {
          type: 'c',
          value: new THREE.Color(0xbfab8f)
        },

        colorDarkBeige: {
          type: 'c',
          value: new THREE.Color(0x635a4b)
        },

        time: {
          type: 'f',
          value: 0.0
        },

        obliquity: {
          value: 0
        }
      },

      fragmentShader: gasPlanetFrag,
      vertexShader: gasPlanetVert
    });

    this.mesh = createCBody(this.size, false, this.shaderMaterial);
    this.rotationNode.add(this.mesh);
  }
}

class GasDwarfPlanet extends CelestialBody {
  constructor(confMap, orbitRadius) {
    super({
      orbitRadius: orbitRadius,
      startAngle: 2 * Math.PI * Math.random(),
      // gas dwarf average size is 2-4 earth radii
      size: confMap.get("GasDwarfTerraSizeRatio") * Math.max(confMap.get("minPlanetSize"), getGaussianNoise(confMap.get("starSizeMean") / confMap.get("starPlanetSizeRatio"), confMap.get("planetSizeVariance"))),
      density: 1.0,
      rotationsPerUnit: 3,
      revolutionsPerUnit: getRandomFloatInRange(confMap.get("minRevPerUnit"), confMap.get("maxRevPerUnit")),
      tilt: getRandomFloatInRange(confMap.get("minTilt"), confMap.get("maxTilt")),
      orbitTiltX: getRandomFloatInRange(confMap.get("minOrbitTiltX"), confMap.get("maxOrbitTiltX")),
      orbitTiltZ: getRandomFloatInRange(confMap.get("minOrbitTiltZ"), confMap.get("minOrbitTiltZ")),
      ellipseX: getGaussianNoise(1, orbitRadius / 50000), // mean 1, variance 0.01
      ellipseZ: getGaussianNoise(1, orbitRadius / 50000),
      orbitYaw: Math.random(),
      visibleOrbit: confMap.get("visibleOrbit")
    });

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        viewPosition: {
          value: new THREE.Vector3(0, 0, 0)
        },

        locs: {
          value: null
        },

        bodycount: {
          value: 0
        },

        size: {
          value: this.size
        },

        seed: {
          value: Math.random()
        },

        id: {
          value: this.id
        },

        colorRed: {
          type: 'c',
          value: new THREE.Color(0xba756c)
        },

        colorGrey: {
          type: 'c',
          value: new THREE.Color(0xdbd9d9)
        },

        colorBeige: {
          type: 'c',
          value: new THREE.Color(0xbfab8f)
        },

        colorDarkBeige: {
          type: 'c',
          value: new THREE.Color(0x635a4b)
        },

        time: {
          type: 'f',
          value: 0.0
        },

        obliquity: {
          value: 0
        }
      },

      fragmentShader: gasPlanetFrag,
      vertexShader: gasPlanetVert
    });

    this.mesh = createCBody(this.size, false, this.shaderMaterial);
    this.rotationNode.add(this.mesh);

    this.ucb = (delta, cameraPosition) => {
      
    };
  }
}

class Moon extends CelestialBody {
  constructor(confMap, orbitRadius) {
    super({
      orbitRadius: orbitRadius,
      startAngle: 2 * Math.PI * Math.random(),
      size: Math.max(confMap.get("minMoonSize"), getGaussianNoise(confMap.get("starSizeMean") / confMap.get("starPlanetSizeRatio") / confMap.get("planetMoonSizeRatio"), confMap.get("moonSizeVariance"))),
      density: 4.0,
      rotationsPerUnit: 3,
      revolutionsPerUnit: getRandomFloatInRange(confMap.get("minRevPerUnit"), confMap.get("maxRevPerUnit")),
      tilt: getRandomFloatInRange(confMap.get("minTilt"), confMap.get("maxTilt")),
      orbitTiltX: getRandomFloatInRange(confMap.get("minOrbitTiltX"), confMap.get("maxOrbitTiltX")),
      orbitTiltZ: getRandomFloatInRange(confMap.get("minOrbitTiltZ"), confMap.get("minOrbitTiltZ")),
      ellipseX: getGaussianNoise(1, orbitRadius / 50000), // mean 1, variance 0.01
      ellipseZ: getGaussianNoise(1, orbitRadius / 50000),
      orbitYaw: Math.random(),
      planetType: "moon",
      visibleOrbit: confMap.get("visibleOrbit")
    });

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        viewPosition: {
          value: new THREE.Vector3(0, 0, 0)
        },

        locs: {
          value: null
        },

        bodycount: {
          value: 0
        },

        size: {
          value: this.size
        },

        seed: {
          value: Math.random()
        },

        id: {
          value: this.id
        },

        colorGrey: {
          value: new THREE.Color(0x81858c)
        },

        colorDarkGrey: {
          value: new THREE.Color(0x403e3d)
        },

        colorLightGrey: {
          value: new THREE.Color(0xd3d3d3)
        },

        colorBurnedGround: {
          value: new THREE.Color(0x6e3d13)
        },

        colorAsh: {
          value: new THREE.Color(0x3d240e)
        },

        obliquity: {
          value: 0
        }
      },

      fragmentShader: moonFrag,
      vertexShader: moonVert
    });

    this.mesh = createCBody(this.size, false, this.shaderMaterial);
    this.rotationNode.add(this.mesh);
  }
}

class Star extends CelestialBody {
  constructor(confMap) {
    super({
      size: Math.max(confMap.get("minStarSize"), getGaussianNoise(confMap.get("starSizeMean"), confMap.get("starSizeVariance"))),
      rotationsPerUnit: 1,
      revolutionsPerUnit: getRandomFloatInRange(confMap.get("minRevPerUnit"), confMap.get("maxRevPerUnit")),
      tilt: getRandomFloatInRange(confMap.get("minTilt"), confMap.get("maxTilt")),
      light: true
    });

    var primaryColor = new THREE.Color(0xF1E3D1);
    var secondaryColor = new THREE.Color(0xFF00FF);

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        primaryColor: {
          value: primaryColor
        },

        secondaryColor: {
          value: secondaryColor
        },

        viewPosition: {
          value: new THREE.Vector3(0, 0, 0)
        },

        locs: {
          value: null
        },

        bodycount: {
          value: 0
        },

        size: {
          value: this.size
        },

        seed: {
          value: Math.random()
        },

        id: {
          value: this.id
        },

        obliquity: {
          value: 0
        }
      },
      fragmentShader: starFrag,
      vertexShader: starVert
    });

    this.mesh = createCBody(this.size, true, this.shaderMaterial);
    this.rotationNode.add(this.mesh);

    // Corona
    this.coronaGeometry = new THREE.PlaneBufferGeometry(this.size * 32, this.size * 32, 1, 1);

    this.coronaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        size: {
          value: this.size * 4.0
        },

        primaryColor: {
          value: primaryColor
        }
      },

      fragmentShader: coronaFrag,
      vertexShader: coronaVert,

      transparent: true,
      blending: THREE.NormalBlending
    });

    this.corona = new THREE.Mesh(this.coronaGeometry, this.coronaMaterial);

    this.mesh.add(this.corona);

    this.ucb = (delta, cameraPosition) => {
      this.corona.lookAt(cameraPosition);
    };
  }

}
