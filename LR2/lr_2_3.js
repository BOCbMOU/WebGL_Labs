import * as THREE from '../js/three.module.js';
import { NURBSCurve } from '../js/NURBSCurve.js';
import THREE_CTRL from '../js/OrbitControl.js';

const onWindowLoad = () => {
  // consts

  const width = 200;
  const height = 100;

  const scale = 13;

  // settings
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    window.innerWidth / -scale,
    window.innerWidth / scale,
    window.innerHeight / scale,
    window.innerHeight / -scale,
    1,
    1000
  );
  camera.position.set(0, 0, 500);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setPixelRatio(window.devicePixelRatio);

  document.getElementById('canvas').appendChild(renderer.domElement);

  // camera control
  const controls = new THREE_CTRL.OrbitControls(camera, renderer.domElement);

  // add axis
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  // add figures functions
  const createSurface = (size = {}, color = 0xffffff) => {
    const { width = 2000, height = width } = size;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  // add figures
  const surface1 = createSurface({ width, height }, 0x303030);
  surface1.position.set(0, 0, -1);
  scene.add(surface1);

  // add nurbs -------------
  const nurbsControlPoints = [];
  const nurbsKnots = [];
  const nurbsDegree = 2; // int

  for (let i = 0; i <= nurbsDegree; i++) {
    nurbsKnots.push(0);
  }

  nurbsControlPoints.push(new THREE.Vector4(0, -40, 1, 1));
  nurbsControlPoints.push(new THREE.Vector4(-50, 10, 1, 1));
  nurbsControlPoints.push(new THREE.Vector4(-20, 40, 1, 1));
  nurbsControlPoints.push(new THREE.Vector4(0, 20, 1, 1));
  nurbsControlPoints.push(new THREE.Vector4(20, 40, 1, 1));
  nurbsControlPoints.push(new THREE.Vector4(50, 10, 1, 1));
  nurbsControlPoints.push(new THREE.Vector4(0, -40, 1, 1));

  // 0 < knot < 1
  nurbsKnots.push(0.1);
  nurbsKnots.push(0.2);
  nurbsKnots.push(0.2);
  nurbsKnots.push(0.3);
  nurbsKnots.push(0.4);
  nurbsKnots.push(0.4);
  nurbsKnots.push(0.4);

  // for (let i = 0, j = 7; i < j; i++) {
  //   nurbsControlPoints.push(
  //     new THREE.Vector4(
  //       Math.random() * 200,
  //       Math.random() * 100,
  //       1,
  //       1 // weight of control point: higher means stronger attraction
  //     )
  //   );
  //   const knot = (i + 1) / (j - nurbsDegree);
  //   nurbsKnots.push(THREE.Math.clamp(knot, 0, 1));
  // }

  const nurbsCurve = new NURBSCurve(
    nurbsDegree,
    nurbsKnots,
    nurbsControlPoints
  );

  const nurbsGeometry = new THREE.BufferGeometry();
  nurbsGeometry.setFromPoints(nurbsCurve.getPoints(140));
  const nurbsMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const nurbsLine = new THREE.Line(nurbsGeometry, nurbsMaterial);
  // nurbsLine.position.set(width / -2, height / -2, 0);
  scene.add(nurbsLine);

  const nurbsControlPointsGeometry = new THREE.BufferGeometry();
  nurbsControlPointsGeometry.setFromPoints(
    nurbsCurve.controlPoints.map(pos => ((pos.z = 0), pos))
  );
  const nurbsControlPointsMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    opacity: 0.8,
    transparent: true,
  });
  const nurbsControlPointsLine = new THREE.Line(
    nurbsControlPointsGeometry,
    nurbsControlPointsMaterial
  );
  nurbsControlPointsLine.position.copy(nurbsLine.position);
  scene.add(nurbsControlPointsLine);
  //----------

  // rendering
  const render = () => {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
  };
  render();

  const onWindowResize = () => {
    // camera.aspect = window.innerWidth / window.innerHeight;
    camera.left = window.innerWidth / -scale;
    camera.right = window.innerWidth / scale;
    camera.top = window.innerHeight / scale;
    camera.bottom = window.innerHeight / -scale;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onWindowResize);
};
window.addEventListener('load', onWindowLoad);
