import * as THREE from '../js/three.module.js';
import THREE_CTRL from '../js/OrbitControl.js';

const onWindowLoad = () => {
  let data =
    'shape:{' +
    'dots:[-10,40 -40,-40 -20,-40 -12.5,-20 12.5,-20 20,-40 40,-40 10,40]' +
    'paths:[0,1,2,3,4,5,6,7]' +
    'dots:[-7,-5 0,13.5 7,-5]' +
    'paths:[0,1,2]' +
    '}' +
    'shape:{' +
    'dots:[-5,40 5,40 5,-40 -5,-40]' +
    'paths:[0,1,2,3]' +
    'dots:[-10,10 -20,40 -40,40 -30,10 -40,-40 -20,-40]' +
    'paths:[0,1,2,3,4,5]' +
    'dots:[10,10 20,40 40,40 30,10 40,-40 20,-40]' +
    'paths:[0,1,2,3,4,5]' +
    '}';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 350);

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

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute(
      'position',
      new THREE.Float32BufferAttribute(dots, 3)
    );
    const material = new THREE.MeshBasicMaterial({
      color,
    });
    return new THREE.LineLoop(geometry, material);
  };

  // add figures
  const surface1 = createSurface({ width: 400, height: 200 }, 0x101010);
  surface1.position.set(0, 0, -50);
  scene.add(surface1);

  // main figure
  const letters = [];

  let tempPos1 = data.indexOf('shape');
  for (let xShift = 0; tempPos1 !== -1; xShift++) {
    const customShape = new THREE.Group();
    customShape.position.set(-50 + xShift * 100, 0, 0);

    const endShape = data.indexOf('}', tempPos1);

    let tempPos2 = data.indexOf('dots', tempPos1);
    while (tempPos2 !== -1) {
      const dots = data
        .slice(data.indexOf('[', tempPos2) + 1, data.indexOf(']', tempPos2))
        .split(' ')
        .map(str => str.split(','));
      tempPos2 = data.indexOf('paths', tempPos2);
      const paths = data
        .slice(data.indexOf('[', tempPos2) + 1, data.indexOf(']', tempPos2))
        .split(' ')
        .map(str => str.split(','));

      for (const path of paths) {
        const localDots = [];
        for (const i of path) {
          localDots.push(...dots[i], 0);
        }
        customShape.add(createLineLoop(localDots, 0xff0000));
      }

      tempPos2 = data.indexOf('dots', tempPos2);
      if (tempPos2 > endShape) {
        break;
      }
    }

    letters.push(customShape);
    tempPos1 = data.indexOf('shape', endShape);
  }

  letters.map(shape => scene.add(shape));

  // camera.lookAt(...Object.values(letters[0].position));

  // rendering
  const animate = () => {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  };
  animate();

  // events
  const objectsToChange = [...letters]; // objectsToChange

  const position = (newPosition = {}, settings = { isSet: false }) => {
    const { isSet = false } = settings;

    if (isSet) {
      const { x = 0, y = 0, z = 0 } = newPosition;
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

  const rotation = (newRotation = {}, settings = {}) => {
    const { isSet = false, isAlternate = false } = settings;

    if (isSet) {
      const { x = 0, y = 0, z = 0 } = newRotation;
      objectsToChange.map(obj => obj.rotation.set(x, y, z));
      return;
    }

    for (const axis in newRotation) {
      if (axis) {
        objectsToChange.map(
          (obj, i) =>
            (obj.rotation[axis] +=
              (isAlternate && i % 2 === 0
                ? newRotation[axis] * -1
                : newRotation[axis]) || 0)
        );
      }
    }
  };

  const scale = (newScale = 1, settings = {}) => {
    const { isSet = false } = settings;

    if (isSet) {
      objectsToChange.map(obj => obj.scale.set(newScale, newScale, newScale));
      return;
    }

    objectsToChange.map(obj => {
      obj.scale.x += newScale;
      obj.scale.y += newScale;
      obj.scale.z += newScale;
    });
  };

  const onKeyDown = event => {
    // event.preventDefault();

    switch (event.keyCode) {
      case 87:
        position({ y: 1 });
        break;
      case 68:
        position({ x: 1 });
        break;
      case 83:
        position({ y: -1 });
        break;
      case 65:
        position({ x: -1 });
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
      case 107:
        scale(0.1);
        break;
      case 109:
        scale(-0.1);
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
