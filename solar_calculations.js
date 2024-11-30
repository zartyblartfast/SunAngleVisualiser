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

    // Sun True Anomaly (deg)
    const sunTrueAnom = geomMeanAnomSun + sunEqOfCtr;

    // Sun Rad Vector (AUs)
    const sunRadVector = (1.000001018 * (1 - Math.pow(0.016708634 - julianCentury * 
        (0.000042037 + 0.0000001267 * julianCentury), 2))) / 
        (1 + (0.016708634 - julianCentury * (0.000042037 + 
        0.0000001267 * julianCentury)) * Math.cos(toRadians(sunTrueAnom)));

    // Eccentricity of Earth Orbit
    const eccentEarthOrbit = 0.016708634 - julianCentury * 
        (0.000042037 + 0.0000001267 * julianCentury);

    return {
        geomMeanLongSun,
        geomMeanAnomSun,
        sunEqOfCtr,
        sunTrueLong,
        sunTrueAnom,
        sunRadVector,
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
    // Solar elevation is 90° - zenith angle
    const solarElevation = 90 - calculateSolarAzimuth(new Date(), latitude, 0, 0).solarZenith;
    
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
    // Get solar time from input field
    const solarTimeInput = document.getElementById('solar-time').value;
    const [hours, minutes] = solarTimeInput.split(':').map(Number);
    
    // Convert solar time to minutes past midnight
    const timePastMidnightMinutes = (hours * 60) + minutes;
    
    console.log('Using solar time directly:', {
        solarTimeInput,
        hours,
        minutes,
        timePastMidnightMinutes
    });

    // Calculate Julian values
    const { julianDay, julianCentury } = calculateJulianValues(date, timeZone);
    console.log('JULIAN VALUES:');
    console.log('Julian Day:', julianDay);
    console.log('Julian Century:', julianCentury);
    console.log('----------------------------------------');

    // Calculate solar position
    const { 
        geomMeanLongSun, 
        geomMeanAnomSun, 
        sunEqOfCtr,
        sunTrueLong,
        sunTrueAnom,
        sunRadVector,
        eccentEarthOrbit 
    } = calculateSolarPosition(julianCentury);

    console.log('SOLAR POSITION:');
    console.log('Geometric Mean Longitude of Sun:', geomMeanLongSun.toFixed(6));
    console.log('Geometric Mean Anomaly of Sun:', geomMeanAnomSun.toFixed(6));
    console.log('Sun Equation of Center:', sunEqOfCtr.toFixed(6));
    console.log('Sun True Longitude:', sunTrueLong.toFixed(6));
    console.log('----------------------------------------');

    // Calculate obliquity and declination
    const { 
        meanObliqEcliptic,
        obliqCorr,
        sunAppLong,
        solarDeclination 
    } = calculateObliquityAndDeclination(julianCentury, sunTrueLong);

    console.log('OBLIQUITY AND DECLINATION:');
    console.log('Mean Obliquity of Ecliptic:', meanObliqEcliptic.toFixed(6));
    console.log('Obliquity Correction:', obliqCorr.toFixed(6));
    console.log('Sun Apparent Longitude:', sunAppLong.toFixed(6));
    console.log('Solar Declination:', solarDeclination.toFixed(6));
    console.log('----------------------------------------');

    // Calculate equation of time
    const eqOfTime = calculateEquationOfTime(
        julianCentury, 
        geomMeanLongSun, 
        geomMeanAnomSun, 
        eccentEarthOrbit, 
        obliqCorr
    );
    
    // Calculate true solar time (minutes past midnight)
    const trueSolarTime = mod(timePastMidnightMinutes + eqOfTime + 4 * longitude - 60 * timeZone, 1440);
    
    console.log('TIME CALCULATIONS:');
    console.log('Equation of Time (minutes):', eqOfTime.toFixed(6));
    console.log('Time Past Midnight (minutes):', timePastMidnightMinutes.toFixed(6));
    console.log('True Solar Time (minutes):', trueSolarTime.toFixed(6));
    console.log('----------------------------------------');
    
    // Calculate hour angle
    const hourAngle = trueSolarTime / 4 < 0 ? (trueSolarTime / 4) + 180 : (trueSolarTime / 4) - 180;

    // Calculate Solar Zenith Angle (deg)
    const solarZenith = toDegrees(Math.acos(
        Math.sin(toRadians(latitude)) * Math.sin(toRadians(solarDeclination)) +
        Math.cos(toRadians(latitude)) * Math.cos(toRadians(solarDeclination)) * 
            Math.cos(toRadians(hourAngle))
    ));

    console.log('ANGLE CALCULATIONS:');
    console.log('Hour Angle:', hourAngle.toFixed(6));
    console.log('Solar Zenith:', solarZenith.toFixed(6));
    console.log('----------------------------------------');

    // Calculate Solar Azimuth
    const acosTerm = (
        (Math.sin(toRadians(latitude)) * Math.cos(toRadians(solarZenith))) -
        Math.sin(toRadians(solarDeclination))
    ) / (Math.cos(toRadians(latitude)) * Math.sin(toRadians(solarZenith)));
    
    const acosValue = toDegrees(Math.acos(acosTerm));
    
    let solarAzimuth;
    if (hourAngle > 0) {
        solarAzimuth = mod(acosValue + 180, 360);
    } else {
        solarAzimuth = mod(540 - acosValue, 360);
    }
    
    console.log('AZIMUTH CALCULATION:');
    console.log('ACOS Term:', acosTerm.toFixed(6));
    console.log('ACOS Value (degrees):', acosValue.toFixed(6));
    console.log('Final Solar Azimuth:', solarAzimuth.toFixed(6));
    console.log('==========================================\n');

    return {
        solarAzimuth,
        solarZenith,
        hourAngle,
        eqOfTime
    };
}
