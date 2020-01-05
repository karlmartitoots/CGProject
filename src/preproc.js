function preprocessShaders() {
  var shaders = [noiseComp, lightComp, lavaPlanetFrag, moonFrag, starFrag, starVert, terraPlanetFrag, terraPlanetVert,
                 lavaPlanetVert, moonVert, dryPlanetFrag, dryPlanetVert, coronaVert, coronaFrag, gasPlanetFrag, gasPlanetVert,
                 ringVert, ringFrag];

  shaders.forEach((item, index) => {
    // Noise
    item = item.replace('#include <noise.comp>', noiseComp);

    // Lighting
    item = item.replace('#include <lighting.comp>', lightComp);

    shaders[index] = item;
  });

  // TODO: Better
  // Reassigne
  noiseComp = shaders[0];
  lightComp = shaders[1];
  lavaPlanetFrag = shaders[2];
  moonFrag = shaders[3];
  starFrag = shaders[4];
  starVert = shaders[5];
  terraPlanetFrag = shaders[6];
  terraPlanetVert = shaders[7];
  lavaPlanetVert = shaders[8];
  moonVert = shaders[9];
  dryPlanetFrag = shaders[10];
  dryPlanetVert = shaders[11];
  coronaVert = shaders[12];
  coronaFrag = shaders[13];
  gasPlanetFrag = shaders[14];
  gasPlanetVert = shaders[15];
  ringVert = shaders[16];
  ringFrag = shaders[17];
}
