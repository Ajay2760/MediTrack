'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSocket } from '@/hooks/useSocket';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance, formatDistance } from '@/lib/geolocation';

const LiveMap = dynamic(() => import('@/components/Map/LiveMap'), { ssr: false });

interface EmergencyRequest {
    _id: string;
    patient?: { name: string; phone: string; bloodGroup?: string; allergies?: string[] };
    guestName?: string;
    guestPhone?: string;
    pickupLocation: { lat: number; lng: number };
    status: string;
    priority: string;
    handoverNotes?: string;
    createdAt: string;
}

export default function DriverDashboard() {
    const router = useRouter();
    const { latitude, longitude } = useGeolocation({ watch: true });
    const { isConnected, emit, on, off, authenticate } = useSocket();

    const [user, setUser] = useState<any>(null);
    const [ambulance, setAmbulance] = useState<any>(null);
    const [incomingRequests, setIncomingRequests] = useState<EmergencyRequest[]>([]);
    const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null);
    const [currentStatus, setCurrentStatus] = useState<string>('available');

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
        // Fetch ambulance data
        fetchAmbulanceData(parsedUser.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (ambulance && isConnected) {
            authenticate(user.id, 'driver', ambulance._id);
        }
    }, [ambulance, isConnected]);

    useEffect(() => {
        // Update ambulance location
        if (ambulance && latitude && longitude) {
            updateAmbulanceLocation();
        }
    }, [latitude, longitude, ambulance]);

    useEffect(() => {
        // Listen for emergency requests
        on('emergency:new', handleNewEmergency);

        return () => {
            off('emergency:new');
        };
    }, []);

    const fetchAmbulanceData = async (driverId: string) => {
        try {
            const response = await fetch(`/api/ambulances?driverId=${driverId}`);
            const data = await response.json();
            if (data.ambulances && data.ambulances.length > 0) {
                setAmbulance(data.ambulances[0]);
                setCurrentStatus(data.ambulances[0].status);
            }
        } catch (error) {
            console.error('Error fetching ambulance:', error);
        }
    };

    const updateAmbulanceLocation = async () => {
        if (!ambulance || !latitude || !longitude) return;

        try {
            await fetch(`/api/ambulances/${ambulance._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: { lat: latitude, lng: longitude },
                }),
            });

            // Broadcast location via socket
            emit('ambulance:location', {
                ambulanceId: ambulance._id,
                lat: latitude,
                lng: longitude,
                status: currentStatus,
            });
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    const handleNewEmergency = (data: any) => {
        const requestId = data.requestId || data._id;
        setIncomingRequests(prev => [...prev, { ...data, _id: requestId }]);

        // Play notification sound (optional)
        if (typeof Audio !== 'undefined') {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => { });
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            const response = await fetch(`/api/emergency/${requestId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'accepted' }),
            });

            const data = await response.json();
            setActiveRequest(data.request);
            setIncomingRequests(prev => prev.filter(req => req._id !== requestId));
            setCurrentStatus('on_route');

            // Notify via socket
            emit('emergency:accept', {
                requestId,
                ambulanceId: ambulance._id,
                driverId: user.id,
            });

            // Update ambulance status
            await fetch(`/api/ambulances/${ambulance._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'on_route' }),
            });
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleDeclineRequest = (requestId: string) => {
        setIncomingRequests(prev => prev.filter(req => req._id !== requestId));
        emit('emergency:decline', { requestId, ambulanceId: ambulance._id });
    };

    const updateRequestStatus = async (status: string) => {
        if (!activeRequest) return;

        try {
            await fetch(`/api/emergency/${activeRequest._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            setActiveRequest(prev => prev ? { ...prev, status } : null);
            emit('emergency:status', {
                requestId: activeRequest._id,
                status,
                ambulanceId: ambulance._id,
            });

            if (status === 'completed') {
                setActiveRequest(null);
                setCurrentStatus('available');
                await fetch(`/api/ambulances/${ambulance._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'available' }),
                });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (!user || !ambulance) return null;

    const distance = activeRequest && latitude && longitude
        ? calculateDistance(latitude, longitude, activeRequest.pickupLocation.lat, activeRequest.pickupLocation.lng)
        : 0;

    return (
        <div className="min-h-screen bg-neutral-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-primary-blue">🚑 Driver Dashboard</h1>
                        <p className="text-sm text-neutral-600">{ambulance.registrationNumber}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`status-pill status-${currentStatus}`}>
                            <span className="status-indicator"></span>
                            {currentStatus}
                        </span>
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
                {/* Incoming Requests */}
                {incomingRequests.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">🚨 Incoming Emergency Requests</h2>
                        {incomingRequests.map(request => {
                            const reqDistance = latitude && longitude
                                ? calculateDistance(latitude, longitude, request.pickupLocation.lat, request.pickupLocation.lng)
                                : 0;

                            const displayName = request.patient?.name || request.guestName || 'Guest';
                            const displayPhone = request.patient?.phone || request.guestPhone || '';

                            return (
                                <div key={request._id} className="card p-6 mb-4 border-l-4 border-emergency-red">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold">{displayName}</h3>
                                            <p className="text-neutral-600">{displayPhone}</p>
                                            {request.patient?.bloodGroup && (
                                                <p className="badge badge-danger mt-2">Blood: {request.patient.bloodGroup}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary-blue">{formatDistance(reqDistance)}</p>
                                            <p className="text-sm text-neutral-600">away</p>
                                        </div>
                                    </div>

                                    {request.patient?.allergies && request.patient.allergies.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-warning-amber">
                                                ⚠️ Allergies: {request.patient.allergies.join(', ')}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleAcceptRequest(request._id)}
                                            className="btn btn-success flex-1"
                                        >
                                            ✅ Accept
                                        </button>
                                        <button
                                            onClick={() => handleDeclineRequest(request._id)}
                                            className="btn btn-outline flex-1"
                                        >
                                            ❌ Decline
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Active Trip */}
                {activeRequest && (
                    <div className="card p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4">🚑 Active Trip</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-neutral-600">Patient</p>
                                <p className="font-bold text-lg">{activeRequest.patient?.name || activeRequest.guestName || 'Guest'}</p>
                                <a
                                    href={`tel:${activeRequest.patient?.phone || activeRequest.guestPhone || ''}`}
                                    className="text-primary-blue hover:underline"
                                >
                                    📞 {activeRequest.patient?.phone || activeRequest.guestPhone || 'N/A'}
                                </a>
                            </div>
                            <div>
                                <p className="text-neutral-600">Distance to Pickup</p>
                                <p className="font-bold text-2xl text-primary-blue">{formatDistance(distance)}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <button
                                onClick={() => updateRequestStatus('on_way')}
                                disabled={activeRequest.status === 'on_way'}
                                className="btn btn-primary"
                            >
                                🚗 On the Way
                            </button>
                            <button
                                onClick={() => updateRequestStatus('arrived')}
                                disabled={activeRequest.status === 'arrived'}
                                className="btn btn-primary"
                            >
                                📍 Arrived
                            </button>
                            <button
                                onClick={() => updateRequestStatus('picked')}
                                disabled={activeRequest.status === 'picked'}
                                className="btn btn-primary"
                            >
                                🏥 Patient Picked
                            </button>
                            <button
                                onClick={() => updateRequestStatus('completed')}
                                className="btn btn-success"
                            >
                                ✅ Completed
                            </button>
                        </div>

                        <div className={`badge badge-${activeRequest.status === 'completed' ? 'success' : 'primary'} text-lg mb-4`}>
                            Status: {activeRequest.status}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Handover notes for hospital</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Patient condition, vital signs, treatment given..."
                                value={activeRequest.handoverNotes || ''}
                                onChange={(e) => {
                                    const notes = e.target.value;
                                    setActiveRequest(prev => prev ? { ...prev, handoverNotes: notes } : null);
                                    fetch(`/api/emergency/${activeRequest._id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ handoverNotes: notes }),
                                    }).catch(() => { });
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Map */}
                <div className="card p-0 overflow-hidden">
                    <div className="map-container">
                        {latitude && longitude ? (
                            <LiveMap
                                center={[latitude, longitude]}
                                userLocation={{ lat: latitude, lng: longitude }}
                                ambulances={[
                                    {
                                        _id: ambulance._id,
                                        registrationNumber: ambulance.registrationNumber,
                                        location: { lat: latitude, lng: longitude },
                                        status: currentStatus,
                                    },
                                ]}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="spinner"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
