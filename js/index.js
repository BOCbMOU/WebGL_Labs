import './three.js';
import './OrbitControl.js';

const onWindowLoad = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('canvas').appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  const createRectangle = (rectangleParams = {}, color = 0xffffff) => {
    const { x = 1, y = 1, z = 1 } = rectangleParams;
    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshPhongMaterial({ color });
    // const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  };

  const cube1 = createRectangle({ x: 2, y: 2, z: 2 });
  cube1.position.set(0, 0, 0);
  cube1.castShadow = true;
  cube1.receiveShadow = true;
  scene.add(cube1);

  const cube2 = createRectangle({ x: 10, y: 10, z: 1 }, 0xff5700);
  cube2.position.set(0, 0, -5);
  cube2.castShadow = true;
  cube2.receiveShadow = true;
  scene.add(cube2);

  const createSphere = (sphereParams = {}, color = 0xffffff) => {
    const {
      r = 1,
      widthSegments = 10,
      heightSegments = widthSegments,
    } = sphereParams;
    const geometry = new THREE.SphereGeometry(r, widthSegments, heightSegments);
    const material = new THREE.MeshPhongMaterial({ color });
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
  };
  const sphere1 = createSphere({ r: 1, widthSegments: 20 }, 0xff2020);
  sphere1.position.set(0, 2.5, 0);
  sphere1.castShadow = true;
  sphere1.receiveShadow = true;
  scene.add(sphere1);

  const createSurface = (size = {}, color = 0x808080) => {
    const { width = 2000, height = width } = size;
    const material = new THREE.MeshPhongMaterial({
      color,
      dithering: true,
    });
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };
  const mesh1 = createSurface();
  mesh1.position.set(0, -5, 0);
  mesh1.rotation.x = -Math.PI * 0.5;
  mesh1.receiveShadow = true;
  scene.add(mesh1);

  // const ambient = new THREE.AmbientLight(0xffffff, 0.01);
  // scene.add(ambient);

  // const spotLight = new THREE.SpotLight(0xffffff, 1);
  // spotLight.position.set(10, 10, 35);
  // spotLight.angle = Math.PI / 10;
  // spotLight.penumbra = 0.05;
  // spotLight.decay = 2;
  // spotLight.distance = 100;

  // spotLight.castShadow = true;
  // spotLight.shadow.mapSize.width = 1024;
  // spotLight.shadow.mapSize.height = 1024;
  // spotLight.shadow.camera.near = 10;
  // spotLight.shadow.camera.far = 200;
  // scene.add(spotLight);

  // const lightHelper = new THREE.SpotLightHelper(spotLight);
  // scene.add(lightHelper);

  // const shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  // scene.add(shadowCameraHelper);

  // moving light
  const pointLight = new THREE.PointLight(0xffffb0, 4, 100, 2);
  pointLight.position.set(-4, 4, 4);
  pointLight.distance = 15;
  // pointLight.intensity = 1;
  pointLight.decay = 2;
  scene.add(pointLight);

  pointLight.castShadow = true;

  const sphereSize = 1;
  const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
  scene.add(pointLightHelper);

  camera.position.set(0, 0, 15);

  // camera.rotation.x -= 1;

  //   cube1.rotation.y -= 0.3;

  let lightMoveDirection = 0;
  const animate = () => {
    requestAnimationFrame(animate);

    // cube1.rotation.x += 0.01;
    cube1.rotation.y += 0.03;
    // cube1.rotation.z += 0.02;

    switch (lightMoveDirection) {
      case 0:
        pointLight.position.x += 0.04;
        if (pointLight.position.x >= 4) {
          lightMoveDirection++;
        }
        break;
      case 1:
        pointLight.position.y -= 0.03;
        pointLight.position.z -= 0.03;
        if (pointLight.position.z <= -4) {
          lightMoveDirection++;
        }
        break;
      case 2:
        pointLight.position.x -= 0.04;
        if (pointLight.position.x <= -4) {
          lightMoveDirection++;
        }
        break;
      case 3:
        pointLight.position.z += 0.04;
        if (pointLight.position.z >= 0) {
          lightMoveDirection++;
        }
        break;
      case 4:
        pointLight.position.y += 0.04;
        if (pointLight.position.y >= 4) {
          lightMoveDirection++;
        }
        break;
      case 5:
        pointLight.position.z += 0.04;
        if (pointLight.position.z >= 4) {
          lightMoveDirection = 0;
        }
        break;
      default:
        break;
    }

    renderer.render(scene, camera);
  };
  animate();

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onWindowResize);
};
window.addEventListener('load', onWindowLoad);
