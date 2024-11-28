import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

// Ambient Light for overall illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Adjust intensity
scene.add(ambientLight);

// Directional Light for focus and shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Brighter intensity
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);


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

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Load the 3D Model
let model: THREE.Object3D;
const loader = new GLTFLoader();
loader.load('/model.glb', (gltf) => {
    model = gltf.scene;
    scene.add(model);

    // Center and scale the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    model.position.sub(center);
    model.scale.set(2 / size, 2 / size, 2 / size);

    // Initial Camera Position
    const distance = size * 3.5;
    camera.position.set(distance, distance, distance);
    camera.lookAt(center);

    // Add Labels
    addLabel('Part A', new THREE.Vector3(0, 1, 0));
    addLabel('Part B', new THREE.Vector3(1, -1, 0));
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

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
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

// Scroll-Based Animation
let scrollY = 0;
window.addEventListener('scroll', () => {
    const scrollPercentage = window.scrollY / document.body.scrollHeight;
    if (model) {
        // Zoom based on scroll
        const distance = 10 - scrollPercentage * 5; // Adjust zoom range
        camera.position.set(distance, distance, distance);
        camera.lookAt(model.position);

        // Rotate model on scroll
        model.rotation.y = scrollPercentage * Math.PI * 2;
    }
});
