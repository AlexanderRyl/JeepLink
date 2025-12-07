export function initMap() {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  // 1. Define the Map Bounds (The "Corners" of your image)
  // We map the image to these coordinates in Baguio.
  const bounds = [
    [16.39, 120.58],
    [16.42, 120.61],
  ];
  const center = [16.405, 120.595];

  // 2. Initialize Leaflet
  const map = L.map("map", {
    minZoom: 13,
    maxZoom: 16,
    zoomControl: false, // We will add a custom one later if needed
    attributionControl: false,
  }).setView(center, 14);

  // 3. The Offline Magic: Image Overlay
  // Instead of online tiles, we load your local PNG.
  L.imageOverlay("assets/images/ui/map.png", bounds).addTo(map);

  // 4. Custom Marker Function (Using Phosphor Icons!)
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
      className: "custom-pin", // We'll verify this class isn't conflicting
      html: iconHtml,
      iconSize: [36, 36],
      iconAnchor: [18, 36], // Bottom tip of the pin
      popupAnchor: [0, -40],
    });

    L.marker([lat, lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b style="font-family: 'Inter'">${popupText}</b>`);
  }

  // 5. Add Static Markers (HQ and Key Spots)
  createMarker(16.405, 120.595, "#3b82f6", "ph-house-line", "JeepLink HQ");
  createMarker(16.41, 120.598, "#ef4444", "ph-bus", "Traffic Hotspot");
  createMarker(16.4, 120.59, "#22c55e", "ph-jeep", "Unit 402 (Active)");
}
