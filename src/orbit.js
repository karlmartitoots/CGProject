class Orbit {
    constructor(radius, x, z, focusDirection, revSpeed){
        this.radius = radius;
        this.xRadius = radius * x;
        this.zRadius = radius * z;

        // center to focus distance
        var linearEccentricity = focusDirection * Math.sqrt(Math.abs(Math.pow(this.xRadius, 2) - Math.pow(this.zRadius, 2)));
        this.xCenter = this.xRadius > this.zRadius ? linearEccentricity : 0;
        this.zCenter = this.xRadius < this.zRadius ? linearEccentricity : 0;

        // Semi-major and semi-minor
        if (this.xRadius > this.zRadius) {
          this.semiMajor = this.xRadius;
          this.semiMinor = this.zRadius;
        }

        else {
          this.semiMajor = this.zRadius;
          this.semiMinor = this.xRadius;
        }

        // Get orbital period and mean velocity
        // Keplers third law
        this.period = Math.sqrt(Math.pow(this.semiMajor, 3)) * 100;// * 0.000007496;
        this.meanVelocity = 2 * Math.PI / this.period;
        this.abn = this.semiMajor * this.semiMinor * this.meanVelocity;

        // Movement control
        this.currentAngle = 0;
        this.orbitSpeed = revSpeed;

        var curve = new THREE.EllipseCurve(
          this.xCenter, this.zCenter,
          this.xRadius, this.zRadius,
          0,  2 * Math.PI,  // aStartAngle, aEndAngle
          false,            // aClockwise
          0                 // aRotation
        );

        var points = curve.getPoints(150);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);

        var material = new THREE.LineBasicMaterial({
          color: 0xff0000
        });

        // Create the final object to add to the scene
        this.line = new THREE.Line(geometry, material);
        this.line.rotation.x = Math.PI / 2;
    }

    move(delta, subject) {
      // Get distance from focus
      var radius = Math.sqrt(
        Math.pow(subject.position.x + this.xCenter, 2) +
        Math.pow(subject.position.z + this.zCenter, 2)
      );

      // Get the dphi/dt = abn / r**2
      var angularVelocity = this.abn / Math.pow(radius, 2);

      // revolve in polar coords
      if (isFinite(angularVelocity)) {
        this.currentAngle += angularVelocity * delta * this.orbitSpeed;
        this.currentAngle %= Math.PI * 2;

        subject.position.x = this.xRadius * Math.cos(this.currentAngle);
        subject.position.z = this.zRadius * Math.sin(this.currentAngle);

        subject.position.x += this.xCenter;
        subject.position.z += this.zCenter;
      }
    }
}
