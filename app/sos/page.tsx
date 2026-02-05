'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance, calculateETA, formatETA } from '@/lib/geolocation';
import TextToSpeech from '@/components/TextToSpeech';
import { useLanguage } from '@/components/LanguageProvider';

const LiveMap = dynamic(() => import('@/components/Map/LiveMap'), { ssr: false });

type RequestStatus = 'idle' | 'sending' | 'tracking';

export default function SOSPage() {
    const router = useRouter();
    const { latitude, longitude, error: geoError, loading: geoLoading, refreshLocation } = useGeolocation({ watch: false });
    const { language, setLanguage, t } = useLanguage();

    const [requestId, setRequestId] = useState<string | null>(null);
    const [request, setRequest] = useState<Record<string, unknown> | null>(null);
    const [status, setStatus] = useState<RequestStatus>('idle');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [isOnline, setIsOnline] = useState(true);
    const [accessibilityMode, setAccessibilityMode] = useState(false);

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        setIsOnline(navigator.onLine);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

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

        // If offline, send SMS fallback
        if (!isOnline) {
            try {
                const res = await fetch('/api/sms/send-emergency', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: guestPhone.trim(),
                        location: `${latitude}, ${longitude}`,
                        name: guestName.trim() || 'Guest',
                        message: 'Emergency ambulance request'
                    }),
                });
                const data = await res.json();
                if (res.ok) {
                    alert('SMS emergency request sent! Help is on the way.');
                } else {
                    setError('Failed to send SMS. Please try calling 108 directly.');
                }
            } catch {
                setError('Failed to send emergency request. Please call 108 directly.');
            } finally {
                setLoading(false);
            }
            return;
        }

        // Online mode - normal API call
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
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                            className="px-3 py-1 text-sm bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition"
                        >
                            {language === 'en' ? 'தமிழ்' : 'English'}
                        </button>
                        <button
                            onClick={() => setAccessibilityMode(!accessibilityMode)}
                            className={`px-3 py-1 text-sm rounded-md transition ${accessibilityMode ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            title="Text-to-Speech"
                        >
                            🔊
                        </button>
                    </div>
                </div>
            </header>

            {!isOnline && (
                <div className="bg-orange-600 text-white px-4 py-3 text-center font-medium">
                    {t('sos.offlineMode')} ⚠️
                </div>
            )}

            <div className="container mx-auto px-4 py-8 max-w-lg mx-auto">
                {status === 'idle' && (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{t('sos.title')}</h1>
                            <p className="text-neutral-600">
                                {language === 'en'
                                    ? 'One-tap ambulance request. No login required.'
                                    : 'ஒரே கிளிக்கில் ஆம்புலன்ஸ் கோரிக்கை. உள்நுழைவு தேவையில்லை.'}
                            </p>
                            {accessibilityMode && (
                                <div className="mt-4">
                                    <TextToSpeech
                                        text={language === 'en'
                                            ? 'Press the red emergency button to request an ambulance.'
                                            : 'ஆம்புலன்ஸ் கோர சிவப்பு பொத்தானை அழுத்தவும்'}
                                        language={language === 'en' ? 'en-US' : 'ta-IN'}
                                        showControls={true}
                                    />
                                </div>
                            )}
                        </div>

                        {geoLoading && (
                            <div className="card p-4 mb-4 text-center">
                                <div className="spinner mx-auto mb-2" />
                                <p>{t('sos.detectingLocation')}</p>
                            </div>
                        )}
                        {geoError && (
                            <div className="card p-4 mb-4 bg-red-50 border border-red-200">
                                <p className="text-red-700 mb-2">{geoError}</p>
                                <button type="button" onClick={refreshLocation} className="btn btn-secondary btn-sm">
                                    {language === 'en' ? 'Retry location' : 'மீண்டும் முயற்சிக்கவும்'}
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSOS} className="card p-6 space-y-4">
                            {error && (
                                <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{error}</div>
                            )}
                            <div className="form-group">
                                <label className="form-label">
                                    {language === 'en' ? 'Your name (optional)' : 'உங்கள் பெயர் (விருப்பம்)'}
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    placeholder={language === 'en' ? 'Name' : 'பெயர்'}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    {language === 'en' ? 'Phone number *' : 'தொலைபேசி எண் *'}
                                </label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={guestPhone}
                                    onChange={(e) => setGuestPhone(e.target.value)}
                                    placeholder={language === 'en' ? '10-digit mobile number' : '10 இலக்க தொலைபேசி எண்'}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !latitude || !longitude}
                                className="btn btn-emergency w-full"
                            >
                                {loading
                                    ? (language === 'en' ? 'Sending...' : 'அனுப்புகிறது...')
                                    : '🚨 ' + t('sos.requestAmbulance')}
                            </button>
                        </form>

                        <p className="text-center mt-6 text-neutral-500 text-sm">
                            <Link href="/auth/login" className="text-primary-blue hover:underline">
                                {language === 'en' ? 'Login' : 'உள்நுழைவு'}
                            </Link>
                            {language === 'en' ? ' for full tracking and history.' : ' முழு கண்காணிப்பிற்கு.'}
                        </p>
                    </>
                )}

                {status === 'tracking' && requestId && (
                    <>
                        <div className="card p-6 mb-6">
                            <h2 className="text-xl font-bold mb-2">{t('sos.requestSent')}</h2>
                            <p className="text-sm text-neutral-600 mb-4">
                                {language === 'en' ? 'Request ID:' : 'கோரிக்கை அடையாள எண்:'} <strong>{requestId}</strong>
                            </p>
                            <div className={`badge badge-${reqStatus === 'completed' ? 'success' : reqStatus === 'cancelled' ? 'danger' : 'warning'}`}>
                                {reqStatus}
                            </div>
                            {ambulance && (
                                <div className="mt-4 space-y-2">
                                    <p>
                                        <span className="text-neutral-600">
                                            {language === 'en' ? 'Ambulance:' : 'ஆம்புலன்ஸ்:'}
                                        </span> {ambulance.registrationNumber}
                                    </p>
                                    {ambulance.driver && (
                                        <p>
                                            <span className="text-neutral-600">
                                                {language === 'en' ? 'Driver:' : 'ஓட்டுநர்:'}
                                            </span> {ambulance.driver.name}
                                        </p>
                                    )}
                                    <a
                                        href={`tel:${ambulance.phoneNumber || ambulance.driver?.phone}`}
                                        className="btn btn-primary inline-block"
                                    >
                                        📞 {language === 'en' ? 'Call driver' : 'ஓட்டுநரை அழைக்கவும்'}
                                    </a>
                                    {eta != null && (
                                        <p className="text-success-green font-semibold">
                                            {language === 'en' ? 'ETA:' : 'வருகை நேரம்:'} {formatETA(eta)}
                                        </p>
                                    )}
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
                            <Link href="/" className="btn btn-outline">
                                {t('common.back')} {language === 'en' ? 'to home' : 'முகப்புக்கு'}
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
