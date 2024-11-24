/**
 * Utilities for converting between different angle conventions:
 * - SVG: 0° at 3 o'clock, increases clockwise
 * - Geographic: 0° at equator, positive north
 * - Solar: 0° at horizon, positive up
 */

/**
 * Converts an angle from a specified convention to SVG coordinates
 * @param {number} angle - The angle to convert
 * @param {string} fromType - The current angle convention ('geographic' | 'solar')
 * @returns {number} The angle in SVG coordinates
 */
function toSVGAngle(angle, fromType) {
    switch(fromType) {
        case 'geographic':
            // Convert from geographic (0° at equator) to SVG (0° at 3 o'clock)
            return 90 - angle;
        case 'solar':
            // Convert from solar (0° at horizon) to SVG
            return 180 - angle;
        default:
            return angle; // Already in SVG format
    }
}

/**
 * Converts an angle from SVG coordinates to a specified convention
 * @param {number} svgAngle - The angle in SVG coordinates
 * @param {string} toType - The desired angle convention ('geographic' | 'solar')
 * @returns {number} The converted angle
 */
function fromSVGAngle(svgAngle, toType) {
    switch(toType) {
        case 'geographic':
            // Convert from SVG to geographic
            return 90 - svgAngle;
        case 'solar':
            // Convert from SVG to solar
            return 180 - svgAngle;
        default:
            return svgAngle;
    }
}

/**
 * Normalizes an angle to be between 0 and 360 degrees
 * @param {number} angle - The angle to normalize
 * @returns {number} The normalized angle
 */
function normalizeAngle(angle) {
    return (angle % 360 + 360) % 360;
}

/**
 * Calculates the smallest angle between two angles
 * @param {number} angle1 - First angle in degrees
 * @param {number} angle2 - Second angle in degrees
 * @returns {number} The smallest angle between the two angles
 */
function smallestAngleBetween(angle1, angle2) {
    const diff = Math.abs(angle1 - angle2) % 360;
    return diff > 180 ? 360 - diff : diff;
}

export { toSVGAngle, fromSVGAngle, normalizeAngle, smallestAngleBetween };
