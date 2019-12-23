const defaultConf = new Map();

// general settings
defaultConf.set("rotateUnit", 'second');
defaultConf.set("revolveUnit", 'minute');
defaultConf.set("minRevPerUnit", -1.0);
defaultConf.set("maxRevPerUnit", 1.0);
defaultConf.set("minTilt", 0.0);
defaultConf.set("maxTilt", Math.PI / 180 * 45);

// star settings
defaultConf.set("starAmount", 1); // integer from 0 to 2
defaultConf.set("starSizeMean", 5);
defaultConf.set("starSizeVariance", 1.0);
defaultConf.set("minStarSize", 5);

// planet settings
defaultConf.set("planetDensityMean", 3.0); // integer from 0 to undetermined
defaultConf.set("planetDensityVariance", 1.0); // integer from 0 to undetermined
defaultConf.set("minPlanetDensity", 0.5); 
defaultConf.set("minPlanetAmount", 10); // integer from 0 to undetermined
defaultConf.set("maxPlanetAmount", 10); // integer from 0 to undetermined
defaultConf.set("planetSizeVariance", 0.5); // determines how much planet size varies according to gamma distribution
defaultConf.set("minPlanetSize", 1.0);
defaultConf.set("minDistanceBetweenPlanetOrbits", 30.0);
defaultConf.set("starPlanetSizeRatio", 5.0);

// moon settings
defaultConf.set("moonDensityMean", 3.0); // integer from 0 to undetermined
defaultConf.set("moonDensityVariance", 1.0); // integer from 0 to undetermined
defaultConf.set("minMoonDensity", 1.0);
defaultConf.set("planetMoonSizeRatio", 4.0);
defaultConf.set("moonSizeVariance", 1.0);
defaultConf.set("minMoonSize", 1.0);
defaultConf.set("minMoonAmount", 0); // less or equal to maxMoonAmount
defaultConf.set("maxMoonAmount", 0); // more or equal to minMoonAmount
defaultConf.set("minMoonRevPerUnit", 0);
defaultConf.set("maxMoonRevPerUnit", 0); // these go for each planet not each moon
defaultConf.set("minMoonTilt", 0.0);
defaultConf.set("maxMoonTilt", Math.PI / 180 * 45);

// orbit settings
defaultConf.set("visibleOrbit", false); // true or false
defaultConf.set("ellipticalOrbit", false);
defaultConf.set("minOrbitTiltX", 0);
defaultConf.set("maxOrbitTiltX", 0);
defaultConf.set("minOrbitTiltZ", 0);
defaultConf.set("maxOrbitTiltZ", 0);
defaultConf.set("minEllipseX", 1);
defaultConf.set("maxEllipseX", 1);
defaultConf.set("minEllipseZ", 1);
defaultConf.set("maxEllipseZ", 1);
defaultConf.set("ellipseFocusDir", Math.random() < 0.5 ? -1 : 1); // Sets the parent (Sun for planet, planet for moon) at random but consistent focus
defaultConf.set("orbitYaw", 0.5); // from 0 to 1

class Conf {
    constructor(params) {
        this.confMap = defaultConf; // set to defaults

        if(params && params instanceof Map)
            this.setConf(params); // add custom conf options from params
        else
            console.log("No conf.");

        var nonNegatives = ["minTilt", "maxTilt", 
        "starAmount", "starSizeMean", "starSizeVariance", "minStarSize", 
        "minPlanetDensity", "planetDensityMean", "planetDensityVariance", "minPlanetAmount", "minPlanetSize", "planetSizeVariance", "minDistanceBetweenPlanetOrbits", "starPlanetSizeRatio", 
        "minMoonAmount", "minMoonSize", "moonDensityMean", "moonDensityVariance", "minMoonDensity", "planetMoonSizeRatio", "moonSizeVariance",
        "minEllipseX", "maxEllipseX", "minEllipseZ", "maxEllipseZ", "orbitYaw"];
        var minMaxs = [["minMoonAmount", "maxMoonAmount"], ["minTilt", "maxTilt"],
            ["minMoonTilt", "maxMoonTilt"], ["minOrbitTiltX", "maxOrbitTiltX"], ["minRevPerUnit", "maxRevPerUnit"],
            ["minOrbitTiltZ", "maxOrbitTiltZ"], ["minEllipseX", "maxEllipseX"], ["minEllipseZ", "maxEllipseZ"],
            ["minMoonRevPerUnit", "maxMoonRevPerUnit"]];
        this.validateConf(nonNegatives, minMaxs); // validate fields
    }

    /**
     * Checks if each key in given parameters of also in defaults and if the value is of same type
     * @param {} p custom Conf parameters
     */
    setConf(p){
        for (var [key, value] of p.entries()) {
            if(defaultConf.has(key) && (typeof defaultConf.get(key)) == (typeof value)) this.confMap.set(key, value);
            else console.log("Tryin to set unknown parameter in Conf: ", key);
        }
    }

    validateConf(nonNeg, minMax){
        for (var el of nonNeg) {
            if(this.confMap.get(el) < 0) console.log(el, " is negative. Try make it not negative por favor.");
        }
        for (var el of minMax) {
            if(this.confMap.get(el[0]) > this.confMap.get(el[1])) console.log(el[0], " is bigger than ", el[1], ". Min value can not be higher than max value.");
        }
    }
  }
