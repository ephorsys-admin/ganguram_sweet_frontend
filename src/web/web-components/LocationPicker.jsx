import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const LocationPicker = ({ coords, onLocationChange }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Dynamic Leaflet Loading from CDN
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => setLeafletLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !coords || !mapContainerRef.current) return;

    const L = window.L;

    // Fix marker icon path issues in default Leaflet CDNs
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const initLat = coords.lat;
    const initLon = coords.lon;

    // Create Map instance
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([initLat, initLon], 16);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Add draggable marker
      markerRef.current = L.marker([initLat, initLon], { draggable: true }).addTo(mapRef.current);

      // Bind drag and click events
      const handleMarkerMove = (e) => {
        const { lat, lng } = e.target.getLatLng();
        onLocationChange(lat, lng);
      };

      markerRef.current.on("dragend", handleMarkerMove);

      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        markerRef.current.setLatLng([lat, lng]);
        onLocationChange(lat, lng);
      });
    } else {
      // Update map position & marker if coords change externally
      mapRef.current.setView([initLat, initLon], 16);
      markerRef.current.setLatLng([initLat, initLon]);
    }
  }, [leafletLoaded, coords, onLocationChange]);

  return (
    <div className="w-full h-full relative min-h-[150px] bg-slate-50 flex items-center justify-center">
      {!leafletLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 z-10">
          <Loader2 className="animate-spin text-[#8A2E2E]" size={20} />
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full min-h-[150px] z-0 rounded-lg"></div>
    </div>
  );
};

export default LocationPicker;
