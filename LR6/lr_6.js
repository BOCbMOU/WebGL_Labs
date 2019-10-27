import * as THREE from '../js/three.module.js';
import THREE_CTRL from '../js/OrbitControl.js';
// import ShapeUtils from '../js/ShapeUtils.js';

const onWindowLoad = () => {
  const polyData =
    'shape:{' +
    'dots:[-10,40,5 -40,-40,5 -20,-40,5 0,13.5,5 20,-40,5 40,-40,5 10,40,5 ' +
    '-10,40,-5 -40,-40,-5 -20,-40,-5 0,13.5,-5 20,-40,-5 40,-40,-5 10,40,-5 0,40,5 0,40,-5]' +
    'faces:[14,0,1,2,3,4,5,6 15,13,12,11,10,9,8,7 0,6,13,7 7,8,1,0 8,9,2,1 9,10,3,2 10,11,4,3 11,12,5,4 12,13,6,5]' +
    'dots:[-5,-5,5 5,-5,5 10.5,-20,5 -10.5,-20,5 -5,-5,-5 5,-5,-5 10.5,-20,-5 -10.5,-20,-5]' +
    'faces:[0,3,2,1 5,6,7,4 0,1,5,4 1,2,6,5 2,3,7,6 3,0,4,7]' +
    '}' +
    'shape:{' +
    'dots:[-5,40,5 5,40,5 5,-40,5 -5,-40,5 -5,40,-5 5,40,-5 5,-40,-5 -5,-40,-5 -5,40,5 5,40,5 5,-40,5 -5,-40,5]' +
    'faces:[0,3,2,1 4,5,6,7 0,1,5,4 3,7,6,2 1,2,6,5 4,7,3,0]' +
    'dots:[-10,0,5 -20,40,5 -40,40,5 -30,0,5 -40,-40,5 -20,-40,5 -10,0,-5 -20,40,-5 -40,40,-5 -30,0,-5 -40,-40,-5 -20,-40,-5]' +
    'faces:[0,1,2,3,4,5 11,10,9,8,7,6 6,7,1,0 7,8,2,1 8,9,3,2 9,10,4,3 10,11,5,4 0,5,11,6]' +
    'dots:[10,0,5 20,40,5 40,40,5 30,0,5 40,-40,5 20,-40,5 10,0,-5 20,40,-5 40,40,-5 30,0,-5 40,-40,-5 20,-40,-5]' +
    'faces:[5,4,3,2,1,0 6,7,8,9,10,11 0,1,7,6 1,2,8,7 2,3,9,8 3,4,10,9 4,5,11,10 6,11,5,0]' +
    '}';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 100, 300);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // renderer.shadowMap.renderSingleSided = false;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.setPixelRatio(window.devicePixelRatio);

  document.getElementById('canvas').appendChild(renderer.domElement);

  // camera
  const controls = new THREE_CTRL.OrbitControls(camera, renderer.domElement);

  // add axis
  // const axesHelper = new THREE.AxesHelper(10);
  // scene.add(axesHelper);

  // add figures functions
  const createSurface = (size = {}, color = 0xffffff) => {
    const { width = 2000, height = width } = size;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const material = new THREE.MeshPhongMaterial({
      color,
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  const createCustomShape = (vertices = [], faces = [], color = 0xffffff) => {
    const material = new THREE.MeshPhongMaterial({
      color,
    });

    const geometry = new THREE.Geometry();
    for (const vert of vertices) {
      geometry.vertices.push(new THREE.Vector3(...vert));
    }

    for (const face of faces) {
      for (let i = 1; i < face.length - 1; i++) {
        geometry.faces.push(new THREE.Face3(face[0], face[i], face[i + 1]));
      }
    }

    geometry.computeFaceNormals();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    return mesh;
  };

  // add figures
  // const mesh1 = createSurface({}, 0x808080);
  // mesh1.position.set(0, -50, 0);
  // mesh1.rotation.x = -Math.PI * 0.5;
  // mesh1.receiveShadow = true;
  // scene.add(mesh1);

  const surface1 = createSurface({ width: 200, height: 100 }, 0x303030);
  surface1.position.set(0, 0, -10);
  surface1.receiveShadow = true;
  scene.add(surface1);

  const surface2 = createSurface({ width: 300, height: 100 }, 0x303030);
  surface2.position.set(50, 0, 30);
  surface2.rotation.x = Math.PI;
  surface2.receiveShadow = true;
  scene.add(surface2);

  // const tVert = '0,0,0 50,0,0 50,50,0 0,50,0 -50,25,10';
  // const vertices = tVert.split(/ /).map(str => str.split(/,/));
  // const faces = [[0, 1, 2, 3, 4]];

  // const mesh2 = createCustomShape(vertices, faces, 0x00ff99);
  // mesh2.position.set(-25, 0, 0);
  // scene.add(mesh2);

  const lettersMesh = [];

  let tempPos1 = polyData.indexOf('shape');
  for (let xShift = 0; tempPos1 !== -1; xShift++) {
    const customShape = new THREE.Group();
    customShape.position.set(-50 + xShift * 100, 0, 0);

    const endShape = polyData.indexOf('}', tempPos1);

    let tempPos2 = polyData.indexOf('dots', tempPos1);
    while (tempPos2 !== -1) {
      const dots = polyData
        .slice(
          polyData.indexOf('[', tempPos2) + 1,
          polyData.indexOf(']', tempPos2)
        )
        .split(' ')
        .map(str => str.split(','));
      tempPos2 = polyData.indexOf('faces', tempPos2);
      const faces = polyData
        .slice(
          polyData.indexOf('[', tempPos2) + 1,
          polyData.indexOf(']', tempPos2)
        )
        .split(' ')
        .map(str => str.split(','));

      customShape.add(createCustomShape(dots, faces, 0xff6622));

      tempPos2 = polyData.indexOf('dots', tempPos2);
      if (tempPos2 > endShape) {
        break;
      }
    }

    lettersMesh.push(customShape);
    tempPos1 = polyData.indexOf('shape', endShape);
  }

  lettersMesh.map(shape => scene.add(shape));

  // ambient light
  // const ambient = new THREE.AmbientLight(0xffffff, 0.005);
  // scene.add(ambient);

  // spot light
  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(-100, 50, -200);
  spotLight.angle = Math.PI / 10;
  spotLight.intensity = 4;
  spotLight.penumbra = 1;
  spotLight.decay = 2;
  spotLight.distance = 500;

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 300;

  scene.add(spotLight);

  // spotLight.target.position.set(-20, 0, 0);
  // scene.add(spotLight.target);

  const lightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(lightHelper);

  // const shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  // scene.add(shadowCameraHelper);

  // moving light
  const pointLight = new THREE.PointLight(0xff9933, 4, 100, 2);
  pointLight.position.set(0, 0, 40);
  pointLight.distance = 200;
  // pointLight.intensity = 1;
  pointLight.decay = 2;
  scene.add(pointLight);

  pointLight.castShadow = true;

  const sphereSize = 5;
  const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
  scene.add(pointLightHelper);

  // rendering
  let lightMoveDirection = 0;
  const PI = Math.PI;
  const rX = 90;
  const rY = 50;

  const animate = () => {
    requestAnimationFrame(animate);

    if (lightMoveDirection >= 400) {
      lightMoveDirection = 0;
    }

    pointLight.position.x = rX * Math.cos((PI * lightMoveDirection) / 200);
    pointLight.position.y = rY * Math.sin((PI * lightMoveDirection) / 100);

    lightMoveDirection++;

    renderer.render(scene, camera);
  };
  animate();

  // events
  const objectsToChange = [...lettersMesh]; // objectsToChange

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
        position({ z: -1 });
        break;
      case 68:
        position({ x: 1 });
        break;
      case 83:
        position({ z: 1 });
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
        position({ y: 1 });
        // rotation({ x: -0.05 });
        break;
      case 70:
        position({ y: -1 });
        // rotation({ x: 0.05 });
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
