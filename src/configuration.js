const defaultConf = new Map();

defaultConf.set("planetAmount", 10); // integer from 0 to undetermined
defaultConf.set("starAmount", 1); // integer from 0 to 2
defaultConf.set("minMoonAmount", 0); // less or equal to maxMoonAmount
defaultConf.set("maxMoonAmount", 0); // more or equal to minMoonAmount
defaultConf.set("visibleOrbits", true); // true or false
defaultConf.set("celBodyRotationsPerUnit", 0);
defaultConf.set("rotateUnit", 'second');
defaultConf.set("minRevolutionsPerUnit", 0);
defaultConf.set("maxRevolutionsPerUnit", 0);
defaultConf.set("revolveUnit", 'minute');
defaultConf.set("planetMinSize", 2); // less or equal to planetMaxSize
defaultConf.set("planetMaxSize", 2); // more or equal to planetMinSize
defaultConf.set("starSize", 5);
defaultConf.set("minDistanceBetweenOrbits", 30.0);
defaultConf.set("minTilt", 0.0);
defaultConf.set("maxTilt", Math.PI / 180 * 45);

// moon settings
defaultConf.set("minMoonRevolutionsPerUnit", 0);
defaultConf.set("maxMoonRevolutionsPerUnit", 0); // these go for each planet not each moon
defaultConf.set("moonMinSize", 0.1); // less or equal to moonMaxSize
defaultConf.set("moonMaxSize", 1.0); // more or equal to moonMinSize
defaultConf.set("moonMinTilt", 0.0);
defaultConf.set("moonMaxTilt", Math.PI / 180 * 45);

// orbit settings
defaultConf.set("ellipticalOrbit", false);
defaultConf.set("minOrbitTiltX", 0);
defaultConf.set("minOrbitTiltZ", 0);
defaultConf.set("maxOrbitTiltX", 0);
defaultConf.set("maxOrbitTiltZ", 0);

class Conf {
    constructor(params) {
        this.confMap = defaultConf; // set to defaults

        if(params && params instanceof Map)
            this.setConf(params); // add custom conf options from params
        else
            console.log("No conf.");
        
        var nonNegatives = ["planetAmount", "starAmount", "minMoonAmount", "maxMoonAmount", "planetMinSize", "planetMaxSize",
        "starSize", "minDistanceBetweenOrbits", "minTilt", "maxTilt", "moonMinSize", "moonMaxSize", "moonMinTilt", "moonMaxTilt"];
        var minMaxs = [["minMoonAmount", "maxMoonAmount"], ["planetMinSize", "planetMaxSize"], ["minTilt", "maxTilt"], 
            ["moonMinSize", "moonMaxSize"], ["moonMinTilt", "moonMaxTilt"], ["minOrbitTiltX", "maxOrbitTiltX"], 
            ["minOrbitTiltZ", "maxOrbitTiltZ"]];
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
