import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapPicker = ({ lat, lng, onSelectCoords }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix leaflet marker images in Vite
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Initialize map
    const initialLat = lat || 12.9716;
    const initialLng = lng || 79.1588;

    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13);
    mapRef.current = map;

    // Tile Layer: OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Marker setup
    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    // Bind marker drag events
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onSelectCoords(position.lat.toFixed(6), position.lng.toFixed(6));
    });

    // Bind map click events
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onSelectCoords(lat.toFixed(6), lng.toFixed(6));
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update marker position if props change externally
  useEffect(() => {
    if (mapRef.current && markerRef.current && lat && lng) {
      const currentLatLng = markerRef.current.getLatLng();
      if (currentLatLng.lat !== parseFloat(lat) || currentLatLng.lng !== parseFloat(lng)) {
        markerRef.current.setLatLng([parseFloat(lat), parseFloat(lng)]);
        mapRef.current.panTo([parseFloat(lat), parseFloat(lng)]);
      }
    }
  }, [lat, lng]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-cyber-cyan/30">
      <div className="absolute top-3 left-3 z-10 glass-panel px-3 py-1.5 rounded-lg border border-cyber-cyan/30 text-[10px] font-mono tracking-widest text-cyber-cyan font-bold uppercase shadow-lg">
        GIS GPS LOCATOR
      </div>
      <div ref={mapContainerRef} className="w-full h-[250px] z-0" />
    </div>
  );
};

export default MapPicker;
