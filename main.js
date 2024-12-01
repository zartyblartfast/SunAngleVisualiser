import { createSolarAltitudeDiagram } from './solar_altitude_diagram.js';
import { createSphericalEarthDiagram } from './spherical_Earth_diagram.js';
import { createAngleTestDiagram } from './angle_test_diagram.js';
import { updateLatitudeConstraints } from './latitude_constraint.js';
import { calculateSolarDeclination, calculateSolarElevation, calculateSolarAzimuth, calculateDateFromDeclination } from './solar_calculations.js';
import { initSunPathDiagram, updateSunPosition, drawSunPath } from './sun_path.js';

const SCALE_FACTOR = 1.5;  // Global scaling constant for both diagrams

function updateSolarCalculations() {
    const date = new Date(document.getElementById('selected-date').value);
    const latitude = parseFloat(document.getElementById('location-latitude-input').value);
    const longitude = parseFloat(document.getElementById('location-longitude-input').value);
    const timeZone = -(new Date().getTimezoneOffset() / 60);

    // Check if we're in manual declination mode
    const latitudeOverheadInput = document.getElementById('latitude-overhead-input');
    const solarDeclination = latitudeOverheadInput.hasAttribute('data-manual') 
        ? parseFloat(latitudeOverheadInput.value)
        : calculateSolarDeclination(date);
    const solarElevation = calculateSolarElevation(latitude, solarDeclination);

    // Calculate solar azimuth
    const { solarAzimuth, solarZenith } = calculateSolarAzimuth(date, latitude, longitude, timeZone);
    
    // Update azimuth display
    const azimuthOutput = document.getElementById('solar-azimuth-output');
    if (azimuthOutput) {
        azimuthOutput.value = solarAzimuth.toFixed(1);
    }

    // Update zenith display
    const zenithOutput = document.getElementById('solar-zenith-output');
    if (zenithOutput) {
        zenithOutput.value = solarZenith.toFixed(1);
    }

    // Update elevation display
    const elevationOutput = document.getElementById('solar-elevation-output');
    if (elevationOutput) {
        elevationOutput.value = solarElevation.toFixed(1);
    }

    return { solarDeclination, solarElevation, solarAzimuth, solarZenith };
}

// Update the existing update function to use the new calculations
function updateAllDiagrams() {
    // First calculate all solar values
    const { solarDeclination, solarAzimuth, solarZenith } = updateSolarCalculations();
    
    // Update diagrams that don't depend on azimuth
    createSolarAltitudeDiagram(parseFloat(document.getElementById('location-latitude-input').value));
    createSphericalEarthDiagram();
    createAngleTestDiagram();
    
    // Wait for the next tick to ensure output values are updated
    setTimeout(() => {
        // Get the displayed values after they've been updated
        const displayedAzimuth = parseFloat(document.getElementById('solar-azimuth-output').value);
        const displayedElevation = parseFloat(document.getElementById('solar-elevation-output').value);
        
        console.log('Sun position values:', {
            calculatedAzimuth: solarAzimuth,
            displayedAzimuth: displayedAzimuth,
            calculatedElevation: 90 - solarZenith,
            displayedElevation: displayedElevation
        });
        
        // Now update the sun position with the correct angles
        updateSunPosition(displayedElevation, displayedAzimuth);
        drawSunPath();
    }, 0);
    
    // Update constraints
    updateLatitudeConstraints(solarDeclination);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sun path diagram
    initSunPathDiagram('sun-path-container');
    
    const latitudeOverheadInput = document.getElementById('latitude-overhead-input');
    const locationLatitudeInput = document.getElementById('location-latitude-input');
    const locationLongitudeInput = document.getElementById('location-longitude-input');
    const selectedDate = document.getElementById('selected-date');
    const solarTime = document.getElementById('solar-time');
    const localTime = document.getElementById('local-time');
    const latitudeOverheadSlider = document.getElementById('latitude-overhead-slider');
    const locationLatitudeSlider = document.getElementById('location-latitude-slider');
    const locationLongitudeSlider = document.getElementById('location-longitude-slider');

    // Set initial date to today
    selectedDate.valueAsDate = new Date();
    selectedDate.disabled = false;
    
    // Set initial solar time to 12:00 (noon)
    solarTime.value = '12:00';
    solarTime.disabled = false;
    
    // Wait for the next tick to ensure all values are set
    setTimeout(() => {
        // Now that we have initial values, update the diagrams
        if (locationLatitudeInput.value && locationLongitudeInput.value && 
            selectedDate.value && solarTime.value) {
            updateAllDiagrams();
        }
    }, 0);

    // Set initial values and update diagrams
    updateAllDiagrams();
    
    // Set initial solar declination and elevation
    const initialDate = new Date(selectedDate.value);
    const initialDeclination = calculateSolarDeclination(initialDate);
    document.getElementById('latitude-overhead-input').value = initialDeclination.toFixed(1);
    
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
    const initialSolarElevation = calculateSolarElevation(initialLatitude, initialDeclination);

    // Update initial solar calculations including azimuth
    updateSolarCalculations();

    // Create initial diagrams
    createSolarAltitudeDiagram(initialLatitude);
    createSphericalEarthDiagram();
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
    latitudeOverheadSlider.addEventListener('input', function() {
        latitudeOverheadInput.value = this.value;
        const latitude = parseFloat(locationLatitudeInput.value);
        const solarDeclination = parseFloat(this.value);
        const solarElevation = calculateSolarElevation(latitude, solarDeclination);
        updateAllDiagrams();
        
        // Use the inverse calculations to find the date
        const currentDate = new Date(document.getElementById('selected-date').value);
        const matchingDate = calculateDateFromDeclination(solarDeclination, currentDate.getFullYear());
        document.getElementById('selected-date').value = matchingDate.toISOString().split('T')[0];
    });
    latitudeOverheadInput.addEventListener('input', function() {
        console.log('******* Manual change to latitude-overhead-input:', this.value);
        this.setAttribute('data-manual', 'true');
        latitudeOverheadSlider.value = this.value;
        
        const solarDeclination = parseFloat(this.value);
        const latitude = parseFloat(locationLatitudeInput.value);
        
        // Calculate new solar elevation
        const solarElevation = calculateSolarElevation(latitude, solarDeclination);
        
        // Update diagrams and constraints
        updateAllDiagrams();
        updateLatitudeConstraints(solarDeclination);
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
        updateAllDiagrams();
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
        updateAllDiagrams();
        checkLocationInputs();
    });

    // Sync location longitude slider and input
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

    // Add the event listener for date changes
    document.getElementById('selected-date').addEventListener('input', function() {
        console.log('******* Date changed');
        const date = new Date(this.value);
        const declination = calculateSolarDeclination(date);
        console.log('******* Calculated declination:', declination);
        
        // Update latitude overhead input
        const latitudeOverheadInput = document.getElementById('latitude-overhead-input');
        const manualValue = latitudeOverheadInput.getAttribute('data-manual');
        console.log('******* Manual value:', manualValue);
        
        // Only update if not manually set
        if (!manualValue) {
            latitudeOverheadInput.value = declination.toFixed(1);
            console.log('******* Updated to calculated value:', latitudeOverheadInput.value);
        } else {
            console.log('******* Keeping manual value:', latitudeOverheadInput.value);
        }
        
        // Calculate and update solar elevation
        const latitude = parseFloat(document.getElementById('location-latitude-input').value);
        const solarDeclination = parseFloat(latitudeOverheadInput.value);
        const solarElevation = calculateSolarElevation(latitude, solarDeclination);
        
        // Update all diagrams
        updateAllDiagrams();
        createSolarAltitudeDiagram(latitude);
    });
});

function updateCalculations() {
    // Your existing calculation code...
    
    // Update the sun position in the 3D diagram
    const altitude = 90 - solarZenith; // Convert zenith to altitude
    updateSunPosition(altitude, solarAzimuth);
    
    // Draw the full day sun path
    drawSunPath(latitude, date);
}
