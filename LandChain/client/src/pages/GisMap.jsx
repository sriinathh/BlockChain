import React, { useEffect, useRef, useState } from 'react';
import { getStoredLands } from '../services/mockData';
import GlassCard from '../components/GlassCard';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, Layers, RefreshCw, ZoomIn, Info, ShieldCheck } from 'lucide-react';

const GisMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [satelliteMode, setSatelliteMode] = useState(false);
  const [tileLayerRef, setTileLayerRef] = useState(null);

  useEffect(() => {
    const data = getStoredLands();
    setLands(data);

    if (!mapContainerRef.current) return;

    // Fix leaflet default markers
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Center map around Tamil Nadu coordinates as base center
    const map = L.map(mapContainerRef.current, {
      zoomControl: true
    }).setView([12.9716, 79.1588], 6);
    mapRef.current = map;

    // Initialize Tile Layer
    const layerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileLayer = L.tileLayer(layerUrl, {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    setTileLayerRef(tileLayer);

    // Group polygon bounds to auto-fit viewport
    const bounds = [];

    // Add boundaries for each property
    data.forEach((land) => {
      if (land.boundary && land.boundary.length > 0) {
        // Build leaflet polygon
        const color = land.status === 'Verified' ? '#06b6d4' : '#f59e0b';
        const polygon = L.polygon(land.boundary, {
          color: color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 2
        }).addTo(map);

        bounds.push(land.boundary);

        // Bind interactive popup card
        polygon.bindPopup(`
          <div style="font-family: 'Outfit', sans-serif; padding: 2px;">
            <strong style="color: #06b6d4; font-size: 13px;">Plot Survey ${land.surveyNumber}</strong>
            <div style="font-size: 11px; margin-top: 5px; color: #cbd5e1;">
              <strong>Owner:</strong> ${land.ownerName}<br/>
              <strong>Area:</strong> ${land.area}<br/>
              <strong>Status:</strong> <span style="font-weight: bold; color: ${land.status === 'Verified' ? '#10b981' : '#f59e0b'}">${land.status}</span>
            </div>
            <div style="margin-top: 8px; font-size: 10px; font-family: monospace; color: #64748b;">
              ID: ${land.id}
            </div>
          </div>
        `);

        // Click event on boundary
        polygon.on('click', () => {
          setSelectedLand(land);
        });
      }
    });

    // Zoom map to cover all polygon coordinates
    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds.flat()));
    }

    return () => {
      map.remove();
    };
  }, []);

  const toggleSatellite = () => {
    if (!mapRef.current || !tileLayerRef) return;
    
    // Toggle Satellite Tile Layer
    mapRef.current.removeLayer(tileLayerRef);
    
    let newUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    if (!satelliteMode) {
      // ESRI satellite imagery tiles
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }

    const newLayer = L.tileLayer(newUrl, {
      attribution: satelliteMode ? '© OpenStreetMap contributors' : 'Tiles © Esri'
    }).addTo(mapRef.current);
    
    setTileLayerRef(newLayer);
    setSatelliteMode(!satelliteMode);
  };

  const handleFocusPlot = (land) => {
    if (mapRef.current && land.lat && land.lng) {
      mapRef.current.setView([land.lat, land.lng], 15);
      setSelectedLand(land);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white m-0">
            GIS MAP EXPLORER
          </h1>
          <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">
            SPATIAL LAND SURVEY PARCEL LAYER SYSTEM
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Map Container */}
        <div className="lg:col-span-8 relative rounded-2xl border border-white/5 overflow-hidden min-h-[480px] bg-cyber-dark">
          
          {/* Layer toggle control */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={toggleSatellite}
              className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-lg flex items-center gap-1.5 ${
                satelliteMode 
                  ? 'bg-cyber-cyan border-cyber-cyan text-cyber-dark' 
                  : 'glass-panel border-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <Layers size={14} /> {satelliteMode ? 'SAT MAP ACTIVE' : 'STREET TILES'}
            </button>
          </div>

          <div ref={mapContainerRef} className="w-full h-full min-h-[480px] z-0" />
        </div>

        {/* Legend panel & Quick links */}
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          
          {/* Quick List Selector */}
          <GlassCard className="flex-grow flex flex-col gap-4 border-cyber-cyan/10">
            <span className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">
              Registered Plots Layer Directory
            </span>
            <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[220px] pr-1 font-mono text-xs">
              {lands.map((land) => (
                <div
                  key={land.id}
                  onClick={() => handleFocusPlot(land)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedLand?.id === land.id 
                      ? 'bg-cyber-cyan/10 border-cyber-cyan/40 text-cyber-cyan'
                      : 'bg-cyber-blue-light/20 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <div>
                    <span className="font-bold text-white uppercase text-[11px]">Survey {land.surveyNumber}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{land.district}, {land.state}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    land.status === 'Verified' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                  }`}>
                    {land.status}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Selection details */}
          <GlassCard className="border-cyber-indigo/10 bg-cyber-blue-light/10">
            {selectedLand ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyber-cyan font-mono font-bold uppercase tracking-wider">
                    PARCEL ID: {selectedLand.id}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">{selectedLand.area}</span>
                </div>
                <h3 className="text-lg font-bold font-display uppercase tracking-wide text-white">
                  Survey {selectedLand.surveyNumber}
                </h3>
                <div className="font-mono text-xs text-gray-400 flex flex-col gap-1.5 border-t border-white/5 pt-3">
                  <div className="flex justify-between">
                    <span>TITLE DEED OWNER:</span>
                    <span className="text-white font-semibold">{selectedLand.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPS COORDINATE POINT:</span>
                    <span className="text-white">{selectedLand.gps}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span>MINT RECORD HASH:</span>
                    <span className="text-[10px] text-gray-500 break-all select-all">{selectedLand.txHash}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-500 flex flex-col items-center gap-2">
                <Info size={18} />
                <span>Select a land parcel boundary polygon on the GIS map to view its ownership certificate status.</span>
              </div>
            )}
          </GlassCard>

        </div>

      </div>

    </div>
  );
};

export default GisMap;
