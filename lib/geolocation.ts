// Calculate distance between two coordinates using Haversine formula (in km)
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

// Calculate ETA based on distance (assuming 40 km/h average speed in city)
export function calculateETA(distanceKm: number): number {
    const averageSpeed = 40; // km/h
    const hours = distanceKm / averageSpeed;
    const minutes = Math.ceil(hours * 60);
    return minutes;
}

// Format ETA for display
export function formatETA(minutes: number): string {
    if (minutes < 1) return 'Less than a minute';
    if (minutes === 1) return '1 minute';
    if (minutes < 60) return `${minutes} minutes`;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`;
}

// Get user's current position
export function getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });
    });
}

// Watch user's position
export function watchPosition(
    onSuccess: (position: GeolocationPosition) => void,
    onError?: (error: GeolocationPositionError) => void
): number {
    if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
    }

    return navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

// Clear position watch
export function clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
}

// Simple reverse geocoding using OpenStreetMap Nominatim
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await response.json();
        return data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } catch (error) {
        return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
}

// Format distance for display
export function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

// Find nearest item from a list based on coordinates
export function findNearest<T extends { location: { lat: number; lng: number } }>(
    userLocation: Coordinates,
    items: T[]
): T | null {
    if (items.length === 0) return null;

    let nearest = items[0];
    let minDistance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        nearest.location.lat,
        nearest.location.lng
    );

    for (let i = 1; i < items.length; i++) {
        const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            items[i].location.lat,
            items[i].location.lng
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearest = items[i];
        }
    }

    return nearest;
}
