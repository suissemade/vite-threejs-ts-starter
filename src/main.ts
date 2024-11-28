import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CSS2DRenderer for Text Annotations
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

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
    model.scale.set(10 / size, 10 / size, 10 / size); // Adjust scale to make model visible
    model.rotation.x = -Math.PI / 2; // Fix orientation

    // Set initial camera position
    camera.position.set(size * 2, size * 2, size * 2);
    camera.lookAt(center);

    console.log('Model Loaded:', model); // Debugging
});

// Add Text Labels
function addLabel(text: string, position: THREE.Vector3) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = text;
    div.style.marginTop = '-1em';
    const label = new CSS2DObject(div);
    label.position.copy(position);
    scene.add(label);
}

// Scroll Interaction
window.addEventListener('scroll', () => {
    if (!model) return;

    // Get scroll percentage
    const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);

    // Zoom and rotate
    const minDistance = 5;
    const maxDistance = 20;
    const distance = minDistance + (maxDistance - minDistance) * (1 - scrollPercentage);

    camera.position.set(distance, distance, distance); // Adjust camera zoom
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Always look at the center of the scene

    model.rotation.y = scrollPercentage * Math.PI * 2; // Rotate model smoothly
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
