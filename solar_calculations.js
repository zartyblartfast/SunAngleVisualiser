// Helper functions
const toRadians = degrees => degrees * Math.PI / 180;
const toDegrees = radians => radians * 180 / Math.PI;
const mod = (a, n) => a - Math.floor(a/n) * n;

export function calculateSolarDeclination(date) {
    // Get timezone offset in hours
    const timeZone = -(new Date().getTimezoneOffset() / 60);

    // Calculate Julian Day
    const julianDay = date.getTime()/86400000 + 2440587.5 + timeZone/24;

    // Calculate Julian Century
    const julianCentury = (julianDay - 2451545) / 36525;

    // Geometric Mean Longitude of Sun (deg)
    const geomMeanLongSun = mod(280.46646 + 
        julianCentury * (36000.76983 + julianCentury * 0.0003032), 360);

    // Geometric Mean Anomaly of Sun (deg)
    const geomMeanAnomSun = 357.52911 + 
        julianCentury * (35999.05029 - 0.0001537 * julianCentury);

    // Sun's Equation of Center
    const sunEqOfCtr = Math.sin(toRadians(geomMeanAnomSun)) * 
        (1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury)) +
        Math.sin(toRadians(2 * geomMeanAnomSun)) * 
        (0.019993 - 0.000101 * julianCentury) +
        Math.sin(toRadians(3 * geomMeanAnomSun)) * 0.000289;

    // Sun True Longitude (deg)
    const sunTrueLong = geomMeanLongSun + sunEqOfCtr;

    // Mean Obliquity of Ecliptic (deg)
    const meanObliqEcliptic = 23 + (26 + 
        ((21.448 - julianCentury * (46.815 + julianCentury * 
            (0.00059 - julianCentury * 0.001813))))/60)/60;

    // Obliquity Correction (deg)
    const obliqCorr = meanObliqEcliptic + 
        0.00256 * Math.cos(toRadians(125.04 - 1934.136 * julianCentury));

    // Sun Apparent Longitude (deg)
    const sunAppLong = sunTrueLong - 0.00569 - 
        0.00478 * Math.sin(toRadians(125.04 - 1934.136 * julianCentury));

    // Solar Declination (deg)
    const solarDeclination = toDegrees(Math.asin(
        Math.sin(toRadians(obliqCorr)) * Math.sin(toRadians(sunAppLong))
    ));

    console.log('Date:', date);
    console.log('Solar Declination:', solarDeclination);

    return solarDeclination;
}

export function calculateSolarElevation(latitude, solarDeclination) {
    // Calculate solar elevation at solar noon
    const solarElevation = 90 - Math.abs(latitude - solarDeclination);
    
    // Update the display if element exists
    const outputElement = document.getElementById('solar-elevation-output');
    if (outputElement) {
        outputElement.value = solarElevation.toFixed(1);
    } else {
        console.log('Solar elevation output element not found');
    }
    
    return solarElevation;
}
