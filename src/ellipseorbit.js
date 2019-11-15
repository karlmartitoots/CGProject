class EllipseOrbit {
    constructor(radius, x, y){
        this._xRadius = radius * x;
        this._yRadius = radius * y;
        //this._rotation = rot;
        var curve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            this._xRadius, this._yRadius,           // xRadius, yRadius
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