class Generator {
  constructor(confMap) {

    this.confMap = confMap;

    // Let the [] indicate a child
    this.rules = {
      // Star
      'S': [
        {
          probability: 0.3,
          value: 's[L][R][R][R][R][G][G][R][G][G]'
        },
        {
          probability: 0.3,
          value: 's[L][R][R][R][G][G][G][G]'
        },
        {
          probability: 0.3,
          value: 's[L][R][R][R][G][G]'
        },
        {
          probability: 0.1,
          value: 's[L][R][R][R][G][G][G]'
        }
      ],

      // Planets
      'P': [
        {
          probability: 1 / 3,
          value: 'R'
        },
        {
          probability: 1 / 3,
          value: 'G'
        },
        {
          probability: 1 / 3,
          value: 'L'
        }
      ],

      // Rocky bodies
      'R': [
        // This is the end node, a leaf
        {
          probability: 0.5,
          value: 'r'
        },
        {
          probability: 0.3,
          value: 'r[M]'
        },
        {
          probability: 0.17,
          value: 'r[M][M]'
        },
        {
          probability: 0.03,
          value: 'r[M][M][M]'
        }
      ],

      // Lava planet
      'L': [
        {
          probability: 1.0,
          value: 'l'
        },
      ],

      // Gas bodies
      'G': [
        {
          probability: 0.3,
          value: 'g[M][M]'
        },
        {
          probability: 0.6,
          value: 'g[M][M][M]'
        },
        {
          probability: 0.1,
          value: 'g[M][M][M][R]'
        }
      ],

      // Moons
      'M': [
        {
          probability: 1.0,
          value: 'm'
        },
      ],

      // Distributed bodies
      // Asteroid belt
      'A': [

      ],

      // Rings
      'I': [

      ]
    };

    this.state = '';
  }

  generate(seed) {
    Math.seedrandom(seed);
    this.state = this._iterateSystem('S', 5);

    return this._generateSystem(this.state);
  }

  /**
   * Rewrite the system the number of iterations times.
   */
  _iterateSystem(state, iterations) {

    for (var i = 0; i < iterations; i++) {
      state = this._rewriteSystem(state);
    }

    //This outputs the final system:
    console.log("L-system structure: ", state);

    return state;
  }

  /**
   * This function should rewrite the system, by applying the stochastic rules to the entire state.
   */
  _rewriteSystem(state) {
    var newState = '';
    var probability = 0;
    var runningProbability = 0;
    var value, x;

    for (var i = 0; i < state.length; i++) {
      if (this.rules[state[i]] != undefined) {

        //Currently we just assign the first matching rule's value (right side).
        value = this.rules[state[i]][0].value;

        probability = Math.random();
        runningProbability = 0;
        for (var rule of this.rules[state[i]]) {
          runningProbability += rule.probability;

          if (probability < runningProbability) {
            // We replace the parameters inside the value
            value = this._replaceRuleParameters(rule.value, rule.ranges, rule.rangee);
            break;
          }

        }


        // Replace the current symbol with the value.
        newState += value;
      }

      else {
        //No matching rule, just copy the current symbol.
        newState += state[i];
      }
    }

    return newState;
  }

  _replaceRuleParameters(ruleRight, lower, upper) {
    if (typeof lower == 'undefined')
      lower = 0;

    if (typeof upper == 'undefined')
      upper = 0;

    var splitStr = ruleRight.split('z');  // We split the string with "z"
    var resultStr = splitStr[0];          //Here we store the result

    for (var i = 1; i < splitStr.length; ++i) {
      resultStr += Math.floor(Math.random() * (upper - lower + 1)) + lower;
      resultStr += splitStr[i];
    }

    return resultStr;
  }

  _generateSystem(state) {
    var current;
    var currentDistance = 3800.0;

    var parents = [];
    var scales = [];
    var distance = [];
    var distLevel = [];

    for (var i = 0; i < state.length; i++) {
      switch (state[i]) {
      case ('s'):
        current = new Star(this.confMap);

        if (parents.length > 0)
          parents[parents.length - 1].add(current);

        break;

      case ('r'):

        current = new TerraPlanet(this.confMap, currentDistance);

        if (parents.length > 0)
          parents[parents.length - 1].add(current);

        // Change the parent's current distance
        distance[parents.length - 1] *= 1.9;

        break;

      case ('l'):

        current = new LavaPlanet(this.confMap, currentDistance);

        if (parents.length > 0)
          parents[parents.length - 1].add(current);

        // Change the parent's current distance
        distance[parents.length - 1] *= 1.9;

        break;

      case ('g'):

        current = new TerraPlanet(this.confMap, currentDistance);

        if (parents.length > 0)
          parents[parents.length - 1].add(current);

        // Change the parent's current distance
        distance[parents.length - 1] *= 2.6;

        break;

      case ('m'):

        current = new Moon(this.confMap, currentDistance);

        if (parents.length > 0)
          parents[parents.length - 1].add(current);

        // Change the parent's current distance
        distance[parents.length - 1] *= 1.7;

        break;

      case ('['):

        parents.push(current);
        distance.push(currentDistance);

        currentDistance = Math.pow(currentDistance, 0.55) + current.size;

        break;

      case (']'):

        current = parents.pop();
        currentDistance = distance.pop();

        break;
      }
    }

    return current;
  }
}
