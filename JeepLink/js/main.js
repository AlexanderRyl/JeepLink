/*
 * MAIN.JS - UNIFIED
 * -----------------
 * Purpose: Handles Mobile Navigation and the Offline Map.
 * Note: Map logic is merged here to ensure it works locally without CORS issues.
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("JeepLink System Online");

  /* --- 1. MOBILE MENU TOGGLE --- */
  const menuBtn = document.getElementById("mobile-menu-trigger");
  const navLinks = document.getElementById("nav-links");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      // Toggle CSS class
      navLinks.classList.toggle("active");

      // Toggle Icon
      const icon = menuBtn.querySelector("i");
      if (navLinks.classList.contains("active")) {
        icon.classList.replace("ph-list", "ph-x");
      } else {
        icon.classList.replace("ph-x", "ph-list");
      }
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const icon = menuBtn.querySelector("i");
        icon.classList.replace("ph-x", "ph-list");
      });
    });
  }

  /* --- 2. MAP INITIALIZATION (OFFLINE MODE) --- */
  initOfflineMap();
});

function initOfflineMap() {
  const mapContainer = document.getElementById("map");
  if (!mapContainer || typeof L === "undefined") return;

  // 1. Define the Map Bounds (The "Corners" of your image)
  // These map the visual image to Leaflet's coordinate system
  const bounds = [
    [16.39, 120.58],
    [16.42, 120.61],
  ];
  const center = [16.405, 120.595];

  // 2. Initialize Leaflet
  const map = L.map("map", {
    minZoom: 13,
    maxZoom: 16,
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false, // Prevent accidental scrolling
  }).setView(center, 14);

  // 3. The Offline Magic: Image Overlay
  // Loads your local map.png instead of connecting to an internet server
  L.imageOverlay("assets/images/ui/map.png", bounds).addTo(map);

  // 4. Custom Marker Logic
  function createMarker(lat, lng, color, iconName, popupText) {
    const iconHtml = `
              <div style="
                  background: white; 
                  border-radius: 50%; 
                  width: 36px; height: 36px; 
                  display: flex; align-items: center; justify-content: center;
                  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                  border: 2px solid ${color};
                  color: ${color};
              ">
                  <i class="ph-fill ${iconName}" style="font-size: 20px;"></i>
              </div>
          `;

    const customIcon = L.divIcon({
      className: "custom-pin",
      html: iconHtml,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -40],
    });

    L.marker([lat, lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b style="font-family: 'Inter'">${popupText}</b>`);
  }

  // 5. Add Static Markers
  createMarker(16.405, 120.595, "#3b82f6", "ph-house-line", "JeepLink HQ");
  createMarker(16.41, 120.598, "#ef4444", "ph-bus", "Traffic Hotspot");
  createMarker(16.4, 120.59, "#22c55e", "ph-jeep", "Unit 402 (Active)");
}
