/**
 * @author WestLangley / http://github.com/WestLangley
 * @author zz85 / http://github.com/zz85
 * @author bhouston / http://exocortex.com
 *
 * Creates an arrow for visualizing directions
 *
 * Parameters:
 *  dir - Vector3
 *  origin - Vector3 (assumed to be normalized)
 *  length - Number
 *  color - color
 *  headLength - Number
 *  headWidth - Number
 *  LineWidth - Number
 *  transparent - Boolean
 *  opacity - Number
 */

/* modified to include LineWidth */

'use strict';//Removes default binding for this

var Arrow = function (parameters) {//!!! Confused about how the constructor determines parameter order

    // dir is assumed to be normalized

    THREE.Object3D.call( this );//Necessary line for creating custom objects in three
    //Initializes the basic object properties

    if ( parameters === undefined ) parameters = {}; //By default sets parameters to an empty array
    //in order to call hasOwnProperty() on it

    this.position = parameters.hasOwnProperty("origin") ?//Arrow's position is defined by a vector pointing to the tail
	parameters["origin"] : new THREE.Vector3(0,0,0);//By default the position is the origin

    var dir, length;//Apparently dir is expressed in local coordinates rather than world coordinates
    if(parameters.hasOwnProperty("endpoint")) {
	dir = parameters["endpoint"].clone().sub(this.position);//dir is the direction vector for an arrow
  //calculated by performing vector subtraction between the endpoint and starting point vectors
	length = dir.length();
	dir.normalize();//Direction vector is a unit vector
    }
    else {//Alternatively you can manually define direction and length
	dir = parameters.hasOwnProperty("dir") ?
     	    parameters["dir"] : new THREE.Vector3(1,0,0);
	length = parameters.hasOwnProperty("length") ?
	    parameters["length"] : 1;
    }


    var color =  parameters.hasOwnProperty("color") ?  parameters["color"] :
	0xffff00;

    this.addHead = parameters.hasOwnProperty("addHead") ?//You can choose whether or not to have an arrow head
	parameters["addHead"] :  true;
    this.headLength = parameters.hasOwnProperty("headLength") ?
	parameters["headLength"] :  0.2*length;//By default head length of 1/5 of total length
    this.headWidth = parameters.hasOwnProperty("headWidth") ?
	parameters["headWidth"] :  0.2*this.headLength;//By default head width of 1/5 of head length
    this.headLengthMaxFraction = parameters.hasOwnProperty("headLengthMaxFraction") ?//!!! Unknown parameter
	parameters["headLengthMaxFraction"] :  0.6;
    this.headWidthMaxRatio = parameters.hasOwnProperty("headWidthMaxRatio") ?//!!! Unknown parameter
	parameters["headWidthMaxRatio"] :  2;
    this.headLengthActual=this.headLength;//Unknown why headLengthActual is a necessary property

    // use cylinder rather than line for arrow
    this.cylinderForLine = parameters.hasOwnProperty("cylinderForLine") ?
	parameters["cylinderForLine"]: false;//By default uses line rather than cylinder
    var cylinderDetail = parameters.hasOwnProperty("cylinderDetail") ?
	parameters["cylinderDetail"]: 4;//Determines how chunky the cylinder looks
  //Higher integers result in greater smoothness

    // default value of lineWidth depends on if use cylinder for line
    var lineWidth = this.cylinderForLine ? 0.1*this.headWidth : 1;
    lineWidth = parameters.hasOwnProperty("lineWidth") ?
	parameters["lineWidth"] :  lineWidth;

    var arrowDetail = parameters.hasOwnProperty("arrowDetail") ?
	parameters["arrowDetail"] :  5;

    this.addTail = parameters.hasOwnProperty("addTail") ?
	parameters["addTail"] :  false;//!!!Why would addTail be set by default to false?
    this.tailLength = parameters.hasOwnProperty("tailLength") ?
	parameters["tailLength"] :  0.2*this.headLength;
    this.tailWidth = parameters.hasOwnProperty("tailWidth") ?
	parameters["tailWidth"] :  0.8*this.headWidth;
    this.tailLengthMaxFraction = parameters.hasOwnProperty("tailLengthMaxFraction") ?
	parameters["tailLengthMaxFraction"] :  0.2;
    this.tailWidthMaxRatio = parameters.hasOwnProperty("tailWidthMaxRatio") ?
	parameters["tailWidthMaxRatio"] :  6;

    var lambertMaterial = parameters.hasOwnProperty("lambertMaterial") ?
	parameters["lambertMaterial"] :  false;//Determines how the light reflects off the object
  //Pros: Speed Cons: Accuracy

    var transparent = parameters.hasOwnProperty("transparent") ?
	parameters["transparent"] :  false;
    var opacity = parameters.hasOwnProperty("opacity") ?
	parameters["opacity"] :  1;


    if(this.cylinderForLine) {
	var cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, cylinderDetail);
	cylinderGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );//Translates cylinder 0.5 in the y direction
	var lineMaterial;
	if(lambertMaterial) {
	    lineMaterial = new THREE.MeshLambertMaterial({ color: color, ambient: color, transparent: transparent, opacity: opacity});
	}
	else {
	    lineMaterial = new THREE.MeshBasicMaterial({color: color});
	}

	this.line = new THREE.Mesh( cylinderGeometry, lineMaterial);
	this.line.scale.set(lineWidth,1,lineWidth);//!!!Unknown why these scaling parameters were chosen
    }
    else {
	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	lineGeometry.vertices.push( new THREE.Vector3( 0, 1, 0 ) );//This default direction doesn't matter. Direction will be changed manually later
	this.line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color: color, linewidth: lineWidth } ) );

    }

    this.line.matrixAutoUpdate = false;//Done in order to manually control when the matrix updates
    this.add( this.line );//The add method makes the paramter object a child of the parent.

    if(this.addHead) {
	var coneGeometry = new THREE.CylinderGeometry( 0, 0.5, 1, arrowDetail, 1 );
	//coneGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, - 0.5, 0 ) ); //Apprently the author didn't want to shift the head down

	var coneMaterial;
	if(lambertMaterial) {
	    coneMaterial = new THREE.MeshLambertMaterial({ color: color, ambient: color, transparent: transparent, opacity: opacity});
	}
	else {
	    coneMaterial = new THREE.MeshBasicMaterial({color: color});
	}
	this.cone = new THREE.Mesh( coneGeometry, coneMaterial);
	this.cone.matrixAutoUpdate = false;
	this.add( this.cone );
    }

    if(this.addTail) {
	var tailGeometry = new THREE.CylinderGeometry( 0.5, 0.5, 1, arrowDetail, 1 );
	tailGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.499, 0 ) );//!!!Not 0.5 for some reason
	var tailMaterial;
	if(lambertMaterial) {
	    tailMaterial = new THREE.MeshLambertMaterial({ color: color, ambient: color, transparent: transparent, opacity: opacity});
	}
	else {
	    tailMaterial = new THREE.MeshBasicMaterial({color: color});
	}
	this.tail = new THREE.Mesh( tailGeometry, tailMaterial );
	this.tail.matrixAutoUpdate = false;
	this.add(this.tail);
    }


    this.setDirection( dir );
    this.setLength( length );


};

Arrow.prototype = Object.create( THREE.Object3D.prototype );//!!!

Arrow.prototype.setEndpoint = function () {
    var dir = new THREE.Vector3();
    var length;

    return function (endpoint, headLength, headWidth, tailLength, tailWidth ) {

	dir.copy(endpoint).sub(this.position);//I am pretty sure this sets direction to (endpoint - current position)

	length = dir.length();
	dir.normalize();

	this.setLength(length, headLength, headWidth, tailLength, tailWidth);
	this.setDirection(dir);

    };
}();//!!! Why is there an extra set of parantheses here?


Arrow.prototype.setDirection = function () {

    var axis = new THREE.Vector3();
    var radians;

    return function ( dir ) {

	// dir is assumed to be normalized

	if ( dir.y > 0.99999 ) {//!!! Unknown purpose for these if blocks

	    this.quaternion.set( 0, 0, 0, 1 );

	} else if ( dir.y < - 0.99999 ) {

	    this.quaternion.set( 1, 0, 0, 0 );

	} else {

	    axis.set( dir.z, 0, - dir.x ).normalize();

	    radians = Math.acos( dir.y );//Radians is apparently the angle near the arrow head

	    this.quaternion.setFromAxisAngle( axis, radians );

	}

    };

}();

Arrow.prototype.setLength = function ( length, headLength, headWidth, tailLength, tailWidth ) {

    var manualHeadLength=false;
    if ( headLength === undefined ) {
	headLength = this.headLength;
    }
    else {
	this.headLength = headLength;
	manualHeadLength=true;
    }

    if(!manualHeadLength) {
	headLength = Math.min(length*this.headLengthMaxFraction,headLength);//!!! Unkown purpose
    }
    this.headLengthActual = headLength

    this.line.scale.y = length-headLength;
    this.line.updateMatrix();

    if(this.addHead) {
	var manualHeadWidth = false;
	if ( headWidth === undefined ) {
	    headWidth = this.headWidth;
	}
	else {
	    this.headWidth = headWidth;
	    manualHeadWidth = true;
	}
	if(!manualHeadWidth) {
	    headWidth = Math.min(headLength*this.headWidthMaxRatio, headWidth);
	}
	this.cone.scale.set( headWidth, headLength, headWidth );
	this.cone.position.set(0,length-headLength/2,0);
	this.cone.updateMatrix();
    }

    if(this.addTail) {
	var manualTailLength = false;
	if ( tailLength === undefined ) {
	    tailLength = this.tailLength;
	}
	else {
	    this.tailLength = tailLength;
	    manualTailLength = true;
	}
	if(!manualTailLength) {
	    tailLength = Math.min(length*this.tailLengthMaxFraction,tailLength);
	}
	var manualTailWidth = false;
	if ( tailWidth === undefined ) {
	    tailWidth = this.tailWidth;
	}
	else {
	    this.tailWidth = tailWidth;
	    manualTailWidth = true;
	}
	if(!manualTailWidth) {
	    tailWidth = Math.min(tailLength*this.tailWidthMaxRatio, tailWidth);
	}
	this.tail.scale.set( tailWidth, tailLength, tailWidth );
	this.tail.position.set(0,0,0);
	this.tail.updateMatrix();

    }

};

Arrow.prototype.setColor = function ( color ) {

    this.line.material.color.set( color );
    if(this.addHead) {
	this.cone.material.color.set( color );
    }
    if(this.addTail) {
	this.tail.material.color.set( color ) ;
    }
};


Arrow.prototype.returnLength = function() {
    return this.line.scale.y + this.headLengthActual;//Length of tail + head
}

Arrow.prototype.returnTipPosition = function() {
    var tipPosition = new THREE.Vector3(0, this.line.scale.y+ this.headLengthActual,0);
    this.updateMatrixWorld();//!!!Unknown what exactly this method is supposed to do
    this.localToWorld(tipPosition);//Converts the local coordinates of tipPosition to world coordinates
    return tipPosition;
}

Arrow.prototype.setTipPosition = function(pos, initialize) {

    // Initialize should be set if called before render has
    // been called to update matrix world of parent and arrow
    // to reflect any transformations made to parent of the sphere
    // or the arrow.  Then localToWorld and worldToLocal
    // will function as expected.
    if(initialize) {
	if(this.parent) {//!!!Why would the arrow have a parent object?
    //Also we might be able to skip this code because React automatically updates child objects
	    this.parent.updateMatrixWorld();
	}
	else {
	    this.updateMatrixWorld();
	}
    }

    // find position in coordinates of arrow parent
    var dir = pos.clone();
    if(this.parent) {
    	this.parent.worldToLocal(dir);
    }
    dir.sub(this.position);
    var length = dir.length();
    dir.divideScalar(length);//!!!Uses different code to normalize direction vector

    this.setDirection( dir );
    this.setLength( length );

    if(this.dragTipSphere) {
	this.dragTipSphere.adjustPosition()
    }
}


// return an invisible sphere around the arrow tip
// that can be added to a drag.objects and will move the arrow
// tip to its new location upon being moved

Arrow.prototype.returnDragTipSphere= function() {

    if(this.dragTipSphere) {
	return this.dragTipSphere;
    }

    var sphereGeometry = new THREE.SphereGeometry( 0.5 );
    this.dragTipSphere = new THREE.Mesh( sphereGeometry, new THREE.MeshBasicMaterial( ) );

    this.dragTipSphere.scale.set(this.headLength*2,this.headLength*2,this.headLength*2);

    this.dragTipSphere.draggable=true;
    this.dragTipSphere.visible=false;

    // find position of the cone in coordinates of arrow parent
    // update arrow matrix world since this is probably called before render()
    this.updateMatrixWorld();
    this.dragTipSphere.position.set(0, this.line.scale.y+ this.headLength/2.0,0);//Sphere is in the center of arrow head
    this.localToWorld(this.dragTipSphere.position);
    if(this.addHead) {
	this.dragTipSphere.represents = this.cone;
    }

    var dir = new THREE.Vector3();
    var pos = new THREE.Vector3();

    // create local variables so can refer to arrow and sphere
    // inside listener function
    var thearrow = this;
    var dragTipSphere = this.dragTipSphere;


    this.dragTipSphere.addEventListener('moved', function(event) {
	dragTipSphere.adjustArrow(event.initialize)
    });


    this.dragTipSphere.adjustArrow = function(initialize) {//!!! Is event.initialize manually set?

	// Initialize should be set if called before render has
	// been called to update matrix world of parent and arrow
	// to reflect any transformations made to parent of the sphere
	// or the arrow.  Then localToWorld and worldToLocal
	// will function as expected.
	if(initialize) {
	    if(dragTipSphere.parent) {
		dragTipSphere.parent.updateMatrixWorld();
	    }
	    if(thearrow.parent) {
		thearrow.parent.updateMatrixWorld();
	    }
	    else {
		thearrow.updateMatrixWorld();
	    }
	}

    	// find position of the sphere in coordinates of arrow parent
	dir.copy(dragTipSphere.position);
	if(dragTipSphere.parent) {
	    dragTipSphere.parent.localToWorld(dir);
	}
	if(thearrow.parent) {
    	    thearrow.parent.worldToLocal(dir);
	}
    	dir.sub(thearrow.position);
    	var length = dir.length();
    	dir.divideScalar(length);//!!!Again direction is normalized differently
    	length += thearrow.headLengthActual/2.0;

    	thearrow.setDirection( dir );
    	thearrow.setLength( length );

    }

    // set position of dragTipSphere to position of arrow tip
    // adjusting for transformations of arrow and sphere parent
    this.dragTipSphere.adjustPosition = function() {
	if(dragTipSphere.parent) {
	    dragTipSphere.parent.updateMatrixWorld();
	}
	thearrow.updateMatrixWorld();

    	// find position of the cone in coordinates of sphere parent
	pos.set(0, thearrow.line.scale.y+ thearrow.headLengthActual/2.0,0);//!!!Unknown exactly what this block is doing
    	thearrow.localToWorld(pos);
	if(dragTipSphere.parent) {
	    dragTipSphere.parent.worldToLocal(pos);
	}
	dragTipSphere.position.copy(pos);

    }

    // create listeners to make sure dragTipSphere is aligned
    // with arrow tip after dragTipSphere or arrow is added
    // to some object
    //!!!Interesting why this is needed. How would adding an object affect the dragTipSphere?
    this.addEventListener('added', function(event) {
	dragTipSphere.adjustPosition();
    });

    this.dragTipSphere.addEventListener('added', function(event) {
	dragTipSphere.adjustPosition();
    });


    return this.dragTipSphere;
}


// return an invisible sphere around the arrow tail
// that can be added to a drag.objects and will move the arrow tail
// to its new location upon being moved (preserving location of arrow tip)

Arrow.prototype.returnDragTailSphere= function() {//Similar to function above

    if(this.dragTailSphere) {
	return this.dragTailSphere;
    }


    var sphereGeometry = new THREE.SphereGeometry( 0.5 );
    this.dragTailSphere = new THREE.Mesh( sphereGeometry, new THREE.MeshBasicMaterial( ) );
    this.dragTailSphere.scale.set(this.tailWidth*2,this.tailWidth*2,this.tailWidth*2);


    this.dragTailSphere.draggable=true;
    this.dragTailSphere.visible=false;
    this.updateMatrixWorld();
    this.dragTailSphere.position.set(0,0,0);
    this.localToWorld(this.dragTailSphere.position);
    if(this.tail) {
	this.dragTailSphere.represents = this.tail;
    }

    // create local variables so can refer to arrow and sphere
    // inside listener function
    var thearrow = this;
    var dragTailSphere = this.dragTailSphere;

    var dir = new THREE.Vector3();
    var pos = new THREE.Vector3();


    this.dragTailSphere.addEventListener('moved', function(event) {
	dragTailSphere.adjustArrow(event.initialize)
    });


    this.dragTailSphere.adjustArrow = function(initialize) {

	// Since the moved event could be called multiple times in
	// one render cycle (due to many mouse move events)
	// need to update the world matrix of the arrow to reflect
	// any movements of the arrow in the current render cycle
	// (updateMatrixWorld is called automatically by render)
    	thearrow.updateMatrixWorld();

	// Initialize should be set if called before render has
	// been called to update matrix world of parent to reflect
	// any transformations made to parent of the sphere.
	// Then localToWorld and worldToLocal will function as expected.
	if(initialize) {
	    if(dragTailSphere.parent) {
		dragTailSphere.parent.updateMatrixWorld();
	    }
	    if(thearrow.parent) {
		thearrow.parent.updateMatrixWorld();
	    }
	}

    	// find position of the cone in coordinates of arrow parent
    	dir.copy(thearrow.cone.position);
    	thearrow.localToWorld(dir);
	pos.copy(dragTailSphere.position);
	if(dragTailSphere.parent) {
	    dragTailSphere.parent.localToWorld(pos);
	}
	if(thearrow.parent) {
    	    thearrow.parent.worldToLocal(dir);
	    thearrow.parent.worldToLocal(pos);
	}
    	dir.sub(pos);

    	var length = dir.length();
    	dir.divideScalar(length);
    	length += thearrow.headLengthActual/2.0;

    	thearrow.position.copy(pos);

    	thearrow.setDirection( dir );
    	thearrow.setLength( length );

    }


    this.dragTailSphere.adjustPosition = function() {
	if(dragTailSphere.parent) {
	    dragTailSphere.parent.updateMatrixWorld();
	}
	thearrow.updateMatrixWorld();

    	// find position of the cone in coordinates of sphere parent
    	pos.set(0,0,0);
    	thearrow.localToWorld(pos);
	if(dragTailSphere.parent) {
	    dragTailSphere.parent.worldToLocal(pos);
	}
	dragTailSphere.position.copy(pos);

    }

    // create listeners to make sure dragTailSphere is aligned
    // with arrow tip after dragTailSphere or arrow is added
    // to some object
    this.addEventListener('added', function(event) {
	dragTailSphere.adjustPosition();
    });

    this.dragTailSphere.addEventListener('added', function(event) {
	dragTailSphere.adjustPosition();
    });

    return this.dragTailSphere;

}
