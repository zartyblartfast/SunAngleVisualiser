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
    // Ensure we're using the correct time (12:00 if time is not set)
    if (date.getHours() === 0 && date.getMinutes() === 0) {
        date.setHours(12);
    }
    
    // Get the current time in days past local midnight (convert from hours to days)
    const timePastMidnight = (date.getHours() + date.getMinutes()/60 + date.getSeconds()/3600) / 24;
    
    // Ensure timeZone is properly handled (convert -0 to 0)
    timeZone = timeZone === -0 ? 0 : timeZone;
    
    console.log('Input values:');
    console.log('Date:', date);
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    console.log('Time Zone:', timeZone);
    console.log('Time past midnight (days):', timePastMidnight);

    // Get common calculations
    const { julianDay, julianCentury } = calculateJulianValues(date, timeZone);
    console.log('Julian Day (F2):', julianDay);
    console.log('Julian Century (G2):', julianCentury);

    const { 
        geomMeanLongSun, 
        geomMeanAnomSun, 
        sunEqOfCtr,
        sunTrueLong,
        sunTrueAnom,
        sunRadVector,
        eccentEarthOrbit 
    } = calculateSolarPosition(julianCentury);

    console.log('Geom Mean Long Sun (I2):', geomMeanLongSun);
    console.log('Geom Mean Anom Sun (J2):', geomMeanAnomSun);
    console.log('Sun Eq of Ctr (L2):', sunEqOfCtr);
    console.log('Sun True Long (M2):', sunTrueLong);
    console.log('Sun True Anom:', sunTrueAnom);
    console.log('Sun Rad Vector (R):', sunRadVector);
    console.log('Eccent Earth Orbit (K2):', eccentEarthOrbit);

    const { 
        meanObliqEcliptic,
        obliqCorr,
        sunAppLong,
        solarDeclination 
    } = calculateObliquityAndDeclination(julianCentury, sunTrueLong);

    console.log('Mean Obliq Ecliptic (Q2):', meanObliqEcliptic);
    console.log('Obliq Corr (R2):', obliqCorr);
    console.log('Sun App Long (P2):', sunAppLong);
    console.log('Solar Declination (T2):', solarDeclination);
    
    // Calculate equation of time
    const eqOfTime = calculateEquationOfTime(
        julianCentury, 
        geomMeanLongSun, 
        geomMeanAnomSun, 
        eccentEarthOrbit, 
        obliqCorr
    );
    console.log('Equation of Time (V2):', eqOfTime);

    // Calculate time adjusted (HA Sunrise/Sunset)
    const haSunrise = Math.acos(Math.cos(toRadians(90.833)) / 
        (Math.cos(toRadians(latitude)) * Math.cos(toRadians(solarDeclination))) - 
        Math.tan(toRadians(latitude)) * Math.tan(toRadians(solarDeclination)));
    const haDeg = toDegrees(haSunrise);
    
    // Calculate solar noon
    const solarNoon = (720 - 4 * longitude - eqOfTime + timeZone * 60) / 1440;
    
    // Calculate true solar time (convert timePastMidnight from days to minutes)
    const trueSolarTime = mod(timePastMidnight * 24 * 60 + eqOfTime + 4 * longitude - 60 * timeZone, 1440);
    
    // Calculate hour angle
    const hourAngle = trueSolarTime / 4 < 0 ? trueSolarTime / 4 + 180 : trueSolarTime / 4 - 180;
    console.log('Hour Angle (AC2):', hourAngle);

    // Calculate Solar Zenith Angle (deg)
    const solarZenith = toDegrees(Math.acos(
        Math.sin(toRadians(latitude)) * Math.sin(toRadians(solarDeclination)) +
        Math.cos(toRadians(latitude)) * Math.cos(toRadians(solarDeclination)) * 
            Math.cos(toRadians(hourAngle))
    ));
    console.log('Solar Zenith Angle (AD2):', solarZenith);

    // Calculate Solar Azimuth
    const acosTerm = (
        (Math.sin(toRadians(latitude)) * Math.cos(toRadians(solarZenith))) -
        Math.sin(toRadians(solarDeclination))
    ) / (Math.cos(toRadians(latitude)) * Math.sin(toRadians(solarZenith)));
    
    const acosValue = toDegrees(Math.acos(acosTerm));
    console.log('ACOS value:', acosValue);
    
    let solarAzimuth;
    if (hourAngle > 0) {
        solarAzimuth = mod(acosValue + 180, 360);
    } else {
        solarAzimuth = mod(180 - acosValue + 360, 360);
    }
    
    console.log('Final Solar Azimuth:', solarAzimuth);

    return {
        solarAzimuth,
        solarZenith,
        hourAngle,
        eqOfTime
    };
}
