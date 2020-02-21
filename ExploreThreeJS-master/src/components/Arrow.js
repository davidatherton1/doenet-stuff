import * as THREE from "three";
import {Component} from "react";

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

export default class Arrow extends Component {
  constructor (props) {
    super(props);
    // this.head_vector = new THREE.Vector3( 0, 1, 0 );
    // this.tail_vector= new THREE.Vector3( 0, 0, 0 );
    
    let color = 0x00ff00;
    let lineWidth = 1;
  

    this.arrow = new THREE.Object3D();//Initializes skeleton for Arrow as a custom three object

    //Line
    var cylinderGeometry = new THREE.CylinderGeometry(1,1,1, 1000);
    cylinderGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -.6, 0));
    let lineMaterial = new THREE.MeshBasicMaterial({color: color});
    this.line = new THREE.Mesh(cylinderGeometry, lineMaterial);
    this.line.scale.set(lineWidth, 5, lineWidth);

    //Cone
    var coneGeometry = new THREE.CylinderGeometry(0, 2, 3, 1000, 1);
    let coneMaterial = new THREE.MeshBasicMaterial({color: color});
    this.cone = new THREE.Mesh(coneGeometry, coneMaterial);
    // coneGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, 0));


    this.arrow.add(this.line);
    this.arrow.add(this.cone);
    this.arrow.rotation.set(Math.PI,0,0);

    // this.state = {
    //   position: new THREE.Vector3(0,0,0)
    // }

    props.scene.add(this.arrow);

    props.objects.push(this.arrow);

    // this.arrow.position.set(1,0,0);
    // this.arrow.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

    // this.arrow.translateY(1);
    // var end = new THREE.Vector3(1,1,1);
    // // var end = new THREE.Vector3(2,3,40);
    // // end.normalize();
    // this.setEndpoint(end);

    

    // props.scene.add(new THREE.Mesh(geometry,material));
  }

  setTipPoint(tipPoint) {
    // this.arrow.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
  }

  setDirection(dir) {
    var axis = new THREE.Vector3();
    axis.set(dir.z, 0, - dir.x).normalize();
    var radians = Math.acos(dir.y);

    this.arrow.quaternion.setFromAxisAngle(axis, radians);
  }

  // setLength(length, headLength, headWidth, tailLength, tailWidth) {
  //   var manualHeadLength = false;
  //   if(headLength === undefined) {
  //     headLength = this.state.headProps.headLength;
  //   } else {
  //     this.state.headProps.headLength = headLength;
  //     manualHeadLength = true;
  //   }

  //   if(!manualHeadLength) {
  //     headLength = Math.min(length*this.state.headProps.headLengthMaxFraction, headLength);
  //   }
  //   this.state.headProps.headLengthActual = headLength;

  //   this.state.line.setYScale(length - headLength);

  //   if(this.state.headProps.addHead) {
  //     var manualHeadWidth = false;
  //     if(headWidth === undefined) {
  //       headWidth = this.state.headProps.headWidth;
  //     } else {
  //       this.state.headProps.headWidth = headWidth;
  //       manualHeadWidth = true;
  //     }

  //     if(!manualHeadWidth) {
  //       headWidth = Math.min(headLength*this.state.headProps.headWidthMaxRatio, headWidth);
  //     }
  //     this.state.cone.setScale(length, headWidth, headLength, headWidth);
  //   }

  //   if(this.state.tailProps.addTail) {
  //     var manualTailLength = false;
  //     if (tailLength === undefined) {
  //       tailLength = this.state.tailProps.tailLength;
  //     } else {
  //       this.state.tailProps.tailLength = tailLength;
  //       manualTailLength = true;
  //     }
  //     if(!manualTailLength) {
  //       tailLength = Math.min(length*this.state.tailProps.tailLengthMaxFraction, tailLength);
  //     }
  //     var manualTailWidth = false;
  //     if(tailWidth === undefined) {
  //       tailWidth = this.state.tailProps.tailWidth;
  //     } else {
  //       this.state.tailProps.tailWidth = tailWidth;
  //       manualTailWidth = true;
  //     }
  //     if(!manualTailWidth) {
  //       tailWidth = Math.min(tailLength*this.state.tailProps.tailWidthMaxRatio, tailWidth);
  //     }
  //     this.state.tail.setScale(tailWidth, tailLength, tailWidth);
  //   }

  // }

  render(){
    return null;
  }
}

