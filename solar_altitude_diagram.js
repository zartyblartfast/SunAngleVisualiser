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

    // Draw central angle between equator and radius line
    // For SVG: 0° is at 3 o'clock, angles increase clockwise
    // For positive latitude: we want to go counterclockwise up from equator
    // For negative latitude: we want to go clockwise down from equator
    const svgLatitude = latitude >= 0 ? 
        latitude % 360 :          // For positive latitude: go up counterclockwise
        (360 + latitude) % 360;   // For negative latitude: go down clockwise
    
    // For negative latitudes, we need to ensure the label stays on the right side
    // and below the equator
    const labelOutside = true;
    const labelOffset = radius * (latitude >= 0 ? 0.25 : -0.25); // Increased offset from 0.15 to 0.25
    
    drawArcAngle({
        x: centerX,
        y: centerY,
        line1Angle: 0,  // Equator line is at 0 degrees in SVG system
        line2Angle: svgLatitude,
        offset: Math.abs(radius * 0.15),  // Arc size stays the same
        label: `${Math.abs(latitude).toFixed(1)}°`,
        labelOutside: labelOutside,
        labelOffset: labelOffset,  // Pass the increased offset
        style: {
            color: 'red',
            width: 1
        },
        labelStyle: {
            color: 'red',
            fontSize: 12,
            bold: false
        },
        svg: svg,
        debug: true,
        angleType: 'geographic'
    });

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
    
    // Define angle radius for both solar and latitude angles
    const angleRadius = radius * 0.15; // Size of the angle arc
    
    // Draw the solar elevation line and angle only if sun is above horizon (with small tolerance)
    if (solarElevation >= -0.1) {  // Allow for small rounding errors
        const solarLineSVGAngle = -(solarDeclination % 360);  // Invert the angle
        
        const solarLineLength = radius * 0.4;
        
        // Calculate solar line coordinates
        const sunLineStart = { x: tangentStartX, y: tangentStartY };
        const angleRad = solarLineSVGAngle * Math.PI / 180;
        const sunLineEnd = {
            x: sunLineStart.x + solarLineLength * Math.cos(angleRad),
            y: sunLineStart.y + solarLineLength * Math.sin(angleRad)
        };

        console.log('Solar Line Coordinates:', {
            start: sunLineStart,
            end: sunLineEnd,
            angle: solarLineSVGAngle,
            length: solarLineLength
        });

        // Draw solar line using calculated coordinates
        const solarLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        solarLine.setAttribute("x1", sunLineStart.x);
        solarLine.setAttribute("y1", sunLineStart.y);
        solarLine.setAttribute("x2", sunLineEnd.x);
        solarLine.setAttribute("y2", sunLineEnd.y);
        solarLine.setAttribute("stroke", "orange");
        solarLine.setAttribute("stroke-width", 2 * SCALE_FACTOR);
        svg.appendChild(solarLine);

        // Calculate transformed coordinates
        console.log('Solar Line Coordinates:', {
            start: { x: tangentStartX, y: tangentStartY },
            end: { x: sunLineEnd.x, y: sunLineEnd.y },
            angle: solarLineSVGAngle,
            length: solarLineLength
        });

        // Draw solar elevation angle
        console.group('Solar Elevation Arc');
        
        // Determine sun's position relative to observer
        // If observer latitude > solar declination: sun appears in southern sky
        // If observer latitude < solar declination: sun appears in northern sky
        // If equal: sun is directly overhead
        const isSunInSouth = latitude > solarDeclination;
        
        // Convert tangent angle from radians to degrees for SVG
        // Add 90° because SVG 0° is at 3 o'clock
        const tangentBaseAngle = (tangentAngle * 180 / Math.PI) + 90;
        
        // For southern arc: use tangentBaseAngle + 180° to start from south side
        // For northern arc: use tangentBaseAngle directly to start from north side
        const arcBaseAngle = isSunInSouth ? tangentBaseAngle + 180 : tangentBaseAngle;
        
        // Add elevation to go up from the base angle
        const sunElevationAngle = arcBaseAngle + solarElevation;

        console.log('Solar Elevation Arc Calculations:', {
            latitude,
            solarDeclination,
            solarElevation,
            isSunInSouth,
            tangentAngleRad: tangentAngle,
            tangentBaseAngle,
            arcBaseAngle,
            sunElevationAngle,
            message: `Drawing arc on ${isSunInSouth ? 'south' : 'north'} side, going up by ${solarElevation}°`
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
    }

    console.group('Latitude Arc');
    
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
