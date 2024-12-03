/**
 * Template function for drawing arcs and labels in SVG solar diagrams
 * @param {Object} params Configuration object for arc and label
 * @param {number} params.startX - X coordinate of arc center
 * @param {number} params.startY - Y coordinate of arc center
 * @param {number} params.baseAngle - Base angle in degrees (before SVG adjustment)
 * @param {number} params.elevationAngle - Angle to add/subtract from base
 * @param {boolean} params.isPositionSouth - Whether arc should be drawn from south side
 * @param {number} params.radius - Radius of the arc
 * @param {string} params.label - Text to display
 * @param {SVGElement} params.svg - SVG element to draw into
 */
function drawArcWithLabel({
    startX,
    startY,
    baseAngle,
    elevationAngle,
    isPositionSouth,
    radius,
    label,
    svg
}) {
    // 1. Adjust for SVG coordinate system
    // SVG: 0° at 3 o'clock, increases clockwise
    const svgBaseAngle = baseAngle + 90;

    // 2. Calculate arc angles
    // For southern position: rotate base 180° and add elevation
    // For northern position: use base directly and subtract elevation
    const arcBaseAngle = isPositionSouth ? svgBaseAngle + 180 : svgBaseAngle;
    const finalAngle = isPositionSouth ? 
        arcBaseAngle + elevationAngle : 
        arcBaseAngle - elevationAngle;

    // 3. Draw the arc with correct label positioning
    drawArcAngle({
        x: startX,
        y: startY,
        line1Angle: arcBaseAngle,
        line2Angle: finalAngle,
        offset: radius,
        label: `${elevationAngle.toFixed(1)}°`,
        labelOutside: true,
        labelOffset: radius * 1.6,  // Adjust multiplier as needed
        // Force label to follow same angle sequence as arc
        labelStartAngle: arcBaseAngle,
        labelEndAngle: finalAngle,
        forceLabelDirection: true,
        style: {
            color: 'orange',  // Adjust color as needed
            width: SCALE_FACTOR
        },
        labelStyle: {
            fontSize: 10 * SCALE_FACTOR,
            color: 'orange',
            bold: false
        },
        svg: svg,
        debug: true,
        angleType: 'solar'  // or 'geographic' based on context
    });
}

// Example usage:
/*
drawArcWithLabel({
    startX: centerX,
    startY: centerY,
    baseAngle: tangentAngle * 180 / Math.PI,  // Convert from radians if needed
    elevationAngle: solarElevation,
    isPositionSouth: latitude > solarDeclination,
    radius: angleRadius * 2.5,
    label: '45°',
    svg: svgElement
});
*/
