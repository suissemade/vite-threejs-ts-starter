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
    model.scale.set(5 / size, 5 / size, 5 / size);

    // Set initial camera position
    camera.position.set(size * 2, size * 2, size * 2);
    camera.lookAt(center);

    // Add Labels
    addLabel('Feature 1', new THREE.Vector3(0, 1, 0));
    addLabel('Feature 2', new THREE.Vector3(1, -1, 0));
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

// Scroll Hijacking Variables
let currentStep = 0;
const totalSteps = 100;

// Hijack Scroll and Control Animation
window.addEventListener('wheel', (event) => {
    event.preventDefault();

    if (!model) return;

    const delta = Math.sign(event.deltaY); // Scroll direction
    if (delta > 0 && currentStep < totalSteps) {
        currentStep++;
        animateScroll(currentStep / totalSteps);
    } else if (delta < 0 && currentStep > 0) {
        currentStep--;
        animateScroll(currentStep / totalSteps);
    }
}, { passive: false });

// Animate Camera and Model Based on Progress
function animateScroll(progress: number) {
    const minDistance = 5;
    const maxDistance = 20;
    const distance = minDistance + (maxDistance - minDistance) * (1 - progress);

    // Update camera position
    camera.position.set(distance, distance, distance);

    // Rotate the model
    if (model) {
        model.rotation.y = progress * Math.PI * 2;
    }

    // Focus on model center
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    camera.lookAt(center);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();
