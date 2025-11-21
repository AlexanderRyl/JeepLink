/*
 * APP.JS
 * This file contains all the JavaScript logic for the JeepLink website.
 * It's made to be beginner-friendly and easy to understand.
 */

// We wrap all our code in a 'DOMContentLoaded' event listener.
// This makes sure the JavaScript only runs *after* the HTML page is fully loaded.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Global Variables ---
    // We store references to our map and key elements here
    let map;
    let clusterGroup;
    const vehicles = {}; // An object to store our jeepneys, e.g., vehicles[101] = { ... }
    const MOCK_UPDATE_INTERVAL = 2000; // Update jeep positions every 2 seconds (2000ms)

    // Store references to HTML elements we need to change
    const headerEl = document.getElementById('main-header');
    const vehicleCountEl = document.getElementById('vehicle-count');
    const pillFilters = document.querySelectorAll('.pill');
    const chartCanvas = document.getElementById('mini-chart');
    const mapFallbackEl = document.getElementById('map-fallback'); // NEW: Reference to the fallback message


    // --- 2. Initialization Functions ---
    // These functions run once when the page loads to set everything up.

    /**
     * Initializes the Leaflet map, sets the view to Baguio,
     * and adds the map tiles and marker cluster group.
     */
    function initMap() {
        // Set the coordinates for the center of Baguio
        const baguioCenter = [16.4023, 120.5960];
        const initialZoom = 13;

        // Initialize the map and tell it to display in the "map" div
        map = L.map('map', { zoomControl: false }).setView(baguioCenter, initialZoom);
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Add the "tile layer" - this is the actual map image from OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Initialize the marker cluster group
        clusterGroup = L.markerClusterGroup({
            maxClusterRadius: 40,
            disableClusteringAtZoom: 16
        });
        map.addLayer(clusterGroup);

        // !! NEW !!
        // If all the map code above ran successfully, hide the fallback message.
        if (mapFallbackEl) {
            mapFallbackEl.style.display = 'none';
        }
    }

    /**
     * Initializes the Chart.js mini-chart with mock data.
     */
    function initChart() {
        if (!chartCanvas) return; // Don't run if the canvas isn't on the page

        const ctx = chartCanvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 8}, (_,i) => `${i+9}:00`), // 9:00 to 16:00
                datasets: [{
                    label: 'Congestion',
                    // Generate some random data
                    data: Array.from({length: 8}, () => 20 + Math.round(Math.random() * 80)),
                    fill: true,
                    tension: 0.3,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)', /* Blue chart fill */
                    borderColor: '#3B82F6' /* Blue chart line */
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, display: false },
                    x: { display: false }
                }
            }
        });
    }

    /**
     * Adds a scroll listener to the window to change the header style.
     */
    function initHeaderScroll() {
        // This function is no longer needed since the header is always solid.
        // We can leave it empty or remove it. For simplicity, I'll leave it
        // in case you want to add a different scroll effect later.
        
        /*
        if (!headerEl) return;

        window.addEventListener('scroll', () => {
            // "window.scrollY" is how far down you've scrolled
            if (window.scrollY > 50) {
                // If scrolled more than 50px, add the "header-scrolled" class
                headerEl.classList.add('header-scrolled');
            } else {
                // Otherwise, remove it
                headerEl.classList.remove('header-scrolled');
            }
        });
        */
    }

    /**
     * Adds click listeners to the filter pills.
     */
    function initFilters() {
        pillFilters.forEach(pill => {
            pill.addEventListener('click', () => {
                // Remove 'active' class from all pills
                pillFilters.forEach(p => p.classList.remove('active'));
                // Add 'active' class to the one that was clicked
                pill.classList.add('active');

                // Get the filter value (e.g., "all", "ABC-XYZ")
                const filterValue = pill.getAttribute('data-filter');
                filterVehicles(filterValue);
            });
        });
    }


    // --- 3. Mock Data & Simulation ---
    // This section replaces the need for a real WebSocket server.

    /**
     * Creates the initial set of mock jeepneys.
     */
    function startMockData() {
        // This is our "database" of fake jeeps.
        const mockJeeps = [
            { id: 101, route: 'ABC-XYZ', lat: 16.411, lng: 120.598 },
            { id: 102, route: 'DEF-UVW', lat: 16.405, lng: 120.591 },
            { id: 103, route: 'GHI-RST', lat: 16.398, lng: 120.605 },
            { id: 104, route: 'ABC-XYZ', lat: 16.415, lng: 120.602 },
            { id: 105, route: 'GHI-RST', lat: 16.402, lng: 120.588 },
        ];

        // Define our custom 'J' icon
        const jeepIcon = L.divIcon({
            className: 'jeep-icon',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });

        // Create a marker for each jeep
        mockJeeps.forEach(jeep => {
            const marker = L.marker([jeep.lat, jeep.lng], { icon: jeepIcon })
                .bindPopup(`<b>Jeep ID:</b> ${jeep.id}<br><b>Route:</b> ${jeep.route}`);
            
            // Add the jeep to our global 'vehicles' object
            vehicles[jeep.id] = {
                ...jeep, // spread operator copies all properties from jeep
                marker: marker
            };

            // Add the marker to the map
            clusterGroup.addLayer(marker);
        });

        // Update the "Vehicles Online" count
        updateVehicleCount();

        // Start the simulation loop
        setInterval(simulateJeepMovement, MOCK_UPDATE_INTERVAL);
    }

    /**
     * This function runs every 2 seconds to move the jeeps randomly.
     */
    function simulateJeepMovement() {
        // Loop over every jeep in our 'vehicles' object
        for (const id in vehicles) {
            const jeep = vehicles[id];
            
            // Get the marker's current position
            const currentPos = jeep.marker.getLatLng();
            
            // Calculate a tiny random change
            const latChange = (Math.random() - 0.5) * 0.0005; // -0.00025 to +0.00025
            const lngChange = (Math.random() - 0.5) * 0.0005;

            // Set the marker's new position
            jeep.marker.setLatLng([currentPos.lat + latChange, currentPos.lng + lngChange]);
        }
    }

    // --- 4. Helper Functions ---

    /**
     * Updates the "Vehicles Online" number in the stat card.
     */
    function updateVehicleCount() {
        const count = Object.keys(vehicles).length;
        if (vehicleCountEl) {
            vehicleCountEl.textContent = count;
        }
    }

    /**
     * Shows/hides markers based on the selected filter.
     * @param {string} filterValue - The route to show (e.g., "all" or "ABC-XYZ")
     */
    function filterVehicles(filterValue) {
        for (const id in vehicles) {
            const jeep = vehicles[id];
            
            // Check if the filter is "all" OR if the jeep's route matches the filter
            if (filterValue === 'all' || jeep.route === filterValue) {
                // Add the layer (it's safe to add even if it's there)
                clusterGroup.addLayer(jeep.marker);
            } else {
                // Remove the layer
                clusterGroup.removeLayer(jeep.marker);
            }
        }
    }


    // --- 5. Run Initialization ---
    // This is where we call all our setup functions to start the app.
    
    // We must wrap map/chart functions in a try...catch block
    // This prevents the *entire site* from breaking if the external scripts fail
    try {
        initMap();
        initChart();
        startMockData(); // This creates the jeeps and starts the "live" simulation
    } catch (error) {
        console.error("Could not initialize map or chart. Check internet connection and script URLs.", error);
        // The #map-fallback message will remain visible, which is what we want.
    }
    
    // These functions don't depend on external scripts, so they are safe.
    initHeaderScroll();
    initFilters();

});