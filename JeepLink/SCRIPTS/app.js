/*
 * APP.JS
 * ----------------------------
 * Handles the Map logic.
 * Cleaned up: Removed mock Jeepney movements as requested.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Map centered on Baguio City
    // We use a try-catch block to prevent errors if offline
    try {
        const baguioCoords = [16.4023, 120.5960];
        
        const map = L.map('map', { 
            zoomControl: false,
            scrollWheelZoom: false // Keep page scrolling smooth
        }).setView(baguioCoords, 14);

        // Add Zoom Control to bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Load Clean Map Tiles (CartoDB Voyager - very professional look)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO'
        }).addTo(map);

        // Add a single static marker for the "Main Station" (University of Cordilleras)
        // This gives context without the messy moving icons
        const mainStation = L.marker([16.4050, 120.5980]).addTo(map);
        mainStation.bindPopup("<b>JeepLink HQ</b><br>University of the Cordilleras").openPopup();

    } catch (error) {
        console.log("Map failed to load (likely offline):", error);
        // Fallback UI could go here
    }

});