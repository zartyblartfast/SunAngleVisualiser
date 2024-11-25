import { createSolarAltitudeDiagram } from './solar_altitude_diagram.js';
import { createSphericalEarthDiagram } from './spherical_Earth_diagram.js';
import { createAngleTestDiagram } from './angle_test_diagram.js';

const SCALE_FACTOR = 1.5;  // Global scaling constant for both diagrams

function calculateSolarDeclination(date) {
    // Helper functions
    const toRadians = degrees => degrees * Math.PI / 180;
    const toDegrees = radians => radians * 180 / Math.PI;
    const mod = (a, n) => a - Math.floor(a/n) * n;

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

function calculateDateFromDeclination(targetDeclination, year) {
    // Helper functions
    const toRadians = degrees => degrees * Math.PI / 180;
    const toDegrees = radians => radians * 180 / Math.PI;
    const mod = (a, n) => a - Math.floor(a/n) * n;

    // Get timezone offset in hours
    const timeZone = -(new Date().getTimezoneOffset() / 60);

    // Since solar declination has two possible dates (except at solstices),
    // we'll use the current date to determine which half of the year to use
    const currentDate = new Date(document.getElementById('selected-date').value);
    const isFirstHalf = currentDate.getMonth() < 6;

    // The maximum declination is about 23.44 degrees (obliquity of the ecliptic)
    const maxDeclination = 23.44;
    if (Math.abs(targetDeclination) > maxDeclination) {
        console.warn('Target declination exceeds maximum possible value');
        targetDeclination = Math.sign(targetDeclination) * maxDeclination;
    }

    // Using the inverse of the declination formula:
    // dec = asin(sin(obliquity) * sin(sunLong))
    // Therefore: sunLong = asin(sin(dec) / sin(obliquity))
    // This gives us the sun's longitude, which we can use to find the date

    // First, find approximate sun longitude
    const approxObliquity = 23.44; // Average obliquity in degrees
    let sunLong = toDegrees(Math.asin(
        Math.sin(toRadians(targetDeclination)) / 
        Math.sin(toRadians(approxObliquity))
    ));

    // Adjust for the half of the year we want
    if (isFirstHalf) {
        if (sunLong < 0) sunLong += 360;
    } else {
        if (sunLong >= 0) sunLong = 180 - sunLong;
        else sunLong = -180 - sunLong;
    }

    // Now search through the current year to find the closest match
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    let bestDate = currentDate;
    let minDiff = Math.abs(calculateSolarDeclination(currentDate) - targetDeclination);

    // Search by 5-day increments first to get close
    for (let testDate = new Date(yearStart); testDate <= yearEnd; testDate.setDate(testDate.getDate() + 5)) {
        const testDeclination = calculateSolarDeclination(testDate);
        const diff = Math.abs(testDeclination - targetDeclination);
        if (diff < minDiff) {
            minDiff = diff;
            bestDate = new Date(testDate);
        }
    }

    // Fine-tune by checking ±5 days around our best match
    const fineStart = new Date(bestDate.setDate(bestDate.getDate() - 5));
    const fineEnd = new Date(bestDate.setDate(bestDate.getDate() + 10));
    
    for (let testDate = new Date(fineStart); testDate <= fineEnd; testDate.setDate(testDate.getDate() + 1)) {
        const testDeclination = calculateSolarDeclination(testDate);
        const diff = Math.abs(testDeclination - targetDeclination);
        if (diff < minDiff) {
            minDiff = diff;
            bestDate = new Date(testDate);
        }
    }

    // Ensure we stay within the specified year
    if (bestDate.getFullYear() !== year) {
        bestDate.setFullYear(year);
    }

    return bestDate;
}

function calculateSolarElevation(latitude, solarDeclination) {
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

// Central update function for solar declination changes
function updateAllDiagrams(solarDeclination) {
    // Update the input value
    document.getElementById('latitude-overhead-input').value = solarDeclination.toFixed(1);
    
    // Calculate and update solar elevation
    const latitude = parseFloat(document.getElementById('location-latitude-input').value);
    calculateSolarElevation(latitude, solarDeclination);
    
    // Update all diagrams
    createSphericalEarthDiagram(solarDeclination);
    createSolarAltitudeDiagram(latitude);
    createAngleTestDiagram();
}

document.addEventListener('DOMContentLoaded', function() {
    const latitudeOverheadInput = document.getElementById('latitude-overhead-input');
    const locationLatitudeInput = document.getElementById('location-latitude-input');
    const locationLongitudeInput = document.getElementById('location-longitude-input');
    const selectedDate = document.getElementById('selected-date');
    const solarTime = document.getElementById('solar-time');
    const localTime = document.getElementById('local-time');

    // Set initial date/time values
    const today = new Date();
    selectedDate.value = today.toISOString().split('T')[0];
    solarTime.value = '12:00';  // Start with solar noon

    // Set initial solar declination and elevation
    const initialDate = new Date(selectedDate.value);
    const initialDeclination = calculateSolarDeclination(initialDate);
    document.getElementById('latitude-overhead-input').value = initialDeclination.toFixed(1);
    
    // Get location latitude slider
    const locationLatitudeSlider = document.getElementById('location-latitude-slider');
    
    // Set initial location latitude limits based on solar declination
    const initialMin = initialDeclination - 90;
    const initialMax = initialDeclination + 90;
    locationLatitudeInput.min = initialMin;
    locationLatitudeInput.max = initialMax;
    locationLatitudeSlider.min = initialMin;
    locationLatitudeSlider.max = initialMax;
    
    // Ensure location latitude is within limits
    let currentLatitude = parseFloat(locationLatitudeInput.value) || 0;
    if (currentLatitude > locationLatitudeInput.max) {
        locationLatitudeInput.value = locationLatitudeInput.max;
        locationLatitudeSlider.value = locationLatitudeInput.max;
    } else if (currentLatitude < locationLatitudeInput.min) {
        locationLatitudeInput.value = locationLatitudeInput.min;
        locationLatitudeSlider.value = locationLatitudeInput.min;
    }
    
    // Calculate initial solar elevation
    const initialLatitude = parseFloat(locationLatitudeInput.value) || 0;
    calculateSolarElevation(initialLatitude, initialDeclination);

    // Create initial diagrams
    createSphericalEarthDiagram(initialDeclination);
    createSolarAltitudeDiagram(initialLatitude);
    createAngleTestDiagram();

    // Make sure to trigger any existing event listeners
    document.getElementById('latitude-overhead-input').dispatchEvent(new Event('input'));

    // Calculate initial LST based on location and solar time
    if (locationLatitudeInput.value && locationLongitudeInput.value) {
        try {
            const offset = getLocalTimeZoneOffset(
                selectedDate.value,
                parseFloat(locationLatitudeInput.value),
                parseFloat(locationLongitudeInput.value)
            );
            
            // Calculate initial values
            updateEoTDisplay();
            
            // Ensure we have valid input values before calculation
            if (solarTime.value && offset !== undefined) {
                localTime.value = adjustTimeForOffset('12:00', offset, true);
                console.log('Initial local time set to:', localTime.value);
            } else {
                localTime.value = '12:00';
                console.log('Using default local time due to invalid inputs');
            }
        } catch (error) {
            console.error('Error during initial time setup:', error);
            localTime.value = '12:00';  // Fallback to default
        }
    } else {
        localTime.value = '12:00';  // Default if no location set
        console.log('No location set, using default time');
    }

    // Enable fields when both lat/long are entered
    function checkLocationInputs() {
        const hasLat = !isNaN(parseFloat(locationLatitudeInput.value));
        const hasLong = !isNaN(parseFloat(locationLongitudeInput.value));
        selectedDate.disabled = !(hasLat && hasLong);
        solarTime.disabled = !(hasLat && hasLong);
        localTime.disabled = !(hasLat && hasLong);
    }

    // Add location input listeners
    locationLatitudeInput.addEventListener('input', checkLocationInputs);
    locationLongitudeInput.addEventListener('input', checkLocationInputs);

    // Initial check
    checkLocationInputs();

    // Add constraint update to solar declination changes
    latitudeOverheadInput.addEventListener('input', function() {
        const solarDeclination = parseFloat(this.value);
        const min = solarDeclination - 90;
        const max = solarDeclination + 90;
        
        locationLatitudeInput.min = min;
        locationLatitudeInput.max = max;
        locationLatitudeSlider.min = min;
        locationLatitudeSlider.max = max;
        
        const currentLatitude = parseFloat(locationLatitudeInput.value);
        if (currentLatitude > max) {
            locationLatitudeInput.value = max;
            locationLatitudeSlider.value = max;
        } else if (currentLatitude < min) {
            locationLatitudeInput.value = min;
            locationLatitudeSlider.value = min;
        }
    });

    // Sync sliders with input fields
    const latitudeOverheadSlider = document.getElementById('latitude-overhead-slider');

    // Function to update latitude constraints
    function updateLatitudeConstraints(solarDeclination) {
        const negativeLimit = solarDeclination - 90;
        const positiveLimit = solarDeclination + 90;
        locationLatitudeInput.min = negativeLimit;
        locationLatitudeInput.max = positiveLimit;
        
        // Ensure current latitude is within limits
        let currentLatitude = parseFloat(locationLatitudeInput.value);
        if (currentLatitude > positiveLimit) {
            locationLatitudeInput.value = positiveLimit;
        } else if (currentLatitude < negativeLimit) {
            locationLatitudeInput.value = negativeLimit;
        }
    }

    // Sync latitude slider and input
    latitudeOverheadSlider.addEventListener('input', function() {
        latitudeOverheadInput.value = this.value;
        const latitude = parseFloat(locationLatitudeInput.value);
        const solarDeclination = parseFloat(this.value);
        calculateSolarElevation(latitude, solarDeclination);
        updateAllDiagrams(solarDeclination);

        // Use the inverse calculations to find the date
        const currentDate = new Date(document.getElementById('selected-date').value);
        const matchingDate = calculateDateFromDeclination(solarDeclination, currentDate.getFullYear());
        document.getElementById('selected-date').value = matchingDate.toISOString().split('T')[0];
    });
    latitudeOverheadInput.addEventListener('input', function() {
        latitudeOverheadSlider.value = this.value;
        updateLatitudeConstraints(parseFloat(this.value));
    });

    // Initial sync of sliders with input values
    latitudeOverheadSlider.value = latitudeOverheadInput.value;

    // Sync location latitude slider and input
    locationLatitudeSlider.addEventListener('input', function(event) {
        const sliderValue = event.target.value;
        locationLatitudeInput.value = sliderValue;
        const latitude = parseFloat(sliderValue);
        const solarDeclination = parseFloat(latitudeOverheadInput.value);
        
        // Update solar elevation
        const solarElevation = calculateSolarElevation(latitude, solarDeclination);
        document.getElementById('solar-elevation-output').value = solarElevation.toFixed(1);
        
        // Update diagrams
        updateAllDiagrams(solarDeclination);
        checkLocationInputs();
    });
    
    locationLatitudeInput.addEventListener('input', function(event) {
        const inputValue = event.target.value;
        locationLatitudeSlider.value = inputValue;
        const latitude = parseFloat(inputValue);
        const solarDeclination = parseFloat(latitudeOverheadInput.value);
        
        // Update solar elevation
        const solarElevation = calculateSolarElevation(latitude, solarDeclination);
        document.getElementById('solar-elevation-output').value = solarElevation.toFixed(1);
        
        // Update diagrams
        updateAllDiagrams(solarDeclination);
        checkLocationInputs();
    });

    // Sync location longitude slider and input
    const locationLongitudeSlider = document.getElementById('location-longitude-slider');
    locationLongitudeSlider.addEventListener('input', function() {
        locationLongitudeInput.value = this.value;
        checkLocationInputs();
        if (locationLatitudeInput.value) updateEoTDisplay();
    });
    locationLongitudeInput.addEventListener('input', function() {
        locationLongitudeSlider.value = this.value;
    });

    // Initial sync of location sliders with input values
    locationLatitudeSlider.value = locationLatitudeInput.value;
    locationLongitudeSlider.value = locationLongitudeInput.value;

    // Set up help icon popups
    const helpIcons = document.querySelectorAll('.help-icon');
    helpIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            // Prevent the click event from bubbling up
            event.stopPropagation();

            // Create or toggle the popup
            let popup = document.querySelector('.popup');
            if (!popup) {
                popup = document.createElement('div');
                popup.className = 'popup';
                document.body.appendChild(popup);
            }

            // Set the help text from the data attribute
            popup.textContent = icon.getAttribute('data-help');
            const rect = icon.getBoundingClientRect();
            popup.style.top = `${rect.bottom + window.scrollY}px`; // Position below the icon
            popup.style.left = `${rect.left + window.scrollX}px`; // Align with the icon
            popup.classList.toggle('active'); // Toggle visibility

            // Close the popup when clicking outside
            document.addEventListener('click', function(event) {
                if (!popup.contains(event.target) && !icon.contains(event.target)) {
                    popup.classList.remove('active');
                }
            }, { once: true });
        });
    });

    // Add these helper functions at the top of initializeTableFunctionality
    function getLocalTimeZoneOffset(date, latitude, longitude) {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = date ? new Date(date) : new Date();
        const localTimeOffset = now.getTimezoneOffset() / 60; // Offset in hours
        const estimatedOffset = longitude / 15;
        
        console.log(`Time Zone: ${timeZone}, Local Offset: ${-localTimeOffset}`);
        console.log(`Longitude-based Estimate: ${estimatedOffset}`);
        return -localTimeOffset;
    }
    function adjustTimeForOffset(timeStr, offset, isSolarToLocal) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date(selectedDate.value);
        const eot = calculateEoT(
            date.toISOString(),
            offset,
            parseFloat(latitudeOverheadInput.value)
        );
        
        // Convert everything to minutes for more precise calculations
        const totalInputMinutes = hours * 60 + minutes;
        const offsetMinutes = offset * 60;
        
        let newTotalMinutes;
        if (isSolarToLocal) {
            // Solar to Local: add both offset and EoT
            newTotalMinutes = totalInputMinutes + offsetMinutes + eot;
        } else {
            // Local to Solar: subtract offset and EoT
            newTotalMinutes = totalInputMinutes - offsetMinutes - eot;
        }
        
        console.log(`Time Adjustment Details:
            Input time: ${hours}:${minutes} (${totalInputMinutes} minutes)
            TZ Offset: ${offset}h (${offsetMinutes} minutes)
            EoT: ${eot} minutes
            Direction: ${isSolarToLocal ? 'Solar→Local' : 'Local→Solar'}
            Calculation: ${totalInputMinutes} ${isSolarToLocal ? '+' : '-'} ${offsetMinutes} ${isSolarToLocal ? '+' : '-'} ${eot} = ${newTotalMinutes}
        `);
        
        // Handle day wraparound
        while (newTotalMinutes >= 1440) newTotalMinutes -= 1440;  // 24 * 60
        while (newTotalMinutes < 0) newTotalMinutes += 1440;
        
        // Calculate hours and minutes, ensuring minutes don't exceed 59
        let newHours = Math.floor(newTotalMinutes / 60);
        let newMinutes = Math.round((newTotalMinutes % 60));
        
        // Handle case where minutes round to 60
        if (newMinutes === 60) {
            newHours += 1;
            newMinutes = 0;
            if (newHours === 24) newHours = 0;
        }
        
        // Verify valid numbers
        if (isNaN(newHours) || isNaN(newMinutes) || 
            newHours < 0 || newHours > 23 || 
            newMinutes < 0 || newMinutes > 59) {
            console.error('Invalid time calculation:', { newHours, newMinutes, newTotalMinutes });
            return '12:00'; // Return a default time instead of invalid display
        }
        
        return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    }

    // Add these event listeners after the initial date/time setup
    solarTime.addEventListener('input', function() {
        if (locationLatitudeInput.value && locationLongitudeInput.value) {
            const offset = getLocalTimeZoneOffset(
                selectedDate.value,
                parseFloat(locationLatitudeInput.value),
                parseFloat(locationLongitudeInput.value)
            );
            localTime.value = adjustTimeForOffset(this.value, offset, true);
            updateEoTDisplay();
        }
    });

    localTime.addEventListener('input', function() {
        if (locationLatitudeInput.value && locationLongitudeInput.value) {
            const offset = getLocalTimeZoneOffset(
                selectedDate.value,
                parseFloat(locationLatitudeInput.value),
                parseFloat(locationLongitudeInput.value)
            );
            
            console.log(`Local Time Change:
                Input Local Time: ${this.value}
                Current Solar Time: ${solarTime.value}
                TZ Offset: ${offset}
                About to call adjustTimeForOffset...
            `);
            
            // Let's try just the timezone offset first
            let newSolarTime = adjustTimeForOffset(this.value, -offset, false);
            console.log(`Calculated new Solar Time: ${newSolarTime}`);
            
            solarTime.value = newSolarTime;
            updateEoTDisplay();
        }
    });

    // Add this after the solar time and local time event listeners
    selectedDate.addEventListener('input', function() {
        if (locationLatitudeInput.value && locationLongitudeInput.value) {
            const offset = getLocalTimeZoneOffset(
                this.value,
                parseFloat(locationLatitudeInput.value),
                parseFloat(locationLongitudeInput.value)
            );
            localTime.value = adjustTimeForOffset(solarTime.value, offset, true);
            updateEoTDisplay();
        }
    });

    // Add this with the other helper functions
    function updateEoTDisplay() {
        const date = new Date(selectedDate.value);
        if (locationLatitudeInput.value && locationLongitudeInput.value) {
            const tzOffset = getLocalTimeZoneOffset(
                selectedDate.value,
                parseFloat(locationLatitudeInput.value),
                parseFloat(locationLongitudeInput.value)
            );
            
            const eot = calculateEoT(
                date.toISOString(),
                tzOffset,
                parseFloat(latitudeOverheadInput.value)
            );
            
            // Format EoT as mm:ss with sign
            const eotSign = eot >= 0 ? '+' : '-';
            const absEot = Math.abs(eot);
            const eotMinutes = Math.floor(absEot);
            const eotSeconds = Math.round((absEot - eotMinutes) * 60);
            
            // Format timezone offset with sign
            const tzSign = tzOffset >= 0 ? '+' : '-';
            const absTz = Math.abs(tzOffset);
            
            document.getElementById('eot-display').textContent = 
                `TZ: ${tzSign}${absTz}h, EoT: ${eotSign}${String(eotMinutes).padStart(2, '0')}:${String(eotSeconds).padStart(2, '0')}`;
        } else {
            document.getElementById('eot-display').textContent = 'TZ: 0h, EoT: 0:00';
        }
    }

    // Make sure this is only called once at the end
    initializeGeocoding();

    // Make sure initial values are calculated
    calculateSolarElevation(
        parseFloat(locationLatitudeInput.value) || 0,
        parseFloat(latitudeOverheadInput.value) || 0
    );
});

// Add the event listener for date changes
document.getElementById('selected-date').addEventListener('input', function() {
    const date = new Date(this.value);
    const declination = calculateSolarDeclination(date);
    
    // Update latitude overhead input
    document.getElementById('latitude-overhead-input').value = declination.toFixed(1);
    
    // Calculate and update solar elevation
    const latitude = parseFloat(document.getElementById('location-latitude-input').value);
    calculateSolarElevation(latitude, declination);
    
    // Update all diagrams
    document.getElementById('latitude-overhead-input').dispatchEvent(new Event('input'));
    createSolarAltitudeDiagram(latitude);
});
