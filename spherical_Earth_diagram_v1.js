// spherical_Earth_diagram.js

function createSphericalEarthDiagram(latitude) {
    const svgWidth = 400;
    const svgHeight = 300;
    const radius = 100; // Radius of the Earth circle
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;

    // Clear existing SVG
    const svgContainer = document.getElementById('spherical-earth-diagram');
    svgContainer.innerHTML = ''; // Clear previous content

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svgContainer.appendChild(svg);

    // Draw the Earth circle
    const earthCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    earthCircle.setAttribute("cx", centerX);
    earthCircle.setAttribute("cy", centerY);
    earthCircle.setAttribute("r", radius);
    earthCircle.setAttribute("stroke", "black");
    earthCircle.setAttribute("fill", "none");
    svg.appendChild(earthCircle);

    // Draw latitude lines
    for (let i = -90; i <= 90; i += 15) {
        const y = centerY + (radius * Math.sin((i * Math.PI) / 180));
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", centerX - radius);
        line.setAttribute("y1", y);
        line.setAttribute("x2", centerX + radius);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "lightgray");
        svg.appendChild(line);
    }

    // Draw the Earth's axis (only two lines for poles)
    const northPoleLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    northPoleLine.setAttribute("x1", centerX);
    northPoleLine.setAttribute("y1", centerY - radius); // Top of the circle
    northPoleLine.setAttribute("x2", centerX);
    northPoleLine.setAttribute("y2", centerY - radius - 20); // Short line for North Pole
    northPoleLine.setAttribute("stroke", "black");
    svg.appendChild(northPoleLine);

    const southPoleLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    southPoleLine.setAttribute("x1", centerX);
    southPoleLine.setAttribute("y1", centerY + radius); // Bottom of the circle
    southPoleLine.setAttribute("x2", centerX);
    southPoleLine.setAttribute("y2", centerY + radius + 20); // Short line for South Pole
    southPoleLine.setAttribute("stroke", "black");
    svg.appendChild(southPoleLine);

    // Draw sun rays (arrows) to the right of the circle
    const arrowLength = 30; // Length of the arrows
    const arrowSpacing = 40; // Space between arrows
    const arrowCount = 3; // Number of arrows (one for Equator, one for Tropics)

    for (let i = 0; i < arrowCount; i++) {
        const y = centerY - (arrowCount - 1) * arrowSpacing / 2 + i * arrowSpacing; // Calculate y position

        // Draw the arrow line
        const arrowLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        arrowLine.setAttribute("x1", centerX + radius + 10); // Start just outside the circle
        arrowLine.setAttribute("y1", y); // Y position based on the loop
        arrowLine.setAttribute("x2", centerX + radius + 10 + arrowLength); // End at the same y position, extended to the right
        arrowLine.setAttribute("y2", y); // Keep y position the same
        arrowLine.setAttribute("stroke", "black");
        arrowLine.setAttribute("stroke-width", "2");
        svg.appendChild(arrowLine);

        // Draw arrowhead
        const arrowHeadSize = 5; // Size of the arrowhead
        const arrowHead1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        arrowHead1.setAttribute("x1", centerX + radius + 10); // Position at the end of the arrow line
        arrowHead1.setAttribute("y1", y);
        arrowHead1.setAttribute("x2", centerX + radius + 10 - arrowHeadSize); // Pointing left
        arrowHead1.setAttribute("y2", y - arrowHeadSize); // Upward
        arrowHead1.setAttribute("stroke", "black");
        arrowHead1.setAttribute("stroke-width", "2");
        svg.appendChild(arrowHead1);

        const arrowHead2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        arrowHead2.setAttribute("x1", centerX + radius + 10); // Position at the end of the arrow line
        arrowHead2.setAttribute("y1", y);
        arrowHead2.setAttribute("x2", centerX + radius + 10 - arrowHeadSize); // Pointing left
        arrowHead2.setAttribute("y2", y + arrowHeadSize); // Downward
        arrowHead2.setAttribute("stroke", "black");
        arrowHead2.setAttribute("stroke-width", "2");
        svg.appendChild(arrowHead2);
    }

    // Rotate the Earth based on latitude
    const rotationAngle = latitude; // Use the latitude value for rotation
    svg.setAttribute("transform", `rotate(${rotationAngle}, ${centerX}, ${centerY})`);
}

// Function to update the diagram when the input changes
function updateDiagram() {
    const latitudeInput = document.getElementById('latitude-overhead-input');
    const latitude = parseFloat(latitudeInput.value);
    createSphericalEarthDiagram(latitude);
}

// Event listener for the latitude input
document.getElementById('latitude-overhead-input').addEventListener('input', updateDiagram);

// Initial call to create the diagram with the default value
document.addEventListener('DOMContentLoaded', () => {
    const latitudeInput = document.getElementById('latitude-overhead-input');
    const initialLatitude = parseFloat(latitudeInput.value);
    createSphericalEarthDiagram(initialLatitude);
});