import * as THREE from 'three';

import {
  MapControls,
} from 'three/examples/jsm/controls/OrbitControls.js';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { getDistance, getRhumbLineBearing } from 'geolib';

import map_data from './map.json';

const center = [-3.188822, 55.943686];

function GPSRelativePosition(objPosi, centerPosi) {
  // Get GPS distance
  const dis = getDistance(objPosi, centerPosi);

  // Get bearing angle
  const bearing = getRhumbLineBearing(objPosi, centerPosi);

  // Calculate X by centerPosi.x + distance * cos(rad)
  const x = centerPosi[0] + (dis * Math.cos(bearing * Math.PI / 180));

  // Calculate Y by centerPosi.y + distance * sin(rad)
  const y = centerPosi[1] + (dis * Math.sin(bearing * Math.PI / 180));

  // Reverse X (it work)
  return [-x / 100, y / 100];
}

function genShape(points, center) {
  const shape = new THREE.Shape();

  for (let i = 0; i < points.length; i++) {
    let elp = points[i];
    elp = GPSRelativePosition(elp, center);

    if (i == 0) {
      shape.moveTo(elp[0], elp[1]);
    } else {
      shape.lineTo(elp[0], elp[1]);
    }
  }

  return shape;
}

function genGeometry(shape, settings) {
  const geometry = new THREE.ExtrudeBufferGeometry(shape, settings);
  geometry.computeBoundingBox();

  return geometry;
}

class threeApp {
  scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: any;
  private geos_building!: any[];
  constructor(el) {
    const width = el.current.clientWidth; // window.innerWidth
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(width, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);


    el.current.appendChild(this.renderer.domElement); window.innerWidth;
  }
  init() {
    this.add_scene();
    this.add_light();
    this.add_gridHelper();
    this.add_controller();
    this.add_camera();
  }
  // 注册场景
  add_scene() {
    this.scene = new THREE.Scene();

    this.scene.background = new THREE.Color(0x222222);
  }
  // 注册灯光
  add_light() {
    const light0 = new THREE.AmbientLight(0xfafafa, 0.25);

    const light1 = new THREE.PointLight(0xfafafa, 0.4);
    light1.position.set(200, 90, 40);

    const light2 = new THREE.PointLight(0xfafafa, 0.4);
    light2.position.set(200, 90, -40);

    this.scene.add(light0);
    this.scene.add(light1);
    this.scene.add(light2);
  }
  // 注册网格
  add_gridHelper() {
    const gridHelper = new THREE.GridHelper(60, 160, new THREE.Color(0x555555), new THREE.Color(0x333333));
    this.scene.add(gridHelper);
  }
  // 注册控制器
  add_controller() {
    this.controls = new MapControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxDistance = 800;
  }
  // 注册摄像头
  add_camera() {
    // Init Camera
    this.camera = new THREE.PerspectiveCamera(25, window.clientWidth / window.clientHeight, 1, 100);
    this.camera.position.set(8, 4, 0);
  }
  get_geojspn() {
    const data = map_data;
    this.loading_building(data);
  }
  loading_building(data) {
    const { features } = data;

    const MAT_BUILDING = new THREE.MeshPhongMaterial();
    const MAT_ROAD = new THREE.LineBasicMaterial({ color: 0x1B4686 });

    for (let i = 0; i < features.length; i++) {
      const fel = features[i];
      if (!fel['properties']) return;

      const info = fel.properties;

      if (info['building']) {
        this.addBuilding(fel.geometry.coordinates, info, info['building:levels']);
      }
    }


    const mergeGeometry = BufferGeometryUtils.mergeBufferGeometries(this.geos_building);
    const mesh = new THREE.Mesh(mergeGeometry, MAT_BUILDING);
  }

  addBuilding(data, info, height = 1) {
    height = height || 1;

    let shape; let
      geometry;
    const holes = [];

    for (let i = 0; i < data.length; i++) {
      const el = data[i];

      if (i == 0) {
        shape = genShape(el, center);
      } else {
        holes.push(genShape(el, center));
      }
    }

    for (let i = 0; i < holes.length; i++) {
      shape.holes.push(holes[i]);
    }

    geometry = genGeometry(shape, { curveSegments: 1, depth: 0.05 * height, bevelEnabled: false });

    geometry.rotateX(Math.PI / 2);
    geometry.rotateZ(Math.PI);

    geos_building.push(geometry);

    const helper = genHelper(geometry);
    if (helper) {
      helper.name = info['name'] ? info['name'] : 'Building';
      helper.info = info;
      // this.iR.add(helper)
      collider_building.push(helper);
    }
  }

  add_change() {

  }
}

export default threeApp;

