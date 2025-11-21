/*
 * APP.JS
 * ----------------------------
 * Handles Map logic and Mobile Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. MOBILE MENU LOGIC --- */
    const menuBtn = document.getElementById('mobile-menu-trigger');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    /* --- 2. MAP LOGIC (OFFLINE SAFE) --- */
    
    // Check if Leaflet (L) is loaded. 
    // If user is offline, the CDN script in HTML fails, so 'L' will be undefined.
    if (typeof L === 'undefined') {
        console.warn("JeepLink: Offline mode detected. Leaflet failed to load.");
        console.log("Showing static map image from CSS fallback.");
        
        // Optional: You could change the status indicator text if offline
        const statusText = document.querySelector('.status-indicator');
        if(statusText) {
            statusText.innerHTML = '<span class="dot" style="background:orange"></span> Offline Mode';
        }
        return; // Stop execution here so we don't get errors
    }

    // If we are here, Leaflet is loaded (Online Mode)
    try {
        const baguioCoords = [16.4023, 120.5960];
        
        const map = L.map('map', { 
            zoomControl: false,
            scrollWheelZoom: false 
        }).setView(baguioCoords, 14);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Load Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO'
        }).addTo(map);

        const mainStation = L.marker([16.4050, 120.5980]).addTo(map);
        mainStation.bindPopup("<b>JeepLink HQ</b><br>University of the Cordilleras").openPopup();

    } catch (error) {
        console.error("Map initialized but encountered an error:", error);
    }

});