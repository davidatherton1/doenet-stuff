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

    // let cylinderDetail = 1000;

    // const geometry = new THREE.CylinderGeometry(1, 1, 10, cylinderDetail);

    // const material = new THREE.MeshPhongMaterial({
    //   color: 0x00ff00,
    //   emissive: 0x072534,
    //    side: THREE.DoubleSide,
    //   flatShading: true
    // });
    // console.log(props);
    
    let color = 0xE77027;
    let lineWidth = 2;


    this.arrow = new THREE.Object3D();//Initializes skeleton for Arrow as a custom three object

    let cylinderGeometry = new THREE.CylinderGeometry(.5,.5,1, 1000);
    cylinderGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    let lineMaterial = new THREE.MeshBasicMaterial({color: color});

    let coneGeometry = new THREE.CylinderGeometry(0, 2, 3, 1000, 1);
    coneGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 6, 0));
    


    this.line = new THREE.Mesh(cylinderGeometry, lineMaterial);
    this.cone = new THREE.Mesh(coneGeometry, lineMaterial);
    this.line.scale.set(lineWidth, 5, lineWidth);

    this.arrow.add(this.cone);
    this.arrow.add(this.line);


    props.scene.add(this.arrow);

    // props.scene.add(new THREE.Mesh(geometry,material));
  }

  render(){
    return null;
  }
}

