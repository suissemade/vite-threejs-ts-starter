import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // General illumination
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Directional lighting
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
    model.position.sub(center); // Center the model
    model.scale.set(10 / size, 10 / size, 10 / size); // Adjust scale for visibility

    // Ensure model is upright
    model.rotation.x = 0; // Ensure upright orientation
    model.rotation.z = 120;

    // Position the camera to view the entire model
    const cameraDistance = size * 2.5; // Adjust the multiplier for further zoom out
    camera.position.set(cameraDistance, cameraDistance / 3, cameraDistance); // Offset slightly for better view
    camera.lookAt(0, 0, 0); // Center camera on the model

    console.log('Model Loaded:', model); // Debugging
});

// Restrict Camera Rotation to Horizontal Only
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

    // Rotate model only along the Y-axis (left-right)
    model.rotation.y += deltaX * 0.01;

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
