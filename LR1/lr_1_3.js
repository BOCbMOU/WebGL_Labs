import * as THREE from '../js/three.module.js';
import THREE_CTRL from '../js/OrbitControl.js';

const onWindowLoad = () => {
  // consts
  const letters = {
    A: `11
    40 10
    60 10
    90 90
    70 90
    50 35
    42 55
    55 55
    60.7 70
    37.5 70
    30 90
    10 90
    12
    -1
    1
    13
    14
    4
    5
    6
    7
    8
    9
    21
    11`,
    Zh: `30
    45 10
    55 10
    55 90
    45 90
    40 30
    30 30
    30 10
    10 10
    10 40
    20 40
    10 90
    30 90
    30 50
    40 50
    60 30
    70 30
    70 10
    90 10
    90 40
    80 40
    90 90
    70 90
    70 50
    60 50
    
    
    
    
    
    
    28
    -1
    1
    2
    3
    0
    -5
    35
    36
    7
    38
    39
    38
    40
    11
    42
    43
    4
    -15
    45
    46
    17
    48
    49
    48
    50
    21
    52
    53
    14`,
  };

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

  const createLetter = (codes, points, pointsSize) => {
    let path = new THREE.Path();

    let arcComponent = null;
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    for (const code of codes) {
      if (code < 0) {
        const geometry = new THREE.BufferGeometry().setFromPoints(
          path.getPoints()
        );
        const lines = new THREE.Line(geometry, material);
        scene.add(lines);

        path = new THREE.Path();
        path.moveTo(...points[code * -1 - 1]);
        continue;
      }

      if (code >= pointsSize) {
        if (!arcComponent) {
          arcComponent = points[code - pointsSize];
          continue;
        }
        path.quadraticCurveTo(...arcComponent, ...points[code - pointsSize]);
        arcComponent = null;
        continue;
      }

      path.lineTo(...points[code]);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(path.getPoints());
    const lines = new THREE.Line(geometry, material);
    scene.add(lines);
  };

  let xShift = width / -2;
  for (const key in letters) {
    const fileString = letters[key].split('\n').map(str => str.trim());

    const pointsSize = +fileString[0];
    const points = fileString.slice(1, pointsSize + 1).map(point => {
      const [x = 0, y = 0] = point.split(' ');
      return [xShift + +x, height / 2 - +y];
    });
    const codes = fileString
      .slice(pointsSize + 2, pointsSize + 3 + +fileString[pointsSize + 1])
      .map(Number);

    createLetter(codes, points, pointsSize);
    xShift += 100;
  }

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
