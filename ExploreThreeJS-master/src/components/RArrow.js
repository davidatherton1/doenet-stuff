import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";

/*
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

 class Head extends Component {
   constructor(props) {
     super(props);
     if(props.state.headProps.addHead) {
     	var coneGeometry = new THREE.CylinderGeometry( 0, 0.5, 1, props.state.arrowDetail, 1 );

     	var coneMaterial;
     	if(props.state.lambertMaterial) {
     	    coneMaterial = new THREE.MeshLambertMaterial({ color: props.state.color, ambient: props.state.color, transparent: props.state.transparent, opacity: props.state.opacity});
     	}
     	else {
     	    coneMaterial = new THREE.MeshBasicMaterial({color: props.state.color});
     	}
     	this.cone = new THREE.Mesh( coneGeometry, coneMaterial);
     	this.cone.matrixAutoUpdate = false;
     }
   }

   setScale(l, x, y, z) {
     this.cone.scale.set(x, y, z);
     this.cone.position.set(0, l-y/2, 0);
     this.cone.updateMatrix();
   }

   setColor(color) {
     this.cone.material.color.set(color);
   }

   componentDidMount() {
     if(this.props.state.headProps.addHead) this.props.adder(this.cone);
   }
   render() {return(null)}

 }

 class Line extends Component {
   constructor(props) {
     super(props);
     if(props.state.lineProps.cylinderForLine) {
     	var cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, props.state.cylinderDetail);
     	cylinderGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );//Translates cylinder 0.5 in the y direction
     	var lineMaterial;
     	if(props.state.lambertMaterial) {
     	    lineMaterial = new THREE.MeshLambertMaterial({ color: props.state.color, ambient: props.state.color, transparent: props.state.transparent, opacity: props.state.opacity});
     	}
     	else {
     	    lineMaterial = new THREE.MeshBasicMaterial({color: props.state.color});
     	}

     	this.line = new THREE.Mesh( cylinderGeometry, lineMaterial);
     	this.line.scale.set(props.state.lineWidth, 1, props.state.lineWidth);
         }
         else {
     	var lineGeometry = new THREE.Geometry();
     	lineGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
     	lineGeometry.vertices.push( new THREE.Vector3( 0, 1, 0 ) );//This default direction doesn't matter. Direction will be changed manually later
     	this.line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color: props.state.color, linewidth: props.state.lineWidth } ) );

      this.line.matrixAutoUpdate = false;//Done in order to manually control when the matrix updates
    }

   }

   setYScale(scale) {
     this.line.scale.y = scale;
     this.line.updateMatrix();
   }

   setColor(color) {
     this.line.material.color.set(color);
   }

   returnYScale() {
     return this.line.scale.y;
   }

   componentDidMount() {
     this.props.adder(this.line);
   }
   render() {return(null)}

 }

 class Tail extends Component {
   constructor(props) {
     super(props);
     if(props.state.tailProps.addTail) {
     	var tailGeometry = new THREE.CylinderGeometry( 0.5, 0.5, 1, props.state.arrowDetail, 1 );
     	tailGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.499, 0 ) );
     	var tailMaterial;
     	if(props.state.lambertMaterial) {
     	    tailMaterial = new THREE.MeshLambertMaterial({ color: props.state.color, ambient: props.state.color, transparent: props.state.transparent, opacity: props.state.opacity});
     	}
     	else {
     	    tailMaterial = new THREE.MeshBasicMaterial({color: props.state.color});
     	}
     	this.tail = new THREE.Mesh( tailGeometry, tailMaterial );
     	this.tail.matrixAutoUpdate = false;
     }
   }

   setScale(x, y, z) {
     this.tail.scale.set(x, y, z);
     this.tail.position.set(0,0,0);
     this.tail.updateMatrix();
   }

   setColor(color) {
     this.tail.material.color.set(color);
   }

   componentDidMount() {
     if(this.props.state.tailProps.addTail) this.props.adder(this.tail);
   }
   render() {return null}
 }

 // class DragTipSphere extends Component {
 //   constructor(props) {
 //     super(props);
 //
 //     var sphereGeometry = new THREE.SphereGeometry(0.5);
 //     this.sphere = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial());
 //
 //     var scale = props.state.headProps.headLength*2;
 //     this.sphere.scale.set(scale, scale, scale);
 //
 //     this.sphere.draggable = true;
 //     this.sphere.visible = false;
 //
 //     this.sphere.position.set(0, props.state.center, 0);
 //     props.state.arrow.localToWorld(this.sphere.position);
 //     if(props.state.headProps.addHead) {
 //       this.sphere.represents =
 //     }
 //   }
 // }

class Arrow extends Component {
  constructor (props) {
    super(props);

    this.arrow = new THREE.Object3D();//Initializes skeleton for Arrow as a custom three object

    if (props["parameters"]) {
      this.parameters = props["parameters"];
    } else {
      this.parameters = {};
    }

    this.state = {
      dragTipSphere: false,

      headProps : {
        addHead: true,
        headLength: 0.1,
        headWidth: 0.04,
        headLengthMaxRatio: 0.6,
        headWidthMaxRatio: 2,
        headLengthActual: 0.2,
      },

      lineProps : {
        position: new THREE.Vector3(0,0,0),
        cylinderForLine: false,
      },

      tailProps : {
        addTail: false,
        tailLength: 0.04,
        tailWidth: 0.032,
        tailLengthMaxRatio: 0.2,
        tailWidthMaxRatio: 6,
      }

    }

    if(this.parameters.hasOwnProperty("origin")) this.state.lineProps.position = this.parameters["origin"];

    var dir, length;
    if(this.parameters.hasOwnProperty("endpoint")) {
      dir = this.parameters["endpoint"].clone().sub(this.state.lineProps.position);
      length = dir.length();
      dir.normalize();
    } else {
      dir = this.parameters.hasOwnProperty("dir") ?
          this.parameters["dir"] : new THREE.Vector3(1,0,0);
      length = this.parameters.hasOwnProperty("length") ?
          this.parameters["length"] : 1;
    }

    if(this.parameters.hasOwnProperty("addHead")) this.state.headProps.addHead = this.parameters["addHead"];
    this.state.headProps.headLength = this.parameters.hasOwnProperty("headLength") ?
	this.parameters["headLength"] :  0.2*length;
    this.state.headProps.headWidth = this.parameters.hasOwnProperty("headWidth") ?
	this.parameters["headWidth"] :  0.2*this.state.headProps.headLength;
    this.state.headProps.headLengthMaxFraction = this.parameters.hasOwnProperty("headLengthMaxFraction") ?
	this.parameters["headLengthMaxFraction"] :  0.6;
    this.state.headProps.headWidthMaxRatio = this.parameters.hasOwnProperty("headWidthMaxRatio") ?
	this.parameters["headWidthMaxRatio"] :  2;
    this.state.headProps.headLengthActual = this.state.headProps.headLength;

    if(this.parameters.hasOwnProperty("cylinderForLine")) this.state.lineProps.cylinderForLine = this.parameters["cylinderForLine"];




    this.state.tailProps.addTail = this.parameters.hasOwnProperty("addTail") ?
  this.parameters["addTail"] :  false;
    this.state.tailProps.tailLength = this.parameters.hasOwnProperty("tailLength") ?
  this.parameters["tailLength"] :  0.2*this.state.headProps.headLength;
    this.state.tailProps.tailWidth = this.parameters.hasOwnProperty("tailWidth") ?
  this.parameters["tailWidth"] :  0.8*this.state.headProps.headWidth;
    this.state.tailProps.tailLengthMaxFraction = this.parameters.hasOwnProperty("tailLengthMaxFraction") ?
  this.parameters["tailLengthMaxFraction"] :  0.2;
    this.state.tailProps.tailWidthMaxRatio = this.parameters.hasOwnProperty("tailWidthMaxRatio") ?
  this.parameters["tailWidthMaxRatio"] :  6;

  }

  mesh(){
    // let cylinderDetail = 1000;

    // const geometry = new THREE.CylinderGeometry(1, 1, 10, cylinderDetail);

    // const material = new THREE.MeshPhongMaterial({
    //   color: 0x00ff00,
    //   emissive: 0x072534,
    //    side: THREE.DoubleSide,
    //   flatShading: true
    // });

    // return new THREE.Mesh(geometry,material);
    return this.arrow;
  }

  setEndpoint(endpoint, headLength, headWidth, tailLength, tailWidth) {
    var dir = new THREE.Vector3();
    var length;

    dir.copy(endpoint).sub(this.state.lineProps.position);

    length = dir.length();
  	dir.normalize();

    this.setLength(length, headLength, headWidth, tailLength, tailWidth);
  	this.setDirection(dir);
  }

  setDirection(dir) {
    var axis = new THREE.Vector3();
    var radians;

    if(dir.y > 0.99999) {
      this.arrow.quaternion.set(0,0,0,1);
    } else if (dir.y < -0.99999) {
      this.arrow.quaternion.set(1,0,0,0);
    } else {
      axis.set(dir.z, 0, - dir.x).normalize();

      radians = Math.acos(dir.y);

      this.arrow.quaternion.setFromAxisAngle(axis, radians);
    }
  }

  setLength(length, headLength, headWidth, tailLength, tailWidth) {
    var manualHeadLength = false;
    if(headLength === undefined) {
      headLength = this.state.headProps.headLength;
    } else {
      this.state.headProps.headLength = headLength;
      manualHeadLength = true;
    }

    if(!manualHeadLength) {
      headLength = Math.min(length*this.state.headProps.headLengthMaxFraction, headLength);
    }
    this.state.headProps.headLengthActual = headLength;

    this.refs.line.setYScale(length - headLength);

    if(this.state.headProps.addHead) {
      var manualHeadWidth = false;
      if(headWidth === undefined) {
        headWidth = this.state.headProps.headWidth;
      } else {
        this.state.headProps.headWidth = headWidth;
        manualHeadWidth = true;
      }

      if(!manualHeadWidth) {
        headWidth = Math.min(headLength*this.state.headProps.headWidthMaxRatio, headWidth);
      }
      this.refs.head.setScale(length, headWidth, headLength, headWidth);
    }

    if(this.state.tailProps.addTail) {
      var manualTailLength = false;
      if (tailLength === undefined) {
        tailLength = this.state.tailProps.tailLength;
      } else {
        this.state.tailProps.tailLength = tailLength;
        manualTailLength = true;
      }
      if(!manualTailLength) {
        tailLength = Math.min(length*this.state.tailProps.tailLengthMaxFraction, tailLength);
      }
      var manualTailWidth = false;
      if(tailWidth === undefined) {
        tailWidth = this.state.tailProps.tailWidth;
      } else {
        this.state.tailProps.tailWidth = tailWidth;
        manualTailWidth = true;
      }
      if(!manualTailWidth) {
        tailWidth = Math.min(tailLength*this.tailWidthMaxRatio, tailWidth);
      }
      this.refs.tail.setScale(tailWidth, tailLength, tailWidth);
    }

  }

  setColor(color) {
    this.refs.line.setColor(color);
    if(this.state.headProps.addHead) {
      this.refs.head.setColor(color);
    }
    if(this.state.tailProps.addTail) {
      this.refs.tail.setColor(color);
    }
  }

  returnLength() {
    return this.refs.line.returnYScale() + this.state.headProps.headLengthActual;
  }

  returnTipPosition() {
    var tipPosition = new THREE.Vector3(0, this.returnLength(), 0);
    this.arrow.updateMatrixWorld();
    this.localToWorld(tipPosition);
    return tipPosition;
  }

  setTipPosition(pos, initialize) {
    if(initialize) {
      if(this.arrow.parent) {//!!!Included so I wouldn't forget, but this code block as is effectively useless. Not sure how to implement it.
        this.arrow.parent.updateMatrixWorld();
      } else {
        this.arrow.updateMatrixWorld();
      }
    }

    var dir = pos.clone();
    if(this.arrow.parent) {
      this.arrow.parent.worldToLocal(dir);
    }
    dir.sub(this.state.lineProps.position);
    var length = dir.length();
    dir.normalize();

    this.setDirection(dir);
    this.setLength(length);

    if(this.dragTipSphere) {
      this.dragTipSphere.adjustposition();
    }
  }

  componentDidMount() {
    var dir, length;
    if(this.parameters.hasOwnProperty("endpoint")) {
      dir = this.parameters["endpoint"].clone().sub(this.state.lineProps.position);
      length = dir.length();
      dir.normalize();
    } else {
      dir = this.parameters.hasOwnProperty("dir") ?
          this.parameters["dir"] : new THREE.Vector3(1,0,0);
      length = this.parameters.hasOwnProperty("length") ?
          this.parameters["length"] : 1;
    }

    this.setDirection(dir);
    this.setLength(length, this.state.headProps.headLength, this.state.headProps.headWidth, this.state.tailProps.tailLength, this.state.tailProps.tailWidth);

    this.props.adder(this.arrow);
  }
  adder(child) {
    this.arrow.add(child);
  }
  render() {
    var dir, length;
    if(this.parameters.hasOwnProperty("endpoint")) {
      dir = this.parameters["endpoint"].clone().sub(this.state.lineProps.position);
      length = dir.length();
      dir.normalize();
    } else {
      dir = this.parameters.hasOwnProperty("dir") ?
          this.parameters["dir"] : new THREE.Vector3(1,0,0);
      length = this.parameters.hasOwnProperty("length") ?
          this.parameters["length"] : 1;
    }

    var color =  this.parameters.hasOwnProperty("color") ?  this.parameters["color"] :
	0xffff00;
    var cylinderDetail = this.parameters.hasOwnProperty("cylinderDetail") ?
  this.parameters["cylinderDetail"]: 4;

    var lineWidth = this.state.lineProps.cylinderForLine ? 0.1*this.state.headProps.headWidth : 1;
    lineWidth = this.parameters.hasOwnProperty("lineWidth") ?
    this.parameters["lineWidth"] :  lineWidth;

    var arrowDetail = this.parameters.hasOwnProperty("arrowDetail") ?
    this.parameters["arrowDetail"] :  5;

    var lambertMaterial = this.parameters.hasOwnProperty("lambertMaterial") ?
    this.parameters["lambertMaterial"] :  false;

    var transparent = this.parameters.hasOwnProperty("transparent") ?
    this.parameters["transparent"] :  false;
    var opacity = this.parameters.hasOwnProperty("opacity") ?
    this.parameters["opacity"] :  1;

    return(
      <React.Fragment>
      <Line ref = "line" state = {{
        dir: dir,
        length: length,
        lineProps: this.state.lineProps,
        color: color,
        cylinderDetail: cylinderDetail,
        lineWidth: lineWidth,
        lambertMaterial: lambertMaterial,
        transparent: transparent,
        opacity: opacity
      }}
      adder = {(child) => this.adder(child)}/>

      <Head ref = "head" state = {{
        dir: dir,
        length: length,
        headProps: this.state.headProps,
        color: color,
        arrowDetail: arrowDetail,
        lambertMaterial: lambertMaterial,
        transparent: transparent,
        opacity: opacity,
      }}
      adder = {(child) => this.adder(child)}/>

      <Tail ref = "tail" state = {{
        dir: dir,
        length: length,
        tailProps: this.state.tailProps,
        color: color,
        lambertMaterial: lambertMaterial,
        transparent: transparent,
        opacity: opacity
      }}
      adder = {(child) => this.adder(child)}/>
      </React.Fragment>
    )
  }
}

export default Arrow;

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.scene = new THREE.Scene();
//     this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);
//     this.renderer = new THREE.WebGLRenderer();
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//     // this.mount = new Node();
//     document.body.appendChild( this.renderer.domElement );
//   }
//   componentDidMount() {
//     // this.mount.appendChild(this.renderer.domElement);

//     this.camera.position.z = 5;
//     var animate = () => {
//       requestAnimationFrame( animate );
//       this.renderer.render( this.scene, this.camera );
//     };
//     animate();
//   }
//   adder(child) {
//     this.scene.add(child);
//   }
//   render() {
//     return(
//       <Arrow adder={child => this.adder(child)} parameters={{color: 0x00ff00}}/>
//     )
//   }
// }



// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);

// export default App;
