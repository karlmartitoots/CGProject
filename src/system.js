class System {
  constructor(root) {
    // Determine the number of celestial bodies
    // Determine the number of light sources
    var bl = this.countNodes(root);
    this.nofb = bl[0];
    this.lsrc = bl[1];

    console.log("There are " + this.nofb + " celestial bodies in total");

    // Create a data texture for holding the locations
    this.locations = new Float32Array(this.nofb * 4);

    this.locTexture = new THREE.DataTexture(this.locations, this.nofb, 1, THREE.RGBAFormat, THREE.FloatType);
    this.locTexture.minFilter = THREE.NearestFilter;
    this.locTexture.magFilter = THREE.NearestFilter;
    this.locTexture.generateMipmaps = false;

    this.texel = new THREE.Vector4();

    // Initialize
    this.initialValues(root);

    this.locTexture.needsUpdate = true;
  }

  countNodes(tree) {
    var bl;
    var n = 1;
    var l = 0;

    tree.children.forEach(item => {
      bl = this.countNodes(item);
      n += bl[0];
      l += bl[1];
    });

    if (tree.light)
      ++l;

    return [n, l];
  }

  initialValues(tree) {
    tree.mesh.material.uniforms.locs.value = this.locTexture;
    tree.mesh.material.uniforms.bodycount.value = this.nofb;

    tree.children.forEach(item => this.initialValues(item));
  }

  update(index, position, radius) {
    this.texel.x = position.x;
    this.texel.y = position.y;
    this.texel.z = position.z;
    this.texel.w = radius;
    this.texel.toArray(this.locations, 4 * index);
  }
}
