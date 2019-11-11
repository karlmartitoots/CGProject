class Lighting {
  constructor(radius, posx, posy, posz) {

   var sphere = new THREE.SphereBufferGeometry(radius, 16, 8);
   sphere.castShadow = true; //default is false
   sphere.receiveShadow = false; //default
   var light = new THREE.PointLight(0xff0040, 2, 50);//"rgb(50%, 0%, 0%)"
   //light.add( new THREE.Mesh( sphere, new THREE.MeshStandardMaterial({ color: 0xff0040 })));
   light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial({ color: 0xff0040 })));
   light.castShadow = true;
   this.position = new THREE.Vector3(0, 0, 0);
   light.position.set(posx, posy, posz);
   
   light.shadow.mapSize.width = 800; 
   light.shadow.mapSize.height = 500; 
   light.shadow.camera.near = 0.5;       // default
   light.shadow.camera.far = 500      // default


   this.light = light;
   
  }
}  