'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const customerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const proIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface TrackingMapProps {
  customerLocation: { lat: number, lng: number };
  proLocation: { lat: number, lng: number };
}

// Helper component to auto-fit bounds
function MapBounds({ customerLocation, proLocation }: TrackingMapProps) {
  const map = useMap();
  
  useEffect(() => {
    const bounds = L.latLngBounds([customerLocation, proLocation]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [customerLocation, proLocation, map]);

  return null;
}

export default function TrackingMap({ customerLocation, proLocation }: TrackingMapProps) {
  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border-2 border-slate-200 z-0 relative">
      <MapContainer 
        center={customerLocation} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={customerLocation} icon={customerIcon}>
          <Popup>Service Location</Popup>
        </Marker>

        <Marker position={proLocation} icon={proIcon}>
          <Popup>Professional</Popup>
        </Marker>

        <MapBounds customerLocation={customerLocation} proLocation={proLocation} />
      </MapContainer>
    </div>
  );
}
