// Helper functions
const toRadians = degrees => degrees * Math.PI / 180;
const toDegrees = radians => radians * 180 / Math.PI;
const mod = (a, n) => a - Math.floor(a/n) * n;

// Common astronomical calculations
function calculateJulianValues(date, timeZone) {
    // Calculate Julian Day
    const julianDay = date.getTime()/86400000 + 2440587.5 + timeZone/24;

    // Calculate Julian Century
    const julianCentury = (julianDay - 2451545) / 36525;

    return { julianDay, julianCentury };
}

function calculateSolarPosition(julianCentury) {
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

    // Eccentricity of Earth Orbit
    const eccentEarthOrbit = 0.016708634 - julianCentury * 
        (0.000042037 + 0.0000001267 * julianCentury);

    return {
        geomMeanLongSun,
        geomMeanAnomSun,
        sunEqOfCtr,
        sunTrueLong,
        eccentEarthOrbit
    };
}

function calculateObliquityAndDeclination(julianCentury, sunTrueLong) {
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

    return {
        meanObliqEcliptic,
        obliqCorr,
        sunAppLong,
        solarDeclination
    };
}

function calculateEquationOfTime(julianCentury, geomMeanLongSun, geomMeanAnomSun, eccentEarthOrbit, obliqCorr) {
    // Helper variable y
    const varY = Math.pow(Math.tan(toRadians(obliqCorr/2)), 2);

    // Equation of Time (minutes)
    return 4 * toDegrees(
        varY * Math.sin(2 * toRadians(geomMeanLongSun)) -
        2 * eccentEarthOrbit * Math.sin(toRadians(geomMeanAnomSun)) +
        4 * eccentEarthOrbit * varY * Math.sin(toRadians(geomMeanAnomSun)) * 
            Math.cos(2 * toRadians(geomMeanLongSun)) -
        0.5 * varY * varY * Math.sin(4 * toRadians(geomMeanLongSun)) -
        1.25 * eccentEarthOrbit * eccentEarthOrbit * Math.sin(2 * toRadians(geomMeanAnomSun))
    );
}

export function calculateSolarDeclination(date) {
    const timeZone = -(new Date().getTimezoneOffset() / 60);
    const { julianCentury } = calculateJulianValues(date, timeZone);
    const { sunTrueLong } = calculateSolarPosition(julianCentury);
    const { solarDeclination } = calculateObliquityAndDeclination(julianCentury, sunTrueLong);

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

export function calculateSolarAzimuth(date, latitude, longitude, timeZone) {
    // Get the current time in hours past local midnight
    const timePastMidnight = date.getHours() + date.getMinutes()/60 + date.getSeconds()/3600;
    
    // Get common calculations
    const { julianCentury } = calculateJulianValues(date, timeZone);
    const { 
        geomMeanLongSun, 
        geomMeanAnomSun, 
        eccentEarthOrbit 
    } = calculateSolarPosition(julianCentury);
    const { 
        obliqCorr,
        solarDeclination 
    } = calculateObliquityAndDeclination(julianCentury, geomMeanLongSun);
    
    // Calculate equation of time
    const eqOfTime = calculateEquationOfTime(
        julianCentury, 
        geomMeanLongSun, 
        geomMeanAnomSun, 
        eccentEarthOrbit, 
        obliqCorr
    );

    // Calculate AB2 (Time past local midnight adjusted)
    const timeAdjusted = mod(timePastMidnight * 60 + eqOfTime + 4 * longitude - 60 * timeZone, 1440);

    // Calculate AC2 (Hour angle)
    const hourAngle = timeAdjusted/4 < 0 ? timeAdjusted/4 + 180 : timeAdjusted/4 - 180;

    // Calculate Solar Zenith Angle (deg)
    const solarZenith = toDegrees(Math.acos(
        Math.sin(toRadians(latitude)) * Math.sin(toRadians(solarDeclination)) +
        Math.cos(toRadians(latitude)) * Math.cos(toRadians(solarDeclination)) * 
            Math.cos(toRadians(hourAngle))
    ));

    // Calculate Solar Azimuth
    const acosTerm = (
        (Math.sin(toRadians(latitude)) * Math.cos(toRadians(solarZenith))) -
        Math.sin(toRadians(solarDeclination))
    ) / (Math.cos(toRadians(latitude)) * Math.sin(toRadians(solarZenith)));

    let solarAzimuth;
    if (hourAngle > 0) {
        solarAzimuth = mod(toDegrees(Math.acos(acosTerm)) + 180, 360);
    } else {
        solarAzimuth = mod(540 - toDegrees(Math.acos(acosTerm)), 360);
    }

    return {
        solarAzimuth,
        solarZenith,
        hourAngle,
        eqOfTime
    };
}
