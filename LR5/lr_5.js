import * as THREE from '../js/three.module.js';
import THREE_CTRL from '../js/OrbitControl.js';

const onWindowLoad = () => {
  const data =
    'dots:[-10,-10,5 10,-10,5 10,10,5 -10,10,5 -10,-10,-5 10,-10,-5 10,10,-5 -10,10,-5]' +
    'paths:[0,1,2,3 4,7,6,5 4,5,1,0 2,6,7,3 5,6,2,1 0,3,7,4]';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 35);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setPixelRatio(window.devicePixelRatio);

  document.getElementById('canvas').appendChild(renderer.domElement);

  // camera
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

  const createLineLoop = (dots = [], color = 0xffffff) => {
    if (dots.length < 2) {
      return null;
    }

    const geometry = new THREE.Geometry();
    for (const dot of dots) {
      geometry.vertices.push(new THREE.Vector3(...dot));
    }
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.LineLoop(geometry, material);
  };

  // add figures
  const surface1 = createSurface({ width: 40, height: 20 }, 0x303030);
  surface1.position.set(0, 0, -10);
  scene.add(surface1);

  // main figure
  let tempPos = data.indexOf('dots');
  const dots = data
    .slice(data.indexOf('[', tempPos) + 1, data.indexOf(']', tempPos))
    .split(' ')
    .map(str => str.split(','));
  tempPos = data.indexOf('paths');
  const paths = data
    .slice(data.indexOf('[', tempPos) + 1, data.indexOf(']', tempPos))
    .split(' ')
    .map(str => str.split(','));

  const customShape = new THREE.Group();

  for (const path of paths) {
    const localDots = [];
    for (const i of path) {
      localDots.push(dots[i]);
    }
    customShape.add(createLineLoop(localDots, 0xff0000));
  }

  customShape.position.set(0, 0, 0);
  scene.add(customShape);

  // rendering
  const animate = () => {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  };
  animate();

  // events
  const objectsToChange = [customShape]; // objectsToChange

  const position = (newPosition = {}, settings = { isSet: false }) => {
    const { isSet = false } = settings;

    if (isSet) {
      const { x = 0, y = 0, z = 0 } = position;
      objectsToChange.map(obj => obj.position.set(x, y, z));
      return;
    }
    for (const axis in newPosition) {
      if (axis) {
        objectsToChange.map(
          obj => (obj.position[axis] += newPosition[axis] || 0)
        );
      }
    }
  };

  const rotation = (
    newRotation = {},
    settings = { isSet: false, isAlternate: false }
  ) => {
    const { isSet = false, isAlternate } = settings;

    if (isSet) {
      const { x = 0, y = 0, z = 0 } = position;
      objectsToChange.map(obj => obj.rotation.set(x, y, z));
      return;
    }
    for (const axis in newRotation) {
      if (axis) {
        objectsToChange.map(
          (obj, i) =>
            (obj.rotation[axis] +=
              newRotation[axis] * (isAlternate && i % 2 === 0 ? -1 : 1) || 0)
        );
      }
    }
  };

  const onKeyDown = event => {
    // event.preventDefault();

    switch (event.keyCode) {
      case 87:
        position({ y: 0.5 });
        break;
      case 68:
        position({ x: 0.5 });
        break;
      case 83:
        position({ y: -0.5 });
        break;
      case 65:
        position({ x: -0.5 });
        break;
      case 81:
        rotation({ y: -0.05 });
        break;
      case 69:
        rotation({ y: 0.05 });
        break;
      case 82:
        rotation({ x: -0.05 });
        break;
      case 70:
        rotation({ x: 0.05 });
        break;
      case 88:
        rotation({ z: -0.05 }, { isAlternate: true });
        break;
      case 90:
        rotation({ z: 0.05 }, { isAlternate: true });
        break;
      default:
        break;
    }
  };
  window.addEventListener('keydown', onKeyDown);

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onWindowResize);
};
window.addEventListener('load', onWindowLoad);
