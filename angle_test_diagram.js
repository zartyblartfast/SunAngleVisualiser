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

    // Draw X and Y axes
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", centerX - radius);
    xAxis.setAttribute("y1", centerY);
    xAxis.setAttribute("x2", centerX + radius);
    xAxis.setAttribute("y2", centerY);
    xAxis.setAttribute("stroke", "blue");
    xAxis.setAttribute("stroke-width", "1");
    xAxis.setAttribute("stroke-dasharray", "4");
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", centerX);
    yAxis.setAttribute("y1", centerY - radius);
    yAxis.setAttribute("x2", centerX);
    yAxis.setAttribute("y2", centerY + radius);
    yAxis.setAttribute("stroke", "blue");
    yAxis.setAttribute("stroke-width", "1");
    yAxis.setAttribute("stroke-dasharray", "4");
    svg.appendChild(yAxis);

    // Draw degree ticks and labels every 10 degrees
    for (let angle = 0; angle < 360; angle += 10) {
        // Longer ticks for multiples of 30
        const tickLength = angle % 30 === 0 ? 10 : 5;
        const radians = (angle * Math.PI) / 180;
        const x1 = centerX + (radius - tickLength) * Math.cos(radians);
        const y1 = centerY - (radius - tickLength) * Math.sin(radians);
        const x2 = centerX + radius * Math.cos(radians);
        const y2 = centerY - radius * Math.sin(radians);

        const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tick.setAttribute("x1", x1);
        tick.setAttribute("y1", y1);
        tick.setAttribute("x2", x2);
        tick.setAttribute("y2", y2);
        tick.setAttribute("stroke", "black");
        tick.setAttribute("stroke-width", "1");
        svg.appendChild(tick);

        // Add degree label
        const labelRadius = radius + 20;
        const labelX = centerX + labelRadius * Math.cos(radians);
        const labelY = centerY - labelRadius * Math.sin(radians);
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", labelX);
        text.setAttribute("y", labelY);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("font-size", "10");  // Slightly smaller font for better fit
        text.textContent = `${angle}°`;
        svg.appendChild(text);
    }

    // Get current inputs
    const latitude = parseFloat(document.getElementById('location-latitude-input').value) || 0;
    const solarDeclination = parseFloat(document.getElementById('latitude-overhead-input').value) || 0;
    
    // Calculate solar elevation
    const solarElevation = calculateSolarElevation(latitude, solarDeclination);

    // Calculate tangent line angle based on latitude
    // In solar altitude diagram, tangent line is rotated counterclockwise from vertical by latitude
    const tangentBaseAngle = 90 + latitude; // Start from 90° (vertical) and add latitude for counterclockwise rotation

    // Draw tangent line as full diameter
    const tangentLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const tangentRadians = (tangentBaseAngle * Math.PI) / 180;
    // Calculate both ends of the diameter using the angle + 180° opposite
    tangentLine.setAttribute("x1", centerX - radius * Math.cos(tangentRadians));
    tangentLine.setAttribute("y1", centerY + radius * Math.sin(tangentRadians));
    tangentLine.setAttribute("x2", centerX + radius * Math.cos(tangentRadians));
    tangentLine.setAttribute("y2", centerY - radius * Math.sin(tangentRadians));
    tangentLine.setAttribute("stroke", "green");
    tangentLine.setAttribute("stroke-width", "1");
    tangentLine.setAttribute("stroke-dasharray", "4");
    svg.appendChild(tangentLine);

    // Calculate sun line angle using same logic as solar altitude diagram
    const isSunInSouth = latitude > solarDeclination;
    const isNorthernHemisphere = latitude >= 0;
    
    // Calculate sun line angle relative to the tangent line
    const arcBaseAngle = isSunInSouth ? tangentBaseAngle + 180 : tangentBaseAngle;
    const sunLineAngle = isNorthernHemisphere ? 
        arcBaseAngle + solarElevation : 
        arcBaseAngle - solarElevation;

    // Draw sun line from center
    const sunLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const sunRadians = (sunLineAngle * Math.PI) / 180;
    sunLine.setAttribute("x1", centerX);
    sunLine.setAttribute("y1", centerY);
    sunLine.setAttribute("x2", centerX + radius * Math.cos(sunRadians));
    sunLine.setAttribute("y2", centerY - radius * Math.sin(sunRadians));
    sunLine.setAttribute("stroke", "#FFD700");
    sunLine.setAttribute("stroke-width", "2");
    svg.appendChild(sunLine);

    // Update info display
    const infoDisplay = document.getElementById('angle-test-info');
    if (infoDisplay) {
        infoDisplay.innerHTML = `
            <strong>Input Values:</strong>
            <span>Location Latitude: ${latitude.toFixed(1)}°</span>
            <span>Solar Declination: ${solarDeclination.toFixed(1)}°</span>
            <span>Solar Elevation: ${solarElevation.toFixed(1)}°</span>
            <br>
            <strong>Calculated Angles:</strong>
            <span>Tangent Line SVG Angle: ${tangentBaseAngle.toFixed(1)}°</span>
            <span>Sun Line SVG Angle: ${sunLineAngle.toFixed(1)}°</span>
            <span>Geometric Angle: ${Math.abs(sunLineAngle - tangentBaseAngle).toFixed(1)}°</span>
        `;
    }
}

// Helper function to calculate solar elevation
function calculateSolarElevation(latitude, solarDeclination) {
    // Calculate solar elevation
    const solarElevation = 90 - (latitude - solarDeclination);
    return solarElevation;
}
