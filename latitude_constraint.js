// Function to update latitude constraints based on solar declination
export function updateLatitudeConstraints(solarDeclination) {
    const latitudeInput = document.getElementById('location-latitude-input');
    const latitudeSlider = document.getElementById('location-latitude-slider');
    
    // Calculate the valid latitude range
    // When solar declination is positive, the maximum latitude increases and minimum latitude decreases
    const negativeLimit = solarDeclination - 90;  // 90° south of the declination
    const positiveLimit = solarDeclination + 90;  // 90° north of the declination
    
    // Only update the min/max attributes
    latitudeInput.setAttribute('min', negativeLimit);
    latitudeInput.setAttribute('max', positiveLimit);
    latitudeSlider.setAttribute('min', negativeLimit);
    latitudeSlider.setAttribute('max', positiveLimit);
}

// Add event listener for solar declination changes
document.getElementById('latitude-overhead-input').addEventListener('input', function() {
    const solarDeclination = parseFloat(this.value);
    updateLatitudeConstraints(solarDeclination);
});
