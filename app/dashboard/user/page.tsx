'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSocket } from '@/hooks/useSocket';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance, calculateETA, formatDistance, formatETA } from '@/lib/geolocation';

// Dynamic import for Leaflet map (client-side only)
const LiveMap = dynamic(() => import('@/components/Map/LiveMap'), { ssr: false });

interface Ambulance {
    _id: string;
    registrationNumber: string;
    location: { lat: number; lng: number };
    status: string;
    driver: { name: string; phone: string };
    distance?: number;
}

interface EmergencyRequest {
    _id: string;
    status: string;
    ambulance?: {
        _id: string;
        registrationNumber: string;
        driver: { name: string; phone: string };
        phoneNumber: string;
    };
    pickupLocation: { lat: number; lng: number };
    createdAt: string;
}

export default function UserDashboard() {
    const router = useRouter();
    const { latitude, longitude, error: geoError } = useGeolocation({ watch: true });
    const { isConnected, emit, on, off, authenticate } = useSocket();

    const [user, setUser] = useState<any>(null);
    const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
    const [hospitals, setHospitals] = useState<Array<{ _id: string; name: string; district: string; phone: string; emergencyServices: boolean; bedAvailability: number; distance?: number }>>([]);
    const [currentRequest, setCurrentRequest] = useState<EmergencyRequest | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/auth/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Authenticate with socket
        if (isConnected) {
            authenticate(parsedUser.id, parsedUser.role);
        }

        // Fetch active emergency request
        fetchActiveRequest(parsedUser.id);
    }, [isConnected]);

    useEffect(() => {
        if (latitude && longitude) {
            fetchNearbyAmbulances();
            fetch(`/api/hospitals?lat=${latitude}&lng=${longitude}&radius=30`)
                .then((res) => res.json())
                .then((data) => setHospitals(data.hospitals || []))
                .catch(() => {});
        }
    }, [latitude, longitude]);

    useEffect(() => {
        // Listen for emergency status updates
        on('emergency:accepted', handleEmergencyAccepted);
        on('emergency:status-update', handleStatusUpdate);
        on('ambulances:update', handleAmbulanceUpdate);

        return () => {
            off('emergency:accepted');
            off('emergency:status-update');
            off('ambulances:update');
        };
    }, []);

    const fetchNearbyAmbulances = async () => {
        try {
            const response = await fetch(`/api/ambulances?lat=${latitude}&lng=${longitude}&radius=10`);
            const data = await response.json();
            setAmbulances(data.ambulances || []);
        } catch (error) {
            console.error('Error fetching ambulances:', error);
        }
    };

    const fetchActiveRequest = async (patientId: string) => {
        try {
            const response = await fetch(`/api/emergency?patientId=${patientId}&active=true`);
            const data = await response.json();
            if (data.requests && data.requests.length > 0) {
                setCurrentRequest(data.requests[0]);
            }
        } catch (error) {
            console.error('Error fetching active request:', error);
        }
    };

    const handleEmergencyRequest = async () => {
        if (!latitude || !longitude) {
            alert('Please enable location services');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/emergency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: user.id,
                    pickupLocation: { lat: latitude, lng: longitude },
                    priority: 'critical',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setCurrentRequest(data.request);

            // Notify via socket
            emit('emergency:created', {
                requestId: data.request._id,
                ambulanceId: data.ambulance?._id,
                pickupLocation: { lat: latitude, lng: longitude },
                patient: user,
            });

            alert('Emergency request sent! Ambulance is on the way.');
        } catch (error: any) {
            alert(error.message || 'Failed to send emergency request');
        } finally {
            setLoading(false);
        }
    };

    const handleEmergencyAccepted = (data: any) => {
        if (data.requestId === currentRequest?._id) {
            fetchActiveRequest(user.id);
        }
    };

    const handleStatusUpdate = (data: any) => {
        if (data.requestId === currentRequest?._id) {
            setCurrentRequest(prev => prev ? { ...prev, status: data.status } : null);
        }
    };

    const handleAmbulanceUpdate = (data: any) => {
        setAmbulances(prev =>
            prev.map(amb =>
                amb._id === data.ambulanceId
                    ? { ...amb, location: data.location, status: data.status }
                    : amb
            )
        );
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'warning',
            accepted: 'primary',
            on_way: 'primary',
            arrived: 'success',
            picked: 'success',
            completed: 'success',
        };
        return colors[status] || 'primary';
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            pending: 'Waiting for response...',
            accepted: 'Driver accepted!',
            on_way: 'Ambulance on the way',
            arrived: 'Ambulance arrived',
            picked: 'Patient picked up',
            completed: 'Trip completed',
        };
        return texts[status] || status;
    };

    if (!user) return null;

    const nearestAmbulance = ambulances[0];
    const eta = nearestAmbulance && latitude && longitude
        ? calculateETA(calculateDistance(latitude, longitude, nearestAmbulance.location.lat, nearestAmbulance.location.lng))
        : null;

    return (
        <div className="min-h-screen bg-neutral-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary-blue">🚑 MediTrack</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-neutral-700">Welcome, <strong>{user.name}</strong></span>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                router.push('/');
                            }}
                            className="btn btn-outline"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Emergency Contact & Patient Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Emergency Contact Card */}
                    <div className="emergency-contact">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="medical-icon">
                                <span>🚨</span>
                            </div>
                            <h3 className="text-xl font-bold text-emergency-red">Emergency Helpline</h3>
                        </div>
                        <p className="text-neutral-600 mb-4">Call for immediate medical assistance</p>
                        <a
                            href="tel:112"
                            className="btn btn-emergency w-full heartbeat"
                            style={{ fontSize: '1.5rem', padding: '1rem' }}
                        >
                            📞 Call 112 Now
                        </a>
                        <p className="text-sm text-neutral-500 mt-3 text-center">
                            Available 24/7 | Response time: ~5 min
                        </p>
                    </div>

                    {/* Patient Information Card */}
                    <div className="card-medical p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="medical-icon">
                                <span>⚕️</span>
                            </div>
                            <h3 className="text-xl font-bold text-medical-teal-dark">Your Medical Info</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Full Name</p>
                                <p className="font-bold text-neutral-900">{user.name}</p>
                            </div>

                            {user.bloodGroup && (
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">Blood Group</p>
                                    <span className="patient-badge">
                                        <span>🩸</span> {user.bloodGroup}
                                    </span>
                                </div>
                            )}

                            {user.allergies && user.allergies.length > 0 && (
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">Known Allergies</p>
                                    <div className="flex flex-wrap gap-2">
                                        {user.allergies.map((allergy: string, index: number) => (
                                            <span key={index} className="badge badge-warning">
                                                ⚠️ {allergy}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(!user.bloodGroup && (!user.allergies || user.allergies.length === 0)) && (
                                <p className="text-sm text-neutral-500 italic">
                                    No medical information on file. Update your profile to add blood type and allergies.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Emergency Button */}
                {!currentRequest && (
                    <div className="text-center mb-8">
                        <button
                            onClick={handleEmergencyRequest}
                            disabled={loading || !latitude}
                            className="btn btn-emergency"
                        >
                            {loading ? '🚨 Sending Request...' : '🚨 Request Emergency Ambulance'}
                        </button>
                        {geoError && (
                            <p className="text-emergency-red mt-4">
                                ⚠️ Location error: {geoError}
                            </p>
                        )}
                    </div>
                )}

                {/* Active Request Status */}
                {currentRequest && (
                    <div className="card mb-8 p-6">
                        <h2 className="text-2xl font-bold mb-4">🚨 Active Emergency Request</h2>
                        <div className={`badge badge-${getStatusColor(currentRequest.status)} text-lg mb-4`}>
                            {getStatusText(currentRequest.status)}
                        </div>

                        {currentRequest.ambulance && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-neutral-600">Ambulance</p>
                                    <p className="font-bold">{currentRequest.ambulance.registrationNumber}</p>
                                </div>
                                <div>
                                    <p className="text-neutral-600">Driver</p>
                                    <p className="font-bold">{currentRequest.ambulance.driver.name}</p>
                                </div>
                                <div>
                                    <p className="text-neutral-600">Contact</p>
                                    <a
                                        href={`tel:${currentRequest.ambulance.phoneNumber}`}
                                        className="text-primary-blue font-bold hover:underline"
                                    >
                                        📞 Call Driver
                                    </a>
                                </div>
                                {eta && (
                                    <div>
                                        <p className="text-neutral-600">Estimated Arrival</p>
                                        <p className="font-bold text-success-green">{formatETA(eta)}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Map */}
                <div className="card p-0 overflow-hidden mb-8">
                    <div className="map-container">
                        {latitude && longitude ? (
                            <LiveMap
                                center={[latitude, longitude]}
                                userLocation={{ lat: latitude, lng: longitude }}
                                ambulances={ambulances}
                                showRoute={!!currentRequest}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="spinner"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Nearby Hospitals */}
                {hospitals.length > 0 && (
                    <div className="card p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">🏥 Nearby Hospitals</h2>
                        <div className="grid gap-4">
                            {hospitals.slice(0, 5).map((h) => (
                                <div key={h._id} className="flex justify-between items-center border-b pb-4">
                                    <div>
                                        <p className="font-bold">{h.name}</p>
                                        <p className="text-sm text-neutral-600">{h.district} • Emergency: {h.emergencyServices ? 'Yes' : 'No'}</p>
                                    </div>
                                    <div className="text-right">
                                        <a href={`tel:${h.phone}`} className="text-primary-blue font-semibold hover:underline">📞 {h.phone}</a>
                                        {h.distance != null && <p className="text-sm text-neutral-500">{formatDistance(h.distance)}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Nearby Ambulances */}
                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4">📍 Nearby Ambulances ({ambulances.length})</h2>
                    <div className="grid gap-4">
                        {ambulances.slice(0, 5).map((ambulance) => {
                            const distance = latitude && longitude
                                ? calculateDistance(latitude, longitude, ambulance.location.lat, ambulance.location.lng)
                                : 0;

                            return (
                                <div key={ambulance._id} className="flex justify-between items-center border-b pb-4">
                                    <div>
                                        <p className="font-bold">{ambulance.registrationNumber}</p>
                                        <p className="text-sm text-neutral-600">{ambulance.driver?.name ?? '—'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary-blue">{formatDistance(distance)}</p>
                                        <span className={`status-pill status-${ambulance.status}`}>
                                            <span className="status-indicator"></span>
                                            {ambulance.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
