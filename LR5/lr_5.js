import * as THREE from '../js/three.module.js';
import THREE_CTRL from '../js/OrbitControl.js';

const onWindowLoad = () => {
  let data =
    'shape:{' +
    'dots:[-10,40,5 -40,-40,5 -20,-40,5 -12.5,-20,5 12.5,-20,5 20,-40,5 40,-40,5 10,40,5 ' +
    '-10,40,-5 -40,-40,-5 -20,-40,-5 -12.5,-20,-5 12.5,-20,-5 20,-40,-5 40,-40,-5 10,40,-5]' +
    'paths:[0,1,2,3,4,5,6,7 8,9,10,11,12,13,14,15 0,1,9,8 1,2,10,9 2,3,11,10 3,4,12,11 4,5,13,12 5,6,14,13 6,7,15,14 7,0,8,15]' +
    'dots:[-7,-5,5 0,13.5,5 7,-5,5 -7,-5,-5 0,13.5,-5 7,-5,-5]' +
    'paths:[0,1,2 3,4,5 0,1,4,3 1,2,5,4 2,0,3,5]' +
    '}' +
    'shape:{' +
    'dots:[-5,40,5 5,40,5 5,-40,5 -5,-40,5 -5,40,-5 5,40,-5 5,-40,-5 -5,-40,-5 -5,40,5 5,40,5 5,-40,5 -5,-40,5]' +
    'paths:[0,1,2,3 4,7,6,5 4,5,1,0 2,6,7,3 5,6,2,1 0,3,7,4]' +
    'dots:[-10,0,5 -20,40,5 -40,40,5 -30,0,5 -40,-40,5 -20,-40,5 -10,0,-5 -20,40,-5 -40,40,-5 -30,0,-5 -40,-40,-5 -20,-40,-5]' +
    'paths:[0,1,2,3,4,5 6,7,8,9,10,11 0,1,7,6 1,2,8,7 2,3,9,8 3,4,10,9 4,5,11,10]' +
    'dots:[10,0,5 20,40,5 40,40,5 30,0,5 40,-40,5 20,-40,5 10,0,-5 20,40,-5 40,40,-5 30,0,-5 40,-40,-5 20,-40,-5]' +
    'paths:[0,1,2,3,4,5 6,7,8,9,10,11 0,1,7,6 1,2,8,7 2,3,9,8 3,4,10,9 4,5,11,10]' +
    '}';
  // 'dots:[-10,-10,5 10,-10,5 10,10,15 -10,10,0 -10,-10,-5 10,-10,-5 10,10,-5 -10,10,-5]' +
  // 'paths:[0,1,2,3 4,7,6,5 4,5,1,0 2,6,7,3 5,6,2,1 0,3,7,4]';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.localClippingEnabled = false;

  document.getElementById('canvas').appendChild(renderer.domElement);

  // camera
  const controls = new THREE_CTRL.OrbitControls(camera, renderer.domElement);

  // add axis
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  // add figures functions
  const localPlane = new THREE.Plane(new THREE.Vector3(1, 1, 1), 10);

  const createSurface = (size = {}, color = 0xffffff) => {
    const { width = 2000, height = width } = size;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      color,
      clippingPlanes: [localPlane],
    });
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
  const surface1 = createSurface({ width: 200, height: 100 }, 0x303030);
  surface1.position.set(0, 0, -10);
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
          localDots.push(...dots[i]);
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
              newRotation[axis] * (isAlternate && i % 2 === 0 ? -1 : 1) || 0)
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
