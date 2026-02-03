'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSIxMiIgZmlsbD0iIzI1NjNlYiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

const ambulanceIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGV4dCB4PSI1IiB5PSIzMCIgZm9udC1zaXplPSIzMCI+8J+agTwvdGV4dD48L3N2Zz4=',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

interface LiveMapProps {
    center: [number, number];
    userLocation?: { lat: number; lng: number };
    ambulances?: Array<{
        _id: string;
        registrationNumber: string;
        location: { lat: number; lng: number };
        status: string;
        driver?: { name: string };
    }>;
    showRoute?: boolean;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);

    return null;
}

export default function LiveMap({ center, userLocation, ambulances = [], showRoute = false }: LiveMapProps) {
    const nearestAmbulance = ambulances[0];
    const routeCoordinates = showRoute && userLocation && nearestAmbulance
        ? [
            [nearestAmbulance.location.lat, nearestAmbulance.location.lng] as [number, number],
            [userLocation.lat, userLocation.lng] as [number, number],
        ]
        : [];

    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
        >
            <MapUpdater center={center} />

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User location marker */}
            {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>
                        <strong>Your Location</strong>
                    </Popup>
                </Marker>
            )}

            {/* Ambulance markers */}
            {ambulances.map((ambulance) => (
                <Marker
                    key={ambulance._id}
                    position={[ambulance.location.lat, ambulance.location.lng]}
                    icon={ambulanceIcon}
                >
                    <Popup>
                        <div>
                            <strong>{ambulance.registrationNumber}</strong>
                            {ambulance.driver && <p>Driver: {ambulance.driver.name}</p>}
                            <p className={`badge ${ambulance.status === 'available' ? 'badge-success' : ambulance.status === 'offline' ? 'badge-danger' : 'badge-primary'}`}>
                                {ambulance.status}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Route line */}
            {routeCoordinates.length > 0 && (
                <Polyline
                    positions={routeCoordinates}
                    color="#2563eb"
                    weight={4}
                    opacity={0.7}
                    dashArray="10, 10"
                />
            )}
        </MapContainer>
    );
}
