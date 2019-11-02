var renderer, scene, camera;
var bodies = [];
var orbits = [];
var clock = new THREE.Clock();
var delta = clock.getDelta();
var dt;
document.addEventListener("keydown", onDocumentKeyDown, false);

function onLoad() {
  var canvasContainer = document.getElementById('myCanvasContainer');
  var width = 800;
  var height = 500;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  canvasContainer.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  var camera = new Camera(width, height);
  scene.add(camera.getCamera());
  
  //Make a phere + pointlight
  var sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
  var light = new THREE.PointLight( 0xff0040, 2, 50 );//"rgb(50%, 0%, 0%)"
  light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
  light.position.set( 3, 5, 4 );
  scene.add( light );

  var orb = new Orbit(2.0);
  var orb2 = new Orbit(10.0);
  orbits.push(orb);
  orbits.push(orb2);
  
  var star = new CelestialBody({orbit : orb, rotationsPerUnit : 0.05, revolutionsPerUnit : 1.0});
  var planet = new CelestialBody({size : 3, orbit : orb2, rotationsPerUnit : 0.2, revolutionsPerUnit : 1.0});
  bodies.push(star);
  bodies.push(planet);

  var system = new System(bodies, orbits);
  scene.add(system.getObject3D());

  draw();
}

function draw() {
  requestAnimationFrame(draw);

  // Get time
  var millis = Date.now();
  dt = clock.getDelta();

  // Simple rotation and revolving of bodies
  bodies.forEach((item, index) => {
    // TODO: Rotate according to the speed, which is specified in Body class
    // TODO: Add a 'rotate' function to the body

    // revolve in polar coords
    var angle = setAngle(item.revSpeed, item.revUnit)
    item.mesh.position.x = item.orbit.radius * Math.cos(angle);
    item.mesh.position.z = item.orbit.radius * Math.sin(angle);
    // rotation
    item.mesh.rotation.set(0, setAngle(item.rotSpeed, item.rotUnit), 0);
  });

  renderer.render(scene, camera);
}


function onDocumentKeyDown(event) {
	
	var keyCode = event.which;

    switch (keyCode){
		case 65://Left
			camera.position.x -= 30 * dt;
			break;
			
		case 87://W
			camera.position.z -= 30 * dt;
			break;
		
		case 68://Right
			camera.position.x += 30 * dt;
			break;
			
		case 83://S
			camera.position.z += 30 * dt;
			break;
			
		case 81://Q -- outside
			camera.position.y += 30 * dt;
			break;
			
		case 69://E -- inside
			camera.position.y -= 30 * dt;
			break;			
	}
}

