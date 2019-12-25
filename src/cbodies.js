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
            ellipseX: getGaussianNoise(1, 0.01), // mean 1, variance 0.01
            ellipseZ: getGaussianNoise(1, 0.01),
            orbitYaw: Math.random(),
            visibleOrbit: confMap.get("visibleOrbit")
          });
  
        var color1 = new THREE.Color(0x197b30);
        var color2 = new THREE.Color(0x005826);
        //var color3 = new THREE.Color(0x4e3f32);
        var color3 = new THREE.Color(0xFFFFFF);

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
                    value: [color1, color2, color3]
                }
            },
            fragmentShader: terraPlanetFrag,
            vertexShader: cbPlanetVert
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
            size: Math.max(confMap.get("minPlanetSize"), getGaussianNoise(confMap.get("starSizeMean") / confMap.get("starPlanetSizeRatio"), confMap.get("planetSizeVariance"))),
            density: 4.0,
            rotationsPerUnit: 3,
            revolutionsPerUnit: getRandomFloatInRange(confMap.get("minRevPerUnit"), confMap.get("maxRevPerUnit")),
            tilt: getRandomFloatInRange(confMap.get("minTilt"), confMap.get("maxTilt")),
            orbitTiltX: getRandomFloatInRange(confMap.get("minOrbitTiltX"), confMap.get("maxOrbitTiltX")),
            orbitTiltZ: getRandomFloatInRange(confMap.get("minOrbitTiltZ"), confMap.get("minOrbitTiltZ")),
            ellipseX: getGaussianNoise(1, 0.01), // mean 1, variance 0.01
            ellipseZ: getGaussianNoise(1, 0.01),
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
                    value: new THREE.Color(0xfcdb1e)
                },
                colorLava: {
                    value: new THREE.Color(0xff8921)
                },
                colorBurnedGround: {
                    value: new THREE.Color(0x6e3d13)
                },
                colorAsh: {
                    value: new THREE.Color(0x3d240e)
                }
            },
            fragmentShader: lavaPlanetFrag,
            vertexShader: cbPlanetVert
        });

        this.mesh = createCBody(this.size, false, this.shaderMaterial);
        this.rotationNode.add(this.mesh);
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
            ellipseX: getGaussianNoise(1, 0.01), // mean 1, variance 0.01
            ellipseZ: getGaussianNoise(1, 0.01),
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
                colorBurnedGround: {
                    value: new THREE.Color(0x6e3d13)
                },
                colorAsh: {
                    value: new THREE.Color(0x3d240e)
                }
            },
            fragmentShader: moonFrag,
            vertexShader: cbPlanetVert
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
            light: true});

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
                colorBurnedGround: {
                    value: new THREE.Color(0x6e3d13)
                },
                colorAsh: {
                    value: new THREE.Color(0x3d240e)
                }
            },
            fragmentShader: cbStarFrag,
            vertexShader: cbStarVert
        });

        this.mesh = createCBody(this.size, true, this.shaderMaterial);
        this.rotationNode.add(this.mesh);
    }
}