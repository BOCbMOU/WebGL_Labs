import * as THREE from '../js/three.module.js';
import THREE_CTRL from '../js/OrbitControl.js';
import Stats from '../js/stats.module.js';

const onWindowLoad = () => {
  const golSize = { width: 100, height: 50 };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  camera.position.set(0, 0, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setPixelRatio(window.devicePixelRatio);

  document.getElementById('canvas').appendChild(renderer.domElement);

  // camera
  const controls = new THREE_CTRL.OrbitControls(camera, renderer.domElement);

  // add figures functions

  /**
   * @param {Object} params
   * @param {number} params.width - Width
   * @param {number} params.height - Height
   * @param {number} params.color - Color
   */
  const createSurface = (params = {}) => {
    const { width = 2000, height = width, color = 0xffffff } = params;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      color,
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  /**
   * @param {Object} params
   * @param {number} params.x - Width
   * @param {number} params.y - Height
   * @param {number} params.z - Deep
   * @param {number} params.color - Color
   */
  const createRectangle = (params = {}) => {
    const { x = 1, y = x, z = x, color = 0xffffff } = params;
    const geometry = new THREE.BoxBufferGeometry(x, y, z);
    const material = new THREE.MeshBasicMaterial({
      color,
    });
    const rectangle = new THREE.Mesh(geometry, material);
    return rectangle;
  };

  // add figures
  const surface1 = createSurface({ width: 200, height: 100, color: 0x303030 });
  surface1.position.set(0, 0, -10);
  scene.add(surface1);

  // const life1 = createRectangle({ x: 1, color: 0xdd0000 });
  // life1.position.set(-10, -10, 0);
  // life1.visible = true;
  // scene.add(life1);

  // GoL map
  if (1) {
    const meshMap = [];
    const leftSide = golSize.width / 2;
    const bottomSide = golSize.height / 2;
    for (let i = 0; i < golSize.height; i++) {
      meshMap.push([]);
      for (let j = 0; j < golSize.width; j++) {
        const life = createRectangle({ x: 1, color: 0xdd0000 });
        life.position.set((j - leftSide) * 2, (i - bottomSide) * 2, 0);
        life.visible = (i + j) % 2 ? false : true;
        meshMap[i].push(life);
        scene.add(life);
      }
    }
  }

  // rendering
  const animate = () => {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);

    stats.update();
  };

  // GoL function
  const check = (map, i, j) => {
    const sum =
      map[i - 1][j - 1] +
      map[i - 1][j] +
      map[i - 1][j + 1] +
      map[i][j - 1] +
      map[i][j + 1] +
      map[i + 1][j - 1] +
      map[i + 1][j] +
      map[i + 1][j + 1];

    if (sum < 2 || sum > 3) {
      return 0;
    }
    if (sum === 3) {
      return 1;
    }
    return map[i][j];
  };

  const step = map => {
    const oldMap = map.map(row => [...row]);

    const iMax = oldMap.length - 2;
    const jMax = oldMap[0].length - 2;
    for (let i = 1; i < iMax; i++) {
      for (let j = 1; j < jMax; j++) {
        map[i][j] = check(oldMap, i, j);
      }
    }
  };

  const show = map => {};

  //-------------
  // stats
  const container = document.createElement('div');
  const stats = new Stats();
  container.appendChild(stats.dom);
  document.body.appendChild(container);

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onWindowResize);

  animate();
};
window.addEventListener('load', onWindowLoad);
