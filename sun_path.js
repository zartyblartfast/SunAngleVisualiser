import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let celestialDome, groundPlane, sunPath, sunPoint;

export function initSunPathDiagram(containerId) {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    // Create renderer
    const container = document.getElementById(containerId);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create celestial dome
    const domeGeometry = new THREE.SphereGeometry(3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMaterial = new THREE.MeshBasicMaterial({
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    celestialDome = new THREE.Mesh(domeGeometry, domeMaterial);
    scene.add(celestialDome);

    // Create ground plane
    const planeGeometry = new THREE.CircleGeometry(3, 32);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x90EE90,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    groundPlane.rotation.x = -Math.PI / 2;
    scene.add(groundPlane);

    // Add cardinal directions
    addCardinalMarkers();

    // Create sun point
    const sunGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    sunPoint = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sunPoint);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(4);
    scene.add(axesHelper);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function addCardinalMarkers() {
    const radius = 3.2;
    const directions = [
        { label: 'N', angle: 0 },
        { label: 'E', angle: Math.PI / 2 },
        { label: 'S', angle: Math.PI },
        { label: 'W', angle: -Math.PI / 2 }
    ];

    directions.forEach(dir => {
        const x = radius * Math.sin(dir.angle);
        const z = radius * Math.cos(dir.angle);
        
        const div = document.createElement('div');
        div.className = 'cardinal-marker';
        div.textContent = dir.label;
        div.style.position = 'absolute';
        
        const vector = new THREE.Vector3(x, 0, z);
        vector.project(camera);
        
        div.style.left = (vector.x * 0.5 + 0.5) * window.innerWidth + 'px';
        div.style.top = (-vector.y * 0.5 + 0.5) * window.innerHeight + 'px';
        
        document.body.appendChild(div);
    });
}

function onWindowResize() {
    const container = renderer.domElement.parentElement;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

export function updateSunPosition(altitude, azimuth) {
    if (!sunPoint) return;

    // Convert angles to radians
    const altRad = altitude * Math.PI / 180;
    const azRad = azimuth * Math.PI / 180;

    // Calculate position on celestial dome
    const radius = 3;
    const x = radius * Math.cos(altRad) * Math.sin(azRad);
    const y = radius * Math.sin(altRad);
    const z = radius * Math.cos(altRad) * Math.cos(azRad);

    sunPoint.position.set(x, y, z);
}

export function drawSunPath(latitude, date) {
    // Remove existing sun path if any
    if (sunPath) {
        scene.remove(sunPath);
    }

    const points = [];
    for (let hour = 0; hour <= 24; hour += 0.5) {
        const time = new Date(date);
        time.setHours(hour);
        time.setMinutes((hour % 1) * 60);
        
        // Calculate sun position for this time
        const altitude = calculateSolarPosition(latitude, date, hour);
        const azimuth = calculateAzimuth(latitude, date, hour);
        
        // Convert to 3D coordinates
        const radius = 3;
        const altRad = altitude * Math.PI / 180;
        const azRad = azimuth * Math.PI / 180;
        
        const x = radius * Math.cos(altRad) * Math.sin(azRad);
        const y = radius * Math.sin(altRad);
        const z = radius * Math.cos(altRad) * Math.cos(azRad);
        
        points.push(new THREE.Vector3(x, y, z));
    }

    const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    sunPath = new THREE.Line(pathGeometry, pathMaterial);
    scene.add(sunPath);
}
