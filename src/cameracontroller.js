class State {
  constructor(body, index) {
    this._body = body;
    this._index = index;
  }

  get index() {
    return this._index;
  }

  set index(newIndex) {
    this._index = newIndex;
  }

  get body() {
    return this._body;
  }

  set body(newBody) {
    this._body = newBody;
  }

  getChildAt(i) {
    return this._body.children[i];
  }

  getChild() {
    return this.getChildAt(this._index);
  }

  getNextChild() {
    // Increment
    this._index += 1;
    this._index %= this.length;

    return this.getChild();
  }

  get length() {
    return this._body.children.length;
  }
}

class CameraController {
  constructor(renderer, core, width, height) {
    this._core = core;
    this._renderer = renderer;
    this._width = width;
    this._height = height;
    this._maincam = new Camera(width, height, camtype.MAIN, controltype.FLY);

    this._stack = [];
    this._state = new State(this._core, 0);
    this._currentchild = 0;

    this._currentcam = this._maincam;

    // Movement
    this._clock = new THREE.Clock();
    this._delta = this._clock.getDelta();

    // Internal flags
    this._explorer = false;
  }

  up() {
    // Get the current camera from stack
    this._state = this._stack.pop();

    // If no cameras in stack, set to main camera and turn of the explorer mode
    if (this._state == null) {
      this._state = new State(this._core, 0);
      this._explorer = false;
    }

    this.nextcam(true);
  }

  down() {
    // If in explorer mode (attached to planet)
    if (this._explorer) {
      // If current body exists
      if (this._state != null) {
        // We want to traverse the bodies with children only
        if (this._state.getChild().children.length > 0) {
          this._stack.push(this._state);
          var previous = this._state;
          this._state = new State(this._state.getChild(), 0);

          // Switch to new camera
          this.nextcam();
        }
      }

      // If doesn't exist, set to core
      else {
        this._state = new State(this._core, 0);
      }

    }

    else {
      // When we go down, we want to be in explorer mode
      this._explorer = true;

      // Switch to new camera
      this.nextcam();
    }

  }

  _camswitch(cam) {
    this._currentcam.controls.enabled = false;
    cam.controls.enabled = true;
    this._currentcam = cam;
  }

  nextcam(dontincrement = false) {
    if (!this._explorer) {
      this._camswitch(this._maincam);
    }

    else if (this._state.length > 0) {
      var celestialCam;

      // Get the cam
      if (dontincrement)
        celestialCam = this._state.getChild().cam;

      else
        celestialCam = this._state.getNextChild().cam;

      this._camswitch(celestialCam);
    }
  }

  update(direction, mouse) {
    this._delta = this._clock.getDelta();
    this._currentcam.update(delta);
  }

  refreshDelta() {
    this._delta = this._clock.getDelta();
  }

  topview(sysRadius) {
    this._currentcam.camera.rotation.set(-Math.PI / 2, 0, 0);
    this._currentcam.position.x = 0;
    this._currentcam.position.z = 0;
    this._currentcam.position.y = sysRadius / Math.tan(toRad(this._currentcam.camera.fov / 2));
    this._currentcam.update();
  }

  get current() {
    return this._currentcam;
  }
}
