import { SCALE_FACTOR } from './utilities.js';

// Remove or comment out any existing declarations of latitudeOverheadInput
// const latitudeOverheadInput = document.getElementById('latitude-overhead-input');

// Set up a MutationObserver to watch for value changes
const inputObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
            const input = document.getElementById('latitude-overhead-input');
            console.log('Value changed via MutationObserver:', input.value);
            const solarDeclination = parseFloat(input.value);
            createSphericalEarthDiagram(solarDeclination);
        }
    });
});

// Start observing the input element
const inputToObserve = document.getElementById('latitude-overhead-input');
inputObserver.observe(inputToObserve, {
    attributes: true,
    attributeFilter: ['value']
});

export function createSphericalEarthDiagram(latitude) {
    console.log('createSphericalEarthDiagram called with latitude:', latitude);
    const solarDeclination = parseFloat(document.getElementById('latitude-overhead-input').value);
    console.log('Creating Spherical Earth Diagram:', { latitude, solarDeclination });
    
    // Base dimensions using SCALE_FACTOR
    const radius = 100 * SCALE_FACTOR;
    const svgWidth = 400 * SCALE_FACTOR;
    const svgHeight = 300 * SCALE_FACTOR;
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    
    // Clear existing SVG
    const svgContainer = document.getElementById('spherical-earth-diagram');
    if (!svgContainer) {
        console.error('Spherical Earth diagram container not found!');
        return;
    }
    svgContainer.innerHTML = '';

    // Create SVG element with scaled dimensions
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svgContainer.appendChild(svg);

    // Create and position the label text
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", 10 * SCALE_FACTOR);
    labelText.setAttribute("y", 20 * SCALE_FACTOR);
    labelText.setAttribute("font-family", "Arial");
    labelText.setAttribute("font-size", (14 + (SCALE_FACTOR - 1) * 4) + "px");
    labelText.setAttribute("fill", "black");
    labelText.textContent = `Sun Overhead Range: ±23.5°. Now Over: ${solarDeclination.toFixed(1)}°`;

    svg.appendChild(labelText);

    console.log('Label updated:', labelText.textContent);

    // Add the marker definition
    createLeftArrowMarker(svg);

    // Create Earth group (this rotates)
    const earthGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    earthGroup.setAttribute("transform", `rotate(${solarDeclination}, ${centerX}, ${centerY})`);
    svg.appendChild(earthGroup);

    // Draw Earth circle with scaled radius
    const earthCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    earthCircle.setAttribute("cx", centerX);
    earthCircle.setAttribute("cy", centerY);
    earthCircle.setAttribute("r", radius);
    earthCircle.setAttribute("stroke", "black");
    earthCircle.setAttribute("stroke-width", Math.max(1, SCALE_FACTOR));
    earthCircle.setAttribute("fill", "none");
    earthGroup.appendChild(earthCircle);

    // Draw night-side semi-circle (outside earthGroup so it stays vertical)
    const nightSide = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const nightArc = `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 0 0 ${centerX} ${centerY + radius} L ${centerX} ${centerY - radius}`;
    nightSide.setAttribute("d", nightArc);
    nightSide.setAttribute("fill", "rgb(128, 128, 128)");
    nightSide.setAttribute("fill-opacity", "0.5");
    svg.appendChild(nightSide);

    // Draw latitude lines with scaling
    for (let i = -90; i <= 90; i += 15) {
        const y = centerY + (radius * Math.sin((i * Math.PI) / 180));
        const lineLength = 2 * Math.sqrt(radius ** 2 - (y - centerY) ** 2);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", centerX - lineLength / 2);
        line.setAttribute("y1", y);
        line.setAttribute("x2", centerX + lineLength / 2);
        line.setAttribute("y2", y);

        if (i === 0) {
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", 2 * SCALE_FACTOR);
            line.setAttribute("stroke-dasharray", `${5 * SCALE_FACTOR},${5 * SCALE_FACTOR}`);
        } else {
            line.setAttribute("stroke", "lightgray");
            line.setAttribute("stroke-width", SCALE_FACTOR);
        }
        
        earthGroup.appendChild(line);
    }

    // Draw Tropics with scaling
    const tropicLatitudes = [23.5, -23.5];
    for (let latitude of tropicLatitudes) {
        const y = centerY + (radius * Math.sin((latitude * Math.PI) / 180));
        const lineLength = 2 * Math.sqrt(radius ** 2 - (y - centerY) ** 2);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", centerX - lineLength / 2);
        line.setAttribute("y1", y);
        line.setAttribute("x2", centerX + lineLength / 2);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", 2 * SCALE_FACTOR);
        line.setAttribute("stroke-dasharray", `${5 * SCALE_FACTOR},${5 * SCALE_FACTOR}`);

        earthGroup.appendChild(line);
    }

    // Draw Earth's axis with scaling
    const poleLineLength = 20 * SCALE_FACTOR;
    
    const northPoleLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    northPoleLine.setAttribute("x1", centerX);
    northPoleLine.setAttribute("y1", centerY - radius);
    northPoleLine.setAttribute("x2", centerX);
    northPoleLine.setAttribute("y2", centerY - radius - poleLineLength);
    northPoleLine.setAttribute("stroke", "black");
    northPoleLine.setAttribute("stroke-width", SCALE_FACTOR);
    earthGroup.appendChild(northPoleLine);

    const southPoleLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    southPoleLine.setAttribute("x1", centerX);
    southPoleLine.setAttribute("y1", centerY + radius);
    southPoleLine.setAttribute("x2", centerX);
    southPoleLine.setAttribute("y2", centerY + radius + poleLineLength);
    southPoleLine.setAttribute("stroke", "black");
    southPoleLine.setAttribute("stroke-width", SCALE_FACTOR);
    earthGroup.appendChild(southPoleLine);

    // Create arrow group
    const arrowGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(arrowGroup);

    // Draw sun rays with scaling
    const arrowLength = 45 * SCALE_FACTOR;
    const arrowSpacing = 40 * SCALE_FACTOR;
    const arrowGap = 20 * SCALE_FACTOR;  // Increased gap that scales with diagram
    const totalArrows = 5;
    const startY = centerY - (arrowSpacing * (totalArrows - 1)) / 2;

    for (let i = 0; i < totalArrows; i++) {
        const y = startY + i * arrowSpacing;
        const arrowLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        arrowLine.setAttribute("x1", centerX + radius + arrowGap);  // Scaled gap
        arrowLine.setAttribute("y1", y);
        arrowLine.setAttribute("x2", centerX + radius + arrowGap + arrowLength);
        arrowLine.setAttribute("y2", y);
        arrowLine.setAttribute("stroke", "orange");
        arrowLine.setAttribute("stroke-width", 4 * SCALE_FACTOR);
        arrowLine.setAttribute("marker-start", "url(#leftArrow)");
        arrowGroup.appendChild(arrowLine);
    }

    // Function to create rotated text with more centered horizontal positioning
    function createRotatedText(text, y, fontSize) {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", centerX);  // Set to exact center
        label.setAttribute("y", y - 8);  // Keep the good vertical offset
        label.setAttribute("font-family", "Arial");
        label.setAttribute("font-size", (fontSize + (SCALE_FACTOR - 1) * 2) + "px");
        label.setAttribute("font-weight", "bold");
        label.setAttribute("fill", "black");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute("text-anchor", "middle");  // Ensures text centers on x position
        label.textContent = text;
        return label;
    }

    // Create labels for the three main latitude lines
    const equatorY = centerY;
    const tropicCancerY = centerY - (radius * Math.sin((23.5 * Math.PI) / 180));
    const tropicCapricornY = centerY + (radius * Math.sin((23.5 * Math.PI) / 180));

    // Add the labels
    const equatorLabel = createRotatedText("Equator (0°)", equatorY, 12);
    const tropicCancerLabel = createRotatedText("Tropic of Cancer (23.5° N)", tropicCancerY, 12);
    const tropicCapricornLabel = createRotatedText("Tropic of Capricorn (23.5° S)", tropicCapricornY, 12);

    // Add labels to the earthGroup
    earthGroup.appendChild(equatorLabel);
    earthGroup.appendChild(tropicCancerLabel);
    earthGroup.appendChild(tropicCapricornLabel);

 
    function createLatitudeLabel(latitude, angleDegrees) {
        const angleRad = (angleDegrees * Math.PI) / 180; // Convert degrees to radians
    
        // Calculate the position on the circle's edge
        const xOnCircle = centerX - radius * Math.cos(angleRad); // Flip x for left side
        const yOnCircle = centerY + radius * Math.sin(angleRad); // Calculate y position
    
        // Calculate a consistent perpendicular gap
        const gap = 15 * SCALE_FACTOR; // Base gap size
        const xOffset = gap * Math.cos(angleRad); // Adjust x gap dynamically
        const yOffset = gap * Math.sin(angleRad); // Adjust y gap dynamically
    
        // Create the label
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", xOnCircle - xOffset); // Adjust for left alignment
        label.setAttribute("y", yOnCircle + yOffset); // Adjust y position
        label.setAttribute("font-family", "Arial");
        label.setAttribute("font-size", (12 + (SCALE_FACTOR - 1) * 2) + "px");
        label.setAttribute("font-weight", "bold");
        label.setAttribute("fill", "black");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute("text-anchor", "end"); // Align text to the left
        label.textContent = `${latitude}°`;
    
        return label;
    }
                
    // Add latitude labels and connectors at 15-degree intervals
    for (let latitude = -90; latitude <= 90; latitude += 15) {
        const angle = -latitude; // Reverse angle direction for SVG
        const angleRad = (angle * Math.PI) / 180;
        
        // Create and add the label
        const latitudeLabel = createLatitudeLabel(latitude, angle);
        earthGroup.appendChild(latitudeLabel);
        
        // Add connector lines (excluding ±90°)
        if (latitude !== 90 && latitude !== -90) {
            const connector = document.createElementNS("http://www.w3.org/2000/svg", "line");
            
            // Calculate points on circle's edge
            const xOnCircle = centerX - radius * Math.cos(angleRad);
            const yOnCircle = centerY + radius * Math.sin(angleRad);
            
            // Calculate a consistent perpendicular gap
            const gap = 15 * SCALE_FACTOR; // Base gap size
            // Blend between horizontal and radial angles based on latitude
            const blendFactor = Math.abs(latitude) / 75;  // 0 at equator, 1 at ±75°
            const horizontalAngleRad = 0;  // Horizontal
            const blendedAngleRad = angleRad * blendFactor + horizontalAngleRad * (1 - blendFactor);
            
            const xOffset = gap * Math.cos(blendedAngleRad);
            const yOffset = gap * Math.sin(blendedAngleRad);
            
            connector.setAttribute("x1", xOnCircle);
            connector.setAttribute("y1", yOnCircle);
            connector.setAttribute("x2", xOnCircle - xOffset);
            connector.setAttribute("y2", yOnCircle + yOffset);
            connector.setAttribute("stroke", "rgb(180, 180, 180)");
            connector.setAttribute("stroke-width", 0.75 * SCALE_FACTOR);
            connector.setAttribute("stroke-dasharray", `${2 * SCALE_FACTOR},${2 * SCALE_FACTOR}`);
            
            earthGroup.appendChild(connector);
        }
    }

    // Add observer's latitude line with increased width
    const observerLatitude = parseFloat(document.getElementById('location-latitude-input').value);
    if (!isNaN(observerLatitude)) {
        const observerY = centerY - (radius * Math.sin((observerLatitude * Math.PI) / 180));
        const observerLineLength = 2 * Math.sqrt(radius ** 2 - (observerY - centerY) ** 2);

        const observerLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        observerLine.setAttribute("x1", centerX - observerLineLength / 2);
        observerLine.setAttribute("y1", observerY);
        observerLine.setAttribute("x2", centerX + observerLineLength / 2);
        observerLine.setAttribute("y2", observerY);
        observerLine.setAttribute("stroke", "red");
        observerLine.setAttribute("stroke-width", 2 * SCALE_FACTOR);  // Doubled the width
        observerLine.setAttribute("stroke-dasharray", `${5 * SCALE_FACTOR},${5 * SCALE_FACTOR}`);
        
        earthGroup.appendChild(observerLine);
    }

}

function createLeftArrowMarker(svg) {
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "leftArrow");
    marker.setAttribute("markerWidth", 3.75 * SCALE_FACTOR);    // Reduced from 5 to 3.75
    marker.setAttribute("markerHeight", 3.75 * SCALE_FACTOR);   // Reduced from 5 to 3.75
    marker.setAttribute("refX", 2.25 * SCALE_FACTOR);          // Adjusted proportionally
    marker.setAttribute("refY", 1.125 * SCALE_FACTOR);         // Adjusted proportionally
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "strokeWidth");

    const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrowPath.setAttribute("d", `M${2.25 * SCALE_FACTOR},0 L0,${1.125 * SCALE_FACTOR} L${2.25 * SCALE_FACTOR},${2.25 * SCALE_FACTOR} Z`);
    arrowPath.setAttribute("fill", "orange");
    marker.appendChild(arrowPath);

    svg.appendChild(marker);
}

// Simple update function
function updateSphericalEarthDiagram() {
    const solarDeclination = parseFloat(document.getElementById('latitude-overhead-input').value);
    console.log('updateSphericalEarthDiagram called with declination:', solarDeclination);
    createSphericalEarthDiagram(solarDeclination);
}

// Add this validation function
function validateLatitudeOverhead(value) {
    // Allow empty string during typing
    if (value === '' || value === '-') return value;
    
    const min = -23.5;
    const max = 23.5;
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) return 0;
    if (numValue < min) return min;
    if (numValue > max) return max;
    return numValue;
}

// Use 'change' event for final validation, 'input' for updates during typing
document.getElementById('latitude-overhead-input').addEventListener('change', function() {
    const validValue = validateLatitudeOverhead(this.value);
    // Only format the number if it's not an empty string or minus sign
    if (validValue !== '' && validValue !== '-') {
        this.value = parseFloat(validValue).toFixed(1);
        createSphericalEarthDiagram(validValue);
        document.getElementById('latitude-overhead-slider').value = validValue;
    }
});

// Keep the slider event listener as is
document.getElementById('latitude-overhead-slider').addEventListener('input', function() {
    console.log('Slider changed:', this.value);
    const solarDeclination = parseFloat(this.value);
    createSphericalEarthDiagram(solarDeclination);
    document.getElementById('latitude-overhead-input').value = solarDeclination.toFixed(1);
});

// Add event listener for location latitude changes
document.getElementById('location-latitude-input').addEventListener('input', function() {
    console.log('Location latitude changed:', this.value);
    updateSphericalEarthDiagram();
});

// Add event listener for location longitude changes
document.getElementById('location-longitude-input').addEventListener('input', function() {
    console.log('Location longitude changed, updating with latitude:', this.value);
    updateSphericalEarthDiagram();
});

// Add the event listener directly, matching the solar altitude diagram approach
document.getElementById('latitude-overhead-input').addEventListener('input', updateSphericalEarthDiagram);