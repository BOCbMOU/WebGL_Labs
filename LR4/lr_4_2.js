import * as THREE from '../js/three.module.js';
import THREE_CTRL from '../js/OrbitControl.js';

const onWindowLoad = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(0, 100, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setPixelRatio(window.devicePixelRatio);

  document.getElementById('canvas').appendChild(renderer.domElement);

  // camera
  // const controls = new THREE_CTRL.OrbitControls(camera, renderer.domElement);

  // add axis
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  // add figures functions
  const addWireframe = (object, color = 0x000000) => {
    const geo = new THREE.WireframeGeometry(object.geometry);
    const mat = new THREE.LineBasicMaterial({
      color,
    });
    const wireframe = new THREE.LineSegments(geo, mat);
    object.add(wireframe);
  };

  const createSurface = (size = {}, color = 0xffffff) => {
    const { width = 2000, height = width } = size;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  const createRectangle = (rectangleParams = {}, color = 0xffffff) => {
    const { x = 1, y = x, z = x } = rectangleParams;
    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshBasicMaterial({
      color,
      opacity: 0.5,
      transparent: true,
    });
    const rectangle = new THREE.Mesh(geometry, material);
    return rectangle;
  };

  const createSphere = (sphereParams = {}, color = 0xffffff) => {
    const {
      r = 1,
      widthSegments = 10,
      heightSegments = widthSegments,
    } = sphereParams;
    const geometry = new THREE.SphereGeometry(r, widthSegments, heightSegments);
    const material = new THREE.MeshBasicMaterial({
      color,
      opacity: 0.5,
      transparent: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
  };

  // add figures
  const surface1 = createSurface({ width: 2000, height: 1000 }, 0x303030);
  surface1.position.set(0, 0, -100);
  scene.add(surface1);

  const sphere1 = createSphere(
    { r: 50, widthSegments: 10, heightSegments: 2 },
    0x99aa33
  );
  addWireframe(sphere1);
  scene.add(sphere1);

  const rectangle1 = createRectangle({ x: 20 }, 0x33dddd);
  addWireframe(rectangle1);
  rectangle1.position.set(0, 0, 0);
  scene.add(rectangle1);

  // rendering
  const animate = () => {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  };
  animate();

  // events
  const objectsToChange = [sphere1, rectangle1]; // objectsToChange

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
    updateLookAt();
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
    updateLookAt();
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
    updateLookAt();
  };

  const updateLookAt = () => {
    const { x, y, z } = sphere1.position;
    camera.lookAt(x, y, z);
  };
  updateLookAt();

  const onKeyDown = event => {
    // event.preventDefault();

    switch (event.keyCode) {
      case 87:
        position({ y: 5 });
        break;
      case 68:
        position({ x: 5 });
        break;
      case 83:
        position({ y: -5 });
        break;
      case 65:
        position({ x: -5 });
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
