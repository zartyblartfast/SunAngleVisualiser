import { fromSVGAngle } from './angle_utilities.js';

// Helper function to calculate smallest angle between two angles
export function smallestAngleBetween(angle1, angle2) {
    const diff = Math.abs(angle1 - angle2) % 360;
    return diff > 180 ? 360 - diff : diff;
}

// Helper function to normalize angles to 0-360 range
export function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
}

/**
 * Draws an arc angle between two lines, correctly positioned and oriented first time
 * 
 * @param {Object} params
 *   @param {number} params.x - Intersection point X coordinate
 *   @param {number} params.y - Intersection point Y coordinate
 *   @param {number} params.line1Angle - First line angle in SVG coordinates (degrees)
 *   @param {number} params.line2Angle - Second line angle in SVG coordinates (degrees)
 *   @param {number} params.offset - Distance from intersection point
 *   @param {string} params.label - Text to display as angle label
 *   @param {boolean} [params.labelOutside=true] - Whether to place label outside the arc
 *   @param {number} [params.labelOffset] - Custom offset for label positioning
 *   @param {Object} params.style - Visual properties
 *     @param {string} params.style.color - Stroke color
 *     @param {number} params.style.width - Line width relative to SCALE_FACTOR
 *   @param {Object} params.labelStyle - Label visual properties
 *     @param {string} [params.labelStyle.color] - Label color (defaults to arc color if not specified)
 *     @param {number} params.labelStyle.fontSize - Font size relative to SCALE_FACTOR
 *     @param {boolean} [params.labelStyle.bold=false] - Whether to bold the text
 *   @param {SVGElement} params.svg - SVG element to draw into
 *   @param {boolean} params.debug - Enable console logging during development
 *   @param {string} [params.angleType] - Type of angle being drawn ('geographic' | 'solar')
 *   @param {boolean} [params.forceLabelDirection] - Force label direction using provided angles
 *   @param {number} [params.labelStartAngle] - Start angle for forced label direction
 *   @param {number} [params.labelEndAngle] - End angle for forced label direction
 *   @param {string} [params.labelPosition] - Position of the label ('above' | 'below')
 *   @param {number} [params.labelHorizontalOffset] - Horizontal offset for label positioning
 *   @param {number} [params.labelVerticalOffset] - Vertical offset for label positioning
 */
export function drawArcAngle(params) {
    if (params.debug) {
        console.group('Draw Arc Angle');
        console.log('Initial Parameters:', {
            ...params,
            line1AngleSVG: params.line1Angle,
            line2AngleSVG: params.line2Angle,
            line1AngleDisplay: params.angleType ? fromSVGAngle(params.line1Angle, params.angleType) : params.line1Angle,
            line2AngleDisplay: params.angleType ? fromSVGAngle(params.line2Angle, params.angleType) : params.line2Angle
        });
    }

    // Default parameters
    params.labelOutside = params.labelOutside ?? true;
    params.labelStyle = params.labelStyle ?? {};
    params.labelStyle.bold = params.labelStyle.bold ?? false;
    params.labelStyle.color = params.labelStyle.color ?? params.style.color;

    // Validate input
    if (typeof params.line1Angle !== 'number' || isNaN(params.line1Angle) ||
        typeof params.line2Angle !== 'number' || isNaN(params.line2Angle)) {
        console.error('Invalid angle parameters:', { line1: params.line1Angle, line2: params.line2Angle });
        return null;
    }

    const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const arcRadius = params.offset;

    // Normalize angles to 0-360° range
    const startAngle = normalizeAngle(params.line1Angle);
    const endAngle = normalizeAngle(params.line2Angle);

    if (params.debug) {
        console.log('Normalized Angles:', {
            startAngle,
            endAngle,
            arcRadius
        });
    }

    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate start and end points of the arc
    const start = {
        x: params.x + arcRadius * Math.cos(startRad),
        y: params.y - arcRadius * Math.sin(startRad)
    };

    const end = {
        x: params.x + arcRadius * Math.cos(endRad),
        y: params.y - arcRadius * Math.sin(endRad)
    };

    // Calculate the smallest angle between the lines
    const arcAngle = smallestAngleBetween(startAngle, endAngle);

    // Determine sweep direction based on the shortest path
    const sweepFlag = ((endAngle - startAngle + 360) % 360) <= 180 ? 0 : 1;
    const largeArcFlag = arcAngle > 180 ? 1 : 0;

    if (params.debug) {
        console.log('Arc Calculations:', {
            start,
            end,
            arcAngle,
            sweepFlag,
            largeArcFlag
        });
    }

    // Construct arc path
    const pathData = `M ${start.x} ${start.y} ` +
                     `A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
    arc.setAttribute("d", pathData);
    arc.setAttribute("stroke", params.style.color);
    arc.setAttribute("stroke-width", params.style.width);
    arc.setAttribute("fill", "none");

    // Append to SVG
    params.svg.appendChild(arc);

    if (params.debug) {
        console.log('Arc Path:', pathData);
    }

    // Add label if provided
    if (params.label) {
        let midAngle;
        if (params.forceLabelDirection && params.labelStartAngle !== undefined && params.labelEndAngle !== undefined) {
            // Use provided angles in exact sequence
            const startRad = (params.labelStartAngle * Math.PI) / 180;
            const endRad = (params.labelEndAngle * Math.PI) / 180;
            midAngle = ((startRad + endRad) / 2) % (2 * Math.PI);
        } else {
            // Default behavior
            midAngle = ((startRad + endRad) / 2) % (2 * Math.PI);
        }
        
        // Use custom labelOffset if provided, otherwise calculate based on labelOutside
        const labelRadius = params.labelOffset || 
            (params.labelOutside ? arcRadius * 1.3 : arcRadius * 0.7);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        // Calculate default arc position first
        const arcX = params.x + labelRadius * Math.cos(midAngle);
        const arcY = params.y - labelRadius * Math.sin(midAngle);

        // Handle special label positioning
        if (params.labelPosition === 'above') {
            // Position above with adjustable horizontal and vertical offsets
            const baseX = params.x + (params.labelHorizontalOffset || 0);
            const baseY = params.y + (params.labelVerticalOffset || 0);
            
            label.setAttribute("x", baseX);
            label.setAttribute("y", baseY);
        } else if (params.labelPosition === 'below') {
            // Position below with adjustable horizontal and vertical offsets
            const baseX = params.x + (params.labelHorizontalOffset || 0);
            const baseY = params.y - (params.labelVerticalOffset || 0);
            
            label.setAttribute("x", baseX);
            label.setAttribute("y", baseY);
        } else {
            // Default positioning along the arc
            label.setAttribute("x", arcX + (params.labelHorizontalOffset || 0));
            label.setAttribute("y", arcY + (params.labelVerticalOffset || 0));
        }
        
        label.setAttribute("fill", params.labelStyle.color);
        label.setAttribute("font-size", params.labelStyle.fontSize);
        if (params.labelStyle.bold) {
            label.setAttribute("font-weight", "bold");
        }
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "middle");
        label.textContent = params.label;

        params.svg.appendChild(label);
    }

    if (params.debug) {
        console.groupEnd();
    }

    return arc;
}

// Define global scale factor for SVG diagrams
export const SCALE_FACTOR = 1.5;