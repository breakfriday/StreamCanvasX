import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

import {
  MapControls,
} from 'three/examples/jsm/controls/OrbitControls.js';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { getDistance, getRhumbLineBearing } from 'geolib';

import map_data from './map.json';

let scene; let renderer; let camera; let
  controls;
let MAT_BUILDING; let
  MAT_ROAD;
const center = [-3.188822, 55.943686];
let iR;
let iR_Road;
let iR_Line;

const FLAG_ROAD_ANI = true;
const Animated_Line_Speed = 0.004;
const Animated_Line_Distances = [];
const geos_building = [];
const collider_building = [];
const raycaster: any = null;


function genShape(points) {
  const shape = new THREE.Shape();

  for (let i = 0; i < points.length; i++) {
    if (i == 0) {
      shape.moveTo(points.x, points.y);
    } else {
      shape.lineTo(points.x, points.y);
    }
  }

  return shape;
}


function ThreeScene() {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // 创建 Three.js 场景
    const scene = new THREE.Scene();

    // 创建相机
    // const camera = new THREE.PerspectiveCamera(
    //   75, // 视野角度
    //   window.innerWidth / window.innerHeight, // 宽高比
    //   0.1, // 渲染最小距离
    //   1000 // 渲染最大距离
    // );

    const camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.9, 1000);

    camera.position.z = 5;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();

    // 设置渲染器的尺寸和像素比例
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 将渲染器的输出添加到 HTML 页面中
    document.body.appendChild(renderer.domElement);

    // 将经纬度坐标转换为 Three.js 坐标系
    function lonLatToVector3(lon, lat) {
      const x = (lon + 180) / 360 * 100;
      const y = (lat + 90) / 180 * 100;
      return new THREE.Vector3(x, y, 0);
    }


    // init 网格
    const gridHelper = new THREE.GridHelper(100, 90, 0x0000ff, 0x808080);
    gridHelper.position.y = -0.5;
    gridHelper.position.x = -1;
    scene.add(gridHelper);

    // 创建材质
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const mockGeoJSON = map_data;
    // 遍历 GeoJSON 数据中的每一个建筑物
    mockGeoJSON.features.forEach((feature, i) => {
      // 获取建筑物的坐标数组
      const coordinates = feature.geometry.coordinates[0];

      // 将坐标数组转换为 Three.js 中的 Vector3 数组
      const vertices = coordinates.map(([lon, lat]) => lonLatToVector3(lon, lat));
      debugger;

      const shape = genShape(vertices);
      // 创建建筑物的形状
      //   const shape = new THREE.Shape()

      //   if (i == 0) {
      //     shape.moveTo(elp.x, elp.y);
      //   } else {
      //     shape.lineTo(elp.x, elp.y);
      //   };

      // 创建建筑物的几何体
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 120, // 指定建筑物的高度
      });

      // 创建建筑物的网格
      const mesh = new THREE.Mesh(geometry, material);

      // 将建筑物的网格添加到场景中
      scene.add(mesh);
    });

    // 将相机移动到一个合适的位置


    // 创建渲染循环
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    // 启动渲染循环
    animate();


    //   requestAnimationFrame(animate);

    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;

    //   renderer.render(scene, camera);
    // }

    // animate();
  }, []);

  return <div />;
}

export default ThreeScene;
