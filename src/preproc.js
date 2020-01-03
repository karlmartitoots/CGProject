function preprocessShaders() {
  var shaders = [noiseComp, lightComp, lavaPlanetFrag, moonFrag, cbPlanetVert, cbStarFrag, cbStarVert, terraPlanetFrag, terraPlanetVert, lavaPlanetVert, moonVert];

  shaders.forEach((item) => {
    // Noise
    item = item.replace('#include <noise.comp>', noiseComp);

    // Lighting
    item = item.replace('#include <lighting.comp>', lightComp);
  })
}
