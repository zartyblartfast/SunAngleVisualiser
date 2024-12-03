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

    // Define arrowhead marker for solar line
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "solarArrow");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "5");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", 4 * SCALE_FACTOR);
    marker.setAttribute("markerHeight", 4 * SCALE_FACTOR);
    marker.setAttribute("orient", "auto-start-reverse");
    
    const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrowPath.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
    arrowPath.setAttribute("fill", "orange");
    
    marker.appendChild(arrowPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Add elevation label
    const elevationLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    elevationLabel.setAttribute("x", 10 * SCALE_FACTOR);
    elevationLabel.setAttribute("y", 20 * SCALE_FACTOR);
    elevationLabel.setAttribute("font-size", 12 * SCALE_FACTOR);
    elevationLabel.textContent = `Solar Elevation: ${document.getElementById('solar-elevation-output').value}°`;
    svg.appendChild(elevationLabel);

    // Draw latitude reference lines
    for (let i = 90; i >= -90; i -= 15) {
        const angleRad = (-i * Math.PI) / 180;  // Negate for SVG coordinates
        const y = centerY - (radius * Math.sin(angleRad));
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
        
        svg.appendChild(line);

        // Add labels and connectors for each latitude line
        // Calculate points on circle's edge using same method as spherical Earth diagram
        const xOnCircle = centerX - radius * Math.cos(angleRad);
        const yOnCircle = centerY - radius * Math.sin(angleRad);

        // Calculate perpendicular offset from circle edge
        const gap = 15 * SCALE_FACTOR;
        const xOffset = gap * Math.cos(angleRad);
        const yOffset = gap * Math.sin(angleRad);

        // Create label
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", xOnCircle - xOffset);
        label.setAttribute("y", yOnCircle - yOffset);
        label.setAttribute("font-family", "Arial");
        label.setAttribute("font-size", (10 + (SCALE_FACTOR - 1) * 2) + "px");
        label.setAttribute("fill", "black");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute("text-anchor", "end");
        label.textContent = `${-i}°`;  // Negate i to show positive in north, negative in south
        svg.appendChild(label);

        // Create connector line (except for poles where it would be too short)
        if (i !== 90 && i !== -90) {
            const connector = document.createElementNS("http://www.w3.org/2000/svg", "line");
            connector.setAttribute("x1", xOnCircle);
            connector.setAttribute("y1", yOnCircle);
            connector.setAttribute("x2", xOnCircle - xOffset);
            connector.setAttribute("y2", yOnCircle - yOffset);
            connector.setAttribute("stroke", "rgb(180, 180, 180)");
            connector.setAttribute("stroke-width", 0.75 * SCALE_FACTOR);
            connector.setAttribute("stroke-dasharray", `${2 * SCALE_FACTOR},${2 * SCALE_FACTOR}`);
            svg.appendChild(connector);
        }
    }

    // Draw Earth circle
    const earthCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    earthCircle.setAttribute("cx", centerX);
    earthCircle.setAttribute("cy", centerY);
    earthCircle.setAttribute("r", radius);
    earthCircle.setAttribute("stroke", "black");
    earthCircle.setAttribute("stroke-width", Math.max(1, SCALE_FACTOR));
    earthCircle.setAttribute("fill", "none");
    svg.appendChild(earthCircle);

    // Draw Tropics
    const tropicLatitudes = [23.5, -23.5];
    for (let latitude of tropicLatitudes) {
        const y = centerY - (radius * Math.sin((latitude * Math.PI) / 180));
        const lineLength = 2 * Math.sqrt(radius ** 2 - (y - centerY) ** 2);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", centerX - lineLength / 2);
        line.setAttribute("y1", y);
        line.setAttribute("x2", centerX + lineLength / 2);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", 2 * SCALE_FACTOR);
        line.setAttribute("stroke-dasharray", `${5 * SCALE_FACTOR},${5 * SCALE_FACTOR}`);

        svg.appendChild(line);
    }

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
    const smallAngleRange = 20;
    const labelOutside = Math.abs(latitude) <= smallAngleRange;
    
    let labelOffset;
    if (Math.abs(latitude) <= smallAngleRange) {
        // For small angles, use larger offset since we're placing label away from arc
        labelOffset = radius * 0.6;  // Increased from 0.15 to 0.6 for better visibility
    } else {
        // For larger angles, keep existing behavior
        labelOffset = radius * (latitude >= 0 ? 0.45 : -0.45);
    }

    // Adjust label position for small angles
    let labelPosition = 'middle';
    if (Math.abs(latitude) <= smallAngleRange) {
        labelPosition = latitude >= 0 ? 'below' : 'above';
    }
    
    drawArcAngle({
        x: centerX,
        y: centerY,
        line1Angle: 0,  // Equator line is at 0 degrees in SVG system
        line2Angle: svgLatitude,
        offset: Math.abs(radius * 0.25),
        label: `${Math.abs(latitude).toFixed(1)}°`,
        labelOutside: labelOutside,
        labelOffset: labelOffset,
        labelPosition: labelPosition,  // Add new parameter for label positioning
        style: {
            color: 'red',
            width: 2 * SCALE_FACTOR
        },
        labelStyle: {
            color: 'red',
            fontSize: 18,
            bold: true
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
        
        // Calculate maximum possible line length to reach near SVG edges
        // Leave a 20px margin scaled by SCALE_FACTOR
        const margin = 20 * SCALE_FACTOR;
        const maxDistanceX = Math.min(tangentStartX - margin, svgWidth - tangentStartX - margin);
        const maxDistanceY = Math.min(tangentStartY - margin, svgHeight - tangentStartY - margin);
        
        // Calculate how far we can extend in both x and y directions given the angle
        const angleRad = solarLineSVGAngle * Math.PI / 180;
        const cosAbs = Math.abs(Math.cos(angleRad));
        const sinAbs = Math.abs(Math.sin(angleRad));
        
        // Calculate the maximum length that won't exceed boundaries in either direction
        const solarLineLength = cosAbs > 0.0001 ? maxDistanceX / cosAbs : maxDistanceY / sinAbs;
        
        // Calculate solar line coordinates
        const sunLineStart = { x: tangentStartX, y: tangentStartY };
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

        // Draw the sun line with arrow at 60% from tangent line
        // Calculate point at 60% along the line
        const midpoint = {
            x: sunLineStart.x + (sunLineEnd.x - sunLineStart.x) * 0.6,
            y: sunLineStart.y + (sunLineEnd.y - sunLineStart.y) * 0.6
        };

        // First segment (no arrow)
        const sunLine1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        sunLine1.setAttribute("x1", sunLineStart.x);
        sunLine1.setAttribute("y1", sunLineStart.y);
        sunLine1.setAttribute("x2", midpoint.x);
        sunLine1.setAttribute("y2", midpoint.y);
        sunLine1.setAttribute("stroke", "orange");
        sunLine1.setAttribute("stroke-width", 2.5 * SCALE_FACTOR);

        // Second segment (with arrow at start)
        const sunLine2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        sunLine2.setAttribute("x1", midpoint.x);
        sunLine2.setAttribute("y1", midpoint.y);
        sunLine2.setAttribute("x2", sunLineEnd.x);
        sunLine2.setAttribute("y2", sunLineEnd.y);
        sunLine2.setAttribute("stroke", "orange");
        sunLine2.setAttribute("stroke-width", 2.5 * SCALE_FACTOR);
        sunLine2.setAttribute("marker-start", "url(#solarArrow)");

        svg.appendChild(sunLine1);
        svg.appendChild(sunLine2);

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
        
        // Add or subtract elevation based on sun position to ensure arc goes up
        const sunElevationAngle = isSunInSouth ? 
            arcBaseAngle + solarElevation : 
            arcBaseAngle - solarElevation;

        console.log('Solar Elevation Arc Calculations:', {
            latitude,
            solarDeclination,
            solarElevation,
            isSunInSouth,
            tangentAngleRad: tangentAngle,
            tangentBaseAngle,
            arcBaseAngle,
            sunElevationAngle,
            message: `Drawing arc on ${isSunInSouth ? 'south' : 'north'} side, ${isSunInSouth ? 'adding' : 'subtracting'} ${solarElevation}°`
        });

        // Enhanced label positioning logic for extreme latitudes
        const latitudeAbs = Math.abs(latitude);
        let labelPosition = 'middle';
        let labelRadialOffset = angleRadius * 3.5;  // Default offset
        let labelHorizontalOffset = 0;
        let labelVerticalOffset = 0;

        if (latitudeAbs > 50) {
            // For extreme latitudes, move label outward and upward
            const extremityFactor = (latitudeAbs - 50) / 40;  // 0 to 1 scale for 50° to 90°
            labelPosition = 'above';  // Always position above the line for better visibility
            
            // Increase radial distance as we approach the poles
            labelRadialOffset = angleRadius * (3.5 + extremityFactor * 1.5);
            
            // Add horizontal offset to move label further from origin
            labelHorizontalOffset = angleRadius * (extremityFactor * 1.0);
            
            // Add vertical offset to lift label above the sun line
            labelVerticalOffset = -angleRadius * (0.5 + extremityFactor * 0.5);
        }

        drawArcAngle({
            x: tangentStartX,
            y: tangentStartY,
            line1Angle: arcBaseAngle,
            line2Angle: sunElevationAngle,
            offset: angleRadius * 2.5,
            label: `${solarElevation.toFixed(1)}°`,
            labelOutside: true,
            labelOffset: labelRadialOffset,
            labelStartAngle: arcBaseAngle,
            labelEndAngle: sunElevationAngle,
            forceLabelDirection: true,
            labelPosition: labelPosition,
            labelHorizontalOffset: labelHorizontalOffset,
            labelVerticalOffset: labelVerticalOffset,
            style: {
                color: 'orange',
                width: 2.5 * SCALE_FACTOR
            },
            labelStyle: {
                fontSize: 10 * SCALE_FACTOR,
                color: 'orange',
                bold: true  
            },
            svg: svg,
            debug: true,
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
