class Orbit {
  constructor(axis1, axis2, rotation, revSpeed, tilt) {
      this.tilt = tilt;

      if (axis1 > axis2) {
        this.semiMajor = axis1;
        this.semiMinor = axis2;
      }

      else {
        this.semiMajor = axis2;
        this.semiMinor = axis1;
      }

      // center to focus distance
      this.linearEccentricity = Math.sqrt(Math.abs(Math.pow(this.semiMajor, 2) - Math.pow(this.semiMinor, 2)));

      // Get orbital period and mean velocity
      // Keplers third law
      this.period = Math.sqrt(Math.pow(this.semiMajor, 3)) * 100;// * 0.000007496;
      this.meanVelocity = 2 * Math.PI / this.period;
      this.abn = this.semiMajor * this.semiMinor * this.meanVelocity;

      // Movement control
      this.currentAngle = 0;
      this.orbitSpeed = revSpeed;
      this.up = new THREE.Vector3(0, 1, 0);
      this.rotation = rotation * Math.PI * 2;

      var curve = new THREE.EllipseCurve(
        this.linearEccentricity, 0,
        this.semiMajor, this.semiMinor,
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
      );

      var points = curve.getPoints(600);
      var geometry = new THREE.BufferGeometry().setFromPoints(points);

      var material = new THREE.LineBasicMaterial({
        color: 0xff0000
      });

      // Create the final object to add to the scene
      this.line = new THREE.Line(geometry, material);
      this.line.rotation.x = Math.PI / 2;
      this.line.rotation.z = -this.rotation;
  }

  move(delta, subject) {
    // Get distance from focus
    var radius = Math.sqrt(
      Math.pow(subject.position.x + this.linearEccentricity, 2) +
      Math.pow(subject.position.z, 2)
    );

    // Get the dphi/dt = abn / r**2
    var angularVelocity = this.abn / Math.pow(radius, 2);

    // revolve in polar coords
    if (isFinite(angularVelocity)) {
      this.currentAngle += angularVelocity * delta * this.orbitSpeed;
      this.currentAngle %= Math.PI * 2;

      subject.position.x = this.semiMajor * Math.cos(this.currentAngle);
      subject.position.z = this.semiMinor * Math.sin(this.currentAngle);

      subject.position.x += this.linearEccentricity;

      subject.position.applyAxisAngle(this.up, this.rotation);
    }
  }

  toggle() {
    this.line.visible = !this.line.visible;
  }

  get axialtilt() {
    var t = /*(this.tilt / (Math.PI / 2.0)) **/ Math.sin(this.currentAngle - this.rotation + Math.PI / 2.0);
    return t;
  }
}
