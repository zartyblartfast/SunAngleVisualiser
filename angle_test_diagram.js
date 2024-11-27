// Import required utilities
import { normalizeAngle } from './utilities.js';
import { toSVGAngle, fromSVGAngle } from './angle_utilities.js';

export function createAngleTestDiagram() {
    // Get the container
    const container = document.getElementById('angle-test-diagram');
    if (!container) {
        console.error('Angle test diagram container not found');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Create SVG element with proper dimensions
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 400 400");
    container.appendChild(svg);

    // Center of the circle
    const centerX = 200;
    const centerY = 200;
    const radius = 150;

    // Draw base circle
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", centerX);
    circle.setAttribute("cy", centerY);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "1");
    svg.appendChild(circle);

    // Draw angle labels around the circle
    for (let angle = 0; angle < 360; angle += 10) {
        const radians = (angle * Math.PI) / 180;
        const labelRadius = radius + 20;

        const labelX = centerX + labelRadius * Math.cos(radians);
        const labelY = centerY - labelRadius * Math.sin(radians);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", labelX);
        text.setAttribute("y", labelY);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("font-size", "10");
        text.textContent = `${angle}°`; // SVG angle
        svg.appendChild(text);
    }

    // Get current inputs
    const latitude = parseFloat(document.getElementById('location-latitude-input').value) || 0;
    const solarDeclination = parseFloat(document.getElementById('latitude-overhead-input').value) || 0;
    const solarElevationOutput = parseFloat(document.getElementById('solar-elevation-output').value) || 0;

    // Convert angles to SVG equivalents
    const tangentAngle = latitude; // Geometric angle
    const tangentSVGAngle = ((latitude - 90 + 360) % 360); // SVG equivalent
    const solarLineAngle = latitude + solarElevationOutput; // Geometric solar altitude angle
    const solarLineSVGAngle = ((solarLineAngle - 90 + 360) % 360); // SVG equivalent

    // Draw the tangent line
    drawTangentLine(svg, centerX, centerY, radius, tangentAngle);

    // Draw the solar altitude line
    drawDynamicSunLine(svg, centerX, centerY, radius, latitude, solarDeclination, solarElevationOutput);

    // Arc and shading (preserve functionality)
    const offsetAngle = 10;
    if (offsetAngle > 0) {
        drawArcAndShading(svg, centerX, centerY, radius, latitude, offsetAngle);
    }

    // Add informational labels
    addDiagramLabels(
        svg,
        400,
        400,
        latitude,
        solarDeclination,
        solarElevationOutput,
        tangentAngle,
        tangentSVGAngle,
        solarLineAngle,
        solarLineSVGAngle
    );
}

// Function to draw the tangent line
function drawTangentLine(svg, centerX, centerY, radius, tangentAngle) {
    const tangentRadians = (tangentAngle * Math.PI) / 180;
    const startX = centerX - radius * Math.cos(tangentRadians);
    const startY = centerY + radius * Math.sin(tangentRadians);
    const endX = centerX + radius * Math.cos(tangentRadians);
    const endY = centerY - radius * Math.sin(tangentRadians);

    const tangentLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    tangentLine.setAttribute("x1", startX);
    tangentLine.setAttribute("y1", startY);
    tangentLine.setAttribute("x2", endX);
    tangentLine.setAttribute("y2", endY);
    tangentLine.setAttribute("stroke", "green");
    tangentLine.setAttribute("stroke-width", "3");
    tangentLine.setAttribute("stroke-dasharray", "5,5");
    svg.appendChild(tangentLine);
}

// Function to draw the solar altitude line
function drawDynamicSunLine(svg, centerX, centerY, radius, latitude, solarDeclination, solarElevation) {
    const tangentAngle = latitude;
    const sunAngle = tangentAngle + (latitude > solarDeclination ? -solarElevation : solarElevation);
    const sunRadians = (sunAngle * Math.PI) / 180;

    const endX = centerX + radius * 1.5 * Math.cos(sunRadians);
    const endY = centerY - radius * 1.5 * Math.sin(sunRadians);

    const sunLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    sunLine.setAttribute("x1", centerX);
    sunLine.setAttribute("y1", centerY);
    sunLine.setAttribute("x2", endX);
    sunLine.setAttribute("y2", endY);
    sunLine.setAttribute("stroke", "orange");
    sunLine.setAttribute("stroke-width", "2");
    svg.appendChild(sunLine);
}

// Function to draw the arc and shading
function drawArcAndShading(svg, centerX, centerY, radius, latitude, offsetAngle) {
    const arcRadius = radius * 3.0;
    const offsetRadians = (offsetAngle * Math.PI) / 180;
    const tangentRadians = (latitude * Math.PI) / 180;

    const startRadians = tangentRadians - offsetRadians;
    const endRadians = tangentRadians + Math.PI + offsetRadians;

    const startX = centerX + radius * Math.cos(startRadians);
    const startY = centerY - radius * Math.sin(startRadians);
    const endX = centerX + radius * Math.cos(endRadians);
    const endY = centerY - radius * Math.sin(endRadians);

    const arcPath = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 0 0 ${endX} ${endY}`;
    const circPath = `A ${radius} ${radius} 0 0 0 ${startX} ${startY} Z`;

    // Draw arc (brown stroke)
    const arcLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arcLine.setAttribute("d", arcPath);
    arcLine.setAttribute("stroke", "brown");
    arcLine.setAttribute("stroke-width", "2");
    arcLine.setAttribute("fill", "none");
    svg.appendChild(arcLine);

    // Draw shading (light gray fill)
    const shadingPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    shadingPath.setAttribute("d", `${arcPath} ${circPath}`);
    shadingPath.setAttribute("fill", "rgba(128, 128, 128, 0.2)");
    shadingPath.setAttribute("stroke", "none");
    svg.appendChild(shadingPath);
}

// Function to add informational labels
function addDiagramLabels(svg, width, height, latitude, solarDeclination, solarElevation, tangentAngle, tangentSVGAngle, solarLineAngle, solarLineSVGAngle) {
    const labelX = 10;
    let labelY = height - 160;
    const lineHeight = 20;

    const labels = [
        `Location Latitude: ${latitude.toFixed(1)}°`,
        `Solar Declination: ${solarDeclination.toFixed(1)}°`,
        `Solar Altitude: ${solarElevation.toFixed(1)}°`,
        `Tangent Line Angle (Geometric): ${tangentAngle.toFixed(1)}°`,
        `Tangent Line Angle (SVG): ${tangentSVGAngle.toFixed(1)}°`,
        `Solar Line Angle (Geometric): ${solarLineAngle.toFixed(1)}°`,
        `Solar Line Angle (SVG): ${solarLineSVGAngle.toFixed(1)}°`
    ];

    labels.forEach((text, index) => {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", labelX);
        label.setAttribute("y", labelY + (index * lineHeight));
        label.setAttribute("fill", "black");
        label.setAttribute("font-size", "12px");
        label.textContent = text;
        svg.appendChild(label);
    });
}
