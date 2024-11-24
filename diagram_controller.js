import { calculateSolarElevation } from './solar_calculations.js';
import { createSphericalEarthDiagram } from './spherical_Earth_diagram.js';
import { createSolarAltitudeDiagram } from './solar_altitude_diagram.js';

export function updateAllDiagrams(solarDeclination) {
    // Update the input value
    document.getElementById('latitude-overhead-input').value = solarDeclination.toFixed(1);
    
    // Calculate and update solar elevation
    const latitude = parseFloat(document.getElementById('location-latitude-input').value);
    calculateSolarElevation(latitude, solarDeclination);
    
    // Update both diagrams
    createSphericalEarthDiagram(solarDeclination);
    createSolarAltitudeDiagram(latitude);
}
