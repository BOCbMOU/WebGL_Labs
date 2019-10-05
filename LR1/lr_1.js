import * as THREE from '../js/three.module.js';
import THREE_CTRL from '../js/OrbitControl.js';

const onWindowLoad = () => {
  // consts
  const func = x => Math.abs(x / 4 + 3 * Math.cos(100 * x) * Math.sin(x));

  const board = {
    x: {
      max: 200,
      min: -200,
    },
    y: {
      max: 100,
      min: -100,
    },
  };
  const width = Math.abs(board.x.min) + Math.abs(board.x.max);
  const height = Math.abs(board.y.min) + Math.abs(board.y.max);

  const results = [];
  results.push({ x: board.x.min, y: func(board.x.min) });
  for (let i = board.x.min + 1; i <= board.x.max; i++) {
    results.push({ x: i - 0.75, y: func(i - 0.75) });
    results.push({ x: i - 0.5, y: func(i - 0.5) });
    results.push({ x: i - 0.25, y: func(i - 0.25) });
    results.push({ x: i, y: func(i) });
  }

  const scale = 6;

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

  const createLines = (points = [], color = 0xffffff) => {
    const geometry = new THREE.Geometry();
    points.forEach(({ x = 0, y = 0 }) =>
      geometry.vertices.push(new THREE.Vector3(x, y, 0))
    );
    const material = new THREE.LineBasicMaterial({ color });
    const lines = new THREE.Line(geometry, material);
    return lines;
  };

  // add figures
  const surface1 = createSurface({ width, height }, 0x303030);
  surface1.position.set(0, 0, -1);
  scene.add(surface1);

  const xLine = [{ x: board.x.min, y: 0 }, { x: board.x.max, y: 0 }];
  const xAxis = createLines(xLine);
  scene.add(xAxis);
  const yLine = [{ x: 0, y: board.y.max }, { x: 0, y: board.y.min }];
  const yAxis = createLines(yLine);
  scene.add(yAxis);

  const lines1 = createLines(results, 0xff0000);
  lines1.position.z = 1;
  scene.add(lines1);

  // rendering
  const animate = () => {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  };
  animate();

  const onWindowResize = () => {
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
