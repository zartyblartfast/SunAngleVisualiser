function calculateEoT(solarTime, localTimeZoneOffset, latitudeOverhead) {
    // Get the current date and parse inputs
    const date = new Date(solarTime); // Solar time input (e.g., "2024-03-21T12:00:00")
    
    // Julian Day calculation
    const julianDay = calculateJulianDay(date, localTimeZoneOffset);

    // Julian Century (G2)
    const julianCentury = (julianDay - 2451545) / 36525;

    // Mean Obliquity of the Ecliptic (Q2)
    const meanObliqEcliptic = 23 + (26 + ((21.448 - julianCentury * (46.815 + julianCentury * (0.00059 - julianCentury * 0.001813))) / 60)) / 60;

    // Obliquity Correction (R2)
    const obliqCorr = meanObliqEcliptic + 0.00256 * Math.cos(toRadians(125.04 - 1934.136 * julianCentury));

    // Geometric Mean Longitude of the Sun (I2)
    const geomMeanLongSun = (280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032)) % 360;

    // Geometric Mean Anomaly of the Sun (J2)
    const geomMeanAnomSun = 357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury);

    // Eccentricity of Earth's Orbit (K2)
    const eccentEarthOrbit = 0.016708634 - julianCentury * (0.000042037 + 0.0000001267 * julianCentury);

    // U2: Factor involving obliquity correction
    const u2 = Math.tan(toRadians(obliqCorr / 2)) ** 2;

    // Equation of Time (EoT) in minutes
    const eot = 4 * toDegrees(
        u2 * Math.sin(2 * toRadians(geomMeanLongSun)) -
        2 * eccentEarthOrbit * Math.sin(toRadians(geomMeanAnomSun)) +
        4 * eccentEarthOrbit * u2 * Math.sin(toRadians(geomMeanAnomSun)) * Math.cos(2 * toRadians(geomMeanLongSun)) -
        0.5 * u2 ** 2 * Math.sin(4 * toRadians(geomMeanLongSun)) -
        1.25 * eccentEarthOrbit ** 2 * Math.sin(2 * toRadians(geomMeanAnomSun))
    );

    return eot; // in minutes
}

// Helper Functions
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function calculateJulianDay(date, localTimeZoneOffset) {
    const utcDate = new Date(date.getTime() - localTimeZoneOffset * 3600000); // Adjust for timezone
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getUTCMonth() + 1;
    const day = utcDate.getUTCDate();

    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;

    return (
        day +
        Math.floor((153 * m + 2) / 5) +
        365 * y +
        Math.floor(y / 4) -
        Math.floor(y / 100) +
        Math.floor(y / 400) -
        32045
    );
}
