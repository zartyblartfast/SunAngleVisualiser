import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { calculateSolarElevation, calculateSolarAzimuth, calculateSolarDeclination } from './solar_calculations.js';

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
    controls.dampingFactor = 0.1;  // Increased damping for smoother movement
    controls.zoomSpeed = 0.5;      // Reduced zoom speed (default is 1.0)
    controls.minPolarAngle = 0;    // Don't allow camera to go above the zenith
    controls.maxPolarAngle = Math.PI / 2; // Don't allow camera to go below horizon

    // Create celestial dome lines
    function createDomeLines() {
        const radius = 3;
        const group = new THREE.Group();

        // Create horizon circle
        const thinLineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x4682B4,
            linewidth: 0.1,
            transparent: true,
            opacity: 0.4
        });

        const horizonGeometry = new THREE.CircleGeometry(radius, 64);
        horizonGeometry.rotateX(-Math.PI / 2);
        const horizonLine = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(horizonGeometry.vertices || 
                Array.from(horizonGeometry.attributes.position.array).reduce((acc, val, i) => {
                    if (i % 3 === 0) acc.push(new THREE.Vector3(val, horizonGeometry.attributes.position.array[i + 1], horizonGeometry.attributes.position.array[i + 2]));
                    return acc;
                }, [])),
            thinLineMaterial
        );
        group.add(horizonLine);

        // Create meridian lines (vertical circles at 15-degree intervals)
        const meridianAngles = [];
        for (let angle = 0; angle <= Math.PI * 2; angle += Math.PI/12) { // PI/12 = 15 degrees
            meridianAngles.push(angle);
        }

        meridianAngles.forEach(azimuth => {
            const points = [];
            // Start from horizon (alt=0) to zenith (alt=PI/2)
            // Use smaller steps for smoother curves
            for (let alt = 0; alt <= Math.PI/2; alt += Math.PI/64) {
                const x = radius * Math.cos(alt) * Math.sin(azimuth);
                const y = radius * Math.sin(alt);
                const z = radius * Math.cos(alt) * Math.cos(azimuth);
                points.push(new THREE.Vector3(x, y, z));
            }
            // Add the exact zenith point to ensure all lines meet there
            points.push(new THREE.Vector3(0, radius, 0));
            
            const meridianGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const meridianLine = new THREE.Line(meridianGeometry, thinLineMaterial);
            group.add(meridianLine);
        });

        // Create parallel lines (altitude circles)
        const altitudes = [15, 30, 45, 60, 75]; // degrees
        altitudes.forEach(altDeg => {
            const alt = altDeg * Math.PI / 180;
            const points = [];
            for (let azimuth = 0; azimuth <= Math.PI * 2; azimuth += Math.PI/32) {
                const x = radius * Math.cos(alt) * Math.sin(azimuth);
                const y = radius * Math.sin(alt);
                const z = radius * Math.cos(alt) * Math.cos(azimuth);
                points.push(new THREE.Vector3(x, y, z));
            }
            // Close the circle by connecting back to the start
            const firstPoint = points[0];
            points.push(firstPoint);
            
            const parallelGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const parallelLine = new THREE.Line(parallelGeometry, thinLineMaterial);
            group.add(parallelLine);
        });

        return group;
    }

    // Create celestial dome
    celestialDome = createDomeLines();
    scene.add(celestialDome);

    // Create straight N-S and E-W axis lines
    const lineLength = 7.0;  // Total length of each line (extending beyond circle)
    
    // Create completely separate materials for each line
    const ewLineMaterial = new THREE.LineBasicMaterial({
        color: 0xFF0000,  // Red for East-West
        linewidth: 1,
        transparent: false,
        depthWrite: false,
        depthTest: false
    });

    const nsLineMaterial = new THREE.LineBasicMaterial({
        color: 0x0000FF,  // Blue for North-South
        linewidth: 1,
        transparent: false,
        depthWrite: false,
        depthTest: false
    });

    // East-West line (red)
    const ewPoints = [
        new THREE.Vector3(-lineLength/2, 0, 0),
        new THREE.Vector3(lineLength/2, 0, 0)
    ];
    const ewGeometry = new THREE.BufferGeometry().setFromPoints(ewPoints);
    const ewLine = new THREE.Line(ewGeometry, ewLineMaterial);
    ewLine.renderOrder = 2;
    scene.add(ewLine);

    // North-South line (blue)
    const nsPoints = [
        new THREE.Vector3(0, 0, -lineLength/2),
        new THREE.Vector3(0, 0, lineLength/2)
    ];
    const nsGeometry = new THREE.BufferGeometry().setFromPoints(nsPoints);
    const nsLine = new THREE.Line(nsGeometry, nsLineMaterial);
    nsLine.renderOrder = 2;
    scene.add(nsLine);

    // Vertical line (zenith line)
    const zenithLineMaterial = new THREE.LineBasicMaterial({
        color: 0x808080,  // Grey color
        linewidth: 1,
        transparent: false,
        depthWrite: false,
        depthTest: false
    });

    const zenithPoints = [
        new THREE.Vector3(0, 0, 0),        // Base center
        new THREE.Vector3(0, 3, 0)     // Zenith point
    ];
    const zenithGeometry = new THREE.BufferGeometry().setFromPoints(zenithPoints);
    const zenithLine = new THREE.Line(zenithGeometry, zenithLineMaterial);
    zenithLine.renderOrder = 2;
    scene.add(zenithLine);

    // Create ground plane
    const planeGeometry = new THREE.CircleGeometry(3, 32);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xA9A9A9,  // Darker grey (DarkGray)
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    groundPlane.rotation.x = -Math.PI / 2;
    scene.add(groundPlane);

    // Add cardinal direction labels using sprites
    function createTextSprite(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 64;
        canvas.height = 64;

        // Draw dark grey background circle
        context.beginPath();
        context.arc(32, 32, 28, 0, 2 * Math.PI);
        context.fillStyle = '#404040';  // Dark grey
        context.fill();

        // Draw white text
        context.font = 'Bold 48px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 32, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            depthWrite: false,
            depthTest: false
        });
        return new THREE.Sprite(spriteMaterial);
    }

    // Create and position cardinal direction labels
    const labelOffset = lineLength/2 + 0.3; // Slightly beyond line ends
    
    // North label
    const northLabel = createTextSprite('N');
    northLabel.position.set(0, 0, -labelOffset);
    northLabel.scale.set(0.5, 0.5, 1);
    scene.add(northLabel);

    // South label
    const southLabel = createTextSprite('S');
    southLabel.position.set(0, 0, labelOffset);
    southLabel.scale.set(0.5, 0.5, 1);
    scene.add(southLabel);

    // East label
    const eastLabel = createTextSprite('E');
    eastLabel.position.set(labelOffset, 0, 0);
    eastLabel.scale.set(0.5, 0.5, 1);
    scene.add(eastLabel);

    // West label
    const westLabel = createTextSprite('W');
    westLabel.position.set(-labelOffset, 0, 0);
    westLabel.scale.set(0.5, 0.5, 1);
    scene.add(westLabel);

    // Create sun point
    const sunGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    sunPoint = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sunPoint);

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
    // Remove old HTML-based markers as we're now using sprites
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

export function drawSunPath() {
    // Function emptied out to remove sun path visualization
    // This can be implemented later with different visualization approach
}
