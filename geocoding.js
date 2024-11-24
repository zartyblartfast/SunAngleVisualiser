// Declare platform at file scope
let platform;

// Make the function globally available
window.initializeGeocoding = function() {
    // Get references to the input elements
    const locationLatitudeInput = document.getElementById('location-latitude-input');
    const locationLongitudeInput = document.getElementById('location-longitude-input');
    
    // Initialize platform at the global scope
    platform = new H.service.Platform({
        apikey: 'SMjCgQRTXoQnrFsogU8PFzbnusF6T4sqYTqqWN1iPhw'
    });

    // Initialize map immediately (removed setTimeout)
    const defaultLayers = platform.createDefaultLayers({
        pixelRatio: window.devicePixelRatio || 1,
        willReadFrequently: true
    });
    const map = new H.Map(
        document.getElementById('map'),
        defaultLayers.vector.normal.map,
        {
            center: { 
                lat: locationLatitudeInput.value || 0, 
                lng: locationLongitudeInput.value || 0 
            },
            zoom: 4,
            pixelRatio: window.devicePixelRatio || 1,
            willReadFrequently: true
        }
    );

    // Make map interactive
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Force a resize after initialization
    window.addEventListener('resize', () => map.getViewPort().resize());
    map.getViewPort().resize();

    // Add search functionality
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('location-search');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const searchText = searchInput.value;
            if (!searchText) {
                alert('Please enter a location to search');
                return;
            }

            searchLocation(searchText)
                .then((location) => {
                    if (location) {
                        console.log('Location found:', location);
                        
                        // Update lat/long inputs and trigger sliders
                        if (locationLatitudeInput && locationLongitudeInput) {
                            // Update number inputs
                            locationLatitudeInput.value = location.position.lat;
                            locationLongitudeInput.value = location.position.lng;
                            
                            // Update sliders
                            document.getElementById('location-latitude-slider').value = location.position.lat;
                            document.getElementById('location-longitude-slider').value = location.position.lng;
                            
                            // Trigger events
                            locationLatitudeInput.dispatchEvent(new Event('input'));
                            locationLongitudeInput.dispatchEvent(new Event('input'));
                        }
                        
                        // Update map view
                        map.setCenter({
                            lat: location.position.lat,
                            lng: location.position.lng
                        });
                        map.setZoom(12);
                        
                        // Clear existing markers
                        map.removeObjects(map.getObjects());
                        
                        // Add new marker
                        const marker = new H.map.Marker({
                            lat: location.position.lat,
                            lng: location.position.lng
                        });
                        map.addObject(marker);
                        
                    } else {
                        alert('No results found for this location');
                    }
                })
                .catch((error) => {
                    console.error('Geocoding error:', error);
                    alert('Location not found. Please try again.');
                });
        });

        // Allow search on Enter key
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchButton.click();
            }
        });
    }
};

function searchLocation(query) {
    if (!platform) {
        console.error('Platform not initialized');
        return Promise.reject(new Error('Platform not initialized'));
    }

    const geocodingParams = {
        q: query,
        limit: 1,
        resultType: 'locality,place',
        politicalView: 'GBR'
    };

    const geocoder = platform.getSearchService();

    return new Promise((resolve, reject) => {
        geocoder.geocode(
            geocodingParams,
            (result) => {
                if (result.items && result.items.length > 0) {
                    const location = result.items[0];
                    console.log('Location found:', location);
                    
                    // If it's a country or large area, try to find its capital or main city
                    if (location.resultType === 'administrativeArea') {
                        // Modify search to look for the capital city
                        const cityQuery = `capital of ${query}`;
                        searchLocation(cityQuery)
                            .then(resolve)
                            .catch(() => resolve(location)); // Fallback to original result
                    } else {
                        resolve(location);
                    }
                } else {
                    reject(new Error('Location not found'));
                }
            },
            (error) => {
                reject(error);
            }
        );
    });
}