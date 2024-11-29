import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Load the 3D Model
let model: THREE.Object3D | undefined;
const loader = new GLTFLoader();
loader.load('/model.glb', (gltf) => {
    model = gltf.scene;
    scene.add(model);

    // Center and scale the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    model.position.sub(center);
    model.scale.set(5 / size,5 / size, 5 / size);

    // Apply custom rotation to ensure model is upright
    model.rotation.x = THREE.MathUtils.degToRad(0); // Convert degrees to radians
    model.rotation.z = THREE.MathUtils.degToRad(0);

    // Position the camera
    const cameraDistance = size * 2.5;
    camera.position.set(cameraDistance, cameraDistance / 3, cameraDistance);
    camera.lookAt(0, 0, 0);

    console.log('Model Loaded:', model);
});

// Restrict Rotation to Left-Right (Compensating for Initial Rotation)
let isDragging = false;
let previousMousePosition = { x: 0 };

window.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition.x = event.clientX;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('mousemove', (event) => {
    if (!isDragging || !model) return;

    const deltaX = event.clientX - previousMousePosition.x;

    // Adjust rotation based on the current orientation
    const rotationAdjustment = 0.01; // Sensitivity of rotation
    model.rotation.y += deltaX * rotationAdjustment;

    previousMousePosition.x = event.clientX;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
