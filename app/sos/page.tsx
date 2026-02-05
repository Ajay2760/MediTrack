'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance, calculateETA, formatETA } from '@/lib/geolocation';

const LiveMap = dynamic(() => import('@/components/Map/LiveMap'), { ssr: false });

type RequestStatus = 'idle' | 'sending' | 'tracking';

export default function SOSPage() {
    const router = useRouter();
    const { latitude, longitude, error: geoError, loading: geoLoading, refreshLocation } = useGeolocation({ watch: false });

    const [requestId, setRequestId] = useState<string | null>(null);
    const [request, setRequest] = useState<Record<string, unknown> | null>(null);
    const [status, setStatus] = useState<RequestStatus>('idle');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');

    const fetchRequest = async (id: string) => {
        try {
            const res = await fetch(`/api/emergency/${id}`);
            const data = await res.json();
            if (res.ok && data.request) {
                setRequest(data.request);
            }
        } catch {
            setError('Failed to load status');
        }
    };

    useEffect(() => {
        if (!requestId) return;
        const interval = setInterval(() => fetchRequest(requestId), 5000);
        fetchRequest(requestId);
        return () => clearInterval(interval);
    }, [requestId]);

    const handleSOS = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!latitude || !longitude) {
            setError('Location is required. Please enable location and try again.');
            return;
        }
        if (!guestPhone.trim()) {
            setError('Phone number is required for emergency contact.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/emergency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestName: guestName.trim() || 'Guest',
                    guestPhone: guestPhone.trim(),
                    pickupLocation: { lat: latitude, lng: longitude },
                    priority: 'critical',
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Request failed');

            setRequestId(data.request._id);
            setRequest(data.request);
            setStatus('tracking');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to send emergency request');
        } finally {
            setLoading(false);
        }
    };

    const reqStatus = request?.status as string | undefined;
    const ambulance = request?.ambulance as { registrationNumber?: string; driver?: { name?: string; phone?: string }; phoneNumber?: string } | undefined;
    const eta = ambulance && latitude && longitude && request?.pickupLocation
        ? calculateETA(calculateDistance(
            latitude,
            longitude,
            (request.pickupLocation as { lat: number; lng: number }).lat,
            (request.pickupLocation as { lat: number; lng: number }).lng
        ))
        : null;

    return (
        <div className="min-h-screen bg-neutral-100">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-primary-blue">🚑 MediTrack</Link>
                    <span className="text-sm text-neutral-600">Tamil Nadu Emergency</span>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-lg mx-auto">
                {status === 'idle' && (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2">SOS Emergency</h1>
                            <p className="text-neutral-600">One-tap ambulance request. No login required.</p>
                        </div>

                        {geoLoading && (
                            <div className="card p-4 mb-4 text-center">
                                <div className="spinner mx-auto mb-2" />
                                <p>Getting your location...</p>
                            </div>
                        )}
                        {geoError && (
                            <div className="card p-4 mb-4 bg-red-50 border border-red-200">
                                <p className="text-red-700 mb-2">{geoError}</p>
                                <button type="button" onClick={refreshLocation} className="btn btn-secondary btn-sm">Retry location</button>
                            </div>
                        )}

                        <form onSubmit={handleSOS} className="card p-6 space-y-4">
                            {error && (
                                <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{error}</div>
                            )}
                            <div className="form-group">
                                <label className="form-label">Your name (optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    placeholder="Name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone number *</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={guestPhone}
                                    onChange={(e) => setGuestPhone(e.target.value)}
                                    placeholder="10-digit mobile number"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !latitude || !longitude}
                                className="btn btn-emergency w-full"
                            >
                                {loading ? 'Sending...' : '🚨 Request Ambulance Now'}
                            </button>
                        </form>

                        <p className="text-center mt-6 text-neutral-500 text-sm">
                            <Link href="/auth/login" className="text-primary-blue hover:underline">Login</Link>
                            {' '}for full tracking and history.
                        </p>
                    </>
                )}

                {status === 'tracking' && requestId && (
                    <>
                        <div className="card p-6 mb-6">
                            <h2 className="text-xl font-bold mb-2">Request sent</h2>
                            <p className="text-sm text-neutral-600 mb-4">Request ID: <strong>{requestId}</strong></p>
                            <div className={`badge badge-${reqStatus === 'completed' ? 'success' : reqStatus === 'cancelled' ? 'danger' : 'warning'}`}>
                                {reqStatus}
                            </div>
                            {ambulance && (
                                <div className="mt-4 space-y-2">
                                    <p><span className="text-neutral-600">Ambulance:</span> {ambulance.registrationNumber}</p>
                                    {ambulance.driver && <p><span className="text-neutral-600">Driver:</span> {ambulance.driver.name}</p>}
                                    <a
                                        href={`tel:${ambulance.phoneNumber || ambulance.driver?.phone}`}
                                        className="btn btn-primary inline-block"
                                    >
                                        📞 Call driver
                                    </a>
                                    {eta != null && <p className="text-success-green font-semibold">ETA: {formatETA(eta)}</p>}
                                </div>
                            )}
                        </div>
                        {latitude && longitude && (
                            <div className="map-container rounded-lg overflow-hidden">
                                <LiveMap
                                    center={[latitude, longitude]}
                                    userLocation={{ lat: latitude, lng: longitude }}
                                    ambulances={ambulance && request ? [{
                                        _id: (ambulance as { _id?: string })._id || '',
                                        registrationNumber: ambulance.registrationNumber || '',
                                        location: (request.pickupLocation as { lat: number; lng: number }) || { lat: latitude, lng: longitude },
                                        status: 'on_route',
                                    }] : []}
                                    showRoute={!!ambulance}
                                />
                            </div>
                        )}
                        <div className="text-center mt-6">
                            <Link href="/" className="btn btn-outline">Back to home</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
