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
    model.position.sub(center); // Center the model
    model.scale.set(10 / size, 10 / size, 10 / size); // Scale to a reasonable size

    // Ensure the model is upright
    model.rotation.set(0, 0, 0); // Reset rotation to upright
    console.log('Model Loaded:', model);

    // Position the camera to fit the model
    const cameraDistance = size * 2.5;
    camera.position.set(0, size, cameraDistance); // Slightly above and back
    camera.lookAt(0, 0, 0); // Center camera on the model
});

// Restrict Rotation to Horizontal Only
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

    // Rotate the model only along the Y-axis for horizontal movement
    model.rotation.y += deltaX * 0.01; // Adjust sensitivity as needed

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
