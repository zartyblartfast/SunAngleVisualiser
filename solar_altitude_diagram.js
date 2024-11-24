// Import angle utilities
import { toSVGAngle, fromSVGAngle, normalizeAngle } from './angle_utilities.js';
import { SCALE_FACTOR, drawArcAngle } from './utilities.js';

export function createSolarAltitudeDiagram(latitude) {
    console.log('=== Starting createSolarAltitudeDiagram ===');
    
    // Get solar elevation and solar declination
    const solarElevation = parseFloat(document.getElementById('solar-elevation-output').value);
    const solarDeclination = parseFloat(document.getElementById('latitude-overhead-input').value);
    
    console.log('Initial values:', {
        latitude,
        solarElevation,
        solarDeclination,
        rawDeclination: document.getElementById('latitude-overhead-input').value
    });
    
    // Base dimensions using SCALE_FACTOR from spherical_Earth_diagram.js
    const radius = 100 * SCALE_FACTOR;
    const svgWidth = 400 * SCALE_FACTOR;
    const svgHeight = 300 * SCALE_FACTOR;
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    
    // Get container and log if it exists
    const svgContainer = document.getElementById('solar-altitude-diagram');
    console.log('Container found:', svgContainer);
    
    if (!svgContainer) {
        console.error('Solar altitude diagram container not found!');
        return;
    }
    
    // Clear existing SVG
    svgContainer.innerHTML = '';

    // Create SVG element with scaled dimensions
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svgContainer.appendChild(svg);

    // Add elevation label
    const elevationLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    elevationLabel.setAttribute("x", 10 * SCALE_FACTOR);
    elevationLabel.setAttribute("y", 20 * SCALE_FACTOR);
    elevationLabel.setAttribute("font-size", 12 * SCALE_FACTOR);
    elevationLabel.textContent = `Solar Elevation: ${document.getElementById('solar-elevation-output').value}°`;
    svg.appendChild(elevationLabel);

    // Draw Earth circle
    const earthCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    earthCircle.setAttribute("cx", centerX);
    earthCircle.setAttribute("cy", centerY);
    earthCircle.setAttribute("r", radius);
    earthCircle.setAttribute("stroke", "black");
    earthCircle.setAttribute("stroke-width", Math.max(1, SCALE_FACTOR));
    earthCircle.setAttribute("fill", "none");
    svg.appendChild(earthCircle);

    // Draw night-side semi-circle with rotation
    console.log('About to create night-side semi-circle');
    const nightSide = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const nightArc = `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 0 0 ${centerX} ${centerY + radius} L ${centerX} ${centerY - radius}`;
    nightSide.setAttribute("d", nightArc);
    nightSide.setAttribute("fill", "rgb(128, 128, 128)");
    nightSide.setAttribute("fill-opacity", "0.5");
    
    // Get fresh value for rotation
    const currentDeclination = parseFloat(document.getElementById('latitude-overhead-input').value);
    console.log('Night-side rotation values:', {
        currentDeclination,
        rotationAngle: -currentDeclination,
        centerX,
        centerY,
        timeStamp: new Date().toISOString()
    });
    
    // Apply rotation
    const rotationAngle = -currentDeclination;
    const rotationTransform = `rotate(${rotationAngle}, ${centerX}, ${centerY})`;
    console.log('Applying transform:', rotationTransform);
    
    nightSide.setAttribute("transform", rotationTransform);
    svg.appendChild(nightSide);

    // Draw equator line (full width inside circle)
    const equatorLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    equatorLine.setAttribute("x1", centerX - radius);  // Start from left edge of circle
    equatorLine.setAttribute("y1", centerY);  // At vertical center (equator)
    equatorLine.setAttribute("x2", centerX + radius);  // Extend to right edge of circle
    equatorLine.setAttribute("y2", centerY);  // Same y-coordinate (horizontal)
    equatorLine.setAttribute("stroke", "black");
    equatorLine.setAttribute("stroke-width", SCALE_FACTOR);
    equatorLine.setAttribute("stroke-dasharray", `${5 * SCALE_FACTOR},${5 * SCALE_FACTOR}`);  // Make it dashed like other reference lines
    svg.appendChild(equatorLine);

    // Draw pole lines (extending slightly beyond circle)
    const poleLineLength = 20 * SCALE_FACTOR;
    
    // North Pole line
    const northPoleLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    northPoleLine.setAttribute("x1", centerX);
    northPoleLine.setAttribute("y1", centerY - radius);
    northPoleLine.setAttribute("x2", centerX);
    northPoleLine.setAttribute("y2", centerY - radius - poleLineLength);
    northPoleLine.setAttribute("stroke", "black");
    northPoleLine.setAttribute("stroke-width", SCALE_FACTOR);
    svg.appendChild(northPoleLine);

    // South Pole line
    const southPoleLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    southPoleLine.setAttribute("x1", centerX);
    southPoleLine.setAttribute("y1", centerY + radius);
    southPoleLine.setAttribute("x2", centerX);
    southPoleLine.setAttribute("y2", centerY + radius + poleLineLength);
    southPoleLine.setAttribute("stroke", "black");
    southPoleLine.setAttribute("stroke-width", SCALE_FACTOR);
    svg.appendChild(southPoleLine);

    // Calculate the y-offset for the latitude line
    const latitudeY = centerY - radius * Math.sin(latitude * Math.PI / 180);
    
    // Calculate x-coordinates where latitude line intersects circle
    const latitudeHalfWidth = radius * Math.cos(Math.asin(Math.sin(latitude * Math.PI / 180)));
    
    // Draw horizontal latitude line (internal to circle)
    const latitudeLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    latitudeLine.setAttribute("x1", centerX - latitudeHalfWidth);  // Start at left intersection
    latitudeLine.setAttribute("y1", latitudeY);
    latitudeLine.setAttribute("x2", centerX + latitudeHalfWidth);  // End at right intersection
    latitudeLine.setAttribute("y2", latitudeY);
    latitudeLine.setAttribute("stroke", "red");
    latitudeLine.setAttribute("stroke-width", 2 * SCALE_FACTOR);
    latitudeLine.setAttribute("stroke-dasharray", `${5 * SCALE_FACTOR},${5 * SCALE_FACTOR}`);
    svg.appendChild(latitudeLine);

    // Draw radius line to latitude point
    const radiusLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    radiusLine.setAttribute("x1", centerX);
    radiusLine.setAttribute("y1", centerY);
    radiusLine.setAttribute("x2", centerX + radius * Math.cos(latitude * Math.PI / 180));
    radiusLine.setAttribute("y2", latitudeY);
    radiusLine.setAttribute("stroke", "red");
    radiusLine.setAttribute("stroke-width", SCALE_FACTOR);
    svg.appendChild(radiusLine);

    // Calculate points for tangent line
    const tangentLength = radius * 0.5; // Length of tangent line (total length will be 2x this)
    const tangentAngle = latitude * Math.PI / 180; // Changed angle calculation
    const tangentStartX = centerX + radius * Math.cos(latitude * Math.PI / 180);
    const tangentStartY = latitudeY;
    
    // Draw tangent (horizon) line
    const tangentLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    tangentLine.setAttribute("x1", tangentStartX - tangentLength * Math.sin(tangentAngle)); // Changed to sin
    tangentLine.setAttribute("y1", tangentStartY - tangentLength * Math.cos(tangentAngle)); // Changed to -cos
    tangentLine.setAttribute("x2", tangentStartX + tangentLength * Math.sin(tangentAngle)); // Changed to sin
    tangentLine.setAttribute("y2", tangentStartY + tangentLength * Math.cos(tangentAngle)); // Changed to cos
    tangentLine.setAttribute("stroke", "green");
    tangentLine.setAttribute("stroke-width", SCALE_FACTOR);
    tangentLine.setAttribute("stroke-dasharray", `${2 * SCALE_FACTOR},${2 * SCALE_FACTOR}`);
    svg.appendChild(tangentLine);

    console.log('1. Reading solar elevation:', {
        rawValue: document.getElementById('solar-elevation-output').value,
        parsedValue: solarElevation
    });
    
    // Determine if sun is north or south of observer
    const isSunNorth = solarDeclination > latitude;
    
    /**
     * Maps solar elevation angles to SVG coordinate system angles
     * @param {number} elevation - Solar elevation angle (degrees above horizon)
     * @param {number} latitude - Observer's latitude in degrees
     * @returns {number} SVG angle in degrees
     */
    function mapSolarAngleToSVG(elevation, latitude) {
        // Start at 40° (which puts us on the tangent line, facing south)
        const tangentReferenceAngle = 40;
        
        // SUBTRACT elevation to go UP from tangent
        const mappedAngle = tangentReferenceAngle - elevation;
        
        console.log('Solar angle calculation:', {
            inputs: { latitude, elevation },
            steps: {
                tangentReference: '40° (on tangent, facing south)',
                subtractToGoUp: `40° - ${elevation}° = ${mappedAngle}°`,
                final: mappedAngle
            },
            explanation: 'Using tangent as 0°, subtracting elevation to go up'
        });

        return mappedAngle;
    }

    // Draw the solar elevation line
    const mappedSolarAngle = mapSolarAngleToSVG(solarElevation, latitude);
    
    const solarLineLength = radius * 0.4;
    const solarLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    solarLine.setAttribute("x1", tangentStartX);
    solarLine.setAttribute("y1", tangentStartY);
    solarLine.setAttribute("transform", `rotate(${mappedSolarAngle}, ${tangentStartX}, ${tangentStartY})`);
    solarLine.setAttribute("x2", tangentStartX + solarLineLength);
    solarLine.setAttribute("y2", tangentStartY);
    solarLine.setAttribute("stroke", "orange");
    solarLine.setAttribute("stroke-width", 2 * SCALE_FACTOR);
    svg.appendChild(solarLine);

    // Add angle markers
    const angleRadius = radius * 0.15; // Size of the angle arc

    // Draw solar elevation angle
    console.group('Solar Elevation Arc');
    
    // Determine which side of tangent line to draw the arc
    // If observer latitude > solar declination: sun appears in southern sky
    // If observer latitude < solar declination: sun appears in northern sky
    const isSunInSouth = latitude > solarDeclination;
    const isNorthernHemisphere = latitude >= 0;
    
    // Convert tangent angle from radians to degrees for SVG
    // Add 90° because SVG 0° is at 3 o'clock
    const tangentBaseAngle = (tangentAngle * 180 / Math.PI) + 90;
    
    // For southern arc: use tangentBaseAngle + 180° to start from south side
    // For northern arc: use tangentBaseAngle directly to start from north side
    const arcBaseAngle = isSunInSouth ? tangentBaseAngle + 180 : tangentBaseAngle;
    
    // In Northern Hemisphere: add elevation to go up
    // In Southern Hemisphere: subtract elevation to go up (because angles are inverted)
    const sunElevationAngle = isNorthernHemisphere ? 
        arcBaseAngle + solarElevation : 
        arcBaseAngle - solarElevation;

    console.log('Solar Elevation Arc Calculations:', {
        latitude,
        solarDeclination,
        solarElevation,
        isSunInSouth,
        isNorthernHemisphere,
        tangentAngleRad: tangentAngle,
        tangentBaseAngle,
        arcBaseAngle,
        sunElevationAngle,
        message: `Drawing arc on ${isSunInSouth ? 'south' : 'north'} side, going ${isNorthernHemisphere ? 'up' : 'down'} by ${solarElevation}°`
    });

    drawArcAngle({
        x: tangentStartX,
        y: tangentStartY,
        line1Angle: arcBaseAngle,         // Start from correct side of tangent
        line2Angle: sunElevationAngle,    // Go up by solar elevation
        offset: angleRadius * 2.5,        // Increased offset to move label further out
        label: `${solarElevation.toFixed(1)}°`,
        labelOutside: true,
        style: {
            color: 'orange',
            width: SCALE_FACTOR
        },
        labelStyle: {
            fontSize: 10 * SCALE_FACTOR,  // Reduced font size from 12 to 10
            color: 'orange',
            bold: false
        },
        svg: svg,
        debug: true,  // Enable debug logging in drawArcAngle
        angleType: 'solar'
    });

    console.groupEnd();

    // Add latitude angle
    console.group('Latitude Arc');
    
    drawArcAngle({
        x: centerX,
        y: centerY,
        line1Angle: toSVGAngle(0, 'geographic'),  // Reference from equator
        line2Angle: toSVGAngle(latitude, 'geographic'),
        offset: angleRadius,
        label: `${Math.abs(latitude).toFixed(1)}°`,
        labelOutside: true,
        style: {
            color: 'blue',
            width: SCALE_FACTOR
        },
        labelStyle: {
            fontSize: 12 * SCALE_FACTOR,
            color: 'blue',
            bold: false
        },
        svg: svg,
        debug: true,
        angleType: 'geographic'
    });
    console.groupEnd();

}

// Add this update function
export function updateDiagram() {
    const latitude = parseFloat(document.getElementById('location-latitude-input').value);
    createSolarAltitudeDiagram(latitude);
}

// Replace the event listener with this simpler version
document.getElementById('latitude-overhead-input').addEventListener('input', updateDiagram);

// Add event listener for location latitude changes
document.getElementById('location-latitude-input').addEventListener('input', function() {
    const latitude = parseFloat(this.value);
    console.log('Location latitude changed:', latitude);
    createSolarAltitudeDiagram(latitude);
});

// Also add event listener for location longitude changes since it might affect calculations
document.getElementById('location-longitude-input').addEventListener('input', function() {
    const latitude = parseFloat(document.getElementById('location-latitude-input').value);
    console.log('Location longitude changed, updating with latitude:', latitude);
    createSolarAltitudeDiagram(latitude);
});
