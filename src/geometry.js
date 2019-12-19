function createSphere(colorCode, radius, lsource, seed, id, planetType = 'terra') {
  var geometry = new THREE.SphereBufferGeometry(radius, 50, 50);
  var color = new THREE.Color(colorCode);

  var colorWater = new THREE.Color(0x00aeef);
  var colorDeepWater = new THREE.Color(0x383c80);
  var colorAtmosphere = new THREE.Color(0x66d5ed);
  var colorDeepLava = new THREE.Color(0xfcdb1e);
  var colorLava = new THREE.Color(0xff8921);
  var colorBurnedGround = new THREE.Color(0x6e3d13);
  var colorAsh = new THREE.Color(0x3d240e);
  var colorGrey = new THREE.Color(0x81858c);
  var colorDarkGrey = new THREE.Color(0x403e3d);
  var color1 = new THREE.Color(0x197b30);
  var color2 = new THREE.Color(0x005826);
  //var color3 = new THREE.Color(0x4e3f32);
  var color3 = new THREE.Color(0xFFFFFF);

  var material = new THREE.ShaderMaterial({
    uniforms: {
      viewPosition: {
        value: new THREE.Vector3(0, 0, 0)
      },

      size: {
        value: radius
      },

      color: {
        value: [color1, color2, color3]
      },

      colora: {
        value: colorAtmosphere
      },

      colorw: {
        value: colorWater
      },

      colordw: {
        value: colorDeepWater
      },

      seed: {
        value: seed
      },

      locs: {
        value: null
      },

      bodycount: {
        value: 0
      },

      id: {
        value: id
      }
    },

    vertexShader: lsource ? cbStarVert : cbPlanetVert,
    fragmentShader: lsource ? cbStarFrag : terraPlanetFrag
  });

  var lavaplanetMaterial = new THREE.ShaderMaterial({
    uniforms: {
      viewPosition: {
        value: new THREE.Vector3(0, 0, 0)
      },

      size: {
        value: radius
      },

      color: {
        value: [colorBurnedGround, colorAsh, colorAsh]
      },

      colora: {
        value: colorAtmosphere
      },

      colorw: {
        value: colorLava
      },

      colordw: {
        value: colorDeepLava
      },

      seed: {
        value: seed
      },

      locs: {
        value: null
      },

      bodycount: {
        value: 0
      },

      id: {
        value: id
      }
    },

    vertexShader: cbPlanetVert,
    fragmentShader: lavaPlanetFrag
  });

  var moonMaterial = new THREE.ShaderMaterial({
    uniforms: {
      viewPosition: {
        value: new THREE.Vector3(0, 0, 0)
      },

      size: {
        value: radius
      },

      colorgrey: {
        value: colorGrey
      },

      colordarkgrey: {
        value: colorDarkGrey
      },

      seed: {
        value: seed
      },

      locs: {
        value: null
      },

      bodycount: {
        value: 0
      },

      id: {
        value: id
      }
    },

    vertexShader: cbPlanetVert,
    fragmentShader: moonFrag
  });

  if(planetType == 'lava'){
    material = lavaplanetMaterial;
  } else if(planetType == 'moon'){
    material = moonMaterial;
  }

  // Noise generation shader
  material.onBeforeCompile = shader => {
    // Noise
    shader.fragmentShader = shader.fragmentShader.replace('#include <noise.comp>', noiseComp);
    shader.vertexShader = shader.vertexShader.replace('#include <noise.comp>', noiseComp);

    // Lighting
    shader.fragmentShader = shader.fragmentShader.replace('#include <lighting.comp>', lightComp);
    shader.vertexShader = shader.vertexShader.replace('#include <lighting.comp>', lightComp);
  };

  material.depthFunc = THREE.LessEqualDepth;
  material.blending = THREE.NoBlending;

  var sphere = new THREE.Mesh(geometry, material);

  if (lsource) {
 //   sphere.castShadow = false;
 //   sphere.receiveShadow = false;

 //   var light = new THREE.PointLight(0xff0040, 2, 1000000);

    var light = new THREE.Object3D();
    light.add(sphere);
 //   light.castShadow = true;

 //   light.shadow.mapSize.width = 800;
 //   light.shadow.mapSize.height = 500;
 //   light.shadow.camera.near = 0.5;
 //   light.shadow.camera.far = 500;

    light.name = "LIGHT";

    //return light;
    return sphere;
  }

  else {
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    return sphere;
  }
}

function createLine(point1, point2) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(point1);
  geometry.vertices.push(point2);

  var material = new THREE.LineBasicMaterial({color: 0x0000FF});

  return new THREE.Line(geometry, material);
}
