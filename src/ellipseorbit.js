class EllipseOrbit {
    constructor(radius, x, y, focusDirection){
        this.xRadius = radius * x;
        this.yRadius = radius * y;
        var linearEccentricity = focusDirection * Math.sqrt(Math.abs(Math.pow(this.xRadius, 2) - Math.pow(this.yRadius, 2))); // center to focus distance
        this.centerX = this.xRadius > this.yRadius ? linearEccentricity : 0;
        this.centerY = this.xRadius < this.yRadius ? linearEccentricity : 0;
        //this._rotation = rot;

        var curve = new THREE.EllipseCurve(
            this.centerX, this.centerY,
            this.xRadius, this.yRadius,           // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
          );
          
        var points = curve.getPoints( 50 );
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
        
        // Create the final object to add to the scene
        this.line = new THREE.Line( geometry, material );
        this.line.rotation.x = Math.PI / 2;
    }
}