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
        text.setAttribute("font-size", "10");
        text.textContent = `${angle}°`;
        svg.appendChild(text);
    }

    // Get current inputs
    const latitude = parseFloat(document.getElementById('location-latitude-input').value) || 0;
    const solarDeclination = parseFloat(document.getElementById('latitude-overhead-input').value) || 0;
    const solarElevationOutput = parseFloat(document.getElementById('solar-elevation-output').value) || 0;

    // Calculate tangent line angle in SVG coordinates
    const tangentAngle = ((latitude - 90 + 360) % 360);
    const tangentRadians = (tangentAngle * Math.PI) / 180;

    // Draw the tangent line
    const tangentLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    tangentLine.setAttribute("x1", centerX - radius * Math.cos(tangentRadians));
    tangentLine.setAttribute("y1", centerY + radius * Math.sin(tangentRadians));
    tangentLine.setAttribute("x2", centerX + radius * Math.cos(tangentRadians));
    tangentLine.setAttribute("y2", centerY - radius * Math.sin(tangentRadians));
    tangentLine.setAttribute("stroke", "green");
    tangentLine.setAttribute("stroke-width", "1");
    tangentLine.setAttribute("stroke-dasharray", "4");
    svg.appendChild(tangentLine);

    // Draw solar elevation line (independent of arc calculations)
    const combinedAngle = latitude + solarElevationOutput;
    const sunLineAngle = ((combinedAngle - 90 + 360) % 360);
    const sunRadians = (sunLineAngle * Math.PI) / 180;

    const sunLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    sunLine.setAttribute("x1", centerX);
    sunLine.setAttribute("y1", centerY);
    sunLine.setAttribute("x2", centerX + radius * Math.cos(sunRadians));
    sunLine.setAttribute("y2", centerY - radius * Math.sin(sunRadians));
    sunLine.setAttribute("stroke", "#FFD700");
    sunLine.setAttribute("stroke-width", "2");
    svg.appendChild(sunLine);

    // Arc calculations (if offset angle is provided)
    const offsetAngle = 10; // Adjust as needed
    console.log('=== Earth Surface Arc Calculations ===');
    console.log('1. Initial Parameters:', {
        offsetAngle,
        latitude,
        radius,
        tangentAngle,
        tangentRadians,
        centerPoint: { x: centerX, y: centerY }
    });

    if (offsetAngle > 0) {
        const offsetRadians = (offsetAngle * Math.PI) / 180;
    
        // Perpendicular angle to tangent
        const perpRadians = tangentRadians + Math.PI / 2;
    
        // Adjust arc radius (slightly larger than circle radius)
        const arcRadius = radius * 3.0; // Increase radius by 5%
        const displacement = Math.sqrt(arcRadius ** 2 - radius ** 2) * 0.8; // Reduce displacement
        const arcCenterX = centerX + displacement * Math.cos(perpRadians);
        const arcCenterY = centerY + displacement * Math.sin(perpRadians);
    
        console.log("Refined Arc Center:", { x: arcCenterX, y: arcCenterY });
    
        // Start and end angles (10 degrees below tangent line)
        const startRadians = tangentRadians - offsetRadians; // Upper point - 10 degrees below
        const endRadians = tangentRadians + Math.PI + offsetRadians; // Lower point - 10 degrees below
    
        // Start and end points (on the circle's circumference)
        const startX = centerX + radius * Math.cos(startRadians);
        const startY = centerY - radius * Math.sin(startRadians); // Adjust for SVG Y-direction
        const endX = centerX + radius * Math.cos(endRadians);
        const endY = centerY - radius * Math.sin(endRadians); // Adjust for SVG Y-direction
    
        console.log("Refined Start Point:", { x: startX, y: startY });
        console.log("Refined End Point:", { x: endX, y: endY });
    
        // Debugging: Arc center point
        const debugCenter = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        debugCenter.setAttribute("cx", arcCenterX);
        debugCenter.setAttribute("cy", arcCenterY);
        debugCenter.setAttribute("r", 5);
        debugCenter.setAttribute("fill", "red");
        svg.appendChild(debugCenter);
    
        const startPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        startPoint.setAttribute("cx", startX);
        startPoint.setAttribute("cy", startY);
        startPoint.setAttribute("r", 5);
        startPoint.setAttribute("fill", "green");
        svg.appendChild(startPoint);
    
        const endPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        endPoint.setAttribute("cx", endX);
        endPoint.setAttribute("cy", endY);
        endPoint.setAttribute("r", 5);
        endPoint.setAttribute("fill", "orange");
        svg.appendChild(endPoint);
    
        // Draw the arc
        const largeArcFlag = 0; // Small arc
        const sweepFlag = 0;    // Counterclockwise for inward arc
        const pathData = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
    
        console.log("Refined Arc Path Data:", pathData);
    
        const arcPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arcPath.setAttribute("d", pathData);
        arcPath.setAttribute("stroke", "brown");
        arcPath.setAttribute("stroke-width", "2");
        arcPath.setAttribute("fill", "none");
        svg.appendChild(arcPath);
    }
}    