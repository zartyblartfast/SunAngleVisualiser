// Function to update latitude constraints based on solar declination
export function updateLatitudeConstraints(solarDeclination) {
    const latitudeInput = document.getElementById('location-latitude-input');
    const latitudeSlider = document.getElementById('location-latitude-slider');
    
    // Calculate the valid latitude range
    // When solar declination is positive, the maximum latitude increases and minimum latitude decreases
    const negativeLimit = solarDeclination - 90;  // 90° south of the declination
    const positiveLimit = solarDeclination + 90;  // 90° north of the declination
    
    // Update input limits
    latitudeInput.setAttribute('min', negativeLimit);
    latitudeInput.setAttribute('max', positiveLimit);
    latitudeSlider.setAttribute('min', negativeLimit);
    latitudeSlider.setAttribute('max', positiveLimit);
    
    // Ensure current value is within new limits
    let currentLatitude = parseFloat(latitudeInput.value);
    if (currentLatitude > positiveLimit) {
        currentLatitude = positiveLimit;
        latitudeInput.value = positiveLimit;
        latitudeSlider.value = positiveLimit;
    } else if (currentLatitude < negativeLimit) {
        currentLatitude = negativeLimit;
        latitudeInput.value = negativeLimit;
        latitudeSlider.value = negativeLimit;
    }
}

// Add event listener for solar declination changes
document.getElementById('latitude-overhead-input').addEventListener('input', function() {
    const solarDeclination = parseFloat(this.value);
    updateLatitudeConstraints(solarDeclination);
});
