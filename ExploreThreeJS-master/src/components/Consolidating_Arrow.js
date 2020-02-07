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

class Arrow extends Component {
  constructor (props) {
    super(props);

    // this.arrow = new THREE.Object3D();//Initializes skeleton for Arrow as a custom three object

    // if (props["parameters"]) {
    //   this.parameters = props["parameters"];
    // } else {
    //   this.parameters = {};
    // }

    this.state = {
      dragTipSphere: false,
      dragTailSphere: false,

      cone: new THREE.Object3D(),
      headProps : {
        addHead: true,
        headLength: 0.1,
        headWidth: 0.04,
        headLengthMaxRatio: 0.6,
        headWidthMaxRatio: 2,
        headLengthActual: 0.2,
      },

      line: new THREE.Object3D(),
      lineProps : {
        position: new THREE.Vector3(0,0,0),
        cylinderForLine: false,
      },

      tail: new THREE.Object3D(),
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

    var color =  this.parameters.hasOwnProperty("color") ?  this.parameters["color"] :
	0xffff00;

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

    var cylinderDetail = this.parameters.hasOwnProperty("cylinderDetail") ?
  this.parameters["cylinderDetail"]: 4;

    var lineWidth = this.state.lineProps.cylinderForLine ? 0.1*this.state.headProps.headWidth : 1;
    lineWidth = this.parameters.hasOwnProperty("lineWidth") ?
    this.parameters["lineWidth"] :  lineWidth;

    var arrowDetail = this.parameters.hasOwnProperty("arrowDetail") ?
    this.parameters["arrowDetail"] :  5;

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

    var lambertMaterial = this.parameters.hasOwnProperty("lambertMaterial") ?
    this.parameters["lambertMaterial"] :  false;

    var transparent = this.parameters.hasOwnProperty("transparent") ?
    this.parameters["transparent"] :  false;
    var opacity = this.parameters.hasOwnProperty("opacity") ?
    this.parameters["opacity"] :  1;

    if(this.state.lineProps.cylinderForLine) {
      // var cylinderGeometry = new THREE.CylinderGeometry(1,1,1, cylinderDetail);
      // cylinderGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
      var lineMaterial;
      if(lambertMaterial) {
        lineMaterial = new THREE.MeshLambertMaterial({color: color, ambient: color, transparent: transparent, opacity: opacity});
      } else {
        lineMaterial = new THREE.MeshBasicMaterial({color: color});
      }

      // this.state.line = new THREE.Mesh(cylinderGeometry, lineMaterial);
      // this.state.line.scale.set(lineWidth, 1, lineWidth);
    } else {
      var lineGeometry = new THREE.Geometry();
      lineGeometry.vertices.push(new THREE.Vector3(0,0,0));
      lineGeometry.vertices.push(new THREE.Vector3(0,1,0));
      this.state.line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({color: color, lineWidth: lineWidth}));
    }

    this.state.line.matrixAutoUpdate = false;
    this.arrow.add(this.state.line);

    if(this.state.headProps.addHead) {
      var coneGeometry = new THREE.CylinderGeometry(0, 0.5, 1, arrowDetail, 1);
      var coneMaterial;
      if(lambertMaterial) {
        coneMaterial = new THREE.MeshLambertMaterial({color: color, ambient: color, transparent: transparent, opacity: opacity});
      } else {
        coneMaterial = new THREE.MeshBasicMaterial({color: color});
      }
      this.state.cone = new THREE.MeshBasicMaterial({color: color});
      this.state.cone.matrixAutoUpdate = false;
      this.arrow.add(this.state.cone);
    }

    if(this.state.tailProps.addTail) {
      var tailGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, arrowDetail, 1);
      tailGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.499, 0));
      var tailMaterial;
      if(lambertMaterial) {
        tailMaterial = new THREE.MeshLambertMaterial({color: color, ambient: color, transparent: transparent, opacity: opacity});
      } else {
        tailMaterial = new THREE.MeshBasicMaterial({color: color});
      }
      this.state.tail = new THREE.Mesh(tailGeometry, tailMaterial);
      this.statea.tail.matrixAutoUpdate = false;
      this.arrow.add(this.state.tail);
    }

    //May need to manually bind these methods
    this.setDirection( dir);
    this.setLength(length);

    this.props.scene.add(this.arrow);
  }

  mesh(){
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

    this.state.line.setYScale(length - headLength);

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
      this.state.cone.setScale(length, headWidth, headLength, headWidth);
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
        tailWidth = Math.min(tailLength*this.state.tailProps.tailWidthMaxRatio, tailWidth);
      }
      this.state.tail.setScale(tailWidth, tailLength, tailWidth);
    }

  }

  setColor(color) {
    this.state.line.setColor(color);
    if(this.state.headProps.addHead) {
      this.state.cone.setColor(color);
    }
    if(this.state.tailProps.addTail) {
      this.state.tail.setColor(color);
    }
  }

  returnLength() {
    return this.state.line.returnYScale() + this.state.headProps.headLengthActual;
  }

  returnTipPosition() {
    var tipPosition = new THREE.Vector3(0, this.arrow.returnLength(), 0);
    this.arrow.updateMatrixWorld();
    this.arrow.localToWorld(tipPosition);
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

    if(this.state.dragTipSphere) {//Might cause type issues
      this.state.dragTipSphere.adjustposition();
    }
  }

  returnDragTipSphere() {
    if(this.state.dragTipSphere) {
      return this.dragTipSphere;
    }

    var sphereGeometry = new THREE.SphereGeometry(0.5);
    this.state.dragTipSphere = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial());

    this.state.dragTipSphere.scale.set(this.state.headProps.headLength*2, this.state.headProps.headLength*2, this.state.headProps.headLength*2);

    this.state.dragTipSphere.draggable = true;
    this.state.dragTipSphere.visible = false;

    this.arrow.updateMatrixWorld();
    this.state.dragTipSphere.position.set(0, this.state.line.scale.y + this.state.headProps.headLength/2.0,0);
    this.arrow.localtoWorld(this.state.dragTipSphere.position);
    if(this.state.headProps.addHead) {
      this.state.dragTipSphere.represents = this.state.cone;
    }

    var dir = new THREE.Vector3();
    var pos = new THREE.Vector3();

    this.state.dragTipSphere.addEventListener('moved', (event) => this.state.dragTipSphere.adjustArrow(event.initialize));

    this.state.dragTipSphere.adjustArrow = (initialize) => {
      if(initialize) {
        if(this.state.dragTipSphere.parent) {
          this.state.dragTipSphere.parent.updateMatrixWorld();
        }
        if(this.arrow.parent) {
          this.arrow.parent.updateMatrixWorld();
        }
        else {
          this.arrow.updateMatrixWorld();
        }
      }

      dir.copy(this.state.dragTipSphere.position);
      if(this.state.dragTipSphere.parent) {
        this.state.dragTipSphere.parent.localToWorld(dir);
      }
      if(this.arrow.parent) {
        this.arrow.parent.worldToLocal(dir);
      }
      dir.sub(this.arrow.position);
      var length = dir.length();
      dir.normalize();
      length += this.state.headProps.headLengthActual/2.0;

      this.setDirection(dir);
      this.setLength(length);
    }

    this.state.dragTipSphere.adjustPosition = () => {
      if(this.state.dragTipSphere.parent) {
        this.state.dragTipSphere.parent.updateMatrixWorld();
      }
      this.arrow.updateMatrixWorld();

      pos.set(0, this.state.line.scale.y + this.state.headProps.headLengthActual/2.0, 0);
      this.arrow.localToWorld(pos);
      if(this.state.dragTipSphere.parent) {
        this.state.dragTipSphere.parent.worldToLocal(pos);
      }
      this.state.dragTipSphere.position.copy(pos);

    }
    //Maybe should be On Clicks instead?
    this.arrow.addEventListener('added', (event) => {this.state.dragTipSphere.adjustPosition()});
    this.state.dragTipSphere.addEventListener('added', (event) => {this.state.dragTipSphere.adjustPosition()});

    return this.state.dragTipSphere;
  }

  returnDragTailSphere() {
    if(this.state.dragTailSphere) {
      return this.state.dragTailSphere;
    }

    var sphereGeometry = new THREE.SphereGeometry(0.5);
    this.state.dragTailSphere = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial());
    this.state.dragTailSphere.scale.set(this.state.tailProps.tailWidth*2, this.state.tailProps.tailWidth*2, this.state.tailProps.tailWidth*2);

    this.state.dragTailSphere.draggable=true;
    this.state.dragTailSphere.visible=false;
    this.arrow.updateMatrixWorld();
    this.state.dragTailSphere.position.set(0,0,0);
    this.arrow.localToWorld(this.state.dragTailSphere.position);
    if(this.state.tail) {
      this.state.dragTailSphere.represents = this.state.tail;
    }

    var dir = new THREE.Vector3();
    var pos = new THREE.Vector3();

    this.state.dragTailSphere.addEventListener('moved', (event) => {this.state.dragTailSphere.adjustArrow(event.initialize)});

    this.state.dragTailSphere.adjustArrow = (intialize) => {
      this.arrow.updateMatrixWorld();

      if(initialize) {
        if(this.state.dragTailSphere.parent) {
          this.state.dragTailSphere.parent.updateMatrixWorld();
        }
        if(this.arrow.parent) {
          this.arrow.parent.updateMatrixWorld();
        }
      }

      dir.copy(this.state.cone.position);
      this.arrow.localToWorld(dir);
      pos.copy(this.state.dragTailSphere.position);
      if(this.state.dragTailSphere.parent) {
        this.state.dragTailSphere.parent.localToWorld(pos);
      }
      if(this.arrow.parent) {
        this.arrow.parent.worldToLocal(dir);
        this.arrow.parent.worldToLocal(pos);
      }
      dir.sub(pos);

      var length = dir.length();
      dir.normalize();
      length += this.state.headProps.headLengthActual/2.0;

      this.arrow.position.copy(pos);

      this.setDirection(dir);
      this.arrow.setLength(length);
    }

    this.dragTailSphere.adjustPosition = () => {
      if(this.state.dragTailSphere.parent) {
        this.state.dragTailSphere.parent.updateMatrixWorld();
      }
      this.arrow.updateMatrixWorld();

      pos.set(0,0,0);
      this.arrow.localToWorld(pos);
      if(this.state.dragTailSphere.parent) {
        this.state.dragTailSphere.parent.worldToLocal(pos);
      }
      this.state.dragTailSphere.position.copy(pos);
    }

    this.arrow.addEventListener('added', (event) => {this.state.dragTailSphere.adjustPosition()});
    this.state.dragTailSphere.addEventListener('added', (event) => {this.state.dragTailSphere.adjustPosition()});

    return this.state.dragTailSphere;
  }

  render() {
    return null;
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
