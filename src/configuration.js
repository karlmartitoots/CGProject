const defaultConf = new Map();
defaultConf.set("planetAmount", 10); // integer from 0 to undetermined 
defaultConf.set("starAmount", 2); // integer from 0 to 2
defaultConf.set("minCompanionAmount", 0); // less or equal to maxCompanionAmount
defaultConf.set("maxCompanionAmount", 0); // more or equal to minCompanionAmount
defaultConf.set("visibleOrbits", true); // true or false
defaultConf.set("celBodyRotationsPerUnit", 0); 
defaultConf.set("rotateUnit", 'second');
defaultConf.set("celBodyRevolutionsPerUnit", 0);
defaultConf.set("revolveUnit", 'minute');
defaultConf.set("planetMinSize", 2); // less or equal to planetMaxSize
defaultConf.set("planetMaxSize", 2); // more or equal to planetMaxSize
defaultConf.set("starSize", 3); 

class Conf {
    constructor(params) {
        this.confMap = defaultConf; // set to defaults

        if(params instanceof Map) 
            this.setConf(params); // add custom conf options from params
        else 
            console.log("Conf is not a Map.");

        this.validateConf(); // validate fields
    }

    /**
     * Checks if each key in given parameters of also in defaults and if the value is of same type
     * @param {} p custom Conf parameters
     */
    setConf(p){
        p.forEach((key, value) => {
            if(key in defaultConf.keys && value instanceof (typeof defaultConf.get(key))) this.confMap.set(key, value);
            else console.log("Tryin to set unknown parameter in Conf: ", key);
        });
    }

    validateConf(){
        this.validateNonNegative(this.confMap.get("planetAmount"));
        this.validateNonNegative(this.confMap.get("starAmount"));
        if(this.confMap.get("starAmount") > 2) console.log("StarAmount conf over set upper limit.");
        this.validateNonNegative(this.confMap.get("minCompanionAmount"));
        this.validateNonNegative(this.confMap.get("maxCompanionAmount"));
        if(this.confMap.get("minCompanionAmount") > this.confMap.get("maxCompanionAmount")) console.log("Companion min amount can not be higher than max amount.");
        this.validateNonNegative(this.confMap.get("planetMinSize"));
        this.validateNonNegative(this.confMap.get("planetMaxSize"));
        if(this.confMap.get("planetMinSize") > this.confMap.get("planetMaxSize")) console.log("Planet min size can not be higher than max amount.");
        this.validateNonNegative(this.confMap.get("starSize"));
    }

    validateNonNegative(field){
        if(field < 0) console.log(field, " conf can not be negative.");
    }
  
    get confMap() {
      return this._confMap;
    }
  
    set confMap(newMap) {
      this._confMap = newMap;
    }
  }