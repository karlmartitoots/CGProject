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
defaultConf.set("maxDistanceBetweenPlanets", 30.0);
defaultConf.set("minTilt", 0.0);
defaultConf.set("maxTilt", Math.PI / 180 * 45);
// moon settings
defaultConf.set("minMoonRevolutionsPerUnit", 0); 
defaultConf.set("maxMoonRevolutionsPerUnit", 0); // these go for each planet not each moon
defaultConf.set("moonMinSize", 0.1); // less or equal to moonMaxSize
defaultConf.set("moonMaxSize", 1.0); // more or equal to moonMinSize
defaultConf.set("moonMinTilt", 0.0);
defaultConf.set("moonMaxTilt", Math.PI / 180 * 45);


class Conf {
    constructor(params) {
        this.confMap = defaultConf; // set to defaults

        if(params && params instanceof Map) 
            this.setConf(params); // add custom conf options from params
        else 
            console.log("No conf.");

        this.validateConf(); // validate fields
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

    validateConf(){
        this.validateNonNegative(this.confMap.get("planetAmount"));
        this.validateNonNegative(this.confMap.get("starAmount"));
        if(this.confMap.get("starAmount") > 2) console.log("StarAmount conf over set upper limit.");
        this.validateNonNegative(this.confMap.get("minMoonAmount"));
        this.validateNonNegative(this.confMap.get("maxMoonAmount"));
        if(this.confMap.get("minMoonAmount") > this.confMap.get("maxMoonAmount")) console.log("Companion min amount can not be higher than max amount.");
        this.validateNonNegative(this.confMap.get("planetMinSize"));
        this.validateNonNegative(this.confMap.get("planetMaxSize"));
        if(this.confMap.get("planetMinSize") > this.confMap.get("planetMaxSize")) console.log("Planet min size can not be higher than max amount.");
        this.validateNonNegative(this.confMap.get("starSize"));
        this.validateNonNegative(this.confMap.get("maxDistanceBetweenPlanets"));
        this.validateNonNegative(this.confMap.get("minTilt"));
        this.validateNonNegative(this.confMap.get("maxTilt"));
        if(this.confMap.get("minTilt") > this.confMap.get("maxTilt")) console.log("Min tilt can not be higher than max tilt.");
        if(this.confMap.get("minRevolutionsPerUnit") > this.confMap.get("maxRevolutionsPerUnit")) console.log("Min revPerUnit can not be higher than max revPerUnit.");
        //validate moon settings
        this.validateNonNegative(this.confMap.get("moonMinSize"));
        this.validateNonNegative(this.confMap.get("moonMaxSize"));
        this.validateNonNegative(this.confMap.get("moonMinTilt"));
        this.validateNonNegative(this.confMap.get("moonMaxTilt"));
    }

    validateNonNegative(field){
        if(field < 0) console.log(field, " is negative. Try make it not negative por favor.");
    }
  
    get confMap() {
      return this._confMap;
    }
  
    set confMap(newMap) {
      this._confMap = newMap;
    }
  }