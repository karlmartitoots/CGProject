var renderer, scene, cam;
var sceneWidth = 800;
var sceneHeight = 500;
var bodies = [];
var clock = new THREE.Clock();
var delta = clock.getDelta();
var seed = '42';

var confMap = new Conf().confMap;

var core;
var camController;

function onLoad() {
  if (WEBGL.isWebGL2Available() === false ) {
    document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
    console.log("WebGL2 is not available");
  }

  var canvasContainer = document.getElementById('myCanvasContainer');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('webgl2', {alpha: false});

  renderer = new THREE.WebGLRenderer({canvas: canvas, context: context});
  renderer.setSize(sceneWidth, sceneHeight);
  renderer.sortObjects = true;
  canvasContainer.appendChild(canvas);

  scene = new THREE.Scene();

  var generator = new Generator(confMap);

  setupGui(generator);

  core = generator.generate(seed);

  scene.add(core.root);

  // Camera config
  camController = new CameraController(renderer, core, sceneWidth, sceneHeight);

  // Initalize keyboard and mouse controls
  initializeControls(camController);
  
  /*
	TEST SKYBOX
	###########  
	
	1) maybe try with a sphere instead of a box 
	2) determine points with noise (?)
	
  */
  var skyBox = new THREE.BoxGeometry(10000.0, 10000.0, 10000.0, 120, 120, 120);
  var skyBoxMaterial = new THREE.MeshBasicMaterial({
    map: getRandomStarField(8000, 2048 , 2048),
	side: THREE.BackSide
  });
  var sky = new THREE.Mesh(skyBox, skyBoxMaterial);
  //scene.add(sky);
  
  var skybox2 = new THREE.BoxGeometry(10.0, 10.0, 10.0, 10, 10, 10); 
  var skyBoxMaterial2 = new THREE.ShaderMaterial({
    uniforms: {
      
      iTime: {
        value: 4.0
      }, 
	  
	  resolution: {
		  value: [800, 500]
	  }
      /*iResolution: {
        value: new THREE.Vector3(800, 500, 0)
      },
	  
	  iTimeDelta: {
        value: 0.5
      },
	  
	  iFrame: {
        value: 100
      },

      iChannelTime[4]: { // 1 float
        value: 10.0
      },

      iChannelResolution[4]: { //vec 3
        value: [800, 500, 0]
      },

      */
    },

    vertexShader: skyboxVert,
    fragmentShader: skyboxFrag
  });
  var sky2 = new THREE.Mesh(skybox2, skyBoxMaterial2);
  scene.add(sky2);

  draw();
}

/*
	TEST SKYBOX
	###########  
  */
function getRandomStarField(numberOfStars, width, height) {
    var canvas = document.createElement('CANVAS');

	canvas.width = width;
	canvas.height = height;

	var ctx = canvas.getContext('2d');

	ctx.fillStyle="black";
	ctx.fillRect(0, 0, width, height);

	for (var i = 0; i < numberOfStars; ++i) {
		var radius = Math.random() * 2;
		var x = Math.floor(Math.random() * width);
		var y = Math.floor(Math.random() * height);

		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'white';
		ctx.fill();
	}

	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	return texture;
};


var counter = 0;

function setupGui(generator) {
  var gui = new dat.GUI();

  var guiObj = createGuiObject(generator);

  gui.add(guiObj, 'seed');
  gui.add(guiObj, 'Generate');
  gui.add(guiObj, 'minRevPerUnit', 0, 100);
  gui.add(guiObj, 'maxRevPerUnit', 0, 100);
  gui.add(guiObj, 'minTilt', -Math.PI / 2, Math.PI / 2);
  gui.add(guiObj, 'maxTilt', -Math.PI / 2, Math.PI / 2);
  var starConfFolder = gui.addFolder('Star Configuration');
  //starConfFolder.add(guiObj, 'starAmount', 1, 2);
  starConfFolder.add(guiObj, 'starSizeMean', 1.0, 100.0);
  starConfFolder.add(guiObj, 'starSizeVariance', 0.0, 10.0);

  var planetConfFolder = gui.addFolder('Planet Configuration');
  //planetConfFolder.add(guiObj, 'planetDensityMean', 1.0, 8.0);
  //planetConfFolder.add(guiObj, 'planetDensityVariance', 1.0, 8.0);
  planetConfFolder.add(guiObj, 'planetSizeVariance', 1, 100);
  //planetConfFolder.add(guiObj, 'minPlanetSize', 1, 100);
  planetConfFolder.add(guiObj, 'starPlanetSizeRatio', 1, 30);
  planetConfFolder.add(guiObj, 'minPlanetAmount', 1, 100);
  planetConfFolder.add(guiObj, 'maxPlanetAmount', 1, 100);

  var moonConfFolder = gui.addFolder('Moon Configuration');
  moonConfFolder.add(guiObj, 'planetMoonSizeRatio', 1, 30);
 // moonConfFolder.add(guiObj, 'moonDensityMean', 1.0, 8.0);
  //moonConfFolder.add(guiObj, 'moonDensityVariance', 1.0, 8.0);
  moonConfFolder.add(guiObj, 'minMoonRevPerUnit', 0, 100);
  moonConfFolder.add(guiObj, 'maxMoonRevPerUnit', 0, 100);
  moonConfFolder.add(guiObj, 'minMoonAmount', 0, 10);
  moonConfFolder.add(guiObj, 'maxMoonAmount', 0, 10);
  moonConfFolder.add(guiObj, 'minMoonTilt', -Math.PI / 2, Math.PI / 2);
  moonConfFolder.add(guiObj, 'maxMoonTilt', -Math.PI / 2, Math.PI / 2);

  var orbitsConfFolder = gui.addFolder('Orbits Configuration');
  orbitsConfFolder.add(guiObj, 'minDistanceBetweenPlanetOrbits', 10, 100);
  orbitsConfFolder.add(guiObj, 'visibleOrbits');
  orbitsConfFolder.add(guiObj, 'ellipticalOrbit');
  orbitsConfFolder.add(guiObj, 'minOrbitTiltX', - Math.PI / 2, Math.PI / 2);
  orbitsConfFolder.add(guiObj, 'maxOrbitTiltX', - Math.PI / 2, Math.PI / 2);
  orbitsConfFolder.add(guiObj, 'minOrbitTiltZ', - Math.PI / 2, Math.PI / 2);
  orbitsConfFolder.add(guiObj, 'maxOrbitTiltZ', - Math.PI / 2, Math.PI / 2);
  orbitsConfFolder.add(guiObj, 'minEllipseX', 0.3, 3.0);
  orbitsConfFolder.add(guiObj, 'maxEllipseX', 0.3, 3.0);
  orbitsConfFolder.add(guiObj, 'minEllipseZ', 0.3, 3.0);
  orbitsConfFolder.add(guiObj, 'maxEllipseZ', 0.3, 3.0);
  orbitsConfFolder.add(guiObj, 'orbitYaw', 0, 1);

  setCustomConf(guiObj);
}

function createGuiObject(generator) {
  return {
    seed: globalThis.seed,
    minTilt: 0.0,
    maxTilt: Math.PI / 4,
    minRevPerUnit: 1,
    maxRevPerUnit: 2,
    //starAmount: 1,
    starSizeMean: 20,
    starSizeVariance: 0,
    starPlanetSizeRatio: 3,
    planetSizeVariance: 0,
    planetMoonSizeRatio: 3,
    moonSizeVariance: 0,
    //planetDensityMean: 4.0,
    //planetDensityVariance: 1.0,
    minPlanetAmount: 10,
    maxPlanetAmount: 10,
    minMoonAmount: 0,
    maxMoonAmount: 4,
    minMoonRevPerUnit: 1,
    maxMoonRevPerUnit: 2,
    minMoonTilt: 0.0,
    maxMoonTilt: Math.PI / 4,
    visibleOrbits: true,
    ellipticalOrbit: true,
    minDistanceBetweenPlanetOrbits: 30,
    minOrbitTiltX: - Math.PI / 20,
    maxOrbitTiltX: Math.PI / 20,
    minOrbitTiltZ: - Math.PI / 20,
    maxOrbitTiltZ: Math.PI / 20,
    minEllipseX: 0.9,
    maxEllipseX: 1.1,
    minEllipseZ: 0.9,
    maxEllipseZ: 1.1,
    orbitYaw: 0.5,
    Generate: function () {
      scene.remove(core.root);
      setCustomConf(this);
      core = generator.generate(this.seed);
      scene.add(core.root);
    }
  };
}

function setCustomConf(guiObject) {
  var customConf = new Map();
  for( prop in guiObject ){
    if(prop == 'seed' || prop == 'Generate') continue;
    customConf.set(prop, guiObject[prop]);
  }
  confMap = new Conf(customConf).confMap;
}

function draw() {
  requestAnimationFrame(draw);

  delta = clock.getDelta();

  updateControls(delta);

  core.update(core.mesh.getWorldPosition(new THREE.Vector3()), camController.current.camera.position);

  renderer.render(scene, camController.current.camera);
}
