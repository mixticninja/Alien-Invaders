// 3d.js

let scene, camera, renderer, sphere, offscreenCanvas, offscreenContext;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Utiliser un canvas visible pour le débogage
    offscreenCanvas = document.getElementById('gameCanvas');
    offscreenContext = offscreenCanvas.getContext('2d');

    try {
        renderer = new THREE.WebGLRenderer({ canvas: offscreenCanvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
    } catch (error) {
        console.error('Error creating WebGL context:', error);
        return;
    }

    // Vérifier les erreurs de contexte WebGL
    const gl = renderer.getContext();
    if (!gl) {
        console.error('WebGL context is not available.');
        return;
    }

    // Créer une sphère semi-transparente
    const geometry = new THREE.SphereGeometry(15, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 50;

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Faire tourner la sphère
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
}

function updateSpherePosition(x, y) {
    if (sphere) {
        sphere.position.x = x;
        sphere.position.y = y;
    }
}

function getOffscreenCanvasImage() {
    return offscreenCanvas;
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    offscreenCanvas.width = window.innerWidth;
    offscreenCanvas.height = window.innerHeight;
});