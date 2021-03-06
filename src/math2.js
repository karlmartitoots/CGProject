var timeMap = new Map([
    ['ms', 0.001],
    ['millis', 0.001],
    ['second', 1],
    ['minute', 60],
    ['hour', 3600],
    ['day', 3600 * 24]
 ]);

/**
 * Converts degrees to radians
 */
function toRad(degree) {

    return Math.PI * 2 * degree / 360;
}

/**
 * Returns a value in radians corresponding to n rotations per time unit
 * Example: setAngle2(40, unit = 'minute') always returns angle corresponding to 40 rotations per minute
 * This method is for documentation purposes, setAngle() uses less variables and computations
 */
function setAngle2(n, unit = 'second'){
    var x = 0.36 * (new Date()).getTime(); // 360 degrees per second
    var y = x / timeMap.get(unit); // 360 degrees per time unit
    var angleRad = toRad(y * n % 360); // times n cycles per time unit, mapped to [0 ; 360] then [0 ; 2 * pi]
    return angleRad
}

function setAngle(n, unit = 'second'){
    return Math.PI * (0.002 * (new Date()).getTime() / timeMap.get(unit) * n % 2)
}

function getRandomFloatInRange(a, b){
  return a + (b - a) * Math.random();
}

/**
 * Using Box–Muller transform of a random variable from uniform distribution.
 * https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
 * 
 * @param {*} a 
 * @param {*} b 
 */
function getGaussianNoise(mean, sigma){
    return mean + sigma * Math.cos(2 * Math.PI * Math.random()) * Math.sqrt(-2 * Math.log(Math.random()));
  }

function getRandomIntInRange(a, b){
    return Math.floor(Math.random() * b) + a;
}

/**
 *  Needed a range function ¯\_(ツ)_/¯.
 * @param {*} start 
 * @param {*} stop 
 * @param {*} step 
 */
function range(start, stop, step) {
  var a = [start], b = start;
  while (b < stop) {
      a.push(b += step || 1);
  }
  return a;
}