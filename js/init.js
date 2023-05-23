
function init(THREE) {
  // Init ThreeJS
  const canvas = document.querySelector('#c');
  const scene = new THREE.Scene();

  // Create renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, logarithmicDepthBuffer: true });
  renderer.stencil = true;
  if (window.devicePixelRatio < 1.5) {
    renderer.setPixelRatio(window.devicePixelRatio);
  } else {
    renderer.setPixelRatio(2);
  }
  renderer.shadowMapSoft = true;
  renderer.powerPreference = "high-performance";
  renderer.shadowMap.enabled = true
  renderer.gammaFactor = 2.2;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;


  // Setup camera
  const fov = 20;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const near = 1;
  const far = 400;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 180);
  camera.lookAt(new THREE.Vector3(0, 0, 0))


  const render_canvas = renderer.domElement;
  renderer.setSize(render_canvas.clientWidth, render_canvas.clientHeight, false);
  camera.aspect = render_canvas.clientWidth / render_canvas.clientHeight;
  camera.updateProjectionMatrix();

  // Update canvas and camera on resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(render_canvas.clientWidth, render_canvas.clientHeight, false);

  }
  window.addEventListener('resize', onWindowResize, false);

  return { scene, renderer, camera }
}

export {
  init
}