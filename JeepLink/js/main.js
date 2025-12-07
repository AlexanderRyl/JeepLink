/*
 * MAIN.JS
 * -------
 * Purpose: Entry point for all JavaScript logic.
 * Imports modular functions and initializes them when the DOM is ready.
 */

// Import Modules (Assuming we split them later, but for now putting logic here for the 'Original' revamp simplicity)
// If you want strict modules, we'd use 'import', but for compatibility with the original structure request,
// we will write the logic cleanly here wrapped in a DOMContentLoaded event.

document.addEventListener("DOMContentLoaded", () => {
  console.log("JeepLink System Initialized");

  /* --- 1. MOBILE MENU TOGGLE --- */
  // Purpose: Opens/Closes the nav menu on small screens
  const menuBtn = document.getElementById("mobile-menu-trigger");
  const navLinks = document.getElementById("nav-links");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      // Toggle the 'active' class which triggers the CSS transition
      navLinks.classList.toggle("active");

      // Optional: Change Icon (List <-> X) if using Phosphor
      const icon = menuBtn.querySelector("i");
      if (navLinks.classList.contains("active")) {
        icon.classList.replace("ph-list", "ph-x");
      } else {
        icon.classList.replace("ph-x", "ph-list");
      }
    });
  }

  /* --- 2. MAP INITIALIZATION (Offline Safe) --- */
  // Purpose: Loads the map if the container exists
  const mapContainer = document.getElementById("map");

  if (mapContainer && typeof L !== "undefined") {
    try {
      // Define Baguio Coordinates
      const center = [16.4023, 120.596];

      // Initialize Leaflet Map
      const map = L.map("map", {
        zoomControl: false, // Hide default buttons for custom look
        scrollWheelZoom: false, // Prevent accidental scrolling
      }).setView(center, 14);

      // Add Tiles (Offline Fallback Logic)
      // If offline, this might fail, so we should consider the ImageOverlay approach
      // But for the "Original Revamp", we keep the tile logic but add error handling.
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap, © CARTO",
          maxZoom: 19,
        }
      ).addTo(map);

      // Add Marker
      const markerIcon = L.divIcon({
        className: "custom-pin",
        html: '<div style="background:var(--primary); width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>',
      });

      L.marker(center, { icon: markerIcon })
        .addTo(map)
        .bindPopup("<b>JeepLink HQ</b><br>Baguio City")
        .openPopup();
    } catch (error) {
      console.error("Map Error:", error);
      // Fallback UI if map fails
      mapContainer.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#e2e8f0;color:#64748b;">Map Offline</div>';
    }
  }
});
