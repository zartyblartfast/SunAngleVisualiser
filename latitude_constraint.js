// Add event listener for solar declination changes
document.getElementById('latitude-overhead-input').addEventListener('input', function() {
    const solarDeclination = Math.abs(parseFloat(this.value));
    const latitudeInput = document.getElementById('location-latitude-input');
    const latitudeSlider = document.getElementById('location-latitude-slider');
    const allowedLatitudeRange = 90 - solarDeclination;
    
    // Update input limits
    latitudeInput.setAttribute('min', -allowedLatitudeRange);
    latitudeInput.setAttribute('max', allowedLatitudeRange);
    latitudeSlider.setAttribute('min', -allowedLatitudeRange);
    latitudeSlider.setAttribute('max', allowedLatitudeRange);
    
    // Ensure current value is within new limits
    let currentLatitude = parseFloat(latitudeInput.value);
    if (currentLatitude > allowedLatitudeRange) {
        currentLatitude = allowedLatitudeRange;
        latitudeInput.value = allowedLatitudeRange;
        latitudeSlider.value = allowedLatitudeRange;
    } else if (currentLatitude < -allowedLatitudeRange) {
        currentLatitude = -allowedLatitudeRange;
        latitudeInput.value = -allowedLatitudeRange;
        latitudeSlider.value = -allowedLatitudeRange;
    }

    // Update diagrams with new values
    updateAllDiagrams(solarDeclination);
});
